'use strict';

var HardwareCtrl = require('./_hardwareFunctions');

module.exports = function(config, server) {
  [
    {
      method: ['GET'],
      path: '/api/hardware',
      config: {
        handler: HardwareCtrl.get,
        auth: {
          strategy: 'simple'
        }
      }
    },
    {
      method: ['POST'],
      path: '/api/hardware',
      config: {
        handler: HardwareCtrl.create,
        auth: 'simple'
      }
    },
    {
      method: ['PUT'],
      path: '/api/hardware/{id?}',
      config: {
        handler: HardwareCtrl.update,
        auth: {
          strategy: 'simple'
        }
      }
    },
    {
      method: ['DELETE'],
      path: '/api/hardware/{id?}',
      config: {
        handler: HardwareCtrl.remove,
        auth: 'simple'
      }
    }
  ].forEach(function (route) { server.route(route); });
};