var request = require('supertest'),
    factory = require('./factory'),
    should = require('should'),
    assert = require('assert'),
    app = require('../server.js'),

    password = 'lolpan';

describe('/login', function () {

  describe('POST', function () {

    it('should redirect to /app if authentication succeeds', function (done) {
      var user = factory.User({
        password: password
      });

      user.save(function (err) {
        should.not.exist(err);

        request(app)
          .post('/login')
          .send({
            email: user.email,
            password: password
          })
          .end(function (err, res) {
            should.not.exist(err);
            res.header.location.should.equal('/app');
            done();
          });
      });

    });

    it('should redirect to /login if authentication fails', function (done) {
      request(app)
        .post('/login')
        .send({
          email: 'tester@test.com',
          password: 'wrongpassword'
        })
        .end(function (err, res) {
          should.not.exist(err);
          res.header.location.should.equal('/login');
          done();
        });
    });

  });
});