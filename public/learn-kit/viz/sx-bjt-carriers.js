// What really flows in an NPN transistor. Electrons (blue dots) are injected from the emitter into the thin p base by
// forward bias V_BE; the base is so thin that almost all of them are swept into the collector by the reverse-biased
// junction. Only a small fraction recombines in the base (flash): that is the base current. I_C = I_S e^(V_BE/V_T),
// I_B = I_C/β, I_E = I_C + I_B. Raise V_BE and watch I_C grow exponentially; raise β and see the base current shrink.
import { canvas, text, row, slider, readout, loop, title, arrow, rng, dot } from '../kit.js';

const VT = 0.02585, IS = 1e-14;
export default function (host) {
  const R = rng(9), el = [], fl = [];
  let acc = 0;
  const cv = canvas(host, { aspect: 0.62, max: 330, min: 240, label: 'Electrons crossing the emitter, thin base and collector of an NPN transistor' });
  const ctl = row(host);
  const sv = slider(ctl, { label: 'V_BE', min: 0.55, max: 0.72, step: 0.005, value: 0.64, fmt: (v) => v.toFixed(3) + ' V', oninput: () => show() });
  const sb = slider(ctl, { label: 'Current gain β', min: 10, max: 300, step: 5, value: 100, fmt: (v) => v.toFixed(0), oninput: () => show() });
  const IC = () => IS * Math.exp(sv.value / VT);
  const geo = (w, h) => ({ x0: 18, x1: w * 0.34, x2: w * 0.34 + Math.max(8, w * 0.07), x3: w - 18, y0: 76, y1: h - 36 });
  loop(host, (dt) => {
    const G = geo(cv.w, cv.h), rate = 3 + 18 * ((sv.value - 0.55) / 0.17) ** 2;
    acc += dt * rate;
    while (acc > 1) { acc -= 1; el.push({ x: G.x0 + 4, y: G.y0 + 6 + R() * (G.y1 - G.y0 - 12), die: R() < Math.min(0.5, 6 / (sb.value + 1)) ? G.x1 + R() * (G.x2 - G.x1) : null }); }
    el.forEach((e) => { e.x += dt * (e.x < G.x1 ? 50 : e.x < G.x2 ? 70 : 90); });
    for (let i = el.length - 1; i >= 0; i--) { const e = el[i]; if (e.die !== null && e.x >= e.die) { fl.push({ x: e.x, y: e.y, t: 0 }); el.splice(i, 1); } else if (e.x > G.x3 - 4) el.splice(i, 1); }
    fl.forEach((f) => (f.t += dt)); while (fl.length && fl[0].t > 0.6) fl.shift();
    cv.redraw();
  }).button(row(host));
  const out = readout(host);
  function show() { queueMicrotask(() => cv.redraw()); const ic = IC(), ib = ic / sb.value; out.innerHTML = `<b>V_BE = ${sv.value.toFixed(3)} V:</b> I_C = I_S e^(V_BE/V_T) = ${(ic * 1000).toFixed(3)} mA, I_B = I_C/β = ${(ib * 1e6).toFixed(1)} µA, I_E = I_C + I_B = ${((ic + ib) * 1000).toFixed(3)} mA. A rise of only ${(VT * Math.LN10 * 1000).toFixed(0)} mV in V_BE multiplies I_C by 10. In the picture a fraction 1/(β+1) = ${(100 / (sb.value + 1)).toFixed(1)}% of electrons is lost in the base (the flashes), so a thinner base means a bigger β. (A sample of electrons is drawn, and base losses are shown 6 times too often so you can see them.)`; }
  cv.draw = (ctx, w, h, col) => {
    const G = geo(w, h);
    ctx.fillStyle = col.soft; ctx.fillRect(G.x0, G.y0, G.x1 - G.x0, G.y1 - G.y0); ctx.fillRect(G.x2, G.y0, G.x3 - G.x2, G.y1 - G.y0);
    ctx.fillStyle = col.line; ctx.globalAlpha = 0.7; ctx.fillRect(G.x1, G.y0, G.x2 - G.x1, G.y1 - G.y0); ctx.globalAlpha = 1;
    ctx.strokeStyle = col.muted; ctx.lineWidth = 1.2; ctx.strokeRect(G.x0, G.y0, G.x3 - G.x0, G.y1 - G.y0);
    [[(G.x0 + G.x1) / 2, 'N emitter'], [(G.x1 + G.x2) / 2, 'P'], [(G.x2 + G.x3) / 2, 'N collector']].forEach(([x, s], i) => text(ctx, s, x, G.y1 + 12, { color: col.muted, size: 11, weight: 600, align: 'center' }));
    for (let k = 0; k < 4; k++) text(ctx, 'o', (G.x1 + G.x2) / 2, G.y0 + 12 + k * ((G.y1 - G.y0 - 24) / 3), { color: col.s[5], size: 11, align: 'center', weight: 700 });
    el.forEach((e) => dot(ctx, e.x, e.y, 3.5, col.s[0]));
    fl.forEach((f) => { ctx.strokeStyle = col.s[1]; ctx.lineWidth = 2; ctx.globalAlpha = 1 - f.t / 0.6; ctx.beginPath(); ctx.arc(f.x, f.y, 4 + f.t * 20, 0, 7); ctx.stroke(); ctx.globalAlpha = 1; });
    const ic = IC(), ib = ic / sb.value, big = (v) => 2 + 3 * Math.log10(Math.max(v, 1e-7) / 1e-7);
    arrow(ctx, G.x3 - 30, G.y0 - 6, G.x3 - 30, G.y0 - 40, col.s[0], Math.min(7, big(ic) / 2.2), 9); text(ctx, `I_C ${(ic * 1000).toFixed(2)} mA`, G.x3 - 38, G.y0 - 28, { color: col.s[0], size: 11, weight: 700, align: 'right' });
    arrow(ctx, (G.x1 + G.x2) / 2, G.y0 - 40, (G.x1 + G.x2) / 2, G.y0 - 6, col.s[1], Math.min(5, big(ib) / 3), 8); text(ctx, `I_B ${(ib * 1e6).toFixed(0)} µA`, (G.x1 + G.x2) / 2 + 8, G.y0 - 28, { color: col.s[1], size: 11, weight: 700 });
    text(ctx, 'electrons enter', G.x0 + 4, G.y0 - 8, { color: col.muted, size: 10.5 });
    title(ctx, 'NPN in the active region (collector reverse biased)', col);
  };
  show();
}
