function BrowserDetector() {
    'use strict';
    
    let namespace = window.browser;
    let doesSupportSameSiteCookie = null;

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
            this.getApi().cookies.set(newCookie).then(cookie => {
                doesSupportSameSiteCookie = true;
            }, error => {
                
                doesSupportSameSiteCookie = false;
            });
        } catch(e) {
            doesSupportSameSiteCookie = false;
        }

        return doesSupportSameSiteCookie;
    }

    // We call it right away to make sure the value of doesSupportSameSiteCookie is initialized 
    this.supportSameSiteCookie();
}
