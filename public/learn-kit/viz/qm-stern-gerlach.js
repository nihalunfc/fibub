// Stern-Gerlach experiment: atoms with magnetic moments fly through a field that gets stronger upwards and are pushed by
// F = μz dB/dz. Classical little magnets would smear into a band; real atoms land in 2j + 1 separate spots. Choose the atom
// (spin ½, l = 1, j = 3/2) or "classical" and raise the field gradient to spread the spots. Screen counts build up as you watch.
import { canvas, text, title, row, slider, choice, button, readout, loop, rng, line } from '../kit.js';

const KIND = { half: ['Silver (j = ½, g = 2)', [-1, 1]], one: ['l = 1 atom (g = 1)', [-1, 0, 1]], three: ['j = 3/2 (g = 4/3)', [-2, -2 / 3, 2 / 3, 2]], cl: ['Classical magnets', null] };
const MUB = 9.274e-24, M = 1.79e-25, V = 550, LM = 0.035, D = 0.02; // Ag atom, speed, magnet length, gap to screen
export default function (host) {
  const R = rng(3);
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 320, label: 'Atoms deflected by a magnet and landing on a screen in separate spots' });
  let kind = 'half', grad = 800, atoms = [], hits = [], acc = 0;
  const ctl = row(host), ctl2 = row(host), out = readout(host);
  choice(ctl, 'Atoms', Object.keys(KIND).map((k) => [k, KIND[k][0]]), kind, (v) => { kind = v; atoms = []; hits = []; show(); });
  slider(ctl2, { label: 'Field gradient dB/dz', min: 100, max: 1500, step: 50, value: grad, fmt: (v) => v + ' T/m', oninput: (v) => { grad = v; atoms = []; hits = []; show(); } });
  const mgs = () => KIND[kind][1];
  const dev = (mg) => (mg * MUB * grad * LM * (LM / 2 + D)) / (M * V * V); // metres at the screen
  const anim = loop(host, (dt) => {
    acc += dt * 10; while (acc >= 1) { acc -= 1; const m = mgs(); atoms.push({ x: 0.08, mg: m ? m[Math.floor(R() * m.length)] : (R() * 2 - 1), y0: (R() - 0.5) * 0.02 }); }
    atoms.forEach((a) => { a.x += dt * 0.22; if (a.x > 0.86 && !a.done) { a.done = 1; hits.push(a.mg + (R() - 0.5) * 0.12); if (hits.length > 800) hits.shift(); } });
    atoms = atoms.filter((a) => a.x < 0.9); cv.redraw();
  });
  anim.button(ctl2); button(ctl2, 'Clear', () => { hits = []; atoms = []; });
  function show() { const m = mgs(); out.innerHTML = m ? `<b>${m.length} spots</b>, at ${m.map((g) => (dev(g) * 1000).toFixed(2)).join(', ')} mm from the centre (silver atoms at 550 m/s, magnet 3.5 cm). Spot spacing ∝ g·m<sub>j</sub> × gradient: the field cannot make a spin-½ atom point "half-way". Space quantization.` : `Classical magnets can point any way, so the deflection takes <b>every value</b> from −${(dev(1) * 1000).toFixed(2)} to +${(dev(1) * 1000).toFixed(2)} mm: a smeared band. This is what Stern and Gerlach expected and did not see (1922).`; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Stern-Gerlach apparatus (side view)', col);
    const cy = h * 0.5, k = (h * 0.09) * (grad / 800);
    ctx.fillStyle = col.muted; ctx.globalAlpha = 0.5;
    const mx0 = w * 0.3, mx1 = w * 0.55; ctx.beginPath(); ctx.moveTo(mx0, cy - 28); ctx.lineTo(mx1, cy - 28); ctx.lineTo(mx1, cy - 70); ctx.lineTo(mx0, cy - 70); ctx.fill();
    ctx.beginPath(); ctx.moveTo(mx0, cy + 28); ctx.lineTo(mx1, cy + 28); ctx.lineTo(mx1, cy + 70); ctx.lineTo(mx0, cy + 70); ctx.fill(); ctx.globalAlpha = 1;
    ctx.beginPath(); ctx.moveTo(mx0, cy - 28); ctx.lineTo((mx0 + mx1) / 2, cy - 14); ctx.lineTo(mx1, cy - 28); ctx.fillStyle = col.bg; ctx.fill();
    text(ctx, 'N', (mx0 + mx1) / 2, cy - 48, { color: col.bg, size: 14, weight: 700, align: 'center' }); text(ctx, 'S', (mx0 + mx1) / 2, cy + 48, { color: col.bg, size: 14, weight: 700, align: 'center' });
    ctx.fillStyle = col.s[2]; ctx.fillRect(10, cy - 8, 20, 16); text(ctx, 'oven', 20, cy + 22, { color: col.muted, size: 10, align: 'center' });
    const sx = w * 0.86; ctx.fillStyle = col.ink; ctx.fillRect(sx, 36, 3, h - 76); text(ctx, 'screen', sx + 1, h - 22, { color: col.muted, size: 10, align: 'center' });
    { const m = mgs(); const ty = (g) => cy - g * k * 3.2; if (m) m.forEach((g) => { line(ctx, [[sx - 6, ty(g)], [sx + 3, ty(g)]], col.s[2], 2); text(ctx, g > 0 ? 'm_j up' : 'm_j down', sx - 9, ty(g) + (g > 0 ? -7 : 8), { color: col.s[2], size: 9, align: 'right', fit: false }); }); }
    // atoms
    atoms.forEach((a) => {
      const s = Math.max(0, (a.x - w * 0 - 0.3) / 0.25), x = a.x * w;
      let q = 0; if (a.x > 0.3) { q = a.x < 0.55 ? s * s / 2 : 0.5 + (s - 1); q /= 1.7; }
      const yy = cy - a.mg * k * 3.2 * q; ctx.beginPath(); ctx.arc(x, yy, 3, 0, 7); ctx.fillStyle = col.s[0]; ctx.fill();
    });
    // histogram on the screen
    const H = {}; hits.forEach((m) => { const b = Math.round(m * 40); H[b] = (H[b] || 0) + 1; });
    const mxh = Math.max(5, ...Object.values(H));
    Object.entries(H).forEach(([b, c]) => { const y = cy - (b / 40) * k * 3.2; ctx.fillStyle = col.s[1]; ctx.fillRect(sx + 4, y - 1.5, (c / mxh) * (w * 0.1), 3); });
  };
  show();
}
