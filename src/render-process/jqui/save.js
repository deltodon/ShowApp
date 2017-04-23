const fse = require('fs-extra');



// --------------------------------------------------------------

// $( "#tabs" ).on( "tabscreate", function( event, ui ) {
//     console.log( "detected tabscreate" );
// } );

 	

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


    $( ".group", "#accordion-" + counter).each( function( index, value ) {
        let tempEntry = {};

        let tempStr =  $( "> h3", value ).text();
        tempStr = tempStr.slice( 0, tempStr.indexOf( "Remove Tab" ) );
        tempEntry.name = tempStr;

        $( "> div", value ).children().each( function( index, childValue ) {

            switch ( childValue.nodeName ) {
                case "IMG":
                    tempEntry.type = "Image";
                    tempEntry.path = childValue.src.substr( 8 );
                    break;

                case "AUDIO":
                    tempEntry.type = "Audio";
                    tempEntry.path = childValue.src.substr( 8 );
                    break;

                case "VIDEO":
                    tempEntry.type = "Video";
                    tempEntry.path = childValue.src.substr( 8 );
                    break;

                case "BUTTON":
                    tempEntry.type = "App";
                    tempEntry.path = $( "> div > button", value ).data( "path" );
                    break;

                case "P":
                    tempEntry.text = childValue.innerHTML;
                    break;

                default:
                    console.log( "def" );

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

}