import Logging from '../../utils/logging'
import DateUtils from './../../utils/date-utils'
import File from '../../utils/file'
import LOCAL_DOWNLOADING_CONSTANTS from '../../constants/local-downloading'
import { Config } from 'aws-sdk'
import defined from '../../utils/defined'

const aws = require('aws-sdk')
//const ASYNC = require('async')
//var store = window.store
const fs = window.require('fs')

var config
try {
  config = JSON.parse(File.getContent(LOCAL_DOWNLOADING_CONSTANTS.CONFIG_FILE))
}
catch(error) {
  Logging.logError("Error trying to initialize localDownloader's config", error)
}

class LocalDownloader {
  constructor(
    sourceFile,
    assignedUserEmail,
    contactName,
    contactEmail,
    contactPhone,
    veriSuiteJobId,
    env = LOCAL_DOWNLOADING_CONSTANTS.ENVS.PROD_ENV,
    ...props
  ) {
    this.sourceFile = sourceFile
    this.assignedUserEmail = assignedUserEmail
    this.contactName = contactName
    this.contactEmail = contactEmail
    this.contactPhone = contactPhone
    this.veriSuiteJobId = veriSuiteJobId
    this.env = env
    this.dateDisplay = DateUtils.GetDateDisplay()

    Logging.log("localDownloader this:", this)
    Logging.info("this.sourceFile", "this.sourceFile", this.sourceFile, "this.assignedUserEmail", this.assignedUserEmail, "this.contactName", this.contactName)

    try {
      this.downloadLocally(this.sourceFile, this.env)
    } catch(error) {
      Logging.logError("ERROR in constructor method of LocalDownloader", error)
    }
  }

  getJobNumbersFromFile(sourceFile) {
    try{
      let contents = File.getContent(sourceFile)
      let jobNumbers = contents.replace(/\s+/g, '').split(',')

      Logging.log("localDownloader.getJobNumbersFromFile()...", "contents:", contents, "jobNumbers", jobNumbers)

      return jobNumbers
    }
    catch(error) {
      Logging.logError("ERROR in localDownloader.getJobNumbersFromFile()", error)
      alert("Unable to read or parse job-number file. Please check the file and try again")
    }
  }

  removeNonFiles(originalFiles) {
    let files = originalFiles.slice().filter( file => !file.Key.endsWith("/") )

    //Logging.log("localDownloader.removeNonFiles()...", "originalFiles", originalFiles, "files:", files)

    return files
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
        Prefix: `${parentFolder}/`
      }

      const response = await s3.listObjectsV2(params).promise()

      //Logging.log("localDownloader.getS3FileList() response:", response)

      let files = this.removeNonFiles(response.Contents)
    
      //Logging.log("localDownloader.getS3FileList()...", "files:", files)

      return files
    }
    catch(error) {
      Logging.logError("ERROR inside localDownloader.getS3FileList()", error)
    }
  }

  async getFilesForEachJob(jobNumbers, env) {
    let filesForEachJob = [] 
    
    for (let i = 0; i < jobNumbers.length; i++) {
      let filesForCurrentJob = await this.getS3FileList(LOCAL_DOWNLOADING_CONSTANTS[env].SOURCE_BUCKET, jobNumbers[i])

      //Logging.log("localDownloader.getFilesForEachJob()", "filesForCurrentJob", filesForCurrentJob)

      filesForEachJob[i] = filesForCurrentJob

      //Logging.log("localDownloader.getFilesForEachJob()","i:", i, "filesForEachJob[i]", filesForCurrentJob[i])
    }

    //Logging.log("localDownloader.getFilesForEachJob.filesForEachJob:", filesForEachJob)

    return filesForEachJob
  }

  async saveS3FileData(
    jobNumbers,
    filesForEachJob,
    currentJobIndex,
    currentFileIndex,
    targetParentDirectory,
    fileData
  ) {
    Logging.log("localDownloader.saveS3FileData", "targetParentDirectory", targetParentDirectory, "filesForEachJob[currentJobIndex][currentFileIndex].Key", filesForEachJob[currentJobIndex][currentFileIndex].Key)

    let filePath = `${targetParentDirectory}${filesForEachJob[currentJobIndex][currentFileIndex].Key.replace(/\//g, '\\')}`

    File.makeDirIfItDoesNotExist(File.removeNameFromPath(filePath))

    Logging.log("filePath", filePath)

    let saveFileDataResult = fs.writeFileSync(filePath, fileData)

    filesForEachJob[currentJobIndex][currentFileIndex].saveFileDataResult = saveFileDataResult

    Logging.log("filesForEachJob[currentJobIndex][currentFileIndex].saveFileDataResult", filesForEachJob[currentJobIndex][currentFileIndex].saveFileDataResult)
  }

  async downloadFileForJob(
    jobNumbers,
    filesForEachJob,
    currentJobIndex,
    currentFileIndex, 
    targetParentFileDirectory,
    bucket,
    region = config.region,
    accessKeyId = config.accessKeyId,
    secretAccessKey = config.secretAccessKey,
    signatureVersion = 'v4'
  ) {
    Logging.log("localDownloader.downloadFileForJob (SINGLE FILE)", "currentJobIndex:", currentJobIndex,
      "jobNumbers[currentJobIndex]:", jobNumbers[currentJobIndex],
      "filesForEachJob[currentJobIndex]:", filesForEachJob[currentJobIndex],
      "filesForEachJob[currentJobIndex][currentFileIndex]:", filesForEachJob[currentJobIndex][currentFileIndex] 
    )
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
        Key: filesForEachJob[currentJobIndex][currentFileIndex].Key
      }
      Logging.LogSectionStart("DOWNLOAD FILE")
      Logging.log("params:", params)

      let data = await s3.getObject(params).promise()
      Logging.log("data:", data)
      filesForEachJob[currentJobIndex][currentFileIndex].downloadResponse = data.$response

      if(!defined(data.$response.error) || data.$response.error === null) {
        await this.saveS3FileData(
          jobNumbers,
          filesForEachJob,
          currentJobIndex,
          currentFileIndex, 
          targetParentFileDirectory,
          data.Body
        )
      }
      /*
      await s3.getObject(params, async function(error, data) {
        if(defined(error)) {
          filesForEachJob[currentJobIndex][currentFileIndex].downloadResult = {
            success: false,
            error: error
          }

          Logging.log("filesForEachJob[currentJobIndex][currentFileIndex].downloadResult", filesForEachJob[currentJobIndex][currentFileIndex].downloadResult)
        }else {
          filesForEachJob[currentJobIndex][currentFileIndex].downloadResult = {
            success: true
          }

          Logging.log("filesForEachJob[currentJobIndex][currentFileIndex].downloadResult", filesForEachJob[currentJobIndex][currentFileIndex].downloadResult)

           await this.saveS3FileData(
            jobNumbers,
            filesForEachJob,
            currentJobIndex,
            currentFileIndex, 
            targetParentFileDirectory,
            data.Body
          )
        }
      })
      */
      Logging.LogSectionEnd("DOWNLOAD FILE")
    }
    catch(error) {
      Logging.logError("ERROR inside localDownloader.downloadFileForJob()", error)
    }
  }

  async downloadFilesForJob(
    jobNumbers,
    filesForEachJob,
    currentJobIndex,
    targetParentFileDirectory,
    bucket,
    region = config.region,
    accessKeyId = config.accessKeyId,
    secretAccessKey = config.secretAccessKey,
    signatureVersion = 'v4'
    ) {
    Logging.log("localDownloader.downloadFilesForJob", "currentJobIndex:", currentJobIndex,
      "jobNumbers[currentJobIndex]", jobNumbers[currentJobIndex],
      "filesForEachJob[currentJobIndex]", filesForEachJob[currentJobIndex]
    )

    for (let currentFileIndex = 0; currentFileIndex < filesForEachJob[currentJobIndex].length; currentFileIndex++) {
      this.downloadFileForJob(jobNumbers, filesForEachJob, currentJobIndex, currentFileIndex, targetParentFileDirectory, bucket, region, accessKeyId, secretAccessKey, signatureVersion)
    }
  }

  async downloadFilesForEachJob(jobNumbers, filesForEachJob, env, targetParentFileDirectory) {
    for (let i = 0; i < filesForEachJob.length; i++) {
      this.downloadFilesForJob(
        jobNumbers, filesForEachJob, i, targetParentFileDirectory, LOCAL_DOWNLOADING_CONSTANTS[env].SOURCE_BUCKET)
    }
  }

  async downloadLocally(sourceFile, env) {
    let jobNumbers = this.getJobNumbersFromFile(sourceFile)

    let filesForEachJob = await this.getFilesForEachJob(jobNumbers, env)
    let targetParentFileDirectory = File.removeNameFromPath(sourceFile)

    Logging.log("downloadLocally() targetParentFileDirectory:", targetParentFileDirectory)

    await this.downloadFilesForEachJob(jobNumbers, filesForEachJob, env, targetParentFileDirectory)
  }
}

export default LocalDownloader