// Class 9 Mixtures: physical and chemical change. Drag the slider "how far it has gone" from before to after. In a
// physical change (melting ice, dissolving sugar) the particles are the same kind before and after, only their
// arrangement or spacing changes; it is usually easy to reverse. In a chemical change (rusting, burning) particles
// of the starting substances break up and rearrange into NEW kinds of particles with new properties; it is
// usually hard to reverse and has an energy change. The checklist applies the tests to each example.
import { canvas, text, title, dot, line, row, choice, slider } from '../../kit.js';

const E = {
  melt: ['Ice melting', 'phys', 'Same H₂O molecules: ordered in ice, free to slide in water. Cool it and it freezes back.', ['No new substance', 'Easy to reverse (freeze it)', 'Little energy change']],
  diss: ['Sugar dissolving', 'phys', 'Sugar molecules spread out between water molecules. Evaporate the water and sugar is back.', ['No new substance', 'Easy to reverse (evaporate)', 'Little energy change']],
  rust: ['Iron rusting', 'chem', 'Iron atoms and oxygen from air join to make a new substance, rust (iron oxide), with new properties. Rust cannot simply be turned back into iron.', ['New substance formed', 'Hard to reverse', 'Slow release of heat']],
  burn: ['Candle burning', 'chem', 'Wax and oxygen are rearranged into carbon dioxide and water vapour: new substances, with heat and light given out.', ['New substances formed', 'Cannot get the wax back', 'Heat and light given out']],
};
export default function (host) {
  let k = 'melt', p = 0;
  const cv = canvas(host, { aspect: 0.82, max: 440, min: 300, label: 'Particle pictures before and after a change, comparing physical and chemical changes' });
  const ctl = row(host);
  choice(ctl, 'Example', Object.entries(E).map(([id, e]) => [id, e[0]]), k, (v) => { k = v; cv.redraw(); });
  slider(ctl, { label: 'How far it has gone', min: 0, max: 1, step: 0.05, value: 0, fmt: (v) => (v === 0 ? 'before' : v === 1 ? 'after' : Math.round(v * 100) + '%'), oninput: (v) => { p = v; cv.redraw(); } });
  const wrap = (ctx, s, w) => { ctx.font = '11px system-ui'; const L = []; let c = ''; s.split(' ').forEach((x) => { if (ctx.measureText((c + ' ' + x).trim()).width > w && c) { L.push(c); c = x; } else c = (c + ' ' + x).trim(); }); L.push(c); return L; };
  cv.draw = (ctx, w, h, col) => {
    const [nm, kind, why, tests] = E[k];
    title(ctx, nm + ': ' + (kind === 'phys' ? 'PHYSICAL change' : 'CHEMICAL change'), col);
    const X = 12, Y = 40, W = w - 24, H = h * 0.36; ctx.fillStyle = col.soft; ctx.fillRect(X, Y, W, H); ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.strokeRect(X, Y, W, H);
    const e = p;
    const mol = (x, y, a, c1, c2) => { dot(ctx, x, y, 5.5, c1); dot(ctx, x + Math.cos(a) * 8, y + Math.sin(a) * 8, 3.6, c2); dot(ctx, x + Math.cos(a + 2) * 8, y + Math.sin(a + 2) * 8, 3.6, c2); };
    for (let i = 0; i < 24; i++) {
      const gx = X + 20 + (i % 6) * (W - 40) / 5.2, gy = Y + 18 + Math.floor(i / 6) * (H - 36) / 3.3, rx = X + 14 + ((i * 67) % 100) / 100 * (W - 28), ry = Y + 14 + ((i * 41) % 100) / 100 * (H - 28);
      if (k === 'melt') mol(gx + (rx - gx) * e, gy + (ry - gy) * e, e * i, col.s[0], col.panel);
      else if (k === 'diss') { if (i < 12) mol(rx, ry, i, col.s[0], col.panel); else { const sx = X + 18 + (i % 4) * 14, sy = Y + 20 + Math.floor((i - 12) / 4) * 14, tx = X + 14 + ((i * 91) % 100) / 100 * (W - 28), ty = Y + 14 + ((i * 53) % 100) / 100 * (H - 28); dot(ctx, sx + (tx - sx) * e, sy + (ty - sy) * e, 5, col.s[3]); } }
      else if (k === 'rust') { if (i < 12) { const x = X + 14 + (i % 6) * (W - 28) / 6, y = Y + 14 + Math.floor(i / 6) * (H - 28) / 2; if (e < 0.5) dot(ctx, x, y, 6, col.muted); else { dot(ctx, x, y, 6, col.s[2]); dot(ctx, x + 8 * (e - 0.4) * 2, y + 4, 3.6, col.bad); } } else if (e < 0.5) { mol(rx, ry, i, col.bad, col.bad); } }
      else { if (i < 12) { const x = X + 20 + (i % 4) * 28, y = Y + 16 + Math.floor(i / 4) * 28; if (e < 0.5) { dot(ctx, x, y, 5, col.s[4]); dot(ctx, x + 9, y, 5, col.s[4]); } else { dot(ctx, x + (rx - x) * (e - 0.5) * 2, y, 4.5, col.muted); dot(ctx, x + 12 + (rx - x) * (e - 0.5) * 1.2, y + 8, 3.3, col.s[0]); } } else if (e < 0.5) mol(rx, ry, i, col.bad, col.bad); else mol(rx, ry, i, col.muted, col.s[2]); }
    }
    text(ctx, e < 0.05 ? 'before' : e > 0.95 ? 'after' : 'changing…', X + W - 6, Y + H - 8, { color: col.ink, size: 10.5, weight: 700, align: 'right', halo: col.soft });
    let y = Y + H + 20; wrap(ctx, why, W).forEach((l) => { text(ctx, l, X, y, { color: col.ink, size: 11 }); y += 15; });
    y += 4; tests.forEach((s) => { text(ctx, (kind === 'chem' ? '● ' : '○ ') + s, X, y, { color: kind === 'chem' ? col.bad : col.good, size: 11, weight: 700 }); y += 16; });
  };
  cv.redraw();
}
