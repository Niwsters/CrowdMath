var Support = function() {};

Support.prototype.get = function(sut, url, callback) {
	sut.browser.get(url).then(function(result) {
		callback(result);
	});
};

module.exports = new Support();
