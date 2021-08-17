function decimalToHex(d, padding) {
  var hex = Number(d).toString(16);
  padding = typeof (padding) === "undefined" || padding === null ? padding = 2 : padding;

  while (hex.length < padding) {
      hex = "0" + hex;
  }

  return hex;
}

export function rgbToHex(red, green, blue) {
  return `#${decimalToHex(red)}${decimalToHex(green)}${decimalToHex(blue)}`
}

export function convertUnits(amount, sourceUnit, targetUnit, unitConversions) {
  let result = amount

  if(unitConversions[sourceUnit].ordinalNumber <= unitConversions[targetUnit].ordinalNumber) {
    while(sourceUnit !== targetUnit) {
      result /= (unitConversions[sourceUnit].conversionToNextUnit * 1.0) 

      sourceUnit = unitConversions[sourceUnit].nextUnit
    }
  }
  else {
    while(targetUnit !== sourceUnit) {
      result *= unitConversions[targetUnit].conversionToNextUnit

      targetUnit = unitConversions[targetUnit].nextUnit
    }
  }

  return result
}

const Convert = {
  convertUnits,
  rgbToHex,
  decimalToHex
}

export default Convert