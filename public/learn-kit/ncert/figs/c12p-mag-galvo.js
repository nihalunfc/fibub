// Class 12 Moving Charges: the moving coil galvanometer and how it becomes an ammeter or a voltmeter.
// Deflection φ = NBA·I / k, so the needle moves in proportion to the current. A galvanometer (G = 50 Ω, full scale Ig = 2 mA) is
// turned into an ammeter by a small shunt S in PARALLEL (S = Ig G /(I − Ig)) and into a voltmeter by a large resistance R in SERIES (R = V/Ig − G).
import { canvas, text, title, row, slider, choice, readout, arrow, line, dot } from '../../kit.js';
import { rad } from '../c12p-mmlib.js';

export default function (host) {
  let mode = 'g', fs = 60, rng = 0;
  const Ig = 0.002, G = 50;
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 320, label: 'A galvanometer dial and how it is converted to an ammeter or a voltmeter' });
  const ctl = row(host);
  slider(ctl, { label: 'Input as % of full scale', min: 0, max: 120, step: 2, value: fs, fmt: (x) => `${x}%`, oninput: (x) => { fs = x; cv.redraw(); } });
  choice(ctl, 'Meter', [['g', 'Galvanometer'], ['a', 'Ammeter'], ['v', 'Voltmeter']], mode, (x) => { mode = x; cv.redraw(); });
  choice(ctl, 'Range (ammeter, voltmeter)', [[0, 'small'], [1, '×10']], 0, (x) => { rng = x; cv.redraw(); });
  const out = readout(host);
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, mode === 'g' ? 'Moving coil galvanometer: φ ∝ I' : mode === 'a' ? 'Ammeter: galvanometer + small shunt S in parallel' : 'Voltmeter: galvanometer + large R in series', col);
    const mult = rng === 1 ? 10 : 1, full = mode === 'g' ? Ig : mode === 'a' ? 1 * mult : 5 * mult, unit = mode === 'v' ? 'V' : mode === 'g' ? 'mA' : 'A';
    const f = fs / 100, val = mode === 'g' ? f * Ig * 1000 : f * full, cx = w / 2, cy = top + (h * 0.52 - top) * 0.92, R = Math.min(w * 0.46, (h * 0.5 - top) * 1.0);
    ctx.save(); ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(cx, cy, R, rad(-140), rad(-40)); ctx.stroke(); ctx.restore();
    for (let k = 0; k <= 10; k++) { const a = rad(-130 + k * 8), r1 = R, r2 = R - (k % 5 === 0 ? 12 : 7); line(ctx, [[cx + r1 * Math.cos(a), cy + r1 * Math.sin(a)], [cx + r2 * Math.cos(a), cy + r2 * Math.sin(a)]], col.ink, k % 5 === 0 ? 2 : 1); if (k % 5 === 0) { const lab = mode === 'g' ? (k / 10 * 2).toFixed(0) : (k / 10 * full).toPrecision(2).replace(/\.0+$/, ''); text(ctx, lab, cx + (R - 26) * Math.cos(a), cy + (R - 26) * Math.sin(a), { color: col.muted, size: 10.5, align: 'center' }); } }
    text(ctx, unit, cx, cy - R * 0.5, { color: col.ink, size: 14, weight: 700, align: 'center' });
    const ang = rad(-130 + Math.min(1.1, f) * 80);
    line(ctx, [[cx, cy], [cx + (R - 6) * Math.cos(ang), cy + (R - 6) * Math.sin(ang)]], col.s[1], 3); dot(ctx, cx, cy, 6, col.ink);
    // circuit
    const y0 = h * 0.7, xL = 24, xR = w - 24, bx = w / 2 - 22;
    line(ctx, [[xL, y0], [bx - 40, y0]], col.ink, 2); dot(ctx, xL, y0, 4, col.ink);
    const box = (x, y, lab, c) => { ctx.save(); ctx.strokeStyle = c; ctx.lineWidth = 2; ctx.strokeRect(x - 22, y - 12, 44, 24); ctx.restore(); text(ctx, lab, x, y, { color: c, size: 11, weight: 700, align: 'center' }); };
    let msg = '';
    if (mode === 'g') { line(ctx, [[bx - 40, y0], [bx - 22 + 0, y0]], col.ink, 2); box(bx + 22, y0, 'G 50 Ω', col.s[1]); line(ctx, [[bx + 44, y0], [xR, y0]], col.ink, 2); dot(ctx, xR, y0, 4, col.ink); msg = `Current ${val.toFixed(2)} mA gives ${(f * 100).toFixed(0)}% of full deflection (full scale ${Ig * 1000} mA). More turns, a stronger B or a weaker spring make it more sensitive: φ = NBA I / k.`; }
    if (mode === 'a') {
      const S = (Ig * G) / (full - Ig); line(ctx, [[bx - 40, y0], [bx - 40, y0 - 26], [bx + 60, y0 - 26]], col.ink, 2); line(ctx, [[bx - 40, y0], [bx - 40, y0 + 26], [bx + 60, y0 + 26]], col.ink, 2);
      box(bx + 10, y0 - 26, 'G 50 Ω', col.s[1]); box(bx + 10, y0 + 26, `S ${S < 1 ? S.toFixed(3) : S.toFixed(2)} Ω`, col.s[2]);
      line(ctx, [[bx + 60, y0 - 26], [bx + 60, y0 + 26]], col.ink, 2); line(ctx, [[bx + 60, y0], [xR, y0]], col.ink, 2); dot(ctx, xR, y0, 4, col.ink);
      const Is = val - f * Ig; msg = `Range 0 to ${full} A. S = Ig G/(I − Ig) = ${Ig * 1000} mA × 50 Ω ÷ ${(full * 1000 - Ig * 1000).toFixed(0)} mA = <b>${S.toFixed(4)} Ω</b>. At ${val.toFixed(2)} A, the coil gets only ${(f * Ig * 1000).toFixed(2)} mA; the shunt carries the rest. The ammeter resistance (G and S in parallel, ${(G * S / (G + S)).toFixed(4)} Ω) is tiny, so it hardly disturbs the circuit.`;
    }
    if (mode === 'v') {
      const Rs = full / Ig - G; line(ctx, [[bx - 40, y0], [bx - 22, y0]], col.ink, 2); box(bx, y0, `R ${Rs.toFixed(0)} Ω`, col.s[2]); line(ctx, [[bx + 22, y0], [bx + 34, y0]], col.ink, 2); box(bx + 56, y0, 'G 50 Ω', col.s[1]); line(ctx, [[bx + 78, y0], [xR, y0]], col.ink, 2); dot(ctx, xR, y0, 4, col.ink);
      msg = `Range 0 to ${full} V. R = V/Ig − G = ${full} ÷ 0.002 − 50 = <b>${Rs.toFixed(0)} Ω</b>, joined in series. At ${val.toFixed(2)} V the coil carries ${(f * Ig * 1000).toFixed(2)} mA. The voltmeter resistance (R + G = ${(Rs + G).toFixed(0)} Ω) is huge, so it takes almost no current from the circuit.`;
    }
    out.innerHTML = msg + (fs > 100 ? ' <b>Over full scale: the pointer would hit its stop.</b>' : '');
    text(ctx, mode === 'g' ? 'to the circuit' : mode === 'a' ? 'joined in series with the circuit' : 'joined across the part you measure', w / 2, h - 12, { color: col.muted, size: 10.5, align: 'center' });
  };
  cv.redraw();
}
