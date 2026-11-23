// Class 11 Chemistry, Some Basic Concepts: dilution. Adding solvent does not change the moles of solute: M1 V1 = M2 V2.
// Solute dots stay the same in number while the volume grows, so the colour fades and the molarity falls.
import { canvas, text, title, row, slider, readout, rng } from '../../kit.js';

export default function (host) {
  let M1 = 2, V1 = 100, add = 0;
  const cv = canvas(host, { aspect: 0.85, max: 440, min: 300, label: 'A beaker of solution being diluted with water, the solute count staying constant' });
  const ctl = row(host), ro = readout(host), R = rng(5);
  const pts = Array.from({ length: 80 }, () => [R(), R()]);
  slider(ctl, { label: 'start molarity (mol/L)', min: 0.5, max: 4, step: 0.5, value: M1, fmt: (v) => v.toFixed(1), oninput: (v) => { M1 = v; go(); } });
  slider(ctl, { label: 'water added (mL)', min: 0, max: 400, step: 10, value: add, fmt: (v) => v.toFixed(0), oninput: (v) => { add = v; go(); } });
  const go = () => { const n = M1 * V1 / 1000, V2 = V1 + add; ro.textContent = `Moles of solute stay ${n.toFixed(2)} mol. New volume ${V2} mL, so M₂ = M₁V₁/V₂ = ${M1} × ${V1} / ${V2} = ${(M1 * V1 / V2).toFixed(2)} mol/L.`; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const t0 = title(ctx, 'dilution: M₁V₁ = M₂V₂', col) + 10, V2 = V1 + add, bw = w * 0.5, bx = (w - bw) / 2, bb = h - 30, maxH = bb - t0 - 10, hh = maxH * V2 / 500, m2 = M1 * V1 / V2;
    ctx.fillStyle = col.s[0]; ctx.globalAlpha = 0.1 + 0.7 * (m2 / 4); ctx.fillRect(bx, bb - hh, bw, hh); ctx.globalAlpha = 1;
    ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(bx, t0 + 4); ctx.lineTo(bx, bb); ctx.lineTo(bx + bw, bb); ctx.lineTo(bx + bw, t0 + 4); ctx.stroke();
    const n = Math.round(M1 * V1 / 5); ctx.fillStyle = col.s[2]; for (let i = 0; i < Math.min(80, n); i++) { ctx.beginPath(); ctx.arc(bx + 8 + pts[i][0] * (bw - 16), bb - 8 - pts[i][1] * (hh - 16), 3.2, 0, 7); ctx.fill(); }
    text(ctx, `${V2} mL`, bx + bw + 8, bb - hh, { color: col.ink, size: 12, weight: 700 }); text(ctx, `${m2.toFixed(2)} M`, bx + bw / 2, bb + 14, { color: col.ink, size: 13, weight: 700, align: 'center' });
    text(ctx, `${Math.min(80, n)} dots of solute`, 6, t0 + 14, { color: col.s[2], size: 11, weight: 700 }); text(ctx, 'never changes', 6, t0 + 28, { color: col.muted, size: 11 });
  };
  go();
}
