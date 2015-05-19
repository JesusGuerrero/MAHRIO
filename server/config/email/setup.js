var get = require('request');

var recipients = {
  newsletter: 'jesus.rocha@whichdegree.co,emcp@whichdegree.co',
  questions: 'jesus.rocha@whichdegree.co,emcp@whichdegree.co'
};

module.exports = function sendEmail( to, subject, message, type){
  'use strict';
  var urlPath = 'http://127.0.0.1/~whichdegree/sendmail.php';

  switch( type ){
    case 'newsletter':
      to = recipients.newsletter;
      break;
    case 'question':
      to = recipients.questions;
      break;
    default :
  }
  get(urlPath + '?to='+encodeURI(to)+'&subject='+encodeURI(subject)+'&message='+encodeURIComponent(message));

};