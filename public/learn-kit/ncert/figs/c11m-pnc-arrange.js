// Class 11 Maths, Permutations: nPr, the number of ordered arrangements of r things taken from n different things.
// Slide n and r: the seats show the choices n, n−1, ..., n−r+1 whose product is nPr = n!/(n−r)!. The list below shows
// the arrangements themselves (the first ones), so you can see order matters: ABC and ACB are different.
import { canvas, row, slider, readout, text, title } from '../../kit.js';

const L = 'ABCDEFG';
function perms(n, r) { const out = []; const rec = (cur, used) => { if (cur.length === r) { out.push(cur.join('')); return; } if (out.length >= 24) return; for (let i = 0; i < n; i++) if (!used[i]) { used[i] = 1; cur.push(L[i]); rec(cur, used); cur.pop(); used[i] = 0; } }; rec([], []); return out; }
export default function (host) {
  let n = 4, r = 3;
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 280, label: 'Seats with decreasing numbers of choices and a list of the arrangements' });
  const c1 = row(host), out = readout(host);
  const P = () => { let p = 1; for (let i = 0; i < r; i++) p *= n - i; return p; };
  slider(c1, { label: 'n things', min: 2, max: 7, step: 1, value: n, fmt: String, oninput: (v) => { n = v; if (r > n) { r = n; sr.set(r); } re(); } });
  const sr = slider(c1, { label: 'r seats', min: 1, max: 7, step: 1, value: r, fmt: String, oninput: (v) => { r = Math.min(v, n); if (r !== v) sr.set(r); re(); } });
  const re = () => { cv.redraw(); out.innerHTML = `Seats: ${Array.from({ length: r }, (_, i) => n - i).join(' × ')} = <b>${P()}</b> = ${n}P${r} = ${n}!/${n - r}!. ${r === n ? 'With r = n every thing is used: n! arrangements.' : ''}`; };
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, `${n}P${r}: arrange ${r} of the ${n} letters ${L.slice(0, n)}`, col), cw = Math.min(54, (w - 24) / r), x0 = (w - r * cw) / 2, y = top + 22;
    for (let i = 0; i < r; i++) { ctx.strokeStyle = col.s[0]; ctx.lineWidth = 2; ctx.strokeRect(x0 + i * cw + 3, y, cw - 6, 34); text(ctx, String(n - i), x0 + i * cw + cw / 2, y + 17, { color: col.ink, size: 18, weight: 700, align: 'center' }); }
    text(ctx, 'choices for each seat', w / 2, y + 50, { color: col.muted, size: 11, align: 'center' });
    const list = perms(n, r), per = Math.max(2, Math.floor((w - 20) / (r * 8.5 + 22))), y1 = y + 76;
    text(ctx, list.length >= 24 && P() > 24 ? 'first 24 arrangements:' : 'all arrangements:', 12, y1 - 6, { color: col.muted, size: 11 });
    list.forEach((s, i) => text(ctx, s, 12 + (i % per) * ((w - 20) / per), y1 + 14 + Math.floor(i / per) * 18, { color: col.s[i % 3 === 0 ? 0 : i % 3 === 1 ? 1 : 2], size: 12.5, weight: 600 }));
    text(ctx, `total ${P()}`, w - 12, h - 12, { color: col.ink, size: 14, weight: 700, align: 'right' });
  };
  re();
}
