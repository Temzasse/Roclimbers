$(document).ready(function(){

	var now							= 0
	var seconds						= null;
	var video						= null;
	//var overlay					= null;
	var sounds						= [];
	var sound						= null;

	var audio_sources				= ["audio/OneMan.mp3", "audio/OneDecision.mp3", "audio/JustASec.mp3", "audio/Uujea.mp3"];


	// get the videojs video player
	_V_("roclimbers-video").ready(function(){
      	video = this;


	    var v = document.getElementById('roclimbers-video_html5_api');
	    var canvas = document.getElementById('roclimbers-canvas');
	    var context = canvas.getContext('2d');
	    var back = document.createElement('canvas');
	    var backcontext = back.getContext('2d');

	    var cw,ch;

	    video.on('play', function(){
	    	$("#roclimbers-canvas-wrapper").addClass("visible");
	        //cw = v.clientWidth;
	        //ch = v.clientHeight;
	        cw = $("#roclimbers-video").outerWidth();
	        ch = $("#roclimbers-video").outerHeight();
	        canvas.width = cw;
	        canvas.height = ch;
	        back.width = cw;
	        back.height = ch;
	        draw(v,context,backcontext,cw,ch);
	    },false);



  	});

	for (var i = 0; i <= 3; i++) {
		sound = new Audio();
		sound.addEventListener( "canplaythrough", function( event ) {
			console.log( i.toString() + " sound loaded"  );
		});
		sound.addEventListener( "error", function( event ) {
			console.log( "Sound load failed" );
		});
		sound.src					= audio_sources[i];
		sounds.push(sound);
	};


	// Register the video on timeupdate listener
	video.on('timeupdate', function() {
		now							= parseInt( video.currentTime() );
		
		// 5 seconds cue
		if ( now === 5 ) {
			console.log( "5s mark: play first sound" );
			sounds[0].play();
		}
		// 7 seconds cue
		if ( now === 8 ) {
			console.log( "8s mark: play second sound" );
			sounds[1].play();
		}
		if ( now === 10 ) {
			console.log( "10s mark: play third sound" );
			sounds[2].play();
		}
		// 7 seconds cue
		if ( now === 14 ) {
			console.log( "14s mark: play forth sound" );
			sounds[3].play();
		}
		if ( now >= 16 ) {
			console.log( "16s mark: show optical flares" );
			$("#of-buttons-wrapper").show();
		}
		else{
			$("#of-buttons-wrapper").hide();
		}
	});


	// manage overlays
	$(".of-button").click(function(){
		// change buttons class
		$(this).toggleClass("selected");
		$("#of-"+$(this).attr("id")).toggleClass("visible");
		
	});
	$(".cnv-button").click(function(){
		if( $(this).hasClass("selected") ){
			// remove the selection from all buttons
			$(".cnv-button").each(function(){
				$(this).removeClass("selected");
			});
		}
		else{
			// remove the selection from all buttons
			$(".cnv-button").each(function(){
				$(this).removeClass("selected");
			});
			// and then add it to the clicked button
			$(this).addClass("selected");
		}
	});





	// Canvas stuff!!
	function draw(v,c,bc,w,h) {
	    if(video.paused() || video.ended() ) return false;
	    // First, draw it into the backing canvas
	    bc.drawImage(v,0,0,w,h);
	    // Grab the pixel data from the backing canvas
	    var idata = bc.getImageData(0,0,w,h);
	    var data = idata.data;

	    // check if the B&W button is selected
	    if ( $("#bw").hasClass("selected") ){

		    // Loop through the pixels, turning them grayscale
		    for(var i = 0; i < data.length; i+=4) {
		        var r = data[i];
		        var g = data[i+1];
		        var b = data[i+2];
		        var brightness = (3*r+4*g+b)>>>3;
		        data[i] = brightness;
		        data[i+1] = brightness;
		        data[i+2] = brightness;
		    }
	    }
	    else if ( $("#invert").hasClass("selected") ){
	    	for(var i = 0; i < data.length; i+=4) {
	          // red
	          data[i] = 255 - data[i];
	          // green
	          data[i + 1] = 255 - data[i + 1];
	          // blue
	          data[i + 2] = 255 - data[i + 2];
	        }
	    }
	    idata.data = data;
	    // Draw the pixels onto the visible canvas
	    c.putImageData(idata,0,0);
	    // Start over!
	    setTimeout(function(){ draw(v,c,bc,w,h); }, 0);
	}






});