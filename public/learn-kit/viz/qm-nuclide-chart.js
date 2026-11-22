// A chart of nuclides built from the semi-empirical mass formula. Each cell is (N, Z); colour says how that nucleus is
// predicted to decay: stable (valley of stability), β⁻ (too many neutrons), β⁺/EC (too few), α (heavy). Click a cell (or pick an
// example) for its binding energy per nucleon and Q-values. Note the valley bending away from N = Z and the model's limits at magic numbers.
import { canvas, text, title, row, choice, readout, line } from '../kit.js';

const AV = 15.75, AS = 17.8, AC = 0.711, AA = 23.7, AP = 11.18, MD = 0.782, BHE = 28.296;
const Bf = (Z, A) => { if (Z < 0 || A < Z || A < 1) return -1e9; const N = A - Z, d = (Z % 2 === 0 && N % 2 === 0) ? 1 : (Z % 2 && N % 2) ? -1 : 0; return AV * A - AS * Math.pow(A, 2 / 3) - AC * Z * (Z - 1) / Math.cbrt(A) - AA * (A - 2 * Z) ** 2 / A + d * AP / Math.sqrt(A); };
const modeOf = (Z, N) => { const A = Z + N, b = Bf(Z, A), qb = MD + Bf(Z + 1, A) - b, qe = -MD + Bf(Z - 1, A) - b, qa = Z >= 3 && A > 6 ? Bf(Z - 2, A - 4) + BHE - b : -1; if (qb > 0.05 && qb >= qe) return 'b-'; if (qe > 0.05) return 'b+'; if (qa > 0.05) return 'a'; return 's'; };
const REG = { light: ['Light (Z 1–20)', 1, 20, 0, 30], mid: ['Medium (Z 20–60)', 20, 60, 10, 90], heavy: ['Heavy (Z 60–100)', 60, 100, 40, 170] };
const EX = { 'C-14': [6, 8, 'light'], 'Ca-40': [20, 20, 'light'], 'Fe-56': [26, 30, 'mid'], 'Sn-120': [50, 70, 'mid'], 'Pb-208': [82, 126, 'heavy'], 'U-238': [92, 146, 'heavy'] };
const MAGIC = [2, 8, 20, 28, 50, 82, 126];
export default function (host) {
  const cv = canvas(host, { aspect: 1.0, max: 500, min: 380, label: 'Chart of nuclides coloured by predicted decay mode' });
  let reg = 'mid', sel = [26, 30];
  const ctl = row(host), ctl2 = row(host), out = readout(host);
  choice(ctl, 'Region', Object.keys(REG).map((k) => [k, REG[k][0]]), reg, (v) => { reg = v; if (!inReg(sel)) { const [Z, N] = { light: [8, 8], mid: [26, 30], heavy: [82, 126] }[v]; sel = [Z, N]; } show(); });
  choice(ctl2, 'Example', Object.keys(EX).map((k) => [k, k]), '', (k) => { const [Z, N, r] = EX[k]; reg = r; sel = [Z, N]; show(); });
  const inReg = ([Z, N]) => { const r = REG[reg]; return Z >= r[1] && Z <= r[2] && N >= r[3] && N <= r[4]; };
  const geom = (w, h) => { const r = REG[reg], nz = r[2] - r[1] + 1, nn = r[4] - r[3] + 1, L = 34, T = 34, B = 30, Rm = 10, cw = (w - L - Rm) / nn, ch = (h - T - B) / nz; return { r, nz, nn, L, T, cw, ch }; };
  cv.c.addEventListener('click', (e) => { const rc = cv.c.getBoundingClientRect(), g = geom(cv.w, cv.h), x = e.clientX - rc.left, y = e.clientY - rc.top; const N = g.r[3] + Math.floor((x - g.L) / g.cw), Z = g.r[2] - Math.floor((y - g.T) / g.ch); if (Z >= g.r[1] && Z <= g.r[2] && N >= g.r[3] && N <= g.r[4]) { sel = [Z, N]; show(); } });
  const NAMES = { 'b-': 'β⁻ decay (a neutron turns into a proton)', 'b+': 'β⁺ decay or electron capture (a proton turns into a neutron)', a: 'α decay', s: 'stable (against these decays)' };
  function show() {
    const [Z, N] = sel, A = Z + N, b = Bf(Z, A), m = modeOf(Z, N);
    out.innerHTML = `<b>Z = ${Z}, N = ${N}, A = ${A}.</b> SEMF binding energy ${b.toFixed(0)} MeV = <b>${(b / A).toFixed(2)} MeV per nucleon</b>. Q(β⁻) = ${(MD + Bf(Z + 1, A) - b).toFixed(2)} MeV, Q(EC) = ${(-MD + Bf(Z - 1, A) - b).toFixed(2)} MeV, Q(α) = ${(Z >= 3 ? Bf(Z - 2, A - 4) + BHE - b : NaN).toFixed(2)} MeV. Predicted: <b>${NAMES[m]}</b>. ${MAGIC.includes(Z) || MAGIC.includes(N) ? 'Magic number: extra stable in reality (the plain formula does not know shells).' : ''}`;
    cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Chart of nuclides (model)', col);
    const g = geom(w, h), { r } = g, COL = { 's': col.ink, 'b-': col.s[0], 'b+': col.s[1], a: col.s[3] };
    for (let Z = r[1]; Z <= r[2]; Z++) for (let N = r[3]; N <= r[4]; N++) {
      const m = modeOf(Z, N), x = g.L + (N - r[3]) * g.cw, y = g.T + (r[2] - Z) * g.ch;
      if (Bf(Z, Z + N) / (Z + N) < 4) continue;
      ctx.globalAlpha = m === 's' ? 1 : 0.55; ctx.fillStyle = COL[m]; ctx.fillRect(x, y, g.cw + 0.4, g.ch + 0.4);
    }
    ctx.globalAlpha = 1;
    ctx.strokeStyle = col.muted; ctx.lineWidth = 1; ctx.setLineDash([3, 3]);
    MAGIC.forEach((m) => { if (m >= r[3] && m <= r[4]) { const x = g.L + (m - r[3] + 0.5) * g.cw; ctx.beginPath(); ctx.moveTo(x, g.T); ctx.lineTo(x, g.T + g.nz * g.ch); ctx.stroke(); text(ctx, String(m), x, g.T + g.nz * g.ch + 10, { color: col.muted, size: 9, align: 'center' }); } if (m >= r[1] && m <= r[2]) { const y = g.T + (r[2] - m + 0.5) * g.ch; ctx.beginPath(); ctx.moveTo(g.L, y); ctx.lineTo(g.L + g.nn * g.cw, y); ctx.stroke(); text(ctx, String(m), g.L - 4, y, { color: col.muted, size: 9, align: 'right' }); } });
    ctx.setLineDash([]);
    if (inReg(sel)) { const x = g.L + (sel[1] - r[3]) * g.cw, y = g.T + (r[2] - sel[0]) * g.ch; ctx.strokeStyle = col.bg; ctx.lineWidth = 3; ctx.strokeRect(x - 2, y - 2, g.cw + 4, g.ch + 4); ctx.strokeStyle = col.ink; ctx.lineWidth = 1.5; ctx.strokeRect(x - 2, y - 2, g.cw + 4, g.ch + 4); }
    text(ctx, 'neutrons N →', 60, h - 9, { color: col.ink, size: 11, weight: 600, align: 'center' }); text(ctx, 'Z', 8, g.T + 10, { color: col.ink, size: 11, weight: 600 });
    [['stable', 's'], ['β⁻', 'b-'], ['β⁺/EC', 'b+'], ['α (Q>0)', 'a']].forEach(([t, k], i) => { ctx.fillStyle = COL[k]; ctx.globalAlpha = k === 's' ? 1 : 0.55; ctx.fillRect(w - 170 + i * 42, h - 13, 8, 8); ctx.globalAlpha = 1; text(ctx, t, w - 160 + i * 42, h - 9, { color: col.ink, size: 9, fit: false }); });
  };
  show();
}
