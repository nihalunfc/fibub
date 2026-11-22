// Class 9 Journey Inside the Atom: how big is the nucleus compared with the atom? The atom is about 100,000 times wider
// than its nucleus (atom ~1e-10 m, nucleus ~1e-15 m). A slider blows up the atom to a stadium so the nucleus becomes a
// marble in the middle: nearly all the atom is empty space, yet nearly all of its mass sits in that tiny nucleus.
import { canvas, text, title, dot, row, slider, readout } from '../../kit.js';

export default function (host) {
  let k = 0.3; // log zoom 0..1
  const cv = canvas(host, { aspect: 0.7, max: 440, min: 300, label: 'A zoom comparing the size of an atom with its nucleus as a stadium and a marble' });
  const ctl = row(host);
  slider(ctl, { label: 'Zoom', min: 0, max: 1, step: 0.01, value: k, fmt: (v) => ['atom: 1 Å', 'atom as big as a stadium', 'atom as big as a city'][v < 0.34 ? 0 : v < 0.67 ? 1 : 2], oninput: (v) => { k = v; upd(); } });
  const out = readout(host);
  function upd() {
    const atomM = Math.pow(10, -1 + k * 5.5 - 0); // metres of "atom diameter" after the zoom: 0.1 m up to ~30 km-ish
    const atomShow = atomM < 1 ? `${(atomM * 100).toFixed(0)} cm` : atomM < 1000 ? `${atomM.toFixed(0)} m` : `${(atomM / 1000).toFixed(1)} km`;
    const nuc = atomM / 1e5; const nucShow = nuc < 0.001 ? `${(nuc * 1e6).toFixed(0)} µm` : nuc < 0.01 ? `${(nuc * 1000).toFixed(2)} mm` : nuc < 1 ? `${(nuc * 100).toFixed(1)} cm` : `${nuc.toFixed(1)} m`;
    out.innerHTML = `If the atom were <b>${atomShow}</b> wide, its nucleus would be only <b>${nucShow}</b> across (1 part in 100 000). A real atom: about 10⁻¹⁰ m; nucleus: about 10⁻¹⁵ m.`; cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'The atom is almost all empty space', col);
    const cx = w / 2, cy = h * 0.5, Rr = Math.min(w, h * 1.1) * 0.33;
    ctx.beginPath(); ctx.arc(cx, cy, Rr, 0, 7); ctx.fillStyle = col.soft; ctx.fill(); ctx.strokeStyle = col.s[2]; ctx.lineWidth = 2; ctx.stroke();
    text(ctx, 'electron cloud: atom', cx, cy - Rr - 10, { color: col.s[2], size: 11, weight: 700, align: 'center' });
    for (let i = 0; i < 6; i++) { const a = i * 1.1 + 0.4, d = Rr * (0.55 + 0.35 * ((i * 37) % 10) / 10); dot(ctx, cx + Math.cos(a) * d, cy + Math.sin(a) * d, 3, col.s[2]); }
    const nr = Math.max(1.6, Rr / 100000 * 100000 * 0.012); // drawn marble: 1.2% of radius (exaggerated to stay visible)
    dot(ctx, cx, cy, nr + 1, col.s[1]);
    text(ctx, 'nucleus (marble)', cx + 8, cy + 16,  { color: col.s[1], size: 11, weight: 700, halo: col.soft });
    text(ctx, k < 0.34 ? 'drawn 100 times too large so you can see it' : 'on a true scale it would be a dot you could not see', w / 2, h - 22, { color: col.muted, size: 10.5, align: 'center' });
    text(ctx, 'but 99.9% of the mass is in the nucleus', w / 2, h - 8, { color: col.ink, size: 10.5, weight: 700, align: 'center' });
  };
  upd();
}
