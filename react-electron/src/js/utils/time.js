function sleep(ms) {
    return new Promise((resolve) => { setTimeout(resolve, ms) })
    //Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, n);
  }  

const Time = {
  sleep,
  sleepSec(seconds) {
    return sleep(seconds * 1000)
  }
}

export default Time