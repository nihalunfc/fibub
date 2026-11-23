// Class 11 Cell Cycle: cytokinesis, the division of the cytoplasm after mitosis. An animal cell pinches in from the outside: a ring of actin and myosin (contractile ring) makes a cleavage furrow.
// A plant cell has a wall, so it builds a new wall from the inside outwards: Golgi vesicles gather at the middle, fuse into a cell plate, and it grows to the walls (the middle lamella is laid first).
import { canvas, text, title, row, choice, slider, readout, loop } from '../../kit.js';
import { ellipse, footer } from '../c11b-ex-util.js';

export default function (host) {
  let kind = 'an', p = 0.4;
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 300, label: 'Cytokinesis in an animal cell by a furrow and in a plant cell by a cell plate, with a progress slider' });
  const ctl = row(host), ro = readout(host);
  choice(ctl, 'Cell', [['an', 'Animal'], ['pl', 'Plant']], kind, (v) => { kind = v; go(); });
  const sl = slider(ctl, { label: 'Progress', min: 0, max: 1, step: 0.01, value: p, fmt: (v) => Math.round(v * 100) + ' %', oninput: (v) => { p = v; go(); } });
  const anim = loop(host, (dt) => { p += dt * 0.25; if (p > 1.15) p = 0; sl.set(Math.min(p, 1)); go(); }, { autoplay: false }); anim.button(ctl);
  const go = () => { ro.textContent = kind === 'an' ? 'Animal: a contractile ring of actin and myosin under the membrane tightens like a drawstring, making a furrow that deepens until the cell is pinched in two.' : 'Plant: Golgi vesicles with wall material line up at the middle and fuse into a cell plate, which grows outwards (centrifugally) to meet the old wall. Each daughter cell makes its own membrane and wall.'; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const t0 = title(ctx, kind === 'an' ? 'Cytokinesis in an animal cell: a furrow' : 'Cytokinesis in a plant cell: a cell plate', col), fy = footer(ctx, w, h, col, kind === 'an' ? 'The two daughter cells each get a nucleus (from telophase) and about half of the cytoplasm and organelles.' : 'The cell plate becomes the new wall between the daughters; fibres of cellulose are added later.');
    const q = Math.min(1, p), cx = w / 2, cy = (t0 + fy) / 2, W = Math.min(w - 40, 300), H = Math.min(fy - t0 - 24, 170), x0 = cx - W / 2, y0 = cy - H / 2;
    if (kind === 'an') {
      const pinch = q * H * 0.5;
      ctx.beginPath(); ctx.moveTo(x0 + 30, y0 + pinch * 0.02); ctx.bezierCurveTo(x0 + W * 0.25, y0 - 12 + pinch * 0, cx - 24, y0 + pinch, cx, y0 + pinch); ctx.bezierCurveTo(cx + 24, y0 + pinch, x0 + W * 0.75, y0 - 12, x0 + W - 30, y0); ctx.bezierCurveTo(x0 + W + 14, y0 + H * 0.2, x0 + W + 14, y0 + H * 0.8, x0 + W - 30, y0 + H); ctx.bezierCurveTo(x0 + W * 0.75, y0 + H + 12, cx + 24, y0 + H - pinch, cx, y0 + H - pinch); ctx.bezierCurveTo(cx - 24, y0 + H - pinch, x0 + W * 0.25, y0 + H + 12, x0 + 30, y0 + H); ctx.bezierCurveTo(x0 - 14, y0 + H * 0.8, x0 - 14, y0 + H * 0.2, x0 + 30, y0); ctx.closePath();
      ctx.fillStyle = col.soft; ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = col.s[3]; ctx.stroke();
      ellipse(ctx, cx - W * 0.25, cy, 20, 26, col.s[0] + '66', col.s[0], 2.5); ellipse(ctx, cx + W * 0.25, cy, 20, 26, col.s[0] + '66', col.s[0], 2.5);
      ctx.strokeStyle = col.s[4]; ctx.lineWidth = 4; for (const sg of [-1, 1]) { ctx.beginPath(); ctx.moveTo(cx - 6, cy + sg * (H / 2 - pinch)); ctx.lineTo(cx + 6, cy + sg * (H / 2 - pinch)); ctx.stroke(); }
      text(ctx, 'cleavage furrow', cx, y0 - 8 + pinch * 0 - 6, { color: col.s[4], size: 10.5, weight: 700, align: 'center', fit: false }); text(ctx, 'nucleus', cx - W * 0.25, cy + 38, { color: col.muted, size: 10, align: 'center', fit: false }); text(ctx, 'contractile ring (actin + myosin)', cx, y0 + H + 18, { color: col.s[4], size: 10, align: 'center', fit: false });
    } else {
      ctx.fillStyle = col.soft; ctx.fillRect(x0, y0, W, H); ctx.strokeStyle = col.s[2]; ctx.lineWidth = 5; ctx.strokeRect(x0, y0, W, H);
      ellipse(ctx, cx - W * 0.28, cy, 20, 26, col.s[0] + '66', col.s[0], 2.5); ellipse(ctx, cx + W * 0.28, cy, 20, 26, col.s[0] + '66', col.s[0], 2.5);
      const len = H * q; ctx.fillStyle = col.s[2]; ctx.fillRect(cx - 3, cy - len / 2, 6, len);
      for (let k = 0; k < 6; k++) { const y = y0 + 8 + k * (H - 16) / 5, inside = Math.abs(y - cy) < len / 2; if (!inside) ellipse(ctx, cx + (k % 2 ? 7 : -7) * (1 - q * 0.6), y, 3.5, 3.5, col.s[5], null); }
      text(ctx, 'cell plate', cx + 8, y0 + 12, { color: col.s[2], size: 10.5, weight: 700, fit: false }); text(ctx, 'Golgi vesicles gather', cx, y0 + H + 18, { color: col.s[5], size: 10, align: 'center', fit: false }); text(ctx, 'old wall', x0 + W, y0 + H + 18, { color: col.s[2], size: 10, align: 'right', fit: false });
    }
  };
  go();
}
