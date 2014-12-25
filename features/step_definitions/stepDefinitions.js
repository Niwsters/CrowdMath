stepDefinitionsWrapper = function() {
	this.World = require("../support/world.js").World;

	this.Given(/^I am on the IWMPageCreator page$/, function(callback) {
		this.visit('create-page.html', callback);

	});

	this.When(/^I press "([^"]*)"/, function(arg, callback) {
		this.browser.pressButton(arg, function(error) {
			callback(error);
		});

		callback();
	});

	this.Then(/^I should see a new textarea appear$/, function(callback) {
		callback(this.browser.assert.elements('textarea'), 1);
	});
}

module.exports = stepDefinitionsWrapper
