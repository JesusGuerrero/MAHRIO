/* global define */

define(['jquery'], function($){
  'use strict';

  var $questions = $('#questions');
  if( $questions.length ){

    $questions.submit( function( event ){
      event.preventDefault();
      $('#valid').hide();

      var obj = {
        name: document.forms.questions.name.value,
        email: document.forms.questions.email.value,
        question: document.forms.questions.question.value
      };

      if( obj.name === '' || obj.email === '' || obj.question === ''){
        $('#error').show();
        return;
      }

      $.ajax( {url: '/api/contact/question', data: obj, type: 'POST',
        success: function(){
          $('#error').hide();
          $('#valid').show();
          document.forms.questions.name.value = '';
          document.forms.questions.email.value = '';
          document.forms.questions.question.value = '';
        }
      });
    });
  }
});