const electron = require('electron');
const dialog = electron.dialog;
const fse = require('fs-extra');
const project = require('../system/project');


obj = project.projectTemplate();

obj.data.entry.push({path: "Anna", text: true});
var jsonFile = JSON.stringify(obj.data);

//------------------------------------------------------------------------------

module.exports.createProject = function(){
    dialog.showSaveDialog({
        title: "Create Project"
    }, function (projectPath) {
        
        if (projectPath){
            projectPath = projectPath.replace(/(\\)/g, "/");

            obj.path = projectPath;

            var projectName = projectPath.substr(projectPath.lastIndexOf('/') + 1);

            makeDirectory(projectPath);
            makeDirectory(projectPath.concat("/audio"));
            makeDirectory(projectPath.concat("/video"));
            makeDirectory(projectPath.concat("/images"));
            makeDirectory(projectPath.concat("/binaries"));
            makeDirectory(projectPath.concat("/documents"));

            var filePath = projectPath.concat("/", projectName, ".json");

            // projectPath += ".json";

            fse.writeFile(filePath, jsonFile, "utf8", function(err) {
                if (err) {
                    errorMessage("error writing file\n" + err);
                } 
            });
        } 
    });

};

//------------------------------------------------------------------------------

module.exports.openProject = function(){
// var openProject = function(){
    dialog.showOpenDialog({properties: ['openDirectory']}, function (projectPath) {
        if (projectPath){
            // dialog.showMessageBox({
            //     message: 'Open Project\n' + String(projectPath),
            //     buttons: []
            // })
        } 
    })
}

//------------------------------------------------------------------------------

var makeDirectory = function(path){
    fse.mkdir(path, function (err) {
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

// messageBox.on('add-image', function () {
//     dialog.showOpenDialog({properties: ['openFile']}, function (filePath) {
//         if (filePath){
//             // console.log(filePath[0]);
//             filePath[0] = filePath[0].replace(/(\\)/g, "/");
//             let fileName = filePath[0].substr(filePath[0].lastIndexOf('/') + 1);
//             // console.log(fileName);
//             let src = filePath[0];
//             let dest = obj.path.concat("/images/", fileName);

//             fse.copy(src, dest, err => {
//                 if (err) return console.error(err)
//                 console.log("success!")
//             });         
//         }
//     });

// });

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