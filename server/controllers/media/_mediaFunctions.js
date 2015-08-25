'use strict';

var require = require,
  aws = require('aws-sdk'),
  async = require('async'),
  _ = require('underscore'),
  Boom = require('boom'),
  mongoose = require('mongoose'),
  Media = mongoose.model('Media');

function getMediaKey( request, reply, config ) {
  var s3 = new aws.S3({
    signatureVersion: 'v4',
    accessKeyId: config.AWS_ACCESS_KEY,
    secretAccessKey: config.AWS_SECRET_KEY,
    region: 'us-west-1'
  });
  var fileKey = request.query.object + '/' + request.auth.credentials.id + '/' + request.query.container + '/' + request.query.filename;
  var s3_params = {
    Bucket: config.S3_BUCKET,
    Key: fileKey,
    Expires: 60,
    ACL: 'public-read'
  };
  s3.getSignedUrl('putObject', s3_params, function(err, data){
    if(err){
      return reply( Boom.badRequest(err) );
    }
    else{
      var return_data = {
        signed_request: data,
        url: 'https://'+config.S3_BUCKET+'.s3.amazonaws.com/'+fileKey
      };
      return reply( return_data );
    }
  });
}
function getMedia( request, reply, next ) {
  var query, key = 'media';
  if( request.params.id ) {
    query = Media.findOne({_id: request.params.id});
  } else {
    query = Media.find({});
  }

  query
    .and([{
      _removed: false
    }])
    .exec( function(err, article){
      if( err ) { return reply( Boom.badRequest(err) ); }

      if( typeof next === 'function' ) {
        next( article );
      } else {
        var replyObject = {};
        replyObject[ key ] = article;
        reply( replyObject );
      }
    });
}
function _createMedia( request ){
  return new Media( request.payload.media ).save();
}
function createMedia( request, reply ) {
  if( !request.payload.media ) {
    return reply( Boom.badRequest() );
  }

  _createMedia(request)
    .then( function(media) {
      return reply({media: media});
    }, function(err){
      return reply( Boom.badRequest(err) );
    });
}
function removeMedia(request, reply){
  getMedia( request, reply, function( media ) {
    if( !media ) {
      return reply(Boom.badRequest('media not found'));
    }
    media._removed = true;

    media.save( function(err) {
      if( err ) { return reply( Boom.badRequest(err )); }
      reply({removed: true});
    });
  });
}
module.exports = {
  getKey: getMediaKey,
  get: getMedia,
  create: createMedia,
  remove: removeMedia
};