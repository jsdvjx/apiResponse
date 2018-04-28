function makeCacheValue (value, expire = 0) {
  expire = expire === 0 ? null : (Math.ceil((new Date()).valueOf() / 1000) + expire)
  return JSON.stringify({value, expire})
}

function getCacheValue (cache) {
  if (cache === null) return null
  cache = JSON.parse(cache)
  if (cache.expire === null) return cache.value
  let now = (new Date()) / 1000
  if (now > cache.expire) {
    return null
  } else {
    return cache.value
  }
}

/**
 *获取缓存
 * @param {string} key 键名
 */
function get (key) {
  // TODO:过期时间未封装
  return getCacheValue(localStorage.getItem(key))
}

/**
 * 设置缓存
 * @param {string} key 键名
 * @param {any} value 值
 * @param {number} expire 过期时间
 */
function set (key, value, expire) {
  // TODO:过期时间未封装
  return localStorage.setItem(key, makeCacheValue(value, expire))
}

/**
 *删除缓存
 * @param {string} key 键名
 */
function remove (key) {
  return localStorage.removeItem(key)
}

/**
 * Cache
 * 缓存函数,未完成过期时间的封装
 * @param {string} key 键名
 * @param {boolean|null|any} value 值
 * @param {number} expire 过期时间
 */
export default function (key, value = false, expire = 0) {
  switch (value) {
    case false:
      return get(key)
    case null:
      return remove(key)
    default:
      return set(key, value, expire)
  }
}
