webpackJsonp([1],{

/***/ "./node_modules/es5-shim/es5-sham.js":
/*!*******************************************!*\
  !*** ./node_modules/es5-shim/es5-sham.js ***!
  \*******************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
 * https://github.com/es-shims/es5-shim
 * @license es5-shim Copyright 2009-2015 by contributors, MIT License
 * see https://github.com/es-shims/es5-shim/blob/master/LICENSE
 */

// vim: ts=4 sts=4 sw=4 expandtab

// Add semicolon to prevent IIFE from being passed as argument to concatenated code.
;

// UMD (Universal Module Definition)
// see https://github.com/umdjs/umd/blob/master/templates/returnExports.js
(function (root, factory) {
    'use strict';

    /* global define, exports, module */
    if (true) {
        // AMD. Register as an anonymous module.
        !(__WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :
				__WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
    } else if (typeof exports === 'object') {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like enviroments that support module.exports,
        // like Node.
        module.exports = factory();
    } else {
        // Browser globals (root is window)
        root.returnExports = factory();
    }
}(this, function () {

    var call = Function.call;
    var prototypeOfObject = Object.prototype;
    var owns = call.bind(prototypeOfObject.hasOwnProperty);
    var isEnumerable = call.bind(prototypeOfObject.propertyIsEnumerable);
    var toStr = call.bind(prototypeOfObject.toString);

    // If JS engine supports accessors creating shortcuts.
    var defineGetter;
    var defineSetter;
    var lookupGetter;
    var lookupSetter;
    var supportsAccessors = owns(prototypeOfObject, '__defineGetter__');
    if (supportsAccessors) {
        /* eslint-disable no-underscore-dangle, no-restricted-properties */
        defineGetter = call.bind(prototypeOfObject.__defineGetter__);
        defineSetter = call.bind(prototypeOfObject.__defineSetter__);
        lookupGetter = call.bind(prototypeOfObject.__lookupGetter__);
        lookupSetter = call.bind(prototypeOfObject.__lookupSetter__);
        /* eslint-enable no-underscore-dangle, no-restricted-properties */
    }

    var isPrimitive = function isPrimitive(o) {
        return o == null || (typeof o !== 'object' && typeof o !== 'function');
    };

    // ES5 15.2.3.2
    // http://es5.github.com/#x15.2.3.2
    if (!Object.getPrototypeOf) {
        // https://github.com/es-shims/es5-shim/issues#issue/2
        // http://ejohn.org/blog/objectgetprototypeof/
        // recommended by fschaefer on github
        //
        // sure, and webreflection says ^_^
        // ... this will nerever possibly return null
        // ... Opera Mini breaks here with infinite loops
        Object.getPrototypeOf = function getPrototypeOf(object) {
            // eslint-disable-next-line no-proto
            var proto = object.__proto__;
            if (proto || proto === null) {
                return proto;
            } else if (toStr(object.constructor) === '[object Function]') {
                return object.constructor.prototype;
            } else if (object instanceof Object) {
                return prototypeOfObject;
            } else {
                // Correctly return null for Objects created with `Object.create(null)`
                // (shammed or native) or `{ __proto__: null}`.  Also returns null for
                // cross-realm objects on browsers that lack `__proto__` support (like
                // IE <11), but that's the best we can do.
                return null;
            }
        };
    }

    // ES5 15.2.3.3
    // http://es5.github.com/#x15.2.3.3

    var doesGetOwnPropertyDescriptorWork = function doesGetOwnPropertyDescriptorWork(object) {
        try {
            object.sentinel = 0;
            return Object.getOwnPropertyDescriptor(object, 'sentinel').value === 0;
        } catch (exception) {
            return false;
        }
    };

    // check whether getOwnPropertyDescriptor works if it's given. Otherwise, shim partially.
    if (Object.defineProperty) {
        var getOwnPropertyDescriptorWorksOnObject = doesGetOwnPropertyDescriptorWork({});
        var getOwnPropertyDescriptorWorksOnDom = typeof document === 'undefined'
            || doesGetOwnPropertyDescriptorWork(document.createElement('div'));
        if (!getOwnPropertyDescriptorWorksOnDom || !getOwnPropertyDescriptorWorksOnObject) {
            var getOwnPropertyDescriptorFallback = Object.getOwnPropertyDescriptor;
        }
    }

    if (!Object.getOwnPropertyDescriptor || getOwnPropertyDescriptorFallback) {
        var ERR_NON_OBJECT = 'Object.getOwnPropertyDescriptor called on a non-object: ';

        /* eslint-disable no-proto */
        Object.getOwnPropertyDescriptor = function getOwnPropertyDescriptor(object, property) {
            if (isPrimitive(object)) {
                throw new TypeError(ERR_NON_OBJECT + object);
            }

            // make a valiant attempt to use the real getOwnPropertyDescriptor
            // for I8's DOM elements.
            if (getOwnPropertyDescriptorFallback) {
                try {
                    return getOwnPropertyDescriptorFallback.call(Object, object, property);
                } catch (exception) {
                    // try the shim if the real one doesn't work
                }
            }

            var descriptor;

            // If object does not owns property return undefined immediately.
            if (!owns(object, property)) {
                return descriptor;
            }

            // If object has a property then it's for sure `configurable`, and
            // probably `enumerable`. Detect enumerability though.
            descriptor = {
                enumerable: isEnumerable(object, property),
                configurable: true
            };

            // If JS engine supports accessor properties then property may be a
            // getter or setter.
            if (supportsAccessors) {
                // Unfortunately `__lookupGetter__` will return a getter even
                // if object has own non getter property along with a same named
                // inherited getter. To avoid misbehavior we temporary remove
                // `__proto__` so that `__lookupGetter__` will return getter only
                // if it's owned by an object.
                var prototype = object.__proto__;
                var notPrototypeOfObject = object !== prototypeOfObject;
                // avoid recursion problem, breaking in Opera Mini when
                // Object.getOwnPropertyDescriptor(Object.prototype, 'toString')
                // or any other Object.prototype accessor
                if (notPrototypeOfObject) {
                    object.__proto__ = prototypeOfObject;
                }

                var getter = lookupGetter(object, property);
                var setter = lookupSetter(object, property);

                if (notPrototypeOfObject) {
                    // Once we have getter and setter we can put values back.
                    object.__proto__ = prototype;
                }

                if (getter || setter) {
                    if (getter) {
                        descriptor.get = getter;
                    }
                    if (setter) {
                        descriptor.set = setter;
                    }
                    // If it was accessor property we're done and return here
                    // in order to avoid adding `value` to the descriptor.
                    return descriptor;
                }
            }

            // If we got this far we know that object has an own property that is
            // not an accessor so we set it as a value and return descriptor.
            descriptor.value = object[property];
            descriptor.writable = true;
            return descriptor;
        };
        /* eslint-enable no-proto */
    }

    // ES5 15.2.3.4
    // http://es5.github.com/#x15.2.3.4
    if (!Object.getOwnPropertyNames) {
        Object.getOwnPropertyNames = function getOwnPropertyNames(object) {
            return Object.keys(object);
        };
    }

    // ES5 15.2.3.5
    // http://es5.github.com/#x15.2.3.5
    if (!Object.create) {

        // Contributed by Brandon Benvie, October, 2012
        var createEmpty;
        var supportsProto = !({ __proto__: null } instanceof Object);
        // the following produces false positives
        // in Opera Mini => not a reliable check
        // Object.prototype.__proto__ === null

        // Check for document.domain and active x support
        // No need to use active x approach when document.domain is not set
        // see https://github.com/es-shims/es5-shim/issues/150
        // variation of https://github.com/kitcambridge/es5-shim/commit/4f738ac066346
        /* global ActiveXObject */
        var shouldUseActiveX = function shouldUseActiveX() {
            // return early if document.domain not set
            if (!document.domain) {
                return false;
            }

            try {
                return !!new ActiveXObject('htmlfile');
            } catch (exception) {
                return false;
            }
        };

        // This supports IE8 when document.domain is used
        // see https://github.com/es-shims/es5-shim/issues/150
        // variation of https://github.com/kitcambridge/es5-shim/commit/4f738ac066346
        var getEmptyViaActiveX = function getEmptyViaActiveX() {
            var empty;
            var xDoc;

            xDoc = new ActiveXObject('htmlfile');

            var script = 'script';
            xDoc.write('<' + script + '></' + script + '>');
            xDoc.close();

            empty = xDoc.parentWindow.Object.prototype;
            xDoc = null;

            return empty;
        };

        // The original implementation using an iframe
        // before the activex approach was added
        // see https://github.com/es-shims/es5-shim/issues/150
        var getEmptyViaIFrame = function getEmptyViaIFrame() {
            var iframe = document.createElement('iframe');
            var parent = document.body || document.documentElement;
            var empty;

            iframe.style.display = 'none';
            parent.appendChild(iframe);
            // eslint-disable-next-line no-script-url
            iframe.src = 'javascript:';

            empty = iframe.contentWindow.Object.prototype;
            parent.removeChild(iframe);
            iframe = null;

            return empty;
        };

        /* global document */
        if (supportsProto || typeof document === 'undefined') {
            createEmpty = function () {
                return { __proto__: null };
            };
        } else {
            // In old IE __proto__ can't be used to manually set `null`, nor does
            // any other method exist to make an object that inherits from nothing,
            // aside from Object.prototype itself. Instead, create a new global
            // object and *steal* its Object.prototype and strip it bare. This is
            // used as the prototype to create nullary objects.
            createEmpty = function () {
                // Determine which approach to use
                // see https://github.com/es-shims/es5-shim/issues/150
                var empty = shouldUseActiveX() ? getEmptyViaActiveX() : getEmptyViaIFrame();

                delete empty.constructor;
                delete empty.hasOwnProperty;
                delete empty.propertyIsEnumerable;
                delete empty.isPrototypeOf;
                delete empty.toLocaleString;
                delete empty.toString;
                delete empty.valueOf;

                var Empty = function Empty() {};
                Empty.prototype = empty;
                // short-circuit future calls
                createEmpty = function () {
                    return new Empty();
                };
                return new Empty();
            };
        }

        Object.create = function create(prototype, properties) {

            var object;
            var Type = function Type() {}; // An empty constructor.

            if (prototype === null) {
                object = createEmpty();
            } else {
                if (prototype !== null && isPrimitive(prototype)) {
                    // In the native implementation `parent` can be `null`
                    // OR *any* `instanceof Object`  (Object|Function|Array|RegExp|etc)
                    // Use `typeof` tho, b/c in old IE, DOM elements are not `instanceof Object`
                    // like they are in modern browsers. Using `Object.create` on DOM elements
                    // is...err...probably inappropriate, but the native version allows for it.
                    throw new TypeError('Object prototype may only be an Object or null'); // same msg as Chrome
                }
                Type.prototype = prototype;
                object = new Type();
                // IE has no built-in implementation of `Object.getPrototypeOf`
                // neither `__proto__`, but this manually setting `__proto__` will
                // guarantee that `Object.getPrototypeOf` will work as expected with
                // objects created using `Object.create`
                // eslint-disable-next-line no-proto
                object.__proto__ = prototype;
            }

            if (properties !== void 0) {
                Object.defineProperties(object, properties);
            }

            return object;
        };
    }

    // ES5 15.2.3.6
    // http://es5.github.com/#x15.2.3.6

    // Patch for WebKit and IE8 standard mode
    // Designed by hax <hax.github.com>
    // related issue: https://github.com/es-shims/es5-shim/issues#issue/5
    // IE8 Reference:
    //     http://msdn.microsoft.com/en-us/library/dd282900.aspx
    //     http://msdn.microsoft.com/en-us/library/dd229916.aspx
    // WebKit Bugs:
    //     https://bugs.webkit.org/show_bug.cgi?id=36423

    var doesDefinePropertyWork = function doesDefinePropertyWork(object) {
        try {
            Object.defineProperty(object, 'sentinel', {});
            return 'sentinel' in object;
        } catch (exception) {
            return false;
        }
    };

    // check whether defineProperty works if it's given. Otherwise,
    // shim partially.
    if (Object.defineProperty) {
        var definePropertyWorksOnObject = doesDefinePropertyWork({});
        var definePropertyWorksOnDom = typeof document === 'undefined'
            || doesDefinePropertyWork(document.createElement('div'));
        if (!definePropertyWorksOnObject || !definePropertyWorksOnDom) {
            var definePropertyFallback = Object.defineProperty,
                definePropertiesFallback = Object.defineProperties;
        }
    }

    if (!Object.defineProperty || definePropertyFallback) {
        var ERR_NON_OBJECT_DESCRIPTOR = 'Property description must be an object: ';
        var ERR_NON_OBJECT_TARGET = 'Object.defineProperty called on non-object: ';
        var ERR_ACCESSORS_NOT_SUPPORTED = 'getters & setters can not be defined on this javascript engine';

        Object.defineProperty = function defineProperty(object, property, descriptor) {
            if (isPrimitive(object)) {
                throw new TypeError(ERR_NON_OBJECT_TARGET + object);
            }
            if (isPrimitive(descriptor)) {
                throw new TypeError(ERR_NON_OBJECT_DESCRIPTOR + descriptor);
            }
            // make a valiant attempt to use the real defineProperty
            // for I8's DOM elements.
            if (definePropertyFallback) {
                try {
                    return definePropertyFallback.call(Object, object, property, descriptor);
                } catch (exception) {
                    // try the shim if the real one doesn't work
                }
            }

            // If it's a data property.
            if ('value' in descriptor) {
                // fail silently if 'writable', 'enumerable', or 'configurable'
                // are requested but not supported
                /*
                // alternate approach:
                if ( // can't implement these features; allow false but not true
                    ('writable' in descriptor && !descriptor.writable) ||
                    ('enumerable' in descriptor && !descriptor.enumerable) ||
                    ('configurable' in descriptor && !descriptor.configurable)
                ))
                    throw new RangeError(
                        'This implementation of Object.defineProperty does not support configurable, enumerable, or writable.'
                    );
                */

                if (supportsAccessors && (lookupGetter(object, property) || lookupSetter(object, property))) {
                    // As accessors are supported only on engines implementing
                    // `__proto__` we can safely override `__proto__` while defining
                    // a property to make sure that we don't hit an inherited
                    // accessor.
                    /* eslint-disable no-proto */
                    var prototype = object.__proto__;
                    object.__proto__ = prototypeOfObject;
                    // Deleting a property anyway since getter / setter may be
                    // defined on object itself.
                    delete object[property];
                    object[property] = descriptor.value;
                    // Setting original `__proto__` back now.
                    object.__proto__ = prototype;
                    /* eslint-enable no-proto */
                } else {
                    object[property] = descriptor.value;
                }
            } else {
                var hasGetter = 'get' in descriptor;
                var hasSetter = 'set' in descriptor;
                if (!supportsAccessors && (hasGetter || hasSetter)) {
                    throw new TypeError(ERR_ACCESSORS_NOT_SUPPORTED);
                }
                // If we got that far then getters and setters can be defined !!
                if (hasGetter) {
                    defineGetter(object, property, descriptor.get);
                }
                if (hasSetter) {
                    defineSetter(object, property, descriptor.set);
                }
            }
            return object;
        };
    }

    // ES5 15.2.3.7
    // http://es5.github.com/#x15.2.3.7
    if (!Object.defineProperties || definePropertiesFallback) {
        Object.defineProperties = function defineProperties(object, properties) {
            // make a valiant attempt to use the real defineProperties
            if (definePropertiesFallback) {
                try {
                    return definePropertiesFallback.call(Object, object, properties);
                } catch (exception) {
                    // try the shim if the real one doesn't work
                }
            }

            Object.keys(properties).forEach(function (property) {
                if (property !== '__proto__') {
                    Object.defineProperty(object, property, properties[property]);
                }
            });
            return object;
        };
    }

    // ES5 15.2.3.8
    // http://es5.github.com/#x15.2.3.8
    if (!Object.seal) {
        Object.seal = function seal(object) {
            if (Object(object) !== object) {
                throw new TypeError('Object.seal can only be called on Objects.');
            }
            // this is misleading and breaks feature-detection, but
            // allows "securable" code to "gracefully" degrade to working
            // but insecure code.
            return object;
        };
    }

    // ES5 15.2.3.9
    // http://es5.github.com/#x15.2.3.9
    if (!Object.freeze) {
        Object.freeze = function freeze(object) {
            if (Object(object) !== object) {
                throw new TypeError('Object.freeze can only be called on Objects.');
            }
            // this is misleading and breaks feature-detection, but
            // allows "securable" code to "gracefully" degrade to working
            // but insecure code.
            return object;
        };
    }

    // detect a Rhino bug and patch it
    try {
        Object.freeze(function () {});
    } catch (exception) {
        Object.freeze = (function (freezeObject) {
            return function freeze(object) {
                if (typeof object === 'function') {
                    return object;
                } else {
                    return freezeObject(object);
                }
            };
        }(Object.freeze));
    }

    // ES5 15.2.3.10
    // http://es5.github.com/#x15.2.3.10
    if (!Object.preventExtensions) {
        Object.preventExtensions = function preventExtensions(object) {
            if (Object(object) !== object) {
                throw new TypeError('Object.preventExtensions can only be called on Objects.');
            }
            // this is misleading and breaks feature-detection, but
            // allows "securable" code to "gracefully" degrade to working
            // but insecure code.
            return object;
        };
    }

    // ES5 15.2.3.11
    // http://es5.github.com/#x15.2.3.11
    if (!Object.isSealed) {
        Object.isSealed = function isSealed(object) {
            if (Object(object) !== object) {
                throw new TypeError('Object.isSealed can only be called on Objects.');
            }
            return false;
        };
    }

    // ES5 15.2.3.12
    // http://es5.github.com/#x15.2.3.12
    if (!Object.isFrozen) {
        Object.isFrozen = function isFrozen(object) {
            if (Object(object) !== object) {
                throw new TypeError('Object.isFrozen can only be called on Objects.');
            }
            return false;
        };
    }

    // ES5 15.2.3.13
    // http://es5.github.com/#x15.2.3.13
    if (!Object.isExtensible) {
        Object.isExtensible = function isExtensible(object) {
            // 1. If Type(O) is not Object throw a TypeError exception.
            if (Object(object) !== object) {
                throw new TypeError('Object.isExtensible can only be called on Objects.');
            }
            // 2. Return the Boolean value of the [[Extensible]] internal property of O.
            var name = '';
            while (owns(object, name)) {
                name += '?';
            }
            object[name] = true;
            var returnValue = owns(object, name);
            delete object[name];
            return returnValue;
        };
    }

}));


/***/ }),

/***/ "./node_modules/es5-shim/es5-shim.js":
/*!*******************************************!*\
  !*** ./node_modules/es5-shim/es5-shim.js ***!
  \*******************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
 * https://github.com/es-shims/es5-shim
 * @license es5-shim Copyright 2009-2015 by contributors, MIT License
 * see https://github.com/es-shims/es5-shim/blob/master/LICENSE
 */

// vim: ts=4 sts=4 sw=4 expandtab

// Add semicolon to prevent IIFE from being passed as argument to concatenated code.
;

// UMD (Universal Module Definition)
// see https://github.com/umdjs/umd/blob/master/templates/returnExports.js
(function (root, factory) {
    'use strict';

    /* global define, exports, module */
    if (true) {
        // AMD. Register as an anonymous module.
        !(__WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :
				__WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
    } else if (typeof exports === 'object') {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like enviroments that support module.exports,
        // like Node.
        module.exports = factory();
    } else {
        // Browser globals (root is window)
        root.returnExports = factory();
    }
}(this, function () {
    /**
     * Brings an environment as close to ECMAScript 5 compliance
     * as is possible with the facilities of erstwhile engines.
     *
     * Annotated ES5: http://es5.github.com/ (specific links below)
     * ES5 Spec: http://www.ecma-international.org/publications/files/ECMA-ST/Ecma-262.pdf
     * Required reading: http://javascriptweblog.wordpress.com/2011/12/05/extending-javascript-natives/
     */

    // Shortcut to an often accessed properties, in order to avoid multiple
    // dereference that costs universally. This also holds a reference to known-good
    // functions.
    var $Array = Array;
    var ArrayPrototype = $Array.prototype;
    var $Object = Object;
    var ObjectPrototype = $Object.prototype;
    var $Function = Function;
    var FunctionPrototype = $Function.prototype;
    var $String = String;
    var StringPrototype = $String.prototype;
    var $Number = Number;
    var NumberPrototype = $Number.prototype;
    var array_slice = ArrayPrototype.slice;
    var array_splice = ArrayPrototype.splice;
    var array_push = ArrayPrototype.push;
    var array_unshift = ArrayPrototype.unshift;
    var array_concat = ArrayPrototype.concat;
    var array_join = ArrayPrototype.join;
    var call = FunctionPrototype.call;
    var apply = FunctionPrototype.apply;
    var max = Math.max;
    var min = Math.min;

    // Having a toString local variable name breaks in Opera so use to_string.
    var to_string = ObjectPrototype.toString;

    /* global Symbol */
    /* eslint-disable one-var-declaration-per-line, no-redeclare, max-statements-per-line */
    var hasToStringTag = typeof Symbol === 'function' && typeof Symbol.toStringTag === 'symbol';
    var isCallable; /* inlined from https://npmjs.com/is-callable */ var fnToStr = Function.prototype.toString, constructorRegex = /^\s*class /, isES6ClassFn = function isES6ClassFn(value) { try { var fnStr = fnToStr.call(value); var singleStripped = fnStr.replace(/\/\/.*\n/g, ''); var multiStripped = singleStripped.replace(/\/\*[.\s\S]*\*\//g, ''); var spaceStripped = multiStripped.replace(/\n/mg, ' ').replace(/ {2}/g, ' '); return constructorRegex.test(spaceStripped); } catch (e) { return false; /* not a function */ } }, tryFunctionObject = function tryFunctionObject(value) { try { if (isES6ClassFn(value)) { return false; } fnToStr.call(value); return true; } catch (e) { return false; } }, fnClass = '[object Function]', genClass = '[object GeneratorFunction]', isCallable = function isCallable(value) { if (!value) { return false; } if (typeof value !== 'function' && typeof value !== 'object') { return false; } if (hasToStringTag) { return tryFunctionObject(value); } if (isES6ClassFn(value)) { return false; } var strClass = to_string.call(value); return strClass === fnClass || strClass === genClass; };

    var isRegex; /* inlined from https://npmjs.com/is-regex */ var regexExec = RegExp.prototype.exec, tryRegexExec = function tryRegexExec(value) { try { regexExec.call(value); return true; } catch (e) { return false; } }, regexClass = '[object RegExp]'; isRegex = function isRegex(value) { if (typeof value !== 'object') { return false; } return hasToStringTag ? tryRegexExec(value) : to_string.call(value) === regexClass; };
    var isString; /* inlined from https://npmjs.com/is-string */ var strValue = String.prototype.valueOf, tryStringObject = function tryStringObject(value) { try { strValue.call(value); return true; } catch (e) { return false; } }, stringClass = '[object String]'; isString = function isString(value) { if (typeof value === 'string') { return true; } if (typeof value !== 'object') { return false; } return hasToStringTag ? tryStringObject(value) : to_string.call(value) === stringClass; };
    /* eslint-enable one-var-declaration-per-line, no-redeclare, max-statements-per-line */

    /* inlined from http://npmjs.com/define-properties */
    var supportsDescriptors = $Object.defineProperty && (function () {
        try {
            var obj = {};
            $Object.defineProperty(obj, 'x', { enumerable: false, value: obj });
            for (var _ in obj) { // jscs:ignore disallowUnusedVariables
                return false;
            }
            return obj.x === obj;
        } catch (e) { /* this is ES3 */
            return false;
        }
    }());
    var defineProperties = (function (has) {
        // Define configurable, writable, and non-enumerable props
        // if they don't exist.
        var defineProperty;
        if (supportsDescriptors) {
            defineProperty = function (object, name, method, forceAssign) {
                if (!forceAssign && (name in object)) {
                    return;
                }
                $Object.defineProperty(object, name, {
                    configurable: true,
                    enumerable: false,
                    writable: true,
                    value: method
                });
            };
        } else {
            defineProperty = function (object, name, method, forceAssign) {
                if (!forceAssign && (name in object)) {
                    return;
                }
                object[name] = method;
            };
        }
        return function defineProperties(object, map, forceAssign) {
            for (var name in map) {
                if (has.call(map, name)) {
                    defineProperty(object, name, map[name], forceAssign);
                }
            }
        };
    }(ObjectPrototype.hasOwnProperty));

    //
    // Util
    // ======
    //

    /* replaceable with https://npmjs.com/package/es-abstract /helpers/isPrimitive */
    var isPrimitive = function isPrimitive(input) {
        var type = typeof input;
        return input === null || (type !== 'object' && type !== 'function');
    };

    var isActualNaN = $Number.isNaN || function isActualNaN(x) {
        return x !== x;
    };

    var ES = {
        // ES5 9.4
        // http://es5.github.com/#x9.4
        // http://jsperf.com/to-integer
        /* replaceable with https://npmjs.com/package/es-abstract ES5.ToInteger */
        ToInteger: function ToInteger(num) {
            var n = +num;
            if (isActualNaN(n)) {
                n = 0;
            } else if (n !== 0 && n !== (1 / 0) && n !== -(1 / 0)) {
                n = (n > 0 || -1) * Math.floor(Math.abs(n));
            }
            return n;
        },

        /* replaceable with https://npmjs.com/package/es-abstract ES5.ToPrimitive */
        ToPrimitive: function ToPrimitive(input) {
            var val, valueOf, toStr;
            if (isPrimitive(input)) {
                return input;
            }
            valueOf = input.valueOf;
            if (isCallable(valueOf)) {
                val = valueOf.call(input);
                if (isPrimitive(val)) {
                    return val;
                }
            }
            toStr = input.toString;
            if (isCallable(toStr)) {
                val = toStr.call(input);
                if (isPrimitive(val)) {
                    return val;
                }
            }
            throw new TypeError();
        },

        // ES5 9.9
        // http://es5.github.com/#x9.9
        /* replaceable with https://npmjs.com/package/es-abstract ES5.ToObject */
        ToObject: function (o) {
            if (o == null) { // this matches both null and undefined
                throw new TypeError("can't convert " + o + ' to object');
            }
            return $Object(o);
        },

        /* replaceable with https://npmjs.com/package/es-abstract ES5.ToUint32 */
        ToUint32: function ToUint32(x) {
            return x >>> 0;
        }
    };

    //
    // Function
    // ========
    //

    // ES-5 15.3.4.5
    // http://es5.github.com/#x15.3.4.5

    var Empty = function Empty() {};

    defineProperties(FunctionPrototype, {
        bind: function bind(that) { // .length is 1
            // 1. Let Target be the this value.
            var target = this;
            // 2. If IsCallable(Target) is false, throw a TypeError exception.
            if (!isCallable(target)) {
                throw new TypeError('Function.prototype.bind called on incompatible ' + target);
            }
            // 3. Let A be a new (possibly empty) internal list of all of the
            //   argument values provided after thisArg (arg1, arg2 etc), in order.
            // XXX slicedArgs will stand in for "A" if used
            var args = array_slice.call(arguments, 1); // for normal call
            // 4. Let F be a new native ECMAScript object.
            // 11. Set the [[Prototype]] internal property of F to the standard
            //   built-in Function prototype object as specified in 15.3.3.1.
            // 12. Set the [[Call]] internal property of F as described in
            //   15.3.4.5.1.
            // 13. Set the [[Construct]] internal property of F as described in
            //   15.3.4.5.2.
            // 14. Set the [[HasInstance]] internal property of F as described in
            //   15.3.4.5.3.
            var bound;
            var binder = function () {

                if (this instanceof bound) {
                    // 15.3.4.5.2 [[Construct]]
                    // When the [[Construct]] internal method of a function object,
                    // F that was created using the bind function is called with a
                    // list of arguments ExtraArgs, the following steps are taken:
                    // 1. Let target be the value of F's [[TargetFunction]]
                    //   internal property.
                    // 2. If target has no [[Construct]] internal method, a
                    //   TypeError exception is thrown.
                    // 3. Let boundArgs be the value of F's [[BoundArgs]] internal
                    //   property.
                    // 4. Let args be a new list containing the same values as the
                    //   list boundArgs in the same order followed by the same
                    //   values as the list ExtraArgs in the same order.
                    // 5. Return the result of calling the [[Construct]] internal
                    //   method of target providing args as the arguments.

                    var result = apply.call(
                        target,
                        this,
                        array_concat.call(args, array_slice.call(arguments))
                    );
                    if ($Object(result) === result) {
                        return result;
                    }
                    return this;

                } else {
                    // 15.3.4.5.1 [[Call]]
                    // When the [[Call]] internal method of a function object, F,
                    // which was created using the bind function is called with a
                    // this value and a list of arguments ExtraArgs, the following
                    // steps are taken:
                    // 1. Let boundArgs be the value of F's [[BoundArgs]] internal
                    //   property.
                    // 2. Let boundThis be the value of F's [[BoundThis]] internal
                    //   property.
                    // 3. Let target be the value of F's [[TargetFunction]] internal
                    //   property.
                    // 4. Let args be a new list containing the same values as the
                    //   list boundArgs in the same order followed by the same
                    //   values as the list ExtraArgs in the same order.
                    // 5. Return the result of calling the [[Call]] internal method
                    //   of target providing boundThis as the this value and
                    //   providing args as the arguments.

                    // equiv: target.call(this, ...boundArgs, ...args)
                    return apply.call(
                        target,
                        that,
                        array_concat.call(args, array_slice.call(arguments))
                    );

                }

            };

            // 15. If the [[Class]] internal property of Target is "Function", then
            //     a. Let L be the length property of Target minus the length of A.
            //     b. Set the length own property of F to either 0 or L, whichever is
            //       larger.
            // 16. Else set the length own property of F to 0.

            var boundLength = max(0, target.length - args.length);

            // 17. Set the attributes of the length own property of F to the values
            //   specified in 15.3.5.1.
            var boundArgs = [];
            for (var i = 0; i < boundLength; i++) {
                array_push.call(boundArgs, '$' + i);
            }

            // XXX Build a dynamic function with desired amount of arguments is the only
            // way to set the length property of a function.
            // In environments where Content Security Policies enabled (Chrome extensions,
            // for ex.) all use of eval or Function costructor throws an exception.
            // However in all of these environments Function.prototype.bind exists
            // and so this code will never be executed.
            bound = $Function('binder', 'return function (' + array_join.call(boundArgs, ',') + '){ return binder.apply(this, arguments); }')(binder);

            if (target.prototype) {
                Empty.prototype = target.prototype;
                bound.prototype = new Empty();
                // Clean up dangling references.
                Empty.prototype = null;
            }

            // TODO
            // 18. Set the [[Extensible]] internal property of F to true.

            // TODO
            // 19. Let thrower be the [[ThrowTypeError]] function Object (13.2.3).
            // 20. Call the [[DefineOwnProperty]] internal method of F with
            //   arguments "caller", PropertyDescriptor {[[Get]]: thrower, [[Set]]:
            //   thrower, [[Enumerable]]: false, [[Configurable]]: false}, and
            //   false.
            // 21. Call the [[DefineOwnProperty]] internal method of F with
            //   arguments "arguments", PropertyDescriptor {[[Get]]: thrower,
            //   [[Set]]: thrower, [[Enumerable]]: false, [[Configurable]]: false},
            //   and false.

            // TODO
            // NOTE Function objects created using Function.prototype.bind do not
            // have a prototype property or the [[Code]], [[FormalParameters]], and
            // [[Scope]] internal properties.
            // XXX can't delete prototype in pure-js.

            // 22. Return F.
            return bound;
        }
    });

    // _Please note: Shortcuts are defined after `Function.prototype.bind` as we
    // use it in defining shortcuts.
    var owns = call.bind(ObjectPrototype.hasOwnProperty);
    var toStr = call.bind(ObjectPrototype.toString);
    var arraySlice = call.bind(array_slice);
    var arraySliceApply = apply.bind(array_slice);
    /* globals document */
    if (typeof document === 'object' && document && document.documentElement) {
        try {
            arraySlice(document.documentElement.childNodes);
        } catch (e) {
            var origArraySlice = arraySlice;
            var origArraySliceApply = arraySliceApply;
            arraySlice = function arraySliceIE(arr) {
                var r = [];
                var i = arr.length;
                while (i-- > 0) {
                    r[i] = arr[i];
                }
                return origArraySliceApply(r, origArraySlice(arguments, 1));
            };
            arraySliceApply = function arraySliceApplyIE(arr, args) {
                return origArraySliceApply(arraySlice(arr), args);
            };
        }
    }
    var strSlice = call.bind(StringPrototype.slice);
    var strSplit = call.bind(StringPrototype.split);
    var strIndexOf = call.bind(StringPrototype.indexOf);
    var pushCall = call.bind(array_push);
    var isEnum = call.bind(ObjectPrototype.propertyIsEnumerable);
    var arraySort = call.bind(ArrayPrototype.sort);

    //
    // Array
    // =====
    //

    var isArray = $Array.isArray || function isArray(obj) {
        return toStr(obj) === '[object Array]';
    };

    // ES5 15.4.4.12
    // http://es5.github.com/#x15.4.4.13
    // Return len+argCount.
    // [bugfix, ielt8]
    // IE < 8 bug: [].unshift(0) === undefined but should be "1"
    var hasUnshiftReturnValueBug = [].unshift(0) !== 1;
    defineProperties(ArrayPrototype, {
        unshift: function () {
            array_unshift.apply(this, arguments);
            return this.length;
        }
    }, hasUnshiftReturnValueBug);

    // ES5 15.4.3.2
    // http://es5.github.com/#x15.4.3.2
    // https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/isArray
    defineProperties($Array, { isArray: isArray });

    // The IsCallable() check in the Array functions
    // has been replaced with a strict check on the
    // internal class of the object to trap cases where
    // the provided function was actually a regular
    // expression literal, which in V8 and
    // JavaScriptCore is a typeof "function".  Only in
    // V8 are regular expression literals permitted as
    // reduce parameters, so it is desirable in the
    // general case for the shim to match the more
    // strict and common behavior of rejecting regular
    // expressions.

    // ES5 15.4.4.18
    // http://es5.github.com/#x15.4.4.18
    // https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/array/forEach

    // Check failure of by-index access of string characters (IE < 9)
    // and failure of `0 in boxedString` (Rhino)
    var boxedString = $Object('a');
    var splitString = boxedString[0] !== 'a' || !(0 in boxedString);

    var properlyBoxesContext = function properlyBoxed(method) {
        // Check node 0.6.21 bug where third parameter is not boxed
        var properlyBoxesNonStrict = true;
        var properlyBoxesStrict = true;
        var threwException = false;
        if (method) {
            try {
                method.call('foo', function (_, __, context) {
                    if (typeof context !== 'object') {
                        properlyBoxesNonStrict = false;
                    }
                });

                method.call([1], function () {
                    'use strict';

                    properlyBoxesStrict = typeof this === 'string';
                }, 'x');
            } catch (e) {
                threwException = true;
            }
        }
        return !!method && !threwException && properlyBoxesNonStrict && properlyBoxesStrict;
    };

    defineProperties(ArrayPrototype, {
        forEach: function forEach(callbackfn/*, thisArg*/) {
            var object = ES.ToObject(this);
            var self = splitString && isString(this) ? strSplit(this, '') : object;
            var i = -1;
            var length = ES.ToUint32(self.length);
            var T;
            if (arguments.length > 1) {
                T = arguments[1];
            }

            // If no callback function or if callback is not a callable function
            if (!isCallable(callbackfn)) {
                throw new TypeError('Array.prototype.forEach callback must be a function');
            }

            while (++i < length) {
                if (i in self) {
                    // Invoke the callback function with call, passing arguments:
                    // context, property value, property key, thisArg object
                    if (typeof T === 'undefined') {
                        callbackfn(self[i], i, object);
                    } else {
                        callbackfn.call(T, self[i], i, object);
                    }
                }
            }
        }
    }, !properlyBoxesContext(ArrayPrototype.forEach));

    // ES5 15.4.4.19
    // http://es5.github.com/#x15.4.4.19
    // https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Objects/Array/map
    defineProperties(ArrayPrototype, {
        map: function map(callbackfn/*, thisArg*/) {
            var object = ES.ToObject(this);
            var self = splitString && isString(this) ? strSplit(this, '') : object;
            var length = ES.ToUint32(self.length);
            var result = $Array(length);
            var T;
            if (arguments.length > 1) {
                T = arguments[1];
            }

            // If no callback function or if callback is not a callable function
            if (!isCallable(callbackfn)) {
                throw new TypeError('Array.prototype.map callback must be a function');
            }

            for (var i = 0; i < length; i++) {
                if (i in self) {
                    if (typeof T === 'undefined') {
                        result[i] = callbackfn(self[i], i, object);
                    } else {
                        result[i] = callbackfn.call(T, self[i], i, object);
                    }
                }
            }
            return result;
        }
    }, !properlyBoxesContext(ArrayPrototype.map));

    // ES5 15.4.4.20
    // http://es5.github.com/#x15.4.4.20
    // https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Objects/Array/filter
    defineProperties(ArrayPrototype, {
        filter: function filter(callbackfn/*, thisArg*/) {
            var object = ES.ToObject(this);
            var self = splitString && isString(this) ? strSplit(this, '') : object;
            var length = ES.ToUint32(self.length);
            var result = [];
            var value;
            var T;
            if (arguments.length > 1) {
                T = arguments[1];
            }

            // If no callback function or if callback is not a callable function
            if (!isCallable(callbackfn)) {
                throw new TypeError('Array.prototype.filter callback must be a function');
            }

            for (var i = 0; i < length; i++) {
                if (i in self) {
                    value = self[i];
                    if (typeof T === 'undefined' ? callbackfn(value, i, object) : callbackfn.call(T, value, i, object)) {
                        pushCall(result, value);
                    }
                }
            }
            return result;
        }
    }, !properlyBoxesContext(ArrayPrototype.filter));

    // ES5 15.4.4.16
    // http://es5.github.com/#x15.4.4.16
    // https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/every
    defineProperties(ArrayPrototype, {
        every: function every(callbackfn/*, thisArg*/) {
            var object = ES.ToObject(this);
            var self = splitString && isString(this) ? strSplit(this, '') : object;
            var length = ES.ToUint32(self.length);
            var T;
            if (arguments.length > 1) {
                T = arguments[1];
            }

            // If no callback function or if callback is not a callable function
            if (!isCallable(callbackfn)) {
                throw new TypeError('Array.prototype.every callback must be a function');
            }

            for (var i = 0; i < length; i++) {
                if (i in self && !(typeof T === 'undefined' ? callbackfn(self[i], i, object) : callbackfn.call(T, self[i], i, object))) {
                    return false;
                }
            }
            return true;
        }
    }, !properlyBoxesContext(ArrayPrototype.every));

    // ES5 15.4.4.17
    // http://es5.github.com/#x15.4.4.17
    // https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/some
    defineProperties(ArrayPrototype, {
        some: function some(callbackfn/*, thisArg */) {
            var object = ES.ToObject(this);
            var self = splitString && isString(this) ? strSplit(this, '') : object;
            var length = ES.ToUint32(self.length);
            var T;
            if (arguments.length > 1) {
                T = arguments[1];
            }

            // If no callback function or if callback is not a callable function
            if (!isCallable(callbackfn)) {
                throw new TypeError('Array.prototype.some callback must be a function');
            }

            for (var i = 0; i < length; i++) {
                if (i in self && (typeof T === 'undefined' ? callbackfn(self[i], i, object) : callbackfn.call(T, self[i], i, object))) {
                    return true;
                }
            }
            return false;
        }
    }, !properlyBoxesContext(ArrayPrototype.some));

    // ES5 15.4.4.21
    // http://es5.github.com/#x15.4.4.21
    // https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Objects/Array/reduce
    var reduceCoercesToObject = false;
    if (ArrayPrototype.reduce) {
        reduceCoercesToObject = typeof ArrayPrototype.reduce.call('es5', function (_, __, ___, list) {
            return list;
        }) === 'object';
    }
    defineProperties(ArrayPrototype, {
        reduce: function reduce(callbackfn/*, initialValue*/) {
            var object = ES.ToObject(this);
            var self = splitString && isString(this) ? strSplit(this, '') : object;
            var length = ES.ToUint32(self.length);

            // If no callback function or if callback is not a callable function
            if (!isCallable(callbackfn)) {
                throw new TypeError('Array.prototype.reduce callback must be a function');
            }

            // no value to return if no initial value and an empty array
            if (length === 0 && arguments.length === 1) {
                throw new TypeError('reduce of empty array with no initial value');
            }

            var i = 0;
            var result;
            if (arguments.length >= 2) {
                result = arguments[1];
            } else {
                do {
                    if (i in self) {
                        result = self[i++];
                        break;
                    }

                    // if array contains no values, no initial value to return
                    if (++i >= length) {
                        throw new TypeError('reduce of empty array with no initial value');
                    }
                } while (true);
            }

            for (; i < length; i++) {
                if (i in self) {
                    result = callbackfn(result, self[i], i, object);
                }
            }

            return result;
        }
    }, !reduceCoercesToObject);

    // ES5 15.4.4.22
    // http://es5.github.com/#x15.4.4.22
    // https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Objects/Array/reduceRight
    var reduceRightCoercesToObject = false;
    if (ArrayPrototype.reduceRight) {
        reduceRightCoercesToObject = typeof ArrayPrototype.reduceRight.call('es5', function (_, __, ___, list) {
            return list;
        }) === 'object';
    }
    defineProperties(ArrayPrototype, {
        reduceRight: function reduceRight(callbackfn/*, initial*/) {
            var object = ES.ToObject(this);
            var self = splitString && isString(this) ? strSplit(this, '') : object;
            var length = ES.ToUint32(self.length);

            // If no callback function or if callback is not a callable function
            if (!isCallable(callbackfn)) {
                throw new TypeError('Array.prototype.reduceRight callback must be a function');
            }

            // no value to return if no initial value, empty array
            if (length === 0 && arguments.length === 1) {
                throw new TypeError('reduceRight of empty array with no initial value');
            }

            var result;
            var i = length - 1;
            if (arguments.length >= 2) {
                result = arguments[1];
            } else {
                do {
                    if (i in self) {
                        result = self[i--];
                        break;
                    }

                    // if array contains no values, no initial value to return
                    if (--i < 0) {
                        throw new TypeError('reduceRight of empty array with no initial value');
                    }
                } while (true);
            }

            if (i < 0) {
                return result;
            }

            do {
                if (i in self) {
                    result = callbackfn(result, self[i], i, object);
                }
            } while (i--);

            return result;
        }
    }, !reduceRightCoercesToObject);

    // ES5 15.4.4.14
    // http://es5.github.com/#x15.4.4.14
    // https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/indexOf
    var hasFirefox2IndexOfBug = ArrayPrototype.indexOf && [0, 1].indexOf(1, 2) !== -1;
    defineProperties(ArrayPrototype, {
        indexOf: function indexOf(searchElement/*, fromIndex */) {
            var self = splitString && isString(this) ? strSplit(this, '') : ES.ToObject(this);
            var length = ES.ToUint32(self.length);

            if (length === 0) {
                return -1;
            }

            var i = 0;
            if (arguments.length > 1) {
                i = ES.ToInteger(arguments[1]);
            }

            // handle negative indices
            i = i >= 0 ? i : max(0, length + i);
            for (; i < length; i++) {
                if (i in self && self[i] === searchElement) {
                    return i;
                }
            }
            return -1;
        }
    }, hasFirefox2IndexOfBug);

    // ES5 15.4.4.15
    // http://es5.github.com/#x15.4.4.15
    // https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/lastIndexOf
    var hasFirefox2LastIndexOfBug = ArrayPrototype.lastIndexOf && [0, 1].lastIndexOf(0, -3) !== -1;
    defineProperties(ArrayPrototype, {
        lastIndexOf: function lastIndexOf(searchElement/*, fromIndex */) {
            var self = splitString && isString(this) ? strSplit(this, '') : ES.ToObject(this);
            var length = ES.ToUint32(self.length);

            if (length === 0) {
                return -1;
            }
            var i = length - 1;
            if (arguments.length > 1) {
                i = min(i, ES.ToInteger(arguments[1]));
            }
            // handle negative indices
            i = i >= 0 ? i : length - Math.abs(i);
            for (; i >= 0; i--) {
                if (i in self && searchElement === self[i]) {
                    return i;
                }
            }
            return -1;
        }
    }, hasFirefox2LastIndexOfBug);

    // ES5 15.4.4.12
    // http://es5.github.com/#x15.4.4.12
    var spliceNoopReturnsEmptyArray = (function () {
        var a = [1, 2];
        var result = a.splice();
        return a.length === 2 && isArray(result) && result.length === 0;
    }());
    defineProperties(ArrayPrototype, {
        // Safari 5.0 bug where .splice() returns undefined
        splice: function splice(start, deleteCount) {
            if (arguments.length === 0) {
                return [];
            } else {
                return array_splice.apply(this, arguments);
            }
        }
    }, !spliceNoopReturnsEmptyArray);

    var spliceWorksWithEmptyObject = (function () {
        var obj = {};
        ArrayPrototype.splice.call(obj, 0, 0, 1);
        return obj.length === 1;
    }());
    defineProperties(ArrayPrototype, {
        splice: function splice(start, deleteCount) {
            if (arguments.length === 0) {
                return [];
            }
            var args = arguments;
            this.length = max(ES.ToInteger(this.length), 0);
            if (arguments.length > 0 && typeof deleteCount !== 'number') {
                args = arraySlice(arguments);
                if (args.length < 2) {
                    pushCall(args, this.length - start);
                } else {
                    args[1] = ES.ToInteger(deleteCount);
                }
            }
            return array_splice.apply(this, args);
        }
    }, !spliceWorksWithEmptyObject);
    var spliceWorksWithLargeSparseArrays = (function () {
        // Per https://github.com/es-shims/es5-shim/issues/295
        // Safari 7/8 breaks with sparse arrays of size 1e5 or greater
        var arr = new $Array(1e5);
        // note: the index MUST be 8 or larger or the test will false pass
        arr[8] = 'x';
        arr.splice(1, 1);
        // note: this test must be defined *after* the indexOf shim
        // per https://github.com/es-shims/es5-shim/issues/313
        return arr.indexOf('x') === 7;
    }());
    var spliceWorksWithSmallSparseArrays = (function () {
        // Per https://github.com/es-shims/es5-shim/issues/295
        // Opera 12.15 breaks on this, no idea why.
        var n = 256;
        var arr = [];
        arr[n] = 'a';
        arr.splice(n + 1, 0, 'b');
        return arr[n] === 'a';
    }());
    defineProperties(ArrayPrototype, {
        splice: function splice(start, deleteCount) {
            var O = ES.ToObject(this);
            var A = [];
            var len = ES.ToUint32(O.length);
            var relativeStart = ES.ToInteger(start);
            var actualStart = relativeStart < 0 ? max((len + relativeStart), 0) : min(relativeStart, len);
            var actualDeleteCount = min(max(ES.ToInteger(deleteCount), 0), len - actualStart);

            var k = 0;
            var from;
            while (k < actualDeleteCount) {
                from = $String(actualStart + k);
                if (owns(O, from)) {
                    A[k] = O[from];
                }
                k += 1;
            }

            var items = arraySlice(arguments, 2);
            var itemCount = items.length;
            var to;
            if (itemCount < actualDeleteCount) {
                k = actualStart;
                var maxK = len - actualDeleteCount;
                while (k < maxK) {
                    from = $String(k + actualDeleteCount);
                    to = $String(k + itemCount);
                    if (owns(O, from)) {
                        O[to] = O[from];
                    } else {
                        delete O[to];
                    }
                    k += 1;
                }
                k = len;
                var minK = len - actualDeleteCount + itemCount;
                while (k > minK) {
                    delete O[k - 1];
                    k -= 1;
                }
            } else if (itemCount > actualDeleteCount) {
                k = len - actualDeleteCount;
                while (k > actualStart) {
                    from = $String(k + actualDeleteCount - 1);
                    to = $String(k + itemCount - 1);
                    if (owns(O, from)) {
                        O[to] = O[from];
                    } else {
                        delete O[to];
                    }
                    k -= 1;
                }
            }
            k = actualStart;
            for (var i = 0; i < items.length; ++i) {
                O[k] = items[i];
                k += 1;
            }
            O.length = len - actualDeleteCount + itemCount;

            return A;
        }
    }, !spliceWorksWithLargeSparseArrays || !spliceWorksWithSmallSparseArrays);

    var originalJoin = ArrayPrototype.join;
    var hasStringJoinBug;
    try {
        hasStringJoinBug = Array.prototype.join.call('123', ',') !== '1,2,3';
    } catch (e) {
        hasStringJoinBug = true;
    }
    if (hasStringJoinBug) {
        defineProperties(ArrayPrototype, {
            join: function join(separator) {
                var sep = typeof separator === 'undefined' ? ',' : separator;
                return originalJoin.call(isString(this) ? strSplit(this, '') : this, sep);
            }
        }, hasStringJoinBug);
    }

    var hasJoinUndefinedBug = [1, 2].join(undefined) !== '1,2';
    if (hasJoinUndefinedBug) {
        defineProperties(ArrayPrototype, {
            join: function join(separator) {
                var sep = typeof separator === 'undefined' ? ',' : separator;
                return originalJoin.call(this, sep);
            }
        }, hasJoinUndefinedBug);
    }

    var pushShim = function push(item) {
        var O = ES.ToObject(this);
        var n = ES.ToUint32(O.length);
        var i = 0;
        while (i < arguments.length) {
            O[n + i] = arguments[i];
            i += 1;
        }
        O.length = n + i;
        return n + i;
    };

    var pushIsNotGeneric = (function () {
        var obj = {};
        var result = Array.prototype.push.call(obj, undefined);
        return result !== 1 || obj.length !== 1 || typeof obj[0] !== 'undefined' || !owns(obj, 0);
    }());
    defineProperties(ArrayPrototype, {
        push: function push(item) {
            if (isArray(this)) {
                return array_push.apply(this, arguments);
            }
            return pushShim.apply(this, arguments);
        }
    }, pushIsNotGeneric);

    // This fixes a very weird bug in Opera 10.6 when pushing `undefined
    var pushUndefinedIsWeird = (function () {
        var arr = [];
        var result = arr.push(undefined);
        return result !== 1 || arr.length !== 1 || typeof arr[0] !== 'undefined' || !owns(arr, 0);
    }());
    defineProperties(ArrayPrototype, { push: pushShim }, pushUndefinedIsWeird);

    // ES5 15.2.3.14
    // http://es5.github.io/#x15.4.4.10
    // Fix boxed string bug
    defineProperties(ArrayPrototype, {
        slice: function (start, end) {
            var arr = isString(this) ? strSplit(this, '') : this;
            return arraySliceApply(arr, arguments);
        }
    }, splitString);

    var sortIgnoresNonFunctions = (function () {
        try {
            [1, 2].sort(null);
        } catch (e) {
            try {
                [1, 2].sort({});
            } catch (e2) {
                return false;
            }
        }
        return true;
    }());
    var sortThrowsOnRegex = (function () {
        // this is a problem in Firefox 4, in which `typeof /a/ === 'function'`
        try {
            [1, 2].sort(/a/);
            return false;
        } catch (e) {}
        return true;
    }());
    var sortIgnoresUndefined = (function () {
        // applies in IE 8, for one.
        try {
            [1, 2].sort(undefined);
            return true;
        } catch (e) {}
        return false;
    }());
    defineProperties(ArrayPrototype, {
        sort: function sort(compareFn) {
            if (typeof compareFn === 'undefined') {
                return arraySort(this);
            }
            if (!isCallable(compareFn)) {
                throw new TypeError('Array.prototype.sort callback must be a function');
            }
            return arraySort(this, compareFn);
        }
    }, sortIgnoresNonFunctions || !sortIgnoresUndefined || !sortThrowsOnRegex);

    //
    // Object
    // ======
    //

    // ES5 15.2.3.14
    // http://es5.github.com/#x15.2.3.14

    // http://whattheheadsaid.com/2010/10/a-safer-object-keys-compatibility-implementation
    var hasDontEnumBug = !isEnum({ 'toString': null }, 'toString'); // jscs:ignore disallowQuotedKeysInObjects
    var hasProtoEnumBug = isEnum(function () {}, 'prototype');
    var hasStringEnumBug = !owns('x', '0');
    var equalsConstructorPrototype = function (o) {
        var ctor = o.constructor;
        return ctor && ctor.prototype === o;
    };
    var excludedKeys = {
        $window: true,
        $console: true,
        $parent: true,
        $self: true,
        $frame: true,
        $frames: true,
        $frameElement: true,
        $webkitIndexedDB: true,
        $webkitStorageInfo: true,
        $external: true,
        $width: true,
        $height: true,
        $top: true,
        $localStorage: true
    };
    var hasAutomationEqualityBug = (function () {
        /* globals window */
        if (typeof window === 'undefined') {
            return false;
        }
        for (var k in window) {
            try {
                if (!excludedKeys['$' + k] && owns(window, k) && window[k] !== null && typeof window[k] === 'object') {
                    equalsConstructorPrototype(window[k]);
                }
            } catch (e) {
                return true;
            }
        }
        return false;
    }());
    var equalsConstructorPrototypeIfNotBuggy = function (object) {
        if (typeof window === 'undefined' || !hasAutomationEqualityBug) {
            return equalsConstructorPrototype(object);
        }
        try {
            return equalsConstructorPrototype(object);
        } catch (e) {
            return false;
        }
    };
    var dontEnums = [
        'toString',
        'toLocaleString',
        'valueOf',
        'hasOwnProperty',
        'isPrototypeOf',
        'propertyIsEnumerable',
        'constructor'
    ];
    var dontEnumsLength = dontEnums.length;

    // taken directly from https://github.com/ljharb/is-arguments/blob/master/index.js
    // can be replaced with require('is-arguments') if we ever use a build process instead
    var isStandardArguments = function isArguments(value) {
        return toStr(value) === '[object Arguments]';
    };
    var isLegacyArguments = function isArguments(value) {
        return value !== null
            && typeof value === 'object'
            && typeof value.length === 'number'
            && value.length >= 0
            && !isArray(value)
            && isCallable(value.callee);
    };
    var isArguments = isStandardArguments(arguments) ? isStandardArguments : isLegacyArguments;

    defineProperties($Object, {
        keys: function keys(object) {
            var isFn = isCallable(object);
            var isArgs = isArguments(object);
            var isObject = object !== null && typeof object === 'object';
            var isStr = isObject && isString(object);

            if (!isObject && !isFn && !isArgs) {
                throw new TypeError('Object.keys called on a non-object');
            }

            var theKeys = [];
            var skipProto = hasProtoEnumBug && isFn;
            if ((isStr && hasStringEnumBug) || isArgs) {
                for (var i = 0; i < object.length; ++i) {
                    pushCall(theKeys, $String(i));
                }
            }

            if (!isArgs) {
                for (var name in object) {
                    if (!(skipProto && name === 'prototype') && owns(object, name)) {
                        pushCall(theKeys, $String(name));
                    }
                }
            }

            if (hasDontEnumBug) {
                var skipConstructor = equalsConstructorPrototypeIfNotBuggy(object);
                for (var j = 0; j < dontEnumsLength; j++) {
                    var dontEnum = dontEnums[j];
                    if (!(skipConstructor && dontEnum === 'constructor') && owns(object, dontEnum)) {
                        pushCall(theKeys, dontEnum);
                    }
                }
            }
            return theKeys;
        }
    });

    var keysWorksWithArguments = $Object.keys && (function () {
        // Safari 5.0 bug
        return $Object.keys(arguments).length === 2;
    }(1, 2));
    var keysHasArgumentsLengthBug = $Object.keys && (function () {
        var argKeys = $Object.keys(arguments);
        return arguments.length !== 1 || argKeys.length !== 1 || argKeys[0] !== 1;
    }(1));
    var originalKeys = $Object.keys;
    defineProperties($Object, {
        keys: function keys(object) {
            if (isArguments(object)) {
                return originalKeys(arraySlice(object));
            } else {
                return originalKeys(object);
            }
        }
    }, !keysWorksWithArguments || keysHasArgumentsLengthBug);

    //
    // Date
    // ====
    //

    var hasNegativeMonthYearBug = new Date(-3509827329600292).getUTCMonth() !== 0;
    var aNegativeTestDate = new Date(-1509842289600292);
    var aPositiveTestDate = new Date(1449662400000);
    var hasToUTCStringFormatBug = aNegativeTestDate.toUTCString() !== 'Mon, 01 Jan -45875 11:59:59 GMT';
    var hasToDateStringFormatBug;
    var hasToStringFormatBug;
    var timeZoneOffset = aNegativeTestDate.getTimezoneOffset();
    if (timeZoneOffset < -720) {
        hasToDateStringFormatBug = aNegativeTestDate.toDateString() !== 'Tue Jan 02 -45875';
        hasToStringFormatBug = !(/^Thu Dec 10 2015 \d\d:\d\d:\d\d GMT[-+]\d\d\d\d(?: |$)/).test(String(aPositiveTestDate));
    } else {
        hasToDateStringFormatBug = aNegativeTestDate.toDateString() !== 'Mon Jan 01 -45875';
        hasToStringFormatBug = !(/^Wed Dec 09 2015 \d\d:\d\d:\d\d GMT[-+]\d\d\d\d(?: |$)/).test(String(aPositiveTestDate));
    }

    var originalGetFullYear = call.bind(Date.prototype.getFullYear);
    var originalGetMonth = call.bind(Date.prototype.getMonth);
    var originalGetDate = call.bind(Date.prototype.getDate);
    var originalGetUTCFullYear = call.bind(Date.prototype.getUTCFullYear);
    var originalGetUTCMonth = call.bind(Date.prototype.getUTCMonth);
    var originalGetUTCDate = call.bind(Date.prototype.getUTCDate);
    var originalGetUTCDay = call.bind(Date.prototype.getUTCDay);
    var originalGetUTCHours = call.bind(Date.prototype.getUTCHours);
    var originalGetUTCMinutes = call.bind(Date.prototype.getUTCMinutes);
    var originalGetUTCSeconds = call.bind(Date.prototype.getUTCSeconds);
    var originalGetUTCMilliseconds = call.bind(Date.prototype.getUTCMilliseconds);
    var dayName = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    var monthName = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var daysInMonth = function daysInMonth(month, year) {
        return originalGetDate(new Date(year, month, 0));
    };

    defineProperties(Date.prototype, {
        getFullYear: function getFullYear() {
            if (!this || !(this instanceof Date)) {
                throw new TypeError('this is not a Date object.');
            }
            var year = originalGetFullYear(this);
            if (year < 0 && originalGetMonth(this) > 11) {
                return year + 1;
            }
            return year;
        },
        getMonth: function getMonth() {
            if (!this || !(this instanceof Date)) {
                throw new TypeError('this is not a Date object.');
            }
            var year = originalGetFullYear(this);
            var month = originalGetMonth(this);
            if (year < 0 && month > 11) {
                return 0;
            }
            return month;
        },
        getDate: function getDate() {
            if (!this || !(this instanceof Date)) {
                throw new TypeError('this is not a Date object.');
            }
            var year = originalGetFullYear(this);
            var month = originalGetMonth(this);
            var date = originalGetDate(this);
            if (year < 0 && month > 11) {
                if (month === 12) {
                    return date;
                }
                var days = daysInMonth(0, year + 1);
                return (days - date) + 1;
            }
            return date;
        },
        getUTCFullYear: function getUTCFullYear() {
            if (!this || !(this instanceof Date)) {
                throw new TypeError('this is not a Date object.');
            }
            var year = originalGetUTCFullYear(this);
            if (year < 0 && originalGetUTCMonth(this) > 11) {
                return year + 1;
            }
            return year;
        },
        getUTCMonth: function getUTCMonth() {
            if (!this || !(this instanceof Date)) {
                throw new TypeError('this is not a Date object.');
            }
            var year = originalGetUTCFullYear(this);
            var month = originalGetUTCMonth(this);
            if (year < 0 && month > 11) {
                return 0;
            }
            return month;
        },
        getUTCDate: function getUTCDate() {
            if (!this || !(this instanceof Date)) {
                throw new TypeError('this is not a Date object.');
            }
            var year = originalGetUTCFullYear(this);
            var month = originalGetUTCMonth(this);
            var date = originalGetUTCDate(this);
            if (year < 0 && month > 11) {
                if (month === 12) {
                    return date;
                }
                var days = daysInMonth(0, year + 1);
                return (days - date) + 1;
            }
            return date;
        }
    }, hasNegativeMonthYearBug);

    defineProperties(Date.prototype, {
        toUTCString: function toUTCString() {
            if (!this || !(this instanceof Date)) {
                throw new TypeError('this is not a Date object.');
            }
            var day = originalGetUTCDay(this);
            var date = originalGetUTCDate(this);
            var month = originalGetUTCMonth(this);
            var year = originalGetUTCFullYear(this);
            var hour = originalGetUTCHours(this);
            var minute = originalGetUTCMinutes(this);
            var second = originalGetUTCSeconds(this);
            return dayName[day] + ', '
                + (date < 10 ? '0' + date : date) + ' '
                + monthName[month] + ' '
                + year + ' '
                + (hour < 10 ? '0' + hour : hour) + ':'
                + (minute < 10 ? '0' + minute : minute) + ':'
                + (second < 10 ? '0' + second : second) + ' GMT';
        }
    }, hasNegativeMonthYearBug || hasToUTCStringFormatBug);

    // Opera 12 has `,`
    defineProperties(Date.prototype, {
        toDateString: function toDateString() {
            if (!this || !(this instanceof Date)) {
                throw new TypeError('this is not a Date object.');
            }
            var day = this.getDay();
            var date = this.getDate();
            var month = this.getMonth();
            var year = this.getFullYear();
            return dayName[day] + ' '
                + monthName[month] + ' '
                + (date < 10 ? '0' + date : date) + ' '
                + year;
        }
    }, hasNegativeMonthYearBug || hasToDateStringFormatBug);

    // can't use defineProperties here because of toString enumeration issue in IE <= 8
    if (hasNegativeMonthYearBug || hasToStringFormatBug) {
        Date.prototype.toString = function toString() {
            if (!this || !(this instanceof Date)) {
                throw new TypeError('this is not a Date object.');
            }
            var day = this.getDay();
            var date = this.getDate();
            var month = this.getMonth();
            var year = this.getFullYear();
            var hour = this.getHours();
            var minute = this.getMinutes();
            var second = this.getSeconds();
            var timezoneOffset = this.getTimezoneOffset();
            var hoursOffset = Math.floor(Math.abs(timezoneOffset) / 60);
            var minutesOffset = Math.floor(Math.abs(timezoneOffset) % 60);
            return dayName[day] + ' '
                + monthName[month] + ' '
                + (date < 10 ? '0' + date : date) + ' '
                + year + ' '
                + (hour < 10 ? '0' + hour : hour) + ':'
                + (minute < 10 ? '0' + minute : minute) + ':'
                + (second < 10 ? '0' + second : second) + ' GMT'
                + (timezoneOffset > 0 ? '-' : '+')
                + (hoursOffset < 10 ? '0' + hoursOffset : hoursOffset)
                + (minutesOffset < 10 ? '0' + minutesOffset : minutesOffset);
        };
        if (supportsDescriptors) {
            $Object.defineProperty(Date.prototype, 'toString', {
                configurable: true,
                enumerable: false,
                writable: true
            });
        }
    }

    // ES5 15.9.5.43
    // http://es5.github.com/#x15.9.5.43
    // This function returns a String value represent the instance in time
    // represented by this Date object. The format of the String is the Date Time
    // string format defined in 15.9.1.15. All fields are present in the String.
    // The time zone is always UTC, denoted by the suffix Z. If the time value of
    // this object is not a finite Number a RangeError exception is thrown.
    var negativeDate = -62198755200000;
    var negativeYearString = '-000001';
    var hasNegativeDateBug = Date.prototype.toISOString && new Date(negativeDate).toISOString().indexOf(negativeYearString) === -1; // eslint-disable-line max-len
    var hasSafari51DateBug = Date.prototype.toISOString && new Date(-1).toISOString() !== '1969-12-31T23:59:59.999Z';

    var getTime = call.bind(Date.prototype.getTime);

    defineProperties(Date.prototype, {
        toISOString: function toISOString() {
            if (!isFinite(this) || !isFinite(getTime(this))) {
                // Adope Photoshop requires the second check.
                throw new RangeError('Date.prototype.toISOString called on non-finite value.');
            }

            var year = originalGetUTCFullYear(this);

            var month = originalGetUTCMonth(this);
            // see https://github.com/es-shims/es5-shim/issues/111
            year += Math.floor(month / 12);
            month = ((month % 12) + 12) % 12;

            // the date time string format is specified in 15.9.1.15.
            var result = [
                month + 1,
                originalGetUTCDate(this),
                originalGetUTCHours(this),
                originalGetUTCMinutes(this),
                originalGetUTCSeconds(this)
            ];
            year = (
                (year < 0 ? '-' : (year > 9999 ? '+' : ''))
                + strSlice('00000' + Math.abs(year), (0 <= year && year <= 9999) ? -4 : -6)
            );

            for (var i = 0; i < result.length; ++i) {
                // pad months, days, hours, minutes, and seconds to have two digits.
                result[i] = strSlice('00' + result[i], -2);
            }
            // pad milliseconds to have three digits.
            return (
                year + '-' + arraySlice(result, 0, 2).join('-')
                + 'T' + arraySlice(result, 2).join(':') + '.'
                + strSlice('000' + originalGetUTCMilliseconds(this), -3) + 'Z'
            );
        }
    }, hasNegativeDateBug || hasSafari51DateBug);

    // ES5 15.9.5.44
    // http://es5.github.com/#x15.9.5.44
    // This function provides a String representation of a Date object for use by
    // JSON.stringify (15.12.3).
    var dateToJSONIsSupported = (function () {
        try {
            return Date.prototype.toJSON
                && new Date(NaN).toJSON() === null
                && new Date(negativeDate).toJSON().indexOf(negativeYearString) !== -1
                && Date.prototype.toJSON.call({ // generic
                    toISOString: function () { return true; }
                });
        } catch (e) {
            return false;
        }
    }());
    if (!dateToJSONIsSupported) {
        Date.prototype.toJSON = function toJSON(key) {
            // When the toJSON method is called with argument key, the following
            // steps are taken:

            // 1.  Let O be the result of calling ToObject, giving it the this
            // value as its argument.
            // 2. Let tv be ES.ToPrimitive(O, hint Number).
            var O = $Object(this);
            var tv = ES.ToPrimitive(O);
            // 3. If tv is a Number and is not finite, return null.
            if (typeof tv === 'number' && !isFinite(tv)) {
                return null;
            }
            // 4. Let toISO be the result of calling the [[Get]] internal method of
            // O with argument "toISOString".
            var toISO = O.toISOString;
            // 5. If IsCallable(toISO) is false, throw a TypeError exception.
            if (!isCallable(toISO)) {
                throw new TypeError('toISOString property is not callable');
            }
            // 6. Return the result of calling the [[Call]] internal method of
            //  toISO with O as the this value and an empty argument list.
            return toISO.call(O);

            // NOTE 1 The argument is ignored.

            // NOTE 2 The toJSON function is intentionally generic; it does not
            // require that its this value be a Date object. Therefore, it can be
            // transferred to other kinds of objects for use as a method. However,
            // it does require that any such object have a toISOString method. An
            // object is free to use the argument key to filter its
            // stringification.
        };
    }

    // ES5 15.9.4.2
    // http://es5.github.com/#x15.9.4.2
    // based on work shared by Daniel Friesen (dantman)
    // http://gist.github.com/303249
    var supportsExtendedYears = Date.parse('+033658-09-27T01:46:40.000Z') === 1e15;
    var acceptsInvalidDates = !isNaN(Date.parse('2012-04-04T24:00:00.500Z')) || !isNaN(Date.parse('2012-11-31T23:59:59.000Z')) || !isNaN(Date.parse('2012-12-31T23:59:60.000Z'));
    var doesNotParseY2KNewYear = isNaN(Date.parse('2000-01-01T00:00:00.000Z'));
    if (doesNotParseY2KNewYear || acceptsInvalidDates || !supportsExtendedYears) {
        // XXX global assignment won't work in embeddings that use
        // an alternate object for the context.
        /* global Date: true */
        var maxSafeUnsigned32Bit = Math.pow(2, 31) - 1;
        var hasSafariSignedIntBug = isActualNaN(new Date(1970, 0, 1, 0, 0, 0, maxSafeUnsigned32Bit + 1).getTime());
        // eslint-disable-next-line no-implicit-globals, no-global-assign
        Date = (function (NativeDate) {
            // Date.length === 7
            var DateShim = function Date(Y, M, D, h, m, s, ms) {
                var length = arguments.length;
                var date;
                if (this instanceof NativeDate) {
                    var seconds = s;
                    var millis = ms;
                    if (hasSafariSignedIntBug && length >= 7 && ms > maxSafeUnsigned32Bit) {
                        // work around a Safari 8/9 bug where it treats the seconds as signed
                        var msToShift = Math.floor(ms / maxSafeUnsigned32Bit) * maxSafeUnsigned32Bit;
                        var sToShift = Math.floor(msToShift / 1e3);
                        seconds += sToShift;
                        millis -= sToShift * 1e3;
                    }
                    date = length === 1 && $String(Y) === Y // isString(Y)
                        // We explicitly pass it through parse:
                        ? new NativeDate(DateShim.parse(Y))
                        // We have to manually make calls depending on argument
                        // length here
                        : length >= 7 ? new NativeDate(Y, M, D, h, m, seconds, millis)
                            : length >= 6 ? new NativeDate(Y, M, D, h, m, seconds)
                                : length >= 5 ? new NativeDate(Y, M, D, h, m)
                                    : length >= 4 ? new NativeDate(Y, M, D, h)
                                        : length >= 3 ? new NativeDate(Y, M, D)
                                            : length >= 2 ? new NativeDate(Y, M)
                                                : length >= 1 ? new NativeDate(Y instanceof NativeDate ? +Y : Y)
                                                    : new NativeDate();
                } else {
                    date = NativeDate.apply(this, arguments);
                }
                if (!isPrimitive(date)) {
                    // Prevent mixups with unfixed Date object
                    defineProperties(date, { constructor: DateShim }, true);
                }
                return date;
            };

            // 15.9.1.15 Date Time String Format.
            var isoDateExpression = new RegExp('^'
                + '(\\d{4}|[+-]\\d{6})' // four-digit year capture or sign + 6-digit extended year
                + '(?:-(\\d{2})' // optional month capture
                + '(?:-(\\d{2})' // optional day capture
                + '(?:' // capture hours:minutes:seconds.milliseconds
                    + 'T(\\d{2})' // hours capture
                    + ':(\\d{2})' // minutes capture
                    + '(?:' // optional :seconds.milliseconds
                        + ':(\\d{2})' // seconds capture
                        + '(?:(\\.\\d{1,}))?' // milliseconds capture
                    + ')?'
                + '(' // capture UTC offset component
                    + 'Z|' // UTC capture
                    + '(?:' // offset specifier +/-hours:minutes
                        + '([-+])' // sign capture
                        + '(\\d{2})' // hours offset capture
                        + ':(\\d{2})' // minutes offset capture
                    + ')'
                + ')?)?)?)?'
            + '$');

            var months = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334, 365];

            var dayFromMonth = function dayFromMonth(year, month) {
                var t = month > 1 ? 1 : 0;
                return (
                    months[month]
                    + Math.floor((year - 1969 + t) / 4)
                    - Math.floor((year - 1901 + t) / 100)
                    + Math.floor((year - 1601 + t) / 400)
                    + (365 * (year - 1970))
                );
            };

            var toUTC = function toUTC(t) {
                var s = 0;
                var ms = t;
                if (hasSafariSignedIntBug && ms > maxSafeUnsigned32Bit) {
                    // work around a Safari 8/9 bug where it treats the seconds as signed
                    var msToShift = Math.floor(ms / maxSafeUnsigned32Bit) * maxSafeUnsigned32Bit;
                    var sToShift = Math.floor(msToShift / 1e3);
                    s += sToShift;
                    ms -= sToShift * 1e3;
                }
                return $Number(new NativeDate(1970, 0, 1, 0, 0, s, ms));
            };

            // Copy any custom methods a 3rd party library may have added
            for (var key in NativeDate) {
                if (owns(NativeDate, key)) {
                    DateShim[key] = NativeDate[key];
                }
            }

            // Copy "native" methods explicitly; they may be non-enumerable
            defineProperties(DateShim, {
                now: NativeDate.now,
                UTC: NativeDate.UTC
            }, true);
            DateShim.prototype = NativeDate.prototype;
            defineProperties(DateShim.prototype, { constructor: DateShim }, true);

            // Upgrade Date.parse to handle simplified ISO 8601 strings
            var parseShim = function parse(string) {
                var match = isoDateExpression.exec(string);
                if (match) {
                    // parse months, days, hours, minutes, seconds, and milliseconds
                    // provide default values if necessary
                    // parse the UTC offset component
                    var year = $Number(match[1]),
                        month = $Number(match[2] || 1) - 1,
                        day = $Number(match[3] || 1) - 1,
                        hour = $Number(match[4] || 0),
                        minute = $Number(match[5] || 0),
                        second = $Number(match[6] || 0),
                        millisecond = Math.floor($Number(match[7] || 0) * 1000),
                        // When time zone is missed, local offset should be used
                        // (ES 5.1 bug)
                        // see https://bugs.ecmascript.org/show_bug.cgi?id=112
                        isLocalTime = Boolean(match[4] && !match[8]),
                        signOffset = match[9] === '-' ? 1 : -1,
                        hourOffset = $Number(match[10] || 0),
                        minuteOffset = $Number(match[11] || 0),
                        result;
                    var hasMinutesOrSecondsOrMilliseconds = minute > 0 || second > 0 || millisecond > 0;
                    if (
                        hour < (hasMinutesOrSecondsOrMilliseconds ? 24 : 25)
                        && minute < 60 && second < 60 && millisecond < 1000
                        && month > -1 && month < 12 && hourOffset < 24
                        && minuteOffset < 60 // detect invalid offsets
                        && day > -1
                        && day < (dayFromMonth(year, month + 1) - dayFromMonth(year, month))
                    ) {
                        result = (
                            ((dayFromMonth(year, month) + day) * 24)
                            + hour
                            + (hourOffset * signOffset)
                        ) * 60;
                        result = ((
                            ((result + minute + (minuteOffset * signOffset)) * 60)
                            + second
                        ) * 1000) + millisecond;
                        if (isLocalTime) {
                            result = toUTC(result);
                        }
                        if (-8.64e15 <= result && result <= 8.64e15) {
                            return result;
                        }
                    }
                    return NaN;
                }
                return NativeDate.parse.apply(this, arguments);
            };
            defineProperties(DateShim, { parse: parseShim });

            return DateShim;
        }(Date));
        /* global Date: false */
    }

    // ES5 15.9.4.4
    // http://es5.github.com/#x15.9.4.4
    if (!Date.now) {
        Date.now = function now() {
            return new Date().getTime();
        };
    }

    //
    // Number
    // ======
    //

    // ES5.1 15.7.4.5
    // http://es5.github.com/#x15.7.4.5
    var hasToFixedBugs = NumberPrototype.toFixed && (
        (0.00008).toFixed(3) !== '0.000'
        || (0.9).toFixed(0) !== '1'
        || (1.255).toFixed(2) !== '1.25'
        || (1000000000000000128).toFixed(0) !== '1000000000000000128'
    );

    var toFixedHelpers = {
        base: 1e7,
        size: 6,
        data: [0, 0, 0, 0, 0, 0],
        multiply: function multiply(n, c) {
            var i = -1;
            var c2 = c;
            while (++i < toFixedHelpers.size) {
                c2 += n * toFixedHelpers.data[i];
                toFixedHelpers.data[i] = c2 % toFixedHelpers.base;
                c2 = Math.floor(c2 / toFixedHelpers.base);
            }
        },
        divide: function divide(n) {
            var i = toFixedHelpers.size;
            var c = 0;
            while (--i >= 0) {
                c += toFixedHelpers.data[i];
                toFixedHelpers.data[i] = Math.floor(c / n);
                c = (c % n) * toFixedHelpers.base;
            }
        },
        numToString: function numToString() {
            var i = toFixedHelpers.size;
            var s = '';
            while (--i >= 0) {
                if (s !== '' || i === 0 || toFixedHelpers.data[i] !== 0) {
                    var t = $String(toFixedHelpers.data[i]);
                    if (s === '') {
                        s = t;
                    } else {
                        s += strSlice('0000000', 0, 7 - t.length) + t;
                    }
                }
            }
            return s;
        },
        pow: function pow(x, n, acc) {
            return (n === 0 ? acc : (n % 2 === 1 ? pow(x, n - 1, acc * x) : pow(x * x, n / 2, acc)));
        },
        log: function log(x) {
            var n = 0;
            var x2 = x;
            while (x2 >= 4096) {
                n += 12;
                x2 /= 4096;
            }
            while (x2 >= 2) {
                n += 1;
                x2 /= 2;
            }
            return n;
        }
    };

    var toFixedShim = function toFixed(fractionDigits) {
        var f, x, s, m, e, z, j, k;

        // Test for NaN and round fractionDigits down
        f = $Number(fractionDigits);
        f = isActualNaN(f) ? 0 : Math.floor(f);

        if (f < 0 || f > 20) {
            throw new RangeError('Number.toFixed called with invalid number of decimals');
        }

        x = $Number(this);

        if (isActualNaN(x)) {
            return 'NaN';
        }

        // If it is too big or small, return the string value of the number
        if (x <= -1e21 || x >= 1e21) {
            return $String(x);
        }

        s = '';

        if (x < 0) {
            s = '-';
            x = -x;
        }

        m = '0';

        if (x > 1e-21) {
            // 1e-21 < x < 1e21
            // -70 < log2(x) < 70
            e = toFixedHelpers.log(x * toFixedHelpers.pow(2, 69, 1)) - 69;
            z = (e < 0 ? x * toFixedHelpers.pow(2, -e, 1) : x / toFixedHelpers.pow(2, e, 1));
            z *= 0x10000000000000; // Math.pow(2, 52);
            e = 52 - e;

            // -18 < e < 122
            // x = z / 2 ^ e
            if (e > 0) {
                toFixedHelpers.multiply(0, z);
                j = f;

                while (j >= 7) {
                    toFixedHelpers.multiply(1e7, 0);
                    j -= 7;
                }

                toFixedHelpers.multiply(toFixedHelpers.pow(10, j, 1), 0);
                j = e - 1;

                while (j >= 23) {
                    toFixedHelpers.divide(1 << 23);
                    j -= 23;
                }

                toFixedHelpers.divide(1 << j);
                toFixedHelpers.multiply(1, 1);
                toFixedHelpers.divide(2);
                m = toFixedHelpers.numToString();
            } else {
                toFixedHelpers.multiply(0, z);
                toFixedHelpers.multiply(1 << (-e), 0);
                m = toFixedHelpers.numToString() + strSlice('0.00000000000000000000', 2, 2 + f);
            }
        }

        if (f > 0) {
            k = m.length;

            if (k <= f) {
                m = s + strSlice('0.0000000000000000000', 0, f - k + 2) + m;
            } else {
                m = s + strSlice(m, 0, k - f) + '.' + strSlice(m, k - f);
            }
        } else {
            m = s + m;
        }

        return m;
    };
    defineProperties(NumberPrototype, { toFixed: toFixedShim }, hasToFixedBugs);

    var hasToPrecisionUndefinedBug = (function () {
        try {
            return 1.0.toPrecision(undefined) === '1';
        } catch (e) {
            return true;
        }
    }());
    var originalToPrecision = NumberPrototype.toPrecision;
    defineProperties(NumberPrototype, {
        toPrecision: function toPrecision(precision) {
            return typeof precision === 'undefined' ? originalToPrecision.call(this) : originalToPrecision.call(this, precision);
        }
    }, hasToPrecisionUndefinedBug);

    //
    // String
    // ======
    //

    // ES5 15.5.4.14
    // http://es5.github.com/#x15.5.4.14

    // [bugfix, IE lt 9, firefox 4, Konqueror, Opera, obscure browsers]
    // Many browsers do not split properly with regular expressions or they
    // do not perform the split correctly under obscure conditions.
    // See http://blog.stevenlevithan.com/archives/cross-browser-split
    // I've tested in many browsers and this seems to cover the deviant ones:
    //    'ab'.split(/(?:ab)*/) should be ["", ""], not [""]
    //    '.'.split(/(.?)(.?)/) should be ["", ".", "", ""], not ["", ""]
    //    'tesst'.split(/(s)*/) should be ["t", undefined, "e", "s", "t"], not
    //       [undefined, "t", undefined, "e", ...]
    //    ''.split(/.?/) should be [], not [""]
    //    '.'.split(/()()/) should be ["."], not ["", "", "."]

    if (
        'ab'.split(/(?:ab)*/).length !== 2
        || '.'.split(/(.?)(.?)/).length !== 4
        || 'tesst'.split(/(s)*/)[1] === 't'
        || 'test'.split(/(?:)/, -1).length !== 4
        || ''.split(/.?/).length
        || '.'.split(/()()/).length > 1
    ) {
        (function () {
            var compliantExecNpcg = typeof (/()??/).exec('')[1] === 'undefined'; // NPCG: nonparticipating capturing group
            var maxSafe32BitInt = Math.pow(2, 32) - 1;

            StringPrototype.split = function (separator, limit) {
                var string = String(this);
                if (typeof separator === 'undefined' && limit === 0) {
                    return [];
                }

                // If `separator` is not a regex, use native split
                if (!isRegex(separator)) {
                    return strSplit(this, separator, limit);
                }

                var output = [];
                var flags = (separator.ignoreCase ? 'i' : '')
                            + (separator.multiline ? 'm' : '')
                            + (separator.unicode ? 'u' : '') // in ES6
                            + (separator.sticky ? 'y' : ''), // Firefox 3+ and ES6
                    lastLastIndex = 0,
                    // Make `global` and avoid `lastIndex` issues by working with a copy
                    separator2, match, lastIndex, lastLength;
                var separatorCopy = new RegExp(separator.source, flags + 'g');
                if (!compliantExecNpcg) {
                    // Doesn't need flags gy, but they don't hurt
                    separator2 = new RegExp('^' + separatorCopy.source + '$(?!\\s)', flags);
                }
                /* Values for `limit`, per the spec:
                 * If undefined: 4294967295 // maxSafe32BitInt
                 * If 0, Infinity, or NaN: 0
                 * If positive number: limit = Math.floor(limit); if (limit > 4294967295) limit -= 4294967296;
                 * If negative number: 4294967296 - Math.floor(Math.abs(limit))
                 * If other: Type-convert, then use the above rules
                 */
                var splitLimit = typeof limit === 'undefined' ? maxSafe32BitInt : ES.ToUint32(limit);
                match = separatorCopy.exec(string);
                while (match) {
                    // `separatorCopy.lastIndex` is not reliable cross-browser
                    lastIndex = match.index + match[0].length;
                    if (lastIndex > lastLastIndex) {
                        pushCall(output, strSlice(string, lastLastIndex, match.index));
                        // Fix browsers whose `exec` methods don't consistently return `undefined` for
                        // nonparticipating capturing groups
                        if (!compliantExecNpcg && match.length > 1) {
                            /* eslint-disable no-loop-func */
                            match[0].replace(separator2, function () {
                                for (var i = 1; i < arguments.length - 2; i++) {
                                    if (typeof arguments[i] === 'undefined') {
                                        match[i] = void 0;
                                    }
                                }
                            });
                            /* eslint-enable no-loop-func */
                        }
                        if (match.length > 1 && match.index < string.length) {
                            array_push.apply(output, arraySlice(match, 1));
                        }
                        lastLength = match[0].length;
                        lastLastIndex = lastIndex;
                        if (output.length >= splitLimit) {
                            break;
                        }
                    }
                    if (separatorCopy.lastIndex === match.index) {
                        separatorCopy.lastIndex++; // Avoid an infinite loop
                    }
                    match = separatorCopy.exec(string);
                }
                if (lastLastIndex === string.length) {
                    if (lastLength || !separatorCopy.test('')) {
                        pushCall(output, '');
                    }
                } else {
                    pushCall(output, strSlice(string, lastLastIndex));
                }
                return output.length > splitLimit ? arraySlice(output, 0, splitLimit) : output;
            };
        }());

    // [bugfix, chrome]
    // If separator is undefined, then the result array contains just one String,
    // which is the this value (converted to a String). If limit is not undefined,
    // then the output array is truncated so that it contains no more than limit
    // elements.
    // "0".split(undefined, 0) -> []
    } else if ('0'.split(void 0, 0).length) {
        StringPrototype.split = function split(separator, limit) {
            if (typeof separator === 'undefined' && limit === 0) {
                return [];
            }
            return strSplit(this, separator, limit);
        };
    }

    var str_replace = StringPrototype.replace;
    var replaceReportsGroupsCorrectly = (function () {
        var groups = [];
        'x'.replace(/x(.)?/g, function (match, group) {
            pushCall(groups, group);
        });
        return groups.length === 1 && typeof groups[0] === 'undefined';
    }());

    if (!replaceReportsGroupsCorrectly) {
        StringPrototype.replace = function replace(searchValue, replaceValue) {
            var isFn = isCallable(replaceValue);
            var hasCapturingGroups = isRegex(searchValue) && (/\)[*?]/).test(searchValue.source);
            if (!isFn || !hasCapturingGroups) {
                return str_replace.call(this, searchValue, replaceValue);
            } else {
                var wrappedReplaceValue = function (match) {
                    var length = arguments.length;
                    var originalLastIndex = searchValue.lastIndex;
                    searchValue.lastIndex = 0;
                    var args = searchValue.exec(match) || [];
                    searchValue.lastIndex = originalLastIndex;
                    pushCall(args, arguments[length - 2], arguments[length - 1]);
                    return replaceValue.apply(this, args);
                };
                return str_replace.call(this, searchValue, wrappedReplaceValue);
            }
        };
    }

    // ECMA-262, 3rd B.2.3
    // Not an ECMAScript standard, although ECMAScript 3rd Edition has a
    // non-normative section suggesting uniform semantics and it should be
    // normalized across all browsers
    // [bugfix, IE lt 9] IE < 9 substr() with negative value not working in IE
    var string_substr = StringPrototype.substr;
    var hasNegativeSubstrBug = ''.substr && '0b'.substr(-1) !== 'b';
    defineProperties(StringPrototype, {
        substr: function substr(start, length) {
            var normalizedStart = start;
            if (start < 0) {
                normalizedStart = max(this.length + start, 0);
            }
            return string_substr.call(this, normalizedStart, length);
        }
    }, hasNegativeSubstrBug);

    // ES5 15.5.4.20
    // whitespace from: http://es5.github.io/#x15.5.4.20
    var ws = '\x09\x0A\x0B\x0C\x0D\x20\xA0\u1680\u180E\u2000\u2001\u2002\u2003'
        + '\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028'
        + '\u2029\uFEFF';
    var zeroWidth = '\u200b';
    var wsRegexChars = '[' + ws + ']';
    var trimBeginRegexp = new RegExp('^' + wsRegexChars + wsRegexChars + '*');
    var trimEndRegexp = new RegExp(wsRegexChars + wsRegexChars + '*$');
    var hasTrimWhitespaceBug = StringPrototype.trim && (ws.trim() || !zeroWidth.trim());
    defineProperties(StringPrototype, {
        // http://blog.stevenlevithan.com/archives/faster-trim-javascript
        // http://perfectionkills.com/whitespace-deviations/
        trim: function trim() {
            if (typeof this === 'undefined' || this === null) {
                throw new TypeError("can't convert " + this + ' to object');
            }
            return $String(this).replace(trimBeginRegexp, '').replace(trimEndRegexp, '');
        }
    }, hasTrimWhitespaceBug);
    var trim = call.bind(String.prototype.trim);

    var hasLastIndexBug = StringPrototype.lastIndexOf && 'abcあい'.lastIndexOf('あい', 2) !== -1;
    defineProperties(StringPrototype, {
        lastIndexOf: function lastIndexOf(searchString) {
            if (typeof this === 'undefined' || this === null) {
                throw new TypeError("can't convert " + this + ' to object');
            }
            var S = $String(this);
            var searchStr = $String(searchString);
            var numPos = arguments.length > 1 ? $Number(arguments[1]) : NaN;
            var pos = isActualNaN(numPos) ? Infinity : ES.ToInteger(numPos);
            var start = min(max(pos, 0), S.length);
            var searchLen = searchStr.length;
            var k = start + searchLen;
            while (k > 0) {
                k = max(0, k - searchLen);
                var index = strIndexOf(strSlice(S, k, start + searchLen), searchStr);
                if (index !== -1) {
                    return k + index;
                }
            }
            return -1;
        }
    }, hasLastIndexBug);

    var originalLastIndexOf = StringPrototype.lastIndexOf;
    defineProperties(StringPrototype, {
        lastIndexOf: function lastIndexOf(searchString) {
            return originalLastIndexOf.apply(this, arguments);
        }
    }, StringPrototype.lastIndexOf.length !== 1);

    // ES-5 15.1.2.2
    // eslint-disable-next-line radix
    if (parseInt(ws + '08') !== 8 || parseInt(ws + '0x16') !== 22) {
        /* global parseInt: true */
        parseInt = (function (origParseInt) {
            var hexRegex = /^[-+]?0[xX]/;
            return function parseInt(str, radix) {
                if (typeof str === 'symbol') {
                    // handle Symbols in node 8.3/8.4
                    // eslint-disable-next-line no-implicit-coercion, no-unused-expressions
                    '' + str; // jscs:ignore disallowImplicitTypeConversion
                }

                var string = trim(String(str));
                var defaultedRadix = $Number(radix) || (hexRegex.test(string) ? 16 : 10);
                return origParseInt(string, defaultedRadix);
            };
        }(parseInt));
    }

    // https://es5.github.io/#x15.1.2.3
    if (1 / parseFloat('-0') !== -Infinity) {
        /* global parseFloat: true */
        parseFloat = (function (origParseFloat) {
            return function parseFloat(string) {
                var inputString = trim(String(string));
                var result = origParseFloat(inputString);
                return result === 0 && strSlice(inputString, 0, 1) === '-' ? -0 : result;
            };
        }(parseFloat));
    }

    if (String(new RangeError('test')) !== 'RangeError: test') {
        var errorToStringShim = function toString() {
            if (typeof this === 'undefined' || this === null) {
                throw new TypeError("can't convert " + this + ' to object');
            }
            var name = this.name;
            if (typeof name === 'undefined') {
                name = 'Error';
            } else if (typeof name !== 'string') {
                name = $String(name);
            }
            var msg = this.message;
            if (typeof msg === 'undefined') {
                msg = '';
            } else if (typeof msg !== 'string') {
                msg = $String(msg);
            }
            if (!name) {
                return msg;
            }
            if (!msg) {
                return name;
            }
            return name + ': ' + msg;
        };
        // can't use defineProperties here because of toString enumeration issue in IE <= 8
        Error.prototype.toString = errorToStringShim;
    }

    if (supportsDescriptors) {
        var ensureNonEnumerable = function (obj, prop) {
            if (isEnum(obj, prop)) {
                var desc = Object.getOwnPropertyDescriptor(obj, prop);
                if (desc.configurable) {
                    desc.enumerable = false;
                    Object.defineProperty(obj, prop, desc);
                }
            }
        };
        ensureNonEnumerable(Error.prototype, 'message');
        if (Error.prototype.message !== '') {
            Error.prototype.message = '';
        }
        ensureNonEnumerable(Error.prototype, 'name');
    }

    if (String(/a/mig) !== '/a/gim') {
        var regexToString = function toString() {
            var str = '/' + this.source + '/';
            if (this.global) {
                str += 'g';
            }
            if (this.ignoreCase) {
                str += 'i';
            }
            if (this.multiline) {
                str += 'm';
            }
            return str;
        };
        // can't use defineProperties here because of toString enumeration issue in IE <= 8
        RegExp.prototype.toString = regexToString;
    }
}));


/***/ }),

/***/ "./node_modules/html5shiv/dist/html5shiv.js":
/*!**************************************************!*\
  !*** ./node_modules/html5shiv/dist/html5shiv.js ***!
  \**************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports) {

/**
* @preserve HTML5 Shiv 3.7.3 | @afarkas @jdalton @jon_neal @rem | MIT/GPL2 Licensed
*/
;(function(window, document) {
/*jshint evil:true */
  /** version */
  var version = '3.7.3-pre';

  /** Preset options */
  var options = window.html5 || {};

  /** Used to skip problem elements */
  var reSkip = /^<|^(?:button|map|select|textarea|object|iframe|option|optgroup)$/i;

  /** Not all elements can be cloned in IE **/
  var saveClones = /^(?:a|b|code|div|fieldset|h1|h2|h3|h4|h5|h6|i|label|li|ol|p|q|span|strong|style|table|tbody|td|th|tr|ul)$/i;

  /** Detect whether the browser supports default html5 styles */
  var supportsHtml5Styles;

  /** Name of the expando, to work with multiple documents or to re-shiv one document */
  var expando = '_html5shiv';

  /** The id for the the documents expando */
  var expanID = 0;

  /** Cached data for each document */
  var expandoData = {};

  /** Detect whether the browser supports unknown elements */
  var supportsUnknownElements;

  (function() {
    try {
        var a = document.createElement('a');
        a.innerHTML = '<xyz></xyz>';
        //if the hidden property is implemented we can assume, that the browser supports basic HTML5 Styles
        supportsHtml5Styles = ('hidden' in a);

        supportsUnknownElements = a.childNodes.length == 1 || (function() {
          // assign a false positive if unable to shiv
          (document.createElement)('a');
          var frag = document.createDocumentFragment();
          return (
            typeof frag.cloneNode == 'undefined' ||
            typeof frag.createDocumentFragment == 'undefined' ||
            typeof frag.createElement == 'undefined'
          );
        }());
    } catch(e) {
      // assign a false positive if detection fails => unable to shiv
      supportsHtml5Styles = true;
      supportsUnknownElements = true;
    }

  }());

  /*--------------------------------------------------------------------------*/

  /**
   * Creates a style sheet with the given CSS text and adds it to the document.
   * @private
   * @param {Document} ownerDocument The document.
   * @param {String} cssText The CSS text.
   * @returns {StyleSheet} The style element.
   */
  function addStyleSheet(ownerDocument, cssText) {
    var p = ownerDocument.createElement('p'),
        parent = ownerDocument.getElementsByTagName('head')[0] || ownerDocument.documentElement;

    p.innerHTML = 'x<style>' + cssText + '</style>';
    return parent.insertBefore(p.lastChild, parent.firstChild);
  }

  /**
   * Returns the value of `html5.elements` as an array.
   * @private
   * @returns {Array} An array of shived element node names.
   */
  function getElements() {
    var elements = html5.elements;
    return typeof elements == 'string' ? elements.split(' ') : elements;
  }

  /**
   * Extends the built-in list of html5 elements
   * @memberOf html5
   * @param {String|Array} newElements whitespace separated list or array of new element names to shiv
   * @param {Document} ownerDocument The context document.
   */
  function addElements(newElements, ownerDocument) {
    var elements = html5.elements;
    if(typeof elements != 'string'){
      elements = elements.join(' ');
    }
    if(typeof newElements != 'string'){
      newElements = newElements.join(' ');
    }
    html5.elements = elements +' '+ newElements;
    shivDocument(ownerDocument);
  }

   /**
   * Returns the data associated to the given document
   * @private
   * @param {Document} ownerDocument The document.
   * @returns {Object} An object of data.
   */
  function getExpandoData(ownerDocument) {
    var data = expandoData[ownerDocument[expando]];
    if (!data) {
        data = {};
        expanID++;
        ownerDocument[expando] = expanID;
        expandoData[expanID] = data;
    }
    return data;
  }

  /**
   * returns a shived element for the given nodeName and document
   * @memberOf html5
   * @param {String} nodeName name of the element
   * @param {Document} ownerDocument The context document.
   * @returns {Object} The shived element.
   */
  function createElement(nodeName, ownerDocument, data){
    if (!ownerDocument) {
        ownerDocument = document;
    }
    if(supportsUnknownElements){
        return ownerDocument.createElement(nodeName);
    }
    if (!data) {
        data = getExpandoData(ownerDocument);
    }
    var node;

    if (data.cache[nodeName]) {
        node = data.cache[nodeName].cloneNode();
    } else if (saveClones.test(nodeName)) {
        node = (data.cache[nodeName] = data.createElem(nodeName)).cloneNode();
    } else {
        node = data.createElem(nodeName);
    }

    // Avoid adding some elements to fragments in IE < 9 because
    // * Attributes like `name` or `type` cannot be set/changed once an element
    //   is inserted into a document/fragment
    // * Link elements with `src` attributes that are inaccessible, as with
    //   a 403 response, will cause the tab/window to crash
    // * Script elements appended to fragments will execute when their `src`
    //   or `text` property is set
    return node.canHaveChildren && !reSkip.test(nodeName) && !node.tagUrn ? data.frag.appendChild(node) : node;
  }

  /**
   * returns a shived DocumentFragment for the given document
   * @memberOf html5
   * @param {Document} ownerDocument The context document.
   * @returns {Object} The shived DocumentFragment.
   */
  function createDocumentFragment(ownerDocument, data){
    if (!ownerDocument) {
        ownerDocument = document;
    }
    if(supportsUnknownElements){
        return ownerDocument.createDocumentFragment();
    }
    data = data || getExpandoData(ownerDocument);
    var clone = data.frag.cloneNode(),
        i = 0,
        elems = getElements(),
        l = elems.length;
    for(;i<l;i++){
        clone.createElement(elems[i]);
    }
    return clone;
  }

  /**
   * Shivs the `createElement` and `createDocumentFragment` methods of the document.
   * @private
   * @param {Document|DocumentFragment} ownerDocument The document.
   * @param {Object} data of the document.
   */
  function shivMethods(ownerDocument, data) {
    if (!data.cache) {
        data.cache = {};
        data.createElem = ownerDocument.createElement;
        data.createFrag = ownerDocument.createDocumentFragment;
        data.frag = data.createFrag();
    }


    ownerDocument.createElement = function(nodeName) {
      //abort shiv
      if (!html5.shivMethods) {
          return data.createElem(nodeName);
      }
      return createElement(nodeName, ownerDocument, data);
    };

    ownerDocument.createDocumentFragment = Function('h,f', 'return function(){' +
      'var n=f.cloneNode(),c=n.createElement;' +
      'h.shivMethods&&(' +
        // unroll the `createElement` calls
        getElements().join().replace(/[\w\-:]+/g, function(nodeName) {
          data.createElem(nodeName);
          data.frag.createElement(nodeName);
          return 'c("' + nodeName + '")';
        }) +
      ');return n}'
    )(html5, data.frag);
  }

  /*--------------------------------------------------------------------------*/

  /**
   * Shivs the given document.
   * @memberOf html5
   * @param {Document} ownerDocument The document to shiv.
   * @returns {Document} The shived document.
   */
  function shivDocument(ownerDocument) {
    if (!ownerDocument) {
        ownerDocument = document;
    }
    var data = getExpandoData(ownerDocument);

    if (html5.shivCSS && !supportsHtml5Styles && !data.hasCSS) {
      data.hasCSS = !!addStyleSheet(ownerDocument,
        // corrects block display not defined in IE6/7/8/9
        'article,aside,dialog,figcaption,figure,footer,header,hgroup,main,nav,section{display:block}' +
        // adds styling not present in IE6/7/8/9
        'mark{background:#FF0;color:#000}' +
        // hides non-rendered elements
        'template{display:none}'
      );
    }
    if (!supportsUnknownElements) {
      shivMethods(ownerDocument, data);
    }
    return ownerDocument;
  }

  /*--------------------------------------------------------------------------*/

  /**
   * The `html5` object is exposed so that more elements can be shived and
   * existing shiving can be detected on iframes.
   * @type Object
   * @example
   *
   * // options can be changed before the script is included
   * html5 = { 'elements': 'mark section', 'shivCSS': false, 'shivMethods': false };
   */
  var html5 = {

    /**
     * An array or space separated string of node names of the elements to shiv.
     * @memberOf html5
     * @type Array|String
     */
    'elements': options.elements || 'abbr article aside audio bdi canvas data datalist details dialog figcaption figure footer header hgroup main mark meter nav output picture progress section summary template time video',

    /**
     * current version of html5shiv
     */
    'version': version,

    /**
     * A flag to indicate that the HTML5 style sheet should be inserted.
     * @memberOf html5
     * @type Boolean
     */
    'shivCSS': (options.shivCSS !== false),

    /**
     * Is equal to true if a browser supports creating unknown/HTML5 elements
     * @memberOf html5
     * @type boolean
     */
    'supportsUnknownElements': supportsUnknownElements,

    /**
     * A flag to indicate that the document's `createElement` and `createDocumentFragment`
     * methods should be overwritten.
     * @memberOf html5
     * @type Boolean
     */
    'shivMethods': (options.shivMethods !== false),

    /**
     * A string to describe the type of `html5` object ("default" or "default print").
     * @memberOf html5
     * @type String
     */
    'type': 'default',

    // shivs the document according to the specified `html5` object options
    'shivDocument': shivDocument,

    //creates a shived element
    createElement: createElement,

    //creates a shived documentFragment
    createDocumentFragment: createDocumentFragment,

    //extends list of elements
    addElements: addElements
  };

  /*--------------------------------------------------------------------------*/

  // expose html5
  window.html5 = html5;

  // shiv the document
  shivDocument(document);

  if(typeof module == 'object' && module.exports){
    module.exports = html5;
  }

}(typeof window !== "undefined" ? window : this, document));


/***/ }),

/***/ 0:
/*!**************************************************!*\
  !*** multi html5shiv es5-shim es5-shim/es5-sham ***!
  \**************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! html5shiv */"./node_modules/html5shiv/dist/html5shiv.js");
__webpack_require__(/*! es5-shim */"./node_modules/es5-shim/es5-shim.js");
module.exports = __webpack_require__(/*! es5-shim/es5-sham */"./node_modules/es5-shim/es5-sham.js");


/***/ })

},[0]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvZXM1LXNoaW0vZXM1LXNoYW0uanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2VzNS1zaGltL2VzNS1zaGltLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9odG1sNXNoaXYvZGlzdC9odG1sNXNoaXYuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQSxhQUFhO0FBQ2I7QUFDQSxhQUFhO0FBQ2I7QUFDQSw0Q0FBNEMsaUJBQWlCO0FBQzdEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsdUZBQXVGO0FBQ3ZGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSwrQkFBK0Isa0JBQWtCO0FBQ2pEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSx3QkFBd0I7QUFDeEI7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBLDBDQUEwQzs7QUFFMUM7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwRkFBMEY7QUFDMUY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHdEQUF3RDtBQUN4RDtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUVBQW1FO0FBQ25FO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdURBQXVEO0FBQ3ZEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxvQ0FBb0M7QUFDcEMsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxDQUFDOzs7Ozs7Ozs7Ozs7O0FDL2lCRDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUJBQW1CLDJLQUEySyxNQUFNLGlDQUFpQyxxREFBcUQscUVBQXFFLG1FQUFtRSxFQUFFLFNBQVMsNkNBQTZDLEVBQUUsWUFBWSxjQUFjLHVCQUF1QixFQUFFLHlEQUF5RCxNQUFNLDJCQUEyQixjQUFjLEVBQUUscUJBQXFCLGFBQWEsRUFBRSxZQUFZLGNBQWMsRUFBRSxFQUFFLG1IQUFtSCxjQUFjLGNBQWMsRUFBRSxnRUFBZ0UsY0FBYyxFQUFFLHNCQUFzQixpQ0FBaUMsRUFBRSwyQkFBMkIsY0FBYyxFQUFFLHNDQUFzQyxzREFBc0Q7O0FBRTVsQyxnQkFBZ0IsbUlBQW1JLE1BQU0sdUJBQXVCLGFBQWEsRUFBRSxZQUFZLGNBQWMsRUFBRSxFQUFFLGlDQUFpQyxvQ0FBb0MsaUNBQWlDLGNBQWMsRUFBRSxvRkFBb0Y7QUFDdmEsaUJBQWlCLDRJQUE0SSxNQUFNLHNCQUFzQixhQUFhLEVBQUUsWUFBWSxjQUFjLEVBQUUsRUFBRSxrQ0FBa0Msc0NBQXNDLGlDQUFpQyxhQUFhLEVBQUUsaUNBQWlDLGNBQWMsRUFBRSx3RkFBd0Y7QUFDdmU7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSw4Q0FBOEMsZ0NBQWdDO0FBQzlFLGdDQUFnQztBQUNoQztBQUNBO0FBQ0E7QUFDQSxTQUFTLFlBQVk7QUFDckI7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQSxTQUFTOztBQUVUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7O0FBRVQ7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0QkFBNEI7QUFDNUI7QUFDQTtBQUNBO0FBQ0EsU0FBUzs7QUFFVDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQSxtQ0FBbUM7QUFDbkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0RBQXNEO0FBQ3REO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLDJCQUEyQixpQkFBaUI7QUFDNUM7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtR0FBbUcsc0NBQXNDLEVBQUU7O0FBRTNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLHlEQUF5RDtBQUN6RCx5RUFBeUU7QUFDekU7QUFDQTtBQUNBLDREQUE0RDtBQUM1RCxrRkFBa0Y7QUFDbEY7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0EsOEJBQThCLG1CQUFtQjs7QUFFakQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjs7QUFFakI7QUFDQTs7QUFFQTtBQUNBLGlCQUFpQjtBQUNqQixhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUI7QUFDckI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsMkJBQTJCLFlBQVk7QUFDdkM7QUFDQTtBQUNBO0FBQ0EscUJBQXFCO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSwyQkFBMkIsWUFBWTtBQUN2QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSwyQkFBMkIsWUFBWTtBQUN2QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSwyQkFBMkIsWUFBWTtBQUN2QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCOztBQUVBLGtCQUFrQixZQUFZO0FBQzlCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7O0FBRWI7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGtCQUFrQixZQUFZO0FBQzlCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBa0IsUUFBUTtBQUMxQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQjtBQUNyQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUI7QUFDckI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkJBQTJCLGtCQUFrQjtBQUM3QztBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsc0NBQXNDLGlCQUFpQjs7QUFFdkQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0EsOEJBQThCO0FBQzlCLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSxrQ0FBa0MsbUJBQW1CLGNBQWM7QUFDbkUsK0NBQStDO0FBQy9DO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsK0JBQStCLG1CQUFtQjtBQUNsRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLCtCQUErQixxQkFBcUI7QUFDcEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1JQUFtSTtBQUNuSTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLDJCQUEyQixtQkFBbUI7QUFDOUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLCtDQUErQztBQUMvQyw4Q0FBOEMsYUFBYTtBQUMzRCxpQkFBaUI7QUFDakIsU0FBUztBQUNUO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUEsbUVBQW1FO0FBQ25FO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBLDRDQUE0Qyx3QkFBd0I7QUFDcEU7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSx3QkFBd0IsRUFBRSxTQUFTLEVBQUU7QUFDckMsNEJBQTRCLEVBQUU7QUFDOUIsNEJBQTRCLEVBQUU7QUFDOUI7QUFDQSw2QkFBNkIsRUFBRTtBQUMvQiw2QkFBNkIsRUFBRTtBQUMvQjtBQUNBLGlDQUFpQyxFQUFFO0FBQ25DLHNDQUFzQyxHQUFHO0FBQ3pDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnQ0FBZ0MsRUFBRTtBQUNsQyxpQ0FBaUMsRUFBRTtBQUNuQztBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxnREFBZ0Q7QUFDaEQ7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0Esa0RBQWtELHdCQUF3Qjs7QUFFMUU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0NBQXdDLG1CQUFtQjs7QUFFM0Q7QUFDQSxTQUFTO0FBQ1Q7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUI7QUFDckI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0NBQWtDO0FBQ2xDOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHVDQUF1Qyx1QkFBdUI7O0FBRTlEO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnRkFBZ0Y7QUFDaEY7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlFQUFpRTtBQUNqRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwrQ0FBK0MsMEJBQTBCO0FBQ3pFO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNkJBQTZCO0FBQzdCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtEQUFrRDtBQUNsRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7O0FBRVQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDZCQUE2QjtBQUM3Qjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOzs7Ozs7Ozs7Ozs7O0FDampFRDtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNULEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxHQUFHOztBQUVIOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsU0FBUztBQUN0QixhQUFhLE9BQU87QUFDcEIsZUFBZSxXQUFXO0FBQzFCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxlQUFlLE1BQU07QUFDckI7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLGFBQWE7QUFDMUIsYUFBYSxTQUFTO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLFNBQVM7QUFDdEIsZUFBZSxPQUFPO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsYUFBYSxPQUFPO0FBQ3BCLGFBQWEsU0FBUztBQUN0QixlQUFlLE9BQU87QUFDdEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQSxLQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsYUFBYSxTQUFTO0FBQ3RCLGVBQWUsT0FBTztBQUN0QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVMsSUFBSTtBQUNiO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsMEJBQTBCO0FBQ3ZDLGFBQWEsT0FBTztBQUNwQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSw4RUFBOEU7QUFDOUUsNkNBQTZDO0FBQzdDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVCxTQUFTLFNBQVM7QUFDbEI7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLFNBQVM7QUFDdEIsZUFBZSxTQUFTO0FBQ3hCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxzRkFBc0YsY0FBYztBQUNwRztBQUNBLGNBQWMsZ0JBQWdCLFdBQVc7QUFDekM7QUFDQSxrQkFBa0IsYUFBYTtBQUMvQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWM7QUFDZDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSxDQUFDIiwiZmlsZSI6ImxpYnMvZml4LWllLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyohXG4gKiBodHRwczovL2dpdGh1Yi5jb20vZXMtc2hpbXMvZXM1LXNoaW1cbiAqIEBsaWNlbnNlIGVzNS1zaGltIENvcHlyaWdodCAyMDA5LTIwMTUgYnkgY29udHJpYnV0b3JzLCBNSVQgTGljZW5zZVxuICogc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9lcy1zaGltcy9lczUtc2hpbS9ibG9iL21hc3Rlci9MSUNFTlNFXG4gKi9cblxuLy8gdmltOiB0cz00IHN0cz00IHN3PTQgZXhwYW5kdGFiXG5cbi8vIEFkZCBzZW1pY29sb24gdG8gcHJldmVudCBJSUZFIGZyb20gYmVpbmcgcGFzc2VkIGFzIGFyZ3VtZW50IHRvIGNvbmNhdGVuYXRlZCBjb2RlLlxuO1xuXG4vLyBVTUQgKFVuaXZlcnNhbCBNb2R1bGUgRGVmaW5pdGlvbilcbi8vIHNlZSBodHRwczovL2dpdGh1Yi5jb20vdW1kanMvdW1kL2Jsb2IvbWFzdGVyL3RlbXBsYXRlcy9yZXR1cm5FeHBvcnRzLmpzXG4oZnVuY3Rpb24gKHJvb3QsIGZhY3RvcnkpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICAvKiBnbG9iYWwgZGVmaW5lLCBleHBvcnRzLCBtb2R1bGUgKi9cbiAgICBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG4gICAgICAgIC8vIEFNRC4gUmVnaXN0ZXIgYXMgYW4gYW5vbnltb3VzIG1vZHVsZS5cbiAgICAgICAgZGVmaW5lKGZhY3RvcnkpO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKSB7XG4gICAgICAgIC8vIE5vZGUuIERvZXMgbm90IHdvcmsgd2l0aCBzdHJpY3QgQ29tbW9uSlMsIGJ1dFxuICAgICAgICAvLyBvbmx5IENvbW1vbkpTLWxpa2UgZW52aXJvbWVudHMgdGhhdCBzdXBwb3J0IG1vZHVsZS5leHBvcnRzLFxuICAgICAgICAvLyBsaWtlIE5vZGUuXG4gICAgICAgIG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIEJyb3dzZXIgZ2xvYmFscyAocm9vdCBpcyB3aW5kb3cpXG4gICAgICAgIHJvb3QucmV0dXJuRXhwb3J0cyA9IGZhY3RvcnkoKTtcbiAgICB9XG59KHRoaXMsIGZ1bmN0aW9uICgpIHtcblxuICAgIHZhciBjYWxsID0gRnVuY3Rpb24uY2FsbDtcbiAgICB2YXIgcHJvdG90eXBlT2ZPYmplY3QgPSBPYmplY3QucHJvdG90eXBlO1xuICAgIHZhciBvd25zID0gY2FsbC5iaW5kKHByb3RvdHlwZU9mT2JqZWN0Lmhhc093blByb3BlcnR5KTtcbiAgICB2YXIgaXNFbnVtZXJhYmxlID0gY2FsbC5iaW5kKHByb3RvdHlwZU9mT2JqZWN0LnByb3BlcnR5SXNFbnVtZXJhYmxlKTtcbiAgICB2YXIgdG9TdHIgPSBjYWxsLmJpbmQocHJvdG90eXBlT2ZPYmplY3QudG9TdHJpbmcpO1xuXG4gICAgLy8gSWYgSlMgZW5naW5lIHN1cHBvcnRzIGFjY2Vzc29ycyBjcmVhdGluZyBzaG9ydGN1dHMuXG4gICAgdmFyIGRlZmluZUdldHRlcjtcbiAgICB2YXIgZGVmaW5lU2V0dGVyO1xuICAgIHZhciBsb29rdXBHZXR0ZXI7XG4gICAgdmFyIGxvb2t1cFNldHRlcjtcbiAgICB2YXIgc3VwcG9ydHNBY2Nlc3NvcnMgPSBvd25zKHByb3RvdHlwZU9mT2JqZWN0LCAnX19kZWZpbmVHZXR0ZXJfXycpO1xuICAgIGlmIChzdXBwb3J0c0FjY2Vzc29ycykge1xuICAgICAgICAvKiBlc2xpbnQtZGlzYWJsZSBuby11bmRlcnNjb3JlLWRhbmdsZSwgbm8tcmVzdHJpY3RlZC1wcm9wZXJ0aWVzICovXG4gICAgICAgIGRlZmluZUdldHRlciA9IGNhbGwuYmluZChwcm90b3R5cGVPZk9iamVjdC5fX2RlZmluZUdldHRlcl9fKTtcbiAgICAgICAgZGVmaW5lU2V0dGVyID0gY2FsbC5iaW5kKHByb3RvdHlwZU9mT2JqZWN0Ll9fZGVmaW5lU2V0dGVyX18pO1xuICAgICAgICBsb29rdXBHZXR0ZXIgPSBjYWxsLmJpbmQocHJvdG90eXBlT2ZPYmplY3QuX19sb29rdXBHZXR0ZXJfXyk7XG4gICAgICAgIGxvb2t1cFNldHRlciA9IGNhbGwuYmluZChwcm90b3R5cGVPZk9iamVjdC5fX2xvb2t1cFNldHRlcl9fKTtcbiAgICAgICAgLyogZXNsaW50LWVuYWJsZSBuby11bmRlcnNjb3JlLWRhbmdsZSwgbm8tcmVzdHJpY3RlZC1wcm9wZXJ0aWVzICovXG4gICAgfVxuXG4gICAgdmFyIGlzUHJpbWl0aXZlID0gZnVuY3Rpb24gaXNQcmltaXRpdmUobykge1xuICAgICAgICByZXR1cm4gbyA9PSBudWxsIHx8ICh0eXBlb2YgbyAhPT0gJ29iamVjdCcgJiYgdHlwZW9mIG8gIT09ICdmdW5jdGlvbicpO1xuICAgIH07XG5cbiAgICAvLyBFUzUgMTUuMi4zLjJcbiAgICAvLyBodHRwOi8vZXM1LmdpdGh1Yi5jb20vI3gxNS4yLjMuMlxuICAgIGlmICghT2JqZWN0LmdldFByb3RvdHlwZU9mKSB7XG4gICAgICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9lcy1zaGltcy9lczUtc2hpbS9pc3N1ZXMjaXNzdWUvMlxuICAgICAgICAvLyBodHRwOi8vZWpvaG4ub3JnL2Jsb2cvb2JqZWN0Z2V0cHJvdG90eXBlb2YvXG4gICAgICAgIC8vIHJlY29tbWVuZGVkIGJ5IGZzY2hhZWZlciBvbiBnaXRodWJcbiAgICAgICAgLy9cbiAgICAgICAgLy8gc3VyZSwgYW5kIHdlYnJlZmxlY3Rpb24gc2F5cyBeX15cbiAgICAgICAgLy8gLi4uIHRoaXMgd2lsbCBuZXJldmVyIHBvc3NpYmx5IHJldHVybiBudWxsXG4gICAgICAgIC8vIC4uLiBPcGVyYSBNaW5pIGJyZWFrcyBoZXJlIHdpdGggaW5maW5pdGUgbG9vcHNcbiAgICAgICAgT2JqZWN0LmdldFByb3RvdHlwZU9mID0gZnVuY3Rpb24gZ2V0UHJvdG90eXBlT2Yob2JqZWN0KSB7XG4gICAgICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tcHJvdG9cbiAgICAgICAgICAgIHZhciBwcm90byA9IG9iamVjdC5fX3Byb3RvX187XG4gICAgICAgICAgICBpZiAocHJvdG8gfHwgcHJvdG8gPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcHJvdG87XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRvU3RyKG9iamVjdC5jb25zdHJ1Y3RvcikgPT09ICdbb2JqZWN0IEZ1bmN0aW9uXScpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gb2JqZWN0LmNvbnN0cnVjdG9yLnByb3RvdHlwZTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAob2JqZWN0IGluc3RhbmNlb2YgT2JqZWN0KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHByb3RvdHlwZU9mT2JqZWN0O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBDb3JyZWN0bHkgcmV0dXJuIG51bGwgZm9yIE9iamVjdHMgY3JlYXRlZCB3aXRoIGBPYmplY3QuY3JlYXRlKG51bGwpYFxuICAgICAgICAgICAgICAgIC8vIChzaGFtbWVkIG9yIG5hdGl2ZSkgb3IgYHsgX19wcm90b19fOiBudWxsfWAuICBBbHNvIHJldHVybnMgbnVsbCBmb3JcbiAgICAgICAgICAgICAgICAvLyBjcm9zcy1yZWFsbSBvYmplY3RzIG9uIGJyb3dzZXJzIHRoYXQgbGFjayBgX19wcm90b19fYCBzdXBwb3J0IChsaWtlXG4gICAgICAgICAgICAgICAgLy8gSUUgPDExKSwgYnV0IHRoYXQncyB0aGUgYmVzdCB3ZSBjYW4gZG8uXG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgLy8gRVM1IDE1LjIuMy4zXG4gICAgLy8gaHR0cDovL2VzNS5naXRodWIuY29tLyN4MTUuMi4zLjNcblxuICAgIHZhciBkb2VzR2V0T3duUHJvcGVydHlEZXNjcmlwdG9yV29yayA9IGZ1bmN0aW9uIGRvZXNHZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JXb3JrKG9iamVjdCkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgb2JqZWN0LnNlbnRpbmVsID0gMDtcbiAgICAgICAgICAgIHJldHVybiBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKG9iamVjdCwgJ3NlbnRpbmVsJykudmFsdWUgPT09IDA7XG4gICAgICAgIH0gY2F0Y2ggKGV4Y2VwdGlvbikge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIC8vIGNoZWNrIHdoZXRoZXIgZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yIHdvcmtzIGlmIGl0J3MgZ2l2ZW4uIE90aGVyd2lzZSwgc2hpbSBwYXJ0aWFsbHkuXG4gICAgaWYgKE9iamVjdC5kZWZpbmVQcm9wZXJ0eSkge1xuICAgICAgICB2YXIgZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yV29ya3NPbk9iamVjdCA9IGRvZXNHZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JXb3JrKHt9KTtcbiAgICAgICAgdmFyIGdldE93blByb3BlcnR5RGVzY3JpcHRvcldvcmtzT25Eb20gPSB0eXBlb2YgZG9jdW1lbnQgPT09ICd1bmRlZmluZWQnXG4gICAgICAgICAgICB8fCBkb2VzR2V0T3duUHJvcGVydHlEZXNjcmlwdG9yV29yayhkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKSk7XG4gICAgICAgIGlmICghZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yV29ya3NPbkRvbSB8fCAhZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yV29ya3NPbk9iamVjdCkge1xuICAgICAgICAgICAgdmFyIGdldE93blByb3BlcnR5RGVzY3JpcHRvckZhbGxiYWNrID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcjtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGlmICghT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvciB8fCBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JGYWxsYmFjaykge1xuICAgICAgICB2YXIgRVJSX05PTl9PQkpFQ1QgPSAnT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvciBjYWxsZWQgb24gYSBub24tb2JqZWN0OiAnO1xuXG4gICAgICAgIC8qIGVzbGludC1kaXNhYmxlIG5vLXByb3RvICovXG4gICAgICAgIE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IgPSBmdW5jdGlvbiBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Iob2JqZWN0LCBwcm9wZXJ0eSkge1xuICAgICAgICAgICAgaWYgKGlzUHJpbWl0aXZlKG9iamVjdCkpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKEVSUl9OT05fT0JKRUNUICsgb2JqZWN0KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gbWFrZSBhIHZhbGlhbnQgYXR0ZW1wdCB0byB1c2UgdGhlIHJlYWwgZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yXG4gICAgICAgICAgICAvLyBmb3IgSTgncyBET00gZWxlbWVudHMuXG4gICAgICAgICAgICBpZiAoZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yRmFsbGJhY2spIHtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yRmFsbGJhY2suY2FsbChPYmplY3QsIG9iamVjdCwgcHJvcGVydHkpO1xuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGV4Y2VwdGlvbikge1xuICAgICAgICAgICAgICAgICAgICAvLyB0cnkgdGhlIHNoaW0gaWYgdGhlIHJlYWwgb25lIGRvZXNuJ3Qgd29ya1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIGRlc2NyaXB0b3I7XG5cbiAgICAgICAgICAgIC8vIElmIG9iamVjdCBkb2VzIG5vdCBvd25zIHByb3BlcnR5IHJldHVybiB1bmRlZmluZWQgaW1tZWRpYXRlbHkuXG4gICAgICAgICAgICBpZiAoIW93bnMob2JqZWN0LCBwcm9wZXJ0eSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZGVzY3JpcHRvcjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gSWYgb2JqZWN0IGhhcyBhIHByb3BlcnR5IHRoZW4gaXQncyBmb3Igc3VyZSBgY29uZmlndXJhYmxlYCwgYW5kXG4gICAgICAgICAgICAvLyBwcm9iYWJseSBgZW51bWVyYWJsZWAuIERldGVjdCBlbnVtZXJhYmlsaXR5IHRob3VnaC5cbiAgICAgICAgICAgIGRlc2NyaXB0b3IgPSB7XG4gICAgICAgICAgICAgICAgZW51bWVyYWJsZTogaXNFbnVtZXJhYmxlKG9iamVjdCwgcHJvcGVydHkpLFxuICAgICAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgLy8gSWYgSlMgZW5naW5lIHN1cHBvcnRzIGFjY2Vzc29yIHByb3BlcnRpZXMgdGhlbiBwcm9wZXJ0eSBtYXkgYmUgYVxuICAgICAgICAgICAgLy8gZ2V0dGVyIG9yIHNldHRlci5cbiAgICAgICAgICAgIGlmIChzdXBwb3J0c0FjY2Vzc29ycykge1xuICAgICAgICAgICAgICAgIC8vIFVuZm9ydHVuYXRlbHkgYF9fbG9va3VwR2V0dGVyX19gIHdpbGwgcmV0dXJuIGEgZ2V0dGVyIGV2ZW5cbiAgICAgICAgICAgICAgICAvLyBpZiBvYmplY3QgaGFzIG93biBub24gZ2V0dGVyIHByb3BlcnR5IGFsb25nIHdpdGggYSBzYW1lIG5hbWVkXG4gICAgICAgICAgICAgICAgLy8gaW5oZXJpdGVkIGdldHRlci4gVG8gYXZvaWQgbWlzYmVoYXZpb3Igd2UgdGVtcG9yYXJ5IHJlbW92ZVxuICAgICAgICAgICAgICAgIC8vIGBfX3Byb3RvX19gIHNvIHRoYXQgYF9fbG9va3VwR2V0dGVyX19gIHdpbGwgcmV0dXJuIGdldHRlciBvbmx5XG4gICAgICAgICAgICAgICAgLy8gaWYgaXQncyBvd25lZCBieSBhbiBvYmplY3QuXG4gICAgICAgICAgICAgICAgdmFyIHByb3RvdHlwZSA9IG9iamVjdC5fX3Byb3RvX187XG4gICAgICAgICAgICAgICAgdmFyIG5vdFByb3RvdHlwZU9mT2JqZWN0ID0gb2JqZWN0ICE9PSBwcm90b3R5cGVPZk9iamVjdDtcbiAgICAgICAgICAgICAgICAvLyBhdm9pZCByZWN1cnNpb24gcHJvYmxlbSwgYnJlYWtpbmcgaW4gT3BlcmEgTWluaSB3aGVuXG4gICAgICAgICAgICAgICAgLy8gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihPYmplY3QucHJvdG90eXBlLCAndG9TdHJpbmcnKVxuICAgICAgICAgICAgICAgIC8vIG9yIGFueSBvdGhlciBPYmplY3QucHJvdG90eXBlIGFjY2Vzc29yXG4gICAgICAgICAgICAgICAgaWYgKG5vdFByb3RvdHlwZU9mT2JqZWN0KSB7XG4gICAgICAgICAgICAgICAgICAgIG9iamVjdC5fX3Byb3RvX18gPSBwcm90b3R5cGVPZk9iamVjdDtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB2YXIgZ2V0dGVyID0gbG9va3VwR2V0dGVyKG9iamVjdCwgcHJvcGVydHkpO1xuICAgICAgICAgICAgICAgIHZhciBzZXR0ZXIgPSBsb29rdXBTZXR0ZXIob2JqZWN0LCBwcm9wZXJ0eSk7XG5cbiAgICAgICAgICAgICAgICBpZiAobm90UHJvdG90eXBlT2ZPYmplY3QpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gT25jZSB3ZSBoYXZlIGdldHRlciBhbmQgc2V0dGVyIHdlIGNhbiBwdXQgdmFsdWVzIGJhY2suXG4gICAgICAgICAgICAgICAgICAgIG9iamVjdC5fX3Byb3RvX18gPSBwcm90b3R5cGU7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKGdldHRlciB8fCBzZXR0ZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGdldHRlcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRvci5nZXQgPSBnZXR0ZXI7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKHNldHRlcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRvci5zZXQgPSBzZXR0ZXI7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgLy8gSWYgaXQgd2FzIGFjY2Vzc29yIHByb3BlcnR5IHdlJ3JlIGRvbmUgYW5kIHJldHVybiBoZXJlXG4gICAgICAgICAgICAgICAgICAgIC8vIGluIG9yZGVyIHRvIGF2b2lkIGFkZGluZyBgdmFsdWVgIHRvIHRoZSBkZXNjcmlwdG9yLlxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGVzY3JpcHRvcjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIElmIHdlIGdvdCB0aGlzIGZhciB3ZSBrbm93IHRoYXQgb2JqZWN0IGhhcyBhbiBvd24gcHJvcGVydHkgdGhhdCBpc1xuICAgICAgICAgICAgLy8gbm90IGFuIGFjY2Vzc29yIHNvIHdlIHNldCBpdCBhcyBhIHZhbHVlIGFuZCByZXR1cm4gZGVzY3JpcHRvci5cbiAgICAgICAgICAgIGRlc2NyaXB0b3IudmFsdWUgPSBvYmplY3RbcHJvcGVydHldO1xuICAgICAgICAgICAgZGVzY3JpcHRvci53cml0YWJsZSA9IHRydWU7XG4gICAgICAgICAgICByZXR1cm4gZGVzY3JpcHRvcjtcbiAgICAgICAgfTtcbiAgICAgICAgLyogZXNsaW50LWVuYWJsZSBuby1wcm90byAqL1xuICAgIH1cblxuICAgIC8vIEVTNSAxNS4yLjMuNFxuICAgIC8vIGh0dHA6Ly9lczUuZ2l0aHViLmNvbS8jeDE1LjIuMy40XG4gICAgaWYgKCFPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcykge1xuICAgICAgICBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyA9IGZ1bmN0aW9uIGdldE93blByb3BlcnR5TmFtZXMob2JqZWN0KSB7XG4gICAgICAgICAgICByZXR1cm4gT2JqZWN0LmtleXMob2JqZWN0KTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICAvLyBFUzUgMTUuMi4zLjVcbiAgICAvLyBodHRwOi8vZXM1LmdpdGh1Yi5jb20vI3gxNS4yLjMuNVxuICAgIGlmICghT2JqZWN0LmNyZWF0ZSkge1xuXG4gICAgICAgIC8vIENvbnRyaWJ1dGVkIGJ5IEJyYW5kb24gQmVudmllLCBPY3RvYmVyLCAyMDEyXG4gICAgICAgIHZhciBjcmVhdGVFbXB0eTtcbiAgICAgICAgdmFyIHN1cHBvcnRzUHJvdG8gPSAhKHsgX19wcm90b19fOiBudWxsIH0gaW5zdGFuY2VvZiBPYmplY3QpO1xuICAgICAgICAvLyB0aGUgZm9sbG93aW5nIHByb2R1Y2VzIGZhbHNlIHBvc2l0aXZlc1xuICAgICAgICAvLyBpbiBPcGVyYSBNaW5pID0+IG5vdCBhIHJlbGlhYmxlIGNoZWNrXG4gICAgICAgIC8vIE9iamVjdC5wcm90b3R5cGUuX19wcm90b19fID09PSBudWxsXG5cbiAgICAgICAgLy8gQ2hlY2sgZm9yIGRvY3VtZW50LmRvbWFpbiBhbmQgYWN0aXZlIHggc3VwcG9ydFxuICAgICAgICAvLyBObyBuZWVkIHRvIHVzZSBhY3RpdmUgeCBhcHByb2FjaCB3aGVuIGRvY3VtZW50LmRvbWFpbiBpcyBub3Qgc2V0XG4gICAgICAgIC8vIHNlZSBodHRwczovL2dpdGh1Yi5jb20vZXMtc2hpbXMvZXM1LXNoaW0vaXNzdWVzLzE1MFxuICAgICAgICAvLyB2YXJpYXRpb24gb2YgaHR0cHM6Ly9naXRodWIuY29tL2tpdGNhbWJyaWRnZS9lczUtc2hpbS9jb21taXQvNGY3MzhhYzA2NjM0NlxuICAgICAgICAvKiBnbG9iYWwgQWN0aXZlWE9iamVjdCAqL1xuICAgICAgICB2YXIgc2hvdWxkVXNlQWN0aXZlWCA9IGZ1bmN0aW9uIHNob3VsZFVzZUFjdGl2ZVgoKSB7XG4gICAgICAgICAgICAvLyByZXR1cm4gZWFybHkgaWYgZG9jdW1lbnQuZG9tYWluIG5vdCBzZXRcbiAgICAgICAgICAgIGlmICghZG9jdW1lbnQuZG9tYWluKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIHJldHVybiAhIW5ldyBBY3RpdmVYT2JqZWN0KCdodG1sZmlsZScpO1xuICAgICAgICAgICAgfSBjYXRjaCAoZXhjZXB0aW9uKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIC8vIFRoaXMgc3VwcG9ydHMgSUU4IHdoZW4gZG9jdW1lbnQuZG9tYWluIGlzIHVzZWRcbiAgICAgICAgLy8gc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9lcy1zaGltcy9lczUtc2hpbS9pc3N1ZXMvMTUwXG4gICAgICAgIC8vIHZhcmlhdGlvbiBvZiBodHRwczovL2dpdGh1Yi5jb20va2l0Y2FtYnJpZGdlL2VzNS1zaGltL2NvbW1pdC80ZjczOGFjMDY2MzQ2XG4gICAgICAgIHZhciBnZXRFbXB0eVZpYUFjdGl2ZVggPSBmdW5jdGlvbiBnZXRFbXB0eVZpYUFjdGl2ZVgoKSB7XG4gICAgICAgICAgICB2YXIgZW1wdHk7XG4gICAgICAgICAgICB2YXIgeERvYztcblxuICAgICAgICAgICAgeERvYyA9IG5ldyBBY3RpdmVYT2JqZWN0KCdodG1sZmlsZScpO1xuXG4gICAgICAgICAgICB2YXIgc2NyaXB0ID0gJ3NjcmlwdCc7XG4gICAgICAgICAgICB4RG9jLndyaXRlKCc8JyArIHNjcmlwdCArICc+PC8nICsgc2NyaXB0ICsgJz4nKTtcbiAgICAgICAgICAgIHhEb2MuY2xvc2UoKTtcblxuICAgICAgICAgICAgZW1wdHkgPSB4RG9jLnBhcmVudFdpbmRvdy5PYmplY3QucHJvdG90eXBlO1xuICAgICAgICAgICAgeERvYyA9IG51bGw7XG5cbiAgICAgICAgICAgIHJldHVybiBlbXB0eTtcbiAgICAgICAgfTtcblxuICAgICAgICAvLyBUaGUgb3JpZ2luYWwgaW1wbGVtZW50YXRpb24gdXNpbmcgYW4gaWZyYW1lXG4gICAgICAgIC8vIGJlZm9yZSB0aGUgYWN0aXZleCBhcHByb2FjaCB3YXMgYWRkZWRcbiAgICAgICAgLy8gc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9lcy1zaGltcy9lczUtc2hpbS9pc3N1ZXMvMTUwXG4gICAgICAgIHZhciBnZXRFbXB0eVZpYUlGcmFtZSA9IGZ1bmN0aW9uIGdldEVtcHR5VmlhSUZyYW1lKCkge1xuICAgICAgICAgICAgdmFyIGlmcmFtZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lmcmFtZScpO1xuICAgICAgICAgICAgdmFyIHBhcmVudCA9IGRvY3VtZW50LmJvZHkgfHwgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50O1xuICAgICAgICAgICAgdmFyIGVtcHR5O1xuXG4gICAgICAgICAgICBpZnJhbWUuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgICAgICAgIHBhcmVudC5hcHBlbmRDaGlsZChpZnJhbWUpO1xuICAgICAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXNjcmlwdC11cmxcbiAgICAgICAgICAgIGlmcmFtZS5zcmMgPSAnamF2YXNjcmlwdDonO1xuXG4gICAgICAgICAgICBlbXB0eSA9IGlmcmFtZS5jb250ZW50V2luZG93Lk9iamVjdC5wcm90b3R5cGU7XG4gICAgICAgICAgICBwYXJlbnQucmVtb3ZlQ2hpbGQoaWZyYW1lKTtcbiAgICAgICAgICAgIGlmcmFtZSA9IG51bGw7XG5cbiAgICAgICAgICAgIHJldHVybiBlbXB0eTtcbiAgICAgICAgfTtcblxuICAgICAgICAvKiBnbG9iYWwgZG9jdW1lbnQgKi9cbiAgICAgICAgaWYgKHN1cHBvcnRzUHJvdG8gfHwgdHlwZW9mIGRvY3VtZW50ID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgY3JlYXRlRW1wdHkgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHsgX19wcm90b19fOiBudWxsIH07XG4gICAgICAgICAgICB9O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gSW4gb2xkIElFIF9fcHJvdG9fXyBjYW4ndCBiZSB1c2VkIHRvIG1hbnVhbGx5IHNldCBgbnVsbGAsIG5vciBkb2VzXG4gICAgICAgICAgICAvLyBhbnkgb3RoZXIgbWV0aG9kIGV4aXN0IHRvIG1ha2UgYW4gb2JqZWN0IHRoYXQgaW5oZXJpdHMgZnJvbSBub3RoaW5nLFxuICAgICAgICAgICAgLy8gYXNpZGUgZnJvbSBPYmplY3QucHJvdG90eXBlIGl0c2VsZi4gSW5zdGVhZCwgY3JlYXRlIGEgbmV3IGdsb2JhbFxuICAgICAgICAgICAgLy8gb2JqZWN0IGFuZCAqc3RlYWwqIGl0cyBPYmplY3QucHJvdG90eXBlIGFuZCBzdHJpcCBpdCBiYXJlLiBUaGlzIGlzXG4gICAgICAgICAgICAvLyB1c2VkIGFzIHRoZSBwcm90b3R5cGUgdG8gY3JlYXRlIG51bGxhcnkgb2JqZWN0cy5cbiAgICAgICAgICAgIGNyZWF0ZUVtcHR5ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIC8vIERldGVybWluZSB3aGljaCBhcHByb2FjaCB0byB1c2VcbiAgICAgICAgICAgICAgICAvLyBzZWUgaHR0cHM6Ly9naXRodWIuY29tL2VzLXNoaW1zL2VzNS1zaGltL2lzc3Vlcy8xNTBcbiAgICAgICAgICAgICAgICB2YXIgZW1wdHkgPSBzaG91bGRVc2VBY3RpdmVYKCkgPyBnZXRFbXB0eVZpYUFjdGl2ZVgoKSA6IGdldEVtcHR5VmlhSUZyYW1lKCk7XG5cbiAgICAgICAgICAgICAgICBkZWxldGUgZW1wdHkuY29uc3RydWN0b3I7XG4gICAgICAgICAgICAgICAgZGVsZXRlIGVtcHR5Lmhhc093blByb3BlcnR5O1xuICAgICAgICAgICAgICAgIGRlbGV0ZSBlbXB0eS5wcm9wZXJ0eUlzRW51bWVyYWJsZTtcbiAgICAgICAgICAgICAgICBkZWxldGUgZW1wdHkuaXNQcm90b3R5cGVPZjtcbiAgICAgICAgICAgICAgICBkZWxldGUgZW1wdHkudG9Mb2NhbGVTdHJpbmc7XG4gICAgICAgICAgICAgICAgZGVsZXRlIGVtcHR5LnRvU3RyaW5nO1xuICAgICAgICAgICAgICAgIGRlbGV0ZSBlbXB0eS52YWx1ZU9mO1xuXG4gICAgICAgICAgICAgICAgdmFyIEVtcHR5ID0gZnVuY3Rpb24gRW1wdHkoKSB7fTtcbiAgICAgICAgICAgICAgICBFbXB0eS5wcm90b3R5cGUgPSBlbXB0eTtcbiAgICAgICAgICAgICAgICAvLyBzaG9ydC1jaXJjdWl0IGZ1dHVyZSBjYWxsc1xuICAgICAgICAgICAgICAgIGNyZWF0ZUVtcHR5ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmV3IEVtcHR5KCk7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IEVtcHR5KCk7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgT2JqZWN0LmNyZWF0ZSA9IGZ1bmN0aW9uIGNyZWF0ZShwcm90b3R5cGUsIHByb3BlcnRpZXMpIHtcblxuICAgICAgICAgICAgdmFyIG9iamVjdDtcbiAgICAgICAgICAgIHZhciBUeXBlID0gZnVuY3Rpb24gVHlwZSgpIHt9OyAvLyBBbiBlbXB0eSBjb25zdHJ1Y3Rvci5cblxuICAgICAgICAgICAgaWYgKHByb3RvdHlwZSA9PT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIG9iamVjdCA9IGNyZWF0ZUVtcHR5KCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmIChwcm90b3R5cGUgIT09IG51bGwgJiYgaXNQcmltaXRpdmUocHJvdG90eXBlKSkge1xuICAgICAgICAgICAgICAgICAgICAvLyBJbiB0aGUgbmF0aXZlIGltcGxlbWVudGF0aW9uIGBwYXJlbnRgIGNhbiBiZSBgbnVsbGBcbiAgICAgICAgICAgICAgICAgICAgLy8gT1IgKmFueSogYGluc3RhbmNlb2YgT2JqZWN0YCAgKE9iamVjdHxGdW5jdGlvbnxBcnJheXxSZWdFeHB8ZXRjKVxuICAgICAgICAgICAgICAgICAgICAvLyBVc2UgYHR5cGVvZmAgdGhvLCBiL2MgaW4gb2xkIElFLCBET00gZWxlbWVudHMgYXJlIG5vdCBgaW5zdGFuY2VvZiBPYmplY3RgXG4gICAgICAgICAgICAgICAgICAgIC8vIGxpa2UgdGhleSBhcmUgaW4gbW9kZXJuIGJyb3dzZXJzLiBVc2luZyBgT2JqZWN0LmNyZWF0ZWAgb24gRE9NIGVsZW1lbnRzXG4gICAgICAgICAgICAgICAgICAgIC8vIGlzLi4uZXJyLi4ucHJvYmFibHkgaW5hcHByb3ByaWF0ZSwgYnV0IHRoZSBuYXRpdmUgdmVyc2lvbiBhbGxvd3MgZm9yIGl0LlxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdPYmplY3QgcHJvdG90eXBlIG1heSBvbmx5IGJlIGFuIE9iamVjdCBvciBudWxsJyk7IC8vIHNhbWUgbXNnIGFzIENocm9tZVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBUeXBlLnByb3RvdHlwZSA9IHByb3RvdHlwZTtcbiAgICAgICAgICAgICAgICBvYmplY3QgPSBuZXcgVHlwZSgpO1xuICAgICAgICAgICAgICAgIC8vIElFIGhhcyBubyBidWlsdC1pbiBpbXBsZW1lbnRhdGlvbiBvZiBgT2JqZWN0LmdldFByb3RvdHlwZU9mYFxuICAgICAgICAgICAgICAgIC8vIG5laXRoZXIgYF9fcHJvdG9fX2AsIGJ1dCB0aGlzIG1hbnVhbGx5IHNldHRpbmcgYF9fcHJvdG9fX2Agd2lsbFxuICAgICAgICAgICAgICAgIC8vIGd1YXJhbnRlZSB0aGF0IGBPYmplY3QuZ2V0UHJvdG90eXBlT2ZgIHdpbGwgd29yayBhcyBleHBlY3RlZCB3aXRoXG4gICAgICAgICAgICAgICAgLy8gb2JqZWN0cyBjcmVhdGVkIHVzaW5nIGBPYmplY3QuY3JlYXRlYFxuICAgICAgICAgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1wcm90b1xuICAgICAgICAgICAgICAgIG9iamVjdC5fX3Byb3RvX18gPSBwcm90b3R5cGU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChwcm9wZXJ0aWVzICE9PSB2b2lkIDApIHtcbiAgICAgICAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydGllcyhvYmplY3QsIHByb3BlcnRpZXMpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gb2JqZWN0O1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIC8vIEVTNSAxNS4yLjMuNlxuICAgIC8vIGh0dHA6Ly9lczUuZ2l0aHViLmNvbS8jeDE1LjIuMy42XG5cbiAgICAvLyBQYXRjaCBmb3IgV2ViS2l0IGFuZCBJRTggc3RhbmRhcmQgbW9kZVxuICAgIC8vIERlc2lnbmVkIGJ5IGhheCA8aGF4LmdpdGh1Yi5jb20+XG4gICAgLy8gcmVsYXRlZCBpc3N1ZTogaHR0cHM6Ly9naXRodWIuY29tL2VzLXNoaW1zL2VzNS1zaGltL2lzc3VlcyNpc3N1ZS81XG4gICAgLy8gSUU4IFJlZmVyZW5jZTpcbiAgICAvLyAgICAgaHR0cDovL21zZG4ubWljcm9zb2Z0LmNvbS9lbi11cy9saWJyYXJ5L2RkMjgyOTAwLmFzcHhcbiAgICAvLyAgICAgaHR0cDovL21zZG4ubWljcm9zb2Z0LmNvbS9lbi11cy9saWJyYXJ5L2RkMjI5OTE2LmFzcHhcbiAgICAvLyBXZWJLaXQgQnVnczpcbiAgICAvLyAgICAgaHR0cHM6Ly9idWdzLndlYmtpdC5vcmcvc2hvd19idWcuY2dpP2lkPTM2NDIzXG5cbiAgICB2YXIgZG9lc0RlZmluZVByb3BlcnR5V29yayA9IGZ1bmN0aW9uIGRvZXNEZWZpbmVQcm9wZXJ0eVdvcmsob2JqZWN0KSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqZWN0LCAnc2VudGluZWwnLCB7fSk7XG4gICAgICAgICAgICByZXR1cm4gJ3NlbnRpbmVsJyBpbiBvYmplY3Q7XG4gICAgICAgIH0gY2F0Y2ggKGV4Y2VwdGlvbikge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIC8vIGNoZWNrIHdoZXRoZXIgZGVmaW5lUHJvcGVydHkgd29ya3MgaWYgaXQncyBnaXZlbi4gT3RoZXJ3aXNlLFxuICAgIC8vIHNoaW0gcGFydGlhbGx5LlxuICAgIGlmIChPYmplY3QuZGVmaW5lUHJvcGVydHkpIHtcbiAgICAgICAgdmFyIGRlZmluZVByb3BlcnR5V29ya3NPbk9iamVjdCA9IGRvZXNEZWZpbmVQcm9wZXJ0eVdvcmsoe30pO1xuICAgICAgICB2YXIgZGVmaW5lUHJvcGVydHlXb3Jrc09uRG9tID0gdHlwZW9mIGRvY3VtZW50ID09PSAndW5kZWZpbmVkJ1xuICAgICAgICAgICAgfHwgZG9lc0RlZmluZVByb3BlcnR5V29yayhkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKSk7XG4gICAgICAgIGlmICghZGVmaW5lUHJvcGVydHlXb3Jrc09uT2JqZWN0IHx8ICFkZWZpbmVQcm9wZXJ0eVdvcmtzT25Eb20pIHtcbiAgICAgICAgICAgIHZhciBkZWZpbmVQcm9wZXJ0eUZhbGxiYWNrID0gT2JqZWN0LmRlZmluZVByb3BlcnR5LFxuICAgICAgICAgICAgICAgIGRlZmluZVByb3BlcnRpZXNGYWxsYmFjayA9IE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgaWYgKCFPYmplY3QuZGVmaW5lUHJvcGVydHkgfHwgZGVmaW5lUHJvcGVydHlGYWxsYmFjaykge1xuICAgICAgICB2YXIgRVJSX05PTl9PQkpFQ1RfREVTQ1JJUFRPUiA9ICdQcm9wZXJ0eSBkZXNjcmlwdGlvbiBtdXN0IGJlIGFuIG9iamVjdDogJztcbiAgICAgICAgdmFyIEVSUl9OT05fT0JKRUNUX1RBUkdFVCA9ICdPYmplY3QuZGVmaW5lUHJvcGVydHkgY2FsbGVkIG9uIG5vbi1vYmplY3Q6ICc7XG4gICAgICAgIHZhciBFUlJfQUNDRVNTT1JTX05PVF9TVVBQT1JURUQgPSAnZ2V0dGVycyAmIHNldHRlcnMgY2FuIG5vdCBiZSBkZWZpbmVkIG9uIHRoaXMgamF2YXNjcmlwdCBlbmdpbmUnO1xuXG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSA9IGZ1bmN0aW9uIGRlZmluZVByb3BlcnR5KG9iamVjdCwgcHJvcGVydHksIGRlc2NyaXB0b3IpIHtcbiAgICAgICAgICAgIGlmIChpc1ByaW1pdGl2ZShvYmplY3QpKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihFUlJfTk9OX09CSkVDVF9UQVJHRVQgKyBvYmplY3QpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGlzUHJpbWl0aXZlKGRlc2NyaXB0b3IpKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihFUlJfTk9OX09CSkVDVF9ERVNDUklQVE9SICsgZGVzY3JpcHRvcik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBtYWtlIGEgdmFsaWFudCBhdHRlbXB0IHRvIHVzZSB0aGUgcmVhbCBkZWZpbmVQcm9wZXJ0eVxuICAgICAgICAgICAgLy8gZm9yIEk4J3MgRE9NIGVsZW1lbnRzLlxuICAgICAgICAgICAgaWYgKGRlZmluZVByb3BlcnR5RmFsbGJhY2spIHtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGVmaW5lUHJvcGVydHlGYWxsYmFjay5jYWxsKE9iamVjdCwgb2JqZWN0LCBwcm9wZXJ0eSwgZGVzY3JpcHRvcik7XG4gICAgICAgICAgICAgICAgfSBjYXRjaCAoZXhjZXB0aW9uKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIHRyeSB0aGUgc2hpbSBpZiB0aGUgcmVhbCBvbmUgZG9lc24ndCB3b3JrXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBJZiBpdCdzIGEgZGF0YSBwcm9wZXJ0eS5cbiAgICAgICAgICAgIGlmICgndmFsdWUnIGluIGRlc2NyaXB0b3IpIHtcbiAgICAgICAgICAgICAgICAvLyBmYWlsIHNpbGVudGx5IGlmICd3cml0YWJsZScsICdlbnVtZXJhYmxlJywgb3IgJ2NvbmZpZ3VyYWJsZSdcbiAgICAgICAgICAgICAgICAvLyBhcmUgcmVxdWVzdGVkIGJ1dCBub3Qgc3VwcG9ydGVkXG4gICAgICAgICAgICAgICAgLypcbiAgICAgICAgICAgICAgICAvLyBhbHRlcm5hdGUgYXBwcm9hY2g6XG4gICAgICAgICAgICAgICAgaWYgKCAvLyBjYW4ndCBpbXBsZW1lbnQgdGhlc2UgZmVhdHVyZXM7IGFsbG93IGZhbHNlIGJ1dCBub3QgdHJ1ZVxuICAgICAgICAgICAgICAgICAgICAoJ3dyaXRhYmxlJyBpbiBkZXNjcmlwdG9yICYmICFkZXNjcmlwdG9yLndyaXRhYmxlKSB8fFxuICAgICAgICAgICAgICAgICAgICAoJ2VudW1lcmFibGUnIGluIGRlc2NyaXB0b3IgJiYgIWRlc2NyaXB0b3IuZW51bWVyYWJsZSkgfHxcbiAgICAgICAgICAgICAgICAgICAgKCdjb25maWd1cmFibGUnIGluIGRlc2NyaXB0b3IgJiYgIWRlc2NyaXB0b3IuY29uZmlndXJhYmxlKVxuICAgICAgICAgICAgICAgICkpXG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBSYW5nZUVycm9yKFxuICAgICAgICAgICAgICAgICAgICAgICAgJ1RoaXMgaW1wbGVtZW50YXRpb24gb2YgT2JqZWN0LmRlZmluZVByb3BlcnR5IGRvZXMgbm90IHN1cHBvcnQgY29uZmlndXJhYmxlLCBlbnVtZXJhYmxlLCBvciB3cml0YWJsZS4nXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgKi9cblxuICAgICAgICAgICAgICAgIGlmIChzdXBwb3J0c0FjY2Vzc29ycyAmJiAobG9va3VwR2V0dGVyKG9iamVjdCwgcHJvcGVydHkpIHx8IGxvb2t1cFNldHRlcihvYmplY3QsIHByb3BlcnR5KSkpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gQXMgYWNjZXNzb3JzIGFyZSBzdXBwb3J0ZWQgb25seSBvbiBlbmdpbmVzIGltcGxlbWVudGluZ1xuICAgICAgICAgICAgICAgICAgICAvLyBgX19wcm90b19fYCB3ZSBjYW4gc2FmZWx5IG92ZXJyaWRlIGBfX3Byb3RvX19gIHdoaWxlIGRlZmluaW5nXG4gICAgICAgICAgICAgICAgICAgIC8vIGEgcHJvcGVydHkgdG8gbWFrZSBzdXJlIHRoYXQgd2UgZG9uJ3QgaGl0IGFuIGluaGVyaXRlZFxuICAgICAgICAgICAgICAgICAgICAvLyBhY2Nlc3Nvci5cbiAgICAgICAgICAgICAgICAgICAgLyogZXNsaW50LWRpc2FibGUgbm8tcHJvdG8gKi9cbiAgICAgICAgICAgICAgICAgICAgdmFyIHByb3RvdHlwZSA9IG9iamVjdC5fX3Byb3RvX187XG4gICAgICAgICAgICAgICAgICAgIG9iamVjdC5fX3Byb3RvX18gPSBwcm90b3R5cGVPZk9iamVjdDtcbiAgICAgICAgICAgICAgICAgICAgLy8gRGVsZXRpbmcgYSBwcm9wZXJ0eSBhbnl3YXkgc2luY2UgZ2V0dGVyIC8gc2V0dGVyIG1heSBiZVxuICAgICAgICAgICAgICAgICAgICAvLyBkZWZpbmVkIG9uIG9iamVjdCBpdHNlbGYuXG4gICAgICAgICAgICAgICAgICAgIGRlbGV0ZSBvYmplY3RbcHJvcGVydHldO1xuICAgICAgICAgICAgICAgICAgICBvYmplY3RbcHJvcGVydHldID0gZGVzY3JpcHRvci52YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgLy8gU2V0dGluZyBvcmlnaW5hbCBgX19wcm90b19fYCBiYWNrIG5vdy5cbiAgICAgICAgICAgICAgICAgICAgb2JqZWN0Ll9fcHJvdG9fXyA9IHByb3RvdHlwZTtcbiAgICAgICAgICAgICAgICAgICAgLyogZXNsaW50LWVuYWJsZSBuby1wcm90byAqL1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIG9iamVjdFtwcm9wZXJ0eV0gPSBkZXNjcmlwdG9yLnZhbHVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdmFyIGhhc0dldHRlciA9ICdnZXQnIGluIGRlc2NyaXB0b3I7XG4gICAgICAgICAgICAgICAgdmFyIGhhc1NldHRlciA9ICdzZXQnIGluIGRlc2NyaXB0b3I7XG4gICAgICAgICAgICAgICAgaWYgKCFzdXBwb3J0c0FjY2Vzc29ycyAmJiAoaGFzR2V0dGVyIHx8IGhhc1NldHRlcikpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihFUlJfQUNDRVNTT1JTX05PVF9TVVBQT1JURUQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyBJZiB3ZSBnb3QgdGhhdCBmYXIgdGhlbiBnZXR0ZXJzIGFuZCBzZXR0ZXJzIGNhbiBiZSBkZWZpbmVkICEhXG4gICAgICAgICAgICAgICAgaWYgKGhhc0dldHRlcikge1xuICAgICAgICAgICAgICAgICAgICBkZWZpbmVHZXR0ZXIob2JqZWN0LCBwcm9wZXJ0eSwgZGVzY3JpcHRvci5nZXQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoaGFzU2V0dGVyKSB7XG4gICAgICAgICAgICAgICAgICAgIGRlZmluZVNldHRlcihvYmplY3QsIHByb3BlcnR5LCBkZXNjcmlwdG9yLnNldCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIG9iamVjdDtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICAvLyBFUzUgMTUuMi4zLjdcbiAgICAvLyBodHRwOi8vZXM1LmdpdGh1Yi5jb20vI3gxNS4yLjMuN1xuICAgIGlmICghT2JqZWN0LmRlZmluZVByb3BlcnRpZXMgfHwgZGVmaW5lUHJvcGVydGllc0ZhbGxiYWNrKSB7XG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzID0gZnVuY3Rpb24gZGVmaW5lUHJvcGVydGllcyhvYmplY3QsIHByb3BlcnRpZXMpIHtcbiAgICAgICAgICAgIC8vIG1ha2UgYSB2YWxpYW50IGF0dGVtcHQgdG8gdXNlIHRoZSByZWFsIGRlZmluZVByb3BlcnRpZXNcbiAgICAgICAgICAgIGlmIChkZWZpbmVQcm9wZXJ0aWVzRmFsbGJhY2spIHtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGVmaW5lUHJvcGVydGllc0ZhbGxiYWNrLmNhbGwoT2JqZWN0LCBvYmplY3QsIHByb3BlcnRpZXMpO1xuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGV4Y2VwdGlvbikge1xuICAgICAgICAgICAgICAgICAgICAvLyB0cnkgdGhlIHNoaW0gaWYgdGhlIHJlYWwgb25lIGRvZXNuJ3Qgd29ya1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgT2JqZWN0LmtleXMocHJvcGVydGllcykuZm9yRWFjaChmdW5jdGlvbiAocHJvcGVydHkpIHtcbiAgICAgICAgICAgICAgICBpZiAocHJvcGVydHkgIT09ICdfX3Byb3RvX18nKSB7XG4gICAgICAgICAgICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmplY3QsIHByb3BlcnR5LCBwcm9wZXJ0aWVzW3Byb3BlcnR5XSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gb2JqZWN0O1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIC8vIEVTNSAxNS4yLjMuOFxuICAgIC8vIGh0dHA6Ly9lczUuZ2l0aHViLmNvbS8jeDE1LjIuMy44XG4gICAgaWYgKCFPYmplY3Quc2VhbCkge1xuICAgICAgICBPYmplY3Quc2VhbCA9IGZ1bmN0aW9uIHNlYWwob2JqZWN0KSB7XG4gICAgICAgICAgICBpZiAoT2JqZWN0KG9iamVjdCkgIT09IG9iamVjdCkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ09iamVjdC5zZWFsIGNhbiBvbmx5IGJlIGNhbGxlZCBvbiBPYmplY3RzLicpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gdGhpcyBpcyBtaXNsZWFkaW5nIGFuZCBicmVha3MgZmVhdHVyZS1kZXRlY3Rpb24sIGJ1dFxuICAgICAgICAgICAgLy8gYWxsb3dzIFwic2VjdXJhYmxlXCIgY29kZSB0byBcImdyYWNlZnVsbHlcIiBkZWdyYWRlIHRvIHdvcmtpbmdcbiAgICAgICAgICAgIC8vIGJ1dCBpbnNlY3VyZSBjb2RlLlxuICAgICAgICAgICAgcmV0dXJuIG9iamVjdDtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICAvLyBFUzUgMTUuMi4zLjlcbiAgICAvLyBodHRwOi8vZXM1LmdpdGh1Yi5jb20vI3gxNS4yLjMuOVxuICAgIGlmICghT2JqZWN0LmZyZWV6ZSkge1xuICAgICAgICBPYmplY3QuZnJlZXplID0gZnVuY3Rpb24gZnJlZXplKG9iamVjdCkge1xuICAgICAgICAgICAgaWYgKE9iamVjdChvYmplY3QpICE9PSBvYmplY3QpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdPYmplY3QuZnJlZXplIGNhbiBvbmx5IGJlIGNhbGxlZCBvbiBPYmplY3RzLicpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gdGhpcyBpcyBtaXNsZWFkaW5nIGFuZCBicmVha3MgZmVhdHVyZS1kZXRlY3Rpb24sIGJ1dFxuICAgICAgICAgICAgLy8gYWxsb3dzIFwic2VjdXJhYmxlXCIgY29kZSB0byBcImdyYWNlZnVsbHlcIiBkZWdyYWRlIHRvIHdvcmtpbmdcbiAgICAgICAgICAgIC8vIGJ1dCBpbnNlY3VyZSBjb2RlLlxuICAgICAgICAgICAgcmV0dXJuIG9iamVjdDtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICAvLyBkZXRlY3QgYSBSaGlubyBidWcgYW5kIHBhdGNoIGl0XG4gICAgdHJ5IHtcbiAgICAgICAgT2JqZWN0LmZyZWV6ZShmdW5jdGlvbiAoKSB7fSk7XG4gICAgfSBjYXRjaCAoZXhjZXB0aW9uKSB7XG4gICAgICAgIE9iamVjdC5mcmVlemUgPSAoZnVuY3Rpb24gKGZyZWV6ZU9iamVjdCkge1xuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIGZyZWV6ZShvYmplY3QpIHtcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIG9iamVjdCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gb2JqZWN0O1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmcmVlemVPYmplY3Qob2JqZWN0KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICB9KE9iamVjdC5mcmVlemUpKTtcbiAgICB9XG5cbiAgICAvLyBFUzUgMTUuMi4zLjEwXG4gICAgLy8gaHR0cDovL2VzNS5naXRodWIuY29tLyN4MTUuMi4zLjEwXG4gICAgaWYgKCFPYmplY3QucHJldmVudEV4dGVuc2lvbnMpIHtcbiAgICAgICAgT2JqZWN0LnByZXZlbnRFeHRlbnNpb25zID0gZnVuY3Rpb24gcHJldmVudEV4dGVuc2lvbnMob2JqZWN0KSB7XG4gICAgICAgICAgICBpZiAoT2JqZWN0KG9iamVjdCkgIT09IG9iamVjdCkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ09iamVjdC5wcmV2ZW50RXh0ZW5zaW9ucyBjYW4gb25seSBiZSBjYWxsZWQgb24gT2JqZWN0cy4nKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIHRoaXMgaXMgbWlzbGVhZGluZyBhbmQgYnJlYWtzIGZlYXR1cmUtZGV0ZWN0aW9uLCBidXRcbiAgICAgICAgICAgIC8vIGFsbG93cyBcInNlY3VyYWJsZVwiIGNvZGUgdG8gXCJncmFjZWZ1bGx5XCIgZGVncmFkZSB0byB3b3JraW5nXG4gICAgICAgICAgICAvLyBidXQgaW5zZWN1cmUgY29kZS5cbiAgICAgICAgICAgIHJldHVybiBvYmplY3Q7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgLy8gRVM1IDE1LjIuMy4xMVxuICAgIC8vIGh0dHA6Ly9lczUuZ2l0aHViLmNvbS8jeDE1LjIuMy4xMVxuICAgIGlmICghT2JqZWN0LmlzU2VhbGVkKSB7XG4gICAgICAgIE9iamVjdC5pc1NlYWxlZCA9IGZ1bmN0aW9uIGlzU2VhbGVkKG9iamVjdCkge1xuICAgICAgICAgICAgaWYgKE9iamVjdChvYmplY3QpICE9PSBvYmplY3QpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdPYmplY3QuaXNTZWFsZWQgY2FuIG9ubHkgYmUgY2FsbGVkIG9uIE9iamVjdHMuJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgLy8gRVM1IDE1LjIuMy4xMlxuICAgIC8vIGh0dHA6Ly9lczUuZ2l0aHViLmNvbS8jeDE1LjIuMy4xMlxuICAgIGlmICghT2JqZWN0LmlzRnJvemVuKSB7XG4gICAgICAgIE9iamVjdC5pc0Zyb3plbiA9IGZ1bmN0aW9uIGlzRnJvemVuKG9iamVjdCkge1xuICAgICAgICAgICAgaWYgKE9iamVjdChvYmplY3QpICE9PSBvYmplY3QpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdPYmplY3QuaXNGcm96ZW4gY2FuIG9ubHkgYmUgY2FsbGVkIG9uIE9iamVjdHMuJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgLy8gRVM1IDE1LjIuMy4xM1xuICAgIC8vIGh0dHA6Ly9lczUuZ2l0aHViLmNvbS8jeDE1LjIuMy4xM1xuICAgIGlmICghT2JqZWN0LmlzRXh0ZW5zaWJsZSkge1xuICAgICAgICBPYmplY3QuaXNFeHRlbnNpYmxlID0gZnVuY3Rpb24gaXNFeHRlbnNpYmxlKG9iamVjdCkge1xuICAgICAgICAgICAgLy8gMS4gSWYgVHlwZShPKSBpcyBub3QgT2JqZWN0IHRocm93IGEgVHlwZUVycm9yIGV4Y2VwdGlvbi5cbiAgICAgICAgICAgIGlmIChPYmplY3Qob2JqZWN0KSAhPT0gb2JqZWN0KSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignT2JqZWN0LmlzRXh0ZW5zaWJsZSBjYW4gb25seSBiZSBjYWxsZWQgb24gT2JqZWN0cy4nKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIDIuIFJldHVybiB0aGUgQm9vbGVhbiB2YWx1ZSBvZiB0aGUgW1tFeHRlbnNpYmxlXV0gaW50ZXJuYWwgcHJvcGVydHkgb2YgTy5cbiAgICAgICAgICAgIHZhciBuYW1lID0gJyc7XG4gICAgICAgICAgICB3aGlsZSAob3ducyhvYmplY3QsIG5hbWUpKSB7XG4gICAgICAgICAgICAgICAgbmFtZSArPSAnPyc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBvYmplY3RbbmFtZV0gPSB0cnVlO1xuICAgICAgICAgICAgdmFyIHJldHVyblZhbHVlID0gb3ducyhvYmplY3QsIG5hbWUpO1xuICAgICAgICAgICAgZGVsZXRlIG9iamVjdFtuYW1lXTtcbiAgICAgICAgICAgIHJldHVybiByZXR1cm5WYWx1ZTtcbiAgICAgICAgfTtcbiAgICB9XG5cbn0pKTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL2VzNS1zaGltL2VzNS1zaGFtLmpzXG4vLyBtb2R1bGUgaWQgPSAuL25vZGVfbW9kdWxlcy9lczUtc2hpbS9lczUtc2hhbS5qc1xuLy8gbW9kdWxlIGNodW5rcyA9IDEiLCIvKiFcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9lcy1zaGltcy9lczUtc2hpbVxuICogQGxpY2Vuc2UgZXM1LXNoaW0gQ29weXJpZ2h0IDIwMDktMjAxNSBieSBjb250cmlidXRvcnMsIE1JVCBMaWNlbnNlXG4gKiBzZWUgaHR0cHM6Ly9naXRodWIuY29tL2VzLXNoaW1zL2VzNS1zaGltL2Jsb2IvbWFzdGVyL0xJQ0VOU0VcbiAqL1xuXG4vLyB2aW06IHRzPTQgc3RzPTQgc3c9NCBleHBhbmR0YWJcblxuLy8gQWRkIHNlbWljb2xvbiB0byBwcmV2ZW50IElJRkUgZnJvbSBiZWluZyBwYXNzZWQgYXMgYXJndW1lbnQgdG8gY29uY2F0ZW5hdGVkIGNvZGUuXG47XG5cbi8vIFVNRCAoVW5pdmVyc2FsIE1vZHVsZSBEZWZpbml0aW9uKVxuLy8gc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS91bWRqcy91bWQvYmxvYi9tYXN0ZXIvdGVtcGxhdGVzL3JldHVybkV4cG9ydHMuanNcbihmdW5jdGlvbiAocm9vdCwgZmFjdG9yeSkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIC8qIGdsb2JhbCBkZWZpbmUsIGV4cG9ydHMsIG1vZHVsZSAqL1xuICAgIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcbiAgICAgICAgLy8gQU1ELiBSZWdpc3RlciBhcyBhbiBhbm9ueW1vdXMgbW9kdWxlLlxuICAgICAgICBkZWZpbmUoZmFjdG9yeSk7XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgLy8gTm9kZS4gRG9lcyBub3Qgd29yayB3aXRoIHN0cmljdCBDb21tb25KUywgYnV0XG4gICAgICAgIC8vIG9ubHkgQ29tbW9uSlMtbGlrZSBlbnZpcm9tZW50cyB0aGF0IHN1cHBvcnQgbW9kdWxlLmV4cG9ydHMsXG4gICAgICAgIC8vIGxpa2UgTm9kZS5cbiAgICAgICAgbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgLy8gQnJvd3NlciBnbG9iYWxzIChyb290IGlzIHdpbmRvdylcbiAgICAgICAgcm9vdC5yZXR1cm5FeHBvcnRzID0gZmFjdG9yeSgpO1xuICAgIH1cbn0odGhpcywgZnVuY3Rpb24gKCkge1xuICAgIC8qKlxuICAgICAqIEJyaW5ncyBhbiBlbnZpcm9ubWVudCBhcyBjbG9zZSB0byBFQ01BU2NyaXB0IDUgY29tcGxpYW5jZVxuICAgICAqIGFzIGlzIHBvc3NpYmxlIHdpdGggdGhlIGZhY2lsaXRpZXMgb2YgZXJzdHdoaWxlIGVuZ2luZXMuXG4gICAgICpcbiAgICAgKiBBbm5vdGF0ZWQgRVM1OiBodHRwOi8vZXM1LmdpdGh1Yi5jb20vIChzcGVjaWZpYyBsaW5rcyBiZWxvdylcbiAgICAgKiBFUzUgU3BlYzogaHR0cDovL3d3dy5lY21hLWludGVybmF0aW9uYWwub3JnL3B1YmxpY2F0aW9ucy9maWxlcy9FQ01BLVNUL0VjbWEtMjYyLnBkZlxuICAgICAqIFJlcXVpcmVkIHJlYWRpbmc6IGh0dHA6Ly9qYXZhc2NyaXB0d2VibG9nLndvcmRwcmVzcy5jb20vMjAxMS8xMi8wNS9leHRlbmRpbmctamF2YXNjcmlwdC1uYXRpdmVzL1xuICAgICAqL1xuXG4gICAgLy8gU2hvcnRjdXQgdG8gYW4gb2Z0ZW4gYWNjZXNzZWQgcHJvcGVydGllcywgaW4gb3JkZXIgdG8gYXZvaWQgbXVsdGlwbGVcbiAgICAvLyBkZXJlZmVyZW5jZSB0aGF0IGNvc3RzIHVuaXZlcnNhbGx5LiBUaGlzIGFsc28gaG9sZHMgYSByZWZlcmVuY2UgdG8ga25vd24tZ29vZFxuICAgIC8vIGZ1bmN0aW9ucy5cbiAgICB2YXIgJEFycmF5ID0gQXJyYXk7XG4gICAgdmFyIEFycmF5UHJvdG90eXBlID0gJEFycmF5LnByb3RvdHlwZTtcbiAgICB2YXIgJE9iamVjdCA9IE9iamVjdDtcbiAgICB2YXIgT2JqZWN0UHJvdG90eXBlID0gJE9iamVjdC5wcm90b3R5cGU7XG4gICAgdmFyICRGdW5jdGlvbiA9IEZ1bmN0aW9uO1xuICAgIHZhciBGdW5jdGlvblByb3RvdHlwZSA9ICRGdW5jdGlvbi5wcm90b3R5cGU7XG4gICAgdmFyICRTdHJpbmcgPSBTdHJpbmc7XG4gICAgdmFyIFN0cmluZ1Byb3RvdHlwZSA9ICRTdHJpbmcucHJvdG90eXBlO1xuICAgIHZhciAkTnVtYmVyID0gTnVtYmVyO1xuICAgIHZhciBOdW1iZXJQcm90b3R5cGUgPSAkTnVtYmVyLnByb3RvdHlwZTtcbiAgICB2YXIgYXJyYXlfc2xpY2UgPSBBcnJheVByb3RvdHlwZS5zbGljZTtcbiAgICB2YXIgYXJyYXlfc3BsaWNlID0gQXJyYXlQcm90b3R5cGUuc3BsaWNlO1xuICAgIHZhciBhcnJheV9wdXNoID0gQXJyYXlQcm90b3R5cGUucHVzaDtcbiAgICB2YXIgYXJyYXlfdW5zaGlmdCA9IEFycmF5UHJvdG90eXBlLnVuc2hpZnQ7XG4gICAgdmFyIGFycmF5X2NvbmNhdCA9IEFycmF5UHJvdG90eXBlLmNvbmNhdDtcbiAgICB2YXIgYXJyYXlfam9pbiA9IEFycmF5UHJvdG90eXBlLmpvaW47XG4gICAgdmFyIGNhbGwgPSBGdW5jdGlvblByb3RvdHlwZS5jYWxsO1xuICAgIHZhciBhcHBseSA9IEZ1bmN0aW9uUHJvdG90eXBlLmFwcGx5O1xuICAgIHZhciBtYXggPSBNYXRoLm1heDtcbiAgICB2YXIgbWluID0gTWF0aC5taW47XG5cbiAgICAvLyBIYXZpbmcgYSB0b1N0cmluZyBsb2NhbCB2YXJpYWJsZSBuYW1lIGJyZWFrcyBpbiBPcGVyYSBzbyB1c2UgdG9fc3RyaW5nLlxuICAgIHZhciB0b19zdHJpbmcgPSBPYmplY3RQcm90b3R5cGUudG9TdHJpbmc7XG5cbiAgICAvKiBnbG9iYWwgU3ltYm9sICovXG4gICAgLyogZXNsaW50LWRpc2FibGUgb25lLXZhci1kZWNsYXJhdGlvbi1wZXItbGluZSwgbm8tcmVkZWNsYXJlLCBtYXgtc3RhdGVtZW50cy1wZXItbGluZSAqL1xuICAgIHZhciBoYXNUb1N0cmluZ1RhZyA9IHR5cGVvZiBTeW1ib2wgPT09ICdmdW5jdGlvbicgJiYgdHlwZW9mIFN5bWJvbC50b1N0cmluZ1RhZyA9PT0gJ3N5bWJvbCc7XG4gICAgdmFyIGlzQ2FsbGFibGU7IC8qIGlubGluZWQgZnJvbSBodHRwczovL25wbWpzLmNvbS9pcy1jYWxsYWJsZSAqLyB2YXIgZm5Ub1N0ciA9IEZ1bmN0aW9uLnByb3RvdHlwZS50b1N0cmluZywgY29uc3RydWN0b3JSZWdleCA9IC9eXFxzKmNsYXNzIC8sIGlzRVM2Q2xhc3NGbiA9IGZ1bmN0aW9uIGlzRVM2Q2xhc3NGbih2YWx1ZSkgeyB0cnkgeyB2YXIgZm5TdHIgPSBmblRvU3RyLmNhbGwodmFsdWUpOyB2YXIgc2luZ2xlU3RyaXBwZWQgPSBmblN0ci5yZXBsYWNlKC9cXC9cXC8uKlxcbi9nLCAnJyk7IHZhciBtdWx0aVN0cmlwcGVkID0gc2luZ2xlU3RyaXBwZWQucmVwbGFjZSgvXFwvXFwqWy5cXHNcXFNdKlxcKlxcLy9nLCAnJyk7IHZhciBzcGFjZVN0cmlwcGVkID0gbXVsdGlTdHJpcHBlZC5yZXBsYWNlKC9cXG4vbWcsICcgJykucmVwbGFjZSgvIHsyfS9nLCAnICcpOyByZXR1cm4gY29uc3RydWN0b3JSZWdleC50ZXN0KHNwYWNlU3RyaXBwZWQpOyB9IGNhdGNoIChlKSB7IHJldHVybiBmYWxzZTsgLyogbm90IGEgZnVuY3Rpb24gKi8gfSB9LCB0cnlGdW5jdGlvbk9iamVjdCA9IGZ1bmN0aW9uIHRyeUZ1bmN0aW9uT2JqZWN0KHZhbHVlKSB7IHRyeSB7IGlmIChpc0VTNkNsYXNzRm4odmFsdWUpKSB7IHJldHVybiBmYWxzZTsgfSBmblRvU3RyLmNhbGwodmFsdWUpOyByZXR1cm4gdHJ1ZTsgfSBjYXRjaCAoZSkgeyByZXR1cm4gZmFsc2U7IH0gfSwgZm5DbGFzcyA9ICdbb2JqZWN0IEZ1bmN0aW9uXScsIGdlbkNsYXNzID0gJ1tvYmplY3QgR2VuZXJhdG9yRnVuY3Rpb25dJywgaXNDYWxsYWJsZSA9IGZ1bmN0aW9uIGlzQ2FsbGFibGUodmFsdWUpIHsgaWYgKCF2YWx1ZSkgeyByZXR1cm4gZmFsc2U7IH0gaWYgKHR5cGVvZiB2YWx1ZSAhPT0gJ2Z1bmN0aW9uJyAmJiB0eXBlb2YgdmFsdWUgIT09ICdvYmplY3QnKSB7IHJldHVybiBmYWxzZTsgfSBpZiAoaGFzVG9TdHJpbmdUYWcpIHsgcmV0dXJuIHRyeUZ1bmN0aW9uT2JqZWN0KHZhbHVlKTsgfSBpZiAoaXNFUzZDbGFzc0ZuKHZhbHVlKSkgeyByZXR1cm4gZmFsc2U7IH0gdmFyIHN0ckNsYXNzID0gdG9fc3RyaW5nLmNhbGwodmFsdWUpOyByZXR1cm4gc3RyQ2xhc3MgPT09IGZuQ2xhc3MgfHwgc3RyQ2xhc3MgPT09IGdlbkNsYXNzOyB9O1xuXG4gICAgdmFyIGlzUmVnZXg7IC8qIGlubGluZWQgZnJvbSBodHRwczovL25wbWpzLmNvbS9pcy1yZWdleCAqLyB2YXIgcmVnZXhFeGVjID0gUmVnRXhwLnByb3RvdHlwZS5leGVjLCB0cnlSZWdleEV4ZWMgPSBmdW5jdGlvbiB0cnlSZWdleEV4ZWModmFsdWUpIHsgdHJ5IHsgcmVnZXhFeGVjLmNhbGwodmFsdWUpOyByZXR1cm4gdHJ1ZTsgfSBjYXRjaCAoZSkgeyByZXR1cm4gZmFsc2U7IH0gfSwgcmVnZXhDbGFzcyA9ICdbb2JqZWN0IFJlZ0V4cF0nOyBpc1JlZ2V4ID0gZnVuY3Rpb24gaXNSZWdleCh2YWx1ZSkgeyBpZiAodHlwZW9mIHZhbHVlICE9PSAnb2JqZWN0JykgeyByZXR1cm4gZmFsc2U7IH0gcmV0dXJuIGhhc1RvU3RyaW5nVGFnID8gdHJ5UmVnZXhFeGVjKHZhbHVlKSA6IHRvX3N0cmluZy5jYWxsKHZhbHVlKSA9PT0gcmVnZXhDbGFzczsgfTtcbiAgICB2YXIgaXNTdHJpbmc7IC8qIGlubGluZWQgZnJvbSBodHRwczovL25wbWpzLmNvbS9pcy1zdHJpbmcgKi8gdmFyIHN0clZhbHVlID0gU3RyaW5nLnByb3RvdHlwZS52YWx1ZU9mLCB0cnlTdHJpbmdPYmplY3QgPSBmdW5jdGlvbiB0cnlTdHJpbmdPYmplY3QodmFsdWUpIHsgdHJ5IHsgc3RyVmFsdWUuY2FsbCh2YWx1ZSk7IHJldHVybiB0cnVlOyB9IGNhdGNoIChlKSB7IHJldHVybiBmYWxzZTsgfSB9LCBzdHJpbmdDbGFzcyA9ICdbb2JqZWN0IFN0cmluZ10nOyBpc1N0cmluZyA9IGZ1bmN0aW9uIGlzU3RyaW5nKHZhbHVlKSB7IGlmICh0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnKSB7IHJldHVybiB0cnVlOyB9IGlmICh0eXBlb2YgdmFsdWUgIT09ICdvYmplY3QnKSB7IHJldHVybiBmYWxzZTsgfSByZXR1cm4gaGFzVG9TdHJpbmdUYWcgPyB0cnlTdHJpbmdPYmplY3QodmFsdWUpIDogdG9fc3RyaW5nLmNhbGwodmFsdWUpID09PSBzdHJpbmdDbGFzczsgfTtcbiAgICAvKiBlc2xpbnQtZW5hYmxlIG9uZS12YXItZGVjbGFyYXRpb24tcGVyLWxpbmUsIG5vLXJlZGVjbGFyZSwgbWF4LXN0YXRlbWVudHMtcGVyLWxpbmUgKi9cblxuICAgIC8qIGlubGluZWQgZnJvbSBodHRwOi8vbnBtanMuY29tL2RlZmluZS1wcm9wZXJ0aWVzICovXG4gICAgdmFyIHN1cHBvcnRzRGVzY3JpcHRvcnMgPSAkT2JqZWN0LmRlZmluZVByb3BlcnR5ICYmIChmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICB2YXIgb2JqID0ge307XG4gICAgICAgICAgICAkT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iaiwgJ3gnLCB7IGVudW1lcmFibGU6IGZhbHNlLCB2YWx1ZTogb2JqIH0pO1xuICAgICAgICAgICAgZm9yICh2YXIgXyBpbiBvYmopIHsgLy8ganNjczppZ25vcmUgZGlzYWxsb3dVbnVzZWRWYXJpYWJsZXNcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gb2JqLnggPT09IG9iajtcbiAgICAgICAgfSBjYXRjaCAoZSkgeyAvKiB0aGlzIGlzIEVTMyAqL1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgfSgpKTtcbiAgICB2YXIgZGVmaW5lUHJvcGVydGllcyA9IChmdW5jdGlvbiAoaGFzKSB7XG4gICAgICAgIC8vIERlZmluZSBjb25maWd1cmFibGUsIHdyaXRhYmxlLCBhbmQgbm9uLWVudW1lcmFibGUgcHJvcHNcbiAgICAgICAgLy8gaWYgdGhleSBkb24ndCBleGlzdC5cbiAgICAgICAgdmFyIGRlZmluZVByb3BlcnR5O1xuICAgICAgICBpZiAoc3VwcG9ydHNEZXNjcmlwdG9ycykge1xuICAgICAgICAgICAgZGVmaW5lUHJvcGVydHkgPSBmdW5jdGlvbiAob2JqZWN0LCBuYW1lLCBtZXRob2QsIGZvcmNlQXNzaWduKSB7XG4gICAgICAgICAgICAgICAgaWYgKCFmb3JjZUFzc2lnbiAmJiAobmFtZSBpbiBvYmplY3QpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgJE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmplY3QsIG5hbWUsIHtcbiAgICAgICAgICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgd3JpdGFibGU6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlOiBtZXRob2RcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBkZWZpbmVQcm9wZXJ0eSA9IGZ1bmN0aW9uIChvYmplY3QsIG5hbWUsIG1ldGhvZCwgZm9yY2VBc3NpZ24pIHtcbiAgICAgICAgICAgICAgICBpZiAoIWZvcmNlQXNzaWduICYmIChuYW1lIGluIG9iamVjdCkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBvYmplY3RbbmFtZV0gPSBtZXRob2Q7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0aWVzKG9iamVjdCwgbWFwLCBmb3JjZUFzc2lnbikge1xuICAgICAgICAgICAgZm9yICh2YXIgbmFtZSBpbiBtYXApIHtcbiAgICAgICAgICAgICAgICBpZiAoaGFzLmNhbGwobWFwLCBuYW1lKSkge1xuICAgICAgICAgICAgICAgICAgICBkZWZpbmVQcm9wZXJ0eShvYmplY3QsIG5hbWUsIG1hcFtuYW1lXSwgZm9yY2VBc3NpZ24pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9KE9iamVjdFByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eSkpO1xuXG4gICAgLy9cbiAgICAvLyBVdGlsXG4gICAgLy8gPT09PT09XG4gICAgLy9cblxuICAgIC8qIHJlcGxhY2VhYmxlIHdpdGggaHR0cHM6Ly9ucG1qcy5jb20vcGFja2FnZS9lcy1hYnN0cmFjdCAvaGVscGVycy9pc1ByaW1pdGl2ZSAqL1xuICAgIHZhciBpc1ByaW1pdGl2ZSA9IGZ1bmN0aW9uIGlzUHJpbWl0aXZlKGlucHV0KSB7XG4gICAgICAgIHZhciB0eXBlID0gdHlwZW9mIGlucHV0O1xuICAgICAgICByZXR1cm4gaW5wdXQgPT09IG51bGwgfHwgKHR5cGUgIT09ICdvYmplY3QnICYmIHR5cGUgIT09ICdmdW5jdGlvbicpO1xuICAgIH07XG5cbiAgICB2YXIgaXNBY3R1YWxOYU4gPSAkTnVtYmVyLmlzTmFOIHx8IGZ1bmN0aW9uIGlzQWN0dWFsTmFOKHgpIHtcbiAgICAgICAgcmV0dXJuIHggIT09IHg7XG4gICAgfTtcblxuICAgIHZhciBFUyA9IHtcbiAgICAgICAgLy8gRVM1IDkuNFxuICAgICAgICAvLyBodHRwOi8vZXM1LmdpdGh1Yi5jb20vI3g5LjRcbiAgICAgICAgLy8gaHR0cDovL2pzcGVyZi5jb20vdG8taW50ZWdlclxuICAgICAgICAvKiByZXBsYWNlYWJsZSB3aXRoIGh0dHBzOi8vbnBtanMuY29tL3BhY2thZ2UvZXMtYWJzdHJhY3QgRVM1LlRvSW50ZWdlciAqL1xuICAgICAgICBUb0ludGVnZXI6IGZ1bmN0aW9uIFRvSW50ZWdlcihudW0pIHtcbiAgICAgICAgICAgIHZhciBuID0gK251bTtcbiAgICAgICAgICAgIGlmIChpc0FjdHVhbE5hTihuKSkge1xuICAgICAgICAgICAgICAgIG4gPSAwO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChuICE9PSAwICYmIG4gIT09ICgxIC8gMCkgJiYgbiAhPT0gLSgxIC8gMCkpIHtcbiAgICAgICAgICAgICAgICBuID0gKG4gPiAwIHx8IC0xKSAqIE1hdGguZmxvb3IoTWF0aC5hYnMobikpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIG47XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyogcmVwbGFjZWFibGUgd2l0aCBodHRwczovL25wbWpzLmNvbS9wYWNrYWdlL2VzLWFic3RyYWN0IEVTNS5Ub1ByaW1pdGl2ZSAqL1xuICAgICAgICBUb1ByaW1pdGl2ZTogZnVuY3Rpb24gVG9QcmltaXRpdmUoaW5wdXQpIHtcbiAgICAgICAgICAgIHZhciB2YWwsIHZhbHVlT2YsIHRvU3RyO1xuICAgICAgICAgICAgaWYgKGlzUHJpbWl0aXZlKGlucHV0KSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBpbnB1dDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhbHVlT2YgPSBpbnB1dC52YWx1ZU9mO1xuICAgICAgICAgICAgaWYgKGlzQ2FsbGFibGUodmFsdWVPZikpIHtcbiAgICAgICAgICAgICAgICB2YWwgPSB2YWx1ZU9mLmNhbGwoaW5wdXQpO1xuICAgICAgICAgICAgICAgIGlmIChpc1ByaW1pdGl2ZSh2YWwpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB2YWw7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdG9TdHIgPSBpbnB1dC50b1N0cmluZztcbiAgICAgICAgICAgIGlmIChpc0NhbGxhYmxlKHRvU3RyKSkge1xuICAgICAgICAgICAgICAgIHZhbCA9IHRvU3RyLmNhbGwoaW5wdXQpO1xuICAgICAgICAgICAgICAgIGlmIChpc1ByaW1pdGl2ZSh2YWwpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB2YWw7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcigpO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8vIEVTNSA5LjlcbiAgICAgICAgLy8gaHR0cDovL2VzNS5naXRodWIuY29tLyN4OS45XG4gICAgICAgIC8qIHJlcGxhY2VhYmxlIHdpdGggaHR0cHM6Ly9ucG1qcy5jb20vcGFja2FnZS9lcy1hYnN0cmFjdCBFUzUuVG9PYmplY3QgKi9cbiAgICAgICAgVG9PYmplY3Q6IGZ1bmN0aW9uIChvKSB7XG4gICAgICAgICAgICBpZiAobyA9PSBudWxsKSB7IC8vIHRoaXMgbWF0Y2hlcyBib3RoIG51bGwgYW5kIHVuZGVmaW5lZFxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJjYW4ndCBjb252ZXJ0IFwiICsgbyArICcgdG8gb2JqZWN0Jyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gJE9iamVjdChvKTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKiByZXBsYWNlYWJsZSB3aXRoIGh0dHBzOi8vbnBtanMuY29tL3BhY2thZ2UvZXMtYWJzdHJhY3QgRVM1LlRvVWludDMyICovXG4gICAgICAgIFRvVWludDMyOiBmdW5jdGlvbiBUb1VpbnQzMih4KSB7XG4gICAgICAgICAgICByZXR1cm4geCA+Pj4gMDtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICAvL1xuICAgIC8vIEZ1bmN0aW9uXG4gICAgLy8gPT09PT09PT1cbiAgICAvL1xuXG4gICAgLy8gRVMtNSAxNS4zLjQuNVxuICAgIC8vIGh0dHA6Ly9lczUuZ2l0aHViLmNvbS8jeDE1LjMuNC41XG5cbiAgICB2YXIgRW1wdHkgPSBmdW5jdGlvbiBFbXB0eSgpIHt9O1xuXG4gICAgZGVmaW5lUHJvcGVydGllcyhGdW5jdGlvblByb3RvdHlwZSwge1xuICAgICAgICBiaW5kOiBmdW5jdGlvbiBiaW5kKHRoYXQpIHsgLy8gLmxlbmd0aCBpcyAxXG4gICAgICAgICAgICAvLyAxLiBMZXQgVGFyZ2V0IGJlIHRoZSB0aGlzIHZhbHVlLlxuICAgICAgICAgICAgdmFyIHRhcmdldCA9IHRoaXM7XG4gICAgICAgICAgICAvLyAyLiBJZiBJc0NhbGxhYmxlKFRhcmdldCkgaXMgZmFsc2UsIHRocm93IGEgVHlwZUVycm9yIGV4Y2VwdGlvbi5cbiAgICAgICAgICAgIGlmICghaXNDYWxsYWJsZSh0YXJnZXQpKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignRnVuY3Rpb24ucHJvdG90eXBlLmJpbmQgY2FsbGVkIG9uIGluY29tcGF0aWJsZSAnICsgdGFyZ2V0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIDMuIExldCBBIGJlIGEgbmV3IChwb3NzaWJseSBlbXB0eSkgaW50ZXJuYWwgbGlzdCBvZiBhbGwgb2YgdGhlXG4gICAgICAgICAgICAvLyAgIGFyZ3VtZW50IHZhbHVlcyBwcm92aWRlZCBhZnRlciB0aGlzQXJnIChhcmcxLCBhcmcyIGV0YyksIGluIG9yZGVyLlxuICAgICAgICAgICAgLy8gWFhYIHNsaWNlZEFyZ3Mgd2lsbCBzdGFuZCBpbiBmb3IgXCJBXCIgaWYgdXNlZFxuICAgICAgICAgICAgdmFyIGFyZ3MgPSBhcnJheV9zbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7IC8vIGZvciBub3JtYWwgY2FsbFxuICAgICAgICAgICAgLy8gNC4gTGV0IEYgYmUgYSBuZXcgbmF0aXZlIEVDTUFTY3JpcHQgb2JqZWN0LlxuICAgICAgICAgICAgLy8gMTEuIFNldCB0aGUgW1tQcm90b3R5cGVdXSBpbnRlcm5hbCBwcm9wZXJ0eSBvZiBGIHRvIHRoZSBzdGFuZGFyZFxuICAgICAgICAgICAgLy8gICBidWlsdC1pbiBGdW5jdGlvbiBwcm90b3R5cGUgb2JqZWN0IGFzIHNwZWNpZmllZCBpbiAxNS4zLjMuMS5cbiAgICAgICAgICAgIC8vIDEyLiBTZXQgdGhlIFtbQ2FsbF1dIGludGVybmFsIHByb3BlcnR5IG9mIEYgYXMgZGVzY3JpYmVkIGluXG4gICAgICAgICAgICAvLyAgIDE1LjMuNC41LjEuXG4gICAgICAgICAgICAvLyAxMy4gU2V0IHRoZSBbW0NvbnN0cnVjdF1dIGludGVybmFsIHByb3BlcnR5IG9mIEYgYXMgZGVzY3JpYmVkIGluXG4gICAgICAgICAgICAvLyAgIDE1LjMuNC41LjIuXG4gICAgICAgICAgICAvLyAxNC4gU2V0IHRoZSBbW0hhc0luc3RhbmNlXV0gaW50ZXJuYWwgcHJvcGVydHkgb2YgRiBhcyBkZXNjcmliZWQgaW5cbiAgICAgICAgICAgIC8vICAgMTUuMy40LjUuMy5cbiAgICAgICAgICAgIHZhciBib3VuZDtcbiAgICAgICAgICAgIHZhciBiaW5kZXIgPSBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgICAgICAgICBpZiAodGhpcyBpbnN0YW5jZW9mIGJvdW5kKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIDE1LjMuNC41LjIgW1tDb25zdHJ1Y3RdXVxuICAgICAgICAgICAgICAgICAgICAvLyBXaGVuIHRoZSBbW0NvbnN0cnVjdF1dIGludGVybmFsIG1ldGhvZCBvZiBhIGZ1bmN0aW9uIG9iamVjdCxcbiAgICAgICAgICAgICAgICAgICAgLy8gRiB0aGF0IHdhcyBjcmVhdGVkIHVzaW5nIHRoZSBiaW5kIGZ1bmN0aW9uIGlzIGNhbGxlZCB3aXRoIGFcbiAgICAgICAgICAgICAgICAgICAgLy8gbGlzdCBvZiBhcmd1bWVudHMgRXh0cmFBcmdzLCB0aGUgZm9sbG93aW5nIHN0ZXBzIGFyZSB0YWtlbjpcbiAgICAgICAgICAgICAgICAgICAgLy8gMS4gTGV0IHRhcmdldCBiZSB0aGUgdmFsdWUgb2YgRidzIFtbVGFyZ2V0RnVuY3Rpb25dXVxuICAgICAgICAgICAgICAgICAgICAvLyAgIGludGVybmFsIHByb3BlcnR5LlxuICAgICAgICAgICAgICAgICAgICAvLyAyLiBJZiB0YXJnZXQgaGFzIG5vIFtbQ29uc3RydWN0XV0gaW50ZXJuYWwgbWV0aG9kLCBhXG4gICAgICAgICAgICAgICAgICAgIC8vICAgVHlwZUVycm9yIGV4Y2VwdGlvbiBpcyB0aHJvd24uXG4gICAgICAgICAgICAgICAgICAgIC8vIDMuIExldCBib3VuZEFyZ3MgYmUgdGhlIHZhbHVlIG9mIEYncyBbW0JvdW5kQXJnc11dIGludGVybmFsXG4gICAgICAgICAgICAgICAgICAgIC8vICAgcHJvcGVydHkuXG4gICAgICAgICAgICAgICAgICAgIC8vIDQuIExldCBhcmdzIGJlIGEgbmV3IGxpc3QgY29udGFpbmluZyB0aGUgc2FtZSB2YWx1ZXMgYXMgdGhlXG4gICAgICAgICAgICAgICAgICAgIC8vICAgbGlzdCBib3VuZEFyZ3MgaW4gdGhlIHNhbWUgb3JkZXIgZm9sbG93ZWQgYnkgdGhlIHNhbWVcbiAgICAgICAgICAgICAgICAgICAgLy8gICB2YWx1ZXMgYXMgdGhlIGxpc3QgRXh0cmFBcmdzIGluIHRoZSBzYW1lIG9yZGVyLlxuICAgICAgICAgICAgICAgICAgICAvLyA1LiBSZXR1cm4gdGhlIHJlc3VsdCBvZiBjYWxsaW5nIHRoZSBbW0NvbnN0cnVjdF1dIGludGVybmFsXG4gICAgICAgICAgICAgICAgICAgIC8vICAgbWV0aG9kIG9mIHRhcmdldCBwcm92aWRpbmcgYXJncyBhcyB0aGUgYXJndW1lbnRzLlxuXG4gICAgICAgICAgICAgICAgICAgIHZhciByZXN1bHQgPSBhcHBseS5jYWxsKFxuICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0LFxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGFycmF5X2NvbmNhdC5jYWxsKGFyZ3MsIGFycmF5X3NsaWNlLmNhbGwoYXJndW1lbnRzKSlcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCRPYmplY3QocmVzdWx0KSA9PT0gcmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzO1xuXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gMTUuMy40LjUuMSBbW0NhbGxdXVxuICAgICAgICAgICAgICAgICAgICAvLyBXaGVuIHRoZSBbW0NhbGxdXSBpbnRlcm5hbCBtZXRob2Qgb2YgYSBmdW5jdGlvbiBvYmplY3QsIEYsXG4gICAgICAgICAgICAgICAgICAgIC8vIHdoaWNoIHdhcyBjcmVhdGVkIHVzaW5nIHRoZSBiaW5kIGZ1bmN0aW9uIGlzIGNhbGxlZCB3aXRoIGFcbiAgICAgICAgICAgICAgICAgICAgLy8gdGhpcyB2YWx1ZSBhbmQgYSBsaXN0IG9mIGFyZ3VtZW50cyBFeHRyYUFyZ3MsIHRoZSBmb2xsb3dpbmdcbiAgICAgICAgICAgICAgICAgICAgLy8gc3RlcHMgYXJlIHRha2VuOlxuICAgICAgICAgICAgICAgICAgICAvLyAxLiBMZXQgYm91bmRBcmdzIGJlIHRoZSB2YWx1ZSBvZiBGJ3MgW1tCb3VuZEFyZ3NdXSBpbnRlcm5hbFxuICAgICAgICAgICAgICAgICAgICAvLyAgIHByb3BlcnR5LlxuICAgICAgICAgICAgICAgICAgICAvLyAyLiBMZXQgYm91bmRUaGlzIGJlIHRoZSB2YWx1ZSBvZiBGJ3MgW1tCb3VuZFRoaXNdXSBpbnRlcm5hbFxuICAgICAgICAgICAgICAgICAgICAvLyAgIHByb3BlcnR5LlxuICAgICAgICAgICAgICAgICAgICAvLyAzLiBMZXQgdGFyZ2V0IGJlIHRoZSB2YWx1ZSBvZiBGJ3MgW1tUYXJnZXRGdW5jdGlvbl1dIGludGVybmFsXG4gICAgICAgICAgICAgICAgICAgIC8vICAgcHJvcGVydHkuXG4gICAgICAgICAgICAgICAgICAgIC8vIDQuIExldCBhcmdzIGJlIGEgbmV3IGxpc3QgY29udGFpbmluZyB0aGUgc2FtZSB2YWx1ZXMgYXMgdGhlXG4gICAgICAgICAgICAgICAgICAgIC8vICAgbGlzdCBib3VuZEFyZ3MgaW4gdGhlIHNhbWUgb3JkZXIgZm9sbG93ZWQgYnkgdGhlIHNhbWVcbiAgICAgICAgICAgICAgICAgICAgLy8gICB2YWx1ZXMgYXMgdGhlIGxpc3QgRXh0cmFBcmdzIGluIHRoZSBzYW1lIG9yZGVyLlxuICAgICAgICAgICAgICAgICAgICAvLyA1LiBSZXR1cm4gdGhlIHJlc3VsdCBvZiBjYWxsaW5nIHRoZSBbW0NhbGxdXSBpbnRlcm5hbCBtZXRob2RcbiAgICAgICAgICAgICAgICAgICAgLy8gICBvZiB0YXJnZXQgcHJvdmlkaW5nIGJvdW5kVGhpcyBhcyB0aGUgdGhpcyB2YWx1ZSBhbmRcbiAgICAgICAgICAgICAgICAgICAgLy8gICBwcm92aWRpbmcgYXJncyBhcyB0aGUgYXJndW1lbnRzLlxuXG4gICAgICAgICAgICAgICAgICAgIC8vIGVxdWl2OiB0YXJnZXQuY2FsbCh0aGlzLCAuLi5ib3VuZEFyZ3MsIC4uLmFyZ3MpXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBhcHBseS5jYWxsKFxuICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0LFxuICAgICAgICAgICAgICAgICAgICAgICAgdGhhdCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGFycmF5X2NvbmNhdC5jYWxsKGFyZ3MsIGFycmF5X3NsaWNlLmNhbGwoYXJndW1lbnRzKSlcbiAgICAgICAgICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgLy8gMTUuIElmIHRoZSBbW0NsYXNzXV0gaW50ZXJuYWwgcHJvcGVydHkgb2YgVGFyZ2V0IGlzIFwiRnVuY3Rpb25cIiwgdGhlblxuICAgICAgICAgICAgLy8gICAgIGEuIExldCBMIGJlIHRoZSBsZW5ndGggcHJvcGVydHkgb2YgVGFyZ2V0IG1pbnVzIHRoZSBsZW5ndGggb2YgQS5cbiAgICAgICAgICAgIC8vICAgICBiLiBTZXQgdGhlIGxlbmd0aCBvd24gcHJvcGVydHkgb2YgRiB0byBlaXRoZXIgMCBvciBMLCB3aGljaGV2ZXIgaXNcbiAgICAgICAgICAgIC8vICAgICAgIGxhcmdlci5cbiAgICAgICAgICAgIC8vIDE2LiBFbHNlIHNldCB0aGUgbGVuZ3RoIG93biBwcm9wZXJ0eSBvZiBGIHRvIDAuXG5cbiAgICAgICAgICAgIHZhciBib3VuZExlbmd0aCA9IG1heCgwLCB0YXJnZXQubGVuZ3RoIC0gYXJncy5sZW5ndGgpO1xuXG4gICAgICAgICAgICAvLyAxNy4gU2V0IHRoZSBhdHRyaWJ1dGVzIG9mIHRoZSBsZW5ndGggb3duIHByb3BlcnR5IG9mIEYgdG8gdGhlIHZhbHVlc1xuICAgICAgICAgICAgLy8gICBzcGVjaWZpZWQgaW4gMTUuMy41LjEuXG4gICAgICAgICAgICB2YXIgYm91bmRBcmdzID0gW107XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGJvdW5kTGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBhcnJheV9wdXNoLmNhbGwoYm91bmRBcmdzLCAnJCcgKyBpKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gWFhYIEJ1aWxkIGEgZHluYW1pYyBmdW5jdGlvbiB3aXRoIGRlc2lyZWQgYW1vdW50IG9mIGFyZ3VtZW50cyBpcyB0aGUgb25seVxuICAgICAgICAgICAgLy8gd2F5IHRvIHNldCB0aGUgbGVuZ3RoIHByb3BlcnR5IG9mIGEgZnVuY3Rpb24uXG4gICAgICAgICAgICAvLyBJbiBlbnZpcm9ubWVudHMgd2hlcmUgQ29udGVudCBTZWN1cml0eSBQb2xpY2llcyBlbmFibGVkIChDaHJvbWUgZXh0ZW5zaW9ucyxcbiAgICAgICAgICAgIC8vIGZvciBleC4pIGFsbCB1c2Ugb2YgZXZhbCBvciBGdW5jdGlvbiBjb3N0cnVjdG9yIHRocm93cyBhbiBleGNlcHRpb24uXG4gICAgICAgICAgICAvLyBIb3dldmVyIGluIGFsbCBvZiB0aGVzZSBlbnZpcm9ubWVudHMgRnVuY3Rpb24ucHJvdG90eXBlLmJpbmQgZXhpc3RzXG4gICAgICAgICAgICAvLyBhbmQgc28gdGhpcyBjb2RlIHdpbGwgbmV2ZXIgYmUgZXhlY3V0ZWQuXG4gICAgICAgICAgICBib3VuZCA9ICRGdW5jdGlvbignYmluZGVyJywgJ3JldHVybiBmdW5jdGlvbiAoJyArIGFycmF5X2pvaW4uY2FsbChib3VuZEFyZ3MsICcsJykgKyAnKXsgcmV0dXJuIGJpbmRlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpOyB9JykoYmluZGVyKTtcblxuICAgICAgICAgICAgaWYgKHRhcmdldC5wcm90b3R5cGUpIHtcbiAgICAgICAgICAgICAgICBFbXB0eS5wcm90b3R5cGUgPSB0YXJnZXQucHJvdG90eXBlO1xuICAgICAgICAgICAgICAgIGJvdW5kLnByb3RvdHlwZSA9IG5ldyBFbXB0eSgpO1xuICAgICAgICAgICAgICAgIC8vIENsZWFuIHVwIGRhbmdsaW5nIHJlZmVyZW5jZXMuXG4gICAgICAgICAgICAgICAgRW1wdHkucHJvdG90eXBlID0gbnVsbDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gVE9ET1xuICAgICAgICAgICAgLy8gMTguIFNldCB0aGUgW1tFeHRlbnNpYmxlXV0gaW50ZXJuYWwgcHJvcGVydHkgb2YgRiB0byB0cnVlLlxuXG4gICAgICAgICAgICAvLyBUT0RPXG4gICAgICAgICAgICAvLyAxOS4gTGV0IHRocm93ZXIgYmUgdGhlIFtbVGhyb3dUeXBlRXJyb3JdXSBmdW5jdGlvbiBPYmplY3QgKDEzLjIuMykuXG4gICAgICAgICAgICAvLyAyMC4gQ2FsbCB0aGUgW1tEZWZpbmVPd25Qcm9wZXJ0eV1dIGludGVybmFsIG1ldGhvZCBvZiBGIHdpdGhcbiAgICAgICAgICAgIC8vICAgYXJndW1lbnRzIFwiY2FsbGVyXCIsIFByb3BlcnR5RGVzY3JpcHRvciB7W1tHZXRdXTogdGhyb3dlciwgW1tTZXRdXTpcbiAgICAgICAgICAgIC8vICAgdGhyb3dlciwgW1tFbnVtZXJhYmxlXV06IGZhbHNlLCBbW0NvbmZpZ3VyYWJsZV1dOiBmYWxzZX0sIGFuZFxuICAgICAgICAgICAgLy8gICBmYWxzZS5cbiAgICAgICAgICAgIC8vIDIxLiBDYWxsIHRoZSBbW0RlZmluZU93blByb3BlcnR5XV0gaW50ZXJuYWwgbWV0aG9kIG9mIEYgd2l0aFxuICAgICAgICAgICAgLy8gICBhcmd1bWVudHMgXCJhcmd1bWVudHNcIiwgUHJvcGVydHlEZXNjcmlwdG9yIHtbW0dldF1dOiB0aHJvd2VyLFxuICAgICAgICAgICAgLy8gICBbW1NldF1dOiB0aHJvd2VyLCBbW0VudW1lcmFibGVdXTogZmFsc2UsIFtbQ29uZmlndXJhYmxlXV06IGZhbHNlfSxcbiAgICAgICAgICAgIC8vICAgYW5kIGZhbHNlLlxuXG4gICAgICAgICAgICAvLyBUT0RPXG4gICAgICAgICAgICAvLyBOT1RFIEZ1bmN0aW9uIG9iamVjdHMgY3JlYXRlZCB1c2luZyBGdW5jdGlvbi5wcm90b3R5cGUuYmluZCBkbyBub3RcbiAgICAgICAgICAgIC8vIGhhdmUgYSBwcm90b3R5cGUgcHJvcGVydHkgb3IgdGhlIFtbQ29kZV1dLCBbW0Zvcm1hbFBhcmFtZXRlcnNdXSwgYW5kXG4gICAgICAgICAgICAvLyBbW1Njb3BlXV0gaW50ZXJuYWwgcHJvcGVydGllcy5cbiAgICAgICAgICAgIC8vIFhYWCBjYW4ndCBkZWxldGUgcHJvdG90eXBlIGluIHB1cmUtanMuXG5cbiAgICAgICAgICAgIC8vIDIyLiBSZXR1cm4gRi5cbiAgICAgICAgICAgIHJldHVybiBib3VuZDtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgLy8gX1BsZWFzZSBub3RlOiBTaG9ydGN1dHMgYXJlIGRlZmluZWQgYWZ0ZXIgYEZ1bmN0aW9uLnByb3RvdHlwZS5iaW5kYCBhcyB3ZVxuICAgIC8vIHVzZSBpdCBpbiBkZWZpbmluZyBzaG9ydGN1dHMuXG4gICAgdmFyIG93bnMgPSBjYWxsLmJpbmQoT2JqZWN0UHJvdG90eXBlLmhhc093blByb3BlcnR5KTtcbiAgICB2YXIgdG9TdHIgPSBjYWxsLmJpbmQoT2JqZWN0UHJvdG90eXBlLnRvU3RyaW5nKTtcbiAgICB2YXIgYXJyYXlTbGljZSA9IGNhbGwuYmluZChhcnJheV9zbGljZSk7XG4gICAgdmFyIGFycmF5U2xpY2VBcHBseSA9IGFwcGx5LmJpbmQoYXJyYXlfc2xpY2UpO1xuICAgIC8qIGdsb2JhbHMgZG9jdW1lbnQgKi9cbiAgICBpZiAodHlwZW9mIGRvY3VtZW50ID09PSAnb2JqZWN0JyAmJiBkb2N1bWVudCAmJiBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGFycmF5U2xpY2UoZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNoaWxkTm9kZXMpO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICB2YXIgb3JpZ0FycmF5U2xpY2UgPSBhcnJheVNsaWNlO1xuICAgICAgICAgICAgdmFyIG9yaWdBcnJheVNsaWNlQXBwbHkgPSBhcnJheVNsaWNlQXBwbHk7XG4gICAgICAgICAgICBhcnJheVNsaWNlID0gZnVuY3Rpb24gYXJyYXlTbGljZUlFKGFycikge1xuICAgICAgICAgICAgICAgIHZhciByID0gW107XG4gICAgICAgICAgICAgICAgdmFyIGkgPSBhcnIubGVuZ3RoO1xuICAgICAgICAgICAgICAgIHdoaWxlIChpLS0gPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHJbaV0gPSBhcnJbaV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBvcmlnQXJyYXlTbGljZUFwcGx5KHIsIG9yaWdBcnJheVNsaWNlKGFyZ3VtZW50cywgMSkpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGFycmF5U2xpY2VBcHBseSA9IGZ1bmN0aW9uIGFycmF5U2xpY2VBcHBseUlFKGFyciwgYXJncykge1xuICAgICAgICAgICAgICAgIHJldHVybiBvcmlnQXJyYXlTbGljZUFwcGx5KGFycmF5U2xpY2UoYXJyKSwgYXJncyk7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgfVxuICAgIHZhciBzdHJTbGljZSA9IGNhbGwuYmluZChTdHJpbmdQcm90b3R5cGUuc2xpY2UpO1xuICAgIHZhciBzdHJTcGxpdCA9IGNhbGwuYmluZChTdHJpbmdQcm90b3R5cGUuc3BsaXQpO1xuICAgIHZhciBzdHJJbmRleE9mID0gY2FsbC5iaW5kKFN0cmluZ1Byb3RvdHlwZS5pbmRleE9mKTtcbiAgICB2YXIgcHVzaENhbGwgPSBjYWxsLmJpbmQoYXJyYXlfcHVzaCk7XG4gICAgdmFyIGlzRW51bSA9IGNhbGwuYmluZChPYmplY3RQcm90b3R5cGUucHJvcGVydHlJc0VudW1lcmFibGUpO1xuICAgIHZhciBhcnJheVNvcnQgPSBjYWxsLmJpbmQoQXJyYXlQcm90b3R5cGUuc29ydCk7XG5cbiAgICAvL1xuICAgIC8vIEFycmF5XG4gICAgLy8gPT09PT1cbiAgICAvL1xuXG4gICAgdmFyIGlzQXJyYXkgPSAkQXJyYXkuaXNBcnJheSB8fCBmdW5jdGlvbiBpc0FycmF5KG9iaikge1xuICAgICAgICByZXR1cm4gdG9TdHIob2JqKSA9PT0gJ1tvYmplY3QgQXJyYXldJztcbiAgICB9O1xuXG4gICAgLy8gRVM1IDE1LjQuNC4xMlxuICAgIC8vIGh0dHA6Ly9lczUuZ2l0aHViLmNvbS8jeDE1LjQuNC4xM1xuICAgIC8vIFJldHVybiBsZW4rYXJnQ291bnQuXG4gICAgLy8gW2J1Z2ZpeCwgaWVsdDhdXG4gICAgLy8gSUUgPCA4IGJ1ZzogW10udW5zaGlmdCgwKSA9PT0gdW5kZWZpbmVkIGJ1dCBzaG91bGQgYmUgXCIxXCJcbiAgICB2YXIgaGFzVW5zaGlmdFJldHVyblZhbHVlQnVnID0gW10udW5zaGlmdCgwKSAhPT0gMTtcbiAgICBkZWZpbmVQcm9wZXJ0aWVzKEFycmF5UHJvdG90eXBlLCB7XG4gICAgICAgIHVuc2hpZnQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGFycmF5X3Vuc2hpZnQuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmxlbmd0aDtcbiAgICAgICAgfVxuICAgIH0sIGhhc1Vuc2hpZnRSZXR1cm5WYWx1ZUJ1Zyk7XG5cbiAgICAvLyBFUzUgMTUuNC4zLjJcbiAgICAvLyBodHRwOi8vZXM1LmdpdGh1Yi5jb20vI3gxNS40LjMuMlxuICAgIC8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuL0phdmFTY3JpcHQvUmVmZXJlbmNlL0dsb2JhbF9PYmplY3RzL0FycmF5L2lzQXJyYXlcbiAgICBkZWZpbmVQcm9wZXJ0aWVzKCRBcnJheSwgeyBpc0FycmF5OiBpc0FycmF5IH0pO1xuXG4gICAgLy8gVGhlIElzQ2FsbGFibGUoKSBjaGVjayBpbiB0aGUgQXJyYXkgZnVuY3Rpb25zXG4gICAgLy8gaGFzIGJlZW4gcmVwbGFjZWQgd2l0aCBhIHN0cmljdCBjaGVjayBvbiB0aGVcbiAgICAvLyBpbnRlcm5hbCBjbGFzcyBvZiB0aGUgb2JqZWN0IHRvIHRyYXAgY2FzZXMgd2hlcmVcbiAgICAvLyB0aGUgcHJvdmlkZWQgZnVuY3Rpb24gd2FzIGFjdHVhbGx5IGEgcmVndWxhclxuICAgIC8vIGV4cHJlc3Npb24gbGl0ZXJhbCwgd2hpY2ggaW4gVjggYW5kXG4gICAgLy8gSmF2YVNjcmlwdENvcmUgaXMgYSB0eXBlb2YgXCJmdW5jdGlvblwiLiAgT25seSBpblxuICAgIC8vIFY4IGFyZSByZWd1bGFyIGV4cHJlc3Npb24gbGl0ZXJhbHMgcGVybWl0dGVkIGFzXG4gICAgLy8gcmVkdWNlIHBhcmFtZXRlcnMsIHNvIGl0IGlzIGRlc2lyYWJsZSBpbiB0aGVcbiAgICAvLyBnZW5lcmFsIGNhc2UgZm9yIHRoZSBzaGltIHRvIG1hdGNoIHRoZSBtb3JlXG4gICAgLy8gc3RyaWN0IGFuZCBjb21tb24gYmVoYXZpb3Igb2YgcmVqZWN0aW5nIHJlZ3VsYXJcbiAgICAvLyBleHByZXNzaW9ucy5cblxuICAgIC8vIEVTNSAxNS40LjQuMThcbiAgICAvLyBodHRwOi8vZXM1LmdpdGh1Yi5jb20vI3gxNS40LjQuMThcbiAgICAvLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9HbG9iYWxfT2JqZWN0cy9hcnJheS9mb3JFYWNoXG5cbiAgICAvLyBDaGVjayBmYWlsdXJlIG9mIGJ5LWluZGV4IGFjY2VzcyBvZiBzdHJpbmcgY2hhcmFjdGVycyAoSUUgPCA5KVxuICAgIC8vIGFuZCBmYWlsdXJlIG9mIGAwIGluIGJveGVkU3RyaW5nYCAoUmhpbm8pXG4gICAgdmFyIGJveGVkU3RyaW5nID0gJE9iamVjdCgnYScpO1xuICAgIHZhciBzcGxpdFN0cmluZyA9IGJveGVkU3RyaW5nWzBdICE9PSAnYScgfHwgISgwIGluIGJveGVkU3RyaW5nKTtcblxuICAgIHZhciBwcm9wZXJseUJveGVzQ29udGV4dCA9IGZ1bmN0aW9uIHByb3Blcmx5Qm94ZWQobWV0aG9kKSB7XG4gICAgICAgIC8vIENoZWNrIG5vZGUgMC42LjIxIGJ1ZyB3aGVyZSB0aGlyZCBwYXJhbWV0ZXIgaXMgbm90IGJveGVkXG4gICAgICAgIHZhciBwcm9wZXJseUJveGVzTm9uU3RyaWN0ID0gdHJ1ZTtcbiAgICAgICAgdmFyIHByb3Blcmx5Qm94ZXNTdHJpY3QgPSB0cnVlO1xuICAgICAgICB2YXIgdGhyZXdFeGNlcHRpb24gPSBmYWxzZTtcbiAgICAgICAgaWYgKG1ldGhvZCkge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBtZXRob2QuY2FsbCgnZm9vJywgZnVuY3Rpb24gKF8sIF9fLCBjb250ZXh0KSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgY29udGV4dCAhPT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb3Blcmx5Qm94ZXNOb25TdHJpY3QgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgbWV0aG9kLmNhbGwoWzFdLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICd1c2Ugc3RyaWN0JztcblxuICAgICAgICAgICAgICAgICAgICBwcm9wZXJseUJveGVzU3RyaWN0ID0gdHlwZW9mIHRoaXMgPT09ICdzdHJpbmcnO1xuICAgICAgICAgICAgICAgIH0sICd4Jyk7XG4gICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgdGhyZXdFeGNlcHRpb24gPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiAhIW1ldGhvZCAmJiAhdGhyZXdFeGNlcHRpb24gJiYgcHJvcGVybHlCb3hlc05vblN0cmljdCAmJiBwcm9wZXJseUJveGVzU3RyaWN0O1xuICAgIH07XG5cbiAgICBkZWZpbmVQcm9wZXJ0aWVzKEFycmF5UHJvdG90eXBlLCB7XG4gICAgICAgIGZvckVhY2g6IGZ1bmN0aW9uIGZvckVhY2goY2FsbGJhY2tmbi8qLCB0aGlzQXJnKi8pIHtcbiAgICAgICAgICAgIHZhciBvYmplY3QgPSBFUy5Ub09iamVjdCh0aGlzKTtcbiAgICAgICAgICAgIHZhciBzZWxmID0gc3BsaXRTdHJpbmcgJiYgaXNTdHJpbmcodGhpcykgPyBzdHJTcGxpdCh0aGlzLCAnJykgOiBvYmplY3Q7XG4gICAgICAgICAgICB2YXIgaSA9IC0xO1xuICAgICAgICAgICAgdmFyIGxlbmd0aCA9IEVTLlRvVWludDMyKHNlbGYubGVuZ3RoKTtcbiAgICAgICAgICAgIHZhciBUO1xuICAgICAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKSB7XG4gICAgICAgICAgICAgICAgVCA9IGFyZ3VtZW50c1sxXTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gSWYgbm8gY2FsbGJhY2sgZnVuY3Rpb24gb3IgaWYgY2FsbGJhY2sgaXMgbm90IGEgY2FsbGFibGUgZnVuY3Rpb25cbiAgICAgICAgICAgIGlmICghaXNDYWxsYWJsZShjYWxsYmFja2ZuKSkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0FycmF5LnByb3RvdHlwZS5mb3JFYWNoIGNhbGxiYWNrIG11c3QgYmUgYSBmdW5jdGlvbicpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB3aGlsZSAoKytpIDwgbGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgaWYgKGkgaW4gc2VsZikge1xuICAgICAgICAgICAgICAgICAgICAvLyBJbnZva2UgdGhlIGNhbGxiYWNrIGZ1bmN0aW9uIHdpdGggY2FsbCwgcGFzc2luZyBhcmd1bWVudHM6XG4gICAgICAgICAgICAgICAgICAgIC8vIGNvbnRleHQsIHByb3BlcnR5IHZhbHVlLCBwcm9wZXJ0eSBrZXksIHRoaXNBcmcgb2JqZWN0XG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgVCA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrZm4oc2VsZltpXSwgaSwgb2JqZWN0KTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrZm4uY2FsbChULCBzZWxmW2ldLCBpLCBvYmplY3QpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSwgIXByb3Blcmx5Qm94ZXNDb250ZXh0KEFycmF5UHJvdG90eXBlLmZvckVhY2gpKTtcblxuICAgIC8vIEVTNSAxNS40LjQuMTlcbiAgICAvLyBodHRwOi8vZXM1LmdpdGh1Yi5jb20vI3gxNS40LjQuMTlcbiAgICAvLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi9Db3JlX0phdmFTY3JpcHRfMS41X1JlZmVyZW5jZS9PYmplY3RzL0FycmF5L21hcFxuICAgIGRlZmluZVByb3BlcnRpZXMoQXJyYXlQcm90b3R5cGUsIHtcbiAgICAgICAgbWFwOiBmdW5jdGlvbiBtYXAoY2FsbGJhY2tmbi8qLCB0aGlzQXJnKi8pIHtcbiAgICAgICAgICAgIHZhciBvYmplY3QgPSBFUy5Ub09iamVjdCh0aGlzKTtcbiAgICAgICAgICAgIHZhciBzZWxmID0gc3BsaXRTdHJpbmcgJiYgaXNTdHJpbmcodGhpcykgPyBzdHJTcGxpdCh0aGlzLCAnJykgOiBvYmplY3Q7XG4gICAgICAgICAgICB2YXIgbGVuZ3RoID0gRVMuVG9VaW50MzIoc2VsZi5sZW5ndGgpO1xuICAgICAgICAgICAgdmFyIHJlc3VsdCA9ICRBcnJheShsZW5ndGgpO1xuICAgICAgICAgICAgdmFyIFQ7XG4gICAgICAgICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgICAgICAgICBUID0gYXJndW1lbnRzWzFdO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBJZiBubyBjYWxsYmFjayBmdW5jdGlvbiBvciBpZiBjYWxsYmFjayBpcyBub3QgYSBjYWxsYWJsZSBmdW5jdGlvblxuICAgICAgICAgICAgaWYgKCFpc0NhbGxhYmxlKGNhbGxiYWNrZm4pKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignQXJyYXkucHJvdG90eXBlLm1hcCBjYWxsYmFjayBtdXN0IGJlIGEgZnVuY3Rpb24nKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGlmIChpIGluIHNlbGYpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBUID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0W2ldID0gY2FsbGJhY2tmbihzZWxmW2ldLCBpLCBvYmplY3QpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0W2ldID0gY2FsbGJhY2tmbi5jYWxsKFQsIHNlbGZbaV0sIGksIG9iamVjdCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICB9XG4gICAgfSwgIXByb3Blcmx5Qm94ZXNDb250ZXh0KEFycmF5UHJvdG90eXBlLm1hcCkpO1xuXG4gICAgLy8gRVM1IDE1LjQuNC4yMFxuICAgIC8vIGh0dHA6Ly9lczUuZ2l0aHViLmNvbS8jeDE1LjQuNC4yMFxuICAgIC8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuL0NvcmVfSmF2YVNjcmlwdF8xLjVfUmVmZXJlbmNlL09iamVjdHMvQXJyYXkvZmlsdGVyXG4gICAgZGVmaW5lUHJvcGVydGllcyhBcnJheVByb3RvdHlwZSwge1xuICAgICAgICBmaWx0ZXI6IGZ1bmN0aW9uIGZpbHRlcihjYWxsYmFja2ZuLyosIHRoaXNBcmcqLykge1xuICAgICAgICAgICAgdmFyIG9iamVjdCA9IEVTLlRvT2JqZWN0KHRoaXMpO1xuICAgICAgICAgICAgdmFyIHNlbGYgPSBzcGxpdFN0cmluZyAmJiBpc1N0cmluZyh0aGlzKSA/IHN0clNwbGl0KHRoaXMsICcnKSA6IG9iamVjdDtcbiAgICAgICAgICAgIHZhciBsZW5ndGggPSBFUy5Ub1VpbnQzMihzZWxmLmxlbmd0aCk7XG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gW107XG4gICAgICAgICAgICB2YXIgdmFsdWU7XG4gICAgICAgICAgICB2YXIgVDtcbiAgICAgICAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSkge1xuICAgICAgICAgICAgICAgIFQgPSBhcmd1bWVudHNbMV07XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIElmIG5vIGNhbGxiYWNrIGZ1bmN0aW9uIG9yIGlmIGNhbGxiYWNrIGlzIG5vdCBhIGNhbGxhYmxlIGZ1bmN0aW9uXG4gICAgICAgICAgICBpZiAoIWlzQ2FsbGFibGUoY2FsbGJhY2tmbikpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdBcnJheS5wcm90b3R5cGUuZmlsdGVyIGNhbGxiYWNrIG11c3QgYmUgYSBmdW5jdGlvbicpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgaWYgKGkgaW4gc2VsZikge1xuICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IHNlbGZbaV07XG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgVCA9PT0gJ3VuZGVmaW5lZCcgPyBjYWxsYmFja2ZuKHZhbHVlLCBpLCBvYmplY3QpIDogY2FsbGJhY2tmbi5jYWxsKFQsIHZhbHVlLCBpLCBvYmplY3QpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwdXNoQ2FsbChyZXN1bHQsIHZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIH1cbiAgICB9LCAhcHJvcGVybHlCb3hlc0NvbnRleHQoQXJyYXlQcm90b3R5cGUuZmlsdGVyKSk7XG5cbiAgICAvLyBFUzUgMTUuNC40LjE2XG4gICAgLy8gaHR0cDovL2VzNS5naXRodWIuY29tLyN4MTUuNC40LjE2XG4gICAgLy8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4vSmF2YVNjcmlwdC9SZWZlcmVuY2UvR2xvYmFsX09iamVjdHMvQXJyYXkvZXZlcnlcbiAgICBkZWZpbmVQcm9wZXJ0aWVzKEFycmF5UHJvdG90eXBlLCB7XG4gICAgICAgIGV2ZXJ5OiBmdW5jdGlvbiBldmVyeShjYWxsYmFja2ZuLyosIHRoaXNBcmcqLykge1xuICAgICAgICAgICAgdmFyIG9iamVjdCA9IEVTLlRvT2JqZWN0KHRoaXMpO1xuICAgICAgICAgICAgdmFyIHNlbGYgPSBzcGxpdFN0cmluZyAmJiBpc1N0cmluZyh0aGlzKSA/IHN0clNwbGl0KHRoaXMsICcnKSA6IG9iamVjdDtcbiAgICAgICAgICAgIHZhciBsZW5ndGggPSBFUy5Ub1VpbnQzMihzZWxmLmxlbmd0aCk7XG4gICAgICAgICAgICB2YXIgVDtcbiAgICAgICAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSkge1xuICAgICAgICAgICAgICAgIFQgPSBhcmd1bWVudHNbMV07XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIElmIG5vIGNhbGxiYWNrIGZ1bmN0aW9uIG9yIGlmIGNhbGxiYWNrIGlzIG5vdCBhIGNhbGxhYmxlIGZ1bmN0aW9uXG4gICAgICAgICAgICBpZiAoIWlzQ2FsbGFibGUoY2FsbGJhY2tmbikpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdBcnJheS5wcm90b3R5cGUuZXZlcnkgY2FsbGJhY2sgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBpZiAoaSBpbiBzZWxmICYmICEodHlwZW9mIFQgPT09ICd1bmRlZmluZWQnID8gY2FsbGJhY2tmbihzZWxmW2ldLCBpLCBvYmplY3QpIDogY2FsbGJhY2tmbi5jYWxsKFQsIHNlbGZbaV0sIGksIG9iamVjdCkpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH0sICFwcm9wZXJseUJveGVzQ29udGV4dChBcnJheVByb3RvdHlwZS5ldmVyeSkpO1xuXG4gICAgLy8gRVM1IDE1LjQuNC4xN1xuICAgIC8vIGh0dHA6Ly9lczUuZ2l0aHViLmNvbS8jeDE1LjQuNC4xN1xuICAgIC8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuL0phdmFTY3JpcHQvUmVmZXJlbmNlL0dsb2JhbF9PYmplY3RzL0FycmF5L3NvbWVcbiAgICBkZWZpbmVQcm9wZXJ0aWVzKEFycmF5UHJvdG90eXBlLCB7XG4gICAgICAgIHNvbWU6IGZ1bmN0aW9uIHNvbWUoY2FsbGJhY2tmbi8qLCB0aGlzQXJnICovKSB7XG4gICAgICAgICAgICB2YXIgb2JqZWN0ID0gRVMuVG9PYmplY3QodGhpcyk7XG4gICAgICAgICAgICB2YXIgc2VsZiA9IHNwbGl0U3RyaW5nICYmIGlzU3RyaW5nKHRoaXMpID8gc3RyU3BsaXQodGhpcywgJycpIDogb2JqZWN0O1xuICAgICAgICAgICAgdmFyIGxlbmd0aCA9IEVTLlRvVWludDMyKHNlbGYubGVuZ3RoKTtcbiAgICAgICAgICAgIHZhciBUO1xuICAgICAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKSB7XG4gICAgICAgICAgICAgICAgVCA9IGFyZ3VtZW50c1sxXTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gSWYgbm8gY2FsbGJhY2sgZnVuY3Rpb24gb3IgaWYgY2FsbGJhY2sgaXMgbm90IGEgY2FsbGFibGUgZnVuY3Rpb25cbiAgICAgICAgICAgIGlmICghaXNDYWxsYWJsZShjYWxsYmFja2ZuKSkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0FycmF5LnByb3RvdHlwZS5zb21lIGNhbGxiYWNrIG11c3QgYmUgYSBmdW5jdGlvbicpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgaWYgKGkgaW4gc2VsZiAmJiAodHlwZW9mIFQgPT09ICd1bmRlZmluZWQnID8gY2FsbGJhY2tmbihzZWxmW2ldLCBpLCBvYmplY3QpIDogY2FsbGJhY2tmbi5jYWxsKFQsIHNlbGZbaV0sIGksIG9iamVjdCkpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgIH0sICFwcm9wZXJseUJveGVzQ29udGV4dChBcnJheVByb3RvdHlwZS5zb21lKSk7XG5cbiAgICAvLyBFUzUgMTUuNC40LjIxXG4gICAgLy8gaHR0cDovL2VzNS5naXRodWIuY29tLyN4MTUuNC40LjIxXG4gICAgLy8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4vQ29yZV9KYXZhU2NyaXB0XzEuNV9SZWZlcmVuY2UvT2JqZWN0cy9BcnJheS9yZWR1Y2VcbiAgICB2YXIgcmVkdWNlQ29lcmNlc1RvT2JqZWN0ID0gZmFsc2U7XG4gICAgaWYgKEFycmF5UHJvdG90eXBlLnJlZHVjZSkge1xuICAgICAgICByZWR1Y2VDb2VyY2VzVG9PYmplY3QgPSB0eXBlb2YgQXJyYXlQcm90b3R5cGUucmVkdWNlLmNhbGwoJ2VzNScsIGZ1bmN0aW9uIChfLCBfXywgX19fLCBsaXN0KSB7XG4gICAgICAgICAgICByZXR1cm4gbGlzdDtcbiAgICAgICAgfSkgPT09ICdvYmplY3QnO1xuICAgIH1cbiAgICBkZWZpbmVQcm9wZXJ0aWVzKEFycmF5UHJvdG90eXBlLCB7XG4gICAgICAgIHJlZHVjZTogZnVuY3Rpb24gcmVkdWNlKGNhbGxiYWNrZm4vKiwgaW5pdGlhbFZhbHVlKi8pIHtcbiAgICAgICAgICAgIHZhciBvYmplY3QgPSBFUy5Ub09iamVjdCh0aGlzKTtcbiAgICAgICAgICAgIHZhciBzZWxmID0gc3BsaXRTdHJpbmcgJiYgaXNTdHJpbmcodGhpcykgPyBzdHJTcGxpdCh0aGlzLCAnJykgOiBvYmplY3Q7XG4gICAgICAgICAgICB2YXIgbGVuZ3RoID0gRVMuVG9VaW50MzIoc2VsZi5sZW5ndGgpO1xuXG4gICAgICAgICAgICAvLyBJZiBubyBjYWxsYmFjayBmdW5jdGlvbiBvciBpZiBjYWxsYmFjayBpcyBub3QgYSBjYWxsYWJsZSBmdW5jdGlvblxuICAgICAgICAgICAgaWYgKCFpc0NhbGxhYmxlKGNhbGxiYWNrZm4pKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignQXJyYXkucHJvdG90eXBlLnJlZHVjZSBjYWxsYmFjayBtdXN0IGJlIGEgZnVuY3Rpb24nKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gbm8gdmFsdWUgdG8gcmV0dXJuIGlmIG5vIGluaXRpYWwgdmFsdWUgYW5kIGFuIGVtcHR5IGFycmF5XG4gICAgICAgICAgICBpZiAobGVuZ3RoID09PSAwICYmIGFyZ3VtZW50cy5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdyZWR1Y2Ugb2YgZW1wdHkgYXJyYXkgd2l0aCBubyBpbml0aWFsIHZhbHVlJyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBpID0gMDtcbiAgICAgICAgICAgIHZhciByZXN1bHQ7XG4gICAgICAgICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+PSAyKSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gYXJndW1lbnRzWzFdO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBkbyB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChpIGluIHNlbGYpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdCA9IHNlbGZbaSsrXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gaWYgYXJyYXkgY29udGFpbnMgbm8gdmFsdWVzLCBubyBpbml0aWFsIHZhbHVlIHRvIHJldHVyblxuICAgICAgICAgICAgICAgICAgICBpZiAoKytpID49IGxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcigncmVkdWNlIG9mIGVtcHR5IGFycmF5IHdpdGggbm8gaW5pdGlhbCB2YWx1ZScpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSB3aGlsZSAodHJ1ZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZvciAoOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBpZiAoaSBpbiBzZWxmKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdCA9IGNhbGxiYWNrZm4ocmVzdWx0LCBzZWxmW2ldLCBpLCBvYmplY3QpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgfVxuICAgIH0sICFyZWR1Y2VDb2VyY2VzVG9PYmplY3QpO1xuXG4gICAgLy8gRVM1IDE1LjQuNC4yMlxuICAgIC8vIGh0dHA6Ly9lczUuZ2l0aHViLmNvbS8jeDE1LjQuNC4yMlxuICAgIC8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuL0NvcmVfSmF2YVNjcmlwdF8xLjVfUmVmZXJlbmNlL09iamVjdHMvQXJyYXkvcmVkdWNlUmlnaHRcbiAgICB2YXIgcmVkdWNlUmlnaHRDb2VyY2VzVG9PYmplY3QgPSBmYWxzZTtcbiAgICBpZiAoQXJyYXlQcm90b3R5cGUucmVkdWNlUmlnaHQpIHtcbiAgICAgICAgcmVkdWNlUmlnaHRDb2VyY2VzVG9PYmplY3QgPSB0eXBlb2YgQXJyYXlQcm90b3R5cGUucmVkdWNlUmlnaHQuY2FsbCgnZXM1JywgZnVuY3Rpb24gKF8sIF9fLCBfX18sIGxpc3QpIHtcbiAgICAgICAgICAgIHJldHVybiBsaXN0O1xuICAgICAgICB9KSA9PT0gJ29iamVjdCc7XG4gICAgfVxuICAgIGRlZmluZVByb3BlcnRpZXMoQXJyYXlQcm90b3R5cGUsIHtcbiAgICAgICAgcmVkdWNlUmlnaHQ6IGZ1bmN0aW9uIHJlZHVjZVJpZ2h0KGNhbGxiYWNrZm4vKiwgaW5pdGlhbCovKSB7XG4gICAgICAgICAgICB2YXIgb2JqZWN0ID0gRVMuVG9PYmplY3QodGhpcyk7XG4gICAgICAgICAgICB2YXIgc2VsZiA9IHNwbGl0U3RyaW5nICYmIGlzU3RyaW5nKHRoaXMpID8gc3RyU3BsaXQodGhpcywgJycpIDogb2JqZWN0O1xuICAgICAgICAgICAgdmFyIGxlbmd0aCA9IEVTLlRvVWludDMyKHNlbGYubGVuZ3RoKTtcblxuICAgICAgICAgICAgLy8gSWYgbm8gY2FsbGJhY2sgZnVuY3Rpb24gb3IgaWYgY2FsbGJhY2sgaXMgbm90IGEgY2FsbGFibGUgZnVuY3Rpb25cbiAgICAgICAgICAgIGlmICghaXNDYWxsYWJsZShjYWxsYmFja2ZuKSkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0FycmF5LnByb3RvdHlwZS5yZWR1Y2VSaWdodCBjYWxsYmFjayBtdXN0IGJlIGEgZnVuY3Rpb24nKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gbm8gdmFsdWUgdG8gcmV0dXJuIGlmIG5vIGluaXRpYWwgdmFsdWUsIGVtcHR5IGFycmF5XG4gICAgICAgICAgICBpZiAobGVuZ3RoID09PSAwICYmIGFyZ3VtZW50cy5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdyZWR1Y2VSaWdodCBvZiBlbXB0eSBhcnJheSB3aXRoIG5vIGluaXRpYWwgdmFsdWUnKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIHJlc3VsdDtcbiAgICAgICAgICAgIHZhciBpID0gbGVuZ3RoIC0gMTtcbiAgICAgICAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID49IDIpIHtcbiAgICAgICAgICAgICAgICByZXN1bHQgPSBhcmd1bWVudHNbMV07XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGRvIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGkgaW4gc2VsZikge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0ID0gc2VsZltpLS1dO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAvLyBpZiBhcnJheSBjb250YWlucyBubyB2YWx1ZXMsIG5vIGluaXRpYWwgdmFsdWUgdG8gcmV0dXJuXG4gICAgICAgICAgICAgICAgICAgIGlmICgtLWkgPCAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdyZWR1Y2VSaWdodCBvZiBlbXB0eSBhcnJheSB3aXRoIG5vIGluaXRpYWwgdmFsdWUnKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gd2hpbGUgKHRydWUpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoaSA8IDApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBkbyB7XG4gICAgICAgICAgICAgICAgaWYgKGkgaW4gc2VsZikge1xuICAgICAgICAgICAgICAgICAgICByZXN1bHQgPSBjYWxsYmFja2ZuKHJlc3VsdCwgc2VsZltpXSwgaSwgb2JqZWN0KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IHdoaWxlIChpLS0pO1xuXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICB9XG4gICAgfSwgIXJlZHVjZVJpZ2h0Q29lcmNlc1RvT2JqZWN0KTtcblxuICAgIC8vIEVTNSAxNS40LjQuMTRcbiAgICAvLyBodHRwOi8vZXM1LmdpdGh1Yi5jb20vI3gxNS40LjQuMTRcbiAgICAvLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9HbG9iYWxfT2JqZWN0cy9BcnJheS9pbmRleE9mXG4gICAgdmFyIGhhc0ZpcmVmb3gySW5kZXhPZkJ1ZyA9IEFycmF5UHJvdG90eXBlLmluZGV4T2YgJiYgWzAsIDFdLmluZGV4T2YoMSwgMikgIT09IC0xO1xuICAgIGRlZmluZVByb3BlcnRpZXMoQXJyYXlQcm90b3R5cGUsIHtcbiAgICAgICAgaW5kZXhPZjogZnVuY3Rpb24gaW5kZXhPZihzZWFyY2hFbGVtZW50LyosIGZyb21JbmRleCAqLykge1xuICAgICAgICAgICAgdmFyIHNlbGYgPSBzcGxpdFN0cmluZyAmJiBpc1N0cmluZyh0aGlzKSA/IHN0clNwbGl0KHRoaXMsICcnKSA6IEVTLlRvT2JqZWN0KHRoaXMpO1xuICAgICAgICAgICAgdmFyIGxlbmd0aCA9IEVTLlRvVWludDMyKHNlbGYubGVuZ3RoKTtcblxuICAgICAgICAgICAgaWYgKGxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgIHJldHVybiAtMTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIGkgPSAwO1xuICAgICAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKSB7XG4gICAgICAgICAgICAgICAgaSA9IEVTLlRvSW50ZWdlcihhcmd1bWVudHNbMV0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBoYW5kbGUgbmVnYXRpdmUgaW5kaWNlc1xuICAgICAgICAgICAgaSA9IGkgPj0gMCA/IGkgOiBtYXgoMCwgbGVuZ3RoICsgaSk7XG4gICAgICAgICAgICBmb3IgKDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgaWYgKGkgaW4gc2VsZiAmJiBzZWxmW2ldID09PSBzZWFyY2hFbGVtZW50KSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiAtMTtcbiAgICAgICAgfVxuICAgIH0sIGhhc0ZpcmVmb3gySW5kZXhPZkJ1Zyk7XG5cbiAgICAvLyBFUzUgMTUuNC40LjE1XG4gICAgLy8gaHR0cDovL2VzNS5naXRodWIuY29tLyN4MTUuNC40LjE1XG4gICAgLy8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4vSmF2YVNjcmlwdC9SZWZlcmVuY2UvR2xvYmFsX09iamVjdHMvQXJyYXkvbGFzdEluZGV4T2ZcbiAgICB2YXIgaGFzRmlyZWZveDJMYXN0SW5kZXhPZkJ1ZyA9IEFycmF5UHJvdG90eXBlLmxhc3RJbmRleE9mICYmIFswLCAxXS5sYXN0SW5kZXhPZigwLCAtMykgIT09IC0xO1xuICAgIGRlZmluZVByb3BlcnRpZXMoQXJyYXlQcm90b3R5cGUsIHtcbiAgICAgICAgbGFzdEluZGV4T2Y6IGZ1bmN0aW9uIGxhc3RJbmRleE9mKHNlYXJjaEVsZW1lbnQvKiwgZnJvbUluZGV4ICovKSB7XG4gICAgICAgICAgICB2YXIgc2VsZiA9IHNwbGl0U3RyaW5nICYmIGlzU3RyaW5nKHRoaXMpID8gc3RyU3BsaXQodGhpcywgJycpIDogRVMuVG9PYmplY3QodGhpcyk7XG4gICAgICAgICAgICB2YXIgbGVuZ3RoID0gRVMuVG9VaW50MzIoc2VsZi5sZW5ndGgpO1xuXG4gICAgICAgICAgICBpZiAobGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIC0xO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIGkgPSBsZW5ndGggLSAxO1xuICAgICAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKSB7XG4gICAgICAgICAgICAgICAgaSA9IG1pbihpLCBFUy5Ub0ludGVnZXIoYXJndW1lbnRzWzFdKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBoYW5kbGUgbmVnYXRpdmUgaW5kaWNlc1xuICAgICAgICAgICAgaSA9IGkgPj0gMCA/IGkgOiBsZW5ndGggLSBNYXRoLmFicyhpKTtcbiAgICAgICAgICAgIGZvciAoOyBpID49IDA7IGktLSkge1xuICAgICAgICAgICAgICAgIGlmIChpIGluIHNlbGYgJiYgc2VhcmNoRWxlbWVudCA9PT0gc2VsZltpXSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gaTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gLTE7XG4gICAgICAgIH1cbiAgICB9LCBoYXNGaXJlZm94Mkxhc3RJbmRleE9mQnVnKTtcblxuICAgIC8vIEVTNSAxNS40LjQuMTJcbiAgICAvLyBodHRwOi8vZXM1LmdpdGh1Yi5jb20vI3gxNS40LjQuMTJcbiAgICB2YXIgc3BsaWNlTm9vcFJldHVybnNFbXB0eUFycmF5ID0gKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGEgPSBbMSwgMl07XG4gICAgICAgIHZhciByZXN1bHQgPSBhLnNwbGljZSgpO1xuICAgICAgICByZXR1cm4gYS5sZW5ndGggPT09IDIgJiYgaXNBcnJheShyZXN1bHQpICYmIHJlc3VsdC5sZW5ndGggPT09IDA7XG4gICAgfSgpKTtcbiAgICBkZWZpbmVQcm9wZXJ0aWVzKEFycmF5UHJvdG90eXBlLCB7XG4gICAgICAgIC8vIFNhZmFyaSA1LjAgYnVnIHdoZXJlIC5zcGxpY2UoKSByZXR1cm5zIHVuZGVmaW5lZFxuICAgICAgICBzcGxpY2U6IGZ1bmN0aW9uIHNwbGljZShzdGFydCwgZGVsZXRlQ291bnQpIHtcbiAgICAgICAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gYXJyYXlfc3BsaWNlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LCAhc3BsaWNlTm9vcFJldHVybnNFbXB0eUFycmF5KTtcblxuICAgIHZhciBzcGxpY2VXb3Jrc1dpdGhFbXB0eU9iamVjdCA9IChmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBvYmogPSB7fTtcbiAgICAgICAgQXJyYXlQcm90b3R5cGUuc3BsaWNlLmNhbGwob2JqLCAwLCAwLCAxKTtcbiAgICAgICAgcmV0dXJuIG9iai5sZW5ndGggPT09IDE7XG4gICAgfSgpKTtcbiAgICBkZWZpbmVQcm9wZXJ0aWVzKEFycmF5UHJvdG90eXBlLCB7XG4gICAgICAgIHNwbGljZTogZnVuY3Rpb24gc3BsaWNlKHN0YXJ0LCBkZWxldGVDb3VudCkge1xuICAgICAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gW107XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgYXJncyA9IGFyZ3VtZW50cztcbiAgICAgICAgICAgIHRoaXMubGVuZ3RoID0gbWF4KEVTLlRvSW50ZWdlcih0aGlzLmxlbmd0aCksIDApO1xuICAgICAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIHR5cGVvZiBkZWxldGVDb3VudCAhPT0gJ251bWJlcicpIHtcbiAgICAgICAgICAgICAgICBhcmdzID0gYXJyYXlTbGljZShhcmd1bWVudHMpO1xuICAgICAgICAgICAgICAgIGlmIChhcmdzLmxlbmd0aCA8IDIpIHtcbiAgICAgICAgICAgICAgICAgICAgcHVzaENhbGwoYXJncywgdGhpcy5sZW5ndGggLSBzdGFydCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgYXJnc1sxXSA9IEVTLlRvSW50ZWdlcihkZWxldGVDb3VudCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGFycmF5X3NwbGljZS5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICAgICAgfVxuICAgIH0sICFzcGxpY2VXb3Jrc1dpdGhFbXB0eU9iamVjdCk7XG4gICAgdmFyIHNwbGljZVdvcmtzV2l0aExhcmdlU3BhcnNlQXJyYXlzID0gKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgLy8gUGVyIGh0dHBzOi8vZ2l0aHViLmNvbS9lcy1zaGltcy9lczUtc2hpbS9pc3N1ZXMvMjk1XG4gICAgICAgIC8vIFNhZmFyaSA3LzggYnJlYWtzIHdpdGggc3BhcnNlIGFycmF5cyBvZiBzaXplIDFlNSBvciBncmVhdGVyXG4gICAgICAgIHZhciBhcnIgPSBuZXcgJEFycmF5KDFlNSk7XG4gICAgICAgIC8vIG5vdGU6IHRoZSBpbmRleCBNVVNUIGJlIDggb3IgbGFyZ2VyIG9yIHRoZSB0ZXN0IHdpbGwgZmFsc2UgcGFzc1xuICAgICAgICBhcnJbOF0gPSAneCc7XG4gICAgICAgIGFyci5zcGxpY2UoMSwgMSk7XG4gICAgICAgIC8vIG5vdGU6IHRoaXMgdGVzdCBtdXN0IGJlIGRlZmluZWQgKmFmdGVyKiB0aGUgaW5kZXhPZiBzaGltXG4gICAgICAgIC8vIHBlciBodHRwczovL2dpdGh1Yi5jb20vZXMtc2hpbXMvZXM1LXNoaW0vaXNzdWVzLzMxM1xuICAgICAgICByZXR1cm4gYXJyLmluZGV4T2YoJ3gnKSA9PT0gNztcbiAgICB9KCkpO1xuICAgIHZhciBzcGxpY2VXb3Jrc1dpdGhTbWFsbFNwYXJzZUFycmF5cyA9IChmdW5jdGlvbiAoKSB7XG4gICAgICAgIC8vIFBlciBodHRwczovL2dpdGh1Yi5jb20vZXMtc2hpbXMvZXM1LXNoaW0vaXNzdWVzLzI5NVxuICAgICAgICAvLyBPcGVyYSAxMi4xNSBicmVha3Mgb24gdGhpcywgbm8gaWRlYSB3aHkuXG4gICAgICAgIHZhciBuID0gMjU2O1xuICAgICAgICB2YXIgYXJyID0gW107XG4gICAgICAgIGFycltuXSA9ICdhJztcbiAgICAgICAgYXJyLnNwbGljZShuICsgMSwgMCwgJ2InKTtcbiAgICAgICAgcmV0dXJuIGFycltuXSA9PT0gJ2EnO1xuICAgIH0oKSk7XG4gICAgZGVmaW5lUHJvcGVydGllcyhBcnJheVByb3RvdHlwZSwge1xuICAgICAgICBzcGxpY2U6IGZ1bmN0aW9uIHNwbGljZShzdGFydCwgZGVsZXRlQ291bnQpIHtcbiAgICAgICAgICAgIHZhciBPID0gRVMuVG9PYmplY3QodGhpcyk7XG4gICAgICAgICAgICB2YXIgQSA9IFtdO1xuICAgICAgICAgICAgdmFyIGxlbiA9IEVTLlRvVWludDMyKE8ubGVuZ3RoKTtcbiAgICAgICAgICAgIHZhciByZWxhdGl2ZVN0YXJ0ID0gRVMuVG9JbnRlZ2VyKHN0YXJ0KTtcbiAgICAgICAgICAgIHZhciBhY3R1YWxTdGFydCA9IHJlbGF0aXZlU3RhcnQgPCAwID8gbWF4KChsZW4gKyByZWxhdGl2ZVN0YXJ0KSwgMCkgOiBtaW4ocmVsYXRpdmVTdGFydCwgbGVuKTtcbiAgICAgICAgICAgIHZhciBhY3R1YWxEZWxldGVDb3VudCA9IG1pbihtYXgoRVMuVG9JbnRlZ2VyKGRlbGV0ZUNvdW50KSwgMCksIGxlbiAtIGFjdHVhbFN0YXJ0KTtcblxuICAgICAgICAgICAgdmFyIGsgPSAwO1xuICAgICAgICAgICAgdmFyIGZyb207XG4gICAgICAgICAgICB3aGlsZSAoayA8IGFjdHVhbERlbGV0ZUNvdW50KSB7XG4gICAgICAgICAgICAgICAgZnJvbSA9ICRTdHJpbmcoYWN0dWFsU3RhcnQgKyBrKTtcbiAgICAgICAgICAgICAgICBpZiAob3ducyhPLCBmcm9tKSkge1xuICAgICAgICAgICAgICAgICAgICBBW2tdID0gT1tmcm9tXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgayArPSAxO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgaXRlbXMgPSBhcnJheVNsaWNlKGFyZ3VtZW50cywgMik7XG4gICAgICAgICAgICB2YXIgaXRlbUNvdW50ID0gaXRlbXMubGVuZ3RoO1xuICAgICAgICAgICAgdmFyIHRvO1xuICAgICAgICAgICAgaWYgKGl0ZW1Db3VudCA8IGFjdHVhbERlbGV0ZUNvdW50KSB7XG4gICAgICAgICAgICAgICAgayA9IGFjdHVhbFN0YXJ0O1xuICAgICAgICAgICAgICAgIHZhciBtYXhLID0gbGVuIC0gYWN0dWFsRGVsZXRlQ291bnQ7XG4gICAgICAgICAgICAgICAgd2hpbGUgKGsgPCBtYXhLKSB7XG4gICAgICAgICAgICAgICAgICAgIGZyb20gPSAkU3RyaW5nKGsgKyBhY3R1YWxEZWxldGVDb3VudCk7XG4gICAgICAgICAgICAgICAgICAgIHRvID0gJFN0cmluZyhrICsgaXRlbUNvdW50KTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG93bnMoTywgZnJvbSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIE9bdG9dID0gT1tmcm9tXTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZSBPW3RvXTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBrICs9IDE7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGsgPSBsZW47XG4gICAgICAgICAgICAgICAgdmFyIG1pbksgPSBsZW4gLSBhY3R1YWxEZWxldGVDb3VudCArIGl0ZW1Db3VudDtcbiAgICAgICAgICAgICAgICB3aGlsZSAoayA+IG1pbkspIHtcbiAgICAgICAgICAgICAgICAgICAgZGVsZXRlIE9bayAtIDFdO1xuICAgICAgICAgICAgICAgICAgICBrIC09IDE7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmIChpdGVtQ291bnQgPiBhY3R1YWxEZWxldGVDb3VudCkge1xuICAgICAgICAgICAgICAgIGsgPSBsZW4gLSBhY3R1YWxEZWxldGVDb3VudDtcbiAgICAgICAgICAgICAgICB3aGlsZSAoayA+IGFjdHVhbFN0YXJ0KSB7XG4gICAgICAgICAgICAgICAgICAgIGZyb20gPSAkU3RyaW5nKGsgKyBhY3R1YWxEZWxldGVDb3VudCAtIDEpO1xuICAgICAgICAgICAgICAgICAgICB0byA9ICRTdHJpbmcoayArIGl0ZW1Db3VudCAtIDEpO1xuICAgICAgICAgICAgICAgICAgICBpZiAob3ducyhPLCBmcm9tKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgT1t0b10gPSBPW2Zyb21dO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlIE9bdG9dO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGsgLT0gMTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBrID0gYWN0dWFsU3RhcnQ7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGl0ZW1zLmxlbmd0aDsgKytpKSB7XG4gICAgICAgICAgICAgICAgT1trXSA9IGl0ZW1zW2ldO1xuICAgICAgICAgICAgICAgIGsgKz0gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIE8ubGVuZ3RoID0gbGVuIC0gYWN0dWFsRGVsZXRlQ291bnQgKyBpdGVtQ291bnQ7XG5cbiAgICAgICAgICAgIHJldHVybiBBO1xuICAgICAgICB9XG4gICAgfSwgIXNwbGljZVdvcmtzV2l0aExhcmdlU3BhcnNlQXJyYXlzIHx8ICFzcGxpY2VXb3Jrc1dpdGhTbWFsbFNwYXJzZUFycmF5cyk7XG5cbiAgICB2YXIgb3JpZ2luYWxKb2luID0gQXJyYXlQcm90b3R5cGUuam9pbjtcbiAgICB2YXIgaGFzU3RyaW5nSm9pbkJ1ZztcbiAgICB0cnkge1xuICAgICAgICBoYXNTdHJpbmdKb2luQnVnID0gQXJyYXkucHJvdG90eXBlLmpvaW4uY2FsbCgnMTIzJywgJywnKSAhPT0gJzEsMiwzJztcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGhhc1N0cmluZ0pvaW5CdWcgPSB0cnVlO1xuICAgIH1cbiAgICBpZiAoaGFzU3RyaW5nSm9pbkJ1Zykge1xuICAgICAgICBkZWZpbmVQcm9wZXJ0aWVzKEFycmF5UHJvdG90eXBlLCB7XG4gICAgICAgICAgICBqb2luOiBmdW5jdGlvbiBqb2luKHNlcGFyYXRvcikge1xuICAgICAgICAgICAgICAgIHZhciBzZXAgPSB0eXBlb2Ygc2VwYXJhdG9yID09PSAndW5kZWZpbmVkJyA/ICcsJyA6IHNlcGFyYXRvcjtcbiAgICAgICAgICAgICAgICByZXR1cm4gb3JpZ2luYWxKb2luLmNhbGwoaXNTdHJpbmcodGhpcykgPyBzdHJTcGxpdCh0aGlzLCAnJykgOiB0aGlzLCBzZXApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LCBoYXNTdHJpbmdKb2luQnVnKTtcbiAgICB9XG5cbiAgICB2YXIgaGFzSm9pblVuZGVmaW5lZEJ1ZyA9IFsxLCAyXS5qb2luKHVuZGVmaW5lZCkgIT09ICcxLDInO1xuICAgIGlmIChoYXNKb2luVW5kZWZpbmVkQnVnKSB7XG4gICAgICAgIGRlZmluZVByb3BlcnRpZXMoQXJyYXlQcm90b3R5cGUsIHtcbiAgICAgICAgICAgIGpvaW46IGZ1bmN0aW9uIGpvaW4oc2VwYXJhdG9yKSB7XG4gICAgICAgICAgICAgICAgdmFyIHNlcCA9IHR5cGVvZiBzZXBhcmF0b3IgPT09ICd1bmRlZmluZWQnID8gJywnIDogc2VwYXJhdG9yO1xuICAgICAgICAgICAgICAgIHJldHVybiBvcmlnaW5hbEpvaW4uY2FsbCh0aGlzLCBzZXApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LCBoYXNKb2luVW5kZWZpbmVkQnVnKTtcbiAgICB9XG5cbiAgICB2YXIgcHVzaFNoaW0gPSBmdW5jdGlvbiBwdXNoKGl0ZW0pIHtcbiAgICAgICAgdmFyIE8gPSBFUy5Ub09iamVjdCh0aGlzKTtcbiAgICAgICAgdmFyIG4gPSBFUy5Ub1VpbnQzMihPLmxlbmd0aCk7XG4gICAgICAgIHZhciBpID0gMDtcbiAgICAgICAgd2hpbGUgKGkgPCBhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgICAgICAgICBPW24gKyBpXSA9IGFyZ3VtZW50c1tpXTtcbiAgICAgICAgICAgIGkgKz0gMTtcbiAgICAgICAgfVxuICAgICAgICBPLmxlbmd0aCA9IG4gKyBpO1xuICAgICAgICByZXR1cm4gbiArIGk7XG4gICAgfTtcblxuICAgIHZhciBwdXNoSXNOb3RHZW5lcmljID0gKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIG9iaiA9IHt9O1xuICAgICAgICB2YXIgcmVzdWx0ID0gQXJyYXkucHJvdG90eXBlLnB1c2guY2FsbChvYmosIHVuZGVmaW5lZCk7XG4gICAgICAgIHJldHVybiByZXN1bHQgIT09IDEgfHwgb2JqLmxlbmd0aCAhPT0gMSB8fCB0eXBlb2Ygb2JqWzBdICE9PSAndW5kZWZpbmVkJyB8fCAhb3ducyhvYmosIDApO1xuICAgIH0oKSk7XG4gICAgZGVmaW5lUHJvcGVydGllcyhBcnJheVByb3RvdHlwZSwge1xuICAgICAgICBwdXNoOiBmdW5jdGlvbiBwdXNoKGl0ZW0pIHtcbiAgICAgICAgICAgIGlmIChpc0FycmF5KHRoaXMpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGFycmF5X3B1c2guYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBwdXNoU2hpbS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICB9XG4gICAgfSwgcHVzaElzTm90R2VuZXJpYyk7XG5cbiAgICAvLyBUaGlzIGZpeGVzIGEgdmVyeSB3ZWlyZCBidWcgaW4gT3BlcmEgMTAuNiB3aGVuIHB1c2hpbmcgYHVuZGVmaW5lZFxuICAgIHZhciBwdXNoVW5kZWZpbmVkSXNXZWlyZCA9IChmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBhcnIgPSBbXTtcbiAgICAgICAgdmFyIHJlc3VsdCA9IGFyci5wdXNoKHVuZGVmaW5lZCk7XG4gICAgICAgIHJldHVybiByZXN1bHQgIT09IDEgfHwgYXJyLmxlbmd0aCAhPT0gMSB8fCB0eXBlb2YgYXJyWzBdICE9PSAndW5kZWZpbmVkJyB8fCAhb3ducyhhcnIsIDApO1xuICAgIH0oKSk7XG4gICAgZGVmaW5lUHJvcGVydGllcyhBcnJheVByb3RvdHlwZSwgeyBwdXNoOiBwdXNoU2hpbSB9LCBwdXNoVW5kZWZpbmVkSXNXZWlyZCk7XG5cbiAgICAvLyBFUzUgMTUuMi4zLjE0XG4gICAgLy8gaHR0cDovL2VzNS5naXRodWIuaW8vI3gxNS40LjQuMTBcbiAgICAvLyBGaXggYm94ZWQgc3RyaW5nIGJ1Z1xuICAgIGRlZmluZVByb3BlcnRpZXMoQXJyYXlQcm90b3R5cGUsIHtcbiAgICAgICAgc2xpY2U6IGZ1bmN0aW9uIChzdGFydCwgZW5kKSB7XG4gICAgICAgICAgICB2YXIgYXJyID0gaXNTdHJpbmcodGhpcykgPyBzdHJTcGxpdCh0aGlzLCAnJykgOiB0aGlzO1xuICAgICAgICAgICAgcmV0dXJuIGFycmF5U2xpY2VBcHBseShhcnIsIGFyZ3VtZW50cyk7XG4gICAgICAgIH1cbiAgICB9LCBzcGxpdFN0cmluZyk7XG5cbiAgICB2YXIgc29ydElnbm9yZXNOb25GdW5jdGlvbnMgPSAoZnVuY3Rpb24gKCkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgWzEsIDJdLnNvcnQobnVsbCk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgWzEsIDJdLnNvcnQoe30pO1xuICAgICAgICAgICAgfSBjYXRjaCAoZTIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSgpKTtcbiAgICB2YXIgc29ydFRocm93c09uUmVnZXggPSAoZnVuY3Rpb24gKCkge1xuICAgICAgICAvLyB0aGlzIGlzIGEgcHJvYmxlbSBpbiBGaXJlZm94IDQsIGluIHdoaWNoIGB0eXBlb2YgL2EvID09PSAnZnVuY3Rpb24nYFxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgWzEsIDJdLnNvcnQoL2EvKTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfSBjYXRjaCAoZSkge31cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSgpKTtcbiAgICB2YXIgc29ydElnbm9yZXNVbmRlZmluZWQgPSAoZnVuY3Rpb24gKCkge1xuICAgICAgICAvLyBhcHBsaWVzIGluIElFIDgsIGZvciBvbmUuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBbMSwgMl0uc29ydCh1bmRlZmluZWQpO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHt9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9KCkpO1xuICAgIGRlZmluZVByb3BlcnRpZXMoQXJyYXlQcm90b3R5cGUsIHtcbiAgICAgICAgc29ydDogZnVuY3Rpb24gc29ydChjb21wYXJlRm4pIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgY29tcGFyZUZuID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgICAgIHJldHVybiBhcnJheVNvcnQodGhpcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoIWlzQ2FsbGFibGUoY29tcGFyZUZuKSkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0FycmF5LnByb3RvdHlwZS5zb3J0IGNhbGxiYWNrIG11c3QgYmUgYSBmdW5jdGlvbicpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGFycmF5U29ydCh0aGlzLCBjb21wYXJlRm4pO1xuICAgICAgICB9XG4gICAgfSwgc29ydElnbm9yZXNOb25GdW5jdGlvbnMgfHwgIXNvcnRJZ25vcmVzVW5kZWZpbmVkIHx8ICFzb3J0VGhyb3dzT25SZWdleCk7XG5cbiAgICAvL1xuICAgIC8vIE9iamVjdFxuICAgIC8vID09PT09PVxuICAgIC8vXG5cbiAgICAvLyBFUzUgMTUuMi4zLjE0XG4gICAgLy8gaHR0cDovL2VzNS5naXRodWIuY29tLyN4MTUuMi4zLjE0XG5cbiAgICAvLyBodHRwOi8vd2hhdHRoZWhlYWRzYWlkLmNvbS8yMDEwLzEwL2Etc2FmZXItb2JqZWN0LWtleXMtY29tcGF0aWJpbGl0eS1pbXBsZW1lbnRhdGlvblxuICAgIHZhciBoYXNEb250RW51bUJ1ZyA9ICFpc0VudW0oeyAndG9TdHJpbmcnOiBudWxsIH0sICd0b1N0cmluZycpOyAvLyBqc2NzOmlnbm9yZSBkaXNhbGxvd1F1b3RlZEtleXNJbk9iamVjdHNcbiAgICB2YXIgaGFzUHJvdG9FbnVtQnVnID0gaXNFbnVtKGZ1bmN0aW9uICgpIHt9LCAncHJvdG90eXBlJyk7XG4gICAgdmFyIGhhc1N0cmluZ0VudW1CdWcgPSAhb3ducygneCcsICcwJyk7XG4gICAgdmFyIGVxdWFsc0NvbnN0cnVjdG9yUHJvdG90eXBlID0gZnVuY3Rpb24gKG8pIHtcbiAgICAgICAgdmFyIGN0b3IgPSBvLmNvbnN0cnVjdG9yO1xuICAgICAgICByZXR1cm4gY3RvciAmJiBjdG9yLnByb3RvdHlwZSA9PT0gbztcbiAgICB9O1xuICAgIHZhciBleGNsdWRlZEtleXMgPSB7XG4gICAgICAgICR3aW5kb3c6IHRydWUsXG4gICAgICAgICRjb25zb2xlOiB0cnVlLFxuICAgICAgICAkcGFyZW50OiB0cnVlLFxuICAgICAgICAkc2VsZjogdHJ1ZSxcbiAgICAgICAgJGZyYW1lOiB0cnVlLFxuICAgICAgICAkZnJhbWVzOiB0cnVlLFxuICAgICAgICAkZnJhbWVFbGVtZW50OiB0cnVlLFxuICAgICAgICAkd2Via2l0SW5kZXhlZERCOiB0cnVlLFxuICAgICAgICAkd2Via2l0U3RvcmFnZUluZm86IHRydWUsXG4gICAgICAgICRleHRlcm5hbDogdHJ1ZSxcbiAgICAgICAgJHdpZHRoOiB0cnVlLFxuICAgICAgICAkaGVpZ2h0OiB0cnVlLFxuICAgICAgICAkdG9wOiB0cnVlLFxuICAgICAgICAkbG9jYWxTdG9yYWdlOiB0cnVlXG4gICAgfTtcbiAgICB2YXIgaGFzQXV0b21hdGlvbkVxdWFsaXR5QnVnID0gKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgLyogZ2xvYmFscyB3aW5kb3cgKi9cbiAgICAgICAgaWYgKHR5cGVvZiB3aW5kb3cgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgZm9yICh2YXIgayBpbiB3aW5kb3cpIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgaWYgKCFleGNsdWRlZEtleXNbJyQnICsga10gJiYgb3ducyh3aW5kb3csIGspICYmIHdpbmRvd1trXSAhPT0gbnVsbCAmJiB0eXBlb2Ygd2luZG93W2tdID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgICAgICAgICBlcXVhbHNDb25zdHJ1Y3RvclByb3RvdHlwZSh3aW5kb3dba10pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSgpKTtcbiAgICB2YXIgZXF1YWxzQ29uc3RydWN0b3JQcm90b3R5cGVJZk5vdEJ1Z2d5ID0gZnVuY3Rpb24gKG9iamVjdCkge1xuICAgICAgICBpZiAodHlwZW9mIHdpbmRvdyA9PT0gJ3VuZGVmaW5lZCcgfHwgIWhhc0F1dG9tYXRpb25FcXVhbGl0eUJ1Zykge1xuICAgICAgICAgICAgcmV0dXJuIGVxdWFsc0NvbnN0cnVjdG9yUHJvdG90eXBlKG9iamVjdCk7XG4gICAgICAgIH1cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHJldHVybiBlcXVhbHNDb25zdHJ1Y3RvclByb3RvdHlwZShvYmplY3QpO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIHZhciBkb250RW51bXMgPSBbXG4gICAgICAgICd0b1N0cmluZycsXG4gICAgICAgICd0b0xvY2FsZVN0cmluZycsXG4gICAgICAgICd2YWx1ZU9mJyxcbiAgICAgICAgJ2hhc093blByb3BlcnR5JyxcbiAgICAgICAgJ2lzUHJvdG90eXBlT2YnLFxuICAgICAgICAncHJvcGVydHlJc0VudW1lcmFibGUnLFxuICAgICAgICAnY29uc3RydWN0b3InXG4gICAgXTtcbiAgICB2YXIgZG9udEVudW1zTGVuZ3RoID0gZG9udEVudW1zLmxlbmd0aDtcblxuICAgIC8vIHRha2VuIGRpcmVjdGx5IGZyb20gaHR0cHM6Ly9naXRodWIuY29tL2xqaGFyYi9pcy1hcmd1bWVudHMvYmxvYi9tYXN0ZXIvaW5kZXguanNcbiAgICAvLyBjYW4gYmUgcmVwbGFjZWQgd2l0aCByZXF1aXJlKCdpcy1hcmd1bWVudHMnKSBpZiB3ZSBldmVyIHVzZSBhIGJ1aWxkIHByb2Nlc3MgaW5zdGVhZFxuICAgIHZhciBpc1N0YW5kYXJkQXJndW1lbnRzID0gZnVuY3Rpb24gaXNBcmd1bWVudHModmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIHRvU3RyKHZhbHVlKSA9PT0gJ1tvYmplY3QgQXJndW1lbnRzXSc7XG4gICAgfTtcbiAgICB2YXIgaXNMZWdhY3lBcmd1bWVudHMgPSBmdW5jdGlvbiBpc0FyZ3VtZW50cyh2YWx1ZSkge1xuICAgICAgICByZXR1cm4gdmFsdWUgIT09IG51bGxcbiAgICAgICAgICAgICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCdcbiAgICAgICAgICAgICYmIHR5cGVvZiB2YWx1ZS5sZW5ndGggPT09ICdudW1iZXInXG4gICAgICAgICAgICAmJiB2YWx1ZS5sZW5ndGggPj0gMFxuICAgICAgICAgICAgJiYgIWlzQXJyYXkodmFsdWUpXG4gICAgICAgICAgICAmJiBpc0NhbGxhYmxlKHZhbHVlLmNhbGxlZSk7XG4gICAgfTtcbiAgICB2YXIgaXNBcmd1bWVudHMgPSBpc1N0YW5kYXJkQXJndW1lbnRzKGFyZ3VtZW50cykgPyBpc1N0YW5kYXJkQXJndW1lbnRzIDogaXNMZWdhY3lBcmd1bWVudHM7XG5cbiAgICBkZWZpbmVQcm9wZXJ0aWVzKCRPYmplY3QsIHtcbiAgICAgICAga2V5czogZnVuY3Rpb24ga2V5cyhvYmplY3QpIHtcbiAgICAgICAgICAgIHZhciBpc0ZuID0gaXNDYWxsYWJsZShvYmplY3QpO1xuICAgICAgICAgICAgdmFyIGlzQXJncyA9IGlzQXJndW1lbnRzKG9iamVjdCk7XG4gICAgICAgICAgICB2YXIgaXNPYmplY3QgPSBvYmplY3QgIT09IG51bGwgJiYgdHlwZW9mIG9iamVjdCA9PT0gJ29iamVjdCc7XG4gICAgICAgICAgICB2YXIgaXNTdHIgPSBpc09iamVjdCAmJiBpc1N0cmluZyhvYmplY3QpO1xuXG4gICAgICAgICAgICBpZiAoIWlzT2JqZWN0ICYmICFpc0ZuICYmICFpc0FyZ3MpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdPYmplY3Qua2V5cyBjYWxsZWQgb24gYSBub24tb2JqZWN0Jyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciB0aGVLZXlzID0gW107XG4gICAgICAgICAgICB2YXIgc2tpcFByb3RvID0gaGFzUHJvdG9FbnVtQnVnICYmIGlzRm47XG4gICAgICAgICAgICBpZiAoKGlzU3RyICYmIGhhc1N0cmluZ0VudW1CdWcpIHx8IGlzQXJncykge1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgb2JqZWN0Lmxlbmd0aDsgKytpKSB7XG4gICAgICAgICAgICAgICAgICAgIHB1c2hDYWxsKHRoZUtleXMsICRTdHJpbmcoaSkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKCFpc0FyZ3MpIHtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBuYW1lIGluIG9iamVjdCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIShza2lwUHJvdG8gJiYgbmFtZSA9PT0gJ3Byb3RvdHlwZScpICYmIG93bnMob2JqZWN0LCBuYW1lKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcHVzaENhbGwodGhlS2V5cywgJFN0cmluZyhuYW1lKSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChoYXNEb250RW51bUJ1Zykge1xuICAgICAgICAgICAgICAgIHZhciBza2lwQ29uc3RydWN0b3IgPSBlcXVhbHNDb25zdHJ1Y3RvclByb3RvdHlwZUlmTm90QnVnZ3kob2JqZWN0KTtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IGRvbnRFbnVtc0xlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBkb250RW51bSA9IGRvbnRFbnVtc1tqXTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCEoc2tpcENvbnN0cnVjdG9yICYmIGRvbnRFbnVtID09PSAnY29uc3RydWN0b3InKSAmJiBvd25zKG9iamVjdCwgZG9udEVudW0pKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwdXNoQ2FsbCh0aGVLZXlzLCBkb250RW51bSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdGhlS2V5cztcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgdmFyIGtleXNXb3Jrc1dpdGhBcmd1bWVudHMgPSAkT2JqZWN0LmtleXMgJiYgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgLy8gU2FmYXJpIDUuMCBidWdcbiAgICAgICAgcmV0dXJuICRPYmplY3Qua2V5cyhhcmd1bWVudHMpLmxlbmd0aCA9PT0gMjtcbiAgICB9KDEsIDIpKTtcbiAgICB2YXIga2V5c0hhc0FyZ3VtZW50c0xlbmd0aEJ1ZyA9ICRPYmplY3Qua2V5cyAmJiAoZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgYXJnS2V5cyA9ICRPYmplY3Qua2V5cyhhcmd1bWVudHMpO1xuICAgICAgICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aCAhPT0gMSB8fCBhcmdLZXlzLmxlbmd0aCAhPT0gMSB8fCBhcmdLZXlzWzBdICE9PSAxO1xuICAgIH0oMSkpO1xuICAgIHZhciBvcmlnaW5hbEtleXMgPSAkT2JqZWN0LmtleXM7XG4gICAgZGVmaW5lUHJvcGVydGllcygkT2JqZWN0LCB7XG4gICAgICAgIGtleXM6IGZ1bmN0aW9uIGtleXMob2JqZWN0KSB7XG4gICAgICAgICAgICBpZiAoaXNBcmd1bWVudHMob2JqZWN0KSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBvcmlnaW5hbEtleXMoYXJyYXlTbGljZShvYmplY3QpKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG9yaWdpbmFsS2V5cyhvYmplY3QpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSwgIWtleXNXb3Jrc1dpdGhBcmd1bWVudHMgfHwga2V5c0hhc0FyZ3VtZW50c0xlbmd0aEJ1Zyk7XG5cbiAgICAvL1xuICAgIC8vIERhdGVcbiAgICAvLyA9PT09XG4gICAgLy9cblxuICAgIHZhciBoYXNOZWdhdGl2ZU1vbnRoWWVhckJ1ZyA9IG5ldyBEYXRlKC0zNTA5ODI3MzI5NjAwMjkyKS5nZXRVVENNb250aCgpICE9PSAwO1xuICAgIHZhciBhTmVnYXRpdmVUZXN0RGF0ZSA9IG5ldyBEYXRlKC0xNTA5ODQyMjg5NjAwMjkyKTtcbiAgICB2YXIgYVBvc2l0aXZlVGVzdERhdGUgPSBuZXcgRGF0ZSgxNDQ5NjYyNDAwMDAwKTtcbiAgICB2YXIgaGFzVG9VVENTdHJpbmdGb3JtYXRCdWcgPSBhTmVnYXRpdmVUZXN0RGF0ZS50b1VUQ1N0cmluZygpICE9PSAnTW9uLCAwMSBKYW4gLTQ1ODc1IDExOjU5OjU5IEdNVCc7XG4gICAgdmFyIGhhc1RvRGF0ZVN0cmluZ0Zvcm1hdEJ1ZztcbiAgICB2YXIgaGFzVG9TdHJpbmdGb3JtYXRCdWc7XG4gICAgdmFyIHRpbWVab25lT2Zmc2V0ID0gYU5lZ2F0aXZlVGVzdERhdGUuZ2V0VGltZXpvbmVPZmZzZXQoKTtcbiAgICBpZiAodGltZVpvbmVPZmZzZXQgPCAtNzIwKSB7XG4gICAgICAgIGhhc1RvRGF0ZVN0cmluZ0Zvcm1hdEJ1ZyA9IGFOZWdhdGl2ZVRlc3REYXRlLnRvRGF0ZVN0cmluZygpICE9PSAnVHVlIEphbiAwMiAtNDU4NzUnO1xuICAgICAgICBoYXNUb1N0cmluZ0Zvcm1hdEJ1ZyA9ICEoL15UaHUgRGVjIDEwIDIwMTUgXFxkXFxkOlxcZFxcZDpcXGRcXGQgR01UWy0rXVxcZFxcZFxcZFxcZCg/OiB8JCkvKS50ZXN0KFN0cmluZyhhUG9zaXRpdmVUZXN0RGF0ZSkpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGhhc1RvRGF0ZVN0cmluZ0Zvcm1hdEJ1ZyA9IGFOZWdhdGl2ZVRlc3REYXRlLnRvRGF0ZVN0cmluZygpICE9PSAnTW9uIEphbiAwMSAtNDU4NzUnO1xuICAgICAgICBoYXNUb1N0cmluZ0Zvcm1hdEJ1ZyA9ICEoL15XZWQgRGVjIDA5IDIwMTUgXFxkXFxkOlxcZFxcZDpcXGRcXGQgR01UWy0rXVxcZFxcZFxcZFxcZCg/OiB8JCkvKS50ZXN0KFN0cmluZyhhUG9zaXRpdmVUZXN0RGF0ZSkpO1xuICAgIH1cblxuICAgIHZhciBvcmlnaW5hbEdldEZ1bGxZZWFyID0gY2FsbC5iaW5kKERhdGUucHJvdG90eXBlLmdldEZ1bGxZZWFyKTtcbiAgICB2YXIgb3JpZ2luYWxHZXRNb250aCA9IGNhbGwuYmluZChEYXRlLnByb3RvdHlwZS5nZXRNb250aCk7XG4gICAgdmFyIG9yaWdpbmFsR2V0RGF0ZSA9IGNhbGwuYmluZChEYXRlLnByb3RvdHlwZS5nZXREYXRlKTtcbiAgICB2YXIgb3JpZ2luYWxHZXRVVENGdWxsWWVhciA9IGNhbGwuYmluZChEYXRlLnByb3RvdHlwZS5nZXRVVENGdWxsWWVhcik7XG4gICAgdmFyIG9yaWdpbmFsR2V0VVRDTW9udGggPSBjYWxsLmJpbmQoRGF0ZS5wcm90b3R5cGUuZ2V0VVRDTW9udGgpO1xuICAgIHZhciBvcmlnaW5hbEdldFVUQ0RhdGUgPSBjYWxsLmJpbmQoRGF0ZS5wcm90b3R5cGUuZ2V0VVRDRGF0ZSk7XG4gICAgdmFyIG9yaWdpbmFsR2V0VVRDRGF5ID0gY2FsbC5iaW5kKERhdGUucHJvdG90eXBlLmdldFVUQ0RheSk7XG4gICAgdmFyIG9yaWdpbmFsR2V0VVRDSG91cnMgPSBjYWxsLmJpbmQoRGF0ZS5wcm90b3R5cGUuZ2V0VVRDSG91cnMpO1xuICAgIHZhciBvcmlnaW5hbEdldFVUQ01pbnV0ZXMgPSBjYWxsLmJpbmQoRGF0ZS5wcm90b3R5cGUuZ2V0VVRDTWludXRlcyk7XG4gICAgdmFyIG9yaWdpbmFsR2V0VVRDU2Vjb25kcyA9IGNhbGwuYmluZChEYXRlLnByb3RvdHlwZS5nZXRVVENTZWNvbmRzKTtcbiAgICB2YXIgb3JpZ2luYWxHZXRVVENNaWxsaXNlY29uZHMgPSBjYWxsLmJpbmQoRGF0ZS5wcm90b3R5cGUuZ2V0VVRDTWlsbGlzZWNvbmRzKTtcbiAgICB2YXIgZGF5TmFtZSA9IFsnU3VuJywgJ01vbicsICdUdWUnLCAnV2VkJywgJ1RodScsICdGcmknLCAnU2F0J107XG4gICAgdmFyIG1vbnRoTmFtZSA9IFsnSmFuJywgJ0ZlYicsICdNYXInLCAnQXByJywgJ01heScsICdKdW4nLCAnSnVsJywgJ0F1ZycsICdTZXAnLCAnT2N0JywgJ05vdicsICdEZWMnXTtcbiAgICB2YXIgZGF5c0luTW9udGggPSBmdW5jdGlvbiBkYXlzSW5Nb250aChtb250aCwgeWVhcikge1xuICAgICAgICByZXR1cm4gb3JpZ2luYWxHZXREYXRlKG5ldyBEYXRlKHllYXIsIG1vbnRoLCAwKSk7XG4gICAgfTtcblxuICAgIGRlZmluZVByb3BlcnRpZXMoRGF0ZS5wcm90b3R5cGUsIHtcbiAgICAgICAgZ2V0RnVsbFllYXI6IGZ1bmN0aW9uIGdldEZ1bGxZZWFyKCkge1xuICAgICAgICAgICAgaWYgKCF0aGlzIHx8ICEodGhpcyBpbnN0YW5jZW9mIERhdGUpKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcigndGhpcyBpcyBub3QgYSBEYXRlIG9iamVjdC4nKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciB5ZWFyID0gb3JpZ2luYWxHZXRGdWxsWWVhcih0aGlzKTtcbiAgICAgICAgICAgIGlmICh5ZWFyIDwgMCAmJiBvcmlnaW5hbEdldE1vbnRoKHRoaXMpID4gMTEpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4geWVhciArIDE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4geWVhcjtcbiAgICAgICAgfSxcbiAgICAgICAgZ2V0TW9udGg6IGZ1bmN0aW9uIGdldE1vbnRoKCkge1xuICAgICAgICAgICAgaWYgKCF0aGlzIHx8ICEodGhpcyBpbnN0YW5jZW9mIERhdGUpKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcigndGhpcyBpcyBub3QgYSBEYXRlIG9iamVjdC4nKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciB5ZWFyID0gb3JpZ2luYWxHZXRGdWxsWWVhcih0aGlzKTtcbiAgICAgICAgICAgIHZhciBtb250aCA9IG9yaWdpbmFsR2V0TW9udGgodGhpcyk7XG4gICAgICAgICAgICBpZiAoeWVhciA8IDAgJiYgbW9udGggPiAxMSkge1xuICAgICAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIG1vbnRoO1xuICAgICAgICB9LFxuICAgICAgICBnZXREYXRlOiBmdW5jdGlvbiBnZXREYXRlKCkge1xuICAgICAgICAgICAgaWYgKCF0aGlzIHx8ICEodGhpcyBpbnN0YW5jZW9mIERhdGUpKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcigndGhpcyBpcyBub3QgYSBEYXRlIG9iamVjdC4nKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciB5ZWFyID0gb3JpZ2luYWxHZXRGdWxsWWVhcih0aGlzKTtcbiAgICAgICAgICAgIHZhciBtb250aCA9IG9yaWdpbmFsR2V0TW9udGgodGhpcyk7XG4gICAgICAgICAgICB2YXIgZGF0ZSA9IG9yaWdpbmFsR2V0RGF0ZSh0aGlzKTtcbiAgICAgICAgICAgIGlmICh5ZWFyIDwgMCAmJiBtb250aCA+IDExKSB7XG4gICAgICAgICAgICAgICAgaWYgKG1vbnRoID09PSAxMikge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGF0ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdmFyIGRheXMgPSBkYXlzSW5Nb250aCgwLCB5ZWFyICsgMSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIChkYXlzIC0gZGF0ZSkgKyAxO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGRhdGU7XG4gICAgICAgIH0sXG4gICAgICAgIGdldFVUQ0Z1bGxZZWFyOiBmdW5jdGlvbiBnZXRVVENGdWxsWWVhcigpIHtcbiAgICAgICAgICAgIGlmICghdGhpcyB8fCAhKHRoaXMgaW5zdGFuY2VvZiBEYXRlKSkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ3RoaXMgaXMgbm90IGEgRGF0ZSBvYmplY3QuJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgeWVhciA9IG9yaWdpbmFsR2V0VVRDRnVsbFllYXIodGhpcyk7XG4gICAgICAgICAgICBpZiAoeWVhciA8IDAgJiYgb3JpZ2luYWxHZXRVVENNb250aCh0aGlzKSA+IDExKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHllYXIgKyAxO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHllYXI7XG4gICAgICAgIH0sXG4gICAgICAgIGdldFVUQ01vbnRoOiBmdW5jdGlvbiBnZXRVVENNb250aCgpIHtcbiAgICAgICAgICAgIGlmICghdGhpcyB8fCAhKHRoaXMgaW5zdGFuY2VvZiBEYXRlKSkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ3RoaXMgaXMgbm90IGEgRGF0ZSBvYmplY3QuJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgeWVhciA9IG9yaWdpbmFsR2V0VVRDRnVsbFllYXIodGhpcyk7XG4gICAgICAgICAgICB2YXIgbW9udGggPSBvcmlnaW5hbEdldFVUQ01vbnRoKHRoaXMpO1xuICAgICAgICAgICAgaWYgKHllYXIgPCAwICYmIG1vbnRoID4gMTEpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBtb250aDtcbiAgICAgICAgfSxcbiAgICAgICAgZ2V0VVRDRGF0ZTogZnVuY3Rpb24gZ2V0VVRDRGF0ZSgpIHtcbiAgICAgICAgICAgIGlmICghdGhpcyB8fCAhKHRoaXMgaW5zdGFuY2VvZiBEYXRlKSkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ3RoaXMgaXMgbm90IGEgRGF0ZSBvYmplY3QuJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgeWVhciA9IG9yaWdpbmFsR2V0VVRDRnVsbFllYXIodGhpcyk7XG4gICAgICAgICAgICB2YXIgbW9udGggPSBvcmlnaW5hbEdldFVUQ01vbnRoKHRoaXMpO1xuICAgICAgICAgICAgdmFyIGRhdGUgPSBvcmlnaW5hbEdldFVUQ0RhdGUodGhpcyk7XG4gICAgICAgICAgICBpZiAoeWVhciA8IDAgJiYgbW9udGggPiAxMSkge1xuICAgICAgICAgICAgICAgIGlmIChtb250aCA9PT0gMTIpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRhdGU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHZhciBkYXlzID0gZGF5c0luTW9udGgoMCwgeWVhciArIDEpO1xuICAgICAgICAgICAgICAgIHJldHVybiAoZGF5cyAtIGRhdGUpICsgMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBkYXRlO1xuICAgICAgICB9XG4gICAgfSwgaGFzTmVnYXRpdmVNb250aFllYXJCdWcpO1xuXG4gICAgZGVmaW5lUHJvcGVydGllcyhEYXRlLnByb3RvdHlwZSwge1xuICAgICAgICB0b1VUQ1N0cmluZzogZnVuY3Rpb24gdG9VVENTdHJpbmcoKSB7XG4gICAgICAgICAgICBpZiAoIXRoaXMgfHwgISh0aGlzIGluc3RhbmNlb2YgRGF0ZSkpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCd0aGlzIGlzIG5vdCBhIERhdGUgb2JqZWN0LicpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIGRheSA9IG9yaWdpbmFsR2V0VVRDRGF5KHRoaXMpO1xuICAgICAgICAgICAgdmFyIGRhdGUgPSBvcmlnaW5hbEdldFVUQ0RhdGUodGhpcyk7XG4gICAgICAgICAgICB2YXIgbW9udGggPSBvcmlnaW5hbEdldFVUQ01vbnRoKHRoaXMpO1xuICAgICAgICAgICAgdmFyIHllYXIgPSBvcmlnaW5hbEdldFVUQ0Z1bGxZZWFyKHRoaXMpO1xuICAgICAgICAgICAgdmFyIGhvdXIgPSBvcmlnaW5hbEdldFVUQ0hvdXJzKHRoaXMpO1xuICAgICAgICAgICAgdmFyIG1pbnV0ZSA9IG9yaWdpbmFsR2V0VVRDTWludXRlcyh0aGlzKTtcbiAgICAgICAgICAgIHZhciBzZWNvbmQgPSBvcmlnaW5hbEdldFVUQ1NlY29uZHModGhpcyk7XG4gICAgICAgICAgICByZXR1cm4gZGF5TmFtZVtkYXldICsgJywgJ1xuICAgICAgICAgICAgICAgICsgKGRhdGUgPCAxMCA/ICcwJyArIGRhdGUgOiBkYXRlKSArICcgJ1xuICAgICAgICAgICAgICAgICsgbW9udGhOYW1lW21vbnRoXSArICcgJ1xuICAgICAgICAgICAgICAgICsgeWVhciArICcgJ1xuICAgICAgICAgICAgICAgICsgKGhvdXIgPCAxMCA/ICcwJyArIGhvdXIgOiBob3VyKSArICc6J1xuICAgICAgICAgICAgICAgICsgKG1pbnV0ZSA8IDEwID8gJzAnICsgbWludXRlIDogbWludXRlKSArICc6J1xuICAgICAgICAgICAgICAgICsgKHNlY29uZCA8IDEwID8gJzAnICsgc2Vjb25kIDogc2Vjb25kKSArICcgR01UJztcbiAgICAgICAgfVxuICAgIH0sIGhhc05lZ2F0aXZlTW9udGhZZWFyQnVnIHx8IGhhc1RvVVRDU3RyaW5nRm9ybWF0QnVnKTtcblxuICAgIC8vIE9wZXJhIDEyIGhhcyBgLGBcbiAgICBkZWZpbmVQcm9wZXJ0aWVzKERhdGUucHJvdG90eXBlLCB7XG4gICAgICAgIHRvRGF0ZVN0cmluZzogZnVuY3Rpb24gdG9EYXRlU3RyaW5nKCkge1xuICAgICAgICAgICAgaWYgKCF0aGlzIHx8ICEodGhpcyBpbnN0YW5jZW9mIERhdGUpKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcigndGhpcyBpcyBub3QgYSBEYXRlIG9iamVjdC4nKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBkYXkgPSB0aGlzLmdldERheSgpO1xuICAgICAgICAgICAgdmFyIGRhdGUgPSB0aGlzLmdldERhdGUoKTtcbiAgICAgICAgICAgIHZhciBtb250aCA9IHRoaXMuZ2V0TW9udGgoKTtcbiAgICAgICAgICAgIHZhciB5ZWFyID0gdGhpcy5nZXRGdWxsWWVhcigpO1xuICAgICAgICAgICAgcmV0dXJuIGRheU5hbWVbZGF5XSArICcgJ1xuICAgICAgICAgICAgICAgICsgbW9udGhOYW1lW21vbnRoXSArICcgJ1xuICAgICAgICAgICAgICAgICsgKGRhdGUgPCAxMCA/ICcwJyArIGRhdGUgOiBkYXRlKSArICcgJ1xuICAgICAgICAgICAgICAgICsgeWVhcjtcbiAgICAgICAgfVxuICAgIH0sIGhhc05lZ2F0aXZlTW9udGhZZWFyQnVnIHx8IGhhc1RvRGF0ZVN0cmluZ0Zvcm1hdEJ1Zyk7XG5cbiAgICAvLyBjYW4ndCB1c2UgZGVmaW5lUHJvcGVydGllcyBoZXJlIGJlY2F1c2Ugb2YgdG9TdHJpbmcgZW51bWVyYXRpb24gaXNzdWUgaW4gSUUgPD0gOFxuICAgIGlmIChoYXNOZWdhdGl2ZU1vbnRoWWVhckJ1ZyB8fCBoYXNUb1N0cmluZ0Zvcm1hdEJ1Zykge1xuICAgICAgICBEYXRlLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uIHRvU3RyaW5nKCkge1xuICAgICAgICAgICAgaWYgKCF0aGlzIHx8ICEodGhpcyBpbnN0YW5jZW9mIERhdGUpKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcigndGhpcyBpcyBub3QgYSBEYXRlIG9iamVjdC4nKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBkYXkgPSB0aGlzLmdldERheSgpO1xuICAgICAgICAgICAgdmFyIGRhdGUgPSB0aGlzLmdldERhdGUoKTtcbiAgICAgICAgICAgIHZhciBtb250aCA9IHRoaXMuZ2V0TW9udGgoKTtcbiAgICAgICAgICAgIHZhciB5ZWFyID0gdGhpcy5nZXRGdWxsWWVhcigpO1xuICAgICAgICAgICAgdmFyIGhvdXIgPSB0aGlzLmdldEhvdXJzKCk7XG4gICAgICAgICAgICB2YXIgbWludXRlID0gdGhpcy5nZXRNaW51dGVzKCk7XG4gICAgICAgICAgICB2YXIgc2Vjb25kID0gdGhpcy5nZXRTZWNvbmRzKCk7XG4gICAgICAgICAgICB2YXIgdGltZXpvbmVPZmZzZXQgPSB0aGlzLmdldFRpbWV6b25lT2Zmc2V0KCk7XG4gICAgICAgICAgICB2YXIgaG91cnNPZmZzZXQgPSBNYXRoLmZsb29yKE1hdGguYWJzKHRpbWV6b25lT2Zmc2V0KSAvIDYwKTtcbiAgICAgICAgICAgIHZhciBtaW51dGVzT2Zmc2V0ID0gTWF0aC5mbG9vcihNYXRoLmFicyh0aW1lem9uZU9mZnNldCkgJSA2MCk7XG4gICAgICAgICAgICByZXR1cm4gZGF5TmFtZVtkYXldICsgJyAnXG4gICAgICAgICAgICAgICAgKyBtb250aE5hbWVbbW9udGhdICsgJyAnXG4gICAgICAgICAgICAgICAgKyAoZGF0ZSA8IDEwID8gJzAnICsgZGF0ZSA6IGRhdGUpICsgJyAnXG4gICAgICAgICAgICAgICAgKyB5ZWFyICsgJyAnXG4gICAgICAgICAgICAgICAgKyAoaG91ciA8IDEwID8gJzAnICsgaG91ciA6IGhvdXIpICsgJzonXG4gICAgICAgICAgICAgICAgKyAobWludXRlIDwgMTAgPyAnMCcgKyBtaW51dGUgOiBtaW51dGUpICsgJzonXG4gICAgICAgICAgICAgICAgKyAoc2Vjb25kIDwgMTAgPyAnMCcgKyBzZWNvbmQgOiBzZWNvbmQpICsgJyBHTVQnXG4gICAgICAgICAgICAgICAgKyAodGltZXpvbmVPZmZzZXQgPiAwID8gJy0nIDogJysnKVxuICAgICAgICAgICAgICAgICsgKGhvdXJzT2Zmc2V0IDwgMTAgPyAnMCcgKyBob3Vyc09mZnNldCA6IGhvdXJzT2Zmc2V0KVxuICAgICAgICAgICAgICAgICsgKG1pbnV0ZXNPZmZzZXQgPCAxMCA/ICcwJyArIG1pbnV0ZXNPZmZzZXQgOiBtaW51dGVzT2Zmc2V0KTtcbiAgICAgICAgfTtcbiAgICAgICAgaWYgKHN1cHBvcnRzRGVzY3JpcHRvcnMpIHtcbiAgICAgICAgICAgICRPYmplY3QuZGVmaW5lUHJvcGVydHkoRGF0ZS5wcm90b3R5cGUsICd0b1N0cmluZycsIHtcbiAgICAgICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICAgICAgICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICAgICAgICAgICAgd3JpdGFibGU6IHRydWVcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gRVM1IDE1LjkuNS40M1xuICAgIC8vIGh0dHA6Ly9lczUuZ2l0aHViLmNvbS8jeDE1LjkuNS40M1xuICAgIC8vIFRoaXMgZnVuY3Rpb24gcmV0dXJucyBhIFN0cmluZyB2YWx1ZSByZXByZXNlbnQgdGhlIGluc3RhbmNlIGluIHRpbWVcbiAgICAvLyByZXByZXNlbnRlZCBieSB0aGlzIERhdGUgb2JqZWN0LiBUaGUgZm9ybWF0IG9mIHRoZSBTdHJpbmcgaXMgdGhlIERhdGUgVGltZVxuICAgIC8vIHN0cmluZyBmb3JtYXQgZGVmaW5lZCBpbiAxNS45LjEuMTUuIEFsbCBmaWVsZHMgYXJlIHByZXNlbnQgaW4gdGhlIFN0cmluZy5cbiAgICAvLyBUaGUgdGltZSB6b25lIGlzIGFsd2F5cyBVVEMsIGRlbm90ZWQgYnkgdGhlIHN1ZmZpeCBaLiBJZiB0aGUgdGltZSB2YWx1ZSBvZlxuICAgIC8vIHRoaXMgb2JqZWN0IGlzIG5vdCBhIGZpbml0ZSBOdW1iZXIgYSBSYW5nZUVycm9yIGV4Y2VwdGlvbiBpcyB0aHJvd24uXG4gICAgdmFyIG5lZ2F0aXZlRGF0ZSA9IC02MjE5ODc1NTIwMDAwMDtcbiAgICB2YXIgbmVnYXRpdmVZZWFyU3RyaW5nID0gJy0wMDAwMDEnO1xuICAgIHZhciBoYXNOZWdhdGl2ZURhdGVCdWcgPSBEYXRlLnByb3RvdHlwZS50b0lTT1N0cmluZyAmJiBuZXcgRGF0ZShuZWdhdGl2ZURhdGUpLnRvSVNPU3RyaW5nKCkuaW5kZXhPZihuZWdhdGl2ZVllYXJTdHJpbmcpID09PSAtMTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBtYXgtbGVuXG4gICAgdmFyIGhhc1NhZmFyaTUxRGF0ZUJ1ZyA9IERhdGUucHJvdG90eXBlLnRvSVNPU3RyaW5nICYmIG5ldyBEYXRlKC0xKS50b0lTT1N0cmluZygpICE9PSAnMTk2OS0xMi0zMVQyMzo1OTo1OS45OTlaJztcblxuICAgIHZhciBnZXRUaW1lID0gY2FsbC5iaW5kKERhdGUucHJvdG90eXBlLmdldFRpbWUpO1xuXG4gICAgZGVmaW5lUHJvcGVydGllcyhEYXRlLnByb3RvdHlwZSwge1xuICAgICAgICB0b0lTT1N0cmluZzogZnVuY3Rpb24gdG9JU09TdHJpbmcoKSB7XG4gICAgICAgICAgICBpZiAoIWlzRmluaXRlKHRoaXMpIHx8ICFpc0Zpbml0ZShnZXRUaW1lKHRoaXMpKSkge1xuICAgICAgICAgICAgICAgIC8vIEFkb3BlIFBob3Rvc2hvcCByZXF1aXJlcyB0aGUgc2Vjb25kIGNoZWNrLlxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdEYXRlLnByb3RvdHlwZS50b0lTT1N0cmluZyBjYWxsZWQgb24gbm9uLWZpbml0ZSB2YWx1ZS4nKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIHllYXIgPSBvcmlnaW5hbEdldFVUQ0Z1bGxZZWFyKHRoaXMpO1xuXG4gICAgICAgICAgICB2YXIgbW9udGggPSBvcmlnaW5hbEdldFVUQ01vbnRoKHRoaXMpO1xuICAgICAgICAgICAgLy8gc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9lcy1zaGltcy9lczUtc2hpbS9pc3N1ZXMvMTExXG4gICAgICAgICAgICB5ZWFyICs9IE1hdGguZmxvb3IobW9udGggLyAxMik7XG4gICAgICAgICAgICBtb250aCA9ICgobW9udGggJSAxMikgKyAxMikgJSAxMjtcblxuICAgICAgICAgICAgLy8gdGhlIGRhdGUgdGltZSBzdHJpbmcgZm9ybWF0IGlzIHNwZWNpZmllZCBpbiAxNS45LjEuMTUuXG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gW1xuICAgICAgICAgICAgICAgIG1vbnRoICsgMSxcbiAgICAgICAgICAgICAgICBvcmlnaW5hbEdldFVUQ0RhdGUodGhpcyksXG4gICAgICAgICAgICAgICAgb3JpZ2luYWxHZXRVVENIb3Vycyh0aGlzKSxcbiAgICAgICAgICAgICAgICBvcmlnaW5hbEdldFVUQ01pbnV0ZXModGhpcyksXG4gICAgICAgICAgICAgICAgb3JpZ2luYWxHZXRVVENTZWNvbmRzKHRoaXMpXG4gICAgICAgICAgICBdO1xuICAgICAgICAgICAgeWVhciA9IChcbiAgICAgICAgICAgICAgICAoeWVhciA8IDAgPyAnLScgOiAoeWVhciA+IDk5OTkgPyAnKycgOiAnJykpXG4gICAgICAgICAgICAgICAgKyBzdHJTbGljZSgnMDAwMDAnICsgTWF0aC5hYnMoeWVhciksICgwIDw9IHllYXIgJiYgeWVhciA8PSA5OTk5KSA/IC00IDogLTYpXG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHJlc3VsdC5sZW5ndGg7ICsraSkge1xuICAgICAgICAgICAgICAgIC8vIHBhZCBtb250aHMsIGRheXMsIGhvdXJzLCBtaW51dGVzLCBhbmQgc2Vjb25kcyB0byBoYXZlIHR3byBkaWdpdHMuXG4gICAgICAgICAgICAgICAgcmVzdWx0W2ldID0gc3RyU2xpY2UoJzAwJyArIHJlc3VsdFtpXSwgLTIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gcGFkIG1pbGxpc2Vjb25kcyB0byBoYXZlIHRocmVlIGRpZ2l0cy5cbiAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgeWVhciArICctJyArIGFycmF5U2xpY2UocmVzdWx0LCAwLCAyKS5qb2luKCctJylcbiAgICAgICAgICAgICAgICArICdUJyArIGFycmF5U2xpY2UocmVzdWx0LCAyKS5qb2luKCc6JykgKyAnLidcbiAgICAgICAgICAgICAgICArIHN0clNsaWNlKCcwMDAnICsgb3JpZ2luYWxHZXRVVENNaWxsaXNlY29uZHModGhpcyksIC0zKSArICdaJ1xuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgIH0sIGhhc05lZ2F0aXZlRGF0ZUJ1ZyB8fCBoYXNTYWZhcmk1MURhdGVCdWcpO1xuXG4gICAgLy8gRVM1IDE1LjkuNS40NFxuICAgIC8vIGh0dHA6Ly9lczUuZ2l0aHViLmNvbS8jeDE1LjkuNS40NFxuICAgIC8vIFRoaXMgZnVuY3Rpb24gcHJvdmlkZXMgYSBTdHJpbmcgcmVwcmVzZW50YXRpb24gb2YgYSBEYXRlIG9iamVjdCBmb3IgdXNlIGJ5XG4gICAgLy8gSlNPTi5zdHJpbmdpZnkgKDE1LjEyLjMpLlxuICAgIHZhciBkYXRlVG9KU09OSXNTdXBwb3J0ZWQgPSAoZnVuY3Rpb24gKCkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgcmV0dXJuIERhdGUucHJvdG90eXBlLnRvSlNPTlxuICAgICAgICAgICAgICAgICYmIG5ldyBEYXRlKE5hTikudG9KU09OKCkgPT09IG51bGxcbiAgICAgICAgICAgICAgICAmJiBuZXcgRGF0ZShuZWdhdGl2ZURhdGUpLnRvSlNPTigpLmluZGV4T2YobmVnYXRpdmVZZWFyU3RyaW5nKSAhPT0gLTFcbiAgICAgICAgICAgICAgICAmJiBEYXRlLnByb3RvdHlwZS50b0pTT04uY2FsbCh7IC8vIGdlbmVyaWNcbiAgICAgICAgICAgICAgICAgICAgdG9JU09TdHJpbmc6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRydWU7IH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgfSgpKTtcbiAgICBpZiAoIWRhdGVUb0pTT05Jc1N1cHBvcnRlZCkge1xuICAgICAgICBEYXRlLnByb3RvdHlwZS50b0pTT04gPSBmdW5jdGlvbiB0b0pTT04oa2V5KSB7XG4gICAgICAgICAgICAvLyBXaGVuIHRoZSB0b0pTT04gbWV0aG9kIGlzIGNhbGxlZCB3aXRoIGFyZ3VtZW50IGtleSwgdGhlIGZvbGxvd2luZ1xuICAgICAgICAgICAgLy8gc3RlcHMgYXJlIHRha2VuOlxuXG4gICAgICAgICAgICAvLyAxLiAgTGV0IE8gYmUgdGhlIHJlc3VsdCBvZiBjYWxsaW5nIFRvT2JqZWN0LCBnaXZpbmcgaXQgdGhlIHRoaXNcbiAgICAgICAgICAgIC8vIHZhbHVlIGFzIGl0cyBhcmd1bWVudC5cbiAgICAgICAgICAgIC8vIDIuIExldCB0diBiZSBFUy5Ub1ByaW1pdGl2ZShPLCBoaW50IE51bWJlcikuXG4gICAgICAgICAgICB2YXIgTyA9ICRPYmplY3QodGhpcyk7XG4gICAgICAgICAgICB2YXIgdHYgPSBFUy5Ub1ByaW1pdGl2ZShPKTtcbiAgICAgICAgICAgIC8vIDMuIElmIHR2IGlzIGEgTnVtYmVyIGFuZCBpcyBub3QgZmluaXRlLCByZXR1cm4gbnVsbC5cbiAgICAgICAgICAgIGlmICh0eXBlb2YgdHYgPT09ICdudW1iZXInICYmICFpc0Zpbml0ZSh0dikpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIDQuIExldCB0b0lTTyBiZSB0aGUgcmVzdWx0IG9mIGNhbGxpbmcgdGhlIFtbR2V0XV0gaW50ZXJuYWwgbWV0aG9kIG9mXG4gICAgICAgICAgICAvLyBPIHdpdGggYXJndW1lbnQgXCJ0b0lTT1N0cmluZ1wiLlxuICAgICAgICAgICAgdmFyIHRvSVNPID0gTy50b0lTT1N0cmluZztcbiAgICAgICAgICAgIC8vIDUuIElmIElzQ2FsbGFibGUodG9JU08pIGlzIGZhbHNlLCB0aHJvdyBhIFR5cGVFcnJvciBleGNlcHRpb24uXG4gICAgICAgICAgICBpZiAoIWlzQ2FsbGFibGUodG9JU08pKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcigndG9JU09TdHJpbmcgcHJvcGVydHkgaXMgbm90IGNhbGxhYmxlJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyA2LiBSZXR1cm4gdGhlIHJlc3VsdCBvZiBjYWxsaW5nIHRoZSBbW0NhbGxdXSBpbnRlcm5hbCBtZXRob2Qgb2ZcbiAgICAgICAgICAgIC8vICB0b0lTTyB3aXRoIE8gYXMgdGhlIHRoaXMgdmFsdWUgYW5kIGFuIGVtcHR5IGFyZ3VtZW50IGxpc3QuXG4gICAgICAgICAgICByZXR1cm4gdG9JU08uY2FsbChPKTtcblxuICAgICAgICAgICAgLy8gTk9URSAxIFRoZSBhcmd1bWVudCBpcyBpZ25vcmVkLlxuXG4gICAgICAgICAgICAvLyBOT1RFIDIgVGhlIHRvSlNPTiBmdW5jdGlvbiBpcyBpbnRlbnRpb25hbGx5IGdlbmVyaWM7IGl0IGRvZXMgbm90XG4gICAgICAgICAgICAvLyByZXF1aXJlIHRoYXQgaXRzIHRoaXMgdmFsdWUgYmUgYSBEYXRlIG9iamVjdC4gVGhlcmVmb3JlLCBpdCBjYW4gYmVcbiAgICAgICAgICAgIC8vIHRyYW5zZmVycmVkIHRvIG90aGVyIGtpbmRzIG9mIG9iamVjdHMgZm9yIHVzZSBhcyBhIG1ldGhvZC4gSG93ZXZlcixcbiAgICAgICAgICAgIC8vIGl0IGRvZXMgcmVxdWlyZSB0aGF0IGFueSBzdWNoIG9iamVjdCBoYXZlIGEgdG9JU09TdHJpbmcgbWV0aG9kLiBBblxuICAgICAgICAgICAgLy8gb2JqZWN0IGlzIGZyZWUgdG8gdXNlIHRoZSBhcmd1bWVudCBrZXkgdG8gZmlsdGVyIGl0c1xuICAgICAgICAgICAgLy8gc3RyaW5naWZpY2F0aW9uLlxuICAgICAgICB9O1xuICAgIH1cblxuICAgIC8vIEVTNSAxNS45LjQuMlxuICAgIC8vIGh0dHA6Ly9lczUuZ2l0aHViLmNvbS8jeDE1LjkuNC4yXG4gICAgLy8gYmFzZWQgb24gd29yayBzaGFyZWQgYnkgRGFuaWVsIEZyaWVzZW4gKGRhbnRtYW4pXG4gICAgLy8gaHR0cDovL2dpc3QuZ2l0aHViLmNvbS8zMDMyNDlcbiAgICB2YXIgc3VwcG9ydHNFeHRlbmRlZFllYXJzID0gRGF0ZS5wYXJzZSgnKzAzMzY1OC0wOS0yN1QwMTo0Njo0MC4wMDBaJykgPT09IDFlMTU7XG4gICAgdmFyIGFjY2VwdHNJbnZhbGlkRGF0ZXMgPSAhaXNOYU4oRGF0ZS5wYXJzZSgnMjAxMi0wNC0wNFQyNDowMDowMC41MDBaJykpIHx8ICFpc05hTihEYXRlLnBhcnNlKCcyMDEyLTExLTMxVDIzOjU5OjU5LjAwMFonKSkgfHwgIWlzTmFOKERhdGUucGFyc2UoJzIwMTItMTItMzFUMjM6NTk6NjAuMDAwWicpKTtcbiAgICB2YXIgZG9lc05vdFBhcnNlWTJLTmV3WWVhciA9IGlzTmFOKERhdGUucGFyc2UoJzIwMDAtMDEtMDFUMDA6MDA6MDAuMDAwWicpKTtcbiAgICBpZiAoZG9lc05vdFBhcnNlWTJLTmV3WWVhciB8fCBhY2NlcHRzSW52YWxpZERhdGVzIHx8ICFzdXBwb3J0c0V4dGVuZGVkWWVhcnMpIHtcbiAgICAgICAgLy8gWFhYIGdsb2JhbCBhc3NpZ25tZW50IHdvbid0IHdvcmsgaW4gZW1iZWRkaW5ncyB0aGF0IHVzZVxuICAgICAgICAvLyBhbiBhbHRlcm5hdGUgb2JqZWN0IGZvciB0aGUgY29udGV4dC5cbiAgICAgICAgLyogZ2xvYmFsIERhdGU6IHRydWUgKi9cbiAgICAgICAgdmFyIG1heFNhZmVVbnNpZ25lZDMyQml0ID0gTWF0aC5wb3coMiwgMzEpIC0gMTtcbiAgICAgICAgdmFyIGhhc1NhZmFyaVNpZ25lZEludEJ1ZyA9IGlzQWN0dWFsTmFOKG5ldyBEYXRlKDE5NzAsIDAsIDEsIDAsIDAsIDAsIG1heFNhZmVVbnNpZ25lZDMyQml0ICsgMSkuZ2V0VGltZSgpKTtcbiAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWltcGxpY2l0LWdsb2JhbHMsIG5vLWdsb2JhbC1hc3NpZ25cbiAgICAgICAgRGF0ZSA9IChmdW5jdGlvbiAoTmF0aXZlRGF0ZSkge1xuICAgICAgICAgICAgLy8gRGF0ZS5sZW5ndGggPT09IDdcbiAgICAgICAgICAgIHZhciBEYXRlU2hpbSA9IGZ1bmN0aW9uIERhdGUoWSwgTSwgRCwgaCwgbSwgcywgbXMpIHtcbiAgICAgICAgICAgICAgICB2YXIgbGVuZ3RoID0gYXJndW1lbnRzLmxlbmd0aDtcbiAgICAgICAgICAgICAgICB2YXIgZGF0ZTtcbiAgICAgICAgICAgICAgICBpZiAodGhpcyBpbnN0YW5jZW9mIE5hdGl2ZURhdGUpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHNlY29uZHMgPSBzO1xuICAgICAgICAgICAgICAgICAgICB2YXIgbWlsbGlzID0gbXM7XG4gICAgICAgICAgICAgICAgICAgIGlmIChoYXNTYWZhcmlTaWduZWRJbnRCdWcgJiYgbGVuZ3RoID49IDcgJiYgbXMgPiBtYXhTYWZlVW5zaWduZWQzMkJpdCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gd29yayBhcm91bmQgYSBTYWZhcmkgOC85IGJ1ZyB3aGVyZSBpdCB0cmVhdHMgdGhlIHNlY29uZHMgYXMgc2lnbmVkXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgbXNUb1NoaWZ0ID0gTWF0aC5mbG9vcihtcyAvIG1heFNhZmVVbnNpZ25lZDMyQml0KSAqIG1heFNhZmVVbnNpZ25lZDMyQml0O1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHNUb1NoaWZ0ID0gTWF0aC5mbG9vcihtc1RvU2hpZnQgLyAxZTMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2Vjb25kcyArPSBzVG9TaGlmdDtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1pbGxpcyAtPSBzVG9TaGlmdCAqIDFlMztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBkYXRlID0gbGVuZ3RoID09PSAxICYmICRTdHJpbmcoWSkgPT09IFkgLy8gaXNTdHJpbmcoWSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIFdlIGV4cGxpY2l0bHkgcGFzcyBpdCB0aHJvdWdoIHBhcnNlOlxuICAgICAgICAgICAgICAgICAgICAgICAgPyBuZXcgTmF0aXZlRGF0ZShEYXRlU2hpbS5wYXJzZShZKSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIFdlIGhhdmUgdG8gbWFudWFsbHkgbWFrZSBjYWxscyBkZXBlbmRpbmcgb24gYXJndW1lbnRcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGxlbmd0aCBoZXJlXG4gICAgICAgICAgICAgICAgICAgICAgICA6IGxlbmd0aCA+PSA3ID8gbmV3IE5hdGl2ZURhdGUoWSwgTSwgRCwgaCwgbSwgc2Vjb25kcywgbWlsbGlzKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogbGVuZ3RoID49IDYgPyBuZXcgTmF0aXZlRGF0ZShZLCBNLCBELCBoLCBtLCBzZWNvbmRzKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IGxlbmd0aCA+PSA1ID8gbmV3IE5hdGl2ZURhdGUoWSwgTSwgRCwgaCwgbSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogbGVuZ3RoID49IDQgPyBuZXcgTmF0aXZlRGF0ZShZLCBNLCBELCBoKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogbGVuZ3RoID49IDMgPyBuZXcgTmF0aXZlRGF0ZShZLCBNLCBEKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IGxlbmd0aCA+PSAyID8gbmV3IE5hdGl2ZURhdGUoWSwgTSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogbGVuZ3RoID49IDEgPyBuZXcgTmF0aXZlRGF0ZShZIGluc3RhbmNlb2YgTmF0aXZlRGF0ZSA/ICtZIDogWSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IG5ldyBOYXRpdmVEYXRlKCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgZGF0ZSA9IE5hdGl2ZURhdGUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKCFpc1ByaW1pdGl2ZShkYXRlKSkge1xuICAgICAgICAgICAgICAgICAgICAvLyBQcmV2ZW50IG1peHVwcyB3aXRoIHVuZml4ZWQgRGF0ZSBvYmplY3RcbiAgICAgICAgICAgICAgICAgICAgZGVmaW5lUHJvcGVydGllcyhkYXRlLCB7IGNvbnN0cnVjdG9yOiBEYXRlU2hpbSB9LCB0cnVlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIGRhdGU7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAvLyAxNS45LjEuMTUgRGF0ZSBUaW1lIFN0cmluZyBGb3JtYXQuXG4gICAgICAgICAgICB2YXIgaXNvRGF0ZUV4cHJlc3Npb24gPSBuZXcgUmVnRXhwKCdeJ1xuICAgICAgICAgICAgICAgICsgJyhcXFxcZHs0fXxbKy1dXFxcXGR7Nn0pJyAvLyBmb3VyLWRpZ2l0IHllYXIgY2FwdHVyZSBvciBzaWduICsgNi1kaWdpdCBleHRlbmRlZCB5ZWFyXG4gICAgICAgICAgICAgICAgKyAnKD86LShcXFxcZHsyfSknIC8vIG9wdGlvbmFsIG1vbnRoIGNhcHR1cmVcbiAgICAgICAgICAgICAgICArICcoPzotKFxcXFxkezJ9KScgLy8gb3B0aW9uYWwgZGF5IGNhcHR1cmVcbiAgICAgICAgICAgICAgICArICcoPzonIC8vIGNhcHR1cmUgaG91cnM6bWludXRlczpzZWNvbmRzLm1pbGxpc2Vjb25kc1xuICAgICAgICAgICAgICAgICAgICArICdUKFxcXFxkezJ9KScgLy8gaG91cnMgY2FwdHVyZVxuICAgICAgICAgICAgICAgICAgICArICc6KFxcXFxkezJ9KScgLy8gbWludXRlcyBjYXB0dXJlXG4gICAgICAgICAgICAgICAgICAgICsgJyg/OicgLy8gb3B0aW9uYWwgOnNlY29uZHMubWlsbGlzZWNvbmRzXG4gICAgICAgICAgICAgICAgICAgICAgICArICc6KFxcXFxkezJ9KScgLy8gc2Vjb25kcyBjYXB0dXJlXG4gICAgICAgICAgICAgICAgICAgICAgICArICcoPzooXFxcXC5cXFxcZHsxLH0pKT8nIC8vIG1pbGxpc2Vjb25kcyBjYXB0dXJlXG4gICAgICAgICAgICAgICAgICAgICsgJyk/J1xuICAgICAgICAgICAgICAgICsgJygnIC8vIGNhcHR1cmUgVVRDIG9mZnNldCBjb21wb25lbnRcbiAgICAgICAgICAgICAgICAgICAgKyAnWnwnIC8vIFVUQyBjYXB0dXJlXG4gICAgICAgICAgICAgICAgICAgICsgJyg/OicgLy8gb2Zmc2V0IHNwZWNpZmllciArLy1ob3VyczptaW51dGVzXG4gICAgICAgICAgICAgICAgICAgICAgICArICcoWy0rXSknIC8vIHNpZ24gY2FwdHVyZVxuICAgICAgICAgICAgICAgICAgICAgICAgKyAnKFxcXFxkezJ9KScgLy8gaG91cnMgb2Zmc2V0IGNhcHR1cmVcbiAgICAgICAgICAgICAgICAgICAgICAgICsgJzooXFxcXGR7Mn0pJyAvLyBtaW51dGVzIG9mZnNldCBjYXB0dXJlXG4gICAgICAgICAgICAgICAgICAgICsgJyknXG4gICAgICAgICAgICAgICAgKyAnKT8pPyk/KT8nXG4gICAgICAgICAgICArICckJyk7XG5cbiAgICAgICAgICAgIHZhciBtb250aHMgPSBbMCwgMzEsIDU5LCA5MCwgMTIwLCAxNTEsIDE4MSwgMjEyLCAyNDMsIDI3MywgMzA0LCAzMzQsIDM2NV07XG5cbiAgICAgICAgICAgIHZhciBkYXlGcm9tTW9udGggPSBmdW5jdGlvbiBkYXlGcm9tTW9udGgoeWVhciwgbW9udGgpIHtcbiAgICAgICAgICAgICAgICB2YXIgdCA9IG1vbnRoID4gMSA/IDEgOiAwO1xuICAgICAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgICAgIG1vbnRoc1ttb250aF1cbiAgICAgICAgICAgICAgICAgICAgKyBNYXRoLmZsb29yKCh5ZWFyIC0gMTk2OSArIHQpIC8gNClcbiAgICAgICAgICAgICAgICAgICAgLSBNYXRoLmZsb29yKCh5ZWFyIC0gMTkwMSArIHQpIC8gMTAwKVxuICAgICAgICAgICAgICAgICAgICArIE1hdGguZmxvb3IoKHllYXIgLSAxNjAxICsgdCkgLyA0MDApXG4gICAgICAgICAgICAgICAgICAgICsgKDM2NSAqICh5ZWFyIC0gMTk3MCkpXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHZhciB0b1VUQyA9IGZ1bmN0aW9uIHRvVVRDKHQpIHtcbiAgICAgICAgICAgICAgICB2YXIgcyA9IDA7XG4gICAgICAgICAgICAgICAgdmFyIG1zID0gdDtcbiAgICAgICAgICAgICAgICBpZiAoaGFzU2FmYXJpU2lnbmVkSW50QnVnICYmIG1zID4gbWF4U2FmZVVuc2lnbmVkMzJCaXQpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gd29yayBhcm91bmQgYSBTYWZhcmkgOC85IGJ1ZyB3aGVyZSBpdCB0cmVhdHMgdGhlIHNlY29uZHMgYXMgc2lnbmVkXG4gICAgICAgICAgICAgICAgICAgIHZhciBtc1RvU2hpZnQgPSBNYXRoLmZsb29yKG1zIC8gbWF4U2FmZVVuc2lnbmVkMzJCaXQpICogbWF4U2FmZVVuc2lnbmVkMzJCaXQ7XG4gICAgICAgICAgICAgICAgICAgIHZhciBzVG9TaGlmdCA9IE1hdGguZmxvb3IobXNUb1NoaWZ0IC8gMWUzKTtcbiAgICAgICAgICAgICAgICAgICAgcyArPSBzVG9TaGlmdDtcbiAgICAgICAgICAgICAgICAgICAgbXMgLT0gc1RvU2hpZnQgKiAxZTM7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiAkTnVtYmVyKG5ldyBOYXRpdmVEYXRlKDE5NzAsIDAsIDEsIDAsIDAsIHMsIG1zKSk7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAvLyBDb3B5IGFueSBjdXN0b20gbWV0aG9kcyBhIDNyZCBwYXJ0eSBsaWJyYXJ5IG1heSBoYXZlIGFkZGVkXG4gICAgICAgICAgICBmb3IgKHZhciBrZXkgaW4gTmF0aXZlRGF0ZSkge1xuICAgICAgICAgICAgICAgIGlmIChvd25zKE5hdGl2ZURhdGUsIGtleSkpIHtcbiAgICAgICAgICAgICAgICAgICAgRGF0ZVNoaW1ba2V5XSA9IE5hdGl2ZURhdGVba2V5XTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIENvcHkgXCJuYXRpdmVcIiBtZXRob2RzIGV4cGxpY2l0bHk7IHRoZXkgbWF5IGJlIG5vbi1lbnVtZXJhYmxlXG4gICAgICAgICAgICBkZWZpbmVQcm9wZXJ0aWVzKERhdGVTaGltLCB7XG4gICAgICAgICAgICAgICAgbm93OiBOYXRpdmVEYXRlLm5vdyxcbiAgICAgICAgICAgICAgICBVVEM6IE5hdGl2ZURhdGUuVVRDXG4gICAgICAgICAgICB9LCB0cnVlKTtcbiAgICAgICAgICAgIERhdGVTaGltLnByb3RvdHlwZSA9IE5hdGl2ZURhdGUucHJvdG90eXBlO1xuICAgICAgICAgICAgZGVmaW5lUHJvcGVydGllcyhEYXRlU2hpbS5wcm90b3R5cGUsIHsgY29uc3RydWN0b3I6IERhdGVTaGltIH0sIHRydWUpO1xuXG4gICAgICAgICAgICAvLyBVcGdyYWRlIERhdGUucGFyc2UgdG8gaGFuZGxlIHNpbXBsaWZpZWQgSVNPIDg2MDEgc3RyaW5nc1xuICAgICAgICAgICAgdmFyIHBhcnNlU2hpbSA9IGZ1bmN0aW9uIHBhcnNlKHN0cmluZykge1xuICAgICAgICAgICAgICAgIHZhciBtYXRjaCA9IGlzb0RhdGVFeHByZXNzaW9uLmV4ZWMoc3RyaW5nKTtcbiAgICAgICAgICAgICAgICBpZiAobWF0Y2gpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gcGFyc2UgbW9udGhzLCBkYXlzLCBob3VycywgbWludXRlcywgc2Vjb25kcywgYW5kIG1pbGxpc2Vjb25kc1xuICAgICAgICAgICAgICAgICAgICAvLyBwcm92aWRlIGRlZmF1bHQgdmFsdWVzIGlmIG5lY2Vzc2FyeVxuICAgICAgICAgICAgICAgICAgICAvLyBwYXJzZSB0aGUgVVRDIG9mZnNldCBjb21wb25lbnRcbiAgICAgICAgICAgICAgICAgICAgdmFyIHllYXIgPSAkTnVtYmVyKG1hdGNoWzFdKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIG1vbnRoID0gJE51bWJlcihtYXRjaFsyXSB8fCAxKSAtIDEsXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXkgPSAkTnVtYmVyKG1hdGNoWzNdIHx8IDEpIC0gMSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGhvdXIgPSAkTnVtYmVyKG1hdGNoWzRdIHx8IDApLFxuICAgICAgICAgICAgICAgICAgICAgICAgbWludXRlID0gJE51bWJlcihtYXRjaFs1XSB8fCAwKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlY29uZCA9ICROdW1iZXIobWF0Y2hbNl0gfHwgMCksXG4gICAgICAgICAgICAgICAgICAgICAgICBtaWxsaXNlY29uZCA9IE1hdGguZmxvb3IoJE51bWJlcihtYXRjaFs3XSB8fCAwKSAqIDEwMDApLFxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gV2hlbiB0aW1lIHpvbmUgaXMgbWlzc2VkLCBsb2NhbCBvZmZzZXQgc2hvdWxkIGJlIHVzZWRcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIChFUyA1LjEgYnVnKVxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gc2VlIGh0dHBzOi8vYnVncy5lY21hc2NyaXB0Lm9yZy9zaG93X2J1Zy5jZ2k/aWQ9MTEyXG4gICAgICAgICAgICAgICAgICAgICAgICBpc0xvY2FsVGltZSA9IEJvb2xlYW4obWF0Y2hbNF0gJiYgIW1hdGNoWzhdKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNpZ25PZmZzZXQgPSBtYXRjaFs5XSA9PT0gJy0nID8gMSA6IC0xLFxuICAgICAgICAgICAgICAgICAgICAgICAgaG91ck9mZnNldCA9ICROdW1iZXIobWF0Y2hbMTBdIHx8IDApLFxuICAgICAgICAgICAgICAgICAgICAgICAgbWludXRlT2Zmc2V0ID0gJE51bWJlcihtYXRjaFsxMV0gfHwgMCksXG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQ7XG4gICAgICAgICAgICAgICAgICAgIHZhciBoYXNNaW51dGVzT3JTZWNvbmRzT3JNaWxsaXNlY29uZHMgPSBtaW51dGUgPiAwIHx8IHNlY29uZCA+IDAgfHwgbWlsbGlzZWNvbmQgPiAwO1xuICAgICAgICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgICAgICAgICBob3VyIDwgKGhhc01pbnV0ZXNPclNlY29uZHNPck1pbGxpc2Vjb25kcyA/IDI0IDogMjUpXG4gICAgICAgICAgICAgICAgICAgICAgICAmJiBtaW51dGUgPCA2MCAmJiBzZWNvbmQgPCA2MCAmJiBtaWxsaXNlY29uZCA8IDEwMDBcbiAgICAgICAgICAgICAgICAgICAgICAgICYmIG1vbnRoID4gLTEgJiYgbW9udGggPCAxMiAmJiBob3VyT2Zmc2V0IDwgMjRcbiAgICAgICAgICAgICAgICAgICAgICAgICYmIG1pbnV0ZU9mZnNldCA8IDYwIC8vIGRldGVjdCBpbnZhbGlkIG9mZnNldHNcbiAgICAgICAgICAgICAgICAgICAgICAgICYmIGRheSA+IC0xXG4gICAgICAgICAgICAgICAgICAgICAgICAmJiBkYXkgPCAoZGF5RnJvbU1vbnRoKHllYXIsIG1vbnRoICsgMSkgLSBkYXlGcm9tTW9udGgoeWVhciwgbW9udGgpKVxuICAgICAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdCA9IChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAoKGRheUZyb21Nb250aCh5ZWFyLCBtb250aCkgKyBkYXkpICogMjQpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKyBob3VyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKyAoaG91ck9mZnNldCAqIHNpZ25PZmZzZXQpXG4gICAgICAgICAgICAgICAgICAgICAgICApICogNjA7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQgPSAoKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICgocmVzdWx0ICsgbWludXRlICsgKG1pbnV0ZU9mZnNldCAqIHNpZ25PZmZzZXQpKSAqIDYwKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICsgc2Vjb25kXG4gICAgICAgICAgICAgICAgICAgICAgICApICogMTAwMCkgKyBtaWxsaXNlY29uZDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpc0xvY2FsVGltZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdCA9IHRvVVRDKHJlc3VsdCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoLTguNjRlMTUgPD0gcmVzdWx0ICYmIHJlc3VsdCA8PSA4LjY0ZTE1KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gTmFOO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gTmF0aXZlRGF0ZS5wYXJzZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGRlZmluZVByb3BlcnRpZXMoRGF0ZVNoaW0sIHsgcGFyc2U6IHBhcnNlU2hpbSB9KTtcblxuICAgICAgICAgICAgcmV0dXJuIERhdGVTaGltO1xuICAgICAgICB9KERhdGUpKTtcbiAgICAgICAgLyogZ2xvYmFsIERhdGU6IGZhbHNlICovXG4gICAgfVxuXG4gICAgLy8gRVM1IDE1LjkuNC40XG4gICAgLy8gaHR0cDovL2VzNS5naXRodWIuY29tLyN4MTUuOS40LjRcbiAgICBpZiAoIURhdGUubm93KSB7XG4gICAgICAgIERhdGUubm93ID0gZnVuY3Rpb24gbm93KCkge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIC8vXG4gICAgLy8gTnVtYmVyXG4gICAgLy8gPT09PT09XG4gICAgLy9cblxuICAgIC8vIEVTNS4xIDE1LjcuNC41XG4gICAgLy8gaHR0cDovL2VzNS5naXRodWIuY29tLyN4MTUuNy40LjVcbiAgICB2YXIgaGFzVG9GaXhlZEJ1Z3MgPSBOdW1iZXJQcm90b3R5cGUudG9GaXhlZCAmJiAoXG4gICAgICAgICgwLjAwMDA4KS50b0ZpeGVkKDMpICE9PSAnMC4wMDAnXG4gICAgICAgIHx8ICgwLjkpLnRvRml4ZWQoMCkgIT09ICcxJ1xuICAgICAgICB8fCAoMS4yNTUpLnRvRml4ZWQoMikgIT09ICcxLjI1J1xuICAgICAgICB8fCAoMTAwMDAwMDAwMDAwMDAwMDEyOCkudG9GaXhlZCgwKSAhPT0gJzEwMDAwMDAwMDAwMDAwMDAxMjgnXG4gICAgKTtcblxuICAgIHZhciB0b0ZpeGVkSGVscGVycyA9IHtcbiAgICAgICAgYmFzZTogMWU3LFxuICAgICAgICBzaXplOiA2LFxuICAgICAgICBkYXRhOiBbMCwgMCwgMCwgMCwgMCwgMF0sXG4gICAgICAgIG11bHRpcGx5OiBmdW5jdGlvbiBtdWx0aXBseShuLCBjKSB7XG4gICAgICAgICAgICB2YXIgaSA9IC0xO1xuICAgICAgICAgICAgdmFyIGMyID0gYztcbiAgICAgICAgICAgIHdoaWxlICgrK2kgPCB0b0ZpeGVkSGVscGVycy5zaXplKSB7XG4gICAgICAgICAgICAgICAgYzIgKz0gbiAqIHRvRml4ZWRIZWxwZXJzLmRhdGFbaV07XG4gICAgICAgICAgICAgICAgdG9GaXhlZEhlbHBlcnMuZGF0YVtpXSA9IGMyICUgdG9GaXhlZEhlbHBlcnMuYmFzZTtcbiAgICAgICAgICAgICAgICBjMiA9IE1hdGguZmxvb3IoYzIgLyB0b0ZpeGVkSGVscGVycy5iYXNlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgZGl2aWRlOiBmdW5jdGlvbiBkaXZpZGUobikge1xuICAgICAgICAgICAgdmFyIGkgPSB0b0ZpeGVkSGVscGVycy5zaXplO1xuICAgICAgICAgICAgdmFyIGMgPSAwO1xuICAgICAgICAgICAgd2hpbGUgKC0taSA+PSAwKSB7XG4gICAgICAgICAgICAgICAgYyArPSB0b0ZpeGVkSGVscGVycy5kYXRhW2ldO1xuICAgICAgICAgICAgICAgIHRvRml4ZWRIZWxwZXJzLmRhdGFbaV0gPSBNYXRoLmZsb29yKGMgLyBuKTtcbiAgICAgICAgICAgICAgICBjID0gKGMgJSBuKSAqIHRvRml4ZWRIZWxwZXJzLmJhc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIG51bVRvU3RyaW5nOiBmdW5jdGlvbiBudW1Ub1N0cmluZygpIHtcbiAgICAgICAgICAgIHZhciBpID0gdG9GaXhlZEhlbHBlcnMuc2l6ZTtcbiAgICAgICAgICAgIHZhciBzID0gJyc7XG4gICAgICAgICAgICB3aGlsZSAoLS1pID49IDApIHtcbiAgICAgICAgICAgICAgICBpZiAocyAhPT0gJycgfHwgaSA9PT0gMCB8fCB0b0ZpeGVkSGVscGVycy5kYXRhW2ldICE9PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciB0ID0gJFN0cmluZyh0b0ZpeGVkSGVscGVycy5kYXRhW2ldKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHMgPT09ICcnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzID0gdDtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHMgKz0gc3RyU2xpY2UoJzAwMDAwMDAnLCAwLCA3IC0gdC5sZW5ndGgpICsgdDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBzO1xuICAgICAgICB9LFxuICAgICAgICBwb3c6IGZ1bmN0aW9uIHBvdyh4LCBuLCBhY2MpIHtcbiAgICAgICAgICAgIHJldHVybiAobiA9PT0gMCA/IGFjYyA6IChuICUgMiA9PT0gMSA/IHBvdyh4LCBuIC0gMSwgYWNjICogeCkgOiBwb3coeCAqIHgsIG4gLyAyLCBhY2MpKSk7XG4gICAgICAgIH0sXG4gICAgICAgIGxvZzogZnVuY3Rpb24gbG9nKHgpIHtcbiAgICAgICAgICAgIHZhciBuID0gMDtcbiAgICAgICAgICAgIHZhciB4MiA9IHg7XG4gICAgICAgICAgICB3aGlsZSAoeDIgPj0gNDA5Nikge1xuICAgICAgICAgICAgICAgIG4gKz0gMTI7XG4gICAgICAgICAgICAgICAgeDIgLz0gNDA5NjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHdoaWxlICh4MiA+PSAyKSB7XG4gICAgICAgICAgICAgICAgbiArPSAxO1xuICAgICAgICAgICAgICAgIHgyIC89IDI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gbjtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICB2YXIgdG9GaXhlZFNoaW0gPSBmdW5jdGlvbiB0b0ZpeGVkKGZyYWN0aW9uRGlnaXRzKSB7XG4gICAgICAgIHZhciBmLCB4LCBzLCBtLCBlLCB6LCBqLCBrO1xuXG4gICAgICAgIC8vIFRlc3QgZm9yIE5hTiBhbmQgcm91bmQgZnJhY3Rpb25EaWdpdHMgZG93blxuICAgICAgICBmID0gJE51bWJlcihmcmFjdGlvbkRpZ2l0cyk7XG4gICAgICAgIGYgPSBpc0FjdHVhbE5hTihmKSA/IDAgOiBNYXRoLmZsb29yKGYpO1xuXG4gICAgICAgIGlmIChmIDwgMCB8fCBmID4gMjApIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdOdW1iZXIudG9GaXhlZCBjYWxsZWQgd2l0aCBpbnZhbGlkIG51bWJlciBvZiBkZWNpbWFscycpO1xuICAgICAgICB9XG5cbiAgICAgICAgeCA9ICROdW1iZXIodGhpcyk7XG5cbiAgICAgICAgaWYgKGlzQWN0dWFsTmFOKHgpKSB7XG4gICAgICAgICAgICByZXR1cm4gJ05hTic7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBJZiBpdCBpcyB0b28gYmlnIG9yIHNtYWxsLCByZXR1cm4gdGhlIHN0cmluZyB2YWx1ZSBvZiB0aGUgbnVtYmVyXG4gICAgICAgIGlmICh4IDw9IC0xZTIxIHx8IHggPj0gMWUyMSkge1xuICAgICAgICAgICAgcmV0dXJuICRTdHJpbmcoeCk7XG4gICAgICAgIH1cblxuICAgICAgICBzID0gJyc7XG5cbiAgICAgICAgaWYgKHggPCAwKSB7XG4gICAgICAgICAgICBzID0gJy0nO1xuICAgICAgICAgICAgeCA9IC14O1xuICAgICAgICB9XG5cbiAgICAgICAgbSA9ICcwJztcblxuICAgICAgICBpZiAoeCA+IDFlLTIxKSB7XG4gICAgICAgICAgICAvLyAxZS0yMSA8IHggPCAxZTIxXG4gICAgICAgICAgICAvLyAtNzAgPCBsb2cyKHgpIDwgNzBcbiAgICAgICAgICAgIGUgPSB0b0ZpeGVkSGVscGVycy5sb2coeCAqIHRvRml4ZWRIZWxwZXJzLnBvdygyLCA2OSwgMSkpIC0gNjk7XG4gICAgICAgICAgICB6ID0gKGUgPCAwID8geCAqIHRvRml4ZWRIZWxwZXJzLnBvdygyLCAtZSwgMSkgOiB4IC8gdG9GaXhlZEhlbHBlcnMucG93KDIsIGUsIDEpKTtcbiAgICAgICAgICAgIHogKj0gMHgxMDAwMDAwMDAwMDAwMDsgLy8gTWF0aC5wb3coMiwgNTIpO1xuICAgICAgICAgICAgZSA9IDUyIC0gZTtcblxuICAgICAgICAgICAgLy8gLTE4IDwgZSA8IDEyMlxuICAgICAgICAgICAgLy8geCA9IHogLyAyIF4gZVxuICAgICAgICAgICAgaWYgKGUgPiAwKSB7XG4gICAgICAgICAgICAgICAgdG9GaXhlZEhlbHBlcnMubXVsdGlwbHkoMCwgeik7XG4gICAgICAgICAgICAgICAgaiA9IGY7XG5cbiAgICAgICAgICAgICAgICB3aGlsZSAoaiA+PSA3KSB7XG4gICAgICAgICAgICAgICAgICAgIHRvRml4ZWRIZWxwZXJzLm11bHRpcGx5KDFlNywgMCk7XG4gICAgICAgICAgICAgICAgICAgIGogLT0gNztcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB0b0ZpeGVkSGVscGVycy5tdWx0aXBseSh0b0ZpeGVkSGVscGVycy5wb3coMTAsIGosIDEpLCAwKTtcbiAgICAgICAgICAgICAgICBqID0gZSAtIDE7XG5cbiAgICAgICAgICAgICAgICB3aGlsZSAoaiA+PSAyMykge1xuICAgICAgICAgICAgICAgICAgICB0b0ZpeGVkSGVscGVycy5kaXZpZGUoMSA8PCAyMyk7XG4gICAgICAgICAgICAgICAgICAgIGogLT0gMjM7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdG9GaXhlZEhlbHBlcnMuZGl2aWRlKDEgPDwgaik7XG4gICAgICAgICAgICAgICAgdG9GaXhlZEhlbHBlcnMubXVsdGlwbHkoMSwgMSk7XG4gICAgICAgICAgICAgICAgdG9GaXhlZEhlbHBlcnMuZGl2aWRlKDIpO1xuICAgICAgICAgICAgICAgIG0gPSB0b0ZpeGVkSGVscGVycy5udW1Ub1N0cmluZygpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0b0ZpeGVkSGVscGVycy5tdWx0aXBseSgwLCB6KTtcbiAgICAgICAgICAgICAgICB0b0ZpeGVkSGVscGVycy5tdWx0aXBseSgxIDw8ICgtZSksIDApO1xuICAgICAgICAgICAgICAgIG0gPSB0b0ZpeGVkSGVscGVycy5udW1Ub1N0cmluZygpICsgc3RyU2xpY2UoJzAuMDAwMDAwMDAwMDAwMDAwMDAwMDAnLCAyLCAyICsgZik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZiA+IDApIHtcbiAgICAgICAgICAgIGsgPSBtLmxlbmd0aDtcblxuICAgICAgICAgICAgaWYgKGsgPD0gZikge1xuICAgICAgICAgICAgICAgIG0gPSBzICsgc3RyU2xpY2UoJzAuMDAwMDAwMDAwMDAwMDAwMDAwMCcsIDAsIGYgLSBrICsgMikgKyBtO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBtID0gcyArIHN0clNsaWNlKG0sIDAsIGsgLSBmKSArICcuJyArIHN0clNsaWNlKG0sIGsgLSBmKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG0gPSBzICsgbTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBtO1xuICAgIH07XG4gICAgZGVmaW5lUHJvcGVydGllcyhOdW1iZXJQcm90b3R5cGUsIHsgdG9GaXhlZDogdG9GaXhlZFNoaW0gfSwgaGFzVG9GaXhlZEJ1Z3MpO1xuXG4gICAgdmFyIGhhc1RvUHJlY2lzaW9uVW5kZWZpbmVkQnVnID0gKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHJldHVybiAxLjAudG9QcmVjaXNpb24odW5kZWZpbmVkKSA9PT0gJzEnO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH0oKSk7XG4gICAgdmFyIG9yaWdpbmFsVG9QcmVjaXNpb24gPSBOdW1iZXJQcm90b3R5cGUudG9QcmVjaXNpb247XG4gICAgZGVmaW5lUHJvcGVydGllcyhOdW1iZXJQcm90b3R5cGUsIHtcbiAgICAgICAgdG9QcmVjaXNpb246IGZ1bmN0aW9uIHRvUHJlY2lzaW9uKHByZWNpc2lvbikge1xuICAgICAgICAgICAgcmV0dXJuIHR5cGVvZiBwcmVjaXNpb24gPT09ICd1bmRlZmluZWQnID8gb3JpZ2luYWxUb1ByZWNpc2lvbi5jYWxsKHRoaXMpIDogb3JpZ2luYWxUb1ByZWNpc2lvbi5jYWxsKHRoaXMsIHByZWNpc2lvbik7XG4gICAgICAgIH1cbiAgICB9LCBoYXNUb1ByZWNpc2lvblVuZGVmaW5lZEJ1Zyk7XG5cbiAgICAvL1xuICAgIC8vIFN0cmluZ1xuICAgIC8vID09PT09PVxuICAgIC8vXG5cbiAgICAvLyBFUzUgMTUuNS40LjE0XG4gICAgLy8gaHR0cDovL2VzNS5naXRodWIuY29tLyN4MTUuNS40LjE0XG5cbiAgICAvLyBbYnVnZml4LCBJRSBsdCA5LCBmaXJlZm94IDQsIEtvbnF1ZXJvciwgT3BlcmEsIG9ic2N1cmUgYnJvd3NlcnNdXG4gICAgLy8gTWFueSBicm93c2VycyBkbyBub3Qgc3BsaXQgcHJvcGVybHkgd2l0aCByZWd1bGFyIGV4cHJlc3Npb25zIG9yIHRoZXlcbiAgICAvLyBkbyBub3QgcGVyZm9ybSB0aGUgc3BsaXQgY29ycmVjdGx5IHVuZGVyIG9ic2N1cmUgY29uZGl0aW9ucy5cbiAgICAvLyBTZWUgaHR0cDovL2Jsb2cuc3RldmVubGV2aXRoYW4uY29tL2FyY2hpdmVzL2Nyb3NzLWJyb3dzZXItc3BsaXRcbiAgICAvLyBJJ3ZlIHRlc3RlZCBpbiBtYW55IGJyb3dzZXJzIGFuZCB0aGlzIHNlZW1zIHRvIGNvdmVyIHRoZSBkZXZpYW50IG9uZXM6XG4gICAgLy8gICAgJ2FiJy5zcGxpdCgvKD86YWIpKi8pIHNob3VsZCBiZSBbXCJcIiwgXCJcIl0sIG5vdCBbXCJcIl1cbiAgICAvLyAgICAnLicuc3BsaXQoLyguPykoLj8pLykgc2hvdWxkIGJlIFtcIlwiLCBcIi5cIiwgXCJcIiwgXCJcIl0sIG5vdCBbXCJcIiwgXCJcIl1cbiAgICAvLyAgICAndGVzc3QnLnNwbGl0KC8ocykqLykgc2hvdWxkIGJlIFtcInRcIiwgdW5kZWZpbmVkLCBcImVcIiwgXCJzXCIsIFwidFwiXSwgbm90XG4gICAgLy8gICAgICAgW3VuZGVmaW5lZCwgXCJ0XCIsIHVuZGVmaW5lZCwgXCJlXCIsIC4uLl1cbiAgICAvLyAgICAnJy5zcGxpdCgvLj8vKSBzaG91bGQgYmUgW10sIG5vdCBbXCJcIl1cbiAgICAvLyAgICAnLicuc3BsaXQoLygpKCkvKSBzaG91bGQgYmUgW1wiLlwiXSwgbm90IFtcIlwiLCBcIlwiLCBcIi5cIl1cblxuICAgIGlmIChcbiAgICAgICAgJ2FiJy5zcGxpdCgvKD86YWIpKi8pLmxlbmd0aCAhPT0gMlxuICAgICAgICB8fCAnLicuc3BsaXQoLyguPykoLj8pLykubGVuZ3RoICE9PSA0XG4gICAgICAgIHx8ICd0ZXNzdCcuc3BsaXQoLyhzKSovKVsxXSA9PT0gJ3QnXG4gICAgICAgIHx8ICd0ZXN0Jy5zcGxpdCgvKD86KS8sIC0xKS5sZW5ndGggIT09IDRcbiAgICAgICAgfHwgJycuc3BsaXQoLy4/LykubGVuZ3RoXG4gICAgICAgIHx8ICcuJy5zcGxpdCgvKCkoKS8pLmxlbmd0aCA+IDFcbiAgICApIHtcbiAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBjb21wbGlhbnRFeGVjTnBjZyA9IHR5cGVvZiAoLygpPz8vKS5leGVjKCcnKVsxXSA9PT0gJ3VuZGVmaW5lZCc7IC8vIE5QQ0c6IG5vbnBhcnRpY2lwYXRpbmcgY2FwdHVyaW5nIGdyb3VwXG4gICAgICAgICAgICB2YXIgbWF4U2FmZTMyQml0SW50ID0gTWF0aC5wb3coMiwgMzIpIC0gMTtcblxuICAgICAgICAgICAgU3RyaW5nUHJvdG90eXBlLnNwbGl0ID0gZnVuY3Rpb24gKHNlcGFyYXRvciwgbGltaXQpIHtcbiAgICAgICAgICAgICAgICB2YXIgc3RyaW5nID0gU3RyaW5nKHRoaXMpO1xuICAgICAgICAgICAgICAgIGlmICh0eXBlb2Ygc2VwYXJhdG9yID09PSAndW5kZWZpbmVkJyAmJiBsaW1pdCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gW107XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8gSWYgYHNlcGFyYXRvcmAgaXMgbm90IGEgcmVnZXgsIHVzZSBuYXRpdmUgc3BsaXRcbiAgICAgICAgICAgICAgICBpZiAoIWlzUmVnZXgoc2VwYXJhdG9yKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gc3RyU3BsaXQodGhpcywgc2VwYXJhdG9yLCBsaW1pdCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdmFyIG91dHB1dCA9IFtdO1xuICAgICAgICAgICAgICAgIHZhciBmbGFncyA9IChzZXBhcmF0b3IuaWdub3JlQ2FzZSA/ICdpJyA6ICcnKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICsgKHNlcGFyYXRvci5tdWx0aWxpbmUgPyAnbScgOiAnJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICArIChzZXBhcmF0b3IudW5pY29kZSA/ICd1JyA6ICcnKSAvLyBpbiBFUzZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICArIChzZXBhcmF0b3Iuc3RpY2t5ID8gJ3knIDogJycpLCAvLyBGaXJlZm94IDMrIGFuZCBFUzZcbiAgICAgICAgICAgICAgICAgICAgbGFzdExhc3RJbmRleCA9IDAsXG4gICAgICAgICAgICAgICAgICAgIC8vIE1ha2UgYGdsb2JhbGAgYW5kIGF2b2lkIGBsYXN0SW5kZXhgIGlzc3VlcyBieSB3b3JraW5nIHdpdGggYSBjb3B5XG4gICAgICAgICAgICAgICAgICAgIHNlcGFyYXRvcjIsIG1hdGNoLCBsYXN0SW5kZXgsIGxhc3RMZW5ndGg7XG4gICAgICAgICAgICAgICAgdmFyIHNlcGFyYXRvckNvcHkgPSBuZXcgUmVnRXhwKHNlcGFyYXRvci5zb3VyY2UsIGZsYWdzICsgJ2cnKTtcbiAgICAgICAgICAgICAgICBpZiAoIWNvbXBsaWFudEV4ZWNOcGNnKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIERvZXNuJ3QgbmVlZCBmbGFncyBneSwgYnV0IHRoZXkgZG9uJ3QgaHVydFxuICAgICAgICAgICAgICAgICAgICBzZXBhcmF0b3IyID0gbmV3IFJlZ0V4cCgnXicgKyBzZXBhcmF0b3JDb3B5LnNvdXJjZSArICckKD8hXFxcXHMpJywgZmxhZ3MpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvKiBWYWx1ZXMgZm9yIGBsaW1pdGAsIHBlciB0aGUgc3BlYzpcbiAgICAgICAgICAgICAgICAgKiBJZiB1bmRlZmluZWQ6IDQyOTQ5NjcyOTUgLy8gbWF4U2FmZTMyQml0SW50XG4gICAgICAgICAgICAgICAgICogSWYgMCwgSW5maW5pdHksIG9yIE5hTjogMFxuICAgICAgICAgICAgICAgICAqIElmIHBvc2l0aXZlIG51bWJlcjogbGltaXQgPSBNYXRoLmZsb29yKGxpbWl0KTsgaWYgKGxpbWl0ID4gNDI5NDk2NzI5NSkgbGltaXQgLT0gNDI5NDk2NzI5NjtcbiAgICAgICAgICAgICAgICAgKiBJZiBuZWdhdGl2ZSBudW1iZXI6IDQyOTQ5NjcyOTYgLSBNYXRoLmZsb29yKE1hdGguYWJzKGxpbWl0KSlcbiAgICAgICAgICAgICAgICAgKiBJZiBvdGhlcjogVHlwZS1jb252ZXJ0LCB0aGVuIHVzZSB0aGUgYWJvdmUgcnVsZXNcbiAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICB2YXIgc3BsaXRMaW1pdCA9IHR5cGVvZiBsaW1pdCA9PT0gJ3VuZGVmaW5lZCcgPyBtYXhTYWZlMzJCaXRJbnQgOiBFUy5Ub1VpbnQzMihsaW1pdCk7XG4gICAgICAgICAgICAgICAgbWF0Y2ggPSBzZXBhcmF0b3JDb3B5LmV4ZWMoc3RyaW5nKTtcbiAgICAgICAgICAgICAgICB3aGlsZSAobWF0Y2gpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gYHNlcGFyYXRvckNvcHkubGFzdEluZGV4YCBpcyBub3QgcmVsaWFibGUgY3Jvc3MtYnJvd3NlclxuICAgICAgICAgICAgICAgICAgICBsYXN0SW5kZXggPSBtYXRjaC5pbmRleCArIG1hdGNoWzBdLmxlbmd0aDtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGxhc3RJbmRleCA+IGxhc3RMYXN0SW5kZXgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHB1c2hDYWxsKG91dHB1dCwgc3RyU2xpY2Uoc3RyaW5nLCBsYXN0TGFzdEluZGV4LCBtYXRjaC5pbmRleCkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gRml4IGJyb3dzZXJzIHdob3NlIGBleGVjYCBtZXRob2RzIGRvbid0IGNvbnNpc3RlbnRseSByZXR1cm4gYHVuZGVmaW5lZGAgZm9yXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBub25wYXJ0aWNpcGF0aW5nIGNhcHR1cmluZyBncm91cHNcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghY29tcGxpYW50RXhlY05wY2cgJiYgbWF0Y2gubGVuZ3RoID4gMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIGVzbGludC1kaXNhYmxlIG5vLWxvb3AtZnVuYyAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1hdGNoWzBdLnJlcGxhY2Uoc2VwYXJhdG9yMiwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGggLSAyOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgYXJndW1lbnRzW2ldID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1hdGNoW2ldID0gdm9pZCAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogZXNsaW50LWVuYWJsZSBuby1sb29wLWZ1bmMgKi9cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChtYXRjaC5sZW5ndGggPiAxICYmIG1hdGNoLmluZGV4IDwgc3RyaW5nLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFycmF5X3B1c2guYXBwbHkob3V0cHV0LCBhcnJheVNsaWNlKG1hdGNoLCAxKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBsYXN0TGVuZ3RoID0gbWF0Y2hbMF0ubGVuZ3RoO1xuICAgICAgICAgICAgICAgICAgICAgICAgbGFzdExhc3RJbmRleCA9IGxhc3RJbmRleDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChvdXRwdXQubGVuZ3RoID49IHNwbGl0TGltaXQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAoc2VwYXJhdG9yQ29weS5sYXN0SW5kZXggPT09IG1hdGNoLmluZGV4KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZXBhcmF0b3JDb3B5Lmxhc3RJbmRleCsrOyAvLyBBdm9pZCBhbiBpbmZpbml0ZSBsb29wXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgbWF0Y2ggPSBzZXBhcmF0b3JDb3B5LmV4ZWMoc3RyaW5nKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGxhc3RMYXN0SW5kZXggPT09IHN0cmluZy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGxhc3RMZW5ndGggfHwgIXNlcGFyYXRvckNvcHkudGVzdCgnJykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHB1c2hDYWxsKG91dHB1dCwgJycpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcHVzaENhbGwob3V0cHV0LCBzdHJTbGljZShzdHJpbmcsIGxhc3RMYXN0SW5kZXgpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIG91dHB1dC5sZW5ndGggPiBzcGxpdExpbWl0ID8gYXJyYXlTbGljZShvdXRwdXQsIDAsIHNwbGl0TGltaXQpIDogb3V0cHV0O1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfSgpKTtcblxuICAgIC8vIFtidWdmaXgsIGNocm9tZV1cbiAgICAvLyBJZiBzZXBhcmF0b3IgaXMgdW5kZWZpbmVkLCB0aGVuIHRoZSByZXN1bHQgYXJyYXkgY29udGFpbnMganVzdCBvbmUgU3RyaW5nLFxuICAgIC8vIHdoaWNoIGlzIHRoZSB0aGlzIHZhbHVlIChjb252ZXJ0ZWQgdG8gYSBTdHJpbmcpLiBJZiBsaW1pdCBpcyBub3QgdW5kZWZpbmVkLFxuICAgIC8vIHRoZW4gdGhlIG91dHB1dCBhcnJheSBpcyB0cnVuY2F0ZWQgc28gdGhhdCBpdCBjb250YWlucyBubyBtb3JlIHRoYW4gbGltaXRcbiAgICAvLyBlbGVtZW50cy5cbiAgICAvLyBcIjBcIi5zcGxpdCh1bmRlZmluZWQsIDApIC0+IFtdXG4gICAgfSBlbHNlIGlmICgnMCcuc3BsaXQodm9pZCAwLCAwKS5sZW5ndGgpIHtcbiAgICAgICAgU3RyaW5nUHJvdG90eXBlLnNwbGl0ID0gZnVuY3Rpb24gc3BsaXQoc2VwYXJhdG9yLCBsaW1pdCkge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBzZXBhcmF0b3IgPT09ICd1bmRlZmluZWQnICYmIGxpbWl0ID09PSAwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHN0clNwbGl0KHRoaXMsIHNlcGFyYXRvciwgbGltaXQpO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIHZhciBzdHJfcmVwbGFjZSA9IFN0cmluZ1Byb3RvdHlwZS5yZXBsYWNlO1xuICAgIHZhciByZXBsYWNlUmVwb3J0c0dyb3Vwc0NvcnJlY3RseSA9IChmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBncm91cHMgPSBbXTtcbiAgICAgICAgJ3gnLnJlcGxhY2UoL3goLik/L2csIGZ1bmN0aW9uIChtYXRjaCwgZ3JvdXApIHtcbiAgICAgICAgICAgIHB1c2hDYWxsKGdyb3VwcywgZ3JvdXApO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIGdyb3Vwcy5sZW5ndGggPT09IDEgJiYgdHlwZW9mIGdyb3Vwc1swXSA9PT0gJ3VuZGVmaW5lZCc7XG4gICAgfSgpKTtcblxuICAgIGlmICghcmVwbGFjZVJlcG9ydHNHcm91cHNDb3JyZWN0bHkpIHtcbiAgICAgICAgU3RyaW5nUHJvdG90eXBlLnJlcGxhY2UgPSBmdW5jdGlvbiByZXBsYWNlKHNlYXJjaFZhbHVlLCByZXBsYWNlVmFsdWUpIHtcbiAgICAgICAgICAgIHZhciBpc0ZuID0gaXNDYWxsYWJsZShyZXBsYWNlVmFsdWUpO1xuICAgICAgICAgICAgdmFyIGhhc0NhcHR1cmluZ0dyb3VwcyA9IGlzUmVnZXgoc2VhcmNoVmFsdWUpICYmICgvXFwpWyo/XS8pLnRlc3Qoc2VhcmNoVmFsdWUuc291cmNlKTtcbiAgICAgICAgICAgIGlmICghaXNGbiB8fCAhaGFzQ2FwdHVyaW5nR3JvdXBzKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHN0cl9yZXBsYWNlLmNhbGwodGhpcywgc2VhcmNoVmFsdWUsIHJlcGxhY2VWYWx1ZSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHZhciB3cmFwcGVkUmVwbGFjZVZhbHVlID0gZnVuY3Rpb24gKG1hdGNoKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBsZW5ndGggPSBhcmd1bWVudHMubGVuZ3RoO1xuICAgICAgICAgICAgICAgICAgICB2YXIgb3JpZ2luYWxMYXN0SW5kZXggPSBzZWFyY2hWYWx1ZS5sYXN0SW5kZXg7XG4gICAgICAgICAgICAgICAgICAgIHNlYXJjaFZhbHVlLmxhc3RJbmRleCA9IDA7XG4gICAgICAgICAgICAgICAgICAgIHZhciBhcmdzID0gc2VhcmNoVmFsdWUuZXhlYyhtYXRjaCkgfHwgW107XG4gICAgICAgICAgICAgICAgICAgIHNlYXJjaFZhbHVlLmxhc3RJbmRleCA9IG9yaWdpbmFsTGFzdEluZGV4O1xuICAgICAgICAgICAgICAgICAgICBwdXNoQ2FsbChhcmdzLCBhcmd1bWVudHNbbGVuZ3RoIC0gMl0sIGFyZ3VtZW50c1tsZW5ndGggLSAxXSk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiByZXBsYWNlVmFsdWUuYXBwbHkodGhpcywgYXJncyk7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICByZXR1cm4gc3RyX3JlcGxhY2UuY2FsbCh0aGlzLCBzZWFyY2hWYWx1ZSwgd3JhcHBlZFJlcGxhY2VWYWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgLy8gRUNNQS0yNjIsIDNyZCBCLjIuM1xuICAgIC8vIE5vdCBhbiBFQ01BU2NyaXB0IHN0YW5kYXJkLCBhbHRob3VnaCBFQ01BU2NyaXB0IDNyZCBFZGl0aW9uIGhhcyBhXG4gICAgLy8gbm9uLW5vcm1hdGl2ZSBzZWN0aW9uIHN1Z2dlc3RpbmcgdW5pZm9ybSBzZW1hbnRpY3MgYW5kIGl0IHNob3VsZCBiZVxuICAgIC8vIG5vcm1hbGl6ZWQgYWNyb3NzIGFsbCBicm93c2Vyc1xuICAgIC8vIFtidWdmaXgsIElFIGx0IDldIElFIDwgOSBzdWJzdHIoKSB3aXRoIG5lZ2F0aXZlIHZhbHVlIG5vdCB3b3JraW5nIGluIElFXG4gICAgdmFyIHN0cmluZ19zdWJzdHIgPSBTdHJpbmdQcm90b3R5cGUuc3Vic3RyO1xuICAgIHZhciBoYXNOZWdhdGl2ZVN1YnN0ckJ1ZyA9ICcnLnN1YnN0ciAmJiAnMGInLnN1YnN0cigtMSkgIT09ICdiJztcbiAgICBkZWZpbmVQcm9wZXJ0aWVzKFN0cmluZ1Byb3RvdHlwZSwge1xuICAgICAgICBzdWJzdHI6IGZ1bmN0aW9uIHN1YnN0cihzdGFydCwgbGVuZ3RoKSB7XG4gICAgICAgICAgICB2YXIgbm9ybWFsaXplZFN0YXJ0ID0gc3RhcnQ7XG4gICAgICAgICAgICBpZiAoc3RhcnQgPCAwKSB7XG4gICAgICAgICAgICAgICAgbm9ybWFsaXplZFN0YXJ0ID0gbWF4KHRoaXMubGVuZ3RoICsgc3RhcnQsIDApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHN0cmluZ19zdWJzdHIuY2FsbCh0aGlzLCBub3JtYWxpemVkU3RhcnQsIGxlbmd0aCk7XG4gICAgICAgIH1cbiAgICB9LCBoYXNOZWdhdGl2ZVN1YnN0ckJ1Zyk7XG5cbiAgICAvLyBFUzUgMTUuNS40LjIwXG4gICAgLy8gd2hpdGVzcGFjZSBmcm9tOiBodHRwOi8vZXM1LmdpdGh1Yi5pby8jeDE1LjUuNC4yMFxuICAgIHZhciB3cyA9ICdcXHgwOVxceDBBXFx4MEJcXHgwQ1xceDBEXFx4MjBcXHhBMFxcdTE2ODBcXHUxODBFXFx1MjAwMFxcdTIwMDFcXHUyMDAyXFx1MjAwMydcbiAgICAgICAgKyAnXFx1MjAwNFxcdTIwMDVcXHUyMDA2XFx1MjAwN1xcdTIwMDhcXHUyMDA5XFx1MjAwQVxcdTIwMkZcXHUyMDVGXFx1MzAwMFxcdTIwMjgnXG4gICAgICAgICsgJ1xcdTIwMjlcXHVGRUZGJztcbiAgICB2YXIgemVyb1dpZHRoID0gJ1xcdTIwMGInO1xuICAgIHZhciB3c1JlZ2V4Q2hhcnMgPSAnWycgKyB3cyArICddJztcbiAgICB2YXIgdHJpbUJlZ2luUmVnZXhwID0gbmV3IFJlZ0V4cCgnXicgKyB3c1JlZ2V4Q2hhcnMgKyB3c1JlZ2V4Q2hhcnMgKyAnKicpO1xuICAgIHZhciB0cmltRW5kUmVnZXhwID0gbmV3IFJlZ0V4cCh3c1JlZ2V4Q2hhcnMgKyB3c1JlZ2V4Q2hhcnMgKyAnKiQnKTtcbiAgICB2YXIgaGFzVHJpbVdoaXRlc3BhY2VCdWcgPSBTdHJpbmdQcm90b3R5cGUudHJpbSAmJiAod3MudHJpbSgpIHx8ICF6ZXJvV2lkdGgudHJpbSgpKTtcbiAgICBkZWZpbmVQcm9wZXJ0aWVzKFN0cmluZ1Byb3RvdHlwZSwge1xuICAgICAgICAvLyBodHRwOi8vYmxvZy5zdGV2ZW5sZXZpdGhhbi5jb20vYXJjaGl2ZXMvZmFzdGVyLXRyaW0tamF2YXNjcmlwdFxuICAgICAgICAvLyBodHRwOi8vcGVyZmVjdGlvbmtpbGxzLmNvbS93aGl0ZXNwYWNlLWRldmlhdGlvbnMvXG4gICAgICAgIHRyaW06IGZ1bmN0aW9uIHRyaW0oKSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIHRoaXMgPT09ICd1bmRlZmluZWQnIHx8IHRoaXMgPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiY2FuJ3QgY29udmVydCBcIiArIHRoaXMgKyAnIHRvIG9iamVjdCcpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuICRTdHJpbmcodGhpcykucmVwbGFjZSh0cmltQmVnaW5SZWdleHAsICcnKS5yZXBsYWNlKHRyaW1FbmRSZWdleHAsICcnKTtcbiAgICAgICAgfVxuICAgIH0sIGhhc1RyaW1XaGl0ZXNwYWNlQnVnKTtcbiAgICB2YXIgdHJpbSA9IGNhbGwuYmluZChTdHJpbmcucHJvdG90eXBlLnRyaW0pO1xuXG4gICAgdmFyIGhhc0xhc3RJbmRleEJ1ZyA9IFN0cmluZ1Byb3RvdHlwZS5sYXN0SW5kZXhPZiAmJiAnYWJj44GC44GEJy5sYXN0SW5kZXhPZign44GC44GEJywgMikgIT09IC0xO1xuICAgIGRlZmluZVByb3BlcnRpZXMoU3RyaW5nUHJvdG90eXBlLCB7XG4gICAgICAgIGxhc3RJbmRleE9mOiBmdW5jdGlvbiBsYXN0SW5kZXhPZihzZWFyY2hTdHJpbmcpIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgdGhpcyA9PT0gJ3VuZGVmaW5lZCcgfHwgdGhpcyA9PT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJjYW4ndCBjb252ZXJ0IFwiICsgdGhpcyArICcgdG8gb2JqZWN0Jyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgUyA9ICRTdHJpbmcodGhpcyk7XG4gICAgICAgICAgICB2YXIgc2VhcmNoU3RyID0gJFN0cmluZyhzZWFyY2hTdHJpbmcpO1xuICAgICAgICAgICAgdmFyIG51bVBvcyA9IGFyZ3VtZW50cy5sZW5ndGggPiAxID8gJE51bWJlcihhcmd1bWVudHNbMV0pIDogTmFOO1xuICAgICAgICAgICAgdmFyIHBvcyA9IGlzQWN0dWFsTmFOKG51bVBvcykgPyBJbmZpbml0eSA6IEVTLlRvSW50ZWdlcihudW1Qb3MpO1xuICAgICAgICAgICAgdmFyIHN0YXJ0ID0gbWluKG1heChwb3MsIDApLCBTLmxlbmd0aCk7XG4gICAgICAgICAgICB2YXIgc2VhcmNoTGVuID0gc2VhcmNoU3RyLmxlbmd0aDtcbiAgICAgICAgICAgIHZhciBrID0gc3RhcnQgKyBzZWFyY2hMZW47XG4gICAgICAgICAgICB3aGlsZSAoayA+IDApIHtcbiAgICAgICAgICAgICAgICBrID0gbWF4KDAsIGsgLSBzZWFyY2hMZW4pO1xuICAgICAgICAgICAgICAgIHZhciBpbmRleCA9IHN0ckluZGV4T2Yoc3RyU2xpY2UoUywgaywgc3RhcnQgKyBzZWFyY2hMZW4pLCBzZWFyY2hTdHIpO1xuICAgICAgICAgICAgICAgIGlmIChpbmRleCAhPT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGsgKyBpbmRleDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gLTE7XG4gICAgICAgIH1cbiAgICB9LCBoYXNMYXN0SW5kZXhCdWcpO1xuXG4gICAgdmFyIG9yaWdpbmFsTGFzdEluZGV4T2YgPSBTdHJpbmdQcm90b3R5cGUubGFzdEluZGV4T2Y7XG4gICAgZGVmaW5lUHJvcGVydGllcyhTdHJpbmdQcm90b3R5cGUsIHtcbiAgICAgICAgbGFzdEluZGV4T2Y6IGZ1bmN0aW9uIGxhc3RJbmRleE9mKHNlYXJjaFN0cmluZykge1xuICAgICAgICAgICAgcmV0dXJuIG9yaWdpbmFsTGFzdEluZGV4T2YuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgfVxuICAgIH0sIFN0cmluZ1Byb3RvdHlwZS5sYXN0SW5kZXhPZi5sZW5ndGggIT09IDEpO1xuXG4gICAgLy8gRVMtNSAxNS4xLjIuMlxuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSByYWRpeFxuICAgIGlmIChwYXJzZUludCh3cyArICcwOCcpICE9PSA4IHx8IHBhcnNlSW50KHdzICsgJzB4MTYnKSAhPT0gMjIpIHtcbiAgICAgICAgLyogZ2xvYmFsIHBhcnNlSW50OiB0cnVlICovXG4gICAgICAgIHBhcnNlSW50ID0gKGZ1bmN0aW9uIChvcmlnUGFyc2VJbnQpIHtcbiAgICAgICAgICAgIHZhciBoZXhSZWdleCA9IC9eWy0rXT8wW3hYXS87XG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24gcGFyc2VJbnQoc3RyLCByYWRpeCkge1xuICAgICAgICAgICAgICAgIGlmICh0eXBlb2Ygc3RyID09PSAnc3ltYm9sJykge1xuICAgICAgICAgICAgICAgICAgICAvLyBoYW5kbGUgU3ltYm9scyBpbiBub2RlIDguMy84LjRcbiAgICAgICAgICAgICAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWltcGxpY2l0LWNvZXJjaW9uLCBuby11bnVzZWQtZXhwcmVzc2lvbnNcbiAgICAgICAgICAgICAgICAgICAgJycgKyBzdHI7IC8vIGpzY3M6aWdub3JlIGRpc2FsbG93SW1wbGljaXRUeXBlQ29udmVyc2lvblxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHZhciBzdHJpbmcgPSB0cmltKFN0cmluZyhzdHIpKTtcbiAgICAgICAgICAgICAgICB2YXIgZGVmYXVsdGVkUmFkaXggPSAkTnVtYmVyKHJhZGl4KSB8fCAoaGV4UmVnZXgudGVzdChzdHJpbmcpID8gMTYgOiAxMCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG9yaWdQYXJzZUludChzdHJpbmcsIGRlZmF1bHRlZFJhZGl4KTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0ocGFyc2VJbnQpKTtcbiAgICB9XG5cbiAgICAvLyBodHRwczovL2VzNS5naXRodWIuaW8vI3gxNS4xLjIuM1xuICAgIGlmICgxIC8gcGFyc2VGbG9hdCgnLTAnKSAhPT0gLUluZmluaXR5KSB7XG4gICAgICAgIC8qIGdsb2JhbCBwYXJzZUZsb2F0OiB0cnVlICovXG4gICAgICAgIHBhcnNlRmxvYXQgPSAoZnVuY3Rpb24gKG9yaWdQYXJzZUZsb2F0KSB7XG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24gcGFyc2VGbG9hdChzdHJpbmcpIHtcbiAgICAgICAgICAgICAgICB2YXIgaW5wdXRTdHJpbmcgPSB0cmltKFN0cmluZyhzdHJpbmcpKTtcbiAgICAgICAgICAgICAgICB2YXIgcmVzdWx0ID0gb3JpZ1BhcnNlRmxvYXQoaW5wdXRTdHJpbmcpO1xuICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQgPT09IDAgJiYgc3RyU2xpY2UoaW5wdXRTdHJpbmcsIDAsIDEpID09PSAnLScgPyAtMCA6IHJlc3VsdDtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0ocGFyc2VGbG9hdCkpO1xuICAgIH1cblxuICAgIGlmIChTdHJpbmcobmV3IFJhbmdlRXJyb3IoJ3Rlc3QnKSkgIT09ICdSYW5nZUVycm9yOiB0ZXN0Jykge1xuICAgICAgICB2YXIgZXJyb3JUb1N0cmluZ1NoaW0gPSBmdW5jdGlvbiB0b1N0cmluZygpIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgdGhpcyA9PT0gJ3VuZGVmaW5lZCcgfHwgdGhpcyA9PT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJjYW4ndCBjb252ZXJ0IFwiICsgdGhpcyArICcgdG8gb2JqZWN0Jyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgbmFtZSA9IHRoaXMubmFtZTtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgbmFtZSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICAgICBuYW1lID0gJ0Vycm9yJztcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIG5hbWUgIT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAgICAgbmFtZSA9ICRTdHJpbmcobmFtZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgbXNnID0gdGhpcy5tZXNzYWdlO1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBtc2cgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgbXNnID0gJyc7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBtc2cgIT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAgICAgbXNnID0gJFN0cmluZyhtc2cpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCFuYW1lKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG1zZztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghbXNnKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5hbWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gbmFtZSArICc6ICcgKyBtc2c7XG4gICAgICAgIH07XG4gICAgICAgIC8vIGNhbid0IHVzZSBkZWZpbmVQcm9wZXJ0aWVzIGhlcmUgYmVjYXVzZSBvZiB0b1N0cmluZyBlbnVtZXJhdGlvbiBpc3N1ZSBpbiBJRSA8PSA4XG4gICAgICAgIEVycm9yLnByb3RvdHlwZS50b1N0cmluZyA9IGVycm9yVG9TdHJpbmdTaGltO1xuICAgIH1cblxuICAgIGlmIChzdXBwb3J0c0Rlc2NyaXB0b3JzKSB7XG4gICAgICAgIHZhciBlbnN1cmVOb25FbnVtZXJhYmxlID0gZnVuY3Rpb24gKG9iaiwgcHJvcCkge1xuICAgICAgICAgICAgaWYgKGlzRW51bShvYmosIHByb3ApKSB7XG4gICAgICAgICAgICAgICAgdmFyIGRlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKG9iaiwgcHJvcCk7XG4gICAgICAgICAgICAgICAgaWYgKGRlc2MuY29uZmlndXJhYmxlKSB7XG4gICAgICAgICAgICAgICAgICAgIGRlc2MuZW51bWVyYWJsZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqLCBwcm9wLCBkZXNjKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIGVuc3VyZU5vbkVudW1lcmFibGUoRXJyb3IucHJvdG90eXBlLCAnbWVzc2FnZScpO1xuICAgICAgICBpZiAoRXJyb3IucHJvdG90eXBlLm1lc3NhZ2UgIT09ICcnKSB7XG4gICAgICAgICAgICBFcnJvci5wcm90b3R5cGUubWVzc2FnZSA9ICcnO1xuICAgICAgICB9XG4gICAgICAgIGVuc3VyZU5vbkVudW1lcmFibGUoRXJyb3IucHJvdG90eXBlLCAnbmFtZScpO1xuICAgIH1cblxuICAgIGlmIChTdHJpbmcoL2EvbWlnKSAhPT0gJy9hL2dpbScpIHtcbiAgICAgICAgdmFyIHJlZ2V4VG9TdHJpbmcgPSBmdW5jdGlvbiB0b1N0cmluZygpIHtcbiAgICAgICAgICAgIHZhciBzdHIgPSAnLycgKyB0aGlzLnNvdXJjZSArICcvJztcbiAgICAgICAgICAgIGlmICh0aGlzLmdsb2JhbCkge1xuICAgICAgICAgICAgICAgIHN0ciArPSAnZyc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodGhpcy5pZ25vcmVDYXNlKSB7XG4gICAgICAgICAgICAgICAgc3RyICs9ICdpJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0aGlzLm11bHRpbGluZSkge1xuICAgICAgICAgICAgICAgIHN0ciArPSAnbSc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gc3RyO1xuICAgICAgICB9O1xuICAgICAgICAvLyBjYW4ndCB1c2UgZGVmaW5lUHJvcGVydGllcyBoZXJlIGJlY2F1c2Ugb2YgdG9TdHJpbmcgZW51bWVyYXRpb24gaXNzdWUgaW4gSUUgPD0gOFxuICAgICAgICBSZWdFeHAucHJvdG90eXBlLnRvU3RyaW5nID0gcmVnZXhUb1N0cmluZztcbiAgICB9XG59KSk7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9lczUtc2hpbS9lczUtc2hpbS5qc1xuLy8gbW9kdWxlIGlkID0gLi9ub2RlX21vZHVsZXMvZXM1LXNoaW0vZXM1LXNoaW0uanNcbi8vIG1vZHVsZSBjaHVua3MgPSAxIiwiLyoqXG4qIEBwcmVzZXJ2ZSBIVE1MNSBTaGl2IDMuNy4zIHwgQGFmYXJrYXMgQGpkYWx0b24gQGpvbl9uZWFsIEByZW0gfCBNSVQvR1BMMiBMaWNlbnNlZFxuKi9cbjsoZnVuY3Rpb24od2luZG93LCBkb2N1bWVudCkge1xuLypqc2hpbnQgZXZpbDp0cnVlICovXG4gIC8qKiB2ZXJzaW9uICovXG4gIHZhciB2ZXJzaW9uID0gJzMuNy4zLXByZSc7XG5cbiAgLyoqIFByZXNldCBvcHRpb25zICovXG4gIHZhciBvcHRpb25zID0gd2luZG93Lmh0bWw1IHx8IHt9O1xuXG4gIC8qKiBVc2VkIHRvIHNraXAgcHJvYmxlbSBlbGVtZW50cyAqL1xuICB2YXIgcmVTa2lwID0gL148fF4oPzpidXR0b258bWFwfHNlbGVjdHx0ZXh0YXJlYXxvYmplY3R8aWZyYW1lfG9wdGlvbnxvcHRncm91cCkkL2k7XG5cbiAgLyoqIE5vdCBhbGwgZWxlbWVudHMgY2FuIGJlIGNsb25lZCBpbiBJRSAqKi9cbiAgdmFyIHNhdmVDbG9uZXMgPSAvXig/OmF8Ynxjb2RlfGRpdnxmaWVsZHNldHxoMXxoMnxoM3xoNHxoNXxoNnxpfGxhYmVsfGxpfG9sfHB8cXxzcGFufHN0cm9uZ3xzdHlsZXx0YWJsZXx0Ym9keXx0ZHx0aHx0cnx1bCkkL2k7XG5cbiAgLyoqIERldGVjdCB3aGV0aGVyIHRoZSBicm93c2VyIHN1cHBvcnRzIGRlZmF1bHQgaHRtbDUgc3R5bGVzICovXG4gIHZhciBzdXBwb3J0c0h0bWw1U3R5bGVzO1xuXG4gIC8qKiBOYW1lIG9mIHRoZSBleHBhbmRvLCB0byB3b3JrIHdpdGggbXVsdGlwbGUgZG9jdW1lbnRzIG9yIHRvIHJlLXNoaXYgb25lIGRvY3VtZW50ICovXG4gIHZhciBleHBhbmRvID0gJ19odG1sNXNoaXYnO1xuXG4gIC8qKiBUaGUgaWQgZm9yIHRoZSB0aGUgZG9jdW1lbnRzIGV4cGFuZG8gKi9cbiAgdmFyIGV4cGFuSUQgPSAwO1xuXG4gIC8qKiBDYWNoZWQgZGF0YSBmb3IgZWFjaCBkb2N1bWVudCAqL1xuICB2YXIgZXhwYW5kb0RhdGEgPSB7fTtcblxuICAvKiogRGV0ZWN0IHdoZXRoZXIgdGhlIGJyb3dzZXIgc3VwcG9ydHMgdW5rbm93biBlbGVtZW50cyAqL1xuICB2YXIgc3VwcG9ydHNVbmtub3duRWxlbWVudHM7XG5cbiAgKGZ1bmN0aW9uKCkge1xuICAgIHRyeSB7XG4gICAgICAgIHZhciBhID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xuICAgICAgICBhLmlubmVySFRNTCA9ICc8eHl6PjwveHl6Pic7XG4gICAgICAgIC8vaWYgdGhlIGhpZGRlbiBwcm9wZXJ0eSBpcyBpbXBsZW1lbnRlZCB3ZSBjYW4gYXNzdW1lLCB0aGF0IHRoZSBicm93c2VyIHN1cHBvcnRzIGJhc2ljIEhUTUw1IFN0eWxlc1xuICAgICAgICBzdXBwb3J0c0h0bWw1U3R5bGVzID0gKCdoaWRkZW4nIGluIGEpO1xuXG4gICAgICAgIHN1cHBvcnRzVW5rbm93bkVsZW1lbnRzID0gYS5jaGlsZE5vZGVzLmxlbmd0aCA9PSAxIHx8IChmdW5jdGlvbigpIHtcbiAgICAgICAgICAvLyBhc3NpZ24gYSBmYWxzZSBwb3NpdGl2ZSBpZiB1bmFibGUgdG8gc2hpdlxuICAgICAgICAgIChkb2N1bWVudC5jcmVhdGVFbGVtZW50KSgnYScpO1xuICAgICAgICAgIHZhciBmcmFnID0gZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpO1xuICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICB0eXBlb2YgZnJhZy5jbG9uZU5vZGUgPT0gJ3VuZGVmaW5lZCcgfHxcbiAgICAgICAgICAgIHR5cGVvZiBmcmFnLmNyZWF0ZURvY3VtZW50RnJhZ21lbnQgPT0gJ3VuZGVmaW5lZCcgfHxcbiAgICAgICAgICAgIHR5cGVvZiBmcmFnLmNyZWF0ZUVsZW1lbnQgPT0gJ3VuZGVmaW5lZCdcbiAgICAgICAgICApO1xuICAgICAgICB9KCkpO1xuICAgIH0gY2F0Y2goZSkge1xuICAgICAgLy8gYXNzaWduIGEgZmFsc2UgcG9zaXRpdmUgaWYgZGV0ZWN0aW9uIGZhaWxzID0+IHVuYWJsZSB0byBzaGl2XG4gICAgICBzdXBwb3J0c0h0bWw1U3R5bGVzID0gdHJ1ZTtcbiAgICAgIHN1cHBvcnRzVW5rbm93bkVsZW1lbnRzID0gdHJ1ZTtcbiAgICB9XG5cbiAgfSgpKTtcblxuICAvKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuICAvKipcbiAgICogQ3JlYXRlcyBhIHN0eWxlIHNoZWV0IHdpdGggdGhlIGdpdmVuIENTUyB0ZXh0IGFuZCBhZGRzIGl0IHRvIHRoZSBkb2N1bWVudC5cbiAgICogQHByaXZhdGVcbiAgICogQHBhcmFtIHtEb2N1bWVudH0gb3duZXJEb2N1bWVudCBUaGUgZG9jdW1lbnQuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBjc3NUZXh0IFRoZSBDU1MgdGV4dC5cbiAgICogQHJldHVybnMge1N0eWxlU2hlZXR9IFRoZSBzdHlsZSBlbGVtZW50LlxuICAgKi9cbiAgZnVuY3Rpb24gYWRkU3R5bGVTaGVldChvd25lckRvY3VtZW50LCBjc3NUZXh0KSB7XG4gICAgdmFyIHAgPSBvd25lckRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKSxcbiAgICAgICAgcGFyZW50ID0gb3duZXJEb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnaGVhZCcpWzBdIHx8IG93bmVyRG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50O1xuXG4gICAgcC5pbm5lckhUTUwgPSAneDxzdHlsZT4nICsgY3NzVGV4dCArICc8L3N0eWxlPic7XG4gICAgcmV0dXJuIHBhcmVudC5pbnNlcnRCZWZvcmUocC5sYXN0Q2hpbGQsIHBhcmVudC5maXJzdENoaWxkKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSB2YWx1ZSBvZiBgaHRtbDUuZWxlbWVudHNgIGFzIGFuIGFycmF5LlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcmV0dXJucyB7QXJyYXl9IEFuIGFycmF5IG9mIHNoaXZlZCBlbGVtZW50IG5vZGUgbmFtZXMuXG4gICAqL1xuICBmdW5jdGlvbiBnZXRFbGVtZW50cygpIHtcbiAgICB2YXIgZWxlbWVudHMgPSBodG1sNS5lbGVtZW50cztcbiAgICByZXR1cm4gdHlwZW9mIGVsZW1lbnRzID09ICdzdHJpbmcnID8gZWxlbWVudHMuc3BsaXQoJyAnKSA6IGVsZW1lbnRzO1xuICB9XG5cbiAgLyoqXG4gICAqIEV4dGVuZHMgdGhlIGJ1aWx0LWluIGxpc3Qgb2YgaHRtbDUgZWxlbWVudHNcbiAgICogQG1lbWJlck9mIGh0bWw1XG4gICAqIEBwYXJhbSB7U3RyaW5nfEFycmF5fSBuZXdFbGVtZW50cyB3aGl0ZXNwYWNlIHNlcGFyYXRlZCBsaXN0IG9yIGFycmF5IG9mIG5ldyBlbGVtZW50IG5hbWVzIHRvIHNoaXZcbiAgICogQHBhcmFtIHtEb2N1bWVudH0gb3duZXJEb2N1bWVudCBUaGUgY29udGV4dCBkb2N1bWVudC5cbiAgICovXG4gIGZ1bmN0aW9uIGFkZEVsZW1lbnRzKG5ld0VsZW1lbnRzLCBvd25lckRvY3VtZW50KSB7XG4gICAgdmFyIGVsZW1lbnRzID0gaHRtbDUuZWxlbWVudHM7XG4gICAgaWYodHlwZW9mIGVsZW1lbnRzICE9ICdzdHJpbmcnKXtcbiAgICAgIGVsZW1lbnRzID0gZWxlbWVudHMuam9pbignICcpO1xuICAgIH1cbiAgICBpZih0eXBlb2YgbmV3RWxlbWVudHMgIT0gJ3N0cmluZycpe1xuICAgICAgbmV3RWxlbWVudHMgPSBuZXdFbGVtZW50cy5qb2luKCcgJyk7XG4gICAgfVxuICAgIGh0bWw1LmVsZW1lbnRzID0gZWxlbWVudHMgKycgJysgbmV3RWxlbWVudHM7XG4gICAgc2hpdkRvY3VtZW50KG93bmVyRG9jdW1lbnQpO1xuICB9XG5cbiAgIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBkYXRhIGFzc29jaWF0ZWQgdG8gdGhlIGdpdmVuIGRvY3VtZW50XG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSB7RG9jdW1lbnR9IG93bmVyRG9jdW1lbnQgVGhlIGRvY3VtZW50LlxuICAgKiBAcmV0dXJucyB7T2JqZWN0fSBBbiBvYmplY3Qgb2YgZGF0YS5cbiAgICovXG4gIGZ1bmN0aW9uIGdldEV4cGFuZG9EYXRhKG93bmVyRG9jdW1lbnQpIHtcbiAgICB2YXIgZGF0YSA9IGV4cGFuZG9EYXRhW293bmVyRG9jdW1lbnRbZXhwYW5kb11dO1xuICAgIGlmICghZGF0YSkge1xuICAgICAgICBkYXRhID0ge307XG4gICAgICAgIGV4cGFuSUQrKztcbiAgICAgICAgb3duZXJEb2N1bWVudFtleHBhbmRvXSA9IGV4cGFuSUQ7XG4gICAgICAgIGV4cGFuZG9EYXRhW2V4cGFuSURdID0gZGF0YTtcbiAgICB9XG4gICAgcmV0dXJuIGRhdGE7XG4gIH1cblxuICAvKipcbiAgICogcmV0dXJucyBhIHNoaXZlZCBlbGVtZW50IGZvciB0aGUgZ2l2ZW4gbm9kZU5hbWUgYW5kIGRvY3VtZW50XG4gICAqIEBtZW1iZXJPZiBodG1sNVxuICAgKiBAcGFyYW0ge1N0cmluZ30gbm9kZU5hbWUgbmFtZSBvZiB0aGUgZWxlbWVudFxuICAgKiBAcGFyYW0ge0RvY3VtZW50fSBvd25lckRvY3VtZW50IFRoZSBjb250ZXh0IGRvY3VtZW50LlxuICAgKiBAcmV0dXJucyB7T2JqZWN0fSBUaGUgc2hpdmVkIGVsZW1lbnQuXG4gICAqL1xuICBmdW5jdGlvbiBjcmVhdGVFbGVtZW50KG5vZGVOYW1lLCBvd25lckRvY3VtZW50LCBkYXRhKXtcbiAgICBpZiAoIW93bmVyRG9jdW1lbnQpIHtcbiAgICAgICAgb3duZXJEb2N1bWVudCA9IGRvY3VtZW50O1xuICAgIH1cbiAgICBpZihzdXBwb3J0c1Vua25vd25FbGVtZW50cyl7XG4gICAgICAgIHJldHVybiBvd25lckRvY3VtZW50LmNyZWF0ZUVsZW1lbnQobm9kZU5hbWUpO1xuICAgIH1cbiAgICBpZiAoIWRhdGEpIHtcbiAgICAgICAgZGF0YSA9IGdldEV4cGFuZG9EYXRhKG93bmVyRG9jdW1lbnQpO1xuICAgIH1cbiAgICB2YXIgbm9kZTtcblxuICAgIGlmIChkYXRhLmNhY2hlW25vZGVOYW1lXSkge1xuICAgICAgICBub2RlID0gZGF0YS5jYWNoZVtub2RlTmFtZV0uY2xvbmVOb2RlKCk7XG4gICAgfSBlbHNlIGlmIChzYXZlQ2xvbmVzLnRlc3Qobm9kZU5hbWUpKSB7XG4gICAgICAgIG5vZGUgPSAoZGF0YS5jYWNoZVtub2RlTmFtZV0gPSBkYXRhLmNyZWF0ZUVsZW0obm9kZU5hbWUpKS5jbG9uZU5vZGUoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBub2RlID0gZGF0YS5jcmVhdGVFbGVtKG5vZGVOYW1lKTtcbiAgICB9XG5cbiAgICAvLyBBdm9pZCBhZGRpbmcgc29tZSBlbGVtZW50cyB0byBmcmFnbWVudHMgaW4gSUUgPCA5IGJlY2F1c2VcbiAgICAvLyAqIEF0dHJpYnV0ZXMgbGlrZSBgbmFtZWAgb3IgYHR5cGVgIGNhbm5vdCBiZSBzZXQvY2hhbmdlZCBvbmNlIGFuIGVsZW1lbnRcbiAgICAvLyAgIGlzIGluc2VydGVkIGludG8gYSBkb2N1bWVudC9mcmFnbWVudFxuICAgIC8vICogTGluayBlbGVtZW50cyB3aXRoIGBzcmNgIGF0dHJpYnV0ZXMgdGhhdCBhcmUgaW5hY2Nlc3NpYmxlLCBhcyB3aXRoXG4gICAgLy8gICBhIDQwMyByZXNwb25zZSwgd2lsbCBjYXVzZSB0aGUgdGFiL3dpbmRvdyB0byBjcmFzaFxuICAgIC8vICogU2NyaXB0IGVsZW1lbnRzIGFwcGVuZGVkIHRvIGZyYWdtZW50cyB3aWxsIGV4ZWN1dGUgd2hlbiB0aGVpciBgc3JjYFxuICAgIC8vICAgb3IgYHRleHRgIHByb3BlcnR5IGlzIHNldFxuICAgIHJldHVybiBub2RlLmNhbkhhdmVDaGlsZHJlbiAmJiAhcmVTa2lwLnRlc3Qobm9kZU5hbWUpICYmICFub2RlLnRhZ1VybiA/IGRhdGEuZnJhZy5hcHBlbmRDaGlsZChub2RlKSA6IG5vZGU7XG4gIH1cblxuICAvKipcbiAgICogcmV0dXJucyBhIHNoaXZlZCBEb2N1bWVudEZyYWdtZW50IGZvciB0aGUgZ2l2ZW4gZG9jdW1lbnRcbiAgICogQG1lbWJlck9mIGh0bWw1XG4gICAqIEBwYXJhbSB7RG9jdW1lbnR9IG93bmVyRG9jdW1lbnQgVGhlIGNvbnRleHQgZG9jdW1lbnQuXG4gICAqIEByZXR1cm5zIHtPYmplY3R9IFRoZSBzaGl2ZWQgRG9jdW1lbnRGcmFnbWVudC5cbiAgICovXG4gIGZ1bmN0aW9uIGNyZWF0ZURvY3VtZW50RnJhZ21lbnQob3duZXJEb2N1bWVudCwgZGF0YSl7XG4gICAgaWYgKCFvd25lckRvY3VtZW50KSB7XG4gICAgICAgIG93bmVyRG9jdW1lbnQgPSBkb2N1bWVudDtcbiAgICB9XG4gICAgaWYoc3VwcG9ydHNVbmtub3duRWxlbWVudHMpe1xuICAgICAgICByZXR1cm4gb3duZXJEb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCk7XG4gICAgfVxuICAgIGRhdGEgPSBkYXRhIHx8IGdldEV4cGFuZG9EYXRhKG93bmVyRG9jdW1lbnQpO1xuICAgIHZhciBjbG9uZSA9IGRhdGEuZnJhZy5jbG9uZU5vZGUoKSxcbiAgICAgICAgaSA9IDAsXG4gICAgICAgIGVsZW1zID0gZ2V0RWxlbWVudHMoKSxcbiAgICAgICAgbCA9IGVsZW1zLmxlbmd0aDtcbiAgICBmb3IoO2k8bDtpKyspe1xuICAgICAgICBjbG9uZS5jcmVhdGVFbGVtZW50KGVsZW1zW2ldKTtcbiAgICB9XG4gICAgcmV0dXJuIGNsb25lO1xuICB9XG5cbiAgLyoqXG4gICAqIFNoaXZzIHRoZSBgY3JlYXRlRWxlbWVudGAgYW5kIGBjcmVhdGVEb2N1bWVudEZyYWdtZW50YCBtZXRob2RzIG9mIHRoZSBkb2N1bWVudC5cbiAgICogQHByaXZhdGVcbiAgICogQHBhcmFtIHtEb2N1bWVudHxEb2N1bWVudEZyYWdtZW50fSBvd25lckRvY3VtZW50IFRoZSBkb2N1bWVudC5cbiAgICogQHBhcmFtIHtPYmplY3R9IGRhdGEgb2YgdGhlIGRvY3VtZW50LlxuICAgKi9cbiAgZnVuY3Rpb24gc2hpdk1ldGhvZHMob3duZXJEb2N1bWVudCwgZGF0YSkge1xuICAgIGlmICghZGF0YS5jYWNoZSkge1xuICAgICAgICBkYXRhLmNhY2hlID0ge307XG4gICAgICAgIGRhdGEuY3JlYXRlRWxlbSA9IG93bmVyRG9jdW1lbnQuY3JlYXRlRWxlbWVudDtcbiAgICAgICAgZGF0YS5jcmVhdGVGcmFnID0gb3duZXJEb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50O1xuICAgICAgICBkYXRhLmZyYWcgPSBkYXRhLmNyZWF0ZUZyYWcoKTtcbiAgICB9XG5cblxuICAgIG93bmVyRG9jdW1lbnQuY3JlYXRlRWxlbWVudCA9IGZ1bmN0aW9uKG5vZGVOYW1lKSB7XG4gICAgICAvL2Fib3J0IHNoaXZcbiAgICAgIGlmICghaHRtbDUuc2hpdk1ldGhvZHMpIHtcbiAgICAgICAgICByZXR1cm4gZGF0YS5jcmVhdGVFbGVtKG5vZGVOYW1lKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBjcmVhdGVFbGVtZW50KG5vZGVOYW1lLCBvd25lckRvY3VtZW50LCBkYXRhKTtcbiAgICB9O1xuXG4gICAgb3duZXJEb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50ID0gRnVuY3Rpb24oJ2gsZicsICdyZXR1cm4gZnVuY3Rpb24oKXsnICtcbiAgICAgICd2YXIgbj1mLmNsb25lTm9kZSgpLGM9bi5jcmVhdGVFbGVtZW50OycgK1xuICAgICAgJ2guc2hpdk1ldGhvZHMmJignICtcbiAgICAgICAgLy8gdW5yb2xsIHRoZSBgY3JlYXRlRWxlbWVudGAgY2FsbHNcbiAgICAgICAgZ2V0RWxlbWVudHMoKS5qb2luKCkucmVwbGFjZSgvW1xcd1xcLTpdKy9nLCBmdW5jdGlvbihub2RlTmFtZSkge1xuICAgICAgICAgIGRhdGEuY3JlYXRlRWxlbShub2RlTmFtZSk7XG4gICAgICAgICAgZGF0YS5mcmFnLmNyZWF0ZUVsZW1lbnQobm9kZU5hbWUpO1xuICAgICAgICAgIHJldHVybiAnYyhcIicgKyBub2RlTmFtZSArICdcIiknO1xuICAgICAgICB9KSArXG4gICAgICAnKTtyZXR1cm4gbn0nXG4gICAgKShodG1sNSwgZGF0YS5mcmFnKTtcbiAgfVxuXG4gIC8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG4gIC8qKlxuICAgKiBTaGl2cyB0aGUgZ2l2ZW4gZG9jdW1lbnQuXG4gICAqIEBtZW1iZXJPZiBodG1sNVxuICAgKiBAcGFyYW0ge0RvY3VtZW50fSBvd25lckRvY3VtZW50IFRoZSBkb2N1bWVudCB0byBzaGl2LlxuICAgKiBAcmV0dXJucyB7RG9jdW1lbnR9IFRoZSBzaGl2ZWQgZG9jdW1lbnQuXG4gICAqL1xuICBmdW5jdGlvbiBzaGl2RG9jdW1lbnQob3duZXJEb2N1bWVudCkge1xuICAgIGlmICghb3duZXJEb2N1bWVudCkge1xuICAgICAgICBvd25lckRvY3VtZW50ID0gZG9jdW1lbnQ7XG4gICAgfVxuICAgIHZhciBkYXRhID0gZ2V0RXhwYW5kb0RhdGEob3duZXJEb2N1bWVudCk7XG5cbiAgICBpZiAoaHRtbDUuc2hpdkNTUyAmJiAhc3VwcG9ydHNIdG1sNVN0eWxlcyAmJiAhZGF0YS5oYXNDU1MpIHtcbiAgICAgIGRhdGEuaGFzQ1NTID0gISFhZGRTdHlsZVNoZWV0KG93bmVyRG9jdW1lbnQsXG4gICAgICAgIC8vIGNvcnJlY3RzIGJsb2NrIGRpc3BsYXkgbm90IGRlZmluZWQgaW4gSUU2LzcvOC85XG4gICAgICAgICdhcnRpY2xlLGFzaWRlLGRpYWxvZyxmaWdjYXB0aW9uLGZpZ3VyZSxmb290ZXIsaGVhZGVyLGhncm91cCxtYWluLG5hdixzZWN0aW9ue2Rpc3BsYXk6YmxvY2t9JyArXG4gICAgICAgIC8vIGFkZHMgc3R5bGluZyBub3QgcHJlc2VudCBpbiBJRTYvNy84LzlcbiAgICAgICAgJ21hcmt7YmFja2dyb3VuZDojRkYwO2NvbG9yOiMwMDB9JyArXG4gICAgICAgIC8vIGhpZGVzIG5vbi1yZW5kZXJlZCBlbGVtZW50c1xuICAgICAgICAndGVtcGxhdGV7ZGlzcGxheTpub25lfSdcbiAgICAgICk7XG4gICAgfVxuICAgIGlmICghc3VwcG9ydHNVbmtub3duRWxlbWVudHMpIHtcbiAgICAgIHNoaXZNZXRob2RzKG93bmVyRG9jdW1lbnQsIGRhdGEpO1xuICAgIH1cbiAgICByZXR1cm4gb3duZXJEb2N1bWVudDtcbiAgfVxuXG4gIC8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG4gIC8qKlxuICAgKiBUaGUgYGh0bWw1YCBvYmplY3QgaXMgZXhwb3NlZCBzbyB0aGF0IG1vcmUgZWxlbWVudHMgY2FuIGJlIHNoaXZlZCBhbmRcbiAgICogZXhpc3Rpbmcgc2hpdmluZyBjYW4gYmUgZGV0ZWN0ZWQgb24gaWZyYW1lcy5cbiAgICogQHR5cGUgT2JqZWN0XG4gICAqIEBleGFtcGxlXG4gICAqXG4gICAqIC8vIG9wdGlvbnMgY2FuIGJlIGNoYW5nZWQgYmVmb3JlIHRoZSBzY3JpcHQgaXMgaW5jbHVkZWRcbiAgICogaHRtbDUgPSB7ICdlbGVtZW50cyc6ICdtYXJrIHNlY3Rpb24nLCAnc2hpdkNTUyc6IGZhbHNlLCAnc2hpdk1ldGhvZHMnOiBmYWxzZSB9O1xuICAgKi9cbiAgdmFyIGh0bWw1ID0ge1xuXG4gICAgLyoqXG4gICAgICogQW4gYXJyYXkgb3Igc3BhY2Ugc2VwYXJhdGVkIHN0cmluZyBvZiBub2RlIG5hbWVzIG9mIHRoZSBlbGVtZW50cyB0byBzaGl2LlxuICAgICAqIEBtZW1iZXJPZiBodG1sNVxuICAgICAqIEB0eXBlIEFycmF5fFN0cmluZ1xuICAgICAqL1xuICAgICdlbGVtZW50cyc6IG9wdGlvbnMuZWxlbWVudHMgfHwgJ2FiYnIgYXJ0aWNsZSBhc2lkZSBhdWRpbyBiZGkgY2FudmFzIGRhdGEgZGF0YWxpc3QgZGV0YWlscyBkaWFsb2cgZmlnY2FwdGlvbiBmaWd1cmUgZm9vdGVyIGhlYWRlciBoZ3JvdXAgbWFpbiBtYXJrIG1ldGVyIG5hdiBvdXRwdXQgcGljdHVyZSBwcm9ncmVzcyBzZWN0aW9uIHN1bW1hcnkgdGVtcGxhdGUgdGltZSB2aWRlbycsXG5cbiAgICAvKipcbiAgICAgKiBjdXJyZW50IHZlcnNpb24gb2YgaHRtbDVzaGl2XG4gICAgICovXG4gICAgJ3ZlcnNpb24nOiB2ZXJzaW9uLFxuXG4gICAgLyoqXG4gICAgICogQSBmbGFnIHRvIGluZGljYXRlIHRoYXQgdGhlIEhUTUw1IHN0eWxlIHNoZWV0IHNob3VsZCBiZSBpbnNlcnRlZC5cbiAgICAgKiBAbWVtYmVyT2YgaHRtbDVcbiAgICAgKiBAdHlwZSBCb29sZWFuXG4gICAgICovXG4gICAgJ3NoaXZDU1MnOiAob3B0aW9ucy5zaGl2Q1NTICE9PSBmYWxzZSksXG5cbiAgICAvKipcbiAgICAgKiBJcyBlcXVhbCB0byB0cnVlIGlmIGEgYnJvd3NlciBzdXBwb3J0cyBjcmVhdGluZyB1bmtub3duL0hUTUw1IGVsZW1lbnRzXG4gICAgICogQG1lbWJlck9mIGh0bWw1XG4gICAgICogQHR5cGUgYm9vbGVhblxuICAgICAqL1xuICAgICdzdXBwb3J0c1Vua25vd25FbGVtZW50cyc6IHN1cHBvcnRzVW5rbm93bkVsZW1lbnRzLFxuXG4gICAgLyoqXG4gICAgICogQSBmbGFnIHRvIGluZGljYXRlIHRoYXQgdGhlIGRvY3VtZW50J3MgYGNyZWF0ZUVsZW1lbnRgIGFuZCBgY3JlYXRlRG9jdW1lbnRGcmFnbWVudGBcbiAgICAgKiBtZXRob2RzIHNob3VsZCBiZSBvdmVyd3JpdHRlbi5cbiAgICAgKiBAbWVtYmVyT2YgaHRtbDVcbiAgICAgKiBAdHlwZSBCb29sZWFuXG4gICAgICovXG4gICAgJ3NoaXZNZXRob2RzJzogKG9wdGlvbnMuc2hpdk1ldGhvZHMgIT09IGZhbHNlKSxcblxuICAgIC8qKlxuICAgICAqIEEgc3RyaW5nIHRvIGRlc2NyaWJlIHRoZSB0eXBlIG9mIGBodG1sNWAgb2JqZWN0IChcImRlZmF1bHRcIiBvciBcImRlZmF1bHQgcHJpbnRcIikuXG4gICAgICogQG1lbWJlck9mIGh0bWw1XG4gICAgICogQHR5cGUgU3RyaW5nXG4gICAgICovXG4gICAgJ3R5cGUnOiAnZGVmYXVsdCcsXG5cbiAgICAvLyBzaGl2cyB0aGUgZG9jdW1lbnQgYWNjb3JkaW5nIHRvIHRoZSBzcGVjaWZpZWQgYGh0bWw1YCBvYmplY3Qgb3B0aW9uc1xuICAgICdzaGl2RG9jdW1lbnQnOiBzaGl2RG9jdW1lbnQsXG5cbiAgICAvL2NyZWF0ZXMgYSBzaGl2ZWQgZWxlbWVudFxuICAgIGNyZWF0ZUVsZW1lbnQ6IGNyZWF0ZUVsZW1lbnQsXG5cbiAgICAvL2NyZWF0ZXMgYSBzaGl2ZWQgZG9jdW1lbnRGcmFnbWVudFxuICAgIGNyZWF0ZURvY3VtZW50RnJhZ21lbnQ6IGNyZWF0ZURvY3VtZW50RnJhZ21lbnQsXG5cbiAgICAvL2V4dGVuZHMgbGlzdCBvZiBlbGVtZW50c1xuICAgIGFkZEVsZW1lbnRzOiBhZGRFbGVtZW50c1xuICB9O1xuXG4gIC8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG4gIC8vIGV4cG9zZSBodG1sNVxuICB3aW5kb3cuaHRtbDUgPSBodG1sNTtcblxuICAvLyBzaGl2IHRoZSBkb2N1bWVudFxuICBzaGl2RG9jdW1lbnQoZG9jdW1lbnQpO1xuXG4gIGlmKHR5cGVvZiBtb2R1bGUgPT0gJ29iamVjdCcgJiYgbW9kdWxlLmV4cG9ydHMpe1xuICAgIG1vZHVsZS5leHBvcnRzID0gaHRtbDU7XG4gIH1cblxufSh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDogdGhpcywgZG9jdW1lbnQpKTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL2h0bWw1c2hpdi9kaXN0L2h0bWw1c2hpdi5qc1xuLy8gbW9kdWxlIGlkID0gLi9ub2RlX21vZHVsZXMvaHRtbDVzaGl2L2Rpc3QvaHRtbDVzaGl2LmpzXG4vLyBtb2R1bGUgY2h1bmtzID0gMSJdLCJzb3VyY2VSb290IjoiIn0=