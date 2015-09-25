'use strict';

var server = {},
    getData = require('request');

var url;

/*
function produceTaxonomy( cmsData, newObject ){
  if( typeof newObject === 'undefined' ){
    newObject = { name: '', children: [] };
  }
  for( var x= 0, length = cmsData.length; x < length; x++ ){
    if( cmsData[x].node.parent === newObject.name ){
      newObject.children.push( {name: cmsData[x].node.name, id: cmsData[x].node.id, total: cmsData[x].node.total, weight: Number(cmsData[x].node.weight), children: [] } );
    }
  }
  for( var y= 0, length2 = newObject.children.length; y < length2; y++ ){
    produceTaxonomy( cmsData, newObject.children[y] );
  }
  newObject.children.sort( function(a,b) {
    return a.weight - b.weight;
  });
  return newObject;
}
*/
function getArticles( request, reply, nav ){


  if( request.params.articles && request.params.id ) {

    getData({
      url: url + '/get-article/' + request.params.id,
      json: true
    }, function (error, response, body) {
      if (!error && response.statusCode === 200) {
        reply.view('knowledge/_subDomain', {
          content: body.nodes,
          navigation: nav,
          lang: server.lang
        });
      }
    });

  }else {
    getData({
      url: url + '/get-articles', // + request.params.domain,
      json: true
    }, function (error, response, body) {
      if (!error && response.statusCode === 200) {
        reply.view('knowledge/_domain', {
          content: body.nodes,
          navigation: nav,
          lang: server.lang
        });
      }
    });
  }
}

module.exports = function (config, _server) {
    server = _server;
    url = config.CMS_URL;
    [
        {
            method: 'GET',
            path: '/knowledge/{articles}/{id?}',
            config: {
                handler: function( request, reply){
                  getArticles( request, reply, ['Information Technology']);
                }
            }
        }
    ]
        .forEach(function (route) { server.route(route); });
};
