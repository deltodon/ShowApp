

// --------------------------------------------------------------

$( function() {
    initView();
} );


function initView() {
    var backBtn = $( "#btn-back-to-main" )
                    .button()
                    .on( "click", function() {
                        console.log("clicked!");
                        $("#view-front").show();
                        $("#back-label").hide();
                        $( this ).hide();
                    })
                    .hide();

    $( ".proj-card" ).on( "click", function() {
        console.log("hide!");
        $("#view-front").hide();
        backBtn.show();
        $("#back-label").show();
    });
}



// --------------------------------------------------------------
