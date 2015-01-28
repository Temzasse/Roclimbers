function Loot (x_pos, y_pos, width, height, img_src){
	this.context = ctx;
	this.x_pos = x_pos;
	this.y_pos = y_pos;
	this.width = width;
	this.height = height;

	this.img_src = img_src;
	var image = new Image();
	image.src = img_src;
	this.image = image;

	this.captured = false;
	//dummy
	this.dx = 0;
	this.dy = 0;
}


Loot.prototype.newLocation		=function(){
	this.x_pos = Math.floor((Math.random() * (canW-this.width) ) + 1);
	this.y_pos = Math.floor((Math.random() * (canH-this.height) ) + 1);
}

Loot.prototype.render 			= function(){
	// Draw sprite
	this.context.drawImage(
		this.image,
		this.x_pos,	// x position
		this.y_pos,	// y position
		this.width,
		this.height);
}