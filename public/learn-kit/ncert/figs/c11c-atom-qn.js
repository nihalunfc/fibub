// Class 11 Chemistry, Structure of Atom: quantum numbers. n = 1, 2, 3...; l = 0 to n-1 (s, p, d, f); m_l = -l to +l; m_s = +1/2 or -1/2.
// Each shell n holds n^2 orbitals and 2 n^2 electrons; each subshell l holds 2l+1 orbitals. Slide n and click an orbital box to add electrons (Pauli: at most 2).
import { canvas, text, title, row, slider, readout } from '../../kit.js';

export default function (host) {
  let n = 3;
  const cv = canvas(host, { aspect: 0.85, max: 440, min: 300, label: 'Subshells and orbital boxes allowed for a chosen principal quantum number' });
  const ctl = row(host), ro = readout(host);
  slider(ctl, { label: 'shell n', min: 1, max: 5, step: 1, value: n, fmt: (v) => v.toFixed(0), oninput: (v) => { n = v; go(); } });
  const go = () => { ro.textContent = `n = ${n}: l can be ${Array.from({ length: n }, (_, i) => i).join(', ')} (${'spdfg'.slice(0, n).split('').map((c) => n + c).join(', ')}). Orbitals = n² = ${n * n}; electrons = 2n² = ${2 * n * n}. Each box holds at most 2 electrons of opposite spin.`; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const t0 = title(ctx, `shell n = ${n}`, col) + 14, rh = (h - t0 - 40) / 5, bw = Math.min(40, (w - 80) / 9);
    for (let l = 0; l < n; l++) {
      const y = t0 + l * rh + rh / 2, nb = 2 * l + 1, x0 = 60;
      text(ctx, n + 'spdfg'[l], 8, y, { color: col.s[l % 4], size: 15, weight: 700 });
      for (let m = 0; m < nb; m++) { const x = x0 + m * (bw + 4); ctx.strokeStyle = col.s[l % 4]; ctx.lineWidth = 2; ctx.fillStyle = col.soft; ctx.fillRect(x, y - 14, bw, 28); ctx.strokeRect(x, y - 14, bw, 28); text(ctx, 'm=' + (m - l), x + bw / 2, y, { color: col.muted, size: 9.5, align: 'center' }); }
      text(ctx, `${nb} orbital${nb > 1 ? 's' : ''}, ${2 * nb} e⁻`, x0 + nb * (bw + 4) + 4, y, { color: col.muted, size: 10 });
    }
    text(ctx, `total: ${n * n} orbital${n > 1 ? "s" : ""}, ${2 * n * n} electrons`, w / 2, h - 14, { color: col.ink, size: 13, weight: 700, align: 'center' });
  };
  go();
}
