// Class 10 Colourful World: scattering of light and the Tyndall effect. A beam of white light (a mix of blue, green and red
// "photons" here) crosses a glass of water that holds tiny particles. Particles much smaller than the wavelength of light
// (air molecules, very fine mist) scatter blue light far more than red (about 1/wavelength to the fourth power, Rayleigh
// scattering), so the sideways light is blue and the beam that comes through is reddish. Larger particles (dust, water droplets in
// cloud, milk) scatter all colours about equally, so the scattered light is white. Seeing the beam from the side
// at all is the Tyndall effect.
import { canvas, text, title, line, dot, row, slider, readout, loop } from '../../kit.js';

const COLS = [['#2a6df4', 450], ['#2bb24c', 530], ['#e5241d', 650]];
export default function (host) {
  let size = 0.1, amount = 0.5, ph = [], acc = 0, seen = [0, 0, 0], tot = 0, rng = 7;
  const rnd = () => ((rng = (rng * 16807) % 2147483647) / 2147483647);
  const cv = canvas(host, { aspect: 0.62, max: 440, min: 270, label: 'A beam of light through water with particles, scattering blue light sideways when the particles are tiny' });
  const ctl = row(host);
  slider(ctl, { label: 'Size of the particles', min: 0, max: 1, step: 0.05, value: size, fmt: (v) => (v < 0.3 ? 'tiny (molecules)' : v < 0.7 ? 'small (smoke)' : 'large (dust, milk)'), oninput: (v) => { size = v; seen = [0, 0, 0]; tot = 0; update(); } });
  slider(ctl, { label: 'How many particles', min: 0.1, max: 1, step: 0.05, value: amount, fmt: (v) => (v < 0.4 ? 'few' : v < 0.75 ? 'some' : 'many'), oninput: (v) => { amount = v; seen = [0, 0, 0]; tot = 0; update(); } });
  const out = readout(host);
  function update() { out.innerHTML = size < 0.3 ? 'Tiny particles scatter <b>blue</b> most, so the beam looks blue from the side, and the light that gets through is <b>reddish</b>. This is why the sky is blue and the setting Sun is red.' : size < 0.7 ? 'Small particles scatter blue and some of the other colours: a bluish-white beam.' : 'Large particles scatter <b>all colours equally</b>, so the scattered light is <b>white</b>: that is why clouds, milk and fog look white.'; }
  loop(host, (dt) => {
    acc += dt; while (acc > 0.045) { acc -= 0.045; const c = Math.floor(rnd() * 3); ph.push({ x: 0, y: 0, c, vx: 1, vy: 0, life: 1, sc: false }); }
    const kfun = (c) => ((1 - size) * 0.75 * Math.pow(550 / COLS[c][1], 4) + size * 0.5) * amount;
    for (const p of ph) {
      if (!p.sc && p.x > 0.12 && p.x < 0.88 && rnd() < kfun(p.c) * dt * 2.1) { p.sc = true; const a = rnd() * 2 * Math.PI; p.vx = Math.cos(a) * 0.6; p.vy = Math.sin(a); }
      p.x += p.vx * dt * 0.55; p.y += p.vy * dt * 0.55; if (p.sc) p.life -= dt * 1.3;
      if (!p.sc && p.x >= 1 && !p.done) { p.done = true; seen[p.c]++; tot++; if (tot > 400) { seen = seen.map((v) => v * 0.5); tot = Math.round(tot / 2); } }
    }
    ph = ph.filter((p) => p.life > 0 && p.x < 1.05 && Math.abs(p.y) < 0.6);
    cv.redraw();
  });
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Scattering: what happens to each colour', col);
    const gx = 40, gw = w - 80, gy = h * 0.3, gh = h * 0.45, cy = gy + gh / 2;
    ctx.save(); ctx.fillStyle = col.soft; ctx.globalAlpha = 0.6; ctx.fillRect(gx, gy, gw, gh); ctx.globalAlpha = 1; ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.strokeRect(gx, gy, gw, gh); ctx.restore();
    // the particles
    const np = Math.round(26 * amount + 4), pr = 1.5 + size * 4.5;
    for (let i = 0; i < np; i++) { const px = gx + 8 + ((i * 97.3) % (gw - 16)), py = gy + 6 + ((i * 53.9 + 17) % (gh - 12)); dot(ctx, px, py, pr, col.muted); }
    line(ctx, [[6, cy], [gx, cy]], col.ink, 3); text(ctx, 'white light', 6, cy - 12, { color: col.ink, size: 10.5, weight: 700 });
    for (const p of ph) { ctx.save(); ctx.globalAlpha = Math.max(0, Math.min(1, p.life)) * (p.sc ? 0.95 : 1); const sc = Math.max(1, size < 0.7 ? 0 : 0); const c = p.sc && size >= 0.7 ? '#ffffff' : COLS[p.c][0]; dot(ctx, gx + p.x * gw, cy + p.y * gw * 0.5, p.sc ? 2.8 : 3.2, c, p.sc && size >= 0.7 ? col.muted : undefined); ctx.restore(); }
    // transmitted colour: the mix of what comes through, normalised
    const sum = Math.max(1, tot), mix = seen.map((v) => v / sum), mx = Math.max(0.001, ...mix), rgb = [mix[2] / mx, mix[1] / mx, mix[0] / mx].map((v) => Math.round(80 + 175 * v)).join(',');
    ctx.fillStyle = `rgb(${rgb})`; ctx.fillRect(gx + gw + 6, cy - 10, 22, 20); ctx.strokeStyle = col.ink; ctx.lineWidth = 1; ctx.strokeRect(gx + gw + 6, cy - 10, 22, 20);
    text(ctx, 'light that gets through', gx + gw + 4, cy + 30, { color: col.muted, size: 10, align: 'right' });
    text(ctx, 'sideways light is blue when particles are tiny', 8, h - 10, { color: col.muted, size: 10 });
    text(ctx, 'glass of water with particles', gx, gy - 8, { color: col.muted, size: 10.5 });
  };
  update();
}
