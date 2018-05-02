import Cache from './Cache'
import Schema from './Schema'

class Resource {
  constructor (resource, request) {
    this.setRequest(request)
    this._create = false
    this._resource = resource
    this._copy = JSON.parse(JSON.stringify(resource.attributes))
    this.requestConfig = {}
    if (resource.attributes.id !== undefined && resource.attributes.id instanceof Number) Cache(`${this._resource.type}_${this._resource.attributes.id}`, this._resource, 60)
    this.schema = Schema.get(this._resource.type)
    this.schema = this.schema ? this.schema : {}
    this._resolve()
  }

  setRequest (request) {
    this.Request = request
  }

  /**
   * 获取资源类型
   */
  getType () {
    return this._resource.type
  }

  /**
   * 获取资源内容
   */
  getItem () {
    return this._resource.attributes
  }

  setRequestConfig (config) {
    this.requestConfig = {...this.requestConfig, ...config}
    if (this.include) {
      this.include.forEach((_include) => {
        _include.setRequestConfig(config)
      })
    }
  }

  /**
   * 解析资源建立getter，setter
   */
  _resolve () {
    let props = {}
    if (this._resource.include !== undefined && this._resource.include !== null) {
      this.include = this._resource.include.map((item) => {
        return new Resource(item, this.Request)
      })
    }
    let attributes = this._resource.attributes
    Object.keys(attributes).forEach((key) => {
      props[key] = {
        get () {
          return attributes[key]
        },
        set (value) {
          attributes[key] = value
        }
      }
    })
    if (this.schema) {
      this.schema.withes !== null && this.schema.withes.forEach(function (includeName) {
        props[includeName] = {
          get () {
            let _tmp = (this.include !== undefined && this.include.length) && this.include.filter(function (_include) {
              return _include.type === includeName
            })
            return _tmp.length ? _tmp[0].item : null
          }
        }
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
      })
    }
    return Object.defineProperties(this, props)
  }

  static create (attributes, type, request) {
    if (attributes === null) {
      let _schema = Schema.get(type).map
      let _attrs = {}
      let _filter = ['created_at', 'updated_at', 'id']
      Object.keys(_schema).forEach(function (field) {
        if (_filter.indexOf(field) < 0) _attrs[field] = null
      })
      let result = new Resource({attributes: _attrs, type}, request)
      result._create = true
      return result
    } else {
      let result = new Resource({attributes, type}, request)
      result._create = true
      return result
    }
  }

  static async _destroy (id, target, config = {}) {
    /*
    if (id && target) {
      let result = await this.Request.delete(`${target}/${id}`, config)
      return result
    } else {
      throw new Error('Resource._destroy params error')
    }*/
  }

  destroy = async () => {
    console.log(this.Request)
    let result = await this.Request.delete(`${this.getType()}/${this.id}`, this.requestConfig)
    return result
  }

  save = async () => {
    if (this._create) {
      let result = await this.Request.post(`${this.type}`, this.item, this.requestConfig)
      return result
    } else {
      if (this.change) {
        let result = await this.Request.patch(`${this.type}/${this.id}`, this.changePart, this.requestConfig)
        return result
      } else {
        return false
      }
    }
  }

  itemInclude = () => {
    let _result = {}
    if ((this.include !== undefined && this.include.length)) {
      this.include.forEach(function (include) {
        if (_result[include.type] === undefined) _result[include.type] = []
        _result[include.type].push(include.item)
      })
    }
    return Object.keys(_result).length ? _result : null
  }

  get item () {
    let _this = this
    if (this._resource.attributes._binding) {
      return this._resource.attributes
    }
    let include = this.itemInclude()
    let props = {
      _binding: {
        get: function () {
          return true
        }
      },
      _save: {
        get: function () {
          return _this.save
        }
      },
      _destroy: {
        get: function () {
          return _this.destroy
        }
      }
    }
    if (include) {
      Object.keys(include).forEach((key) => {
        props[key] = {
          get () {
            return include[key][0]
          }
        }
        props[`${key}Items`] = {
          get () {
            return include[key]
          }
        }
      })
    }
    Object.defineProperties(this._resource.attributes, props)
    return this._resource.attributes
  }

  get change () {
    return Object.keys(this._copy).filter(function (key) {
      return this.item[key] !== this._copy[key]
    }.bind(this)).length > 0
  }

  get changePart () {
    let ret = {}
    Object.keys(this._copy).filter(function (key) {
      return this.item[key] !== null && this.item[key] !== this._copy[key]
    }.bind(this)).forEach(function (key) {
      ret[key] = this.item[key]
    }.bind(this))
    return ret
  }

  get type () {
    return this._resource.type
  }
}

export default Resource
