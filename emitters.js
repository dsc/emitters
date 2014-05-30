!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.emitters=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
/*
 *      emitters -- v0.2.0
 *      (c) 20.2.0014 David Schoonover <dsc@less.ly>
 *      emitters is freely distributable under the MIT license.
 *      
 *      For all details and documentation:
 *      https://github.com/dsc/emitters
 */

exports.VERSION = '0.2.0';

import$(exports, _dereq_('./lib/emitter'));
import$(exports, _dereq_('./lib/chained-emitter'));
import$(exports, _dereq_('./lib/ready-emitter'));
import$(exports, _dereq_('./lib/waiting-emitter'));

function import$(obj, src){
  var own = {}.hasOwnProperty;
  for (var key in src) if (own.call(src, key)) obj[key] = src[key];
  return obj;
}

},{"./lib/chained-emitter":2,"./lib/emitter":4,"./lib/ready-emitter":5,"./lib/waiting-emitter":6}],2:[function(_dereq_,module,exports){
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
},{"./emitter":4}],3:[function(_dereq_,module,exports){
/**
 * @private
 */
var EVENT_SEP, eventsApi, triggerEvents, once, out$ = typeof exports != 'undefined' && exports || this;
EVENT_SEP = /\s+/;
out$.eventsApi = eventsApi = function(obj, action, names, rest){
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
};
out$.triggerEvents = triggerEvents = function(events, args){
  var a1, a2, a3, i$, len$, ev, j$, len1$, k$, len2$, l$, len3$, m$, len4$;
  a1 = args[0], a2 = args[1], a3 = args[2];
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
      ev.callback.call(ev.ctx, a1);
    }
    return;
  case 2:
    for (k$ = 0, len2$ = events.length; k$ < len2$; ++k$) {
      ev = events[k$];
      ev.callback.call(ev.ctx, a1, a2);
    }
    return;
  case 3:
    for (l$ = 0, len3$ = events.length; l$ < len3$; ++l$) {
      ev = events[l$];
      ev.callback.call(ev.ctx, a1, a2, a3);
    }
    return;
  default:
    for (m$ = 0, len4$ = events.length; m$ < len4$; ++m$) {
      ev = events[m$];
      ev.callback.apply(ev.ctx, args);
    }
  }
};
out$.once = once = function(fn){
  var ran, res;
  return function(){
    if (ran) {
      return result;
    }
    ran = true;
    res = fn.apply(this, arguments);
    fn = null;
    return result;
  };
};
},{}],4:[function(_dereq_,module,exports){
var ref$, eventsApi, triggerEvents, once, EventEmitter, ref1$, ref2$, e, ref3$, objToString, own, isArray, ownKeys;
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
},{"./emitter-helpers":3}],5:[function(_dereq_,module,exports){
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
    var evt;
    force == null && (force = false);
    if (val == null) {
      return !!this._ready;
    }
    if (typeof val === 'function') {
      return this.on(this.__ready_event__, val);
    }
    val = !!val;
    if (val === this._ready && !force) {
      return this;
    }
    this._ready = val;
    evt = this.__ready_event__;
    if (!val) {
      evt = evt + "-reset";
    }
    this.emit(evt, this);
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
    var this$ = this;
    superclass.prototype.on.apply(this, arguments);
    if (this.ready() && events.split(/\s+/).indexOf(this.__ready_event__) > -1) {
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
},{"./emitter":4}],6:[function(_dereq_,module,exports){
var EventEmitter, WaitingEmitter, out$ = typeof exports != 'undefined' && exports || this;
EventEmitter = _dereq_('./emitter').EventEmitter;
/**
 * @class An EventEmitter with a ratchet-up waiting counter.
 * @extends EventEmitter
 */
out$.WaitingEmitter = WaitingEmitter = (function(superclass){
  WaitingEmitter.displayName = 'WaitingEmitter';
  var prototype = extend$(WaitingEmitter, superclass).prototype, constructor = WaitingEmitter;
  WaitingEmitter.__emitter_methods__ = EventEmitter.__emitter_methods__.concat(['wait', 'unwait', 'unwaitAnd']);
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
},{"./emitter":4}]},{},[1])

(1)
});

//# sourceMappingURL=emitters.map