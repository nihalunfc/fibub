// Figures for src/blog/discoveries/kiruna-orebody-seismic-profile-apparent-dip-strike.md, made with the maths of the
// Apparent dip tool (src/lib/sci/apparentdip.ts: apparent dip, true dip from one apparent dip, thickness, borehole).
// Run: node scripts/blog-figures/kiruna-orebody-seismic-profile-apparent-dip-strike.mjs   (rewrites the charts inside the article)
import fs from 'node:fs';
import { apparentDip, trueDipFromApparent, thickness, borehole, planeFromTwoApparent } from '../../src/lib/sci/apparentdip.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/kiruna-orebody-seismic-profile-apparent-dip-strike.md', import.meta.url);

// Inputs from the paper: Juhojuntti and Sito (2026), Solid Earth 17: 297-309, doi:10.5194/se-17-297-2026 (CC BY 4.0):
// mineralisation striking about north-south (000) and dipping 50-60 degrees to the east; Kiirunavaara about 80 m thick on average;
// two of the 2D lines run almost parallel to strike. OUR assumptions: the mid-value 55 degrees, an exact strike of 000, flat ground,
// and a collar 1000 m east of where the body would meet the surface, at the same height.
const DIPS = [50, 55, 60], R = (x, n = 2) => +x.toFixed(n);
const az = Array.from({ length: 181 }, (_, i) => i);
const fig1 = chart({
  title: 'Apparent dip of an east-dipping body, by section direction', xLabel: 'Direction the section runs towards (° from north)', yLabel: 'Apparent dip (°)',
  series: DIPS.map((d, k) => ({ name: `True dip ${d}°`, kind: 'line', x: az, y: az.map((t) => R(apparentDip({ strike: 0, dip: d }, t))), colour: ['var(--muted)', 'var(--c-blog)', 'var(--c-tools)'][k] })),
  xDomain: [0, 180], yDomain: [0, 65], xTicks: [0, 30, 60, 90, 120, 150, 180],
  vlines: [{ x: 90, text: 'east: the true dip' }], hlines: [],
  desc: 'Apparent dip of a body striking north-south and dipping 50, 55 or 60 degrees east, as seen in a vertical section running in each direction from north (0) through east (90) to south (180). A section along the strike shows no dip; a section across it shows the true dip.', height: 300,
});
const dist = Array.from({ length: 41 }, (_, i) => i * 50);
const fig2 = chart({
  title: 'Depth to the body in a vertical hole', xLabel: 'Collar distance east of the outcrop line (m)', yLabel: 'Depth below the collar (m)',
  series: DIPS.map((d, k) => ({ name: `Dip ${d}°`, kind: 'line', x: dist, y: dist.map((x) => R(x * Math.tan((d * Math.PI) / 180), 0)), colour: ['var(--muted)', 'var(--c-blog)', 'var(--c-tools)'][k] })),
  xDomain: [0, 2000], yDomain: [0, 3500], yReverse: true,
  vlines: [{ x: 1000, text: '1000 m' }],
  desc: 'Depth at which a vertical hole meets a body dipping 50, 55 or 60 degrees east, for collars up to 2000 metres east of the line where the body would meet the surface. At 1000 metres the three dips give about 1192, 1428 and 1732 metres.', height: 300,
});

const T = 80, plane = { strike: 0, dip: 55 };
const sec = [0, 5, 10, 20, 30, 45, 60, 90].map((t) => [t, R(apparentDip(plane, t)), ...DIPS.filter((d) => d !== 55).map((d) => R(apparentDip({ strike: 0, dip: d }, t)))]);
const back = [5, 10, 20].map((t) => { const a = apparentDip(plane, t); return [t, R(a), R(trueDipFromApparent(0, t, a), 1)]; });
const widthAcross = R(T / Math.sin((55 * Math.PI) / 180), 1);
const thick = thickness({ plane, trend: 90, width: widthAcross, slope: 0, downhill: true, measured: 'slope' });
const holes = DIPS.map((d) => R(borehole({ plane: { strike: 0, dip: d }, dist: 1000, trend: 90, rise: 0, holeTrend: 0, holePlunge: 90, T }).vertical, 0));
const hv = borehole({ plane, dist: 1000, trend: 90, rise: 0, holeTrend: 0, holePlunge: 90, T });
const hw = borehole({ plane, dist: 1000, trend: 90, rise: 0, holeTrend: 270, holePlunge: 70, T });
const he = borehole({ plane, dist: 1000, trend: 90, rise: 0, holeTrend: 90, holePlunge: 70, T });
const two = planeFromTwoApparent({ trend: 20, dip: apparentDip(plane, 20) }, { trend: 90, dip: 55 });
const res = {
  sec, back, widthAcross, thick: { trueT: R(thick.trueT), vertical: R(thick.vertical) }, holes,
  hv: { along: R(hv.along, 0), vertical: R(hv.vertical, 0), angle: R(hv.angle, 1), through: R(hv.through, 1) },
  hw: { along: R(hw.along, 0), vertical: R(hw.vertical, 0), angle: R(hw.angle, 1), through: R(hw.through, 1) },
  he: { along: R(he.along, 0), vertical: R(he.vertical, 0), angle: R(he.angle, 1), through: R(he.through, 1) },
  two: { strike: R(two.plane.strike, 1), dip: R(two.plane.dip, 1), between: R(two.between, 1) },
  rise: R(apparentDip(plane, 190)),
};
console.log(JSON.stringify(res));
if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'apparent', figure(fig1, 'Figure 1. Apparent dip of a plane striking 000 and dipping 50, 55 or 60 degrees east, in sections running in every direction from north to south, worked out with the Apparent dip tool\'s maths. The three curves are our own illustration of the paper\'s 50 to 60 degree range, not data from the paper.'));
  md = inject(md, 'depth', figure(fig2, 'Figure 2. Depth at which a vertical hole meets the same plane, against how far east of its outcrop line the collar sits (flat ground, our assumption). A 10 degree uncertainty in dip moves the depth at 1000 m by more than half a kilometre.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
