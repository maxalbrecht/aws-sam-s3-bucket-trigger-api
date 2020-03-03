import defined from '../../../utils/defined'

function PasswordMatchErrorDisplay(passwordMatch) {
  let errors = []

  if (defined(passwordMatch) && passwordMatch === false) {
    errors.push("Password Mismatch")
  }

  return errors
}

export default PasswordMatchErrorDisplay;