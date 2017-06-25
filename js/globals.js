$("#game").html( 
	`<div id="game-play-area">
		<p id="scoreboard">Score: 0</p>
		<p id="levelboard">LEVEL 0</p>
		<div id="player" />
	</div>'`);

const GAME_FPS = 30;

var MAP_WIDTH;
var MAP_HEIGHT;

var width = window.innerWidth;
var height = window.innerHeight;

if (width/height < 0.5) {
	MAP_WIDTH = width;
	MAP_HEIGHT = MAP_WIDTH * 2;
}
else {
	MAP_HEIGHT = height;
	MAP_WIDTH = MAP_HEIGHT/2;
}


$("#game-play-area").css({
	'width': MAP_WIDTH,
	'height': MAP_HEIGHT
});

const PLAYER_WIDTH = MAP_WIDTH/6;
const PLAYER_HEIGHT = PLAYER_WIDTH;

var playerSpeed = 100;
var playerPos = MAP_WIDTH/2;

$("#player").css({
	'width': PLAYER_WIDTH,
	'height': PLAYER_HEIGHT,

	'top': MAP_HEIGHT - PLAYER_HEIGHT,
	'left': playerPos
});

const TONY = 1;
const SPEEDY = 2;
const BLINKY = 3;

const ENEMY_WIDTH = PLAYER_WIDTH;
const ENEMY_HEIGHT = PLAYER_HEIGHT;

var enemyBaseSpeed = 2000; //min fall duration
var enemySpeedRange = 3000; //max fall duration = enemyBaseSpeed + enemySpeedRange

// level 0: type 1 only, slow
const LEVEL_ONE = 25; // type 1 only, fast
const LEVEL_TWO = 50; // type 2 only, medium
const LEVEL_THREE = 75; // type 1 & 2, medium
const LEVEL_FOUR = 125; // type 1 & 2, random
const LEVEL_FIVE = 150; // type 3 only, medium
const LEVEL_SIX = 175; // type 1 & 2 & 3, medium
const LEVEL_SEVEN = 200; // type  1 & 2 & 3, random

var enemyInterval = 750;
var score = 0;
var enemiesSpawned = 0;
var level = 0;

var spawnTrigger = null;
var collisionTrigger = null;

var losted = false;