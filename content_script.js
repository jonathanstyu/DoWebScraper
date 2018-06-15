chrome.runtime.onMessage.addListener(function(message, sender, sendResponse){
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

  if (message['action'] == "grab") {
    const param = message['param']; 
    console.log(param);
    
    sendResponse({"res": document.body.querySelectorAll()})
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

})