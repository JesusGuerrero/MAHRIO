/* global require */
require.config({
  baseUrl: '/assets/require',
  map: {
    '*': { 'jquery': 'jquery-private'},
    'jquery-private': {'jquery': 'jquery'}
  }
});

require(['app/main'], function(main){
  'use strict';


  main.init();
});