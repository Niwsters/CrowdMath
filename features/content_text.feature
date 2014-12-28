Feature: Text content
	As a content creator
	I want to create text on a page about mathematics
	So that I can share my mathematical knowledge

	Scenario: Add a text component
		Given I am on the IWMPageCreator page
		When I press "Add component"
		Then I should see a new textarea appear
	
	Scenario: Save a page with text component
		Given I am on the IWMPageCreator page
		When I press "Add component"
		And I write text into the textarea that appears
		And I press "Create link"
		And I press the link that is created
		Then I should see the text I wrote in the page that appears
