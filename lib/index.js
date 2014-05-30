import$(exports, require('./chained-emitter'));
import$(exports, require('./emitter'));
import$(exports, require('./ready-emitter'));
import$(exports, require('./waiting-emitter'));
function import$(obj, src){
  var own = {}.hasOwnProperty;
  for (var key in src) if (own.call(src, key)) obj[key] = src[key];
  return obj;
}