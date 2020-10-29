import getConstructorState from './getConstructorState'
import handleChange from './handleChange'
import handleSubmit from './handleSubmit'
import CheckForEmptyFields from './checkForEmptyFields'
import ValidateFileStitchingFields from './validateFileStitchingFields'
import handleClickBrowse from './handleClickBrowse'
import mapDispatchToProps from './mapDispatchToProps'

function logicConstructor(props){
  this.state = getConstructorState()
  this.handleChange = handleChange.bind(this)
  this.handleSubmit = handleSubmit.bind(this)
  this.handleClickBrowse = handleClickBrowse.bind(this)
  this.CheckForEmptyFields = CheckForEmptyFields.bind(this)
  this.ValidateFileStitchingFields = ValidateFileStitchingFields.bind(this)
  this.mapDispatchToProps = mapDispatchToProps.bind(this)
}

export { mapDispatchToProps, logicConstructor }