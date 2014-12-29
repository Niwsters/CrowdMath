Feature: Math content
	As a content creator
	I want to create math text on a page about mathematics
	So that I can describe my mathematical knowledge

	Scenario: Add math content
		Given I am on the IWMPageCreator page
		When I add math content
		Then a new textarea for math appears
	
	Scenario: Save a page with math content
		Given I am on the IWMPageCreator page
		When I add math content
		And I write some math content
		And I go to the page with the math content
		Then I should see the math content I wrote
