var zombie = require('zombie');

var World = function(callback) {
	var browser = new zombie();

	var world = {
		browser: browser,
	};

	callback(world);
};

exports.World = World;
