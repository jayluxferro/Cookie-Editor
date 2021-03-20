
function GenericCookieHandler() {
    'use strict';
    Event.call(this);

    this.cookies = [];
    this.currentTab = null;
    const browserDetector = new BrowserDetector();

    this.getAllCookies = function(callback) {
        browserDetector.getApi().cookies.getAll({
            url: this.currentTab.url,
            storeId: this.currentTab.cookieStoreId
        }).then(callback, function (e) {
            
        });
    };

    this.saveCookie = function(cookie, url, callback) {
        const newCookie = {
            domain: cookie.domain || '',
            name: cookie.name || '',
            value: cookie.value || '',
            path: cookie.path || null,
            secure: cookie.secure || null,
            httpOnly: cookie.httpOnly || null,
            expirationDate: cookie.expirationDate || null,
            storeId: cookie.storeId || this.currentTab.cookiesStoreId || null,
            url: url
        };

        
        
        if (cookie.hostOnly) {
            newCookie.domain = null;
        }

        if (browserDetector.supportSameSiteCookie()) {
            newCookie.sameSite = cookie.sameSite || undefined;
        }
        
        delete newCookie.domain; // not needed in Safari
        
        browserDetector.getApi().cookies.set(newCookie).then(cookie => {
            if (callback) {
                callback(null, cookie);
            }
        }, error => {
            
            if (callback) {
                callback(error.message, null);
            }
        });
        
    };

    this.removeCookie = function(name, url, callback) {
        browserDetector.getApi().cookies.remove({
            name: name,
            url: url
        }).then(callback, function (e) {
            
            if (callback) {
                callback();
            }
        });
    };
}
