# compute-service
Codius host compute service to manage running instances.

Runs an instance of the latest **rippled test** AMI.

## Configuration

The following environment variables are used, and may be dropped in a .env file
to be loaded by dotenv:

* AWS_ACCESS_KEY_ID: AWS access key
* AWS_SECRET_ACCESS_KEY: AWS secret key

## Running

```
npm install
docker-compose up
```

This spins up the following:

* A kdihalas/beanstalkd container
* A worker container that executes `npm run worker`
* A web container with ```node server.js```

## Job Processing

compute-service contains a worker that can read jobs from a beanstalkd queue and
spin up instances. To configure, set the variable BEANSTALK_SERVER. The default
value is  ```127.0.0.1:11300```. To run:

```shell
$ ./node_modules/beanstalk_worker/bin/
