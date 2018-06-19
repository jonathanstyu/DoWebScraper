
// If your extension needs to interact with web pages, then it needs a content script.

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse){

  // Create the pop out web page
  var iframe = document.createElement('iframe');
  iframe.name = "customScraperiFrame";
  iframe.style.background = "grey";
  iframe.style.height = "100%";
  iframe.style.width = "0px";
  iframe.style.position = "fixed";
  iframe.style.top = "0px";
  iframe.style.right = "0px";
  iframe.style.zIndex = "9000000000000000000";
  iframe.frameBorder = "none";
  iframe.src = chrome.extension.getURL("page.html")

  // Grab elements from the DOM page and then send it back 
  if (message['action'] == "grab") {
    let param = message['param']; 
    let responseObject = []; 
    // let nodeCollection = document.querySelectorAll(param); 
    let nodeCollection = document.getElementsByTagName(param); 

    for (var i = 0; i < nodeCollection.length; i ++) {
      responseObject[i] = nodeCollection[i].innerHTML; 
    }

    sendResponse({
      "res": responseObject,
      "selector": param
    })
  }

  document.body.appendChild(iframe);

  if (message['action'] == "show"){
    iframe.style.width= "400px";
  }

  if (message['action'] == "close") {
    var frames = document.getElementsByName('customScraperiFrame')
    for (var i = 0; i < frames.length; i++) {
      frames[i].parentElement.removeChild(frames[i])
    }
  }

  if (message['action'] == 'download') {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(message['data']));
    element.setAttribute('download', "file.txt");

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  }

})