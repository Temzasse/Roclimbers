$( document ).ready(function() {

	var allNews = [];

	// Tarkastetaan onko käyttäjä jo ladannut uutiset
	if (localStorage.newsIndex && localStorage.news){
		// Tässä olisi fiksua tarkastaa onko Firebasessa uusia uutisia, mutta sitä ei vaadita kurssilla
		// Tämän hetkisen implementaation avulla käyttäjä voi katsoa ainoastaan ensimmäisellä käyntikerralla ladattuja uutisia!!

		//näytä viimeisin katseltu uutinen localStoragesta
		allNews = JSON.parse(localStorage.news);	//tallenna local storagessa olevat uutiset muuttujaan
		loopNews( JSON.parse(localStorage.news), localStorage.newsIndex );
	}
	else{
		//lataa uudet uutiset Firebasesta
		// ja aloita loop
		load_news( function( news ){
			loopNews( news, 0 );
		});
		
	}
	
	$("#pause").click( function(){
		pause();
	});

	$("#resume").click( function(){
		resume();
	});

	$("#prev").click( function(){
		prev();
	});

	$("#next").click( function(){
		next();
	});



	

	function load_news( callback ){

		// Haetaan uutiset Firebasesta
		$.getJSON("https://taskult1.firebaseio.com/.json", function( data ){
			// loopataan uutiset läpi
		    $.each( data, function( i, news ){
		    	$.each( news, function( j, piece_of_news ){

		    		allNews.push(piece_of_news);
		    		
		    	});
		    });

		    // tallennetaan local storageen ensimmäinen indexi ja kaikki uutiset
		    localStorage.newsIndex = 0;
		    localStorage.news = JSON.stringify(allNews);

		    callback( allNews );
		  
	  	});
	  	
	}

	
	var the_loop;

	function loopNews( news, index ){

		// lopetetaan aikaisempi loop
		// jotta voidaan aloittaa uusi
		clearInterval(the_loop);

		var len = news.length - 1;

		$("#piece-of-news h3").html( news[index].title );
		$("#piece-of-news p").html( news[index].content );
		$("#piece-of-news span#time").html( timestampToDate( news[index].timestamp ) );

		localStorage.newsIndex = index;
		index++;

		the_loop = window.setInterval( function(){

			if (index > len){
				index = 0;
				localStorage.newsIndex = index;
				$("#piece-of-news").hide();
				$("#piece-of-news h3").html( news[index].title );
				$("#piece-of-news p").html( news[index].content );
				$("#piece-of-news span#time").html( timestampToDate( news[index].timestamp ) );
				$("#piece-of-news").fadeIn(1000);
				index++;
			}
			else{
				localStorage.newsIndex = index;
				$("#piece-of-news").hide();
				$("#piece-of-news h3").html( news[index].title );
				$("#piece-of-news p").html( news[index].content );
				$("#piece-of-news span#time").html( timestampToDate( news[index].timestamp ) );
				$("#piece-of-news").fadeIn(1000);
				index++;
			}
			
		}, 5000);
		
	}

	function pause(){
		clearInterval(the_loop);
		$("#pause").hide();
		$("#resume").show();

	}

	function resume(){
		loopNews( allNews, parseInt(localStorage.newsIndex) );
		$("#resume").hide();
		$("#pause").show();
	}

	function next(){
		if ( parseInt(localStorage.newsIndex) === allNews.length - 1 ){
			loopNews(allNews, 0);
		}
		else{
			loopNews( allNews, parseInt(localStorage.newsIndex) + 1 );
		}
	}

	function prev(){
		if ( parseInt(localStorage.newsIndex) === 0 ){
			loopNews( allNews, allNews.length - 1 );
		}
		else{
			loopNews( allNews, parseInt(localStorage.newsIndex) - 1 );
		}
	}

	function timestampToDate( timestamp ){
		var date = new Date( timestamp * 1000 );
		var hours = date.getHours();
		var minutes = "0" + date.getMinutes();
		var seconds = "0" + date.getSeconds();
		var formattedTime = hours + ':' + minutes.substr(minutes.length-2) + ':' + seconds.substr(seconds.length-2);
		return formattedTime;
	}




});




