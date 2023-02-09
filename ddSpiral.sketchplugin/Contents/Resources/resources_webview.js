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
/******/ 	return __webpack_require__(__webpack_require__.s = "./resources/webview.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./resources/webview.js":
/*!******************************!*\
  !*** ./resources/webview.js ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports) {

// Settings
var local = false;
var currentVersion = "v1.1.2";
var server = 'https://www.design-dude.nl/apps/ddSpiral/';
var selection = {
  type: 4,
  shape: '',
  isSpiral: false,
  pathID: '',
  startID: '',
  endID: '',
  parentID: '',
  theme: ''
};
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
var clearObjects = {
  startID: false,
  endID: false,
  pathID: false
};
var loops = 10;
var points = 4;
var timing = 'linear';
var smooth = 1;
var power = 1;
var clockwise = true;
var squeeze = false;
var mirror = false;
var auto = false;
var clear = false;
var hasFocus = false;
var update = false;
var elements = ['start_width', 'start_height', 'start_rotation', 'end_width', 'end_height', 'end_rotation', 'loops', 'points', 'timing', 'smooth', 'power', 'squeeze', 'clockwise', 'mirror', 'auto', 'clear'];

// Math extension
Math.decimal = function (num) {
  var precision = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  return Math.round(num * Math.pow(10, precision)) / Math.pow(10, precision);
};
Math.degrees = function (deg) {
  return (deg + 360) % 360;
};

// Default receiver from plugin
window.internalResponse = function (requestedData) {
  console.log('requestedData', requestedData);
};

// Page loaded
window.addEventListener("load", function () {
  say("Loading...", "#FF5B02");

  // Disable the context menu
  document.addEventListener('contextmenu', function (e) {
    // Disable for testing in Sketch
    // You start the inspector from the webview's context menu
    if (!local && e) {
      e.preventDefault();
    }
  });

  // Link to readme
  document.getElementById("github").addEventListener("click", function (e) {
    followLink("https://github.com/Design-Dude/ddSpiral/blob/main/README.md");
  });

  // Link to info from footer
  document.getElementById("coffeelink").style.display = "none";
  document.getElementById("coffeelink").setAttribute('goto', 'https://buymeacoffee.com/mastermek');
  document.getElementById("coffeelink").addEventListener("click", function (e) {
    var targetUrl = e.target.parentElement.getAttribute('goto');
    followLink(targetUrl);
  });

  // Get selection from plugin
  getSelection();

  // Set version
  setTimeout(function () {
    document.getElementById("ddVersion").setAttribute('version', currentVersion);
  }, 10);

  // Get info from server for footer info
  requestUpdateInfo(server + 'info.php').then(function (data) {
    data = JSON.parse(data);
    if (data && (data.action == 'update' || data.action == 'info')) {
      document.getElementById("bmac").innerHTML = data[0].info;
      document.getElementById("bmacimg").setAttribute('src', server + data[0].image);
      document.getElementById("bmacimgdark").setAttribute('src', server + data[0].image_dark);
      document.getElementById("coffeelink").setAttribute('goto', data[0].link);
    }
    var card = false;
    var isCurrentVersion = false;
    for (var c in data) {
      if (data[c] && data[c].version && (data[c].version === currentVersion || data[c].version === 'any')) {
        if (data[c].version === currentVersion) {
          isCurrentVersion = true;
        }
        if (card === false || card.version === 'any') {
          card = data[c];
        }
      }
    }
    if (isCurrentVersion && Math.random() < 0.5) {
      card = false;
    }
    if (card) {
      document.getElementById("bmac").innerHTML = card.info;
      if (card.image && card.image_dark) {
        document.getElementById("bmacimg").setAttribute('src', server + card.image);
        document.getElementById("bmacimgdark").setAttribute('src', server + card.image_dark);
      } else {
        document.getElementById("bmacimg").remove();
        document.getElementById("bmacimgdark").remove();
        document.getElementById("bmac").style.height = '44px';
        document.getElementById("bmac").style.paddingLeft = '0';
        document.getElementById("bmac").style.paddingTop = '9px';
      }
      document.getElementById("coffeelink").setAttribute('goto', card.link);
    }
    document.getElementById("coffeelink").style.display = "flex";
  }).catch(function (error) {
    document.getElementById("coffeelink").style.display = "flex";
  });
});

// Open link from webview
function followLink(url) {
  if (local) {
    console.log('followLink', url);
    window.open(url, "_followLink");
  } else {
    window.postMessage('followLink', url);
  }
}
var requestUpdateInfo = function requestUpdateInfo(url) {
  return new Promise(function (resolve, reject) {
    if (!url || url == '') {
      reject('No url provided');
    } else {
      fetch(url).then(function (response) {
        resolve(response.text());
      }).then(function (result) {
        resolve(result ? JSON.parse(result) : {});
      }).catch(function (error) {
        reject(error);
      });
    }
  });
};

// On plugin blur
window.addEventListener("blur", function (e) {
  hasFocus = false;
  allOff();
  if (clear) {
    // Collect clear settings
    var _settings = {
      pathID: clearObjects.pathID,
      startID: clearObjects.startID,
      endID: clearObjects.endID
    };
    // Create message
    var message = {
      settings: _settings,
      action: "clear"
    };
    if (!local) {
      // Send message to plugin
      window.postMessage('internalRequest', JSON.stringify(message));
    } else {
      allOn();
    }
    clear = false;
    document.getElementById('clear').checked = clear;
  }
});

// On plugin focus
window.addEventListener("focus", function (e) {
  hasFocus = true;
  if (!local) {
    window.postMessage('internalRequest', JSON.stringify({
      action: "getSelection"
    }));
  }
  allOn();
});

// Send
document.getElementById("button").addEventListener("click", function (e) {
  e.preventDefault();
  spiralise();
});

//	Add ENTER key shortcut
document.body.addEventListener("keyup", function (e) {
  if (e.keyCode !== 13) return;
  spiralise();
});

// Tell plugin to draw spiral
function spiralise() {
  // Next submit will be an update
  document.getElementById("button").innerHTML = "Update";
  update = true;
  // Set world rotation back to local
  start_val.deg = Math.degrees(start_val.deg - start_val.worldDeg);
  end_val.deg = Math.degrees(end_val.deg - end_val.worldDeg);
  // Collect settings
  var settings = {
    loops: loops,
    points: points,
    smooth: smooth,
    timing: timing,
    power: power,
    squeeze: document.getElementById('squeeze').disabled == false && squeeze ? true : false,
    mirror: document.getElementById('mirror').disabled == false && mirror ? true : false,
    clockwise: clockwise,
    auto: auto,
    type: selection.type,
    pathID: selection.pathID,
    startID: selection.startID,
    endID: selection.endID,
    parentID: selection.parentID
  };
  // Create message
  var message = {
    start_val: start_val,
    end_val: end_val,
    settings: settings,
    action: "spiralise"
  };
  if (!local) {
    // Send message to plugin
    window.postMessage('internalRequest', JSON.stringify(message));
  } else {
    console.log('spiralise', message);
  }
  allOn();
  // Reset world rotation for next update
  start_val.deg = Math.degrees(start_val.deg + start_val.worldDeg);
  end_val.deg = Math.degrees(end_val.deg + end_val.worldDeg);
}

// Ask plugin for selected objects
function getSelection() {
  if (local) {
    // local test data
    handleSelection({
      selection: {
        type: 2,
        shape: '',
        isSpiral: true,
        theme: '',
        startID: '',
        endID: '',
        pathID: '',
        parentID: ''
      },
      start_val: {
        x: 0,
        y: 0,
        w: 51,
        h: 52,
        deg: 0,
        worldDeg: 0
      },
      end_val: {
        x: 0,
        y: 0,
        w: 50,
        h: 50,
        deg: 0,
        worldDeg: 0
      }
    });
  } else {
    window.postMessage('internalRequest', JSON.stringify({
      action: "getSelection"
    }));
  }
}

// Set form info with selection info from plugin
window.setSelection = function (requestedData) {
  handleSelection(requestedData);
};

// Handle selection response
function handleSelection(response) {
  document.getElementById("button").innerHTML = "Spiralise!";
  update = false;
  selection = response.selection;
  start_val = response.start_val;
  end_val = response.end_val;
  loops = selection.loops != 'undefined' && selection.loops ? selection.loops : loops;
  document.getElementById('loops').value = loops;
  points = selection.points != 'undefined' && selection.points ? selection.points : points;
  document.getElementById('points').value = points;
  smooth = selection.smooth != 'undefined' && selection.smooth ? selection.smooth : smooth;
  document.getElementById('smooth').value = smooth;
  timing = selection.timing != 'undefined' && selection.timing ? selection.timing : timing;
  document.getElementById('timing').value = timing;
  power = selection.power != 'undefined' && selection.power ? selection.power : power;
  document.getElementById('power').value = power;
  squeeze = selection.squeeze != 'undefined' ? selection.squeeze : squeeze;
  if (squeeze && (selection.type == 1 || selection.type > 3)) squeeze = false;
  if (selection.type == 2 && !squeeze) selection.type = 3;
  document.getElementById('squeeze').checked = squeeze;
  mirror = selection.mirror != 'undefined' ? selection.mirror : mirror;
  document.getElementById('mirror').checked = mirror;
  clockwise = selection.clockwise != 'undefined' ? selection.clockwise : clockwise;
  document.getElementById('clockwise').checked = clockwise;
  auto = selection.auto != 'undefined' ? selection.auto : auto;
  document.getElementById('auto').checked = auto;
  if (selection.type == 4 && mirror) {
    switchStart();
  }
  // Use world rotation (easier for user - wysiwyg)
  start_val.deg = Math.degrees(start_val.deg + start_val.worldDeg);
  end_val.deg = Math.degrees(end_val.deg + end_val.worldDeg);
  // Fill form
  document.getElementById('start_width').value = Math.decimal(start_val.w, 2);
  document.getElementById('start_height').value = Math.decimal(start_val.h, 2);
  document.getElementById('start_rotation').value = Math.decimal(start_val.deg, 2);
  document.getElementById('end_width').value = Math.decimal(end_val.w, 2);
  document.getElementById('end_height').value = Math.decimal(end_val.h, 2);
  document.getElementById('end_rotation').value = Math.decimal(end_val.deg, 2);
  // Update user info text
  setTypeText();
  // Set theme
  settings.theme = selection.theme;
  if (settings.theme === 'dark') {
    document.body.classList.add("dark");
  } else {
    document.body.classList.remove("dark");
  }
  // Focus
  if (hasFocus && selection.type) {
    allOn();
  } else {
    allOff();
  }
}

// Switch start & end
function switchStart() {
  var w = start_val.w;
  var h = start_val.h;
  var d = start_val.deg;
  start_val.w = end_val.w;
  start_val.h = end_val.h;
  start_val.deg = end_val.deg;
  end_val.w = w;
  end_val.h = h;
  end_val.deg = d;
}

// Spiral types and user info's
function setTypeText() {
  // object count
  // no of shapes
  // no of objects
  // no of open paths
  // squeeze: count=1 shape=1 class!=rect
  var objType = selection.isSpiral ? 'spiral!' : 'line';
  switch (selection.type) {
    case 1:
      // single object, not a shape
      say('Wind <span>around the center</span> of that object', settings.theme === 'dark' ? '#DFDFDF' : 'black');
      break;
    case 2:
      // single shape, squeeze
      say('Force <span>inside</span> that ' + selection.shape, settings.theme === 'dark' ? '#DFDFDF' : 'black');
      break;
    case 3:
      // single shape, no squeeze
      say('Bend <span>around the center</span> of that ' + selection.shape, settings.theme === 'dark' ? '#DFDFDF' : 'black');
      break;
    case 4:
      // zero or single object + open path (center ease allowed)
      say('Twist <span>around</span> that ' + objType, settings.theme === 'dark' ? '#DFDFDF' : 'black');
      break;
    case 5:
      // two objects, no open path
      say('Stretch <span>between</span> those objects', settings.theme === 'dark' ? '#DFDFDF' : 'black');
      break;
    case 6:
      // open path=1, object+shape=>1
      say('Curve <span>along the route</span> of that ' + objType, settings.theme === 'dark' ? '#DFDFDF' : 'black');
      break;
    default:
      say('<span>Select at least 1 and at most 2 objects and/or an open path!</span>', '#FF5B02');
      allOff();
  }
}

// Inform user
function say(txt, col) {
  document.getElementById('info').innerHTML = txt;
  document.getElementById('info').style.color = col;
}

// Disable all form elements
function allOff() {
  for (var i = 0; i < elements.length; i++) {
    document.getElementById(elements[i]).setAttribute('disabled', '');
    if (!selection.type || squeeze && (elements[i].indexOf('start') > -1 || elements[i].indexOf('end') > -1) || (selection.type < 2 || selection.type > 3) && elements[i] == 'squeeze') {
      document.getElementById(elements[i]).style.opacity = elements[i] == 'squeeze' || elements[i] == 'clockwise' || elements[i] == 'mirror' || elements[i] == 'auto' || elements[i] == 'clear' ? 0.5 : 0;
    } else {
      document.getElementById(elements[i]).style.opacity = elements[i] == 'squeeze' || elements[i] == 'clockwise' || elements[i] == 'mirror' || elements[i] == 'auto' || elements[i] == 'clear' ? 0.5 : 0.3;
    }
    var parent = document.getElementById(elements[i]).parentElement;
    if (parent.classList.contains('textfield')) {
      parent.setAttribute('disabled', 'disabled');
      parent.style.backgroundColor = settings.theme === 'dark' ? '#282828' : '#F6F6F6';
    }
  }
  document.getElementById('link_start').setAttribute('disabled', 'disabled');
  document.getElementById('link_start').style.opacity = 0.3;
  document.getElementById('link_end').setAttribute('disabled', 'disabled');
  document.getElementById('link_end').style.opacity = 0.3;
  document.getElementById('button').setAttribute('disabled', 'disabled');
  document.getElementById('button').style.opacity = 0.3;
  document.getElementById('squeeze_text').style.opacity = 0.2;
  document.getElementById('clockwise_text').style.opacity = 0.2;
  document.getElementById('mirror_text').style.opacity = 0.2;
  document.getElementById('auto_text').style.opacity = 0.2;
  document.getElementById('clear_text').style.opacity = 0.2;
}

// Enable all active form elements
function allOn() {
  var squeeze = document.getElementById('squeeze').checked;
  document.getElementById('mirror_text').style.opacity = 1;
  for (var i = 0; i < elements.length; i++) {
    if (elements[i] == 'power' && timing == 'linear') {
      document.getElementById(elements[i]).setAttribute('disabled', '');
      document.getElementById(elements[i]).style.opacity = 0;
      var parent = document.getElementById(elements[i]).parentElement;
      if (parent.classList.contains('textfield')) {
        parent.setAttribute('disabled', 'disabled');
        parent.style.backgroundColor = settings.theme === 'dark' ? '#282828' : '#F6F6F6';
      }
    } else if (elements[i] == 'mirror' && selection.type != 4) {
      document.getElementById(elements[i]).disabled = true;
      document.getElementById('mirror_text').style.opacity = 0.2;
    } else if (squeeze && (elements[i].indexOf('start') > -1 || elements[i].indexOf('end') > -1) || (selection.type < 2 || selection.type > 3) && elements[i] == 'squeeze') {
      document.getElementById(elements[i]).setAttribute('disabled', '');
      document.getElementById(elements[i]).style.opacity = elements[i] == 'squeeze' || elements[i] == 'clockwise' ? 0.5 : 0;
      var _parent = document.getElementById(elements[i]).parentElement;
      if (_parent.classList.contains('textfield')) {
        _parent.setAttribute('disabled', 'disabled');
        _parent.style.backgroundColor = settings.theme === 'dark' ? '#282828' : '#F6F6F6';
      }
    } else {
      document.getElementById(elements[i]).disabled = false;
      document.getElementById(elements[i]).style.opacity = 1;
      var _parent2 = document.getElementById(elements[i]).parentElement;
      if (_parent2.classList.contains('textfield')) {
        _parent2.setAttribute('disabled', '');
        _parent2.style.backgroundColor = settings.theme === 'dark' ? '#2E2E2E' : '#EDEDED';
      }
    }
  }
  if (squeeze) {
    document.getElementById('link_start').setAttribute('disabled', 'disabled');
    document.getElementById('link_start').style.opacity = 0.3;
    document.getElementById('link_end').setAttribute('disabled', 'disabled');
    document.getElementById('link_end').style.opacity = 0.3;
  } else {
    document.getElementById('link_start').setAttribute('disabled', '');
    document.getElementById('link_start').style.opacity = 1;
    document.getElementById('link_end').setAttribute('disabled', '');
    document.getElementById('link_end').style.opacity = 1;
  }
  if (auto && update) {
    document.getElementById('button').setAttribute('disabled', 'disabled');
    document.getElementById('button').style.opacity = 0.3;
  } else {
    document.getElementById('button').disabled = false;
    document.getElementById('button').style.opacity = 1;
  }
  if (selection.type == 2 || selection.type == 3) {
    document.getElementById('squeeze_text').style.opacity = 1;
  } else {
    document.getElementById('squeeze_text').style.opacity = 0.2;
  }
  document.getElementById('clockwise_text').style.opacity = 1;
  if (selection.type == 4 && mirror) {
    document.getElementById('start_text').innerHTML = 'Start / end';
    document.getElementById('end_text').innerHTML = 'Half way';
  } else {
    document.getElementById('start_text').innerHTML = 'Start';
    document.getElementById('end_text').innerHTML = 'End';
  }
  document.getElementById('auto_text').style.opacity = 1;
  if (update) {
    document.getElementById('clear_text').style.opacity = 1;
    document.getElementById('clear').disabled = false;
    document.getElementById('clear').style.opacity = 1;
  } else {
    document.getElementById('clear_text').style.opacity = 0.2;
    document.getElementById('clear').setAttribute('disabled', '');
  }
}

// Handle form elements
document.getElementById("start_width").addEventListener("change", function (e) {
  var newVal = Math.decimal(Math.abs(parseFloat(e.target.value)), 2);
  if (isNaN(newVal)) newVal = start_val.w;
  e.target.value = newVal;
  var link = document.getElementById("link_start").className;
  if (link == 'linked') {
    if (start_val.w == 0 && start_val.h == 0) {
      start_val.h = newVal;
      document.getElementById("start_height").value = start_val.h;
    } else {
      var f = start_val.w ? newVal / start_val.w : 1;
      start_val.h = Math.decimal(start_val.h * f, 2);
      document.getElementById("start_height").value = start_val.h;
    }
  }
  start_val.w = newVal;
  if (auto && update) {
    spiralise();
  }
});
document.getElementById("start_height").addEventListener("change", function (e) {
  var newVal = Math.decimal(Math.abs(parseFloat(e.target.value)), 2);
  if (isNaN(newVal)) newVal = start_val.h;
  e.target.value = newVal;
  var link = document.getElementById("link_start").className;
  if (link == 'linked') {
    if (start_val.w == 0 && start_val.h == 0) {
      start_val.w = newVal;
      document.getElementById("start_width").value = start_val.w;
    } else {
      var f = start_val.h ? newVal / start_val.h : 1;
      start_val.w = Math.decimal(start_val.w * f, 2);
      document.getElementById("start_width").value = start_val.w;
    }
  }
  start_val.h = newVal;
  if (auto && update) {
    spiralise();
  }
});
document.getElementById("start_rotation").addEventListener("change", function (e) {
  var newVal = Math.decimal((parseFloat(e.target.value) + 3600) % 360, 2);
  if (isNaN(newVal)) newVal = start_val.deg;
  e.target.value = newVal;
  start_val.deg = newVal;
  if (auto && update) {
    spiralise();
  }
});
document.getElementById("link_start_container").addEventListener("click", function (e) {
  if (document.getElementById("link_start").getAttribute('disabled') != 'disabled') {
    var link = document.getElementById("link_start").className;
    if (link == 'linked') {
      document.getElementById("link_start").className = 'unlinked';
    } else {
      document.getElementById("link_start").className = 'linked';
    }
  }
});
// end
document.getElementById("end_width").addEventListener("change", function (e) {
  var newVal = Math.decimal(Math.abs(parseFloat(e.target.value)), 2);
  if (isNaN(newVal)) newVal = end_val.w;
  e.target.value = newVal;
  var link = document.getElementById("link_end").className;
  if (link == 'linked') {
    if (end_val.w == 0 && end_val.h == 0) {
      end_val.h = newVal;
      document.getElementById("end_height").value = end_val.h;
    } else {
      var f = end_val.w ? newVal / end_val.w : 1;
      end_val.h = Math.decimal(end_val.h * f, 2);
      document.getElementById("end_height").value = end_val.h;
    }
  }
  end_val.w = newVal;
  if (auto && update) {
    spiralise();
  }
});
document.getElementById("end_height").addEventListener("change", function (e) {
  var newVal = Math.decimal(Math.abs(parseFloat(e.target.value)), 2);
  if (isNaN(newVal)) newVal = end_val.h;
  e.target.value = newVal;
  var link = document.getElementById("link_end").className;
  if (link == 'linked') {
    if (end_val.w == 0 && end_val.h == 0) {
      end_val.w = newVal;
      document.getElementById("end_width").value = end_val.w;
    } else {
      var f = end_val.h ? newVal / end_val.h : 1;
      end_val.w = Math.decimal(end_val.w * f, 2);
      document.getElementById("end_width").value = end_val.w;
    }
  }
  end_val.h = newVal;
  if (auto && update) {
    spiralise();
  }
});
document.getElementById("end_rotation").addEventListener("change", function (e) {
  var newVal = Math.decimal((parseFloat(e.target.value) + 3600) % 360, 2);
  if (isNaN(newVal)) newVal = end_val.deg;
  e.target.value = newVal;
  end_val.deg = newVal;
  if (auto && update) {
    spiralise();
  }
});
document.getElementById("link_end_container").addEventListener("click", function (e) {
  if (document.getElementById("link_end").getAttribute('disabled') != 'disabled') {
    var link = document.getElementById("link_end").className;
    if (link == 'linked') {
      document.getElementById("link_end").className = 'unlinked';
    } else {
      document.getElementById("link_end").className = 'linked';
    }
  }
});
document.getElementById("loops").addEventListener("change", function (e) {
  var newVal = Math.decimal(Math.abs(parseFloat(e.target.value)), 2);
  if (isNaN(newVal)) newVal = loops;
  if (newVal > 250) newVal = 250; // max 250 loops
  if (newVal <= 0.25) newVal = 0.25;
  loops = newVal;
  e.target.value = loops;
  if (auto && update) {
    spiralise();
  }
});
document.getElementById("points").addEventListener("change", function (e) {
  var newVal = Math.abs(Math.round(parseFloat(e.target.value)));
  if (isNaN(newVal)) newVal = points;
  if (newVal > 250) newVal = 250; // max 250 tangents
  if (newVal < 2) newVal = 2;
  points = newVal;
  e.target.value = points;
  if (auto && update) {
    spiralise();
  }
});
document.getElementById("timing").addEventListener("change", function (e) {
  timing = e.target.value;
  allOn();
  if (auto && update) {
    spiralise();
  }
});
document.getElementById("mirror").addEventListener("change", function (e) {
  if (selection.type == 4) {
    switchStart();
    document.getElementById('start_width').value = Math.decimal(start_val.w, 2);
    document.getElementById('start_height').value = Math.decimal(start_val.h, 2);
    document.getElementById('start_rotation').value = Math.decimal(start_val.deg, 2);
    document.getElementById('end_width').value = Math.decimal(end_val.w, 2);
    document.getElementById('end_height').value = Math.decimal(end_val.h, 2);
    document.getElementById('end_rotation').value = Math.decimal(end_val.deg, 2);
    mirror = !mirror;
    allOn();
    if (auto && update) {
      spiralise();
    }
  }
});
document.getElementById("smooth").addEventListener("change", function (e) {
  var newVal = Math.decimal(parseFloat(e.target.value), 2);
  if (isNaN(newVal)) newVal = smooth;
  if (newVal > 10) newVal = 10;
  if (newVal < 0) newVal = 0;
  smooth = newVal;
  e.target.value = smooth;
  if (auto && update) {
    spiralise();
  }
});
document.getElementById("power").addEventListener("change", function (e) {
  var newVal = Math.decimal(parseFloat(e.target.value), 2);
  if (isNaN(newVal)) newVal = smooth;
  if (newVal > 10) newVal = 10;
  if (newVal < 0) newVal = 0;
  power = newVal;
  e.target.value = power;
  if (auto && update) {
    spiralise();
  }
});
document.getElementById("squeeze").addEventListener("change", function (e) {
  squeeze = e.target.checked;
  if (squeeze && selection.type == 3) selection.type = 2;
  if (!squeeze && selection.type == 2) selection.type = 3;
  setTypeText();
  allOn();
  if (auto && update) {
    spiralise();
  }
});
document.getElementById("clockwise").addEventListener("change", function (e) {
  clockwise = e.target.checked;
  if (auto && update) {
    spiralise();
  }
});
document.getElementById("auto").addEventListener("change", function (e) {
  auto = e.target.checked;
  allOn();
  if (auto && update) {
    spiralise();
  }
});
document.getElementById("clear").addEventListener("change", function (e) {
  clear = e.target.checked;
  if (clear) {
    clearObjects.startID = selection.startID;
    clearObjects.endID = selection.endID;
    clearObjects.pathID = selection.pathID;
  }
});

/***/ })

/******/ });
//# sourceMappingURL=resources_webview.js.map