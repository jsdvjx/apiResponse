import { getType, guid } from './Utility'
import Schema from './Schema'
// import ApiResponse from './ApiResponse'
// import EVENT from './Event'
import Resource from './Resource'
import ApiResponse from './ApiResponse'

export default class QueryBuilder {
  constructor (axiosInstance, target) {
    this.axiosInstance = axiosInstance
    this.target = target
    this.params = {}
    this.handle = guid()
    this.config = {}
    this.result = []
    this.schema = Schema.get(target) ? Schema.get(target) : {}
    this.setWith()
  }
  setWith = () => {
    let props = {}
    if (this.schema.withes) {
      this.schema.withes.forEach((withName) => {
        props[withName] = {
          get () {
            return function (params) {
              return this._fun(withName, params)
            }
          }
        }
      })
      Object.defineProperties(this, props)
    }
  }
  get = async (id) => {
    let result = null
    try {
      result = await this.axiosInstance.get(`${this.target}/${id}`, {...this.config})
    } catch (e) {
      // HttpErrorHandle(e)
    }
    return result.list[0]
  }
  filter = (params) => {
    return this._fun('filter', params)
  }
  field = (params) => {
    return this._fun('field', params)
  }
  sort = (params) => {
    return this._fun('sort', [params])
  }
  page = (page, limit) => {
    return this._fun('page', [page, limit])
  }
  include = (params) => {
    return this._fun('include', params)
  }
  makeQueryString = (destroy = false) => {
    let result = Object.keys(this.params).map((key) => {
      let val = this.params[key]
      switch (key) {
        case 'field':
          return `filter=${val.join(';')}`
        case 'include':
          return `with=${val.join(';')}`
        case 'sort':
          val = val[0]
          if (val === null) return false
          if (val[0] === '-') {
            let field = val.substr(1)
            let sort = 'desc'
            return `sortedBy=${sort}&orderBy=${field}`
          } else {
            return `sortedBy=asc&orderBy=${val}`
          }
        case 'page':// 取最后两个值
          return `page=${val[val.length - 2]}&limit=${val[val.length - 1]}`
        case 'filter':
          // TODO::需要实现查询操作符
          return this._filter('search', val)
        default:
          if (this.schema.withes && this.schema.withes.indexOf(key) >= 0) {
            return this._filter(key, val, '=')
          }
          return false
      }
    }).filter(b => b).join('&')
    if (destroy) {
      this.params = {}
    }
    return result
  }
  _filter = (query, val, opreation = 'like') => {
    return `${query}=` + val.map((f) => {
      return `${f.field}:${f.value}`
    }).join(';') + `&${query}Fields=` + val.map((f) => {
      if (f.opreation) {
        return `${f.field}:${f.opreation}`
      } else {
        return `${f.field}:${opreation}`
      }
    }).join(';') + `&${query}Join=and`
  }
  create = async (data) => {
    // TODO 添加数据验证
    let result = await Resource.create(data, this.target, this.axiosInstance).save()
    if (result.list[0] !== undefined) {
      return result.list[0]
    } else {
      return result
    }
  }
  makeResource = (data = null) => {
    return Resource.create(data, this.target, this.axiosInstance)
  }
  destroy = async (id) => {
    let result = await Resource._destroy(id, this.target)
    return result
  }
  fetch = async () => {
    let url = `${this.target}?` + this.makeQueryString()
    // console.log(url)
    // EVENT.$emit('HTTP_GET', url)
    let result = await this.axiosInstance.get(url, {...this.config})
    this.result.push(result)
    this.setResultRequestConfig()
    return result
  }
  setResultRequestConfig = () => {
    this.result.forEach((res) => {
      if (res instanceof ApiResponse) {
        res.list.forEach((_res) => {
          _res.setRequestConfig(this.config)
        })
      } else if (res instanceof Resource) {
        res.setRequestConfig(this.config)
      }
    })
  }
  setRequestConfig = (config) => {
    this.config = {...this.config, ...config}
    this.setResultRequestConfig()
  }
  _fun = (name, params) => {
    let type = getType(params)
    if (type === 'array') {
      if (name === 'filter') {
        params.forEach((item) => {
          let index = -1
          this.params[name] = this.params[name] === undefined ? [] : this.params[name]
          if (this.params[name].filter((_item, idx) => {
            let ret = _item.field === item.field
            if (ret) index = idx
            return ret
          }).length && index > 0) {
            this.params[name][index] = item
          } else {
            this.params[name].push(item)
          }
        })
      } else {
        this.params[name] = params
      }
    } else {
      throw new Error(`QueryBuilder.${name} aceept Array but ${type} given`)
    }
    return this
  }
}
