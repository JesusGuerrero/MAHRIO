'use strict';

var lang1 = require('./locales/english')(),
    lang2 = require('./locales/spanish')(),
    selectedLanguage = lang1.lang;

module.exports = {
    get: function(){
      return selectedLanguage;
    },
    setlang: function( langName ){
        switch( langName ){
            case lang1.name:
                selectedLanguage = lang1.lang;
                break;
            case lang2.name:
                selectedLanguage = lang2.lang;
                break;
            default:
        }
    },
    getLangs: function(){
        return [ lang1.name, lang2.name ];
    }
};