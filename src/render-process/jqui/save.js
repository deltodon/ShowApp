const fse = require('fs-extra');
const ipc = require('electron').ipcRenderer;


// --------------------------------------------------------------

// $( "#tabs" ).on( "tabscreate", function( event, ui ) {
//     console.log( "detected tabscreate" );
// } );
ipc.on('save-config', function() {
    ipc.send('config-saved');
});
 	

$( "#tabs" ).on( "tab-added", function( event, param ) {
    $( ".btn-proj-save", "#" + param ).button()
                                    .on( "click", function() {
                                        saveProject( param );
                                    });
});

// --------------------------------------------------------------

function saveProject( id ) {
    let counter = id.substr(id.lastIndexOf('-') + 1);
    let accordContent = [];

    let projDir = openProjects[ id ].path.slice( 0, openProjects[ id ].path.lastIndexOf('/'));
    // console.log( "projDir " + projDir );

    $( ".group", "#accordion-" + counter).each( function( index, value ) {
        let tempEntry = {};

        let tempStr =  $( "> h3", value ).text();
        tempStr = tempStr.slice( 0, tempStr.indexOf( "Remove Tab" ) );
        tempEntry.name = tempStr;

        $( "> div", value ).children().each( function( index, childValue ) {
            let result = "";

            switch ( childValue.nodeName ) {
                case "IMG":
                    if ( childValue.className === "preview-source" ) {
                        tempEntry.type = "Image";
                        // tempEntry.path = childValue.src.substr( 8 );
                        result = isInsideProjectDir( childValue.src.substr( 8 ) );
                        if ( result === "" ) {
                            console.log( "Path outside of project-dir!" );
                            console.log( result );
                        }
                        tempEntry.path = result;
                    }
                    else if ( childValue.className === "thumb-content" ) {
                        // tempEntry.thum = childValue.src.substr( 8 );
                        result = isInsideProjectDir( childValue.src.substr( 8 ) );
                        if ( result === "" ) {
                            console.log( "Path outside of project-dir!" );
                            console.log( result );
                        }
                        tempEntry.thum = result;
                    }
                    else {
                        console.log( "IMG with wrong class!" );
                    }
                    break;

                case "AUDIO":
                    tempEntry.type = "Audio";
                    // tempEntry.path = childValue.src.substr( 8 );
                    result = isInsideProjectDir( childValue.src.substr( 8 ) );
                    if ( result === "" ) {
                        console.log( "Path outside of project-dir!" );
                        console.log( result );
                    }
                    tempEntry.path = result;
                    break;

                case "VIDEO":
                    tempEntry.type = "Video";
                    // tempEntry.path = childValue.src.substr( 8 );
                    result = isInsideProjectDir( childValue.src.substr( 8 ) );
                    if ( result === "" ) {
                        console.log( "Path outside of project-dir!" );
                        console.log( result );
                    }
                    tempEntry.path = result;
                    break;

                case "BUTTON":
                    tempEntry.type = "App";
                    // tempEntry.path = $( "> div > button", value ).data( "path" );
                    result = isInsideProjectDir( $( "> div > button", value ).data( "path" ) );
                    if ( result === "" ) {
                        console.log( "Path outside of project-dir!" );
                        console.log( result );
                    }
                    tempEntry.path = result;
                    break;

                case "P":
                    tempEntry.text = childValue.innerHTML;
                    break;

                case "BR":
                    break;

                default:
                    console.log( "def " + childValue.nodeName );

            }
        });

        accordContent.push( tempEntry );
        
    });

    // console.log ( accordContent );
    openProjects[ id ].data.entry = accordContent;

    openProjects[ id ].data.header.student = $("#student-" + counter).val();
    openProjects[ id ].data.header.title = $("#project-" + counter).val();

    let jsonFile = JSON.stringify( openProjects[ id ].data );

    fse.writeFile( openProjects[ id ].path, jsonFile, "utf8", function(err) {
        if (err) {
            errorMessage("error writing file\n" + err);
        } 
    });


    function isInsideProjectDir( argPath ) {
        if ( argPath.indexOf( projDir ) === 0 ) {
            return argPath.replace( projDir, "" );
        }
        else {
            return "";
        }        
    }


}