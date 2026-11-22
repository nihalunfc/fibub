// Class 12 Chemistry, Coordination Compounds: the common shapes of complexes in 3D. Coordination number 2 is linear (sp), 4 is tetrahedral (sp3) or square planar (dsp2),
// 6 is octahedral (d2sp3 or sp3d2). Drag to turn the model; it also turns by itself. Ligand donor atoms sit at the corners, the metal ion at the centre.
import { canvas, text, title, line, row, choice, readout, loop, touchGuard } from '../../kit.js';

const T = 1 / Math.sqrt(3), OCT = [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]];
const SH = {
  lin: { name: 'linear', cn: 2, ex: '[Ag(NH₃)₂]⁺', hyb: 'sp', ang: '180°', pts: [[1, 0, 0], [-1, 0, 0]], max: 0 },
  tet: { name: 'tetrahedral', cn: 4, ex: '[NiCl₄]²⁻, [Zn(NH₃)₄]²⁺', hyb: 'sp³', ang: '109.5°', pts: [[T, T, T], [T, -T, -T], [-T, T, -T], [-T, -T, T]], max: 2 },
  sq: { name: 'square planar', cn: 4, ex: '[Ni(CN)₄]²⁻, [PtCl₄]²⁻, cisplatin', hyb: 'dsp²', ang: '90°', pts: [[1, 0, 0], [-1, 0, 0], [0, 0, 1], [0, 0, -1]], max: 1.5 },
  oct: { name: 'octahedral', cn: 6, ex: '[Co(NH₃)₆]³⁺, [Fe(CN)₆]⁴⁻, [FeF₆]³⁻', hyb: 'd²sp³ (inner) or sp³d² (outer)', ang: '90°', pts: OCT, max: 1.5 },
};
export default function (host) {
  let key = 'oct', ax = 0.7, ay = 0.35, drag = null, auto = true;
  const cv = canvas(host, { aspect: 0.85, max: 440, min: 300, label: 'A rotating 3D model of a complex with the chosen shape' });
  const ctl = row(host), ro = readout(host);
  choice(ctl, 'shape', [['lin', 'CN 2'], ['tet', 'CN 4 tetra'], ['sq', 'CN 4 planar'], ['oct', 'CN 6']], key, (v) => { key = v; go(); });
  loop(host, (dt) => { if (auto && !drag) { ax += dt * 0.5; cv.redraw(); } });
  const c = cv.c;
  c.addEventListener('pointerdown', (e) => { drag = [e.clientX, e.clientY, ax, ay]; auto = false; c.setPointerCapture(e.pointerId); });
  c.addEventListener('pointermove', (e) => { if (!drag) return; ax = drag[2] + (e.clientX - drag[0]) * 0.012; ay = drag[3] + (e.clientY - drag[1]) * 0.012; cv.redraw(); });
  c.addEventListener('pointerup', () => { drag = null; });
  touchGuard(c, (x, y) => Math.hypot(x - cv.w / 2, y - cv.h * 0.5) < Math.min(cv.w, cv.h) * 0.32);
  const go = () => { const s = SH[key]; ro.textContent = `${s.name}: coordination number ${s.cn}, ${s.hyb}, angle between ligands ${s.ang}. Examples: ${s.ex}.`; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, SH[key].name + ' (drag to turn)', col), s = SH[key], cx = w / 2, cy = top + (h - top) * 0.5, S = Math.min(w, h - top) * 0.3;
    const P = (p) => { let [x, y, z] = p, co = Math.cos(ax), si = Math.sin(ax); [x, z] = [co * x + si * z, -si * x + co * z]; co = Math.cos(ay); si = Math.sin(ay); [y, z] = [co * y - si * z, si * y + co * z]; const f = 1 / (1 - z * 0.12); return [cx + x * S * f, cy - y * S * f, z]; };
    const pts = s.pts.map(P), m = P([0, 0, 0]);
    if (s.max) for (let i = 0; i < s.pts.length; i++) for (let j = i + 1; j < s.pts.length; j++) { const d = Math.hypot(...s.pts[i].map((v, k) => v - s.pts[j][k])); if (d < s.max + 0.01 && (key !== 'tet' || true)) line(ctx, [pts[i], pts[j]], col.line, 1.5); }
    const items = [...pts.map((p, i) => ({ p, k: 'L', i })), { p: m, k: 'M' }].sort((a, b) => a.p[2] - b.p[2]);
    items.forEach(({ p, k }) => {
      if (k === 'L') { line(ctx, [m, p], col.muted, 2.5); }
    });
    items.forEach(({ p, k }) => {
      const r = k === 'M' ? 14 : 9; ctx.fillStyle = k === 'M' ? col.s[0] : col.s[2]; ctx.strokeStyle = col.panel; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(p[0], p[1], r, 0, 7); ctx.fill(); ctx.stroke();
      text(ctx, k === 'M' ? 'M' : 'L', p[0], p[1], { color: col.panel, size: 11, weight: 700, align: 'center' });
    });
  };
  go();
}
