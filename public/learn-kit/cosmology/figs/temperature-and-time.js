// 6.3 The cosmic thermometer. Slide the temperature of the universe down from 10¹³ K (quark soup, 10 millionths
// of a second) to 2,970 K (atoms form, about 370,000 years in this rounded model). The strip shows each stage,
// the curve the clock: time against temperature from temperature-and-time-lib.js (radiation era
// t ≈ 2.42 s / √g* × (1 MeV / kT)², then the matter era with PLANCK18). T = 2.7255 K × (1 + z) throughout.
import { canvas, axes, text, title, line, dot, row, slider, readout } from '../../kit.js';
import { timeAt, timeText, gstar, KEV, MEV_K } from './temperature-and-time-lib.js';
import { T_CMB } from '../phys.js';

// [coolest temperature of the stage (K), short name, what exists]
export const STAGES = [
  [2e12, 'Quark soup', 'Quarks and gluons roam free, with electrons, muons, neutrinos and light. Pairs of particles and antiparticles are made and destroyed all the time.'],
  [5e11, 'Protons form', 'Quarks are locked, in threes, into protons and neutrons. Nearly all of them meet their antiparticles and vanish into light; about one in a billion is left over.'],
  [1.5e10, 'Particle soup', 'Muons and pions are gone. Left: protons, neutrons, electrons, positrons, neutrinos and light, all colliding constantly.'],
  [6e9, 'Neutrinos go', 'Neutrinos stop colliding and fly free (about 10 billion K, around 1 second). Neutrons stop turning into protons and back: about 1 neutron for every 6 protons.'],
  [1e9, 'e± annihilate', 'Electrons and positrons annihilate, heating the light. Deuterium nuclei form but are smashed by light at once. Free neutrons slowly decay.'],
  [3e8, 'Nuclei form', 'Deuterium survives at last (about 3 minutes) and is built into helium within minutes. By about 20 minutes it is all over: 75% hydrogen, 25% helium by mass.'],
  [9300, 'Hot plasma', 'A glowing plasma of nuclei, free electrons and light, cooling slowly. Light and neutrinos still outweigh matter.'],
  [4000, 'Matter rules', 'Matter now outweighs radiation (from about 9,300 K, 51,000 years). Dark matter starts to gather into clumps.'],
  [2970, 'Atoms form', 'Electrons join nuclei to make atoms, and the fog clears. The light set free now is the cosmic microwave background (Module 7).'],
];

export default function (host) {
  const cv = canvas(host, { aspect: 0.72, max: 440, min: 330, label: 'Temperature of the universe against time, with the stage of cosmic history at each temperature' });
  const LO = Math.log10(2970), HI = 13;
  let lt = 10.06; // log10 T
  const ctl = row(host);
  const fmtT = (l) => { const T = 10 ** l; return T >= 1e5 ? `${(T / 10 ** Math.floor(l)).toFixed(1)}×10${sup(Math.floor(l))} K` : `${Math.round(T).toLocaleString('en-CA')} K`; };
  const sup = (e) => String(e).replace(/[-0-9]/g, (d) => '⁻⁰¹²³⁴⁵⁶⁷⁸⁹'['-0123456789'.indexOf(d)]);
  // the slider runs from hot (left) to cool (right), like time
  slider(ctl, { label: 'Temperature (cooling →)', min: 0, max: 1, value: (HI - lt) / (HI - LO), fmt: (u) => fmtT(HI - u * (HI - LO)), oninput: (u) => { lt = HI - u * (HI - LO); show(); cv.redraw(); } });
  const out = readout(host);
  const stageOf = (T) => STAGES.findIndex(([lo]) => T >= lo * 0.999);
  const energy = (T) => { const e = KEV * T; return e >= 1e6 ? `${(e / 1e6).toPrecision(3)} MeV` : e >= 1e3 ? `${(e / 1e3).toPrecision(3)} keV` : `${e.toPrecision(2)} eV`; };
  const big = (v) => v >= 1e9 ? `${(v / 1e9).toPrecision(2)} billion` : v >= 1e6 ? `${(v / 1e6).toPrecision(2)} million` : (+v.toPrecision(3)).toLocaleString('en-CA');
  const show = () => {
    const T = 10 ** lt, i = Math.max(0, stageOf(T)), z = T / T_CMB - 1;
    const g = T > 1e5 ? ` · g* ≈ ${gstar(T / MEV_K).toFixed(1)}` : '';
    out.innerHTML = `<b>${fmtT(lt)}</b> (kT ≈ ${energy(T)}) · <b>${timeText(timeAt(T))}</b> after the start · distances ${big(z + 1)} times smaller than today${g}<br><b>${STAGES[i][1]}:</b> ${STAGES[i][2]}`;
  };
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'The cosmic thermometer and clock', col);
    const A = axes(ctx, w, h, col, {
      x: [10 ** HI, 10 ** LO], y: [1e-6, 3e13], xlog: true, ylog: true, t: top + 54, l: 66, b: 44,
      xt: [1e13, 1e11, 1e9, 1e7, 1e5], yt: [1e-5, 1e-2, 1, 1e3, 1e6, 1e9, 1e12],
      fy: (v) => ({ 1e-5: '10 µs', 1e-2: '10 ms', 1: '1 s', 1e3: '17 min', 1e6: '12 days', 1e9: '32 yr', 1e12: '32,000 yr' })[v] || '',
      xlabel: 'Temperature (K), cooling to the right', ylabel: 'Time since the start',
    });
    // stage strip
    const y0 = top + 8, y1 = top + 30;
    let hiT = 10 ** HI;
    STAGES.forEach(([lo, name], i) => {
      const xa = A.X(hiT), xb = A.X(Math.max(lo, 10 ** LO));
      ctx.fillStyle = col.s[[0, 6, 2, 3, 1, 4, 7, 5, 0][i]];
      ctx.globalAlpha = 0.85; ctx.fillRect(xa, y0, Math.max(1, xb - xa), y1 - y0); ctx.globalAlpha = 1;
      ctx.strokeStyle = col.panel; ctx.lineWidth = 1; ctx.strokeRect(xa, y0, xb - xa, y1 - y0);
      if (xb - xa > 18) text(ctx, String(i + 1), (xa + xb) / 2, (y0 + y1) / 2, { color: '#fff', size: 11, weight: 700, align: 'center', fit: false });
      hiT = lo;
    });
    // the clock curve
    const pts = [];
    for (let l = HI; l >= LO - 1e-9; l -= 0.05) pts.push([A.X(10 ** l), A.Y(timeAt(10 ** l))]);
    line(ctx, pts, col.ink, 2.2);
    // landmarks
    const marks = [[1.16e10, '1 MeV ≈ 1 s'], [9e8, 'first nuclei'], [9300, 'matter rules']];
    marks.forEach(([T, s], k) => { dot(ctx, A.X(T), A.Y(timeAt(T)), 3.5, col.muted); text(ctx, s, A.X(T) + (k === 2 ? -6 : 6), A.Y(timeAt(T)) + (k === 2 ? -10 : 11), { color: col.muted, size: 11, halo: col.panel, align: k === 2 ? 'right' : 'left' }); });
    // the reader's temperature
    const T = 10 ** lt, x = A.X(T), y = A.Y(timeAt(T));
    line(ctx, [[x, y0 - 3], [x, A.B]], col.ink, 1, [4, 3]);
    dot(ctx, x, y, 6, col.s[1], col.panel);
    const i = Math.max(0, stageOf(T));
    text(ctx, `${i + 1}. ${STAGES[i][1]}`, x, y1 + 12, { color: col.ink, size: 11.5, weight: 700, align: x > (A.L + A.R) / 2 ? 'right' : 'left', halo: col.panel });
  };
  show(); cv.redraw();
}
