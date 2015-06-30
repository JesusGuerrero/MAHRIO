'use strict';

var MailCtrl = require('./_mailFunctions');

module.exports = function(config, server) {
  [
    {
      method: ['GET'],
      path: '/api/mail/{folder?}',
      config: {
        handler: MailCtrl.readMail,
        auth: 'simple'
      }
    },
    {
      method: ['POST'],
      path: '/api/mail',
      config: {
        handler: MailCtrl.createMail,
        auth: 'simple'
      }
    },
    {
      method: ['PUT'],
      path: '/api/mail/{folder?}',
      config: {
        handler: MailCtrl.updateMail,
        auth: 'simple'
      }
    }
  ].forEach(function (route) { server.route(route); });
};