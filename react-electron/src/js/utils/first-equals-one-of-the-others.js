function firstEqualsOneOfTheOthers(first, ...others) {
  for (let i = 0; i < others.length; i++) {
    if(first === others[i]) {
      return true
    }
  }

  return false
}

export default firstEqualsOneOfTheOthers