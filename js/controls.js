var keys = {};
keys.LEFT = 37;
keys.RIGHT = 39;

document.addEventListener("keydown", function(event) {
	var keyCode = event.which;

	if (keyCode == keys.LEFT) movePlayer('left');
	if (keyCode == keys.RIGHT) movePlayer('right');
});

var $player = $("#player");

function movePlayer(direction) {
	if (direction == 'left' && playerPos>0) playerPos-= 50;
	else if (direction == 'right' && playerPos < 250) playerPos+= 50;

	var move = playerMovement(playerPos);
	$player.animate(move.p, move.o);
}