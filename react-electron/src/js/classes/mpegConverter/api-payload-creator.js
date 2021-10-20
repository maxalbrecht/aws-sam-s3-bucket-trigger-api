import api_payload_template from './api-payload-template'
import Regex from './../../utils/regex'

class APIPayloadCreator {
  constructor() {
    this.state = {
      source_url: "",
      path_format: "" 
    }
  }

  GetFormattedAPIPayload(source_url, path_format, template_id) {
    this.state.url = source_url 
    this.state.path_format = path_format
    this.state.template_id = template_id

    return Regex.ReplaceJSONPlaceHolders(api_payload_template, this.state)
  }
}

export default APIPayloadCreator