/*
 *      emitters -- v0.2.0
 *      (c) 20.2.0014 David Schoonover <dsc@less.ly>
 *      emitters is freely distributable under the MIT license.
 *      
 *      For all details and documentation:
 *      https://github.com/dsc/emitters
 */

exports.VERSION = '0.2.0';

import$(exports, require('./lib/emitter'));
import$(exports, require('./lib/chained-emitter'));
import$(exports, require('./lib/ready-emitter'));
import$(exports, require('./lib/waiting-emitter'));

function import$(obj, src){
  var own = {}.hasOwnProperty;
  for (var key in src) if (own.call(src, key)) obj[key] = src[key];
  return obj;
}
