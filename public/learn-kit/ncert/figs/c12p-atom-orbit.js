// Class 12 Atoms: Bohr orbits and jumps. In the Bohr model the electron of hydrogen moves in circles of radius r_n = 0.0529 n^2 nm with energy
// E_n = -13.6 / n^2 eV. It radiates only when it jumps from a higher orbit n_i to a lower one n_f, giving one photon of energy E_i - E_f = 13.6 (1/n_f^2 - 1/n_i^2) eV
// and wavelength 1240 / E nm; to go up it must absorb a photon of exactly that energy. Orbits are drawn to scale (radius proportional to n^2).
import { canvas, text, title, row, choice, readout, line, dot, loop, ease } from '../../kit.js';
import { wl2rgb, wavy, HC_EV_NM } from '../c12p-optlib.js';

const SERIES = { 1: 'Lyman (ultraviolet)', 2: 'Balmer (visible)', 3: 'Paschen (infrared)', 4: 'Brackett (infrared)', 5: 'Pfund (infrared)' };
export default function (host) {
  let n = 3, from = 3, to = 3, tj = 1, ang = 0, ph = null, last = '';
  const cv = canvas(host, { aspect: 0.86, max: 440, min: 300, label: 'Bohr model: an electron jumps between orbits and emits or absorbs a photon' });
  const ctl = row(host);
  choice(ctl, 'Send the electron to n =', [1, 2, 3, 4, 5, 6].map((k) => [k, String(k)]), 3, (v) => { if (tj < 1) return; from = n; to = v; if (to === from) return; tj = 0; const dE = 13.6 * Math.abs(1 / (to * to) - 1 / (from * from)), lam = HC_EV_NM / dE; ph = { up: to > from, lam, dE, t: 0 }; last = to < from ? `n = ${from} → ${to}: photon <b>emitted</b>, E = ${dE.toFixed(2)} eV, λ = <b>${lam.toFixed(1)} nm</b>` + (to <= 5 ? `, ${SERIES[to]} series.` : '.') : `n = ${from} → ${to}: the electron <b>absorbed</b> a photon of exactly ${dE.toFixed(2)} eV (λ = ${lam.toFixed(1)} nm).`; });
  loop(host, (dt) => { ang += dt * (3.5 / Math.pow(Math.max(1, tj < 1 ? from + (to - from) * tj : n), 1.5)); if (tj < 1) { tj = Math.min(1, tj + dt / 1.1); if (tj >= 1) n = to; } if (ph) { ph.t += dt; if (ph.t > 2.6) ph = null; } cv.redraw(); });
  const out = readout(host);
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Hydrogen: jumps between orbits', col) + 6, cx = w * 0.36, cy = top + (h - top) * 0.5, unit = Math.min(cx - 14, (h - top) / 2 - 10) / 36;
    for (let k = 1; k <= 6; k++) { ctx.strokeStyle = k === (tj >= 1 ? n : -1) ? col.s[1] : col.line; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.arc(cx, cy, k * k * unit, 0, 7); ctx.stroke(); if (k >= 3) text(ctx, `n=${k}`, cx + k * k * unit * 0.707 + 2, cy - k * k * unit * 0.707 - 3, { color: col.muted, size: 9.5 }); }
    dot(ctx, cx, cy, 5, col.s[3]); text(ctx, 'p', cx + 7, cy + 11, { color: col.s[3], size: 10, weight: 700 });
    const cur = tj < 1 ? from + (to - from) * ease(tj) : n, r = cur * cur * unit;
    dot(ctx, cx + r * Math.cos(ang), cy - r * Math.sin(ang), 5, col.s[0], col.ink);
    if (ph) {
      const c = wl2rgb(ph.lam), x = ph.up ? w - 24 - ph.t * 120 : cx + r + 12 + ph.t * 120;
      if (x > cx + 10 && x < w - 8) wavy(ctx, Math.max(cx + 10, x), Math.min(w - 8, x + 60), cy - 30, 8, Math.max(8, ph.lam / 40), ph.t * 20, c, 3);
      text(ctx, `${ph.up ? 'absorbed' : 'emitted'}: ${ph.lam.toFixed(0)} nm`, w - 10, cy - 52, { color: col.ink, size: 11, weight: 700, align: 'right' });
    }
    // energy levels at right
    const lx0 = w * 0.78, lx1 = w - 8, ly0 = top + 8, ly1 = h - 14, Y = (e) => ly0 + ((0 - e) / 13.6) * (ly1 - ly0) * 0.9;
    for (let k = 1; k <= 6; k++) { const e = -13.6 / (k * k); line(ctx, [[lx0, Y(e)], [lx1, Y(e)]], k === n && tj >= 1 ? col.s[1] : col.muted, k === n && tj >= 1 ? 3 : 1.2); if (k <= 3) text(ctx, `${e.toFixed(1)}`, lx0 - 4, Y(e), { color: col.muted, size: 9.5, align: 'right' }); }
    text(ctx, '0 eV (free)', lx1, ly0 - 2, { color: col.muted, size: 9.5, align: 'right' }); text(ctx, 'E (eV)', lx0 - 4, ly1 + 10, { color: col.muted, size: 9.5, align: 'right' });
    const ncur = tj >= 1 ? n : to;
    out.innerHTML = (last || 'Press a number: the electron jumps to that orbit. Going down emits a photon; going up absorbs one.') + ` Now n = ${ncur}: r = ${(0.0529 * ncur * ncur).toFixed(3)} nm, v = ${(2.19 / ncur).toFixed(2)}×10⁶ m/s, E = ${(-13.6 / (ncur * ncur)).toFixed(2)} eV.`;
  };
  cv.redraw();
}
