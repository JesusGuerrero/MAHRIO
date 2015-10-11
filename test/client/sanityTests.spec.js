var commonUtils = require('./Utils/testUtils.js');
var loginPageUtils = require('./Utils/loginPageUtils.js');
var dashboardPageUtils = require('./Utils/dashboardPageUtils.js');
var path = require('path');

// Uncomment to enable bailing on first failed test
//require('jasmine-bail-fast');
//jasmine.getEnv().bailFast();

describe("Mahrio dashboard", function () {

    var suiteName = "sanityTests";
    browser.ignoreSynchronization = true;

    var width = browser.params.dimensions.width;
    var height = browser.params.dimensions.height;
    var screencapCounter = 0;

    var writeToLog = function (message, isTitleMessage) {
        commonUtils.writeToLog(message, suiteName, isTitleMessage);
    };

    var writeTitleToLog = function (message) {
        commonUtils.writeToLog(message, suiteName, true);
    };

    var takeScreenCap =  function (message) {
        //todo deprecated, switch to the Jasmine Reporters
        //message = message.split(' ').join('_');
        //var paddedCounter = utils.pad(screencapCounter, 3);
        //var fullImageFilenameAndPath = browser.params.baseTestFolderName + path.sep + suiteName + path.sep + browser.params.browserName + path.sep + paddedCounter + "_" + message + "_" + width + "x" + height + ".png";
        //page.takeAScreenShot(fullImageFilenameAndPath).then(function() {
        //    screencapCounter++;
        //});
    };

    describe("login", function () {

        it("should set the screen resolution and go to the login page", function () {
            loginPageUtils.startTheLoginPage(browser.params.dimensions.width, browser.params.dimensions.height)
        });

        it("should have a proper title", function () {
            expect(browser.getTitle()).toEqual("Welcome to Mahr.io");
            takeScreenCap("it should go to login page");
        });

        beforeEach(function(){
            writeToLog("Executing " + jasmine.getEnv().currentSpec.description);
        });

        afterEach(function() {
            var passed = jasmine.getEnv().currentSpec.results().passed();
            if (!passed) {
                takeScreenCap("FAILEDTESTCASE_" + jasmine.getEnv().currentSpec.description);
            }
        });

    });

    describe('logout', function() {
         it("should logout", function() {
            dashboardPageUtils.logout().then(function(){
                utils.waitForExpectedElementToBeVisible(loginPageUtils.loginBtn,90000);
                expect(loginPageUtils.loginBtn.isDisplayed()).toBeTruthy();
            });
         });

        beforeEach(function(){
            writeToLog("Executing " + jasmine.getEnv().currentSpec.description);
        });

        afterEach(function() {
            var passed = jasmine.getEnv().currentSpec.results().passed();
            if (!passed) {
                takeScreenCap("FAILEDTESTCASE_" + jasmine.getEnv().currentSpec.description);
            }
        });
    });
});