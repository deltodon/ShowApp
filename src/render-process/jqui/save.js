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

    let accordData = $(".accord-select:visible").data( "project" );
    // console.log ( "accordData = " + accordData );




    openProjects[ id ].data.header.student = $("#student-" + counter).val();
    openProjects[ id ].data.header.title = $("#project-" + counter).val();

    //obj.data.entry.push({path: "Anna", text: true});
    let jsonFile = JSON.stringify( openProjects[ id ].data );

    fse.writeFile( openProjects[ id ].path, jsonFile, "utf8", function(err) {
        if (err) {
            errorMessage("error writing file\n" + err);
        } 
    });

}