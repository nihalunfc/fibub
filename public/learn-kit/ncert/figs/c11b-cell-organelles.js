// Class 11 Cell: an organelle explorer. Choose a bacterium, an animal cell or a plant cell and tap any part to read what it is and does. Bacteria (prokaryotes) have no nucleus or
// membrane-bound organelles; animal and plant cells (eukaryotes) do; only plants have a cell wall, chloroplasts and a big central vacuole; only animals have centrioles and lysosomes (usually).
import { canvas, text, title, row, choice, touchGuard } from '../../kit.js';
import { ellipse, footer, rrect } from '../c11b-ex-util.js';

const D = {
  an: {
    name: 'Animal cell', parts: [
      ['nuc', 'Nucleus', 'Holds the DNA inside a double membrane with pores. Controls the cell. The dark spot is the nucleolus, which makes ribosome parts.', 0.42, 0.42, 0.16],
      ['mit', 'Mitochondrion', 'The powerhouse: the inner folds (cristae) make most of the ATP by aerobic respiration. Has its own DNA and ribosomes.', 0.72, 0.62, 0.07],
      ['mi2', 'Mitochondrion', 'The powerhouse: the inner folds (cristae) make most of the ATP by aerobic respiration. Has its own DNA and ribosomes.', 0.2, 0.7, 0.07],
      ['rer', 'Rough ER', 'Flattened sacs studded with ribosomes. Makes proteins for export and for membranes.', 0.34, 0.66, 0.08],
      ['ser', 'Smooth ER', 'Tubes without ribosomes: make lipids and steroids, and detoxify drugs.', 0.5, 0.74, 0.06],
      ['gol', 'Golgi body', 'A stack of flat sacs that packs, modifies and ships proteins and lipids in vesicles.', 0.7, 0.3, 0.07],
      ['lys', 'Lysosome', 'A bag of digestive enzymes that breaks down worn-out parts and swallowed germs.', 0.82, 0.45, 0.05],
      ['cen', 'Centrosome', 'Two centrioles at right angles: they organise the spindle when the cell divides.', 0.22, 0.28, 0.05],
      ['mem', 'Plasma membrane', 'A fluid mosaic of lipids and proteins that controls what goes in and out. Tap the edge of the cell.', 0.5, 0.0, 0],
    ],
  },
  pl: {
    name: 'Plant cell', parts: [
      ['wal', 'Cell wall', 'A tough layer of cellulose outside the membrane: gives shape and strength and stops the cell from bursting. Tap the outer edge.', 0.5, 0.0, 0],
      ['vac', 'Central vacuole', 'A big sac of cell sap, bounded by the tonoplast. Stores water, sugars and pigments, and keeps the cell firm (turgid).', 0.52, 0.5, 0.2],
      ['nuc', 'Nucleus', 'Holds the DNA, pushed to the side by the vacuole. Controls the cell.', 0.2, 0.3, 0.1],
      ['chl', 'Chloroplast', 'The site of photosynthesis. Stacks of thylakoids (grana) hold chlorophyll; the stroma makes sugar. Has its own DNA.', 0.8, 0.3, 0.07],
      ['ch2', 'Chloroplast', 'The site of photosynthesis. Stacks of thylakoids (grana) hold chlorophyll; the stroma makes sugar. Has its own DNA.', 0.8, 0.74, 0.07],
      ['mit', 'Mitochondrion', 'Makes ATP by respiration. Plants need it too, even though they photosynthesise.', 0.24, 0.72, 0.06],
      ['gol', 'Golgi body', 'Packs and ships materials; in plants it also makes wall material.', 0.28, 0.5, 0.06],
      ['rer', 'Rough ER', 'Ribosome-studded sacs that make proteins.', 0.1, 0.55, 0.05],
      ['pla', 'Plasmodesmata', 'Thin channels through the walls that join the cytoplasm of neighbouring plant cells.', 0.96, 0.52, 0.05],
    ],
  },
  ba: {
    name: 'Bacterium', parts: [
      ['nid', 'Nucleoid', 'A loop of naked DNA lying in the cytoplasm; there is no nuclear membrane (prokaryote).', 0.45, 0.5, 0.14],
      ['pla', 'Plasmid', 'A small circle of extra DNA, often carrying antibiotic-resistance genes. It can be copied and passed to other bacteria.', 0.72, 0.4, 0.05],
      ['rib', 'Ribosomes (70S)', 'Tiny protein factories scattered in the cytoplasm; smaller (70S) than eukaryotic ribosomes (80S).', 0.3, 0.3, 0.06],
      ['fla', 'Flagellum', 'A long whip that spins to swim.', 1.0, 0.5, 0.06],
      ['wal', 'Cell wall', 'A rigid wall of peptidoglycan that gives shape. Penicillin blocks its making.', 0.5, 0.0, 0],
      ['cap', 'Capsule', 'A slimy outer layer that helps the cell stick and hides it from the immune system.', 0.5, 0.0, 0],
      ['mes', 'Mesosome', 'An infolding of the membrane that helps in respiration and cell division.', 0.25, 0.65, 0.05],
    ],
  },
};
export default function (host) {
  let k = 'an', sel = null;
  const cv = canvas(host, { aspect: 1.05, max: 440, min: 300, label: 'A cell diagram you can tap: choose a bacterium, an animal cell or a plant cell and tap its parts to read what they do' });
  const ctl = row(host);
  choice(ctl, 'Cell', [['ba', 'Bacterium'], ['an', 'Animal'], ['pl', 'Plant']], k, (v) => { k = v; sel = null; cv.redraw(); });
  let geo = null;
  const hit = (x, y) => {
    if (!geo) return null; let best = null, bd = 1e9;
    for (const p of D[k].parts) { const [id, , , fx, fy, fr] = p; if (!fr) continue; const px = geo.x0 + fx * geo.W, py = geo.y0 + fy * geo.H, d = Math.hypot(px - x, py - y); if (d < Math.max(14, fr * geo.W * 0.9) && d < bd) { best = id; bd = d; } }
    if (best) return best;
    const e = geo.edge(x, y); return e;
  };
  cv.c.addEventListener('pointerdown', (ev) => { const b = cv.c.getBoundingClientRect(); const id = hit(ev.clientX - b.left, ev.clientY - b.top); if (id) { sel = id; cv.redraw(); } });
  touchGuard(cv.c, () => false);
  cv.c.style.cursor = 'pointer';
  cv.draw = (ctx, w, h, col) => {
    const t0 = title(ctx, `${D[k].name}: tap a part`, col);
    const info = sel ? D[k].parts.find((p) => p[0] === sel) : null;
    const fy = footer(ctx, w, h, col, info ? `${info[1]}. ${info[2]}` : 'Tap any organelle in the drawing. Organelles with the same name are copies of each other.', { color: info ? col.ink : col.muted });
    const x0 = 14, y0 = t0 + 10, W = w - 28, H = fy - y0 - 6; geo = { x0, y0, W, H, edge: () => null };
    const P = (id) => { const p = D[k].parts.find((q) => q[0] === id); return p ? [x0 + p[3] * W, y0 + p[4] * H, p[5] * W] : [0, 0, 0]; };
    const hl = (id) => sel === id;
    const ring = (x, y, r, id) => { if (hl(id)) { ctx.save(); ctx.strokeStyle = col.ink; ctx.lineWidth = 2.5; ctx.setLineDash([4, 3]); ctx.beginPath(); ctx.arc(x, y, r + 5, 0, 6.3); ctx.stroke(); ctx.restore(); } };
    const mito = (id) => { const [x, y, r] = P(id); ellipse(ctx, x, y, r * 1.5, r, col.s[4] + '88', col.s[4], 1.8); ctx.strokeStyle = col.s[4]; ctx.lineWidth = 1.2; ctx.beginPath(); for (let i = -2; i <= 2; i++) { ctx.moveTo(x + i * r * 0.5, y - r * 0.9); ctx.lineTo(x + i * r * 0.5, y + (i % 2 ? 0 : 0.2) * r); } ctx.stroke(); ring(x, y, r * 1.5, id); };
    if (k === 'ba') {
      const cx = x0 + W / 2, cy = y0 + H / 2;
      rrect(ctx, x0 + 6, y0 + H * 0.12, W - 24, H * 0.76, H * 0.38, col.s[2] + '22', col.s[2], 6); rrect(ctx, x0 + 12, y0 + H * 0.12 + 6, W - 36, H * 0.76 - 12, H * 0.33, col.soft, col.s[3], 2);
      geo.edge = (x, y) => { const dx = Math.abs(x - cx) / (W / 2), dy = Math.abs(y - cy) / (H * 0.4); const d = Math.hypot(dx, dy); if (d > 0.93 && d < 1.12) return d > 1.02 ? 'cap' : 'wal'; return null; };
      const [nx, ny, nr] = P('nid'); ctx.strokeStyle = col.s[0]; ctx.lineWidth = 2; ctx.beginPath(); for (let i = 0; i <= 60; i++) { const a = i / 60 * 6.28 * 3; const rr = nr * (0.4 + 0.5 * Math.sin(a * 0.7 + 1)); ctx.lineTo(nx + Math.cos(a) * rr * 1.3, ny + Math.sin(a) * rr * 0.9); } ctx.stroke(); ring(nx, ny, nr, 'nid');
      const [px, py] = P('pla'); ellipse(ctx, px, py, 8, 8, null, col.s[1], 2); ring(px, py, 8, 'pla');
      [[0.3, 0.3], [0.62, 0.65], [0.55, 0.28], [0.78, 0.62], [0.25, 0.45], [0.4, 0.74]].forEach(([a, b]) => ellipse(ctx, x0 + a * W, y0 + b * H, 3, 3, col.s[2]));
      const [rx, ry] = P('rib'); ring(rx, ry, 10, 'rib');
      const [mx, my] = P('mes'); ctx.strokeStyle = col.s[3]; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(mx - 10, my + 18); ctx.bezierCurveTo(mx - 6, my, mx + 6, my + 14, mx + 10, my - 6); ctx.stroke(); ring(mx, my, 10, 'mes');
      const [fx, fy2] = P('fla'); ctx.strokeStyle = col.s[1]; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(x0 + W - 18, cy); for (let i = 1; i <= 20; i++) ctx.lineTo(x0 + W - 18 + i * 0.0 + 0, cy); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(x0 + W - 12, cy); ctx.bezierCurveTo(x0 + W + 2, cy - 14, x0 + W - 10, cy + 14, x0 + W + 4, cy); ctx.stroke(); ring(x0 + W - 8, cy, 8, 'fla');
      if (sel === 'wal' || sel === 'cap') { ctx.strokeStyle = col.ink; ctx.lineWidth = 2.5; ctx.setLineDash([4, 3]); ctx.beginPath(); ctx.roundRect(x0 + (sel === 'cap' ? 6 : 12), y0 + H * 0.12 + (sel === 'cap' ? 0 : 6), W - (sel === 'cap' ? 24 : 36), H * 0.76 - (sel === 'cap' ? 0 : 12), H * 0.35); ctx.stroke(); ctx.setLineDash([]); }
    } else if (k === 'an') {
      const cx = x0 + W / 2, cy = y0 + H / 2, rx = W / 2 - 4, ry = H / 2 - 4;
      ellipse(ctx, cx, cy, rx, ry, col.soft, col.s[3], 3);
      geo.edge = (x, y) => { const d = Math.hypot((x - cx) / rx, (y - cy) / ry); return d > 0.9 && d < 1.12 ? 'mem' : null; };
      if (sel === 'mem') ellipse(ctx, cx, cy, rx + 3, ry + 3, null, col.ink, 2);
      let [x, y, r] = P('nuc'); ellipse(ctx, x, y, r, r, col.s[0] + '44', col.s[0], 3); ellipse(ctx, x + r * 0.2, y, r * 0.28, r * 0.28, col.s[0]); ring(x, y, r, 'nuc');
      [x, y, r] = P('rer'); ctx.strokeStyle = col.s[2]; ctx.lineWidth = 3; for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.arc(P('nuc')[0], P('nuc')[1], P('nuc')[2] + 6 + i * 6, 1.1, 2.6); ctx.stroke(); for (let j = 0; j < 4; j++) { const a = 1.2 + j * 0.35; ellipse(ctx, P('nuc')[0] + Math.cos(a) * (P('nuc')[2] + 6 + i * 6), P('nuc')[1] + Math.sin(a) * (P('nuc')[2] + 6 + i * 6), 1.6, 1.6, col.ink); } } ring(x, y, r, 'rer');
      [x, y, r] = P('ser'); ctx.strokeStyle = col.s[2]; ctx.lineWidth = 3; ctx.beginPath(); for (let i = 0; i < 12; i++) ctx.lineTo(x - r + i * r / 5.5, y + (i % 2 ? 6 : -6)); ctx.stroke(); ring(x, y, r, 'ser');
      [x, y, r] = P('gol'); ctx.strokeStyle = col.s[5]; ctx.lineWidth = 3; for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.arc(x, y + 14 - i * 7, r * 0.9 + 6, Math.PI * 1.15, Math.PI * 1.85); ctx.stroke(); } ring(x, y, r + 6, 'gol');
      [x, y, r] = P('lys'); ellipse(ctx, x, y, r, r, col.s[1] + '99', col.s[1], 1.5); ring(x, y, r, 'lys');
      mito('mit'); mito('mi2');
      [x, y, r] = P('cen'); ctx.fillStyle = col.s[6]; ctx.fillRect(x - 10, y - 2, 12, 4); ctx.fillRect(x + 2, y - 10, 4, 12); ring(x, y, 10, 'cen');
    } else {
      rrect(ctx, x0 + 2, y0 + 2, W - 4, H - 4, 10, col.soft, col.s[2], 6); rrect(ctx, x0 + 8, y0 + 8, W - 16, H - 16, 8, null, col.s[3], 2);
      geo.edge = (x, y) => { const m = Math.min(x - x0, x0 + W - x, y - y0, y0 + H - y); return m >= -4 && m < 10 ? 'wal' : null; };
      if (sel === 'wal') { ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.setLineDash([4, 3]); ctx.strokeRect(x0 - 2, y0 - 2, W + 4, H + 4); ctx.setLineDash([]); }
      let [x, y, r] = P('vac'); ctx.beginPath(); ctx.ellipse(x, y, r * 1.1, r * 1.45, 0, 0, 6.3); ctx.fillStyle = col.s[0] + '33'; ctx.fill(); ctx.strokeStyle = col.s[0]; ctx.lineWidth = 2; ctx.stroke(); ring(x, y, r * 1.3, 'vac');
      [x, y, r] = P('nuc'); ellipse(ctx, x, y, r, r, col.s[0] + '44', col.s[0], 3); ellipse(ctx, x, y, r * 0.3, r * 0.3, col.s[0]); ring(x, y, r, 'nuc');
      for (const id of ['chl', 'ch2']) { [x, y, r] = P(id); ellipse(ctx, x, y, r * 1.5, r, col.s[2] + '55', col.s[2], 2); for (let i = 0; i < 3; i++) { ctx.fillStyle = col.s[5]; ctx.fillRect(x - r * 0.9 + i * r * 0.65, y - r * 0.3, r * 0.45, r * 0.6); } ring(x, y, r * 1.5, id); }
      mito('mit'); [x, y, r] = P('gol'); ctx.strokeStyle = col.s[5]; ctx.lineWidth = 3; for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.arc(x, y + 14 - i * 7, r + 4, Math.PI * 1.15, Math.PI * 1.85); ctx.stroke(); } ring(x, y, r + 6, 'gol');
      [x, y, r] = P('rer'); ctx.strokeStyle = col.s[2]; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x - r, y - 12); ctx.lineTo(x + r, y - 12); ctx.moveTo(x - r, y); ctx.lineTo(x + r, y); ctx.moveTo(x - r, y + 12); ctx.lineTo(x + r, y + 12); ctx.stroke(); ring(x, y, r, 'rer');
      [x, y, r] = P('pla'); ctx.strokeStyle = col.s[1]; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x - 10, y - 8); ctx.lineTo(x + 6, y - 8); ctx.moveTo(x - 10, y + 8); ctx.lineTo(x + 6, y + 8); ctx.stroke(); ring(x - 2, y, 12, 'pla');
    }
  };
}
