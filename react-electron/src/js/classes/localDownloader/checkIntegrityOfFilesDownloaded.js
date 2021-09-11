checkIntegrityOfFilesDownloaded(filesForEachJob, jobNumbers) {
  let result = true

  for (let currentJobIndex = 0; currentJobIndex < filesForEachJob.length; currentJobIndex++) {
    const currentJob = filesForEachJob[currentJobIndex]

    for (let currentFileIndex = 0; currentFileIndex < currentJob.length; currentFileIndex++) {
      const currentFile = currentJob[currentFileIndex]
      
      if(!defaultToFalse(currentFile.integrityCheckPass)) {
        result = false
      }
    }
  }

  return `${result}`
}

export default checkIntegrityOfFilesDownloaded