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