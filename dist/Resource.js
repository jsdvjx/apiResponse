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
    var _this = this;

    _classCallCheck(this, Resource);

    this.itemInclude = function () {
      var _result = {};
      if (_this.include !== undefined && _this.include.length) {
        _this.include.forEach(function (include) {
          _result[include.type] = include.item;
        });
      }
      return Object.keys(_result).length ? _result : null;
    };

    this._create = false;
    this.resource = resource;
    this._copy = JSON.parse(JSON.stringify(resource.attributes));
    this.setRequest(request);
    this.requestConfig = {};
    if (resource.attributes.id !== undefined && resource.attributes.id instanceof Number) (0, _Cache2.default)(this.resource.type + '_' + this.resource.attributes.id, this.resource, 60);
    this.schema = _Schema2.default.get(this.resource.type);
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
      return this.resource.type;
    }

    /**
     * 获取资源内容
     */

  }, {
    key: 'getItem',
    value: function getItem() {
      return this.resource.attributes;
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
      var props = {};
      if (this.resource.include !== undefined && this.resource.include !== null) {
        this.include = this.resource.include.map(function (item) {
          return new Resource(item);
        });
      }
      var attributes = this.resource.attributes;
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
        });
      }
      return Object.defineProperties(this, props);
    }
  }, {
    key: 'destroy',
    value: function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
        var result;
        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return Resource._destroy(this.id, this.getType(), this.requestConfig);

              case 2:
                result = _context.sent;
                return _context.abrupt('return', result);

              case 4:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function destroy() {
        return _ref.apply(this, arguments);
      }

      return destroy;
    }()
  }, {
    key: 'save',
    value: function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee2() {
        var result, _result2;

        return _regenerator2.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                if (!this._create) {
                  _context2.next = 7;
                  break;
                }

                _context2.next = 3;
                return this.Request.post('' + this.type, this.item, this.requestConfig);

              case 3:
                result = _context2.sent;
                return _context2.abrupt('return', result);

              case 7:
                if (!this.change) {
                  _context2.next = 14;
                  break;
                }

                _context2.next = 10;
                return this.Request.patch(this.type + '/' + this.id, this.changePart, this.requestConfig);

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
        }, _callee2, this);
      }));

      function save() {
        return _ref2.apply(this, arguments);
      }

      return save;
    }()
  }, {
    key: 'item',
    get: function get() {
      var include = this.itemInclude();
      var props = {
        save: {
          get: function () {
            return this.save;
          }.bind(this)
        },
        destroy: {
          get: function () {
            return this.destroy;
          }.bind(this)
        }
      };
      if (include) {
        Object.keys(include).forEach(function (key) {
          props[key] = {
            get: function get() {
              return include[key];
            }
          };
        });
      }
      Object.defineProperties(this.resource.attributes, props);
      return this.resource.attributes;
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
        return this.item[key] !== this._copy[key];
      }.bind(this)).forEach(function (key) {
        ret[key] = this.item[key];
      }.bind(this));
      return ret;
    }
  }, {
    key: 'type',
    get: function get() {
      return this.resource.type;
    }
  }], [{
    key: 'create',
    value: function create(attributes, type) {
      var result = new Resource({ attributes: attributes, type: type }, null, true);
      result._create = true;
      return result;
    }
  }, {
    key: '_destroy',
    value: function () {
      var _ref3 = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee3(id, target) {
        var config = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
        var result;
        return _regenerator2.default.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                if (!(id && target)) {
                  _context3.next = 7;
                  break;
                }

                _context3.next = 3;
                return this.Request.delete(target + '/' + id, config);

              case 3:
                result = _context3.sent;
                return _context3.abrupt('return', result);

              case 7:
                throw new Error('Resource._destroy params error');

              case 8:
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