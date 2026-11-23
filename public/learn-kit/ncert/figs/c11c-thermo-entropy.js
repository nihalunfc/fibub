// Class 11 Chemistry, Thermodynamics: entropy as the freedom of particles. Slide the temperature of water (150 K to 450 K): solid ice (ordered lattice, small jiggle), liquid (loose, moving), steam (free, fast).
// Standard molar entropies, J/(K mol): ice about 41 (at 273 K), liquid water 70, steam 189 (CRC Handbook, NIST). More ways to arrange the particles means higher S, and S jumps at melting and at boiling.
import { canvas, text, title, row, slider, readout, loop, rng } from '../../kit.js';

export default function (host) {
  let T = 200;
  const r = rng(3), N = 20, P = Array.from({ length: N }, (_, i) => ({ gx: (i % 5 + 0.5) / 5, gy: (Math.floor(i / 5) + 0.5) / 4, x: r(), y: r(), vx: r() - 0.5, vy: r() - 0.5 }));
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 330, label: 'Water particles as ice liquid and steam with entropy values' });
  const ctl = row(host), ro = readout(host);
  slider(ctl, { label: 'temperature (K)', min: 150, max: 450, step: 1, value: T, fmt: (v) => v.toFixed(0) + ' K (' + (v - 273.15).toFixed(0) + ' °C)', oninput: (v) => { T = v; go(); } });
  const phase = () => (T < 273 ? 0 : T < 373 ? 1 : 2), S = () => [41, 70, 189][phase()];
  const go = () => { ro.textContent = `${['Ice: particles locked in a lattice', 'Liquid water: particles loose and tumbling', 'Steam: particles flying free in all the space'][phase()]}. S ≈ ${S()} J/(K mol). Going from ice to steam, S rises 4.6 times.`; };
  const anim = loop(host, (dt, t) => {
    const ph = phase(), box = ph === 2 ? 1 : 0.55;
    P.forEach((p) => {
      if (ph === 0) { p.x = p.gx * 0.9 + 0.05 + Math.sin(t * 9 + p.gx * 40) * 0.01; p.y = p.gy * 0.5 + 0.45 + Math.cos(t * 8 + p.gy * 30) * 0.01; return; }
      const sp = ph === 1 ? 0.12 : 0.55; p.x += p.vx * sp * dt; p.y += p.vy * sp * dt;
      const lo = ph === 1 ? 0.4 : 0.03; if (p.x < 0.03 || p.x > 0.97) { p.vx *= -1; p.x = Math.min(0.97, Math.max(0.03, p.x)); } if (p.y < lo) { p.vy = Math.abs(p.vy); p.y = lo; } if (p.y > 0.97) { p.vy = -Math.abs(p.vy); p.y = 0.97; }
    });
    cv.redraw();
  });
  anim.button(ctl);
  cv.draw = (ctx, w, h, col) => {
    const t0 = title(ctx, ['Ice (solid)', 'Liquid water', 'Steam (gas)'][phase()] + ': entropy ' + S() + ' J/(K mol)', col), bx = 16, bw = w - 32, by = t0 + 12, bh = h * 0.5;
    ctx.fillStyle = col.soft; ctx.fillRect(bx, by, bw, bh); ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.strokeRect(bx, by, bw, bh);
    P.forEach((p) => { ctx.beginPath(); ctx.arc(bx + p.x * bw, by + p.y * bh, 6, 0, 7); ctx.fillStyle = col.s[phase() === 0 ? 0 : phase() === 1 ? 1 : 3]; ctx.globalAlpha = 0.85; ctx.fill(); ctx.globalAlpha = 1; });
    const y0 = by + bh + 22, bar = (i, v, lab) => { const x = bx + 12 + i * (bw / 3), L = (bw / 3 - 24) * v / 189; ctx.fillStyle = phase() === i ? col.s[2] : col.line; ctx.fillRect(x, y0 + 4, L, 16); text(ctx, lab + ' ' + v, x, y0 + 32, { color: phase() === i ? col.ink : col.muted, size: 10.5, weight: phase() === i ? 700 : 400 }); };
    bar(0, 41, 'ice'); bar(1, 70, 'water'); bar(2, 189, 'steam');
    text(ctx, 'S in J/(K mol): more freedom, more entropy', w / 2, h - 12, { color: col.muted, size: 11, align: 'center' });
  };
  go();
}
