



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
    console.log( "save clicked!" );
    console.log( id );
}