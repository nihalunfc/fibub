// Class 11 Thermal Properties of Matter: the heat needed to take ice at -20 degC all the way to steam at 120 degC. Five stages with specific heats (ice 2100, water 4186, steam 2010 J/kg K) and latent heats
// (fusion 3.34e5, vaporisation 2.26e6 J/kg). Q = m c dT while the temperature changes, Q = m L during a change of state (temperature stays put). The bar shows each stage's share; the slider is the heat added so far.
import { canvas, text, title, line, dot, row, slider, readout } from '../../kit.js';

export default function (host) {
  let m = 0.5, f = 0.1;
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 300, label: 'The heat needed for each stage when ice at minus 20 degrees becomes steam, with a slider for the heat added' });
  const ctl = row(host), ro = readout(host);
  slider(ctl, { label: 'mass (kg)', min: 0.1, max: 2, step: 0.1, value: m, fmt: (v) => v.toFixed(1) + ' kg', oninput: (v) => { m = v; go(); } });
  slider(ctl, { label: 'heat added so far', min: 0, max: 1, step: 0.002, value: f, fmt: (v) => Math.round(v * 100) + ' % of total', oninput: (v) => { f = v; go(); } });
  const stages = () => [['ice warms to 0 °C', m * 2100 * 20, -20, 0], ['ice melts at 0 °C', m * 3.34e5, 0, 0], ['water warms to 100 °C', m * 4186 * 100, 0, 100], ['water boils at 100 °C', m * 2.26e6, 100, 100], ['steam warms to 120 °C', m * 2010 * 20, 100, 120]];
  const state = () => { const st = stages(), tot = st.reduce((a, s) => a + s[1], 0); let q = f * tot; for (const s of st) { if (q <= s[1] + 1e-9) return { q: f * tot, tot, s, frac: q / s[1], T: s[2] + (s[3] - s[2]) * (q / s[1]) }; q -= s[1]; } return { q: tot, tot, s: st[4], frac: 1, T: 120 }; };
  const go = () => { const s = state(); ro.textContent = `Heat added ${(s.q / 1000).toFixed(0)} kJ of ${(s.tot / 1000).toFixed(0)} kJ: now ${s.s[0]}, temperature ${s.T.toFixed(0)} °C. Boiling alone takes ${(stages()[3][1] / s.tot * 100).toFixed(0)} % of all the heat. That is why steam at 100 °C burns more than water at 100 °C.`; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Ice to steam: where does the heat go?', col) + 12, st = stages(), tot = st.reduce((a, s) => a + s[1], 0), s = state(), x0 = 14, bw = w - 28, by = top + 8, bh = 34;
    let x = x0; const cols = [col.s[0], col.s[4], col.s[0], col.s[1], col.s[2]];
    st.forEach((q, i) => { const wd = (q[1] / tot) * bw; ctx.fillStyle = cols[i]; ctx.globalAlpha = i === 1 || i === 3 ? 0.9 : 0.5; ctx.fillRect(x, by, wd, bh); ctx.globalAlpha = 1; x += wd; });
    ctx.strokeStyle = col.ink; ctx.lineWidth = 1.5; ctx.strokeRect(x0, by, bw, bh);
    dot(ctx, x0 + (s.q / tot) * bw, by + bh + 8, 5, col.s[3], col.panel);
    ctx.fillStyle = col.ink; ctx.fillRect(x0 + (s.q / tot) * bw - 1, by - 4, 2, bh + 8);
    const ty = by + bh + 32; st.forEach((q, i) => { const yy = ty + i * 20; ctx.fillStyle = cols[i]; ctx.fillRect(x0, yy - 6, 12, 12); text(ctx, `${q[0]}: ${(q[1] / 1000).toFixed(0)} kJ`, x0 + 18, yy, { color: col.ink, size: 11.5, weight: s.s === q ? 700 : 400 }); });
    const ay = ty + 5 * 20 + 10, ah = h - ay - 24;
    if (ah > 40) { const X = (q) => x0 + (q / tot) * bw, Y = (T) => ay + ah - ((T + 20) / 140) * ah; let acc = 0; const pts = []; st.forEach((q) => { pts.push([X(acc), Y(q[2])]); acc += q[1]; pts.push([X(acc), Y(q[3])]); }); line(ctx, pts, col.s[0], 2.5); dot(ctx, X(s.q), Y(s.T), 5, col.s[3], col.panel); text(ctx, 'temperature against heat added', w - 14, ay + ah - 8, { color: col.muted, size: 10, align: 'right' }); }
  };
  go();
}
