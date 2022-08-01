# Point aws-cli to LocalStack instead of AWS
ENDPOINT=http://0.0.0.0:4566/
# The name of our lambda in LocalStack
FUNCTION_NAME=nodejs-example
# What code do we want LocalStack to execute on. In this case the
# handler() function defined in index.js
HANDLER=index.handler
# We want to run our index.js file using the node v12 runtime
RUNTIME=nodejs12.x
# Our local working directory where index.js is located
S3_KEY=$(pwd)
# Delete Lambda (if it already exists) to start with clean slate
# aws --endpoint-url ${ENDPOINT} lambda delete-function \
#   --function-name ${FUNCTION_NAME}
# # Create Lambda
# aws --endpoint-url ${ENDPOINT} lambda create-function \
#   --code S3Bucket="__local__",S3Key="${S3_KEY}" \
#   --function-name ${FUNCTION_NAME} \
#   --handler ${HANDLER} \
#   --role value-does-not-matter \
#   --runtime ${RUNTIME}

aws --endpoint-url ${ENDPOINT} lambda list-functions \