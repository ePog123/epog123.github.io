/* */ 
'use strict';
var $def = require('./$.def');
$def($def.P, 'Array', {copyWithin: require('./$.array-copy-within')});
require('./$.add-to-unscopables')('copyWithin');
