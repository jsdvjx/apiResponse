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
  /*
  window.onerror = function (error) {
    console.log(error)
  } */
  request.interceptors.request.use(function (config) {
    if (config.Loading) {
      config.LoadingClose = config.Loading();
      // delete config.Loading
    }
    return config;
  }, function (error) {
    return Promise.reject(error);
  });
  request.interceptors.response.use(function (response) {
    // 对响应数据做点什么
    response.config.LoadingClose && response.config.LoadingClose.close();
    delete response.config.LoadingClose;
    return new _ApiResponse2.default(response.data, request);
    // return response.data
  }, function (error) {
    error.config.LoadingClose && error.config.LoadingClose.close();
    delete error.config.LoadingClose;
    return Promise.reject(error);
  });
  Object.defineProperties(request, {
    New: {
      value: function value(name) {
        return new _QueryBuilder2.default(request, name);
      }
    },
    Model: {
      value: function value(name) {
        if (Models[name]) return Models[name];else {
          Models[name] = new _QueryBuilder2.default(request, name);
          return Models[name];
        }
      }
    }
  });
  return request;
}