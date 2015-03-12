var path = require('path');
var config = require('../lib/config');

module.exports = {
  workers: config.get('beanstalk:workers'),
  server: config.get('beanstalk:server'),
  tubes: ['instance-launch'],
  handlers: [path.resolve(__dirname, '../workers/launch')]
};
