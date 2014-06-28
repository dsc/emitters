var ref$, eventsApi, triggerEvents, once, EventEmitter, ref1$, ref2$, e, ref3$, objToString, own, isArray, ownKeys;
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
    return objToString.call(o) === '[object Array]';
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
   *  - Does not implement methods `listeners` or `setMaxListeners`, or the static method `EventEmitter.listenerCount`.
   *  - Does not email `newListener` or `removeListener` events.
   *  - Additional static method `decorate`, which adds 
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
     */
    prototype.trigger = function(evt){
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
    prototype.emit = EventEmitter.prototype.trigger;
    prototype.on = function(evt, fn, context){
      var events;
      if (!(eventsApi(this, 'on', evt, [fn, context]) && fn)) {
        return this;
      }
      evt = {
        fn: fn,
        context: context,
        ctx: context || this
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
    prototype.once = function(evt, fn, context){
      var self, _once;
      if (!(eventsApi(this, 'once', evt, [fn, context]) && fn)) {
        return this;
      }
      self = this;
      _once = once(function(){
        self.off(evt, _once);
        return fn.apply(this, arguments);
      });
      _once._callback = fn;
      return this.on(evt, context, _once);
    };
    prototype.off = function(evt, fn, context){
      var evts, i$, len$, queue, newQueue, j$, len1$;
      if (!(this._events && eventsApi(this, 'off', evt, [fn, context]))) {
        return this;
      }
      if (!(evt || context || fn)) {
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
        if (!(fn || context)) {
          delete this._events[evt];
          continue;
        }
        newQueue = this._events[evt] = [];
        for (j$ = 0, len1$ = queue.length; j$ < len1$; ++j$) {
          evt = queue[j$];
          if ((fn && !(fn === evt.fn || fn === evt.fn._callback)) || (context && context !== evt.context)) {
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
      var events, queue;
      events = this._events || (this._events = {});
      queue = events[type] || (events[type] = []);
      if (!isArray(queue)) {
        queue = events[type] = [events[type]];
      }
      return queue;
    };
    function EventEmitter(){}
    return EventEmitter;
  }());
}
EventEmitter.__emitter_methods__ = ['emit', 'trigger', 'on', 'off', 'addListener', 'removeListener', 'removeAllListeners', 'once', 'listeners'];
EventEmitter.__class__ = EventEmitter;
EventEmitter.delegate = function(target, source, methods){
  var proto, i$, len$, k, method;
  if (!(source && target)) {
    return target;
  }
  proto = this.prototype;
  methods == null && (methods = this.__emitter_methods__);
  for (i$ = 0, len$ = methods.length; i$ < len$; ++i$) {
    k = methods[i$];
    method = source[k] || proto[k];
    if (typeof method === 'function') {
      target[k] = method.bind(source);
    }
  }
  return target;
};
EventEmitter.decorate = function(target, methods){
  var proto, i$, len$, k;
  proto = this.prototype;
  methods == null && (methods = this.__emitter_methods__);
  for (i$ = 0, len$ = methods.length; i$ < len$; ++i$) {
    k = methods[i$];
    target[k] = proto[k];
  }
  return target;
};
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