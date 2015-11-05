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
    },
    {
      method: ['POST'],
      path: '/api/notifications/{resource?}',
      config: {
        handler: NoticeCtrl.add,
        auth: 'simple'
      }
    },
    {
      method: ['DELETE'],
      path: '/api/notifications/{resource?}',
      config: {
        handler: NoticeCtrl.remove,
        auth: 'simple'
      }
    }
  ].forEach(function (route) { server.route(route); });
};