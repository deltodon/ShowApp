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
        contentList.append("<div class=\"group\"><h3 ><i class=\"fa fa-picture-o fa-fw\" style=\"margin: 0px 10px; font-size: 20px;\"></i>Section 1</h3><div>\
                            <p>Mauris mauris ante, blandit et, ultrices a, suscipit eget, quam. Integer ut neque. Vivamus nisi metus, molestie vel, gravida in,\
                                condimentum sit amet, nunc. Nam a nibh. Donec suscipit eros. Nam mi. Proin viverra leo ut odio. Curabitur malesuada.\
                                Vestibulum a velit eu ante scelerisque vulputate.</p></div></div>");

        contentList.accordion( "refresh" );


        // var label = tabTitle.val() || "Tab " + tabCounter,
        //     id = "tabs-" + tabCounter,
        //     li = $( tabTemplate.replace( /#\{href\}/g, "#" + id ).replace( /#\{label\}/g, label ) ),
        //     tabContentHtml = tabContent.val() || "Tab " + tabCounter + " content.";

        // tabs.find( ".ui-tabs-nav" ).append( li );
        // tabs.append( "<div id='" + id + "'><p>" + tabContentHtml + "</p></div>" );
        // tabs.tabs( "refresh" );

        // var index = $('#tabs a[href="#' + id + '"]').parent().index();
        // tabs.tabs("option", "active", index);

        // if( $('#tabs > ul > li').length > maxProjects) {
        //     btnAddProject.button( "disable" );
        // }

        // tabCounter++;
    }

    // --------------------------------------------------------------

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
    
}

// --------------------------------------------------------------



