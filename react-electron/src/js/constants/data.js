let DATA_BASE = {
  types: {
    boolean: "boolean",
    number: "number",
    bigint: "bigint",
    string: "string",
    symbol: "symbol",
    function: "function",
    object: "object"
  }
}

DATA_BASE.types.asList = Object.values(DATA_BASE.types)
const DATA = { ...DATA_BASE }

export default DATA