module.exports = function(config){
  config.set({
    
    basePath : './',
    
    preprocessors: {
      'app/create-page/*.html': ['ng-html2js']
    },
    
    ngHtml2JsPreprocessor: {
      stripPrefix: 'app/',
      moduleName: 'templates' 
    },

    files : [
      'app/bower_components/angular/angular.js',
      'app/bower_components/angular-route/angular-route.js',
      'app/bower_components/angular-mocks/angular-mocks.js',
      'app/bower_components/jquery/dist/jquery.min.js',
      'app/mathquill/mathquill.min.js',
      'app/components/**/*.js',
      'app/create-page/**/*.js',
      'app/view-page/**/*.js',
      'app/create-page/*.html'
    ],
    
    autoWatch : true,

    frameworks: ['jasmine'],

    browsers : ['Firefox', 'Chrome'],

    plugins : [
            'karma-chrome-launcher',
            'karma-firefox-launcher',
            'karma-jasmine',
            'karma-junit-reporter',
            'karma-ng-html2js-preprocessor'
            ],

    junitReporter : {
      outputFile: 'test_out/unit.xml',
      suite: 'unit'
    }

  });
};
