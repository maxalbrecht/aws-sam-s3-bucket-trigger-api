import mapStateToProps from './mapStateToProps'
import selectStatusColor from './selectStatusColor'
import selectBackgroundColor from './selectBackgroundColor'
import handleToggleCollapse from './handleToggleCollapse'
import ToggleButtonLabel from './toggleButtonLabel'

function logicConstructor(props){
  this.selectStatusColor = selectStatusColor.bind(this)
  this.selectBackgroundColor = selectBackgroundColor.bind(this)
  this.handleToggleCollapse = handleToggleCollapse.bind(this)
  this.ToggleButtonLabel = ToggleButtonLabel.bind(this)

  this.JobDetailsIsOpen = false
  if(props.jobDetailsIsOpen){
    this.JobDetailsIsOpen = props.jobDetailsIsOpen
  }

  this.id = props.id
  this.StitchedFileObject = props.StitchedFileObject
  this.handleToggleCollapse = this.handleToggleCollapse.bind(this)
  this.ToggleButtonLabel = this.ToggleButtonLabel.bind(this)
}

export {
  mapStateToProps,
  logicConstructor
}