// 8.5 Reaction kinematics. For a + X -> b + Y with X at rest, the non-relativistic Q equation gives the energy of b at
// each angle. Endothermic reactions (Q < 0) open at T_th = -Q (m_b + m_Y)/(m_b + m_Y - m_a); just above threshold
// b comes out only in a forward cone and has two energies at each angle. Masses in u (integers are fine here); Q in MeV.
import { canvas, row, slider, choice, readout, axes, line, dot, text, fmt } from '../../kit.js';

const RX = {
  tpn: ['³H(p,n)³He', 1, 3, 1, 3, -0.764], lipn: ['⁷Li(p,n)⁷Be', 1, 7, 1, 7, -1.644], nap: ['¹⁴N(α,p)¹⁷O', 4, 14, 1, 17, -1.192],
  ddn: ['²H(d,n)³He', 2, 2, 1, 3, 3.269], cdp: ['¹²C(d,p)¹³C', 2, 12, 1, 13, 2.722],
};

export default function (host) {
  const cv = canvas(host, { aspect: 0.66, max: 470, min: 270, label: 'Energy of the outgoing particle against angle from the Q equation' });
  let key = 'lipn', Ta = 1.92;
  const ctl = row(host), out = readout(host);
  const re = () => { cv.redraw(); show(); };
  choice(ctl, 'Reaction', Object.entries(RX).map(([k, v]) => [k, v[0]]), key, (v) => { key = v; const [, ma, , mb, mY, Q] = RX[v]; const th = Q < 0 ? -Q * (mb + mY) / (mb + mY - ma) : 0; sl.set(Math.max(0.05, +(th * 1.05 + 0.01).toFixed(2))); Ta = sl.value; re(); });
  const sl = slider(ctl, { label: 'Beam energy Tₐ (MeV)', min: 0.05, max: 6, step: 0.01, value: Ta, fmt: (v) => fmt(v, 3), oninput: (v) => { Ta = v; re(); } });
  // the two roots of sqrt(Tb) at angle th (degrees)
  const roots = (th) => {
    const [, ma, , mb, mY, Q] = RX[key], c = Math.cos(th * Math.PI / 180), u = Math.sqrt(ma * mb * Ta) * c / (mb + mY);
    const disc = u * u + (mY * Q + (mY - ma) * Ta) / (mb + mY);
    if (disc < 0) return [];
    const r = [u + Math.sqrt(disc), u - Math.sqrt(disc)].filter((x) => x > 0);
    return r.map((x) => x * x);
  };
  const thr = () => { const [, ma, , mb, mY, Q] = RX[key]; return Q < 0 ? -Q * (mb + mY) / (mb + mY - ma) : 0; };
  const show = () => {
    const [n, , , , , Q] = RX[key], t = thr(), r0 = roots(0);
    let cone = 180;
    for (let th = 0; th <= 180; th += 0.25) if (!roots(th).length) { cone = th; break; }
    const two = roots(Math.min(cone, 180) / 2).length === 2;
    out.innerHTML = `${n}: Q = ${Q} MeV. ${Q < 0 ? `Threshold Tₐ = ${fmt(t, 4)} MeV (more than |Q|, because the centre of mass must keep moving).` : 'Exothermic: no threshold.'} ${Ta < t ? 'Below threshold: no reaction.' : `At 0°, T_b = ${r0.map((x) => fmt(x, 3)).join(' and ')} MeV.${cone < 180 ? ` b only comes out within ${fmt(cone, 3)}° of the beam${two ? ', with two energies at each angle' : ''}.` : ''}`}`;
  };
  cv.draw = (ctx, W, H, col) => {
    const pts = { hi: [], lo: [] }; let ymax = 0.5;
    for (let th = 0; th <= 180; th += 0.5) { const r = roots(th); if (r[0] !== undefined) { pts.hi.push([th, r[0]]); ymax = Math.max(ymax, r[0]); } if (r[1] !== undefined) pts.lo.push([th, r[1]]); }
    const ax = axes(ctx, W, H, col, { x: [0, 180], y: [0, ymax * 1.15], xlabel: 'angle of b in the lab (degrees)', ylabel: 'T_b (MeV)', xt: [0, 30, 60, 90, 120, 150, 180], t: 14 });
    line(ctx, pts.hi.map(([x, y]) => [ax.X(x), ax.Y(y)]), col.s[0], 2.6);
    line(ctx, pts.lo.map(([x, y]) => [ax.X(x), ax.Y(y)]), col.s[2], 2.6);
    if (pts.lo.length) text(ctx, 'second (slow) branch', ax.X(pts.lo[Math.floor(pts.lo.length / 3)][0]) + 6, ax.Y(pts.lo[Math.floor(pts.lo.length / 3)][1]) + 12, { color: col.s[2], size: 10.5, halo: col.panel });
    if (!pts.hi.length) text(ctx, 'below threshold: raise the beam energy', ax.X(90), ax.Y(ymax * 0.6), { color: col.muted, size: 12, align: 'center', halo: col.panel });
    else dot(ctx, ax.X(0), ax.Y(pts.hi[0][1]), 4.5, col.ink);
  };
  re();
}
