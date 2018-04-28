"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (key) {
  var value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  var expire = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

  switch (value) {
    case false:
      return get(key);
    case null:
      return remove(key);
    default:
      return set(key, value, expire);
  }
};

function makeCacheValue(value) {
  var expire = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

  expire = expire === 0 ? null : Math.ceil(new Date().valueOf() / 1000) + expire;
  return JSON.stringify({ value: value, expire: expire });
}

function getCacheValue(cache) {
  if (cache === null) return null;
  cache = JSON.parse(cache);
  if (cache.expire === null) return cache.value;
  var now = new Date() / 1000;
  if (now > cache.expire) {
    return null;
  } else {
    return cache.value;
  }
}

/**
 *获取缓存
 * @param {string} key 键名
 */
function get(key) {
  // TODO:过期时间未封装
  return getCacheValue(localStorage.getItem(key));
}

/**
 * 设置缓存
 * @param {string} key 键名
 * @param {any} value 值
 * @param {number} expire 过期时间
 */
function set(key, value, expire) {
  // TODO:过期时间未封装
  return localStorage.setItem(key, makeCacheValue(value, expire));
}

/**
 *删除缓存
 * @param {string} key 键名
 */
function remove(key) {
  return localStorage.removeItem(key);
}

/**
 * Cache
 * 缓存函数,未完成过期时间的封装
 * @param {string} key 键名
 * @param {boolean|null|any} value 值
 * @param {number} expire 过期时间
 */