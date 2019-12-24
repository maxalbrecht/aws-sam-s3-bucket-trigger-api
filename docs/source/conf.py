# Configuration file for the Sphinx documentation builder.
#
# This file only contains a selection of the most common options. For a full
# list see the documentation:
# https://www.sphinx-doc.org/en/master/usage/configuration.html

# -- Path setup --------------------------------------------------------------

# If extensions (or modules to document with autodoc) are in another directory,
# add these directories to sys.path here. If the directory is relative to the
# documentation root, use os.path.abspath to make it absolute, like shown here.
#
import os
import sys
sys.path.insert(0, os.path.abspath('../..'))

# For conversion from markdown to html
import importlib.util
spec = importlib.util.spec_from_file_location("recommonmark.Parser", "./../../.venv/Lib/site-packages/recommonmark/parser.py")
foo = importlib.util.module_from_spec(spec)
spec.loader.exec_module(foo)

master_doc = 'index'

 # Add a source file parser for markdown
source_parsers = {
    '.md': 'recommonmark.parser.CommonMarkParser'
}

#Add type of source files
source_suffix = ['.rst', '.md']

# -- Project information -----------------------------------------------------

project = 'S3BucketToAPI'
copyright = '2019, Max Albrecht'
author = 'Max Albrecht'

# The full version, including alpha/beta/rc tags
release = '0.0.1'


# -- General configuration ---------------------------------------------------

# Add any Sphinx extension module names here, as strings. They can be
# extensions coming with Sphinx (named 'sphinx.ext.*') or your custom
# ones.
extensions = [
    'sphinx.ext.autodoc',
    'sphinx.ext.napoleon'
]

# Add any paths that contain templates here, relative to this directory.
templates_path = ['_templates']


# List of patterns, relative to source directory, that match files and
# directories to ignore when looking for source files.
# This pattern also affects html_static_path and html_extra_path.
exclude_patterns = []


# -- Options for HTML output -------------------------------------------------

# The theme to use for HTML and HTML Help pages.  See the documentation for
# a list of builtin themes.
#
import sphinx_rtd_theme
html_theme = 'sphinx_rtd_theme'
html_theme_path = [sphinx_rtd_theme.get_html_theme_path()]

# Add any paths that contain custom static files (such as style sheets) here,
# relative to this directory. They are copied after the builtin static files,
# so a file named "default.css" will overwrite the builtin "default.cs s".
html_static_path = ['_static']

# -- CUSTOM -------------------------------------------------------------------

# Build SAM app so that we can get a fresh copy of the cloudformation template
# that it generates after processing the SAM template
# os.chdir('./../..')
# try:
#     print("*** Running os.system('sam build')...")
#     os.system('sam build')
# except Exception as ex:
#     raise ex
# finally:
#     os.chdir('./docs/source')

# Generate fresh copy of templatedotyaml.rst
header = """============================================================
AWS SAM / CloudFormation
============================================================
\n*Note: This page is auto-generated from the latest SAM template.*\n\n\nSAM Template\n============================\n\nTemplate Description & Transformation Information:\n#####################################################################\n


"""

outputfile = open("./build_cloudformation.rst", "w+")
templatefile = open("./../../template.yaml", "r")
templatefilecontents = templatefile.read()
outputfile.write(header)
outputfile.write(templatefilecontents)
templatefile.close()
outputfile.close()

# Disable source link
html_context = {
"display_github": False, # Add 'Edit on Github' link instead of 'View page source'
"last_updated": True,
"commit": False,
}

