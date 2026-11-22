// Turning a tiny strain into a voltage. A load bends a cantilever; a strain gauge glued to the top stretches by ε and its
// resistance changes by ΔR/R = GF·ε (gauge factor GF ≈ 2). A Wheatstone bridge balances three fixed resistors against it, so
// the output V_out ≈ V_ex·GF·ε/4 appears only when the gauge changes. Use 1 gauge (quarter bridge), 2 (half) or 4 (full bridge: top
// and bottom gauges on opposite faces) for 1, 2 or 4 times the signal. Drag the load and watch the bridge unbalance.
import { canvas, line, dot, text, row, slider, choice, readout, title, arrow } from '../kit.js';

export default function (host) {
  let cfg = 1;
  const cv = canvas(host, { aspect: 0.95, max: 400, min: 330, label: 'A loaded cantilever with a strain gauge and its Wheatstone bridge output' });
  const ctl = row(host);
  const sW = slider(ctl, { label: 'Load W', min: 0, max: 10, step: 0.1, value: 4, fmt: (v) => v.toFixed(1) + ' N', oninput: () => show() });
  const sV = slider(ctl, { label: 'Excitation V_ex', min: 1, max: 10, step: 0.5, value: 5, fmt: (v) => v.toFixed(1) + ' V', oninput: () => show() });
  choice(ctl, 'Active gauges', [[1, '1 (quarter)'], [2, '2 (half)'], [4, '4 (full)']], cfg, (v) => { cfg = v; show(); });
  const out = readout(host);
  const R0 = 350, GF = 2, eps = () => sW.value * 200e-6; // 200 microstrain per newton (illustrative)
  // exact bridge: V_out = V_ex (R_g/(R_g + R) − 1/2) for one active arm; for 2 and 4 the arms change by ±ΔR in opposite pairs
  const vout = () => { const d = GF * eps(), V = sV.value; if (cfg === 1) return V * ((1 + d) / (2 + d) - 0.5); if (cfg === 2) return V * ((1 + d) / 2 - 0.5); return V * d; };
  function show() { const e = eps(), v = vout(); out.innerHTML = `<b>Strain ε = ${(e * 1e6).toFixed(0)} µε (ΔL/L = ${(e * 100).toFixed(3)}%).</b> Gauge: ΔR = R·GF·ε = ${(R0 * GF * e).toFixed(3)} Ω on ${R0} Ω (${(GF * e * 100).toFixed(3)}%). Bridge output V_out = ${(v * 1000).toFixed(3)} mV with ${cfg} active gauge${cfg > 1 ? 's' : ''}${cfg === 1 ? ', V_ex·GF·ε/4 for small strain' : cfg === 2 ? ', V_ex·GF·ε/2' : ', V_ex·GF·ε'}. A change of resistance of only 0.1% would be invisible in a direct measurement; the bridge nulls the large steady resistance and shows only the change. Temperature affects all arms equally and cancels.`; queueMicrotask(() => cv.redraw()); }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Strain gauge on a cantilever beam', col);
    // beam
    const bx = 22, by = 76, L = w * 0.62, W = sW.value / 10, thick = 12;
    const yb = (x) => by + W * 34 * ((x / L) ** 2 * (3 - x / L)) / 2;
    const top = [], bot = [];
    for (let i = 0; i <= 30; i++) { const x = (i / 30) * L; top.push([bx + x, yb(x)]); bot.push([bx + x, yb(x) + thick]); }
    ctx.fillStyle = col.soft; ctx.beginPath(); top.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); bot.slice().reverse().forEach(([x, y]) => ctx.lineTo(x, y)); ctx.closePath(); ctx.fill(); ctx.strokeStyle = col.muted; ctx.lineWidth = 1.5; ctx.stroke();
    ctx.fillStyle = col.muted; ctx.fillRect(bx - 12, by - 12, 12, 36);
    // gauge on top, stretching
    const gs = 0.12 * L, gx = bx + 0.15 * L, ge = 1 + eps() * 400;
    const zig = []; for (let i = 0; i <= 10; i++) zig.push([gx + (i / 10) * gs * ge, yb((gx - bx) + (i / 10) * gs * ge) - 3 + (i % 2 ? -3 : 3)]);
    line(ctx, zig, col.s[1], 2.5); text(ctx, 'gauge (stretched)', gx, by - 14 + 0, { color: col.s[1], size: 10.5, weight: 600 });
    if (cfg > 1) { const zz = []; for (let i = 0; i <= 10; i++) zz.push([gx + (i / 10) * gs / ge, yb((gx - bx) + (i / 10) * gs / ge) + thick + 3 + (i % 2 ? -3 : 3)]); line(ctx, zz, col.s[0], 2.5); text(ctx, 'squeezed', gx, yb(gx - bx) + thick + 20, { color: col.s[0], size: 10, weight: 600 }); }
    if (W > 0.02) { arrow(ctx, bx + L, yb(L) - 34, bx + L, yb(L) - 2, col.ink, 3, 9); text(ctx, `W = ${sW.value.toFixed(1)} N`, bx + L - 6, yb(L) - 40, { color: col.ink, size: 11, weight: 700, align: 'right' }); }
    // bridge diamond
    const cx = w / 2, cy = h - 112, r = 56, N = [cx, cy - r], E = [cx + r * 1.2, cy], S = [cx, cy + r], Wt = [cx - r * 1.2, cy];
    const arm = (a, b, lab, c, act) => { line(ctx, [a, b], c, 3); const m = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]; ctx.fillStyle = col.panel; ctx.fillRect(m[0] - 18, m[1] - 8, 36, 16); text(ctx, lab, m[0], m[1], { color: act ? col.s[1] : col.ink, size: 10.5, weight: 700, align: 'center' }); };
    arm(N, E, cfg >= 2 ? 'R−ΔR' : 'R', cfg >= 2 ? col.s[0] : col.muted, cfg >= 2); arm(E, S, 'R+ΔR', col.s[1], true);
    arm(N, Wt, cfg === 4 ? 'R+ΔR' : 'R', cfg === 4 ? col.s[1] : col.muted, cfg === 4); arm(Wt, S, cfg === 4 ? 'R−ΔR' : 'R', cfg === 4 ? col.s[0] : col.muted, cfg === 4);
    [N, E, S, Wt].forEach(([x, y]) => dot(ctx, x, y, 4, col.ink));
    text(ctx, '+V_ex', N[0], N[1] - 14, { color: col.ink, size: 11, weight: 700, align: 'center' }); text(ctx, '0 V', S[0], S[1] + 13, { color: col.muted, size: 11, align: 'center' });
    const v = vout(), mx = w * 0.82;
    text(ctx, 'V_out', E[0] + 16, cy, { color: col.ink, size: 11, weight: 700 }); text(ctx, `${(v * 1000).toFixed(2)} mV`, E[0] + 16, cy + 16, { color: col.s[1], size: 12, weight: 700 });
    const bar = Math.min(1, Math.abs(v) / 0.02) * 60;
    line(ctx, [[w - 76, h - 30], [w - 16, h - 30]], col.line, 6); line(ctx, [[w - 76, h - 30], [w - 76 + bar, h - 30]], col.s[1], 6);
  };
  show();
}
