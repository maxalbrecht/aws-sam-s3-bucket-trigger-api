import { JOB_ARCHIVING_FINISHED } from './../../constants/action-types'
import { action } from './../../utils/action'
import { SUCCESS, ERROR, ARCHIVING_JOB } from './../../constants/job_archiving_statuses'
import JobArchiving from '../../components/jobArchiving/JobArchiving'
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

    this.dateDisplay = this.SetDateDisplay() 

    try{
      this.ArchiveJob(this.externalJobNumber, this.year, this.month)
    }
    catch(e){
      console.log(`Error in Job Archiver. Error: ${e}`)
      throw e
    }
  }

  IntTwoChars(i) {
    return (`0${i}`).slice(-2);
  }

  SetDateDisplay(){
    try {
      let date_ob = new Date()
      this.milliseconds = date_ob.getTime()
      let date = this.IntTwoChars(date_ob.getDate())
      let month = this.IntTwoChars(date_ob.getMonth() + 1)
      let year = date_ob.getFullYear()
      let hours = this.IntTwoChars(date_ob.getHours())
      let minutes = this.IntTwoChars(date_ob.getMinutes())
      let seconds = this.IntTwoChars(date_ob.getSeconds())
      let dateDisplay = `${hours}:${minutes}:${seconds} ${month}/${date}/${year}`
      console.log(`Job submission time: ${dateDisplay}`)
      return dateDisplay
    } catch (error) {
      console.log(`Error setting date display. Error: ${error}`);
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
      console.log(`Error archiving job. Error: ${e}`)
      this.errorMsgList = { error: e }
    }

    this.jobArchivingStatus = newJobArchivingStatus

    store.dispatch(action(JOB_ARCHIVING_FINISHED, newJobArchivingStatus))
  }
}

export default JobArchiver






























