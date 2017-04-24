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

var mainWindow = null;
var childApp = null;

//------------------------------------------------------------------------------

app.on('ready', () => {

    let showMode = false;
    // let showMode = true;

    // Handle CLI arguments
    for ( i = 1; i < process.argv.length; i++ ) {
        switch (process.argv[i]) {
            case '--play':
            case '-p':
                // console.log( "play" );
                showMode = true;
                break;

            case '--icon':
            case '-i':
                // console.log( "create shortcut" );
                break;

            default:
                // console.log( "wrong argument" );
        }
    }


    mainWindow = new BrowserWindow({
        //title: "ShowApp " + app.getVersion(),
        title: app.getName() + " " + app.getVersion(),
        backgroundColor: "#222222",
        width: 1020,
        height: 720,
        minWidth: 1020,
        minHeight: 720,
        icon: path.join(__dirname, 'assets/icons/png/64x64.png')
    })

    // console.log( __dirname);

    // Create hidden debug menu
    debugMenu.createMenu();
    mainWindow.setMenuBarVisibility(false);

    mainWindow.loadURL('file://' + __dirname + '/index.html');
    // mainWindow.maximize();

    if ( showMode ) {
        globalShortcut.register('CommandOrControl+F12', function () {
            globalShortcut.unregisterAll();
            app.quit();           
        });

        mainWindow.webContents.on('did-finish-load', function() {
            console.log("main - ready-to-show");
            mainWindow.webContents.send('load-config');
            mainWindow.setFullScreen(true);
            mainWindow.webContents.send('cmd-play');
        });        
    }
    else {
        mainWindow.webContents.on('did-finish-load', function() {
            mainWindow.webContents.send('load-config');
        }); 

        globalShortcut.register('CommandOrControl+F12', function () {
            mainWindow.webContents.send('preview-off');
            mainWindow.setFullScreen(false);
        });

        globalShortcut.register('CommandOrControl+Alt+M', function () {
            // Toggle Top Menu
            let visible = !mainWindow.isMenuBarVisible();
            mainWindow.setMenuBarVisibility(visible);
        });

        mainWindow.on('close', function( event ) {
            event.preventDefault();
            console.log("before close window");
            mainWindow.webContents.send('save-config');            
        });

        ipc.on('config-saved', function() {
            console.log("config saved");
            mainWindow.destroy();
        }); 
    }



});

//------------------------------------------------------------------------------

app.on('window-all-closed', () => {
    globalShortcut.unregisterAll();
    app.quit();
});

//------------------------------------------------------------------------------

ipc.on('preview-on', function() {
    mainWindow.setFullScreen(true);
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





// 80 //////////////////////////////////////////////////////////////////////////