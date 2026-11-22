// Magnetism and matter: the B-H hysteresis loop of a ferromagnet, traced as the magnetising field H swings
// back and forth. Soft iron: thin loop (small coercivity, small energy loss), good for transformer cores.
// Steel: fat loop (large retentivity and coercivity), good for permanent magnets. Model: B = Bs tanh((H ± Hc)/a).
import { canvas, axes, line, dot, row, choice, readout, loop, text } from '../../kit.js';

const MAT = {
  soft: { name: 'Soft iron', Bs: 1.5, Hc: 60, a: 70 },
  steel: { name: 'Hard steel', Bs: 1.2, Hc: 450, a: 300 },
};
const Hmax = 1500;
export default function (host) {
  let key = 'soft', ph = 0;
  const cv = canvas(host, { aspect: 0.72, max: 420, min: 260, label: 'Hysteresis loop of a ferromagnetic material' });
  const ctl = row(host);
  choice(ctl, 'Material', Object.entries(MAT).map(([k, m]) => [k, m.name]), key, (v) => { key = v; ph = 0; cv.redraw(); show(); });
  const anim = loop(host, (dt) => { ph += dt * 0.6; cv.redraw(); });
  anim.button(ctl);
  const out = readout(host);
  // H(t) = Hmax cos(ph): decreasing H uses the upper branch, increasing H the lower one
  const Bof = (m, H, dec) => m.Bs * Math.tanh((H + (dec ? m.Hc : -m.Hc)) / m.a);
  const show = () => {
    const m = MAT[key], Br = Bof(m, 0, true);
    out.innerHTML = `${m.name}: retentivity (B left when H = 0) ≈ <b>${Br.toFixed(2)} T</b>, coercivity (H needed to wipe it out) ≈ <b>${m.Hc} A/m</b>. Energy lost per cycle per unit volume = area of the loop.`;
  };
  cv.draw = (ctx, w, h, col) => {
    const m = MAT[key];
    const { X, Y } = axes(ctx, w, h, col, { x: [-Hmax, Hmax], y: [-1.7, 1.7], xlabel: 'magnetising field H (A/m)', ylabel: 'B (T)', t: 26 });
    line(ctx, [[X(0), Y(-1.7)], [X(0), Y(1.7)]], col.muted, 1);
    line(ctx, [[X(-Hmax), Y(0)], [X(Hmax), Y(0)]], col.muted, 1);
    const N = 160, up = [], dn = [];
    for (let i = 0; i <= N; i++) { const H = -Hmax + (2 * Hmax * i) / N; up.push([X(H), Y(Bof(m, H, false))]); dn.push([X(H), Y(Bof(m, H, true))]); }
    line(ctx, up, col.line, 2); line(ctx, dn, col.line, 2);
    // the traced part, then the moving point
    const cyc = ph % (2 * Math.PI), tr = [];
    for (let s = Math.max(0, cyc - 3); s <= cyc; s += 0.03) { const H = Hmax * Math.cos(s); tr.push([X(H), Y(Bof(m, H, Math.sin(s) > 0))]); }
    line(ctx, tr, col.s[0], 3);
    const H = Hmax * Math.cos(cyc), B = Bof(m, H, Math.sin(cyc) > 0);
    dot(ctx, X(H), Y(B), 6, col.s[3], col.panel);
    const Br = Bof(m, 0, true);
    dot(ctx, X(0), Y(Br), 4, col.s[1]); text(ctx, 'retentivity', X(0) + 8, Y(Br) - 10, { color: col.s[1], size: 11, halo: col.panel });
    dot(ctx, X(-m.Hc), Y(0), 4, col.s[2]); text(ctx, 'coercivity', X(-m.Hc) - 8, Y(0) + 14, { color: col.s[2], size: 11, align: 'right', halo: col.panel });
    text(ctx, `H = ${Math.round(H)} A/m, B = ${B.toFixed(2)} T`, X(Hmax), Y(-1.5), { color: col.muted, size: 11, align: 'right', halo: col.panel });
  };
  cv.redraw(); show();
}
