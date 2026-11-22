// Class 9 Diversity: what makes the five kingdoms different. Choose a kingdom to see a typical cell and the key
// features used to classify: has a nucleus (eukaryote) or not (prokaryote), one cell or many, cell wall, and how it gets
// food (makes it by photosynthesis, absorbs it, or eats it). Cells are schematic and not to scale.
import { canvas, text, title, dot, line, row, choice, loop, readout } from '../../kit.js';

const K = {
  mon: ['Monera', 'Bacteria, cyanobacteria', 'no nucleus', 'one cell', 'cell wall in most', 'some make food, some absorb it'],
  pro: ['Protista', 'Amoeba, Paramecium, Euglena', 'has a nucleus', 'one cell', 'no cell wall in most', 'make food or eat others'],
  fun: ['Fungi', 'Yeast, mushroom, mould', 'has a nucleus', 'one or many cells', 'cell wall (not cellulose)', 'absorb food from dead matter'],
  pla: ['Plantae', 'Mango, moss, rice', 'has a nucleus', 'many cells', 'cellulose cell wall', 'make food by photosynthesis'],
  ani: ['Animalia', 'Fish, insects, humans', 'has a nucleus', 'many cells', 'no cell wall', 'eat food'],
};
export default function (host) {
  let k = 'pla', t = 0;
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 330, label: 'A typical cell of each of the five kingdoms with its key features' });
  loop(host, (dt) => { t += dt; cv.redraw(); });
  const ctl = row(host);
  choice(ctl, 'Kingdom', Object.entries(K).map(([a, v]) => [a, v[0]]), k, (v) => { k = v; upd(); });
  const out = readout(host);
  function upd() { const d = K[k]; out.innerHTML = `<b>${d[0]}</b> (${d[1]}): ${d[2]}, ${d[3]}, ${d[4]}; ${d[5]}.`; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    const d = K[k]; title(ctx, `${d[0]}: a typical cell`, col);
    const cx = w / 2, cy = h * 0.32, R = Math.min(w * 0.26, 76);
    const wob = Math.sin(t * 2) * 1.5;
    if (k === 'mon') {
      ctx.beginPath(); ctx.roundRect(cx - R * 1.1, cy - R * 0.5, R * 2.2, R, R * 0.5); ctx.fillStyle = col.soft; ctx.fill(); ctx.strokeStyle = col.s[2]; ctx.lineWidth = 3; ctx.stroke();
      ctx.strokeStyle = col.s[1]; ctx.lineWidth = 2; ctx.beginPath(); for (let a = 0; a < 12; a += 0.3) ctx.lineTo(cx - R * 0.5 + Math.cos(a) * R * 0.2 + a * R * 0.06, cy + Math.sin(a * 1.4) * R * 0.2); ctx.stroke();
      text(ctx, 'DNA loop floats free', cx, cy + R * 0.85, { color: col.s[1], size: 10.5, weight: 700, align: 'center' });
      ctx.strokeStyle = col.s[3]; ctx.lineWidth = 1.5; ctx.beginPath(); for (let x = 0; x < 30; x++) ctx.lineTo(cx + R * 1.1 + x, cy + Math.sin(x * 0.5 + t * 8) * 5); ctx.stroke();
    }
    if (k === 'pro') {
      ctx.beginPath(); ctx.ellipse(cx, cy, R * 1.05, R * 0.7, 0.2, 0, 7); ctx.fillStyle = col.soft; ctx.fill(); ctx.strokeStyle = col.s[2]; ctx.lineWidth = 2; ctx.stroke(); dot(ctx, cx, cy, R * 0.25, col.s[1]);
      for (let a = 0; a < 6.28; a += 0.3) { const x = cx + Math.cos(a) * R * 1.05 * Math.cos(0.2) - Math.sin(a) * R * 0.7 * Math.sin(0.2), y = cy + Math.cos(a) * R * 1.05 * Math.sin(0.2) + Math.sin(a) * R * 0.7 * Math.cos(0.2); line(ctx, [[x, y], [x + Math.cos(a) * (8 + Math.sin(t * 6 + a * 3) * 3), y + Math.sin(a) * (8 + Math.sin(t * 6 + a * 3) * 3)]], col.s[3], 1.2); }
      text(ctx, 'cilia (Paramecium)', cx, cy + R * 1.05, { color: col.s[3], size: 10.5, align: 'center' });
    }
    if (k === 'fun') {
      for (let j = 0; j < 4; j++) { const y = cy - R * 0.5 + j * R * 0.33; ctx.beginPath(); ctx.roundRect(cx - R * 1.2 + (j % 2) * 8, y, R * 2.2, R * 0.28, R * 0.14); ctx.fillStyle = col.soft; ctx.fill(); ctx.strokeStyle = col.s[4]; ctx.lineWidth = 3; ctx.stroke(); dot(ctx, cx - R * 0.5 + j * R * 0.4, y + R * 0.14, R * 0.07, col.s[1]); }
      text(ctx, 'threads (hyphae) with a thick cell wall', cx, cy + R * 1.2, { color: col.s[4], size: 10.5, align: 'center' });
    }
    if (k === 'pla') {
      ctx.beginPath(); ctx.roundRect(cx - R * 1.05, cy - R * 0.8, R * 2.1, R * 1.6, 10); ctx.fillStyle = col.soft; ctx.fill(); ctx.strokeStyle = col.s[2]; ctx.lineWidth = 5; ctx.stroke();
      ctx.beginPath(); ctx.ellipse(cx + R * 0.1, cy, R * 0.55, R * 0.4, 0, 0, 7); ctx.fillStyle = col.panel; ctx.fill(); ctx.strokeStyle = col.muted; ctx.lineWidth = 1.5; ctx.stroke(); text(ctx, 'vacuole', cx + R * 0.1, cy, { color: col.muted, size: 10, align: 'center' });
      dot(ctx, cx - R * 0.7, cy - R * 0.3, R * 0.2, col.s[1]); [0.6, 0.85, 0.7].forEach((f, j) => dot(ctx, cx - R * 0.8 + j * R * 0.22, cy + R * (0.35 + 0.1 * j) + wob * 0.1, R * 0.12, col.s[2]));
      text(ctx, 'cell wall', cx + R * 1.05, cy - R * 0.8, { color: col.s[2], size: 10.5, weight: 700, align: 'right' });
    }
    if (k === 'ani') {
      ctx.beginPath(); for (let a = 0; a <= 6.3; a += 0.1) { const r = R * (1 + 0.04 * Math.sin(a * 3 + t * 2)); ctx.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r * 0.85); } ctx.closePath(); ctx.fillStyle = col.soft; ctx.fill(); ctx.strokeStyle = col.s[0]; ctx.lineWidth = 2; ctx.stroke(); dot(ctx, cx, cy, R * 0.28, col.s[1]);
      text(ctx, 'soft membrane only, no wall', cx, cy + R * 1.1, { color: col.s[0], size: 10.5, align: 'center' });
    }
    const rows = [['Nucleus', d[2]], ['Body', d[3]], ['Cell wall', d[4]], ['Food', d[5]]];
    rows.forEach(([a, b], i) => { const y = h * 0.73 + i * 21; text(ctx, a, 14, y, { color: col.muted, size: 10.5 }); text(ctx, b, 84, y, { color: col.ink, size: 11, weight: 700 }); });
  };
  upd();
}
