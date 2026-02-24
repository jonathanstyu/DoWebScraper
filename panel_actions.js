// Actions JS for using to scrape

document.getElementById('XXscrapeButton').addEventListener('click', function() {
  const cssSelector = document.getElementById('CSSinput').value;
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { action: 'grab', param: cssSelector }, (response) => {
      displayResults(response);
    });
  });
});

document.getElementById('XXcloseButton').addEventListener('click', function() {
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { action: 'close' });
  });
});

document.getElementById('XXclearButton').addEventListener('click', function() {
  const tableRows = document.getElementsByClassName('tableResults');
  document.getElementById('XXstatusDisplay').innerHTML = '';
  document.getElementById('CSSinput').value = '';
  document.getElementById('XXselectorDisplay').innerHTML = '';
  document.getElementById('xxCurrentStorage').innerText = '';
  while (tableRows.length > 0) {
    tableRows[0].parentNode.removeChild(tableRows[0]);
  }
});

document.getElementById('XXtxtDL').addEventListener('click', function() {
  const downloadText = document.getElementById('xxCurrentStorage').innerText;
  if (downloadText !== '') {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { action: 'download', data: downloadText, format: 'txt' });
    });
  } else {
    alert('Empty');
  }
});

document.getElementById('XXcsvDL').addEventListener('click', function() {
  const downloadText = JSON.parse(document.getElementById('xxCurrentStorage').innerText);
  if (downloadText !== '') {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { action: 'download', data: downloadText, format: 'csv' });
    });
  } else {
    alert('Empty');
  }
});

function displayResults(res) {
  try {
    const parsedResponse = res.res;
    document.getElementById('XXstatusDisplay').innerHTML = parsedResponse.length;
    document.getElementById('XXselectorDisplay').innerHTML = res.selector;
    document.getElementById('xxCurrentStorage').innerText = JSON.stringify(parsedResponse);

    const table = document.getElementById('XXdisplayTable');
    for (let x = 0; x < parsedResponse.length; x++) {
      const row = table.insertRow();
      const cellNum = row.insertCell(0);
      const cellText = row.insertCell(1);
      row.classList.add('tableResults');
      cellNum.innerHTML = x;
      cellText.innerText = parsedResponse[x];
    }
  } catch (err) {
    console.error(res, err);
  }
}
