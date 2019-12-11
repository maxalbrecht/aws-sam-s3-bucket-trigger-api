import os
import sys
from distutils.core import setup

package_dir = {'': '.venv/Lib/site-packages'}

setup(
    name='S3 Bucket to AOT',
    version='0.1dev',
    packages=['distutils', 'json', 'boto3', 'requests', 'os', 'uuid'],
    long_description=open('README.md').read(),
)