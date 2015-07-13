'use strict';

var nodemailer = require('nodemailer');

var smtpTransport = nodemailer.createTransport('SMTP',{
  service: 'Mailgun',
  port: process.env.MAILGUN_SMTP_PORT,
  /*jshint camelcase: false */
  auth: {
    user: process.env.MAILGUN_SMTP_LOGIN,
    pass: process.env.MAILGUN_SMTP_PASSWORD,
    api_key: process.env.MAILGUN_API_KEY,
    domain: process.env.MAILGUN_SMTP_SERVER
  }
});

module.exports = function( mailObj, callback ) {
  smtpTransport.sendMail({
    from: mailObj.from,
    to: mailObj.to,
    subject: mailObj.subject,
    text: mailObj.text,
    html: mailObj.html
  }, callback);
};