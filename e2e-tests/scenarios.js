'use strict';

/* https://github.com/angular/protractor/blob/master/docs/toc.md */

describe('my app', function() {

  browser.get('index.html');

  it('should automatically redirect to /create-page when location hash/fragment is empty', function() {
    expect(browser.getLocationAbsUrl()).toMatch("/create-page");
  });
  
  it('should show text added after following the view link on the page creator', function() {
    browser.get('index.html#/create-page');
    
    var testString = "Blargh.";
    
    var addContentButton = element(by.css("button[add-content-button]"));
    addContentButton.click();
    
    var textInput = element(by.model('inputContent.text'));
    textInput.sendKeys(testString);
    
    element(by.linkText('View the page')).click();
    
    expect(element(by.binding('content.content')).getText()).toEqual(testString);
  });


  describe('create-page', function() {

    beforeEach(function() {
      browser.get('index.html#/create-page');
    });


    it('should add content inputs when "Add content" is clicked', function() {
      var addContentButton = element(by.css("button[add-content-button]"));
      addContentButton.click();
      addContentButton.click();
      expect(element.all(by.css('content-input')).count()).toEqual(2);
    });
    
  });


  describe('view-page', function() {

    beforeEach(function() {
    });
    
    it('should render page from hash link', function() {
      var testString = 'Blargh';
      
      var testPage = {
        contents: [
          {content: testString, type: 'text'}
        ]
      };
      
      var hashPage = encodeURIComponent(JSON.stringify(testPage));
      
      console.log(hashPage);
      
      browser.get('index.html#/view-page/' + hashPage);
      
      expect(element(by.binding('content.content')).getText()).toEqual(testString);
    });

  });
});
