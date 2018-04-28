'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = CreateUpload;

var _qiniuJs = require('qiniu-js');

var qiniu = _interopRequireWildcard(_qiniuJs);

var _Utility = require('./Utility');

var _Cache = require('./Cache');

var _Cache2 = _interopRequireDefault(_Cache);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function getToken(Request) {
  return new Promise(function (resolve, reject) {
    var token = (0, _Cache2.default)('QINIU_TOKEN');
    if (token !== null) {
      resolve(token);
    } else {
      Request.Model('QiniuTokens').create({}).then(function (response) {
        (0, _Cache2.default)('QINIU_TOKEN', response.getItem(), response.getItem().expires - 100);
        resolve(response.getItem());
      }).catch(function (error) {
        reject(error);
      });
    }
  });
}

function getFileTempName(file) {
  if (file instanceof File) {
    var _tmp = file.name.match(/.+\.(.+)/);
    if (_tmp.length >= 2 && _tmp[1].length >= 2) {
      return (0, _Utility.guid)() + '.' + _tmp[1];
    } else {
      return false;
    }
  }
  return false;
}

function CreateUpload(config) {
  return function (options) {
    getToken(config.request).then(function (value) {
      var file = options.file;
      var remoteName = getFileTempName(file);
      var ob = qiniu.upload(file, remoteName, value.token, {
        fname: file.name,
        params: {},
        mimeType: null // 七牛程序员有病，给[]数组的时候会被替换为AAAA导致上传出错
      }, {
        useCdnDomain: true,
        region: null
      });
      ob.subscribe(function (res) {
        res.total.percent = Math.ceil(res.total.percent);
        options.onProgress(res.total);
      }, function (error) {
        options.onError(error);
      }, function (res) {
        res.url = config.url + '/' + remoteName;
        res.fname = file.name;
        options.onSuccess(res);
      });
    });
  };
}