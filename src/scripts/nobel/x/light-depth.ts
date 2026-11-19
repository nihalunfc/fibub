// How far does light get into the brain? Photons leave an optical fibre and scatter and get absorbed in tissue.
// Blue light (for ChR2) fades within a fraction of a millimetre; red light goes several times deeper, which is
// why red-shifted opsins matter for deep targets and through-the-skull use.
import { stage, clear, text, dot, line, rng, gauss, type Stage } from '../kit';

// Effective attenuation lengths in brain tissue (mm), rounded orders of magnitude for illustration only.
const COL: [string, string, number, number][] = [['473', 'Blue 473 nm', 0.35, 0], ['593', 'Yellow 593 nm', 0.6, 0], ['635', 'Red 635 nm', 1.0, 0]];

export default function (el: HTMLElement) {
  const s: Stage = stage(el, { tag: 'Watch: light in tissue', title: 'Send light from a fibre into brain tissue', h: 360, alt: 'Photons leave a fibre tip at the top and random-walk downward through tissue; a depth scale shows where intensity falls to 10 percent for blue, yellow and red.', caption: 'Each photon takes random steps (scattering) and can be absorbed. The fade lengths used (blue ≈ 0.35 mm, yellow ≈ 0.6 mm, red ≈ 1 mm) are rounded, illustrative values; real values depend on the tissue and on how they are measured.' });
  const r = rng(17);
  let which = '473';
  const ps: { x: number; y: number; alive: boolean }[] = [];
  s.choice(COL.map(([id, t]) => [id, t]), which, (v) => { which = v; ps.length = 0; });
  const MM = 120; // pixels per mm
  s.play((dt) => {
    const L = COL.find((c) => c[0] === which)![2];
    for (let i = 0; i < 6; i++) ps.push({ x: s.W / 2 + gauss(r) * 6, y: 40, alive: true });
    for (const p of ps) { if (!p.alive) continue; p.x += gauss(r) * 5; p.y += 2 + gauss(r) * 4; if (r() < (dt * 60 * 2) / (L * MM)) p.alive = false; }
    while (ps.length > 1600) ps.shift();
    clear(s); const c = s.col;
    const nmv = +which, colr = nmv < 500 ? c.blue : nmv < 610 ? c.amber : c.bad;
    s.c.fillStyle = c.soft; s.c.fillRect(0, 40, s.W, s.H - 40);
    s.c.fillStyle = c.muted; s.c.fillRect(s.W / 2 - 6, 0, 12, 40);
    for (const p of ps) if (p.alive) dot(s, p.x, p.y, 1.8, colr, 0.8);
    for (let mm = 0; mm <= 2.5; mm += 0.5) { const y = 40 + mm * MM; line(s, [[20, y], [40, y]], c.muted, 1); text(s, `${mm} mm`, 44, y + 4, { size: 11, colour: c.muted }); }
    const d10 = L * Math.log(10);
    line(s, [[60, 40 + d10 * MM], [s.W - 20, 40 + d10 * MM]], colr, 1.5, [6, 4]);
    text(s, `10% of the light left at ≈ ${d10.toFixed(1)} mm`, s.W - 24, 40 + d10 * MM - 6, { align: 'right', size: 12, colour: colr, bold: true });
    s.mark();
  });
  s.out('Light fades roughly exponentially with depth: I = I₀·e^(−d/L), the same law as the Beer–Lambert calculator uses. With L ≈ 0.35 mm, blue light falls to 10% in under a millimetre, which is why experiments slide a thin fibre right next to the cells, and why red-light opsins and bright, focused light are used for deeper targets.');
}
