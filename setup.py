import os
import sys
from distutils.core import setup

package_dir = {'': '.venv/Lib/site-packages'}

setup(
    name='S3 Bucket to AOT',
    version='0.1dev',
    packages=['boto3', 'requests', 'uuid'],
    long_description=open('README.md').read(),
)