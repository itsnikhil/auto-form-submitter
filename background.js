// 
// Author: Nikhil Taneja (taneja.nikhil03@gmail.com)
// background.js (c) 2020
// Desc: Run code in background
// Created:  Thu Oct 08 2020 17:37:15 GMT+0530 (India Standard Time)
// Modified: Tue Oct 13 2020 18:52:16 GMT+0530 (India Standard Time)
// 

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.time) {
        chrome.alarms.clearAll();
        if (request.enabled === true) {
            chrome.alarms.create("autosubmit", { when: new Date().setHours(hour = request.time[0], min = request.time[1], sec = request.time[2]) });
        }
    }
    else if (request.type === 'showPageAction') {
        chrome.pageAction.show(sender.tab.id);
        chrome.pageAction.setIcon({ tabId: sender.tab.id, path: 'icon.png' })
    }
});

chrome.alarms.onAlarm.addListener((alarm) => {
    chrome.storage.sync.get(['time', 'enabled'], function (result) {
        if(result.enabled){
            chrome.tabs.query({ url: "*://forms.microsoft.com/Pages/ResponsePage.aspx?id=*" }, (formtabs) => {
                formtabs.forEach(tab => {
                    chrome.tabs.executeScript(tab.id, {
                        code:
                            `
                            if(document.querySelector(".office-form-bottom-button"))
                                document.querySelector(".office-form-bottom-button").click();
                            else console.log('Something went wrong!');
                            `
                    });
                });
            });
            chrome.tabs.query({ url: "*://forms.office.com/Pages/ResponsePage.aspx?id=*" }, (formtabs) => {
                formtabs.forEach(tab => {
                    chrome.tabs.executeScript(tab.id, {
                        code:
                            `
                                if(document.querySelector(".office-form-bottom-button"))
                                    document.querySelector(".office-form-bottom-button").click();
                                else console.log('Something went wrong!');
                                `
                    });
                });
            });
        }
        chrome.runtime.sendMessage({ success: true });
    });
});

