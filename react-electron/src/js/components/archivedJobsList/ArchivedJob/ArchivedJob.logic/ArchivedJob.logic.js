import mapStateToProps from './mapStateToProps'
import selectStatusColor from './selectStatusColor'
import selectBackgroundColor from './selectBackgroundColor'

function logicConstructor(props){
  this.selectStatusColor = selectStatusColor.bind(this)
  this.selectBackgroundColor = selectBackgroundColor.bind(this)

  this.id = props.id
  this.ArchivedJobObject = props.ArchivedJobObject
}

export {
  mapStateToProps,
  logicConstructor
}