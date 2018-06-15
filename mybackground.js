chrome.browserAction.onClicked.addListener(function(tab){
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
      chrome.tabs.sendMessage(tabs[0].id, {"action": "show"});
  })
  chrome.tabs.executeScript(null, {
    file: 'content_script.js'
  });


});
