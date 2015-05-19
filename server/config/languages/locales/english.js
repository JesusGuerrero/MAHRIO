'use strict';

var englishLanguage = {
  buttons: {
    learnMore: 'Have Questions? We don\'t bite',
    getStarted: 'Sign Me Up!',
    login: 'Login',
    register: 'Register',
    askQuestion: 'Ask A Question'
  },
  components: {
    callToAction: {
      header: 'Candid and Experienced Degree Knowledge',
      body: 'WhichDegree.co is a domain-based degree exploration platform designed to connect you to professionals. '+
      'Our mission is to deliver straight-talk from professionals, and we start with Information Technology;  '+
      'the domain which got us here. ',
      readMore: 'Read More',
      formTitle: 'Free Domain-Knowledge News'
    }
  },
  forms: {
    labels: {
      name: 'Name',
      email: 'Email',
      message: 'Message',
      question: 'Question',
      selectDomain: 'Domain',
      tellUsDomain: 'Tell Us Your Domain...'
    }
  },
  sr: {
    toggleNavigation: 'Toggle navigation'
  }
};

englishLanguage.components.navigation = {
  title: 'WebTech',
  backToApp: 'Back To App',
  domains: {
    title: 'Domains',
    moreToCome: 'More to Come!'
  },
  login: englishLanguage.buttons.login,
  register: englishLanguage.buttons.register,
  logout: 'Logout',
  myAccount: 'My Account'
};


module.exports = function(){
  return {
    name: 'english',
    lang: englishLanguage
  };
};