var Promise = require('bluebird').Promise;

Promise.longStackTraces();

var assert     = require('assert');
var path       = require('path')
var compute    = require(path.join(__dirname, '/../../lib'))
var ec2        = require(path.join(__dirname, '/../../lib/aws')).ec2;
var Server     = require(path.join(__dirname, '/../../lib/server'));
var supertest  = require('supertest-as-promised')
var uuid       = require('uuid')

describe('Compute Service HTTP Interface', function() {
  var http, server, token, rippled_commit_hash;

  before(function() {
    rippled_commit_hash = 'fc8bf39043b13505813a25e6aac1441a96dfe023';
  });

  beforeEach(function() {
    server = Server(compute);
    http = supertest(server);
    token = uuid.v4();
  });

  afterEach(function(done) {
    // Retrieve and terminate the instance
    var params = {
      Filters: [{
        Name: 'tag:token',
        Values: [ token ]
      }]
    };
    return ec2.describeInstancesAsync(params).then(function(data) {
      var params = {
        InstanceIds: [
          data.Reservations[0].Instances[0].InstanceId
        ]
      };
      return ec2.terminateInstancesAsync(params).then(function() {
        done();
      });
    });
  })

  it('should start a new running instance', function() {
    return http
      .post('/instances')
      .send({
        token: token,
        container_uri: rippled_commit_hash
        // type: 
        // vars:
        // port: 
      })
      .expect(200)
      .then(function(response) {
        assert(response.body.instance)
        assert.strictEqual(response.body.instance.token, token);
        assert(response.body.instance.ip_address);
        assert.strictEqual(response.body.instance.container_uri, rippled_commit_hash);
        assert.strictEqual(response.body.instance.state, 'pending');
      });
  });
});