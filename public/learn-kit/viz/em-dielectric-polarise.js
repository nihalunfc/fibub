// What a dielectric does inside a capacitor. The plates hold a fixed free charge, so the applied field E₀ stays the
// same. Each molecule is stretched (non-polar) or turned (polar, with thermal jiggle) by the field; the little bound
// charges that appear on the slab faces cancel part of E₀, leaving E = E₀/κ inside. Slide κ and watch P, σ_b and E.
import { canvas, text, row, slider, choice, readout, arrow, loop, rng } from '../kit.js';

export default function (host) {
  let kap = 4, kind = 'np', t = 0;
  const R = rng(5), ph = Array.from({ length: 24 }, () => R() * 6.28);
  const cv = canvas(host, { aspect: 0.62, max: 360, min: 260, label: 'Molecules in a dielectric slab between charged plates' });
  const ctl = row(host);
  choice(ctl, 'Molecules', [['np', 'Non-polar (stretch)'], ['p', 'Polar (turn)']], kind, (v) => { kind = v; cv.redraw(); });
  slider(ctl, { label: 'κ', min: 1, max: 10, value: kap, step: 0.1, fmt: (v) => v.toFixed(1), oninput: (v) => { kap = v; upd(); } });
  const out = readout(host);
  const anim = loop(host, (dt) => { t += dt; cv.redraw(); }); anim.button(ctl);
  function upd() { out.innerHTML = `E₀ = σ<sub>f</sub>/ε₀ (set by the plates). Inside: E = E₀/κ = <b>${(1 / kap).toFixed(2)} E₀</b>; P = ε₀(κ−1)E = <b>${((kap - 1) / kap).toFixed(2)} σ<sub>f</sub></b>; bound charge σ<sub>b</sub> = P = ${((kap - 1) / kap).toFixed(2)} σ<sub>f</sub>, so only ${(1 / kap).toFixed(2)} of the plate's field lines get through.`; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    const top = 36, bot = h - 30, L = 30, Rr = w - 30, sx = w * 0.3, sx2 = w * 0.7, f = (kap - 1) / kap;
    ctx.fillStyle = col.soft; ctx.fillRect(sx, top + 12, sx2 - sx, bot - top - 24);
    ctx.fillStyle = col.ink; ctx.fillRect(L, top - 4, Rr - L, 5); ctx.fillRect(L, bot, Rr - L, 5);
    for (let x = L + 14; x < Rr; x += 26) { text(ctx, '+', x, top - 12, { color: col.s[5], size: 13, weight: 700, align: 'center' }); text(ctx, '−', x, bot + 15, { color: col.s[0], size: 13, weight: 700, align: 'center' }); }
    // field lines: all in the gap, fewer pass through the slab
    for (let x = L + 14; x < Rr; x += 26) { const inside = x > sx && x < sx2; if (inside && ((x - L) / 26 | 0) % Math.max(1, Math.round(kap)) !== 0 && kap > 1.2) continue; arrow(ctx, x, top + 4, x, inside ? top + 12 + 14 : bot - 4, col.s[5], 1.2, 5); if (!inside) { } }
    // bound charges on the faces
    const nb = Math.round(f * 7);
    for (let i = 0; i < nb; i++) { const x = sx + 12 + (i + 0.5) * (sx2 - sx - 24) / 7; text(ctx, '−', x, top + 12 + 6, { color: col.s[0], size: 12, weight: 700, align: 'center' }); text(ctx, '+', x, bot - 12 - 6, { color: col.s[5], size: 12, weight: 700, align: 'center' }); }
    // molecules
    let n = 0;
    for (let j = 0; j < 4; j++) for (let i = 0; i < 6; i++, n++) {
      const cx = sx + 24 + i * (sx2 - sx - 48) / 5, cy = top + 40 + j * (bot - top - 90) / 3;
      let ang = Math.PI / 2, d = 5 + 6 * f; // dipole: + toward minus plate? field points down; + moves down
      if (kind === 'p') { const jig = (1 - f) * (1.6 * Math.sin(t * 5 + ph[n])); ang = Math.PI / 2 + jig * (Math.PI / 2 * (1 - f)); d = 9; }
      const dx = Math.cos(ang) * d / 2, dy = Math.sin(ang) * d / 2;
      ctx.fillStyle = col.s[0]; ctx.globalAlpha = 0.35; ctx.beginPath(); ctx.arc(cx - dx, cy - dy, 9, 0, 7); ctx.fill(); ctx.globalAlpha = 1;
      ctx.fillStyle = col.s[5]; ctx.beginPath(); ctx.arc(cx + dx, cy + dy, 3.5, 0, 7); ctx.fill();
    }
    text(ctx, `E₀ outside   E = E₀/${kap.toFixed(1)} inside`, 10, 16, { color: col.ink, size: 12, weight: 700 });
    text(ctx, 'red dot: nucleus, blue cloud: electrons', 10, h - 8, { color: col.muted, size: 10.5 });
  };
  upd();
}
