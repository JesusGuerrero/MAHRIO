'use strict';

var BillingCtrl = require('./_billingFunctions');
var stripe;

module.exports = function(config, server) {
  stripe = require('stripe')( config.STRIPE_SECRET_KEY );

  [
    {
      method: 'POST',
      path: '/api/billing',
      config: {
        handler: function(request, reply){
          return BillingCtrl.post( request, reply, stripe );
        },
        auth: 'simple'
      }
    }
  ].forEach(function (route) { server.route(route); });
};