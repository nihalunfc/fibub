// Figures for src/blog/discoveries/reinforced-concrete-noise-barrier-top-edge-optimisation.md, made with the maths of
// the Noise barrier calculator (src/lib/sci/barrier.ts: path difference over the top and the Kurze–Anderson form of
// Maekawa's chart).
// Run: node scripts/blog-figures/reinforced-concrete-noise-barrier-top-edge-optimisation.mjs   (rewrites the charts inside the article)
import fs from 'node:fs';
import { pathDiff, kurzeAnderson, soundSpeed } from '../../src/lib/sci/barrier.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/reinforced-concrete-noise-barrier-top-edge-optimisation.md', import.meta.url);

// Inputs. "Paper": Jovanoska-Mitrevska, Samardzioska and Mickovski (2026), Buildings 16, 745, doi:10.3390/buildings16040745 (CC BY).
const HS = 1, DS = 5;                        // m, paper: source 1 m high, 5 m in front of the barrier
const H1 = 3, H5 = 4.4;                      // m, paper: plain vertical barrier NB1 and the taller vertical NB5
const DR = [7, 14, 21], HR = [1, 3.5, 6];    // m, paper: nine receivers (distance behind the barrier × height)
const F = [100, 125, 160, 200, 250, 315, 400, 500, 630, 800, 1000, 1250, 1600, 2000, 2500, 3150]; // Hz, paper: 1/3-octave bands
const J1 = 687.8, J5 = 641.7;                // dB, paper: objective J (sum over bands of the mean level at the nine receivers)
const C = soundSpeed(20);                    // m/s, our assumption: air at 20 °C (the paper's value is not used here)
const CAP = 30;                              // dB, our choice: high enough that no band is capped, like a numerical model

const RX = DR.flatMap((dr) => HR.map((hr) => ({ dr, hr })));
const il = (hb, r, f) => Math.min(CAP, Math.max(0, kurzeAnderson((2 * pathDiff({ hs: HS, ds: DS, hb, dr: r.dr, hr: r.hr }).delta * f) / C)));

// Per receiver: path differences and the 500 Hz insertion loss for both heights.
const rx = RX.map((r) => ({ ...r, d3: pathDiff({ hs: HS, ds: DS, hb: H1, ...r }).delta, d44: pathDiff({ hs: HS, ds: DS, hb: H5, ...r }).delta, il3: il(H1, r, 500), il44: il(H5, r, 500) }));
// Mean over the nine receivers of the extra loss from the taller barrier, band by band (same averaging as J).
const extra = F.map((f) => RX.reduce((s, r) => s + il(H5, r, f) - il(H1, r, f), 0) / RX.length);
const toolSum = extra.reduce((a, b) => a + b, 0);
const paperPerBand = (J1 - J5) / F.length;

const lx = F.map((f) => +Math.log10(f).toFixed(4));
const xTicks = [100, 200, 500, 1000, 2000].map(Math.log10), xFmt = (t) => { const f = Math.round(10 ** t); return f >= 1000 ? `${f / 1000}k` : String(f); };
const mid = { dr: 14, hr: 3.5 };
const fig1 = chart({
  title: 'Insertion loss behind the barrier, receiver 14 m back and 3.5 m up', xLabel: 'Frequency (Hz, 1/3-octave bands)', yLabel: 'Insertion loss (dB)',
  series: [
    { name: '4.4 m vertical (NB5)', kind: 'line', x: lx, y: F.map((f) => +il(H5, mid, f).toFixed(2)) },
    { name: '3 m vertical (NB1)', kind: 'line', x: lx, y: F.map((f) => +il(H1, mid, f).toFixed(2)), dash: true },
  ],
  xTicks, xFmt, yDomain: [0, 30],
  desc: 'Insertion loss rises with frequency for both barriers; the 4.4 m barrier gives about 5 to 6 dB more than the 3 m one in every band.', height: 290,
});
const fig2 = chart({
  title: 'Extra loss from raising the barrier 3 m to 4.4 m', xLabel: 'Frequency (Hz, 1/3-octave bands)', yLabel: 'Mean extra loss, nine receivers (dB)',
  series: [{ name: 'Tool (Maekawa, Kurze–Anderson)', kind: 'line', x: lx, y: extra.map((e) => +e.toFixed(2)) }],
  xTicks, xFmt, yDomain: [0, 8], hlines: [{ y: +paperPerBand.toFixed(2), text: `Paper's FEM, mean of all bands: ${paperPerBand.toFixed(1)} dB` }],
  desc: `The simple chart predicts about ${(toolSum / F.length).toFixed(1)} dB of extra loss per band from the taller barrier, while the paper's finite-element results average ${paperPerBand.toFixed(1)} dB.`, height: 280,
});

const r3 = (x) => +x.toFixed(3), r1 = (x) => +x.toFixed(1);
console.log(JSON.stringify({ c: r3(C), rx: rx.map((r) => ({ dr: r.dr, hr: r.hr, d3: r3(r.d3), d44: r3(r.d44), il3: r1(r.il3), il44: r1(r.il44) })), extra: extra.map(r1), toolSum: r1(toolSum), toolPerBand: +(toolSum / F.length).toFixed(2), paperSum: r1(J1 - J5), paperPerBand: +paperPerBand.toFixed(2), mid500: [r1(il(H1, mid, 500)), r1(il(H5, mid, 500))], N500mid: r3((2 * rx[4].d3 * 500) / C) }));
if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'il', figure(fig1, 'Figure 1. Insertion loss of the 3 m and 4.4 m plain vertical barriers at the middle receiver, from the Noise barrier calculator\'s maths (Kurze–Anderson form of Maekawa\'s chart, point source, no ground). Geometry from the paper; air at 20 °C assumed.'));
  md = inject(md, 'extra', figure(fig2, 'Figure 2. Extra insertion loss from raising a plain vertical barrier from 3 m to 4.4 m, averaged over the paper\'s nine receivers, band by band (line), against the average per band implied by the paper\'s published objective values (dashed level).'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
