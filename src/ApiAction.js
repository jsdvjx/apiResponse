import Cache from './Cache'

function getKey (typename) {
  return `ACTION_${typename}`
}

export default class {
  static get (typename) {
    return Cache(getKey(typename))
  }

  static add (typename, map) {
    return Cache(getKey(typename), map)
  }
}
