// The Stark effect: an electric field F pulls the electron cloud one way and the nucleus the other. In hydrogen n = 2 the
// degenerate 2s and 2p₀ mix into two states with permanent dipoles ±3ea₀, so their energy shifts LINEARLY with F; the ground
// state has no permanent dipole, so it shifts only as F² (induced dipole). Pick a state to see the cloud (a slice through the atom).
import { canvas, axes, line, text, title, arrow, row, slider, choice, readout } from '../kit.js';

export default function (host) {
  const cv = canvas(host, { aspect: 1.1, max: 500, min: 400, label: 'Hydrogen electron cloud shifted by an electric field and the energy shift against field' });
  let sh = 'n2', st = 'lo', F = 100;
  const ctl = row(host), ctl2 = row(host), out = readout(host);
  choice(ctl, 'Shell', [['n2', 'n = 2 (linear)'], ['n1', 'n = 1 (quadratic)']], sh, (v) => { sh = v; show(); });
  choice(ctl, 'State', [['lo', 'Lower (2s + 2p₀)'], ['hi', 'Upper (2s − 2p₀)'], ['m', '2p±1 (unmoved)']], st, (v) => { st = v; show(); });
  slider(ctl2, { label: 'Field F', min: 0, max: 200, step: 5, value: F, fmt: (v) => v + ' MV/m', oninput: (v) => { F = v; show(); } });
  const f2s = (x, z, r) => (2 - r) * Math.exp(-r / 2), f2p = (x, z, r) => z * Math.exp(-r / 2);
  function show() {
    const lin = 3 * 0.0529 * F; // meV: 3 e a0 F with F in MV/m -> 0.0529 meV per MV/m per e a0
    const quad = 0.5 * 4.5 * 1.648e-41 * (F * 1e6) ** 2 / 1.602e-19 * 1e3; // meV: ½αF² with α = 4.5·4πε0a0³ = 4.5×1.648e-41 C m²/V
    out.innerHTML = sh === 'n2' ? `n = 2 shifts by ±3ea₀F = <b>±${lin.toFixed(2)} meV</b> at ${F} MV/m (0.159 meV per MV/m, so it is linear in F) for the two mixed states and 0 for 2p±1. The mixed states carry permanent dipoles p = ∓3ea₀: this is the linear Stark effect, only possible because 2s and 2p are degenerate in hydrogen.` : `The ground state moves down by ½αF² = <b>${quad.toExponential(2)} meV</b> at ${F} MV/m (polarizability α = 4.5 in atomic units). The cloud is only pushed a little (drawn exaggerated), and the induced dipole is p = αF.`;
    cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Stark effect in hydrogen', col);
    const gh = Math.round(h * 0.52), side = Math.min(w - 90, gh - 26), x0 = 12, y0 = 32, N = 40, c = side / N, E = sh === 'n2' ? 12 : 4;
    const pull = sh === 'n1' ? (F / 200) * 0.9 : 0;
    for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) {
      const x = ((i + 0.5) / N * 2 - 1) * E, z = (1 - (j + 0.5) / N * 2) * E; let d;
      if (sh === 'n1') { const zz = z + pull, r = Math.hypot(x, zz); d = Math.exp(-2 * r); }
      else { const r = Math.hypot(x, z), a = f2s(x, z, r), p = f2p(x, z, r); const f = st === 'lo' ? (a + p) / Math.SQRT2 : st === 'hi' ? (a - p) / Math.SQRT2 : x * Math.exp(-r / 2) / Math.sqrt(1); d = f * f / 4; }
      ctx.globalAlpha = Math.min(1, d * (sh === 'n1' ? 1.1 : 1.6)); ctx.fillStyle = col.s[0]; ctx.fillRect(x0 + i * c, y0 + j * c, c + 0.5, c + 0.5);
    }
    ctx.globalAlpha = 1; ctx.strokeStyle = col.line; ctx.strokeRect(x0, y0, side, side);
    ctx.beginPath(); ctx.arc(x0 + side / 2, y0 + side / 2, 3.5, 0, 7); ctx.fillStyle = col.s[1]; ctx.fill(); text(ctx, 'nucleus', x0 + side / 2 + 6, y0 + side / 2 + 10, { color: col.s[1], size: 10 });
    const ax = x0 + side + 28; arrow(ctx, ax, y0 + side - 6, ax, y0 + 16, col.s[2], 2.6, 9); text(ctx, 'F', ax + 8, y0 + 18, { color: col.s[2], size: 12, weight: 700 }); text(ctx, 'field', ax - 12, y0 + side + 8, { color: col.s[2], size: 10 });
    // energy plot
    const a = axes(ctx, w, h, col, { x: [0, 200], y: sh === 'n2' ? [-35, 35] : [-1.2e-2, 0.1e-2], l: 52, t: gh + 36, b: 34, xlabel: 'field F (MV/m)', ylabel: sh === 'n2' ? 'shift (meV)' : 'shift (meV)', xt: [0, 100, 200], fy: (v) => (sh === 'n2' ? v : v.toExponential(0)) });
    const lin = (f) => 3 * 0.0529 * f, quad = (f) => -0.5 * 4.5 * 1.648e-41 * (f * 1e6) ** 2 / 1.602e-19 * 1e3;
    const mk = (fn) => Array.from({ length: 51 }, (_, i) => [a.X(i * 4), a.Y(fn(i * 4))]);
    if (sh === 'n2') { line(ctx, mk(lin), st === 'hi' ? col.s[0] : col.muted, st === 'hi' ? 3 : 1.5); line(ctx, mk((f) => -lin(f)), st === 'lo' ? col.s[0] : col.muted, st === 'lo' ? 3 : 1.5); line(ctx, mk(() => 0), st === 'm' ? col.s[0] : col.muted, st === 'm' ? 3 : 1.5); }
    else line(ctx, mk(quad), col.s[0], 3);
    ctx.beginPath(); const yv = sh === 'n2' ? (st === 'hi' ? lin(F) : st === 'lo' ? -lin(F) : 0) : quad(F); ctx.arc(a.X(F), a.Y(yv), 5, 0, 7); ctx.fillStyle = col.s[1]; ctx.fill();
  };
  show();
}
