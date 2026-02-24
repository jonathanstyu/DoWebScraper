chrome.action.onClicked.addListener(async function(tab) {
  try {
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['content_script.js']
    });
  } catch (e) {
    // Content script may already be injected
  }
  chrome.tabs.sendMessage(tab.id, { action: "show" });
});
