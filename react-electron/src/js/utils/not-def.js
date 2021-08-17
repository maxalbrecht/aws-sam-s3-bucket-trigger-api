import defined from './defined'

const NOT_DEFINED = "NOT_DEFINED"

function defaultTo(someParam, defaultVal) {
  return defined(someParam) ? someParam : defaultVal
}

const NotDef = {
  defined,
  defaultTo,
  defaultToNotDefined(someParam) {
    return defaultTo(someParam, NOT_DEFINED)
  },
  defaultToNegOne(someParam) {
    return defaultTo(someParam, -1)
  },
  defaultToZero(someParam) {
    return defaultTo(someParam, 0)
  },
  defaultToTrue(someParam) {
    return defaultTo(someParam, true)
  },
  defaultToFalse(someParam) {
    return defaultTo(someParam, false)
  }
}

export default NotDef