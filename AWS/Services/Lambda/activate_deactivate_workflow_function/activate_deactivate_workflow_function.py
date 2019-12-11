"""
activate_deactivate_workflow_function.py
==========================================

Module to allow administrators to turn the main workflow on or off

The config file, which will live in a workflow S3 bucket, will determine if the workflow processes the jobs.
This functon will edit the config file to set switch this to on or off, and an API gateway will give us access
to this lambda function.
"""
import json

# import requests


def lambda_handler(event, context):
    """Lambda function to turn workflow on or off.

    This is the main function of this module


    Parameters
    ----------
    event: dict, required
        API Gateway Lambda Proxy Input Format
        Event doc:
        https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format

    context: object, required
        Lambda Context runtime methods and attributes
        Context doc:
        https://docs.aws.amazon.com/lambda/latest/dg/python-context-object.html

    Returns
    ------
    API Gateway Lambda Proxy Output Format: dict
        Return doc:
        https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
    """

    # try:
    #     ip = requests.get("http://checkip.amazonaws.com/")
    # except requests.RequestException as e:
    #     # Send some context about this error to Lambda Logs
    #     print(e)

    #     raise e

    return {
        "statusCode": 200,
        "body": json.dumps({
            "message": "hello world",
            # "location": ip.text.replace("\n", "")
        }),
    }
