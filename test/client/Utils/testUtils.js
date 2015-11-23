//var fs = require('fs');
var path = require('path');

var TestUtils = function () {
    'use strict';

    this.writeToLog = function (message, suiteName, isTitleMessage) {

        if (typeof message !== 'string') {
            message = 'WARNING: messaged was not a string';
        }
        var delimiter = '-',
            d = new Date(),
            dateString = d.getDate()  + '-' + (d.getMonth() + 1) + '-' + d.getFullYear() + ' ' + d.getHours() + ':' + d.getMinutes();
        if (isTitleMessage) {
            message = message.toUpperCase() + '\n';
        } else {
            delimiter = '--';
        }
        console.log(dateString + ' ' + suiteName + ' ' + delimiter + message);
    };

    this.pad = function (num, size) {
        var s = '000000000' + num;
        return s.substr(s.length - size);
    };

    this.generateScreenshotPathAndFilename = function (metadata) {
        var testSuiteName = metadata.testSuiteName;
        var paddedCounter = metadata.counter;
        var message = metadata.message;

        return browser.params.baseTestFolderName + path.sep + testSuiteName + path.sep + browser.params.browserName + path.sep +
          paddedCounter + '_' + message + '_' + browser.params.dimensions.width + 'x' + browser.params.dimensions.height + '.png';
    };

    this.findAccordionElement = function (name) {
        var foundEle = null;

        element.all(by.binding('group.displayName')).each(function(ele) {
            ele.getText().then(function(txt) {
                if (txt === name) {
                    foundEle = ele;
                }
            });
        }, function() {
            /* global self */
            self.writeToLog('ERROR - Stale element, rerunning search! ');
            element.all(by.binding('group.displayName')).each(function(ele) {
                ele.getText().then(function(txt) {
                    if (txt === name) {
                        foundEle = ele;
                    }
                });
            });
        });

        return browser.wait(function() {
            if (foundEle) { return foundEle; }
        }, 120000);

    };

    this.goBack = function(backButtonCSS) {
        return element(by.css(backButtonCSS)).click();
    };

    this.getAccordionElementByCSS = function (name, category) {
        var self = this;
        var deviceEle = null;
        element.all(by.css(category)).each(function (ele) {
            ele.getText().then(function (txt) {
                if (txt.indexOf(name) > -1) {
                    self.writeToLog('Element ' + name + ' found under accordion ' + category, 'testUtils.js');
                    deviceEle = ele;
                }
            });
        });

        return browser.wait(function () {
            if (deviceEle) {
                return deviceEle;
            }
        }, 120000);
    };

    this.waitForExpectedElementToBeClickableByCSS = function (expectedElementCSS, timeout) {

        this.writeToLog('waiting for expected element ' + expectedElementCSS + ' to be Clickable');

        var expectedElement = element(by.css(expectedElementCSS));

        if (timeout === undefined) {
            timeout = 10000;
        }

        return this.waitForExpectedElementToBeClickable(expectedElement, timeout);
    };

    this.waitForExpectedElementToBeVisibleByCSS = function (expectedElementCSS, timeout) {

        this.writeToLog('waiting for expected element ' + expectedElementCSS + ' to be Visible');

        var expectedElement = element(by.css(expectedElementCSS));

        if (timeout === undefined) {
            timeout = 10000;
        }

        return this.waitForExpectedElementToBeVisible(expectedElement, timeout);
    };

    this.waitForExpectedElementToBeInvisibleByCSS = function (expectedElementCSS, timeout) {

        this.writeToLog('waiting for expected element ' + expectedElementCSS + ' to be Invisible');

        var expectedElement = element(by.css(expectedElementCSS));

        return this.waitForExpectedElementToBeInvisible(expectedElement, timeout);
    };

    this.waitForExpectedElementToBeVisible = function (expectedElement, timeout) {

        if (timeout === undefined) {
            timeout = 10000;
        }
            /* global protractor */
        var EC = protractor.ExpectedConditions;
        return browser.wait(EC.visibilityOf(expectedElement), timeout).then(function (element) {
            return element;
        });
    };

    this.waitForExpectedElementToBeClickable = function (expectedElement, timeout) {

        if (timeout === undefined) {
            timeout = 10000;
        }
        /* global protractor */
        var EC = protractor.ExpectedConditions;
        return browser.wait(EC.elementToBeClickable(expectedElement), timeout).then(function (element) {
            return element;
        });
    };

    this.waitForExpectedElementToBeInvisible = function (expectedElement, timeout) {

        if (timeout === undefined) {
            timeout = 10000;
        }
        /* global protractor */
        var EC = protractor.ExpectedConditions;
        return browser.wait(EC.invisibilityOf(expectedElement), timeout).then(
            function (element) {
                return element;
            },
            function(error){
                if(error.name === 'StaleElementReferenceError'){
                    console.log('ignoring stale element, it\'s already invisible');
                } else if(error.name === 'NoSuchElementError') {
                    console.log('ignoring element, it\'s already invisible');
                } else {
                    throw error;
                }
            });
    };

    this.scrollIntoViewIfNotVisibleByCSS = function(elementCSS) {

        var targetedElement = element(by.css(elementCSS));

        return this.scrollIntoViewIfNotVisible(targetedElement);
    };

    this.scrollIntoViewIfNotVisible = function(targetedElement) {
        var self = this;

        return targetedElement.isDisplayed().then(function(isVisible){
            if(isVisible){
                return true;
            } else {
                return browser.executeScript(self.scrollIntoView, targetedElement.getWebElement());
            }
        });
    };

    this.scrollIntoView = function() {
        arguments[0].scrollIntoView();
    };

    this.clickWithRetryOnError = function (targetElement) {
        var self = this;

        expect(targetElement.isPresent()).toBeTruthy();
        expect(targetElement.isDisplayed()).toBeTruthy();

        targetElement.click().then(function(){
            return true;
        }, function(error){
            console.log('Error occurred clicking element...');
            if(error.message.indexOf('Element is not clickable at point') > -1){
                console.log('scrolling into view now..');
                return browser.executeScript(self.scrollIntoView, targetElement.getWebElement())
                    .then(function(){
                        console.log('and retrying click');
                        targetElement.click();
                    });
            } else {
                return error;
            }
        });
    };

    this.clickWithRetryOnErrorByCSS = function (elementCSS) {
        var targetElement = element(by.css(elementCSS));

        return this.clickWithRetryOnError(targetElement);
    };
    
};

module.exports = new TestUtils();