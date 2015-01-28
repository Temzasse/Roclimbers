// Player is called first so lets define cnv and ctx here
var cnv = document.getElementById('climbing-game');
var ctx = cnv.getContext("2d");

// Canvas variables
var canW = parseInt($("#climbing-game").width());
var canH = parseInt($("#climbing-game").height());

function Player (x_pos, y_pos, width, height, img_src, grip, speed, frameIndex){
	// Variables
	this.context = ctx;
	this.x_pos = x_pos;
	this.y_pos = y_pos;
	this.height = height;
	this.width = width;

	this.img_src = img_src;
	var image = new Image();
	image.src = img_src;
	this.image = image;

	this.grip = grip;
	this.speed = speed;
	this.frameIndex = frameIndex;
	this.dy = 0;
	this.dx = 0;
}

//Inheritance
//Player.prototype				= new Creature();

// Methods
Player.prototype.getMoreGrip			= function(){
	if( this.grip > 80){
		this.grip = 100;
	}
	else if( this.grip <= 80){
		this.grip += 20;
	}
}




Player.prototype.setCoordinates			=function(x, y){
	this.x_pos = x;
	this.y_pos = y;
}




Player.prototype.move					= function(){
	// going sideways
	if( this.dy === 0 && this.dx !== 0){
		if ( this.frameIndex === 3){
			this.frameIndex = 4;
		}
		else{
			this.frameIndex = 3;
		}
	}
	// going up/down
	else if( this.dx === 0 && this.dy !== 0){
		if ( this.frameIndex === 1){
			this.frameIndex = 2;
		}
		else{
			this.frameIndex = 1;
		}
	}
	// going diagonallthis.dy
	else if( this.dy !== 0 && this.dx !== 0){
		if ( this.frameIndex === 3){
			this.frameIndex = 4;
		}
		else{
			this.frameIndex = 3;
		}
	}
	// staying still
	else{
		this.frameIndex = 0;
	}
	this.x_pos += this.dx*this.speed;
	this.y_pos += this.dy*this.speed;
}




Player.prototype.render					= function(){
	// Draw sprite
	this.context.drawImage(
		this.image,
		this.width * this.frameIndex,
		0,								// crop y
		this.width,
		this.height,
		this.x_pos,				// x position
		this.y_pos,				// y position
		this.width,
		this.height);
}


