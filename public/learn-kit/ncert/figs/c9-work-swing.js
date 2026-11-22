// Class 9 Work and Energy: conservation of energy. A pendulum bob, a roller-coaster car or a ball thrown up trade
// potential energy (PE = m g h) for kinetic energy (KE = 1/2 m v^2). With no friction KE + PE stays the same; the
// "Friction" switch removes a little total energy on every pass, turned into heat and sound, so the swing dies away.
import { canvas, text, title, line, dot, row, choice, button, loop } from '../../kit.js';

export default function (host) {
  let mode = 'pend', fric = false, E = 1, ph = 0;
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 300, label: 'A pendulum or roller coaster with bars of kinetic and potential energy that swap while the total stays constant' });
  const ctl = row(host);
  choice(ctl, 'Motion', [['pend', 'Pendulum'], ['coast', 'Roller coaster'], ['ball', 'Ball thrown up']], mode, (v) => { mode = v; E = 1; ph = 0; });
  choice(ctl, 'Friction', [['no', 'Off'], ['yes', 'On']], 'no', (v) => { fric = v === 'yes'; E = 1; });
  const anim = loop(host, (dt) => {
    ph += dt * (mode === 'ball' ? 1.1 : 0.9);
    if (fric) E = Math.max(0.05, E - dt * 0.07); else E = 1;
    cv.redraw();
  });
  anim.button(ctl);
  button(ctl, 'Restart', () => { ph = 0; E = 1; cv.redraw(); });
  // returns height fraction (0 low .. 1 top) and position
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'KE + PE stays the same (without friction)', col);
    const sceneH = h * 0.62, base = sceneH + 8; let x, y, hf;
    const amp = Math.sqrt(E);
    if (mode === 'pend') {
      const px = w * 0.3, py = 34, Lp = sceneH - 54, th = amp * 0.9 * Math.cos(ph * 2.2);
      x = px + Lp * Math.sin(th); y = py + Lp * Math.cos(th); hf = (Lp - Lp * Math.cos(th)) / (Lp * (1 - Math.cos(0.9)));
      line(ctx, [[px - 30, py], [px + 30, py]], col.ink, 3); line(ctx, [[px, py], [x, y]], col.ink, 1.5); dot(ctx, x, y, 12, col.s[2], col.ink);
      line(ctx, [[px - 60, py + Lp * Math.cos(0.9)], [px + 60, py + Lp * Math.cos(0.9)]], col.line, 1, [3, 3]);
    } else if (mode === 'coast') {
      const track = (u) => base - 20 - (Math.cos(u * Math.PI * 2) * 0.5 + 0.5) * (sceneH - 70); // u in 0..1; high at 0 and 1, low at 0.5
      const pts = []; for (let k = 0; k <= 40; k++) pts.push([10 + (k / 40) * (w * 0.6 - 10), track(k / 40)]);
      line(ctx, pts, col.ink, 3);
      const u = 0.5 + 0.5 * Math.sin(ph * 1.6) * amp * 1.0; // car swings between hills
      x = 10 + u * (w * 0.6 - 10); y = track(u) - 9; hf = (base - 20 - track(u)) / (sceneH - 70);
      ctx.fillStyle = col.s[2]; ctx.fillRect(x - 12, y - 7, 24, 14); dot(ctx, x - 6, y + 8, 3.5, col.ink); dot(ctx, x + 6, y + 8, 3.5, col.ink);
    } else {
      const T = 2, s = ph % T, v0 = 9 * Math.sqrt(E); // up and down
      const hh = Math.max(0, v0 * (s) - 4.9 * s * s * 1) ; const hmax = v0 * v0 / 19.6;
      const tt = (ph % (2 * v0 / 9.8 + 0.001)); const hh2 = Math.max(0, v0 * tt - 4.9 * tt * tt);
      hf = hmax ? Math.min(1, hh2 / 4.13) : 0; x = w * 0.3; y = base - 14 - hh2 * ((sceneH - 50) / 4.13);
      line(ctx, [[w * 0.3 - 40, base], [w * 0.3 + 40, base]], col.ink, 3); dot(ctx, x, y, 10, col.s[2], col.ink);
      line(ctx, [[w * 0.3 - 40, base - 14 - 4.13 * ((sceneH - 50) / 4.13)], [w * 0.3 + 40, base - 14 - (sceneH - 50)]], col.line, 1, [3, 3]);
    }
    hf = Math.max(0, Math.min(1, hf));
    const PE = hf * 1, KE = Math.max(0, E - PE);
    const bx = w * 0.72, bb = sceneH + 4, bt = 44, bh = bb - bt;
    [['PE', PE, col.s[1]], ['KE', KE, col.s[2]]].forEach(([n, e, c], i) => {
      const xx = bx - 40 + i * 52; ctx.fillStyle = c; ctx.fillRect(xx, bb - e * bh, 34, e * bh);
      text(ctx, n, xx + 17, bb + 10, { color: col.ink, size: 11, weight: 700, align: 'center' });
    });
    ctx.strokeStyle = col.muted; ctx.lineWidth = 1; ctx.setLineDash([4, 3]); ctx.strokeRect(bx - 44, bb - E * bh, 106, 0.1); ctx.setLineDash([]);
    text(ctx, 'total', bx + 16, bb - E * bh - 7, { color: col.muted, size: 10, align: 'center' });
    // total stack
    ctx.fillStyle = col.s[1]; ctx.fillRect(w - 38, bb - PE * bh, 24, PE * bh); ctx.fillStyle = col.s[2]; ctx.fillRect(w - 38, bb - (PE + KE) * bh, 24, KE * bh);
    text(ctx, 'sum', w - 26, bb + 10, { color: col.ink, size: 10.5, weight: 700, align: 'center' });
    const lost = 1 - E;
    text(ctx, fric ? `lost to heat and sound: ${(lost * 100).toFixed(0)}%` : 'no energy lost: KE + PE = constant', w / 2, h - 28, { color: fric ? col.bad : col.good, size: 11.5, weight: 700, align: 'center' });
    text(ctx, 'top: all PE, no KE · bottom: all KE, least PE', w / 2, h - 11, { color: col.muted, size: 10.5, align: 'center' });
  };
  cv.redraw();
}
