// Class 12 Chemistry, Coordination Compounds: geometrical (cis/trans, fac/mer) isomers in 3D. Same formula, same bonds, different arrangement in space.
// Square planar MA2B2 and octahedral MA4B2 give cis and trans; octahedral MA3B3 gives facial (three B on one face) and meridional (three B in a line round the middle).
// Cis forms are polar (the B dipoles add); trans MA2B2 and MA4B2 are non-polar (they cancel). Drag to turn the model.
import { canvas, text, title, line, row, choice, readout, loop, touchGuard } from '../../kit.js';

const OCT = [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]], SQ = [[1, 0, 0], [-1, 0, 0], [0, 0, 1], [0, 0, -1]];
const TYPES = {
  sq: { pts: SQ, ex: '[Pt(NH₃)₂Cl₂]', B: [[0, 1], [2, 0]], names: ['trans', 'cis'], idx: [[0, 1], [0, 2]], note: ['trans: the two Pt–Cl dipoles point in opposite directions and cancel, so it is non-polar. It is inactive against cancer.', 'cis: the two Pt–Cl bonds are on the same side, so the molecule is polar. This is cisplatin, a cancer drug (it reacts with DNA).'] },
  o42: { pts: OCT, ex: '[Co(NH₃)₄Cl₂]⁺', names: ['trans (green)', 'cis (violet)'], idx: [[4, 5], [0, 4]], note: ['trans: the two Cl are opposite, on the vertical axis: the dipoles cancel (non-polar).', 'cis: the two Cl are next to each other (90°): polar.'] },
  o33: { pts: OCT, ex: '[Co(NH₃)₃Cl₃]', names: ['fac (facial)', 'mer (meridional)'], idx: [[0, 2, 4], [0, 1, 2]], note: ['fac: three Cl occupy one triangular face of the octahedron; all the Cl–M–Cl angles are 90°.', 'mer: three Cl lie on a meridian: two are trans to each other and one is in between (90° and 180°).'] },
};
export default function (host) {
  let ty = 'o42', iso = 1, ax = 0.7, ay = 0.35, drag = null, auto = true;
  const cv = canvas(host, { aspect: 0.85, max: 440, min: 300, label: 'A 3D model of cis and trans or fac and mer isomers of a complex' });
  const ctl = row(host), ctl2 = row(host), ro = readout(host);
  choice(ctl, 'complex', [['sq', 'MA₂B₂ planar'], ['o42', 'MA₄B₂'], ['o33', 'MA₃B₃']], ty, (v) => { ty = v; go(); });
  choice(ctl2, 'isomer', [[0, 'trans / fac'], [1, 'cis / mer']], iso, (v) => { iso = v; go(); });
  loop(host, (dt) => { if (auto && !drag) { ax += dt * 0.5; cv.redraw(); } });
  const c = cv.c;
  c.addEventListener('pointerdown', (e) => { drag = [e.clientX, e.clientY, ax, ay]; auto = false; c.setPointerCapture(e.pointerId); });
  c.addEventListener('pointermove', (e) => { if (!drag) return; ax = drag[2] + (e.clientX - drag[0]) * 0.012; ay = drag[3] + (e.clientY - drag[1]) * 0.012; cv.redraw(); });
  c.addEventListener('pointerup', () => { drag = null; });
  touchGuard(c, (x, y) => Math.hypot(x - cv.w / 2, y - cv.h * 0.5) < Math.min(cv.w, cv.h) * 0.32);
  const name = () => { const t = TYPES[ty]; if (ty === 'o33') return iso ? t.names[1] : t.names[0]; return t.names[iso]; };
  const go = () => {
    const t = TYPES[ty], k = ty === 'sq' ? (iso ? 1 : 0) : iso;
    ro.textContent = `${t.ex}, ${name()}. ${t.note[k]}`; cv.redraw();
  };
  cv.draw = (ctx, w, h, col) => {
    const t = TYPES[ty], k = ty === 'sq' ? (iso ? 1 : 0) : iso, top = title(ctx, t.ex + ' ' + name().split(' ')[0], col), cx = w / 2, cy = top + (h - top) * 0.5, S = Math.min(w, h - top) * 0.3;
    const P = (p) => { let [x, y, z] = p, co = Math.cos(ax), si = Math.sin(ax); [x, z] = [co * x + si * z, -si * x + co * z]; co = Math.cos(ay); si = Math.sin(ay); [y, z] = [co * y - si * z, si * y + co * z]; const f = 1 / (1 - z * 0.12); return [cx + x * S * f, cy - y * S * f, z]; };
    const pts = t.pts.map(P), m = P([0, 0, 0]), B = new Set(t.idx[k]);
    for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) { const d = Math.hypot(...t.pts[i].map((v, q) => v - t.pts[j][q])); if (d < 1.5) line(ctx, [pts[i], pts[j]], col.line, 1.2); }
    const items = [...pts.map((p, i) => ({ p, i, k: 'L' })), { p: m, k: 'M' }].sort((a, b) => a.p[2] - b.p[2]);
    items.forEach(({ p, k: kind }) => { if (kind === 'L') line(ctx, [m, p], col.muted, 2.5); });
    items.forEach(({ p, i, k: kind }) => {
      const isB = kind === 'L' && B.has(i), r = kind === 'M' ? 14 : 10;
      ctx.fillStyle = kind === 'M' ? col.ink : isB ? col.s[2] : col.s[3]; ctx.strokeStyle = col.panel; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(p[0], p[1], r, 0, 7); ctx.fill(); ctx.stroke();
      text(ctx, kind === 'M' ? 'M' : isB ? 'B' : 'A', p[0], p[1], { color: col.panel, size: 11, weight: 700, align: 'center' });
    });
    text(ctx, 'A = NH₃ (blue)   B = Cl (green)', w / 2, h - 12, { color: col.muted, size: 11, align: 'center' });
  };
  go();
}
