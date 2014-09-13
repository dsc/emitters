var EventEmitter, ref$, ref1$;
EventEmitter = require('events').EventEmitter;
EventEmitter.displayName || (EventEmitter.displayName = 'EventEmitter');
(ref$ = EventEmitter.prototype).trigger || (ref$.trigger = EventEmitter.prototype.emit);
(ref1$ = EventEmitter.prototype).off || (ref1$.off = EventEmitter.prototype.removeListener);
exports.EventEmitter = EventEmitter;