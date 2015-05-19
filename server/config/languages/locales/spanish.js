'use strict';

var spanishLanguage = {
    buttons: {
        learnMore: 'Aprende Mas',
        getStarted: 'Empiesa'
    },
    components: {
        callToAction: {
            header: 'Facil y Seguro',
            body: 'Un parafo en espano para comparar'
        }
    }
};


module.exports = function(){

    return {
        name: 'spanish',
        lang: spanishLanguage
    };
};