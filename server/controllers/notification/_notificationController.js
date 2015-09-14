'use strict';

var Boom = require('boom'),
  mongoose = require('mongoose'),
  Notice = mongoose.model('Notification');

function get( request, reply ) {
  Notice
    .find( { _user: request.auth.credentials.id })
    .exec( function(err, notifications){
      if( err ) { return reply( Boom.badRequest() ); }

      // ADD MORE DETAIL BASED ON KEY AND RESOURCE ID

      reply( {notifications: notifications} );
    });
}

module.exports = {
  get: get
};