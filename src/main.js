const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const globalShortcut = electron.globalShortcut;
const dialog = electron.dialog;
const path = require('path');
const ipc = electron.ipcMain;
const shell = electron.shell;

const childProcess = require('child_process');

const debugMenu = require('./main-process/menu/debug-menu');
const messageBox = require('./main-process/system/message-box');

var mainWindow = null;
var childApp = null;

//------------------------------------------------------------------------------

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

    console.log( __dirname);

    // Create hidden debug menu
    debugMenu.createMenu();
    mainWindow.setMenuBarVisibility(false);

    mainWindow.loadURL('file://' + __dirname + '/index.html');

    globalShortcut.register('CommandOrControl+F12', function () {
        mainWindow.webContents.send('preview-off');
        mainWindow.setFullScreen(false);
    });

    globalShortcut.register('CommandOrControl+Alt+M', function () {
        // Toggle Top Menu
        let visible = !mainWindow.isMenuBarVisible();
        mainWindow.setMenuBarVisibility(visible);
    });  
       
});

//------------------------------------------------------------------------------

app.on('window-all-closed', () => {
    globalShortcut.unregisterAll();
    app.quit();
});

//------------------------------------------------------------------------------

messageBox.on('project-created', () => {
    console.log("project created!");
});

messageBox.on('project-loaded', () => {
    console.log("project loaded!");
});

//------------------------------------------------------------------------------

ipc.on('preview-on', function() {
    dialog.showMessageBox({
        type: 'info',
        title: "ShowApp Presentation",
        message: 'ShowApp Presentation',
        detail: 'You are entering the ShowApp Presentation full screen mode.\n In order to leave the presentation press Ctrl + F12',
        buttons: ['OK']
    });

    mainWindow.setFullScreen(true);
    // mainWindow.setKiosk(true);
});

//------------------------------------------------------------------------------ 

ipc.on('run-app', function(event, arg) {
    // START is windows only command
    // TODO: create cross-platform support in the future
    let command = "START /MAX /WAIT " + arg;
    let workDir = arg.substring(0, arg.lastIndexOf("/")+1);
    childApp = childProcess.exec( command, {cwd: workDir} );

    childApp.on('close', function(code) {
        // console.log('closing code: ' + code);
        mainWindow.focus();     
    });    
});

//------------------------------------------------------------------------------ 

ipc.on('add-image', function() {
    messageBox.emit('add-image');
});

//------------------------------------------------------------------------------ 





// 80 //////////////////////////////////////////////////////////////////////////