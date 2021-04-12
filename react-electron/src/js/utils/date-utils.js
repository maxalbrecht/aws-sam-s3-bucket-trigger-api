import Int from './int'

function getCurrentDateTimeDataPoints() {
  let date_ob = new Date()
  
  return {
    year: date_ob.getFullYear(),
    month: Int.TwoChars(date_ob.getMonth() + 1),
    day: Int.TwoChars(date_ob.getDate()),
    hours: Int.TwoChars(date_ob.getHours()),
    minutes: Int.TwoChars(date_ob.getMinutes()),
    seconds: Int.TwoChars(date_ob.getSeconds()),
    milliseconds: Int.ThreeChars(date_ob.getMilliseconds())
  }
}

function getCurrentISOTimestamp() {
  let dt = getCurrentDateTimeDataPoints()

  return `${dt.year}-${dt.month}-${dt.day}T${dt.hours}:${dt.minutes}:${dt.seconds}:${dt.milliseconds}`
}

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
  },
  getCurrentDateTimeDataPoints: getCurrentDateTimeDataPoints,
  getCurrentDateStamp() {
    let timestamp = getCurrentISOTimestamp()

    return timestamp.substr(0, timestamp.indexOf("T"))
  },
  getCurrentTimestampWithoutColonsOrPeriods() {
    return getCurrentISOTimestamp().replace(":", '').replace(".", '')
  },
  getCurrentISOTimestamp: getCurrentISOTimestamp,
  SortArrayByReverseElement$_dot_$date(array) {
    array.sort(function(a,b) {
      if(a.date.getTime() < b.date.getTime()) {
        // a happened before b, therefore a will be placed
        // second in the list, since we want to display them in
        // reverse chronological order
        return 1
      }
      else {
        return -1
      }
    })
  }
}

export default DateUtils