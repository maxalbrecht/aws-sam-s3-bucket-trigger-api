"""
workflow_main_funtion.py
====================================
The main module of the workflow
"""
from requests import requests
import json
import boto3
import os
from uuid import uuid4


def lambda_handler(event, context):
    """Function to pass jobs to external api

    Steps:
        1. Check if the config file to see if we call the api
        2. Make api call, depending on the config file in the previous step
        3. Save the job results to DynamoDB table
        4. Send notifications on job results

    Parameters
    ----------
    event: dict, required
        file is deposited in S3 bucket

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
        print("exception when processing even values\n", ex)
        raise

    # Set default values for sam local testing
    if ((ENV_TYPE == 'prod') == False) and ((ENV_TYPE == 'demo') == False):
        ENV_TYPE = 'dev'
        TABLE_NAME = 's3-bucket-trigger-api-log-table-dev'
        bucket_name == 's3-bucket-trigger-api-test-bucket-dev'
    
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
    
    # region Check the config file

    # endregion Check if the config file

    # region Make API call
    try:
        ''' Demonstrates a simple HTTP request from Lambda '''
        response = requests.get('https://jsonplaceholder.typicode.com/posts')
        # load data into a dict of objects, posts
        posts = json.loads(response.text)
        print('posts is a = {}'.format(type(posts)))
        # Let's get the unique userId, there should only be 1-10
        unique_ids = set()
        for post in posts:
            unique_ids.add(post['userId'])
        print('unique_ids = {}'.format(unique_ids))
    except Exception as ex:
        print("exception when making api call\n", ex)
        raise

    # endregion Make API call

    # region Log job information into the database
    try:
        dynamodb.Table(TABLE_NAME).put_item(
            Item={
                'RequestId': request_id,
                'Bucket': bucket_name,
                'Object': object_key,
                'Size': size, 
                'Event': event_name, 
                'EventTime': event_time
            }
        )
    except Exception as ex:
        print("exception when putting to the dynamodb table\n", ex)
        raise

    # endregion Log job information into the database

    # region Send notifications

    # endregion Send notifications
    
    return True

