'use strict';

//var nodemailer = require('nodemailer');
var Mailgun = require('mailgun-js');
var from_who = 'doNotReply@whichdegree.co';

module.exports = function( mailObj ) {
  var mailgun = new Mailgun({apiKey: process.env.MAILGUN_API_KEY, domain: process.env.MAILGUN_DOMAIN });

  var data = {
    from: from_who,
    to: mailObj.to,
    subject: mailObj.text,
    html: mailObj.html
  };

  //Invokes the method to send emails given the above data with the helper library
  mailgun.messages().send(data, function (err, body) {
    //If there is an error, render the error page
    if (err) {
      console.log("got an error: ", err);
    } else {
      console.log(body);
    }
  });
};