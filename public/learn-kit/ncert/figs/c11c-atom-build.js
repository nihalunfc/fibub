// Class 11 Chemistry, Structure of Atom: build an atom. Protons set the element (atomic number Z), protons + neutrons the mass number A,
// and electrons minus protons the charge. Same Z with different neutrons = isotopes; different electrons = ions.
// Electron shells are filled 2, 8, 8, 2 for the first 20 elements (K, L, M, N).
import { canvas, text, title, row, slider, readout, dot } from '../../kit.js';

const EL = 'H He Li Be B C N O F Ne Na Mg Al Si P S Cl Ar K Ca'.split(' ');
export default function (host) {
  let p = 6, nn = 6, e = 6;
  const cv = canvas(host, { aspect: 0.9, max: 440, min: 300, label: 'An atom built from protons, neutrons and electrons with its symbol and charge' });
  const ctl = row(host), ro = readout(host);
  slider(ctl, { label: 'protons', min: 1, max: 20, step: 1, value: p, fmt: (v) => v.toFixed(0), oninput: (v) => { p = v; go(); } });
  slider(ctl, { label: 'neutrons', min: 0, max: 24, step: 1, value: nn, fmt: (v) => v.toFixed(0), oninput: (v) => { nn = v; go(); } });
  slider(ctl, { label: 'electrons', min: 0, max: 22, step: 1, value: e, fmt: (v) => v.toFixed(0), oninput: (v) => { e = v; go(); } });
  const go = () => { const ch = p - e; ro.textContent = `${EL[p - 1]}: atomic number Z = ${p}, mass number A = ${p + nn}. ` + (ch === 0 ? 'Charge 0: a neutral atom.' : ch > 0 ? `Lost ${ch} electron${ch > 1 ? 's' : ''}: a cation, charge +${ch}.` : `Gained ${-ch} electron${ch < -1 ? 's' : ''}: an anion, charge ${ch}.`) + ` Change only the neutrons and you get another isotope of ${EL[p - 1]}.`; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const t0 = title(ctx, 'protons decide the element', col) + 6, cx = w * 0.62, cy = t0 + (h - t0) / 2, R0 = Math.min(w * 0.38, (h - t0) / 2 - 6), ch = p - e;
    const rn = 14 + Math.sqrt(p + nn) * 2.2; ctx.fillStyle = col.panel; ctx.strokeStyle = col.line;
    const cap = [2, 8, 8, 8, 8]; let left = e, k = 0; const caps = [2, 8, 8, 4]; const sh = [];
    while (left > 0) { const c = caps[k] ?? 8; sh.push(Math.min(c, left)); left -= c; k++; }
    sh.forEach((n, i) => { const r = rn + 14 + i * ((R0 - rn - 14) / 4); ctx.strokeStyle = col.line; ctx.beginPath(); ctx.arc(cx, cy, r, 0, 7); ctx.stroke(); for (let j = 0; j < n; j++) { const a = j / n * 6.283 + i; dot(ctx, cx + r * Math.cos(a), cy + r * Math.sin(a), 3.4, col.s[0]); } });
    const all = [...Array(p).fill(3), ...Array(nn).fill(2)]; all.forEach((c, i) => { const a = i * 2.4, r = rn * 0.8 * Math.sqrt((i + 0.5) / all.length); dot(ctx, cx + r * Math.cos(a), cy + r * Math.sin(a), 3.2, col.s[c]); });
    text(ctx, EL[p - 1] + (ch ? (ch > 0 ? '⁺'.repeat(0) : '') : ''), 14, t0 + 36, { color: col.ink, size: 38, weight: 700 });
    text(ctx, String(p + nn), 6, t0 + 12, { color: col.ink, size: 13, weight: 700 }); text(ctx, String(p), 6, t0 + 58, { color: col.ink, size: 13, weight: 700 });
    text(ctx, ch === 0 ? 'neutral' : (ch > 0 ? '+' : '') + ch, 14, t0 + 82, { color: ch === 0 ? col.muted : ch > 0 ? col.s[3] : col.s[0], size: 14, weight: 700 });
    text(ctx, '● proton', 8, h - 44, { color: col.s[3], size: 11, weight: 700 }); text(ctx, '● neutron', 8, h - 28, { color: col.s[2], size: 11, weight: 700 }); text(ctx, '● electron', 8, h - 12, { color: col.s[0], size: 11, weight: 700 });
  };
  go();
}
