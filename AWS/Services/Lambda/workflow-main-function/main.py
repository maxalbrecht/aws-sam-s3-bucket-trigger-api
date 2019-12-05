import json
import boto3
import requests
from uuid import uuid4
# import requests

dynamodb = boto3.resource('dynamodb')


def lambda_handler(event, context):
    """Sample pure Lambda function

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
    print("function_name: ", context.function_name)

    for record in event['Records']:
        bucket_name = record['s3']['bucket']['name']
    object_key = record['s3']['object']['key']
    size = record['s3']['object'].get('size', -1)
    event_name = record['eventName']
    event_time = record['eventTime']
    dynamodb.Table('${Table}').put_item(
        Item={
            'RequestId': str(uuid4()),
            'Bucket': bucket_name,
            'Object': object_key,
            'Size': size, 'Event': event_name, 'EventTime': event_time
        }
    )
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
    return True

    # try:
    #     ip = requests.get("http://checkip.amazonaws.com/")
    # except requests.RequestException as e:
    #     # Send some context about this error to Lambda Logs
    #     print(e)

    #     raise e

    # return {
    #     "statusCode": 200,
    #     "body": json.dumps({
    #         "message": "hello world",
    #         # "location": ip.text.replace("\n", "")
    #     }),
    # }
