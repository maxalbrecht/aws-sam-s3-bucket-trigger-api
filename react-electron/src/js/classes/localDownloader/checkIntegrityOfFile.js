import LOCAL_DOWNLOADING_CONSTANTS from './../../constants/local-downloading'

const { FILE_STATUSES } = LOCAL_DOWNLOADING_CONSTANTS

  async function  checkIntegrityOfFile(
    jobNumbers,
    filesForEachJob,
    currentJobIndex,
    currentFileIndex,
    filePath
    //targetParentDirectory,
    //necessaryNumberOfChunks,
    //chunkSemaphore,
    //fileSemaphore
  ) {
    /*
    let hashOfLocalCopyOfFile = crypto.createHash('md5')
    let stream = fs.createReadStream(filePath)

    stream.on('data', function (data) {
      hashOfLocalCopyOfFile.update(data, 'utf8')
    })

    await stream.on('end', function () {
      hashOfLocalCopyOfFile.digest('hex') // 34f7a3113803f8ed3b8fd7ce5656ebec
    })
    */
    let currentFile = filesForEachJob[currentJobIndex][currentFileIndex]
    //currentFile.hashOfLocalCopy = await File.getMd5Hash(filePath)
    currentFile.sizeOfLocalCopy = File.getSizeInBytes(filePath)

    //Logging.log(`filePath: ${filePath}; hashOfLocalCopy: ${currentFile.hashOfLocalCopy}`)

    //if(currentFile.ETag === currentFile.hashOfLocalCopy) {
    if(currentFile.Size === currentFile.sizeOfLocalCopy) {
      currentFile.integrityCheckPass = true

      currentFile.fileStatus = FILE_STATUSES.COMPLETE
    }
    else {
      currentFile.integrityCheckPass = false
      currentFile.integrityError = {
        message: "Integrity Check Failed"
      }

      currentFile.fileStatus = FILE_STATUSES.ERROR
    }

    Logging.log("currentFile after saving results of hash check:", currentFile)
  }