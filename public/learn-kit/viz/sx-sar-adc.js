// A successive-approximation ADC, one bit at a time. The converter guesses the top bit (half of full scale), a DAC makes
// that voltage, a comparator says whether V_in is higher; if not, the bit is dropped. Then the next bit is tried, and so on:
// n bits take n comparisons (a binary search). Move V_in, pick the number of bits, press Next step (or use the step player).
import { canvas, line, dot, text, row, slider, choice, button, readout, title } from '../kit.js';

export default function (host) {
  let nb = 4, k = 0;
  const cv = canvas(host, { aspect: 0.72, max: 340, min: 270, label: 'Successive approximation: trial levels and the input voltage' });
  const ctl = row(host);
  const sv = slider(ctl, { label: 'V_in (V_ref = 5 V)', min: 0, max: 4.99, step: 0.01, value: 3.3, fmt: (v) => v.toFixed(2) + ' V', oninput: () => { k = 0; show(); } });
  choice(ctl, 'Bits', [[3, '3'], [4, '4'], [5, '5'], [6, '6']], nb, (v) => { nb = v; k = 0; show(); });
  const ctl2 = row(host);
  button(ctl2, 'Next step ▸', () => { k = k >= nb ? 0 : k + 1; show(); });
  button(ctl2, 'Reset', () => { k = 0; show(); });
  const out = readout(host);
  const VR = 5;
  const run = () => { let code = 0; const tr = []; for (let b = nb - 1; b >= 0; b--) { const trial = code | (1 << b), v = (trial / 2 ** nb) * VR, keep = sv.value >= v; tr.push({ b, trial, v, keep }); if (keep) code = trial; } return { tr, code }; };
  function show() {
    const { tr, code } = run(), d = tr.slice(0, k), cur = d.reduce((c, t) => (t.keep ? t.trial : c), 0);
    out.innerHTML = k === 0 ? `<b>Start:</b> all bits 0. V_in = ${sv.value.toFixed(2)} V, LSB = ${(VR / 2 ** nb).toFixed(3)} V. Press Next step: the first trial is the top bit, ${(VR / 2).toFixed(2)} V.` : `<b>Step ${k} of ${nb}:</b> trial bit b${tr[k - 1].b} makes ${tr[k - 1].v.toFixed(3)} V; V_in is ${tr[k - 1].keep ? 'at least that, so the bit is KEPT (1)' : 'lower, so the bit is DROPPED (0)'}. Code so far ${cur.toString(2).padStart(nb, '0').slice(0, k)}${'?'.repeat(nb - k)}${k === nb ? ` = ${cur}: ${(cur / 2 ** nb * VR).toFixed(3)} V, within one LSB of ${sv.value.toFixed(2)} V (error ${Math.abs(sv.value - (cur / 2 ** nb) * VR).toFixed(3)} V, < ${(VR / 2 ** nb).toFixed(3)} V).` : '.'}`;
    cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    const { tr, code } = run(), L = 46, R = w - 12, T = 40, B = h - 62, Y = (v) => B - (v / VR) * (B - T), X = (i) => L + ((i + 0.5) / nb) * (R - L);
    title(ctx, `${nb}-bit successive approximation`, col);
    ctx.strokeStyle = col.muted; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(L, T); ctx.lineTo(L, B); ctx.lineTo(R, B); ctx.stroke();
    [0, 1.25, 2.5, 3.75, 5].forEach((v) => { text(ctx, v + ' V', L - 4, Y(v), { color: col.muted, size: 10, align: 'right' }); line(ctx, [[L, Y(v)], [R, Y(v)]], col.line, 1); });
    line(ctx, [[L, Y(sv.value)], [R, Y(sv.value)]], col.s[1], 2.5, [6, 4]); text(ctx, 'V_in', R - 4, Y(sv.value) - 8, { color: col.s[1], size: 11, weight: 700, align: 'right' });
    let prev = null;
    tr.forEach((t, i) => {
      if (i > k) return;
      const x = X(i), done = i < k;
      if (i === k) { dot(ctx, x, Y(t.v), 5, col.muted); text(ctx, `try ${t.v.toFixed(2)} V`, x, Y(t.v) - 12, { color: col.muted, size: 10.5, align: 'center' }); return; }
      if (prev) line(ctx, [prev, [x, Y(t.v)]], col.s[0], 1.5, [3, 3]);
      prev = [x, Y(t.v)];
      dot(ctx, x, Y(t.v), 6, t.keep ? col.s[2] : col.s[5], col.panel);
      text(ctx, t.keep ? '1' : '0', x, Y(t.v) - 13, { color: t.keep ? col.s[2] : col.s[5], size: 13, weight: 800, align: 'center' });
    });
    for (let i = 0; i < nb; i++) { const t = tr[i], ok = i < k; text(ctx, `b${t.b}`, X(i), B + 14, { color: col.muted, size: 10.5, align: 'center' }); text(ctx, ok ? String(t.keep ? 1 : 0) : '·', X(i), B + 34, { color: ok ? (t.keep ? col.s[2] : col.s[5]) : col.muted, size: 15, weight: 800, align: 'center' }); }
  };
  show();
  return { step(i) { k = Math.min(nb, Math.max(0, i)); show(); } };
}
