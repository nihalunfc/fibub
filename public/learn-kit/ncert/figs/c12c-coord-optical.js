// Class 12 Chemistry, Coordination Compounds: optical isomers of [M(AA)3], for example [Co(en)3]3+. Each AA is a bidentate ligand (an arc joining two neighbouring corners of the octahedron).
// The left model and the right model are mirror images. Turn the left one with the slider: however you turn it, it never matches the right one, so they are a pair of enantiomers
// that rotate plane-polarised light in opposite directions. (Check done in code: none of the 24 rotations of the octahedron maps one arrangement on the other.)
import { canvas, text, title, row, slider, readout, loop, touchGuard } from '../../kit.js';

const PAIRS = [[[1, 0, 0], [0, 1, 0]], [[-1, 0, 0], [0, 0, 1]], [[0, -1, 0], [0, 0, -1]]];
export default function (host) {
  let ax = 0.5, ay = 0.3, turn = 0, drag = null, auto = true;
  const cv = canvas(host, { aspect: 0.62, max: 440, min: 260, label: 'Two mirror-image tris-chelate complexes that cannot be superimposed' });
  const ctl = row(host), ro = readout(host);
  slider(ctl, { label: 'turn the left copy (degrees)', min: 0, max: 360, step: 5, value: 0, fmt: (v) => v.toFixed(0) + '°', oninput: (v) => { turn = v * Math.PI / 180; go(); } });
  loop(host, (dt) => { if (auto && !drag) { ax += dt * 0.5; cv.redraw(); } });
  const c = cv.c;
  c.addEventListener('pointerdown', (e) => { drag = [e.clientX, e.clientY, ax, ay]; auto = false; c.setPointerCapture(e.pointerId); });
  c.addEventListener('pointermove', (e) => { if (!drag) return; ax = drag[2] + (e.clientX - drag[0]) * 0.012; ay = drag[3] + (e.clientY - drag[1]) * 0.012; cv.redraw(); });
  c.addEventListener('pointerup', () => { drag = null; });
  touchGuard(c, () => true);
  const go = () => { ro.textContent = `Left copy turned ${(turn * 180 / Math.PI).toFixed(0)}° about its vertical axis and the whole picture turning by itself: look for a position where the left matches the right. There is none. The two forms of [Co(en)₃]³⁺ (named Δ and Λ) are non-superimposable mirror images, so the ion is chiral.`; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Mirror-image complexes', col), S = Math.min(w / 4.4, (h - top) * 0.3), cy = top + (h - top) * 0.52;
    const draw = (cx, mir, extra) => {
      const P = (p) => { let [x, y, z] = [mir ? -p[0] : p[0], p[1], p[2]], co = Math.cos(ax + extra), si = Math.sin(ax + extra); [x, z] = [co * x + si * z, -si * x + co * z]; co = Math.cos(ay); si = Math.sin(ay); [y, z] = [co * y - si * z, si * y + co * z]; const f = 1 / (1 - z * 0.12); return [cx + x * S * f, cy - y * S * f, z]; };
      const m = P([0, 0, 0]), items = [];
      PAIRS.forEach(([a, b]) => { const pa = P(a), pb = P(b), mid = P([(a[0] + b[0]) * 0.95, (a[1] + b[1]) * 0.95, (a[2] + b[2]) * 0.95]); items.push({ z: mid[2], draw: () => { ctx.strokeStyle = col.s[0]; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(pa[0], pa[1]); ctx.quadraticCurveTo(2 * mid[0] - (pa[0] + pb[0]) / 2, 2 * mid[1] - (pa[1] + pb[1]) / 2, pb[0], pb[1]); ctx.stroke(); } }); items.push({ z: pa[2], draw: () => { ctx.fillStyle = col.s[3]; ctx.strokeStyle = col.panel; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(pa[0], pa[1], 6.5, 0, 7); ctx.fill(); ctx.stroke(); } }); items.push({ z: pb[2], draw: () => { ctx.fillStyle = col.s[3]; ctx.strokeStyle = col.panel; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(pb[0], pb[1], 6.5, 0, 7); ctx.fill(); ctx.stroke(); } }); });
      items.push({ z: m[2], draw: () => { ctx.fillStyle = col.ink; ctx.beginPath(); ctx.arc(m[0], m[1], 10, 0, 7); ctx.fill(); text(ctx, 'M', m[0], m[1], { color: col.panel, size: 10, weight: 700, align: 'center' }); } });
      items.sort((p, q) => p.z - q.z).forEach((i) => i.draw());
    };
    draw(w * 0.25, false, turn); draw(w * 0.75, true, 0);
    ctx.strokeStyle = col.muted; ctx.setLineDash([4, 4]); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(w / 2, top + 10); ctx.lineTo(w / 2, h - 28); ctx.stroke(); ctx.setLineDash([]);
    text(ctx, 'mirror', w / 2, h - 14, { color: col.muted, size: 11, align: 'center' });
    text(ctx, 'left form', w * 0.25, h - 14, { color: col.ink, size: 12, weight: 700, align: 'center' }); text(ctx, 'mirror image', w * 0.75, h - 14, { color: col.ink, size: 12, weight: 700, align: 'center' });
  };
  go();
}
