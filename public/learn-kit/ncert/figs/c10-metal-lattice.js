// Class 10 Metals and Non-metals: why ionic compounds behave as they do. In a crystal, positive and negative ions sit in
// a rigid lattice held by strong attraction: high melting point (NaCl 801 degC), hard, and no free ions so no current
// when solid. Melting or dissolving frees the ions, so the liquid conducts. And a shifted layer puts like charges side
// by side: they repel and the crystal cracks: brittle.
import { canvas, text, title, line, dot, row, slider, choice, readout, loop, rng, clamp, lerp } from '../../kit.js';

export default function (host) {
  let st = 'solid', push = 0, t = 0;
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 300, label: 'A crystal of positive and negative ions as a solid, a melt and a solution, with a bulb' });
  const ctl = row(host);
  choice(ctl, 'State', [['solid', 'Solid'], ['molten', 'Molten'], ['water', 'In water']], st, (v) => { st = v; say(); });
  const sl = slider(ctl, { label: 'Push the top layer (solid)', min: 0, max: 1, step: 0.01, value: 0, fmt: (v) => `${Math.round(v * 100)}%`, oninput: (v) => { push = v; if (st !== 'solid') { st = 'solid'; } say(); } });
  loop(host, (dt) => { t += dt; cv.redraw(); });
  const out = readout(host);
  function say() {
    out.innerHTML = st === 'solid' ? (push < 0.5 ? 'Solid NaCl: ions are locked in a lattice by strong attraction, so melting needs a lot of heat (801 °C) and there are <b>no free ions: the bulb stays off</b>. Push the top layer to test brittleness.' : '<b>Brittle:</b> the shifted layer puts + ions next to + ions and − next to −. They repel and the crystal cracks. A metal, whose atoms slide, would just bend.')
      : st === 'molten' ? '<b>Molten NaCl</b> (above 801 °C): the lattice breaks and the ions move freely, so the liquid <b>conducts electricity</b>: the bulb lights.' : '<b>NaCl in water:</b> water molecules pull the ions apart, and the free ions carry the current: the solution conducts.';
    cv.redraw();
  }
  const rg = rng(4), jit = Array.from({ length: 40 }, () => [rg() * 6.28, rg() * 6.28, rg(), rg()]);
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, st === 'solid' ? 'Solid ionic crystal' : st === 'molten' ? 'Molten ionic compound' : 'Ionic compound dissolved in water', col) + 8;
    const cols = 6, rows = 4, cell = Math.min(34, (w * 0.62) / cols), gx = 16, gy = top + 40;
    ctx.save();
    if (st === 'water') { ctx.fillStyle = col.s[0]; ctx.globalAlpha = 0.15; ctx.fillRect(gx - 6, gy - 14, cols * cell + 12, rows * cell + 22); ctx.restore(); ctx.save(); }
    const cracked = st === 'solid' && push > 0.8;
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
      const i = r * cols + c, plus = (r + c) % 2 === 0, [a, b, ju, jv] = jit[i % 40];
      let x = gx + c * cell + cell / 2, y = gy + r * cell + cell / 2;
      if (st === 'solid') { x += Math.sin(t * 6 + a) * 1.3; y += Math.cos(t * 6 + b) * 1.3; if (r < 2) x += push * cell; if (cracked && r < 2) y -= 4; }
      else { const sp = st === 'molten' ? 1 : 1.3; x += Math.sin(t * (1.4 + ju) * sp + a) * (cell * 0.9) + Math.sin(t * 0.7 + b) * 10; y += Math.cos(t * (1.2 + jv) * sp + b) * (cell * 0.9); x = clamp(x, gx + 6, gx + cols * cell - 6); y = clamp(y, gy + 6, gy + rows * cell - 6); }
      const rr = plus ? cell * 0.28 : cell * 0.4;
      dot(ctx, x, y, rr, plus ? col.s[7] : col.s[2]); text(ctx, plus ? '+' : '−', x, y, { color: '#fff', size: 11, weight: 700, align: 'center', fit: false });
    }
    ctx.restore();
    if (st === 'water') for (let i = 0; i < 16; i++) { const [a, b] = jit[i]; const x = gx + 8 + ((a * 40 + t * 8 * (i % 3 + 1)) % (cols * cell - 16)), y = gy + 8 + ((b * 30 + t * 5) % (rows * cell - 16)); ctx.strokeStyle = col.s[0]; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(x, y, 3, 0, 7); ctx.stroke(); }
    if (cracked) { line(ctx, [[gx - 4, gy + 2 * cell], [gx + cols * cell + cell, gy + 2 * cell + 4]], col.bad, 2.5, [6, 3]); text(ctx, 'cracks!', gx + cols * cell + cell + 4, gy + 2 * cell, { color: col.bad, size: 11, weight: 700 }); }
    if (st === 'solid' && push > 0.45 && !cracked) text(ctx, 'like charges meet: repel', gx, gy - 12, { color: col.bad, size: 10.5, weight: 700 });
    // bulb at right
    const bx = w - 52, by = gy + 20, on = st !== 'solid';
    ctx.save(); ctx.globalAlpha = on ? 0.6 + 0.2 * Math.sin(t * 7) : 0.06; ctx.fillStyle = col.s[3]; ctx.beginPath(); ctx.arc(bx, by, 22, 0, 7); ctx.fill(); ctx.restore();
    ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(bx, by, 16, 0, 7); ctx.stroke();
    text(ctx, on ? 'bulb ON' : 'bulb OFF', bx, by + 36, { color: on ? col.s[2] : col.bad, size: 11, weight: 700, align: 'center' });
    line(ctx, [[gx + cols * cell, gy + cell], [bx - 16, by]], col.line, 1.5);
    text(ctx, st === 'solid' ? 'melting point 801 °C: very high' : st === 'molten' ? 'heated above 801 °C' : 'dissolved: ions are free', gx, gy + rows * cell + 22, { color: col.muted, size: 10.5 });
  };
  say();
}
