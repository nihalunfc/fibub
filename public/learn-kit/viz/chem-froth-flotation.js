// Froth flotation of a sulphide ore, particle by particle. Air bubbles rise through the crushed ore and water. With the
// collector (e.g. a xanthate) the sulphide grains turn water-repellent and stick to bubbles; with the frother (pine oil) the
// bubbles form a stable froth that is skimmed off; the gangue (sand, silica) is wetted and sinks. In a PbS + ZnS ore, NaCN
// acts as a depressant: it stops ZnS sticking, so PbS floats first and ZnS can be floated later.
import { canvas, text, row, choice, button, readout, loop, title } from '../kit.js';

export default function (host) {
  let collector = true, frother = true, depress = false, mix = true, ps = [], bubbles = [], froth = { PbS: 0, ZnS: 0, gangue: 0 }, tank = 0, clock = 0;
  const cv = canvas(host, { aspect: 0.95, max: 460, min: 330, label: 'A flotation cell with rising bubbles lifting ore grains into a froth while sand sinks' });
  const c1 = row(host);
  choice(c1, 'Collector (xanthate)', [[false, 'Off'], [true, 'On']], collector, (v) => { collector = v; });
  choice(c1, 'Frother (pine oil)', [[false, 'Off'], [true, 'On']], frother, (v) => { frother = v; });
  choice(c1, 'NaCN depressant', [[false, 'Off'], [true, 'On']], depress, (v) => { depress = v; });
  button(row(host), 'Fresh ore', () => reset());
  const kinds = [['PbS', 0.3], ['ZnS', 0.25], ['gangue', 0.45]];
  function reset() { ps = Array.from({ length: 90 }, () => { let u = Math.random(), k = 0; while (u > kinds[k][1] && k < 2) { u -= kinds[k][1]; k++; } return { x: Math.random(), y: 0.35 + Math.random() * 0.6, k: kinds[k][0], on: null }; }); bubbles = []; froth = { PbS: 0, ZnS: 0, gangue: 0 }; clock = 0; show(); }
  const out = readout(host);
  const sticks = (k) => k === 'PbS' ? collector : k === 'ZnS' ? collector && !depress : false;
  loop(host, (dt) => {
    const s = Math.min(dt, 0.04); clock += s;
    if (Math.random() < 0.18) bubbles.push({ x: Math.random(), y: 1, r: 0.02 + Math.random() * 0.012, car: [] });
    bubbles.forEach((b) => { b.y -= s * 0.3; b.x += (Math.random() - 0.5) * 0.004; });
    ps.forEach((p) => {
      if (p.on) { const b = p.on; p.x = b.x; p.y = b.y + 0.02; return; }
      p.y += s * 0.05 + (Math.random() - 0.5) * 0.004; p.x += (Math.random() - 0.5) * 0.01; p.x = Math.max(0.02, Math.min(0.98, p.x)); p.y = Math.min(0.97, p.y);
      if (p.k !== 'gangue' || false) bubbles.forEach((b) => { if (!p.on && sticks(p.k) && Math.hypot(b.x - p.x, (b.y - p.y) * 0.8) < 0.05 && b.car.length < 6) { p.on = b; b.car.push(p); } });
    });
    const topY = 0.12;
    bubbles = bubbles.filter((b) => {
      if (b.y > topY) return true;
      if (frother) { b.y = topY - 0.02 * Math.random(); if (b.car.length || Math.random() < 0.2) { b.car.forEach((p) => { froth[p.k]++; p.dead = true; }); b.car = []; } return b.y > -1 && Math.random() > 0.01; }
      b.car.forEach((p) => { p.on = null; p.y = 0.35; }); return false;
    });
    ps = ps.filter((p) => !p.dead); bubbles = bubbles.filter((b) => b.y < 1.01);
    cv.redraw(); show();
  });
  function show() {
    const inTank = ps.length, tot = froth.PbS + froth.ZnS + froth.gangue;
    out.innerHTML = `In the froth (concentrate): PbS ${froth.PbS}, ZnS ${froth.ZnS}, gangue ${froth.gangue}. Left in the tank: ${inTank} grains. ${!collector ? 'Without the collector nothing is water-repellent, so no ore sticks to bubbles.' : !frother ? 'Without the frother the bubbles burst at the top and drop their load back.' : depress ? 'The depressant keeps ZnS in the tank; only PbS reaches the froth. Later the NaCN is removed (CuSO₄ revives ZnS) and ZnS is floated.' : 'Both sulphides float; the sand-like gangue stays wet and sinks.'}`;
  }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Froth flotation cell', col);
    const bx = 14, bw = w - 28, by = 40, bh = h - by - 16;
    ctx.fillStyle = col.s[0]; ctx.globalAlpha = 0.14; ctx.fillRect(bx, by + bh * 0.12, bw, bh * 0.88); ctx.globalAlpha = 1;
    ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.strokeRect(bx, by, bw, bh);
    if (frother) { ctx.fillStyle = col.muted; ctx.globalAlpha = 0.25; ctx.fillRect(bx, by, bw, bh * 0.12); ctx.globalAlpha = 1; text(ctx, 'froth: skimmed off', bx + 6, by + 10, { color: col.muted, size: 10 }); }
    bubbles.forEach((b) => { ctx.beginPath(); ctx.arc(bx + b.x * bw, by + b.y * bh, 4 + (b.r - 0.02) * 400 + 2, 0, 7); ctx.strokeStyle = col.muted; ctx.lineWidth = 1.2; ctx.stroke(); });
    const cl = { PbS: col.s[1], ZnS: col.s[2], gangue: col.s[7] };
    ps.forEach((p) => { ctx.beginPath(); ctx.rect(bx + p.x * bw - 3, by + p.y * bh - 3, 6, 6); ctx.fillStyle = cl[p.k]; ctx.fill(); });
    text(ctx, 'orange PbS · green ZnS · grey gangue', bx + 4, h - 6, { color: col.muted, size: 10 });
    text(ctx, 'air', bx + bw - 4, by + bh - 6, { color: col.muted, size: 10, align: 'right' });
  };
  reset();
}
