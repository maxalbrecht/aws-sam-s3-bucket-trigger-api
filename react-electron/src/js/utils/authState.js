function authState(
  username,
  email,
  password,
  confirmpassword,
) {
  return {
    username: username,
    email: email,
    password: password,
    confirmpassword: confirmpassword
  }
}

export default authState;