 $("#game").html( 
`<div id="game-play-area">
	<p class="game" id="scoreboard">0</p>
	<p class="game" id="levelboard">LEVEL 0</p>
	<p class="game" id="descriptionboard">Press anything to start</p>
	<div id="player" />
</div>'`);

const GAME_FPS = 30;

var MAP_WIDTH;
var MAP_HEIGHT;

var width = $("#game").innerWidth();
var height = $("#game").innerHeight();

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

const LEVELS = [
	-1, // level 0: type 1 only, slow
	25, // level 1: type 1 only, fast
	50, // level 2: type 2 only, medium
	75, // level 3: type 1 & 2, medium
	125, // level 4: type 1 & 2, random
	150, // level 5: type 3 only, medium
	175, // level 6: type 1 & 2 & 3, medium
	200 // level: 7 type 1 & 2 & 3, random
]

const DESCRIPTIONS = [
	"Don't touch the falling blocks", // 0
	"Tutorial's over", // 1
	"Here's a new block", // 2
	"Practice time", // 3
	"Practice time", // 4
	"Watch out for Blinky", // 5
	"GLHF", // 6
	"GLHF" // 7
];

var enemyInterval = 750;
var score = 0;
var enemiesSpawned = 0;
var level = 0;

var spawnTrigger = null;
var collisionTrigger = null;

var losted = false;