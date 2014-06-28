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
},{}],3:[function(_dereq_,module,exports){
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
},{"./emitter-helpers":2}],"bRhrlU":[function(_dereq_,module,exports){
exports.VERSION = '0.2.1';
import$(exports, _dereq_('./emitter'));
import$(exports, _dereq_('./chained-emitter'));
import$(exports, _dereq_('./ready-emitter'));
import$(exports, _dereq_('./waiting-emitter'));
exports.helpers = _dereq_('./emitter-helpers');
function import$(obj, src) {
  var own = {}.hasOwnProperty;
  for (var key in src)
    if (own.call(src, key))
      obj[key] = src[key];
  return obj;
}
},{"./chained-emitter":1,"./emitter":3,"./emitter-helpers":2,"./ready-emitter":6,"./waiting-emitter":7}],"emitters":[function(_dereq_,module,exports){
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
},{"./emitter":3}]},{},["bRhrlU"])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvdXNyL2xvY2FsL2xpYi9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiL1VzZXJzL2RzYy9kZXYvcHJvamVjdHMvZW1pdHRlcnMvbGliL2NoYWluZWQtZW1pdHRlci5qcyIsIi9Vc2Vycy9kc2MvZGV2L3Byb2plY3RzL2VtaXR0ZXJzL2xpYi9lbWl0dGVyLWhlbHBlcnMuanMiLCIvVXNlcnMvZHNjL2Rldi9wcm9qZWN0cy9lbWl0dGVycy9saWIvZW1pdHRlci5qcyIsIi9Vc2Vycy9kc2MvZGV2L3Byb2plY3RzL2VtaXR0ZXJzL2xpYi9pbmRleC5qcyIsIi9Vc2Vycy9kc2MvZGV2L3Byb2plY3RzL2VtaXR0ZXJzL2xpYi9yZWFkeS1lbWl0dGVyLmpzIiwiL1VzZXJzL2RzYy9kZXYvcHJvamVjdHMvZW1pdHRlcnMvbGliL3dhaXRpbmctZW1pdHRlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkxBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpfXZhciBmPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChmLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGYsZi5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIgRXZlbnRFbWl0dGVyLCBDaGFpbmVkRW1pdHRlciwgb3V0JCA9IHR5cGVvZiBleHBvcnRzICE9ICd1bmRlZmluZWQnICYmIGV4cG9ydHMgfHwgdGhpcywgc2xpY2UkID0gW10uc2xpY2U7XG5FdmVudEVtaXR0ZXIgPSByZXF1aXJlKCcuL2VtaXR0ZXInKS5FdmVudEVtaXR0ZXI7XG4vKipcbiAqIEBjbGFzcyBBbiBFdmVudEVtaXR0ZXIgdGhhdCByZS1kaXNwYXRjaGVzIGV2ZW50cyB0byBpdHMgcGFyZW50LlxuICogQGV4dGVuZHMgRXZlbnRFbWl0dGVyXG4gKi9cbm91dCQuQ2hhaW5lZEVtaXR0ZXIgPSBDaGFpbmVkRW1pdHRlciA9IChmdW5jdGlvbihzdXBlcmNsYXNzKXtcbiAgQ2hhaW5lZEVtaXR0ZXIuZGlzcGxheU5hbWUgPSAnQ2hhaW5lZEVtaXR0ZXInO1xuICB2YXIgcHJvdG90eXBlID0gZXh0ZW5kJChDaGFpbmVkRW1pdHRlciwgc3VwZXJjbGFzcykucHJvdG90eXBlLCBjb25zdHJ1Y3RvciA9IENoYWluZWRFbWl0dGVyO1xuICBDaGFpbmVkRW1pdHRlci5fX2VtaXR0ZXJfbWV0aG9kc19fID0gRXZlbnRFbWl0dGVyLl9fZW1pdHRlcl9tZXRob2RzX18uY29uY2F0KFsncGFyZW50RW1pdHRlciddKTtcbiAgLyoqXG4gICAqIEBjb25zdHJ1Y3RvclxuICAgKiBAcGFyYW0ge0V2ZW50RW1pdHRlcn0gW3BhcmVudF0gT3VyIHBhcmVudCBlbWl0dGVyIGZvciBidWJibGluZy5cbiAgICovXG4gIGZ1bmN0aW9uIENoYWluZWRFbWl0dGVyKHBhcmVudCl7XG4gICAgaWYgKHBhcmVudCkge1xuICAgICAgdGhpcy5wYXJlbnRFbWl0dGVyKHBhcmVudCk7XG4gICAgfVxuICB9XG4gIC8qKlxuICAgKiBAcmV0dXJucyB7bnVsbHxFdmVudEVtaXR0ZXJ9IEN1cnJlbnQgcGFyZW50IGVtaXR0ZXIuXG4gICAqL1xuICAvKipcbiAgICogU2V0dGVyIGZvciBvdXIgcGFyZW50IGVtaXR0ZXIgZm9yIGJ1YmJsaW5nLlxuICAgKiBAcGFyYW0ge0V2ZW50RW1pdHRlcn0gcGFyZW50IE5ldyBwYXJlbnQgZW1pdHRlci5cbiAgICogQHJldHVybnMge3RoaXN9XG4gICAqL1xuICBwcm90b3R5cGUucGFyZW50RW1pdHRlciA9IGZ1bmN0aW9uKHBhcmVudCl7XG4gICAgaWYgKHBhcmVudCA9PSBudWxsKSB7XG4gICAgICByZXR1cm4gdGhpcy5fcGFyZW50RW1pdHRlcjtcbiAgICB9XG4gICAgdGhpcy5fcGFyZW50RW1pdHRlciA9IHBhcmVudDtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcbiAgLyoqXG4gICAqIEFzIEV2ZW50RW1pdHRlcjo6ZW1pdCgpLCBidXQgcGF0Y2hlZCB0byBidWJibGUgdG8gdGhlXG4gICAqIHBhcmVudCBlbWl0dGVyIChpZiBwb3NzaWJsZSksIHByb3ZpZGVkIHRoZSBldmVudCBoYW5kbGVyIFxuICAgKiBkb2VzIG5vdCBzdG9wIHByb3BhZ2F0aW9uIGJ5IHJldHVybmluZyBgZmFsc2VgLlxuICAgKiBcbiAgICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50IEV2ZW50IHRvIGVtaXQuXG4gICAqIEBwYXJhbSB7Li4uQW55fSBhcmdzIEFyZ3VtZW50cyB0byBwYXNzIHRvIHRoZSBldmVudCBoYW5kbGVycy5cbiAgICogQHJldHVybnMge0Jvb2xlYW59IFdoZXRoZXIgcHJvcGFnYXRpb24gd2FzIHN0b3BwZWQuXG4gICAqL1xuICBwcm90b3R5cGUudHJpZ2dlciA9IGZ1bmN0aW9uKG5hbWUpe1xuICAgIHZhciBhcmdzLCBidWJibGUsIHF1ZXVlLCBpJCwgbGVuJCwgbGlzdGVuZXIsIHJlZiQsIG9rLCByZWYxJDtcbiAgICBhcmdzID0gc2xpY2UkLmNhbGwoYXJndW1lbnRzLCAxKTtcbiAgICBidWJibGUgPSB0cnVlO1xuICAgIGlmIChxdWV1ZSA9ICh0aGlzLl9ldmVudHMgfHwge30pW25hbWVdKSB7XG4gICAgICBmb3IgKGkkID0gMCwgbGVuJCA9IHF1ZXVlLmxlbmd0aDsgaSQgPCBsZW4kOyArK2kkKSB7XG4gICAgICAgIGxpc3RlbmVyID0gcXVldWVbaSRdO1xuICAgICAgICBidWJibGUgPSBsaXN0ZW5lci5hcHBseSh0aGlzLCBhcmdzKSAhPT0gZmFsc2UgJiYgYnViYmxlO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoYnViYmxlICYmIHR5cGVvZiAoKHJlZiQgPSB0aGlzLl9wYXJlbnRFbWl0dGVyKSAhPSBudWxsID8gcmVmJC50cmlnZ2VyIDogdm9pZCA4KSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgb2sgPSAocmVmMSQgPSB0aGlzLl9wYXJlbnRFbWl0dGVyKS50cmlnZ2VyLmFwcGx5KHJlZjEkLCBhcmd1bWVudHMpIHx8ICEhcXVldWU7XG4gICAgfVxuICAgIHJldHVybiBvaztcbiAgfTtcbiAgcHJvdG90eXBlLmVtaXQgPSBDaGFpbmVkRW1pdHRlci5wcm90b3R5cGUudHJpZ2dlcjtcbiAgcmV0dXJuIENoYWluZWRFbWl0dGVyO1xufShFdmVudEVtaXR0ZXIpKTtcbmZ1bmN0aW9uIGV4dGVuZCQoc3ViLCBzdXApe1xuICBmdW5jdGlvbiBmdW4oKXt9IGZ1bi5wcm90b3R5cGUgPSAoc3ViLnN1cGVyY2xhc3MgPSBzdXApLnByb3RvdHlwZTtcbiAgKHN1Yi5wcm90b3R5cGUgPSBuZXcgZnVuKS5jb25zdHJ1Y3RvciA9IHN1YjtcbiAgaWYgKHR5cGVvZiBzdXAuZXh0ZW5kZWQgPT0gJ2Z1bmN0aW9uJykgc3VwLmV4dGVuZGVkKHN1Yik7XG4gIHJldHVybiBzdWI7XG59IiwiLyoqXG4gKiBAcHJpdmF0ZVxuICovXG52YXIgRVZFTlRfU0VQLCBldmVudHNBcGksIHRyaWdnZXJFdmVudHMsIG9uY2UsIG91dCQgPSB0eXBlb2YgZXhwb3J0cyAhPSAndW5kZWZpbmVkJyAmJiBleHBvcnRzIHx8IHRoaXM7XG5FVkVOVF9TRVAgPSAvXFxzKy87XG5vdXQkLmV2ZW50c0FwaSA9IGV2ZW50c0FwaSA9IGZ1bmN0aW9uKG9iaiwgYWN0aW9uLCBuYW1lcywgcmVzdCl7XG4gIHZhciBrZXksIHZhbCwgaSQsIHJlZiQsIGxlbiQsIG5hbWU7XG4gIGlmICghbmFtZXMpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICBpZiAodHlwZW9mIG5hbWVzID09PSAnb2JqZWN0Jykge1xuICAgIGZvciAoa2V5IGluIG5hbWVzKSB7XG4gICAgICB2YWwgPSBuYW1lc1trZXldO1xuICAgICAgb2JqW2FjdGlvbl0uYXBwbHkob2JqLCBba2V5LCB2YWxdLmNvbmNhdChyZXN0KSk7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBpZiAoRVZFTlRfU0VQLnRlc3QobmFtZXMpKSB7XG4gICAgZm9yIChpJCA9IDAsIGxlbiQgPSAocmVmJCA9IG5hbWVzLnNwbGl0KEVWRU5UX1NFUCkpLmxlbmd0aDsgaSQgPCBsZW4kOyArK2kkKSB7XG4gICAgICBuYW1lID0gcmVmJFtpJF07XG4gICAgICBvYmpbYWN0aW9uXS5hcHBseShvYmosIFtuYW1lXS5jb25jYXQocmVzdCkpO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgcmV0dXJuIHRydWU7XG59O1xub3V0JC50cmlnZ2VyRXZlbnRzID0gdHJpZ2dlckV2ZW50cyA9IGZ1bmN0aW9uKGV2ZW50cywgYXJncyl7XG4gIHZhciBhMSwgYTIsIGEzLCBpJCwgbGVuJCwgZXYsIGokLCBsZW4xJCwgayQsIGxlbjIkLCBsJCwgbGVuMyQsIG0kLCBsZW40JDtcbiAgYTEgPSBhcmdzWzBdLCBhMiA9IGFyZ3NbMV0sIGEzID0gYXJnc1syXTtcbiAgc3dpdGNoIChhcmdzLmxlbmd0aCkge1xuICBjYXNlIDA6XG4gICAgZm9yIChpJCA9IDAsIGxlbiQgPSBldmVudHMubGVuZ3RoOyBpJCA8IGxlbiQ7ICsraSQpIHtcbiAgICAgIGV2ID0gZXZlbnRzW2kkXTtcbiAgICAgIGV2LmNhbGxiYWNrLmNhbGwoZXYuY3R4KTtcbiAgICB9XG4gICAgcmV0dXJuO1xuICBjYXNlIDE6XG4gICAgZm9yIChqJCA9IDAsIGxlbjEkID0gZXZlbnRzLmxlbmd0aDsgaiQgPCBsZW4xJDsgKytqJCkge1xuICAgICAgZXYgPSBldmVudHNbaiRdO1xuICAgICAgZXYuY2FsbGJhY2suY2FsbChldi5jdHgsIGExKTtcbiAgICB9XG4gICAgcmV0dXJuO1xuICBjYXNlIDI6XG4gICAgZm9yIChrJCA9IDAsIGxlbjIkID0gZXZlbnRzLmxlbmd0aDsgayQgPCBsZW4yJDsgKytrJCkge1xuICAgICAgZXYgPSBldmVudHNbayRdO1xuICAgICAgZXYuY2FsbGJhY2suY2FsbChldi5jdHgsIGExLCBhMik7XG4gICAgfVxuICAgIHJldHVybjtcbiAgY2FzZSAzOlxuICAgIGZvciAobCQgPSAwLCBsZW4zJCA9IGV2ZW50cy5sZW5ndGg7IGwkIDwgbGVuMyQ7ICsrbCQpIHtcbiAgICAgIGV2ID0gZXZlbnRzW2wkXTtcbiAgICAgIGV2LmNhbGxiYWNrLmNhbGwoZXYuY3R4LCBhMSwgYTIsIGEzKTtcbiAgICB9XG4gICAgcmV0dXJuO1xuICBkZWZhdWx0OlxuICAgIGZvciAobSQgPSAwLCBsZW40JCA9IGV2ZW50cy5sZW5ndGg7IG0kIDwgbGVuNCQ7ICsrbSQpIHtcbiAgICAgIGV2ID0gZXZlbnRzW20kXTtcbiAgICAgIGV2LmNhbGxiYWNrLmFwcGx5KGV2LmN0eCwgYXJncyk7XG4gICAgfVxuICB9XG59O1xub3V0JC5vbmNlID0gb25jZSA9IGZ1bmN0aW9uKGZuKXtcbiAgdmFyIHJhbiwgcmVzO1xuICByZXR1cm4gZnVuY3Rpb24oKXtcbiAgICBpZiAocmFuKSB7XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cbiAgICByYW4gPSB0cnVlO1xuICAgIHJlcyA9IGZuLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgZm4gPSBudWxsO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG59OyIsInZhciByZWYkLCBldmVudHNBcGksIHRyaWdnZXJFdmVudHMsIG9uY2UsIEV2ZW50RW1pdHRlciwgcmVmMSQsIHJlZjIkLCBlLCByZWYzJCwgb2JqVG9TdHJpbmcsIG93biwgaXNBcnJheSwgb3duS2V5cztcbnJlZiQgPSByZXF1aXJlKCcuL2VtaXR0ZXItaGVscGVycycpLCBldmVudHNBcGkgPSByZWYkLmV2ZW50c0FwaSwgdHJpZ2dlckV2ZW50cyA9IHJlZiQudHJpZ2dlckV2ZW50cywgb25jZSA9IHJlZiQub25jZTtcbnRyeSB7XG4gIEV2ZW50RW1pdHRlciA9IHJlcXVpcmUoJ2V2ZW50cycpLkV2ZW50RW1pdHRlcjtcbiAgRXZlbnRFbWl0dGVyLmRpc3BsYXlOYW1lIHx8IChFdmVudEVtaXR0ZXIuZGlzcGxheU5hbWUgPSAnRXZlbnRFbWl0dGVyJyk7XG4gIChyZWYxJCA9IEV2ZW50RW1pdHRlci5wcm90b3R5cGUpLnRyaWdnZXIgfHwgKHJlZjEkLnRyaWdnZXIgPSBFdmVudEVtaXR0ZXIucHJvdG90eXBlLmVtaXQpO1xuICAocmVmMiQgPSBFdmVudEVtaXR0ZXIucHJvdG90eXBlKS5vZmYgfHwgKHJlZjIkLm9mZiA9IEV2ZW50RW1pdHRlci5wcm90b3R5cGUucmVtb3ZlTGlzdGVuZXIpO1xufSBjYXRjaCAoZSQpIHtcbiAgZSA9IGUkO1xuICByZWYzJCA9IE9iamVjdC5wcm90b3R5cGUsIG9ialRvU3RyaW5nID0gcmVmMyQudG9TdHJpbmcsIG93biA9IHJlZjMkLmhhc093blByb3BlcnR5O1xuICBpc0FycmF5ID0gQXJyYXkuaXNBcnJheSB8fCBmdW5jdGlvbihvKXtcbiAgICByZXR1cm4gb2JqVG9TdHJpbmcuY2FsbChvKSA9PT0gJ1tvYmplY3QgQXJyYXldJztcbiAgfTtcbiAgb3duS2V5cyA9IE9iamVjdC5rZXlzIHx8IGZ1bmN0aW9uKG8pe1xuICAgIHZhciBrLCByZXN1bHRzJCA9IFtdO1xuICAgIGZvciAoayBpbiBvKSB7XG4gICAgICBpZiAob3duLmNhbGwobywgaykpIHtcbiAgICAgICAgcmVzdWx0cyQucHVzaChrKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdHMkO1xuICB9O1xuICAvKipcbiAgICogQGNsYXNzIEFuIGV2ZW50IGVtaXR0ZXIuXG4gICAqIFxuICAgKiBDb21wbGllcyB3aXRoIG1vc3Qgb2YgdGhlIE5vZGUuanMgRXZlbnRFbWl0dGVyIGludGVyZmFjZS4gRGlmZmVyZW5jZXM6XG4gICAqICAtIGBvbmAgYW5kIGBvbmNlYCBib3RoIGFjY2VwdCBhIGNvbnRleHQgcGFyYW1ldGVyLCBzZXR0aW5nIGB0aGlzYCBmb3IgdGhlIGNhbGxiYWNrLlxuICAgKiAgLSBgb2ZmYCBjYW4gZmlsdGVyIG9uIGFueS9hbGwgb2YgZXZlbnQgbmFtZSwgY2FsbGJhY2ssIG9yIGNvbnRleHQ7IGByZW1vdmVBbGxMaXN0ZW5lcnNgIGlzIGp1c3QgYW4gYWxpYXMuXG4gICAqICAtIERvZXMgbm90IGltcGxlbWVudCBtZXRob2RzIGBsaXN0ZW5lcnNgIG9yIGBzZXRNYXhMaXN0ZW5lcnNgLCBvciB0aGUgc3RhdGljIG1ldGhvZCBgRXZlbnRFbWl0dGVyLmxpc3RlbmVyQ291bnRgLlxuICAgKiAgLSBEb2VzIG5vdCBlbWFpbCBgbmV3TGlzdGVuZXJgIG9yIGByZW1vdmVMaXN0ZW5lcmAgZXZlbnRzLlxuICAgKiAgLSBBZGRpdGlvbmFsIHN0YXRpYyBtZXRob2QgYGRlY29yYXRlYCwgd2hpY2ggYWRkcyBcbiAgICovXG4gIEV2ZW50RW1pdHRlciA9IChmdW5jdGlvbigpe1xuICAgIEV2ZW50RW1pdHRlci5kaXNwbGF5TmFtZSA9ICdFdmVudEVtaXR0ZXInO1xuICAgIHZhciBwcm90b3R5cGUgPSBFdmVudEVtaXR0ZXIucHJvdG90eXBlLCBjb25zdHJ1Y3RvciA9IEV2ZW50RW1pdHRlcjtcbiAgICAvKipcbiAgICAgKiBUcmlnZ2VycyBhbiBldmVudC5cbiAgICAgKiBcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gZXZ0IEV2ZW50IG5hbWUocykgdG8gdHJpZ2dlci5cbiAgICAgKiBAcGFyYW0geyp9IC4uLmFyZ3MgQWRkaXRpb25hbCBhcmd1bWVudHMuXG4gICAgICogQHJldHVybnMge3RoaXN9IFxuICAgICAqL1xuICAgIHByb3RvdHlwZS50cmlnZ2VyID0gZnVuY3Rpb24oZXZ0KXtcbiAgICAgIHZhciBhcmdzLCB0aGF0O1xuICAgICAgaWYgKCF0aGlzLl9ldmVudHMpIHtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICB9XG4gICAgICBhcmdzID0gW10uc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xuICAgICAgaWYgKCFldmVudHNBcGkodGhpcywgJ3RyaWdnZXInLCBldnQsIGFyZ3MpKSB7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfVxuICAgICAgaWYgKHRoYXQgPSB0aGlzLl9ldmVudHNbZXZ0XSkge1xuICAgICAgICB0cmlnZ2VyRXZlbnRzKHRoYXQsIGFyZ3MpO1xuICAgICAgfVxuICAgICAgaWYgKHRoYXQgPSB0aGlzLl9ldmVudHMuYWxsKSB7XG4gICAgICAgIHRyaWdnZXJFdmVudHModGhhdCwgYXJndW1lbnRzKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG4gICAgcHJvdG90eXBlLmVtaXQgPSBFdmVudEVtaXR0ZXIucHJvdG90eXBlLnRyaWdnZXI7XG4gICAgcHJvdG90eXBlLm9uID0gZnVuY3Rpb24oZXZ0LCBmbiwgY29udGV4dCl7XG4gICAgICB2YXIgZXZlbnRzO1xuICAgICAgaWYgKCEoZXZlbnRzQXBpKHRoaXMsICdvbicsIGV2dCwgW2ZuLCBjb250ZXh0XSkgJiYgZm4pKSB7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfVxuICAgICAgZXZ0ID0ge1xuICAgICAgICBmbjogZm4sXG4gICAgICAgIGNvbnRleHQ6IGNvbnRleHQsXG4gICAgICAgIGN0eDogY29udGV4dCB8fCB0aGlzXG4gICAgICB9O1xuICAgICAgZXZlbnRzID0gdGhpcy5fZXZlbnRzIHx8ICh0aGlzLl9ldmVudHMgPSB7fSk7XG4gICAgICBpZiAoIWV2ZW50c1tldnRdKSB7XG4gICAgICAgIGV2ZW50c1tldnRdID0gW2V2dF07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAoZXZlbnRzW2V2dF0gPSBxdWV1ZS5zbGljZSgpKS5wdXNoKGV2dCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuICAgIHByb3RvdHlwZS5hZGRMaXN0ZW5lciA9IEV2ZW50RW1pdHRlci5wcm90b3R5cGUub247XG4gICAgcHJvdG90eXBlLm9uY2UgPSBmdW5jdGlvbihldnQsIGZuLCBjb250ZXh0KXtcbiAgICAgIHZhciBzZWxmLCBfb25jZTtcbiAgICAgIGlmICghKGV2ZW50c0FwaSh0aGlzLCAnb25jZScsIGV2dCwgW2ZuLCBjb250ZXh0XSkgJiYgZm4pKSB7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfVxuICAgICAgc2VsZiA9IHRoaXM7XG4gICAgICBfb25jZSA9IG9uY2UoZnVuY3Rpb24oKXtcbiAgICAgICAgc2VsZi5vZmYoZXZ0LCBfb25jZSk7XG4gICAgICAgIHJldHVybiBmbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgfSk7XG4gICAgICBfb25jZS5fY2FsbGJhY2sgPSBmbjtcbiAgICAgIHJldHVybiB0aGlzLm9uKGV2dCwgY29udGV4dCwgX29uY2UpO1xuICAgIH07XG4gICAgcHJvdG90eXBlLm9mZiA9IGZ1bmN0aW9uKGV2dCwgZm4sIGNvbnRleHQpe1xuICAgICAgdmFyIGV2dHMsIGkkLCBsZW4kLCBxdWV1ZSwgbmV3UXVldWUsIGokLCBsZW4xJDtcbiAgICAgIGlmICghKHRoaXMuX2V2ZW50cyAmJiBldmVudHNBcGkodGhpcywgJ29mZicsIGV2dCwgW2ZuLCBjb250ZXh0XSkpKSB7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfVxuICAgICAgaWYgKCEoZXZ0IHx8IGNvbnRleHQgfHwgZm4pKSB7XG4gICAgICAgIHRoaXMuX2V2ZW50cyA9IHt9O1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgIH1cbiAgICAgIGV2dHMgPSBldnRcbiAgICAgICAgPyBbZXZ0XVxuICAgICAgICA6IG93bktleXModGhpcy5fZXZlbnRzKTtcbiAgICAgIGZvciAoaSQgPSAwLCBsZW4kID0gZXZ0cy5sZW5ndGg7IGkkIDwgbGVuJDsgKytpJCkge1xuICAgICAgICBldnQgPSBldnRzW2kkXTtcbiAgICAgICAgaWYgKCEocXVldWUgPSB0aGlzLl9ldmVudHNbZXZ0XSkpIHtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIShmbiB8fCBjb250ZXh0KSkge1xuICAgICAgICAgIGRlbGV0ZSB0aGlzLl9ldmVudHNbZXZ0XTtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgICBuZXdRdWV1ZSA9IHRoaXMuX2V2ZW50c1tldnRdID0gW107XG4gICAgICAgIGZvciAoaiQgPSAwLCBsZW4xJCA9IHF1ZXVlLmxlbmd0aDsgaiQgPCBsZW4xJDsgKytqJCkge1xuICAgICAgICAgIGV2dCA9IHF1ZXVlW2okXTtcbiAgICAgICAgICBpZiAoKGZuICYmICEoZm4gPT09IGV2dC5mbiB8fCBmbiA9PT0gZXZ0LmZuLl9jYWxsYmFjaykpIHx8IChjb250ZXh0ICYmIGNvbnRleHQgIT09IGV2dC5jb250ZXh0KSkge1xuICAgICAgICAgICAgbmV3UXVldWUucHVzaChldnQpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoIW5ld1F1ZXVlLmxlbmd0aCkge1xuICAgICAgICAgIGRlbGV0ZSB0aGlzLl9ldmVudHNbZXZ0XTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcbiAgICBwcm90b3R5cGUucmVtb3ZlTGlzdGVuZXIgPSBFdmVudEVtaXR0ZXIucHJvdG90eXBlLm9mZjtcbiAgICBwcm90b3R5cGUucmVtb3ZlQWxsTGlzdGVuZXJzID0gRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5vZmY7XG4gICAgcHJvdG90eXBlLmxpc3RlbmVycyA9IGZ1bmN0aW9uKHR5cGUpe1xuICAgICAgdmFyIGV2ZW50cywgcXVldWU7XG4gICAgICBldmVudHMgPSB0aGlzLl9ldmVudHMgfHwgKHRoaXMuX2V2ZW50cyA9IHt9KTtcbiAgICAgIHF1ZXVlID0gZXZlbnRzW3R5cGVdIHx8IChldmVudHNbdHlwZV0gPSBbXSk7XG4gICAgICBpZiAoIWlzQXJyYXkocXVldWUpKSB7XG4gICAgICAgIHF1ZXVlID0gZXZlbnRzW3R5cGVdID0gW2V2ZW50c1t0eXBlXV07XG4gICAgICB9XG4gICAgICByZXR1cm4gcXVldWU7XG4gICAgfTtcbiAgICBmdW5jdGlvbiBFdmVudEVtaXR0ZXIoKXt9XG4gICAgcmV0dXJuIEV2ZW50RW1pdHRlcjtcbiAgfSgpKTtcbn1cbkV2ZW50RW1pdHRlci5fX2VtaXR0ZXJfbWV0aG9kc19fID0gWydlbWl0JywgJ3RyaWdnZXInLCAnb24nLCAnb2ZmJywgJ2FkZExpc3RlbmVyJywgJ3JlbW92ZUxpc3RlbmVyJywgJ3JlbW92ZUFsbExpc3RlbmVycycsICdvbmNlJywgJ2xpc3RlbmVycyddO1xuRXZlbnRFbWl0dGVyLl9fY2xhc3NfXyA9IEV2ZW50RW1pdHRlcjtcbkV2ZW50RW1pdHRlci5kZWxlZ2F0ZSA9IGZ1bmN0aW9uKHRhcmdldCwgc291cmNlLCBtZXRob2RzKXtcbiAgdmFyIHByb3RvLCBpJCwgbGVuJCwgaywgbWV0aG9kO1xuICBpZiAoIShzb3VyY2UgJiYgdGFyZ2V0KSkge1xuICAgIHJldHVybiB0YXJnZXQ7XG4gIH1cbiAgcHJvdG8gPSB0aGlzLnByb3RvdHlwZTtcbiAgbWV0aG9kcyA9PSBudWxsICYmIChtZXRob2RzID0gdGhpcy5fX2VtaXR0ZXJfbWV0aG9kc19fKTtcbiAgZm9yIChpJCA9IDAsIGxlbiQgPSBtZXRob2RzLmxlbmd0aDsgaSQgPCBsZW4kOyArK2kkKSB7XG4gICAgayA9IG1ldGhvZHNbaSRdO1xuICAgIG1ldGhvZCA9IHNvdXJjZVtrXSB8fCBwcm90b1trXTtcbiAgICBpZiAodHlwZW9mIG1ldGhvZCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgdGFyZ2V0W2tdID0gbWV0aG9kLmJpbmQoc291cmNlKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHRhcmdldDtcbn07XG5FdmVudEVtaXR0ZXIuZGVjb3JhdGUgPSBmdW5jdGlvbih0YXJnZXQsIG1ldGhvZHMpe1xuICB2YXIgcHJvdG8sIGkkLCBsZW4kLCBrO1xuICBwcm90byA9IHRoaXMucHJvdG90eXBlO1xuICBtZXRob2RzID09IG51bGwgJiYgKG1ldGhvZHMgPSB0aGlzLl9fZW1pdHRlcl9tZXRob2RzX18pO1xuICBmb3IgKGkkID0gMCwgbGVuJCA9IG1ldGhvZHMubGVuZ3RoOyBpJCA8IGxlbiQ7ICsraSQpIHtcbiAgICBrID0gbWV0aG9kc1tpJF07XG4gICAgdGFyZ2V0W2tdID0gcHJvdG9ba107XG4gIH1cbiAgcmV0dXJuIHRhcmdldDtcbn07XG5FdmVudEVtaXR0ZXIuZXh0ZW5kZWQgPSBmdW5jdGlvbihTdWJDbGFzcyl7XG4gIHZhciBTdXBlckNsYXNzLCBrLCB2LCBvd24kID0ge30uaGFzT3duUHJvcGVydHk7XG4gIFN1cGVyQ2xhc3MgPSB0aGlzO1xuICBmb3IgKGsgaW4gU3VwZXJDbGFzcykgaWYgKG93biQuY2FsbChTdXBlckNsYXNzLCBrKSkge1xuICAgIHYgPSBTdXBlckNsYXNzW2tdO1xuICAgIGlmICghU3ViQ2xhc3Nba10pIHtcbiAgICAgIFN1YkNsYXNzW2tdID0gdjtcbiAgICB9XG4gIH1cbiAgU3ViQ2xhc3MuX19jbGFzc19fID0gU3ViQ2xhc3M7XG4gIFN1YkNsYXNzLl9fc3VwZXJfXyA9IFN1cGVyQ2xhc3MucHJvdG90eXBlO1xuICBTdWJDbGFzcy5fX3N1cGVyY2xhc3NfXyA9IFN1cGVyQ2xhc3M7XG4gIHJldHVybiBTdWJDbGFzcztcbn07XG5leHBvcnRzLkV2ZW50RW1pdHRlciA9IEV2ZW50RW1pdHRlcjsiLCJleHBvcnRzLlZFUlNJT04gPSAnMC4yLjEnO1xuaW1wb3J0JChleHBvcnRzLCByZXF1aXJlKCcuL2VtaXR0ZXInKSk7XG5pbXBvcnQkKGV4cG9ydHMsIHJlcXVpcmUoJy4vY2hhaW5lZC1lbWl0dGVyJykpO1xuaW1wb3J0JChleHBvcnRzLCByZXF1aXJlKCcuL3JlYWR5LWVtaXR0ZXInKSk7XG5pbXBvcnQkKGV4cG9ydHMsIHJlcXVpcmUoJy4vd2FpdGluZy1lbWl0dGVyJykpO1xuZXhwb3J0cy5oZWxwZXJzID0gcmVxdWlyZSgnLi9lbWl0dGVyLWhlbHBlcnMnKTtcbmZ1bmN0aW9uIGltcG9ydCQob2JqLCBzcmMpIHtcbiAgdmFyIG93biA9IHt9Lmhhc093blByb3BlcnR5O1xuICBmb3IgKHZhciBrZXkgaW4gc3JjKVxuICAgIGlmIChvd24uY2FsbChzcmMsIGtleSkpXG4gICAgICBvYmpba2V5XSA9IHNyY1trZXldO1xuICByZXR1cm4gb2JqO1xufSIsInZhciBFdmVudEVtaXR0ZXIsIFJlYWR5RW1pdHRlciwgb3V0JCA9IHR5cGVvZiBleHBvcnRzICE9ICd1bmRlZmluZWQnICYmIGV4cG9ydHMgfHwgdGhpcztcbkV2ZW50RW1pdHRlciA9IHJlcXVpcmUoJy4vZW1pdHRlcicpLkV2ZW50RW1pdHRlcjtcbi8qKlxuICogQGNsYXNzIEFuIEV2ZW50RW1pdHRlciB0aGF0IGF1dG8tdHJpZ2dlcnMgbmV3IGhhbmRsZXJzIG9uY2UgXCJyZWFkeVwiLlxuICogQGV4dGVuZHMgRXZlbnRFbWl0dGVyXG4gKi9cbm91dCQuUmVhZHlFbWl0dGVyID0gUmVhZHlFbWl0dGVyID0gKGZ1bmN0aW9uKHN1cGVyY2xhc3Mpe1xuICBSZWFkeUVtaXR0ZXIuZGlzcGxheU5hbWUgPSAnUmVhZHlFbWl0dGVyJztcbiAgdmFyIHByb3RvdHlwZSA9IGV4dGVuZCQoUmVhZHlFbWl0dGVyLCBzdXBlcmNsYXNzKS5wcm90b3R5cGUsIGNvbnN0cnVjdG9yID0gUmVhZHlFbWl0dGVyO1xuICBSZWFkeUVtaXR0ZXIuX19lbWl0dGVyX21ldGhvZHNfXyA9IEV2ZW50RW1pdHRlci5fX2VtaXR0ZXJfbWV0aG9kc19fLmNvbmNhdChbJ3JlYWR5J10pO1xuICAvKipcbiAgICogV2hldGhlciB0aGlzIG9iamVjdCBpcyByZWFkeS5cbiAgICogQHR5cGUgQm9vbGVhblxuICAgKi9cbiAgcHJvdG90eXBlLl9yZWFkeSA9IGZhbHNlO1xuICAvKipcbiAgICogTmFtZSBvZiB0aGUgcmVhZHkgZXZlbnQuXG4gICAqIEB0eXBlIFN0cmluZ1xuICAgKi9cbiAgcHJvdG90eXBlLl9fcmVhZHlfZXZlbnRfXyA9ICdyZWFkeSc7XG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yIHRoZSByZWFkeSBzdGF0ZS5cbiAgICogQHJldHVybnMge0Jvb2xlYW59IFdoZXRoZXIgdGhlIGVtaXR0ZXIgaXMgcmVhZHkgb3Igbm90LlxuICAgKi9cbiAgLyoqXG4gICAqIFJlZ2lzdGVycyBhIGNhbGxiYWNrIG9uIHJlYWR5OyBmaXJlZCBpbW1lZGlhdGVseSBpZiBhbHJlYWR5IHJlYWR5LlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFjayBUaGUgY2FsbGJhY2suXG4gICAqIEByZXR1cm5zIHt0aGlzfVxuICAgKi9cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgdGhlIHJlYWR5IHN0YXRlLlxuICAgKiBcbiAgICogSWYgdHJ1dGh5LCB0aGlzIHRyaWdnZXJzIHRoZSAncmVhZHknIGV2ZW50IHByb3ZpZGVkIGl0IGhhcyBub3QgeWV0IGJlZW5cbiAgICogdHJpZ2dlcmVkLCBhbmQgc3Vic2VxdWVudCBsaXN0ZW5lcnMgYWRkZWQgdG8gdGhpcyBldmVudCB3aWxsIGJlIFxuICAgKiBhdXRvLXRyaWdnZXJlZC5cbiAgICogXG4gICAqIElmIGZhbHN5LCB0aGlzIHJlc2V0cyB0aGUgJ3JlYWR5JyBldmVudCB0byBpdHMgbm9uLXRyaWdnZXJlZCBzdGF0ZSwgZmlyaW5nIGFcbiAgICogJ3JlYWR5LXJlc2V0JyBldmVudC5cbiAgICogXG4gICAqIEBwYXJhbSB7Qm9vbGVhbn0gdmFsdWUgU2V0cyB0aGUgcmVhZHkgc3RhdGUuXG4gICAqIEBwYXJhbSB7Qm9vbGVhbn0gW2ZvcmNlPWZhbHNlXSBUcmlnZ2VyIHRoZSBldmVudCBldmVuIGlmIGFscmVhZHkgcmVhZHkuXG4gICAqIEByZXR1cm5zIHt0aGlzfVxuICAgKi9cbiAgcHJvdG90eXBlLnJlYWR5ID0gZnVuY3Rpb24odmFsLCBmb3JjZSl7XG4gICAgdmFyIGV2ZW50O1xuICAgIGZvcmNlID09IG51bGwgJiYgKGZvcmNlID0gZmFsc2UpO1xuICAgIGlmICh2YWwgPT0gbnVsbCkge1xuICAgICAgcmV0dXJuICEhdGhpcy5fcmVhZHk7XG4gICAgfVxuICAgIGV2ZW50ID0gdGhpcy5fX3JlYWR5X2V2ZW50X18gfHwgJ3JlYWR5JztcbiAgICBpZiAodHlwZW9mIHZhbCA9PSAnZnVuY3Rpb24nKSB7XG4gICAgICByZXR1cm4gdGhpcy5vbihldmVudCwgdmFsKTtcbiAgICB9XG4gICAgdmFsID0gISF2YWw7XG4gICAgaWYgKHZhbCA9PSB0aGlzLl9yZWFkeSAmJiAhZm9yY2UpIHtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICB0aGlzLl9yZWFkeSA9IHZhbDtcbiAgICBpZiAoIXZhbCkge1xuICAgICAgZXZlbnQgPSBldmVudCArIFwiLXJlc2V0XCI7XG4gICAgfVxuICAgIHRoaXMuZW1pdChldmVudCwgdGhpcyk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG4gIC8qKlxuICAgKiBXcmFwIHtAbGluayBFdmVudEVtaXR0ZXIjb259IHJlZ2lzdHJhdGlvbiB0byBoYW5kbGUgcmVnaXN0cmF0aW9uc1xuICAgKiBvbiAncmVhZHknIGFmdGVyIHdlJ3ZlIGJyb2FkY2FzdCB0aGUgZXZlbnQuIEhhbmRsZXIgd2lsbCBhbHdheXMgc3RpbGxcbiAgICogYmUgcmVnaXN0ZXJlZCwgaG93ZXZlciwgaW4gY2FzZSB0aGUgZW1pdHRlciBpcyByZXNldC5cbiAgICogXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBldmVudHMgU3BhY2Utc2VwYXJhdGVkIGV2ZW50cyBmb3Igd2hpY2ggdG8gcmVnaXN0ZXIuXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrXG4gICAqIEByZXR1cm5zIHt0aGlzfVxuICAgKi9cbiAgcHJvdG90eXBlLm9uID0gZnVuY3Rpb24oZXZlbnRzLCBjYWxsYmFjayl7XG4gICAgdmFyIGV2ZW50LCB0aGlzJCA9IHRoaXM7XG4gICAgc3VwZXJjbGFzcy5wcm90b3R5cGUub24uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICBldmVudCA9IHRoaXMuX19yZWFkeV9ldmVudF9fIHx8ICdyZWFkeSc7XG4gICAgaWYgKHRoaXMucmVhZHkoKSAmJiBldmVudHMuc3BsaXQoL1xccysvKS5pbmRleE9mKGV2ZW50KSA+IC0xKSB7XG4gICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG4gICAgICAgIHJldHVybiBjYWxsYmFjay5jYWxsKHRoaXMkLCB0aGlzJCk7XG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG4gIHByb3RvdHlwZS5hZGRMaXN0ZW5lciA9IFJlYWR5RW1pdHRlci5wcm90b3R5cGUub247XG4gIGZ1bmN0aW9uIFJlYWR5RW1pdHRlcigpe31cbiAgcmV0dXJuIFJlYWR5RW1pdHRlcjtcbn0oRXZlbnRFbWl0dGVyKSk7XG5mdW5jdGlvbiBleHRlbmQkKHN1Yiwgc3VwKXtcbiAgZnVuY3Rpb24gZnVuKCl7fSBmdW4ucHJvdG90eXBlID0gKHN1Yi5zdXBlcmNsYXNzID0gc3VwKS5wcm90b3R5cGU7XG4gIChzdWIucHJvdG90eXBlID0gbmV3IGZ1bikuY29uc3RydWN0b3IgPSBzdWI7XG4gIGlmICh0eXBlb2Ygc3VwLmV4dGVuZGVkID09ICdmdW5jdGlvbicpIHN1cC5leHRlbmRlZChzdWIpO1xuICByZXR1cm4gc3ViO1xufSIsInZhciBFdmVudEVtaXR0ZXIsIFdhaXRpbmdFbWl0dGVyLCBvdXQkID0gdHlwZW9mIGV4cG9ydHMgIT0gJ3VuZGVmaW5lZCcgJiYgZXhwb3J0cyB8fCB0aGlzO1xuRXZlbnRFbWl0dGVyID0gcmVxdWlyZSgnLi9lbWl0dGVyJykuRXZlbnRFbWl0dGVyO1xuLyoqXG4gKiBAY2xhc3MgQW4gRXZlbnRFbWl0dGVyIHdpdGggYSByYXRjaGV0LXVwIHdhaXRpbmcgY291bnRlci5cbiAqIEBleHRlbmRzIEV2ZW50RW1pdHRlclxuICovXG5vdXQkLldhaXRpbmdFbWl0dGVyID0gV2FpdGluZ0VtaXR0ZXIgPSAoZnVuY3Rpb24oc3VwZXJjbGFzcyl7XG4gIFdhaXRpbmdFbWl0dGVyLmRpc3BsYXlOYW1lID0gJ1dhaXRpbmdFbWl0dGVyJztcbiAgdmFyIHByb3RvdHlwZSA9IGV4dGVuZCQoV2FpdGluZ0VtaXR0ZXIsIHN1cGVyY2xhc3MpLnByb3RvdHlwZSwgY29uc3RydWN0b3IgPSBXYWl0aW5nRW1pdHRlcjtcbiAgV2FpdGluZ0VtaXR0ZXIuX19lbWl0dGVyX21ldGhvZHNfXyA9IEV2ZW50RW1pdHRlci5fX2VtaXR0ZXJfbWV0aG9kc19fLmNvbmNhdChbJ3dhaXRpbmdPbicsICd3YWl0JywgJ3Vud2FpdCcsICd1bndhaXRBbmQnXSk7XG4gIC8qKlxuICAgKiBDb3VudCBvZiBvdXRzdGFuZGluZyB0YXNrcy5cbiAgICogQHR5cGUgTnVtYmVyXG4gICAqIEBwcm90ZWN0ZWRcbiAgICovXG4gIHByb3RvdHlwZS5fd2FpdGluZ09uID0gMDtcbiAgLyoqXG4gICAqIEByZXR1cm5zIHtOdW1iZXJ9IENvdW50IG9mIG91dHN0YW5kaW5nIHRhc2tzLlxuICAgKi9cbiAgcHJvdG90eXBlLndhaXRpbmdPbiA9IGZ1bmN0aW9uKCl7XG4gICAgcmV0dXJuIHRoaXMuX3dhaXRpbmdPbiB8fCAwO1xuICB9O1xuICAvKipcbiAgICogSW5jcmVtZW50IHRoZSB3YWl0aW5nIHRhc2sgY291bnRlci5cbiAgICogQHJldHVybnMge3RoaXN9XG4gICAqL1xuICBwcm90b3R5cGUud2FpdCA9IGZ1bmN0aW9uKCl7XG4gICAgdmFyIGNvdW50O1xuICAgIGNvdW50ID0gdGhpcy5fd2FpdGluZ09uIHx8IDA7XG4gICAgdGhpcy5fd2FpdGluZ09uICs9IDE7XG4gICAgaWYgKGNvdW50ID09PSAwICYmIHRoaXMuX3dhaXRpbmdPbiA+IDApIHtcbiAgICAgIHRoaXMudHJpZ2dlcignc3RhcnQtd2FpdGluZycsIHRoaXMpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbiAgfTtcbiAgLyoqXG4gICAqIERlY3JlbWVudCB0aGUgd2FpdGluZyB0YXNrIGNvdW50ZXIuXG4gICAqIEByZXR1cm5zIHt0aGlzfVxuICAgKi9cbiAgcHJvdG90eXBlLnVud2FpdCA9IGZ1bmN0aW9uKCl7XG4gICAgdmFyIGNvdW50O1xuICAgIGNvdW50ID0gdGhpcy5fd2FpdGluZ09uIHx8IDA7XG4gICAgdGhpcy5fd2FpdGluZ09uIC09IDE7XG4gICAgaWYgKHRoaXMuX3dhaXRpbmdPbiA9PT0gMCAmJiBjb3VudCA+IDApIHtcbiAgICAgIHRoaXMudHJpZ2dlcignc3RvcC13YWl0aW5nJywgdGhpcyk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xuICB9O1xuICAvKipcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gRnVuY3Rpb24gdG8gd3JhcC5cbiAgICogQHJldHVybnMge0Z1bmN0aW9ufSBBIGZ1bmN0aW9uIHdyYXBwaW5nIHRoZSBwYXNzZWQgZnVuY3Rpb24gd2l0aCBhIGNhbGxcbiAgICogIHRvIGB1bndhaXQoKWAsIHRoZW4gZGVsZWdhdGluZyB3aXRoIGN1cnJlbnQgY29udGV4dCBhbmQgYXJndW1lbnRzLlxuICAgKi9cbiAgcHJvdG90eXBlLnVud2FpdEFuZCA9IGZ1bmN0aW9uKGZuKXtcbiAgICB2YXIgc2VsZjtcbiAgICBzZWxmID0gdGhpcztcbiAgICByZXR1cm4gZnVuY3Rpb24oKXtcbiAgICAgIHNlbGYudW53YWl0KCk7XG4gICAgICByZXR1cm4gZm4uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB9O1xuICB9O1xuICBmdW5jdGlvbiBXYWl0aW5nRW1pdHRlcigpe31cbiAgcmV0dXJuIFdhaXRpbmdFbWl0dGVyO1xufShFdmVudEVtaXR0ZXIpKTtcbmZ1bmN0aW9uIGV4dGVuZCQoc3ViLCBzdXApe1xuICBmdW5jdGlvbiBmdW4oKXt9IGZ1bi5wcm90b3R5cGUgPSAoc3ViLnN1cGVyY2xhc3MgPSBzdXApLnByb3RvdHlwZTtcbiAgKHN1Yi5wcm90b3R5cGUgPSBuZXcgZnVuKS5jb25zdHJ1Y3RvciA9IHN1YjtcbiAgaWYgKHR5cGVvZiBzdXAuZXh0ZW5kZWQgPT0gJ2Z1bmN0aW9uJykgc3VwLmV4dGVuZGVkKHN1Yik7XG4gIHJldHVybiBzdWI7XG59Il19
("bRhrlU")
});
