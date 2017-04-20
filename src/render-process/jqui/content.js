const electron = require('electron').remote;
const openDialog = electron.dialog;
const ipc = require('electron').ipcRenderer;

const imageIcon = "<i class='fa fa-picture-o fa-fw content-icon'></i>";
const audioIcon = "<i class='fa fa-music fa-fw content-icon'></i>";
const videoIcon = "<i class='fa fa-film fa-fw content-icon'></i>";
const modelIcon = "<i class='fa fa-cubes fa-fw content-icon'></i>";
const appIcon = "<i class='fa fa-cogs fa-fw content-icon'></i>";



// --------------------------------------------------------------

$( function() {
    var fileIcon = "";
    var fileFilter = {};
    var fileSource = "";
    var optionPathText = $( "#opt-path" );
    var optionPath = "";
    var btnFileOption = "";

    var slideButton = $("#slide-btn-app").button().click( function(){ console.log( 'slide-btn-app'); });

    var contentList = $( "#accordion" )
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

    // Actual addTab function: adds new tab using the input from the form above
    function addContent() {
        var contentTitle = $( "#content_title" );
        var contentText = $( "#content_txt" );
        
           

        var banner = contentTitle.val() || "No name";
        var textContentHtml = contentText.val() || "Text content.";

        fileSource = fileSource.replace( /#\{source\}/g, 'file://' + optionPath );

        contentList.append("<div class='group'><h3>" + fileIcon + banner + "<span class=\"ui-icon ui-icon-close\" role=\"presentation\">Remove Tab</span></h3>\
                            <div>" + fileSource + "<p class='preview-text'>" + textContentHtml + "</p></div></div>");

        if ( btnFileOption == "App") {
            $("button", contentList.last()).button().click( function(){ ipc.send( 'run-app', optionPath ); });

            //update path to new button
            slideButton.off( "click" );
            slideButton.click( function(){ ipc.send( 'run-app', optionPath ); });
        }

        contentList.accordion( "refresh" );

    }

    // --------------------------------------------------------------


    // Close icon: removing the content on click
    contentList.on( "click", "span.ui-icon-close", function() {
        $( this ).closest( "div .group" ).remove();
        contentList.accordion( "refresh" );
    });

    var contentDialog = $( "#content-dialog" ).dialog({
        autoOpen: false,
        modal: true,
        height: 450,
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


    function selectFile() {
        optionPath = "";

        openDialog.showOpenDialog({ properties: ['openFile'],
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

                // console.log( filePath[0] );
                // let fileName = filePath[0].substr(filePath[0].lastIndexOf('/') + 1);
                // // console.log(fileName);
                // let src = filePath[0];
                // let dest = obj.path.concat("/images/", fileName);

                // fse.copy(src, dest, err => {
                //     if (err) return console.error(err)
                //     console.log("success!")
                // });         
            }
        });
    }

    function updateFileFilter() {
        // btnFileOption = $('input[name=radio-1]:checked', '#content-buttonset').val();
        let newTitle = "Add " + btnFileOption;
        contentDialog.dialog('option', 'title', newTitle);
        // console.log( btnFileOption );

        switch ( btnFileOption ) {
            case "Image":
                fileIcon = imageIcon;
                fileFilter = {name: 'Image (*.jpg; *.png; *.bmp)', extensions: ['jpg', 'png', 'bmp']};
                fileSource = "<img src='#{source}' class='preview-source'>";
                // console.log( "1" );
                break;

            case "Audio":
                fileIcon = audioIcon;
                fileFilter = {name: 'Audio (*.mp3; *.wav; *.ogg)', extensions: ['mp3', 'wav', 'ogg']};
                fileSource = "<audio src='#{source}' controls></audio>";
                // console.log( "2" );
                break;

            case "Video":
                fileIcon = videoIcon;
                fileFilter = {name: 'Video (*.mkv; *.avi; *.mp4)', extensions: ['mkv', 'avi', 'mp4']};
                fileSource = "<video src='#{source}' class='preview-source' controls></video>";
                // console.log( "3" );
                break;

            case "3D":
                fileIcon = modelIcon;
                // fileFilter = {name: 'Web GL', extensions: ['jpg', 'png', 'gif']};
                // console.log( "4" );
                break;

            case "App":
                fileIcon = appIcon;
                fileFilter = {name: 'Application (*.exe)', extensions: ['exe']};
                // fileFilter = {name: 'Application (*.exe; *.bat)', extensions: ['exe', 'bat']};
                fileSource = "<button>Play App</button>";
                // console.log( "5" );
                break;

            default:
                fileIcon = "??";
                // console.log( "D" );

        }
    }    

    $( "#tabs" ).on( "tab-added", function( event, param ) {
        $( ".btn-proj-img", "#" + param ).button()
                                        .on( "click", function() {
                                            addProjectImg( param );
                                        });
    }); 

    function addProjectImg( id ) {
        console.log( "add image clicked!" );
        // console.log( id );
        // console.log( openProjects );

        fileFilter = {name: 'Image (*.jpg; *.png; *.bmp)', extensions: ['jpg', 'png', 'bmp']};

        optionPath = "";

        openDialog.showOpenDialog({ properties: ['openFile'],
                                    filters: [ fileFilter ] }, function (filePath) {
            if (filePath){
                optionPath = filePath[0].replace(/(\\)/g, "/");
                // fileSource = "<img src='#{source}' class='preview-source'>";
                // let tempImage = $("> .tab-proj-cover img", "#" + id);
                // console.log( tempImage );

                $("> .tab-proj-cover img", "#" + id).attr("src","file://" + optionPath);

                // let imgAttr = $("> .tab-proj-cover img", "#" + id).attr("src");
                // console.log( imgAttr );
            }
        });



    }
    
});



// --------------------------------------------------------------



