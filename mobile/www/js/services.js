angular.module('starter.services', [])
  .factory( '__', function(){
    return {
      findById: function( collection, id ) {
        for (var i = 0; i < collection.length; i++) {
          if (collection[i].id === parseInt(id)) {
            return collection[i];
          }
        }
        return false;
      }
    }
  })
  .factory('Articles', function( _ ) {
    var articles = [

    ];
    return {
      get: function( networkId ) {}
    };
  })
  .factory('Networks', function( APP_IP, $http, __ ){
    var networks = [{
        id: 1,
        title: 'Viviana Jade Rocha',
        deck: 'Born 10/27/2015 @ 21:39',
        cover: 'img/networks/1/viviana-network.png',
        coverFull: 'img/networks/1/viviana-coverFull.png',
        articles: [{
          id: 1,
          title: 'Birth Story',
          deck: 'Discover events of Oct. 27, 2015',
          cover: 'img/articles/1/birth-story.png',
          sections: ['<h1>Heading</h1>','<p>Hello World</p>','Goodbye World']
        }],
        boards: [{
          id: 1,
          name: 'Todo'
        }]
      },{
        id: 2,
        title: 'MAHRIO',
        deck: 'Born 03/16/2015 @ 20:30',
        cover: 'img/networks/2/mahrio-network.png',
        coverFull: 'img/networks/2/mahrio-coverFull.png'
      },{
        id: 3,
        title: 'The Flamingo',
        deck: 'Est. 05/29/2015 @ 13:15',
        cover: 'img/networks/3/the-flamingo-network.png',
        coverFull: 'img/networks/3/the-flamingo-coverFull.png'
      },{
        id: 4,
        title: 'Swedish Cadillac',
        deck: 'Est. 10/10/2015 @ 09:30',
        cover: 'img/networks/4/swedish-cadillac-network.png',
        coverFull: 'img/networks/5/swedish-cadillac-coverFull.png'
      },{
        id: 5,
        title: 'Finance',
        deck: 'Est. 08/24/2015 @ 13:00',
        cover: 'img/networks/5/finance-network.png',
        coverFull: 'img/networks/5/finance-coverFull.png'
    }];

    return {

      get: function(networkId) {
        return _.where( networks, {id: networkId})[0];
      },
      all: function(){
        return networks;
      },
      getArticles: function( networkId, articleId ){
        var network = this.get(networkId);
        if( network && network.articles ) {
          if( articleId ) {
            return  _.findById( network.articles, articleId);
          } else {
            return network.articles;
          }
        } else {
          return [];
        }
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
      }
    }
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
        var _chats = [], currentUser = Users.currentUser;
        _.each( chats, function(chat){
          var _chat = chat,
            members = Users.getUsers( Object.keys(_chat.members)),
            messages = Messages.getMessages( _chat.id );
          _chat.members = _.indexBy( members, 'id');
          _chat.messages = _.indexBy( messages, 'id');
          _chat.lastMessage = _.filter( _chat.messages, function(msg, key) { return !key; })[0];
          _chat.otherMember = _.filter( _chat.members, function(usr, key){ return currentUser.id == key; })[0];
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
    return {
      provisionModal: function( $scope, url ){
        return $ionicModal.fromTemplateUrl(url, {
          animation: 'slide-in-up',
          scope: $scope
        });
      }
    };
  })
  .factory('Users', function(){
    var users = [{
      id: 1,
      email: 'jesus.rocha@whichdegree.co',
      profile: {
        firstName: 'Jesus',
        lastName: 'Rocha'
      },
      face: 'img/users/1/user-profile.jpg'
    }, {
      id: 2,
      email: 'aida.hurtado@whichdegree.co',
      profile: {
        firstName: 'Aida',
        lastName: 'Hurtado'
      },
      face: 'img/users/3/user-profile.jpg'
    }, {
      id: 3,
      email: 'emcp@whichdegree.co',
      profile: {
        firstName: 'Erik',
        lastName: 'Peterson'
      },
      face: 'img/users/2/user-profile.jpg'
    }], currentUser = users[0];

    return {
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
          return true;
        } else {
          return false;
        }
      },
      currentUser: currentUser || users[0]
    }
  });
