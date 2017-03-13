const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const dialog = electron.dialog;
const path = require('path');
const ipc = electron.ipcMain;

const topMenu = require('./main-process/menu/top-menu');
const messageBox = require('./main-process/system/message-box');

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

    topMenu.createMenu();

    mainWindow.loadURL('file://' + __dirname + '/index.html');
    
});

app.on('window-all-closed', () => {
    app.quit();
})



messageBox.on('project-created', () => {
    console.log("project created!");
});

messageBox.on('project-loaded', () => {
    console.log("project loaded!");
});


ipc.on('preview', () => {
    //   const modalPath = path.join('file://', __dirname, '../../sections/windows/modal.html')
    //   let win = new BrowserWindow({ width: 400, height: 320 })
    //   win.on('close', function () { win = null })
    //   win.loadURL(modalPath)
    //   win.show()
    dialog.showMessageBox({
        message: 'Preview Window',
        buttons: []
    });

    let x = 1 / 3 * 100;
    console.log(x);


    // console.log("preview clicked!");
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