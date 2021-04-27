'use strict';

// アクティブなタブのIDを取得する
// https://developer.chrome.com/docs/extensions/reference/tabs/#get-the-current-tab
async function getCurrentTabId() {
  let queryOptions = { active: true, currentWindow: true };
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab.id;
}

chrome.webNavigation.onCompleted.addListener(async (data) => {
  if (data.url.includes('nnn.ed.nico/contents/lessons/')) {
    console.dir(data);
    let tabId = await getCurrentTabId();
    // https://developer.chrome.com/docs/extensions/reference/scripting/#type-ScriptInjection
    chrome.scripting.executeScript(
      {
        target: { tabId: tabId },
        files: ['script.js'],
      },
    );
  }
});
