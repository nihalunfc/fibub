// A steady tick for the protocol timer page. Timers in a worker are slowed down less than timers on a page when the
// tab is in the background, so alarms and notifications come close to on time. The page itself works out the time
// left from timestamps, so a late tick only delays the alarm, never the times shown.
setInterval(() => postMessage(0), 250);
