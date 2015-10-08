var coreUtils = require('./testUtils.js');

var LoginPageUtils = function () {
    'use strict';

    this.startTheLoginPage = function(width, height){
        browser.driver.manage().window().setSize(width, height);
        if(browser.params.subroute){
            return browser.get(browser.params.subroute);
        } else {
            return browser.get("/");
        }
    }
};

LoginPageUtils.prototype = coreUtils;

module.exports = new LoginPageUtils();