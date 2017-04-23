// console.log("version: " + jQuery.fn.jquery );
// console.log("ui-version: " + $.ui.version );
const electron = require('electron').remote;
const dialog = electron.dialog;
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const fse = require('fs-extra');

const maxProjects = 2;


// --------------------------------------------------------------

$( function() {
    initTabs();
} );

// --------------------------------------------------------------

function initTabs () {
    var projectName = "";
    var tabContent = "<div class='tab-proj-cover'><img src=''></div><div class='tab-buttons'><button class='btn-proj-img'><i class='fa fa-picture-o fa-fw'></i> Add Image</button>\
                        <button class='btn-proj-save'><i class='fa fa-floppy-o fa-fw'></i> Save Project</button>\
                        <div class='img-notice'><i class='fa fa-info-circle fa-fw'></i> Note: for the best result use a square image of minimum size 400x400 pixels.</div></div>\
                        <form><label for='#{student}'>Student Name:</label>\
                        <input type='text' name='#{student}' id='#{student}' value='' class='ui-widget-content ui-corner-all'>\
                        <label for='#{project}'>Project Title:</label>\
                        <input type='text' name='#{project}' id='#{project}' class='ui-widget-content ui-corner-all'></form>";

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
                            });

    var btnOpenProject = $( "#btn-open-proj" )
                            .button()
                            .on( "click", function() {
                                // console.log('open \n\nproject');
                                openProject();
                            });                            

    // Close icon: removing the tab on click
    tabs.on( "click", "span.ui-icon-close", function() {
        var panelId = $( this ).closest( "li" ).remove().attr( "aria-controls" );
        delete openProjects[ panelId ];

        $( "#" + panelId ).remove();
        tabs.tabs( "refresh" );

        btnNewProject.button( "enable" );
        btnOpenProject.button( "enable" );
    });

    // Actual addTab function: adds new tab using the input from the form above
    function addTab( openProjArg ) {
        var label = projectName,
            id = "tabs-" + tabCounter,
            li = $( tabTemplate.replace( /#\{href\}/g, "#" + id ).replace( /#\{label\}/g, label ) ),
            tabContentHtml =  tabContent.replace( /#\{student\}/g, "student-" + tabCounter ).replace( /#\{project\}/g, "project-" + tabCounter );
    
        tabs.find( ".ui-tabs-nav" ).append( li );
        tabs.append( "<div id='" + id + "'>" + tabContentHtml + "</div>" );
        tabs.tabs( "refresh" );

        if( $('#tabs > ul > li').length > maxProjects) {
            btnNewProject.button( "disable" );
            btnOpenProject.button( "disable" );
        }

        if ( openProjArg !== undefined ) {
            $("#student-" + tabCounter).val( openProjArg.data.header.student );
            $("#project-" + tabCounter).val( openProjArg.data.header.title );

            if ( openProjArg.data.header.cover !== "" ) {
                $("> .tab-proj-cover img", "#" + id).attr("src","file://" + openProjArg.data.header.cover);
            }

        }

        // send event to save.js and content.js
        tabs.trigger( "tab-added", [ id ] );

        var index = $('#tabs a[href="#' + id + '"]').parent().index();
        tabs.tabs("option", "active", index);

        tabCounter++;
        return id;
        
    }

    function createProject() {
        let win = BrowserWindow.getFocusedWindow();
        let obj = getObjTemplate();
        let desktop = app.getPath( "desktop" );

        let jsonFile = JSON.stringify(obj.data);

        dialog.showSaveDialog(win, {
            title: "Create Project", defaultPath: desktop
        }, function (projectPath) {
            
            if (projectPath){
                projectPath = projectPath.replace(/(\\)/g, "/");
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

                let tabID = addTab();

                obj.name = projectName;
                obj.path = filePath;

                openProjects[ tabID ] = obj;
                
            } 
        });
    };

    function openProject() {
        let win = BrowserWindow.getFocusedWindow();
        let obj = getObjTemplate();
        let desktop = app.getPath( "desktop" );

        dialog.showOpenDialog(win, { defaultPath: desktop, properties: ['openFile'],
                                filters: [ {name: 'ShowApp Project (*.json)', extensions: ['json']} ] },
                                function (optionPath) {

            if (optionPath === undefined) {
                console.log( "wrong optionPath" );
                return;
            }
            else {
                let filePath = optionPath[0].replace(/(\\)/g, "/");

                if ( projAlreadyOpen( filePath ) ) {
                    // console.log( "Project already open!" );
                    dialog.showMessageBox( win, {
                        type: 'warning',
                        title: "Warning!",
                        message: 'Project is already open.',
                        detail: 'You can have only one instance of each project open at the same time.',
                        buttons: ['OK']
                    });
                    return;
                }
                else {
                    projectName = filePath.slice(filePath.lastIndexOf('/') + 1, filePath.lastIndexOf('.'));
                    // console.log( projectName );
                    fse.readFile( filePath, 'utf8', function (err, data) {
                        if (err) throw err;
                        let objData = JSON.parse(data);

                        if (objData === undefined) {
                            console.log( "wrong obj" );
                            return;
                        }
                        else {
                            obj.name = projectName;
                            obj.path = filePath;
                            obj.data = objData;
                            let tabID = addTab( obj );
                            openProjects[ tabID ] = obj;

                            // send event to content.js to load accordion
                            tabs.trigger( "tab-loaded", [ tabID ] );
                        }
                    });
                }
            }
        });

    }


}

// --------------------------------------------------------------

function projAlreadyOpen( argPath ) {
    let items = Object.keys(openProjects).length;
    items++;

    for ( id = 1; id < items; id++ ) {
        if ( openProjects[ "tabs-" + id ].path === argPath ) {
            return true;
        }
    }
    // console.log( items );
    return false
}



// MENU ---------------------------------------------------------

function getObjTemplate() {
    let objTemplate = {
        name: "",
        path: "",
        data: {
            header: {
                student: "",
                title: "",
                cover: ""
            },
            entry: [
                // {
                //     name: "",
                //     type: "",
                //     path: "",
                //     thum: "",
                //     text: ""
                // }
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


//------------------------------------------------------------------------------

    // Deferred example
    // var FunctionOne = function () {
    //     // create a deferred object
    //     var r = $.Deferred();

    //     // do whatever you want (e.g. ajax/animations other asyc tasks)

    //     setTimeout(function () {
    //         // and call `resolve` on the deferred object, once you're done
    //         r.resolve();
    //     }, 2500);

    //     // return the deferred object
    //     return r;
    // };

    // // define FunctionTwo as needed
    // var FunctionTwo = function () {
    //     console.log('FunctionTwo');
    // };

    // // call FunctionOne and use the `done` method
    // // with `FunctionTwo` as it's parameter
    // FunctionOne().done(FunctionTwo);



// 80 //////////////////////////////////////////////////////////////////////////