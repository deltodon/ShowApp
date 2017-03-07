const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const showappmenu = require('./js/showappmenu');
const path = require('path');

var mainWindow = null;

app.on('ready', () => {
    mainWindow = new BrowserWindow({
        //title: "ShowApp " + app.getVersion(),
        title: app.getName() + " " + app.getVersion(),
        backgroundColor: "#222222",
        width: 1000,
        height: 800,
        icon: path.join(__dirname, 'assets/icons/png/64x64.png')
    })

    showappmenu.createMenu();

    mainWindow.loadURL('file://' + __dirname + '/index.html');


    
})