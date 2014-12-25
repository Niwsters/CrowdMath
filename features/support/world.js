var zombie = require('zombie');
zombie.localhost('http://safe-island-1660.herokuapp.com/src/html/');

var WorldConstructor = function WorldConstructor(callback) {
	var browser = new zombie();

	var world = {
		browser: browser,
		visit: function(url, callback) {
			this.browser.visit(url, callback)
		}
	};

	callback(world);
};

exports.World = WorldConstructor;
