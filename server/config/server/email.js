'use strict';

var Mailgun = require('mailgun-js');
var fromWho = 'WhichDegree <do-not-reply@whichdegree.co>';

module.exports = function( mailObj ) {
  var mailgun = new Mailgun({apiKey: process.env.MAILGUN_API_KEY, domain: process.env.MAILGUN_DOMAIN });

  var data = {
    from: fromWho,
    to: mailObj.to,
    subject: mailObj.subject,
    html: mailObj.html
  };

  //Invokes the method to send emails given the above data with the helper library
  mailgun.messages().send(data, function (err, body) {
    //If there is an error, render the error page
    if (err) {
      console.log('got an error: ', err);
    } else {
      console.log(body);
    }
  });
};