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