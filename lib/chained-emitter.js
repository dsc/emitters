var EventEmitter, ChainedEmitter, slice$ = [].slice;
EventEmitter = require('./emitter').EventEmitter;
exports.ChainedEmitter = ChainedEmitter = (function(superclass){
  /**
   * @constructor
   */
  ChainedEmitter.displayName = 'ChainedEmitter';
  var prototype = extend$(ChainedEmitter, superclass).prototype, constructor = ChainedEmitter;
  function ChainedEmitter(parent){
    if (parent) {
      this.parentEmitter(parent);
    }
  }
  prototype.parentEmitter = function(parent){
    if (parent == null) {
      return this._parentEmitter;
    }
    this._parentEmitter = parent;
    return this;
  };
  prototype.emit = function(event){
    var args, queue, bubble, i$, len$, listener, ref$, ok;
    args = slice$.call(arguments, 1);
    queue = (this._events || {})[event];
    bubble = true;
    if (queue) {
      if (typeof queue === 'function') {
        queue = [queue];
      }
      for (i$ = 0, len$ = queue.length; i$ < len$; ++i$) {
        listener = queue[i$];
        bubble = listener.apply(this, args) !== false && bubble;
      }
    }
    if (this._parentEmitter && bubble) {
      ok = (ref$ = this._parentEmitter).emit.apply(ref$, arguments) || !!queue;
    }
    return ok;
  };
  prototype.trigger = ChainedEmitter.prototype.emit;
  return ChainedEmitter;
}(EventEmitter));
function extend$(sub, sup){
  function fun(){} fun.prototype = (sub.superclass = sup).prototype;
  (sub.prototype = new fun).constructor = sub;
  if (typeof sup.extended == 'function') sup.extended(sub);
  return sub;
}