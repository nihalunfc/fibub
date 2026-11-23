// Class 8 Science, Electricity: a simple circuit. Current flows only round a complete loop of conductors: cell, wire,
// bulb and back. Close the switch, pick what bridges the gap, and add cells. Conductors (copper, iron, graphite, salty
// water) let current flow; insulators (rubber, plastic, wood) do not. More cells push a bigger current, so the bulb
// is brighter. Dots show the conventional current moving from the + end of the cell round the loop.
import { canvas, text, title, line, dot, row, slider, choice, button, readout, loop } from '../../kit.js';

const MAT = { copper: ['Copper wire', true], iron: ['Iron nail', true], graphite: ['Pencil lead', true], salt: ['Salty water', true], rubber: ['Rubber', false], plastic: ['Plastic', false] };
export default function (host) {
  let sw = true, mat = 'copper', cells = 1, t = 0;
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 300, label: 'A cell, a switch, a gap bridged by a chosen material, and a bulb in a loop with moving current' });
  loop(host, (dt) => { if (flows()) t += dt * (0.4 + cells * 0.4); cv.redraw(); });
  const ctl = row(host);
  const bs = button(ctl, 'Switch: ON', () => { sw = !sw; bs.textContent = 'Switch: ' + (sw ? 'ON' : 'OFF'); upd(); });
  choice(ctl, 'Gap material', Object.entries(MAT).map(([k, v]) => [k, v[0]]), mat, (v) => { mat = v; upd(); });
  slider(ctl, { label: 'Cells', min: 1, max: 3, step: 1, value: cells, fmt: (v) => String(v), oninput: (v) => { cells = v; upd(); } });
  const out = readout(host);
  const flows = () => sw && MAT[mat][1];
  function upd() { out.innerHTML = !sw ? 'The switch is open: the loop is broken, so <b>no current</b>.' : !MAT[mat][1] ? `${MAT[mat][0]} is an <b>insulator</b>: it blocks the current, so the bulb stays off.` : `The loop is complete and ${MAT[mat][0].toLowerCase()} is a <b>conductor</b>. ${cells} cell${cells > 1 ? 's' : ''} give a ${['', 'dim', 'brighter', 'bright'][cells]} bulb.`; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Does the bulb light?', col);
    const L = 28, Rr = w - 28, T = 70, B = h - 40, on = flows();
    const path = [[L, B], [L, T], [Rr, T], [Rr, B], [L, B]];
    line(ctx, path, col.ink, 3);
    // cell(s) at the bottom left
    const cx = L + 50;
    ctx.fillStyle = col.panel; ctx.fillRect(cx - 4, B - 14, 8 + (cells - 1) * 14, 28);
    for (let i = 0; i < cells; i++) { line(ctx, [[cx + i * 14, B - 14], [cx + i * 14, B + 14]], col.ink, 4); line(ctx, [[cx + i * 14 + 6, B - 8], [cx + i * 14 + 6, B + 8]], col.ink, 2); }
    text(ctx, '+', cx + cells * 14 + 4, B - 22, { color: col.bad, size: 13, weight: 700 }); text(ctx, 'cell', cx, B + 30, { color: col.muted, size: 10.5 });
    // switch top
    const sx = (L + Rr) / 2 - 40; ctx.fillStyle = col.panel; ctx.fillRect(sx - 10, T - 8, 70, 16);
    dot(ctx, sx, T, 4, col.ink); dot(ctx, sx + 50, T, 4, col.ink); line(ctx, sw ? [[sx, T], [sx + 50, T]] : [[sx, T], [sx + 40, T - 22]], col.s[1], 4); text(ctx, 'switch', sx + 25, T - 22, { color: col.muted, size: 10.5, align: 'center' });
    // gap on right with material
    const gy = (T + B) / 2; ctx.fillStyle = col.panel; ctx.fillRect(Rr - 8, gy - 30, 16, 60);
    ctx.fillStyle = MAT[mat][1] ? col.s[2] : col.s[4]; ctx.fillRect(Rr - 6, gy - 22, 12, 44); ctx.strokeStyle = col.ink; ctx.lineWidth = 1.5; ctx.strokeRect(Rr - 6, gy - 22, 12, 44);
    text(ctx, MAT[mat][0], Rr - 14, gy, { color: col.ink, size: 10.5, align: 'right' });
    // bulb on the left
    const bx = L, by = (T + B) / 2; ctx.fillStyle = col.panel; ctx.fillRect(bx - 16, by - 20, 32, 40);
    if (on) { const k = 0.25 + cells * 0.25; ctx.save(); ctx.globalAlpha = k * 0.5; dot(ctx, bx, by, 34, '#ffd84a'); ctx.restore(); for (let a = 0; a < 8; a++) line(ctx, [[bx + Math.cos(a * 0.785) * 22, by + Math.sin(a * 0.785) * 22], [bx + Math.cos(a * 0.785) * (22 + 8 * k), by + Math.sin(a * 0.785) * (22 + 8 * k)]], '#d9a400', 2); }
    dot(ctx, bx, by, 15, on ? '#ffd84a' : col.soft, col.ink); line(ctx, [[bx - 6, by + 5], [bx, by - 4], [bx + 6, by + 5]], col.ink, 1.5);
    text(ctx, 'bulb', bx + 22, by + 26, { color: col.muted, size: 10.5 });
    if (on) { const per = 2 * (Rr - L + B - T); for (let i = 0; i < 16; i++) { let d = ((i / 16 + t * 0.15) % 1) * per, x, y; // clockwise from the cell: up the right side? conventional: out of + going along bottom to the right
      if (d < Rr - L) { x = L + d; y = B; } else if (d < Rr - L + B - T) { x = Rr; y = B - (d - (Rr - L)); } else if (d < 2 * (Rr - L) + B - T) { x = Rr - (d - (Rr - L) - (B - T)); y = T; } else { x = L; y = T + (d - 2 * (Rr - L) - (B - T)); }
      dot(ctx, x, y, 3.2, col.s[1]); } }
  };
  upd();
}
