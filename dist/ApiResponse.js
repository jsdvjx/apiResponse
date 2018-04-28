'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Resource = require('./Resource');

var _Resource2 = _interopRequireDefault(_Resource);

var _ApiAction = require('./ApiAction');

var _ApiAction2 = _interopRequireDefault(_ApiAction);

var _Schema = require('./Schema');

var _Schema2 = _interopRequireDefault(_Schema);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ApiResponse = function () {
  function ApiResponse(response) {
    var name = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

    _classCallCheck(this, ApiResponse);

    this.response = response;
    this.name = name;
    this.resolve();
  }

  _createClass(ApiResponse, [{
    key: 'resolve',
    value: function resolve() {
      var _this = this;

      if (this.response.actions && this.response.data.length > 0) {
        _ApiAction2.default.add(this.response.data[0].type, this.response.actions);
      }
      this.list = this.response.data.map(function (item) {
        return new _Resource2.default(item, _this.name);
      });
      _Schema2.default.set(this.response.schemas);
    }
  }, {
    key: 'getItems',
    value: function getItems() {
      return this.list.map(function (resource) {
        return resource.getItem();
      });
    }
  }, {
    key: 'pagination',
    get: function get() {
      return this.response.pagination;
    }
  }, {
    key: 'items',
    get: function get() {
      return this.list.map(function (resource) {
        return resource.item;
      });
    }
  }]);

  return ApiResponse;
}();

exports.default = ApiResponse;