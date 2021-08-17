import NotDef from './not-def'
const { defaultTo, defaultToTrue } = NotDef

const DEFAULT_SPACER = "  "

function indent(indentLvl, params = {}) {
  //let addNewLine = ( defined(params.addNewLine) ? params.addNewLine : true )
  //let spacer = ( defined(params.spacer) ? params.spacer : DEFAULT_SPACER )
  let addNewLine = defaultToTrue(params.addNewLine)
  let spacer = defaultTo(params.spacer, DEFAULT_SPACER )

  let result = ""

  if(addNewLine) { result += "\n" }

  if(indentLvl > 0) { result += spacer.repeat(indentLvl) }

  return result
}

const Text = {
  indent,
  addIndent(text, indentLvlIncrease, spacer = DEFAULT_SPACER) {
    let spacing = indent(indentLvlIncrease, { spacer: spacer })
    text.replace(/\n/g, spacing)

    if(text.charAt(0) !== "\n") {
      spacing = indent(indentLvlIncrease, { addNewLine: true, spacer: spacer })
      text = spacing + text
    }
  },
  convertToUtf8(text) {
    return Buffer.from(text, 'utf-8').toString()
  }
}

export default Text