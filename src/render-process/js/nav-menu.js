const ipc = require('electron').ipcRenderer;

const homeButton = document.getElementById('btn-home');
const listButton = document.getElementById('btn-list');
// const searchButton = document.getElementById('btn-search');
const userButton = document.getElementById('btn-user');
const previewButton = document.getElementById('btn-preview');

homeButton.addEventListener('click', function (event) {
    ipc.send('home');
});

listButton.addEventListener('click', function (event) {
    ipc.send('list');
});

// searchButton.addEventListener('click', function (event) {
//     ipc.send('search');
// });

userButton.addEventListener('click', function (event) {
    ipc.send('user');
});

previewButton.addEventListener('click', function (event) {
    ipc.send('preview');
});


