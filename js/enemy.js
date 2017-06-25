$(document).ready(function() {
	spawnTrigger = setInterval(spawnEnemy, enemyInterval);
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