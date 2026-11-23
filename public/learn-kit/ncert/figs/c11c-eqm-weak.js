// Class 11 Chemistry, Equilibrium: ionisation of a weak acid HA <=> H+ + A-, Ka = x^2 / (c - x). Set pKa and the concentration c. Solving x^2 + Ka x - Ka c = 0 gives x = [H+], then pH = -log x and the degree of ionisation alpha = x/c.
// A strong acid is 100 % ionised (pH = -log c). A weak acid is only partly ionised, and it ionises MORE when diluted (Ostwald's dilution law, alpha ~ sqrt(Ka/c)).
import { canvas, text, title, row, slider, readout } from '../../kit.js';

export default function (host) {
  let pKa = 4.75, lc = -1;
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 330, label: 'Fraction of a weak acid that is ionised for chosen pKa and concentration' });
  const ctl = row(host), ro = readout(host);
  slider(ctl, { label: 'pKa (smaller = stronger acid)', min: 0, max: 10, step: 0.25, value: pKa, fmt: (v) => v.toFixed(2), oninput: (v) => { pKa = v; go(); } });
  slider(ctl, { label: 'concentration c (mol/L, log scale)', min: -4, max: 0, step: 0.1, value: lc, fmt: (v) => Math.pow(10, v).toPrecision(2), oninput: (v) => { lc = v; go(); } });
  const sol = () => { const Ka = Math.pow(10, -pKa), c = Math.pow(10, lc), x = (-Ka + Math.sqrt(Ka * Ka + 4 * Ka * c)) / 2; return { Ka, c, x, a: x / c, pH: -Math.log10(x), strong: -Math.log10(c) }; };
  const go = () => { const s = sol(); ro.textContent = `Ka = ${s.Ka.toExponential(2)}, c = ${s.c.toPrecision(2)} M: [H⁺] = ${s.x.toExponential(2)} M, pH = ${s.pH.toFixed(2)}, ionised = ${(100 * s.a).toFixed(s.a < 0.01 ? 2 : 1)} %. A strong acid of the same c would have pH ${s.strong.toFixed(2)}.`; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const s = sol(), t0 = title(ctx, 'Weak acid HA ⇌ H⁺ + A⁻: how much splits?', col), bx = 20, bw = w - 40, by = t0 + 46;
    const n = 40, ionised = Math.round(s.a * n), cols = 20, dw = bw / cols;
    for (let i = 0; i < n; i++) { const cx = bx + (i % cols + 0.5) * dw, cy = by + Math.floor(i / cols) * 30, on = i < ionised; if (on) { ctx.beginPath(); ctx.arc(cx - 2, cy, 5, 0, 7); ctx.fillStyle = col.bad; ctx.fill(); ctx.beginPath(); ctx.arc(cx + 5, cy + 3, 4, 0, 7); ctx.fillStyle = col.s[0]; ctx.fill(); } else { ctx.beginPath(); ctx.arc(cx, cy, 6, 0, 7); ctx.fillStyle = col.s[2]; ctx.fill(); } }
    text(ctx, 'every dot = 2.5 % of the acid: red and blue pairs are H⁺ and A⁻, green are whole HA', w / 2, by + 62, { color: col.muted, size: 10, align: 'center' });
    const y2 = by + 96; ctx.strokeStyle = col.ink; ctx.lineWidth = 1.5; ctx.strokeRect(bx, y2, bw, 18); ctx.fillStyle = col.s[3]; ctx.fillRect(bx, y2, bw * Math.min(1, s.a), 18);
    text(ctx, 'ionised: ' + (100 * s.a).toFixed(s.a < 0.01 ? 2 : 1) + ' %', bx, y2 + 34, { color: col.s[3], size: 12.5, weight: 700 });
    const y3 = y2 + 60, X = (v) => bx + v / 14 * bw; ctx.strokeStyle = col.muted; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(bx, y3); ctx.lineTo(bx + bw, y3); ctx.stroke();
    [0, 7, 14].forEach((v) => text(ctx, String(v), X(v), y3 + 14, { color: col.muted, size: 10, align: 'center' }));
    ctx.beginPath(); ctx.arc(X(s.strong), y3, 6, 0, 7); ctx.fillStyle = col.line; ctx.fill(); ctx.strokeStyle = col.ink; ctx.lineWidth = 1; ctx.stroke(); text(ctx, 'if strong', X(s.strong), y3 - 14, { color: col.muted, size: 10, align: 'center' });
    ctx.beginPath(); ctx.arc(X(Math.min(14, s.pH)), y3, 7, 0, 7); ctx.fillStyle = col.s[3]; ctx.fill(); text(ctx, 'pH ' + s.pH.toFixed(2), X(Math.min(14, s.pH)), y3 + 32, { color: col.s[3], size: 12, weight: 700, align: 'center' });
    text(ctx, 'Dilute it and a bigger share ionises: try the concentration slider.', w / 2, h - 12, { color: col.muted, size: 10.5, align: 'center' });
  };
  go();
}
