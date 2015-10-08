var coreUtils = require('./testUtils.js');

var DashboardPageUtils = function () {
    'use strict';

    this.startTheDashboardPage = function(width, height){
        browser.driver.manage().window().setSize(width, height);
        if(browser.params.subroute){
            return browser.get(browser.params.subroute);
        } else {
            return browser.get("/");
        }
    }
};

DashboardPageUtils.prototype = coreUtils;

module.exports = new DashboardPageUtils();