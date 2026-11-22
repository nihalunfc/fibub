// 3.1 HCF and LCM from prime factors: two overlapping circles. Shared primes sit in the middle; the HCF is the
// product of the middle, the LCM the product of everything.
import { canvas, text, row, slider, readout } from '../../kit.js';

export const factor = (n) => { const f = []; for (let p = 2; p * p <= n; p++) while (n % p === 0) { f.push(p); n /= p; } if (n > 1) f.push(n); return f; };
export function split(a, b) {
  const fa = factor(a), fb = factor(b), both = [], onlyA = [], onlyB = [...fb];
  for (const p of fa) { const i = onlyB.indexOf(p); if (i >= 0) { both.push(p); onlyB.splice(i, 1); } else onlyA.push(p); }
  return { both, onlyA, onlyB };
}
export default function (host) {
  const cv = canvas(host, { aspect: 0.5, max: 300, min: 210, label: 'Two overlapping circles holding the prime factors of two numbers' });
  let a = 36, b = 60;
  const ctl = row(host);
  slider(ctl, { label: 'First number', min: 2, max: 120, step: 1, value: a, fmt: String, oninput: (v) => { a = v; go(); } });
  slider(ctl, { label: 'Second number', min: 2, max: 120, step: 1, value: b, fmt: String, oninput: (v) => { b = v; go(); } });
  const out = readout(host);
  const prod = (l) => l.reduce((x, y) => x * y, 1);
  const go = () => {
    cv.redraw();
    const s = split(a, b), h = prod(s.both), l = h * prod(s.onlyA) * prod(s.onlyB);
    out.innerHTML = `HCF = ${s.both.join(' × ') || '1'} = <b>${h}</b>. LCM = ${[...s.onlyA, ...s.both, ...s.onlyB].join(' × ')} = <b>${l}</b>. Check: HCF × LCM = ${h * l} = ${a} × ${b}.`;
  };
  cv.draw = (ctx, w, h, col) => {
    const s = split(a, b), r = Math.min(h * 0.4, w * 0.24), cy = h / 2 + 6, ca = w / 2 - r * 0.55, cb = w / 2 + r * 0.55;
    ctx.globalAlpha = 0.18; ctx.fillStyle = col.s[0]; ctx.beginPath(); ctx.arc(ca, cy, r, 0, 7); ctx.fill();
    ctx.fillStyle = col.s[2]; ctx.beginPath(); ctx.arc(cb, cy, r, 0, 7); ctx.fill(); ctx.globalAlpha = 1;
    ctx.strokeStyle = col.ink; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(ca, cy, r, 0, 7); ctx.stroke(); ctx.beginPath(); ctx.arc(cb, cy, r, 0, 7); ctx.stroke();
    text(ctx, `Only in ${a}`, ca - r * 0.55, cy - r - 8, { color: col.ink, size: 12, weight: 600, align: 'center' });
    text(ctx, `Only in ${b}`, cb + r * 0.55, cy - r - 8, { color: col.ink, size: 12, weight: 600, align: 'center' });
    const col3 = (list, x) => list.forEach((p, i) => text(ctx, String(p), x, cy - (list.length - 1) * 9 + i * 18, { color: col.ink, size: 15, weight: 700, align: 'center' }));
    col3(s.onlyA, ca - r * 0.5); col3(s.both, w / 2); col3(s.onlyB, cb + r * 0.5);
    text(ctx, 'Shared = HCF', w / 2, cy + r + 4, { color: col.muted, size: 11, align: 'center', base: 'top' });
  };
  go();
}
