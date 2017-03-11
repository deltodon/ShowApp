const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const path = require('path');

const appMenu = require('./js/app-menu');

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



// To maximize your application window, you can use
// BrowserWindow.maximize()
// To run your application in full-screen, you can use
// BrowserWindow.setFullScreen(true)