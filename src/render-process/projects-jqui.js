// console.log("version: " + jQuery.fn.jquery );
// console.log("ui-version: " + $.ui.version );

const maxProjects = 2;

// --------------------------------------------------------------

$( function() {
    initAccordions();
    initTabs();
} );

// --------------------------------------------------------------

function initAccordions () {
    var temp = $( "#accordion" )
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
    
}

// --------------------------------------------------------------

function initTabs () {
    var tabTitle = $( "#tab_title" ),
    tabContent = $( "#tab_content" ),
    tabTemplate = "<li><a href='#{href}'>#{label}</a> <span class='ui-icon ui-icon-close' role='presentation'>Remove Tab</span></li>",
    tabCounter = 1;
    
    var tabs = $( "#tabs" ).tabs();
    tabs.find( ".ui-tabs-nav" ).sortable({
        axis: "x",
        stop: function() {
            tabs.tabs( "refresh" );
        }
    });


    // Modal dialog init: custom buttons and a "close" callback resetting the form inside
    var dialog = $( "#proj-dialog" ).dialog({
        autoOpen: false,
        modal: true,
        height: 400,
        width: 700,
        resizable: false,
        buttons: {
            Add: function() {
                addTab();
                $( this ).dialog( "close" );
            },
            Cancel: function() {
                $( this ).dialog( "close" );
            }
        },
        close: function() {
            form[ 0 ].reset();
        }
    });

    $( "#dialog-tabs" ).tabs();

    // AddTab form: calls addTab function on submit and closes the dialog
    var form = dialog.find( "form" ).on( "submit", function( event ) {
        addTab();
        dialog.dialog( "close" );
        event.preventDefault();
    });

    // AddTab button: just opens the dialog
    var btnAddProject = $( "#btn-addproject" )
                            .button()
                            .on( "click", function() {
                                dialog.dialog( "open" );
    });

    // Actual addTab function: adds new tab using the input from the form above
    function addTab() {
        var label = tabTitle.val() || "Tab " + tabCounter,
            id = "tabs-" + tabCounter,
            li = $( tabTemplate.replace( /#\{href\}/g, "#" + id ).replace( /#\{label\}/g, label ) ),
            tabContentHtml = tabContent.val() || "Tab " + tabCounter + " content.";
    
        tabs.find( ".ui-tabs-nav" ).append( li );
        tabs.append( "<div id='" + id + "'><p>" + tabContentHtml + "</p></div>" );
        tabs.tabs( "refresh" );

        var index = $('#tabs a[href="#' + id + '"]').parent().index();
        tabs.tabs("option", "active", index);

        if( $('#tabs > ul > li').length > maxProjects) {
            btnAddProject.button( "disable" );
        }

        tabCounter++;
    }

    // Close icon: removing the tab on click
    tabs.on( "click", "span.ui-icon-close", function() {
        var panelId = $( this ).closest( "li" ).remove().attr( "aria-controls" );
        $( "#" + panelId ).remove();
        tabs.tabs( "refresh" );

        btnAddProject.button( "enable" );
    });

    tabs.on( "keyup", function( event ) {
        if ( event.altKey && event.keyCode === $.ui.keyCode.BACKSPACE ) {
            var panelId = tabs.find( ".ui-tabs-active" ).remove().attr( "aria-controls" );
            $( "#" + panelId ).remove();
            tabs.tabs( "refresh" );
        }
    });
}

// --------------------------------------------------------------