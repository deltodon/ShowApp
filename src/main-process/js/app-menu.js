const electron = require('electron');
// const app = electron.app;
const Menu = electron.Menu;
const dialog = electron.dialog;
const fs = require('fs');

const myproject = require("./project");



var obj = myproject.createProject();


obj.entry.push({path: "Anna", text: true});
var jsonFile = JSON.stringify(obj);


module.exports.createMenu = function(){

    const template = [
                {
            label: 'File',
            submenu: [
            {
                label: 'New Project',
                click: () => createProject()
            },
            {
                label: 'Open Project',
                click: () => openProject()
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

var createProject = function(){
    dialog.showSaveDialog({
        title: "Create Project"
    }, function (projectPath) {
        
        if (projectPath){
            projectPath = projectPath.replace(/(\\)/g, "/");

            var projectName = projectPath.substr(projectPath.lastIndexOf('/') + 1)

            makeDirectory(projectPath);
            makeDirectory(projectPath.concat("/audio"));
            makeDirectory(projectPath.concat("/video"));
            makeDirectory(projectPath.concat("/images"));
            makeDirectory(projectPath.concat("/binaries"));
            makeDirectory(projectPath.concat("/documents"));

            var filePath = projectPath.concat("/", projectName, ".json");

            // projectPath += ".json";

            fs.writeFile(filePath, jsonFile, "utf8", function(err) {
                if (err) {
                    errorMessage("error writing file\n" + err);
                } 
            });


            dialog.showMessageBox({
                message: 'Create Project\n' + String(projectPath),
                // message: 'Create Project\n' + String(temp),
                buttons: []
            });
        } 
    });

};

//------------------------------------------------------------------------------

var openProject = function(){
    dialog.showOpenDialog({properties: ['openDirectory']}, function (projectPath) {
            if (projectPath){
                    dialog.showMessageBox({
                        message: 'Open Project\n' + String(projectPath),
                        buttons: []
                    })
            } 
    })
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

var makeDirectory = function(path){
    fs.mkdir(path, function (err) {
        if (err) {
            errorMessage("failed to create directory\n" + err);
            //console.log('failed to create directory', err);
        }
    });
};

//------------------------------------------------------------------------------ 

var errorMessage = function(msgstring){
    dialog.showMessageBox({
        type: 'error',
        title: "Error",
        message: msgstring,
        buttons: []
    });
};

//------------------------------------------------------------------------------ 


/*
fs.writeFile('myjsonfile.json', json, 'utf8', callback);

if you want to append it read the json file and convert it back to an object

fs.readFile('myjsonfile.json', 'utf8', function readFileCallback(err, data){
    if (err){
        console.log(err);
    } else {
    obj = JSON.parse(data); //now it an object
    obj.table.push({id: 2, square:3}); //add some data
    json = JSON.stringify(obj); //convert it back to json
    fs.writeFile('myjsonfile.json', json, 'utf8', callback); // write it back 
}});


*/






// 80 //////////////////////////////////////////////////////////////////////////