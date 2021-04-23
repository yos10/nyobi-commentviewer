'use strict';
chrome.webNavigation.onCompleted.addListener(function(data) {
  if(data.url.includes('nnn.ed.nico/lessons/')) {
    chrome.tabs.executeScript(null, { file: 'script.js' });
  }
});