#### Step1: docker-compose for running localstack

```yaml
# docker-compose.yml
version: "3.8"
services:
  aws:
    image: localstack/localstack
    environment:
      # Out put error messaging for local development
      DEBUG: 1
      # (optional) Docker network that lambdas are reachable by.
      # This makes it easier for Lambads to be invoked by other
      # external Docker containers.
      LAMBDA_DOCKER_NETWORK: my-local-aws-network
      # Use our local files via Docker volumes to define our Lambdas
      LAMBDA_REMOTE_DOCKER: 0
      # Spin up the Lambda module
      SERVICES: lambda,s3,cloudformation,sts
    ports:
      - 4566:4566
    volumes:
      # Let LocalStack create new docker containers by giving
      # LocalStack access to your computer's Docker daemon
      - /var/run/docker.sock:/var/run/docker.sock
networks:
  default:
    name: my-local-aws-network
```

Now if you go to `http://localhost:4566/health`, you can see all services available

```json
{
  "features": {
    "initScripts": "initialized"
  },
  "services": {
    "acm": "available",
    "apigateway": "available",
    "cloudformation": "available",
    "cloudwatch": "available",
    "config": "available",
    "dynamodb": "available",
    "dynamodbstreams": "available",
    "ec2": "available",
    "es": "available",
    "events": "available",
    "firehose": "available",
    "iam": "available",
    "kinesis": "available",
    "kms": "available",
    "lambda": "available",
    "logs": "available",
    "opensearch": "available",
    "redshift": "available",
    "resource-groups": "available",
    "resourcegroupstaggingapi": "available",
    "route53": "available",
    "route53resolver": "available",
    "s3": "available",
    "s3control": "available",
    "secretsmanager": "available",
    "ses": "available",
    "sns": "available",
    "sqs": "available",
    "ssm": "available",
    "stepfunctions": "available",
    "sts": "available",
    "support": "available",
    "swf": "available"
  },
  "version": "1.0.4.dev"
}
```

#### Step 2: serverless.yml

```yml
service: localstack-demo

plugins:
  - serverless-localstack

custom:
  localstack:
    debug: true
    stages:
      - local
    endpointFile: localstack_endpoints.json
    lambda:
      # Enable this flag to improve performance
      mountCode: src # specify either "true", or a relative path to the root Lambda mount path

provider:
  name: aws
  runtime: nodejs12.x

functions:
  hello:
    handler: src/index.hello
```

Step 3: install serverless globally and serverless-localstack as devDependencies

```
npm install -g serverless
npm install --save-dev serverless-localstack
```

Step 4: create localstack_endpoints.json for localstack services port mapping

```json
{
  "CloudFormation": "http://0.0.0.0:4566",
  "CloudWatch": "http://0.0.0.0:4566",
  "Lambda": "http://0.0.0.0:4566",
  "S3": "http://0.0.0.0:4566"
}
```

##### Step 5: Example code for lambda handler

src/index.js

```js
module.exports.hello = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: "Works!",
        input: event,
      },
      null,
      2
    ),
  };
};
```

#### Step 6: Deploy the code to localstack

```
serverless deploy --stage local
```

```
serverless info --stage local
```

Output

```
config.options_stage: local
serverless.service.custom.stage: undefined
serverless.service.provider.stage: dev
config.stage: local
Loading endpointJson from localstack_endpoints.json
Intercepting service CloudFormation
Intercepting service CloudWatch
Intercepting service Lambda
Intercepting service S3
Using serverless-localstack
Reconfiguring service acm to use http://localhost:4566
Reconfiguring service amplify to use http://localhost:4566
Reconfiguring service apigateway to use http://localhost:4566
Reconfiguring service apigatewayv2 to use http://localhost:4566
Reconfiguring service application-autoscaling to use http://localhost:4566
Reconfiguring service appsync to use http://localhost:4566
Reconfiguring service athena to use http://localhost:4566
Reconfiguring service autoscaling to use http://localhost:4566
Reconfiguring service batch to use http://localhost:4566
Reconfiguring service cloudformation to use http://localhost:4566
Reconfiguring service cloudfront to use http://localhost:4566
Reconfiguring service cloudsearch to use http://localhost:4566
Reconfiguring service cloudtrail to use http://localhost:4566
Reconfiguring service cloudwatch to use http://localhost:4566
Reconfiguring service cloudwatchlogs to use http://localhost:4566
Reconfiguring service codecommit to use http://localhost:4566
Reconfiguring service cognito-idp to use http://localhost:4566
Reconfiguring service cognito-identity to use http://localhost:4566
Reconfiguring service docdb to use http://localhost:4566
Reconfiguring service dynamodb to use http://localhost:4566
Reconfiguring service dynamodbstreams to use http://localhost:4566
Reconfiguring service ec2 to use http://localhost:4566
Reconfiguring service ecr to use http://localhost:4566
Reconfiguring service ecs to use http://localhost:4566
Reconfiguring service eks to use http://localhost:4566
Reconfiguring service elasticache to use http://localhost:4566
Reconfiguring service elasticbeanstalk to use http://localhost:4566
Reconfiguring service elb to use http://localhost:4566
Reconfiguring service elbv2 to use http://localhost:4566
Reconfiguring service emr to use http://localhost:4566
Reconfiguring service es to use http://localhost:4566
Reconfiguring service events to use http://localhost:4566
Reconfiguring service firehose to use http://localhost:4566
Reconfiguring service glacier to use http://localhost:4566
Reconfiguring service glue to use http://localhost:4566
Reconfiguring service iam to use http://localhost:4566
Reconfiguring service iot to use http://localhost:4566
Reconfiguring service iotanalytics to use http://localhost:4566
Reconfiguring service iotevents to use http://localhost:4566
Reconfiguring service iot-data to use http://localhost:4566
Reconfiguring service iot-jobs-data to use http://localhost:4566
Reconfiguring service kafka to use http://localhost:4566
Reconfiguring service kinesis to use http://localhost:4566
Reconfiguring service kinesisanalytics to use http://localhost:4566
Reconfiguring service kms to use http://localhost:4566
Reconfiguring service lambda to use http://localhost:4566
Reconfiguring service logs to use http://localhost:4566
Reconfiguring service mediastore to use http://localhost:4566
Reconfiguring service neptune to use http://localhost:4566
Reconfiguring service organizations to use http://localhost:4566
Reconfiguring service qldb to use http://localhost:4566
Reconfiguring service rds to use http://localhost:4566
Reconfiguring service redshift to use http://localhost:4566
Reconfiguring service route53 to use http://localhost:4566
Reconfiguring service s3 to use http://localhost:4566
Reconfiguring service s3control to use http://localhost:4566
Reconfiguring service sagemaker to use http://localhost:4566
Reconfiguring service sagemaker-runtime to use http://localhost:4566
Reconfiguring service secretsmanager to use http://localhost:4566
Reconfiguring service ses to use http://localhost:4566
Reconfiguring service sns to use http://localhost:4566
Reconfiguring service sqs to use http://localhost:4566
Reconfiguring service ssm to use http://localhost:4566
Reconfiguring service stepfunctions to use http://localhost:4566
Reconfiguring service sts to use http://localhost:4566
Reconfiguring service timestream to use http://localhost:4566
Reconfiguring service transfer to use http://localhost:4566
Reconfiguring service xray to use http://localhost:4566
Reconfiguring service CloudFormation to use http://0.0.0.0:4566
Reconfiguring service CloudWatch to use http://0.0.0.0:4566
Reconfiguring service Lambda to use http://0.0.0.0:4566
Reconfiguring service S3 to use http://0.0.0.0:4566
config.options_stage: local
serverless.service.custom.stage: undefined
serverless.service.provider.stage: dev
config.stage: local
config.options_stage: local
serverless.service.custom.stage: undefined
serverless.service.provider.stage: dev
config.stage: local
service: localstack-demo
stage: local
region: us-east-1
stack: localstack-demo-local
functions:
  hello: localstack-demo-local-hello
```

Invoke

```
serverless invoke local -f hello
```

Output

```
config.options_stage: undefined
serverless.service.custom.stage: undefined
serverless.service.provider.stage: dev
config.stage: dev
config.options_stage: dev
serverless.service.custom.stage: undefined
serverless.service.provider.stage: dev
config.stage: dev
config.options_stage: dev
serverless.service.custom.stage: undefined
serverless.service.provider.stage: dev
config.stage: dev
{
    "statusCode": 200,
    "body": "{\n  \"message\": \"Works!\",\n  \"input\": \"\"\n}"
}
```
