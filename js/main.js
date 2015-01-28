$( document ).ready(function() {

	// enable tooltip
	$('#to-top img').tooltip();


    // Piilota nav bar kun skrollataan alas päin
    // ja tuo se esiin ku skrollataan ylös päin
	var didScroll;
	var lastScrollTop = 0;
	var delta = 5;
	var navbarHeight = $('nav').outerHeight();

	$(window).scroll(function(event){
	    didScroll = true;
	});

	setInterval(function() {
	    if (didScroll) {
	        hasScrolled();
	        didScroll = false;
	    }
	}, 250);

	function hasScrolled() {
	    var st = $(this).scrollTop();
	    
	    // Make sure they scroll more than delta
	    if(Math.abs(lastScrollTop - st) <= delta)
	        return;
	    
	    // If they scrolled down and are past the navbar, add class .nav-up.
	    // This is necessary so you never see what is "behind" the navbar.
	    if (st > lastScrollTop && st > navbarHeight){
	        // Scroll Down
	        $('nav').removeClass('nav-down').addClass('nav-up');
	    } else {
	        // Scroll Up
	        if(st + $(window).height() < $(document).height()) {
	            $('nav').removeClass('nav-up').addClass('nav-down');
	        }
	    }
	    
	    lastScrollTop = st;
	}


});




// Odotetaan kunnes kuvat ovat latautuneet
$( window ).load(function() {

	if( !( window.mobilecheck() ) ){
		//console.log("Et ole mobiililla");
		// Aloita bg animointi loop
		animate_bg(0);
	}
	else{
		// ei tarvitse näyttää nappuloita jos ei ole animaatiota
		$("#stop-bg-animation").hide();
		$("#start-bg-animation").hide();
	}

	//_______________________________________________________________________
	// Jos ollaan Assignments sivulla
	if( window.location.pathname.indexOf("assignments") > -1 ){

		// jos ollaan mobiililla tai ruutu on valmiiksi pieni
		if( window.mobilecheck() ){
			$("#circular-menu-wrapper").hide();
			$("#mobile-menu-wrapper").show();

		}
		else {
			//jos ruutu on valmiiksi jo pieni
			if( $( window ).width() < 768 ){
				$("#circular-menu-wrapper").hide();
				$("#mobile-menu-wrapper").show();
			}

			// muodostetaan circular menu Assignment sivulla
			var menu_items = 6;
			var menu_diameter = 200; //px
			var radians = Math.radians( ( (360/menu_items)/2 ) );
			create_circular_menu(menu_items, menu_diameter, radians);

			$(".open-circular-menu").click(function(){
				
				$(".triangle span").show("slow");
				$(".open-circular-menu").hide();
				init_circular_animation(radians);
			});

			// Kun ruudun koko on tarpeeksi pieni näytetään mobile menu
			$( window ).resize(function(){
				if( $( window ).width() < 768 ){
					$("#mobile-menu-wrapper").show();
				}
				else{
					$("#mobile-menu-wrapper").hide();
					$("#circular-menu-wrapper").show();
				}
			});
		}
	}
	//_______________________________________________________________________


	// dynaaminen padding_topin määrittely etusivulla ja about sivulla header kuvan takia 
	var pad_top;

	//_______________________________________________________________________
	// Jos ollaan etusivulla
	if( window.location.pathname.indexOf("index") > -1 ){
		pad_top = $("#header-img-home").outerHeight() - $("header").outerHeight();
		$("#home-wrapper").css("padding-top", pad_top);

		$( window ).resize(function() {	
		pad_top = $("#header-img-home").outerHeight() - $("header").outerHeight();
		$("#home-wrapper").css("padding-top", pad_top);
		});

		// Häivytetään sivu näkyviin
		$("#home-wrapper").fadeIn("slow");
	}
	//_______________________________________________________________________




	
	//_______________________________________________________________________
	// Jos ollaan About sivulla
	if( window.location.pathname.indexOf("about") > -1 ){
		pad_top = $("#header-img-center").outerHeight() - $("header").outerHeight();
		$("#about-wrapper").css("padding-top", pad_top);

		$( window ).resize(function() {	
		pad_top = $("#header-img-center").outerHeight() - $("header").outerHeight();
		$("#about-wrapper").css("padding-top", pad_top);
		});

		// Häivytetään sivu näkyviin
		$("#about-wrapper").fadeIn("slow");
	}
	//_______________________________________________________________________



	// Näytä/piilota animation start/stop napit
	$("#stop-bg-animation").click( function(){
		animate_bg_stop();
		$(this).hide();
		$("#start-bg-animation").show();

	});

	$("#start-bg-animation").click( function(){
		animate_bg_continue();
		$(this).hide();
		$("#stop-bg-animation").show();
	});


	// Smoothit page jumpit
	$('a[href*=#]:not([href=#])').click(function() {
		
	    if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') || location.hostname == this.hostname) {

	        var target = $(this.hash);
	        target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
	           if (target.length) {
	             $('html,body').animate({
	                 scrollTop: target.offset().top - $('nav').outerHeight()
	            }, { duration: 1000, queue: false} );
	            return false;
	        }
	    }
	});

		

});

// Muunna asteet radiaaneiksi
Math.radians = function(degrees) {
  return degrees * Math.PI / 180;
};

// Muunna radiaanit asteiksi
Math.degrees = function(radians) {
  return radians * 180 / Math.PI;
};

function create_circular_menu(menu_items, menu_diameter, radians){
	//var radians = Math.radians( ( (360/menu_items)/2 ) );

	// lasketaan menun osien mitat
	var wrapper_height = Math.round(Math.abs(2 * Math.cos(radians) *  menu_diameter * 0.5));
	var wrapper_width = Math.round(Math.abs(2 * Math.sin(radians) * menu_diameter * 0.5));
	var triangle_height = wrapper_height * 0.5;
	var triangle_width = wrapper_width * 0.5;

	while( menu_items > 0){

		// luodaan menun osat
		var wrapper = document.createElement("div");
		wrapper.className = 'menu-unit';
		//wrapper.style.height = (wrapper_height*0).toString()+'px';
		//wrapper.style.width = wrapper_width.toString()+'px';

		// menu osien linkit harjoituksiin
		var link = document.createElement("a");
		link.setAttribute( "href", "#h-"+(menu_items).toString() );

		// kolmiot
		var triangle = document.createElement("div");
		triangle.className = 'triangle';
		triangle.style.borderLeft = triangle_width.toString()+'px'+' solid transparent';
		triangle.style.borderRight = triangle_width.toString()+'px'+' solid transparent';
		triangle.style.borderTop = triangle_height.toString()+'px'+' solid transparent';
		triangle.style.marginTop = (wrapper_height * -0.7).toString()+'px';

		// Lisätään numerointi
		var menu_index = document.createElement("span");
		menu_index.style.bottom = (triangle_width+22).toString()+'px'; //lisätään fontin size --> Dummy implemaatio koska ei jaksanut säätää enempää.
		var t = document.createTextNode(menu_items.toString());
		menu_index.appendChild(t);

		triangle.appendChild(menu_index);
		link.appendChild(triangle);
		wrapper.appendChild(link);
		var element = document.getElementById("circular-menu-wrapper");
		element.appendChild(wrapper);

		// Lisätään viimeiseen elementtiin nappula jolla avataan menu
		if (menu_items === 1){
			var opener_button = document.createElement("span");
			opener_button.className = 'open-circular-menu glyphicon glyphicon-plus-sign';
			//opener_button.style.bottom = triangle_width.toString()+'px';
			opener_button.setAttribute('data-toggle', "tooltip");
			opener_button.setAttribute('data-placement', "bottom");
			opener_button.setAttribute('title', "Avaa menu");
			
			wrapper.appendChild(opener_button);
			// enable tooltio
			$(".open-circular-menu").tooltip();
		}

		menu_items -= 1;
	}
	
}

// käynnistä circular menun animaatio
function init_circular_animation(radians){

	$(".triangle").css("border-top-color", "rgba(0,0,0,0.5)");
	$(".triangle").addClass("enable-hover");

	var deg = Math.degrees(radians);
	var i = deg;
	$('.menu-unit').each(function(){
		$(this).css('-webkit-transform', 'rotate(' + deg.toString() + 'deg)');
		$(this).css('transform', 'rotate(' + deg.toString() + 'deg)');
		deg += 2*i;
	});
	
}

// Animoi bg
function animate_bg(amount){
	var x = amount + 50;
	var y = x;
	x.toString();
	x += "%";
	$( $("body") ).animate({ 'background-position' : x} ,{ duration: 70000, queue: false, easing: "linear"}, function(){
		animate_bg(y);
	});
	
}

// Pysäytä bg animointi
function animate_bg_stop(){
	$( $("body") ).stop();
}

// Jatka bg animointia siitä mihin jäätiin
function animate_bg_continue(){
	var a = $( $("body") ).css("background-position").split("%");
	animate_bg( Math.round(parseInt(a[0])) );
}

// tarkasta onko käyttäjä mobiililaitteella
window.mobilecheck = function() {
var check = false;
(function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true;})(navigator.userAgent||navigator.vendor||window.opera);
return check; };