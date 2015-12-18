'use strict';

var async = require('async'),
  _ = require('underscore'),
  Boom = require('boom'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Article = mongoose.model('Article'),
  Media = mongoose.model('Media'),
  Network = mongoose.model('Network'),
  Section = mongoose.model('Section');

function createArticle( request, reply ) {
  if( !request.payload.article || (!_.contains(request.auth.credentials.access, 'admin')&&!_.contains(request.auth.credentials.access, 'sudo')) ) {
    return reply( Boom.badRequest() );
  }

  Section.create( request.payload.article.sections, function(err, sections) {
    if( err ) { return Boom.badRequest(err); }

    request.payload.article.sections = Object.keys(_.indexBy(sections, '_id'));
    request.payload.article.creator = request.auth.credentials.id;
    Article.create( request.payload.article, function(err, article){
      if( err ) { return reply( Boom.badRequest(err) ); }

      if( article.network ) {
        Network.update( {_id: article.network}, {$push: {articles: article.id}}, {multi: false},
          function() {
            return reply({article: article});
          });
      }

    });
  });
}
function _getArticleOwner( article, callback ) {
  User
    .findOne( {_id: article.creator})
    .select('email profile avatarImage')
    .populate('profile avatarImage')
    .exec( function(err, user){
      if( err ) { callback(err); }

      article._doc.owner = user;

      callback( false );
    });
}
function _getAllArticles( request, reply, callback ) {
  Article
    .find( request.query.networkId ? {network: request.query.networkId} : {} )
    .populate('widgets sections media coverImage network')
    .exec( function(err, articles){
      if( err ) { return reply( Boom.badRequest(err) ); }

      if( typeof callback !== 'undefined' ) {
        callback( articles );
      } else {
        return reply({articles: articles});
      }
    });
}
function getArticle( request, reply, callback ) {
  if( typeof request.params.id === 'undefined' ) {
    _getAllArticles( request, reply, function(articles){
      async.each( articles, function(article, callback){
        _getArticleOwner( article, function(err){
          if( err ) { return reply( Boom.badRequest() ); }

          callback();
        });
      }, function(){
        return reply( {articles: articles} );
      });
    });
  } else {
    Article
      .findOne( {_id: request.params.id} )
      .populate('widgets sections media coverImage')
      .exec( function(err, article){
        if( err ) { return reply( Boom.badRequest(err) ); }

        _getArticleOwner( article, function(err){
          if( err ) { return reply( Boom.badRequest() ); }

          if( typeof callback !== 'undefined' ) {
            callback( article );
          } else {
            return reply( {article: article} );
          }
        });
      });
  }
}
function _removeSections( sections, next ){
  if( sections.length ) {
    async.forEach( sections, function(item, callback){
      Section.remove( {_id: item._id}, function(){
        callback();
      });
    }, function(){
      next();
    });
  } else {
    next();
  }
}
function _updateArticle( request, reply, article) {
  var oldSections = _.filter( article.sections, function(sec){ return !_.findWhere(request.payload.article.sections, {_id: sec.id}); });

  _removeSections( oldSections, function(){
    article.sections = _.map( request.payload.article.sections, function(sec){ return sec._id;});
    article.save( function(err, article) {
      if( err ) { return reply( Boom.badRequest(err) ); }

      reply( {article: article} );
    });
  });
}
function _saveSections( sections, next ) {
  async.forEach( sections, function(item, callback){
    Section.update( {_id: item._id}, { $set : { body: item.body }}, function(){
      callback();
    });
  }, function(){
    next();
  });
}
function _updateImage( request, reply ) {
  Media
    .create( request.payload.article.mediaInsert, function(err, media){
      if( err ) { return reply( Boom.badRequest(err) ); }

      Article.update({_id: request.params.id}, {$set: {coverImage: media.id}}, {multi: false},
        function(err, article){
          if( err || !article ){ return reply( Boom.badRequest('failed to update article with image'+err)); }

          return reply({media: media});
        });
  });
}
function updateArticle( request, reply ) {
  if( !request.payload.article || (!_.contains(request.auth.credentials.access, 'sudo') && !_.contains(request.auth.credentials.access, 'admin')) || typeof request.params.id === 'undefined') {
    return reply(Boom.badRequest());
  } else if( request.payload.article.mediaInsert ) {
    _updateImage( request, reply );
  } else if( typeof request.payload.articleIds !== 'undefined' && Array.isArray( request.payload.articleIds ) ) {
    // TODO: update several articles at once
  } else {
    getArticle( request, reply, function(article) {
      if (!article) {
        return reply(Boom.badRequest('article not found'));
      }

      article.title = request.payload.article.title;
      article.published = request.payload.article.published;
      article.deck = request.payload.article.deck;

      var newSections = _.filter(request.payload.article.sections, function (item) {
        return !item._id;
      });
      request.payload.article.sections = _.filter(request.payload.article.sections, function (item) {
        return item._id;
      });

      Section.create(newSections, function (err, sections) {
        if( err ) { return reply( Boom.badRequest(err) ); }

        _.each(sections, function (item) {request.payload.article.sections.push(item);});
        _saveSections(request.payload.article.sections, function () {
          _updateArticle(request, reply, article);
        });
      });
    });
  }
}
function removeArticle( request, reply ){
  if( !_.contains(request.auth.credentials.access, 'sudo') && !_.contains(request.auth.credentials.access, 'admin') ) {
    return reply( Boom.badRequest() );
  }
  if( typeof request.params.id !== 'undefined' ) {
    getArticle( request, reply, function(article){
      if( article ) {
        var networkId = article.network;
        Article.remove({_id: request.params.id}, function (err) {
          if (err) { return reply(Boom.badRequest()); }

          if( networkId ) {
            Network.update({_id: networkId}, {$pull: {articles: request.params.id}}, {multi: false},
              function () {
                return reply({removed: true});
              });
          } else {
            return reply({removed: true});
          }
        });
      }
    });
  } else {
    return reply( Boom.badRequest() );
  }
}
module.exports = {
  get: getArticle,
  create: createArticle,
  update: updateArticle,
  remove: removeArticle
};