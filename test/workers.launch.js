var Promise = require('bluebird').Promise;
var chai = require('chai');
var expect = chai.expect;
var JobQueue = require('../lib/job-queue');
var sinon = require('sinon');

var LaunchWorker = require('../workers/launch');

describe('launch handler', function() {
  var queue, worker;

  beforeEach(function() {
    queue = new JobQueue('test_'+Math.random()*100);
    worker = new LaunchWorker();
    queue.addWorker('instance_launch', worker);
  });

  it('should handle an instance launch job', function() {
    sinon.spy(worker, 'run');
    return queue.enqueueJob('instance_launch', {}).then(function() {
      return queue.processNextJob();
    }).then(function() {
      expect(worker.run.called).to.equal(true);
    });
  });
});
