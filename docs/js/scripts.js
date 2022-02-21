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
		this.autokill();
		
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
			
	}
	
	
	autokill(){
		if(this.y > 900){this.kill()};
	}
	kill(){
		delete units[this.id];
		this.col.remove(this.id);
	}
}




const playerMap = new ColObject();
const enemyMap = new ColObject();

const player = new Unit();
player.build('player', 200, 700, 50, 100, 0, 3, 0, playerMap, enemyMap, player.img.src = 'player.png');
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
	mine.build(getid('mine'), Math.floor(Math.random()*400)+50, 0, 50, 50, 1, 0, 5, enemyMap, playerMap, 'mine.png');
	units[mine.id] = mine;
}

function spawnAsteroid(spawn, dir){
	let asteroid = new Unit();
	asteroid.build(getid('asteroid'),spawn, 0, 25, 25, 1, dir, 2, enemyMap, playerMap, 'asteroid.png');
	units[asteroid.id] = asteroid;
}

function spawnDebree(){
	let wall = new Unit();
	wall.build(getid('wall'),Math.floor(Math.random()*400)+50, 0, 100, 50, 1, 0, 1, enemyMap, playerMap, 'spaceDebree.png');
	units[wall.id] = wall;
}

function spawnWall(x){
	let wall = new Unit();
	wall.build(getid('wall'),x, 0, 250, 20, 1, 0, 1, enemyMap, playerMap, 'electricWall.png');
	units[wall.id] = wall;
}

function spawnmeteorite(){
	let met = new Unit();
	met.build(getid('met'),100,0,300, 300, 1, 0, 3, enemyMap, playerMap, 'meteorite.png');
	units[met.id] = met;
	setTimeout(function(){met.kill()}, 2340)
}




function spawnShield(){
	
}

function spawnBoost(){
	
}


function spawn(){
	let n = Math.random();
	
	if (n > .9){spawnmeteorite()}
	else if (n > .8){spawnShield()}
	else if (n > .7){spawnWall(0)}
	else if (n > .6){spawnAsteroid(450, -1)}
	else if (n > .5){spawnMine()}
	else if (n > .4){spawnDebree()}
	else if (n > .3){spawnWall(250)}
	else if (n > .2){spawnAsteroid(50, 1)}
	else if (n > .1){spawnBoost()}
	else{return}
} 



var bgLoop = 1;
const img = new Image();


function backgroundLoop(){
	map.clearRect(0,0,500,1000);
	map.drawImage(img, 0, 0);
	img.src = 'bgGIF/space'+bgLoop+'.png';
	bgLoop++;
	if(bgLoop>19){bgLoop = 1};

}


function animate(){
	for(let unit of Object.values(units)){
		unit.loop();
	}

};

setInterval(backgroundLoop, 300);
setInterval(animate, 10);
setInterval(spawn, 1000); 
