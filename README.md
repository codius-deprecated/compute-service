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
node server
```
