import ENV from '../constants/environments'
import isDev from './is-dev'

function getEnv() {
  if(isDev) {
    return ENV.DEV
  }
  else {
    return ENV.PROD
  }
}

export default getEnv