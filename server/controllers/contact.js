
var server,
  Contact = require('mongoose').model('Contact'),
  Boom = require('boom');

module.exports = function(config, _server){
  'use strict';
  server = _server;

  function addNewsletterEntry( request, reply ){
    var entry = new Contact( request.payload );

    entry.save( function(error) {
      if( error ) { reply(Boom.badRequest('Bad request')); }

      return reply( {message: 'success'} );
    });
  }
  function addQuestionEntry( request, reply ){
    var entry = new Contact( request.payload );

    entry.save( function(error) {
      if( error ) { reply(Boom.badRequest('Bad request')); }

      return reply( {message: 'success'} );
    });
  }
  [
    {
      method: ['OPTIONS'],
      path: '/api/contact/{action}/{id?}',
      config: {
        handler: function(request, reply){
          reply();
        }
      }
    },
    {
      method: ['OPTIONS'],
      path: '/admin/{action}/{id?}',
      config: {
        handler: function(request, reply){
          reply();
        }
      }
    },
    {
      method: 'POST',
      path: '/api/contact/{option}',
      config: {
        handler: function( request, reply ){
          switch( request.params.option ){
            case 'newsletter':
              /*server.sendEmail( null, 'Newsletter: '+request.payload.name + '<'+request.payload.email+'>',
                request.payload.domain, 'newsletter' );*/
              addNewsletterEntry( request, reply );
              break;
            case 'question':
              /*server.sendEmail( null, 'Question: '+request.payload.name + '<'+request.payload.email+'>',
                request.payload.question, 'question' );*/
              addQuestionEntry( request, reply );
              break;
            default:
              reply();
          }
        }
      }
    },
    {
      method: ['GET','DELETE'],
      path: '/admin/questions/{id?}',
      config: {
        handler: function( request, reply ){
          if( request.method === 'get' ) {
            Contact.find(function (err, list) {
              if (err) {
                reply(Boom.badRequest('Bad request'));
              }

              return reply({
                list: list
              });
            });
          }else if( request.method === 'delete' && request.params.id ){
            Contact.findById( request.params.id, function(err, entry){
              if (err || !entry) {
                return reply(Boom.badRequest(err));
              }

              entry.remove();
              reply({removed: true});
            });
          }
        },
        auth: 'simple'
      }
    },
    {
      method: ['GET','DELETE'],
      path: '/admin/newsletter/{id?}',
      config: {
        handler: function( request, reply ){
          if( request.method === 'get' ) {
            Contact.find(function (err, list) {
              if (err) {
                reply(Boom.badRequest('Bad request'));
              }

              return reply({
                list: list
              });
            });
          }else if( request.method === 'delete' && request.params.id ){
            Contact.findById( request.params.id, function(err, entry){
              if (err || !entry) {
                return reply(Boom.badRequest(err));
              }

              entry.remove();
              reply({removed: true});
            });
          }
        },
        auth: 'simple'
      }
    }
  ]
    .forEach( function(route){ server.route( route ); });
};