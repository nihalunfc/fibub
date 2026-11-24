// Figures for src/blog/discoveries/proton-beam-range-water-r80-bethe-bloch-csda-geant4-cyclotron.md, made with the maths of
// the Stopping power tool (src/lib/sci/phstop.ts: Bethe-Bloch stopping power, CSDA range and the pristine Bragg curve).
// Run: node scripts/blog-figures/proton-beam-range-water-r80-bethe-bloch-csda-geant4-cyclotron.mjs   (rewrites the charts inside the article)
import fs from 'node:fs';
import { range, braggCurve, stopping, PROJECTILES as P, MATERIALS as M } from '../../src/lib/sci/phstop.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/proton-beam-range-water-r80-bethe-bloch-csda-geant4-cyclotron.md', import.meta.url);

// Inputs from the paper: Thongjerm et al. (2025), Applied Sciences 15(14): 7670, doi:10.3390/app15147670 (CC BY).
// Measured integral depth-dose in water: beam energy (MeV), Bragg-peak depth and distal 80 % range R80 (mm).
const BEAMS = [{ T: 70, peak: 39.6, r80: 40.5 }, { T: 100, peak: 75.3, r80: 77.0 }, { T: 150, peak: 154.3, r80: 157.7 }, { T: 220, peak: 301.0, r80: 305.4 }];
const p = P.proton, w = M.water, w78 = { ...w, I: 78 }; // I = 78 eV: the newer recommended value for water (ICRU Report 90), our comparison

const rows = BEAMS.map((b) => {
  const R = range(b.T, p, w) * 10, R78 = range(b.T, p, w78) * 10; // g/cm² in water = cm; ×10 for mm
  return { ...b, csda: +R.toFixed(1), csda78: +R78.toFixed(1), diff: +(R - b.r80).toFixed(1), diff78: +(R78 - b.r80).toFixed(1), pct: +(((R - b.r80) / b.r80) * 100).toFixed(2), S: +stopping(b.T, p, w).toFixed(2) };
});

const E = Array.from({ length: 71 }, (_, i) => 60 + i * 2.5);
const fig1 = chart({
  title: 'Proton range in water: tool against the measured beams', xLabel: 'Beam energy (MeV)', yLabel: 'Depth in water (mm)',
  series: [
    { name: 'CSDA range, Stopping power tool', kind: 'line', x: E, y: E.map((T) => +(range(T, p, w) * 10).toFixed(1)) },
    { name: 'Measured R80 (paper)', kind: 'dots', x: BEAMS.map((b) => b.T), y: BEAMS.map((b) => b.r80), size: 4 },
  ],
  xDomain: [60, 235], yDomain: [0, 340],
  desc: `The CSDA range of protons in water from the Bethe-Bloch formula rises from ${rows[0].csda} mm at 70 MeV to ${rows[3].csda} mm at 220 MeV. The four measured R80 values (${BEAMS.map((b) => b.r80).join(', ')} mm) sit on the curve.`, height: 280,
});

// Pristine Bragg curves (one proton, no straggling), cut where the energy loss passes 30 MeV/cm.
const CAP = 30;
const series2 = BEAMS.map((b, k) => {
  const c = braggCurve(b.T, p, w, 220).filter((q) => q.S * w.rho <= CAP);
  return { name: `${b.T} MeV`, kind: 'line', x: c.map((q) => +(q.depth * 10).toFixed(1)), y: c.map((q) => +(q.S * w.rho).toFixed(2)), colour: ['var(--c-blog)', 'var(--c-tools)', 'var(--ink)', 'var(--muted)'][k] };
});
const fig2 = chart({
  title: 'Pristine Bragg curves and the measured R80', xLabel: 'Depth in water (mm)', yLabel: 'Energy loss (MeV/cm)',
  series: series2, xDomain: [0, 320], yDomain: [0, CAP],
  vlines: BEAMS.map((b, k) => ({ x: b.r80, text: k === 0 ? 'R80' : '', left: true })),
  desc: 'Energy loss along the track of a single proton at 70, 100, 150 and 220 MeV from the tool\'s maths, rising slowly and then steeply at the end of the range. Dashed lines mark the measured R80 of each beam, right where each curve ends.', height: 260,
});

console.log(JSON.stringify(rows));
if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'range', figure(fig1, 'Figure 1. The continuous-slowing-down (CSDA) range of protons in water from the Stopping power tool\'s Bethe-Bloch maths (line), with the four R80 values measured at the hospital cyclotron (dots, from the paper\'s text).'));
  md = inject(md, 'bragg', figure(fig2, 'Figure 2. Pristine Bragg curves for one proton at each energy, from the tool\'s maths, cut at 30 MeV/cm (the end spike is far taller). Dashed lines: the measured R80. A real beam\'s peak is lower and wider because of range straggling and energy spread.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
