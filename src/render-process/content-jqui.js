const {dialog} = require('electron').remote;
const imageIcon = "<i class='fa fa-picture-o fa-fw content-icon'></i>";
const audioIcon = "<i class='fa fa-music fa-fw content-icon'></i>";
const videoIcon = "<i class='fa fa-film fa-fw content-icon'></i>";
const modelIcon = "<i class='fa fa-cubes fa-fw content-icon'></i>";
const appIcon = "<i class='fa fa-cogs fa-fw content-icon'></i>";

// --------------------------------------------------------------

$( function() {
    initAccordions();
} );

// --------------------------------------------------------------

function initAccordions () {
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
        var fileIcon = "";

        var banner = contentTitle.val() || "No name";
        var textContentHtml = contentText.val() || "Text content.";


        var btnFileOption = $('input[name=radio-1]:checked', '#content-buttonset').val();
        console.log( btnFileOption );

        switch ( btnFileOption ) {
            case "image":
                fileIcon = imageIcon;
                console.log( "1" );
                break;

            case "audio":
                fileIcon = audioIcon;
                console.log( "2" );
                break;

            case "video":
                fileIcon = videoIcon;
                console.log( "3" );
                break;

            case "3d":
                fileIcon = modelIcon;
                console.log( "4" );
                break;

            case "app":
                fileIcon = appIcon;
                console.log( "5" );
                break;

            default:
                fileIcon = "??";
                console.log( "D" );

        }

        contentList.append("<div class='group'><h3>" + fileIcon + banner + "<span class=\"ui-icon ui-icon-close\" role=\"presentation\">Remove Tab</span></h3>\
                            <div><p>" + textContentHtml + "</p></div></div>");

        contentList.accordion( "refresh" );

    }

    // --------------------------------------------------------------


    // Close icon: removing the content on click
    contentList.on( "click", "span.ui-icon-close", function() {
        $( this ).closest( "div .group" ).remove();
        // $( "#" + panelId ).remove();
        contentList.accordion( "refresh" );
    });

    var contentDialog = $( "#content-dialog" ).dialog({
        autoOpen: false,
        modal: true,
        height: 500,
        width: 560,
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
        }
    });

    // AddTab form: calls addTab function on submit and closes the dialog
    var contentForm = contentDialog.find( "form" ).on( "submit", function( event ) {
        addContent();
        contentDialog.dialog( "close" );
        event.preventDefault();
    });


    // AddContent button: just opens the dialog
    $( "#btn-addcontent" )
        .button()
        .on( "click", function() {
            contentDialog.dialog( "open" );
    });


    $( "#opt-path-btn" )
        .button()
        .on( "click", function() {
            
    });

    var fileTypeButtons = $("#content-buttonset > input").checkboxradio({
        icon: false
    });

    // fileTypes.checkboxradio('option', 'position', 'center');                        
    
}

// --------------------------------------------------------------



