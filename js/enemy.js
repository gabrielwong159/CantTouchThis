$(document).ready(function() {
	spawnTrigger = setInterval(spawnEnemy, enemyInterval);
});

function spawnEnemy() {
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

	if (type == 1) tempEnemy.classList.add("enemy1");
	else if (type == 2) tempEnemy.classList.add("enemy2");
	else if (type == 3) tempEnemy.classList.add("enemy3");

	document.getElementById("game-play-area").appendChild(tempEnemy);

	if (type == 1 || type == 3) {
		var move = enemyMovement(enemyDuration);
		$(tempEnemy).velocity(move.p, move.o);

		if (type == 3) {
			var fade = enemyFade(enemyDuration/4);
			$(tempEnemy).velocity(fade.fadeOut.p, fade.fadeOut.o).velocity(fade.fadeIn.p, fade.fadeIn.o);
		}
	}
	else if (type == 2) {
		var move = enemyMovementSpecial(enemyDuration);

		$(tempEnemy)
		.velocity(move.first.p, move.first.o)
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