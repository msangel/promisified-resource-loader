(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.jsonHash = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

exports.digest = digest;

var digest_ = require("./digest").digest;

var crypto_ = _interopRequire(require("./crypto"));

function digest(a) {
  var _ref = arguments[1] === undefined ? {} : arguments[1];

  var _ref$algorithm = _ref.algorithm;
  var algorithm = _ref$algorithm === undefined ? "sha1" : _ref$algorithm;
  var _ref$inputEncoding = _ref.inputEncoding;
  var inputEncoding = _ref$inputEncoding === undefined ? "utf8" : _ref$inputEncoding;
  var _ref$outputEncoding = _ref.outputEncoding;
  var outputEncoding = _ref$outputEncoding === undefined ? "hex" : _ref$outputEncoding;
  var _ref$crypto = _ref.crypto;
  var crypto = _ref$crypto === undefined ? crypto_ : _ref$crypto;
  var sets = _ref.sets;

  return digest_(a, { algorithm: algorithm, inputEncoding: inputEncoding, outputEncoding: outputEncoding, crypto: crypto, sets: sets });
}
Object.defineProperty(exports, "__esModule", {
  value: true
});

},{"./crypto":2,"./digest":3}],2:[function(require,module,exports){
"use strict";

// var INPUT_ENCODINGS = [ 'binary', 'ascii', 'utf8' ]
// var OUTPUT_ENCODINGS = [ 'binary', 'hex', 'base64' ]

function N(r, a, enc) {
  if (Array.isArray(a)) {
    var n = a.length;
    for (var i = 0; i < n; i++) {
      r.push(a[i]);
    }
  } else {
    if (enc === "utf8") {
      var b = unescape(encodeURIComponent(a));
      var n = b.length;
      for (var i = 0; i < n; i++) {
        r.push(b.charCodeAt(i));
      }
    } else {
      var n = a.length;
      for (var i = 0; i < n; i++) {
        var c = a.charCodeAt(i) & 255;
        r.push(c === 0 && enc === "ascii" ? 32 : c);
      }
    }
  }
}

var O = function O(a, c) {
  var r = null;
  var s = function s(e) {
    return String.fromCharCode(e);
  };
  var h = function h(e) {
    return e.toString(16);
  };
  switch (c) {
    case "binary":
      r = a.map(s).join("");break;
    case "base64":
      r = atob(a.map(s).join(""));break;
    default:
      r = a.map(h).join("");break;
  }
  return r;
};

var R = function R(n, s) {
  return n << s | n >>> 32 - s;
};

function SHA1(w) {

  var n = w.length;
  var M = 4294967295;
  var W = new Array(80);
  var H = [1732584193, 4023233417, 2562383102, 271733878, 3285377520];

  for (var b = 0; b < w.length; b += 16) {
    var A = H[0],
        B = H[1],
        C = H[2],
        D = H[3],
        E = H[4];

    for (var i = 0; i < 16; i++) {
      W[i] = w[b + i];
    }

    for (var i = 16; i <= 79; i++) {
      W[i] = R(W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16], 1);
    }

    for (var i = 0; i <= 19; i++) {
      var t = R(A, 5) + (B & C | ~B & D) + E + W[i] + 1518500249 & M;
      E = D;D = C;C = R(B, 30);B = A;A = t;
    }

    for (var i = 20; i <= 39; i++) {
      var t = R(A, 5) + (B ^ C ^ D) + E + W[i] + 1859775393 & M;
      E = D;D = C;C = R(B, 30);B = A;A = t;
    }

    for (var i = 40; i <= 59; i++) {
      var t = R(A, 5) + (B & C | B & D | C & D) + E + W[i] + 2400959708 & M;
      E = D;D = C;C = R(B, 30);B = A;A = t;
    }

    for (var i = 60; i <= 79; i++) {
      var t = R(A, 5) + (B ^ C ^ D) + E + W[i] + 3395469782 & M;
      E = D;D = C;C = R(B, 30);B = A;A = t;
    }

    H[0] = H[0] + A & M;
    H[1] = H[1] + B & M;
    H[2] = H[2] + C & M;
    H[3] = H[3] + D & M;
    H[4] = H[4] + E & M;
  }

  return H;
}

function createHash(algorithm) {
  var r = null;
  switch (algorithm) {

    // We support SHA1 only for now.
    case "sha1":
      r = createHashSHA1(algorithm);
      break;

    default:
      throw new Error("Digest method not supported.");
  }
  return r;
}

function createHashSHA1() {
  var m = 0;
  var c = [];
  var r = [];
  return {
    update: function update(a, e) {
      N(c, a, e);
    },
    digest: function digest(outputEncoding) {

      var n = c.length;
      for (var i = 0; i < n - 3; i += 4) {
        r.push(c[i] << 24 | c[i + 1] << 16 | c[i + 2] << 8 | c[i + 3]);
      }

      switch (n % 4) {
        case 0:
          r.push(2147483648);break;
        case 1:
          r.push(c[n - 1] << 24 | 8388608);break;
        case 2:
          r.push(c[n - 2] << 24 | c[n - 1] << 16 | 32768);break;
        case 3:
          r.push(c[n - 3] << 24 | c[n - 2] << 16 | c[n - 1] << 8 | 128);break;
      }
      while (r.length % 16 != 14) {
        r.push(0);
      }
      r.push(n >>> 29);
      r.push(n << 3 & 4294967295);

      // r.map(
      //   function (a) {
      //     var r = []
      //     for (var i = 7; i >= 0; --i) {
      //       r.push(((a >>> (i * 4)) & 0x0f).toString(16))
      //     }
      //     return r.join('')
      //   }
      // ).join('')

      return O(SHA1(r).reduce(function (r, a) {
        for (var i = 7; i >= 0; --i) {
          r.push(a >>> i * 4 & 15);
        }
        return r;
      }, []), outputEncoding);
    }
  };
}

// if (!module.parent) {
//   var h = createHashSHA1()
//   h.update('hello')
//   console.log(h.digest('hex'))
// }

module.exports = {
  createHash: createHash
};

},{}],3:[function(require,module,exports){
"use strict";

// Compute digest for JSON object.
exports.digest = digest;
function digest(a) {
  var _ref = arguments[1] === undefined ? {} : arguments[1];

  var _ref$algorithm = _ref.algorithm;
  var algorithm = _ref$algorithm === undefined ? "sha1" : _ref$algorithm;
  var _ref$inputEncoding = _ref.inputEncoding;
  var inputEncoding = _ref$inputEncoding === undefined ? "utf8" : _ref$inputEncoding;
  var _ref$outputEncoding = _ref.outputEncoding;
  var outputEncoding = _ref$outputEncoding === undefined ? "hex" : _ref$outputEncoding;
  var crypto = _ref.crypto;
  var sets = _ref.sets;

  var h = crypto.createHash(algorithm);
  var u = function () {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return h.update(args.join(":"), inputEncoding);
  };
  var d = function (a) {
    return digest(a, { algorithm: algorithm, inputEncoding: inputEncoding, outputEncoding: outputEncoding, crypto: crypto, sets: sets });
  };
  switch (true) {

    // undefined
    case typeof a === "undefined":
      u("u");
      break;

    // null
    case a === null:
      u("n");
      break;

    // boolean
    case typeof a === "boolean":
    case a instanceof Boolean:
      u("f", a.valueOf());
      break;

    // number
    case typeof a === "number":
    case a instanceof Number:
      u("i", "" + a);
      break;

    // string
    case typeof a === "string":
    case a instanceof String:
      u("s", "" + a);
      break;

    // symbol
    case typeof a === "symbol":
    case a instanceof Symbol:
      u("S", "" + a);
      break;

    // date
    case a instanceof Date:
      u("d", a.toISOString());
      break;

    // regexp
    case a instanceof RegExp:
      u("x", "" + a);
      break;

    // function
    case a instanceof Function:
      u("F", a.toString());
      break;

    // array
    case Array.isArray(a):
      if (sets) {
        u("<");
        a.map(d).sort().forEach(function (e) {
          return u("A", e);
        });
        u(">");
      } else {
        u("[");
        a.forEach(function (e) {
          return u("a", d(e));
        });
        u("]");
      }
      break;

    // object
    default:
      u("{");
      Object.keys(a).sort().forEach(function (k) {
        return u("k", d(k), "v", d(a[k]));
      });
      u("}");
      break;
  }
  return h.digest(outputEncoding);
}
Object.defineProperty(exports, "__esModule", {
  value: true
});

},{}]},{},[1])(1)
});
