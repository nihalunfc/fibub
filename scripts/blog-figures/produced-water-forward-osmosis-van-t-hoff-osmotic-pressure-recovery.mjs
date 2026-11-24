// Figures for src/blog/discoveries/produced-water-forward-osmosis-van-t-hoff-osmotic-pressure-recovery.md,
// made with the maths of the Colligative properties calculator (src/lib/sci/colligative.ts).
// Run: node scripts/blog-figures/produced-water-forward-osmosis-van-t-hoff-osmotic-pressure-recovery.mjs
import fs from 'node:fs';
import { osmotic, molality, deltaT, SOLVENTS, R_BAR } from '../../src/lib/sci/colligative.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/produced-water-forward-osmosis-van-t-hoff-osmotic-pressure-recovery.md', import.meta.url);

// From the paper: Mohamed M, Tagliabue M, Tiraferri A (2024), Membranes 14(5): 107, doi:10.3390/membranes14050107
// (CC BY 4.0). Synthetic pretreated produced water, salinity about 20 g/L, osmotic pressure 16.3 bar (from OLI
// Studio); MgCl2 draw solutions at 30, 40, 60, 80 and 120 bar; feed volume 2.5 L against draw volumes of 2.5, 4
// and 5.5 L (volume ratios 1, 1.6 and 2.2); 21 +/- 1 C; water recovery 25 % to 73 %; FO flux 4 to 10 LMH.
const TC = 21, T = TC + 273.15, SALT = 20, PI_PAPER = 16.3, VF = 2.5;
const PI_DRAW = [30, 40, 60, 80, 120], VD = [2.5, 4, 5.5];
const M_NACL = 58.44, M_MGCL2 = 95.21; // g/mol
const water = SOLVENTS.find((s) => s.id === 'water');

// Feed: 20 g of NaCl in a litre of water, the way the tool works it out (molality, then c = 0.997 m for water).
const mFeed = molality(SALT, M_NACL, 1000), cFeed = mFeed * 0.997;
const piFeed = osmotic(2, cFeed, T);
const dTf = deltaT(2, water.Kf, mFeed), osmolality = 2 * mFeed * 1000;

// Draw solutions: the MgCl2 concentration the ideal law needs for each stated osmotic pressure.
const drawNeeds = PI_DRAW.map((pi) => { const c = pi / (3 * R_BAR * T); return { pi, c: +c.toFixed(4), gPerL: +(c * M_MGCL2).toFixed(1) }; });

// Recovery ceiling: the draw dilutes as water crosses, the feed concentrates, and the two osmotic pressures meet.
// pi_d0 * Vd/(Vd + VF r) = pi_f0/(1 - r)  ->  r = (pi_d0 Vd - pi_f0 Vd)/(pi_d0 Vd + VF pi_f0)  with pi_f0 = piFeed.
const ceiling = (pi0, Vd) => (pi0 * Vd - piFeed * Vd) / (pi0 * Vd + VF * piFeed);
const piDrawAt = (pi0, Vd, r) => (pi0 * Vd) / (Vd + VF * r);
const piFeedAt = (r) => piFeed / (1 - r);

const grid = PI_DRAW.map((pi0) => ({ pi0, ceilings: VD.map((Vd) => +(100 * ceiling(pi0, Vd)).toFixed(1)) }));

// Figure 1: ideal osmotic pressure against concentration for the feed salt and the draw salt.
const cs = Array.from({ length: 121 }, (_, i) => (i * 2) / 120); // mol/L
const fig1 = chart({
  title: 'Ideal osmotic pressure at 21 °C', xLabel: 'Concentration (mol/L)', yLabel: 'Osmotic pressure π (bar)',
  series: [
    { name: 'NaCl (i = 2), the feed salt', kind: 'line', x: cs, y: cs.map((c) => osmotic(2, c, T)) },
    { name: 'MgCl₂ (i = 3), the draw salt', kind: 'line', x: cs, y: cs.map((c) => osmotic(3, c, T)) },
  ],
  xDomain: [0, 2], yDomain: [0, 150],
  hlines: [{ y: PI_PAPER, text: 'feed, 16.3 bar' }, { y: 120, text: 'strongest draw, 120 bar' }],
  vlines: [{ x: cFeed, text: `feed ${cFeed.toFixed(3)} M`, dy: 70 }, { x: drawNeeds[4].c, text: `${drawNeeds[4].c.toFixed(2)} M MgCl₂`, left: true, dy: 14 }],
  desc: 'Van \'t Hoff osmotic pressure against concentration for NaCl and MgCl2 at 21 C. The paper\'s 16.3 bar feed matches 0.34 mol/L NaCl and its 120 bar draw needs 1.64 mol/L MgCl2 in the ideal limit.',
  height: 290,
});

// Figure 2: how the driving force runs out as water is recovered.
const rs = Array.from({ length: 121 }, (_, i) => (i * 0.9) / 120);
const picks = [{ pi0: 30, Vd: 2.5 }, { pi0: 80, Vd: 5.5 }, { pi0: 120, Vd: 5.5 }];
const fig2 = chart({
  title: 'The driving force runs out as water is recovered', xLabel: 'Water recovery (% of the feed)', yLabel: 'π draw − π feed (bar)',
  series: picks.map((p) => ({ name: `${p.pi0} bar draw, ${(p.Vd / VF).toFixed(1)}× volume`, kind: 'line', x: rs.map((r) => 100 * r), y: rs.map((r) => piDrawAt(p.pi0, p.Vd, r) - piFeedAt(r)) })),
  xDomain: [0, 90], yDomain: [-40, 110],
  hlines: [{ y: 0, text: 'no driving force left' }],
  bands: [{ x0: 25, x1: 73, text: 'recoveries the paper reports' }],
  desc: 'Difference between draw and feed osmotic pressure against water recovery for three of the paper\'s runs. The weakest draw runs out of driving force near 28 % recovery and the strongest near 81 %, bracketing the 25 % to 73 % the paper reports.',
  height: 300,
});

console.log(JSON.stringify({
  mFeed: +mFeed.toFixed(5), cFeed: +cFeed.toFixed(5), piFeed: +piFeed.toFixed(3), piPaper: PI_PAPER,
  gap: +(100 * (piFeed / PI_PAPER - 1)).toFixed(1), dTf: +dTf.toFixed(3), osmolality: +osmolality.toFixed(0),
  saltForPaperPi: +((PI_PAPER / (2 * R_BAR * T)) * M_NACL / 0.997).toFixed(2),
  drawNeeds, grid, ceilingRange: [grid[0].ceilings[0], grid[4].ceilings[2]],
  piFeedAt50: +piFeedAt(0.5).toFixed(2), piFeedAt73: +piFeedAt(0.73).toFixed(2), piDraw120at73: +piDrawAt(120, 5.5, 0.73).toFixed(2),
}, null, 1));

if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'pi', figure(fig1, 'Figure 1. The van \'t Hoff line the Colligative properties calculator uses, for the feed salt (two ions) and the draw salt (three ions) at 21 °C. Reading across from the paper\'s stated osmotic pressures gives the concentrations behind them.'));
  md = inject(md, 'rec', figure(fig2, 'Figure 2. Draw minus feed osmotic pressure against water recovery, for three of the paper\'s runs, worked out from the ideal law as the draw dilutes and the feed concentrates. Where a line crosses zero, osmosis stops however good the membrane is.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
