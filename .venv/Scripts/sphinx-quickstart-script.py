#!c:\users\devops2\documents\github\aws-sam-s3-bucket-trigger-api\.venv\scripts\python.exe
# EASY-INSTALL-ENTRY-SCRIPT: 'Sphinx==2.2.2','console_scripts','sphinx-quickstart'
__requires__ = 'Sphinx==2.2.2'
import re
import sys
from pkg_resources import load_entry_point

if __name__ == '__main__':
    sys.argv[0] = re.sub(r'(-script\.pyw?|\.exe)?$', '', sys.argv[0])
    sys.exit(
        load_entry_point('Sphinx==2.2.2', 'console_scripts', 'sphinx-quickstart')()
    )
