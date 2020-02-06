import handleClickSourceFile from './handleClickSourceFile'
import mapStateToProps from './mapStateToProps'
import handleSourceFileDelete from './handleSourceFileDelete'
import handleDoubleClickSourceFile from './handleDoubleClickSourceFile';

function logicConstructor(props) {
  this.handleDoubleClickSourceFile = handleDoubleClickSourceFile.bind(this);
  this.handleClickSourceFile = handleClickSourceFile.bind(this);
  this.handleSourceFileDelete = handleSourceFileDelete.bind(this);
}

export { mapStateToProps, logicConstructor };