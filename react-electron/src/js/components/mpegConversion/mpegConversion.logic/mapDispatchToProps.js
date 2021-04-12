import { addMpegConversionJob } from './../../../actions/index'

function mapDispatchToProps(dispatch) {
  return {
    addMpegConversionJob: mpegConversionJob => dispatch(addMpegConversionJob(mpegConversionJob))
  }
}

export default mapDispatchToProps