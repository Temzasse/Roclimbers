// Creature is called first so lets define cnv and ctx here
var cnv = document.getElementById('climbing-game');
var ctx = cnv.getContext("2d");

// Parent class for Player and Enemy
function Creature (x_pos, y_pos, width, height, img_src, grip, speed){
	// Variables
	this.context = ctx;
	this.x_pos = x_pos;
	this.y_pos = y_pos;
	this.height = height;
	this.widht = width;

	this.img_src = img_src;
	var image = new Image();
	image.src = img_src;
	this.image = image;

	this.grip = grip;
	this.speed = speed;	//pixels per second
}

// Methods
Creature.prototype.setCoordinates	= function(x, y){
	this.x_pos = x;
	this.y_pos = y;
}
Creature.prototype.hasGrip			= function(){
	// check if climber has grip
	if ( grip > 0 ){
		return true;
	}
	else{
		return false;
	}
}
