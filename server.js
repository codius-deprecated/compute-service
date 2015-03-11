var Promise = require('bluebird').Promise;

var AWS = require('aws-sdk');
AWS.config.region = 'us-west-2';

ec2 = new AWS.EC2({apiVersion: '2014-10-01'});
Promise.promisifyAll(Object.getPrototypeOf(ec2));

var rippled_commit_sha = 'fc8bf39043b13505813a25e6aac1441a96dfe023';

// Grab the latest rippled testnet image
var params = {
  Owners: ['self']
};

ec2.describeImagesAsync(params).then(function(data) {
  var rippled_image;
  for (var i=0; i<data.Images.length; i++) {
    // var name_prefix = 'rippled-testnet-{{tag}}';
    var name_prefix = 'rippled testnet ';
    if (name_prefix===data.Images[i].Name.slice(0, name_prefix.length)) {
      if (!rippled_image || 
          rippled_image.Name.slice(name_prefix.length) < data.Images[i].Name.slice(name_prefix.length)) {
        rippled_image = data.Images[i];
      }
    }
  }

  console.log('Starting instance of:', rippled_image.Name);

  // Start the instance
  var params = {
    ImageId: rippled_image.ImageId,
    InstanceType: 'm1.small',
    MinCount: 1, MaxCount: 1,
    UserData: new Buffer('rippled_version: ' + rippled_commit_sha).toString('base64'),
// TODO: Change these
    KeyName: 'bwilson',
    SecurityGroups: [
      'dummy-test',
    ],
  };

  return ec2.runInstancesAsync(params);
}).then(function(data) {
  var instanceId = data.Instances[0].InstanceId;
  console.log("Created instance", instanceId);

  // Add tags to the instance
  var params = {Resources: [instanceId], Tags: [
    {Key: 'Name', Value: 'rippled test '+rippled_commit_sha }
  ]};
  return ec2.createTagsAsync(params);
}).catch(Promise.OperationalError, function (err) {
  console.log('Error running instance:', err.message);
})
