$( document ).ready(function() {

	// generoidaa arvottava numero
	var numberToGuess = getRandomInteger( 1, 10 );

	$("#reset-guess").click(function(){
		numberToGuess = getRandomInteger( 1, 10 );
		$( "p#guess-response" ).text( "Numero arvottu uudelleen!" ).show().fadeOut( 2000 );
		$( "p#guess-response" ).css("color", "#000");
	});	

	$("form#the-guess").submit(function( event ){
		guessTheNumber( $("#the-guess input").val() );
		event.preventDefault();
	});




	function getRandomInteger( min, max ){
		// +1 jotta saadaan [min, max]
		// muuten olisi [min, max) --> eli max arvoa ei voisi tulla!
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	function guessTheNumber( guess ){
		if ( guess > numberToGuess){
			$( "p#guess-response" ).text( "Liian suuri!" ).show().fadeOut( 2000 );
			$( "p#guess-response" ).css("color", "red");
		}
		else if ( guess < numberToGuess ){
			$( "p#guess-response" ).text( "Liian pieni!" ).show().fadeOut( 2000 );
			$( "p#guess-response" ).css("color", "red");
		}
		else{
			$( "p#guess-response" ).text( "Oikein! Vaikeusaste oli: "+ guess.toString() ).show();
			$( "p#guess-response" ).css("color", "green");
		}
	}

});

