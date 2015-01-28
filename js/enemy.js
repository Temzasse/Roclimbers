function Enemy (x_pos, y_pos, width, height, img_src, grip, speed, frameIndex){
	//Creature.call( x_pos, y_pos, width, height, img_src, grip, speed );
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
	this.target = [];
	this.dx = 0;
	this.dy = 0;
}

//Inheritance
//Enemy.prototype					= new Creature();


// Methods
Enemy.prototype.setCoordinates		= function(x, y){
	this.x_pos = x;
	this.y_pos = y;
}

Enemy.prototype.determineFrame		= function(){
	// going up/down wise
	if ( Math.abs(this.target[0] - this.x_pos) > Math.abs(this.target[1] - this.y_pos) ){
		if( this.frameIndex === 2){
			this.frameIndex = 3
		}
		else {
			this.frameIndex = 2
		}
	}
	// going sideways
	else{
		if( this.frameIndex === 0){
			this.frameIndex = 1
		}
		else {
			this.frameIndex = 0	
		}
	}
}




Enemy.prototype.move				= function(){
	// check if enemy has reached its target location
	if ( this.hasReachedTarget() ){
		this.getNewTarget();
	}
	// if not --> move towards it
	else{
		this.getNextPosition();
		this.x_pos += this.dx;
		this.y_pos += this.dy;
	}
}


Enemy.prototype.evade				=function(){
	// reverse the speed
	this.speed = this.speed*(-1);
	// move away
	this.move();
	// put the speed back to normal
	this.speed = Math.abs(this.speed);
	// get a new target
	this.getNewTarget();
}


Enemy.prototype.getNextPosition		=function(){
	// move right
	if( this.target[0] - this.x_pos > 0){
		this.dx = this.speed;
	}
	// move left
	if(  this.target[0] - this.x_pos < 0){
		this.dx = this.speed*(-1);
	}
	// move up
	if( this.target[1] - this.y_pos > 0 ){
		this.dy = this.speed;
	}
	// move down
	if( this.target[1] - this.y_pos < 0 ){
		this.dy = this.speed*(-1);
	}
	return;
}

	

Enemy.prototype.hasReachedTarget	= function(){
	if( Math.abs(this.target[0] - this.x_pos) <= this.speed && Math.abs(this.target[1] - this.y_pos) <= this.speed ){
		return true;
	}
}



Enemy.prototype.getNewTarget		= function(){
	// Get new random target coordinates
	this.target = [Math.floor((Math.random() * (canW-this.width))), Math.floor((Math.random() * (canH-this.height)))];
}



Enemy.prototype.render				= function(){
	this.determineFrame();
	// Draw sprite
	this.context.drawImage(
		this.image,
		this.width * this.frameIndex,	// crop x
		0,								// crop y
		this.width,
		this.height,
		this.x_pos,				// x position
		this.y_pos,				// y position
		this.width,
		this.height);
}