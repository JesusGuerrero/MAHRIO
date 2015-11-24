// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', [
  'ionic',
  'starter.controllers',
  'starter.services',
  'starter.directives',
  'angular-underscore'])
  .constant('APP_IP', 'http://192.168.0.4:8042')
  .constant('_', window._)
.run(function($ionicPlatform, $location, $rootScope, Users) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
    if( Users.checkLoggedIn() ){
      $location.path('/tab/dash');
    } else {
      $location.path('/offline');
    }
    $rootScope.$apply();
  });
})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
    .state('tab', {
      url: '/tab',
      abstract: true,
      templateUrl: 'templates/tabs.html'
    })

  // Each tab has its own nav history stack:

    .state('tab.dash', {
      url: '/dash',
      views: {
        'tab-dash': {
          templateUrl: 'templates/tab-dash.html',
          controller: 'DashCtrl'
        }
      }
    })
    .state('tab.articles', {
      url: '/articles?network',
      views: {
        'tab-networks': {
          templateUrl: 'templates/tab-articles.html'
        }
      }
    })
    .state('tab.article', {
      url: '/article/:articleId?network',
      views: {
        'tab-networks': {
          templateUrl: 'templates/article-detail.html',
          controller: 'ArticleDetailCtrl'
        }
      }
    })
    .state('tab.boards', {
      url: '/boards?network',
      views: {
        'tab-networks': {
          templateUrl: 'templates/tab-boards.html'
        }
      }
    })
    .state('tab.board', {
      url: '/board/:boardId?network',
      views: {
        'tab-networks': {
          templateUrl: 'templates/board-detail.html',
          controller: 'BoardDetailCtrl'
        }
      }
    })
    .state('tab.events', {
      url: '/events?network',
      views: {
        'tab-networks': {
          templateUrl: 'templates/tab-events.html'
        }
      }
    })
    .state('tab.event', {
      url: '/event/:eventId?network',
      views: {
        'tab-networks': {
          templateUrl: 'templates/event-detail.html',
          controller: 'EventDetailCtrl'
        }
      }
    })
    .state('tab.appliances', {
      url: '/appliances?network',
      views: {
        'tab-networks': {
          templateUrl: 'templates/tab-hardware.html'
        }
      }
    })
    .state('tab.appliance', {
      url: '/appliance/:applianceId?network',
      views: {
        'tab-networks': {
          templateUrl: 'templates/hardware-detail.html',
          controller: 'HardwareDetailCtrl'
        }
      }
    })
    .state('tab.members', {
      url: '/members?network',
      views: {
        'tab-networks': {
          templateUrl: 'templates/tab-members.html'
        }
      }
    })
    .state('tab.member', {
      url: '/member/:memberId?network',
      views: {
        'tab-networks': {
          templateUrl: 'templates/member-detail.html',
          controller: 'MemberDetailCtrl'
        }
      }
    })
    .state('tab.networks', {
      url: '/networks',
      views: {
        'tab-networks': {
          templateUrl: 'templates/tab-network.html',
          controller: 'NetworksCtrl'
        }
      }
    })
    .state('tab.network', {
      url: '/network/:networkId',
      views: {
        'tab-networks': {
          templateUrl: 'templates/network-detail.html',
          controller: 'NetworkDetailCtrl'
        }
      }
    })
    .state('tab.chats', {
      url: '/chats',
      views: {
        'tab-chats': {
          templateUrl: 'templates/tab-chats.html',
          controller: 'ChatsCtrl'
        }
      }
    })
    .state('tab.chat-detail', {
      url: '/chats/:chatId',
      views: {
        'tab-chats': {
          templateUrl: 'templates/chat-detail.html',
          controller: 'ChatDetailCtrl'
        }
      }
    })
    .state('tab.search', {
      url: '/search',
      views: {
        'tab-search': {
          templateUrl: 'templates/tab-search.html',
          controller: 'SearchCtrl'
        }
      }
    })
    .state('tab.account', {
      url: '/account',
      views: {
        'tab-account': {
          templateUrl: 'templates/tab-account.html',
          controller: 'AccountCtrl'
        }
      }
    })
    .state('offline', {
      url: '/offline',
      templateUrl: 'templates/offline.html',
      controller: 'OfflineCtrl'
    });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/offline');

});
