function BrowserDetector() {
    'use strict';
    let namespace = browser;
    let browserName;
    let doesSupportSameSiteCookie = null;



    let supportPromises = false;
    try {
        supportPromises = namespace.runtime.getPlatformInfo() instanceof Promise;
    }
        catch (e) {
    }

    this.getApi = function () {
        return namespace;
    };

    this.supportSameSiteCookie = function () {
        if (doesSupportSameSiteCookie !== null) {
            return doesSupportSameSiteCookie;
        }

        const newCookie = {
            url: 'https://fakeDomain.com/',
            name: 'testSameSite',
            value: 'someValue',
            sameSite: 'strict',
        };

        try {
            this.getApi().cookies.set(newCookie, (cookieResponse) => {
                let error = this.getApi().runtime.lastError;
                if (!cookieResponse || error) {
                    
                    doesSupportSameSiteCookie = false;
                    return;
                }
                doesSupportSameSiteCookie = true;
            });
          
        } catch(e) {
            doesSupportSameSiteCookie = false;
        }

        return doesSupportSameSiteCookie;
    }

    // We call it right away to make sure the value of doesSupportSameSiteCookie is initialized 
    this.supportSameSiteCookie();
}
