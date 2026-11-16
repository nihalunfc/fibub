// Figures for src/blog/discoveries/common-pandora-yield-per-recruit-aegean.md, made with the maths of the
// Yield per recruit tool (src/lib/sci/ypr.ts) and the von Bertalanffy growth fitter (src/lib/sci/vbgf.ts).
// Run: node scripts/blog-figures/common-pandora-yield-per-recruit-aegean.mjs   (rewrites the charts inside the article)
import fs from 'node:fs';
import { ypr, refPoints } from '../../src/lib/sci/ypr.ts';
import { vb } from '../../src/lib/sci/vbgf.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/common-pandora-yield-per-recruit-aegean.md', import.meta.url);

// Inputs from the paper: Theocharis, Vardali and Klaoudatos (2025), Fishes 10(4): 160, doi:10.3390/fishes10040160 (CC BY).
const LINF = 39.53, K = 0.16, T0 = -1.53, M = 0.321, F_NOW = 0.2, Z = 0.52, T50 = 2.63, LC50 = 19.18, TMAX = 17, PHI = 2.39;
// Our assumptions: recruitment at age 1, W∞ = 1000 so yield per recruit reads as thousandths of W∞.
const P = { M, K, t0: T0, Winf: 1000, tr: 1, tc: T50, tl: TMAX };

const rp = refPoints(P);
const later = { ...P, tc: 4 }, rpL = refPoints(later);
const phi = Math.log10(K) + 2 * Math.log10(LINF);
const mThen = 4.118 * K ** 0.73 * LINF ** -0.33;
const tmaxTaylor = T0 + 3 / K;
const tInfl = T0 + Math.log(3) / K;
const tcFromLc = T0 - Math.log(1 - LC50 / LINF) / K;
const tcScan = [1.5, 2, 2.63, 3, 4, 5, 6].map((tc) => ({ tc, now: +ypr(F_NOW, { ...P, tc }).toFixed(1), at05: +ypr(0.5, { ...P, tc }).toFixed(1) }));

const FF = Array.from({ length: 81 }, (_, i) => i * 0.025);
const fig1 = chart({
  title: 'Common pandora: yield per recruit against fishing', xLabel: 'Fishing mortality F (per year)', yLabel: 'Yield per recruit (‰ of W∞)',
  series: [
    { name: 'First caught at 2.63 years', kind: 'line', x: FF, y: FF.map((F) => +ypr(F, P).toFixed(2)) },
    { name: 'First caught at 4 years', kind: 'line', x: FF, y: FF.map((F) => +ypr(F, later).toFixed(2)), dash: '5 4' },
  ],
  xDomain: [0, 2], yDomain: [0, 90],
  vlines: [{ x: F_NOW, text: 'now 0.2' }, { x: +rp.F01.toFixed(3), text: `F0.1 ${rp.F01.toFixed(2)}`, dy: 14 }, { x: +rp.Fmax.toFixed(3), text: `Fmax ${rp.Fmax.toFixed(2)}`, dy: 28 }],
  desc: `Beverton-Holt yield per recruit for common pandora. With first capture at 2.63 years, F0.1 is ${rp.F01.toFixed(2)} and Fmax ${rp.Fmax.toFixed(2)} per year; today's F of 0.2 sits below both.`, height: 280,
});
const tt = Array.from({ length: 81 }, (_, i) => i * 0.25);
const fig2 = chart({
  title: 'Growth and the age fish are first caught', xLabel: 'Age (years)', yLabel: 'Total length (cm)',
  series: [{ name: 'von Bertalanffy curve', kind: 'line', x: tt, y: tt.map((t) => +vb(t, [LINF, K, T0]).toFixed(2)) }],
  xDomain: [0, 20], yDomain: [0, 42], hlines: [{ y: LINF, text: 'L∞ 39.5 cm' }, { y: LC50, text: 'half retained 19.2 cm' }],
  vlines: [{ x: T50, text: '2.63 y' }, { x: +tInfl.toFixed(2), text: `${tInfl.toFixed(1)} y, fastest weight gain` }],
  desc: 'The paper\'s growth curve for common pandora: fish reach the 19.2 cm length at which half are kept by the trawl at about 2.6 years, and gain weight fastest at about 5.3 years.', height: 260,
});

const facts = { rp, Emax: rp.Fmax / (rp.Fmax + M), E01: rp.F01 / (rp.F01 + M), rpL, phi: phi.toFixed(3), mThen: mThen.toFixed(3), tmaxTaylor: tmaxTaylor.toFixed(1), tInfl: tInfl.toFixed(2), tcFromLc: tcFromLc.toFixed(2), E: (F_NOW / Z).toFixed(3), yNow: ypr(F_NOW, P).toFixed(1), shareOfMax: (ypr(F_NOW, P) / rp.yMax).toFixed(3), tcScan, PHI };
console.log(JSON.stringify(facts));
if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'ypr', figure(fig1, 'Figure 1. Yield per recruit against fishing mortality, from the paper\'s growth and mortality values with the Yield per recruit tool\'s Beverton-Holt maths (recruitment at age 1 and W∞ scaled to 1000 are our assumptions). Solid: first capture at the paper\'s 2.63 years; dashed: if fish were first caught at 4 years.'));
  md = inject(md, 'growth', figure(fig2, 'Figure 2. The paper\'s von Bertalanffy growth curve (L∞ 39.53 cm, K 0.16, t0 −1.53), with the length at which half the fish are retained by the trawl and the age of fastest weight gain worked out from it.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
