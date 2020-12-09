
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
    }

    this.saveCookie = function(cookie, url, callback) {
        const newCookie = {
            domain: cookie.domain || '',
            name: cookie.name || '',
            value: cookie.value || '',
            path: cookie.path || null,
            secure: cookie.secure || null,
            httpOnly: cookie.httpOnly || null,
            expirationDate: cookie.expirationDate || null,
            storeId: cookie.storeId || this.currentTab.cookieStoreId || null,
            url: url
        };

        if (cookie.hostOnly) {
            newCookie.domain = null;
        }

        if (browserDetector.supportSameSiteCookie()) {
            newCookie.sameSite = cookie.sameSite || undefined;
        }
        
       
        browserDetector.getApi().cookies.set(newCookie, (cookieResponse) => {
            let error = browserDetector.getApi().runtime.lastError;
            if (!cookieResponse || error) {
                
                if (callback) {
                    let errorMessage = (error ? error.message : '') || 'Unknown error';
                    return callback(errorMessage, cookieResponse);
                }
                return;
            }

            if (callback) {
                return callback(null, cookieResponse);
            }
        });
    };

    this.removeCookie = function(name, url, callback) {
        browserDetector.getApi().cookies.remove({
            name: name,
            url: url,
            storeId: this.currentTab.cookieStoreId
        }, (cookieResponse) => {
            let error = browserDetector.getApi().runtime.lastError;
            if (!cookieResponse || error) {
                
                if (callback) {
                    let errorMessage = (error ? error.message : '') || 'Unknown error';
                    return callback(errorMessage, cookieResponse);
                }
                return;
            }

            if (callback) {
                return callback(null, cookieResponse);
            }
        });
    }
}
