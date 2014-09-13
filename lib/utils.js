/**
 * Returns a function which triggers the given event.
 * 
 * @param {EventEmitter} emitter Emitter to trigger.
 * @param {String} event Event to emit.
 * @param {*...} [data] Optional data.
 * @returns {Function}
 */
var out$ = typeof exports != 'undefined' && exports || this, slice$ = [].slice;
out$.emitEvent = emitEvent;
function emitEvent(emitter){
  var data;
  data = slice$.call(arguments, 1);
  if (typeof (emitter != null ? emitter.emit : void 8) != 'function') {
    throw TypeError;
  }
  return function(){
    emitter.emit.apply(emitter, data);
  };
}
/**
 * Sets up two emitters so events fired by one are redispatched by the other
 * (passing along event data).
 * 
 * @param {EventEmitter} fromEmitter Source emitter for events.
 * @param {EventEmitter} toEmitter Emitter to repeat the events.
 * @param {String} [event='all'] Event to listen for redispatch.
 * @returns {Function} The redispach handler function (so you can unhook if necessary).
 */
out$.redispatch = redispatch;
function redispatch(fromEmitter, toEmitter, event){
  var handler;
  event == null && (event = 'all');
  if (!(typeof (fromEmitter != null ? fromEmitter.on : void 8) == 'function' && typeof (toEmitter != null ? toEmitter.emit : void 8) == 'function')) {
    throw TypeError;
  }
  handler = function(){
    toEmitter.emit.apply(toEmitter, arguments);
  };
  fromEmitter.on(event, handler);
  return handler;
}