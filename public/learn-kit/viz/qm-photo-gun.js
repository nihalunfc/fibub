// Photoelectric effect as a tube you can run: light of a chosen wavelength and brightness hits a metal plate and electrons
// pop out one by one with KE = hf − φ at most. Change the metal, colour, brightness and the collector voltage:
// brightness changes how MANY electrons, colour changes how FAST, and below the threshold nothing comes out at all.
import { canvas, axes, line, text, title, row, slider, choice, readout, loop, rng, dot } from '../kit.js';

const METALS = { Cs: ['Caesium', 2.14], Na: ['Sodium', 2.36], Zn: ['Zinc', 4.33], Cu: ['Copper', 4.7], Pt: ['Platinum', 5.65] };
export default function (host) {
  const R = rng(5);
  const cv = canvas(host, { aspect: 1.0, max: 500, min: 400, label: 'A photocell with light on a metal plate, electrons leaving it, and the current against voltage graph' });
  let met = 'Na', lam = 400, inten = 5, V = 1, es = [], acc = 0, cur = 0, got = 0, tt = 0;
  const ctl = row(host), ctl2 = row(host), out = readout(host);
  choice(ctl, 'Metal', Object.keys(METALS).map((k) => [k, k]), met, (v) => { met = v; es = []; show(); });
  const sLam = slider(ctl, { label: 'Wavelength', min: 150, max: 700, step: 5, value: lam, fmt: (v) => v + ' nm', oninput: (v) => { lam = v; show(); } });
  const sInt = slider(ctl2, { label: 'Brightness', min: 1, max: 10, step: 1, value: inten, fmt: (v) => v + '/10', oninput: (v) => { inten = v; show(); } });
  const sV = slider(ctl2, { label: 'Collector voltage', min: -5, max: 4, step: 0.1, value: V, fmt: (v) => (v > 0 ? '+' : '') + v.toFixed(1) + ' V', oninput: (v) => { V = v; show(); } });
  const phi = () => METALS[met][1], E = () => 1239.84 / lam, KM = () => Math.max(0, E() - phi());
  const anim = loop(host, (dt) => {
    tt += dt; acc += dt * (KM() > 0 ? inten * 2.2 : 0);
    while (acc >= 1) { acc -= 1; es.push({ x: 0.02, y: (R() - 0.5) * 0.7, vy: (R() - 0.5) * 0.15, K0: KM() * Math.sqrt(R()), d: 1 }); }
    let hit = 0;
    es.forEach((e) => {
      const K = e.K0 + V * e.x; if (K <= 0.001) e.d = -1;
      e.x += e.d * 0.55 * Math.sqrt(Math.max(K, 0) + 0.15) * dt; e.y += e.vy * dt;
      if (e.x >= 1) { e.gone = 1; hit++; } else if (e.x <= 0) e.gone = 1;
    });
    es = es.filter((e) => !e.gone);
    cur = cur * (1 - dt * 1.5) + hit * 1.5; // smoothed hits per second
    cv.redraw(); show();
  });
  anim.button(ctl2);
  const I = (v) => (KM() <= 0 ? 0 : v >= 0 ? inten / 10 : v <= -KM() ? 0 : (inten / 10) * (1 + v / KM()) ** 2);
  function show() {
    const k = KM();
    out.innerHTML = `Photon energy hf = <b>${E().toFixed(2)} eV</b>, work function φ = ${phi()} eV (${METALS[met][0]}). ${k > 0 ? `Fastest electrons: K<sub>max</sub> = hf − φ = <b>${k.toFixed(2)} eV</b>, so the stopping potential is <b>${k.toFixed(2)} V</b>; threshold wavelength ${(1239.84 / phi()).toFixed(0)} nm.` : `<b>No electrons.</b> hf is less than φ: each photon is too weak, however bright the light. Threshold wavelength is ${(1239.84 / phi()).toFixed(0)} nm.`}`;
  }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Photocell: ' + METALS[met][0], col);
    const top = 30, ph = h * 0.5, ex = w * 0.2, cx = w * 0.8, y0 = top + 10, y1 = top + ph - 6;
    ctx.fillStyle = col.muted; ctx.fillRect(ex - 6, y0, 6, y1 - y0); ctx.fillRect(cx, y0, 6, y1 - y0);
    text(ctx, 'metal', ex - 3, y0 - 6, { color: col.muted, size: 10, align: 'center' }); text(ctx, 'collector', cx + 3, y0 - 6, { color: col.muted, size: 10, align: 'center' });
    // light rays
    const bright = 0.3 + inten / 14;
    for (let i = 0; i < 4; i++) { const y = y0 + 14 + i * (y1 - y0 - 28) / 3; ctx.globalAlpha = bright; line(ctx, [[2, y - 12], [ex - 8, y]], col.s[1], 1.5 + inten / 6); ctx.globalAlpha = 1; }
    text(ctx, 'light: ' + E().toFixed(2) + ' eV per photon', 8, y1 + 11 + 14, { color: col.s[1], size: 10.5, weight: 600 });
    es.forEach((e) => { const x = ex + e.x * (cx - ex), y = (y0 + y1) / 2 + e.y * (y1 - y0); dot(ctx, x, y, 3.2, col.s[0]); });
    text(ctx, 'e⁻ leave with K from 0 up to ' + KM().toFixed(2) + ' eV', (ex + cx) / 2, y1 + 11, { color: col.muted, size: 10, align: 'center' });
    // I-V
    const a = axes(ctx, w, h, col, { x: [-5, 4], y: [0, 1.1], l: 44, t: top + ph + 40, b: 36, xlabel: 'collector voltage (V)', ylabel: 'current', yt: [], xt: [-4, -2, 0, 2, 4] });
    const pts = []; for (let v = -5; v <= 4.001; v += 0.1) pts.push([a.X(v), a.Y(I(v))]);
    line(ctx, pts, col.s[2], 2);
    if (KM() > 0) { line(ctx, [[a.X(-KM()), a.T], [a.X(-KM()), a.B]], col.line, 1, [4, 4]); text(ctx, '−V₀', a.X(-KM()), a.T + 6, { color: col.muted, size: 10, align: 'center' }); }
    dot(ctx, a.X(V), a.Y(I(V)), 5, col.s[1]);
  };
  show();
  return { step(i) { const P = [[700, 5, 1, 'Na'], [400, 5, 1, 'Na'], [400, 10, 1, 'Na'], [250, 10, 1, 'Na'], [250, 10, null, 'Na']][Math.min(i, 4)]; met = P[3]; es = []; lam = P[0]; inten = P[1]; V = P[2] === null ? -Math.max(0.1, Math.round(KM() * 10) / 10) : P[2]; sLam.set(lam); sInt.set(inten); sV.set(V); show(); cv.redraw(); } };
}
