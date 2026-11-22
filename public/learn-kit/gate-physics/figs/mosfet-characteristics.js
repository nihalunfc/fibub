// 9.1 MOSFET characteristics. Output view: I_D against V_DS for several gate voltages (square law with channel-length
// modulation), the dashed triode/saturation boundary V_DS = V_GS - V_T, and a resistive load line from V_DD through R_D
// with the operating point. Transfer view: I_D against V_GS in saturation with the slope g_m at the chosen bias.
import { canvas, row, slider, choice, readout, axes, line, dot, text, title, fmt } from '../../kit.js';

export default function (host) {
  const cv = canvas(host, { aspect: 0.68, max: 440, min: 290, label: 'MOSFET drain current against drain voltage for several gate voltages, with the saturation boundary and a load line' });
  let view = 'out', VT = 1, lam = 0.03, VGS = 3, RD = 3;
  const k = 1, VDD = 10; // k_n = 1 mA/V^2, I_D = (k/2) Vov^2 (1 + lam VDS) in saturation
  const ctl = row(host), out = readout(host);
  const re = () => { cv.redraw(); show(); };
  choice(ctl, 'View', [['out', 'Output curves'], ['tr', 'Transfer curve']], view, (v) => { view = v; re(); });
  slider(ctl, { label: 'Gate voltage V_GS (V)', min: 0, max: 5, step: 0.05, value: VGS, fmt: (v) => fmt(v, 3), oninput: (v) => { VGS = v; re(); } });
  slider(ctl, { label: 'Threshold V_T (V)', min: 0.4, max: 2, step: 0.05, value: VT, fmt: (v) => fmt(v, 3), oninput: (v) => { VT = v; re(); } });
  slider(ctl, { label: 'λ (1/V)', min: 0, max: 0.1, step: 0.005, value: lam, fmt: (v) => fmt(v, 2), oninput: (v) => { lam = v; re(); } });
  slider(ctl, { label: 'Load R_D (kΩ), V_DD = 10 V', min: 0.5, max: 10, step: 0.1, value: RD, fmt: (v) => fmt(v, 3), oninput: (v) => { RD = v; re(); } });
  const ID = (vgs, vds) => {
    const ov = vgs - VT; if (ov <= 0) return 0;
    if (vds < ov) return k * (ov * vds - vds * vds / 2) * (1 + lam * vds);
    return 0.5 * k * ov * ov * (1 + lam * vds);
  };
  // operating point: solve VDD - ID*RD = VDS by bisection on VDS
  const qpoint = () => { let lo = 0, hi = VDD; for (let i = 0; i < 60; i++) { const m = (lo + hi) / 2; if (VDD - ID(VGS, m) * RD > m) lo = m; else hi = m; } return lo; };
  const show = () => {
    const ov = VGS - VT;
    if (ov <= 0) { out.innerHTML = `V_GS = ${fmt(VGS, 3)} V is below the threshold: the transistor is <b>cut off</b> (only a tiny subthreshold current).`; return; }
    const vds = qpoint(), id = ID(VGS, vds), sat = vds >= ov, gm = k * ov * (1 + lam * vds), ro = lam > 0 ? 1 / (lam * 0.5 * k * ov * ov) : Infinity;
    out.innerHTML = `Overdrive ${fmt(ov, 3)} V. Operating point: V_DS = <b>${fmt(vds, 3)} V</b>, I_D = <b>${fmt(id, 3)} mA</b>, in the <b>${sat ? 'saturation' : 'triode'}</b> region. ${sat ? `g_m ≈ ${fmt(gm, 3)} mA/V, r_o ≈ ${ro === Infinity ? '∞' : fmt(ro, 3) + ' kΩ'}, voltage gain −g_m(R_D ∥ r_o) ≈ ${fmt(-gm * (ro === Infinity ? RD : RD * ro / (RD + ro)), 3)}.` : 'In the triode region the device behaves like a resistor and the gain collapses: lower R_D or V_GS.'}`;
  };
  cv.draw = (ctx, W, H, col) => {
    if (view === 'out') {
      const imax = 0.5 * k * (5 - VT) ** 2 * (1 + lam * VDD) * 1.05 || 1;
      const ax = axes(ctx, W, H, col, { x: [0, VDD], y: [0, Math.max(1, imax)], xlabel: 'V_DS (V)', ylabel: 'I_D (mA)', t: 32 });
      title(ctx, 'Output characteristics, k_n = 1 mA/V²', col);
      ctx.save(); ax.clip();
      const gates = [];
      for (let v = Math.ceil((VT + 0.5) * 2) / 2; v <= 5.001; v += 0.5) gates.push(v);
      gates.forEach((v, i) => {
        const pts = []; for (let x = 0; x <= VDD; x += 0.05) pts.push([ax.X(x), ax.Y(ID(v, x))]);
        line(ctx, pts, col.s[i % 2 ? 1 : 0], 1.6);
        text(ctx, `${fmt(v, 2)} V`, ax.X(VDD) - 4, ax.Y(ID(v, VDD)) - 8, { color: col.muted, size: 10.5, align: 'right', halo: col.panel });
      });
      // chosen gate voltage
      if (VGS > VT) { const pts = []; for (let x = 0; x <= VDD; x += 0.05) pts.push([ax.X(x), ax.Y(ID(VGS, x))]); line(ctx, pts, col.s[4], 3); }
      // boundary V_DS = V_ov: I = (k/2) V_DS^2 (1 + lam V_DS)
      const bd = []; for (let x = 0; x <= Math.min(VDD, 5 - VT); x += 0.05) bd.push([ax.X(x), ax.Y(0.5 * k * x * x * (1 + lam * x))]);
      line(ctx, bd, col.muted, 1.4, [5, 4]);
      text(ctx, 'triode | saturation', ax.X(Math.min(VDD, 5 - VT) * 0.62), ax.Y(0.5 * k * (Math.min(VDD, 5 - VT) * 0.62) ** 2) - 12, { color: col.muted, size: 10.5, halo: col.panel });
      // load line
      line(ctx, [[ax.X(0), ax.Y(VDD / RD)], [ax.X(VDD), ax.Y(0)]], col.s[2], 1.8, [8, 4]);
      if (VGS > VT) { const v = qpoint(); dot(ctx, ax.X(v), ax.Y(ID(VGS, v)), 6, col.s[4], col.panel); }
      ctx.restore();
      text(ctx, 'load line', ax.X(0.2), Math.max(ax.T + 10, ax.Y(VDD / RD) + 10), { color: col.s[2], size: 11, weight: 700, halo: col.panel });
    } else {
      const imax = 0.5 * k * (5 - VT) ** 2 * 1.1 || 1;
      const ax = axes(ctx, W, H, col, { x: [0, 5], y: [0, Math.max(1, imax)], xlabel: 'V_GS (V)', ylabel: 'I_D (mA), saturation', t: 32 });
      title(ctx, 'Transfer characteristic: I_D = ½k_n(V_GS − V_T)²', col);
      ctx.save(); ax.clip();
      const pts = []; for (let v = 0; v <= 5; v += 0.02) pts.push([ax.X(v), ax.Y(v > VT ? 0.5 * k * (v - VT) ** 2 : 0)]);
      line(ctx, pts, col.s[0], 2.6);
      if (VGS > VT) {
        const i0 = 0.5 * k * (VGS - VT) ** 2, g = k * (VGS - VT);
        line(ctx, [[ax.X(VGS - 1), ax.Y(i0 - g)], [ax.X(VGS + 1), ax.Y(i0 + g)]], col.s[4], 1.8, [6, 4]);
        dot(ctx, ax.X(VGS), ax.Y(i0), 6, col.s[4], col.panel);
        text(ctx, `slope g_m = ${fmt(g, 3)} mA/V = 2I_D/V_ov`, ax.X(Math.min(VGS, 3.2)) - 10, ax.Y(i0) - 16, { color: col.s[4], size: 11, weight: 700, align: 'right', halo: col.panel });
      }
      ctx.restore();
      text(ctx, 'V_T', ax.X(VT), ax.B - 10, { color: col.ink, size: 11, align: 'center', halo: col.panel });
    }
  };
  re();
}
