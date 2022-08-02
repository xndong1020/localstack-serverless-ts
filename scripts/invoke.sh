ENDPOINT=http://0.0.0.0:4566
FUNCTION_NAME=localstack-demo-local-api
PAYLOAD='{ "myJsonData": "true" }'

aws lambda invoke \
  --cli-binary-format raw-in-base64-out \
  --function-name ${FUNCTION_NAME} \
  --invocation-type RequestResponse \
  --no-sign-request \
  --payload '{"fruit": "tomato"}'\
  --endpoint ${ENDPOINT} \
  output.json