// 
// Author: Nikhil Taneja (taneja.nikhil03@gmail.com)
// content_script.js (c) 2020
// Desc: description
// Created:  Sun Oct 11 2020 12:56:31 GMT+0530 (India Standard Time)
// Modified: Tue Oct 13 2020 18:50:20 GMT+0530 (India Standard Time)
// 

chrome.storage.sync.set({ 'enabled': false }, () => { });
chrome.runtime.sendMessage({type: 'showPageAction'});