// 5.3 Critical density. The density that makes the universe exactly flat depends only on the expansion rate:
// ρc = 3H²/(8πG). Slide H0 to see it in kg per cubic metre and in hydrogen atoms per cubic metre, drawn as
// atoms in a 1 m box; then slide Ω (actual density ÷ critical) to see the fate in the old matter-only picture.
import { canvas, text, title, dot, row, slider, readout, rng } from '../../kit.js';
import { criticalDensity, M_P } from '../phys.js';

export default function (host) {
  const cv = canvas(host, { aspect: 0.6, max: 360, min: 270, label: 'Hydrogen atoms in a cubic metre at the critical density' });
  let H0 = 70, Om = 1;
  const ctl = row(host);
  slider(ctl, { label: 'Hubble constant H₀', min: 50, max: 100, step: 1, value: H0, fmt: (v) => `${v} km/s/Mpc`, oninput: (v) => { H0 = v; show(); cv.redraw(); } });
  slider(ctl, { label: 'Ω = density ÷ critical', min: 0.2, max: 2, step: 0.05, value: Om, fmt: (v) => v.toFixed(2), oninput: (v) => { Om = v; show(); cv.redraw(); } });
  const out = readout(host);
  const r = rng(9), spots = Array.from({ length: 40 }, () => [r(), r()]);
  const sci = (v) => { const e = Math.floor(Math.log10(v)); return `${(v / 10 ** e).toFixed(2)} × 10<sup>${e}</sup>`; };
  const show = () => {
    const rc = criticalDensity(H0);
    out.innerHTML = `Critical density: <b>${sci(rc)}</b> kg/m³, about <b>${(rc / M_P).toFixed(1)} hydrogen atoms per cubic metre</b>. With Ω = ${Om.toFixed(2)}, a universe of matter alone would be ${Om > 1.001 ? '<b>closed</b>: it stops and collapses' : Om < 0.999 ? '<b>open</b>: it expands forever' : '<b>flat</b>: just balanced'}.`;
  };
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'How much stuff makes the universe flat?', col) + 10;
    const S = Math.min(h - top - 50, w * 0.6) * 0.88, x0 = (w - S * 1.25) / 2, y0 = top + S * 0.12 + 2;
    ctx.strokeStyle = col.ink; ctx.lineWidth = 1.5; ctx.strokeRect(x0, y0, S, S);
    ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x0 + S * 0.25, y0 - S * 0.12 + 4); ctx.lineTo(x0 + S * 1.25, y0 - S * 0.12 + 4); ctx.lineTo(x0 + S, y0); ctx.moveTo(x0 + S * 1.25, y0 - S * 0.12 + 4); ctx.lineTo(x0 + S * 1.25, y0 + S * 0.88); ctx.lineTo(x0 + S, y0 + S); ctx.strokeStyle = col.muted; ctx.lineWidth = 1; ctx.stroke();
    const n = Math.round((criticalDensity(H0) / M_P) * Om);
    spots.slice(0, Math.min(40, n)).forEach(([u, v]) => dot(ctx, x0 + 8 + u * (S - 16), y0 + 8 + v * (S - 16), 4, col.s[0]));
    text(ctx, `1 m: about ${n} atoms`, x0 + S / 2, y0 + S + 14, { color: col.ink, size: 12, weight: 600, align: 'center' });
  };
  show(); cv.redraw();
}
