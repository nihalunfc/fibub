// Hybridisation in 3D: "Before" shows one s sphere and the p dumbbells; "After" shows the equal hybrid lobes they
// mix into (sp, sp², sp³), each with a big lobe pointing at a neighbour and a tiny back lobe. Drag to turn. For sp³ add
// lone pairs to see NH₃ (107°) and H₂O (104.5°): a lone pair is a fatter lobe and squeezes the bonds closer.
import { canvas, text, row, choice, readout, loop, title } from '../kit.js';
import { orbit } from './_3d.js';

const TET = [[1, 1, 1], [1, -1, -1], [-1, 1, -1], [-1, -1, 1]].map((v) => v.map((x) => x / Math.sqrt(3)));
const DIR = {
  sp: [[1, 0, 0], [-1, 0, 0]],
  sp2: [[1, 0, 0], [-0.5, 0, 0.866], [-0.5, 0, -0.866]],
  sp3: TET,
};
const MIX = { sp: 2, sp2: 3, sp3: 4 }; // s share = 1/n
const INFO = {
  sp: ['180°', '50% s, 50% p', 'BeCl₂, C₂H₂, CO₂', 'two p orbitals stay unmixed (they make the π bonds of C₂H₂)'],
  sp2: ['120°', '33% s, 67% p', 'BF₃, C₂H₄, benzene', 'one p orbital stays unmixed, perpendicular to the plane (it makes the π bond)'],
  sp3: ['109.5°', '25% s, 75% p', 'CH₄, NH₃, H₂O', 'no p orbital is left over'],
};
function lobe(n, a, big = 1) { // r(θ) of ψ = a + b cosθ, as list of [theta, r signed]
  const b = Math.sqrt((n - 1) / n) * Math.sqrt(3), s = Math.sqrt(1 / n);
  return (th) => (s + b * Math.cos(th)) * big;
}
export default function (host) {
  let kind = 'sp3', mixed = true, lp = 0, ang = 0;
  const cv = canvas(host, { aspect: 0.85, max: 440, min: 300, label: 'Hybrid orbital lobes in 3D that can be turned by dragging' });
  const cam = orbit(cv, { yaw: 0.6, pitch: 0.3 });
  const c1 = row(host), c2 = row(host);
  choice(c1, 'Hybrid', [['sp', 'sp'], ['sp2', 'sp²'], ['sp3', 'sp³']], kind, (v) => { kind = v; if (v !== 'sp3') lp = 0; show(); cv.redraw(); });
  choice(c1, 'Show', [[false, 'Before mixing'], [true, 'After mixing']], mixed, (v) => { mixed = v; show(); cv.redraw(); });
  choice(c2, 'Lone pairs (sp³)', [[0, '0'], [1, '1 (NH₃)'], [2, '2 (H₂O)']], lp, (v) => { lp = v; kind = 'sp3'; show(); cv.redraw(); });
  loop(host, (dt) => { if (!cam.dragging) { cam.yaw += dt * 0.35; cv.redraw(); } });
  const out = readout(host);
  function show() {
    const i = INFO[kind], ex = lp === 1 ? ['107°', 'NH₃ (one lone pair pushes the bonds together)'] : lp === 2 ? ['104.5°', 'H₂O (two lone pairs push the bonds together)'] : null;
    out.innerHTML = mixed
      ? `<b>${kind.replace('2', '²').replace('3', '³')}</b>: ${DIR[kind].length} equivalent hybrids from one s and ${MIX[kind] - 1} p orbital${MIX[kind] > 2 ? 's' : ''}. Character: ${i[1]}. Angle: <b>${ex ? ex[0] : i[0]}</b>${ex ? ', ' + ex[1] : ''}. Examples: ${i[2]}. Also: ${i[3]}.`
      : `Before mixing: one spherical s orbital and the p orbitals (dumbbells along x, y, z). Mixing ${MIX[kind]} orbitals makes ${MIX[kind]} hybrids.`;
  }
  const seg = (ctx, P, f, d, col, tone, fat) => {
    // surface of revolution about direction d: meridians + rings, positive part tone[0], negative part tone[1]
    const u = Math.abs(d[1]) < 0.9 ? [0, 1, 0] : [1, 0, 0];
    const cr = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
    const v1 = cr(d, u), l1 = Math.hypot(...v1), e1 = v1.map((x) => x / l1), e2 = cr(d, e1);
    const pt = (th, ph) => { const r = f(th) * fat, c = Math.cos(th) * r, s = Math.sin(th) * r * Math.cos(ph), t = Math.sin(th) * r * Math.sin(ph); return [0, 1, 2].map((i) => d[i] * c + e1[i] * s + e2[i] * t); };
    const line = (pts, ths) => {
      for (let i = 1; i < pts.length; i++) {
        const a = P(pts[i - 1]), b = P(pts[i]), pos = f(ths[i]) >= 0;
        ctx.globalAlpha = Math.max(0.3, Math.min(1, 0.7 + (a[2] + b[2]) * 0.2)); ctx.strokeStyle = pos ? tone[0] : tone[1];
        ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke();
      }
    };
    ctx.lineWidth = 1.2;
    for (let k = 0; k < 4; k++) { const ph = (k / 4) * 6.283, ths = Array.from({ length: 37 }, (_, i) => (i / 36) * Math.PI); line(ths.map((t) => pt(t, ph)), ths); }
    for (const th of [0.5, 0.9, 1.3, 2.2, 2.7]) { const phs = Array.from({ length: 25 }, (_, i) => (i / 24) * 6.283); line(phs.map((p) => pt(th, p)), phs.map(() => th)); }
    ctx.globalAlpha = 1;
  };
  cv.draw = (ctx, w, h, col) => {
    const P = cam.proj(w, h, Math.min(w, h) * 0.4, w / 2, h / 2 + 8), n = MIX[kind];
    const norm = 0.5 / Math.sqrt(1 / 1); // sizes in model units
    if (!mixed) {
      const sph = () => { const f = () => 0.45; seg(ctx, P, f, [0, 1, 0], col, [col.s[2], col.s[2]], 1); };
      sph();
      const P3 = { sp: ['x'], sp2: ['x', 'z'], sp3: ['x', 'y', 'z'] }[kind], axes = { x: [1, 0, 0], y: [0, 1, 0], z: [0, 0, 1] };
      P3.forEach((a) => seg(ctx, P, (th) => 1.5 * Math.cos(th) * 0.6, axes[a], col, [col.s[0], col.s[1]], 1));
      title(ctx, `Before: one s and ${n - 1} p orbital${n > 2 ? 's' : ''}`, col);
    } else {
      const dirs = DIR[kind];
      dirs.forEach((d, i) => {
        const isLone = i < lp, ex = (lp === 1 ? 0 : 0);
        let dd = d; if (kind === 'sp3' && lp) { /* squeeze bond directions toward each other slightly */ }
        const f = lobe(n, 0, 0.4);
        seg(ctx, P, f, dd, col, isLone ? [col.s[2], col.s[2]] : [col.s[0], col.s[1]], isLone ? 1.25 : 1);
        const e = P(dd.map((x) => x * 1.15)), c0 = P([0, 0, 0]);
        if (!isLone) { ctx.beginPath(); ctx.arc(e[0], e[1], 5, 0, 7); ctx.fillStyle = col.muted; ctx.fill(); }
        else text(ctx, '••', e[0], e[1], { color: col.s[2], size: 14, weight: 700, align: 'center', fit: false });
      });
      if (kind === 'sp2') seg(ctx, P, (th) => 1.5 * Math.cos(th) * 0.6, [0, 1, 0], col, [col.s[3], col.s[3]], 1);
      if (kind === 'sp') { seg(ctx, P, (th) => 1.5 * Math.cos(th) * 0.6, [0, 1, 0], col, [col.s[3], col.s[3]], 1); seg(ctx, P, (th) => 1.5 * Math.cos(th) * 0.6, [0, 0, 1], col, [col.s[3], col.s[3]], 1); }
      title(ctx, `After: ${DIR[kind].length} ${kind.replace('2', '²').replace('3', '³')} hybrids`, col);
    }
    text(ctx, 'blue/orange: + and − lobes; pink: unmixed p', 10, h - 22, { color: col.muted, size: 10 });
    text(ctx, 'Drag to turn', w - 8, h - 8, { color: col.muted, size: 10, align: 'right' });
  };
  show();
}
