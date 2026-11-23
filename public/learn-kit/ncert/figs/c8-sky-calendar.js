// Class 8 Time and the skies: why we need leap years. The Earth takes about 365.2422 days to go round the Sun (the tropical year, from
// one March equinox to the next). A calendar of exactly 365 days runs behind the seasons by about a quarter of a day each year. Adding a
// leap day every 4 years (Julian rule, average 365.25) nearly fixes it; skipping 3 leap years in 400 (Gregorian rule, average 365.2425)
// keeps dates in step with the seasons for thousands of years. Drift = years x (365.2422 - average calendar year).
import { canvas, text, title, line, dot, axes, row, slider, readout } from '../../kit.js';

const Y = 365.2422, RULES = [['No leap years', 365, 1], ['Leap year every 4 years', 365.25, 2], ['Gregorian rule (as in use)', 365.2425, 3]];
export default function (host) {
  let yrs = 400;
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 290, label: 'How far the calendar drifts from the seasons with different leap year rules' });
  const ctl = row(host);
  slider(ctl, { label: 'Years passed', min: 1, max: 1200, step: 1, value: yrs, fmt: (v) => `${v} years`, oninput: (v) => { yrs = v; say(); } });
  const out = readout(host);
  const drift = (avg, n) => n * (Y - avg);
  const say = () => { out.innerHTML = `After ${yrs} year${yrs === 1 ? "" : "s"} the seasons would have slipped by <b>${drift(365, yrs).toFixed(0)} days</b> with no leap years (summer in what the calendar calls winter!), <b>${Math.abs(drift(365.25, yrs)).toFixed(1)} days</b> with a leap year every 4 years, and only <b>${Math.abs(drift(365.2425, yrs)).toFixed(2)} days</b> with the Gregorian rule.`; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Calendar drift against the seasons', col);
    const a = axes(ctx, w, h, col, { x: [0, 1200], y: [-5, 300], xlabel: 'years', ylabel: 'days out of step', t: top + 14, l: 46, xt: [0, 400, 800, 1200], yt: [0, 100, 200, 300] });
    RULES.forEach(([nm, avg, k]) => {
      line(ctx, [[a.X(0), a.Y(0)], [a.X(1200), a.Y(Math.abs(drift(avg, 1200)))]], col.s[k - 1], 3);
      dot(ctx, a.X(yrs), a.Y(Math.abs(drift(avg, yrs))), 5.5, col.s[k - 1], col.ink);
    });
    line(ctx, [[a.X(yrs), a.T], [a.X(yrs), a.B]], col.muted, 1, [4, 4]);
    RULES.forEach(([nm, avg, k], i) => text(ctx, nm, a.L + 8, a.T + 12 + i * 15, { color: col.s[k - 1], size: 10.5, weight: 700 }));
  };
  say();
}
