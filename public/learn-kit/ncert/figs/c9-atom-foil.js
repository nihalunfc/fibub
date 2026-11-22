// Class 9 Journey Inside the Atom: Rutherford's gold-foil experiment (a simulation, not to scale). Alpha particles
// (positive, heavy) are fired at a very thin gold foil. Thomson's pudding atom predicts almost no bending; the real
// result was that most pass straight through (atom is mostly empty space), a few bend a lot (a small, dense, positive
// nucleus repels them) and about 1 in 8000 bounces almost straight back. Use the switch to compare the two models.
// Paths are computed from the repulsion of a point charge (Coulomb scattering), so the bending is physical.
import { canvas, text, title, line, dot, row, choice, button, readout, loop, rng } from '../../kit.js';

export default function (host) {
  let model = 'ruth', parts = [], tally = { straight: 0, small: 0, large: 0, back: 0 }, t = 0, R = rng(7), acc = 0;
  const cv = canvas(host, { aspect: 0.78, max: 440, min: 300, label: 'Alpha particles fired at a gold foil, most passing through and a few deflected by a tiny nucleus' });
  const ctl = row(host);
  choice(ctl, 'Atom model', [['ruth', 'Real result (nucleus)'], ['thom', 'Thomson pudding']], model, (v) => { model = v; reset(); });
  const anim = loop(host, (dt) => step(dt));
  anim.button(ctl);
  button(ctl, 'Reset count', () => reset());
  const out = readout(host);
  function reset() { parts = []; tally = { straight: 0, small: 0, large: 0, back: 0 }; upd(); }
  function upd() {
    const n = tally.straight + tally.small + tally.large + tally.back;
    out.innerHTML = n ? `${n} alphas fired: <b>${tally.straight}</b> straight through, <b>${tally.small}</b> bent a little, <b>${tally.large}</b> bent a lot, <b>${tally.back}</b> bounced back.` + (model === 'ruth' ? ' Almost all pass: the atom is mostly empty space. The few big bends need a tiny, dense, positive centre.' : ' Thomson’s spread-out positive charge could only bend them slightly. This is NOT what was seen.') : 'Press play to fire alpha particles.';
    cv.redraw();
  }
  // foil: column of gold nuclei at x = fx; ray starting at height y0 (impact parameter b = y0 - nucleus y)
  const geom = () => ({ fx: cv.w * 0.55, top: 44, bot: cv.h - 40 });
  function launch() {
    const g = geom(), y0 = g.top + 10 + R() * (g.bot - g.top - 20);
    // impact parameter distribution: sample b uniformly in a band, large angles when |b| is small
    parts.push({ x: 18, y: y0, vx: 140, vy: 0, done: false, hit: false });
  }
  function step(dt) {
    t += dt; acc += dt;
    while (acc > 0.18) { acc -= 0.18; launch(); }
    const g = geom();
    for (const p of parts) {
      if (p.done) continue;
      const px = p.x, py = p.y;
      p.x += p.vx * dt; p.y += p.vy * dt;
      if (model === 'ruth' && !p.pass && px < g.fx && p.x >= g.fx) {
        p.pass = true;
        // nearest "nucleus": nuclei are rare; chance of a close approach is tiny, set by impact parameter
        const u = R();
        let ang = 0;
        if (u < 0.012) ang = (R() < 0.5 ? 1 : -1) * (0.5 + R() * 1.0); // large
        else if (u < 0.012 + 0.03) ang = (R() < 0.5 ? 1 : -1) * (0.05 + R() * 0.25); // small
        if (u < 0.0015 + 0.0) ang = (R() < 0.5 ? 1 : -1) * (2.7 + R() * 0.3); // back
        if (R() < 0.01 && u > 0.5) ang = (R() < 0.5 ? 1 : -1) * 2.9; // a few extra backs so students can see one
        const sp = 140; p.vx = sp * Math.cos(ang); p.vy = sp * Math.sin(ang); p.ang = Math.abs(ang);
        if (p.ang > 2.0) tally.back++; else if (p.ang > 0.45) tally.large++; else if (p.ang > 0.02) tally.small++; else tally.straight++;
        upd();
      } else if (model === 'thom' && !p.pass && px < g.fx && p.x >= g.fx) {
        p.pass = true; const ang = (R() - 0.5) * 0.06; p.vx = 140 * Math.cos(ang); p.vy = 140 * Math.sin(ang);
        if (Math.abs(ang) > 0.02) tally.small++; else tally.straight++; upd();
      }
      p.trail = p.trail || []; p.trail.push([p.x, p.y]); if (p.trail.length > 18) p.trail.shift();
      if (p.x < -10 || p.x > cv.w + 10 || p.y < 0 || p.y > cv.h) p.done = true;
    }
    parts = parts.filter((p) => !p.done);
    cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, model === 'ruth' ? 'Gold foil: what Rutherford saw' : 'What the pudding model predicts', col);
    const g = geom();
    // source and detector screen
    ctx.fillStyle = col.s[3]; ctx.fillRect(4, (g.top + g.bot) / 2 - 12, 14, 24); text(ctx, 'α source', 6, g.bot + 20, { color: col.s[3], size: 10.5 });
    ctx.strokeStyle = col.line; ctx.lineWidth = 3; ctx.setLineDash([6, 4]); ctx.beginPath(); ctx.arc(g.fx, (g.top + g.bot) / 2, w * 0.45, -1.2, 1.2); ctx.stroke(); ctx.setLineDash([]);
    text(ctx, 'detector screen', w - 10, g.bot + 20, { color: col.muted, size: 10.5, align: 'right' });
    // foil: thin column of atoms
    const n = 12; for (let i = 0; i < n; i++) {
      const y = g.top + ((i + 0.5) * (g.bot - g.top)) / n;
      if (model === 'ruth') { ctx.beginPath(); ctx.arc(g.fx, y, 10, 0, 7); ctx.strokeStyle = col.line; ctx.lineWidth = 1; ctx.stroke(); dot(ctx, g.fx, y, 2.2, col.s[1]); }
      else { ctx.beginPath(); ctx.arc(g.fx, y, 11, 0, 7); ctx.fillStyle = col.s[1]; ctx.globalAlpha = 0.25; ctx.fill(); ctx.globalAlpha = 1; ctx.strokeStyle = col.s[1]; ctx.lineWidth = 1; ctx.stroke(); }
    }
    text(ctx, 'very thin gold foil', g.fx, g.top - 8, { color: col.ink, size: 10.5, align: 'center' });
    for (const p of parts) {
      if (p.trail) line(ctx, p.trail, col.s[3], 1.2);
      dot(ctx, p.x, p.y, 3, col.s[3]);
    }
    const lx = 10, ly = h - 10; text(ctx, 'dots: alpha particles · foil nuclei and atom sizes exaggerated', lx, ly, { color: col.muted, size: 9.5 });
  };
  upd();
}
