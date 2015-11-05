angular.module('baseApp.services')
  .factory('ValidatorFactory', [ function() {
    'use strict';

    return {
      email: {
        pattern: /^\S+@\S+\.\S+$/i,
        message: 'Email invalid'
      },
      confirmPass: {
        pattern: /123/i,
        message: 'Confirmation Invalid'
      },
      forms: {
        register: function( user, validation ){
          switch( true ){
            case !angular.isDefined( user.email ) || !angular.isDefined( user.password ):
            case !angular.isDefined( user.profile.firstName ) || !angular.isDefined( user.profile.lastName ):
              validation.errors = ['Unable to register'];
              return true;
            default:

              return false;
          }
        },
        recoverPassword: function( user, validation ){
          switch( true ){
            case !angular.isDefined( user.email ):
              validation.errors = ['Enter email'];
              return true;
            default:
              return false;
          }
        },
        passwordReset: function( user, validation ){
          switch( true ){
            case !angular.isDefined( user.newPassword ):
              validation.errors = ['Enter password'];
              return true;
            default:
              return false;
          }
        }
      }
    };
  }]);