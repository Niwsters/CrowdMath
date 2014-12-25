Feature: Content
	As a content creator
	I want to create a page about mathematics
	So that I can share my mathematical knowledge

	Scenario: Add a text component
		Given I am on the IWMPageCreator page
		When I press "Add component"
		Then I should see a new textarea appear
