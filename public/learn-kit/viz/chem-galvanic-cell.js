// A Daniell cell, working: Zn(s) | Zn²⁺ || Cu²⁺ | Cu(s). Zinc is oxidised at the anode (−), electrons run through the wire to the
// copper cathode (+) where Cu²⁺ is reduced; the salt bridge sends anions toward Zn and cations toward Cu to keep the beakers
// neutral. Slide the two concentrations and read the voltage from the Nernst equation, E = 1.10 − (0.0592/2) log([Zn²⁺]/[Cu²⁺]).
// Press Run to use the cell up and watch E fall.
import { canvas, text, row, slider, button, readout, loop, title } from '../kit.js';

export default function (host) {
  let Zn = 1, Cu = 1, t = 0, phase = 0, run = false, mZn = 1, mCu = 1;
  const cv = canvas(host, { aspect: 0.95, max: 460, min: 330, label: 'A zinc copper galvanic cell with electrons in the wire and ions in the salt bridge' });
  const c1 = row(host);
  const sz = slider(c1, { label: '[Zn²⁺] (M)', min: 0.001, max: 2, value: Zn, log: true, fmt: (v) => v.toFixed(3), oninput: (v) => { Zn = v; } });
  const sc = slider(c1, { label: '[Cu²⁺] (M)', min: 0.001, max: 2, value: Cu, log: true, fmt: (v) => v.toFixed(3), oninput: (v) => { Cu = v; } });
  const c2 = row(host);
  const rb = button(c2, '▶ Run the cell', () => { run = !run; rb.textContent = run ? '❚❚ Stop' : '▶ Run the cell'; });
  button(c2, 'Reset', () => { Zn = 1; Cu = 1; mZn = mCu = 1; sz.set(1); sc.set(1); });
  const E = () => 1.10 - (0.0592 / 2) * Math.log10(Zn / Cu);
  const out = readout(host);
  loop(host, (dt) => {
    t += dt; const e = Math.max(0, E());
    phase += dt * Math.min(3, e * 1.6 + 0.2) * (e > 0.02 ? 1 : 0.1);
    if (run && e > 0.02) { const k = dt * 0.03; Zn = Math.min(2, Zn + k); Cu = Math.max(0.001, Cu - k); sz.set(Zn); sc.set(Cu); mZn = Math.max(0.35, mZn - k * 0.8); mCu = Math.min(1.6, mCu + k * 0.8); }
    cv.redraw(); show();
  });
  function show() { const e = E(); out.innerHTML = `E<sub>cell</sub> = 1.10 − 0.0296 log(${Zn.toFixed(3)} ÷ ${Cu.toFixed(3)}) = <b>${e.toFixed(3)} V</b>. Standard cell: both 1 M gives E° = 1.10 V. ${e < 0.03 ? 'E is near 0: equilibrium (the cell is "dead"; at equilibrium K = 10<sup>2E°/0.0592</sup> ≈ 10<sup>37</sup>).' : 'Raise [Cu²⁺] or lower [Zn²⁺] and E rises; the reverse makes it fall.'} Electrons flow Zn → Cu through the wire; current flows the other way.`; }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Daniell cell: Zn | Zn²⁺ || Cu²⁺ | Cu', col);
    const by = 130, bh = h - by - 30, bw = w * 0.36, lx = w * 0.07, rx = w * 0.57, e = E();
    // beakers
    [[lx, col.s[0], 'ZnSO₄', Zn], [rx, col.s[1], 'CuSO₄', Cu]].forEach(([x, c, nm, conc]) => {
      ctx.fillStyle = c; ctx.globalAlpha = 0.1 + 0.18 * Math.min(1, Math.log10(conc * 1000 + 1) / 3.3); ctx.fillRect(x, by + 20, bw, bh - 20); ctx.globalAlpha = 1;
      ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.strokeRect(x, by, bw, bh); text(ctx, nm, x + bw / 2, by + bh + 14, { color: col.ink, size: 11, weight: 700, align: 'center' });
    });
    // electrodes
    const ew = 16, zh = bh * 0.7 * mZn, ch = bh * 0.55 * mCu;
    ctx.fillStyle = col.muted; ctx.fillRect(lx + bw / 2 - ew / 2, by - 24, ew, zh + 24 + 20 - 20); ctx.fillStyle = col.s[5]; ctx.fillRect(rx + bw / 2 - ew * (0.5 + 0.3 * (mCu - 1)), by - 24, ew * (1 + 0.6 * (mCu - 1)), ch + 24 + 20);
    text(ctx, 'Zn (−) anode', lx + bw / 2, by + bh * 0.82, { color: col.bg, size: 9, weight: 700, align: 'center' }); text(ctx, 'Cu (+)', rx + bw / 2, by + bh * 0.62, { color: col.bg, size: 9, weight: 700, align: 'center' });
    // wire along the top and electrons
    const wy = 70, xa = lx + bw / 2, xb = rx + bw / 2;
    ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(xa, by - 24); ctx.lineTo(xa, wy); ctx.lineTo(xb, wy); ctx.lineTo(xb, by - 24); ctx.stroke();
    const mx = (xa + xb) / 2; ctx.fillStyle = col.panel; ctx.fillRect(mx - 30, wy - 14, 60, 28); ctx.strokeStyle = col.ink; ctx.strokeRect(mx - 30, wy - 14, 60, 28);
    text(ctx, `${e.toFixed(2)} V`, mx, wy, { color: col.ink, size: 13, weight: 700, align: 'center', fit: false });
    for (let k = 0; k < 7; k++) { const f = (k / 7 + phase * 0.25) % 1, x = xa + (xb - xa) * f, y = wy; if (x > mx - 32 && x < mx + 32) continue; ctx.beginPath(); ctx.arc(x, y, 4, 0, 7); ctx.fillStyle = col.s[2]; ctx.fill(); }
    text(ctx, 'e⁻ →', xa + 8, wy - 14, { color: col.s[2], size: 11, weight: 700 });
    // salt bridge
    const sy = by + 4, sx0 = lx + bw * 0.8, sx1 = rx + bw * 0.2;
    ctx.strokeStyle = col.muted; ctx.lineWidth = 12; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(sx0, by + 34); ctx.lineTo(sx0, sy - 14); ctx.lineTo(sx1, sy - 14); ctx.lineTo(sx1, by + 34); ctx.stroke();
    ctx.strokeStyle = col.panel; ctx.lineWidth = 8; ctx.stroke();
    ctx.lineCap = 'butt';
    const bl = (sx1 - sx0);
    for (let k = 0; k < 4; k++) { const f = (k / 4 + phase * 0.12) % 1; ctx.beginPath(); ctx.arc(sx1 - bl * f, sy - 14, 3.5, 0, 7); ctx.fillStyle = col.s[3]; ctx.fill(); const g = (k / 4 + 0.12 + phase * 0.12) % 1; ctx.beginPath(); ctx.arc(sx0 + bl * g, sy - 14, 3.5, 0, 7); ctx.fillStyle = col.s[4]; ctx.fill(); }
    text(ctx, 'salt bridge: anions (pink) → Zn side, cations (sky) → Cu side', 8, h - 6, { color: col.muted, size: 9 });
    text(ctx, 'Zn → Zn²⁺ + 2e⁻', lx + 2, by + bh * 0.3, { color: col.s[0], size: 10, weight: 700 }); text(ctx, 'Cu²⁺ + 2e⁻ → Cu', rx + 2, by + bh * 0.3, { color: col.s[1], size: 10, weight: 700 });
  };
  show();
}
