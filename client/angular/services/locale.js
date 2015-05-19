angular.module('baseApp.services')
  .factory('LocaleFactory', [ function() {
    'use strict';
    var localeFactory = {};
    localeFactory.getEnglish = function(){
      var englishDialog = {
        company: {
          name: 'Seed App',
          year: 2014,
          slogan: 'Company Slogan'
        },
        form: {
          label: {
            shared: {
              name: 'Name',
              email: 'Email',
              password: 'Password',
              confirmPassword: 'Confirm Password',
              search: 'Search',
              from: 'From',
              to: 'To'
            },
            admin: {},
            user: {}
          },
          button: {
            ok: 'OK',
            cancel: 'Cancel',
            submit: 'Submit',
            update: 'Update',
            delete: 'Delete',
            create: 'Create',
            login: 'Login',
            reset: 'Reset'
          },
          error: {
            header: 'We have encountered an error',
            server: { /* Server Errors, i.e. duplicate entry, unauthorized, access denied, etc */ },
            validation: { /* Client validations, i.e. field length, regex validations, valid inputs */ }
          },
          success: {
            update: 'Update success'
          },
          page: {
            signin: {
              title: 'LOGIN',
              rememberMe: 'Remember Me',
              forgotPassword: 'Forgot Password',
              signUp: 'Need to Signup?',
              register: 'Register Now'
            },
            register: {
              title: 'REGISTER',
              terms: ['I agree with the ', 'terms'],
              haveAccount: 'Have an account?',
              login: 'Login'
            }
          }
        }
      };
      return englishDialog;
    };
    return localeFactory;
  }]);