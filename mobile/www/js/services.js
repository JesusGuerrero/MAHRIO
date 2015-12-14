angular.module('starter.services', [])
  .factory('Socket', function( $rootScope, proxy, Notification ) {
    var socket = io( proxy.url );
    var fetchAllNotifications = function( callback ){
      Notification.fetchAll().then( function(count){
        if( count ){
          $rootScope.$broadcast('event:chat:badge');
        }
        if( typeof callback == 'function'){
          callback();
        }
      });
    };
    return {
      get: socket,
      watchNotificationEvents: function( userId, callback ){
        socket.on('event:notification:chat:'+userId, function(){
          console.log('i reveceive chat notice');
          fetchAllNotifications();
        });
        fetchAllNotifications( callback );
      }
    };
  })
  .factory('Camera', ['$q','Media', function($q, Media) {

    return {
      getPicture: function(media, options) {
        var defer = $q.defer();

        navigator.camera.getPicture(function(imagePath) {
          Media.getKey( media, imagePath).then( function(res){
            defer.resolve(res);
          });
        }, function(err) {
          defer.reject(err);
        }, options);

        return defer.promise;
      }
    }
  }])
  .factory('$localstorage', function($window) {
    return {
      set: function(key, value) {
        $window.localStorage[key] = value;
      },
      get: function(key, defaultValue) {
        return $window.localStorage[key] || defaultValue;
      },
      setObject: function(key, value) {
        $window.localStorage[key] = JSON.stringify(value);
      },
      getObject: function(key) {
        return JSON.parse($window.localStorage[key] || '{}');
      }
    }
  })
  .factory('Articles', function(_, $http, proxy, Sections){
    var articles = [{
        id: 1,
        title: 'Birth Story',
        deck: 'Discover events of Oct. 27, 2015',
        cover: 'img/articles/1/birth-story.png',
        sections: {
          '1': null,
          '5': null
        }
      },{
        id: 2,
        title: 'First Week',
        deck: 'Our sweet bundle of joy!',
        cover: 'img/articles/2/first-week.png',
        sections: {
          '2': null
        }
      },{
        id: 3,
        title: 'First Video',
        deck: 'First video shot',
        cover: 'video/articles/3/first-video.mpg',
        sections: {
          '3': null,
          '4': null
        }
    }];
    var api = {
      get: function( networkId ) {
        return $http.get( proxy.url + '/api/articles?networkId=' + networkId);
      },
      getSections: function( article ) {
        return _.indexBy( Sections.get( Object.keys( article.sections) ), 'id');
      }
    };
    return api;
  })
  .factory('Events', function( _, $http, proxy) {
    var api = {
      get: function( networkId ) {
        return $http.get(proxy.url + '/api/events?networkId=' + networkId);
      }
    };

    return api;
  })
  .factory('Networks', function( _, Articles, Events, Users, $http, proxy, $q ){
    var networks = [{
        id: 1,
        title: 'Viviana Jade Rocha',
        deck: 'Born 10/27/2015 @ 21:39',
        cover: 'img/networks/1/viviana-network.png',
        coverFull: 'img/networks/1/viviana-coverFull.png',
        articles: {
          '1': null,
          '2': null,
          '3': null
        },
        boards: {},
        events: {},
        hardware: {},
        members: {}
      },{
        id: 2,
        title: 'MAHRIO',
        deck: 'Born 03/16/2015 @ 20:30',
        cover: 'img/networks/2/mahrio-network.png',
        coverFull: 'img/networks/2/mahrio-coverFull.png',
        articles: {},
        boards: {},
        events: {},
        hardware: {},
        members: {}
      },{
        id: 3,
        title: 'The Flamingo',
        deck: 'Est. 05/29/2015 @ 13:15',
        cover: 'img/networks/3/the-flamingo-network.png',
        coverFull: 'img/networks/3/the-flamingo-coverFull.png',
        articles: {},
        boards: {},
        events: {},
        hardware: {},
        members: {}
      },{
        id: 4,
        title: 'Swedish Cadillac',
        deck: 'Est. 10/10/2015 @ 09:30',
        cover: 'img/networks/4/swedish-cadillac-network.png',
        coverFull: 'img/networks/5/swedish-cadillac-coverFull.png',
        articles: {},
        boards: {},
        events: {},
        hardware: {},
        members: {}
      },{
        id: 5,
        title: 'Finance',
        deck: 'Est. 08/24/2015 @ 13:00',
        cover: 'img/networks/5/finance-network.png',
        coverFull: 'img/networks/5/finance-coverFull.png',
        articles: {},
        boards: {},
        events: {},
        hardware: {},
        members: {}
    }], articles = null, events = null, members = null;

    var api = {
      join: function( network ){
        var defer = $q.defer();

        $http.put( proxy.url+'/api/networks/'+ network._id + '/join').then( function(res){
          Users.addNetwork( network );
          defer.resolve();
        }, function(){
          defer.reject();
        });

        return defer.promise;
      },
      leave: function( network ){
        var defer = $q.defer();

        $http.put( proxy.url+'/api/networks/'+ network._id + '/leave').then( function(res){
          Users.removeNetwork( network );
          defer.resolve();
        }, function(){
          defer.reject();
        });

        return defer.promise;

        var network = api.get( networkId );
        delete network.members[ memberId ];
        Users.removeNetwork( networkId );
      },
      get: function(){
        var defer = $q.defer();

        $http.get( proxy.url+'/api/networks').then( function(res){
          networks = res.data.networks;
          defer.resolve(networks);
        }, function(){
          defer.reject();
        });

        return defer.promise;
      },
      getOne: function(networkId){
        return _.find( networks, function(network) { return network._id === networkId; });
      },
      getAll: function() {
        return $http.get( proxy.url+'/api/networks');
      },
      getArticles: function( networkId ) {
        var defer = $q.defer();

        Articles.get( api.getOne(networkId)._id ).then( function(res){
          articles = _.indexBy( res.data.articles, '_id');
          defer.resolve( articles );
        }, function(){
          defer.reject();
        });

        return defer.promise;
      },
      getArticle: function( articleId ) {
        return articles[ articleId ];
      },
      getMembers: function( networkId ) {
        var defer = $q.defer();

        Users.getFromNetwork( Object.keys( api.getOne(networkId).members ) ).then( function(users){
          members = _.indexBy( users, '_id');
          defer.resolve( members );
        }, function(){
          defer.reject();
        });

        return defer.promise;
      },
      getMember: function( memberId ) {
        return members[ memberId ];
      },
      getEvents: function( networkId ) {
        var defer = $q.defer();

        Events.get( api.getOne( networkId )._id ).then( function(res) {
          events = _.indexBy(res.data.events, '_id');
          defer.resolve( events );
        }, function(){
          defer.reject();
        });

        return defer.promise;
      },
      getEvent: function( eventId ) {
        return events[ eventId ];
      },
      getBoards: function( networkId, boardId ){
        var network = this.get(networkId);
        if( network && network.boards ) {
          if( boardId ) {
            return  _.findById( network.boards, boardId);
          } else {
            return network.boards;
          }
        } else {
          return [];
        }
      },
      getHardware: function( networkId, hardwareId ){
        var network = this.get(networkId);
        if( network && network.hardware ) {
          if( hardwareId ) {
            return  _.findById( network.events, hardwareId);
          } else {
            return network.hardware;
          }
        } else {
          return [];
        }
      }
    };
    return api;
  })
  .factory('Chats', function( _, $http, $q, proxy, Users, Notification ) {
    // Might use a resource here that returns a JSON array

    // Some fake testing data
    //var chats = [{
    //  id: 1,
    //  members: {
    //    '1': null,
    //    '2': null
    //  },
    //  messages: {
    //    '1': null,
    //    '3': null
    //  }
    //}, {
    //  id: 2,
    //  members: {
    //    '1': null,
    //    '3': null
    //  },
    //  messages: {
    //    '2': null,
    //    '4': null
    //  }
    //}], counter = 3;
    var chats = {};

    var api = {
      all: function() {
        var defer = $q.defer();

        $http.get( proxy.url + '/api/chats/conversations').then( function(res) {
          _.map( res.data.conversations, function(chat){
            chat.otherMember = Users.getXother( chat.members )[0];
            chat.lastMessage = chat.messages[ 0 ];
            return chat;
          });
          chats = _.indexBy( res.data.conversations, '_id' );
          for( var chat in Notification.getChatNotifications() ) {
            if( chats.hasOwnProperty(chat) ){
              chats[ chat ].isNew = true;
            }
          }
          defer.resolve( chats );
        }, function(){
          defer.reject();
        });

        return defer.promise;
      },
      remove: function(chatId) {
        var obj = _.where( chats, {id: chatId});
        if( obj ) {
          chats.splice(chats.indexOf( obj[0] ), 1);
          return true;
        }
        return false;
      },
      getOne: function(chatId) {
        return chats[ chatId ];
      },
      add: function( members, messages ) {
        var chatObj = {id: counter, members: {}, messages: messages, created: new Date() };
        _.each( members, function(member){

          chatObj.members[ member+'' ] = null;
        });
        chats.push( chatObj );
        counter++;
        return chatObj;
      },
      updateMessages: function( chatId, msgId) {
        var obj = _.where( chats, {id: chatId});
        if( obj ) {
          var index = chats.indexOf( obj[0] );
          chats[ index ].messages[ msgId ] = null;
        }
      },
      sendMessage: function( chatId, users, msg ) {
        var defer = $q.defer();

        $http.post( proxy.url+'/api/chats/messages/private?conversationId='+chatId, {message: {content: msg}, users: users} )
          .then( function(res) {
            chats[ chatId].messages[ res.data.message._id ] = res.data.message;
            defer.resolve( res.data.message );
          }, function(){
            defer.reject();
          });

        return defer.promise;
      },
      startConversation: function( members, msg ){
        var defer = $q.defer();

        var payload = {
          conversation: {
            members: members,
            message: {
              content: msg
            }
          }
        };
        $http.post(proxy.url+'/api/chats/conversations/private', payload).then( function(res) {
          res.data.conversation.otherMember = Users.getXother( res.data.conversation.members )[0];
          res.data.conversation.lastMessage = res.data.conversation.messages[ 0 ];
          chats[ res.data.conversation._id ] = res.data.conversation;
          defer.resolve( chats );
        }, function(){
          defer.reject();
        });

        return defer.promise;
      }
    };
    return api;
  })
  .factory('Notification', function($http, proxy, $q){
    var chat = false, noticeRemoved = false, notifications = {
      chat: {}
    };
    return {
      getChat: function(){ return chat; },
      resetChat: function(){ chat = false; },
      fetchAll: function(){
        var defer = $q.defer();
        $http.get( proxy.url + '/api/notifications').then( function(res) {
          if( res.data.notifications.chat ) {
            notifications.chat = res.data.notifications.chat;
            chat = Object.keys( notifications.chat ).length;
          }
          defer.resolve( chat );
        }, function(){
          defer.reject();
        });
        return defer.promise;
      },
      ifHasChatRemove: function(id){
        if( notifications.chat.hasOwnProperty( id ) ) {
          $http.delete( proxy.url + '/api/notifications/chat?id='+id);
          console.log('removing notice from server');
          delete notifications.chat[ id ];
          chat = Object.keys( notifications.chat).length ? Object.keys( notifications.chat).length : false;
          noticeRemoved = true;
        }
      },
      wasRemoved: function(){
        if( noticeRemoved ) {
          noticeRemoved = false;
          return true;
        }
        return false;
      },
      getChatNotifications: function(){
        return notifications.chat;
      }
    };
  })
  .factory('Messages', function( _ ){
    var messages = [{
      id: 1,
      content: 'Hey!',
      _user: 1,
      _chat: 1,
      created: new Date('06/16/2015 3:10 PM')
    },{
      id: 2,
      content: 'Check this out, http://mahr.io',
      _user: 1,
      _chat: 2,
      created: new Date('06/16/2015 3:11 PM')
    },{
      id: 3,
      content: 'ETA?',
      _user: 2,
      _chat: 1,
      created: new Date('09/29/2015 3:36 PM')
    },{
      id: 4,
      content: 'Cool!',
      _user: 3,
      _chat: 2,
      created: new Date('09/29/2015 3:40 PM')
    }], counter = 5;
    return {
      all: function() {
        return messages;
      },
      remove: function(message) {
        messages.splice(messages.indexOf(message), 1);
      },
      getMessages: function( chatId ) {
        return _.filter( messages, function(message) { return message._chat === chatId; });
      },
      add: function( chatId, userId, message ) {
        var msgObj = {id: counter, content: message, _user: userId, _chat: chatId, created: new Date() };
        messages.push( msgObj );
        counter++;
        return msgObj;
      },
      updateChat: function( msgId, chatId ) {
        var obj = _.where( messages, {id: msgId});
        if( obj ) {
          var index = messages.indexOf( obj[0] );
          messages[ index ]._chat = chatId;
        }
      }
    };
  })
  .factory('Modal', function($ionicModal){
    var currentModal = null;
    return {
      provisionModal: function( $scope, url, anim ){
        currentModal = $ionicModal.fromTemplateUrl(url, {
          animation: anim || 'slide-in-up',
          scope: $scope
        });
        return currentModal;
      }
    };
  })
  .factory('Sections', function( _ ){
    var sections = [{
        id: 1,
        body: 'Vivamus mollis fringilla mauris pharetra rutrum. Cras maximus sapien turpis, sed finibus enim porta sed. Phasellus faucibus justo sem, sit amet ultrices sem condimentum quis. In gravida ut mauris nec scelerisque. Maecenas eu consectetur urna. Cras vitae tellus posuere, blandit diam vel, suscipit dolor. Maecenas scelerisque pretium est non fringilla. Donec suscipit enim lorem, vel eleifend ex dapibus at.'
      },{
        id: 2,
        body: 'Nullam euismod purus urna, vitae rutrum purus suscipit consectetur. Sed ac lobortis quam. Vivamus ac sagittis orci, eget luctus nisi. Pellentesque porta leo quis iaculis ultrices. Nullam convallis velit sit amet lorem vehicula rutrum vel eu lorem. Vivamus scelerisque eleifend dolor vel facilisis. Nunc eleifend non elit in venenatis.'
      },{
        id: 3,
        body: 'Transcript 1'
      },{
        id: 4,
        body: 'Transcript 2'
      },{
        id: 5,
        body: 'Transcript 3'
    }];

    var api = {
      get: function( sectionIds ) {
        if( _.isArray(sectionIds) ) {
          return _.filter(sections, function(section){
            return _.contains(sectionIds, String(section.id))
          });
        }
        return [];
      }
    };
    return api;
  })
  .service('proxy', function(APP_IP){
    this.url = APP_IP;
  })
  .factory('Media', function($http, $q, proxy, Users){
    return {
      getKey: function( media, file ) {
        var defer = $q.defer();
        media.filename = file.split('/').pop();
        $http({
            url: proxy.url+'/api/media/key',
            method: 'GET',
            params: media,
            headers : {
              'x-amz-acl': 'public-read'
            }
          }).then( function(res){
            var ft = new FileTransfer();
            var options = new FileUploadOptions();
            options.mimeType = 'image/jpeg';
            options.httpMethod = 'PUT';
            options.filename = media.filename;
            options.headers = {
              'x-amz-acl': 'public-read',
              'Content-Type': 'image/jpeg'
            };
            ft.upload(file, res.data.signedRequest, function(){
              delete media.id;
              delete media.object;
              media.type = 'image/jpeg';
              media.url = res.data.url;
              window.resolveLocalFileSystemURI(file, function(fileEntry) {
                fileEntry.file(function(fileObj) {
                  media.size = fileObj.size;
                  Users.addAvatar( media )
                    .then( function(){
                      defer.resolve({url: res.data.url});
                    }, function(){
                      defer.reject();
                    });
                });
              });
            }, function(){
              defer.reject();
            }, options);
          }, function(){
            defer.reject();
          });
        return defer.promise;
      }
    }
  })
  .factory('Users', function($localstorage, proxy, $http, $q, $timeout, Socket ){
    var users = [{
      id: 1,
      email: 'jesus.rocha@whichdegree.co',
      password: '1234',
      profile: {
        firstName: 'Jesus',
        lastName: 'Rocha'
      },
      face: 'img/users/1/user-profile.jpg',
      networks: [1, 2, 3, 4, 5]
    }, {
      id: 2,
      email: 'aida.hurtado@whichdegree.co',
      password: '1234',
      profile: {
        firstName: 'Aida',
        lastName: 'Hurtado'
      },
      face: 'img/users/3/user-profile.jpg',
      networks: [1, 2]
    }, {
      id: 3,
      email: 'emcp@whichdegree.co',
      password: '1234',
      profile: {
        firstName: 'Erik',
        lastName: 'Peterson'
      },
      face: 'img/users/2/user-profile.jpg',
      networks: [2]
    }], currentUser = null, counter = 4, currentLock = false;

    var processAuthenticatedUser = function( res, defer ){
      $http.defaults.headers.common.Authorization = res.headers('Authorization');
      $localstorage.set( 'Authorization', res.headers('Authorization') );
      api.getCurrent().then( function( user ){
        currentUser = user;
        Socket.watchNotificationEvents( currentUser._id, function(){
          defer.resolve( user );
        });
      }, function(){
        defer.reject();
      });
    };
    var api = {
      addNetwork: function( network ){
        network.members = network.members || {};
        network.members[ currentUser._id ] = null;
        currentUser.networks.push( network );
        $localstorage.setObject( 'currentUser', currentUser );
      },
      removeNetwork: function( network ){
        delete network.members[ currentUser._id ];
        currentUser.networks.splice( currentUser.networks.indexOf(network), 1);
        $localstorage.setObject( 'currentUser', currentUser );
      },
      //getUsers: function( chatIds ) {
      //  return _.filter( users, function(user) { return _.indexOf(chatIds, String(user.id)) !== -1; });
      //},
      getXother: function(users){
        return _.filter( users, function(user) { return user._id !== currentUser._id; });
      },
      login: function( user ){
        var defer = $q.defer();
        $http.post(proxy.url + '/api/session/login', user)
          .then( function(res){
            processAuthenticatedUser( res, defer );
          }, function(){ defer.reject(); });
        return defer.promise;
      },
      register: function( user ) {
        var obj = {
          email: user.email,
          password: user.password,
          profile: {
            firstName: user.firstName,
            lastName: user.lastName
          }
        };
        var defer = $q.defer();
        $http.post(proxy.url + '/api/users/register', obj)
          .then( function(res){
            processAuthenticatedUser( res, defer );
          }, function(){ defer.reject(); });
        return defer.promise;
      },
      logout: function(){
        $localstorage.set('Authorization', null);
        $localstorage.setObject( 'currentUser', null );
        delete $http.defaults.headers.common.Authorization;
        currentUser = null;
      },
      addAvatar: function( media ){
        var defer = $q.defer();
        $http.post( proxy.url + '/api/users/avatar', {media: media}).then( function(res){
          currentUser.avatarImage = {
            url: res.url
          };
          defer.resolve();
        });
        return defer.promise;
      },
      getCurrent: function(){
        if( !currentLock ) {
          var defer = $q.defer();
          currentLock = defer;

          $timeout( function(){
            if( typeof $http.defaults.headers.common.Authorization === 'undefined' ) {
              if( $localstorage.get('Authorization', 'null') !== 'null' ) {
                $http.defaults.headers.common.Authorization = $localstorage.get('Authorization');
                $http.get(proxy.url + '/api/users/me').then( function(res){
                  currentUser = res.data.user;
                  $localstorage.setObject( 'currentUser', currentUser );
                  currentLock = false;
                  defer.resolve( currentUser );
                }, function() {
                  currentLock = false;
                  api.logout();
                  defer.reject();
                });
              } else {
                currentLock = false; defer.reject();
              }
            } else {
              $http.get(proxy.url + '/api/users/me').then( function(res){
                currentUser = res.data.user;
                $localstorage.setObject( 'currentUser', currentUser );
                currentLock = false;
                defer.resolve( currentUser );
              }, function() { currentLock = false; defer.reject(); });
            }
          }, 100);

          return defer.promise;
        } else {
          return currentLock.promise;
        }
      },
      getCurrentUser: function(){
        return currentUser;
      },
      getCurrentId: function(){
        return currentUser._id;
      },
      hasCurrent: function() { return currentUser !== null; },
      getNetworks: function(){
        return _.indexBy( currentUser.networks, '_id');
      },
      getOneNetwork: function( networkId ){
        return _.find( currentUser.networks, function(network){ return network._id === networkId; });
      },
      getAll: function(){
        return $http.get( proxy.url + '/api/users/all');
      },
      getFromNetwork: function( userIds ){
        var defer = $q.defer();

        api.getAll().then( function(res){
            defer.resolve(_.filter(res.data.users, function(user){ return _.contains(userIds, user._id); }));
          }, function(){
            defer.reject();
          });

        return defer.promise;
      }
    };
    return api;
  });
