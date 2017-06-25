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