//import Logging from './../utils/logging'

const Int = {
  TwoChars(i){
    return (`0${i}`).slice(-2)
  },
  ThreeChars(i){
    return (`0${i}`).slice(-3).padStart(3, '0')
  }
}

export default Int