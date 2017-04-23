const electron = require('electron').remote;
const openDialog = electron.dialog;
const ipc = require('electron').ipcRenderer;

const imageIcon = "<i class='fa fa-picture-o fa-fw content-icon'></i>";
const audioIcon = "<i class='fa fa-music fa-fw content-icon'></i>";
const videoIcon = "<i class='fa fa-film fa-fw content-icon'></i>";
const modelIcon = "<i class='fa fa-cubes fa-fw content-icon'></i>";
const appIcon = "<i class='fa fa-cogs fa-fw content-icon'></i>";

const accordTemplate = "<div id='#{accord}' class='accord-select'></div>"

// --------------------------------------------------------------

$( function() {
    var fileIcon = "";
    var fileFilter = {};
    var fileSource = "";
    var fileThumb = "<img src='#{thumb-src}' class='thumb-content'>";
    var optionPathText = $( "#opt-path" );
    var optionThumbPathText = $( "#opt-thumb-path" );
    var openDefPath = "";
    var optionPath = "";
    var optionThumbPath = "";
    var btnFileOption = "";


    // Actual addTab function: adds new tab using the input from the form above
    function addContent( entryArg ) {
        let accordArg = $(".accord-select:visible");
        let banner = "";
        let textContentHtml = "";

        if ( accordArg === undefined ) {
            console.log ( "no accord visible!");
            return;
        }

        if ( entryArg === undefined )
        {
            let contentTitle = $( "#content_title" );
            let contentText = $( "#content_txt" );
            banner = contentTitle.val() || "No name";

            // TODO: if text === "" -> hide text area 
            textContentHtml = contentText.val();
        }
        else {
            banner = entryArg.name;
            textContentHtml = entryArg.text;
        }



        fileSource = fileSource.replace( /#\{source\}/g, 'file://' + optionPath );



        if ( optionThumbPath === "" ) {
            fileThumb = "";
            console.log( "optionThumbPath is empty!" )
        }
        else {
            fileThumb = fileThumb.replace( /#\{thumb-src\}/g, 'file://' + optionThumbPath );
            // console.log( "fileThumb= " + fileThumb );
        }
        

        accordArg.append("<div class='group'><h3>" + fileIcon + banner + "<span class=\"ui-icon ui-icon-close\" role=\"presentation\">Remove Tab</span></h3>\
                            <div>" + fileSource + "<p class='preview-text'>" + textContentHtml + "</p>Thumbnail:<br>" + fileThumb + "</div></div>");

        if ( btnFileOption == "App") {
            $("button", accordArg.last()).button()
                                         .data( "path", optionPath )
                                         .click( function() { ipc.send( 'run-app', $( this).data( "path" ) ); });
        }

        accordArg.accordion( "refresh" );

    }

    // --------------------------------------------------------------

    var contentDialog = $( "#content-dialog" ).dialog({
        autoOpen: false,
        modal: true,
        height: 480,
        width: 570,
        resizable: false,
        buttons: {
            Add: function() {
                addContent();
                $( this ).dialog( "close" );
            },
            Cancel: function() {
                $( this ).dialog( "close" );
            }
        },
        close: function() {
            contentForm[ 0 ].reset();
            optionPathText.empty();
            optionThumbPathText.empty();
        }
    });

    // AddTab form: calls addTab function on submit and closes the dialog
    var contentForm = contentDialog.find( "form" ).on( "submit", function( event ) {
        addContent();
        contentDialog.dialog( "close" );
        event.preventDefault();
    });


    // AddContent button: just opens the dialog
    $( "#content-buttonset > button" )
        .button()
        .on( "click", function() {
            btnFileOption = $( this ).val();
            // console.log( value );
            updateFileFilter();
            contentDialog.dialog( "open" );
    });


    $( "#opt-path-btn" )
        .button()
        .on( "click", function() {
            optionPathText.empty();
            selectFile();            
    });

    $( "#opt-path-thumb-btn" )
        .button()
        .on( "click", function() {
            optionThumbPathText.empty();
            selectThumbFile();            
    });


    // TODO: Refactor following two functions into one with args
    function selectFile() {
        optionPath = "";
        openDialog.showOpenDialog({ defaultPath: openDefPath, properties: ['openFile'],
                                    filters: [ fileFilter ] }, function (filePath) {
            if (filePath){
                optionPath = filePath[0].replace(/(\\)/g, "/");
                if (optionPath.length > 42 ) {
                    let strSlice = optionPath.slice(-39);
                    optionPathText.append( "..." + strSlice );
                }
                else{
                    optionPathText.append( optionPath );
                }        
            }
        });
    }

    function selectThumbFile() {
        optionThumbPath = "";
        openDialog.showOpenDialog({ defaultPath: openDefPath, properties: ['openFile'],
                                    filters: [ {name: 'Image (*.jpg; *.png; *.bmp)', extensions: ['jpg', 'png', 'bmp']} ] }, function (filePath) {

            // console.log( "filePath= " + filePath );
            if (filePath){
                optionThumbPath = filePath[0].replace(/(\\)/g, "/");
                if (optionThumbPath.length > 42 ) {
                    let strSlice = optionThumbPath.slice(-39);
                    optionThumbPathText.append( "..." + strSlice );
                }
                else{
                    optionThumbPathText.append( optionThumbPath );
                }

                // console.log( "select " + optionThumbPath );        
            }
        });

        
    }

    function updateFileFilter() {
        // btnFileOption = $('input[name=radio-1]:checked', '#content-buttonset').val();
        let newTitle = "Add " + btnFileOption;
        let token = $(".accord-select:visible").data( "project" );
        let tempPath = openProjects[ token ].path;
        
        openDefPath = tempPath.slice( 0, tempPath.lastIndexOf('/'));
        // For Windows - convert path to required \\
        openDefPath = openDefPath.replace(/(\/)/g, "\\");

        contentDialog.dialog('option', 'title', newTitle);
        // console.log( btnFileOption );

        prepFileTokens();
    }

    function prepFileTokens() {
        switch ( btnFileOption ) {
            case "Image":
                fileIcon = imageIcon;
                fileFilter = {name: 'Image (*.jpg; *.png; *.bmp)', extensions: ['jpg', 'png', 'bmp']};
                fileSource = "<img src='#{source}' class='preview-source'>";
                // openDefPath = openDefPath.concat( "\\images" );
                // console.log( "1" );
                break;

            case "Audio":
                fileIcon = audioIcon;
                fileFilter = {name: 'Audio (*.mp3; *.wav; *.ogg)', extensions: ['mp3', 'wav', 'ogg']};
                fileSource = "<audio src='#{source}' controls></audio>";
                // openDefPath = openDefPath.concat( "\\audio" );
                // console.log( "2" );
                break;

            case "Video":
                fileIcon = videoIcon;
                fileFilter = {name: 'Video (*.mkv; *.avi; *.mp4)', extensions: ['mkv', 'avi', 'mp4']};
                fileSource = "<video src='#{source}' class='preview-source' controls></video>";
                // openDefPath = openDefPath.concat( "\\video" );
                // console.log( "3" );
                break;

            case "3D":
                fileIcon = modelIcon;
                // fileFilter = {name: 'Web GL', extensions: ['jpg', 'png', 'gif']};
                // openDefPath = openDefPath.concat( "\\3d" );
                // console.log( "4" );
                break;

            case "App":
                fileIcon = appIcon;
                fileFilter = {name: 'Application (*.exe)', extensions: ['exe']};
                // fileFilter = {name: 'Application (*.exe; *.bat)', extensions: ['exe', 'bat']};
                fileSource = "<button>Play App</button>";
                // openDefPath = openDefPath.concat( "\\binaries" );
                // console.log( "5" );
                break;

            default:
                fileIcon = "??";
                // console.log( "D" );

        }
    } 

    function addProjectImg( id ) {
        fileFilter = {name: 'Image (*.jpg; *.png; *.bmp)', extensions: ['jpg', 'png', 'bmp']};

        optionPath = "";

        openDialog.showOpenDialog({ defaultPath: openDefPath, properties: ['openFile'],
                                    filters: [ fileFilter ] }, function (filePath) {
            if (filePath){
                optionPath = filePath[0].replace(/(\\)/g, "/");

                $("> .tab-proj-cover img", "#" + id).attr("src","file://" + optionPath);
                openProjects[ id ].data.header.cover = optionPath;
            }
        });
    }


    $( "#tabs" ).on( "tab-added", function( event, param ) {
        $( ".btn-proj-img", "#" + param ).button()
                                .on( "click", function() {
                                    updateFileFilter();
                                    addProjectImg( param );
                                });

        // console.log( "new " + param );
        let counter = param.substr(param.lastIndexOf('-') + 1);
        let newAccordDOM =  accordTemplate.replace( /#\{accord\}/g, "accordion-" + counter );
        $( "#accordion-wrapper" ).append( newAccordDOM );

        let newAccordion = $( "#accordion-" + counter )
                    .accordion({
                        header: "> div > h3",
                        // icons: { "header": "ui-icon-plus", "activeHeader": "ui-icon-minus" },
                        collapsible: true,
                        active: false,
                        heightStyle: "content"
                    })
                    .sortable({
                        axis: "y",
                        handle: "h3",
                        stop: function( event, ui ) {
                            // IE doesn't register the blur when sorting
                            // so trigger focusout handlers to remove .ui-state-focus
                            ui.item.children( "h3" ).triggerHandler( "focusout" );
                    
                            // Refresh accordion to handle new order
                            $( this ).accordion( "refresh" );
                        }
                    });

        // Close icon: removing the content on click
        newAccordion.on( "click", "span.ui-icon-close", function() {
            $( this ).closest( "div .group" ).remove();
            newAccordion.accordion( "refresh" );
        });

        newAccordion.data( "project", param );

    });

    $( "#tabs" ).on( "tabsactivate", function( event, ui ) {
        // update content header
        let counter = ui.newTab.context.hash.substr(ui.newTab.context.hash.lastIndexOf('-') + 1);
        let projStr = $("a[href$='" + ui.newTab.context.hash + "']").text();
        let studentStr = $( "#student-" + counter ).val();
        let titleStr = $( "#project-" + counter ).val();
        $( "#content-student-name" ).text( projStr + ": " + studentStr + " - " + titleStr );

        // show active accordion
        showAccordion( $( "#accordion-" + counter ) );        
    });


    $( "#tabs" ).on( "tab-loaded", function( event, param ) {
        // console.log( openProjects[ param ].data.entry );

        openProjects[ param ].data.entry.forEach( function( item, index ) {
            btnFileOption = item.type;
            prepFileTokens();
            
            optionPath = item.path;
            optionThumbPath = item.thum;
            addContent( item );
        });
    });


    function showAccordion( arg ) {
        if ( arg === undefined ) {
            // console.log( "showAccordion undefined" );
            return;
        }

        $(".accord-select").hide();
        arg.show();
        // console.log( "visible " + $(".accord-select:visible").attr( "id" ) );
    }
    
});



// --------------------------------------------------------------



