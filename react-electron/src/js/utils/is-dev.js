import defined from './defined'


function isDevFunc() {
  const nodeEnv = process.env.NODE_ENV
  let result = false

  console.log("nodeEnv:")
  console.log(nodeEnv)

  if( !defined(process, "env.NODE_ENV") || (defined(nodeEnv) && nodeEnv === 'development') ) {
    result = true
  }

  console.log("isDev:")
  console.log(result)

  return result
}

const isDev = isDevFunc()

export default isDev