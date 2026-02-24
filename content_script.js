// Guard against re-injection if the extension icon is clicked multiple times
if (!window.__doWebScraperLoaded) {
  window.__doWebScraperLoaded = true;

  chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {

    if (message.action === 'show') {
      let iframe = document.getElementById('customScraperiFrame');
      if (iframe === null) {
        iframe = document.createElement('iframe');
        iframe.id = 'customScraperiFrame';
        iframe.style.height = document.body.offsetHeight + 'px';
        iframe.style.width = '400px';
        iframe.style.position = 'fixed';
        iframe.style.top = '0px';
        iframe.style.right = '0px';
        iframe.style.zIndex = '2147483647';
        iframe.frameBorder = 'none';
        iframe.src = chrome.runtime.getURL('page.html');
        document.body.appendChild(iframe);
      } else {
        iframe.style.width = '400px';
      }
    }

    if (message.action === 'grab') {
      const param = message.param;
      const nodeCollection = document.querySelectorAll(param);
      const responseObject = Array.from(nodeCollection).map(el => el.innerHTML);
      sendResponse({ res: responseObject, selector: param });
    }

    if (message.action === 'close') {
      const iframe = document.getElementById('customScraperiFrame');
      if (iframe) {
        iframe.parentNode.removeChild(iframe);
      }
    }

    if (message.action === 'download') {
      const element = document.createElement('a');

      if (message.format === 'txt') {
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(message.data));
        element.setAttribute('download', 'file.txt');
      }

      if (message.format === 'csv') {
        const escapeCSV = (value) => {
          const str = String(value);
          if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
            return '"' + str.replace(/"/g, '""') + '"';
          }
          return str;
        };
        let csvContent = '';
        message.data.forEach((rowArray, i) => {
          csvContent += [escapeCSV(i), escapeCSV(rowArray)].join(',') + '\r\n';
        });
        const blobdata = new Blob([csvContent], { type: 'text/csv' });
        element.setAttribute('href', URL.createObjectURL(blobdata));
        element.setAttribute('download', 'file.csv');
      }

      element.style.display = 'none';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }

  });
}
