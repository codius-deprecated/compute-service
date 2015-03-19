var request = require('request-promise');
var config = require('../lib/config');

module.exports = function() {
}

module.exports.prototype = {
  run: function(data) {
    return request(config.get('codius:endpoint'));
  }
}
