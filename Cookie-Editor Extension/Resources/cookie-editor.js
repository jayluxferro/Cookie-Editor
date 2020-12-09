(function () {
    'use strict';

    const connections = {};
    const browserDetector = new BrowserDetector();

	browserDetector.getApi().runtime.onConnect.addListener(onConnect);
	browserDetector.getApi().runtime.onMessage.addListener(handleMessage);
	browserDetector.getApi().tabs.onUpdated.addListener(onTabsChanged);
    

    function handleMessage(request, sender, sendResponse) {
        
        switch (request.type) {
            case 'getTabs':
                browserDetector.getApi().tabs.query({}, function (tabs) {
                    sendResponse(tabs);
                });
                return true;

            case 'getCurrentTab':
                browserDetector.getApi().tabs.query({ active: true, currentWindow: true }, function (tabInfo) {
                    sendResponse(tabInfo);
                });
                return true;

            case 'getAllCookies':
                const getAllCookiesParams = {
                    url: request.params.url
                };
             
                browserDetector.getApi().cookies.getAll(getAllCookiesParams).then(sendResponse);
                
                return true;

            case 'saveCookie':
                browserDetector.getApi().cookies.set(request.params.cookie).then(cookie => {
                   sendResponse(null, cookie);
                }, error => {
                   
                   sendResponse(error.message, null);
                });
                return true;

            case 'removeCookie':
                const removeParams = {
                    name: request.params.name,
                    url: request.params.url
                };
                browserDetector.getApi().cookies.remove(removeParams).then(sendResponse);
                return true;
        }
    }

    function onConnect(port) {
        const extensionListener = function (request, sender, sendResponse) {
            
            switch (request.type) {
                case 'init':
                    
                    connections[request.tabId] = port;
                    return;
            }

            // other message handling
        };

        // Listen to messages sent from the DevTools page
        port.onMessage.addListener(extensionListener);

        port.onDisconnect.addListener(function(port) {
            port.onMessage.removeListener(extensionListener);
            const tabs = Object.keys(connections);
            let i = 0;
            const len = tabs.length;
            for (; i < len; i++) {
            if (connections[tabs[i]] === port) {
                
                delete connections[tabs[i]];
                break;
            }
            }
        });
    }

    function sendMessageToTab(tabId, type, data) {
        if (tabId in connections) {
            connections[tabId].postMessage({
                type: type,
                data: data
            });
        }
    }

    function sendMessageToAllTabs(type, data) {
        const tabs = Object.keys(connections);
        let i = 0;
        const len = tabs.length;
        for (; i < len; i++) {
            sendMessageToTab(tabs[i], type, data);
        }
    }

    function onCookiesChanged(changeInfo) {
        
        sendMessageToAllTabs('cookiesChanged', changeInfo);
    }

    function onTabsChanged(tabId, changeInfo, tab) {
        sendMessageToTab(tabId, 'tabsChanged', changeInfo);
    }


}());
