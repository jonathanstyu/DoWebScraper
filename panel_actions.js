// Actions JS for using to scrape

document.getElementById('XXscrapeButton').addEventListener("click", function () {
  var cssSelector = document.getElementById("CSSinput").value;
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
    chrome.tabs.sendMessage(tabs[0].id, {"action": "grab", "param": cssSelector}, (response) => {     
      displayResults(response);
    });

    // chrome.tabs.executeScript({
    //   code: '(' + function(selector) {
    //     let nodeCollection = document.body.querySelectorAll(selector); 
    //     var responseObject = []; 
    //     for (var i = 0; i < nodeCollection.length; i++) {
    //       responseObject[i] = nodeCollection[i].innerHTML; 
    //     }
    //     return {
    //       success: true, 
    //       html: JSON.stringify(responseObject), 
    //       selector: selector
    //     };
    //   } + ')(' + JSON.stringify(cssSelector) + ');' 
    // }, function(results) {
    //   displayResults(results); 
    // });
  })
})


// Closes the window 
var closeButton = document.getElementById('XXcloseButton');
closeButton.addEventListener("click", function () {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
      chrome.tabs.sendMessage(tabs[0].id, {"action": "close"});
  })
})

// Clear results 
var closeButton = document.getElementById('XXclearButton');
closeButton.addEventListener("click", function () {
  var tableRows = document.getElementsByClassName('tableResults'); 

  document.getElementById('XXstatusDisplay').innerHTML = "";
  document.getElementById("CSSinput").value = ""
  document.getElementById('XXselectorDisplay').innerHTML = "";
  document.getElementById('xxCurrentStorage').innerText = ""; 

  while (tableRows.length > 0) {
    tableRows[0].parentNode.removeChild(tableRows[0]); 
  }
})

// Download last results text file 
var downloadButton = document.getElementById('XXtxtDL');
downloadButton.addEventListener("click", function () {
  let downloadText = document.getElementById("xxCurrentStorage").innerText;

  if (downloadText !== "") {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
      chrome.tabs.sendMessage(tabs[0].id, {"action": "download", "data": downloadText, "format": 'txt'});
    })
  } else {
    alert("Empty")
  }
})

// Download last results text file 
var downloadButton = document.getElementById('XXcsvDL');
downloadButton.addEventListener("click", function () {
  let downloadText = JSON.parse(document.getElementById("xxCurrentStorage").innerText);

  if (downloadText !== "") {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
      chrome.tabs.sendMessage(tabs[0].id, {"action": "download", "data": downloadText, "format": "csv"});
    })
  } else {
    alert("Empty")
  }
})

// ****  Actions

function displayResults(res) {
  // Fill in the stats in display
  try {
    // let parsedResponse = JSON.parse(res[0]['html']); 
    let parsedResponse = res['res']; 
    document.getElementById('XXstatusDisplay').innerHTML = parsedResponse.length; 
    document.getElementById('XXselectorDisplay').innerHTML = res['selector']; 
    document.getElementById('xxCurrentStorage').innerText = JSON.stringify(parsedResponse); 

    var table = document.getElementById('XXdisplayTable'); 
    for (var x = 0; x < parsedResponse.length; x ++) {
      var row = table.insertRow();
      var cellNum = row.insertCell(0); 
      var cellText = row.insertCell(1);

      row.classList.add('tableResults'); 
      cellNum.innerHTML = x;
      cellText.innerText = parsedResponse[x];
    }
  } catch(err) {
    console.log(res)
    console.log(err)
  }
}