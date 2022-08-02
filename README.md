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

#### Upgrade to `@serverless/typescript`. Replace `serverless.yml` with `serverless.ts`

updated docker-compose file

```yml
version: "3.7"
services:
  localstack:
    container_name: "${LOCALSTACK_DOCKER_NAME-localstack}"
    image: localstack/localstack
    hostname: localstack
    networks:
      - localstack-net
    ports:
      - "4566-4599:4566-4599"
      - "${PORT_WEB_UI-8080}:${PORT_WEB_UI-8080}"
    environment:
      - SERVICES=s3,sqs,lambda,cloudformation,sts,iam,cloudwatch,apigateway,events
      - DEBUG=1
      - DATA_DIR=/tmp/localstack/data
      - PORT_WEB_UI=8080
      - LAMBDA_EXECUTOR=docker-reuse
      - LAMBDA_REMOTE_DOCKER=false
      - LAMBDA_REMOVE_CONTAINERS=true
      - KINESIS_ERROR_PROBABILITY=${KINESIS_ERROR_PROBABILITY- }
      - DOCKER_HOST=unix:///var/run/docker.sock
      - HOST_TMP_FOLDER=${TMPDIR}
    volumes:
      - ./data:/tmp/localstack
      - "/var/run/docker.sock:/var/run/docker.sock"
      - ./bin:/docker-entrypoint-initaws.d
networks:
  localstack-net:
    external: false
    driver: bridge
    name: localstack-net
```

replace `serverless.yml` with `serverless.ts`

```ts
import type { AWS } from "@serverless/typescript";

const service: AWS["service"] = "localstack-demo";

const serverlessConfiguration: AWS = {
  service,
  frameworkVersion: "*",
  plugins: ["serverless-localstack"],
  provider: {
    name: "aws",
    runtime: "nodejs12.x",
    logRetentionInDays: 60,
    stage: "local",
    tags: {
      owner: "jgu@xxx.com.au",
      "account-name": "test-${env:NODE_ENV}",
      creator: "jgu@xxx.com.au",
      "project-name": "test deployment",
      "program-name": "bsd",
      "project-code": "102",
    },
  },
  useDotenv: true,
  custom: {
    localstack: {
      debugger: true,
      stages: ["${env:NODE_ENV}"],
      endpointFile: "localstack_endpoints.json",
      lambda: {
        mountCode: true,
      },
    },
  },
  configValidationMode: "error",
  functions: {
    api: {
      handler: "src/index.hello",
      architecture: "arm64",
      memorySize: 512,
      maximumRetryAttempts: 0,
      timeout: 900,
      environment: {
        API_VERSION: "${env:CURRENT_API_VERSION}",
        STAGE: "${env:NODE_ENV}",
        NODE_OPTIONS: "--no-deprecation",
      },
    },
  },
};

module.exports = serverlessConfiguration;
```

Again for deployment of the code, run

```
serverless deploy --stage local
```

Check the information

```
serverless info --stage local
```

Output

```
service: localstack-demo
stage: local
region: us-east-1
stack: localstack-demo-local
functions:
  api: localstack-demo-local-api
```

Invoke the function with serverless.
Note: The name of the deployed lambda function is 'localstack-demo-local-api'. But in Serverless, the alias of the function is 'api'. So when you invoke the function with serverless, the function should use `api`. But when you invoke the function with aws cli,

```
serverless invoke --stage local -f api
```

Output

```
Using serverless-localstack
{
    "body": "{\n  \"message\": \"Works12!\",\n  \"input\": {}\n}",
    "statusCode": 200
}
```

Or invoke from aws cli

```sh
ENDPOINT=http://0.0.0.0:4566
FUNCTION_NAME=localstack-demo-local-api

aws lambda invoke \
  --cli-binary-format raw-in-base64-out \
  --function-name ${FUNCTION_NAME} \
  --invocation-type RequestResponse \
  --no-sign-request \
  --payload '{"fruit": "tomato"}'\
  --endpoint ${ENDPOINT} \
  output.json
```

Output

```
{
    "StatusCode": 200,
    "LogResult": "",
    "ExecutedVersion": "$LATEST"
}
```

The generated `output.json` file

```json
{
  "body": "{\n  \"message\": \"Works12!\",\n  \"input\": {\n    \"fruit\": \"tomato\"\n  }\n}",
  "statusCode": 200
}
```

#### install devDependencies

```
npm i -D serverless-webpack webpack webpack-cli ts-loader webpack-node-externals serverless-plugin-warmup serverless-prune-plugin remove-files-webpack-plugin
```

The `webpack.config.js` file

```js
const path = require("path");
const webpack = require("webpack");
const slsw = require("serverless-webpack");
const RemovePlugin = require("remove-files-webpack-plugin");
const nodeExternals = require("webpack-node-externals");

module.exports = (async () => {
  const config = {
    mode: slsw.lib.webpack.isLocal ? "development" : "production",
    externals: slsw.lib.webpack.isLocal ? [nodeExternals()] : ["aws-sdk"],
    entry: ["src/main.ts"],
    optimization: {
      minimize: false,
    },
    ignoreWarnings: [
      {
        module: /^(?!CriticalDependenciesWarning$)/, // A RegExp
      },
      (warning) => true,
    ],
    stats: {
      modules: false,
      errorDetails: true,
    },
    output: {
      libraryTarget: "commonjs",
      path: path.join(__dirname, "dist"),
      filename: "main.js",
    },
    target: "node",
    module: {
      rules: [{ test: /\.ts(x)?$/, loader: "ts-loader" }],
    },
    devtool: "source-map",
    resolve: {
      extensions: [".ts", ".js"],
      alias: {
        src: path.resolve(__dirname, "src"),
      },
      symlinks: false,
      cacheWithContext: false,
    },
    plugins: [
      new webpack.IgnorePlugin({ resourceRegExp: /^pg-native|vertx$/ }),
    ],
  };
  return config;
})();
```

and add a npm script `"build": "webpack build"`

This script will build the ts file into the `dist/main.js` file, which can be used by serverless.ts

```ts
import type { AWS } from "@serverless/typescript";

const service: AWS["service"] = "localstack-demo";

const serverlessConfiguration: AWS = {
  service,
  frameworkVersion: "*",
  plugins: ["serverless-localstack", "serverless-prune-plugin"],
  provider: {
    name: "aws",
    runtime: "nodejs12.x",
    logRetentionInDays: 60,
    stage: "local",
    tags: {
      owner: "jgu@xxx.com.au",
      "account-name": "test-${env:NODE_ENV}",
      creator: "jgu@xxx.com.au",
      "project-name": "test deployment",
      "program-name": "bsd",
      "project-code": "102",
    },
  },
  useDotenv: true,
  custom: {
    prune: {
      automatic: true,
      number: 5,
    },
    localstack: {
      debugger: true,
      stages: ["${env:NODE_ENV}"],
      endpointFile: "localstack_endpoints.json",
      lambda: {
        mountCode: true,
      },
    },
  },
  configValidationMode: "error",
  functions: {
    api: {
      handler: "dist/main.handler",
      architecture: "arm64",
      memorySize: 512,
      maximumRetryAttempts: 0,
      timeout: 900,
      environment: {
        API_VERSION: "${env:CURRENT_API_VERSION}",
        STAGE: "${env:NODE_ENV}",
        NODE_OPTIONS: "--no-deprecation",
      },
    },
  },
};

module.exports = serverlessConfiguration;
```

Serverless typescript will deploy the build JavaScript file `main.js` to lambda function

If you check with aws cli, note the Handler path is correct.

```
"FunctionName": "localstack-demo-local-api",
"FunctionArn": "arn:aws:lambda:us-east-1:000000000000:function:localstack-demo-local-api",
"Runtime": "nodejs12.x",
"Role": "arn:aws:iam::000000000000:role/localstack-demo-local-us-east-1-lambdaRole",
"Handler": "dist/main.handler",
"Description": "",
"Timeout": 900,
"MemorySize": 512,
"LastModified": "2022-08-02T04:05:40.285+0000",
```

If you try to deploy with webpack-serverless,

```ts
import type { AWS } from "@serverless/typescript";

const service: AWS["service"] = "localstack-demo";

const serverlessConfiguration: AWS = {
  service,
  frameworkVersion: "*",
  plugins: [
    "serverless-localstack",
    "serverless-webpack",
    "serverless-prune-plugin",
  ],
  provider: {
    name: "aws",
    runtime: "nodejs12.x",
    logRetentionInDays: 60,
    stage: "local",
    tags: {
      owner: "jgu@xxx.com.au",
      "account-name": "test-${env:NODE_ENV}",
      creator: "jgu@xxx.com.au",
      "project-name": "test deployment",
      "program-name": "bsd",
      "project-code": "102",
    },
  },
  useDotenv: true,
  custom: {
    webpack: {
      webpackConfig: "./webpack.config.js",
    },
    prune: {
      automatic: true,
      number: 5,
    },
    localstack: {
      debugger: true,
      stages: ["${env:NODE_ENV}"],
      endpointFile: "localstack_endpoints.json",
      lambda: {
        mountCode: true,
      },
    },
  },
  configValidationMode: "error",
  functions: {
    api: {
      handler: "dist/main.handler",
      architecture: "arm64",
      memorySize: 512,
      maximumRetryAttempts: 0,
      timeout: 900,
      environment: {
        API_VERSION: "${env:CURRENT_API_VERSION}",
        STAGE: "${env:NODE_ENV}",
        NODE_OPTIONS: "--no-deprecation",
      },
    },
  },
};

module.exports = serverlessConfiguration;
```

the handler path will be wrong `"Handler": ".webpack/service/dist/main.handler",`
