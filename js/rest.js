$( document ).ready(function() {

  var first = true;

  $("#get-pics").click(function(){
    if ( first ){
      first = false;
      $("#get-pics").text('Hae uudestaan');
      getFlickrPics();
    }
    else{
      getFlickrPics();
    }
    
  });


  $(".get-wiki-info").click(function(){
    getWikiArticle( $(this).val() );
  });
  

});

function getFlickrPics() {

  var flickerAPI = "http://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?";
  $.getJSON( flickerAPI, {
    tags: "rock climbing",
    tagmode: "any",
    format: "json"
  })
    .done(function( data ) {
      // tarkasta onko jo haettu kuvia
      if ( $("#flickr-pics").length > 0 ){
        $("#flickr-pics").empty();
      }
      // lataa uudet kuvat (4kpl)
      $.each( data.items, function( i, item ) {
        $( "<img>" ).attr( "src", item.media.m ).appendTo( "#flickr-pics" );
        if ( i === 3 ) {
          return false;
        }
      });
    });
}


function getWikiArticle( topic ){
 
  // hae tietyn aiheen data
  $.getJSON('http://en.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&exintro=1&explaintext=&titles='+ topic +'&callback=?', function(data){

    $.each( data.query.pages, function(i, page){
      console.log(page.title);
      // Lisää otsikko ja aiheen wikipedia sivun intro osuus
      $("#wiki-topic-wrapper h2").html(page.title);
      $("#wiki-topic-wrapper p").html(page.extract);

    });
  });
}

