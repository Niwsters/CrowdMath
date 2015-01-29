'use strict';

/* https://github.com/angular/protractor/blob/master/docs/toc.md */

describe('my app', function() {

  browser.get('index.html');

  it('should automatically redirect to /create-page when location hash/fragment is empty', function() {
    expect(browser.getLocationAbsUrl()).toMatch("/create-page");
  });


  describe('create-page', function() {

    beforeEach(function() {
      browser.get('index.html#/create-page');
    });


    it('should render view1 when user navigates to /view1', function() {
      expect(element.all(by.css('[ng-view] p')).first().getText()).
        toMatch(/partial for view 1/);
    });

  });


  describe('view-page', function() {

    beforeEach(function() {
      browser.get('index.html#/view-page');
    });


    it('should render view2 when user navigates to /view2', function() {
      expect(element.all(by.css('[ng-view] p')).first().getText()).
        toMatch(/partial for view 2/);
    });

  });
});
