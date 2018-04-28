import Cache from './Cache'
import Schema from './Schema'

class Resource {
  constructor (resource, request) {
    this._create = false
    this.resource = resource
    this._copy = JSON.parse(JSON.stringify(resource.attributes))
    this.setRequest(request)
    this.requestConfig = {}
    if (resource.attributes.id !== undefined && resource.attributes.id instanceof Number) Cache(`${this.resource.type}_${this.resource.attributes.id}`, this.resource, 60)
    this.schema = Schema.get(this.resource.type)
    this._resolve()
  }

  setRequest (request) {
    this.Request = request
  }

  /**
   * 获取资源类型
   */
  getType () {
    return this.resource.type
  }

  /**
   * 获取资源内容
   */
  getItem () {
    return this.resource.attributes
  }

  setRequestConfig (config) {
    this.requestConfig = {...this.requestConfig, ...config}
  }

  /**
   * 解析资源建立getter，setter
   */
  _resolve () {
    let props = {}
    if (this.resource.include !== undefined && this.resource.include !== null) {
      this.include = this.resource.include.map((item) => {
        return new Resource(item,this.request)
      })
    }
    let attributes = this.resource.attributes
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
      })
    }
    return Object.defineProperties(this, props)
  }

  static create (attributes, type) {
    let result = new Resource({attributes, type}, null, true)
    result._create = true
    return result
  }

  static async _destroy (id, target, config = {}) {
    if (id && target) {
      let result = await this.Request.delete(`${target}/${id}`, config)
      return result
    } else {
      throw new Error('Resource._destroy params error')
    }
  }

  async destroy () {
    let result = await Resource._destroy(this.id, this.getType(), this.requestConfig)
    return result
  }

  async save () {
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
        _result[include.type] = include.item
      })
    }
    return Object.keys(_result).length ? _result : null
  }

  get item () {
    let include = this.itemInclude()
    let props = {
      save: {
        get: function () {
          return this.save
        }.bind(this)
      },
      destroy: {
        get: function () {
          return this.destroy
        }.bind(this)
      }
    }
    if (include) {
      Object.keys(include).forEach((key) => {
        props[key] = {
          get () {
            return include[key]
          }
        }
      })
    }
    Object.defineProperties(this.resource.attributes, props)
    return this.resource.attributes
  }

  get change () {
    return Object.keys(this._copy).filter(function (key) {
      return this.item[key] !== this._copy[key]
    }.bind(this)).length > 0
  }

  get changePart () {
    let ret = {}
    Object.keys(this._copy).filter(function (key) {
      return this.item[key] !== this._copy[key]
    }.bind(this)).forEach(function (key) {
      ret[key] = this.item[key]
    }.bind(this))
    return ret
  }

  get type () {
    return this.resource.type
  }
}

export default Resource
