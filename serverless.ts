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
