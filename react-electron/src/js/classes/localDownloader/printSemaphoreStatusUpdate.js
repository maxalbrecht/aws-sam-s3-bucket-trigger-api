import Logging from './../../utils/logging'
import DateUtils from './../../utils/date-utils'
import LOCAL_DOWNLOADING_CONSTANTS from './../../constants/local-downloading'
import Time from './../../utils/time'

const { sleep } = Time

async function printSemaphoreStatusUpdate(chunkSemaphore, fileSemaphore) {
  while(true) {
    Logging.log(`CURRENT TIME: ${DateUtils.GetDateDisplay()} `, "chunkSemaphore:", chunkSemaphore, "fileSemaphore:", fileSemaphore)
    
    await sleep(LOCAL_DOWNLOADING_CONSTANTS.TIMEOUT_BETWEEN_PRINTING_STATUS_UPDATES_MILLISECONDS)
  }
}

export default printSemaphoreStatusUpdate