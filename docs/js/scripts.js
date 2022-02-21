const mapObj = document.getElementById("map");
const map = mapObj.getContext('2d');

const units = new Object();

class ColObject{
	constructor(){
		this.map = new Object();
	
	}

	
	add(key, value){
		this.map[key] = value;
	}
	
	remove(key){
		delete this.map[key];
	}
	
	col(list){
		let returnList = [];
		
		for(let val of Object.values(this.map)){	
			if(list[3]>val[1]&&list[1]<val[3]&&list[4]>val[2]&&list[2]<val[4]){returnList.push(val[0])};
		}
		return returnList;
	}
}

class Unit{
	constructor(){
	this.id;
	this.x;
	this.y; 
	this.w;
	this.h;
	
	this.dir;
	this.xs;
	this.ys;
	this.map;
	this.col;
	
	this.img = new Image();
	}
	build(id,x,y,w,h,dir,xs,ys,map,col, img){
		this.id=id;this.x=x;this.y=y;this.w=w;this.h=h;this.dir=dir;this.xs=xs;this.ys=ys;this.map=map;this.col=col; this.img.src = img;
	}
	
	erase(){
		map.clearRect(this.x, this.y, this.w, this.h);
	}
	draw(){
		map.drawImage(this.img, this.x, this.y);
	
	}
	move(){
	if(this.boundry(this.x, this.y)){
		
		this.x+=this.dir*this.xs;
		this.y+=this.dir*this.ys;
	}}
	
	
	getPoints(){
		return [this.id, this.x, this.y, this.x+this.w, this.y+this.h];
	}
	boundry(){
		if(this.x<0 && this.dir<0){return false};
		if(this.x>500-this.w && this.dir>0){return false};
		if(this.y<10 && this.dir<0){return false};
		if(this.y>1000-this.h && this.dir>0){return false};
		
		return true;
	}
	collision(){
		this.map.add(this.id, this.getPoints());
		this.hit(this.col.col(this.getPoints()));
	}
	hit(list){
	if(list.length == 0){return};
		console.log(list);
		if(list.includes('player')){gameOver();}
	
	}
	
	loop(){
		this.erase();
		this.move();
		this.collision();
		this.draw();
		
		console.log(this.y);	
	}
}




const playerMap = new ColObject();
const enemyMap = new ColObject();

const player = new Unit();
player.build('player', 200, 700, 50, 100, 0, 5, 0, playerMap, enemyMap, player.img.src = 'player.png');
units.player = player;

function get(){
	handle(event.clientX);
}

function handle(touch){
	if(touch > 250){if(player.dir == 1){player.dir = 0}else{player.dir = 1}};
	if(touch < 250){if(player.dir == -1){player.dir = 0}else{player.dir = -1}};
	
}

function gameOver(){
	alert('YOU LOSE');
}


function getid(base){
	let n = Math.random().toString();
	return base+n;
}
function spawnMine(){
	let mine = new Unit();
	mine.build(getid('mine'), Math.floor(Math.random()*400)+50, 0, 50, 50, 1, 0, 7, enemyMap, playerMap, 'mine.png');
	units[mine.id] = mine;
}

function spawnAsteroid(){
	let asteroid = new Unit();
	asteroid.build(getid('asteroid'),Math.floor(Math.random()*400)+50, 0, 25, 25, 1, 0, 5, enemyMap, playerMap, 'asteroid.png');
	units[asteroid.id] = asteroid;
}

/* 
function spawn(){
	let n = Math.random();
	
	if (n > .9){}
	else if (n > .8){}
	else if (n > .7){}
	else if (n > .6){}
	else if (n > .5){spawnMine()}
	else if (n > .4){}
	else if (n > .3){}
	else if (n > .2){spawnAsteroid()}
	else if (n > .1){}
	else{return}
} */

function spawn(){
	let n = Math.random();
	
	if (n > .5){spawnMine()}
	
}

function animate(){
	for(let unit of Object.values(units)){
		unit.loop();
	}
};

setInterval(animate, 10);
setInterval(spawn, 1000);