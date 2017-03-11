const electron = require('electron');
const Menu = electron.Menu;
const dialog = electron.dialog;
const projectMenu = require("./project-menu");



//------------------------------------------------------------------------------

module.exports.createMenu = function(){

    const template = [
                {
            label: 'File',
            submenu: [
            {
                label: 'New Project',
                click: () => projectMenu.createProject()
                // click: () => {
                //     var focusedWindow = BrowserWindow.getFocusedWindow();
                //     focusedWindow.webContents.send("new-project");
                // }
            },
            {
                label: 'Open Project',
                click: () => projectMenu.openProject()
                // click: () => {
                //     var focusedWindow = BrowserWindow.getFocusedWindow();
                //     focusedWindow.webContents.send("open-project");
                // }
            },
            {
                type: 'separator'
            },
            {
                label: 'Quit',
                role: 'quit',
                accelerator: 'ctrl+q'                
            }
            ]
        },
        {
            label: 'Edit',
            submenu: [
            {
                role: 'undo'
            },
            {
                role: 'redo'
            },
            {
                type: 'separator'
            },
            {
                role: 'cut'
            },
            {
                role: 'copy'
            },
            {
                role: 'paste'
            },
            {
                role: 'pasteandmatchstyle'
            },
            {
                role: 'delete'
            },
            {
                role: 'selectall'
            }
            ]
        },
        {
            label: 'View',
            submenu: [
            {
                role: 'reload'
            },
            {
                role: 'toggledevtools'
            },
            {
                type: 'separator'
            },
            {
                role: 'resetzoom'
            },
            {
                role: 'zoomin'
            },
            {
                role: 'zoomout'
            },
            {
                type: 'separator'
            },
            {
                role: 'togglefullscreen'
            }           
            ]
        },
        {
            role: 'window',
            submenu: [
            {
                role: 'minimize'
            },
            {
                role: 'close'
            }
            ]
        },
        {
            role: 'help',
            submenu: [
            {
                label: 'Learn More',
                click () { require('electron').shell.openExternal('https://github.com/deltodon/ShowApp/wiki') }
            },
            {
                label: 'About',
                click: () => aboutDialog()
            }
            ]
        }
    ]

    const myMenu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(myMenu);

}

//------------------------------------------------------------------------------

var aboutDialog = function(){
    dialog.showMessageBox({
        type: 'info',
        title: "About ShowApp",
        message:    'This is the About section\n\n\nfgdfgdfg',
        buttons: []
    });
};

//------------------------------------------------------------------------------ 




// 80 //////////////////////////////////////////////////////////////////////////