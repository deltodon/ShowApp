const electron = require('electron');
const dialog = electron.dialog;
const fs = require('fs');
const messageBox = require('../system/message-box');


var obj = {
    header: {
        student: "name",
        title: "dissertation",
        cover: "image/path/pic.jpg"
    },
    entry: [
        {
            path: "Alex",
            text: true
        },
        {
            path: "Billy",
            text: false
        }
    ]
};

obj.entry.push({path: "Anna", text: true});
var jsonFile = JSON.stringify(obj);

//------------------------------------------------------------------------------

module.exports.createProject = function(){
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


            messageBox.emit('project-created');

            // dialog.showMessageBox({
            //     message: 'Create Project\n' + String(projectPath),
            //     buttons: []
            // });
        } 
    });

};

//------------------------------------------------------------------------------

module.exports.openProject = function(){
// var openProject = function(){
    dialog.showOpenDialog({properties: ['openDirectory']}, function (projectPath) {
        if (projectPath){
            messageBox.emit('project-loaded');

            // dialog.showMessageBox({
            //     message: 'Open Project\n' + String(projectPath),
            //     buttons: []
            // })
        } 
    })
}

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



//------------------------------------------------------------------------------



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

//------------------------------------------------------------------------------





// 80 //////////////////////////////////////////////////////////////////////////