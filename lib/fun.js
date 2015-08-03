import Match from './match';

/**
 * @preserve jFun - JavaScript Pattern Matching v0.12
 *
 * Licensed under the new BSD License.
 * Copyright 2008, Bram Stein
 * All rights reserved.
 */
let fun = (function() {

  return function() {
    let patterns = Array.prototype.slice.call(arguments, 0).map(function(value, i) {
      let len = value.length;
      return {
        pattern: Match.buildMatch(value.slice(0, len - 1)),
        fn: value[len - 1]
      };
    });

    return function() {
      let value = Array.prototype.slice.call(arguments, 0),
        result = [],
        i = 0,
        len = patterns.length;

      for (; i < len; i += 1) {
        if (patterns[i].pattern(value, result)) {
          return patterns[i].fn.apply(this, result);
        }
        result = [];
      }
      // no matches were made so we throw an exception.
      throw 'No match for: ' + value;
    };
  };
}());

/**
 * Parameter
 */
fun.parameter = function(name, orElse) {
  function Parameter(n, o) {
    this.name = n;
    this.orElse = o;
  }
  return new Parameter(name, orElse);
};

fun.wildcard = (function() {
  function Wildcard() {
  }
  return new Wildcard();
}());

export default fun;
