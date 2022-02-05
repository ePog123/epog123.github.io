/* */ 
var $def = require('./$.def');
$def($def.P, 'Array', {fill: require('./$.array-fill')});
require('./$.add-to-unscopables')('fill');
