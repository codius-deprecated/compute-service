var Promise = require('bluebird').Promise;

Promise.longStackTraces();

var assert     = require('assert');
var path       = require('path')
var compute    = require(path.join(__dirname, '/../../lib'))
var ec2        = require(path.join(__dirname, '/../../lib/aws')).ec2;
var Server     = require(path.join(__dirname, '/../../lib/server'));
var supertest  = require('supertest-as-promised')

describe('Compute Service HTTP Interface', function() {
  var http, server;

  beforeEach(function() {
    server = Server(compute);
    http = supertest(server);
  });

  it('should start a new running instance', function(done) {
    return http
      .post('/instances')
      .send({
        // token:
        // container_uri: 
        // type: 
        vars: 'rippled_version: fc8bf39043b13505813a25e6aac1441a96dfe023'
        // port: 
      })
      .expect(200)
      .then(function(response) {
        assert(response.body.instance)
        assert(response.body.instance.ip_address);
        assert(response.body.instance.container_uri);
        assert.strictEqual(response.body.instance.state, 'pending');

        // Terminate the instance
        var params = {
          InstanceIds: [
            response.body.instance.container_uri
          ]
        };
        return ec2.terminateInstancesAsync(params).then(function() {
          done();
        });
      });
  });
});