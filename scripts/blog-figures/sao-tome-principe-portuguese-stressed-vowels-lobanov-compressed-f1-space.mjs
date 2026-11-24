// Figures for src/blog/discoveries/sao-tome-principe-portuguese-stressed-vowels-lobanov-compressed-f1-space.md
// Every number comes from the maths behind the Vowel formant chart tool (src/lib/sci/formant.ts).
// Inputs: the mean F1 and F2 values stated in Balduino and Freitas (2025), Isogloss 11(3), tables 6 and 7
// (STPP varieties PST and PP, and the Brazilian and European Portuguese figures they quote from
// Escudero et al. 2009). Nothing here is copied as a table; we recompute from those means.
import { readFileSync, writeFileSync } from 'node:fs';
import { lobanov, synthVowel, formantTrack, spanFormants } from '../../src/lib/sci/formant.ts';
import { readWav, writeWav } from '../../src/lib/sci/formant-audio.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/sao-tome-principe-portuguese-stressed-vowels-lobanov-compressed-f1-space.md', import.meta.url);

// --- The paper's mean F1 / F2 (Hz) for the seven vowels every variety shares, plus STPP's eighth, [ə].
const V7 = ['i', 'e', 'ɛ', 'a', 'ɔ', 'o', 'u'];
const MEN = {
  PST: { i: [303, 2153], e: [386, 2016], 'ɛ': [504, 1850], 'ə': [530, 1389], a: [625, 1350], 'ɔ': [537, 919], o: [413, 952], u: [339, 937] },
  PP: { i: [253, 2189], e: [366, 2014], 'ɛ': [501, 1886], 'ə': [521, 1466], a: [619, 1393], 'ɔ': [562, 901], o: [397, 889], u: [299, 928] },
  BP: { i: [285, 2198], e: [357, 2028], 'ɛ': [518, 1831], a: [683, 1389], 'ɔ': [532, 927], o: [372, 804], u: [310, 761] },
  EP: { i: [284, 2161], e: [355, 2028], 'ɛ': [455, 1836], a: [661, 1365], 'ɔ': [491, 934], o: [363, 843], u: [303, 814] },
};
const WOMEN = {
  PST: { i: [315, 2091], e: [380, 2037], 'ɛ': [498, 1926], 'ə': [536, 1503], a: [740, 1387], 'ɔ': [547, 934], o: [407, 957], u: [356, 894] },
  PP: { i: [289, 2061], e: [351, 1897], 'ɛ': [573, 1866], a: [733, 1317], 'ɔ': [592, 1162], o: [354, 940], u: [283, 926] },
  BP: { i: [307, 2676], e: [425, 2468], 'ɛ': [646, 2271], a: [910, 1627], 'ɔ': [681, 927], o: [442, 893], u: [337, 812] },
  EP: { i: [313, 2760], e: [402, 2508], 'ɛ': [511, 2360], a: [781, 1662], 'ɔ': [592, 1118], o: [422, 921], u: [335, 862] },
};
const NAMES = ['PST', 'PP', 'BP', 'EP'];
const LABEL = { PST: 'São Tomé (PST)', PP: 'Príncipe (PP)', BP: 'Brazilian (BP)', EP: 'European (EP)' };

// Shoelace area of the closed vowel polygon, in whatever units the points are in.
const polyArea = (pts) => {
  let s = 0;
  for (let i = 0; i < pts.length; i++) { const [x1, y1] = pts[i], [x2, y2] = pts[(i + 1) % pts.length]; s += x1 * y2 - x2 * y1; }
  return Math.abs(s) / 2;
};
const cv = (x) => { const m = x.reduce((a, b) => a + b, 0) / x.length; return Math.sqrt(x.reduce((a, b) => a + (b - m) ** 2, 0) / (x.length - 1)) / m; };

// Lobanov z-scores for the seven shared vowels, each variety treated as one "speaker" (the tool's
// `lobanov(values, groups)` standardises each group's own F1 and F2 separately).
function zSpace(G) {
  const f1 = [], f2 = [], grp = [];
  for (const g of NAMES) for (const v of V7) { f1.push(G[g][v][0]); f2.push(G[g][v][1]); grp.push(g); }
  const z1 = lobanov(f1, grp), z2 = lobanov(f2, grp);
  const out = {};
  NAMES.forEach((g, gi) => { out[g] = {}; V7.forEach((v, i) => { out[g][v] = [z1[gi * V7.length + i], z2[gi * V7.length + i]]; }); });
  return out;
}

const Z_MEN = zSpace(MEN), Z_WOMEN = zSpace(WOMEN);
const ring = (o) => [...V7, V7[0]].map((v) => o[v]);

// A vowel chart: x is minus F2 (so front vowels sit on the left, as linguists draw them), y is F1 downwards.
function vowelChart({ data, title, xLabel, yLabel, fmt, letters, desc }) {
  const series = NAMES.map((g) => ({ name: LABEL[g], x: ring(data[g]).map((p) => -p[1]), y: ring(data[g]).map((p) => p[0]), kind: 'line' }));
  for (const v of V7) series.push({ x: [-letters[v][1]], y: [letters[v][0]], kind: 'dots', size: 0, noLegend: true, label: { text: v, dx: 0, dy: -8, anchor: 'middle' } });
  return chart({ title, xLabel, yLabel, series, yReverse: true, xFmt: fmt, desc, height: 320 });
}

const hzSvg = vowelChart({
  data: WOMEN, title: 'Women: the four vowel spaces in hertz', xLabel: 'F2 (Hz), high to low', yLabel: 'F1 (Hz)',
  fmt: (v) => String(Math.round(-v)), letters: WOMEN.PST,
  desc: 'Mean F1 and F2 in hertz for the seven vowels shared by São Tomé, Príncipe, Brazilian and European Portuguese women. The two island varieties sit inside a much smaller region than the Brazilian and European ones.',
});
const lobSvg = vowelChart({
  data: Z_WOMEN, title: 'Women: the same spaces after Lobanov normalisation', xLabel: 'F2 (z-score), high to low', yLabel: 'F1 (z-score)',
  fmt: (v) => (-v).toFixed(1), letters: Z_WOMEN.PST,
  desc: 'The same four vowel spaces after the tool turns each variety F1 and F2 into z-scores. The four outlines now lie almost on top of one another.',
});

const cvMen = NAMES.map((g) => cv(V7.map((v) => MEN[g][v][0])));
const cvWomen = NAMES.map((g) => cv(V7.map((v) => WOMEN[g][v][0])));
const cvSvg = chart({
  title: 'Scale-free spread of F1 (SD ÷ mean)', xLabel: 'Variety', yLabel: 'Coefficient of variation of F1',
  series: [
    { name: 'Men', x: [1, 2, 3, 4], y: cvMen, kind: 'dots', size: 5 },
    { name: 'Women', x: [1, 2, 3, 4], y: cvWomen, kind: 'dots', size: 5 },
  ],
  xDomain: [0.6, 4.4], xTicks: [1, 2, 3, 4], xFmt: (v) => NAMES[v - 1] ?? '',
  desc: 'The standard deviation of F1 across the seven shared vowels divided by its mean, for men and women in each variety. São Tomé Portuguese is the lowest in both sexes.',
  height: 280,
});

// --- Numbers quoted in the article.
const areaHz = {}, areaZ = {};
for (const g of NAMES) {
  areaHz[g] = { men: polyArea(V7.map((v) => [MEN[g][v][1], MEN[g][v][0]])), women: polyArea(V7.map((v) => [WOMEN[g][v][1], WOMEN[g][v][0]])) };
  areaZ[g] = { men: polyArea(V7.map((v) => [Z_MEN[g][v][1], Z_MEN[g][v][0]])), women: polyArea(V7.map((v) => [Z_WOMEN[g][v][1], Z_WOMEN[g][v][0]])) };
}

// Where does the eighth vowel [ə] sit? Normalise each STPP variety's own eight vowels and measure distances.
function eight(G, g) {
  const V8 = ['i', 'e', 'ɛ', 'ə', 'a', 'ɔ', 'o', 'u'];
  const z1 = lobanov(V8.map((v) => G[g][v][0]), V8.map(() => g));
  const z2 = lobanov(V8.map((v) => G[g][v][1]), V8.map(() => g));
  const at = (v) => [z1[V8.indexOf(v)], z2[V8.indexOf(v)]];
  const d = (a, b) => Math.hypot(at(a)[0] - at(b)[0], at(a)[1] - at(b)[1]);
  return { at, d };
}
const e8men = eight(MEN, 'PST'), e8pp = eight(MEN, 'PP'), e8w = eight(WOMEN, 'PST');

// Can the tool's own LPC measure these vowels back off a sound file? Synthesise [ə] and [a] at the
// paper's São Tomé male means, write a WAV, and track the formants as the tool does.
function recover(F1, F2) {
  const fs = 16000, x = synthVowel([F1, F2, 2500, 3400, 4500], [60, 90, 130, 200, 250], 118, 0.45, fs);
  const wv = readWav(writeWav(x, fs));
  return spanFormants(formantTrack(wv.x, wv.fs, { maxFormant: 5000 }), 0.06, 0.38);
}
const recSchwa = recover(530, 1389), recA = recover(625, 1350);

let md = readFileSync(ART, 'utf8');
md = inject(md, 'hz', figure(hzSvg, 'Figure 1. The paper’s mean F1 and F2 in hertz for the seven vowels every variety shares, women only. São Tomé (PST) and Príncipe (PP) sit inside a much smaller region than the Brazilian (BP) and European (EP) reference values the paper quotes. Letters mark the São Tomé positions.'));
md = inject(md, 'lob', figure(lobSvg, 'Figure 2. The same four spaces after the Vowel formant chart’s Lobanov normalisation, which turns each variety’s F1 and F2 into z-scores. The outlines now nearly coincide: most of the hertz difference was overall scale.'));
md = inject(md, 'cv', figure(cvSvg, 'Figure 3. Spread of F1 across the seven shared vowels, divided by its mean, so a uniform stretch of the whole space cancels out. São Tomé Portuguese is the lowest for both men and women.'));
writeFileSync(ART, md);

const r3 = (v) => Math.round(v * 1000) / 1000;
console.log('areas Hz:', Object.fromEntries(NAMES.map((g) => [g, { men: Math.round(areaHz[g].men), women: Math.round(areaHz[g].women) }])));
console.log('areas z:', Object.fromEntries(NAMES.map((g) => [g, { men: r3(areaZ[g].men), women: r3(areaZ[g].women) }])));
console.log('PST/BP area ratio: women', r3(areaHz.PST.women / areaHz.BP.women), 'men', r3(areaHz.PST.men / areaHz.BP.men));
console.log('z area min/max:', r3(Math.min(...NAMES.flatMap((g) => [areaZ[g].men, areaZ[g].women]))), r3(Math.max(...NAMES.flatMap((g) => [areaZ[g].men, areaZ[g].women]))));
console.log('CV F1 men:', NAMES.map((g, i) => `${g} ${r3(cvMen[i])}`).join(' '), '| women:', NAMES.map((g, i) => `${g} ${r3(cvWomen[i])}`).join(' '));
console.log('CV F2 men:', NAMES.map((g) => `${g} ${r3(cv(V7.map((v) => MEN[g][v][1])))}`).join(' '), '| women:', NAMES.map((g) => `${g} ${r3(cv(V7.map((v) => WOMEN[g][v][1])))}`).join(' '));
console.log('largest per-vowel z gap PST vs BP (women):', r3(Math.max(...V7.map((v) => Math.hypot(Z_WOMEN.PST[v][0] - Z_WOMEN.BP[v][0], Z_WOMEN.PST[v][1] - Z_WOMEN.BP[v][1])))));
for (const [tag, e] of [['PST men', e8men], ['PP men', e8pp], ['PST women', e8w]]) {
  console.log(tag, 'schwa z', e.at('ə').map(r3), 'd(ə,a)', r3(e.d('ə', 'a')), 'd(ə,ɛ)', r3(e.d('ə', 'ɛ')), 'd(ɛ,a)', r3(e.d('ɛ', 'a')), 'd(e,ɛ)', r3(e.d('e', 'ɛ')));
}
console.log('LPC recovery [ə] 530/1389 ->', recSchwa.F.slice(0, 3).map((v) => Math.round(v * 10) / 10), 'frames', recSchwa.frames);
console.log('LPC recovery [a] 625/1350 ->', recA.F.slice(0, 3).map((v) => Math.round(v * 10) / 10));
