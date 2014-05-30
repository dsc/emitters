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