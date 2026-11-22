// Point defects in a 2D crystal. Choose a defect and see how the lattice around it relaxes (the atoms are shown at their real,
// displaced positions and jiggle with heat). Metal: vacancy, self-interstitial, big or small substitutional atom.
// Ionic crystal: Schottky pair (a missing cation and anion) and Frenkel pair (an ion moved to an interstitial site).
// With the vacancy chosen, press Play to watch it diffuse: neighbours hop in, so the hole walks through the crystal.
import { canvas, line, dot, text, row, choice, button, readout, loop, title, rng, arrow, ease } from '../kit.js';

const C = 11, Rw = 8;
const KINDS = {
  perfect: ['Perfect', false], vac: ['Vacancy', false], int: ['Interstitial', false], big: ['Big impurity', false], small: ['Small impurity', false], sch: ['Schottky pair (ionic)', true], fre: ['Frenkel pair (ionic)', true],
};
const NOTE = {
  perfect: 'Every site filled: the perfect lattice.',
  vac: 'A vacancy: one atom missing. Its neighbours relax slightly towards the hole. Vacancies are always present in equilibrium (n/N = e^(−E_f/kT)) and let atoms diffuse.',
  int: 'A self-interstitial: an extra atom squeezed between lattice sites. It costs a lot of strain energy, so it is far rarer than a vacancy.',
  big: 'A substitutional impurity bigger than the host: neighbours are pushed away (compressive strain). It hardens the metal because it blocks dislocations.',
  small: 'A substitutional impurity smaller than the host: neighbours lean in (tensile strain).',
  sch: 'Schottky defect: a cation and an anion are both missing, so the crystal stays neutral. Common in NaCl and KCl; it lowers the density.',
  fre: 'Frenkel defect: a small cation leaves its site for an interstitial position, leaving a vacancy, so the density is unchanged. Common in AgBr and ZnS.',
};
export default function (host) {
  let kind = 'vac', hole = [5, 4], mv = null, tm = 0;
  const R = rng(4);
  const cv = canvas(host, { aspect: 0.82, max: 380, min: 280, label: 'A 2D crystal lattice with a chosen point defect' });
  const ctl = row(host);
  choice(ctl, 'Defect', Object.entries(KINDS).map(([k, v]) => [k, v[0]]), kind, (v) => { kind = v; hole = [5, 4]; mv = null; show(); });
  const ctl2 = row(host);
  loop(host, (dt) => { tm += dt; if (kind === 'vac') { if (mv) { mv.t += dt * 2.2; if (mv.t >= 1) { hole = [mv.from[0], mv.from[1]]; mv = null; } } else if (R() < dt * 1.2) { const d = [[1, 0], [-1, 0], [0, 1], [0, -1]][Math.floor(R() * 4)], a = [hole[0] + d[0], hole[1] + d[1]]; if (a[0] >= 1 && a[0] < C - 1 && a[1] >= 1 && a[1] < Rw - 1) mv = { from: a, to: hole, t: 0 }; } } cv.redraw(); }, { autoplay: false }).button(ctl2);
  const out = readout(host);
  function show() { out.innerHTML = `<b>${KINDS[kind][0]}.</b> ${NOTE[kind]}${kind === 'vac' ? ' Play: the vacancy hops by one atom jumping in (an activated process, faster when hot).' : ''}`; queueMicrotask(() => cv.redraw()); }
  cv.draw = (ctx, w, h, col) => {
    const a = Math.min((w - 30) / (C - 1), (h - 84) / (Rw - 1)), x0 = (w - a * (C - 1)) / 2, y0 = 50, ionic = KINDS[kind][1];
    const cx = 5, cy = 4, atoms = [];
    for (let i = 0; i < C; i++) for (let j = 0; j < Rw; j++) {
      let sp = ionic ? ((i + j) % 2 ? 'c' : 'a') : 'm', skip = false, pos = [i, j];
      if (kind === 'vac' && i === hole[0] && j === hole[1]) skip = true;
      if (kind === 'sch' && ((i === cx && j === cy) || (i === cx + 3 && j === cy))) skip = true;
            if (kind === 'fre' && i === cx && j === cy) skip = true;
      if (kind === 'big' && i === cx && j === cy) sp = 'big';
      if (kind === 'small' && i === cx && j === cy) sp = 'small';
      if (!skip) atoms.push({ i, j, sp, p: pos });
    }
    if (kind === 'int') atoms.push({ i: cx + 0.5, j: cy + 0.5, sp: 'int', p: [cx + 0.5, cy + 0.5] });
    if (kind === 'fre') atoms.push({ i: cx + 1.5, j: cy - 0.5, sp: 'cat2', p: [cx + 1.5, cy - 0.5] });
    // centre of the defect and strain direction
    const dc = kind === 'vac' ? [hole[0], hole[1]] : kind === 'sch' ? [cx + 1.5, cy] : kind === 'fre' ? [cx + 0.75, cy - 0.25] : [cx + (kind === 'int' ? 0.5 : 0), cy + (kind === 'int' ? 0.5 : 0)];
    const s = { vac: -0.28, int: 0.5, big: 0.4, small: -0.35, sch: -0.2, fre: 0.15, perfect: 0 }[kind];
    const draw = [];
    atoms.forEach((q) => {
      let dx = q.i - dc[0], dy = q.j - dc[1], r2 = dx * dx + dy * dy;
      let ux = 0, uy = 0;
      if (r2 > 0.01 && s && q.sp !== 'cat2' && !(kind === 'vac' && mv)) { const f = (s * 0.5) / Math.max(r2, 0.6); ux = f * dx; uy = f * dy; }
      let px = q.i + ux + Math.sin(tm * 3 + q.i * 2.1 + q.j * 1.3) * 0.03, py = q.j + uy + Math.cos(tm * 3.3 + q.j * 1.7 + q.i) * 0.03;
      if (mv && q.i === mv.from[0] && q.j === mv.from[1]) { const e = ease(Math.min(1, mv.t)); px = q.i + (mv.to[0] - mv.from[0]) * e; py = q.j + (mv.to[1] - mv.from[1]) * e; }
      draw.push({ q, x: x0 + px * a, y: y0 + py * a });
    });
    // lattice sites of the empty spots
    const holes = [];
    if (kind === 'vac') holes.push(mv ? mv.from : hole);
    if (kind === 'sch') holes.push([cx, cy], [cx + 3, cy]);
    if (kind === 'fre') holes.push([cx, cy]);
    holes.forEach(([i, j]) => { ctx.setLineDash([3, 3]); ctx.strokeStyle = col.s[5]; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(x0 + i * a, y0 + j * a, a * 0.28, 0, 7); ctx.stroke(); ctx.setLineDash([]); });
    // grid lines between neighbours (faint)
    ctx.strokeStyle = col.line; ctx.lineWidth = 1; for (let j = 0; j < Rw; j++) { ctx.beginPath(); ctx.moveTo(x0, y0 + j * a); ctx.lineTo(x0 + (C - 1) * a, y0 + j * a); ctx.stroke(); } for (let i = 0; i < C; i++) { ctx.beginPath(); ctx.moveTo(x0 + i * a, y0); ctx.lineTo(x0 + i * a, y0 + (Rw - 1) * a); ctx.stroke(); }
    draw.forEach(({ q, x, y }) => {
      const c = q.sp === 'm' ? col.s[0] : q.sp === 'c' || q.sp === 'cat2' ? col.s[1] : q.sp === 'a' ? col.s[2] : q.sp === 'int' ? col.s[3] : col.s[5];
      const r = q.sp === 'big' ? 0.4 : q.sp === 'small' ? 0.2 : q.sp === 'a' ? 0.32 : q.sp === 'c' || q.sp === 'cat2' ? 0.22 : q.sp === 'int' ? 0.22 : 0.3;
      dot(ctx, x, y, r * a, c, q.sp === 'int' || q.sp === 'cat2' || q.sp === 'big' || q.sp === 'small' ? col.ink : col.panel);
    });
    if (kind === 'fre') arrow(ctx, x0 + cx * a + 6, y0 + cy * a - 6, x0 + (cx + 1.4) * a, y0 + (cy - 0.5) * a + 2, col.s[1], 1.5, 6);
    title(ctx, KINDS[kind][0], col);
    const leg = ionic ? [['cation', col.s[1]], ['anion', col.s[2]]] : [['host atom', col.s[0]]];
    leg.forEach(([n, c], i) => { dot(ctx, 16 + i * 80, h - 14, 5, c); text(ctx, n, 26 + i * 80, h - 14, { color: col.muted, size: 10.5 }); });
    if (holes.length) { ctx.setLineDash([3, 3]); ctx.strokeStyle = col.s[5]; ctx.beginPath(); ctx.arc(w - 100, h - 14, 5, 0, 7); ctx.stroke(); ctx.setLineDash([]); text(ctx, 'empty site', w - 90, h - 14, { color: col.muted, size: 10.5 }); }
  };
  show();
}
