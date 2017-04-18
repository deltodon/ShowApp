// console.log("version: " + jQuery.fn.jquery );
// console.log("ui-version: " + $.ui.version );
const electron = require('electron').remote;
const dialog = electron.dialog;
const BrowserWindow = electron.BrowserWindow;
const fse = require('fs-extra');

const maxProjects = 2;
var openProjects = {};

// --------------------------------------------------------------

$( function() {
    initTabs();
} );

// --------------------------------------------------------------

function initTabs () {
    var projectName = "";
    var tabContent = "";
    var tabTemplate = "<li><a href='#{href}'>#{label}</a> <span class='ui-icon ui-icon-close' role='presentation'>Remove Tab</span></li>";
    var tabCounter = 1;

    
    var tabs = $( "#tabs" ).tabs();
    tabs.find( ".ui-tabs-nav" ).sortable({
        axis: "x",
        stop: function() {
            tabs.tabs( "refresh" );
        }
    });


    // AddTab button: just opens the dialog
    var btnNewProject = $( "#btn-new-proj" )
                            .button()
                            .on( "click", function() {
                                createProject();
                                // dialog.dialog( "open" );
                            });

    var btnOpenProject = $( "#btn-open-proj" )
                            .button()
                            .on( "click", function() {
                                // console.log('open \n\nproject');
                                openProject();
                            });                            

    // Actual addTab function: adds new tab using the input from the form above
    function addTab() {
        var label = projectName || "Tab " + tabCounter,
            id = "tabs-" + tabCounter,
            li = $( tabTemplate.replace( /#\{href\}/g, "#" + id ).replace( /#\{label\}/g, label ) ),
            tabContentHtml = tabContent || "Tab " + tabCounter + " content.";
    
        tabs.find( ".ui-tabs-nav" ).append( li );
        tabs.append( "<div id='" + id + "'><p>" + tabContentHtml + "</p></div>" );
        tabs.tabs( "refresh" );

        var index = $('#tabs a[href="#' + id + '"]').parent().index();
        tabs.tabs("option", "active", index);

        if( $('#tabs > ul > li').length > maxProjects) {
            btnNewProject.button( "disable" );
            btnOpenProject.button( "disable" );
        }

        tabCounter++;
    }

    // Close icon: removing the tab on click
    tabs.on( "click", "span.ui-icon-close", function() {
        var panelId = $( this ).closest( "li" ).remove().attr( "aria-controls" );
        $( "#" + panelId ).remove();
        tabs.tabs( "refresh" );

        btnNewProject.button( "enable" );
        btnOpenProject.button( "enable" );
    });

    tabs.on( "keyup", function( event ) {
        if ( event.altKey && event.keyCode === $.ui.keyCode.BACKSPACE ) {
            var panelId = tabs.find( ".ui-tabs-active" ).remove().attr( "aria-controls" );
            $( "#" + panelId ).remove();
            tabs.tabs( "refresh" );
        }
    });

    function createProject() {
        let win = BrowserWindow.getFocusedWindow();
        let obj = getObjTemplate();

        obj.data.entry.push({path: "Anna", text: true});
        let jsonFile = JSON.stringify(obj);

        dialog.showSaveDialog(win, {
            title: "Create Project"
        }, function (projectPath) {
            
            if (projectPath){
                projectPath = projectPath.replace(/(\\)/g, "/");

                obj.path = projectPath;

                projectName = projectPath.substr(projectPath.lastIndexOf('/') + 1);

                makeDirectory(projectPath);
                makeDirectory(projectPath.concat("/audio"));
                makeDirectory(projectPath.concat("/video"));
                makeDirectory(projectPath.concat("/images"));
                makeDirectory(projectPath.concat("/binaries"));
                makeDirectory(projectPath.concat("/documents"));

                var filePath = projectPath.concat("/", projectName, ".json");

                fse.writeFile(filePath, jsonFile, "utf8", function(err) {
                    if (err) {
                        errorMessage("error writing file\n" + err);
                    } 
                });

                addTab();
            } 
        });
    };

    function openProject() {
        let win = BrowserWindow.getFocusedWindow();
        let obj = {};

        dialog.showOpenDialog({ properties: ['openFile'],
                                filters: [ {name: 'ShowApp Project (*.json)', extensions: ['json']} ] },
                                function (optionPath) {

            if (optionPath === undefined) {
                console.log( "wrong optionPath" );
                return;
            }
            else {
                let filePath = optionPath[0].replace(/(\\)/g, "/");
                projectName = filePath.slice(filePath.lastIndexOf('/') + 1, filePath.lastIndexOf('.'));
                // console.log( projectName );
                fse.readFile( filePath, 'utf8', function (err, data) {
                    if (err) throw err;
                    obj = JSON.parse(data);

                    if (obj === undefined) {
                        console.log( "wrong obj" );
                        return;
                    }
                    else {
                        // console.log( obj.data.header.student );
                        addTab();
                    }

                });
            }
        });

    }


}

// --------------------------------------------------------------


// MENU ---------------------------------------------------------

function getObjTemplate() {
    let objTemplate = {
        path: "",
        data: {
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
        }
    };

    return objTemplate;
}

//------------------------------------------------------------------------------



//------------------------------------------------------------------------------

function makeDirectory(path){
    fse.mkdir(path, function (err) {
        if (err) {
            errorMessage("failed to create directory\n" + err);
            //console.log('failed to create directory', err);
        }
    });
};

//------------------------------------------------------------------------------ 

function errorMessage(msgstring){
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

// Add/remove data from object

    // var bigTest = {name: "Anna"};
    // var test = {
    //     path: "",
    //     data: {
    //         header: {
    //             student: "name",
    //             title: "dissertation",
    //             cover: "image/path/pic.jpg"
    //         },
    //         entry: [
    //             {
    //                 path: "Alex",
    //                 text: true
    //             },
    //             {
    //                 path: "Billy",
    //                 text: false
    //             }
    //         ]
    //     }
    // };

    // test.data.entry.push({path: "Anna", text: true});
    // // var test = {'red':'#FF0000', 'blue':'#0000FF'};
    // // delete test.blue; // or use => delete test['blue'];
    // bigTest.MyProject = test;
    // // delete test.data.entry[1];
    // console.log(bigTest);
    // delete bigTest['MyProject'];
    // console.log(bigTest);



// 80 //////////////////////////////////////////////////////////////////////////