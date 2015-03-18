var bluebird = require('bluebird');

bluebird.longStackTraces();

var chai = require('chai');
var expect = chai.expect;
var JobQueue = require('../lib/job-queue');
var sinon = require('sinon');

var TestWorker = function() {
}

TestWorker.prototype = {
  run: function(data) {}
}

describe('JobQueue', function() {
  var queue, worker;

  beforeEach(function() {
    queue = new JobQueue('test_'+Math.round(Math.random()*100));
    worker = new TestWorker();
    queue.addWorker('test', worker);
  });

  it('should run a job after it is enqueued', function() {
    sinon.spy(worker, 'run');
    return queue.enqueueJob('test', {}).then(function() {
      return queue.processNextJob();
    }).then(function() {
      expect(worker.run.called).to.equal(true);
    });
  });
});
