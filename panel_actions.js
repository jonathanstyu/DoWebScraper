// Actions JS for using to scrape

document.getElementById('XXscrapeButton').addEventListener("click", function () {
  var cssSelector = document.getElementById("CSSinput").value;
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
    // chrome.tabs.sendMessage(tabs[0].id, {"action": "grab", "param": cssSelector}, (response) => {     
    //   console.log("response"); 
    //   console.log(response);
      
    //   displayResults(response['res']);
    // });

    chrome.tabs.executeScript({
      code: '(' + function(selector) {
        let nodeCollection = document.body.querySelectorAll(selector); 
        var responseObject = []; 
        for (var i = 0; i < nodeCollection.length; i++) {
          responseObject[i] = nodeCollection[i].innerHTML; 
        }
        return {
          success: true, 
          html: JSON.stringify(responseObject), 
          selector: selector
        };
      } + ')(' + JSON.stringify(cssSelector) + ');' 
    }, function(results) {
      displayResults(results); 
    });
  })
})


// Closes the window 
var closeButton = document.getElementById('XXcloseButton');
closeButton.addEventListener("click", function () {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
      chrome.tabs.sendMessage(tabs[0].id, {"action": "close"});
  })
})

// Download last results 
var downloadButton = document.getElementById('XXtxtDL');
downloadButton.addEventListener("click", function () {
  let downloadText = document.getElementById("xxCurrentStorage").innerText;   
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
    chrome.tabs.sendMessage(tabs[0].id, {"action": "download", "data": downloadText});
  })
})

// ****  Actions

function displayResults(res) {
  // Fill in the stats in display
  try {
    let parsedResponse = JSON.parse(res[0]['html']); 
    document.getElementById('XXstatusDisplay').innerHTML = parsedResponse.length; 
    document.getElementById('XXselectorDisplay').innerHTML = res[0].selector; 
    document.getElementById('xxCurrentStorage').innerText = parsedResponse; 

    var table = document.getElementById('XXdisplayTable'); 
    for (var x = 0; x < parsedResponse.length; x ++) {
      var row = table.insertRow();
      var cellNum = row.insertCell(0); 
      var cellText = row.insertCell(1);
      
      cellNum.innerHTML = x;
      cellText.innerText = parsedResponse[x];
    }
  } catch(err) {
    console.log(res)
    console.log(err)
  }
}