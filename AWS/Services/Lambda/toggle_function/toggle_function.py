"""
toggle_function.py
==========================================

Module to allow administrators to turn the main workflow on or off

The config file, which will live in a workflow S3 bucket, will determine if the workflow processes the jobs.
This function will edit the config file to set switch this to on or off, and an API gateway will give us access
to this lambda function.
"""
import json

# import requests


def lambda_handler(event, context):
    """Function to change the configuration parameter that determines whether the application sends file data to the external API

    Parameters
    ----------
    event: dict, required
        api gateway is used to call this function

        Event doc:
        https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format

    context: object, required
        Lambda Context runtime methods and attributes

        Context doc:
        https://docs.aws.amazon.com/lambda/latest/dg/python-context-object.html

    Returns
    -------
    int
        Success or failure of function

    """
    
    dynamodb = boto3.resource('dynamodb')
    enabled = False

    # region Handle parameters and variables
    # Save environment variables
    ENV_TYPE = os.environ["ENV_TYPE"]
    TABLE_NAME = os.environ["TABLE_NAME"]
    request_id = str(uuid4())

    # Save event information into local variables
    try:
        for record in event['Records']:
            bucket_name = record['s3']['bucket']['name']
            object_key = record['s3']['object']['key']
            size = record['s3']['object'].get('size', -1)
            event_name = record['eventName']
            event_time = record['eventTime']
    except Exception as ex:
        print("exception when processing event values\n", ex)
        raise

    # print parameter values during development
    if ENV_TYPE == 'dev':
        print("ENV_TYPE: ", ENV_TYPE)
        print("request_id: ", request_id)
        print("bucket_name: ", bucket_name)
        print("event_name: ", event_name)
        print("event_time: ", event_time)
        print("object_key: ", object_key)
        print("size: ", size)
    
    # endregion handle parameters and variables

    #region 