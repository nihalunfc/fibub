// Class 10 Real Numbers: HCF and LCM from prime factors with a Venn picture. The primes both numbers share sit in the
// overlap (their product is the HCF); every prime in either circle, the shared ones counted once, multiplies to the LCM.
// Check: HCF x LCM = a x b.
import { canvas, text, title, dot, row, slider, readout } from '../../kit.js';

const fac = (n) => { const m = {}; for (let p = 2; p * p <= n; p++) while (n % p === 0) { m[p] = (m[p] || 0) + 1; n /= p; } if (n > 1) m[n] = (m[n] || 0) + 1; return m; };
export default function (host) {
  let a = 12, b = 18;
  const cv = canvas(host, { aspect: 0.85, max: 440, min: 300, label: 'Venn diagram of the prime factors of two numbers showing HCF in the overlap and LCM as the union' });
  const ctl = row(host);
  slider(ctl, { label: 'First number', min: 2, max: 120, step: 1, value: a, fmt: (v) => String(v), oninput: (v) => { a = v; cv.redraw(); } });
  slider(ctl, { label: 'Second number', min: 2, max: 120, step: 1, value: b, fmt: (v) => String(v), oninput: (v) => { b = v; cv.redraw(); } });
  const out = readout(host);
  const zones = () => {
    const fa = fac(a), fb = fac(b), A = [], B = [], C = [];
    for (const p of new Set([...Object.keys(fa), ...Object.keys(fb)])) {
      const x = fa[p] || 0, y = fb[p] || 0, m = Math.min(x, y);
      for (let i = 0; i < m; i++) C.push(+p); for (let i = m; i < x; i++) A.push(+p); for (let i = m; i < y; i++) B.push(+p);
    }
    return { A, B, C };
  };
  const prod = (l) => l.reduce((x, y) => x * y, 1);
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Prime factors in a Venn diagram', col) + 18, { A, B, C } = zones();
    const r = Math.min(w * 0.27, (h - top - 14) / 2), cy = top + r + 8, d = r * 0.95, cxA = w / 2 - d / 2, cxB = w / 2 + d / 2;
    ctx.save(); ctx.globalAlpha = 0.16; ctx.fillStyle = col.s[0]; ctx.beginPath(); ctx.arc(cxA, cy, r, 0, 7); ctx.fill(); ctx.fillStyle = col.s[1]; ctx.beginPath(); ctx.arc(cxB, cy, r, 0, 7); ctx.fill(); ctx.restore();
    ctx.lineWidth = 2; ctx.strokeStyle = col.s[0]; ctx.beginPath(); ctx.arc(cxA, cy, r, 0, 7); ctx.stroke(); ctx.strokeStyle = col.s[1]; ctx.beginPath(); ctx.arc(cxB, cy, r, 0, 7); ctx.stroke();
    text(ctx, String(a), cxA - r * 0.55, cy - r - 4 < 22 ? cy - r + 12 : cy - r - 4, { color: col.s[0], size: 13, weight: 700, align: 'center' });
    text(ctx, String(b), cxB + r * 0.55, cy - r - 4 < 22 ? cy - r + 12 : cy - r - 4, { color: col.s[1], size: 13, weight: 700, align: 'center' });
    const place = (list, cx, tone) => {
      const rows = Math.min(4, Math.max(1, list.length)), cols = Math.ceil(list.length / rows), gap = 24;
      list.forEach((p, i) => { const c = Math.floor(i / rows), rr = i % rows, nr = Math.min(rows, list.length - c * rows);
        const x = cx + (c - (cols - 1) / 2) * gap, y = cy + (rr - (nr - 1) / 2) * gap;
        dot(ctx, x, y, 11, col.panel, tone); text(ctx, String(p), x, y, { color: col.ink, size: 12, weight: 700, align: 'center' }); });
    };
    place(A, (cxA - r + cxB - r) / 2, col.s[0]); place(C, w / 2, col.s[3]); place(B, (cxA + r + cxB + r) / 2, col.s[1]);
    text(ctx, 'both', w / 2, cy + r + 12, { color: col.s[3], size: 11, weight: 700, align: 'center' });
  };
  const upd = () => { const { A, B, C } = zones(); const H = prod(C), Lc = prod([...A, ...B, ...C]);
    out.innerHTML = `HCF = product of the shared primes = <b>${C.length ? C.join(' × ') + ' = ' : ''}${H}</b>. LCM = every prime once in the union = <b>${[...A, ...C, ...B].join(' × ')} = ${Lc}</b>. Check: HCF × LCM = ${H} × ${Lc} = ${H * Lc} = ${a} × ${b} = ${a * b}.`; };
  const redraw = cv.redraw; cv.redraw = () => { upd(); redraw(); }; cv.redraw();
}
