var config = require('./config');
var Promise = require('bluebird').Promise;
var AWS = require('aws-sdk');

AWS.config.update({
  region: 'us-west-2',
  accessKeyId: config.get('aws:accessKey'),
  secretAccessKey: config.get('aws:secretKey')
});

ec2 = new AWS.EC2({
  apiVersion: '2014-10-01'
});

Promise.promisifyAll(Object.getPrototypeOf(ec2));

module.exports = {
  ec2: ec2
}
