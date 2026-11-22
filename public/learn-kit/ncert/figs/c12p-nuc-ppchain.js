// Class 12 Nuclei (step player): the proton-proton chain that powers the Sun. Two protons fuse into a deuteron (a proton turns into a neutron: e+ and a neutrino leave), the deuteron
// grabs a proton to make He-3, and two He-3 meet to make He-4 and give back two protons. Net: 4 p -> He-4 + 2 e+ + 2 neutrinos, with about 26.7 MeV released (including the positrons annihilating).
import { canvas, text, title, arrow, loop } from '../../kit.js';

export default function (host) {
  let step = 0, t = 0;
  const cv = canvas(host, { aspect: 0.66, max: 440, min: 270, label: 'The proton-proton chain: protons fusing into deuterium, helium-3 and helium-4 inside the Sun' });
  const TITLES = ['The Sun’s fuel: protons', 'Step 1: p + p → deuteron', 'Step 2: d + p → He-3', 'Step 3: He-3 + He-3 → He-4 + 2p', 'Net result and energy'];
  loop(host, (dt) => { t += dt; cv.redraw(); });
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, TITLES[step], col), cy = top + 66, wob = (i) => Math.sin(t * 3 + i * 2) * 3;
    const ball = (x, y, c, lab, r = 11) => { ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fillStyle = c; ctx.fill(); ctx.strokeStyle = col.panel; ctx.lineWidth = 1.5; ctx.stroke(); text(ctx, lab, x, y, { color: col.panel, size: 11, weight: 700, align: 'center' }); };
    const P = (x, y, i) => ball(x + wob(i), y + wob(i + 4), col.s[3], 'p'), Nn = (x, y, i) => ball(x + wob(i), y + wob(i + 4), col.s[0], 'n');
    const side = (s, i, c = col.ink, wt = 400) => text(ctx, s, w / 2, cy + 74 + i * 18, { color: c, size: 12, weight: wt, align: 'center' });
    if (step === 0) { [[0.2, 0], [0.4, 1], [0.6, 2], [0.8, 3]].forEach(([f, i]) => P(w * f, cy + (i % 2 ? 14 : -14), i)); side('Core of the Sun: about 15 million K, protons moving very fast.', 0); side('They must get within ~1 fm against their Coulomb repulsion.', 1, col.muted); }
    if (step === 1) { P(w * 0.25, cy, 0); P(w * 0.38, cy, 1); arrow(ctx, w * 0.45, cy, w * 0.55, cy, col.ink, 2, 7); P(w * 0.64, cy, 2); Nn(w * 0.64 + 18, cy, 3); text(ctx, 'e⁺ + ν', w * 0.86, cy - 16, { color: col.s[2], size: 11.5, weight: 700, align: 'center' }); text(ctx, 'deuteron', w * 0.64 + 9, cy + 26, { color: col.muted, size: 10.5, align: 'center' }); side('¹₁H + ¹₁H → ²₁H + e⁺ + ν    (0.42 MeV)', 0, col.s[7], 700); side('One proton turned into a neutron (weak interaction): very slow, so the Sun lasts billions of years.', 1, col.muted); }
    if (step === 2) { P(w * 0.2, cy, 0); Nn(w * 0.2 + 20, cy, 2); text(ctx, 'deuteron', w * 0.2 + 10, cy + 26, { color: col.muted, size: 10.5, align: 'center' }); P(w * 0.45, cy, 3); arrow(ctx, w * 0.54, cy, w * 0.62, cy, col.ink, 2, 7); P(w * 0.72, cy, 4); P(w * 0.72 + 18, cy, 5); Nn(w * 0.72 + 9, cy - 14, 6); text(ctx, 'γ', w * 0.9, cy - 14, { color: col.s[2], size: 12, weight: 700, align: 'center' }); text(ctx, 'He-3', w * 0.72 + 9, cy + 26, { color: col.muted, size: 10.5, align: 'center' }); side('²₁H + ¹₁H → ³₂He + γ    (5.49 MeV)', 0, col.s[7], 700); side('This follows within seconds: the deuteron soon meets another proton.', 1, col.muted); }
    if (step === 3) { [0.12, 0.3].forEach((f, i) => { P(w * f, cy + 8, i); P(w * f + 16, cy + 8, i + 2); Nn(w * f + 8, cy - 8, i + 4); }); arrow(ctx, w * 0.42, cy, w * 0.5, cy, col.ink, 2, 7); P(w * 0.6, cy - 8, 1); P(w * 0.6 + 22, cy - 8, 2); Nn(w * 0.6, cy + 14, 3); Nn(w * 0.6 + 22, cy + 14, 4); text(ctx, 'He-4', w * 0.6 + 11, cy + 38, { color: col.muted, size: 10.5, align: 'center' }); P(w * 0.86, cy - 14, 5); P(w * 0.86, cy + 14, 6); side('³₂He + ³₂He → ⁴₂He + 2 ¹₁H    (12.86 MeV)', 0, col.s[7], 700); side('Two protons are returned to the pool to start again.', 1, col.muted); }
    if (step === 4) { side('Steps 1 and 2 happen twice for each step 3:', 0, col.muted); side('4 ¹₁H → ⁴₂He + 2 e⁺ + 2 ν + 26.7 MeV', 1, col.s[7], 700); side('Mass lost per second in the Sun ≈ 4 million tonnes', 3, col.ink); side('(E = Δm c², Sun’s power 3.8 × 10²⁶ W)', 4, col.muted); ball(w * 0.5, cy - 6, col.s[2], 'He', 14); }
  };
  cv.redraw();
  return { step(i) { step = Math.min(i, 4); cv.redraw(); } };
}
