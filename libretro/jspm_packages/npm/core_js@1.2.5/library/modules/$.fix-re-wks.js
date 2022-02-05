/* */ 
'use strict';
var hide = require('./$.hide'),
    redef = require('./$.redef'),
    fails = require('./$.fails'),
    defined = require('./$.defined'),
    wks = require('./$.wks');
module.exports = function(KEY, length, exec) {
  var SYMBOL = wks(KEY),
      original = ''[KEY];
  if (fails(function() {
    var O = {};
    O[SYMBOL] = function() {
      return 7;
    };
    return ''[KEY](O) != 7;
  })) {
    redef(String.prototype, KEY, exec(defined, SYMBOL, original));
    hide(RegExp.prototype, SYMBOL, length == 2 ? function(string, arg) {
      return original.call(string, this, arg);
    } : function(string) {
      return original.call(string, this);
    });
  }
};
