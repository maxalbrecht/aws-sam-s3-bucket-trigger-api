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
  },
  getCurrentDateTimeDataPoints() {
    let date_ob = new Date()

    let year = date_ob.getFullYear()
    let month = Int.TwoChars(date_ob.getMonth() + 1)
    let day = Int.TwoChars(date_ob.getDate())
    let hours = Int.TwoChars(date_ob.getHours())
    let minutes = Int.TwoChars(date_ob.getMinutes())
    let seconds = Int.TwoChars(date_ob.getSeconds())
    let milliseconds = date_ob.getTime()
  },
  getCurrentTimestamp() {

  },
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