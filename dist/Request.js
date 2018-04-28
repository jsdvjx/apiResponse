'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = CreateRequest;

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

var _QueryBuilder = require('./QueryBuilder');

var _QueryBuilder2 = _interopRequireDefault(_QueryBuilder);

var _ApiResponse = require('./ApiResponse');

var _ApiResponse2 = _interopRequireDefault(_ApiResponse);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Models = {};
function CreateRequest(axiosConfig) {
  var request = _axios2.default.create(axiosConfig);

  request.interceptors.request.use(function (config) {
    if (config.Loading) {
      config.LoadingClose = config.Loading();
    }
    return config;
  }, function (error) {
    return Promise.reject(error);
  });
  request.interceptors.response.use(function (response) {
    response.config.LoadingClose && response.config.LoadingClose.close();
    delete response.config.LoadingClose;
    return new _ApiResponse2.default(response.data);
  }, function (error) {
    error.config.LoadingClose && error.config.LoadingClose.close();
    delete error.config.LoadingClose;
    return Promise.reject(error);
  });
  return new Proxy(request, {
    get: function get(target, key, receiver) {
      if (key === 'New') {
        return function (rName) {
          return new _QueryBuilder2.default(target, rName);
        };
      }
      if (Models[key] !== undefined) {
        return Models[key];
      }
      if (Reflect.get(target, key, receiver) === undefined) {
        var qb = new _QueryBuilder2.default(target, key);
        Models[key] = qb;
        return qb;
      } else {
        return Reflect.get(target, key, receiver);
      }
    }
  });
}