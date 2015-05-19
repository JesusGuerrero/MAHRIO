/* global define */

define(['jquery'], function($){
  'use strict';

  var $news = $('#newsletter');
  if( $news.length ){
    var $select = $('#domain'),
      domain;

    $select.change( function(){
      switch ($(this).val() ){
        case 'custom':
          $('#otherDomain').show( 'slow' );
          domain = $('#otherDomain input');
          break;
        default:
          $('#otherDomain').hide( 'fast' );
          domain = $(this);
      }
    });

    $news.submit( function( event ){
      event.preventDefault();
      $('#valid').hide();

      if( typeof domain === 'undefined'){
        $('#error').show();
        return;
      }
      var obj = {
        name: document.forms.newsletter.name.value,
        email: document.forms.newsletter.email.value,
        domain: domain.val()
      };

      if( obj.name === '' || obj.email === ''){
        $('#error').show();
        return;
      }

      $.ajax( {url: '/api/contact/newsletter', data: obj, type: 'POST',
        success: function(){
          $('#error').hide();
          $('#valid').show();
          document.forms.newsletter.name.value = '';
          document.forms.newsletter.email.value = '';

          //show success
        }
      });
    });
  }
});