'use strict';

exports.getType = function (obj) {
  var tmp = Object.prototype.toString.call(obj);
  return (/^\[object (.+)\]$/i.exec(tmp)[1].toLowerCase()
  );
};
exports.guid = function () {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0;
    var v = c === 'x' ? r : r & 0x3 | 0x8;
    return v.toString(16);
  });
};