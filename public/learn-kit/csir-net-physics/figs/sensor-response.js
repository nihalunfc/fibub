// 7.3 How four common transducers respond. Thermocouple: EMF against hot-junction temperature for a type K pair
// (a smooth approximation, about 41 μV/°C) with the reference junction at the chosen temperature. Resistance
// thermometers: a Pt100 (Callendar-Van Dusen, above 0 °C) against an NTC thermistor (B = 3950 K, 10 kΩ at 25 °C),
// both shown as R/R(25 °C). Photodiode: silicon responsivity against wavelength, rising as ηλ/1240 and cut off at
// the band gap (about 1100 nm). Strain gauge: quarter-bridge output, exact and linear, against strain for a chosen
// gauge factor. The slider moves the marker and the readout gives the numbers there.
import { canvas, axes, line, dot, row, slider, choice, readout, title, text, fmt } from '../../kit.js';

const tcK = (T) => 0.0395 * T + 1.8e-5 * T * T - 1.6e-8 * T ** 3;   // mV, rough type K shape from 0 °C
const pt = (T) => 100 * (1 + 3.9083e-3 * T - 5.775e-7 * T * T);
const th = (T) => 10 * Math.exp(3950 * (1 / (T + 273.15) - 1 / 298.15));
const eta = (lam) => { if (lam < 300 || lam > 1120) return 0; const blue = 1 - Math.exp(-(lam - 300) / 120); const red = lam < 950 ? 1 : Math.max(0, (1120 - lam) / 170); return 0.85 * blue * red; };
const resp = (lam) => eta(lam) * lam / 1239.84;
const bridge = (x) => x / (4 + 2 * x);

export default function (host) {
  const cv = canvas(host, { aspect: 0.62, max: 400, min: 260, label: 'Response curves of a thermocouple, resistance thermometers, a silicon photodiode and a strain-gauge bridge' });
  let kind = 'tc', p = 0.5, Tref = 25, GF = 2;
  const ctl = row(host);
  choice(ctl, 'Sensor', [['tc', 'Thermocouple'], ['rt', 'Pt100 vs thermistor'], ['pd', 'Photodiode'], ['sg', 'Strain gauge']], kind, (v) => { kind = v; redo(); });
  const ctl2 = row(host);
  slider(ctl2, { label: 'Marker', min: 0, max: 1, step: 0.005, value: p, fmt: () => '', oninput: (v) => { p = v; redo(); } });
  slider(ctl2, { label: 'Thermocouple reference (°C)', min: 0, max: 100, step: 1, value: Tref, fmt: (v) => `${v}`, oninput: (v) => { Tref = v; redo(); } });
  slider(ctl2, { label: 'Strain gauge factor', min: 2, max: 150, value: GF, log: true, fmt: (v) => fmt(v, 2), oninput: (v) => { GF = +fmt(v, 2); redo(); } });
  const out = readout(host);
  const cfg = () => {
    if (kind === 'tc') return { x: [0, 1000], y: [-2, 42], xl: 'hot junction temperature (°C)', yl: 'EMF (mV)', t: 'Thermocouple: EMF depends on both junctions' };
    if (kind === 'rt') return { x: [-20, 150], y: [0, 3.2], xl: 'temperature (°C)', yl: 'R / R(25 °C)', t: 'Pt100 is linear; the thermistor is steep and curved' };
    if (kind === 'pd') return { x: [300, 1200], y: [0, 0.7], xl: 'wavelength (nm)', yl: 'responsivity (A/W)', t: 'Silicon photodiode: rises with λ, stops at the gap' };
    return { x: [0, 0.02], y: [0, GF * 0.02 / 4 * 1.05 * 1000], xl: 'strain', yl: 'output per volt of supply (mV/V)', t: 'Quarter bridge: exact output falls below linear' };
  };
  const show = () => {
    const c = cfg(), x = c.x[0] + p * (c.x[1] - c.x[0]);
    if (kind === 'tc') out.innerHTML = `Hot junction ${fmt(x, 3)} °C, reference ${Tref} °C: EMF = E(${fmt(x, 3)}) − E(${Tref}) = <b>${fmt(tcK(x) - tcK(Tref), 3)} mV</b>. Local sensitivity ${fmt((tcK(x + 1) - tcK(x - 1)) / 2 * 1000, 3)} μV/°C. Raising the reference junction temperature lowers every reading by the same E(T_ref): that is what cold-junction compensation adds back.`;
    else if (kind === 'rt') out.innerHTML = `At ${fmt(x, 3)} °C: Pt100 = <b>${fmt(pt(x), 4)} Ω</b> (slope ${fmt((pt(x + 0.5) - pt(x - 0.5)) / pt(x) * 100, 3)} %/K); thermistor = <b>${fmt(th(x), 3)} kΩ</b> (slope ${fmt((th(x + 0.5) - th(x - 0.5)) / th(x) * 100, 3)} %/K, i.e. −B/T²). The thermistor is about ten times more sensitive near room temperature, but exponential.`;
    else if (kind === 'pd') out.innerHTML = `At ${fmt(x, 3)} nm: quantum efficiency ${fmt(eta(x), 2)}, responsivity <b>${fmt(resp(x), 3)} A/W</b> (an ideal η = 1 detector would give ${fmt(x / 1239.84, 3)} A/W). Beyond 1239.84/1.12 = 1107 nm silicon is transparent; for 1550 nm use InGaAs.`;
    else out.innerHTML = `Strain ${fmt(x * 1e6, 4)} microstrain, gauge factor ${GF}: ΔR/R = ${fmt(GF * x, 3)}. Linear estimate ${fmt(GF * x / 4 * 1000, 4)} mV/V, exact <b>${fmt(bridge(GF * x) * 1000, 4)} mV/V</b>, short by ${fmt(x > 0 ? (1 - bridge(GF * x) / (GF * x / 4)) * 100 : 0, 3)}% (about ΔR/2R). Metal gauges (GF ≈ 2) barely notice; semiconductor gauges (GF ≈ 100) do.`;
  };
  const redo = () => { cv.redraw(); show(); };
  cv.draw = (ctx, w, h, col) => {
    const c = cfg(), top = title(ctx, c.t, col);
    const a = axes(ctx, w, h, col, { x: c.x, y: c.y, xlabel: c.xl, ylabel: c.yl, t: top + 6 });
    const xm = c.x[0] + p * (c.x[1] - c.x[0]);
    ctx.save(); a.clip();
    const curve = (f, ci, dash) => { const pts = []; for (let i = 0; i <= 300; i++) { const x = c.x[0] + (c.x[1] - c.x[0]) * i / 300; pts.push([a.X(x), a.Y(f(x))]); } line(ctx, pts, col.s[ci], 2.3, dash); };
    if (kind === 'tc') { curve((x) => tcK(x), 1, [4, 4]); curve((x) => tcK(x) - tcK(Tref), 0); dot(ctx, a.X(xm), a.Y(tcK(xm) - tcK(Tref)), 5, col.s[0], col.panel); }
    else if (kind === 'rt') { curve((x) => pt(x) / pt(25), 0); curve((x) => th(x) / 10, 2); dot(ctx, a.X(xm), a.Y(pt(xm) / pt(25)), 5, col.s[0], col.panel); dot(ctx, a.X(xm), a.Y(th(xm) / 10), 5, col.s[2], col.panel); }
    else if (kind === 'pd') { curve((x) => x / 1239.84, 1, [4, 4]); curve(resp, 0); dot(ctx, a.X(xm), a.Y(resp(xm)), 5, col.s[0], col.panel); }
    else { curve((x) => GF * x / 4 * 1000, 1, [4, 4]); curve((x) => bridge(GF * x) * 1000, 0); dot(ctx, a.X(xm), a.Y(bridge(GF * xm) * 1000), 5, col.s[0], col.panel); }
    ctx.restore();
    const lab = { tc: [['EMF with reference at ' + Tref + ' °C', 0], ['reference at 0 °C (tables)', 1]], rt: [['Pt100', 0], ['NTC thermistor', 2]], pd: [['silicon', 0], ['ideal η = 1', 1]], sg: [['exact bridge', 0], ['linear estimate', 1]] }[kind];
    lab.forEach(([s, ci], i) => text(ctx, s, a.L + 8, a.T + 12 + i * 15, { color: col.s[ci], size: 11, halo: col.panel }));
  };
  redo();
}
