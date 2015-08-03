import Type from './type';
import fun from './fun';
import object from './object';

function buildMatch(pattern) {
  // A parameter can either be a function, or the result of invoking that
  // function so we need to check for both.
  if (pattern && (pattern === fun.parameter || pattern.constructor.name === fun.parameter().constructor.name)) {
    return function(value, bindings) {
      return bindings.push(value) > 0;
    };
  } else if (pattern && pattern.constructor === fun.wildcard.constructor) {
    return function() {
      return true;
    };
  } else if (Type.isAtom(pattern)) {
    return matchAtom(pattern);
  } else if (Type.isRegExp(pattern)) {
    return matchRegExp(pattern);
  } else if (Type.isObject(pattern)) {
    return matchObject(pattern);
  } else if (Type.isArray(pattern)) {
    return matchArray(pattern);
  } else if (Type.isFunction(pattern)) {
    return matchFunction(pattern);
  } else if (Type.isSymbol(pattern)) {
    return matchSymbol(pattern);
  }
}

function matchSymbol(patternSymbol) {
  console.log("here");
  let type = typeof patternSymbol,
    value = patternSymbol;

  return function(valueSymbol, bindings) {
    return (typeof valueSymbol === type && valueSymbol === value);
  };
}

function matchAtom(patternAtom) {
  let type = typeof patternAtom,
    value = patternAtom;

  return function(valueAtom, bindings) {
    return (typeof valueAtom === type && valueAtom === value) ||
      (typeof value === 'number' && isNaN(valueAtom) && isNaN(value));
  };
}

function matchRegExp(patternRegExp) {
  return function(value, bindings) {
    return !(typeof value === undefined) && typeof value === 'string' && patternRegExp.test(value);
  };
}

function matchFunction(patternFunction) {
  return function(value, bindings) {
    return value.constructor === patternFunction &&
      bindings.push(value) > 0;
  };
}

function matchArray(patternArray) {
  let patternLength = patternArray.length,
    subMatches = patternArray.map(function(value) {
      return buildMatch(value);
    });

  return function(valueArray, bindings) {
    return patternLength === valueArray.length &&
      valueArray.every(function(value, i) {
        return (i in subMatches) && subMatches[i](valueArray[i], bindings);
      });
  };
}

function matchObject(patternObject) {
  let type = patternObject.constructor,
    patternLength = 0,
    // Figure out the number of properties in the object
    // and the keys we need to check for. We put these
    // in another object so access is very fast. The build_match
    // function creates new subtests which we execute later.
    subMatches = object.map(patternObject, function(value) {
      patternLength += 1;
      return buildMatch(value);
    });

  // We then return a function which uses that information
  // to check against the object passed to it.
  return function(valueObject, bindings) {
    let valueLength = 0;

    // Checking the object type is very fast so we do it first.
    // Then we iterate through the value object and check the keys
    // it contains against the hash object we built earlier.
    // We also count the number of keys in the value object,
    // so we can also test against it as a final check.
    return valueObject.constructor === type &&
      object.every(valueObject, function(value, key) {
        valueLength += 1;
        return (key in subMatches) && subMatches[key](valueObject[key], bindings);
      }) &&
      valueLength === patternLength;
  };
}


export default {
  buildMatch
};
