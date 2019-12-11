import os
import sys
from distutils.core import setup


setup(
    name='S3 Bucket to API',
    version='0.1dev',
    package_dir = {'': '.venv/Lib/site-packages'},
    packages=['boto3', 'botocore', 'requests', 'botocore.vendored'],
    long_description=open('README.md').read(),
)