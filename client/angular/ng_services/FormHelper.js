angular.module('baseApp.services')
  .service('FormHelper', ['$http', 'currentUser', '_',
    function($http, currentUser, _) {
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

      this.setupFormHelper = function( $scope, resource ) {
        $scope.selectUser = function($item, hash, single ) {
          $scope[resource][ hash ] = selectedItem( $item, $scope[resource][ hash ], single );
          $scope.has[ hash ] = true;
          $scope.$broadcast('clearInput');
        };
        $scope.removeUser = function( id, entity ) {
          $scope.has[entity] = remove( id, $scope[resource], entity );
        };
        $scope.getUsers = getUsers;
      };

      return this;
    }]);