import axios from 'axios'
import QueryBuilder from './QueryBuilder'
import ApiResponse from './ApiResponse'


const Models = {}
export default function CreateRequest (axiosConfig) {
  let request = axios.create(axiosConfig)
  /*
  window.onerror = function (error) {
    console.log(error)
  } */
  request.interceptors.request.use(function (config) {
    if (config.Loading) {
      config.LoadingClose = config.Loading()
      // delete config.Loading
    }
    return config
  }, function (error) {
    return Promise.reject(error)
  })
  request.interceptors.response.use(function (response) {
    // 对响应数据做点什么
    response.config.LoadingClose && response.config.LoadingClose.close()
    delete response.config.LoadingClose
    return new ApiResponse(response.data)
    // return response.data
  }, function (error) {
    error.config.LoadingClose && error.config.LoadingClose.close()
    delete error.config.LoadingClose
    return Promise.reject(error)
  })
  return new Proxy(request, {
    get: function (target, key, receiver) {
      if (key === 'New') {
        return function (rName) {
          return new QueryBuilder(target, rName)
        }
      }
      if (Models[key] !== undefined) {
        return Models[key]
      }
      if (Reflect.get(target, key, receiver) === undefined) {
        let qb = new QueryBuilder(target, key)
        Models[key] = qb
        return qb
      } else {
        return Reflect.get(target, key, receiver)
      }
    }
  })
}