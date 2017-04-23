const ipc = require('electron').ipcRenderer;
const previewButton = document.getElementById('btn-preview');

const projCardTemplate = "<div id='#{card}' class='proj-card'><div class='proj-cover'><img src='#{image}'></div><div class='proj-label'>\
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
                        $(".slideshow-group").hide();
                    })
                    .hide();


    function generateSlideShow() {
        let list = $("#tabs ul li a");
        let id, projCard;
        
        if (list.length > 0)
        {
            let winCount = 0;

            list.each( function( index, value ) {
                // console.log( "hash = " + value.hash );
                id = value.hash.substr(value.hash.lastIndexOf('-') + 1);
                // console.log( "id = " + id );
                console.log( value.hash );
                projCard = projCardTemplate.replace( /#\{card\}/g, "proj-card-" + id )
                                        .replace( /#\{image\}/g, $("> .tab-proj-cover img", value.hash ).attr("src") )
                                        .replace( /#\{name\}/g, $("#student-" + id).val() )
                                        .replace( /#\{title\}/g, $("#project-" + id).val() );
                                        
                $("#proj-card-wrapper").append( projCard );

                $( "#proj-card-" + id).data( "open", "#slideshow-" + id);

                // $( "#view-body" ).append( "<div id='slideshow-" + id + "' class='slideshow-group'>Testing<div class='thumb-outer'></div></div>" );

                console.log( "id = " + id );
                // $( ".group > div", "#accordion-" + id ).each( function( index, item ) {
                //     $( "#slideshow-" + id ).append( "<div id='slide-win-" + winCount + "' class='slide-window-sel'><div class='slide-data'></div><div class='slide-text'></div></div>");

                //     for (var i = 0; i < item.children.length; i++) {
                //         let childSrc = "";

                //         switch ( item.children[i].nodeName ) {
                //             case "IMG":
                //                 console.log( "Image" );
                //                 // console.log( item.children[i].src );
                //                 // childSrc = item.children[i].src
                //                 $( ".slide-data", "#slide-win-" + winCount ).append( "<img src='" + item.children[i].src + "'>" );
                //                 break;

                //             case "AUDIO":
                //                 // console.log( "Audio" );
                //                 // console.log( item.children[i].src );
                //                 $( ".slide-data", "#slide-win-" + winCount ).append( "<audio src='" + item.children[i].src + "' controls></audio>" );
                //                 break;

                //             case "VIDEO":
                //                 // console.log( "Video" );
                //                 // console.log( item.children[i].src );
                //                 $( ".slide-data", "#slide-win-" + winCount ).append( "<video src='" + item.children[i].src + "' controls></video>" );
                //                 break;

                //             case "BUTTON":
                //                 // console.log( "App" );
                //                 // console.log( $( "button", item ) );
                //                 let optionPath = $( "button", item ).data( "path" );
                //                 $( ".slide-data", "#slide-win-" + winCount ).append( $( "<button id='win-btn-" + winCount + ">Play App</button>" ) );
                //                 $( "#win-btn-" + winCount ).button().data( "path", optionPath )
                //                                            .click( function() { ipc.send( 'run-app', $( this).data( "path" ) ); });        
                //                 break;

                //             case "P":
                //                 // console.log( "Par" );
                //                 // console.log( item.children[i].innerHTML );
                //                 $( ".slide-text", "#slide-win-" + winCount ).append( "<p>" + item.children[i].innerHTML + "</p>" );
                //                 break;

                //             default:
                //                 console.log( "def" );

                //         }             
                //     }

                //     // console.log( item );


                //     $( ".thumb-outer", "#slideshow-" + id ).append( "<div id='thumb-" + winCount + "' class='thumb-sel'><img src='' class='thumbImg'></div>" );
                //     $( "#thumb-" + winCount ).on( "click", function() {
                //         $( ".slide-window-sel:visible", "#slideshow-" + id ).hide();
                //         $( "#slide-win-" + winCount ).show();
                //     });

                //     winCount++;

                // });

                // hide slideshows so they can be shown by clicking on proj-card
                // $("#slideshow" +  + id ).hide();


                $( "#proj-card-" + id ).on( "click", function() {
                    $("#view-front").hide();
                    backBtn.show();
                    $("#back-label").show();
                    $("#view-title span").text( $("div .student-name-tag", this).text() );
                    // console.log( $( this ).data( "open" ) );
                    $( $( this ).data( "open" ) ).show();      
                });

            });
        }
        else {
            console.log( 'list undefined' );
        }
    }

});