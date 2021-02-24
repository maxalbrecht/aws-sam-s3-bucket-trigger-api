import Int from './int'
const DateUtils = {
  GetDateDisplay(){
    let date_ob = new Date()
    this.milliseconds = date_ob.getTime()
    let date = Int.TwoChars(date_ob.getDate())
    let month = Int.TwoChars(date_ob.getMonth() + 1)
    let year = date_ob.getFullYear()
    let hours = Int.TwoChars(date_ob.getHours())
    let minutes = Int.TwoChars(date_ob.getMinutes())
    let seconds = Int.TwoChars(date_ob.getSeconds())
    
    return `${hours}:${minutes}:${seconds} ${month}/${date}/${year}`
  }
}

export default DateUtils