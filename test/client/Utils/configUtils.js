var mkdirp = require('mkdirp');
var path = require('path');

var ConfigUtils = function () {
    'use strict';

    this.createFolder = function(folderName) {
        mkdirp(folderName, function(err) {
            if(err){
                console.error(err);
            } else {
                console.log("successfully created " + folderName);
            }
        });
    };

    this.createFolderPath = function(suiteName) {
        return path.join(browser.params.baseTestFolderName, path.sep + suiteName + path.sep + browser.params.browserName);
    };

    //this.extractUserAgentString = function(config) {
    //
    //    var userAgentString = "";
    //
    //    if (browser.params.browserName !== 'chrome') {
    //        return userAgentString;
    //    }
    //
    //    config.capabilities.chromeOptions.args.forEach(function(chromeOption) {
    //        console.log(chromeOption);
    //        if(chromeOption.indexOf('user-agent') > -1){
    //            userAgentString = chromeOption;
    //        }
    //    });
    //
    //    return userAgentString;
    //};

    this.extractTestSuites = function(config) {

        var suites = [];

        for(var suiteName in config.suites){
            suites.push(suiteName);
        }

        return suites;
    };

    this.assessClientSelection = function(enableDesktopMode, selectedResolution) {
        console.log("Assessing Client Selection for testing... ");

        var settingsSuggestion = {};

        if (enableDesktopMode == true) {
            settingsSuggestion = {
                "enableDesktopMode" : true,
                "testDeviceType" : "desktop",
                "width" : 1200,
                "height" : 800
            };
        } else if (enableDesktopMode == false && selectedResolution.width == 375 && selectedResolution.height == 667) {
            console.log("Suggesting 375x667 resolution");

            settingsSuggestion = {
                "testDeviceType" : "mobile",
                "width" : 375,
                "height" : 667
            };
        } else if (enableDesktopMode == false && selectedResolution.width == 1200 && selectedResolution.height == 800) {
            console.log("Suggesting 1200x800 resolution");
            settingsSuggestion = {
                "testDeviceType" : "tablet",
                "width" : 1200,
                "height" : 800
            };
        } else {
            throw "Unrecognized client selection, please examime your resolution and enableDesktopMode Settings: enableDesktopMode="
                + enableDesktopMode + " @ " + selectedResolution.width + " x " + selectedResolution.height;
        }

        if( (selectedResolution.height != settingsSuggestion.height) || (selectedResolution.width != settingsSuggestion.width)) {
            throw "Incorrect resolution chosen, please change to " + settingsSuggestion.height +"h x " + settingsSuggestion.width + "w";
        }

        return settingsSuggestion;
    };
};

module.exports = new ConfigUtils();