'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Cache = require('./Cache');

var _Cache2 = _interopRequireDefault(_Cache);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function SchemaKey(type) {
  return 'SCHEMA_' + type;
}

var SCHEMAS = {};
exports.default = {
  set: function set(schemas) {
    schemas.forEach(function (schema) {
      SCHEMAS[schema.type] = schema;
      (0, _Cache2.default)(SchemaKey(schema.type), schema);
    });
  },
  get: function get(type) {
    if (SCHEMAS[type]) return SCHEMAS[type];else {
      var schema = (0, _Cache2.default)(SchemaKey(type));
      if (schema) {
        SCHEMAS[type] = schema;
        return schema;
      } else {
        return null;
      }
    }
  }
};