// Class 12 Dual Nature: three ways to free electrons from a metal. Electrons are held in the metal by an energy barrier, the work function phi
// (a few eV). To get out an electron needs at least phi: from heat (thermionic emission), from a very strong electric field pulling on it
// (field emission), or from light (photoelectric emission). Choose a method and watch one electron leave.
import { canvas, text, title, row, choice, readout, line, dot, loop, rng, arrow } from '../../kit.js';
import { wavy } from '../c12p-optlib.js';

export default function (host) {
  let m = 'heat', t = 0;
  const cv = canvas(host, { aspect: 0.7, max: 440, min: 270, label: 'Electrons leaving a metal by heating, a strong electric field or light' });
  const ctl = row(host);
  choice(ctl, 'Method', [['heat', 'Heat'], ['field', 'Strong field'], ['light', 'Light']], m, (v) => { m = v; t = 0; cv.redraw(); });
  loop(host, (dt) => { t += dt; cv.redraw(); }).button(ctl);
  const out = readout(host);
  const r = rng(11), E = Array.from({ length: 14 }, () => ({ x: r(), y: r(), a: r() * 6.28, b: r() * 6.28 }));
  E[3].x = 0.92; E[3].y = 0.42;
  const TXT = { heat: 'Thermionic emission: heating makes the electrons jiggle faster. A few get more than φ and escape, like drops flying off a hot tawa. (Old TV tubes and valves.)', field: 'Field emission: a very strong electric field (about 10⁸ V/m, at a sharp tip) pulls electrons out through the barrier. No heat or light needed.', light: 'Photoelectric emission: a photon gives all of its energy hν to one electron. If hν is at least φ, the electron escapes. This is the subject of the chapter.' };
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Getting an electron out of a metal', col) + 6, bx = 16, bw = w * 0.34, by = top + 8, bh = (h - top) * 0.7;
    ctx.fillStyle = m === 'heat' ? 'rgba(220,90,40,0.25)' : col.soft; ctx.fillRect(bx, by, bw, bh); ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.strokeRect(bx, by, bw, bh);
    text(ctx, 'metal', bx + bw / 2, by + bh + 12, { color: col.muted, size: 10.5, align: 'center' });
    const amp = m === 'heat' ? 7 : 2.5, ph = (t % 2.4) / 2.4, esc = 3;
    E.forEach((e, k) => {
      let x = bx + 8 + e.x * (bw - 16) + amp * Math.sin(t * 7 + e.a), y = by + 8 + e.y * (bh - 16) + amp * Math.cos(t * 6 + e.b);
      if (k === esc) { const s = m === 'light' ? Math.max(0, (ph - 0.35) / 0.65) : m === 'field' ? ph : Math.max(0, (ph - 0.2) / 0.8); x += s * (w - 30 - x) * 0.9; y -= s * 12 * Math.sin(s * 3); if (m === 'field') y += 0; }
      dot(ctx, x, y, 4, col.s[0]); if (k === esc) dot(ctx, x, y, 4, col.s[3], col.ink);
    });
    const ex = bx + bw;
    if (m === 'light') {
      const py = by + 8 + E[3].y * (bh - 16), s = Math.min(1, ph / 0.35), x1 = ex + 20 + (1 - s) * (w - ex - 120);
      if (ph < 0.35) wavy(ctx, x1, x1 + 66, py, 6, 14, t * 12, col.s[4], 2.5);
      text(ctx, 'photon hν', w - 10, py - 18, { color: col.s[4], size: 11, weight: 700, align: 'right' });
    }
    if (m === 'field') for (let k = 0; k < 4; k++) arrow(ctx, w - 24, by + 20 + k * (bh / 4), ex + 14, by + 20 + k * (bh / 4), col.s[1], 2, 8), text(ctx, 'E (strong)', w - 10, by + 8, { color: col.s[1], size: 11, weight: 700, align: 'right' });
    out.innerHTML = TXT[m] + ' In every case the electron must gain at least the <b>work function φ</b> (for sodium 2.3 eV, for copper 4.7 eV).';
  };
  cv.redraw();
}
