'use strict';

var mongoose = require('mongoose'),
    uniqueValidator = require('mongoose-unique-validator'),
    schema, User;

var crypto = require('crypto');

function createSalt () {
  return crypto.randomBytes(128).toString('base64');
}

function hashPwd (salt, pwd) {
  var hmac = crypto.createHmac('md5', salt);
  return hmac.update(pwd).digest('hex');
}

schema = mongoose.Schema({  
  username:      String,
  name:   String,

  firstName: String,
  lastName: String,
  
/*  twitterToken:  String,
  twitterSecret: String,
  twitterId: {
    type:  String,
    index: true,
    unique: true
  },*/

  email: {
    type: String,
    trim: true,
    lowercase: true,
    required: true,
    unique: true,
    index: true
  },
  salt:     {type: String },
  password: {type: String },
  role: String,
  confirmed: Boolean,
  resetPasswordToken: {type: String},
  resetPasswordExpires: {type: Date },
  authorizationToken: {type: String},
  memberships: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Membership' }]
});

schema.methods.authenticate = function(passwordToMatch) {
  return hashPwd(this.salt, passwordToMatch) === this.password;
};

schema.statics.recoverPassword = function( email, cb ){
  if( !email ) { return cb(); }

  User.findOne({email: email}, function (err, user) {
    if (err || !user) { return cb(); }

    if (!user) { return cb(); }

    var token = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000;

    user.save( function(err,scs){
      if( scs ){
        cb( null, {token: token });
      }else{
        cb();
      }
    });
  });
};

schema.statics.resetPassword = function(token, newPassword, cb) {
  if (!token  || ! newPassword) { return cb('missing email or password'); }

  User.findOne({resetPasswordToken: token}, function (err, user) {
    if (err) { return cb(err); }
    if (!user) { return cb('user does not exist'); }

    user.salt = createSalt();
    user.password = hashPwd(user.salt, newPassword || '');
    user.authorizationToken = crypto.randomBytes(20).toString('hex');

    user.save( function(err, user){
      if( err ){
        return cb('unable to save new password');
      }
      cb(null, user);
    });

  });
};

schema.statics.login = function(email, passwordToMatch, cb) {
  if (!email  || ! passwordToMatch) { return cb('missing email or password'); }

  User.findOne({email: email}, function (err, user) {
    if (err) { return cb(err); }
    if (!user) { return cb('user does not exist'); }
    if (!user.authenticate(passwordToMatch)) { 
      return cb('wrong password');
    }
    user.authorizationToken = crypto.randomBytes(20).toString('hex');
    user.save( function(err, user){
      if( err || typeof user === 'undefined'){ return cb('error'); }

      cb(null, user);
    });
  });
};
schema.statics.findAndModify = function (query, sort, doc, options, callback) {
  return this.collection.findAndModify(query, sort, doc, options, callback);
};

schema.pre('save', function (next) {
  if (this.isNew) {
    this.salt = createSalt();
    this.password = hashPwd(this.salt, this.password || '');
    this.resetPasswordToken = crypto.randomBytes(20).toString('hex');
    this.authorizationToken = crypto.randomBytes(20).toString('hex');
  }

  next();
});

schema.plugin( uniqueValidator, { message: '{PATH} needs to be unique.'} );


User = mongoose.model('User', schema);
module.exports = User;
