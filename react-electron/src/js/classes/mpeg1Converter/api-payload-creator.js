import api_payload_template from './api-payload-template'
import MPEG1_CONVERSION_CONSTANTS from './../../constants/mpeg1-conversion'
import Regex from './../../utils/regex'
import Logging from './../../utils/logging'

class APIPayloadCreator {
  constructor() {
    this.state = {
      source_url: "",
      path_format: "" 
    }
  }

  GetFormattedAPIPayload(source_url, path_format) {
    this.state.source_url = source_url 
    this.state.path_format = path_format

    return Regex.ReplaceJSONPlaceHolders(api_payload_template, this.state)
  }
}

export default APIPayloadCreator