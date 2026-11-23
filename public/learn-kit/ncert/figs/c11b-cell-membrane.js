// Class 11 Cell: the fluid mosaic model (Singer and Nicolson, 1972). The plasma membrane is a bilayer of phospholipids (hydrophilic heads out, hydrophobic tails in) with proteins floating
// in it like a mosaic. Heat makes it more fluid; cold makes it stiff; cholesterol keeps it from getting too fluid or too stiff. Slide the temperature to feel the fluidity.
import { canvas, text, title, row, slider, choice, readout, loop, rng } from '../../kit.js';
import { ellipse } from '../c11b-ex-util.js';

export default function (host) {
  let T = 37, chol = false, t = 0;
  const N = 14, g = rng(4), ph = Array.from({ length: 2 * N }, () => g() * 6.28), pr = [[3.4, 0.3], [7.8, -0.3], [11, 0.2]];
  const cv = canvas(host, { aspect: 0.9, max: 440, min: 300, label: 'A phospholipid bilayer with floating proteins that jostle more as the temperature rises' });
  const ctl = row(host), ro = readout(host);
  slider(ctl, { label: 'Temperature', min: 0, max: 60, step: 1, value: T, fmt: (v) => Math.round(v) + ' °C', oninput: (v) => { T = v; go(); } });
  choice(ctl, 'Cholesterol', [['0', 'Absent'], ['1', 'Present']], '0', (v) => { chol = v === '1'; go(); });
  loop(host, (dt) => { t += dt * (0.4 + T / 25); cv.redraw(); });
  const amp = () => Math.max(0.03, (T / 45) * (chol ? 0.45 + T / 150 : 1) + (chol && T < 15 ? 0.15 : 0));
  const go = () => { const a = amp(); ro.textContent = `At ${Math.round(T)} °C ${chol ? 'with' : 'without'} cholesterol the membrane is ${a < 0.15 ? 'stiff, almost solid' : a < 0.55 ? 'fluid and flexible: just right' : a < 0.9 ? 'very fluid' : 'too runny'}. ${chol ? 'Cholesterol packs between the tails: it stops them from packing tightly in the cold and from moving too freely in the heat.' : 'Lipids and proteins can move sideways in their own layer, but they rarely flip across.'}`; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const t0 = title(ctx, 'Fluid mosaic model of the plasma membrane', col);
    const a = amp(), x0 = 16, W = w - 32, sp = W / N, ym = (t0 + h) / 2 + 6, out = ym - 38, inn = ym + 38, hr = Math.min(8, sp * 0.4);
    text(ctx, 'outside the cell (watery)', x0, t0 + 14, { color: col.muted, size: 10, fit: false }); text(ctx, 'inside (cytoplasm)', x0, h - 8, { color: col.muted, size: 10, fit: false });
    for (let layer = 0; layer < 2; layer++) for (let i = 0; i < N; i++) {
      const k = layer * N + i, x = x0 + sp * (i + 0.5) + Math.sin(t * 1.3 + ph[k]) * a * 7, dy = Math.sin(t * 1.7 + ph[k] * 2) * a * 4, sgn = layer ? 1 : -1, yh = (layer ? inn : out) + dy;
      ctx.strokeStyle = col.s[3]; ctx.lineWidth = 1.5; for (const dx of [-3, 3]) { ctx.beginPath(); ctx.moveTo(x + dx, yh - sgn * hr); ctx.quadraticCurveTo(x + dx + Math.sin(t * 2 + k) * a * 5, yh - sgn * (hr + 12), x + dx, ym - sgn * 3 + dy * 0.4); ctx.stroke(); }
      ellipse(ctx, x, yh, hr, hr, col.s[0], col.panel, 1);
    }
    if (chol) for (let i = 0; i < 5; i++) { const x = x0 + sp * (1.5 + i * 2.6), y = (i % 2 ? inn : out) - (i % 2 ? 1 : -1) * 20; ctx.save(); ctx.translate(x, y + Math.sin(t + i) * 2); ctx.fillStyle = col.s[1]; ctx.fillRect(-2.5, -13, 5, 26); ctx.restore(); }
    if (chol) text(ctx, 'cholesterol (thick bars)', x0 + 4, inn + 40, { color: col.s[1], size: 10, weight: 700, fit: false });
    pr.forEach(([p, ph0], i) => { const x = x0 + sp * p + Math.sin(t * 0.8 + i * 2) * a * 18, y = ym + ph0 * 6; ellipse(ctx, x, y, sp * 0.8, 44, col.s[2] + 'bb', col.s[2], 1.5); text(ctx, ['channel', 'carrier', 'receptor'][i], x, y, { color: col.ink, size: 10, weight: 700, align: 'center', fit: false }); });
    const gx = x0 + 6 * sp; ctx.strokeStyle = col.s[4]; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(gx, out - hr); for (let k = 1; k < 4; k++) ctx.lineTo(gx + (k % 2 ? 6 : -6), out - hr - k * 9); ctx.stroke(); text(ctx, 'sugar chain', gx + 10, out - hr - 34, { color: col.s[4], size: 10, fit: false });
    text(ctx, 'round heads like water', x0 + W - 4, t0 + 14, { color: col.s[0], size: 10, align: 'right', fit: false, halo: col.panel }); text(ctx, 'wavy tails avoid water', x0 + W - 4, h - 8, { color: col.s[3], size: 10, align: 'right', fit: false, halo: col.panel });
  };
  go();
}
