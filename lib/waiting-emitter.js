var EventEmitter, WaitingEmitter;
EventEmitter = require('./emitter').EventEmitter;
/**
 * @class An EventEmitter with a ratchet-up waiting counter.
 * @extends Base
 */
exports.WaitingEmitter = WaitingEmitter = (function(superclass){
  WaitingEmitter.displayName = 'WaitingEmitter';
  var prototype = extend$(WaitingEmitter, superclass).prototype, constructor = WaitingEmitter;
  /**
   * Count of outstanding tasks.
   * @type Number
   */
  prototype._waitingOn = 0;
  /**
   * Increment the waiting task counter.
   * @returns {this}
   */
  prototype.wait = function(){
    var count;
    count = this._waitingOn || 0;
    this._waitingOn += 1;
    if (count === 0 && this._waitingOn > 0) {
      this.trigger('start-waiting', this);
    }
    return this;
  };
  /**
   * Decrement the waiting task counter.
   * @returns {this}
   */
  prototype.unwait = function(){
    var count;
    count = this._waitingOn || 0;
    this._waitingOn -= 1;
    if (this._waitingOn === 0 && count > 0) {
      this.trigger('stop-waiting', this);
    }
    return this;
  };
  /**
   * @param {Function} fn Function to wrap.
   * @returns {Function} A function wrapping the passed function with a call
   *  to `unwait()`, then delegating with current context and arguments.
   */
  prototype.unwaitAnd = function(fn){
    var self;
    self = this;
    return function(){
      self.unwait();
      return fn.apply(this, arguments);
    };
  };
  function WaitingEmitter(){}
  return WaitingEmitter;
}(EventEmitter));
function extend$(sub, sup){
  function fun(){} fun.prototype = (sub.superclass = sup).prototype;
  (sub.prototype = new fun).constructor = sub;
  if (typeof sup.extended == 'function') sup.extended(sub);
  return sub;
}