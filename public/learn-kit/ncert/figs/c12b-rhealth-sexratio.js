// Class 12 Biology, Reproductive Health: the sex ratio (females per 1000 males) in India from the Census of India: 946 (1951), 941 (1961), 930 (1971),
// 934 (1981), 927 (1991), 933 (2001), 943 (2011). The child sex ratio (ages 0-6) was 945 (1991), 927 (2001) and 919 (2011). A natural birth ratio is
// slightly more boys than girls (about 105 boys per 100 girls), so it is the gap far beyond that which signals sex-selective practices, which are illegal.
import { canvas, text, title, axes, line, dot, row, slider, readout } from '../../kit.js';

export default function (host) {
  let i = 6;
  const Y = [1951, 1961, 1971, 1981, 1991, 2001, 2011], T = [946, 941, 930, 934, 927, 933, 943], C = [null, null, null, null, 945, 927, 919];
  const cv = canvas(host, { aspect: 0.85, max: 440, min: 310, label: 'Line graph of the sex ratio of India by census year with a row of people icons for the chosen year' });
  const ctl = row(host), ro = readout(host);
  slider(ctl, { label: 'census year', min: 0, max: 6, step: 1, value: 6, fmt: (v) => String(Y[Math.round(v)]), oninput: (v) => { i = Math.round(v); go(); } });
  const go = () => { ro.textContent = `${Y[i]}: ${T[i]} females per 1000 males${C[i] ? `; children aged 0 to 6: ${C[i]} girls per 1000 boys` : ''}. A ratio of 1000 would be equal numbers. The falling child ratio is a warning, and sex determination before birth for choosing a child’s sex is a legal offence in India (PCPNDT Act), so tests like amniocentesis are used only to detect genetic disorders.`; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Females per 1000 males (Census of India)', col), gh = (h - top) * 0.62;
    const A = axes(ctx, w, top + gh, col, { x: [1951, 2011], y: [900, 960], t: top + 6, l: 40, b: 28, xt: [1951, 1971, 1991, 2011], yt: [900, 920, 940, 960], fx: (v) => String(v) });
    line(ctx, Y.map((y, k) => [A.X(y), A.Y(T[k])]), col.s[0], 2.5); Y.forEach((y, k) => dot(ctx, A.X(y), A.Y(T[k]), k === i ? 6 : 3.5, k === i ? col.s[3] : col.s[0], col.panel));
    const cs = Y.map((y, k) => (C[k] ? [A.X(y), A.Y(C[k])] : null)).filter(Boolean); line(ctx, cs, col.bad, 2, [5, 3]); text(ctx, 'ages 0 to 6', cs[0][0] + 4, cs[0][1] + 14, { color: col.bad, size: 10, weight: 700 });
    const y0 = top + gh + 24, n = 20, w1 = (w - 30) / n, f = Math.round(T[i] / 1000 * n * 10) / 10;
    for (let k = 0; k < n; k++) { const on = k < f; dot(ctx, 15 + k * w1 + w1 / 2, y0, w1 * 0.3, col.s[1], col.panel); dot(ctx, 15 + k * w1 + w1 / 2, y0 + w1 * 0.9, w1 * 0.3, k < Math.floor(f) || (k < f) ? col.s[3] : col.line, col.panel); }
    text(ctx, 'top row: 20 males', 15, y0 + w1 * 0.9 + 18, { color: col.s[1], size: 10, weight: 700 }); text(ctx, `bottom row: ${f.toFixed(1)} females`, w - 10, y0 + w1 * 0.9 + 18, { color: col.s[3], size: 10, weight: 700, align: 'right' });
  };
  go();
}
