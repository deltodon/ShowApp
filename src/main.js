const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const appMenu = require('./js/app-menu');
const path = require('path');

var mainWindow = null;

app.on('ready', () => {
    mainWindow = new BrowserWindow({
        //title: "ShowApp " + app.getVersion(),
        title: app.getName() + " " + app.getVersion(),
        backgroundColor: "#222222",
        width: 1000,
        height: 800,
        minWidth: 640,
        minHeight: 480,
        icon: path.join(__dirname, 'assets/icons/png/64x64.png')
    })

    appMenu.createMenu();

    mainWindow.loadURL('file://' + __dirname + '/index.html');


    
})