function getInternalType(value) {
  return Object.prototype.toString.apply(value);
}

const Type = {
  isSymbol: function(value) {
    return typeof x === 'symbol';
  },

  isAtom: function(value) {
    return !Type.isSymbol(value) && ((typeof value !== 'object' || value === null) &&
      typeof value !== 'function') ||
      Type.isBoolean(value) || Type.isNumber(value) || Type.isString(value);
  },

  isRegExp: function(value) {
    return (value.constructor.name === "RegExp" || value instanceof RegExp);
  },

  isNumber: function(value) {
    return (typeof value === 'number' || value instanceof Number) && !isNaN(value);
  },

  isString: function(value) {
    return typeof value === 'string' || value instanceof String;
  },

  isBoolean: function(value) {
    return value !== null &&
      (typeof value === 'boolean' || value instanceof Boolean);
  },

  isArray: function(value) {
    return Array.isArray(value);
  },

  isObject: function(value) {
    return getInternalType(value) === '[object Object]';
  },

  isFunction: function(value) {
    return typeof value === 'function';
  },

  isDefined: function(value) {
    return typeof value !== 'undefined';
  }
};

export default Type;
