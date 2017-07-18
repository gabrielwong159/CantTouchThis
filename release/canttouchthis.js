var css = document.createElement("style");
css.type = "text/css";
css.innerHTML = `
@font-face {
	font-family: arcade;
	src: url('fonts/arcadeclassic.ttf');
}

html {
	height: 100%;
}

body {
	height: 100%;

	margin: 0;
	padding: 0;

	overflow: hidden;
}

div#game {
	width: 100%;
	height: 100%;
}

div#game-play-area {
	background-color: rgba(0,255,255,0.5);
	
	position: relative;
	margin: 0 auto;

    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    -moz-tap-highlight-color: rgba(0, 0, 0, 0);
}

div#player {
	background-color: #76ff03;

	position: absolute;
}

div.enemy {
	position: absolute;
}

div.tony {
	background-color: red;
	border-radius: 50%;
}

div.speedy {
	background-color: rgba(255,127,0,0.5);
	border-radius: 25%;
}

div.blinky {
	background-color: yellow;
}

p.game {
	color: white;
	font-family: arcade;

	margin: 0;

	cursor: default;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
}

p#scoreboard {
	color: black;
	text-align: right;
	letter-spacing: 1px;

	padding-right: 5px;
}

p#levelboard {
	text-align: center;
	font-size: 32px;
	letter-spacing: 3px;

	padding-top: 50%;
}

p#descriptionboard {
	text-align: center;
	font-size: 24px;
	letter-spacing: 2px;

	padding-top: 10%;
}`;

document.body.appendChild(css);


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


function playerMovement(pos) {
	var animation = {
		p: {
			left: pos
		},
		o: {
			duration: playerSpeed,
			easing: "swing"
		}
	};

	return animation;
}

var playerDeath = {
	p: {
		opacity: 0,
		backgroundColor: '#000000'
	},
	o: {
		duration: 2000
	}
};

function enemyMovement(enemyDuration) {
	var animation = {
		p: {
			top: MAP_HEIGHT
		},
		o: {
			duration: enemyDuration,
			easing: "linear",
			complete: function() {
				clearEnemy($(this));
			}
		}
	};

	return animation;
}

function enemyMovementSpeedy(enemyDuration) {
	var firstBound = MAP_HEIGHT/4;
	var secondBound = firstBound*3 - ENEMY_HEIGHT;
	var lastBound = MAP_HEIGHT;

	var animation = {
		first: {
			p: {
				top: firstBound
			},
			o: {
				duration: enemyDuration/4,
				easing: "linear"
			}
		},
		colour_activate: {
			p: {
				backgroundColorAlpha: 1
			},
			o: {
				duration: 300
			}
		},
		second: {
			p: {
				top: secondBound
			},
			o: {
				duration: enemyDuration/4,
				easing: "linear"
			}
		},
		last: {
			p: {
				top: lastBound,
				backgroundColorAlpha: 0.5
			},
			o: {
				duration: enemyDuration/2,
				easing: "linear",
				complete: function() {
					clearEnemy($(this));
				}
			}
		}
	};

	return animation;
}

function enemyFade(interval) {
	var animation = {
		fadeOut: {
			p: {
				opacity: 0
			},
			o: {
				duration: interval,
				easing: "linear",
				queue: false
			}
		},
		fadeIn: {
			p: {
				opacity: 1
			},
			o: {
				delay: interval*2,
				duration: interval,
				easing: "linear",
				queue: false
			}
		}
	};

	return animation;
}

var enemySlayer = {
	p: {
		backgroundColor: '#ffffff',
		scale: 0.25
	},
	o: {
		duration: 500,
		queue: false
	}
};

var enemyDeath = {
	p: {
		opacity: 0
	},
	o: {
		duration: 1000,
		queue: false,
		complete: function() {
			$(this).remove();
		}
	}
};


var keys = {};
keys.LEFT = 37;
keys.RIGHT = 39;

var $player = $("#player");

function movePlayer(direction) {
	if (direction == 'left' && playerPos>0) playerPos-= PLAYER_WIDTH;
	else if (direction == 'right' && playerPos < MAP_WIDTH-PLAYER_WIDTH) playerPos+= PLAYER_WIDTH;

	var move = playerMovement(playerPos);
	$player.animate(move.p, move.o);
}

document.addEventListener("keydown", function(event) {
	var keyCode = event.which;

	if (keyCode == keys.LEFT) movePlayer('left');
	if (keyCode == keys.RIGHT) movePlayer('right');
});


function spawnEnemy() {
	//TODO enemy types are hardcoded here, unscalable ):
	var enemy = { type: 1, duration: enemyBaseSpeed+enemySpeedRange };

	if (level == 1) enemy = { type: 1, duration: enemyBaseSpeed };
	else if (level == 2) enemy = { type: 2, duration: enemyBaseSpeed+enemySpeedRange/2 };
	else if (level == 3) enemy = { type: Math.floor(Math.random()*2)+1, duration: enemyBaseSpeed+enemySpeedRange/2 };
	else if (level == 4) enemy = { type: Math.floor(Math.random()*2)+1, duration: enemyBaseSpeed + Math.floor(Math.random() * enemySpeedRange) };
	else if (level == 5) enemy = { type: 3, duration: enemyBaseSpeed+enemySpeedRange/2 };
	else if (level == 6) enemy = { type: Math.floor(Math.random()*3)+1, duration: enemyBaseSpeed+enemySpeedRange/2 };
	else if (level == 7) enemy = { type: Math.floor(Math.random()*3)+1, duration: enemyBaseSpeed + Math.floor(Math.random() * enemySpeedRange) };

	createEnemy(enemy.type, enemy.duration);
	enemiesSpawned++;

	for (var i=1; i<LEVELS.length; i++) if (enemiesSpawned == LEVELS[i]) levelUp();
}

function createEnemy(type, enemyDuration) {
	var tempEnemy = document.createElement("div");
	tempEnemy.style.width = ENEMY_WIDTH + "px";
	tempEnemy.style.height = ENEMY_HEIGHT + "px";
	tempEnemy.style.top = -ENEMY_HEIGHT + "px";
	tempEnemy.style.left = (ENEMY_WIDTH * Math.floor(Math.random() * (MAP_WIDTH/PLAYER_WIDTH))) + "px";
	tempEnemy.classList.add("enemy");

	if (type == TONY) tempEnemy.classList.add("tony");
	else if (type == SPEEDY) tempEnemy.classList.add("speedy");
	else if (type == BLINKY) tempEnemy.classList.add("blinky");

	document.getElementById("game-play-area").appendChild(tempEnemy);

	if (type == TONY || type == BLINKY) {
		var move = enemyMovement(enemyDuration);
		$(tempEnemy).velocity(move.p, move.o);

		if (type == BLINKY) {
			var fade = enemyFade(enemyDuration/4);
			$(tempEnemy).velocity(fade.fadeOut.p, fade.fadeOut.o).velocity(fade.fadeIn.p, fade.fadeIn.o);
		}
	}
	else if (type == SPEEDY) {
		var move = enemyMovementSpeedy(enemyDuration);

		$(tempEnemy)
		.velocity(move.first.p, move.first.o)
		.velocity(move.colour_activate.p, move.colour_activate.o)
		.velocity(move.second.p, move.second.o)
		.velocity(move.last.p, move.last.o);
	}
}

function clearEnemy(obj) {
	obj.remove();
	if (!losted) {
		score++;
		updateScore();
	}
}


$(document).ready(function() {
	collisionTrigger = setInterval(collisionDetection, 1000/GAME_FPS);
});

function collisionDetection() {
	var enemies = $(".enemy");
	for (var i=0; i<enemies.length; i++) {
		var enemy = enemies[i].getBoundingClientRect();
		var player = document.getElementById("player").getBoundingClientRect();

		enemy = {
			top: Math.round(enemy.top),
			bottom: Math.round(enemy.bottom),
			left: Math.round(enemy.left),
			right: Math.round(enemy.right)
		}
		player = {
			top: Math.round(player.top),
			bottom: Math.round(player.bottom),
			left: Math.round(player.left),
			right: Math.round(player.right)
		};

		if ((player.left >= enemy.left && player.left < enemy.right) || (player.right > enemy.left && player.right <= enemy.right)) {
			if ((player.top > enemy.top && player.top < enemy.bottom) || (player.bottom > enemy.top && player.bottom < enemy.bottom)) {
				$(enemies[i]).velocity(enemySlayer.p, enemySlayer.o);
				death();
			}
		}
	}
}

function updateScore() {
	$("#scoreboard").text(score);
}

function updateLevel() {
	$("#levelboard").text("LEVEL " + level);
	$("#descriptionboard").text(DESCRIPTIONS[level]);
	// add animations for level text?
}

function levelUp() {
	level++;
	window.clearInterval(spawnTrigger);
	setTimeout(function() { spawnTrigger = setInterval(spawnEnemy, enemyInterval); updateLevel(); }, enemyBaseSpeed + enemySpeedRange/2);
}

function death() {
	losted = true;

	$(".enemy").velocity(enemyDeath.p, enemyDeath.o);
	$player.velocity(playerDeath.p, playerDeath.o);

	window.clearInterval(spawnTrigger);
	window.clearInterval(collisionTrigger);
}


function startGame() {
	$gameArea = document.getElementById("game-play-area");
	$gameArea.removeEventListener("click", startGame);
	document.removeEventListener("keydown", startGame);

	$gameArea.onclick = function(event) {
		if (event.offsetX < (playerPos + PLAYER_WIDTH/2)) movePlayer("left");
		else movePlayer("right");
	}

	updateLevel();
	spawnTrigger = setInterval(spawnEnemy, enemyInterval);
}


$(document).ready(function() {
	document.getElementById("game-play-area").addEventListener("click", startGame);
	document.addEventListener("keydown", startGame);
});