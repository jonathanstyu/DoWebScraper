
// If your extension needs to interact with web pages, then it needs a content script.

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse){

  // Create the pop out web page
  if (message['action'] == 'show' && document.getElementById("customScraperiFrame") == null) {
    var iframe = document.createElement('iframe');
    var iframeHeight = document.body.offsetHeight; 
    iframe.id = "customScraperiFrame";
    iframe.style.height = iframeHeight+"px";
    iframe.style.width = "0px";
    iframe.style.position = "fixed";
    iframe.style.top = "0px";
    iframe.style.right = "0px";
    iframe.style.zIndex = "9000000000000000000";
    iframe.frameBorder = "none";
    iframe.src = chrome.extension.getURL("page.html")
    document.body.appendChild(iframe);
  }

  // Grab elements from the DOM page and then send it back 
  if (message['action'] == "grab") {
    let param = message['param']; 
    let responseObject = []; 
    let nodeCollection = document.querySelectorAll(param); 

    for (var i = 0; i < nodeCollection.length; i ++) {
      responseObject[i] = nodeCollection[i].innerHTML; 
    }

    sendResponse({
      "res": responseObject,
      "selector": param
    })
  }

  if (message['action'] == "clear") {

  }

  if (message['action'] == "show"){
    let iframe = document.getElementById("customScraperiFrame"); 
    iframe.style.width= "400px";
  }

  if (message['action'] == "close") {
    let iframe = document.getElementById("customScraperiFrame"); 
    iframe.parentNode.removeChild(iframe); 
  }

  if (message['action'] == 'download') {
    var element = document.createElement('a');
    
    if (message['format'] == 'txt') {
      element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(message['data']));
      element.setAttribute('download', "file.txt");
    } 

    if (message['format'] == 'csv') {  
      let csvContent = '';
      message['data'].forEach((rowArray, i) => {
        let row = [i, rowArray].join(',');
        csvContent += row + "\r\n";
      })
      var blobdata = new Blob([csvContent],{type : 'text/csv'});
      element.setAttribute('href', window.URL.createObjectURL(blobdata));
      element.setAttribute('download', "file.csv");
    }

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  }

})