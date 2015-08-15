var should = require('should'),
    equalsModel;

equalsModel = function (model, model2) {
  if(model._id.toString() === model2._id.toString()) {
    return true;
  }
  
  return false;
}

should.Assertion.add(
  'eqlModel',
  function (model2) {
    var model = this.obj;
    
    this.params = {
      operator: 'to equal Mongoose model',
      expected: model2,
      showDiff: true
    };
    
    equalsModel(model, model2).should.equal(true);
  }
);

should.Assertion.add(
  'containModel',
  function (model) {
    var collection = this.obj,
        key,
        contains = false;
    
    this.params = {
      operator: 'to contain Mongoose model',
      expected: model,
      showDiff: true
    };
    
    
    for(key in collection) {
      if (equalsModel(collection[key], model))
        contains = true;
    }
    
    contains.should.equal(true);
  }
);