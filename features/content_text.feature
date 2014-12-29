Feature: Text content
	As a content creator
	I want to create text on a page about mathematics
	So that I can describe my mathematical knowledge

	Scenario: Add text content
		Given I am on the IWMPageCreator page
		When I add text content
		Then a new textarea for text appears
	
	Scenario: Save a page with text content
		Given I am on the IWMPageCreator page
		When I add text content
		And I write some text content
		And I go to the page with the text content
		Then I should see the text I wrote
