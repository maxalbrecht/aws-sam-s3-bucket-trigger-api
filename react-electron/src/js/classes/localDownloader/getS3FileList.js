import LOCAL_DOWNLOADING_CONSTANTS from "../../constants/local-downloading"
import File from './../../utils/file'
import Logging from "../../utils/logging"
import NotDef from './../../utils/not-def'

const { defined, defaultTo } = NotDef

const aws = require('aws-sdk')

function getConfig() {
  let config
  try {
    config = JSON.parse(File.getContent(LOCAL_DOWNLOADING_CONSTANTS.CONFIG_FILE))
    //Logging.log("config:", config)

    return config
  }
  catch(error) {
    Logging.logError("Error trying to initialize localDownloader's config", error)
  }
}

function removeNonFiles(originalFiles) {
  let files = originalFiles.slice().filter( file => !file.Key.endsWith("/") )

  return files
}

async function getS3FileList(
  bucket,
  parentFolder,
  region = null,
  accessKeyId = null,
  secretAccessKey = null,
  signatureVersion = 'v4'
) {
  try {
    let config = getConfig()

    if(!defined(region) || !defined(accessKeyId) || !defined(secretAccessKey)) {
      region = defaultTo(region, config.region)
      accessKeyId = defaultTo(accessKeyId, config.accessKeyId)
      secretAccessKey = defaultTo(secretAccessKey, config.secretAccessKey)
    }

    const s3 = new aws.S3({
      //endpoint: new aws.Endpoint(LOCAL_DOWNLOADING_CONSTANTS.getS3AccelerateEndpointString(bucket)),
      //endpoint: new aws.Endpoint(`${bucket}.s3-accelerate.amazonaws.com`),
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

    //GET LIST OF FILES
    const responseFromS3ListObjectsV2 = await s3.listObjectsV2(params).promise()
    let files = removeNonFiles(responseFromS3ListObjectsV2.Contents)

    // GET FILE TYPE FOR EACH FILE
    for (let i = 0; i < files.length; i++) {
      let headObjectParams = { Bucket: bucket, Key: files[i].Key }

      let headObjectResponse = await s3.headObject(headObjectParams).promise()

      if(defined(headObjectResponse, "ContentType")) { files[i].ContentType = headObjectResponse.ContentType }
    }
    Logging.log("localDownloader.getS3FileList()...", "files after getting Content-Type:", files)

    return files
  }
  catch(error) {
    Logging.logError("ERROR inside localDownloader.getS3FileList()", error)
  }
  }

export default getS3FileList