// Class 11 Chemistry, Classification of Elements: isoelectronic species. Ions with the same number of electrons (10 or 18) but different nuclear charge Z:
// the bigger the nuclear charge, the more strongly it pulls the same electron cloud in, so the radius falls from N3- to Al3+. Ionic radii (pm, Shannon 1976, 6-coordinate).
import { canvas, text, title, row, choice, readout } from '../../kit.js';

const S = { ten: [10, [['N³⁻', 7, 146], ['O²⁻', 8, 140], ['F⁻', 9, 133], ['Na⁺', 11, 102], ['Mg²⁺', 12, 72], ['Al³⁺', 13, 54]]], eighteen: [18, [['S²⁻', 16, 184], ['Cl⁻', 17, 181], ['K⁺', 19, 138], ['Ca²⁺', 20, 100], ['Sc³⁺', 21, 75]]] };
export default function (host) {
  let k = 'ten', sel = 3;
  const cv = canvas(host, { aspect: 0.62, max: 440, min: 230, label: 'Ions with the same number of electrons drawn with their radii' });
  const ctl = row(host), ro = readout(host);
  choice(ctl, 'electrons', [['ten', '10 (like Ne)'], ['eighteen', '18 (like Ar)']], k, (v) => { k = v; sel = 0; go(); });
  const go = () => { const [ne, L] = S[k], [n, z, r] = L[Math.min(sel, L.length - 1)]; ro.textContent = `${n}: ${ne} electrons, ${z} protons, radius ${r} pm. Ratio protons/electrons = ${(z / ne).toFixed(2)}. More protons pulling the same ${ne} electrons means a smaller ion. Tap an ion.`; cv.redraw(); };
  let lay = null;
  cv.c.addEventListener('pointerdown', (e) => { if (!lay) return; const b = cv.c.getBoundingClientRect(), x = e.clientX - b.left; const i = Math.floor((x - lay.x0) / lay.dx); if (i >= 0 && i < S[k][1].length) { sel = i; go(); } });
  cv.draw = (ctx, w, h, col) => {
    const t0 = title(ctx, `isoelectronic ions with ${S[k][0]} electrons`, col) + 8, L = S[k][1], n = L.length, dx = (w - 12) / n, cy = t0 + (h - t0 - 56) / 2 + 6, sc = Math.min(dx / 2 - 3, (h - t0 - 60) / 2) / 190;
    lay = { x0: 6, dx };
    L.forEach(([nm, z, r], i) => { const cx = 6 + dx * (i + 0.5); ctx.fillStyle = col.s[z % 4 === 0 ? 3 : i % 3]; ctx.globalAlpha = i === sel ? 0.55 : 0.25; ctx.beginPath(); ctx.arc(cx, cy, r * sc, 0, 7); ctx.fill(); ctx.globalAlpha = 1; ctx.strokeStyle = i === sel ? col.ink : col.line; ctx.lineWidth = i === sel ? 2.5 : 1.5; ctx.stroke(); text(ctx, nm, cx, h - 40, { color: col.ink, size: 12, weight: 700, align: 'center' }); text(ctx, `Z = ${z}`, cx, h - 25, { color: col.muted, size: 10, align: 'center' }); text(ctx, `${r} pm`, cx, h - 11, { color: col.s[2], size: 10, weight: 700, align: 'center' }); });
  };
  go();
}
