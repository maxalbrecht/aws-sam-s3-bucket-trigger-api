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

const DAYS = "DAYS"
const HOURS = "HOURS"
const MINUTES = "MINUTE"
const SECONDS = "SECONDS"
const MILLISECONDS = "MILLISECONDS"

function getTimeUnitConversions() {
  const timeUnitConversions = {}
  let timeUnitOrdinalNumber = 0

  timeUnitConversions[MILLISECONDS] = {
    ordinalNumber: timeUnitOrdinalNumber++,
    nextUnit: SECONDS,
    conversionToNextUnit: 1000
  }
  timeUnitConversions[SECONDS] = {
    ordinalNumber: timeUnitOrdinalNumber++,
    nextUnit: MINUTES,
    conversionToNextUnit: 60
  }
  timeUnitConversions[MINUTES] = {
    ordinalNumber: timeUnitOrdinalNumber++,
    nextUnit: HOURS,
    conversionToNextUnit: 60
  }
  timeUnitConversions[HOURS] = {
    ordinalNumber: timeUnitOrdinalNumber++,
    nextUnit: DAYS,
    conversionToNextUnit: 24
  }
  timeUnitConversions[DAYS] = {
    ordinalNumber: timeUnitOrdinalNumber++,
    nextUnit: null,
    conversionToNextUnit: null
  }

  return timeUnitConversions
}


function convertTimeUnits(duration, sourceUnit, targetUnit) {
  let result = duration
  let timeUnitConversions = getTimeUnitConversions()

  if(timeUnitConversions[sourceUnit].ordinalNumber <= timeUnitConversions[targetUnit].ordinalNumber) {
    while(sourceUnit !== targetUnit) {
      result /= (timeUnitConversions[sourceUnit].conversionToNextUnit * 1.0)

      sourceUnit = timeUnitConversions[sourceUnit].nextUnit
    }
  }
  else {
    while(targetUnit !== sourceUnit) {
      result *= timeUnitConversions[targetUnit].conversionToNextUnit

      targetUnit = timeUnitConversions[targetUnit].nextUnit
    }
  }

  return result
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
  },
  TIME_UNITS: {
    DAYS,
    HOURS,
    MINUTES,
    SECONDS,
    MILLISECONDS
  },
  convertTimeUnits,
  msToTime(duration) {
    let hours = Math.floor(convertTimeUnits(duration, MILLISECONDS, HOURS))
    duration -= convertTimeUnits(hours, HOURS, MILLISECONDS) 
    let minutes = Math.floor(convertTimeUnits(duration, MILLISECONDS, MINUTES))
    duration -= convertTimeUnits(minutes, MINUTES, MILLISECONDS)
    let seconds = Math.floor(convertTimeUnits(duration, MILLISECONDS, SECONDS))
    duration -= convertTimeUnits(seconds, SECONDS, MILLISECONDS)
    let milliseconds = duration

    hours = Int.TwoChars(hours)
    minutes = Int.TwoChars(minutes)
    seconds = Int.TwoChars(seconds)
    milliseconds = Int.ThreeChars(milliseconds)

    let result = `${hours}:${minutes}:${seconds}.${milliseconds}`

    return result
  },
  msToTimeOLD(duration) {
    var milliseconds = parseInt((duration % 1000) / 100),
      seconds = Math.floor((duration / 1000) % 60),
      minutes = Math.floor((duration / (1000 * 60)) % 60),
      hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;

    return hours + ":" + minutes + ":" + seconds + "." + milliseconds;
  }
}

export default DateUtils