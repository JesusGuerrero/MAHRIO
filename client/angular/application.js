/*
  TODO: example here
 */

angular.module('baseApp', [
  'ui.router',
  'ui.bootstrap.typeahead',
  'ui.bootstrap.tabs',
  'ngResource',
  'btford.socket-io',
  'angular-loading-bar',
  'baseApp.services',
  'baseApp.directives',
  'baseApp.controllers',
  'angular-underscore'
])
  .constant('_', window._);

angular.module('baseApp').config(function ($stateProvider, $urlRouterProvider, $locationProvider) {
  'use strict';

  $locationProvider.html5Mode(false);
/*      .html5Mode({
        enabled: true,
        requireBase: true
      });*/

  /*$routeProvider
      .when('/login', {
        templateUrl: '/assets/html/auth/login'
      })
      .when('/register',    {
        templateUrl: '/assets/html/auth/register'
      })
      .when('/recover',    {
        templateUrl: '/assets/html/auth/recover'
      })
      .when('/', {
        templateUrl: '/assets/html/landingPages/dashboard',
        controller: null
      })
      .otherwise({redirectTo: '/'});*/
  $stateProvider
    .state('root', {
      url: '/',
      templateUrl: '/assets/html/views/root'
    })

    .state('knowledge', {
      url: '/knowledge',
      templateUrl: '/assets/html/knowledge/index',
      controller: 'KnowledgeController'
    })
    .state('knowledge.articles', {
      url: '/articles?domain'
    })
    .state('knowledge.articles.view', {
      url: '/view'
    })



    .state('adminDashV1', {
      url: '/dashboard-v1',
      templateUrl: '/assets/html/views/dashboard-v1'
    })
    .state('blankPage', {
      url: '/blank',
      templateUrl: '/assets/html/views/blank'
    })
    .state('userDash', {
      url: '/feed',
      templateUrl: '/assets/html/views/feed'
    })
    .state('users', {
      url: '/users',
      templateUrl: '/assets/html/users/index',
      controller: 'UsersController'
    })
    .state('newsletters', {
      url: '/admin/newsletter',
      templateUrl: '/assets/html/admin/newsletters',
      controller: 'adminNewslettersController'
    })
    .state('questions', {
      url: '/questions',
      templateUrl: '/assets/html/questions/index',
      controller: 'QuestionsController'
    })
    .state('conversations', {
      url: '/conversations',
      templateUrl: '/assets/html/conversations/index',
      controller: 'ConversationsController'
    })
    .state('login', {
      url: '/login?linkedIn',
      templateUrl: '/assets/html/auth/login',
      controller: 'authController'
    })
    .state('register', {
      url: '/register',
      templateUrl: '/assets/html/auth/register'
    })
    .state('confirm', {
      url: '/confirm/:token?user=true',
      templateUrl: '/assets/html/auth/confirm',
      controller: 'authController'
    })
    .state('recoverpassword', {
      url: '/recoverpassword',
      controller: 'authController',
      templateUrl: '/assets/html/auth/recoverpassword'
    })
    .state('passwordreset', {
      url: '/passwordreset/:token',
      controller: 'authController',
      templateUrl: '/assets/html/auth/passwordreset'
    })
    .state('calendar', {
      url: '/calendar',
      controller: 'CalendarController',
      templateUrl: '/assets/html/calendar/index'
    })
    .state('profile', {
      url: '/profile',
      controller: 'ProfileController',
      templateUrl: '/assets/html/profile/profile-landing'
    })
    .state('profile.info', {
      url: '/info'
    })
    .state('profile.contact', {
      url: '/contact'
    })
    .state('profile.security', {
      url: '/security'
    })
    .state('mail', {
      url: '/mail',
      controller: 'MailboxController',
      templateUrl: '/assets/html/mail/index'
    })
    .state('mail.inbox', {
      url: '/inbox'
    })
    .state('mail.new', {
      url: '/new'
    })
    .state('mail.drafts', {
      url: '/drafts'
    })
    .state('mail.sent', {
      url: '/sent'
    })
    .state('mail.starred', {
      url: '/starred'
    })
    .state('mail.archived', {
      url: '/archived'
    })
    .state('mail.view', {
      url: '/view/:id/:action'
    });

  $urlRouterProvider.otherwise('/');

});

angular.module('baseApp.services', ['ngResource']);
angular.module('baseApp.directives', []);
angular.module('baseApp.filters', []);
angular.module('baseApp.controllers', [])
  .run(['$rootScope', '$state', '$http', '$location', 'LocaleFactory', 'ValidatorFactory', 'currentUser',
    function ($rootScope, $state, $http, $location, LocaleFactory, ValidatorFactory, currentUser) {
      'use strict';

      $rootScope.locale = LocaleFactory.getEnglish();
      $rootScope.validate = ValidatorFactory;

      $rootScope.$on('$routeChangeSuccess', function(){
        //window.ga('send', 'pageview', $location.path());
      });

      $rootScope.logout = function(){
        currentUser.logout()
          .then( function(){
            delete $http.defaults.headers.common.Authorization;
            delete window.localStorage.Role;
            delete window.localStorage.Authorization;
          });
      };

      // AUTHENTICATION
      $rootScope.setRole = function( role ){
        $rootScope.role = role;
        window.localStorage.Role = role;
      };
      $rootScope.setRole( window.localStorage.Role || 'any' );

      $rootScope.setAuthorizationHeader = function(token){
        if( token ) {
          $http.defaults.headers.common.Authorization = token;
          window.localStorage.Authorization = token;
        }
      };
      $rootScope.setAuthorizationHeader( window.localStorage.Authorization);

      $rootScope.getProfile = function(route){
        if( angular.isDefined( $http.defaults.headers.common.Authorization ) ) {
          currentUser.isLoggedIn()
            .then( function(response){
              if( response.user ) {
                currentUser.login( response.user, route || false );
              }
            });
        }
      };
      $rootScope.getProfile();

      $rootScope.isDefined = function( val ){
        return angular.isDefined( val );
      };

      console.log( $location.search(), $rootScope.role );
      $rootScope.user = 'anyUser';

      window.rootScope = $rootScope;
    }
  ]);

