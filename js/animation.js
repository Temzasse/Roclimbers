// Get Canvas and Context
//var cnv = document.getElementById('climbing-game');
//var ctx = cnv.getContext("2d");

// Canvas variables
//var canW = parseInt($("#climbing-game").width());
//var canH = parseInt($("#climbing-game").height());


function createGame(){

	// Player starting position (middle of canvas)
	window.middle_x = (canW / 2) - 25;
	window.middle_y = (canH / 2) - 25;

	window.player = new Player(middle_x, middle_y, 35, 50, "images/canvas/climber_new.png", 100, 15, 0);		//x_pos, y_pos, width, height, img_src, grip, speed, frameIndex

	window.creatures = [];
	window.deletedEnemies = [];
	creatures.push(player);

	// locate the enemies at the corners
	window.corners = [ [10, 10], [canW-50, 10], [canW-50, canH-60], [10, canH-60] ]

	// 4 enemies
	var j = 0;
	while (j < 4) {
		window.enemy = new Enemy(corners[j][0], corners[j][1], 35, 50, "images/canvas/enemy_new.png", 100, 5, 0);		//context, x_pos, y_pos, width, height, img_src, grip, speed
		// init enemies targets
		enemy.getNewTarget();
		creatures.push(enemy);
		j++;
	};

	// create the loot
	window.loot = new Loot(0, 0, 17, 19, "images/canvas/loot_new.png");
	loot.newLocation();

	// Animation variables
	window.animationFrame;
	window.fps = 10;
	window.oldTime = 0;
	window.isPaused = false;
	window.grip = 5;			// grip determines how hard the game is! --> easy = 5, medium = 10, hard = 15
	window.gameOver = false;
	// keep track how long the player survives
	window.sec = 0;
	window.min = 0;
}




// this tells if the game is started for the first time
// --> we have to load the images
var firstGame = true;


// Keydown and Keyup events
var KEYCODE_LEFT = 37;
var KEYCODE_UP = 38;
var KEYCODE_RIGHT = 39;
var KEYCODE_DOWN = 40;

var LEFT_DOWN = false;
var RIGHT_DOWN = false;
var UP_DOWN = false;
var DOWN_DOWN = false;

$(document).keydown(function(e) {

	if (e.keyCode == KEYCODE_LEFT) {
		e.preventDefault();
		//console.log("left");
		LEFT_DOWN = true;
		player.dx = -1;
	}
	if (e.keyCode == KEYCODE_RIGHT) {
		e.preventDefault();
		//console.log("right");
		RIGHT_DOWN = true;
		player.dx = 1;
	}
	if (e.keyCode == KEYCODE_UP) {
		e.preventDefault();
		//console.log("up");
		UP_DOWN = true;
		player.dy = -1;
	}
	if (e.keyCode == KEYCODE_DOWN) {
		e.preventDefault();
		//console.log("down");
		DOWN_DOWN = true;
		player.dy = 1;
	}
});

$(document).keyup(function(e) {
	if (e.keyCode == KEYCODE_LEFT) {
		e.preventDefault();
		//check if player has pressed also right
		if( RIGHT_DOWN ){
			player.dx = 1;
		}
		else{
			player.dx = 0;	
		}
		LEFT_DOWN = false;
	}
	if (e.keyCode == KEYCODE_RIGHT) {
		e.preventDefault();
		//check if player has pressed also left
		if( LEFT_DOWN ){
			player.dx = -1;
		}
		else{
			player.dx = 0;	
		}
		RIGHT_DOWN = false;
	}
	if (e.keyCode == KEYCODE_UP) {
		e.preventDefault();
		//check if player has pressed also down
		if( DOWN_DOWN ){
			player.dy = 1;
		}
		else{
			player.dy = 0;	
		}
		UP_DOWN = false;
	}
	if (e.keyCode == KEYCODE_DOWN) {
		e.preventDefault();
		//check if player has pressed also up
		if( UP_DOWN ){
			player.dy = -1;
		}
		else{
			player.dy = 0;	
		}
		DOWN_DOWN = false;
	}
});





// check that player is inside the rect
function checkBoundaries(obj){
	// Check corners
	// TOP RIGHT
	if( (obj.x_pos + obj.dx*obj.speed + obj.width) >= canW && (obj.y_pos + obj.dy*obj.speed) <= 0 ){
		obj.setCoordinates( (canW-obj.width), 0 );
	}
	// TOP LEFT
	if( (obj.x_pos + obj.dx*obj.speed) <= 0 && (obj.y_pos + obj.dy*obj.speed) <= 0 ){
		obj.setCoordinates( 0, 0 );
	}
	// BOTTOM RIGHT
	if( (obj.x_pos + obj.dx*obj.speed + obj.width) >= canW && (obj.y_pos + obj.dy*obj.speed + obj.height) >= canH ){
		obj.setCoordinates( (canW-obj.width), (canH-obj.height) );
	}
	// BOTTOM LEFT
	if( (obj.x_pos + obj.dx*obj.speed) <= 0 && (obj.y_pos + obj.dy*obj.speed + obj.height) >= canH ){
		obj.setCoordinates( 0,  (canH-obj.height) );
	}

	// Check walls
	// RIGHT
	else if( (obj.x_pos + obj.dx*obj.speed + obj.width) >= canW ){
		obj.setCoordinates( (canW-obj.width), (obj.y_pos) );
	}
	// LEFT
	else if( (obj.x_pos + obj.dx*obj.speed) <= 0 ){
		obj.setCoordinates( 0, (obj.y_pos) );
	}
	// BOTTOM
	else if( (obj.y_pos + obj.dy*obj.speed + obj.height) >= canH ) {
		obj.setCoordinates( (obj.x_pos), (canH-obj.height) );
	}
	// TOP
	else if( (obj.y_pos + obj.dy*obj.speed) <= 0 ) {
		obj.setCoordinates( (obj.x_pos), 0 );
	}
}


function checkCollisions(){
	// very simple collision detection
	for (var i = 0; i < creatures.length; i++) {
		
		enemyA = creatures[i];

		// check if creature has hit the loot
		if( hitTest( enemyA, loot ) ) {
			// player hits
			if(i===0){
				player.getMoreGrip();
				console.log("Got more grip");
			}
			loot.newLocation();
		}

		for (var j = i+1; j<creatures.length; j++) {

			enemyB = creatures[j];

			if ( hitTest( enemyA, enemyB ) ){
				// dont move player --> just the enemy
				if(i===0){
					enemyB.evade();
				}
				// move both enemies
				else{
					enemyA.evade();
					enemyB.evade();
				}
			}
		};
	};
}





function stopWatch(){
	if ( !(isPaused) ) {
		sec++;
		 if( sec === 60 ){
		 	min++;
		 	sec = 0;
		 }
		console.log(sec);
	}
	else{
		console.log("Game timer paused");
	}
}


function stopTimer(){
	console.log("Game timer stopped!");
	clearInterval(window.gameTimer);
}


function startTimer(){
	window.gameTimer = setInterval("stopWatch()", 1000);
}




function updateGripBar(){
	$("#bar").css("height", (player.grip).toString()+"%");
	if ( player.grip > 70){$("#bar").css("background", "green")}
	else if ( player.grip > 30){$("#bar").css("background", "yellow")}
	else {$("#bar").css("background", "red")}
}




function loseGrip(){
	
	player.grip -= grip;

	if( (player.grip) <= 0 ){
		player.grip = 0;
		gameOver = true;
	}
	
}



function hitTest( objA, objB){
	// check if objects are going to collide
	if (objA.x_pos+objA.dx < objB.x_pos+objB.dx + objB.width  && objA.x_pos+objA.dx + objA.width  > objB.x_pos+objB.dx &&
		objA.y_pos+objA.dy < objB.y_pos+objB.dy + objB.height && objA.y_pos+objA.dy + objA.height > objB.y_pos+objB.dy) {
		// hit
		return true;

	}
}


function deleteEnemy(x, y){
	for (var i = creatures.length - 1; i >= 0; i--) {
		// skip player
		if ( i===0 ){continue}
		// loop enemies and check if one is clicked
		else{
			if( creatures[i].x_pos < x && x < creatures[i].x_pos+creatures[i].width && creatures[i].y_pos < y && y < creatures[i].y_pos+creatures[i].height ){
				//console.log("osuma");
				// put enemy to deleted enemies
				// and remove enemy from creatures
				deletedEnemies.push(creatures[i]);
				creatures.splice(i,1);
				$("span#info-text").css("color", "#000");
				$("span#info-text").text("Enemy deleted").show().fadeOut( 1000 );
			}
		}
	};
}


// clear the canvas
function clear(){
	ctx.clearRect( 0, 0, canW, canH );
}



// Animate to next frame
function animate(time){
	updateGripBar();
	// Match animation to FPS rate
	if( gameOver ){
		// Stop the timers
		stopTimer();
		clearInterval(window.gripTimer);

		// Show the menu
		$("#menu").show();
		$("#menu h1").text("Game Over!").show();
		if( min === 1 ){
			$("#menu span").text("You lasted " + min + " minute and " + sec + " seconds").show();	
		}
		else if( min > 1){
			$("#menu span").text("You lasted " + min + " minutes and " + sec + " seconds").show();	
		}
		else{
			$("#menu span").text("You lasted " + sec + " seconds").show();
		}
		// Reset difficulty level
		$(".difficulty.active").removeClass("active");
		$("#easy").addClass("active");
	}

	else{
		if((time-oldTime)>(1000/fps)){
			
			clear();

			for (var i = creatures.length - 1; i >= 0; i--) {
				
				creatures[i].move();
				checkCollisions();
				checkBoundaries(creatures[i]);

				// render sprites
				creatures[i].render();
				// render loot
				loot.render();
			}
			updateGripBar();
			oldTime = time;
			
		}

		if( !(isPaused) ){
		// Continue animation loop
		animationFrame = requestAnimationFrame(animate);	
		}
	}
	
	
}








// Game controls:
// Pause / Resume animation
$("#pause").click(function(){
	isPaused = true;
	$("#pause").hide();
	$("#resume").show();
});



$("#resume").click(function(){
	isPaused = false;
	$("#resume").hide();
	$("#pause").show();
	animationFrame = requestAnimationFrame(animate);
});



$("#faster").click(function(){
	if( player.speed < 30 ){
		player.speed += 5;
		
		$("span#info-text").text("");
	}
	else{
		$("span#info-text").css("color", "#000");
		$("span#info-text").text("You have maximum speed!").show().fadeOut( 4000 );
	}
});
		


$("#slower").click(function(){
	if( player.speed > 5 ){
		player.speed -= 5;
		$("span#info-text").text("");
	}
	else{
		$("span#info-text").css("color", "#000");
		$("span#info-text").text("You have minimum speed!").show().fadeOut( 4000 );
	}
});



$("canvas").click(function(e){
	// get the mouse coordinates
	var mouseX = e.clientX + document.body.scrollLeft;
	var mouseY = e.clientY + document.body.scrollTop;

	// calculate the mouse coordinates in the canvas
	var cnvOffset = $(this).offset();
	var mX = mouseX-cnvOffset.left;
	var mY = mouseY-cnvOffset.top;

	// check if enemy is clicked
	deleteEnemy(mX, mY);
});



var cornerTracker = 0;
$("#add").click(function(){
	// check that there arent too many enemies already
	if(creatures.length < 10){
		// check if enemies have been deleted
		if (deletedEnemies.length){
			creatures.push(deletedEnemies[deletedEnemies.length-1]);
			deletedEnemies.pop();
		}
		// if not --> create a new one
		else{
			// locate enemies at corners --> always the next corner
			var newEnemy = new Enemy(corners[cornerTracker%4][0], corners[cornerTracker%4][1], 35, 50, "images/canvas/enemy_new.png", 100, 5, 0);
			newEnemy.getNewTarget();
			creatures.push(newEnemy);
			cornerTracker++;
		}
	}
	else{
		$("span#info-text").css("color", "red");
		$("span#info-text").text("Too many enemies!").show().fadeOut( 4000 );
	}
});



$("#difficulties button").click(function(){
	// change the difficulty level
	$(".difficulty.active").removeClass("active");
	$(this).addClass("active");

	if ( $(this).attr("id") === "easy" ){ grip = 5; }
	else if ( $(this).attr("id") === "medium" ) { grip = 10; }
	else { grip = 15; }
});









function startGame(){

	if( p && e && l){
		// player start losing grip when game starts
		window.gripTimer = window.setInterval(function(){

			if ( isPaused ) {
				console.log("timer paused");
			}
			else{
				loseGrip();
			}
		  
		}, 1000);

		$("#menu").hide();
		$("#game-controls").show();
		$("#grip-bar").css("display", "inline-block");

		startTimer();

		animationFrame = requestAnimationFrame(animate);
	}
}



// Document ready -> Load sprite sheet image
$( document ).ready(loadImage);

// Image loaded -> start animation
function loadImage(){
	p = false;
	e = false;
	l = false;

	$("#start-game").click(function(){

		createGame();

		if( firstGame ){
			// load all images
			player.image.onload = function(){
				p = true;
				startGame();
			}
			creatures[1].image.onload = function(){
				e = true;
				startGame();
			}
			loot.image.onload = function(){
				l = true;
				startGame();
			}
			firstGame = false;
		}
		else{ startGame(); }

	});
	
}


