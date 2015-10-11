var configUtils = require('./client/Utils/configUtils.js');
var path = require('path');

exports.config = {

    suites: {
        sanityTests: './e2e/frontend/sanityTests.spec.js',
    },
    params: {
        targetServerName: 'ADT Pulse Test',
        //requestedSiteName: "GDC Essentel",
        login: {
            user: 'YOURLOGIN@SERVER.com',
            password: 'YOURPASS'
        },

        dimensions: {
            //mobile size
            //width: 375,
            //height: 667


            //tablet size
            //width: 1200,
            //height: 800

            //minimum desktop size
            width: 1200,
            height: 800
        },
        defaultTimeoutInterval: 1000,
        enableDesktopMode: true
    },
    capabilities: {
        // For Internet Explorer Only
        //'browserName': 'internet explorer',
        //'platform': 'ANY'

        'browserName': 'chrome',
        'chromeOptions': {
            args: ['--test-type']
        }

        //'browserName': 'safari' // firefox or safari
    },

    jasmineNodeOpts: {
        showColors: true,
        defaultTimeoutInterval: 60000
    },
    baseUrl: 'http://localhost:9000',
    onPrepare: function () {

        browser.getProcessedConfig().then(function(config) {
            console.log("Processing Config....");
            browser.params.browserName = config.capabilities.browserName.split(' ').join('_');

            var settingsSuggestion = configUtils.assessClientSelection(browser.params.enableDesktopMode , { "height" : browser.params.dimensions.height,
                                                                                             "width" : browser.params.dimensions.width});

            browser.params.testDeviceType = settingsSuggestion.testDeviceType;

            if (settingsSuggestion.enableDesktopMode) {
                browser.params.enableDesktopMode = settingsSuggestion.enableDesktopMode;
            }

            var testSuites = configUtils.extractTestSuites(config);

            testSuites.forEach(function(suiteName) {
                var fullPath = configUtils.createFolderPath(suiteName);
                configUtils.createFolder(fullPath);
            });

            console.log("Done processing config.");
        });
    }
};
