var request = require('supertest'),
    app = require('../server.js'),
    assert = require('assert'),
    should = require('should'),
    User = require('../app/models/user.js');
    
    password = 'lolpan';

var loginAgent = function (done) {
  agent
    .post('/login')
    .send({
      email: agent.user.email,
      password: password
    })
    .end(function (err, res) {
      should.not.exist(err);
      should.exist(res.headers['set-cookie']);
      done();
    });
};

var initAgent = function (done) {
  agent = request.agent(app);

  User.findOne({
    email: "agent@test.com"
  }, function (err, user) {

    if (!user) {
      user = new User();
      user.username = "Agent";
      user.email = "agent@test.com";
      user.password = user.generateHash(password);
      user.save(function (err) {
        should.not.exist(err);

        agent.user = user;
        loginAgent(done);
      });
    } else {
      agent.user = user;
      loginAgent(done);
    }
  });
};

module.exports = initAgent;