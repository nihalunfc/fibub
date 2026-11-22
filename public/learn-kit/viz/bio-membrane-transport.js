// Moving substances across the membrane. Pick diffusion, facilitated diffusion or active transport (a pump). Watch the
// particles: the first two only go down their concentration gradient and need no ATP; the pump moves them against it
// and uses ATP, so one side slowly fills up. "Block the carrier" shows what happens when the protein cannot work.
import { canvas, loop, row, choice, readout, rng, text, title } from '../kit.js';

const M = {
  diff: { n: 'Simple diffusion', t: 'Small non-polar molecules (O₂, CO₂, lipids) slip through the lipid bilayer from high to low concentration. No protein, no ATP.' },
  fac: { n: 'Facilitated diffusion', t: 'Polar molecules and ions (glucose, Na⁺) cross through channel or carrier proteins, still down the gradient, no ATP; the carrier can saturate.' },
  act: { n: 'Active transport', t: 'A pump (for example the Na⁺/K⁺ pump) uses ATP to move molecules against the gradient, from low to high concentration.' },
};
export default function (host) {
  let mode = 'diff', block = 'off', t = 0, ps = [], shown = 0;
  const cv = canvas(host, { aspect: 0.9, max: 380, min: 300, label: 'Particles crossing a membrane by diffusion, a channel or a pump' });
  const c = row(host), c2 = row(host);
  loop(host, (dt) => { t += dt; step(dt); cv.redraw(); }).button(c);
  choice(c, 'Transport', Object.entries(M).map(([k, v]) => [k, v.n]), mode, (v) => { mode = v; init(); show(); });
  choice(c2, 'Carrier protein', [['off', 'Working'], ['on', 'Blocked']], block, (v) => { block = v; show(); });
  const out = readout(host);
  function init() { const R = rng(3), nOut = mode === 'act' ? 12 : 26; ps = Array.from({ length: 38 }, (_, i) => ({ x: R(), y: i < nOut ? R() * 0.46 + 0.02 : 0.54 + R() * 0.44, vx: (R() - 0.5), vy: (R() - 0.5) })); }
  const topCount = () => ps.filter((p) => p.y < 0.5).length;
  function show() { const top = topCount(); out.innerHTML = `<b>${M[mode].n}.</b> ${M[mode].t} Now: <b>${top}</b> particles outside, <b>${ps.length - top}</b> inside. ${mode !== 'diff' && block === 'on' ? 'Carrier blocked: nothing crosses (the bilayer is a barrier to these molecules).' : ''}`; cv.redraw(); }
  function step(dt) {
    ps.forEach((p, i) => {
      p.x += p.vx * dt * 0.6; p.y += p.vy * dt * 0.6; if (p.x < 0.02 || p.x > 0.98) p.vx *= -1; p.x = Math.min(0.98, Math.max(0.02, p.x));
      const prev = p.y; if (Math.random() < 0.08) { p.vx = (Math.random() - 0.5); p.vy = (Math.random() - 0.5); }
      const crosses = (prev < 0.5) !== (p.y < 0.5), poreX = Math.abs(p.x - 0.5) < 0.08;
      const ok = mode === 'diff' || (mode === 'fac' && poreX && block === 'off');
      if (crosses && !ok) { p.y = prev < 0.5 ? 0.49 : 0.51; p.vy *= -1; }
      if (mode === 'act' && block === 'off' && p.y < 0.5 && p.y > 0.4 && Math.abs(p.x - 0.5) < 0.08 && Math.random() < 0.05) { p.y = 0.56; p.vy = Math.abs(p.vy); }
      p.y = Math.min(0.97, Math.max(0.03, p.y));
    });
    shown += dt; if (shown > 0.4) { shown = 0; show(); }
  }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, M[mode].n, col);
    const my = h * 0.5 + 8, T = 40, B = h - 28, X = (x) => 10 + x * (w - 20), Y = (y) => (y < 0.5 ? T + (y / 0.5) * (my - T - 12) : my + 12 + ((y - 0.5) / 0.5) * (B - my - 12));
    ctx.fillStyle = col.s[4]; ctx.globalAlpha = 0.1; ctx.fillRect(10, T, w - 20, my - T - 10); ctx.globalAlpha = 1; ctx.fillStyle = col.s[2]; ctx.globalAlpha = 0.1; ctx.fillRect(10, my + 10, w - 20, B - my - 10); ctx.globalAlpha = 1;
    text(ctx, 'outside', 14, T + 10, { color: col.muted, size: 10.5 }); text(ctx, 'inside the cell', 14, B - 8, { color: col.muted, size: 10.5 });
    // bilayer
    for (let i = 0; i < 24; i++) { const x = 16 + i * ((w - 32) / 23); if (mode !== 'diff' && Math.abs(x - w / 2) < 22) continue; [[-8, 0], [8, 1]].forEach(([dy]) => { ctx.beginPath(); ctx.arc(x, my + dy, 4.5, 0, 7); ctx.fillStyle = col.s[1]; ctx.fill(); ctx.strokeStyle = col.s[1]; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(x, my + dy + (dy < 0 ? 4 : -4)); ctx.lineTo(x, my + (dy < 0 ? 1 : -1) * 0); ctx.stroke(); }); }
    if (mode !== 'diff') { ctx.beginPath(); ctx.roundRect(w / 2 - 22, my - 18, 44, 36, 8); ctx.fillStyle = block === 'on' ? col.bad : col.s[0]; ctx.globalAlpha = 0.8; ctx.fill(); ctx.globalAlpha = 1; text(ctx, mode === 'fac' ? (block === 'on' ? 'blocked' : 'channel') : (block === 'on' ? 'no ATP' : 'pump'), w / 2, my, { color: '#fff', size: 10, weight: 700, align: 'center', fit: false }); if (mode === 'act' && block === 'off') text(ctx, 'ATP → ADP + Pi', w / 2 + 28, my + 30, { color: col.s[1], size: 10, weight: 700, fit: true }); }
    ps.forEach((p) => { ctx.beginPath(); ctx.arc(X(p.x), Y(p.y), 3.8, 0, 7); ctx.fillStyle = col.s[5]; ctx.fill(); });
    const top = topCount(); text(ctx, `outside: ${top}  inside: ${ps.length - top}`, w - 10, T + 10, { color: col.ink, size: 11, weight: 700, align: 'right' });
  };
  init(); show();
}
