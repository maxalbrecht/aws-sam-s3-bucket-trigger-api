import mapStateToProps from './mapStateToProps'
import getClassNamesForColorCoding from './getClassNamesForColorCoding'
import selectStatusColor from './selectStatusColor'
import selectBackgroundColor from './selectBackgroundColor'
import handleToggleCollapse from './../../../../utils/handleToggleCollapse'
import ToggleButtonLabel from './../../../../utils/toggleButtonLabel'

function logicConstructor(props) {
  this.getClassNamesForColorCoding = getClassNamesForColorCoding.bind(this)
  this.selectStatusColor = selectStatusColor.bind(this)
  this.selectBackgroundColor = selectBackgroundColor.bind(this)
  this.handleToggleCollapse = handleToggleCollapse.bind(this)
  this.ToggleButtonLabel = ToggleButtonLabel.bind(this)

  this.JobDetailsIsOpen = false
  if(props.jobDetailsIsOpen) {
    this.JobDetailsIsOpen = props.jobDetailsIsOpen
  }

  this.id = props.id
  this.MpegConversionVeriSuiteJobObject = props.MpegConversionVeriSuiteJobObject

}

export {
  mapStateToProps,
  logicConstructor
}