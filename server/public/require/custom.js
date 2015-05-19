/* global $ */

'use strict';
$(window).load(function () {
  if( $('#loadVideoBG').length ){
    $('body').videoBG({
      position:'fixed',
      zIndex:0,
      mp4:'/assets/video/video.mp4',
      ogv:'assets/video/video.ogv',
      webm:'assets/video/video.webm',
      poster:'assets/video/video.jpg',
      opacity:1,
      fullscreen:true
    });
  }
  $('.status').fadeOut(1000);
  $('.preloader').delay(600).fadeOut(400);
});
$( function(){
  var $news = $('#newsletter');
  if( $news.length ){
    var $select = $('#domain'),
        domain;

    $select.change( function(){
      console.log( $(this).val() );
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