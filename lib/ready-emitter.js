var EventEmitter, ReadyEmitter, out$ = typeof exports != 'undefined' && exports || this;
EventEmitter = require('./emitter').EventEmitter;
/**
 * @class An EventEmitter that auto-triggers new handlers once "ready".
 * @extends EventEmitter
 */
out$.ReadyEmitter = ReadyEmitter = (function(superclass){
  ReadyEmitter.displayName = 'ReadyEmitter';
  var prototype = extend$(ReadyEmitter, superclass).prototype, constructor = ReadyEmitter;
  ReadyEmitter.__emitter_methods__ = EventEmitter.__emitter_methods__.concat(['ready']);
  /**
   * Whether this object is ready.
   * @type Boolean
   */
  prototype._ready = false;
  /**
   * Name of the ready event.
   * @type String
   */
  prototype.__ready_event__ = 'ready';
  /**
   * Getter for the ready state.
   * @returns {Boolean} Whether the emitter is ready or not.
   */
  /**
   * Registers a callback on ready; fired immediately if already ready.
   * @param {Function} callback The callback.
   * @returns {this}
   */
  /**
   * Setter for the ready state.
   * 
   * If truthy, this triggers the 'ready' event provided it has not yet been
   * triggered, and subsequent listeners added to this event will be 
   * auto-triggered.
   * 
   * If falsy, this resets the 'ready' event to its non-triggered state, firing a
   * 'ready-reset' event.
   * 
   * @param {Boolean} value Sets the ready state.
   * @param {Boolean} [force=false] Trigger the event even if already ready.
   * @returns {this}
   */
  prototype.ready = function(val, force){
    var event;
    force == null && (force = false);
    if (val == null) {
      return !!this._ready;
    }
    event = this.__ready_event__ || 'ready';
    if (typeof val == 'function') {
      return this.on(event, val);
    }
    val = !!val;
    if (val == this._ready && !force) {
      return this;
    }
    this._ready = val;
    if (!val) {
      event = event + "-reset";
    }
    this.emit(event, this);
    return this;
  };
  /**
   * Wrap {@link EventEmitter#on} registration to handle registrations
   * on 'ready' after we've broadcast the event. Handler will always still
   * be registered, however, in case the emitter is reset.
   * 
   * @param {String} events Space-separated events for which to register.
   * @param {Function} callback
   * @returns {this}
   */
  prototype.on = function(events, callback){
    var event, this$ = this;
    superclass.prototype.on.apply(this, arguments);
    event = this.__ready_event__ || 'ready';
    if (this.ready() && events.split(/\s+/).indexOf(event) > -1) {
      setTimeout(function(){
        return callback.call(this$, this$);
      });
    }
    return this;
  };
  prototype.addListener = ReadyEmitter.prototype.on;
  function ReadyEmitter(){}
  return ReadyEmitter;
}(EventEmitter));
function extend$(sub, sup){
  function fun(){} fun.prototype = (sub.superclass = sup).prototype;
  (sub.prototype = new fun).constructor = sub;
  if (typeof sup.extended == 'function') sup.extended(sub);
  return sub;
}