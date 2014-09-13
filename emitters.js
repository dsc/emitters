/*
 *      emitters -- 0.2.1
 *      (c) 2012-2014 David Schoonover <dsc@less.ly> (http://less.ly)
 *      emitters is freely distributable under the MIT license.
 *      
 *      For all details and documentation:
 *      http://github.com/dsc/emitters
 */
!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.emitters=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
var EventEmitter, ChainedEmitter, out$ = typeof exports != 'undefined' && exports || this, slice$ = [].slice;
EventEmitter = _dereq_('./emitter').EventEmitter;
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
},{"./emitter":3}],2:[function(_dereq_,module,exports){
/**
 * @private
 */
var EVENT_SEP, out$ = typeof exports != 'undefined' && exports || this;
EVENT_SEP = /\s+/;
out$.eventsApi = eventsApi;
function eventsApi(obj, action, names, rest){
  var key, val, i$, ref$, len$, name;
  if (!names) {
    return true;
  }
  if (typeof names === 'object') {
    for (key in names) {
      val = names[key];
      obj[action].apply(obj, [key, val].concat(rest));
    }
    return false;
  }
  if (EVENT_SEP.test(names)) {
    for (i$ = 0, len$ = (ref$ = names.split(EVENT_SEP)).length; i$ < len$; ++i$) {
      name = ref$[i$];
      obj[action].apply(obj, [name].concat(rest));
    }
    return false;
  }
  return true;
}
out$.triggerEvents = triggerEvents;
function triggerEvents(events, args){
  var i$, len$, ev, j$, len1$, k$, len2$, l$, len3$, m$, len4$, n$, len5$;
  switch (args.length) {
  case 0:
    for (i$ = 0, len$ = events.length; i$ < len$; ++i$) {
      ev = events[i$];
      ev.callback.call(ev.ctx);
    }
    return;
  case 1:
    for (j$ = 0, len1$ = events.length; j$ < len1$; ++j$) {
      ev = events[j$];
      ev.callback.call(ev.ctx, a[0]);
    }
    return;
  case 2:
    for (k$ = 0, len2$ = events.length; k$ < len2$; ++k$) {
      ev = events[k$];
      ev.callback.call(ev.ctx, a[0], a[1]);
    }
    return;
  case 3:
    for (l$ = 0, len3$ = events.length; l$ < len3$; ++l$) {
      ev = events[l$];
      ev.callback.call(ev.ctx, a[0], a[1], a[2]);
    }
    return;
  case 4:
    for (m$ = 0, len4$ = events.length; m$ < len4$; ++m$) {
      ev = events[m$];
      ev.callback.call(ev.ctx, a[0], a[1], a[2], a[3]);
    }
    return;
  default:
    for (n$ = 0, len5$ = events.length; n$ < len5$; ++n$) {
      ev = events[n$];
      ev.callback.apply(ev.ctx, args);
    }
    return;
  }
}
out$.once = once;
function once(fn){
  var ran, res;
  return function(){
    if (ran) {
      return res;
    }
    ran = true;
    res = fn.apply(this, arguments);
    fn = null;
    return res;
  };
}
},{}],3:[function(_dereq_,module,exports){
var ref$, eventsApi, triggerEvents, once, EventEmitter, ref1$, ref2$, e, ref3$, objToString, own, isArray, ownKeys, DEFAULT_EVENT_EMITTER_METHODS, out$ = typeof exports != 'undefined' && exports || this;
ref$ = _dereq_('./emitter-helpers'), eventsApi = ref$.eventsApi, triggerEvents = ref$.triggerEvents, once = ref$.once;
try {
  EventEmitter = _dereq_('events').EventEmitter;
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
},{"./emitter-helpers":2}],"bRhrlU":[function(_dereq_,module,exports){
exports.VERSION = '0.2.1';
import$(exports, _dereq_('./emitter'));
import$(exports, _dereq_('./chained-emitter'));
import$(exports, _dereq_('./ready-emitter'));
import$(exports, _dereq_('./waiting-emitter'));
import$(exports, _dereq_('./utils'));
exports.helpers = _dereq_('./emitter-helpers');
function import$(obj, src) {
  var own = {}.hasOwnProperty;
  for (var key in src)
    if (own.call(src, key))
      obj[key] = src[key];
  return obj;
}
},{"./chained-emitter":1,"./emitter":3,"./emitter-helpers":2,"./ready-emitter":6,"./utils":7,"./waiting-emitter":8}],"emitters":[function(_dereq_,module,exports){
module.exports=_dereq_('bRhrlU');
},{}],6:[function(_dereq_,module,exports){
var EventEmitter, ReadyEmitter, out$ = typeof exports != 'undefined' && exports || this;
EventEmitter = _dereq_('./emitter').EventEmitter;
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
},{"./emitter":3}],7:[function(_dereq_,module,exports){
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
},{}],8:[function(_dereq_,module,exports){
var EventEmitter, WaitingEmitter, out$ = typeof exports != 'undefined' && exports || this;
EventEmitter = _dereq_('./emitter').EventEmitter;
/**
 * @class An EventEmitter with a ratchet-up waiting counter.
 * @extends EventEmitter
 */
out$.WaitingEmitter = WaitingEmitter = (function(superclass){
  WaitingEmitter.displayName = 'WaitingEmitter';
  var prototype = extend$(WaitingEmitter, superclass).prototype, constructor = WaitingEmitter;
  WaitingEmitter.__emitter_methods__ = EventEmitter.__emitter_methods__.concat(['waitingOn', 'wait', 'unwait', 'unwaitAnd']);
  /**
   * Count of outstanding tasks.
   * @type Number
   * @protected
   */
  prototype._waitingOn = 0;
  /**
   * @returns {Number} Count of outstanding tasks.
   */
  prototype.waitingOn = function(){
    return this._waitingOn || 0;
  };
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
   * @param {Object} [thisArg] Optional context object to bind to fn.
   * @returns {Function} A function wrapping the passed function with a call
   *  to `unwait()`, then delegating with current context and arguments.
   */
  prototype.unwaitAnd = function(fn, thisArg){
    var self;
    self = this;
    return function(){
      var thisArg;
      self.unwait();
      thisArg == null && (thisArg = this);
      return fn.apply(thisArg, arguments);
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
},{"./emitter":3}]},{},["bRhrlU"])

("bRhrlU")
});

//# sourceMappingURL=emitters.map