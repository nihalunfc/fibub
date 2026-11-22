// How particles fill energy levels. Eight equally spaced levels, N particles, temperature T. Choose the rule: classical
// (Boltzmann, distinguishable, any number per level), fermions (at most one per level, so they stack up like electrons) or
// bosons (any number, and they pile into the lowest level when cold). Bar length is the average number in each level.
// At high T all three look alike; at low T they differ completely. Log view: Boltzmann is a straight line.
import { canvas, text, title, row, slider, choice, readout } from '../kit.js';

const NL = 8;
function occ(kind, T, N) {
  const E = Array.from({ length: NL }, (_, i) => i);
  if (kind === 'cl') { const w = E.map((e) => Math.exp(-e / T)), Z = w.reduce((a, b) => a + b, 0); return { n: w.map((x) => (N * x) / Z), mu: -T * Math.log(Z / N) }; }
  const f = (mu) => E.map((e) => { const x = (e - mu) / T; return kind === 'fd' ? 1 / (Math.exp(Math.min(x, 600)) + 1) : 1 / (Math.exp(Math.min(x, 600)) - 1); });
  let lo = kind === 'fd' ? -40 : -60, hi = kind === 'fd' ? 40 : -1e-9;
  const tot = (mu) => f(mu).reduce((a, b) => a + b, 0);
  for (let i = 0; i < 200; i++) { const m = (lo + hi) / 2; tot(m) < N ? (lo = m) : (hi = m); }
  const mu = (lo + hi) / 2; return { n: f(mu), mu };
}
export default function (host) {
  let kind = 'fd', T = 1, N = 4, lg = false;
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 300, label: 'Average number of particles in each of eight energy levels for classical, fermion and boson rules' });
  const ctl = row(host), c2 = row(host);
  choice(ctl, 'Rule', [['cl', 'Classical'], ['fd', 'Fermions'], ['be', 'Bosons']], kind, (v) => { kind = v; upd(); });
  choice(ctl, 'Scale', [[false, 'Linear'], [true, 'Log']], lg, (v) => { lg = v; upd(); });
  slider(c2, { label: 'Temperature kT/ε', min: 0.05, max: 6, value: T, log: true, fmt: (v) => v.toFixed(2), oninput: (v) => { T = v; upd(); } });
  slider(c2, { label: 'Particles N', min: 1, max: 7, step: 1, value: N, fmt: (v) => `${v}`, oninput: (v) => { N = v; upd(); } });
  const out = readout(host);
  function upd() {
    const o = occ(kind, T, N), E = o.n.reduce((s, x, i) => s + x * i, 0);
    out.innerHTML = `${{ cl: 'Classical (Boltzmann): n ∝ e<sup>−E/kT</sup>.', fd: 'Fermi–Dirac: n = 1/(e<sup>(E−μ)/kT</sup> + 1), never above 1 (Pauli).', be: 'Bose–Einstein: n = 1/(e<sup>(E−μ)/kT</sup> − 1), no limit.' }[kind]} Chemical potential μ = ${o.mu.toFixed(2)} ε. Ground level holds <b>${o.n[0].toFixed(2)}</b>, total energy ⟨E⟩ = <b>${E.toFixed(2)} ε</b>. ${T < 0.2 ? (kind === 'fd' ? 'Nearly frozen: the lowest N levels are full (one each), so E ≠ 0 even at T → 0.' : 'Nearly frozen: everything sits in the ground level.') : T > 3 ? 'Hot: the occupations of all three rules are nearly alike.' : ''}`;
    cv.redraw();
  };
  cv.draw = (ctx, w, h, col) => {
    const o = occ(kind, T, N); title(ctx, `${{ cl: 'Classical', fd: 'Fermions', be: 'Bosons' }[kind]}: N = ${N}, kT = ${T.toFixed(2)} ε`, col);
    const x0 = 56, x1 = w - 44, bh = (h - 70) / NL, mx = Math.max(1, N);
    const scale = (n) => lg ? Math.min(1, Math.max(0, (Math.log10(Math.max(n, 1e-4)) + 4) / (Math.log10(mx * 1.2) + 4))) : Math.min(1, n / (Math.max(...o.n, 1) * 1.1));
    for (let i = 0; i < NL; i++) {
      const y = h - 24 - (i + 1) * bh + 4;
      ctx.strokeStyle = col.line; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x0 - 6, y + bh * 0.8); ctx.lineTo(x1, y + bh * 0.8); ctx.stroke();
      ctx.fillStyle = kind === 'cl' ? col.s[0] : kind === 'fd' ? col.s[2] : col.s[3]; ctx.globalAlpha = 0.8; ctx.fillRect(x0, y + 2, (x1 - x0) * scale(o.n[i]), bh * 0.7); ctx.globalAlpha = 1;
      text(ctx, `E = ${i}ε`, 8, y + bh * 0.45, { color: col.muted, size: 10.5 });
      text(ctx, o.n[i] < 0.005 ? '0' : o.n[i] < 10 ? o.n[i].toFixed(2) : o.n[i].toFixed(1), x0 + 4 + (x1 - x0) * scale(o.n[i]), y + bh * 0.45, { color: col.ink, size: 11, weight: 600 });
    }
    text(ctx, lg ? 'bar length: log of average number (a straight edge means Boltzmann)' : 'bar length: average particles in the level', w / 2, h - 8, { color: col.muted, size: 10, align: 'center' });
  };
  upd();
}
