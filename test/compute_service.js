var Promise = require('bluebird').Promise;

Promise.longStackTraces();

var assert          = require('assert');
var path            = require('path')
var ComputeService  = require(path.join(__dirname, '/../lib/compute_service'))
var ec2             = require(path.join(__dirname, '/../lib/aws')).ec2
var uuid            = require('uuid')

describe('Compute Service', function() {
  var compute, token, rippled_commit_hash;

  before(function() {
    compute = new ComputeService();
    rippled_commit_hash = 'fc8bf39043b13505813a25e6aac1441a96dfe023';
  });

  beforeEach(function() {
    token = uuid.v4();
  })

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
    return compute.startInstance(token, rippled_commit_hash)
      .then(function(instance) {
        assert(instance);
        assert.strictEqual(instance.token, token);
        assert(instance.ip_address);
        assert.strictEqual(instance.container_uri, rippled_commit_hash);
        assert.strictEqual(instance.state, 'pending');
      });
  });
});