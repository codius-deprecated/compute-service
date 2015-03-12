var nconf = require('nconf');
var dotenv = require('dotenv');

dotenv.load();

nconf.use('memory');
nconf.env();

nconf.defaults({
  BEANSTALK_SERVER: '127.0.0.1:11300'
});

if (nconf.get('BEANSTALKD_PORT')) {
  nconf.set('BEANSTALK_SERVER', nconf.get('BEANSTALKD_PORT_11300_TCP_ADDR')+':'+nconf.get('BEANSTALKD_PORT_11300_TCP_PORT'));
};

nconf.defaults({
  aws: {
    accessKeyId: nconf.get('AWS_ACCESS_KEY_ID'),
    secretAccessKey: nconf.get('AWS_SECRET_ACCESS_KEY')
  },
  beanstalk: {
    server: nconf.get('BEANSTALK_SERVER'),
    workers: 1
  }
});

module.exports = nconf;
