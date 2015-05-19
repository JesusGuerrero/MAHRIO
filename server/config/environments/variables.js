'use strict';

var Path = require('path'),
    rootPath = Path.normalize(__dirname + '/../../'),
    language = require('./../languages');

module.exports = function( currentEnvironment ) {

  var environments = {
    development: {
      datastoreURI: 'mongodb://localhost/development',
      cmsURL: 'http://com.computerenchiladas.com/~whichdegree/cms-stage/?q=',
      port: 8042
    },
    test: {
      datastoreURI: 'mongodb://localhost/testing',
      cmsURL: '',
      port: 8043
    },

    stage: {
      datastoreURI: 'mongodb://localhost/staging',
      cmsURL: 'http://localhost/~whichdegree/cms-stage/?q=',
      port: 8041
    },

    production: {
      datastoreURI: 'mongodb://localhost/production',
      cmsURL: 'http://localhost/~whichdegree/cms-stage/?q=',
      port: 8140
    }
  };

  var baseSetup = environments[ currentEnvironment.NODE_ENV ];
  baseSetup.rootPath = rootPath;
  baseSetup.lang = language;
  baseSetup.IN_CLIENT_ID = currentEnvironment.IN_CLIENT_ID;
  baseSetup.IN_CLIENT_SECRET = currentEnvironment.IN_CLIENT_SECRET;
  baseSetup.IN_CALLBACK_URL = currentEnvironment.IN_CALLBACK_URL;

  baseSetup.FB_CLIENT_ID = currentEnvironment.FB_CLIENT_ID;
  baseSetup.FB_CLIENT_SECRET = currentEnvironment.FB_CLIENT_SECRET;
  baseSetup.FB_CALLBACK_URL = currentEnvironment.FB_CALLBACK_URL;

  baseSetup.CMS_URL = currentEnvironment.CMS_URL;

  return baseSetup;
};