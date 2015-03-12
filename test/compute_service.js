var Promise = require('bluebird').Promise;

Promise.longStackTraces();

var assert          = require('assert');
var path            = require('path')
var ComputeService  = require(path.join(__dirname, '/../lib/compute_service'))
var ec2             = require(path.join(__dirname, '/../lib/aws')).ec2;

describe('Compute Service', function() {
  var compute;

  before(function() {
    compute = new ComputeService();
  });

  it('should start a new running instance', function(done) {

    return compute.startInstance(null, null, null, 'rippled_version: fc8bf39043b13505813a25e6aac1441a96dfe023')
      .then(function(instance) {
        assert(instance);
        assert(instance.ip_address);
        assert(instance.container_uri);
        assert.strictEqual(instance.state, 'pending');

        // Terminate the instance
        var params = {
          InstanceIds: [
            instance.container_uri
          ]
        };
        return ec2.terminateInstancesAsync(params).then(function() {
          done();
        });
      });
  });
});