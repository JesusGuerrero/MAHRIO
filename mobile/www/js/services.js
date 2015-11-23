angular.module('starter.services', [])
  .factory('Util', function( _ ){
    var api = {
      populateAll: function( resource, attributes ){
        var _resources = [];
        _.each( resource, function(res){
          var _res = res;
          for( var key in attributes){
            _res[  key ] = attributes[key]( _res );
          }
          _resources.push( _res );
        });
        return _resources;
      }
    };
    return api;
  })
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
  .factory('Articles', function(_, Util, Sections){
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
      get: function(articleIds) {
        var allArticles = Util.populateAll( articles, {sections: api.getSections });
        // get all
        if( typeof articleIds === 'undefined') { return allArticles; }
        // get all that belong to network through articleIds
        if( _.isArray(articleIds) ){
          return _.filter(allArticles, function(article){
            return _.contains(articleIds, String(article.id) )
          });
        }
        // get one
        return _.find( allArticles, function(article){ return articleIds == article.id; });
      },
      getSections: function( article ) {
        return _.indexBy( Sections.get( Object.keys( article.sections) ), 'id');
      }
    };
    return api;
  })
  .factory('Networks', function( _, Util, Articles, Users ){
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
    }];

    var api = {
      join: function( networkId, memberId ){
        var network = api.get( networkId );
        network.members[ memberId ] = null;
        Users.addNetwork( networkId );
      },
      leave: function( networkId, memberId ){
        delete networks[ networkId ].members[ memberId ];
        Users.removeNetwork( networkId );
      },
      get: function(networkIds, inverse) {
        var allNetworks = Util.populateAll( networks, {articles: api.getArticles });
        // get all
        if( typeof networkIds === 'undefined') { return allNetworks; }
        // get all that belong to network through articleIds
        if( _.isArray(networkIds) ){
          var list = _.filter(allNetworks, function(network){
            return !inverse ? _.contains(networkIds, network.id) : !_.contains(networkIds, network.id);
          });
          return _.indexBy( list, 'id');
        }
        // get one
        return _.find( allNetworks, function(network){ return networkIds == network.id; });
      },
      getArticles: function( network ) {
        return _.indexBy( Articles.get( Object.keys( network.articles ) ), 'id' );
      },
      //get: function(networkId) {
      //  var allNetworks = api.all(), saveNetwork = null;
      //  _.each( allNetworks, function(network){
      //    if( network.id == networkId ) {
      //      saveNetwork = network;
      //    }
      //  });
      //  return saveNetwork;
      //},
      //all: function(){
      //  var _networks = [];
      //  _.each( networks, function(network){
      //    var _network = network,
      //      articles = Articles.get( Object.keys(_network.articles));
      //    _network.articles = _.indexBy( articles, 'id');
      //
      //    _networks.push( _network );
      //  });
      //  return _.indexBy( _networks, 'id');
      //},
      //getArticles: function( networkId, articleId ){
      //  var network = api.get(networkId);
      //  if( network && network.articles ) {
      //    if( articleId ) {
      //      var articles = _.indexBy( network.articles, 'id');
      //      return articles[ articleId ];
      //    } else {
      //      return network.articles;
      //    }
      //  } else {
      //    return [];
      //  }
      //},
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
      getEvents: function( networkId, eventId ){
        var network = this.get(networkId);
        if( network && network.events ) {
          if( eventId ) {
            return  _.findById( network.events, eventId);
          } else {
            return network.events;
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
      },
      getMembers: function( networkId, memberId ){
        var network = this.get(networkId);
        if( network && network.members ) {
          if( memberId ) {
            return  _.findById( network.members, memberId);
          } else {
            return network.members;
          }
        } else {
          return [];
        }
      }
    };
    return api;
  })
  .factory('Chats', function(Users, Messages, _) {
    // Might use a resource here that returns a JSON array

    // Some fake testing data
    var chats = [{
      id: 1,
      members: {
        '1': null,
        '2': null
      },
      messages: {
        '1': null,
        '3': null
      }
    }, {
      id: 2,
      members: {
        '1': null,
        '3': null
      },
      messages: {
        '2': null,
        '4': null
      }
    }], counter = 3;

    var api = {
      all: function() {
        var _chats = [], currentUser = Users.getCurrent();
        _.each( _.filter( chats, function(chat){ return chat.members.hasOwnProperty( currentUser.id ); }), function(chat){
          var _chat = chat,
            members = Users.getUsers( Object.keys(_chat.members)),
            messages = Messages.getMessages( _chat.id );
          _chat.members = _.indexBy( members, 'id');
          _chat.messages = _.indexBy( messages, 'id');
          _chat.lastMessage = _.filter( _chat.messages, function(msg, key) { return !key; })[0];
          _chat.otherMember = _.filter( _chat.members, function(usr){ return currentUser.id !== usr.id; })[0];
          _chats.push( _chat );
        });
        return _.indexBy( _chats, 'id');
      },
      remove: function(chatId) {
        var obj = _.where( chats, {id: chatId});
        if( obj ) {
          chats.splice(chats.indexOf( obj[0] ), 1);
          return true;
        }
        return false;
      },
      get: function(chatId) {
        var allChats = api.all(), saveChat = null;
        _.each( allChats, function(chat){
          console.log( chat.id, chatId );
          if( chat.id == chatId ) {
            saveChat = chat;
          }
        });
        return saveChat;
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
      }
    };
    return api;
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
      provisionModal: function( $scope, url ){
        currentModal = $ionicModal.fromTemplateUrl(url, {
          animation: 'slide-in-up',
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
  .factory('Users', function($localstorage){
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
    }], currentUser = null;

    return {
      addNetwork: function(networkId){
        currentUser.networks.push( networkId );
      },
      removeNetwork: function(networkId){
        currentUser.networks.splice( currentUser.networks.indexOf(networkId), 1);
      },
      getUsers: function( chatIds ) {
        return _.filter( users, function(user) { return _.indexOf(chatIds, String(user.id)) !== -1; });
      },
      getXother: function(){
        return _.filter( users, function(user) { return user.id !== currentUser.id; });
      },
      login: function(email){
        var current = _.findWhere( users, {email: email});
        if( current ) {
          currentUser = current;
          $localstorage.setObject( 'currentUser', currentUser );
          return true;
        } else {
          return false;
        }
      },
      logout: function(){
        $localstorage.setObject( 'currentUser', null );
      },
      getCurrent: function(){
        return currentUser;
      },
      checkLoggedIn: function(){
        var user = $localstorage.getObject( 'currentUser' );
        if( user && user.id ) {
          currentUser = user;
          return true;
        }
        return false;
      }
    }
  });
