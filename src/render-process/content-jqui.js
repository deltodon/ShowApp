var contentDialog = $( "#content-dialog" ).dialog({
        autoOpen: false,
        modal: true,
        height: 500,
        width: 560,
        resizable: false,
        buttons: {
            Add: function() {
                // addTab();
                $( this ).dialog( "close" );
            },
            Cancel: function() {
                $( this ).dialog( "close" );
            }
        },
        close: function() {
            // form[ 0 ].reset();
        }
    });




// AddTab button: just opens the dialog
$( "#btn-addcontent" )
    .button()
    .on( "click", function() {
        contentDialog.dialog( "open" );
});


$( "#opt-path-btn" )
    .button()
    .on( "click", function() {
        
});







var fileTypes = $("#content-buttonset > input").checkboxradio({
    icon: false
});

fileTypes.checkboxradio('option', 'position', 'center');


