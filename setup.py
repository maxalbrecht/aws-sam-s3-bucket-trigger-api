import os
import sys
from distutils.core import setup


setup(
    name='S3 Bucket to API',
    version='0.1dev',
    author='Max Albrecht',
    author_email='max.albrecht100@gmail.com',
    package_dir = {'': '.venv/Lib/site-packages'},
    packages=['requests', 'boto3', 'botocore', 'botocore.vendored',],
    long_description=open('README.md').read(),
)