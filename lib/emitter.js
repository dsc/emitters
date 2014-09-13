var ref$, eventsApi, triggerEvents, once, EventEmitter, ref1$, ref2$, e, ref3$, objToString, own, isArray, ownKeys, DEFAULT_EVENT_EMITTER_METHODS, out$ = typeof exports != 'undefined' && exports || this;
ref$ = require('./emitter-helpers'), eventsApi = ref$.eventsApi, triggerEvents = ref$.triggerEvents, once = ref$.once;
try {
  EventEmitter = require('events').EventEmitter;
  EventEmitter.displayName || (EventEmitter.displayName = 'EventEmitter');
  (ref1$ = EventEmitter.prototype).trigger || (ref1$.trigger = EventEmitter.prototype.emit);
  (ref2$ = EventEmitter.prototype).off || (ref2$.off = EventEmitter.prototype.removeListener);
} catch (e$) {
  e = e$;
  ref3$ = Object.prototype, objToString = ref3$.toString, own = ref3$.hasOwnProperty;
  isArray = Array.isArray || function(o){
    return objToString.call(o) == '[object Array]';
  };
  ownKeys = Object.keys || function(o){
    var k, results$ = [];
    for (k in o) {
      if (own.call(o, k)) {
        results$.push(k);
      }
    }
    return results$;
  };
  /**
   * @class An event emitter.
   * 
   * Complies with most of the Node.js EventEmitter interface. Differences:
   *  - `on` and `once` both accept a context parameter, setting `this` for the callback.
   *  - `off` can filter on any/all of event name, callback, or context; `removeAllListeners` is just an alias.
   *  - Does not warn on max listeners (and `setMaxListeners()` just logs to console).
   *  - Does not emit `newListener` or `removeListener` events.
   *  - Additional static methods `delegate`, and `decorate` which adds 
   */
  EventEmitter = (function(){
    EventEmitter.displayName = 'EventEmitter';
    var prototype = EventEmitter.prototype, constructor = EventEmitter;
    /**
     * Triggers an event.
     * 
     * @param {String} evt Event name(s) to trigger.
     * @param {*} ...args Additional arguments.
     * @returns {this}
     * @alias trigger
     */
    prototype.emit = function(evt){
      var args, that;
      if (!this._events) {
        return this;
      }
      args = [].slice.call(arguments, 1);
      if (!eventsApi(this, 'trigger', evt, args)) {
        return this;
      }
      if (that = this._events[evt]) {
        triggerEvents(that, args);
      }
      if (that = this._events.all) {
        triggerEvents(that, arguments);
      }
      return this;
    };
    prototype.trigger = EventEmitter.prototype.emit;
    prototype.on = function(evt, fn, thisArg){
      var events;
      if (!(eventsApi(this, 'on', evt, [fn, thisArg]) && fn)) {
        return this;
      }
      evt = {
        fn: fn,
        thisArg: thisArg,
        ctx: thisArg || this
      };
      events = this._events || (this._events = {});
      if (!events[evt]) {
        events[evt] = [evt];
      } else {
        (events[evt] = queue.slice()).push(evt);
      }
      return this;
    };
    prototype.addListener = EventEmitter.prototype.on;
    prototype.once = function(evt, fn, thisArg){
      var self, _once;
      if (!(eventsApi(this, 'once', evt, [fn, thisArg]) && fn)) {
        return this;
      }
      self = this;
      _once = once(function(){
        self.off(evt, _once);
        return fn.apply(this, arguments);
      });
      _once.listener = fn;
      return this.on(evt, thisArg, _once);
    };
    prototype.off = function(evt, fn, thisArg){
      var evts, i$, len$, queue, newQueue, j$, len1$;
      if (!(this._events && eventsApi(this, 'off', evt, [fn, thisArg]))) {
        return this;
      }
      if (!(evt || thisArg || fn)) {
        this._events = {};
        return this;
      }
      evts = evt
        ? [evt]
        : ownKeys(this._events);
      for (i$ = 0, len$ = evts.length; i$ < len$; ++i$) {
        evt = evts[i$];
        if (!(queue = this._events[evt])) {
          continue;
        }
        if (!(fn || thisArg)) {
          delete this._events[evt];
          continue;
        }
        newQueue = this._events[evt] = [];
        for (j$ = 0, len1$ = queue.length; j$ < len1$; ++j$) {
          evt = queue[j$];
          if ((fn && !(fn === evt.fn || fn === evt.fn.listener)) || (thisArg && thisArg !== evt.thisArg)) {
            newQueue.push(evt);
          }
        }
        if (!newQueue.length) {
          delete this._events[evt];
        }
      }
      return this;
    };
    prototype.removeListener = EventEmitter.prototype.off;
    prototype.removeAllListeners = EventEmitter.prototype.off;
    prototype.listeners = function(type){
      var queue, ref$;
      queue = ((ref$ = this._events) != null ? ref$[type] : void 8) || [];
      if (!isArray(queue)) {
        queue = events[type] = [events[type]];
      }
      return queue;
    };
    prototype.setMaxListeners = function(n){
      return console.warn("EventEmitter::setMaxListeners() is unsupported!");
    };
    /**
     * @static
     * @param {EventEmitter} emitter
     * @param {String} evt
     * @returns {Number} The number of listeners on an emitter for a given event.
     */;
    EventEmitter.listenerCount = function(emitter, evt){
      var ref$, ref1$;
      return (emitter != null ? (ref$ = emitter._events) != null ? (ref1$ = ref$[evt]) != null ? ref1$.length : void 8 : void 8 : void 8) || 0;
    };
    function EventEmitter(){}
    return EventEmitter;
  }());
}
/**
 * List of method names used by `delegate` and `decorate` when 
 * @type String[]
 */
out$.DEFAULT_EVENT_EMITTER_METHODS = DEFAULT_EVENT_EMITTER_METHODS = ['emit', 'trigger', 'on', 'off', 'addListener', 'removeListener', 'removeAllListeners', 'once', 'listeners'];
/**
 * EventEmitter static methods.
 */
EventEmitter.__emitter_methods__ = DEFAULT_EVENT_EMITTER_METHODS;
EventEmitter.__class__ = EventEmitter;
/**
 * Copies methods from a given source EventEmitter onto a target object,
 * binding them to the original emitter. This allows the target to masquerade
 * as the emitter, or for several objects to share an emitter.
 * 
 * @static
 * @param {EventEmitter} source EventEmitter to borrow methods from.
 * @param {Object} target Object to attach methods to.
 * @param {String[]} [methods] List of method names to copy. Defaults
 *  to `__emitter_methods__` on the calling class, or failing
 *  that, `DEFAULT_EVENT_EMITTER_METHODS`.
 * @returns {Object} Target object.
 */
EventEmitter.delegate = function(source, target, methods){
  var proto, i$, len$, k, method;
  if (!(source && target)) {
    return target;
  }
  proto = this.prototype;
  methods == null && (methods = this.__emitter_methods__ || DEFAULT_EVENT_EMITTER_METHODS);
  for (i$ = 0, len$ = methods.length; i$ < len$; ++i$) {
    k = methods[i$];
    method = source[k] || proto[k];
    if (typeof method === 'function') {
      target[k] = method.bind(source);
    }
  }
  return target;
};
/**
 * Mixes methods from an EventEmitter class into the target object.
 * 
 * @static
 * @param {Object} target Object to mix methods into.
 * @param {String[]} [methods] List of method names to copy. Defaults
 *  to `__emitter_methods__` on the calling class, or failing
 *  that, `DEFAULT_EVENT_EMITTER_METHODS`.
 * @returns {Object} Target object.
 */
EventEmitter.decorate = function(target, methods){
  var proto, i$, len$, k;
  proto = this.prototype;
  methods == null && (methods = this.__emitter_methods__ || DEFAULT_EVENT_EMITTER_METHODS);
  for (i$ = 0, len$ = methods.length; i$ < len$; ++i$) {
    k = methods[i$];
    target[k] = proto[k];
  }
  return target;
};
/**
 * Coco metaprogramming hook, called whenever the Class is extended.
 * 
 * @private
 * @static
 * @param {Class} SubClass
 * @returns {Class} The Subclass.
 */
EventEmitter.extended = function(SubClass){
  var SuperClass, k, v, own$ = {}.hasOwnProperty;
  SuperClass = this;
  for (k in SuperClass) if (own$.call(SuperClass, k)) {
    v = SuperClass[k];
    if (!SubClass[k]) {
      SubClass[k] = v;
    }
  }
  SubClass.__class__ = SubClass;
  SubClass.__super__ = SuperClass.prototype;
  SubClass.__superclass__ = SuperClass;
  return SubClass;
};
exports.EventEmitter = EventEmitter;