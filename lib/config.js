var nconf = require('nconf');
var dotenv = require('dotenv');

dotenv.load();

nconf.use('memory');
nconf.env();

nconf.defaults({
  aws: {
    accessKeyId: nconf.get('AWS_ACCESS_KEY_ID'),
    secretAccessKey: nconf.get('AWS_SECRET_ACCESS_KEY')
  }
});

module.exports = nconf;
