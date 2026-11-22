// The Eightfold Way: hadrons laid out by isospin I₃ (across) and strangeness-linked hypercharge Y (up) fall into neat
// SU(3) patterns: baryon octet, baryon decuplet, meson octet. Tap a particle for its quark content, charge Q = I₃ + Y/2 and mass.
// Notice the decuplet's equally spaced rows: Gell-Mann used that to predict the Ω⁻ (sss) before it was found in 1964.
import { canvas, text, title, row, choice, readout, line, dot } from '../kit.js';

const FAM = {
  oct: ['Baryon octet (spin ½)', [['p', 'uud', .5, 1, 938], ['n', 'udd', -.5, 1, 940], ['Σ⁺', 'uus', 1, 0, 1189], ['Σ⁰', 'uds', 0, 0, 1193], ['Λ', 'uds', 0, 0, 1116], ['Σ⁻', 'dds', -1, 0, 1197], ['Ξ⁰', 'uss', .5, -1, 1315], ['Ξ⁻', 'dss', -.5, -1, 1322]]],
  dec: ['Baryon decuplet (spin 3/2)', [['Δ⁻', 'ddd', -1.5, 1, 1232], ['Δ⁰', 'udd', -.5, 1, 1232], ['Δ⁺', 'uud', .5, 1, 1232], ['Δ⁺⁺', 'uuu', 1.5, 1, 1232], ['Σ*⁻', 'dds', -1, 0, 1387], ['Σ*⁰', 'uds', 0, 0, 1384], ['Σ*⁺', 'uus', 1, 0, 1383], ['Ξ*⁻', 'dss', -.5, -1, 1535], ['Ξ*⁰', 'uss', .5, -1, 1532], ['Ω⁻', 'sss', 0, -2, 1672]]],
  mes: ['Meson octet (spin 0)', [['π⁻', 'dū', -1, 0, 140], ['π⁰', 'uū − dd̄', 0, 0, 135], ['π⁺', 'ud̄', 1, 0, 140], ['K⁰', 'ds̄', -.5, 1, 498], ['K⁺', 'us̄', .5, 1, 494], ['K⁻', 'sū', -.5, -1, 494], ['K̄⁰', 'sd̄', .5, -1, 498], ['η', 'uū + dd̄ − 2ss̄', 0, 0, 548]]],
};
export default function (host) {
  const cv = canvas(host, { aspect: 0.85, max: 440, min: 340, label: 'Particle multiplet laid out by isospin and hypercharge' });
  let fam = 'dec', sel = 'Ω⁻';
  const ctl = row(host), ctl2 = row(host), out = readout(host);
  choice(ctl, 'Family', Object.keys(FAM).map((k) => [k, FAM[k][0]]), fam, (v) => { fam = v; sel = FAM[v][1][0][0]; show(); });
  let pg; const build = () => { ctl2.innerHTML = ''; choice(ctl2, 'Particle', FAM[fam][1].map((p) => [p[0], p[0]]), sel, (v) => { sel = v; show(); }); };
  const pos = (g, p) => { const same = FAM[fam][1].filter((q) => q[2] === p[2] && q[3] === p[3]); const i = same.indexOf(p); return [g.X(p[2]) + (same.length > 1 ? (i - (same.length - 1) / 2) * 38 : 0), g.Y(p[3])]; };
  const geo = (w, h) => { const sx = (w - 70) / 4.4, sy = (h - 110) / 3.6, cx = w / 2, cy = h * 0.2; return { X: (i3) => cx + i3 * sx * (fam === 'dec' ? 1 : 1.25), Y: (y) => cy + (1 - y) * sy + 18 }; };
  cv.c.addEventListener('click', (e) => { const rc = cv.c.getBoundingClientRect(), g = geo(cv.w, cv.h), x = e.clientX - rc.left, y = e.clientY - rc.top; let best = null, bd = 28; FAM[fam][1].forEach((p) => { const d = Math.hypot(pos(g, p)[0] - x, pos(g, p)[1] - y); if (d < bd) { bd = d; best = p[0]; } }); if (best) { sel = best; build(); show(); } });
  function show() {
    build();
    const p = FAM[fam][1].find((q) => q[0] === sel), Q = p[2] + p[3] / 2;
    out.innerHTML = `<b>${p[0]}</b> = ${p[1]}. I₃ = ${p[2]}, Y = ${p[3]}, so Q = I₃ + Y/2 = <b>${Q}</b>. ${fam === 'mes' ? 'Strangeness S = Y' : 'Strangeness S = Y − 1'} = <b>${fam === 'mes' ? p[3] : p[3] - 1}</b> (number of s quarks, counted negative). Mass ≈ ${p[4]} MeV/c². ${fam === 'dec' ? 'Rows 1232, 1385, 1530, 1672 MeV are spaced ~150 MeV: the Ω⁻ was predicted from this.' : ''}`;
    cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, FAM[fam][0], col);
    const g = geo(w, h), list = FAM[fam][1];
    // grid
    ctx.strokeStyle = col.line; ctx.lineWidth = 1;
    [-2, -1, 0, 1].forEach((y) => { ctx.beginPath(); ctx.moveTo(14, g.Y(y)); ctx.lineTo(w - 10, g.Y(y)); ctx.stroke(); text(ctx, 'Y=' + y, 14, g.Y(y) - 7, { color: col.muted, size: 9, fit: false }); });
    // charge diagonals: Q = I3 + Y/2 -> I3 = Q - Y/2
    ctx.strokeStyle = col.muted; ctx.globalAlpha = 0.5; ctx.setLineDash([2, 4]);
    [-1, 0, 1, 2].forEach((Q) => { ctx.beginPath(); ctx.moveTo(g.X(Q + 0.6), g.Y(-1.2)); ctx.lineTo(g.X(Q - 0.5 * 1.2), g.Y(1.2)); ctx.stroke(); text(ctx, 'Q=' + Q, g.X(Q - 0.5 * 1.2), g.Y(1.2) - 8, { color: col.muted, size: 9, align: 'center', fit: false }); });
    ctx.setLineDash([]); ctx.globalAlpha = 1;
    // hexagon outline for octets
    list.forEach((p) => { const [x, y] = pos(g, p), on = p[0] === sel; ctx.beginPath(); ctx.arc(x, y, on ? 17 : 14, 0, 7); ctx.fillStyle = on ? col.s[1] : col.bg; ctx.fill(); ctx.lineWidth = on ? 3 : 1.6; ctx.strokeStyle = on ? col.ink : col.s[0]; ctx.stroke(); text(ctx, p[0], x, y, { color: on ? col.bg : col.ink, size: 12, weight: 700, align: 'center' }); text(ctx, String(p[4]), x, y + 24, { color: col.muted, size: 8.5, align: 'center', fit: false }); });
    text(ctx, 'isospin I₃ →', w / 2, h - 8, { color: col.muted, size: 10.5, align: 'center' });
  };
  show();
}
