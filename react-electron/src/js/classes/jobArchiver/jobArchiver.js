import { JOB_ARCHIVING_FINISHED } from './../../constants/action-types'
import { action } from './../../utils/action'
import { SUCCESS, ERROR, ARCHIVING_JOB } from './../../constants/job_archiving_statuses'
import DateUtils from './../../utils/date-utils'
import Logging from './../../utils/logging'
import File from './../../utils/file'
import defined from './../../utils/defined'
import JOB_ARCHIVING_CONSTANTS from './../../constants/job-archiving'
import ENVS from './../../constants/environments'

const aws = require('aws-sdk')
const ASYNC = require('async')
var store = window.store

var config
try {
  config = JSON.parse(File.getContent(JOB_ARCHIVING_CONSTANTS.CONFIG_FILE))
}
catch(error) {
  Logging.logError("Error trying to initialize jobArchiver's config. Error:", error)
}

function getParentFolder(fileKey) {
  if(fileKey[fileKey.length - 1] === "/") {
    fileKey = fileKey.slice(0, -1)
  }

  let result = `${fileKey.substr(0, fileKey.lastIndexOf('/'))}/`

  return result
}

async function deleteParentFolderIfEmpty(
  bucket,
  file,
  region = config.region,
  accessKeyId = config.accessKeyId,
  secretAccessKey = config.secretAccessKey,
  signatureVersion = 'v4'
) {
  try {
    const s3 = new aws.S3({
      endpoint: `s3.${config.region}.amazonaws.com`,
      accessKeyId: accessKeyId,
      secretAccessKey: secretAccessKey,
      Bucket: bucket,
      signatureVersion: signatureVersion,
      region: region
    })   

    let parentFolder = getParentFolder(file.Key)

    const params = {
      Bucket: bucket,
      Prefix: parentFolder
    }

    s3.listObjectsV2(params, function(err, data) {
      if(err) {
        Logging.logError("error inside jobArchiver.deleteParentFolderIfEmpty during s3.deleteObject. error:", err)
      }
      else {
        Logging.info("Inside jobArchiver.deleteS3File during s3.deleteObject. copyData:", data)

        if(defined(data, "Contents.length") && data.Contents.length === 1) {
          deleteS3File(bucket, parentFolder, region, accessKeyId, secretAccessKey, signatureVersion)
        }

      }
    })
  }
  catch(error) {
    Logging.logError("ERROR inside jobArchiver.deleteS3File. error:", error)
  }
}

async function deleteS3File(
  bucket,
  file,
  region = config.region,
  accessKeyId = config.accessKeyId,
  secretAccessKey = config.secretAccessKey,
  signatureVersion = 'v4'
) {
  try {
    const s3 = new aws.S3({
      endpoint: `s3.${config.region}.amazonaws.com`,
      accessKeyId: accessKeyId,
      secretAccessKey: secretAccessKey,
      Bucket: bucket,
      signatureVersion: signatureVersion,
      region: region
    })   

    const params = {
      Bucket: bucket,
      Key: file.Key
    }

    s3.deleteObject(params, function(err, deleteData) {
      if(err) {
        Logging.logError("error inside jobArchiver.deleteS3File during s3.deleteObject. error:", err)
      }
      else {
        Logging.info("Inside jobarchiver.deleteS3File during s3.deleteObject. copyData:", deleteData)
        file.deleteData = deleteData

        //deleteParentFolderIfEmpty(bucket, file, region, accessKeyId, secretAccessKey, signatureVersion)
      }
    })
  }
  catch(error) {
    Logging.logError("ERROR inside jobArchiver.deleteS3File. error:", error)
  }
}

class JobArchiver {
  constructor({
    sourceBucket,
    externalJobNumber,
    year,
    month,
    assignedUserEmail,
    contactName,
    contactEmail,
    contactPhone,
    id,
    //env = JOB_ARCHIVING_CONSTANTS.ENVS.TEST_ENV
    env = ENVS.DEV
  }) {
    this.sourceBucket = sourceBucket
    this.externalJobNumber = externalJobNumber
    this.year = year
    this.month = month
    this.assignedUserEmail = assignedUserEmail
    this.contactName = contactName
    this.contactEmail = contactEmail
    this.contactPhone = contactPhone
    this.id = id
    this.env = env
    this.dateDisplay = "<<Date & Time>>";
    this.jobArchivingStatus = ARCHIVING_JOB;
    this.errorMsgList = [];

    this.dateDisplay = DateUtils.GetDateDisplay() 

    try{
      this.archiveJob(this.sourceBucket, this.externalJobNumber, this.year, this.month, this.env)
    }
    catch(e){
      Logging.logError("ERROR in constructor method of JobArchiver. Error:", e)
    }
  }

  removeNonFiles(originalFiles) {
    return originalFiles.slice().filter( file => !file.Key.endsWith("/") )
  }

  async getS3FileList(
    bucket,
    parentFolder,
    region = config.region,
    accessKeyId = config.accessKeyId,
    secretAccessKey = config.secretAccessKey,
    signatureVersion = 'v4'
  ) {
    try {
      const s3 = new aws.S3({
        endpoint: `s3.${config.region}.amazonaws.com`,
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey,
        Bucket: bucket,
        signatureVersion: signatureVersion,
        region: region
      })

      let params = {
        Bucket:bucket,
        Prefix: parentFolder
      }

      const response = await s3.listObjectsV2(params).promise()

      Logging.log("jobArchiver.getS3Files() response:", response)

      let files = this.removeNonFiles(response.Contents)

      return files
    }
    catch(error) {
      Logging.logError("ERROR inside JobArchiver.getFileList():", error)
    }
  }

  async moveS3Files(
    sourceBucket,
    files,
    targetBucket,
    //targetParentFolder,
    year,
    month,
    region = config.region,
    accessKeyId = config.accessKeyId,
    secretAccessKey = config.secretAccessKey,
    signatureVersion = 'v4'
  ) {
    try {
      const s3 = new aws.S3({
        endpoint: `s3.${config.region}.amazonaws.com`,
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey,
        Bucket: sourceBucket,
        signatureVersion: signatureVersion,
        region: region
      })

      if(files.length && files.length > 0) {
        ASYNC.each(files, function(file, cb) {
          let params = {
            Bucket: targetBucket,
            CopySource: `/${sourceBucket}/${file.Key}`,
            //Key: `${year}/${month}/${file.Key}`
            Key: `${JOB_ARCHIVING_CONSTANTS.getDestinationParentDirectory(sourceBucket, year, month)}${file.Key}`
          }

          s3.copyObject(params, function(copyErr, copyData) {
            if(copyErr) {
              Logging.logError("ERROR inside jobArchiver.moveS3Files during s3.copyObject. error:", copyErr)
            }
            else {
              Logging.info("Inside jobarchiver.moveS3Files during s3.copyObject. copyData:", copyData)
              cb()
              file.copyData = copyData

              deleteS3File(sourceBucket, file, region, accessKeyId, secretAccessKey, signatureVersion)
            }
          })
        })
      }
      else {
        Logging.warn("Inside jobArchiver.moveS3Files(). files list was empty. files:", files)
      }
    }
    catch(error) {
      Logging.logError("error inside jobArchiver.moveS3Files:", error)
    }
  }

  async setStatus(files) {

    return SUCCESS
  }

  async archiveJob(sourceBucket, externalJobNumber, year, month, env){
    let newJobArchivingStatus = ""

    try{
      // GET LIST OF FILES TO BE MOVED
      let files = await this.getS3FileList(sourceBucket, externalJobNumber)

      //MOVE FILES
      await this.moveS3Files(
        sourceBucket,
        files,
        JOB_ARCHIVING_CONSTANTS.sourceToTargetBucketMappings[sourceBucket],
        //JOB_ARCHIVING_CONSTANTS[env].TARGET_BUCKET,
        year,
        month,
        config.region,
        config.accessKeyId,
        config.secretAccessKey,
        'v4'
      )

      //SET STATUS
      newJobArchivingStatus = await this.setStatus(files)
    }
    catch(e){
      newJobArchivingStatus = ERROR
      //^^//console.log(`Error archiving job. Error: ${e}`)
      this.errorMsgList = { error: e }
      Logging.log("ERROR in jobArchiver.archiveJob():", e)
    }

    this.jobArchivingStatus = newJobArchivingStatus

    store.dispatch(action(JOB_ARCHIVING_FINISHED, newJobArchivingStatus))
  }
}

export default JobArchiver






























