function round(value, precision) {
  let multiplier = Math.pow(10, precision || 0);

  return Math.round(value * multiplier) / multiplier;
}

const Nums = {
  withCommas(x) {
    return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")
  },
  round,
  percentage(numerator, denominator, precision) {
    let percent = (numerator * 100.0) / denominator

    let result = round(percent, precision)

    return result
  }
}
export default Nums