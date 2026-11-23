// Class 11 Units and Measurement: the powers-of-ten ruler. Lengths from a proton (about 10^-15 m) to the observable universe (about 10^26 m) fit on one ruler
// when we plot the exponent. Slide the marker to see the SI prefix (nano, micro, milli, kilo, ...) and the nearest thing of that size. Each step to the right
// is a factor of ten, so 41 steps cover the whole range.
import { canvas, text, title, line, dot, row, slider, readout } from '../../kit.js';

const OBJ = [[-15, 'proton'], [-10, 'atom'], [-7, 'virus'], [-4.2, 'hair width'], [-2.5, 'ant'], [0.23, 'person'], [3.9, 'Everest'], [6.8, 'Earth radius'], [11.2, 'Earth–Sun'], [15.98, 'light-year'], [20.9, 'Milky Way'], [26.9, 'universe']];
const PRE = { '-15': 'femto', '-12': 'pico', '-9': 'nano', '-6': 'micro', '-3': 'milli', '0': '', '3': 'kilo', '6': 'mega', '9': 'giga', '12': 'tera', '15': 'peta', '18': 'exa', '21': 'zetta', '24': 'yotta' };
export default function (host) {
  let e = 0;
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 270, label: 'A ruler of powers of ten from a proton to the universe with a movable marker' });
  const ctl = row(host), out = readout(host);
  slider(ctl, { label: 'Exponent: length = 10^x metres', min: -15, max: 27, step: 0.1, value: e, fmt: (v) => 'x = ' + v.toFixed(1), oninput: (v) => { e = v; go(); } });
  function go() {
    let best = OBJ[0]; for (const o of OBJ) if (Math.abs(o[0] - e) < Math.abs(best[0] - e)) best = o;
    const pk = Object.keys(PRE).map(Number).reduce((a, b) => (Math.abs(b - e) < Math.abs(a - e) ? b : a));
    const val = 10 ** e;
    out.innerHTML = `Length = <b>${val >= 1e4 || val < 1e-3 ? val.toExponential(1).replace('e', ' × 10<sup>').replace('+', '') + '</sup>' : +val.toPrecision(3)} m</b>. Nearest SI prefix: <b>${PRE[pk] || 'none (metre)'}</b> (10<sup>${pk}</sup>). Closest thing: <b>${best[1]}</b> (about 10<sup>${Math.round(best[0])}</sup> m). One step on the ruler = a factor of 10.`;
    cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Proton to universe: powers of ten', col);
    const L = 20, R = w - 20, X = (v) => L + ((v + 16) / 44) * (R - L), y = h * 0.5;
    line(ctx, [[L, y], [R, y]], col.ink, 2);
    for (let v = -15; v <= 27; v += 3) { line(ctx, [[X(v), y - 7], [X(v), y + 7]], col.ink, 1.5); text(ctx, String(v), X(v), y + 19, { size: 10, color: col.muted, align: 'center' }); }
    text(ctx, 'exponent x in 10^x metres', w / 2, h - 7, { size: 11, color: col.muted, align: 'center' });
    OBJ.forEach(([v, name], i) => { const dy = [-34, 62, -66, 94][i % 4]; dot(ctx, X(v), y, 4, col.s[i % 6], col.panel); line(ctx, [[X(v), y], [X(v), y + dy + (dy < 0 ? 8 : -8)]], col.line, 1); text(ctx, name, Math.min(w - 26, Math.max(26, X(v))), y + dy, { size: 10, color: col.s[i % 6], weight: 700, align: 'center' }); });
    line(ctx, [[X(e), y - 22], [X(e), y + 22]], col.s[3], 3); dot(ctx, X(e), y, 6, col.s[3], col.ink);
    text(ctx, '10^' + e.toFixed(1), Math.min(w - 36, Math.max(36, X(e))), h - 24, { size: 13, weight: 700, color: col.s[3], align: 'center' });
  };
  go();
}
