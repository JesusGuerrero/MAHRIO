'use strict';

var async = require('async'),
  _ = require('underscore'),
  Boom = require('boom'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Article = mongoose.model('Article'),
  Media = mongoose.model('Media'),
  Section = mongoose.model('Section');

function createArticle( request, reply ) {
  if( !request.payload.article || (!_.contains(request.auth.credentials.access, 'admin')&&!_.contains(request.auth.credentials.access, 'sudo')) ) {
    return reply( Boom.badRequest() );
  }

  Section.create( request.payload.article.sections, function(err, sections) {
    if( err ) { return Boom.badRequest(err); }

    request.payload.article.sections = Object.keys(_.indexBy(sections, '_id'));
    request.payload.article.creator = request.auth.credentials.id;
    Article.create( request.payload.article, function(err, event){
      if( err ) { return reply( Boom.badRequest(err) ); }

      return reply({event: event});
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
    .find( )
    .populate('widgets sections media coverImage')
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
    Article.remove({_id: request.params.id}, function (err) {
      if (err) { return reply(Boom.badRequest()); }

      return reply({removed: true});
    });
  } else {
    return reply( Boom.badRequest() );
  }
}
/*
function getArticle( request, reply, next ) {
  var query, key;
  if( request.params.id ) {
    query = Article.findOne({_id: request.params.id});
    key = 'article';
  } else {
    query = Article.find({});
    key = 'articles';
  }

  query
    .and([{
      _removed: false
    }])
    .populate([{
      path: 'widgets'
    },{
      path: 'sections'
    }, {
      path: '_creator',
      select: 'email firstName lastName'
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
function _createSections( sections ) {
  return Section.create( sections );
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
function updateArticle( request, reply ) {
  if( !_.contains(request.params.credentials.access, 'admin') ) {
    return reply( Boom.forbidden() );
  }

  getArticle( request, reply, function( article ) {
    if( !article ) {
      return reply(Boom.badRequest('article not found'));
    }

    var newSections = _.filter( request.payload.article.sections, function(item){ return !item._id; });
    request.payload.article.sections = _.filter( request.payload.article.sections, function(item){ return item._id; });

    _createSections( newSections )
      .then(function( sections ){
        _.each( sections, function(item){ request.payload.article.sections.push(item); });
        _saveSections( request.payload.article.sections, function() {
          _updateArticle( request, reply, article);
        });
      });
  });
}

function _createArticle( request ){
  request.payload.article._creator = request.auth.credentials.id;

  return new Article( request.payload.article ).save();
}
function createArticle( request, reply ) {
  if( !_.contains(request.params.credentials.access, 'admin') ) {
    return reply( Boom.forbidden() );
  }
  if( !request.payload.article ) {
    return reply( Boom.badRequest() );
  }

  _createSections( request.payload.article.sections )
    .then(function(sections){
      request.payload.article.sections = [];
      _.each( sections, function(item){ request.payload.article.sections.push(item.id); });
      _createArticle(request)
        .then( function(article) {
          return reply({article: article});
        }, function(err){
          return reply( Boom.badRequest(err) );
        });
    }, function(err){
      return reply( Boom.badRequest(err) );
    });
}

function removeArticle(request, reply){
  if( !_.contains(request.params.credentials.access, 'admin') ) {
    return reply( Boom.forbidden() );
  }

  getArticle( request, reply, function( article ) {
    if( !article ) {
      return reply(Boom.badRequest('article not found'));
    }
    article._removed = true;

    article.save( function(err) {
      if( err ) { return reply( Boom.badRequest(err )); }
      reply({removed: true});
    });
  });
}*/

module.exports = {
  get: getArticle,
  create: createArticle,
  update: updateArticle,
  remove: removeArticle
};