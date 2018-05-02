'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Cache = require('./Cache');

var _Cache2 = _interopRequireDefault(_Cache);

var _Schema = require('./Schema');

var _Schema2 = _interopRequireDefault(_Schema);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Resource = function () {
  function Resource(resource, request) {
    var _this2 = this;

    _classCallCheck(this, Resource);

    this.destroy = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
      var result;
      return _regenerator2.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              console.log(_this2.Request);
              _context.next = 3;
              return _this2.Request.delete(_this2.getType() + '/' + _this2.id, _this2.requestConfig);

            case 3:
              result = _context.sent;
              return _context.abrupt('return', result);

            case 5:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, _this2);
    }));
    this.save = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee2() {
      var result, _result2;

      return _regenerator2.default.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              if (!_this2._create) {
                _context2.next = 7;
                break;
              }

              _context2.next = 3;
              return _this2.Request.post('' + _this2.type, _this2.item, _this2.requestConfig);

            case 3:
              result = _context2.sent;
              return _context2.abrupt('return', result);

            case 7:
              if (!_this2.change) {
                _context2.next = 14;
                break;
              }

              _context2.next = 10;
              return _this2.Request.patch(_this2.type + '/' + _this2.id, _this2.changePart, _this2.requestConfig);

            case 10:
              _result2 = _context2.sent;
              return _context2.abrupt('return', _result2);

            case 14:
              return _context2.abrupt('return', false);

            case 15:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, _this2);
    }));

    this.itemInclude = function () {
      var _result = {};
      if (_this2.include !== undefined && _this2.include.length) {
        _this2.include.forEach(function (include) {
          if (_result[include.type] === undefined) _result[include.type] = [];
          _result[include.type].push(include.item);
        });
      }
      return Object.keys(_result).length ? _result : null;
    };

    this.setRequest(request);
    this._create = false;
    this._resource = resource;
    this._copy = JSON.parse(JSON.stringify(resource.attributes));
    this.requestConfig = {};
    if (resource.attributes.id !== undefined && resource.attributes.id instanceof Number) (0, _Cache2.default)(this._resource.type + '_' + this._resource.attributes.id, this._resource, 60);
    this.schema = _Schema2.default.get(this._resource.type);
    this.schema = this.schema ? this.schema : {};
    this._resolve();
  }

  _createClass(Resource, [{
    key: 'setRequest',
    value: function setRequest(request) {
      this.Request = request;
    }

    /**
     * 获取资源类型
     */

  }, {
    key: 'getType',
    value: function getType() {
      return this._resource.type;
    }

    /**
     * 获取资源内容
     */

  }, {
    key: 'getItem',
    value: function getItem() {
      return this._resource.attributes;
    }
  }, {
    key: 'setRequestConfig',
    value: function setRequestConfig(config) {
      this.requestConfig = _extends({}, this.requestConfig, config);
    }

    /**
     * 解析资源建立getter，setter
     */

  }, {
    key: '_resolve',
    value: function _resolve() {
      var _this3 = this;

      var props = {};
      if (this._resource.include !== undefined && this._resource.include !== null) {
        this.include = this._resource.include.map(function (item) {
          return new Resource(item, _this3.Request);
        });
      }
      var attributes = this._resource.attributes;
      Object.keys(attributes).forEach(function (key) {
        props[key] = {
          get: function get() {
            return attributes[key];
          },
          set: function set(value) {
            attributes[key] = value;
          }
        };
      });
      if (this.schema) {
        this.schema.withes !== null && this.schema.withes.forEach(function (includeName) {
          props[includeName] = {
            get: function get() {
              var _tmp = this.include !== undefined && this.include.length && this.include.filter(function (_include) {
                return _include.type === includeName;
              });
              return _tmp.length ? _tmp[0].item : null;
            }
          };
          /*
          props[`${includeName}Items`] = {
            get () {
              let _tmp = (this.include !== undefined && this.include.length) && this.include.filter(function (_include) {
                return _include.type === includeName
              })
              return _tmp.length ? _tmp : []
            }
          }
          */
        });
      }
      return Object.defineProperties(this, props);
    }
  }, {
    key: 'item',
    get: function get() {
      var _this = this;
      if (this._resource.attributes._binding) {
        return this._resource.attributes;
      }
      var include = this.itemInclude();
      var props = {
        _binding: {
          get: function get() {
            return true;
          }
        },
        _save: {
          get: function get() {
            return _this.save;
          }
        },
        _destroy: {
          get: function get() {
            return _this.destroy;
          }
        }
      };
      if (include) {
        Object.keys(include).forEach(function (key) {
          props[key] = {
            get: function get() {
              return include[key][0];
            }
          };
          props[key + 'Items'] = {
            get: function get() {
              return include[key];
            }
          };
        });
      }
      Object.defineProperties(this._resource.attributes, props);
      return this._resource.attributes;
    }
  }, {
    key: 'change',
    get: function get() {
      return Object.keys(this._copy).filter(function (key) {
        return this.item[key] !== this._copy[key];
      }.bind(this)).length > 0;
    }
  }, {
    key: 'changePart',
    get: function get() {
      var ret = {};
      Object.keys(this._copy).filter(function (key) {
        return this.item[key] !== null && this.item[key] !== this._copy[key];
      }.bind(this)).forEach(function (key) {
        ret[key] = this.item[key];
      }.bind(this));
      return ret;
    }
  }, {
    key: 'type',
    get: function get() {
      return this._resource.type;
    }
  }], [{
    key: 'create',
    value: function create(attributes, type, request) {
      if (attributes === null) {
        var _schema = _Schema2.default.get(type).map;
        var _attrs = {};
        var _filter = ['created_at', 'updated_at', 'id'];
        Object.keys(_schema).forEach(function (field) {
          if (_filter.indexOf(field) < 0) _attrs[field] = null;
        });
        var result = new Resource({ attributes: _attrs, type: type }, request);
        result._create = true;
        return result;
      } else {
        var _result3 = new Resource({ attributes: attributes, type: type }, request);
        _result3._create = true;
        return _result3;
      }
    }
  }, {
    key: '_destroy',
    value: function () {
      var _ref3 = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee3(id, target) {
        var config = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
        return _regenerator2.default.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function _destroy(_x, _x2) {
        return _ref3.apply(this, arguments);
      }

      return _destroy;
    }()
  }]);

  return Resource;
}();

exports.default = Resource;