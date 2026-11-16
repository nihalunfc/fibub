// "Solve my numbers" for map scales (Class 7 to 10): real distance from a map distance, map distance from a real one,
// the scale from a map and real distance, a "1 cm = 2 km" statement as a ratio 1 : N, and map area to real area.
// An inch is exactly 2.54 cm and a mile exactly 1609.344 m (international definitions). No DOM.
import { sf as sf3, type SSpec, type SIn, type SOut } from '../learn/solvecore-b.ts';

const sf = (x: number, n = 4) => sf3(x, n);
const MAPU: [string, number][] = [['cm', 0.01], ['mm', 0.001], ['in', 0.0254], ['m', 1]];
const REALU: [string, number][] = [['km', 1000], ['m', 1], ['mi', 1609.344], ['cm', 0.01]];
const AREAU: [string, number][] = [['cm²', 1e-4], ['mm²', 1e-6], ['in²', 0.0254 ** 2], ['m²', 1]];
const grp = (x: number, n = 4) => (Math.abs(x) >= 1e4 && Math.abs(x) < 1e15 && Math.abs(x - Math.round(x)) < 1e-6 ? Math.round(x).toLocaleString('en').replace(/,/g, ' ') : sf(x, n));
const ratio = (N: number) => `1 : ${grp(N, 6)}`;
const bestLen = (m: number) => (m >= 1000 ? `${sf(m / 1000)} km` : m >= 1 ? `${sf(m)} m` : `${sf(m * 100)} cm`);
const inMiles = (m: number) => (m >= 1609.344 / 4 ? ` (about ${sf(m / 1609.344, 3)} miles)` : '');

export function solveMapScale(i: Record<string, SIn>, c: { find: string }): SOut {
  const f = c.find;
  if (f === 'stmt') {
    const s = i.su, r = i.sr;
    if (!(s.v > 0) || !(r.v > 0)) return { error: 'Both lengths must be more than 0.' };
    const N = r.v / s.v;
    return { answer: `${sf(s.typed)} ${s.u} on the map = ${sf(r.typed)} ${r.u} in real life, so the scale is ${ratio(N)}.`, lines: [`Change both lengths to the same unit, centimetres: ${sf(s.typed)} ${s.u} = ${sf(s.v * 100, 6)} cm and ${sf(r.typed)} ${r.u} = ${grp(r.v * 100, 6)} cm`, `Scale = map : real = ${sf(s.v * 100, 6)} : ${grp(r.v * 100, 6)}`, `Divide both by ${sf(s.v * 100, 6)} to make the first term 1: 1 : ${grp(N, 6)}`], tip: 'Common mistake: writing 1 : 2 for "1 cm = 2 km". The units must match first: 2 km is 200 000 cm, so the scale is 1 : 200 000.' };
  }
  const N = i.N ? i.N.v : NaN;
  if (f === 'scale') {
    const m = i.mlen, r = i.rlen;
    if (!(m.v > 0) || !(r.v > 0)) return { error: 'Both distances must be more than 0.' };
    const n = r.v / m.v;
    return { answer: `The scale is ${ratio(n)}.`, lines: [`Make the units equal (centimetres): map ${sf(m.typed)} ${m.u} = ${sf(m.v * 100, 6)} cm, real ${sf(r.typed)} ${r.u} = ${grp(r.v * 100, 6)} cm`, `Scale = map : real = ${sf(m.v * 100, 6)} : ${grp(r.v * 100, 6)}`, `Divide by ${sf(m.v * 100, 6)}: 1 : ${grp(n, 6)}`, `So 1 cm on the map is ${grp(n, 6)} cm in real life = ${bestLen(n / 100)}.`], tip: 'The scale has no units. 1 : 50 000 means 1 of anything on the map is 50 000 of the same thing in real life.' };
  }
  if (!(N > 0)) return { error: 'The scale number N (in 1 : N) must be more than 0.' };
  const enlarge = N < 1 ? ` A scale of 1 : ${sf(N)} is an enlargement: the map is bigger than real life.` : '';
  if (f === 'real') {
    const m = i.mlen; if (!(m.v >= 0)) return { error: 'The map distance cannot be negative.' };
    const mcm = m.v * 100, realcm = mcm * N, real = realcm / 100;
    return { answer: `The real distance is ${bestLen(real)}${inMiles(real)}.`, lines: [`Scale 1 : ${grp(N, 6)} means 1 cm on the map is ${grp(N, 6)} cm in real life.`, `Map distance = ${sf(m.typed)} ${m.u}${m.u === 'cm' ? '' : ` = ${sf(mcm, 6)} cm`}`, `Real distance = ${sf(mcm, 6)} × ${grp(N, 6)} = ${grp(realcm, 6)} cm`, `${grp(realcm, 6)} cm ÷ 100 = ${sf(real, 6)} m${real >= 1000 ? `, ÷ 1000 = ${sf(real / 1000, 6)} km` : ''}`], tip: `Common mistake: leaving the answer in centimetres. Divide by 100 for metres and by 100 000 for kilometres.${enlarge}` };
  }
  if (f === 'map') {
    const r = i.rlen; if (!(r.v >= 0)) return { error: 'The real distance cannot be negative.' };
    const realcm = r.v * 100, mapcm = realcm / N;
    return { answer: `On the map it is ${sf(mapcm)} cm (${sf(mapcm * 10)} mm).`, lines: [`Real distance = ${sf(r.typed)} ${r.u}${r.u === 'cm' ? '' : ` = ${grp(realcm, 6)} cm`}`, `Scale 1 : ${grp(N, 6)}, so map distance = real ÷ ${grp(N, 6)}`, `Map distance = ${grp(realcm, 6)} ÷ ${grp(N, 6)} = ${sf(mapcm, 6)} cm`], tip: `Common mistake: multiplying instead of dividing. Going from real to map makes the distance smaller (divide by N).${enlarge}` };
  }
  // area
  const a = i.mar; if (!(a.v >= 0)) return { error: 'The map area cannot be negative.' };
  const cm2 = a.v * 1e4, real2cm = cm2 * N * N, m2 = real2cm / 1e4;
  return { answer: `The real area is ${grp(m2)} m² = ${sf(m2 / 1e4)} hectares = ${sf(m2 / 1e6)} km².`, lines: ['Areas scale with the square of the length scale: if lengths are N times bigger, areas are N² times bigger.', `Map area = ${sf(a.typed)} ${a.u}${a.u === 'cm²' ? '' : ` = ${sf(cm2, 6)} cm²`}`, `Real area = ${sf(cm2, 6)} × ${grp(N, 6)}² = ${sf(cm2, 6)} × ${grp(N * N, 6)} = ${grp(real2cm, 6)} cm²`, `${grp(real2cm, 6)} cm² ÷ 10 000 = ${grp(m2, 6)} m²; 1 hectare = 10 000 m², 1 km² = 1 000 000 m²`], tip: 'Common mistake: multiplying the area by N instead of N². For 1 : 25 000, 1 cm² on the map is 625 000 000 cm² = 6.25 hectares.' };
}

export const MAPSCALE_SPEC: SSpec = {
  id: 'mapscale',
  finds: [['real', 'Real distance from a map distance'], ['map', 'Map distance from a real distance'], ['scale', 'Scale from a map and real distance'], ['stmt', 'Turn "1 cm = 2 km" into 1 : N'], ['area', 'Real area from a map area']],
  fields: [
    { k: 'N', label: 'Scale 1 : N, N is', ph: 'e.g. 50000', show: (c) => ['real', 'map', 'area'].includes(c.find) },
    { k: 'mlen', label: 'Map distance', units: MAPU, ph: 'e.g. 7.5', show: (c) => c.find === 'real' || c.find === 'scale' },
    { k: 'rlen', label: 'Real distance', units: REALU, ph: 'e.g. 12', show: (c) => c.find === 'map' || c.find === 'scale' },
    { k: 'mar', label: 'Map area', units: AREAU, ph: 'e.g. 8', show: (c) => c.find === 'area' },
    { k: 'su', label: 'On the map', units: MAPU, ph: 'e.g. 1', show: (c) => c.find === 'stmt' },
    { k: 'sr', label: 'In real life', units: REALU, ph: 'e.g. 2', show: (c) => c.find === 'stmt' },
  ],
  presets: [
    { name: '7.5 cm on a 1 : 50 000 map', find: 'real', vals: { N: '50000', mlen: '7.5' } },
    { name: '12 km on a 1 : 250 000 map', find: 'map', vals: { N: '250000', rlen: '12' } },
    { name: '4 cm on the map is 2 km on the ground', find: 'scale', vals: { mlen: '4', rlen: ['2', 'km'] } },
    { name: '1 cm = 2 km as a ratio', find: 'stmt', vals: { su: '1', sr: '2' } },
    { name: '8 cm² of map at 1 : 25 000', find: 'area', vals: { N: '25000', mar: '8' } },
  ],
  solve: (i, c) => solveMapScale(i, c),
};
