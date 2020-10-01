import getConstructorState from './getConstructorState'
import handleChange from './handleChange'
import handleSubmit from './handleSubmit'
import CheckForEmptyFields from './checkForEmptyFields'
import ValidateJobArchivingFields from './validateJobArchivingFields'
import handleClickBrowse from './handleClickBrowse'
import handleJobNumberPressEnterKey from './handleJobNumberPressEnterKey'
import mapDispatchToProps from './mapDispatchToProps'

function logicConstructor(props) {
  this.state = getConstructorState();
  this.handleChange = handleChange.bind(this);
  this.handleSubmit = handleSubmit.bind(this);
  this.handleClickBrowse = handleClickBrowse.bind(this)
  this.handleJobNumberPressEnterKey = handleJobNumberPressEnterKey.bind(this)
  this.CheckForEmptyFields = CheckForEmptyFields.bind(this);
  this.ValidateJobArchivingFields = ValidateJobArchivingFields.bind(this);
  this.mapDispatchToProps = mapDispatchToProps.bind(this)
}

export { mapDispatchToProps, logicConstructor };