var globalThis = this;
var global = this;
function __skpm_run (key, context) {
  globalThis.context = context;
  try {

var exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/ddSpiral.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/@skpm/promise/index.js":
/*!*********************************************!*\
  !*** ./node_modules/@skpm/promise/index.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/* from https://github.com/taylorhakes/promise-polyfill */

function promiseFinally(callback) {
  var constructor = this.constructor;
  return this.then(
    function(value) {
      return constructor.resolve(callback()).then(function() {
        return value;
      });
    },
    function(reason) {
      return constructor.resolve(callback()).then(function() {
        return constructor.reject(reason);
      });
    }
  );
}

function noop() {}

/**
 * @constructor
 * @param {Function} fn
 */
function Promise(fn) {
  if (!(this instanceof Promise))
    throw new TypeError("Promises must be constructed via new");
  if (typeof fn !== "function") throw new TypeError("not a function");
  /** @type {!number} */
  this._state = 0;
  /** @type {!boolean} */
  this._handled = false;
  /** @type {Promise|undefined} */
  this._value = undefined;
  /** @type {!Array<!Function>} */
  this._deferreds = [];

  doResolve(fn, this);
}

function handle(self, deferred) {
  while (self._state === 3) {
    self = self._value;
  }
  if (self._state === 0) {
    self._deferreds.push(deferred);
    return;
  }
  self._handled = true;
  Promise._immediateFn(function() {
    var cb = self._state === 1 ? deferred.onFulfilled : deferred.onRejected;
    if (cb === null) {
      (self._state === 1 ? resolve : reject)(deferred.promise, self._value);
      return;
    }
    var ret;
    try {
      ret = cb(self._value);
    } catch (e) {
      reject(deferred.promise, e);
      return;
    }
    resolve(deferred.promise, ret);
  });
}

function resolve(self, newValue) {
  try {
    // Promise Resolution Procedure: https://github.com/promises-aplus/promises-spec#the-promise-resolution-procedure
    if (newValue === self)
      throw new TypeError("A promise cannot be resolved with itself.");
    if (
      newValue &&
      (typeof newValue === "object" || typeof newValue === "function")
    ) {
      var then = newValue.then;
      if (newValue instanceof Promise) {
        self._state = 3;
        self._value = newValue;
        finale(self);
        return;
      } else if (typeof then === "function") {
        doResolve(then.bind(newValue), self);
        return;
      }
    }
    self._state = 1;
    self._value = newValue;
    finale(self);
  } catch (e) {
    reject(self, e);
  }
}

function reject(self, newValue) {
  self._state = 2;
  self._value = newValue;
  finale(self);
}

function finale(self) {
  if (self._state === 2 && self._deferreds.length === 0) {
    Promise._immediateFn(function() {
      if (!self._handled) {
        Promise._unhandledRejectionFn(self._value, self);
      }
    });
  }

  for (var i = 0, len = self._deferreds.length; i < len; i++) {
    handle(self, self._deferreds[i]);
  }
  self._deferreds = null;
}

/**
 * @constructor
 */
function Handler(onFulfilled, onRejected, promise) {
  this.onFulfilled = typeof onFulfilled === "function" ? onFulfilled : null;
  this.onRejected = typeof onRejected === "function" ? onRejected : null;
  this.promise = promise;
}

/**
 * Take a potentially misbehaving resolver function and make sure
 * onFulfilled and onRejected are only called once.
 *
 * Makes no guarantees about asynchrony.
 */
function doResolve(fn, self) {
  var done = false;
  try {
    fn(
      function(value) {
        if (done) {
          Promise._multipleResolvesFn("resolve", self, value);
          return;
        }
        done = true;
        resolve(self, value);
      },
      function(reason) {
        if (done) {
          Promise._multipleResolvesFn("reject", self, reason);
          return;
        }
        done = true;
        reject(self, reason);
      }
    );
  } catch (ex) {
    if (done) {
      Promise._multipleResolvesFn("reject", self, ex);
      return;
    }
    done = true;
    reject(self, ex);
  }
}

Promise.prototype["catch"] = function(onRejected) {
  return this.then(null, onRejected);
};

Promise.prototype.then = function(onFulfilled, onRejected) {
  // @ts-ignore
  var prom = new this.constructor(noop);

  handle(this, new Handler(onFulfilled, onRejected, prom));
  return prom;
};

Promise.prototype["finally"] = promiseFinally;

Promise.all = function(arr) {
  return new Promise(function(resolve, reject) {
    if (!Array.isArray(arr)) {
      return reject(new TypeError("Promise.all accepts an array"));
    }

    var args = Array.prototype.slice.call(arr);
    if (args.length === 0) return resolve([]);
    var remaining = args.length;

    function res(i, val) {
      try {
        if (val && (typeof val === "object" || typeof val === "function")) {
          var then = val.then;
          if (typeof then === "function") {
            then.call(
              val,
              function(val) {
                res(i, val);
              },
              reject
            );
            return;
          }
        }
        args[i] = val;
        if (--remaining === 0) {
          resolve(args);
        }
      } catch (ex) {
        reject(ex);
      }
    }

    for (var i = 0; i < args.length; i++) {
      res(i, args[i]);
    }
  });
};

Promise.resolve = function(value) {
  if (value && typeof value === "object" && value.constructor === Promise) {
    return value;
  }

  return new Promise(function(resolve) {
    resolve(value);
  });
};

Promise.reject = function(value) {
  return new Promise(function(resolve, reject) {
    reject(value);
  });
};

Promise.race = function(arr) {
  return new Promise(function(resolve, reject) {
    if (!Array.isArray(arr)) {
      return reject(new TypeError("Promise.race accepts an array"));
    }

    for (var i = 0, len = arr.length; i < len; i++) {
      Promise.resolve(arr[i]).then(resolve, reject);
    }
  });
};

// Use polyfill for setImmediate for performance gains
Promise._immediateFn = setImmediate;

Promise._unhandledRejectionFn = function _unhandledRejectionFn(err, promise) {
  if (
    typeof process !== "undefined" &&
    process.listenerCount &&
    (process.listenerCount("unhandledRejection") ||
      process.listenerCount("uncaughtException"))
  ) {
    process.emit("unhandledRejection", err, promise);
    process.emit("uncaughtException", err, "unhandledRejection");
  } else if (typeof console !== "undefined" && console) {
    console.warn("Possible Unhandled Promise Rejection:", err);
  }
};

Promise._multipleResolvesFn = function _multipleResolvesFn(
  type,
  promise,
  value
) {
  if (typeof process !== "undefined" && process.emit) {
    process.emit("multipleResolves", type, promise, value);
  }
};

module.exports = Promise;


/***/ }),

/***/ "./node_modules/mocha-js-delegate/index.js":
/*!*************************************************!*\
  !*** ./node_modules/mocha-js-delegate/index.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/* globals MOClassDescription, NSObject, NSSelectorFromString, NSClassFromString, MOPropertyDescription */

module.exports = function MochaDelegate(definition, superclass) {
  var uniqueClassName =
    'MochaJSDelegate_DynamicClass_' + NSUUID.UUID().UUIDString()

  var delegateClassDesc = MOClassDescription.allocateDescriptionForClassWithName_superclass_(
    uniqueClassName,
    superclass || NSObject
  )

  // Storage
  var handlers = {}
  var ivars = {}

  // Define an instance method
  function setHandlerForSelector(selectorString, func) {
    var handlerHasBeenSet = selectorString in handlers
    var selector = NSSelectorFromString(selectorString)

    handlers[selectorString] = func

    /*
      For some reason, Mocha acts weird about arguments: https://github.com/logancollins/Mocha/issues/28
      We have to basically create a dynamic handler with a likewise dynamic number of predefined arguments.
    */
    if (!handlerHasBeenSet) {
      var args = []
      var regex = /:/g
      while (regex.exec(selectorString)) {
        args.push('arg' + args.length)
      }

      // eslint-disable-next-line no-eval
      var dynamicFunction = eval(
        '(function (' +
          args.join(', ') +
          ') { return handlers[selectorString].apply(this, arguments); })'
      )

      delegateClassDesc.addInstanceMethodWithSelector_function(
        selector,
        dynamicFunction
      )
    }
  }

  // define a property
  function setIvar(key, value) {
    var ivarHasBeenSet = key in handlers

    ivars[key] = value

    if (!ivarHasBeenSet) {
      delegateClassDesc.addInstanceVariableWithName_typeEncoding(key, '@')
      var description = MOPropertyDescription.new()
      description.name = key
      description.typeEncoding = '@'
      description.weak = true
      description.ivarName = key
      delegateClassDesc.addProperty(description)
    }
  }

  this.getClass = function() {
    return NSClassFromString(uniqueClassName)
  }

  this.getClassInstance = function(instanceVariables) {
    var instance = NSClassFromString(uniqueClassName).new()
    Object.keys(ivars).forEach(function(key) {
      instance[key] = ivars[key]
    })
    Object.keys(instanceVariables || {}).forEach(function(key) {
      instance[key] = instanceVariables[key]
    })
    return instance
  }
  // alias
  this.new = this.getClassInstance

  // Convenience
  if (typeof definition === 'object') {
    Object.keys(definition).forEach(
      function(key) {
        if (typeof definition[key] === 'function') {
          setHandlerForSelector(key, definition[key])
        } else {
          setIvar(key, definition[key])
        }
      }
    )
  }

  delegateClassDesc.registerClass()
}


/***/ }),

/***/ "./node_modules/sketch-module-web-view/lib/browser-api.js":
/*!****************************************************************!*\
  !*** ./node_modules/sketch-module-web-view/lib/browser-api.js ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function parseHexColor(color) {
  // Check the string for incorrect formatting.
  if (!color || color[0] !== '#') {
    if (
      color &&
      typeof color.isKindOfClass === 'function' &&
      color.isKindOfClass(NSColor)
    ) {
      return color
    }
    throw new Error(
      'Incorrect color formating. It should be an hex color: #RRGGBBAA'
    )
  }

  // append FF if alpha channel is not specified.
  var source = color.substr(1)
  if (source.length === 3) {
    source += 'F'
  } else if (source.length === 6) {
    source += 'FF'
  }
  // Convert the string from #FFF format to #FFFFFF format.
  var hex
  if (source.length === 4) {
    for (var i = 0; i < 4; i += 1) {
      hex += source[i]
      hex += source[i]
    }
  } else if (source.length === 8) {
    hex = source
  } else {
    return NSColor.whiteColor()
  }

  var r = parseInt(hex.slice(0, 2), 16) / 255
  var g = parseInt(hex.slice(2, 4), 16) / 255
  var b = parseInt(hex.slice(4, 6), 16) / 255
  var a = parseInt(hex.slice(6, 8), 16) / 255

  return NSColor.colorWithSRGBRed_green_blue_alpha(r, g, b, a)
}

module.exports = function (browserWindow, panel, webview) {
  // keep reference to the subviews
  browserWindow._panel = panel
  browserWindow._webview = webview
  browserWindow._destroyed = false

  browserWindow.destroy = function () {
    return panel.close()
  }

  browserWindow.close = function () {
    if (panel.delegate().utils && panel.delegate().utils.parentWindow) {
      var shouldClose = true
      browserWindow.emit('close', {
        get defaultPrevented() {
          return !shouldClose
        },
        preventDefault: function () {
          shouldClose = false
        },
      })
      if (shouldClose) {
        panel.delegate().utils.parentWindow.endSheet(panel)
      }
      return
    }

    if (!browserWindow.isClosable()) {
      return
    }

    panel.performClose(null)
  }

  function focus(focused) {
    if (!browserWindow.isVisible()) {
      return
    }
    if (focused) {
      NSApplication.sharedApplication().activateIgnoringOtherApps(true)
      panel.makeKeyAndOrderFront(null)
    } else {
      panel.orderBack(null)
      NSApp.mainWindow().makeKeyAndOrderFront(null)
    }
  }

  browserWindow.focus = focus.bind(this, true)
  browserWindow.blur = focus.bind(this, false)

  browserWindow.isFocused = function () {
    return panel.isKeyWindow()
  }

  browserWindow.isDestroyed = function () {
    return browserWindow._destroyed
  }

  browserWindow.show = function () {
    // This method is supposed to put focus on window, however if the app does not
    // have focus then "makeKeyAndOrderFront" will only show the window.
    NSApp.activateIgnoringOtherApps(true)

    if (panel.delegate().utils && panel.delegate().utils.parentWindow) {
      return panel.delegate().utils.parentWindow.beginSheet_completionHandler(
        panel,
        __mocha__.createBlock_function('v16@?0q8', function () {
          browserWindow.emit('closed')
        })
      )
    }

    return panel.makeKeyAndOrderFront(null)
  }

  browserWindow.showInactive = function () {
    return panel.orderFrontRegardless()
  }

  browserWindow.hide = function () {
    return panel.orderOut(null)
  }

  browserWindow.isVisible = function () {
    return panel.isVisible()
  }

  browserWindow.isModal = function () {
    return false
  }

  browserWindow.maximize = function () {
    if (!browserWindow.isMaximized()) {
      panel.zoom(null)
    }
  }
  browserWindow.unmaximize = function () {
    if (browserWindow.isMaximized()) {
      panel.zoom(null)
    }
  }

  browserWindow.isMaximized = function () {
    if ((panel.styleMask() & NSResizableWindowMask) !== 0) {
      return panel.isZoomed()
    }
    var rectScreen = NSScreen.mainScreen().visibleFrame()
    var rectWindow = panel.frame()
    return (
      rectScreen.origin.x == rectWindow.origin.x &&
      rectScreen.origin.y == rectWindow.origin.y &&
      rectScreen.size.width == rectWindow.size.width &&
      rectScreen.size.height == rectWindow.size.height
    )
  }

  browserWindow.minimize = function () {
    return panel.miniaturize(null)
  }

  browserWindow.restore = function () {
    return panel.deminiaturize(null)
  }

  browserWindow.isMinimized = function () {
    return panel.isMiniaturized()
  }

  browserWindow.setFullScreen = function (fullscreen) {
    if (fullscreen !== browserWindow.isFullscreen()) {
      panel.toggleFullScreen(null)
    }
  }

  browserWindow.isFullscreen = function () {
    return panel.styleMask() & NSFullScreenWindowMask
  }

  browserWindow.setAspectRatio = function (aspectRatio /* , extraSize */) {
    // Reset the behaviour to default if aspect_ratio is set to 0 or less.
    if (aspectRatio > 0.0) {
      panel.setAspectRatio(NSMakeSize(aspectRatio, 1.0))
    } else {
      panel.setResizeIncrements(NSMakeSize(1.0, 1.0))
    }
  }

  browserWindow.setBounds = function (bounds, animate) {
    if (!bounds) {
      return
    }

    // Do nothing if in fullscreen mode.
    if (browserWindow.isFullscreen()) {
      return
    }

    const newBounds = Object.assign(browserWindow.getBounds(), bounds)

    // TODO: Check size constraints since setFrame does not check it.
    // var size = bounds.size
    // size.SetToMax(GetMinimumSize());
    // gfx::Size max_size = GetMaximumSize();
    // if (!max_size.IsEmpty())
    //   size.SetToMin(max_size);

    var cocoaBounds = NSMakeRect(
      newBounds.x,
      0,
      newBounds.width,
      newBounds.height
    )
    // Flip Y coordinates based on the primary screen
    var screen = NSScreen.screens().firstObject()
    cocoaBounds.origin.y = NSHeight(screen.frame()) - newBounds.y

    panel.setFrame_display_animate(cocoaBounds, true, animate)
  }

  browserWindow.getBounds = function () {
    const cocoaBounds = panel.frame()
    var mainScreenRect = NSScreen.screens().firstObject().frame()
    return {
      x: cocoaBounds.origin.x,
      y: Math.round(NSHeight(mainScreenRect) - cocoaBounds.origin.y),
      width: cocoaBounds.size.width,
      height: cocoaBounds.size.height,
    }
  }

  browserWindow.setContentBounds = function (bounds, animate) {
    // TODO:
    browserWindow.setBounds(bounds, animate)
  }

  browserWindow.getContentBounds = function () {
    // TODO:
    return browserWindow.getBounds()
  }

  browserWindow.setSize = function (width, height, animate) {
    // TODO: handle resizing around center
    return browserWindow.setBounds({ width: width, height: height }, animate)
  }

  browserWindow.getSize = function () {
    var bounds = browserWindow.getBounds()
    return [bounds.width, bounds.height]
  }

  browserWindow.setContentSize = function (width, height, animate) {
    // TODO: handle resizing around center
    return browserWindow.setContentBounds(
      { width: width, height: height },
      animate
    )
  }

  browserWindow.getContentSize = function () {
    var bounds = browserWindow.getContentBounds()
    return [bounds.width, bounds.height]
  }

  browserWindow.setMinimumSize = function (width, height) {
    const minSize = CGSizeMake(width, height)
    panel.setContentMinSize(minSize)
  }

  browserWindow.getMinimumSize = function () {
    const size = panel.contentMinSize()
    return [size.width, size.height]
  }

  browserWindow.setMaximumSize = function (width, height) {
    const maxSize = CGSizeMake(width, height)
    panel.setContentMaxSize(maxSize)
  }

  browserWindow.getMaximumSize = function () {
    const size = panel.contentMaxSize()
    return [size.width, size.height]
  }

  browserWindow.setResizable = function (resizable) {
    return browserWindow._setStyleMask(resizable, NSResizableWindowMask)
  }

  browserWindow.isResizable = function () {
    return panel.styleMask() & NSResizableWindowMask
  }

  browserWindow.setMovable = function (movable) {
    return panel.setMovable(movable)
  }
  browserWindow.isMovable = function () {
    return panel.isMovable()
  }

  browserWindow.setMinimizable = function (minimizable) {
    return browserWindow._setStyleMask(minimizable, NSMiniaturizableWindowMask)
  }

  browserWindow.isMinimizable = function () {
    return panel.styleMask() & NSMiniaturizableWindowMask
  }

  browserWindow.setMaximizable = function (maximizable) {
    if (panel.standardWindowButton(NSWindowZoomButton)) {
      panel.standardWindowButton(NSWindowZoomButton).setEnabled(maximizable)
    }
  }

  browserWindow.isMaximizable = function () {
    return (
      panel.standardWindowButton(NSWindowZoomButton) &&
      panel.standardWindowButton(NSWindowZoomButton).isEnabled()
    )
  }

  browserWindow.setFullScreenable = function (fullscreenable) {
    browserWindow._setCollectionBehavior(
      fullscreenable,
      NSWindowCollectionBehaviorFullScreenPrimary
    )
    // On EL Capitan this flag is required to hide fullscreen button.
    browserWindow._setCollectionBehavior(
      !fullscreenable,
      NSWindowCollectionBehaviorFullScreenAuxiliary
    )
  }

  browserWindow.isFullScreenable = function () {
    var collectionBehavior = panel.collectionBehavior()
    return collectionBehavior & NSWindowCollectionBehaviorFullScreenPrimary
  }

  browserWindow.setClosable = function (closable) {
    browserWindow._setStyleMask(closable, NSClosableWindowMask)
  }

  browserWindow.isClosable = function () {
    return panel.styleMask() & NSClosableWindowMask
  }

  browserWindow.setAlwaysOnTop = function (top, level, relativeLevel) {
    var windowLevel = NSNormalWindowLevel
    var maxWindowLevel = CGWindowLevelForKey(kCGMaximumWindowLevelKey)
    var minWindowLevel = CGWindowLevelForKey(kCGMinimumWindowLevelKey)

    if (top) {
      if (level === 'normal') {
        windowLevel = NSNormalWindowLevel
      } else if (level === 'torn-off-menu') {
        windowLevel = NSTornOffMenuWindowLevel
      } else if (level === 'modal-panel') {
        windowLevel = NSModalPanelWindowLevel
      } else if (level === 'main-menu') {
        windowLevel = NSMainMenuWindowLevel
      } else if (level === 'status') {
        windowLevel = NSStatusWindowLevel
      } else if (level === 'pop-up-menu') {
        windowLevel = NSPopUpMenuWindowLevel
      } else if (level === 'screen-saver') {
        windowLevel = NSScreenSaverWindowLevel
      } else if (level === 'dock') {
        // Deprecated by macOS, but kept for backwards compatibility
        windowLevel = NSDockWindowLevel
      } else {
        windowLevel = NSFloatingWindowLevel
      }
    }

    var newLevel = windowLevel + (relativeLevel || 0)
    if (newLevel >= minWindowLevel && newLevel <= maxWindowLevel) {
      panel.setLevel(newLevel)
    } else {
      throw new Error(
        'relativeLevel must be between ' +
          minWindowLevel +
          ' and ' +
          maxWindowLevel
      )
    }
  }

  browserWindow.isAlwaysOnTop = function () {
    return panel.level() !== NSNormalWindowLevel
  }

  browserWindow.moveTop = function () {
    return panel.orderFrontRegardless()
  }

  browserWindow.center = function () {
    panel.center()
  }

  browserWindow.setPosition = function (x, y, animate) {
    return browserWindow.setBounds({ x: x, y: y }, animate)
  }

  browserWindow.getPosition = function () {
    var bounds = browserWindow.getBounds()
    return [bounds.x, bounds.y]
  }

  browserWindow.setTitle = function (title) {
    panel.setTitle(title)
  }

  browserWindow.getTitle = function () {
    return String(panel.title())
  }

  var attentionRequestId = 0
  browserWindow.flashFrame = function (flash) {
    if (flash) {
      attentionRequestId = NSApp.requestUserAttention(NSInformationalRequest)
    } else {
      NSApp.cancelUserAttentionRequest(attentionRequestId)
      attentionRequestId = 0
    }
  }

  browserWindow.getNativeWindowHandle = function () {
    return panel
  }

  browserWindow.getNativeWebViewHandle = function () {
    return webview
  }

  browserWindow.loadURL = function (url) {
    // When frameLocation is a file, prefix it with the Sketch Resources path
    if (/^(?!https?|file).*\.html?$/.test(url)) {
      if (typeof __command !== 'undefined' && __command.pluginBundle()) {
        url =
          'file://' + __command.pluginBundle().urlForResourceNamed(url).path()
      }
    }

    if (/^file:\/\/.*\.html?$/.test(url)) {
      // ensure URLs containing spaces are properly handled
      url = NSString.alloc().initWithString(url)
      url = url.stringByAddingPercentEncodingWithAllowedCharacters(
        NSCharacterSet.URLQueryAllowedCharacterSet()
      )
      webview.loadFileURL_allowingReadAccessToURL(
        NSURL.URLWithString(url),
        NSURL.URLWithString('file:///')
      )
      return
    }

    const properURL = NSURL.URLWithString(url)
    const urlRequest = NSURLRequest.requestWithURL(properURL)

    webview.loadRequest(urlRequest)
  }

  browserWindow.reload = function () {
    webview.reload()
  }

  browserWindow.setHasShadow = function (hasShadow) {
    return panel.setHasShadow(hasShadow)
  }

  browserWindow.hasShadow = function () {
    return panel.hasShadow()
  }

  browserWindow.setOpacity = function (opacity) {
    return panel.setAlphaValue(opacity)
  }

  browserWindow.getOpacity = function () {
    return panel.alphaValue()
  }

  browserWindow.setVisibleOnAllWorkspaces = function (visible) {
    return browserWindow._setCollectionBehavior(
      visible,
      NSWindowCollectionBehaviorCanJoinAllSpaces
    )
  }

  browserWindow.isVisibleOnAllWorkspaces = function () {
    var collectionBehavior = panel.collectionBehavior()
    return collectionBehavior & NSWindowCollectionBehaviorCanJoinAllSpaces
  }

  browserWindow.setIgnoreMouseEvents = function (ignore) {
    return panel.setIgnoresMouseEvents(ignore)
  }

  browserWindow.setContentProtection = function (enable) {
    panel.setSharingType(enable ? NSWindowSharingNone : NSWindowSharingReadOnly)
  }

  browserWindow.setAutoHideCursor = function (autoHide) {
    panel.setDisableAutoHideCursor(autoHide)
  }

  browserWindow.setVibrancy = function (type) {
    var effectView = browserWindow._vibrantView

    if (!type) {
      if (effectView == null) {
        return
      }

      effectView.removeFromSuperview()
      panel.setVibrantView(null)
      return
    }

    if (effectView == null) {
      var contentView = panel.contentView()
      effectView = NSVisualEffectView.alloc().initWithFrame(
        contentView.bounds()
      )
      browserWindow._vibrantView = effectView

      effectView.setAutoresizingMask(NSViewWidthSizable | NSViewHeightSizable)
      effectView.setBlendingMode(NSVisualEffectBlendingModeBehindWindow)
      effectView.setState(NSVisualEffectStateActive)
      effectView.setFrame(contentView.bounds())
      contentView.addSubview_positioned_relativeTo(
        effectView,
        NSWindowBelow,
        null
      )
    }

    var vibrancyType = NSVisualEffectMaterialLight

    if (type === 'appearance-based') {
      vibrancyType = NSVisualEffectMaterialAppearanceBased
    } else if (type === 'light') {
      vibrancyType = NSVisualEffectMaterialLight
    } else if (type === 'dark') {
      vibrancyType = NSVisualEffectMaterialDark
    } else if (type === 'titlebar') {
      vibrancyType = NSVisualEffectMaterialTitlebar
    } else if (type === 'selection') {
      vibrancyType = NSVisualEffectMaterialSelection
    } else if (type === 'menu') {
      vibrancyType = NSVisualEffectMaterialMenu
    } else if (type === 'popover') {
      vibrancyType = NSVisualEffectMaterialPopover
    } else if (type === 'sidebar') {
      vibrancyType = NSVisualEffectMaterialSidebar
    } else if (type === 'medium-light') {
      vibrancyType = NSVisualEffectMaterialMediumLight
    } else if (type === 'ultra-dark') {
      vibrancyType = NSVisualEffectMaterialUltraDark
    }

    effectView.setMaterial(vibrancyType)
  }

  browserWindow._setBackgroundColor = function (colorName) {
    var color = parseHexColor(colorName)
    webview.setValue_forKey(false, 'drawsBackground')
    panel.backgroundColor = color
  }

  browserWindow._invalidate = function () {
    panel.flushWindow()
    panel.contentView().setNeedsDisplay(true)
  }

  browserWindow._setStyleMask = function (on, flag) {
    var wasMaximizable = browserWindow.isMaximizable()
    if (on) {
      panel.setStyleMask(panel.styleMask() | flag)
    } else {
      panel.setStyleMask(panel.styleMask() & ~flag)
    }
    // Change style mask will make the zoom button revert to default, probably
    // a bug of Cocoa or macOS.
    browserWindow.setMaximizable(wasMaximizable)
  }

  browserWindow._setCollectionBehavior = function (on, flag) {
    var wasMaximizable = browserWindow.isMaximizable()
    if (on) {
      panel.setCollectionBehavior(panel.collectionBehavior() | flag)
    } else {
      panel.setCollectionBehavior(panel.collectionBehavior() & ~flag)
    }
    // Change collectionBehavior will make the zoom button revert to default,
    // probably a bug of Cocoa or macOS.
    browserWindow.setMaximizable(wasMaximizable)
  }

  browserWindow._showWindowButton = function (button) {
    var view = panel.standardWindowButton(button)
    view.superview().addSubview_positioned_relative(view, NSWindowAbove, null)
  }
}


/***/ }),

/***/ "./node_modules/sketch-module-web-view/lib/constants.js":
/*!**************************************************************!*\
  !*** ./node_modules/sketch-module-web-view/lib/constants.js ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {
  JS_BRIDGE: '__skpm_sketchBridge',
  JS_BRIDGE_RESULT_SUCCESS: '__skpm_sketchBridge_success',
  JS_BRIDGE_RESULT_ERROR: '__skpm_sketchBridge_error',
  START_MOVING_WINDOW: '__skpm_startMovingWindow',
  EXECUTE_JAVASCRIPT: '__skpm_executeJS',
  EXECUTE_JAVASCRIPT_SUCCESS: '__skpm_executeJS_success_',
  EXECUTE_JAVASCRIPT_ERROR: '__skpm_executeJS_error_',
}


/***/ }),

/***/ "./node_modules/sketch-module-web-view/lib/dispatch-first-click.js":
/*!*************************************************************************!*\
  !*** ./node_modules/sketch-module-web-view/lib/dispatch-first-click.js ***!
  \*************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

var tagsToFocus =
  '["text", "textarea", "date", "datetime-local", "email", "number", "month", "password", "search", "tel", "time", "url", "week" ]'

module.exports = function (webView, event) {
  var point = webView.convertPoint_fromView(event.locationInWindow(), null)
  return (
    'var el = document.elementFromPoint(' + // get the DOM element that match the event
    point.x +
    ', ' +
    point.y +
    '); ' +
    'if (el && el.tagName === "SELECT") {' + // select needs special handling
    '  var event = document.createEvent("MouseEvents");' +
    '  event.initMouseEvent("mousedown", true, true, window);' +
    '  el.dispatchEvent(event);' +
    '} else if (el && ' + // some tags need to be focused instead of clicked
    tagsToFocus +
    '.indexOf(el.type) >= 0 && ' +
    'el.focus' +
    ') {' +
    'el.focus();' + // so focus them
    '} else if (el) {' +
    'el.dispatchEvent(new Event("click", {bubbles: true}))' + // click the others
    '}'
  )
}


/***/ }),

/***/ "./node_modules/sketch-module-web-view/lib/execute-javascript.js":
/*!***********************************************************************!*\
  !*** ./node_modules/sketch-module-web-view/lib/execute-javascript.js ***!
  \***********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(Promise) {var CONSTANTS = __webpack_require__(/*! ./constants */ "./node_modules/sketch-module-web-view/lib/constants.js")

module.exports = function (webview, browserWindow) {
  function executeJavaScript(script, userGesture, callback) {
    if (typeof userGesture === 'function') {
      callback = userGesture
      userGesture = false
    }
    var fiber = coscript.createFiber()

    // if the webview is not ready yet, defer the execution until it is
    if (
      webview.navigationDelegate().state &&
      webview.navigationDelegate().state.wasReady == 0
    ) {
      return new Promise(function (resolve, reject) {
        browserWindow.once('ready-to-show', function () {
          executeJavaScript(script, userGesture, callback)
            .then(resolve)
            .catch(reject)
          fiber.cleanup()
        })
      })
    }

    return new Promise(function (resolve, reject) {
      var requestId = Math.random()

      browserWindow.webContents.on(
        CONSTANTS.EXECUTE_JAVASCRIPT_SUCCESS + requestId,
        function (res) {
          try {
            if (callback) {
              callback(null, res)
            }
            resolve(res)
          } catch (err) {
            reject(err)
          }
          fiber.cleanup()
        }
      )
      browserWindow.webContents.on(
        CONSTANTS.EXECUTE_JAVASCRIPT_ERROR + requestId,
        function (err) {
          try {
            if (callback) {
              callback(err)
              resolve()
            } else {
              reject(err)
            }
          } catch (err2) {
            reject(err2)
          }
          fiber.cleanup()
        }
      )

      webview.evaluateJavaScript_completionHandler(
        module.exports.wrapScript(script, requestId),
        null
      )
    })
  }

  return executeJavaScript
}

module.exports.wrapScript = function (script, requestId) {
  return (
    'window.' +
    CONSTANTS.EXECUTE_JAVASCRIPT +
    '(' +
    requestId +
    ', ' +
    JSON.stringify(script) +
    ')'
  )
}

module.exports.injectScript = function (webView) {
  var source =
    'window.' +
    CONSTANTS.EXECUTE_JAVASCRIPT +
    ' = function(id, script) {' +
    '  try {' +
    '    var res = eval(script);' +
    '    if (res && typeof res.then === "function" && typeof res.catch === "function") {' +
    '      res.then(function (res2) {' +
    '        window.postMessage("' +
    CONSTANTS.EXECUTE_JAVASCRIPT_SUCCESS +
    '" + id, res2);' +
    '      })' +
    '      .catch(function (err) {' +
    '        window.postMessage("' +
    CONSTANTS.EXECUTE_JAVASCRIPT_ERROR +
    '" + id, err);' +
    '      })' +
    '    } else {' +
    '      window.postMessage("' +
    CONSTANTS.EXECUTE_JAVASCRIPT_SUCCESS +
    '" + id, res);' +
    '    }' +
    '  } catch (err) {' +
    '    window.postMessage("' +
    CONSTANTS.EXECUTE_JAVASCRIPT_ERROR +
    '" + id, err);' +
    '  }' +
    '}'
  var script = WKUserScript.alloc().initWithSource_injectionTime_forMainFrameOnly(
    source,
    0,
    true
  )
  webView.configuration().userContentController().addUserScript(script)
}

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@skpm/promise/index.js */ "./node_modules/@skpm/promise/index.js")))

/***/ }),

/***/ "./node_modules/sketch-module-web-view/lib/fitSubview.js":
/*!***************************************************************!*\
  !*** ./node_modules/sketch-module-web-view/lib/fitSubview.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function addEdgeConstraint(edge, subview, view, constant) {
  view.addConstraint(
    NSLayoutConstraint.constraintWithItem_attribute_relatedBy_toItem_attribute_multiplier_constant(
      subview,
      edge,
      NSLayoutRelationEqual,
      view,
      edge,
      1,
      constant
    )
  )
}
module.exports = function fitSubviewToView(subview, view, constants) {
  constants = constants || []
  subview.setTranslatesAutoresizingMaskIntoConstraints(false)

  addEdgeConstraint(NSLayoutAttributeLeft, subview, view, constants[0] || 0)
  addEdgeConstraint(NSLayoutAttributeTop, subview, view, constants[1] || 0)
  addEdgeConstraint(NSLayoutAttributeRight, subview, view, constants[2] || 0)
  addEdgeConstraint(NSLayoutAttributeBottom, subview, view, constants[3] || 0)
}


/***/ }),

/***/ "./node_modules/sketch-module-web-view/lib/index.js":
/*!**********************************************************!*\
  !*** ./node_modules/sketch-module-web-view/lib/index.js ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* let's try to match the API from Electron's Browser window
(https://github.com/electron/electron/blob/master/docs/api/browser-window.md) */
var EventEmitter = __webpack_require__(/*! events */ "events")
var buildBrowserAPI = __webpack_require__(/*! ./browser-api */ "./node_modules/sketch-module-web-view/lib/browser-api.js")
var buildWebAPI = __webpack_require__(/*! ./webview-api */ "./node_modules/sketch-module-web-view/lib/webview-api.js")
var fitSubviewToView = __webpack_require__(/*! ./fitSubview */ "./node_modules/sketch-module-web-view/lib/fitSubview.js")
var dispatchFirstClick = __webpack_require__(/*! ./dispatch-first-click */ "./node_modules/sketch-module-web-view/lib/dispatch-first-click.js")
var injectClientMessaging = __webpack_require__(/*! ./inject-client-messaging */ "./node_modules/sketch-module-web-view/lib/inject-client-messaging.js")
var movableArea = __webpack_require__(/*! ./movable-area */ "./node_modules/sketch-module-web-view/lib/movable-area.js")
var executeJavaScript = __webpack_require__(/*! ./execute-javascript */ "./node_modules/sketch-module-web-view/lib/execute-javascript.js")
var setDelegates = __webpack_require__(/*! ./set-delegates */ "./node_modules/sketch-module-web-view/lib/set-delegates.js")

function BrowserWindow(options) {
  options = options || {}

  var identifier = options.identifier || String(NSUUID.UUID().UUIDString())
  var threadDictionary = NSThread.mainThread().threadDictionary()

  var existingBrowserWindow = BrowserWindow.fromId(identifier)

  // if we already have a window opened, reuse it
  if (existingBrowserWindow) {
    return existingBrowserWindow
  }

  var browserWindow = new EventEmitter()
  browserWindow.id = identifier

  if (options.modal && !options.parent) {
    throw new Error('A modal needs to have a parent.')
  }

  // Long-running script
  var fiber = coscript.createFiber()

  // Window size
  var width = options.width || 800
  var height = options.height || 600
  var mainScreenRect = NSScreen.screens().firstObject().frame()
  var cocoaBounds = NSMakeRect(
    typeof options.x !== 'undefined'
      ? options.x
      : Math.round((NSWidth(mainScreenRect) - width) / 2),
    typeof options.y !== 'undefined'
      ? NSHeight(mainScreenRect) - options.y
      : Math.round((NSHeight(mainScreenRect) - height) / 2),
    width,
    height
  )

  if (options.titleBarStyle && options.titleBarStyle !== 'default') {
    options.frame = false
  }

  var useStandardWindow = options.windowType !== 'textured'
  var styleMask = NSTitledWindowMask

  // this is commented out because the toolbar doesn't appear otherwise :thinking-face:
  // if (!useStandardWindow || options.frame === false) {
  //   styleMask = NSFullSizeContentViewWindowMask
  // }
  if (options.minimizable !== false) {
    styleMask |= NSMiniaturizableWindowMask
  }
  if (options.closable !== false) {
    styleMask |= NSClosableWindowMask
  }
  if (options.resizable !== false) {
    styleMask |= NSResizableWindowMask
  }
  if (!useStandardWindow || options.transparent || options.frame === false) {
    styleMask |= NSTexturedBackgroundWindowMask
  }

  var panel = NSPanel.alloc().initWithContentRect_styleMask_backing_defer(
    cocoaBounds,
    styleMask,
    NSBackingStoreBuffered,
    true
  )

  // this would be nice but it's crashing on macOS 11.0
  // panel.releasedWhenClosed = true

  var wkwebviewConfig = WKWebViewConfiguration.alloc().init()
  var webView = WKWebView.alloc().initWithFrame_configuration(
    CGRectMake(0, 0, options.width || 800, options.height || 600),
    wkwebviewConfig
  )
  injectClientMessaging(webView)
  webView.setAutoresizingMask(NSViewWidthSizable | NSViewHeightSizable)

  buildBrowserAPI(browserWindow, panel, webView)
  buildWebAPI(browserWindow, panel, webView)
  setDelegates(browserWindow, panel, webView, options)

  if (options.windowType === 'desktop') {
    panel.setLevel(kCGDesktopWindowLevel - 1)
    // panel.setCanBecomeKeyWindow(false)
    panel.setCollectionBehavior(
      NSWindowCollectionBehaviorCanJoinAllSpaces |
        NSWindowCollectionBehaviorStationary |
        NSWindowCollectionBehaviorIgnoresCycle
    )
  }

  if (
    typeof options.minWidth !== 'undefined' ||
    typeof options.minHeight !== 'undefined'
  ) {
    browserWindow.setMinimumSize(options.minWidth || 0, options.minHeight || 0)
  }

  if (
    typeof options.maxWidth !== 'undefined' ||
    typeof options.maxHeight !== 'undefined'
  ) {
    browserWindow.setMaximumSize(
      options.maxWidth || 10000,
      options.maxHeight || 10000
    )
  }

  // if (options.focusable === false) {
  //   panel.setCanBecomeKeyWindow(false)
  // }

  if (options.transparent || options.frame === false) {
    panel.titlebarAppearsTransparent = true
    panel.titleVisibility = NSWindowTitleHidden
    panel.setOpaque(0)
    panel.isMovableByWindowBackground = true
    var toolbar2 = NSToolbar.alloc().initWithIdentifier(
      'titlebarStylingToolbar'
    )
    toolbar2.setShowsBaselineSeparator(false)
    panel.setToolbar(toolbar2)
  }

  if (options.titleBarStyle === 'hiddenInset') {
    var toolbar = NSToolbar.alloc().initWithIdentifier('titlebarStylingToolbar')
    toolbar.setShowsBaselineSeparator(false)
    panel.setToolbar(toolbar)
  }

  if (options.frame === false || !options.useContentSize) {
    browserWindow.setSize(width, height)
  }

  if (options.center) {
    browserWindow.center()
  }

  if (options.alwaysOnTop) {
    browserWindow.setAlwaysOnTop(true)
  }

  if (options.fullscreen) {
    browserWindow.setFullScreen(true)
  }
  browserWindow.setFullScreenable(!!options.fullscreenable)

  let title = options.title
  if (options.frame === false) {
    title = undefined
  } else if (
    typeof title === 'undefined' &&
    typeof __command !== 'undefined' &&
    __command.pluginBundle()
  ) {
    title = __command.pluginBundle().name()
  }

  if (title) {
    browserWindow.setTitle(title)
  }

  var backgroundColor = options.backgroundColor
  if (options.transparent) {
    backgroundColor = NSColor.clearColor()
  }
  if (!backgroundColor && options.frame === false && options.vibrancy) {
    backgroundColor = NSColor.clearColor()
  }

  browserWindow._setBackgroundColor(
    backgroundColor || NSColor.windowBackgroundColor()
  )

  if (options.hasShadow === false) {
    browserWindow.setHasShadow(false)
  }

  if (typeof options.opacity !== 'undefined') {
    browserWindow.setOpacity(options.opacity)
  }

  options.webPreferences = options.webPreferences || {}

  webView
    .configuration()
    .preferences()
    .setValue_forKey(
      options.webPreferences.devTools !== false,
      'developerExtrasEnabled'
    )
  webView
    .configuration()
    .preferences()
    .setValue_forKey(
      options.webPreferences.javascript !== false,
      'javaScriptEnabled'
    )
  webView
    .configuration()
    .preferences()
    .setValue_forKey(!!options.webPreferences.plugins, 'plugInsEnabled')
  webView
    .configuration()
    .preferences()
    .setValue_forKey(
      options.webPreferences.minimumFontSize || 0,
      'minimumFontSize'
    )

  if (options.webPreferences.zoomFactor) {
    webView.setMagnification(options.webPreferences.zoomFactor)
  }

  var contentView = panel.contentView()

  if (options.frame !== false) {
    webView.setFrame(contentView.bounds())
    contentView.addSubview(webView)
  } else {
    // In OSX 10.10, adding subviews to the root view for the NSView hierarchy
    // produces warnings. To eliminate the warnings, we resize the contentView
    // to fill the window, and add subviews to that.
    // http://crbug.com/380412
    contentView.setAutoresizingMask(NSViewWidthSizable | NSViewHeightSizable)
    fitSubviewToView(contentView, contentView.superview())

    webView.setFrame(contentView.bounds())
    contentView.addSubview(webView)

    // The fullscreen button should always be hidden for frameless window.
    if (panel.standardWindowButton(NSWindowFullScreenButton)) {
      panel.standardWindowButton(NSWindowFullScreenButton).setHidden(true)
    }

    if (!options.titleBarStyle || options.titleBarStyle === 'default') {
      // Hide the window buttons.
      panel.standardWindowButton(NSWindowZoomButton).setHidden(true)
      panel.standardWindowButton(NSWindowMiniaturizeButton).setHidden(true)
      panel.standardWindowButton(NSWindowCloseButton).setHidden(true)

      // Some third-party macOS utilities check the zoom button's enabled state to
      // determine whether to show custom UI on hover, so we disable it here to
      // prevent them from doing so in a frameless app window.
      panel.standardWindowButton(NSWindowZoomButton).setEnabled(false)
    }
  }

  if (options.vibrancy) {
    browserWindow.setVibrancy(options.vibrancy)
  }

  // Set maximizable state last to ensure zoom button does not get reset
  // by calls to other APIs.
  browserWindow.setMaximizable(options.maximizable !== false)

  panel.setHidesOnDeactivate(options.hidesOnDeactivate !== false)

  if (options.remembersWindowFrame) {
    panel.setFrameAutosaveName(identifier)
    panel.setFrameUsingName_force(panel.frameAutosaveName(), false)
  }

  if (options.acceptsFirstMouse) {
    browserWindow.on('focus', function (event) {
      if (event.type() === NSEventTypeLeftMouseDown) {
        browserWindow.webContents
          .executeJavaScript(dispatchFirstClick(webView, event))
          .catch(() => {})
      }
    })
  }

  executeJavaScript.injectScript(webView)
  movableArea.injectScript(webView)
  movableArea.setupHandler(browserWindow)

  if (options.show !== false) {
    browserWindow.show()
  }

  browserWindow.on('closed', function () {
    browserWindow._destroyed = true
    threadDictionary.removeObjectForKey(identifier)
    var observer = threadDictionary[identifier + '.themeObserver']
    if (observer) {
      NSApplication.sharedApplication().removeObserver_forKeyPath(
        observer,
        'effectiveAppearance'
      )
      threadDictionary.removeObjectForKey(identifier + '.themeObserver')
    }
    fiber.cleanup()
  })

  threadDictionary[identifier] = panel

  fiber.onCleanup(function () {
    if (!browserWindow._destroyed) {
      browserWindow.destroy()
    }
  })

  return browserWindow
}

BrowserWindow.fromId = function (identifier) {
  var threadDictionary = NSThread.mainThread().threadDictionary()

  if (threadDictionary[identifier]) {
    return BrowserWindow.fromPanel(threadDictionary[identifier], identifier)
  }

  return undefined
}

BrowserWindow.fromPanel = function (panel, identifier) {
  var browserWindow = new EventEmitter()
  browserWindow.id = identifier

  if (!panel || !panel.contentView) {
    throw new Error('needs to pass an NSPanel')
  }

  var webView = null
  var subviews = panel.contentView().subviews()
  for (var i = 0; i < subviews.length; i += 1) {
    if (
      !webView &&
      !subviews[i].isKindOfClass(WKInspectorWKWebView) &&
      subviews[i].isKindOfClass(WKWebView)
    ) {
      webView = subviews[i]
    }
  }

  if (!webView) {
    throw new Error('The panel needs to have a webview')
  }

  buildBrowserAPI(browserWindow, panel, webView)
  buildWebAPI(browserWindow, panel, webView)

  return browserWindow
}

module.exports = BrowserWindow


/***/ }),

/***/ "./node_modules/sketch-module-web-view/lib/inject-client-messaging.js":
/*!****************************************************************************!*\
  !*** ./node_modules/sketch-module-web-view/lib/inject-client-messaging.js ***!
  \****************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var CONSTANTS = __webpack_require__(/*! ./constants */ "./node_modules/sketch-module-web-view/lib/constants.js")

module.exports = function (webView) {
  var source =
    'window.originalPostMessage = window.postMessage;' +
    'window.postMessage = function(actionName) {' +
    '  if (!actionName) {' +
    "    throw new Error('missing action name')" +
    '  }' +
    '  var id = String(Math.random()).replace(".", "");' +
    '    var args = [].slice.call(arguments);' +
    '    args.unshift(id);' +
    '  return new Promise(function (resolve, reject) {' +
    '    window["' +
    CONSTANTS.JS_BRIDGE_RESULT_SUCCESS +
    '" + id] = resolve;' +
    '    window["' +
    CONSTANTS.JS_BRIDGE_RESULT_ERROR +
    '" + id] = reject;' +
    '    window.webkit.messageHandlers.' +
    CONSTANTS.JS_BRIDGE +
    '.postMessage(JSON.stringify(args));' +
    '  });' +
    '}'
  var script = WKUserScript.alloc().initWithSource_injectionTime_forMainFrameOnly(
    source,
    0,
    true
  )
  webView.configuration().userContentController().addUserScript(script)
}


/***/ }),

/***/ "./node_modules/sketch-module-web-view/lib/movable-area.js":
/*!*****************************************************************!*\
  !*** ./node_modules/sketch-module-web-view/lib/movable-area.js ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var CONSTANTS = __webpack_require__(/*! ./constants */ "./node_modules/sketch-module-web-view/lib/constants.js")

module.exports.injectScript = function (webView) {
  var source =
    '(function () {' +
    "document.addEventListener('mousedown', onMouseDown);" +
    '' +
    'function shouldDrag(target) {' +
    '  if (!target || (target.dataset || {}).appRegion === "no-drag") { return false }' +
    '  if ((target.dataset || {}).appRegion === "drag") { return true }' +
    '  return shouldDrag(target.parentElement)' +
    '};' +
    '' +
    'function onMouseDown(e) {' +
    '  if (e.button !== 0 || !shouldDrag(e.target)) { return }' +
    '  window.postMessage("' +
    CONSTANTS.START_MOVING_WINDOW +
    '");' +
    '};' +
    '})()'
  var script = WKUserScript.alloc().initWithSource_injectionTime_forMainFrameOnly(
    source,
    0,
    true
  )
  webView.configuration().userContentController().addUserScript(script)
}

module.exports.setupHandler = function (browserWindow) {
  var initialMouseLocation = null
  var initialWindowPosition = null
  var interval = null

  function moveWindow() {
    // if the user released the button, stop moving the window
    if (!initialWindowPosition || NSEvent.pressedMouseButtons() !== 1) {
      clearInterval(interval)
      initialMouseLocation = null
      initialWindowPosition = null
      return
    }

    var mouse = NSEvent.mouseLocation()
    browserWindow.setPosition(
      initialWindowPosition.x + (mouse.x - initialMouseLocation.x),
      initialWindowPosition.y + (initialMouseLocation.y - mouse.y), // y is inverted
      false
    )
  }

  browserWindow.webContents.on(CONSTANTS.START_MOVING_WINDOW, function () {
    initialMouseLocation = NSEvent.mouseLocation()
    var position = browserWindow.getPosition()
    initialWindowPosition = {
      x: position[0],
      y: position[1],
    }

    interval = setInterval(moveWindow, 1000 / 60) // 60 fps
  })
}


/***/ }),

/***/ "./node_modules/sketch-module-web-view/lib/parseWebArguments.js":
/*!**********************************************************************!*\
  !*** ./node_modules/sketch-module-web-view/lib/parseWebArguments.js ***!
  \**********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = function (webArguments) {
  var args = null
  try {
    args = JSON.parse(webArguments)
  } catch (e) {
    // malformed arguments
  }

  if (
    !args ||
    !args.constructor ||
    args.constructor !== Array ||
    args.length == 0
  ) {
    return null
  }

  return args
}


/***/ }),

/***/ "./node_modules/sketch-module-web-view/lib/set-delegates.js":
/*!******************************************************************!*\
  !*** ./node_modules/sketch-module-web-view/lib/set-delegates.js ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(Promise) {var ObjCClass = __webpack_require__(/*! mocha-js-delegate */ "./node_modules/mocha-js-delegate/index.js")
var parseWebArguments = __webpack_require__(/*! ./parseWebArguments */ "./node_modules/sketch-module-web-view/lib/parseWebArguments.js")
var CONSTANTS = __webpack_require__(/*! ./constants */ "./node_modules/sketch-module-web-view/lib/constants.js")

// We create one ObjC class for ourselves here
var WindowDelegateClass
var NavigationDelegateClass
var WebScriptHandlerClass
var ThemeObserverClass

// TODO: events
// - 'page-favicon-updated'
// - 'new-window'
// - 'did-navigate-in-page'
// - 'will-prevent-unload'
// - 'crashed'
// - 'unresponsive'
// - 'responsive'
// - 'destroyed'
// - 'before-input-event'
// - 'certificate-error'
// - 'found-in-page'
// - 'media-started-playing'
// - 'media-paused'
// - 'did-change-theme-color'
// - 'update-target-url'
// - 'cursor-changed'
// - 'context-menu'
// - 'select-bluetooth-device'
// - 'paint'
// - 'console-message'

module.exports = function (browserWindow, panel, webview, options) {
  if (!ThemeObserverClass) {
    ThemeObserverClass = new ObjCClass({
      utils: null,

      'observeValueForKeyPath:ofObject:change:context:': function (
        keyPath,
        object,
        change
      ) {
        const newAppearance = change[NSKeyValueChangeNewKey]
        const isDark =
          String(
            newAppearance.bestMatchFromAppearancesWithNames([
              'NSAppearanceNameAqua',
              'NSAppearanceNameDarkAqua',
            ])
          ) === 'NSAppearanceNameDarkAqua'

        this.utils.executeJavaScript(
          "document.body.classList.remove('__skpm-" +
            (isDark ? 'light' : 'dark') +
            "'); document.body.classList.add('__skpm-" +
            (isDark ? 'dark' : 'light') +
            "')"
        )
      },
    })
  }

  if (!WindowDelegateClass) {
    WindowDelegateClass = new ObjCClass({
      utils: null,
      panel: null,

      'windowDidResize:': function () {
        this.utils.emit('resize')
      },

      'windowDidMiniaturize:': function () {
        this.utils.emit('minimize')
      },

      'windowDidDeminiaturize:': function () {
        this.utils.emit('restore')
      },

      'windowDidEnterFullScreen:': function () {
        this.utils.emit('enter-full-screen')
      },

      'windowDidExitFullScreen:': function () {
        this.utils.emit('leave-full-screen')
      },

      'windowDidMove:': function () {
        this.utils.emit('move')
        this.utils.emit('moved')
      },

      'windowShouldClose:': function () {
        var shouldClose = 1
        this.utils.emit('close', {
          get defaultPrevented() {
            return !shouldClose
          },
          preventDefault: function () {
            shouldClose = 0
          },
        })
        return shouldClose
      },

      'windowWillClose:': function () {
        this.utils.emit('closed')
      },

      'windowDidBecomeKey:': function () {
        this.utils.emit('focus', this.panel.currentEvent())
      },

      'windowDidResignKey:': function () {
        this.utils.emit('blur')
      },
    })
  }

  if (!NavigationDelegateClass) {
    NavigationDelegateClass = new ObjCClass({
      state: {
        wasReady: 0,
      },
      utils: null,

      // // Called when the web view begins to receive web content.
      'webView:didCommitNavigation:': function (webView) {
        this.utils.emit('will-navigate', {}, String(String(webView.URL())))
      },

      // // Called when web content begins to load in a web view.
      'webView:didStartProvisionalNavigation:': function () {
        this.utils.emit('did-start-navigation')
        this.utils.emit('did-start-loading')
      },

      // Called when a web view receives a server redirect.
      'webView:didReceiveServerRedirectForProvisionalNavigation:': function () {
        this.utils.emit('did-get-redirect-request')
      },

      // // Called when the web view needs to respond to an authentication challenge.
      // 'webView:didReceiveAuthenticationChallenge:completionHandler:': function(
      //   webView,
      //   challenge,
      //   completionHandler
      // ) {
      //   function callback(username, password) {
      //     completionHandler(
      //       0,
      //       NSURLCredential.credentialWithUser_password_persistence(
      //         username,
      //         password,
      //         1
      //       )
      //     )
      //   }
      //   var protectionSpace = challenge.protectionSpace()
      //   this.utils.emit(
      //     'login',
      //     {},
      //     {
      //       method: String(protectionSpace.authenticationMethod()),
      //       url: 'not implemented', // TODO:
      //       referrer: 'not implemented', // TODO:
      //     },
      //     {
      //       isProxy: !!protectionSpace.isProxy(),
      //       scheme: String(protectionSpace.protocol()),
      //       host: String(protectionSpace.host()),
      //       port: Number(protectionSpace.port()),
      //       realm: String(protectionSpace.realm()),
      //     },
      //     callback
      //   )
      // },

      // Called when an error occurs during navigation.
      // 'webView:didFailNavigation:withError:': function(
      //   webView,
      //   navigation,
      //   error
      // ) {},

      // Called when an error occurs while the web view is loading content.
      'webView:didFailProvisionalNavigation:withError:': function (
        webView,
        navigation,
        error
      ) {
        this.utils.emit('did-fail-load', error)
      },

      // Called when the navigation is complete.
      'webView:didFinishNavigation:': function () {
        if (this.state.wasReady == 0) {
          this.state.wasReady = 1
          this.utils.emitBrowserEvent('ready-to-show')
        }
        this.utils.emit('did-navigate')
        this.utils.emit('did-frame-navigate')
        this.utils.emit('did-stop-loading')
        this.utils.emit('did-finish-load')
        this.utils.emit('did-frame-finish-load')
      },

      // Called when the web view’s web content process is terminated.
      'webViewWebContentProcessDidTerminate:': function () {
        this.utils.emit('dom-ready')
      },

      // Decides whether to allow or cancel a navigation.
      // webView:decidePolicyForNavigationAction:decisionHandler:

      // Decides whether to allow or cancel a navigation after its response is known.
      // webView:decidePolicyForNavigationResponse:decisionHandler:
    })
  }

  if (!WebScriptHandlerClass) {
    WebScriptHandlerClass = new ObjCClass({
      utils: null,
      'userContentController:didReceiveScriptMessage:': function (_, message) {
        var args = this.utils.parseWebArguments(String(message.body()))
        if (!args) {
          return
        }
        if (!args[0] || typeof args[0] !== 'string') {
          return
        }
        args[0] = String(args[0])

        this.utils.emit.apply(this, args)
      },
    })
  }

  var themeObserver = ThemeObserverClass.new({
    utils: {
      executeJavaScript(script) {
        webview.evaluateJavaScript_completionHandler(script, null)
      },
    },
  })

  var script = WKUserScript.alloc().initWithSource_injectionTime_forMainFrameOnly(
    "document.addEventListener('DOMContentLoaded', function() { document.body.classList.add('__skpm-" +
      (typeof MSTheme !== 'undefined' && MSTheme.sharedTheme().isDark()
        ? 'dark'
        : 'light') +
      "') }, false)",
    0,
    true
  )
  webview.configuration().userContentController().addUserScript(script)

  NSApplication.sharedApplication().addObserver_forKeyPath_options_context(
    themeObserver,
    'effectiveAppearance',
    NSKeyValueObservingOptionNew,
    null
  )

  var threadDictionary = NSThread.mainThread().threadDictionary()
  threadDictionary[browserWindow.id + '.themeObserver'] = themeObserver

  var navigationDelegate = NavigationDelegateClass.new({
    utils: {
      setTitle: browserWindow.setTitle.bind(browserWindow),
      emitBrowserEvent() {
        try {
          browserWindow.emit.apply(browserWindow, arguments)
        } catch (err) {
          if (
            typeof process !== 'undefined' &&
            process.listenerCount &&
            process.listenerCount('uncaughtException')
          ) {
            process.emit('uncaughtException', err, 'uncaughtException')
          } else {
            console.error(err)
            throw err
          }
        }
      },
      emit() {
        try {
          browserWindow.webContents.emit.apply(
            browserWindow.webContents,
            arguments
          )
        } catch (err) {
          if (
            typeof process !== 'undefined' &&
            process.listenerCount &&
            process.listenerCount('uncaughtException')
          ) {
            process.emit('uncaughtException', err, 'uncaughtException')
          } else {
            console.error(err)
            throw err
          }
        }
      },
    },
    state: {
      wasReady: 0,
    },
  })

  webview.setNavigationDelegate(navigationDelegate)

  var webScriptHandler = WebScriptHandlerClass.new({
    utils: {
      emit(id, type) {
        if (!type) {
          webview.evaluateJavaScript_completionHandler(
            CONSTANTS.JS_BRIDGE_RESULT_SUCCESS + id + '()',
            null
          )
          return
        }

        var args = []
        for (var i = 2; i < arguments.length; i += 1) args.push(arguments[i])

        var listeners = browserWindow.webContents.listeners(type)

        Promise.all(
          listeners.map(function (l) {
            return Promise.resolve().then(function () {
              return l.apply(l, args)
            })
          })
        )
          .then(function (res) {
            webview.evaluateJavaScript_completionHandler(
              CONSTANTS.JS_BRIDGE_RESULT_SUCCESS +
                id +
                '(' +
                JSON.stringify(res) +
                ')',
              null
            )
          })
          .catch(function (err) {
            webview.evaluateJavaScript_completionHandler(
              CONSTANTS.JS_BRIDGE_RESULT_ERROR +
                id +
                '(' +
                JSON.stringify(err) +
                ')',
              null
            )
          })
      },
      parseWebArguments: parseWebArguments,
    },
  })

  webview
    .configuration()
    .userContentController()
    .addScriptMessageHandler_name(webScriptHandler, CONSTANTS.JS_BRIDGE)

  var utils = {
    emit() {
      try {
        browserWindow.emit.apply(browserWindow, arguments)
      } catch (err) {
        if (
          typeof process !== 'undefined' &&
          process.listenerCount &&
          process.listenerCount('uncaughtException')
        ) {
          process.emit('uncaughtException', err, 'uncaughtException')
        } else {
          console.error(err)
          throw err
        }
      }
    },
  }
  if (options.modal) {
    // find the window of the document
    var msdocument
    if (options.parent.type === 'Document') {
      msdocument = options.parent.sketchObject
    } else {
      msdocument = options.parent
    }
    if (msdocument && String(msdocument.class()) === 'MSDocumentData') {
      // we only have an MSDocumentData instead of a MSDocument
      // let's try to get back to the MSDocument
      msdocument = msdocument.delegate()
    }
    utils.parentWindow = msdocument.windowForSheet()
  }

  var windowDelegate = WindowDelegateClass.new({
    utils: utils,
    panel: panel,
  })

  panel.setDelegate(windowDelegate)
}

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@skpm/promise/index.js */ "./node_modules/@skpm/promise/index.js")))

/***/ }),

/***/ "./node_modules/sketch-module-web-view/lib/webview-api.js":
/*!****************************************************************!*\
  !*** ./node_modules/sketch-module-web-view/lib/webview-api.js ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var EventEmitter = __webpack_require__(/*! events */ "events")
var executeJavaScript = __webpack_require__(/*! ./execute-javascript */ "./node_modules/sketch-module-web-view/lib/execute-javascript.js")

// let's try to match https://github.com/electron/electron/blob/master/docs/api/web-contents.md
module.exports = function buildAPI(browserWindow, panel, webview) {
  var webContents = new EventEmitter()

  webContents.loadURL = browserWindow.loadURL

  webContents.loadFile = function (/* filePath */) {
    // TODO:
    console.warn(
      'Not implemented yet, please open a PR on https://github.com/skpm/sketch-module-web-view :)'
    )
  }

  webContents.downloadURL = function (/* filePath */) {
    // TODO:
    console.warn(
      'Not implemented yet, please open a PR on https://github.com/skpm/sketch-module-web-view :)'
    )
  }

  webContents.getURL = function () {
    return String(webview.URL())
  }

  webContents.getTitle = function () {
    return String(webview.title())
  }

  webContents.isDestroyed = function () {
    // TODO:
    console.warn(
      'Not implemented yet, please open a PR on https://github.com/skpm/sketch-module-web-view :)'
    )
  }

  webContents.focus = browserWindow.focus
  webContents.isFocused = browserWindow.isFocused

  webContents.isLoading = function () {
    return !!webview.loading()
  }

  webContents.isLoadingMainFrame = function () {
    // TODO:
    return !!webview.loading()
  }

  webContents.isWaitingForResponse = function () {
    return !webview.loading()
  }

  webContents.stop = function () {
    webview.stopLoading()
  }
  webContents.reload = function () {
    webview.reload()
  }
  webContents.reloadIgnoringCache = function () {
    webview.reloadFromOrigin()
  }
  webContents.canGoBack = function () {
    return !!webview.canGoBack()
  }
  webContents.canGoForward = function () {
    return !!webview.canGoForward()
  }
  webContents.canGoToOffset = function (offset) {
    return !!webview.backForwardList().itemAtIndex(offset)
  }
  webContents.clearHistory = function () {
    // TODO:
    console.warn(
      'Not implemented yet, please open a PR on https://github.com/skpm/sketch-module-web-view :)'
    )
  }
  webContents.goBack = function () {
    webview.goBack()
  }
  webContents.goForward = function () {
    webview.goForward()
  }
  webContents.goToIndex = function (index) {
    var backForwardList = webview.backForwardList()
    var backList = backForwardList.backList()
    var backListLength = backList.count()
    if (backListLength > index) {
      webview.loadRequest(NSURLRequest.requestWithURL(backList[index]))
      return
    }
    var forwardList = backForwardList.forwardList()
    if (forwardList.count() > index - backListLength) {
      webview.loadRequest(
        NSURLRequest.requestWithURL(forwardList[index - backListLength])
      )
      return
    }
    throw new Error('Cannot go to index ' + index)
  }
  webContents.goToOffset = function (offset) {
    if (!webContents.canGoToOffset(offset)) {
      throw new Error('Cannot go to offset ' + offset)
    }
    webview.loadRequest(
      NSURLRequest.requestWithURL(webview.backForwardList().itemAtIndex(offset))
    )
  }
  webContents.isCrashed = function () {
    // TODO:
    console.warn(
      'Not implemented yet, please open a PR on https://github.com/skpm/sketch-module-web-view :)'
    )
  }
  webContents.setUserAgent = function (/* userAgent */) {
    // TODO:
    console.warn(
      'Not implemented yet, please open a PR on https://github.com/skpm/sketch-module-web-view :)'
    )
  }
  webContents.getUserAgent = function () {
    const userAgent = webview.customUserAgent()
    return userAgent ? String(userAgent) : undefined
  }
  webContents.insertCSS = function (css) {
    var source =
      "var style = document.createElement('style'); style.innerHTML = " +
      css.replace(/"/, '\\"') +
      '; document.head.appendChild(style);'
    var script = WKUserScript.alloc().initWithSource_injectionTime_forMainFrameOnly(
      source,
      0,
      true
    )
    webview.configuration().userContentController().addUserScript(script)
  }
  webContents.insertJS = function (source) {
    var script = WKUserScript.alloc().initWithSource_injectionTime_forMainFrameOnly(
      source,
      0,
      true
    )
    webview.configuration().userContentController().addUserScript(script)
  }
  webContents.executeJavaScript = executeJavaScript(webview, browserWindow)
  webContents.setIgnoreMenuShortcuts = function () {
    // TODO:??
    console.warn(
      'Not implemented yet, please open a PR on https://github.com/skpm/sketch-module-web-view :)'
    )
  }
  webContents.setAudioMuted = function (/* muted */) {
    // TODO:??
    console.warn(
      'Not implemented yet, please open a PR on https://github.com/skpm/sketch-module-web-view :)'
    )
  }
  webContents.isAudioMuted = function () {
    // TODO:??
    console.warn(
      'Not implemented yet, please open a PR on https://github.com/skpm/sketch-module-web-view :)'
    )
  }
  webContents.setZoomFactor = function (factor) {
    webview.setMagnification_centeredAtPoint(factor, CGPointMake(0, 0))
  }
  webContents.getZoomFactor = function (callback) {
    callback(Number(webview.magnification()))
  }
  webContents.setZoomLevel = function (level) {
    // eslint-disable-next-line no-restricted-properties
    webContents.setZoomFactor(Math.pow(1.2, level))
  }
  webContents.getZoomLevel = function (callback) {
    // eslint-disable-next-line no-restricted-properties
    callback(Math.log(Number(webview.magnification())) / Math.log(1.2))
  }
  webContents.setVisualZoomLevelLimits = function (/* minimumLevel, maximumLevel */) {
    // TODO:??
    console.warn(
      'Not implemented yet, please open a PR on https://github.com/skpm/sketch-module-web-view :)'
    )
  }
  webContents.setLayoutZoomLevelLimits = function (/* minimumLevel, maximumLevel */) {
    // TODO:??
    console.warn(
      'Not implemented yet, please open a PR on https://github.com/skpm/sketch-module-web-view :)'
    )
  }

  // TODO:
  // webContents.undo = function() {
  //   webview.undoManager().undo()
  // }
  // webContents.redo = function() {
  //   webview.undoManager().redo()
  // }
  // webContents.cut = webview.cut
  // webContents.copy = webview.copy
  // webContents.paste = webview.paste
  // webContents.pasteAndMatchStyle = webview.pasteAsRichText
  // webContents.delete = webview.delete
  // webContents.replace = webview.replaceSelectionWithText

  webContents.send = function () {
    const script =
      'window.postMessage({' +
      'isSketchMessage: true,' +
      "origin: '" +
      String(__command.identifier()) +
      "'," +
      'args: ' +
      JSON.stringify([].slice.call(arguments)) +
      '}, "*")'
    webview.evaluateJavaScript_completionHandler(script, null)
  }

  webContents.getNativeWebview = function () {
    return webview
  }

  browserWindow.webContents = webContents
}


/***/ }),

/***/ "./node_modules/sketch-module-web-view/remote.js":
/*!*******************************************************!*\
  !*** ./node_modules/sketch-module-web-view/remote.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* globals NSThread */
var threadDictionary = NSThread.mainThread().threadDictionary()

module.exports.getWebview = function (identifier) {
  return __webpack_require__(/*! ./lib */ "./node_modules/sketch-module-web-view/lib/index.js").fromId(identifier) // eslint-disable-line
}

module.exports.isWebviewPresent = function isWebviewPresent(identifier) {
  return !!threadDictionary[identifier]
}

module.exports.sendToWebview = function sendToWebview(identifier, evalString) {
  if (!module.exports.isWebviewPresent(identifier)) {
    return
  }

  var panel = threadDictionary[identifier]
  var webview = null
  var subviews = panel.contentView().subviews()
  for (var i = 0; i < subviews.length; i += 1) {
    if (
      !webview &&
      !subviews[i].isKindOfClass(WKInspectorWKWebView) &&
      subviews[i].isKindOfClass(WKWebView)
    ) {
      webview = subviews[i]
    }
  }

  if (!webview || !webview.evaluateJavaScript_completionHandler) {
    throw new Error('Webview ' + identifier + ' not found')
  }

  webview.evaluateJavaScript_completionHandler(evalString, null)
}


/***/ }),

/***/ "./resources/webview.html":
/*!********************************!*\
  !*** ./resources/webview.html ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "file://" + String(context.scriptPath).split(".sketchplugin/Contents/Sketch")[0] + ".sketchplugin/Contents/Resources/_webpack_resources/d185e74ad4e53236afd37ba858a0bf3b.html";

/***/ }),

/***/ "./src/ddMath.js":
/*!***********************!*\
  !*** ./src/ddMath.js ***!
  \***********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Vector2d; });
// Extend Math //

Math.rad = Math.PI / 180;
Math.degrees = function (deg) {
  return (deg + 360) % 360;
};
Math.factorial = function (num) {
  var rval = 1;
  for (var i = 2; i <= num; i++) rval = rval * i;
  return rval;
};
Math.triangle = function (num) {
  return num * (num + 1) / 2;
};
Math.decimal = function (num) {
  var decimal = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  return Math.round(num * Math.pow(10, decimal)) / Math.pow(10, decimal);
};
// Circulair easing
Math.ease = function (timing, steps) {
  var transition = {
    start: 0,
    step: 0,
    latter: 0,
    factor: 1,
    points: new Array()
  };
  switch (timing) {
    case "ease":
      transition.step = Math.PI / steps;
      transition.factor = 2;
      break;
    case "ease-in":
      transition.start = Math.PI / 2, transition.step = Math.PI / 2 / steps;
      break;
    case "ease-out":
      transition.step = Math.PI / 2 / steps;
      break;
    default:
  }
  if (transition.step) {
    transition.latter = (Math.cos(transition.start) + 1) / transition.factor;
    for (var i = 0; i <= steps; i++) {
      var cos = (Math.cos(transition.start) + 1) / transition.factor;
      var dif = i == 0 ? 0 : Math.abs(cos - transition.latter);
      transition.start += transition.step;
      transition.latter = cos;
      if (i) {
        transition.points.push(dif);
      }
    }
    transition.points.push(0);
    return transition.points;
  } else {
    return false;
  }
};
// Logarithmic easing
Math.easePower = function (timing, power, steps) {
  if (timing == 'linear') return false;
  var transition = new Array();
  var total = 0;
  for (var x = 0; x <= steps; x++) {
    var y = timing == 'ease' && x > steps / 2 ? Math.pow(steps + 1 - x, power) : Math.pow(x, power);
    if (x) {
      total += y;
      if (timing == 'ease-in') {
        transition.unshift(y);
      } else {
        transition.push(y);
      }
    }
  }
  for (var i = 0; i < steps; i++) {
    transition[i] = Math.decimal(transition[i] /= total, 6);
  }
  transition.push(0);
  return transition;
};

// Vector 2D //

function Vector2d(x, y) {
  this.x = x || 0;
  this.y = y || 0;
}
Vector2d.prototype = {
  add: function add(point) {
    this.x += point.x;
    this.y += point.y;
  },
  angle: function angle() {
    return Math.degrees(270 - Math.atan2(this.y, -this.x) * 180 / Math.PI);
  },
  multiplier: function multiplier(testAngle) {
    var angle = Math.degrees(this.angle() - testAngle);
    var radians = Math.rad * angle;
    var multiplier = Math.decimal(Math.cos(radians), 9);
    return multiplier;
  },
  radius: function radius() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  },
  root: function root() {
    if (Math.abs(this.x) > Math.abs(this.y)) {
      this.y = this.y / Math.abs(this.x);
      this.x = this.x / Math.abs(this.x);
    } else {
      this.x = this.x / Math.abs(this.y);
      this.y = this.y / Math.abs(this.y);
    }
  },
  rotate: function rotate(center, angle) {
    var radians = Math.rad * angle,
      cos = Math.cos(radians),
      sin = Math.sin(radians),
      x = this.x,
      y = this.y;
    this.x = cos * (x - center.x) + sin * (y - center.y) + center.x;
    this.y = cos * (y - center.y) - sin * (x - center.x) + center.y;
  },
  substract: function substract(point) {
    this.x -= point.x;
    this.y -= point.y;
  }
};

/***/ }),

/***/ "./src/ddSpiral.js":
/*!*************************!*\
  !*** ./src/ddSpiral.js ***!
  \*************************/
/*! exports provided: default, onShutdown, onSelectionChanged */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "onShutdown", function() { return onShutdown; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "onSelectionChanged", function() { return onSelectionChanged; });
/* harmony import */ var sketch_module_web_view__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! sketch-module-web-view */ "./node_modules/sketch-module-web-view/lib/index.js");
/* harmony import */ var sketch_module_web_view__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(sketch_module_web_view__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var sketch_module_web_view_remote__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! sketch-module-web-view/remote */ "./node_modules/sketch-module-web-view/remote.js");
/* harmony import */ var sketch_module_web_view_remote__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(sketch_module_web_view_remote__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _ddMath_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ddMath.js */ "./src/ddMath.js");
// Init
var sketch = __webpack_require__(/*! sketch */ "sketch");
var Settings = __webpack_require__(/*! sketch/settings */ "sketch/settings");
var UI = __webpack_require__(/*! sketch/ui */ "sketch/ui");



var uniqueCommIdentifier = 'comm.ddSpiral.webview';
var uniqueSettingIdentifier = 'ddSpiralID';
var _openShapes = ['MSShapePathLayer', 'MSRectangleShape', 'MSOvalShape', 'MSTriangleShape', 'MSPolygonShape', 'MSStarShape'];
var openShapes = ['Custom', 'Rectangle', 'Oval', 'Triangle', 'Polygon', 'Star'];
var shapeNames = ['custom shape', 'rectangle', 'oval', 'triangle', 'polygon', 'star'];
var settingIdentifiers = ['loops', 'points', 'smooth', 'timing', 'power', 'squeeze', 'mirror', 'clockwise', 'auto'];

// Not working with skpm BrowserWindow
// var fiber;

/* harmony default export */ __webpack_exports__["default"] = (function (context) {
  // Keep script alive after js finish
  // if(!fiber) {
  // 	fiber = Async.createFiber();
  // 	fiber.onCleanup(() => {
  // 		UI.cleanup();
  // 	});
  // }

  // Webview options
  var options = {
    identifier: uniqueCommIdentifier,
    width: 240,
    height: 554,
    show: false,
    backgroundColor: '#ffffffff',
    alwaysOnTop: true,
    resizable: false,
    titleBarStyle: 'default',
    maximizable: false,
    minimizable: false
  };
  var browserWindow = new sketch_module_web_view__WEBPACK_IMPORTED_MODULE_0___default.a(options);

  // Only show the window when the page has loaded to avoid a white flash
  browserWindow.once('ready-to-show', function () {
    // Activate plugin
    Settings.setSettingForKey(uniqueSettingIdentifier + 'window', true);
    // Show window
    browserWindow.show();
  });

  // Only show the window when the page has loaded to avoid a white flash
  browserWindow.once('close', function () {
    // Deactivate plugin
    Settings.setSettingForKey(uniqueSettingIdentifier + 'window', false);
  });
  var webContents = browserWindow.webContents;

  // Do something after page load
  webContents.on('did-finish-load', function () {
    // Handle current selection and tell webview 
    handleSelection();
  });

  // Listener for link requests from the webview
  webContents.on('followLink', function (url) {
    NSWorkspace.sharedWorkspace().openURL(NSURL.URLWithString(url));
  });

  // Listener for calls from the webview
  webContents.on('internalRequest', function (requestData) {
    requestData = JSON.parse(requestData);
    if (requestData.action) {
      switch (requestData.action) {
        case "getSelection":
          // The webview may ask for the current selection
          handleSelection();
          break;
        case "spiralise":
          // The webview may ask for the current selection
          spiral(requestData);
          break;
        case "clear":
          // The webview may ask for the current selection
          clearSelection(requestData);
          break;
      }
    }
  });

  // Load webview
  browserWindow.loadURL(__webpack_require__(/*! ../resources/webview.html */ "./resources/webview.html"));
});

// Close webview plugin is shutdown by Sketch
function onShutdown() {
  var existingWebview = Object(sketch_module_web_view_remote__WEBPACK_IMPORTED_MODULE_1__["getWebview"])(uniqueCommIdentifier);
  if (existingWebview) {
    existingWebview.close();
  }
}

// Return message to the corresponding listener in the webview
function respondToWebview(message) {
  var listener = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'internalResponse';
  message = JSON.stringify(message);
  if (Object(sketch_module_web_view_remote__WEBPACK_IMPORTED_MODULE_1__["isWebviewPresent"])(uniqueCommIdentifier)) {
    Object(sketch_module_web_view_remote__WEBPACK_IMPORTED_MODULE_1__["sendToWebview"])(uniqueCommIdentifier, "".concat(listener, "(").concat(message, ")"));
  }
}

// Listens to Sketch event
function onSelectionChanged(context) {
  // Forget about context = oldschool
  // Only handle selection changes if plugin is active
  if (Settings.settingForKey(uniqueSettingIdentifier + 'window')) {
    handleSelection();
  }
}

// Handle current selection data and send to webview
function handleSelection() {
  // Get selected document and layers from Sketch API
  var document = sketch.getSelectedDocument();
  var selectedLayers = document.selectedLayers.layers;

  // Reset spiralID
  Settings.setSettingForKey(uniqueSettingIdentifier, false);

  // Local data collection
  var collection = {
    objects: 0,
    shapes: 0,
    rects: 0,
    paths: 0,
    parentObj: false,
    startObj: false,
    endObj: false
  };

  // Collect settings for webview
  var selection = {
    theme: 'light',
    type: 0,
    shape: '',
    clear: false,
    isSpiral: false,
    startID: '',
    endID: '',
    pathID: '',
    parentID: ''
  };
  for (var _i in settingIdentifiers) {
    var getSetting = Settings.settingForKey(uniqueSettingIdentifier + settingIdentifiers[_i]);
    selection[settingIdentifiers[_i]] = getSetting || getSetting === false ? getSetting : 'undefined';
  }
  var start_val = {
    x: 0,
    y: 0,
    w: 0,
    h: 0,
    deg: 0,
    worldDeg: 0
  };
  var end_val = {
    x: 0,
    y: 0,
    w: 0,
    h: 0,
    deg: 0,
    worldDeg: 0
  };

  // Keep track of first object
  var firstObj = true;

  // Loop through selected layers and collect start and end values
  for (var i = 0; i < selectedLayers.length; i++) {
    // Get the layer
    var selectedLayer = selectedLayers[i];
    // Get layer type
    var typeName = selectedLayer.shapeType;

    // Open shape?
    if (openShapes.indexOf(typeName) > -1 && !selectedLayer.closed) {
      // Count paths
      collection.paths++;
      if (collection.paths == 1) {
        // Is shape spiral
        selection.isSpiral = Settings.layerSettingForKey(selectedLayer, uniqueSettingIdentifier);
        // Store parent
        collection.parentObj = selectedLayer.parent;
        selection.parentID = selectedLayer.parent.id;
        // Get the native Sketch object
        var nativeLayer = selectedLayer.sketchObject;
        // Get the path as CG object
        var path = NSBezierPath.bezierPathWithCGPath(nativeLayer.pathInFrameWithTransforms().CGPath());
        // Set default radius based on length
        var defaultRadius = path.length() / 10;
        defaultRadius = defaultRadius > 50 ? 50 : defaultRadius;
        // Remember paths layer id
        selection.pathID = selectedLayer.id;
        // Use 
        if (firstObj) {
          start_val.w = defaultRadius;
          start_val.h = defaultRadius;
          start_val.deg = Math.degrees(selectedLayer.transform.rotation - 0);
          end_val.w = defaultRadius;
          end_val.h = defaultRadius;
          end_val.deg = Math.degrees(selectedLayer.transform.rotation - 0);
        }
      }
    } else {
      // Do we have a closed shape?
      if (openShapes.indexOf(typeName) > -1) {
        collection.shapes++;
        // Remember the name of the shape
        selection.shape = shapeNames[openShapes.indexOf(typeName)];
        if (typeName == 'Rectangle') collection.rects++;
      } else {
        // Some other object
        collection.objects++;
      }
      if (!collection.paths) {
        // Store parent if we don't have a path yet
        collection.parentObj = selectedLayer.parent;
        selection.parentID = selectedLayer.parent.id;
      }
      if (firstObj) {
        // First object is starting point
        firstObj = false;
        // Store start object parent
        collection.startObj = selectedLayer.parent;
        selection.startID = selectedLayer.id;
        // Store start position, sizenand rotation
        start_val.x = selectedLayer.frame.x + selectedLayer.frame.width / 2;
        start_val.y = selectedLayer.frame.y + selectedLayer.frame.height / 2;
        start_val.w = selectedLayer.frame.width * 0.5;
        start_val.h = selectedLayer.frame.height * 0.5;
        start_val.deg = Math.degrees(selectedLayer.transform.rotation - 0);
        // Store end position, size and rotation
        end_val.x = selectedLayer.frame.x + selectedLayer.frame.width / 2;
        end_val.y = selectedLayer.frame.y + selectedLayer.frame.height / 2;
        end_val.w = 0;
        end_val.h = 0;
        end_val.deg = Math.degrees(selectedLayer.transform.rotation - 0);
      } else {
        // Last object becomes target
        // Store end object parent
        collection.endObj = selectedLayer.parent;
        selection.endID = selectedLayer.id;
        // Update end position, size and rotation
        end_val.x = selectedLayer.frame.x + selectedLayer.frame.width / 2;
        end_val.y = selectedLayer.frame.y + selectedLayer.frame.height / 2;
        end_val.w = selectedLayer.frame.width * 0.5;
        end_val.h = selectedLayer.frame.height * 0.5;
        end_val.deg = Math.degrees(selectedLayer.transform.rotation - 0);
      }
    }
  }

  // Set selection type
  var o = collection.objects;
  var s = collection.shapes;
  var p = collection.paths;
  var r = collection.rects;
  selection.type = 0;
  if (o == 1 && !s && !p) {
    selection.type = 1; // single object
  } else if (!o && s == 1 && !r && !p) {
    selection.type = 2; // single shape, no rect
  } else if (!o && s == 1 && r && !p) {
    selection.type = 2; // single shape, rect
    // always send type 2, change to 3 in webview if squeeze is true
  } else if (o + s < 2 && p == 1) {
    selection.type = 4; // zero or single object + path (center ease allowed)
  } else if (o + s == 2 && !p) {
    selection.type = 5; // two objects
  } else if (o + s + p == 3 && p == 1) {
    selection.type = 4; // two objects + path (is now same as #4)
  }

  // Set world coordinates
  collection.parentObj = worldOrientation(collection.parentObj);
  collection.startObj = worldOrientation(collection.startObj);
  collection.endObj = worldOrientation(collection.endObj);

  // Set world rotation for display in webview
  start_val.worldDeg = collection.startObj.r;
  end_val.worldDeg = collection.startObj.r;

  // Relocate both objects to document level if parents differ
  if (selection.type == 5 && collection.startObj && collection.endObj && collection.startObj.id != collection.endObj.id) {
    start_val.x += collection.startObj.x;
    start_val.y += collection.startObj.y;
    start_val.deg = Math.degrees(start_val.deg + collection.startObj.r);
    start_val.worldDeg = 0;
    end_val.x += collection.endObj.x;
    end_val.y += collection.endObj.y;
    end_val.deg = Math.degrees(end_val.deg + collection.endObj.r);
    end_val.worldDeg = 0;
    selection.parentID = ''; //collection.endObj.id; // document level
  }
  // Relocate first objects in combination with path
  if (selection.type == 4 && collection.startObj.id && collection.startObj.id != collection.parentObj.id) {
    start_val.x += collection.startObj.x - collection.parentObj.x;
    start_val.y += collection.startObj.y - collection.parentObj.y;
    start_val.deg = Math.degrees(start_val.deg + collection.startObj.r - collection.parentObj.r);
    start_val.worldDeg = collection.parentObj.r;
    if (selection.type == 4 && collection.endObj.id && collection.endObj.id != collection.parentObj.id) {
      end_val.x += collection.endObj.x - collection.parentObj.x;
      end_val.y += collection.endObj.y - collection.parentObj.y;
      end_val.deg = Math.degrees(end_val.deg + collection.endObj.r - collection.parentObj.r);
    } else {
      end_val.deg = start_val.deg;
    }
    end_val.worldDeg = collection.parentObj.r;
  }

  // Pass Sketch theme
  selection.theme = UI.getTheme();

  // Set the final message for the webview
  var message = {
    selection: selection,
    start_val: start_val,
    end_val: end_val
  };

  // Tell webview about selection
  respondToWebview(message, 'setSelection');
}

// Set world coordinatates for object in target
function worldOrientation(obj) {
  var coor = {
    id: obj.id ? obj.id : false,
    x: 0,
    y: 0,
    r: 0
  };
  while (obj && obj.name) {
    coor.x += obj.frame.x;
    coor.y += obj.frame.y;
    coor.r += obj.transform.rotation;
    obj = obj.parent;
  }
  ;
  return coor;
}

//////////////////////////////////////////////
// 
// Create actual spiral
// 
//////////////////////////////////////////////

function spiral(data) {
  // Get selected document and layers from Sketch API
  var document = sketch.getSelectedDocument();

  // Passed data from webview
  var ret_start_val = data.start_val;
  var ret_end_val = data.end_val;
  var ret_settings = data.settings;

  // Save settings to plugin
  for (var i in settingIdentifiers) {
    Settings.setSettingForKey(uniqueSettingIdentifier + settingIdentifiers[i], ret_settings[settingIdentifiers[i]]);
  }

  // Preset radius
  var rad = {
    length: new _ddMath_js__WEBPACK_IMPORTED_MODULE_2__["default"](ret_start_val.w, ret_start_val.h),
    step: new _ddMath_js__WEBPACK_IMPORTED_MODULE_2__["default"](),
    target: new _ddMath_js__WEBPACK_IMPORTED_MODULE_2__["default"](ret_end_val.w, ret_end_val.h),
    total: 0,
    array: []
  };
  // Preset rotation
  var rot = {
    angle: Math.degrees(ret_start_val.deg),
    step: 0,
    target: Math.degrees(ret_end_val.deg)
  };
  // Preset translation
  var trans = {
    center: new _ddMath_js__WEBPACK_IMPORTED_MODULE_2__["default"](ret_start_val.x, ret_start_val.y),
    step: 0,
    target: new _ddMath_js__WEBPACK_IMPORTED_MODULE_2__["default"](ret_end_val.x, ret_end_val.y),
    total: 0,
    array: []
  };

  // Total steps
  var steps = ret_settings.loops * ret_settings.points;

  // Ease timing
  var transition = Math.easePower(ret_settings.timing, ret_settings.power * 0.85, steps);

  // GAP, fix for half paths from rectangles
  var gap = {
    first: false,
    start: new _ddMath_js__WEBPACK_IMPORTED_MODULE_2__["default"](),
    length: 0
  };

  // Squeeze spiral into shape
  if (ret_settings.squeeze) {
    // Adjust loop setting
    ret_settings.loops = Math.round(ret_settings.loops) + 0.5;
    steps = ret_settings.loops * ret_settings.points;
    transition = Math.easePower(ret_settings.timing, ret_settings.power * 0.85, steps);

    // Get the shape as js object
    var jsShape = document.getLayerWithID(ret_settings.startID);
    var nativeShape = jsShape.sketchObject;
    // Path from shape object
    var pathInFrame = nativeShape.pathInFrameWithTransforms();
    // Collection of point on path
    var outl = {
      top: false,
      bottom: 0,
      array: []
    };
    // Collect all horizontal max and min points on the path
    for (var j = 0; j <= Math.round(pathInFrame.length()); j++) {
      var point = pathInFrame.pointOnPathAtLength(j);
      var x = Math.round(point.x);
      var y = Math.round(point.y);

      //GAP
      if (!gap.first) {
        gap.first = new _ddMath_js__WEBPACK_IMPORTED_MODULE_2__["default"](x, y);
      }
      if (x == gap.start.x && y == gap.start.y && j != Math.round(pathInFrame.length())) {
        gap.length++;
      } else if (gap.length > 2 || j == Math.round(pathInFrame.length())) {
        var gapDistance = Math.sqrt((gap.first.x - gap.start.x) * (gap.first.x - gap.start.x) + (gap.first.y - gap.start.y) * (gap.first.y - gap.start.y));
        var gapStep = new _ddMath_js__WEBPACK_IMPORTED_MODULE_2__["default"]((gap.first.x - gap.start.x) / gapDistance, (gap.first.y - gap.start.y) / gapDistance);
        for (var d = 0; d < gapDistance; d++) {
          var xx = Math.round(gap.start.x + d * gapStep.x);
          var yy = Math.round(gap.start.y + d * gapStep.y);
          var high = Math.ceil(outl.array[yy] ? xx > outl.array[yy].high ? xx : outl.array[yy].high : xx);
          var low = Math.floor(outl.array[yy] ? xx < outl.array[yy].low ? xx : outl.array[yy].low : xx);
          var radius = (high - low) / 2;
          var center = low + radius;
          outl.array[yy] = {
            high: high,
            low: low,
            center: center,
            radius: radius
          };
        }
        gap.start = new _ddMath_js__WEBPACK_IMPORTED_MODULE_2__["default"](x, y);
        gap.length = 0;
      } else {
        gap.start = new _ddMath_js__WEBPACK_IMPORTED_MODULE_2__["default"](x, y);
        gap.length = 0;
        var _high = Math.ceil(outl.array[y] ? x > outl.array[y].high ? x : outl.array[y].high : x);
        var _low = Math.floor(outl.array[y] ? x < outl.array[y].low ? x : outl.array[y].low : x);
        var _radius = (_high - _low) / 2;
        var _center = _low + _radius;
        outl.top = y < outl.top || outl.top === false ? y : outl.top;
        outl.bottom = y > outl.bottom ? y : outl.bottom;
        outl.array[y] = {
          high: _high,
          low: _low,
          center: _center,
          radius: _radius
        };
      }
    }
    ;

    // Rotation
    rot.angle = 0;
    rot.target = 0;

    // Total distance
    var distanceY = rad.length.y;
    var radiusY = distanceY / (ret_settings.loops + 0);

    // Prepare vertical translation
    var easeRadius = ret_settings.timing == 'linear' ? false : true;
    trans = {
      center: new _ddMath_js__WEBPACK_IMPORTED_MODULE_2__["default"](outl.array[outl.top].center, outl.top + (easeRadius ? ret_settings.timing == 'ease' || ret_settings.timing == 'ease-out' ? 0 : radiusY : radiusY)),
      step: 0,
      target: new _ddMath_js__WEBPACK_IMPORTED_MODULE_2__["default"](outl.array[outl.bottom].center, outl.bottom - (easeRadius ? ret_settings.timing == 'ease' || ret_settings.timing == 'ease-in' ? 0 : radiusY : radiusY)),
      total: 0,
      array: []
    };
    trans.total = new _ddMath_js__WEBPACK_IMPORTED_MODULE_2__["default"](trans.target.x - trans.center.x, trans.target.y - trans.center.y);
    trans.step = new _ddMath_js__WEBPACK_IMPORTED_MODULE_2__["default"](trans.total.x / steps, trans.total.y / steps);

    // Prepare vertical radius
    rad = {
      length: new _ddMath_js__WEBPACK_IMPORTED_MODULE_2__["default"](outl.array[outl.top + 1].radius, easeRadius ? ret_settings.timing == 'ease' || ret_settings.timing == 'ease-out' ? 0 : radiusY : radiusY),
      step: new _ddMath_js__WEBPACK_IMPORTED_MODULE_2__["default"](),
      target: new _ddMath_js__WEBPACK_IMPORTED_MODULE_2__["default"](outl.array[outl.bottom].radius, easeRadius ? ret_settings.timing == 'ease' || ret_settings.timing == 'ease-in' ? 0 : radiusY : radiusY),
      total: 0,
      array: []
    };

    // Fill translation and radial arrays
    var transTotal = 0;
    var radTotal = 0;
    var largestStep = 0;
    for (var j = 0; j <= steps; j++) {
      if (transition) {
        transTotal += transition[j] * trans.total.y;
        var transPoint = new _ddMath_js__WEBPACK_IMPORTED_MODULE_2__["default"](ret_start_val.x, trans.center.y + transTotal);
        radTotal += transition[j];
        var radPoint = new _ddMath_js__WEBPACK_IMPORTED_MODULE_2__["default"](rad.length.x, radiusY);
        if (easeRadius) {
          largestStep = transition[j] > largestStep ? transition[j] : largestStep;
          radPoint.y = transition[j];
        }
      } else {
        var transPoint = new _ddMath_js__WEBPACK_IMPORTED_MODULE_2__["default"](ret_start_val.x, trans.center.y + j * trans.step.y);
        var radPoint = new _ddMath_js__WEBPACK_IMPORTED_MODULE_2__["default"](rad.length.x, radiusY);
      }
      // Seek horizontal position and radius
      var seeker = Math.round(transPoint.y);
      if (outl.array[seeker]) {
        transPoint.x = outl.array[seeker].center;
        radPoint.x = outl.array[seeker].radius;
      }
      // Put points in arrays
      trans.array.push(transPoint);
      rad.array.push(radPoint);
    }
    ;

    // Rescale radius to max
    if (easeRadius) {
      for (var _i2 = 0; _i2 < rad.array.length; _i2++) {
        // if(i < rad.array.length - 1) {
        // 	rad.array[i].x = (rad.array[i].x + rad.array[i+1].x) / 2;
        // }
        rad.array[_i2].y *= radiusY / largestStep;
      }
    }
  }

  // Adjust step settings to user input
  var angle = (ret_settings.clockwise ? 1 : -1) * ret_settings.loops * 360 / steps; // angle per point

  // Rotation
  rot.step = Math.degrees(360 + rot.target) - Math.degrees(360 + rot.angle); // rotation from first to second object
  if (rot.step > 180) {
    rot.step = -(360 - rot.step);
  } else if (rot.step < -180) {
    rot.step = 360 + rot.step;
  }
  if (rot.step > 0 && !ret_settings.clockwise) {
    rot.step -= 360;
  }
  if (rot.step < 0 && ret_settings.clockwise) {
    rot.step += 360;
  }
  rot.step /= steps;
  // Translation
  trans.total = new _ddMath_js__WEBPACK_IMPORTED_MODULE_2__["default"](trans.target.x - trans.center.x, trans.target.y - trans.center.y);
  trans.step = new _ddMath_js__WEBPACK_IMPORTED_MODULE_2__["default"](trans.total.x / steps, trans.total.y / steps);

  // Get the points on an open path
  if (ret_settings.pathID != '') {
    // Get the path as js object
    var jsPath = document.getLayerWithID(ret_settings.pathID);
    var nativePath = jsPath.sketchObject;
    // Path object
    var _pathInFrame = nativePath.pathInFrameWithTransforms();
    // Step length on path
    var pathStep = _pathInFrame.length() / steps;

    // First point at start of line
    point = _pathInFrame.pointOnPathAtLength(0);
    trans.center = new _ddMath_js__WEBPACK_IMPORTED_MODULE_2__["default"](point.x, point.y);
    if (transition) {
      trans.array.push(new _ddMath_js__WEBPACK_IMPORTED_MODULE_2__["default"](point.x, point.y));
    }
    var total = 0;
    for (var j = 0; j <= steps; j++) {
      if (transition) {
        total += transition[j] * _pathInFrame.length();
        var point = _pathInFrame.pointOnPathAtLength(total);
      } else {
        var point = _pathInFrame.pointOnPathAtLength(pathStep * j);
      }
      trans.array.push(new _ddMath_js__WEBPACK_IMPORTED_MODULE_2__["default"](point.x, point.y));
    }
    ;
  }

  // Radius
  rad.total = new _ddMath_js__WEBPACK_IMPORTED_MODULE_2__["default"](rad.target.x - rad.length.x, rad.target.y - rad.length.y);
  rad.step = new _ddMath_js__WEBPACK_IMPORTED_MODULE_2__["default"](rad.total.x / steps, rad.total.y / steps);
  rad.max = new _ddMath_js__WEBPACK_IMPORTED_MODULE_2__["default"](rad.length.x, rad.length.y);

  // Setup path
  var path = NSBezierPath.bezierPath();

  // Fill path
  for (var s = 0; s <= steps; s++) {
    // Get current radius and scale factor
    var maxRadius = rad.length.x > rad.length.y ? rad.length.x : rad.length.y;
    var scale = new _ddMath_js__WEBPACK_IMPORTED_MODULE_2__["default"](rad.length.x / maxRadius, rad.length.y / maxRadius);

    // Get degree and vector
    var deg = s * angle;
    var vec = new _ddMath_js__WEBPACK_IMPORTED_MODULE_2__["default"](Math.sin(Math.rad * deg) * rad.length.x, Math.cos(Math.rad * deg) * -rad.length.y);

    // Translate and rotate
    vec.add(trans.center);
    vec.rotate(trans.center, -rot.angle);

    // Tangents
    if (ret_settings.smooth) {
      // Tangent factor to current point
      var rotationDelta = rot.step + angle;
      var tangent = Math.tan(Math.PI / (2 * (360 / rotationDelta))) / 3 * 4;
      // Tangent length
      var vTangent = deg + 90;
      vTangent = Math.degrees(vTangent);
      var newTangent = new _ddMath_js__WEBPACK_IMPORTED_MODULE_2__["default"](Math.sin(Math.rad * vTangent) * rad.length.x * tangent, Math.cos(Math.rad * vTangent) * -rad.length.y * tangent);
      // Get step factor from tangent
      var a = rad.length.x;
      var b = rad.length.y;
      var h = (a - b) * (a - b) / ((a + b) * (a + b)) * 3;
      var circumference = Math.PI * (a + b) * (1 + h / (10 + Math.sqrt(4 - h)));
      var tLength = Math.sqrt(newTangent.x * newTangent.x + newTangent.y * newTangent.y);
      var degInLoops = ret_settings.loops * ret_settings.clockwise ? 360 : -360;
      var rotationInDeg = steps * rot.step;
      var absoluteRotation = degInLoops + rotationInDeg;
      var rotationFactor = degInLoops / absoluteRotation;
      var stepFactor = tLength / (circumference / ret_settings.points) * rotationFactor;
      // Calculate translation vector
      var vTranslate = new _ddMath_js__WEBPACK_IMPORTED_MODULE_2__["default"](0, 0);
      if (trans.array.length) {
        if (s != Math.floor(steps)) {
          vTranslate = new _ddMath_js__WEBPACK_IMPORTED_MODULE_2__["default"]((trans.array[s + 1].x - trans.array[s].x) * stepFactor, (trans.array[s + 1].y - trans.array[s].y) * stepFactor);
        } else {
          // Repat previous direction for last point
          vTranslate = new _ddMath_js__WEBPACK_IMPORTED_MODULE_2__["default"]((trans.array[s].x - trans.array[s - 1].x) * stepFactor, (trans.array[s].y - trans.array[s - 1].y) * stepFactor);
        }
      } else {
        if (transition) {
          vTranslate = new _ddMath_js__WEBPACK_IMPORTED_MODULE_2__["default"](transition[s] * trans.total.x * stepFactor, transition[s] * trans.total.y * stepFactor);
        } else {
          vTranslate = new _ddMath_js__WEBPACK_IMPORTED_MODULE_2__["default"](trans.step.x * stepFactor, trans.step.y * stepFactor);
        }
      }
      vTranslate.rotate(new _ddMath_js__WEBPACK_IMPORTED_MODULE_2__["default"](), rot.angle);
      // Add translation vector to tangent
      newTangent.add(vTranslate);

      // Calculate radius vector
      var centerVector2d = new _ddMath_js__WEBPACK_IMPORTED_MODULE_2__["default"](vec.x,
      // - trans.center.x,
      vec.y // - trans.center.y
      );

      centerVector2d.substract(trans.center);
      centerVector2d.rotate(new _ddMath_js__WEBPACK_IMPORTED_MODULE_2__["default"](), rot.angle);
      var radiusAngle = centerVector2d.angle(); // - deg;
      //const radiusAngle = deg;
      if (rad.array.length) {
        if (s != Math.floor(steps)) {
          radiusTangent = new _ddMath_js__WEBPACK_IMPORTED_MODULE_2__["default"]((rad.array[s + 1].x - rad.array[s].x) * stepFactor, (rad.array[s + 1].y - rad.array[s].y) * stepFactor);
        } else {
          // Repat previous direction for last point
          radiusTangent = new _ddMath_js__WEBPACK_IMPORTED_MODULE_2__["default"]((rad.array[s].x - rad.array[s - 1].x) * stepFactor, (rad.array[s].y - rad.array[s - 1].y) * stepFactor);
        }
      } else if (transition) {
        if (ret_settings.type == 4 && ret_settings.mirror) {
          if (s < transition.length / 2) {
            var radiusTangent = new _ddMath_js__WEBPACK_IMPORTED_MODULE_2__["default"](Math.sin(Math.rad * radiusAngle) * transition[s * 2] * rad.total.x * 2 * stepFactor, Math.cos(Math.rad * radiusAngle) * transition[s * 2] * -rad.total.y * 2 * stepFactor);
          } else {
            var radiusTangent = new _ddMath_js__WEBPACK_IMPORTED_MODULE_2__["default"](Math.sin(Math.rad * radiusAngle) * -(transition[(transition.length - 1 - s) * 2] * rad.total.x * 2) * stepFactor, Math.cos(Math.rad * radiusAngle) * -(transition[(transition.length - 1 - s) * 2] * -rad.total.y * 2) * stepFactor);
          }
        } else {
          var radiusTangent = new _ddMath_js__WEBPACK_IMPORTED_MODULE_2__["default"](Math.sin(Math.rad * radiusAngle) * transition[s] * rad.total.x * stepFactor, Math.cos(Math.rad * radiusAngle) * transition[s] * -rad.total.y * stepFactor);
        }
      } else {
        if (ret_settings.mirror) {
          if (s < steps / 2) {
            var radiusTangent = new _ddMath_js__WEBPACK_IMPORTED_MODULE_2__["default"](Math.sin(Math.rad * radiusAngle) * rad.step.x * 2 * stepFactor, Math.cos(Math.rad * radiusAngle) * -rad.step.y * 2 * stepFactor);
          } else {
            var radiusTangent = new _ddMath_js__WEBPACK_IMPORTED_MODULE_2__["default"](Math.sin(Math.rad * radiusAngle) * rad.step.x * -2 * stepFactor, Math.cos(Math.rad * radiusAngle) * -rad.step.y * -2 * stepFactor);
          }
        } else {
          var radiusTangent = new _ddMath_js__WEBPACK_IMPORTED_MODULE_2__["default"](Math.sin(Math.rad * radiusAngle) * rad.step.x * stepFactor, Math.cos(Math.rad * radiusAngle) * -rad.step.y * stepFactor);
        }
      }
      // Add radius vector to tangent
      newTangent.add(radiusTangent);

      // Scale according to smoothness
      newTangent.x *= ret_settings.smooth;
      newTangent.y *= ret_settings.smooth;

      // Temporary store tangent for next loop
      var tempTangent = new _ddMath_js__WEBPACK_IMPORTED_MODULE_2__["default"](newTangent.x, newTangent.y);

      // Translate and rotate
      newTangent.add(vec);
      newTangent.rotate(vec, -rot.angle + 180);
    } else {
      oldTangent = vec;
      newTangent = vec;
      tempTangent = vec;
    }

    // Add point to path
    if (!s) {
      // First point
      path.moveToPoint(NSMakePoint(vec.x, vec.y));
    } else {
      // Other points
      //[path curveToPoint:NSMakePoint(vec.x,vec.y) controlPoint1:NSMakePoint(oldTangent.x,oldTangent.y) controlPoint2:NSMakePoint(newTangent.x,newTangent.y)];
      path.curveToPoint_controlPoint1_controlPoint2(NSMakePoint(vec.x, vec.y), NSMakePoint(oldTangent.x, oldTangent.y), NSMakePoint(newTangent.x, newTangent.y));
    }

    // store tangent for next loop
    var oldTangent = new _ddMath_js__WEBPACK_IMPORTED_MODULE_2__["default"](tempTangent.x, tempTangent.y);
    if (trans.array.length && !s) {// Forget about first tangent when array is used
      //oldTangent = new Vector2d();
    }
    oldTangent.add(vec);
    oldTangent.rotate(vec, -rot.angle); // vec + rotation

    // Add steps
    rot.angle += rot.step;
    if (trans.array.length) {
      if (s != Math.floor(steps)) {
        trans.center = new _ddMath_js__WEBPACK_IMPORTED_MODULE_2__["default"](trans.array[s + 1].x, trans.array[s + 1].y);
      }
    } else {
      if (transition) {
        if (ret_settings.type == 4 && ret_settings.mirror) {
          trans.center.x += transition[s] * trans.total.x;
          trans.center.y += transition[s] * trans.total.y;
        } else {
          trans.center.x += transition[s] * trans.total.x;
          trans.center.y += transition[s] * trans.total.y;
        }
      } else {
        trans.center.add(trans.step);
      }
    }
    if (rad.array.length) {
      if (s != Math.floor(steps)) {
        rad.length = new _ddMath_js__WEBPACK_IMPORTED_MODULE_2__["default"](rad.array[s + 1].x, rad.array[s + 1].y);
      }
    } else {
      if (transition) {
        if (ret_settings.type == 4 && ret_settings.mirror) {
          // && ret_settings.timing == 'ease') {
          if (s < transition.length / 2) {
            rad.length.x += transition[s * 2] * rad.total.x * 2;
            rad.length.y += transition[s * 2] * rad.total.y * 2;
          } else {
            rad.length.x -= transition[(transition.length - 1 - s) * 2] * rad.total.x * 2;
            rad.length.y -= transition[(transition.length - 1 - s) * 2] * rad.total.y * 2;
          }
        } else {
          rad.length.x += transition[s] * rad.total.x;
          rad.length.y += transition[s] * rad.total.y;
        }
      } else {
        if (ret_settings.mirror) {
          if (s < steps / 2) {
            rad.length.x += rad.step.x * 2;
            rad.length.y += rad.step.y * 2;
          } else {
            rad.length.x -= rad.step.x * 2;
            rad.length.y -= rad.step.y * 2;
          }
        } else {
          rad.length.x += rad.step.x;
          rad.length.y += rad.step.y;
        }
      }
    }
  }

  // Finalise path
  var shape = MSShapePathLayer.layerWithPath(MSPath.pathWithBezierPath(path));
  var border = shape.style().addStylePartOfType(1);
  //border.color = MSColor.colorWithRGBADictionary({r: 0.1, g: 0.1, b: 1, a: 1});
  border.thickness = 1;
  shape.style().borderOptions().setLineCapStyle(1);
  // Set layer as type spiral
  Settings.setLayerSettingForKey(shape, uniqueSettingIdentifier, 'spiral');

  // SEEK layer by id to remove it
  var activeSpiral = Settings.settingForKey(uniqueSettingIdentifier);
  if (activeSpiral) {
    var spiralLayer = document.getLayerWithID(activeSpiral);
    spiralLayer.remove();
  }

  // Save new shape id
  Settings.setSettingForKey(uniqueSettingIdentifier, shape.objectID());
  if (ret_settings.parentID != '') {
    // Get the parent as js object
    var parent = document.getLayerWithID(ret_settings.parentID);
    // Make it native
    parent = parent.sketchObject;
    parent.addLayers([shape]);
  } else {
    // Make doc native
    document = document.sketchObject;
    document.currentPage().addLayers([shape]);
  }
}

//////////////////////////////////////////////
// 
// Clear selected objects on blur
// 
//////////////////////////////////////////////

function clearSelection(data) {
  // Get selected document and layers from Sketch API
  var document = sketch.getSelectedDocument();

  // Passed data from webview
  var ret_settings = data.settings;

  // Clear objects if clear is set
  if (ret_settings.pathID != '') {
    var pathId = document.getLayerWithID(ret_settings.pathID);
    pathId.remove();
  }
  if (ret_settings.startID != '') {
    var startID = document.getLayerWithID(ret_settings.startID);
    startID.remove();
  }
  if (ret_settings.endID != '') {
    var endID = document.getLayerWithID(ret_settings.endID);
    endID.remove();
  }
}

/***/ }),

/***/ "events":
/*!*************************!*\
  !*** external "events" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("events");

/***/ }),

/***/ "sketch":
/*!*************************!*\
  !*** external "sketch" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("sketch");

/***/ }),

/***/ "sketch/settings":
/*!**********************************!*\
  !*** external "sketch/settings" ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("sketch/settings");

/***/ }),

/***/ "sketch/ui":
/*!****************************!*\
  !*** external "sketch/ui" ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("sketch/ui");

/***/ })

/******/ });
    if (key === 'default' && typeof exports === 'function') {
      exports(context);
    } else if (typeof exports[key] !== 'function') {
      throw new Error('Missing export named "' + key + '". Your command should contain something like `export function " + key +"() {}`.');
    } else {
      exports[key](context);
    }
  } catch (err) {
    if (typeof process !== 'undefined' && process.listenerCount && process.listenerCount('uncaughtException')) {
      process.emit("uncaughtException", err, "uncaughtException");
    } else {
      throw err
    }
  }
}
globalThis['onRun'] = __skpm_run.bind(this, 'default');
globalThis['onShutdown'] = __skpm_run.bind(this, 'onShutdown');
globalThis['onSelectionChanged'] = __skpm_run.bind(this, 'onSelectionChanged')

//# sourceMappingURL=__ddSpiral.js.map