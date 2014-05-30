var EventEmitter, ChainedEmitter, out$ = typeof exports != 'undefined' && exports || this, slice$ = [].slice;
EventEmitter = require('./emitter').EventEmitter;
/**
 * @class An EventEmitter that re-dispatches events to its parent.
 * @extends EventEmitter
 */
out$.ChainedEmitter = ChainedEmitter = (function(superclass){
  ChainedEmitter.displayName = 'ChainedEmitter';
  var prototype = extend$(ChainedEmitter, superclass).prototype, constructor = ChainedEmitter;
  ChainedEmitter.__emitter_methods__ = EventEmitter.__emitter_methods__.concat(['parentEmitter']);
  /**
   * @constructor
   * @param {EventEmitter} [parent] Our parent emitter for bubbling.
   */
  function ChainedEmitter(parent){
    if (parent) {
      this.parentEmitter(parent);
    }
  }
  /**
   * @returns {null|EventEmitter} Current parent emitter.
   */
  /**
   * Setter for our parent emitter for bubbling.
   * @param {EventEmitter} parent New parent emitter.
   * @returns {this}
   */
  prototype.parentEmitter = function(parent){
    if (parent == null) {
      return this._parentEmitter;
    }
    this._parentEmitter = parent;
    return this;
  };
  /**
   * As EventEmitter::emit(), but patched to bubble to the
   * parent emitter (if possible), provided the event handler 
   * does not stop propagation by returning `false`.
   * 
   * @param {String} event Event to emit.
   * @param {...Any} args Arguments to pass to the event handlers.
   * @returns {Boolean} Whether propagation was stopped.
   */
  prototype.trigger = function(name){
    var args, bubble, queue, i$, len$, listener, ref$, ok, ref1$;
    args = slice$.call(arguments, 1);
    bubble = true;
    if (queue = (this._events || {})[name]) {
      for (i$ = 0, len$ = queue.length; i$ < len$; ++i$) {
        listener = queue[i$];
        bubble = listener.apply(this, args) !== false && bubble;
      }
    }
    if (bubble && typeof ((ref$ = this._parentEmitter) != null ? ref$.trigger : void 8) === 'function') {
      ok = (ref1$ = this._parentEmitter).trigger.apply(ref1$, arguments) || !!queue;
    }
    return ok;
  };
  prototype.emit = ChainedEmitter.prototype.trigger;
  return ChainedEmitter;
}(EventEmitter));
function extend$(sub, sup){
  function fun(){} fun.prototype = (sub.superclass = sup).prototype;
  (sub.prototype = new fun).constructor = sub;
  if (typeof sup.extended == 'function') sup.extended(sub);
  return sub;
}