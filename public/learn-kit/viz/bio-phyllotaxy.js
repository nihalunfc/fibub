// Phyllotaxy: how leaves are arranged on a stem, seen from above. Choose alternate, opposite or whorled, then change the
// number of nodes with the slider: each node is shown from the top, and the leaves at lower nodes lie underneath. The
// pattern spreads the leaves so each one catches light. In an alternate arrangement the leaves turn about 137° per node.
import { canvas, row, choice, slider, readout, text, title } from '../kit.js';

export default function (host) {
  let type = 'alt', n = 8;
  const cv = canvas(host, { aspect: 0.9, max: 360, min: 290, label: 'Top view of a stem with leaves in alternate, opposite or whorled arrangement' });
  const c = row(host);
  choice(c, 'Arrangement', [['alt', 'Alternate (china rose)'], ['opp', 'Opposite (guava)'], ['whorl', 'Whorled (Alstonia)']], type, (v) => { type = v; show(); });
  slider(c, { label: 'Nodes', min: 2, max: 14, step: 1, value: n, fmt: (v) => `${v}`, oninput: (v) => { n = v; show(); } });
  const out = readout(host);
  const per = () => (type === 'alt' ? 1 : type === 'opp' ? 2 : 4), turn = () => (type === 'alt' ? 137.5 : type === 'opp' ? 90 : 45);
  function show() { out.innerHTML = `${n} nodes × ${per()} ${per() > 1 ? 'leaves' : 'leaf'} = <b>${n * per()}</b> in all. ${type === 'alt' ? 'One leaf at each node, each turned about 137° from the one below: no leaf sits straight above another, so every leaf gets light.' : type === 'opp' ? 'Two leaves at each node, facing each other; each pair is turned 90° from the pair below (decussate).' : 'Three or more leaves at one node form a whorl; successive whorls are offset to fill the gaps.'}`; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Seen from above', col);
    const cx = w / 2, cy = h * 0.52, Rmax = Math.min(w, h) * 0.42;
    for (let i = 0; i < n; i++) {
      const base = (i * turn()) * Math.PI / 180, L = Rmax * (1 - 0.6 * i / Math.max(1, n)), shade = 0.2 + 0.5 * (i / n);
      for (let j = 0; j < per(); j++) {
        const a = base + j * 2 * Math.PI / per(), ex = cx + Math.cos(a) * L, ey = cy + Math.sin(a) * L;
        ctx.save(); ctx.translate((cx + ex) / 2, (cy + ey) / 2); ctx.rotate(a); ctx.beginPath(); ctx.ellipse(0, 0, L / 2, L * 0.2, 0, 0, 7); ctx.fillStyle = col.s[2]; ctx.globalAlpha = shade; ctx.fill(); ctx.globalAlpha = 1; ctx.strokeStyle = col.s[2]; ctx.lineWidth = 1.2; ctx.stroke(); ctx.restore();
      }
    }
    ctx.beginPath(); ctx.arc(cx, cy, 5, 0, 7); ctx.fillStyle = col.s[5]; ctx.fill();
    text(ctx, 'newer (upper) leaves are smaller and drawn on top', w / 2, h - 10, { color: col.muted, size: 10.5, align: 'center' });
  };
  show();
}
