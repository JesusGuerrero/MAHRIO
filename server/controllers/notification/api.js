'use strict';

var NoticeCtrl = require('./_notificationController');

module.exports = function(config, server) {
  [
    {
      method: ['GET'],
      path: '/api/notifications',
      config: {
        handler: NoticeCtrl.get,
        auth: 'simple'
      }
    }
  ].forEach(function (route) { server.route(route); });
};