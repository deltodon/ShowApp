const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const globalShortcut = electron.globalShortcut;
const dialog = electron.dialog;
const path = require('path');
const ipc = electron.ipcMain;
const shell = electron.shell;

const childProcess = require('child_process');
// const spawn = require('child_process').spawn;
// const execFile = require('child_process').execFile;


const topMenu = require('./main-process/menu/top-menu');
const messageBox = require('./main-process/system/message-box');

var mainWindow = null;
var previewWindow = null;

var child = null;

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

    topMenu.createMenu();

    mainWindow.loadURL('file://' + __dirname + '/index.html');

    globalShortcut.register('CommandOrControl+F12', function () {
        previewWindow.close();
        previewWindow.on('closed', function () {
            previewWindow = null
        });
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

ipc.on('preview', () => {
    dialog.showMessageBox({
        type: 'info',
        title: "ShowApp Presentation",
        message: 'ShowApp Presentation',
        detail: 'You are entering the ShowApp Presentation full screen mode.\n In order to leave the presentation press Ctrl + F12',
        buttons: ['OK']
    });

    previewWindow = new BrowserWindow({
        title: app.getName() + " " + app.getVersion(),
        backgroundColor: "#222222",
        // fullscreen: false,
        skipTaskbar: true,
        kiosk: true
    });

    previewWindow.setMenu(null)

    previewWindow.loadURL('file://' + __dirname + '/sections/view-index.html');

    previewWindow.setKiosk(true);

    

});

//------------------------------------------------------------------------------ 

ipc.on('run-app', () => {
    // console.log("Run App!");
    // shell.openItem('C:/Users/Leinsaviik/Desktop/exe/Release/W14_Coursework.exe');
    // shell.openItem('D:/SHOWAPP/release-builds/Marine/MarineAquariumTime.scr');
    // child = spawn('ls', ['-lh', '/usr']);
    // child = spawn('D:/SHOWAPP/release-builds/GPU-Z.exe');
    // child = execFile('D:/GPU-Z.exe');
    // child = childProcess.spawn('D:/GPU-Z.exe');
    child = childProcess.execFile('C:/Windows/System32/notepad.exe');
    // child = childProcess.execFile('D:/GPU-Z.exe');


    child.on('close', function(code) {
        // console.log('closing code: ' + code);
        previewWindow.focus();
    });

    


});

//------------------------------------------------------------------------------ 

ipc.on('add-image', function() {
    messageBox.emit('add-image');
});




// To maximize your application window, you can use
// BrowserWindow.maximize()
// To run your application in full-screen, you can use
// BrowserWindow.setFullScreen(true)


// const window = require('electron').BrowserWindow;

// ipc.on('menuItem-selected', function(){
//     var focusedWindow    = window.getFocusedWindow();
// }


//------------------------------------------------------------------------------ 


// // Remove all the children
// while (node.hasChildNodes()) {
//     node.removeChild(node.lastChild);
// }




// 80 //////////////////////////////////////////////////////////////////////////