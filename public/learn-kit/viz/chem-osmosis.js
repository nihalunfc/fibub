// Osmosis and reverse osmosis: a solution (left, with a piston) and pure water (right) share a semipermeable membrane that
// lets only water through. Water enters the solution until the piston pressure equals the osmotic pressure π = CRT.
// Slide the solute amount, temperature and the pressure you push with; push harder than π and the water is forced
// out (reverse osmosis, as in desalination). Press Reset to start again.
import { canvas, text, row, slider, button, readout, loop, title } from '../kit.js';

const R = 0.0821; // L atm / (mol K)
export default function (host) {
  let C0 = 0.5, T = 298, Pext = 0, vol = 0.5, ps = [], ws = [];
  const cv = canvas(host, { aspect: 0.8, max: 430, min: 300, label: 'Two compartments separated by a semipermeable membrane with water moving through it' });
  const c1 = row(host);
  slider(c1, { label: 'Solute (mol/L at start)', min: 0.1, max: 1, step: 0.05, value: C0, fmt: (v) => v.toFixed(2), oninput: (v) => { C0 = v; reset(); } });
  slider(c1, { label: 'Temperature (K)', min: 280, max: 340, step: 2, value: T, oninput: (v) => { T = v; } });
  slider(c1, { label: 'Pressure on piston (atm)', min: 0, max: 40, step: 1, value: 0, oninput: (v) => { Pext = v; } });
  const c2 = row(host); button(c2, 'Reset', () => reset());
  const out = readout(host);
  function reset() { vol = 0.5; ps = Array.from({ length: 14 }, () => ({ x: Math.random(), y: Math.random() })); ws = Array.from({ length: 40 }, () => ({ x: Math.random(), y: Math.random(), side: Math.random() < 0.5 ? 0 : 1 })); show(); }
  const pi = () => C0 * 0.5 / vol * R * T; // moles of solute = C0 x 0.5 L
  loop(host, (dt) => {
    const flux = Math.max(-0.12, Math.min(0.12, 0.035 * (pi() - Pext)));
    vol = Math.max(0.25, Math.min(1.0, vol + flux * dt * 1.2));
    ps.forEach((p) => { p.x = Math.max(0.02, Math.min(0.98, p.x + (Math.random() - 0.5) * 0.04)); p.y = Math.max(0.02, Math.min(0.98, p.y + (Math.random() - 0.5) * 0.04)); });
    ws.forEach((p) => { p.x = Math.max(0.02, Math.min(0.98, p.x + (Math.random() - 0.5) * 0.05)); p.y = Math.max(0.02, Math.min(0.98, p.y + (Math.random() - 0.5) * 0.05)); if (Math.random() < 0.01 + Math.abs(flux) * 0.5 * (Math.random() < 0.5 ? 1 : 0.2)) { if ((flux > 0 && p.side === 1) || (flux < 0 && p.side === 0) || Math.random() < 0.02) p.side = 1 - p.side; } });
    cv.redraw(); show();
  });
  function show() {
    const p = pi(), net = p - Pext;
    out.innerHTML = `Solute concentration now ${(C0 * 0.5 / vol).toFixed(2)} mol/L. Osmotic pressure π = CRT = ${(C0 * 0.5 / vol).toFixed(2)} × 0.0821 × ${T} = <b>${p.toFixed(1)} atm</b>. You push with ${Pext} atm: ${Math.abs(net) < 0.5 ? '<b>balanced</b> (no net flow)' : net > 0 ? 'water flows <b>into</b> the solution (osmosis), which dilutes it and lowers π' : '<b>reverse osmosis</b>: water is forced out of the solution into the pure side'}. Only the amount of solute matters (colligative), not what it is.`;
  }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Osmosis: solution | membrane | water', col);
    const top = 44, ht = h - top - 14, bx = 14, mx = w / 2, bw = mx - bx - 4, lvl = 1.0;
    const lh = ht * (0.3 + vol * 0.7);
    // left tank water level via piston
    ctx.fillStyle = col.s[0]; ctx.globalAlpha = 0.16; ctx.fillRect(bx, top + ht - lh, bw, lh); ctx.fillRect(mx + 6, top + ht - ht * 0.65, w - mx - 20, ht * 0.65); ctx.globalAlpha = 1;
    ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.strokeRect(bx, top, w - bx * 2, ht);
    ctx.save(); ctx.setLineDash([3, 3]); ctx.strokeStyle = col.s[1]; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(mx, top); ctx.lineTo(mx, top + ht); ctx.stroke(); ctx.restore();
    // piston on left
    ctx.fillStyle = col.muted; ctx.fillRect(bx, top + ht - lh - 8, bw, 8);
    ctx.fillRect(bx + bw / 2 - 2, top + ht - lh - 8 - 14 - Math.min(40, Pext), 4, 14 + Math.min(40, Pext));
    text(ctx, `${Pext} atm`, bx + bw / 2 + 8, top + ht - lh - 22 - Math.min(40, Pext) / 2, { color: col.muted, size: 10 });
    // particles
    ws.forEach((p) => { const inL = p.side === 0, x = inL ? bx + 3 + p.x * (bw - 6) : mx + 8 + p.x * (w - mx - 24), yb = inL ? lh : ht * 0.65, y = top + ht - 4 - p.y * (yb - 12); ctx.beginPath(); ctx.arc(x, y, 2.2, 0, 7); ctx.fillStyle = col.s[0]; ctx.fill(); });
    ps.forEach((p) => { const x = bx + 6 + p.x * (bw - 12), y = top + ht - 6 - p.y * (lh - 20); ctx.beginPath(); ctx.arc(x, y, 5, 0, 7); ctx.fillStyle = col.s[1]; ctx.fill(); });
    text(ctx, 'solution', bx + 6, top + 12, { color: col.s[1], size: 11, weight: 700 }); text(ctx, 'pure water', mx + 10, top + 12, { color: col.s[0], size: 11, weight: 700 });
    text(ctx, 'membrane: water only', mx, top + ht + 8, { color: col.muted, size: 10, align: 'center' });
  };
  reset();
}
