const electron = require('electron');
const Menu = electron.Menu;

var createMenu = function(){

    const template = [
                {
            label: 'File',
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
                label: 'Quit',
                // click: () => app.quit(),
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
            }
            ]
        }
    ]

    const myMenu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(myMenu);

}

module.exports.createMenu = createMenu;