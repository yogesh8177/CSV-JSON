// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
var {ipcRenderer, remote} = require('electron');  
var main = remote.require("./main.js");
var parseCSV = require('./utils/parseCSV.js').parseCSV;

const fs = require('fs');


let fileRead = (file) => {
    return new Promise((resolve, reject) => {
        let reader = new FileReader();
        reader.readAsText(file, "UTF-8");
        reader.onload = (e) => {
            document.getElementById('fileContents').innerHTML = e.target.result;
            return resolve(e.target.result);
        }
        reader.onerror = (e) => {
            document.getElementById('fileContents').innerHTML = 'Unable to read file';
            console.log(e);
            return reject(e);
        }
    });
}
var fileInput = document.getElementById('fileUpload');
console.log(fileInput);
fileInput.onchange = (event) => {
    console.log(event)
    let file = event.target.files[0];
    document.getElementById('fileName').innerHTML = file.name;
    fileRead(file)
    .then((contents) => {
        parseCSV(contents)
        .then((result) => {
            updateTemplate(result);
        });
    })
    .catch((error) => {
        console.log(error);
    });
}

function updateTemplate (result) {
    let headerItems = '<ul class="values-list">';
    result.headers.forEach((header) => {
        headerItems += `<li class='values'>${header}</li>`;
    })
    headerItems += '</ul>';
    document.getElementById('headers').innerHTML = headerItems;
    document.getElementById('missingValues').innerHTML = JSON.stringify(result.missingValues);
    document.getElementById('totalLines').innerHTML = `Total Lines (excluding headers) ${result.totalLines}`
    document.getElementById('duplicates').innerHTML = JSON.stringify(result.duplicateValues);
    document.getElementById('fileContents').innerHTML = JSON.stringify(result.json, null, "\t");
}
// IPC communication....

// Send async message to main process
ipcRenderer.send('async', 1);

// Listen for async-reply message from main process
ipcRenderer.on('async-reply', (event, arg) => {  
    // Print 2
    console.log(arg);
    // Send sync message to main process
    let mainValue = ipcRenderer.sendSync('sync', 3);
    // Print 4
    console.log(mainValue);
});

// Listen for main message
ipcRenderer.on('ping', (event, arg) => {  
    // Print 5
    console.log(arg);
});
