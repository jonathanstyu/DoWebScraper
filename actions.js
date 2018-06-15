// Actions JS for using to scrape

document.getElementById('XXscrapeButton').addEventListener("click", function () {
  var cssSelector = document.getElementById("CSSinput").value;
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
    chrome.tabs.sendMessage(tabs[0].id, {"action": "grab", "param": cssSelector}, (response) => {     
      console.log(response);
      
      displayStatus(response['res']);
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

// Displaying the data in the thing 
function displayStatus(htmlCollection) {
  document.getElementById('XXstatusDisplay').innerHTML = "Length: " + htmlCollection.length; 
  var table = document.getElementById('XXdisplayTable'); 
  for (var x = 0; x < htmlCollection.length; x ++) {
    var row = table.insertRow(0);
    var cellNum = row.insertCell(0); 
    var cellObject = row.insertCell(1); 
    var cellText = row.insertCell(2);
    
    cellNum.innerHTML = i;
    cellText.innerHTML = htmlCollection[i].innerHTML;
  }
}