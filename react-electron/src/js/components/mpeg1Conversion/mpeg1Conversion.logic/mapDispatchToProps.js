import { addMpeg1ConversionJob } from './../../../actions/index'

function mapDispatchToProps(dispatch) {
  return {
    addMpeg1ConversionJob: mpeg1ConversionJob => dispatch(addMpeg1ConversionJob(mpeg1ConversionJob))
  }
}

export default mapDispatchToProps