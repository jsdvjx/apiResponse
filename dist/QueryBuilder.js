'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _Utility = require('./Utility');

var _Resource = require('./Resource');

var _Resource2 = _interopRequireDefault(_Resource);

var _ApiResponse = require('./ApiResponse');

var _ApiResponse2 = _interopRequireDefault(_ApiResponse);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
// import ApiResponse from './ApiResponse'
// import EVENT from './Event'


var QueryBuilder = function QueryBuilder(axiosInstance, target) {
  var _this = this;

  _classCallCheck(this, QueryBuilder);

  this.get = function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee(id) {
      var result;
      return _regenerator2.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              result = null;
              _context.prev = 1;
              _context.next = 4;
              return _this.axiosInstance.get(_this.target + '/' + id, _extends({}, _this.config));

            case 4:
              result = _context.sent;
              _context.next = 9;
              break;

            case 7:
              _context.prev = 7;
              _context.t0 = _context['catch'](1);

            case 9:
              return _context.abrupt('return', result.list[0]);

            case 10:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, _this, [[1, 7]]);
    }));

    return function (_x) {
      return _ref.apply(this, arguments);
    };
  }();

  this.filter = function (params) {
    return _this._fun('filter', params);
  };

  this.field = function (params) {
    return _this._fun('field', params);
  };

  this.sort = function (params) {
    return _this._fun('sort', [params]);
  };

  this.page = function (page, limit) {
    return _this._fun('page', [page, limit]);
  };

  this.include = function (params) {
    return _this._fun('include', params);
  };

  this.makeQueryString = function () {
    var destroy = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

    var result = Object.keys(_this.params).map(function (key) {
      var val = _this.params[key];
      switch (key) {
        case 'field':
          return 'filter=' + val.join(';');
        case 'include':
          return 'with=' + val.join(';');
        case 'sort':
          val = val[0];
          if (val === null) return false;
          if (val[0] === '-') {
            var field = val.substr(1);
            var sort = 'desc';
            return 'sortedBy=' + sort + '&orderBy=' + field;
          } else {
            return 'sortedBy=asc&orderBy=' + val;
          }
        case 'page':
          // 取最后两个值
          return 'page=' + val[val.length - 2] + '&limit=' + val[val.length - 1];
        case 'filter':
          // TODO::需要实现查询操作符
          return 'search=' + val.map(function (f) {
            return f.field + ':' + f.value;
          }).join(';') + '&searchFields=' + val.map(function (f) {
            if (f.opreation) {
              return f.field + ':' + f.opreation;
            } else {
              return f.field + ':like';
            }
          }).join(';') + '&searchJoin=and';
        default:
          return false;
      }
    }).filter(function (b) {
      return b;
    }).join('&');
    if (destroy) {
      _this.params = {};
    }
    return result;
  };

  this.create = function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee2(data) {
      var result;
      return _regenerator2.default.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return _Resource2.default.create(data, _this.target, _this.axiosInstance).save();

            case 2:
              result = _context2.sent;

              if (!(result.list[0] !== undefined)) {
                _context2.next = 7;
                break;
              }

              return _context2.abrupt('return', result.list[0]);

            case 7:
              return _context2.abrupt('return', result);

            case 8:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, _this);
    }));

    return function (_x3) {
      return _ref2.apply(this, arguments);
    };
  }();

  this.makeResource = function () {
    var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

    return _Resource2.default.create(data, _this.target, _this.axiosInstance);
  };

  this.destroy = function () {
    var _ref3 = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee3(id) {
      var result;
      return _regenerator2.default.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.next = 2;
              return _Resource2.default._destroy(id, _this.target);

            case 2:
              result = _context3.sent;
              return _context3.abrupt('return', result);

            case 4:
            case 'end':
              return _context3.stop();
          }
        }
      }, _callee3, _this);
    }));

    return function (_x5) {
      return _ref3.apply(this, arguments);
    };
  }();

  this.fetch = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee4() {
    var url, result;
    return _regenerator2.default.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            url = _this.target + '?' + _this.makeQueryString();
            // console.log(url)
            // EVENT.$emit('HTTP_GET', url)

            _context4.next = 3;
            return _this.axiosInstance.get(url, _extends({}, _this.config));

          case 3:
            result = _context4.sent;

            _this.result.push(result);
            _this.setResultRequestConfig();
            return _context4.abrupt('return', result);

          case 7:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, _this);
  }));

  this.setResultRequestConfig = function () {
    _this.result.forEach(function (res) {
      if (res instanceof _ApiResponse2.default) {
        res.list.forEach(function (_res) {
          _res.setRequestConfig(_this.config);
        });
      } else if (res instanceof _Resource2.default) {
        res.setRequestConfig(_this.config);
      }
    });
  };

  this.setRequestConfig = function (config) {
    _this.config = _extends({}, _this.config, config);
    _this.setResultRequestConfig();
  };

  this._fun = function (name, params) {
    var type = (0, _Utility.getType)(params);
    if (type === 'array') {
      if (name === 'filter') {
        params.forEach(function (item) {
          var index = -1;
          _this.params[name] = _this.params[name] === undefined ? [] : _this.params[name];
          if (_this.params[name].filter(function (_item, idx) {
            var ret = _item.field === item.field;
            if (ret) index = idx;
            return ret;
          }).length && index > 0) {
            _this.params[name][index] = item;
          } else {
            _this.params[name].push(item);
          }
        });
      } else {
        _this.params[name] = params;
      }
    } else {
      throw new Error('QueryBuilder.' + name + ' aceept Array but ' + type + ' given');
    }
    return _this;
  };

  this.axiosInstance = axiosInstance;
  this.target = target;
  this.params = {};
  this.handle = (0, _Utility.guid)();
  this.config = {};
  this.result = [];
};

exports.default = QueryBuilder;