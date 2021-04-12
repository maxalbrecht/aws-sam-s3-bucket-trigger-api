import { JOB_ARCHIVING_FINISHED } from './../../constants/action-types'
import { action } from './../../utils/action'
import { SUCCESS, ERROR, ARCHIVING_JOB } from './../../constants/job_archiving_statuses'
import DateUtils from './../../utils/date-utils'

var store = window.store

class JobArchiver {
  constructor({
    externalJobNumber,
    year,
    month,
    assignedUserEmail,
    contactName,
    contactEmail,
    contactPhone,
    id
  }) {
    this.externalJobNumber = externalJobNumber
    this.year = year
    this.month = month
    this.assignedUserEmail = assignedUserEmail
    this.contactName = contactName
    this.contactEmail = contactEmail
    this.contactPhone = contactPhone
    this.id = id
    this.dateDisplay = "<<Date & Time>>";
    this.jobArchivingStatus = ARCHIVING_JOB;
    this.errorMsgList = [];

    this.dateDisplay = DateUtils.GetDateDisplay() 

    try{
      this.ArchiveJob(this.externalJobNumber, this.year, this.month)
    }
    catch(e){
      //^^//console.log(`Error in Job Archiver. Error: ${e}`)
      throw e
    }
  }

  ArchiveJob(externalJobNumber, year, month){
    let newJobArchivingStatus = ""

    try{
      //MOVE FILES
      //TODO: IMPLEMENT MOVING FILES FROM vxtprod TO vxtarc

      //SET STATUS
      newJobArchivingStatus = SUCCESS
    }
    catch(e){
      newJobArchivingStatus = ERROR
      //^^//console.log(`Error archiving job. Error: ${e}`)
      this.errorMsgList = { error: e }
    }

    this.jobArchivingStatus = newJobArchivingStatus

    store.dispatch(action(JOB_ARCHIVING_FINISHED, newJobArchivingStatus))
  }
}

export default JobArchiver






























