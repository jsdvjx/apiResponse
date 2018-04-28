import Resource from './Resource'
import ApiAction from './ApiAction'
import Schema from './Schema'

export default class ApiResponse {
  constructor (response, request) {
    this.response = response
    this.request = request
    this.resolve()
  }

  resolve () {
    if (this.response.actions && this.response.data.length > 0) {
      ApiAction.add(this.response.data[0].type, this.response.actions)
    }
    this.list = this.response.data.map((item) => {
      return new Resource(item, this.request)
    })
    Schema.set(this.response.schemas)
  }

  get pagination () {
    return this.response.pagination
  }

  getItems () {
    return this.list.map(resource => resource.getItem())
  }

  get items () {
    return this.list.map(resource => resource.item)
  }
}
