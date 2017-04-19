const ipc = require('electron').ipcRenderer;
const previewButton = document.getElementById('btn-preview');

const projCardTemplate = "<div id='#{card}' class='proj-card'><div class='proj-cover'>#{image}</div><div class='proj-label'>\
                          <div class='student-name-tag'>#{name}</div><div class='proj-name-tag'>#{title}</div></div></div>"

// --------------------------------------------------------------

$( function() {
    previewButton.addEventListener('click', function (event) {
        generateSlideShow();
        $("#wrapper").hide();
        $("#view-main").show();
        ipc.send('preview-on');
    });

    ipc.on('preview-off', function() {
        $("#view-main").hide();
        $("#wrapper").show();
        $("#proj-card-wrapper").empty();
    });


    var backBtn = $( "#btn-back-to-main" )
                    .button()
                    .on( "click", function() {
                        // console.log("clicked!");
                        $("#view-front").show();
                        $("#view-title span").text("");
                        $("#back-label").hide();
                        $( this ).hide();
                        $("#slideshow-1").hide();
                    })
                    .hide();


    function generateSlideShow() {
        let list = $("#tabs ul li a");
        let id, tempHash, projCard;
        // name, title;
        
        if (list.length > 0)
        {
            $.each(list, function( index, value ) {
                // console.log( value.hash );
                tempHash = value.hash;
                id = tempHash.substr(tempHash.lastIndexOf('-') + 1);
                // console.log( id );
                projCard = projCardTemplate.replace( /#\{card\}/g, "proj-card-" + id )
                                        .replace( /#\{image\}/g, "" )
                                        .replace( /#\{name\}/g, $("#student-" + id).val() )
                                        .replace( /#\{title\}/g, $("#project-" + id).val() );

                $("#proj-card-wrapper").append( projCard );

                $( "#proj-card-" + id ).on( "click", function() {
                    // console.log("hide!");
                    $("#view-front").hide();
                    backBtn.show();
                    $("#back-label").show();
                    $("#view-title span").text( $("div .student-name-tag", this).text() );
                    $("#slideshow-1").show();        
                });

            });
        }
        else {
            console.log( 'list undefined' );
        }
    }

});