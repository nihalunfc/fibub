// 10.4 SU(3) weight diagrams: isospin component I₃ across, hypercharge Y = B + S up. The spin-1/2 baryon octet (a
// hexagon with Σ⁰ and Λ both at the centre), the spin-3/2 decuplet (an inverted triangle with Ω⁻ at the bottom
// vertex) and the pseudoscalar meson octet (+ η′). Labels can show names, quark content, charge or strangeness; lines of
// equal charge run diagonally, as Q = I₃ + Y/2 requires.
import { canvas, row, choice, readout, axes, line, dot, text } from '../../kit.js';

const SETS = {
  octet: { title: 'Baryon octet, J^P = 1/2⁺', pts: [[-0.5, 1, 'n', 'udd', 0], [0.5, 1, 'p', 'uud', 1], [-1, 0, 'Σ⁻', 'dds', -1], [0, 0, 'Σ⁰', 'uds', 0], [0, 0, 'Λ', 'uds', 0], [1, 0, 'Σ⁺', 'uus', 1], [-0.5, -1, 'Ξ⁻', 'dss', -1], [0.5, -1, 'Ξ⁰', 'uss', 0]], B: 1 },
  decuplet: { title: 'Baryon decuplet, J^P = 3/2⁺', pts: [[-1.5, 1, 'Δ⁻', 'ddd', -1], [-0.5, 1, 'Δ⁰', 'udd', 0], [0.5, 1, 'Δ⁺', 'uud', 1], [1.5, 1, 'Δ⁺⁺', 'uuu', 2], [-1, 0, 'Σ*⁻', 'dds', -1], [0, 0, 'Σ*⁰', 'uds', 0], [1, 0, 'Σ*⁺', 'uus', 1], [-0.5, -1, 'Ξ*⁻', 'dss', -1], [0.5, -1, 'Ξ*⁰', 'uss', 0], [0, -2, 'Ω⁻', 'sss', -1]], B: 1 },
  mesons: { title: 'Pseudoscalar mesons, J^P = 0⁻', pts: [[-0.5, 1, 'K⁰', 'ds̄', 0], [0.5, 1, 'K⁺', 'us̄', 1], [-1, 0, 'π⁻', 'dū', -1], [0, 0, 'π⁰', '(uū−dd̄)/√2', 0], [0, 0, 'η', '≈(uū+dd̄−2ss̄)/√6', 0], [0, 0, 'η′', '≈(uū+dd̄+ss̄)/√3', 0], [1, 0, 'π⁺', 'ud̄', 1], [-0.5, -1, 'K⁻', 'sū', -1], [0.5, -1, 'K̄⁰', 'sd̄', 0]], B: 0 },
};

export default function (host) {
  const cv = canvas(host, { aspect: 0.82, max: 480, min: 320, label: 'SU(3) weight diagrams of the baryon octet, decuplet and meson nonet' });
  let set = 'octet', lab = 'name';
  const ctl = row(host), out = readout(host);
  const re = () => { cv.redraw(); show(); };
  choice(ctl, 'Multiplet', [['octet', 'Octet'], ['decuplet', 'Decuplet'], ['mesons', 'Mesons']], set, (v) => { set = v; re(); });
  choice(ctl, 'Label', [['name', 'Name'], ['quarks', 'Quarks'], ['Q', 'Charge'], ['S', 'Strangeness']], lab, (v) => { lab = v; re(); });
  const show = () => {
    const s = SETS[set];
    out.innerHTML = `${s.title}: ${s.pts.length} states. Rows of constant Y are isospin multiplets; strangeness S = Y − B = Y − ${s.B}. Every point obeys Q = I₃ + Y/2.${set === 'decuplet' ? ' The Ω⁻ at the bottom (S = −3) was predicted at about 1680 MeV and found in 1964.' : set === 'octet' ? ' The centre holds two states: Σ⁰ (I = 1) and Λ (I = 0).' : ' The centre holds π⁰, η and η′ (the singlet, added to the octet to make a nonet).'}`;
  };
  cv.draw = (ctx, W, H, col) => {
    const s = SETS[set], yr = set === 'decuplet' ? [-2.6, 1.6] : [-1.7, 1.7];
    const ax = axes(ctx, W, H, col, { x: [-2.1, 2.1], y: yr, xlabel: 'I₃', ylabel: 'Y = B + S', xt: [-1.5, -1, -0.5, 0, 0.5, 1, 1.5], yt: set === 'decuplet' ? [-2, -1, 0, 1] : [-1, 0, 1], t: 24 });
    // lines of constant charge: Y = 2(Q − I₃)
    ctx.save(); ax.clip();
    for (let q = -1; q <= 2; q++) line(ctx, [[ax.X(-2.5), ax.Y(2 * (q + 2.5))], [ax.X(2.5), ax.Y(2 * (q - 2.5))]], col.line, 1, [3, 4]);
    ctx.restore();
    // outline
    const outline = set === 'decuplet' ? [[-1.5, 1], [1.5, 1], [0, -2], [-1.5, 1]] : [[-0.5, 1], [0.5, 1], [1, 0], [0.5, -1], [-0.5, -1], [-1, 0], [-0.5, 1]];
    line(ctx, outline.map(([x, y]) => [ax.X(x), ax.Y(y)]), col.muted, 1.4);
    const seen = {};
    for (const [x, y, nm, qk, Q] of s.pts) {
      const key = `${x},${y}`, k = (seen[key] = (seen[key] ?? -1) + 1);
      if (k === 0) dot(ctx, ax.X(x), ax.Y(y), 6, col.s[0]);
      else { ctx.beginPath(); ctx.arc(ax.X(x), ax.Y(y), 6 + 5 * k, 0, 2 * Math.PI); ctx.strokeStyle = col.s[0]; ctx.lineWidth = 1.5; ctx.stroke(); }
      const L = lab === 'name' ? nm : lab === 'quarks' ? qk : lab === 'Q' ? `${nm}: ${Q > 0 ? '+' : ''}${Q}` : `${nm}: ${y - s.B}`;
      text(ctx, L, ax.X(x), ax.Y(y) - 13 - 14 * k, { color: col.ink, size: lab === 'quarks' && set === 'mesons' && x === 0 && y === 0 ? 9.5 : 11.5, weight: 600, align: 'center', halo: col.panel });
    }
    text(ctx, s.title, ax.L + 6, ax.T + 4, { color: col.s[0], size: 11.5, weight: 700, halo: col.panel });
    text(ctx, 'dashed: equal charge', ax.R - 4, ax.B - 10, { color: col.muted, size: 10.5, align: 'right', halo: col.panel });
  };
  re();
}
