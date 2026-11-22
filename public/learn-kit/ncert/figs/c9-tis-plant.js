// Class 9 Tissues: a gallery of plant tissues. Pick a tissue to see its cells drawn (cell shape, wall, living or dead),
// where it is found and what it does: meristem (dividing, growth), parenchyma (thin wall, stores and photosynthesises),
// collenchyma (corners thickened, flexible support), sclerenchyma (very thick lignin wall, dead, hard support), xylem
// (dead tubes, water up), phloem (living sieve tubes, food), epidermis (flat tight skin, stomata, cuticle).
import { canvas, text, title, dot, line, row, choice } from '../../kit.js';

const T = [
  ['mer', 'Meristem', 'Tips of roots and shoots, cambium', 'Cells keep dividing, so the plant grows longer and thicker.', 'Small, boxy cells, thin wall, big nucleus, almost no vacuole. Living.'],
  ['par', 'Parenchyma', 'Leaf, fruit, soft parts of stem and root', 'Stores food and water; in green parts makes food (chlorenchyma); in water plants holds air so they float (aerenchyma).', 'Round, thin wall, large vacuole, gaps between cells. Living.'],
  ['col', 'Collenchyma', 'Under the skin of stems and leaf stalks', 'Gives support and flexibility, so a stalk bends without snapping.', 'Wall thickened at the corners with cellulose. Living.'],
  ['scl', 'Sclerenchyma', 'Husk of coconut, grain covers, bark', 'Strong, rigid support; the hard coconut shell, stone of mango.', 'Very thick lignin wall, narrow space inside, long fibres. Dead.'],
  ['xyl', 'Xylem', 'Roots, stems, leaf veins', 'Carries water and minerals up from roots to leaves; also supports.', 'Long tubes (vessels, tracheids) with thick lignin rings. Dead, hollow.'],
  ['phl', 'Phloem', 'Stems, roots, leaf veins', 'Carries food (sugar) from the leaves to all parts, up and down.', 'Sieve tubes with sieve plates + companion cells + fibres. Living.'],
  ['epi', 'Epidermis', 'Outer layer of leaf, stem, root', 'Protects against water loss and germs; stomata let gases pass; root hairs absorb water.', 'Flat cells packed tight, waxy cuticle on top. Living.'],
];
export default function (host) {
  let k = 0;
  const cv = canvas(host, { aspect: 0.92, max: 440, min: 300, label: 'Cells of each plant tissue with where they are found and what they do' });
  const ctl = row(host);
  choice(ctl, 'Plant tissue', T.map((t, i) => [i, t[1]]), 0, (v) => { k = v; cv.redraw(); });
  const wrap = (ctx, s, w, size) => { ctx.font = size + 'px system-ui'; const L = []; let c = ''; s.split(' ').forEach((x) => { if (ctx.measureText((c + ' ' + x).trim()).width > w && c) { L.push(c); c = x; } else c = (c + ' ' + x).trim(); }); L.push(c); return L; };
  cv.draw = (ctx, w, h, col) => {
    const t = T[k]; title(ctx, t[1] + ' tissue', col);
    const X = 14, Y = 38, W = w - 28, H = h * 0.42;
    ctx.fillStyle = col.soft; ctx.fillRect(X, Y, W, H); ctx.strokeStyle = col.line; ctx.strokeRect(X, Y, W, H);
    ctx.save(); ctx.beginPath(); ctx.rect(X, Y, W, H); ctx.clip();
    const id = t[0];
    if (id === 'mer') { for (let j = 0; j < 4; j++) for (let i = 0; i < 7; i++) { const s = W / 7.3, x = X + 6 + i * s, y = Y + 6 + j * s * 0.9; ctx.strokeStyle = col.s[4]; ctx.lineWidth = 1.5; ctx.strokeRect(x, y, s - 3, s * 0.85); dot(ctx, x + s / 2 - 1, y + s * 0.42, s * 0.24, col.s[0]); if (i === 3 && j === 1) line(ctx, [[x + s / 2 - 1, y - 2], [x + s / 2 - 1, y + s * 0.9]], col.bad, 2); } text(ctx, 'dividing', X + W * 0.46, Y + H * 0.34, { color: col.bad, size: 10, weight: 700 }); }
    if (id === 'par') { for (let j = 0; j < 3; j++) for (let i = 0; i < 5; i++) { const s = W / 5.4, x = X + s * 0.55 + i * s + (j % 2) * s * 0.3, y = Y + s * 0.5 + j * s * 0.72; ctx.beginPath(); ctx.arc(x, y, s * 0.36, 0, 7); ctx.fillStyle = col.panel; ctx.fill(); ctx.strokeStyle = col.s[1]; ctx.lineWidth = 1.5; ctx.stroke(); ctx.beginPath(); ctx.arc(x, y, s * 0.22, 0, 7); ctx.fillStyle = col.soft; ctx.fill(); dot(ctx, x - s * 0.22, y - s * 0.1, 2, col.s[0]); } }
    if (id === 'col') { for (let j = 0; j < 3; j++) for (let i = 0; i < 6; i++) { const s = W / 6.2, x = X + 6 + i * s, y = Y + 8 + j * s * 0.95; ctx.strokeStyle = col.s[4]; ctx.lineWidth = 1.5; ctx.strokeRect(x + 2, y, s - 4, s * 0.85); [[0, 0], [1, 0], [0, 1], [1, 1]].forEach(([a, b]) => dot(ctx, x + 2 + a * (s - 4), y + b * s * 0.85, 4.4, col.s[2])); } text(ctx, 'thick corners', X + W - 6, Y + H - 8, { color: col.s[2], size: 10, weight: 700, align: 'right' }); }
    if (id === 'scl') { for (let i = 0; i < 6; i++) { const x = X + 14 + i * (W / 6.2), len = H * 0.9; ctx.beginPath(); ctx.roundRect(x, Y + 6 + (i % 2) * 6, 22, len - 12, 10); ctx.fillStyle = col.s[2]; ctx.fill(); ctx.beginPath(); ctx.roundRect(x + 8, Y + 14 + (i % 2) * 6, 6, len - 28, 3); ctx.fillStyle = col.panel; ctx.fill(); } text(ctx, 'thick lignin walls, tiny hollow', X + W / 2, Y + H - 8, { color: col.ink, size: 10, weight: 700, align: 'center', halo: col.soft }); }
    if (id === 'xyl') { for (let i = 0; i < 4; i++) { const x = X + 20 + i * (W / 4.3); ctx.strokeStyle = col.s[0]; ctx.lineWidth = 2; ctx.strokeRect(x, Y + 4, 36, H - 8); for (let r = 0; r < 6; r++) line(ctx, [[x, Y + 14 + r * (H - 30) / 5], [x + 36, Y + 14 + r * (H - 30) / 5]], col.s[2], 3); } text(ctx, 'dead hollow tubes with lignin rings', X + W / 2, Y + H - 8, { color: col.ink, size: 10, weight: 700, align: 'center', halo: col.soft }); }
    if (id === 'phl') { for (let i = 0; i < 3; i++) { const x = X + 24 + i * (W / 3.2); ctx.strokeStyle = col.s[1]; ctx.lineWidth = 2; ctx.strokeRect(x, Y + 4, 34, H - 8); for (let r = 1; r < 3; r++) line(ctx, [[x, Y + r * H / 3], [x + 34, Y + r * H / 3]], col.s[3], 4, [2, 2]); ctx.strokeStyle = col.s[5]; ctx.strokeRect(x + 38, Y + 10, 14, H - 20); dot(ctx, x + 45, Y + H / 2, 4, col.s[5]); } text(ctx, 'sieve plates (orange) + companion cells', X + W / 2, Y + H - 8, { color: col.ink, size: 10, weight: 700, align: 'center', halo: col.soft }); }
    if (id === 'epi') { ctx.fillStyle = col.s[2]; ctx.fillRect(X, Y + H * 0.2, W, 5); for (let i = 0; i < 5; i++) { const x = X + 6 + i * (W / 5); ctx.strokeStyle = col.s[4]; ctx.lineWidth = 1.5; ctx.strokeRect(x, Y + H * 0.2 + 5, W / 5 - 2, H * 0.28); } ctx.fillStyle = col.good; ctx.beginPath(); ctx.ellipse(X + W * 0.5, Y + H * 0.34 + 5, 12, 9, 0, 0, 7); ctx.fill(); ctx.fillStyle = col.panel; ctx.beginPath(); ctx.ellipse(X + W * 0.5, Y + H * 0.34 + 5, 3, 6, 0, 0, 7); ctx.fill(); text(ctx, 'waxy cuticle', X + 6, Y + H * 0.14, { color: col.s[2], size: 10, weight: 700 }); text(ctx, 'stoma', X + W * 0.5, Y + H * 0.62, { color: col.good, size: 10, weight: 700, align: 'center' }); }
    ctx.restore();
    let y = Y + H + 20;
    text(ctx, 'Where: ' + t[2], X, y, { color: col.s[0], size: 11, weight: 700 });
    [t[3], t[4]].forEach((s, i) => { wrap(ctx, (i ? 'Cells: ' : 'Job: ') + s, W, 11).forEach((l) => { y += 15; text(ctx, l, X, y, { color: col.ink, size: 11 }); }); });
  };
  cv.redraw();
}
