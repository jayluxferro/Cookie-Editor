
function CookieHandler() {
    'use strict';
    GenericCookieHandler.call(this);

    const self = this;
    let isInit = false;
    const browserDetector = new BrowserDetector();
    browserDetector.getApi().tabs.query({ active: true, currentWindow: true }).then(init);

    function init(tabInfo) {
        self.currentTabId = tabInfo[0].id;
        self.currentTab = tabInfo[0];

        browserDetector.getApi().cookies.onChanged.addListener(onCookiesChanged);
        browserDetector.getApi().tabs.onUpdated.addListener(onTabsChanged);
        browserDetector.getApi().tabs.onActivated.addListener(onTabActivated);

        isInit = true;
        self.emit('ready');
    }

    function onCookiesChanged(changeInfo) {
        const domain = changeInfo.cookie.domain.substring(1);
        if (self.currentTab.url.indexOf(domain) !== -1 && changeInfo.cookie.storeId === (self.currentTab.cookieStoreId || '0')) {
            self.emit('cookiesChanged', changeInfo);
        }
    }
    function onTabsChanged(tabId, changeInfo, tab) {
        if (tabId === self.currentTabId && (changeInfo.url || changeInfo.status === 'complete')) {
            browserDetector.getApi().tabs.query({ active: true, currentWindow: true }).then(updateCurrentTab);
        }
    }

    function onTabActivated(activeInfo) {
        browserDetector.getApi().tabs.query({ active: true, currentWindow: true }).then(updateCurrentTab);
    }

    function updateCurrentTab(tabInfo) {
        const newTab = tabInfo[0].id !== self.currentTabId || tabInfo[0].url !== self.currentTab.url;
        self.currentTabId = tabInfo[0].id;
        self.currentTab = tabInfo[0];
        
        if (newTab && isInit) {
            self.emit('cookiesChanged');
        }
    }
}
