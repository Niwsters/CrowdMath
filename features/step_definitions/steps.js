var exampleText = "aksldhf lakshd lhasd";

var steps = function() {
	this.World = require("../support/world.js").World;

	this.Given(/^I am on the IWMPageCreator page$/, function(callback) {
		this.browser.visit('http://localhost:8080/src/html/create-page.html', callback);
	});

	this.When(/^I press "([^"]*)"$/, function(arg, callback) {
		this.browser.pressButton(arg, callback);
	});

	this.Then("I should see a new textarea appear", function(callback) {
		this.browser.assert.element('textarea', 'no textarea appeared');
		callback();
	});

	this.When("I write text into the textarea that appears", function(callback) {
		this.browser.fill('.iwm-text-content', exampleText);
		callback();
	});

	this.When("I press the link that is created", function(callback) {
		this.browser.clickLink('View the page', callback);
	});

	this.Then("I should see the text I wrote in the page that appears", function(callback) {
		this.browser.assert.text('.iwm-content', exampleText);
		callback();
	});
};

module.exports = steps;
