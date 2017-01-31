const GAME_FPS = 30;

const MAP_WIDTH = 300;
const MAP_HEIGHT = 600;

$("#game-play-area").css({
	'width': MAP_WIDTH,
	'height': MAP_HEIGHT
});

const PLAYER_WIDTH = 50;
const PLAYER_HEIGHT = 50;

var playerSpeed = 100;
var playerPos = MAP_WIDTH/2;

$("#player").css({
	'width': PLAYER_WIDTH,
	'height': PLAYER_HEIGHT,

	'top': MAP_HEIGHT - PLAYER_HEIGHT,
	'left': playerPos
});

const ENEMY_WIDTH = 50;
const ENEMY_HEIGHT = 50;

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

var enemyInterval = 500;
var score = 0;
var level = 0;

var spawnTrigger = null;
var collisionTrigger = null;

var losted = false;