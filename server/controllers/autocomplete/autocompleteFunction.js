'use strict';

var Boom = require('boom'),
  mongoose = require('mongoose'),
  User = mongoose.model('User');

function get( type, query, reply) {
  if (type === 'users') {
    User.
      find({})
      .lean()
      .select('email firstName lastName')
      .limit( 10 )
      .exec( function (err, users) {
        if (err || !users) {
          return reply(Boom.badRequest(err));
        }

        return reply({
          users: users
        });
      });
  } else {
    return reply(Boom.badRequest('we currently dont support that tpye'));
  }
}
module.exports = {
  get: get
};