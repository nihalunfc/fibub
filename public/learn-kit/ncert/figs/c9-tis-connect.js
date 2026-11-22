// Class 9 Tissues: connective tissue gallery. Cells are spread out in a non-living MATRIX (jelly, fibres, hard salts or
// liquid). Areolar: loose fibres, fills gaps. Adipose: fat cells, stores energy and insulates. Tendon: tough parallel
// fibres joining muscle to bone. Ligament: stretchy fibres joining bone to bone. Cartilage: smooth firm matrix with
// cells in tiny pockets, no blood vessels. Bone: hard matrix of calcium salts laid in rings. Blood: liquid matrix (plasma).
import { canvas, text, title, dot, line, row, choice } from '../../kit.js';

const C = [
  ['Areolar', 'Under the skin, around organs and blood vessels', 'Loose network of fibres: packs the gaps between organs, supports them and helps repair.'],
  ['Adipose', 'Under the skin, around the kidneys', 'Cells full of fat: stores energy, keeps the body warm (insulation) and cushions organs.'],
  ['Tendon', 'Joins muscle to bone', 'Dense, strong parallel fibres: very tough, with limited stretch.'],
  ['Ligament', 'Joins bone to bone at joints', 'Elastic fibres: strong and flexible, so joints can bend without coming apart.'],
  ['Cartilage', 'Nose tip, ear flap, ends of bones, windpipe rings', 'Smooth, firm and flexible matrix with cells in small pockets; no blood vessels; cushions joints.'],
  ['Bone', 'Skeleton', 'Hard matrix of calcium and phosphorus salts with cells in it: supports the body, protects organs, anchors muscles.'],
  ['Blood', 'Flows in blood vessels', 'Liquid matrix (plasma) with red cells, white cells, platelets: carries oxygen, food, wastes, fights germs, clots wounds.'],
];
export default function (host) {
  let k = 0;
  const cv = canvas(host, { aspect: 0.82, max: 440, min: 300, label: 'Types of connective tissue: areolar, adipose, tendon, ligament, cartilage, bone and blood' });
  const ctl = row(host);
  choice(ctl, 'Connective tissue', C.map((c, i) => [i, c[0]]), 0, (v) => { k = v; cv.redraw(); });
  const wrap = (ctx, s, w) => { ctx.font = '11px system-ui'; const L = []; let c = ''; s.split(' ').forEach((x) => { if (ctx.measureText((c + ' ' + x).trim()).width > w && c) { L.push(c); c = x; } else c = (c + ' ' + x).trim(); }); L.push(c); return L; };
  cv.draw = (ctx, w, h, col) => {
    title(ctx, C[k][0] + ' tissue', col);
    const X = 14, Y = 38, W = w - 28, H = h * 0.42;
    ctx.fillStyle = col.soft; ctx.fillRect(X, Y, W, H); ctx.strokeStyle = col.line; ctx.strokeRect(X, Y, W, H);
    ctx.save(); ctx.beginPath(); ctx.rect(X, Y, W, H); ctx.clip();
    const cx = X + W / 2, cy = Y + H / 2;
    if (k === 0) { for (let i = 0; i < 10; i++) line(ctx, [[X + (i * 53) % W, Y + (i * 29) % H], [X + ((i * 53) % W) + 70, Y + ((i * 29) % H) + (i % 2 ? 30 : -30)]], col.s[2], 1.5); [[0.2, 0.3], [0.6, 0.6], [0.8, 0.25], [0.4, 0.75]].forEach(([a, b]) => { dot(ctx, X + a * W, Y + b * H, 8, col.s[0]); }); text(ctx, 'loose fibres + a few cells', cx, Y + H - 8, { color: col.ink, size: 10, weight: 700, align: 'center', halo: col.soft }); }
    if (k === 1) { for (let j = 0; j < 2; j++) for (let i = 0; i < 4; i++) { const x = X + 34 + i * (W / 4.1) + (j % 2) * 20, y = Y + 34 + j * (H / 2.1); dot(ctx, x, y, 28, col.panel, col.s[3]); dot(ctx, x, y, 17, col.s[3]); dot(ctx, x + 22, y - 16, 4, col.s[0]); } text(ctx, 'big fat droplet pushes nucleus aside', cx, Y + H - 6, { color: col.ink, size: 10, weight: 700, align: 'center', halo: col.soft }); }
    if (k === 2 || k === 3) { for (let i = 0; i < 9; i++) { const y = Y + 12 + i * (H - 24) / 8; ctx.strokeStyle = k === 2 ? col.s[2] : col.s[4]; ctx.lineWidth = k === 2 ? 3.5 : 2; ctx.beginPath(); for (let x = 0; x <= W; x += 6) { const yy = y + (k === 3 ? Math.sin(x / 12 + i) * 3 : 0); x ? ctx.lineTo(X + x, yy) : ctx.moveTo(X + x, yy); } ctx.stroke(); } for (let i = 0; i < 5; i++) dot(ctx, X + 20 + i * (W / 5), Y + 16 + (i % 3) * (H / 3.2), 3.5, col.s[0]); text(ctx, k === 2 ? 'strong, less stretch: muscle to bone' : 'stretchy: bone to bone', cx, Y + H - 6, { color: col.ink, size: 10, weight: 700, align: 'center', halo: col.soft }); }
    if (k === 4) { ctx.fillStyle = col.s[0]; ctx.globalAlpha = 0.18; ctx.fillRect(X, Y, W, H); ctx.globalAlpha = 1; [[0.2, 0.3], [0.24, 0.42], [0.55, 0.62], [0.58, 0.74], [0.8, 0.3], [0.5, 0.25]].forEach(([a, b]) => { ctx.beginPath(); ctx.ellipse(X + a * W, Y + b * H, 14, 10, 0, 0, 7); ctx.fillStyle = col.panel; ctx.fill(); ctx.strokeStyle = col.s[0]; ctx.lineWidth = 1.5; ctx.stroke(); dot(ctx, X + a * W, Y + b * H, 4, col.s[0]); }); text(ctx, 'cells in small pockets in a firm matrix', cx, Y + H - 6, { color: col.ink, size: 10, weight: 700, align: 'center', halo: col.soft }); }
    if (k === 5) { for (let r = 0; r < 4; r++) { ctx.beginPath(); ctx.arc(cx, cy, 14 + r * 14, 0, 7); ctx.strokeStyle = col.s[4]; ctx.lineWidth = 3; ctx.stroke(); } dot(ctx, cx, cy, 6, col.bad); [[-50, -10], [50, 14], [-30, 40], [70, -30], [-80, 20]].forEach(([a, b]) => dot(ctx, cx + a, cy + b, 3, col.s[0])); text(ctx, 'rings of hard matrix around a central canal', cx, Y + H - 6, { color: col.ink, size: 10, weight: 700, align: 'center', halo: col.soft }); }
    if (k === 6) { for (let i = 0; i < 18; i++) { const x = X + 14 + (i * 47) % (W - 28), y = Y + 14 + (i * 31) % (H - 28); ctx.beginPath(); ctx.ellipse(x, y, 11, 8, i, 0, 7); ctx.fillStyle = col.bad; ctx.fill(); ctx.beginPath(); ctx.ellipse(x, y, 4, 2.6, i, 0, 7); ctx.fillStyle = col.soft; ctx.fill(); } [[0.3, 0.5], [0.7, 0.3]].forEach(([a, b]) => { dot(ctx, X + a * W, Y + b * H, 13, col.panel, col.s[0]); dot(ctx, X + a * W, Y + b * H, 6, col.s[0]); }); for (let i = 0; i < 6; i++) dot(ctx, X + 24 + i * 50, Y + 20 + (i * 17) % 60, 2, col.s[3]); text(ctx, 'red cells, white cells, platelets in plasma', cx, Y + H - 6, { color: col.ink, size: 10, weight: 700, align: 'center', halo: col.soft }); }
    ctx.restore();
    let y = Y + H + 20; text(ctx, 'Found: ' + C[k][1], X, y, { color: col.s[0], size: 11, weight: 700 });
    wrap(ctx, C[k][2], W).forEach((l) => { y += 15; text(ctx, l, X, y, { color: col.ink, size: 11 }); });
  };
  cv.redraw();
}
