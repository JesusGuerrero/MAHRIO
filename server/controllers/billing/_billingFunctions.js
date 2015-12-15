'use strict';

var async = require('async'),
    mongoose = require('mongoose'),
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
      currency: 'usd',
      customer: customerId
    });
  }).then(function() {
    User.update({_id: request.auth.credentials.id}, {$set: {stripeId: customerId}}, {upsert: true}, function(err){
      if( err ){ return reply( Boom.badRequest(err) ); }

      reply({ok: true});
    });
  }).catch( function(err){
    return reply( Boom.badRequest(err));
  });
}
function recurBilling( request, reply, stripe){
  User.find({ stripeId: { $ne: null }}, function(err, users){
    if( err ) { return reply( Boom.badRequest(err) ); }

    async.forEach( users, function(user, callback){
      stripe.charges.create({
        amount: 99, // amount in cents, again
        currency: 'usd',
        customer: user.stripeId // Previously stored, then retrieved
      }).then(function(){
        callback();
      });
    }, function(){
      reply( {ok: true} );
    });
  });
}

module.exports = {
  post: postBilling,
  recur: recurBilling
};