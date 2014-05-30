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
     * @param {String} name Name of the event to trigger.
     * @param {*} ...args Additional arguments.
     * @returns {this} 
     */
    prototype.trigger = function(name){
      var args, that;
      if (!this._events) {
        return this;
      }
      args = [].slice.call(arguments, 1);
      if (!eventsApi(this, 'trigger', name, args)) {
        return this;
      }
      if (that = this._events[name]) {
        triggerEvents(that, args);
      }
      if (that = this._events.all) {
        triggerEvents(that, arguments);
      }
      return this;
    };
    prototype.emit = EventEmitter.prototype.trigger;
    prototype.on = function(name, fn, context){
      var evt, events;
      if (!(eventsApi(this, 'on', name, [fn, context]) && fn)) {
        return this;
      }
      evt = {
        fn: fn,
        context: context,
        ctx: context || this
      };
      events = this._events || (this._events = {});
      if (!events[name]) {
        events[name] = [evt];
      } else {
        (events[name] = queue.slice()).push(evt);
      }
      return this;
    };
    prototype.addListener = EventEmitter.prototype.on;
    prototype.once = function(name, fn, context){
      var self, _once;
      if (!(eventsApi(this, 'once', name, [fn, context]) && fn)) {
        return this;
      }
      self = this;
      _once = once(function(){
        self.off(name, _once);
        return fn.apply(this, arguments);
      });
      _once._callback = fn;
      return this.on(name, context, _once);
    };
    prototype.off = function(name, fn, context){
      var names, i$, len$, queue, newQueue, j$, len1$, evt;
      if (!(this._events && eventsApi(this, 'off', name, [fn, context]))) {
        return this;
      }
      if (!(name || context || fn)) {
        this._events = {};
        return this;
      }
      names = name
        ? [name]
        : ownKeys(this._events);
      for (i$ = 0, len$ = names.length; i$ < len$; ++i$) {
        name = names[i$];
        if (!(queue = this._events[name])) {
          continue;
        }
        if (!(fn || context)) {
          delete this._events[name];
          continue;
        }
        newQueue = this._events[name] = [];
        for (j$ = 0, len1$ = queue.length; j$ < len1$; ++j$) {
          evt = queue[j$];
          if ((fn && !(fn === evt.fn || fn === evt.fn._callback)) || (context && context !== evt.context)) {
            newQueue.push(evt);
          }
        }
        if (!newQueue.length) {
          delete this._events[name];
        }
      }
      return this;
    };
    prototype.removeListener = EventEmitter.prototype.off;
    prototype.removeAllListeners = EventEmitter.prototype.off;
    function EventEmitter(){}
    return EventEmitter;
  }());
}
EventEmitter.__emitter_methods__ = ['trigger', 'emit', 'on', 'addListener', 'once', 'off', 'removeListener', 'removeAllListeners'];
EventEmitter.delegate = function(target, source, methods){
  var EmitterProto, i$, len$, k, method;
  if (!(source && target)) {
    return target;
  }
  methods == null && (methods = this.constructor.__emitter_methods__);
  EmitterProto = this.prototype;
  for (i$ = 0, len$ = methods.length; i$ < len$; ++i$) {
    k = methods[i$];
    method = source[k] || EmitterProto[k];
    if (typeof method === 'function') {
      target[k] = method.bind(source);
    }
  }
  return target;
};
EventEmitter.decorate = function(target, methods){
  var EmitterProto, i$, len$, k;
  methods == null && (methods = this.constructor.__emitter_methods__);
  EmitterProto = this.prototype;
  for (i$ = 0, len$ = methods.length; i$ < len$; ++i$) {
    k = methods[i$];
    target[k] = EmitterProto[k];
  }
  return target;
};
exports.EventEmitter = EventEmitter;