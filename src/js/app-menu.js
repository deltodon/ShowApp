const electron = require('electron');
const app = electron.app;
const Menu = electron.Menu;


var menuIsActive = true;

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
                click: () => app.quit(),
                //role: 'quit',
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
            },
            {
                label: 'Toggle Menu',
                click () {toggleMenu()},
                accelerator: 'f12'
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

var toggleMenu = function(){

    if (menuIsActive === true)
    {
        //console.log('menu off');
        Menu.setApplicationMenu(null);
        menuIsActive = false;
    }
    else
    {
        //console.log('menu on');
        Menu.setApplicationMenu(myMenu);
        menuIsActive = true;
    }

}



module.exports.createMenu = createMenu;