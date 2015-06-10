var factory = require('./factory'),
  initAgent = require('./initAgent'),
  should = require('should'),
  app = require('../server.js'),
  request = require('supertest'),
  assert = require('assert');

describe('/user', function () {

  describe('public', function () {

    describe('GET', function () {
      var user;

      before(function (done) {
        user = factory.User();
        user.save(function (err) {
          should.not.exist(err);
          done();
        })
      })

      it('should return user with given ID', function (done) {
        request(app)
          .get('/user')
          .query({
            id: user.id
          })
          .end(function (err, res) {
            res.body.email.should.equal(user.email);
            done();
          });
      });

    });
  });

  describe('logged in', function () {
    before(function (done) {
      initAgent(done);
    });

    describe('GET', function () {

      it('should return the logged in user if no query is given', function (done) {
        agent
          .get('/user')
          .end(function (err, res) {
            should.not.exist(err);
            res.body.email.should.equal(agent.user.email);
            done();
          });
      });

    });
  });
});