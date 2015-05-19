'use strict';

var mongoose = require('mongoose'),
  newsletterSchema, NewsletterList,
  questionSchema, QuestionList;

newsletterSchema = mongoose.Schema({
  name: {type: String, required: true},
  email: {type: String, required: true},
  domain: {type: String, required: true}
});

questionSchema = mongoose.Schema({
  name: {type: String, required: true},
  email: {type: String, required: true},
  question: {type: String, required: true }
});

NewsletterList = mongoose.model( 'NewsletterList', newsletterSchema);
QuestionList = mongoose.model( 'QuestionList', questionSchema);

module.exports = {
  marketing: NewsletterList,
  questions: QuestionList
};