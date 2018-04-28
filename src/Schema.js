import Cache from './Cache'

function SchemaKey (type) {
  return `SCHEMA_${type}`
}

const SCHEMAS = {}
export default {
  set (schemas) {
    if (schemas) {
      schemas.forEach((schema) => {
        SCHEMAS[schema.type] = schema
        Cache(SchemaKey(schema.type), schema)
      })
    }
  },
  get (type) {
    if (SCHEMAS[type]) return SCHEMAS[type]
    else {
      let schema = Cache(SchemaKey(type))
      if (schema) {
        SCHEMAS[type] = schema
        return schema
      } else {
        return null
      }
    }
  }
}
