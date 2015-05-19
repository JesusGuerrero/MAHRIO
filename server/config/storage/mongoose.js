'use strict';

var mongoose = require('mongoose');

require('../../models/mongo');

var User = mongoose.model('User');

module.exports = function (config, server) {
  mongoose.connect(config.datastoreURI);
  var db = mongoose.connection;

  db.on('error', console.error.bind(console, 'db connection error...'));
  db.once('open', function () {
    console.log('db connection opened');
    User.count({}, function(err,count){
      if( !count ) {
        server.needAdmin = true;
      }
    });
  });
};
