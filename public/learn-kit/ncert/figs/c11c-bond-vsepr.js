// Class 11 Chemistry, Chemical Bonding: VSEPR shapes. Choose the number of electron pairs (domains) around the central atom and how many are lone pairs.
// Pairs repel, so the domains spread out as far as possible (2 linear, 3 trigonal planar, 4 tetrahedral, 5 trigonal bipyramidal, 6 octahedral).
// The SHAPE names only the atoms. Lone pairs take more room than bond pairs, so they go to the roomiest spots (equatorial in a bipyramid, trans in an octahedron) and squeeze the bond angles.
import { canvas, text, title, row, slider, readout, loop } from '../../kit.js';

const T = Math.sqrt(1 / 3);
const DIRS = {
  2: [[1, 0, 0], [-1, 0, 0]],
  3: [0, 1, 2].map((i) => [Math.cos(i * 2.0944), Math.sin(i * 2.0944), 0]),
  4: [[T, T, T], [T, -T, -T], [-T, T, -T], [-T, -T, T]],
  5: [[0, 0, 1], [0, 0, -1], [1, 0, 0], [Math.cos(2.0944), Math.sin(2.0944), 0], [Math.cos(4.1888), Math.sin(4.1888), 0]],
  6: [[0, 0, 1], [0, 0, -1], [1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0]],
};
const LP = { 3: [0], 4: [0, 1], 5: [2, 3, 4], 6: [0, 1] };
const SHAPES = {
  '2-0': ['linear', '180°', 'CO₂, BeCl₂'], '3-0': ['trigonal planar', '120°', 'BF₃, SO₃'], '3-1': ['bent', 'about 119°', 'SO₂, O₃'],
  '4-0': ['tetrahedral', '109.5°', 'CH₄, NH₄⁺'], '4-1': ['trigonal pyramidal', 'about 107°', 'NH₃, PCl₃'], '4-2': ['bent', 'about 104.5°', 'H₂O, OF₂'],
  '5-0': ['trigonal bipyramidal', '90° and 120°', 'PCl₅'], '5-1': ['see-saw', 'about 90° and 117°', 'SF₄'], '5-2': ['T-shaped', 'about 87°', 'ClF₃'], '5-3': ['linear', '180°', 'XeF₂, I₃⁻'],
  '6-0': ['octahedral', '90°', 'SF₆'], '6-1': ['square pyramidal', 'about 90°', 'BrF₅'], '6-2': ['square planar', '90°', 'XeF₄'],
};
export default function (host) {
  let N = 4, lp = 1, ang = 0.6;
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 330, label: 'Three dimensional VSEPR shape of a molecule with chosen bond pairs and lone pairs that turns' });
  const ctl = row(host), ro = readout(host);
  const sN = slider(ctl, { label: 'electron pairs around the centre', min: 2, max: 6, step: 1, value: N, fmt: (v) => v.toFixed(0), oninput: (v) => { N = v; fix(); } });
  const sL = slider(ctl, { label: 'of them lone pairs', min: 0, max: 3, step: 1, value: lp, fmt: (v) => v.toFixed(0), oninput: (v) => { lp = v; fix(); } });
  const anim = loop(host, (dt) => { ang += dt * 0.6; cv.redraw(); });
  anim.button(ctl);
  const fix = () => { const mx = { 2: 0, 3: 1, 4: 2, 5: 3, 6: 2 }[N]; if (lp > mx) { lp = mx; sL.set(lp); } const k = `${N}-${lp}`, s = SHAPES[k]; ro.textContent = `${N} pairs, ${lp} lone: shape ${s[0]}, bond angle ${s[1]}. Examples: ${s[2]}.`; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const k = `${N}-${lp}`, s = SHAPES[k]; const t0 = title(ctx, `${N} pairs, ${lp} lone: ${s[0]}`, col);
    const cx = w / 2, cy = t0 + (h - t0) * 0.5, sc = Math.min(w, h - t0) * 0.34, ca = Math.cos(ang), sa = Math.sin(ang), tilt = 0.45, ct = Math.cos(tilt), st = Math.sin(tilt);
    const lpSet = new Set((LP[N] || []).slice(0, lp));
    const P = DIRS[N].map((d, i) => { const x1 = d[0] * ca + d[1] * sa, y1 = -d[0] * sa + d[1] * ca, z1 = d[2]; const y2 = y1 * ct - z1 * st, z2 = y1 * st + z1 * ct; return { i, x: cx + x1 * sc, y: cy - z1 * ct * sc + y1 * st * sc, z: z2, lp: lpSet.has(i) }; });
    P.sort((a, b) => a.z - b.z);
    let centreDrawn = false;
    const drawCentre = () => { ctx.beginPath(); ctx.arc(cx, cy, 13, 0, 7); ctx.fillStyle = col.ink; ctx.fill(); text(ctx, 'A', cx, cy, { color: col.panel, size: 12, weight: 700, align: 'center' }); centreDrawn = true; };
    P.forEach((p) => {
      if (!centreDrawn && p.z > 0) drawCentre();
      const depth = 0.55 + 0.45 * (p.z + 1) / 2;
      ctx.globalAlpha = depth; ctx.lineCap = 'round';
      if (p.lp) {
        ctx.fillStyle = col.s[3]; const a = Math.atan2(p.y - cy, p.x - cx), len = Math.hypot(p.x - cx, p.y - cy); ctx.save(); ctx.translate(cx + (p.x - cx) * 0.55, cy + (p.y - cy) * 0.55); ctx.rotate(a); ctx.beginPath(); ctx.ellipse(0, 0, Math.max(10, len * 0.42), 11, 0, 0, 7); ctx.globalAlpha = depth * 0.4; ctx.fill(); ctx.globalAlpha = depth; ctx.lineWidth = 1.5; ctx.strokeStyle = col.s[3]; ctx.stroke(); ctx.restore();
        text(ctx, 'lp', cx + (p.x - cx) * 0.55, cy + (p.y - cy) * 0.55, { color: col.ink, size: 10, weight: 700, align: 'center' });
      } else {
        ctx.strokeStyle = col.ink; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(p.x, p.y); ctx.stroke();
        ctx.beginPath(); ctx.arc(p.x, p.y, 11, 0, 7); ctx.fillStyle = col.s[0]; ctx.fill(); text(ctx, 'X', p.x, p.y, { color: col.panel, size: 11, weight: 700, align: 'center' });
      }
      ctx.globalAlpha = 1;
    });
    if (!centreDrawn) drawCentre();
    text(ctx, `bond angle ${s[1]}`, w / 2, h - 34, { color: col.s[2], size: 12.5, weight: 700, align: 'center' });
    text(ctx, 'e.g. ' + s[2], w / 2, h - 14, { color: col.muted, size: 11.5, align: 'center' });
  };
  fix();
}
