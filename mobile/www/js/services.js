angular.module('starter.services', [])
  .factory( '_', function(){
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
  .factory('Networks', function( APP_IP, $http, _ ){
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
        return _.findById( networks, networkId);
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
.factory('Chats', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var chats = [{
    id: 0,
    name: 'Ben Sparrow',
    lastText: 'You on your way?',
    face: 'img/ben.png'
  }, {
    id: 1,
    name: 'Max Lynx',
    lastText: 'Hey, it\'s me',
    face: 'img/max.png'
  }, {
    id: 2,
    name: 'Adam Bradleyson',
    lastText: 'I should buy a boat',
    face: 'img/adam.jpg'
  }];

  return {
    all: function() {
      return chats;
    },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    }
  };
});
