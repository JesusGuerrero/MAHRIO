/*
  TODO: example here
 */

angular.module('baseApp', [
  'ui.router',
  'ui.bootstrap.typeahead',
  'ui.bootstrap.tabs',
  'ui.sortable',
  'ngResource',
  'btford.socket-io',
  'angular-loading-bar',
  'chart.js',
  'baseApp.services',
  'baseApp.directives',
  'baseApp.filters',
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
      templateUrl: '/assets/html/views/root',
      title: 'Dashboard'
    })
    .state('notifications', {
      url: '/notifications',
      templateUrl: '/assets/html/notifications/index',
      controller: 'NotificationsController',
      title: 'Notifications',
      subTitle: 'What\'s New'
    })
    .state('articles', {
      abstract: true,
      url: '/articles',
      controller: 'ArticleController',
      template: '<ui-view/>'
    })
    .state('articles.new', {
      url: '/new',
      templateUrl: '/assets/html/article/form',
      title: 'New Article'
    })
    .state('articles.list', {
      url: '/all',
      templateUrl: '/assets/html/article/list',
      title: 'List Articles'
    })
    .state('articles.edit', {
      url: '/:id/edit',
      templateUrl: '/assets/html/article/form',
      title: 'Edit Article'
    })
    .state('articles.detail', {
      url: '/:id',
      templateUrl: '/assets/html/article/detail',
      title: 'Article'
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
      abstract: true,
      url: '/users',
      template: '<ui-view/>',
      controller: 'UsersController'
    })
    .state('users.new', {
      url: '/new',
      templateUrl: '/assets/html/user/form-register',
    })
    .state('users.list', {
      url: '/list',
      templateUrl: '/assets/html/user/list',
      title: 'List Users'
    })
    .state('users.detail', {
      url: '/profile/:id',
      controller: 'ProfileController',
      templateUrl: '/assets/html/profile/directive-summary',
      title: 'User'
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
      controller: 'ConversationsController',
      title: 'All Conversations'
    })
    .state('conversations.public', {
      url: '/public',
      title: 'Public Conversations'
    })
    .state('conversations.private', {
      url: '/private',
      title: 'Private Conversations'
    })
    .state('login', {
      url: '/login?linkedIn',
      templateUrl: '/assets/html/session/form-login',
      controller: 'SessionController'
    })
    .state('confirm', {
      url: '/confirm/:token?user=true',
      templateUrl: '/assets/html/auth/confirm',
      controller: 'UsersController'
    })
    .state('recoverpassword', {
      url: '/recoverpassword',
      controller: 'SessionController',
      templateUrl: '/assets/html/session/form-recover-password'
    })
    .state('passwordreset', {
      url: '/passwordreset/:token',
      controller: 'SessionController',
      templateUrl: '/assets/html/session/form-password-reset'
    })
    .state('calendar', {
      url: '/calendar',
      controller: 'CalendarController',
      templateUrl: '/assets/html/calendar/index',
      title: 'Calendar',
      subTitle: 'Events'
    })
    .state('profile', {
      url: '/profile',
      controller: 'ProfileController',
      templateUrl: '/assets/html/profile/profile-landing',
      title: 'My Profile'
    })
    .state('profile.info', {
      url: '/info',
      title: 'My Profile',
      subTitle: 'General'
    })
    .state('profile.contact', {
      url: '/contact',
      title: 'My Profile',
      subTitle: 'Contact'
    })
    .state('profile.security', {
      url: '/security',
      title: 'My Profile',
      subTitle: 'Security'
    })
    .state('boards', {
      abstract: true,
      url: '/boards',
      controller: 'BoardController',
      template: '<ui-view/>'
    })
    .state('boards.new', {
      url: '/new',
      templateUrl: '/assets/html/board/form',
      title: 'New Board'
    })
    .state('boards.list', {
      url: '/all',
      controller: 'BoardController',
      templateUrl: '/assets/html/board/list',
      title: 'List Boards'
    })
    .state('boards.edit', {
      url: '/:board/edit',
      templateUrl: '/assets/html/board/form',
      title: 'Edit Board'
    })
    .state('boards.detail', {
      url: '/:id',
      controller: 'TaskController',
      templateUrl: '/assets/html/task/index',
      title: 'Board',
      subTitle: 'Tasks'
    })
    .state('boards.detail.backlog', {
      url: '/backlog',
      controller: 'TaskController',
      templateUrl: '/assets/html/task/index',
      title: 'Board',
      subTitle: 'Backlog'
    })
    .state('boards.detail.backlog.new', {
      url: '/new',
      controller: 'TaskController',
      templateUrl: '/assets/html/task/index',
      title: 'Board',
      subTitle: 'New Task'
    })
    .state('boards.detail.backlog.edit', {
      url: '/:task/edit',
      controller: 'TaskController',
      templateUrl: '/assets/html/task/index',
      title: 'Board',
      subTitle: 'Edit Task'
    })

    //.state('tasks', {
    //  url: '/tasks',
    //  controller: 'TaskController',
    //  templateUrl: '/assets/html/task/index'
    //})
    //.state('tasks.current',{
    //  url: '/current'
    //})
    //.state('tasks.new',{
    //  url: '/new'
    //})
    //.state('tasks.view', {
    //  url: '/:id'
    //})
    //.state('tasks.edit',{
    //  url: '/:id/edit'
    //})
    .state('mail', {
      url: '/mail',
      controller: 'MailboxController',
      templateUrl: '/assets/html/mail/index',
      title: 'Mailbox',
      subTitle: 'Inbox'
    })
    .state('mail.inbox', {
      url: '/inbox',
      title: 'Mailbox',
      subTitle: 'Inbox'
    })
    .state('mail.new', {
      url: '/new',
      title: 'Mailbox',
      subTitle: 'New'
    })
    .state('mail.drafts', {
      url: '/drafts',
      title: 'Mailbox',
      subTitle: 'Drafts'
    })
    .state('mail.sent', {
      url: '/sent',
      title: 'Mailbox',
      subTitle: 'Sent'
    })
    .state('mail.starred', {
      url: '/starred',
      title: 'Mailbox',
      subTitle: 'Starred'
    })
    .state('mail.archived', {
      url: '/archived',
      title: 'Mailbox',
      subTitle: 'Archived'
    })
    .state('mail.view', {
      url: '/view/:id/:action',
      title: 'Mailbox',
      subTitle: 'View'
    });

  $urlRouterProvider.otherwise('/');

})
  .config(['ChartJsProvider', function (ChartJsProvider) {
    // Configure all charts
    'use strict';
    ChartJsProvider.setOptions({
      responsive: false
    });
    // Configure all line charts
    ChartJsProvider.setOptions('Line', {
      datasetFill: false
    });
  }]);

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
            delete window.localStorage.Access;
            delete window.localStorage.Authorization;
          });
      };

      // AUTHENTICATION
      $rootScope.setAccess = function( access ){
        $rootScope.access = access;
        window.localStorage.Access = access;
      };
      $rootScope.setAccess( window.localStorage.Access || 'any' );

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
            }, function(){
              delete window.localStorage.Authorization;
              window.localStorage.Access = 'any';
              $rootScope.access = 'any';
            });
        }
      };
      $rootScope.getProfile();

      $rootScope.isDefined = function( val ){
        return angular.isDefined( val );
      };

      $rootScope.user = 'any';

      window.rootScope = $rootScope;

      $rootScope.isSidebarCollapsed = window.localStorage.isSidebarCollapsed || false;
      $rootScope.toggleSidebarCollapsed = function(){
        if( window.localStorage.isSidebarCollapsed ) {
          delete window.localStorage.isSidebarCollapsed;
        } else {
          window.localStorage.isSidebarCollapsed = true;
        }
      };
    }
  ]);

