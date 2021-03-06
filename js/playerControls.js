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

function playerKeydown(event) {
	var keyCode = event.which;

	if (keyCode == keys.LEFT) movePlayer('left');
	if (keyCode == keys.RIGHT) movePlayer('right');	
}
document.addEventListener("keydown", playerKeydown);