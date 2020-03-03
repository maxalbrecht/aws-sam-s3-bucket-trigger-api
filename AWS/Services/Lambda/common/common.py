import json
import os
from uuid import uuid4
try:
    import boto3
except ImportError:
    print("import of boto3 failed")

def CheckIfEnabled(ENV_TYPE):
    """Function to check config to see if files should be processed

    Parameters
    ----------
    ENV_TYPE: string, required
        dev, demo or prod

    Returns
    -------
    bool
        True if files should be proccessed, false otherwise

    """
    try:
        ssm = boto3.client('ssm')
        parameter = ssm.get_parameter(Name=('bucket-to-api-' + ENV_TYPE), WithDecryption=True)
        print(parameter['Parameter']['Value']) 

        if parameter['Parameter']['Value'] == 'True':
            return True
        elif parameter['Parameter']['Value']== 'False':
            return False
        else:
            raise ValueError("Cannot covert {} to a bool".format(s))
    except Exception as ex:
        print("exception when checking if file data should be sent to api\n", ex)
        raise