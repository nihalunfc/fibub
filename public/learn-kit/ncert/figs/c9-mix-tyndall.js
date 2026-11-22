// Class 9 Mixtures: true solution, colloid and suspension, and the Tyndall effect. Particle sizes: solution under
// 1 nm (cannot be seen, pass through filter paper, never settle, do not scatter light), colloid 1 to 1000 nm (cannot
// be filtered out or seen, do not settle, scatter light so the beam shows: Tyndall effect), suspension over 1000 nm
// (visible, settle on standing, filter out, scatter or block light). Press "Let it stand" to see settling; "Shine
// light" turns the beam on; "Filter" shows what stays on the paper.
import { canvas, text, title, dot, line, row, choice, button, readout, loop, rng } from '../../kit.js';

const K = { sol: ['True solution (salt in water)', 0.9, 0], col: ['Colloid (milk, fog, ink)', 2.6, 1], sus: ['Suspension (muddy water)', 5.6, 2] };
export default function (host) {
  let k = 'sol', beam = true, stand = 0, standing = false, t = 0, R = rng(6), P = [];
  for (let i = 0; i < 70; i++) P.push({ x: R(), y: R(), a: R() * 6, d: 0.4 + R() * 0.6 });
  const cv = canvas(host, { aspect: 0.92, max: 440, min: 300, label: 'A beaker of solution, colloid or suspension lit by a beam of light that shows only in the colloid and suspension' });
  const ctl = row(host);
  choice(ctl, 'Mixture', [['sol', 'Solution'], ['col', 'Colloid'], ['sus', 'Suspension']], k, (v) => { k = v; stand = 0; standing = false; upd(); });
  button(ctl, 'Shine light on/off', () => { beam = !beam; upd(); });
  button(ctl, 'Let it stand', () => { standing = true; });
  button(ctl, 'Reset', () => { stand = 0; standing = false; });
  const out = readout(host);
  function upd() {
    out.innerHTML = { sol: 'Particles are smaller than 1 nm. The beam passes straight through without being seen. They never settle and pass through filter paper: <b>no Tyndall effect</b>.', col: 'Particles are 1 to 1000 nm: too small to settle or be filtered, but big enough to scatter light. The beam shows as a bright path: <b>Tyndall effect</b>. Think of a torch beam in a smoky room or sunlight in a dusty hall.', sus: 'Particles are larger than 1000 nm and visible. The beam is scattered (and the liquid is cloudy). If you leave it, the particles <b>settle</b>, and filter paper holds them back.' }[k];
    cv.redraw();
  }
  loop(host, (dt) => { t += dt; if (standing && k === 'sus') stand = Math.min(1, stand + dt * 0.25); cv.redraw(); });
  cv.draw = (ctx, w, h, col) => {
    title(ctx, K[k][0], col);
    const bx = w * 0.3, bw = w * 0.62, by = 52, bh = h * 0.52;
    ctx.fillStyle = k === 'sus' ? col.soft : col.panel; ctx.fillRect(bx, by, bw, bh); ctx.strokeStyle = col.ink; ctx.lineWidth = 2.5; ctx.strokeRect(bx, by, bw, bh);
    const r = K[k][1], light = beam && K[k][2] > 0;
    P.forEach((p, i) => { let y = by + 6 + p.y * (bh - 12); if (k === 'sus') { y = y + (by + bh - 8 - y) * stand * p.d; }
      const x = bx + 6 + ((p.x + Math.sin(t * (k === 'sol' ? 3 : 1.2) + p.a) * 0.02 + 1) % 1) * (bw - 12), yy = k === 'sus' && stand > 0.2 ? y : y + Math.cos(t * 1.4 + p.a) * 2;
      const inBeam = Math.abs(yy - (by + bh * 0.45)) < 11;
      dot(ctx, x, yy, k === 'sol' ? 1.1 : r, light && inBeam ? col.s[3] : k === 'sus' ? col.s[5] : col.s[4]); if (k === 'sol' && i % 2) dot(ctx, x + 3, yy + 2, 1.1, col.s[4]); });
    // lamp and beam
    const ly = by + bh * 0.45; ctx.fillStyle = col.ink; ctx.fillRect(10, ly - 9, 24, 18); text(ctx, 'torch', 22, ly + 20, { color: col.muted, size: 10, align: 'center' });
    if (beam) { ctx.globalAlpha = 0.9; line(ctx, [[34, ly], [bx, ly]], col.s[3], 3); ctx.globalAlpha = 1; const through = light ? 0.45 : 1; ctx.globalAlpha = light ? 0.35 : 0.0; ctx.fillStyle = col.s[3]; ctx.fillRect(bx, ly - 8, bw, 16); ctx.globalAlpha = 1; if (!light) { ctx.globalAlpha = 0.25; line(ctx, [[bx, ly], [bx + bw, ly]], col.s[3], 2, [3, 5]); ctx.globalAlpha = 1; } void through; }
    text(ctx, light ? 'beam visible (scattered)' : beam ? 'beam not visible inside' : 'light off', bx + bw / 2, by + bh + 14, { color: light ? col.s[3] : col.muted, size: 11, weight: 700, align: 'center' });
    // size scale
    const sy = by + bh + 40; text(ctx, 'particle size', 12, sy, { color: col.muted, size: 10.5 }); line(ctx, [[12, sy + 12], [w - 12, sy + 12]], col.line, 2);
    [['< 1 nm', 0.15, 'sol'], ['1–1000 nm', 0.5, 'col'], ['> 1000 nm', 0.85, 'sus']].forEach(([s, f, id]) => { dot(ctx, 12 + (w - 24) * f, sy + 12, id === k ? 7 : 4, id === k ? col.s[1] : col.s[4]); text(ctx, s, 12 + (w - 24) * f, sy + 30, { color: id === k ? col.ink : col.muted, size: 10.5, weight: id === k ? 700 : 400, align: 'center' }); });
  };
  upd();
}
