// Figures for src/blog/discoveries/solar-irradiance-three-millennia-reconstruction.md, made with the maths of the
// Blackbody calculator (src/lib/sci/blackbody.ts) and the Energy balance model (src/lib/sci/ebm.ts).
// Run: node scripts/blog-figures/solar-irradiance-three-millennia-reconstruction.mjs   (rewrites the charts inside the article)
import fs from 'node:fs';
import { star, SIGMA, R_SUN, T_SUN } from '../../src/lib/sci/blackbody.ts';
import { eqTemp, co2Forcing, linearStep, heatCap, efold } from '../../src/lib/sci/ebm.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/solar-irradiance-three-millennia-reconstruction.md', import.meta.url);

// Inputs. "Paper": Temaj et al. (2026), A&A 710, L24, doi:10.1051/0004-6361/202659432 (CC BY 4.0), abstract.
const DS = 1.04, DS_LO = 1.04 - 0.2, DS_HI = 1.04 + 0.14;   // W/m², range of 50-year running means over 3 millennia: paper
// Literature: IAU 2015 nominal solar values (the Blackbody calculator's T_SUN 5772 K, R_SUN), 1 au = 1.495978707e11 m.
const AU = 1.495978707e11;
// The Energy balance model's default settings (our choices, from the tool): S 1361, albedo 0.3, emissivity 0.612,
// feedback λ 1.2 W/m²/K, 100 m ocean mixed layer.
const P0 = { S: 1361, alpha: 0.3, eps: 0.612, F: 0, ice: { on: false, ai: 0.6, Tm: 265, w: 10 } };
const LAM = 1.2, C = heatCap(100);
// Literature: CO₂ of 280 ppm before industry and about 420 ppm in the 2020s (NOAA global means, rounded).
const CO2_0 = 280, CO2_NOW = 420;

// 1. The Sun as a blackbody: luminosity and the irradiance at 1 au.
const sun = star(T_SUN, 1), L = sun.L ?? sun.Lsun * 3.828e26;
const S1au = L / (4 * Math.PI * AU * AU);
// A change dS in irradiance is a change dT in the Sun's effective temperature: S ∝ T⁴, so dT = T dS / (4 S).
const dTsun = (dS) => (T_SUN * dS) / (4 * S1au);
// 2. Earth: forcing and warming.
const forcing = (dS) => (dS * (1 - P0.alpha)) / 4;                 // W/m² averaged over the globe
const dTeqNoFb = eqTemp({ ...P0, S: P0.S + DS }) - eqTemp(P0);     // radiative model, no extra feedback
const dTlam = forcing(DS) / LAM;                                    // linear model with the tool's λ
const Fco2 = co2Forcing(CO2_NOW, CO2_0);

// Figure 1: the Sun's effective temperature against irradiance, with the paper's range marked.
const Ss = [], Ts = [];
for (let k = 0; k <= 40; k++) { const s = S1au - 1 + (k / 40) * 2.5; Ss.push(+s.toFixed(3)); Ts.push(+(T_SUN * (s / S1au) ** 0.25).toFixed(4)); }
const fig1 = chart({
  title: 'How much hotter the Sun would have to be', xLabel: 'Irradiance at 1 au (W/m²)', yLabel: 'Sun\'s effective temperature (K)',
  series: [{ name: 'Blackbody Sun', kind: 'line', x: Ss, y: Ts }],
  bands: [{ x0: +(S1au).toFixed(3), x1: +(S1au + DS).toFixed(3), text: 'paper: 1.04 W/m²' }], height: 280,
  desc: `A 1.04 W/m² rise in irradiance is the same as the Sun's surface being ${dTsun(DS).toFixed(2)} K hotter.`,
});

// Figure 2: warming after a step in forcing, linear model with the tool's λ and mixed layer: the largest solar change
// in the paper against today's CO₂ forcing.
const yrs = Array.from({ length: 101 }, (_, k) => k * 2);
const fig2 = chart({
  title: 'Warming from a step in forcing', xLabel: 'Years after the step', yLabel: 'Warming (K)',
  series: [
    { name: `Solar, ${forcing(DS).toFixed(2)} W/m²`, kind: 'line', x: yrs, y: yrs.map((t) => +linearStep(forcing(DS), LAM, C, t).toFixed(4)) },
    { name: `CO₂ 280 to 420 ppm, ${Fco2.toFixed(2)} W/m²`, kind: 'line', x: yrs, y: yrs.map((t) => +linearStep(Fco2, LAM, C, t).toFixed(4)) },
  ], yDomain: [0, 2], height: 280,
  desc: `With the Energy balance model's default feedback, the paper's largest solar change warms Earth by ${dTlam.toFixed(2)} K; the CO₂ rise since industry by ${(Fco2 / LAM).toFixed(2)} K.`,
});

const facts = {
  S1au: S1au.toFixed(1), dTsun: dTsun(DS).toFixed(3), dTsunRange: [dTsun(DS_LO).toFixed(2), dTsun(DS_HI).toFixed(2)], frac: (DS / S1au * 100).toFixed(4),
  forcing: forcing(DS).toFixed(3), forcingRange: [forcing(DS_LO).toFixed(3), forcing(DS_HI).toFixed(3)],
  Teq0: eqTemp(P0).toFixed(3), Teq1: eqTemp({ ...P0, S: P0.S + DS }).toFixed(3), dTeqNoFb: dTeqNoFb.toFixed(3), dTlam: dTlam.toFixed(3), efold: efold(LAM, C).toFixed(2),
  Fco2: Fco2.toFixed(3), ratio: (Fco2 / forcing(DS)).toFixed(1), dTco2: (Fco2 / LAM).toFixed(2),
};
console.log(JSON.stringify(facts, null, 1));
if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'sun', figure(fig1, 'Figure 1. The Sun\'s effective temperature needed for each irradiance at Earth\'s distance, from the Blackbody calculator\'s maths (radius fixed at one solar radius). The shaded band is the paper\'s largest change between 50-year means.'));
  md = inject(md, 'earth', figure(fig2, 'Figure 2. Warming after a sudden, lasting change in forcing, from the Energy balance model\'s linear model with its default feedback (λ = 1.2 W/m²/K) and a 100 m ocean layer. A teaching model, not a climate projection.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
