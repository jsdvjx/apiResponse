import * as qiniu from 'qiniu-js'
import { guid } from './Utility'
import Cache from './Cache'

function getToken (Request) {
  return new Promise(function (resolve, reject) {
    let token = Cache('QINIU_TOKEN')
    if (token !== null) {
      resolve(token)
    } else {
      Request.Model('QiniuTokens').create({}).then(function (response) {
        Cache('QINIU_TOKEN', response.getItem(), response.getItem().expires - 100)
        resolve(response.getItem())
      }).catch(function (error) {
        reject(error)
      })
    }
  })
}

function getFileTempName (file) {
  if (file instanceof File) {
    let _tmp = file.name.match(/.+\.(.+)/)
    if (_tmp.length >= 2 && _tmp[1].length >= 2) {
      return guid() + '.' + _tmp[1]
    } else {
      return false
    }
  }
  return false
}

export default function CreateUpload (config) {
  return (function (options) {
    getToken(config.request).then(function (value) {
      let file = options.file
      let remoteName = getFileTempName(file)
      let ob = qiniu.upload(file, remoteName, value.token, {
        fname: file.name,
        params: {},
        mimeType: null// 七牛程序员有病，给[]数组的时候会被替换为AAAA导致上传出错
      }, {
        useCdnDomain: true,
        region: null
      })
      ob.subscribe(function (res) {
        res.total.percent = Math.ceil(res.total.percent)
        options.onProgress(res.total)
      }, function (error) {
        options.onError(error)
      }, function (res) {
        res.url = `${config.url}/${remoteName}`
        res.fname = file.name
        options.onSuccess(res)
      })
    })
  })
}

