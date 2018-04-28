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

function get(key) {
  return getCacheValue(localStorage.getItem(key));
}

function set(key, value, expire) {
  return localStorage.setItem(key, makeCacheValue(value, expire));
}

function remove(key) {
  return localStorage.removeItem(key);
}