// Class 12 Chemistry, Chemical Kinetics: collision theory. Molecules collide all the time, but a collision gives a reaction only if (1) the colliding pair has at least the threshold energy
// Ea (kinetic energy of approach) and (2) the molecules meet with the proper orientation. Here particles move in a box; every collision is tested: energy from the relative speed,
// orientation as a random chance of 50 %. Green flash = effective, grey = bounced off. Raise T and more collisions pass the energy test; raise Ea and fewer do.
import { canvas, text, title, row, slider, readout, loop, rng } from '../../kit.js';

export default function (host) {
  let T = 400, Ea = 15, tot = 0, eff = 0, enough = 0, flashes = [];
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 320, label: 'Particles colliding in a box with effective collisions flashing green' });
  const ctl = row(host), ro = readout(host), R = rng(21);
  slider(ctl, { label: 'temperature (K)', min: 250, max: 700, step: 10, value: T, fmt: (v) => v.toFixed(0), oninput: (v) => { T = v; tot = eff = enough = 0; } });
  slider(ctl, { label: 'activation energy Ea (kJ/mol)', min: 5, max: 40, step: 1, value: Ea, fmt: (v) => v.toFixed(0), oninput: (v) => { Ea = v; tot = eff = enough = 0; } });
  const N = 26, P = Array.from({ length: N }, () => ({ x: R(), y: R(), a: R() * 6.28, e: -Math.log(1 - R() * 0.999) }));
  // speed from energy: draw energies from exponential distribution (mean = RT in kJ/mol units), speed ~ sqrt(E)
  const RT = () => 5 * T / 300, sp = (q) => 0.13 * Math.sqrt(Math.max(0.1, q.e * RT() / 2.5));
  const go = () => { ro.textContent = `Collisions: ${tot}. With enough energy (E ≥ Ea): ${enough} (${tot ? Math.round(100 * enough / tot) : 0} %). Effective (energy and orientation): ${eff} (${tot ? Math.round(100 * eff / tot) : 0} %).  Expected share with enough energy in this model: ${(Math.exp(-2 * Ea / RT() / 1) * (1 + 2 * Ea / RT()) * 100).toFixed(1)} % (it grows like e^(−Ea/RT) as T rises). Energies are scaled so that events are visible.`; };
  let tick = 0;
  loop(host, (dt) => {
    for (const q of P) { const s = sp(q) * 2.2; q.x += Math.cos(q.a) * s * dt; q.y += Math.sin(q.a) * s * dt; if (q.x < 0 || q.x > 1) { q.a = Math.PI - q.a; q.x = Math.min(1, Math.max(0, q.x)); } if (q.y < 0 || q.y > 1) { q.a = -q.a; q.y = Math.min(1, Math.max(0, q.y)); } }
    for (let i = 0; i < N; i++) for (let j = i + 1; j < N; j++) { const a = P[i], b = P[j], d = Math.hypot(a.x - b.x, a.y - b.y); if (d < 0.045 && !(a.cool > 0 && b.cool > 0)) {
      const E = (a.e + b.e) * RT() / 2; // approach energy (model units)
      tot++; const ok = E >= Ea, orient = R() < 0.5; if (ok) enough++; if (ok && orient) { eff++; flashes.push({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2, t: 0, c: 1 }); } else flashes.push({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2, t: 0, c: 0 });
      const t0 = a.a; a.a = b.a + (R() - 0.5); b.a = t0 + (R() - 0.5); const m = (a.e + b.e) / 2; a.e = b.e = m * 0 + (-Math.log(1 - R() * 0.999)) * 0.5 + m * 0.5; a.cool = b.cool = 6; } }
    for (const q of P) if (q.cool > 0) q.cool -= 1;
    flashes.forEach((f) => (f.t += dt)); flashes = flashes.filter((f) => f.t < 0.5);
    if (++tick % 8 === 0) go(); cv.redraw();
  });
  cv.draw = (ctx, w, h, col) => {
    const t0 = title(ctx, 'Effective collisions need energy AND orientation', col) + 8, L = 14, W = w - 28, B = h - 14, H = B - t0;
    ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.strokeRect(L, t0, W, H);
    for (const q of P) { const hot = q.e * RT() >= Ea * 0.9; ctx.beginPath(); ctx.arc(L + q.x * W, t0 + q.y * H, 4.5, 0, 7); ctx.fillStyle = hot ? col.s[3] : col.s[0]; ctx.fill(); }
    for (const f of flashes) { ctx.beginPath(); ctx.arc(L + f.x * W, t0 + f.y * H, 6 + f.t * 30, 0, 7); ctx.strokeStyle = f.c ? col.s[2] : col.muted; ctx.lineWidth = f.c ? 3 : 1.5; ctx.globalAlpha = 1 - f.t * 2; ctx.stroke(); ctx.globalAlpha = 1; }
    text(ctx, 'orange = energetic molecules, blue = ordinary', L + 6, t0 + 12, { color: col.muted, size: 10.5, halo: col.panel });
    text(ctx, `effective: ${eff}   of ${tot} collisions`, L + W - 6, B - 10, { color: col.s[2], size: 11.5, weight: 700, align: 'right', halo: col.panel });
  };
  go();
}
