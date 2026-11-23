// Class 11 Chemistry, Equilibrium: the common-ion effect. 0.10 mol/L ethanoic (acetic) acid, Ka = 1.8e-5, with sodium ethanoate added. The extra A- pushes CH3COOH <=> H+ + CH3COO- to the left (Le Chatelier).
// x (s + x) = Ka (c - x) with c = 0.10 and s = sodium ethanoate; x = [H+]. With s = 0 the acid is 1.3 % ionised, pH 2.88; with s = 0.10 it is 0.018 % and pH 4.74 (a buffer). Ka: CRC Handbook.
import { canvas, text, title, row, slider, readout } from '../../kit.js';

export default function (host) {
  let s = 0;
  const Ka = 1.8e-5, c = 0.1;
  const cv = canvas(host, { aspect: 0.85, max: 440, min: 300, label: 'Common ion effect of sodium ethanoate on the ionisation of ethanoic acid' });
  const ctl = row(host), ro = readout(host);
  slider(ctl, { label: 'sodium ethanoate added (mol/L)', min: 0, max: 0.5, step: 0.01, value: s, fmt: (v) => v.toFixed(2), oninput: (v) => { s = v; go(); } });
  const x = () => { const b = s + Ka, d = b * b + 4 * Ka * c; return (-b + Math.sqrt(d)) / 2; };
  const go = () => { const v = x(); ro.textContent = `With ${s.toFixed(2)} M CH₃COONa added: [H⁺] = ${v.toExponential(2)} M, pH = ${(-Math.log10(v)).toFixed(2)}, acid ionised = ${(100 * v / c).toFixed(3)} %. Without it: pH 2.88, 1.3 %.`; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const v = x(), t0 = title(ctx, 'Add a common ion: the acid ionises less', col), bx = 20, bw = w - 40, y1 = t0 + 40;
    const bar = (y, f, lab, c1) => { ctx.strokeStyle = col.ink; ctx.lineWidth = 1.5; ctx.strokeRect(bx, y, bw, 22); ctx.fillStyle = c1; ctx.fillRect(bx, y, Math.max(2, bw * f), 22); text(ctx, lab, bx, y - 10, { color: col.muted, size: 11 }); };
    const a0 = (-Ka + Math.sqrt(Ka * Ka + 4 * Ka * c)) / 2 / c;
    bar(y1, a0 / 0.02, 'no salt: 1.3 % ionised (bar is 0 to 2 %)', col.s[0]); bar(y1 + 56, (v / c) / 0.02, 'with salt: ' + (100 * v / c).toFixed(3) + ' % ionised', col.s[2]);
    const y3 = y1 + 130, X = (p) => bx + p / 7 * bw; ctx.strokeStyle = col.muted; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(bx, y3); ctx.lineTo(bx + bw, y3); ctx.stroke();
    [0, 2, 4, 6].forEach((p) => text(ctx, 'pH ' + p, X(p), y3 + 14, { color: col.muted, size: 10, align: 'center' }));
    const ph = -Math.log10(v); ctx.beginPath(); ctx.arc(X(2.88), y3, 5, 0, 7); ctx.fillStyle = col.s[0]; ctx.fill(); ctx.beginPath(); ctx.arc(X(ph), y3, 7, 0, 7); ctx.fillStyle = col.s[3]; ctx.fill(); text(ctx, 'pH ' + ph.toFixed(2), X(ph), y3 - 16, { color: col.s[3], size: 12, weight: 700, align: 'center' });
    text(ctx, 'CH₃COOH ⇌ H⁺ + CH₃COO⁻   (extra CH₃COO⁻ pushes this left)', w / 2, h - 14, { color: col.ink, size: 11, weight: 700, align: 'center' });
  };
  go();
}
