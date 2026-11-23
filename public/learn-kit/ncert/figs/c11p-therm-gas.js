// Class 11 Thermal Properties of Matter: the ideal gas law PV = nRT through its three special cases. Boyle (T fixed): P V = constant, hyperbola. Charles (P fixed): V proportional to T (kelvin); straight lines drawn back (dashed)
// all meet the temperature axis at about -273 degC, which is why absolute zero exists. Gay-Lussac (V fixed): P proportional to T. n = moles; R = 8.314 J/(mol K). Plotted per mole of gas, scaled for readable axes.
import { canvas, text, title, axes, line, dot, row, slider, choice, readout } from '../../kit.js';

export default function (host) {
  let law = 'boyle', T = 300, nn = 1;
  const cv = canvas(host, { aspect: 0.85, max: 440, min: 300, label: 'Graphs of the gas laws: pressure against volume, and volume against temperature extrapolated to absolute zero' });
  const ctl = row(host), ro = readout(host);
  choice(ctl, 'Law', [['boyle', 'Boyle: P–V'], ['charles', 'Charles: V–T'], ['gay', 'Gay-Lussac: P–T']], law, (v) => { law = v; go(); });
  slider(ctl, { label: 'temperature T (K)', min: 150, max: 600, step: 10, value: T, fmt: (v) => v + ' K', oninput: (v) => { T = v; go(); } });
  slider(ctl, { label: 'amount n (mol)', min: 0.5, max: 2, step: 0.5, value: nn, fmt: (v) => v + ' mol', oninput: (v) => { nn = v; go(); } });
  const R = 8.314;
  const go = () => { ro.textContent = law === 'boyle' ? `At T = ${T} K: P × V = nRT = ${(nn * R * T / 1000).toFixed(2)} kJ. Squeeze the volume to half and the pressure doubles.` : law === 'charles' ? `At fixed pressure V = (nR/P) T. Every line reaches V = 0 at T = 0 K (−273 °C): the lines drawn back are an extrapolation, real gases liquefy first.` : `At fixed volume P = (nR/V) T: P is proportional to the kelvin temperature. At 0 K the pressure would be zero.`; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, { boyle: 'Boyle’s law: P V = constant (T fixed)', charles: 'Charles’s law: V ∝ T (P fixed)', gay: 'Gay-Lussac’s law: P ∝ T (V fixed)' }[law], col);
    if (law === 'boyle') {
      const A = axes(ctx, w, h, col, { x: [0, 40], y: [0, 200], xlabel: 'volume V (litres)', ylabel: 'pressure P (kPa)', l: 46, t: top + 10, fx: (v) => v, fy: (v) => v });
      ctx.save(); A.clip(); [[col.s[0], 200], [col.s[2], 300], [col.s[3], 450]].forEach(([c, tt]) => { const p = []; for (let v = 3; v <= 40; v += 0.5) p.push([A.X(v), A.Y(nn * R * tt / v)]); line(ctx, p, c, tt === T ? 3.5 : 1.5, tt === T ? undefined : [4, 3]); });
      const p = []; for (let v = 3; v <= 40; v += 0.5) p.push([A.X(v), A.Y(nn * R * T / v)]); line(ctx, p, col.s[1], 3.5); ctx.restore();
      const v0 = 20; dot(ctx, A.X(v0), A.Y(nn * R * T / v0), 5, col.s[3], col.panel); text(ctx, 'T = ' + T + ' K', A.X(30), A.Y(nn * R * T / 30) - 12, { color: col.s[1], size: 11.5, weight: 700 });
    } else {
      const lawC = law === 'charles', A = axes(ctx, w, h, col, { x: [-300, 400], y: [0, lawC ? 100 : 400], xlabel: 'temperature (°C)', ylabel: lawC ? 'volume V (litres)' : 'pressure P (kPa)', l: 46, t: top + 10, xt: [-273, -100, 0, 100, 200, 300], fx: (v) => v, fy: (v) => v });
      const par = lawC ? [60, 100, 150] : [10, 20, 40], f = (c, q) => nn * R * (c + 273.15) / q; ctx.save(); A.clip();
      par.forEach((q, i) => { line(ctx, [[A.X(-273.15), A.Y(0)], [A.X(-100), A.Y(f(-100, q))]], col.muted, 1.5, [5, 4]); line(ctx, [[A.X(-100), A.Y(f(-100, q))], [A.X(400), A.Y(f(400, q))]], col.s[[0, 2, 3][i]], 3); text(ctx, (lawC ? q + ' kPa' : q + ' L'), A.X(300), A.Y(f(300, q)) - 10, { color: col.s[[0, 2, 3][i]], size: 10.5, weight: 700 }); });
      ctx.restore(); const ct = T - 273.15, q = par[1]; dot(ctx, A.X(ct), A.Y(f(ct, q)), 5.5, col.s[1], col.panel);
      line(ctx, [[A.X(-273.15), A.T], [A.X(-273.15), A.B]], col.s[1], 1.5, [4, 3]); text(ctx, 'absolute zero −273.15 °C', A.X(-273.15) + 5, A.T + 10, { color: col.s[1], size: 10.5, weight: 700 });
    }
  };
  go();
}
