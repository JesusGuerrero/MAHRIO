'use strict';

var async = require('async'),
    mongoose = require('mongoose'),
    _ = require('underscore'),
    Boom = require('boom'),
    User = mongoose.model('User');

function postBilling( request, reply, stripe ){
  var stripeToken = request.payload.stripeToken,
    customerId = null;

  stripe.customers.create({
    source: stripeToken,
    description: 'payinguser@example.com'
  }).then(function(customer) {
    customerId = customer.id;
    return stripe.charges.create({
      amount: 99, // amount in cents, again
      currency: "usd",
      customer: customerId
    });
  }).then(function() {
    Users.update({_id: request.auth.credentials.id}, {stripeId: customerId}, {multi: false}, function(err){
      if( err ){ return reply( Boom.badRequest(err) ); }

      reply({ok: true});
    });
  });
}
function recurBilling( request, reply, stripe){
  User.find({ stripeId: { $ne: null }}, function(err, users){
    if( err ) { return reply( Boom.badRequest(err) ); }

    async.forEach( users, function(user, callback){
      stripe.charges.create({
        amount: 99, // amount in cents, again
        currency: "usd",
        customer: user.stripeId // Previously stored, then retrieved
      }).then(function(){
        callback();
      })
    }, function(){
      reply( {ok: true} );
    });
  });
}

module.exports = {
  post: postBilling,
  recur: recurBilling
};