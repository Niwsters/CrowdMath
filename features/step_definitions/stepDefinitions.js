randomString = function(length) {
	var possible, text;

	possible = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ ";
	for(var i=0; i<length; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}

	return text;
}

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

	this.When(/^I write text into the textarea that appears$/, function(callback){
		var text = randomString();
		this.browser.fill('textarea', text);
		callback(this.browser.assert.attribute('textarea', 'value', text));
	});

	this.Then(/^I should see a new textarea appear$/, function(callback) {
		callback(this.browser.assert.elements('textarea'), 1);
	});
}

module.exports = stepDefinitionsWrapper
