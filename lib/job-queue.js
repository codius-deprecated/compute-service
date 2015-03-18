var bluebird = require('bluebird');
var Promise = bluebird.Promise;
var config = require('./config');
var beanstalk = require('nodestalker');

module.exports = function(tubeName) {
  var self = this;
  self.client = beanstalk.Client(config.get('beanstalk:server'));
  self.workers = {};
  self.tubeName = tubeName;
  bluebird.promisifyAll(self.client, {promisifier: promisify});
  self.tubeDelay = self.client.useAsync(self.tubeName).then(function() {
    return self.client.watchAsync(self.tubeName);
  });
}

module.exports.prototype = {
  useTube: function() {
    return this.tubeDelay;
  },

  addWorker: function(name, worker) {
    var self = this;
    if (typeof(worker.run) !== 'function') {
      throw new Error("Object with a run() method must be passed in");
    }
    self.workers[name] = worker;
  },

  enqueueJob: function(type, data) {
    var self = this;
    var job = {
      type: type,
      data: data
    }
    return self.client.putAsync(JSON.stringify(job));
  },

  processNextJob: function() {
    var self = this;
    var p = [];
    var job;
    return self.client.reserveAsync().then(function(_job) {
      job = _job;
      var realJob = JSON.parse(job.data);
      if (realJob.type in self.workers) {
        var r = self.workers[realJob.type].run(realJob.data);
        if (typeof(r) === 'undefined') {
          r = bluebird.resolve();
        }
        return r.then(function() {
          return self.client.deleteJobAsync(job.id);
        });
      } else {
        //FIXME: Log unhandled job
        return self.client.releaseAsync(job.id);
      }
    });
  }
}

function promisify(method) {
  return function() {
    var self = this;
    var args = arguments;
    return new bluebird.Promise(function(resolve, reject) {
      var r = method.apply(self, args);
      r.onSuccess(function(v) {resolve(v)});
      r.onError(function(err) {reject(new Error(err))});
    });
  }
}
