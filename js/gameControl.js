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
	$("#scoreboard").text("Score: " + score);
}

function death() {
	losted = true;

	$(".enemy").velocity(enemyDeath.p, enemyDeath.o);
	$player.velocity(playerDeath.p, playerDeath.o);

	window.clearInterval(spawnTrigger);
	window.clearInterval(collisionTrigger);
}