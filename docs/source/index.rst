=========================================
S3 Bucket To API Project Documentation
=========================================
.. contents:: :local:

Introduction
============
There is a need to be able to call an API when an object is placed in an S3 bucket. Currently this process is done manually,
which is a labor intensive process. The author has therefore designed and implemented a serverless application using 
AWS SAM (as well as an accompanying CI/CD pipeline) to achieve this.

------------
 Purpose
------------
This document will provide a detailed description of the components of the project, including 
the AWS SAM template that forms the core of the application, as well as the resources it creates,
such as S3 buckets and Lambda functions.

This information is meant as a reference material for the author himself, as well as any future developers
that find themselves working on this project. Some of the technical descriptions may not be particularly
accessible to a non-technical audience, but an effort has been made to ensure that this documentation may 
also provide value to these users.

-------
 Scope
-------
As of writing, the components we have included in this application are the following:
    * Lambda function which is triggered when a file meeting specified criteria is placed in the intended S3 bucket, and:
        - Checks a configuration file to determine if the data in the s3 file should be processed and passed to the API
        - Calls the API
        - Save the results to a Dynamo DB
        - Send out notifications using SNS to interested parties
    * Lambda function and an accompanying API gateway, which will change the Enable setting in the configuration file, allowing administrators to stop the processing of jobs as needed
    * A CloudWatch schedule that periodically checks the DynamoDB for any files that need to be reprocessed, and sends any such jobs back to the first Lambda function described above.
    * Lambda function and an accompanying API gateway which allows an administrator to specify a file to be reprocessed.
    * An AWS CodePipeline that provides for separate development, demo, and production environments, and checkpoints requiring developer and administrator approval before deploying to higher environments.
    * Unit tests that will be fun as part of the build and deployment process
        
----------
 Overview
----------
The rest of this documentation gives a detailed description of the AWS SAM template and all the components created from it,
as well as the CI/CD solution that has been implemented using AWS CodePipeline.

Contents
========
.. toctree::
   :maxdepth: 4
   
   modules

Indices and tables
==================
* :ref:`modindex`

