var should = require('should'),
  assert = require('assert'),
  app = require('../server.js'),
  request = require('supertest');

describe('restricted', function () {
  var restrictedRoutes = {
      get: [

      ],
      post: [
        '/book',
        '/page'
      ],
      put: [
        '/book',
        '/page'
      ],
      delete: [
        '/book',
        '/page'
      ]
    },
    method, routes, route,
    redirectTest = function (route, method) {
      it(route + ' ' + method + ' should redirect to / if not logged in', function (done) {
        request(app)[method](route)
          .end(function (err, res) {
            should.not.exist(err);
            res.header.location.should.equal('/');
            done();
          });
      });
    };

  for (method in restrictedRoutes) {
    routes = restrictedRoutes[method];
    for (route in routes) {
      redirectTest(routes[route], method);
    }
  }

});
