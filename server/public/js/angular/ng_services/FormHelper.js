angular.module('baseApp.services')
  .service('FormHelper', ['$http', 'currentUser', '_','$q','Media',
    function($http, currentUser, _, $q, Media) {
      'use strict';


      var usersCache = [],
        current = currentUser.get(),
        findUser = function ( $item ){
          var extracted = $item.match(/(.*?)&lt;(.*?)&gt;/),
            selection = _.find( usersCache, function(user){ return user.email === extracted[2]; });
          return selection;
        };

      var getUsers = function(val) {
        return $http.get('/api/autocomplete/users', {
          params: {
            q: val
          }
        }).then(function(response){
          usersCache = response.data.users;
          var filteredUserList =  _
              .filter( response.data.users, function(user){
                return user.email !== current.email;
              });
          return filteredUserList.map(function(user){
            return (user.profile.firstName ? user.profile.firstName : '') + ' ' + (user.profile.lastName ?user.profile.lastName:'') + ' &lt;'+user.email+'&gt;';
          });
        });
      };
      var selectedItem = function( $item, EntityObject, oneOnly ) {
        var selection;
        if( typeof $item === 'undefined' || $item === null ) {
          selection = current;
        } else {
          selection = findUser( $item );
        }
        var addObject = {
          _id: selection._id,
          email: selection.email,
          profile: {
            firstName: selection.profile.firstName,
            lastName: selection.profile.lastName
          }
        };
        if( oneOnly ) {
          EntityObject = addObject;
        } else {
          EntityObject[ selection._id ] = addObject;
        }

        return EntityObject;
      };
      var remove = function( id, entity, hash ) {
        if( id === null ) {
          entity[ hash ] = {};
          return 0;
        } else {
          delete entity[ hash ][ id ];
          return Object.keys( entity[ hash ]).length;
        }
      };

      this.setupFormHelper = function( $scope, resource, media ) {
        $scope.selectUser = function($item, hash, single ) {
          $scope[resource][ hash ] = selectedItem( $item, $scope[resource][ hash ], single );
          $scope.has[ hash ] = true;
          $scope.$broadcast('clearInput');
        };
        $scope.removeUser = function( id, entity ) {
          $scope.has[entity] = remove( id, $scope[resource], entity );
        };
        $scope.getUsers = getUsers;

        if( media ) {
          $scope.mediaActions = {
            upload: function( mediaDetails, file ){
              var defer = $q.defer();
              mediaDetails.object = resource + 's';
              Media.getKey( mediaDetails )
                .then( function(res) {
                  $http({
                    url: res.signedRequest,
                    method: 'PUT',
                    data: file,
                    transformRequest: angular.identity,
                    headers: { 'x-amz-acl': 'public-read', 'Authorization': undefined, 'Content-Type': undefined }
                  }).then( function(){
                    mediaDetails.url = res.url;
                    media.addCoverImage( {_id: $scope[resource]._id}, mediaDetails )
                      .then( function(res){
                        if( $scope[resource].media ) {
                          $scope[resource].media.push( res.media );
                        } else {
                          $scope[resource].media = [ res.media ];
                        }
                        defer.resolve({url: res.media.url});
                      }, function(){
                        defer.reject();
                      });
                  }, function(){
                    defer.reject();
                  });
                }, function(){
                  defer.reject();
                });
              return defer.promise;
            }
          };
        }
      };
      this.setupArticleForm = function( scope ) {
        scope.addSection = function( section ){
          scope.article.sections.push( {body: section} );
        };
        scope.editSection = function( index ) {
          scope.article.sections[ index].edit = true;
        };
        scope.saveSection = function( index ) {
          delete scope.article.sections[ index].edit;
        };
        scope.sortSections = function( ){
          scope.sortableOptions = {
            disabled: false
          };
          scope.sortingSections = true;
        };
        scope.stopSorting = function(){
          scope.sortableOptions = {
            disabled: true
          };
          scope.sortingSections = false;
        };
        scope.removeSection = function( index ) {
          scope.article.sections.splice( index, 1);
        };
        scope.addWidget = function( widget ){
          scope.article.widgets.push( widget );
        };
        scope.editWidget = function( index ) {
          scope.article.widgets[ index].edit = true;
        };
        scope.saveWidget = function( index ){
          delete scope.article.widgets[ index].edit;
        };
        scope.removeWidget = function( index ) {
          scope.article.widgets.splice( index, 1);
        };
      };

      return this;
    }]);