// Infrared spectra: a table of characteristic absorption bands of common functional groups, matching measured peaks
// to it, suggesting groups that need several bands together, peak picking on a %T or absorbance spectrum, and unit
// conversions. Ranges are general textbook knowledge, written and rounded to 10 cm⁻¹ by fibub; real positions
// shift with conjugation, ring strain, hydrogen bonding and the state of the sample.

export type Band = { id: string; lo: number; hi: number; bond: string; group: string; strength: 's' | 'm' | 'w' | 'v'; shape?: 'broad' | 'sharp' | 'two'; note?: string };

export const BANDS: Band[] = [
  { id: 'OH-free', lo: 3580, hi: 3650, bond: 'O–H (free)', group: 'alcohol or phenol, dilute', strength: 'm', shape: 'sharp' },
  { id: 'OH-alc', lo: 3200, hi: 3550, bond: 'O–H (H-bonded)', group: 'alcohol or phenol', strength: 's', shape: 'broad' },
  { id: 'OH-acid', lo: 2500, hi: 3300, bond: 'O–H (acid dimer)', group: 'carboxylic acid', strength: 's', shape: 'broad', note: 'very broad, often with C–H peaks sitting on top' },
  { id: 'NH-amine', lo: 3300, hi: 3500, bond: 'N–H', group: 'amine or amide', strength: 'm', note: 'two peaks for NH₂, one for NH' },
  { id: 'NH-amide', lo: 3100, hi: 3350, bond: 'N–H (H-bonded)', group: 'amide', strength: 'm', shape: 'broad' },
  { id: 'CH-alkyne', lo: 3260, hi: 3330, bond: '≡C–H', group: 'terminal alkyne', strength: 's', shape: 'sharp' },
  { id: 'CH-arom', lo: 3000, hi: 3100, bond: '=C–H (aromatic)', group: 'aromatic ring', strength: 'w' },
  { id: 'CH-alkene', lo: 3010, hi: 3100, bond: '=C–H', group: 'alkene', strength: 'm' },
  { id: 'CH-alkane', lo: 2850, hi: 2970, bond: 'C–H (sp³)', group: 'alkyl (CH₃, CH₂)', strength: 's' },
  { id: 'CH-ald', lo: 2700, hi: 2860, bond: 'O=C–H', group: 'aldehyde', strength: 'w', shape: 'two', note: 'a pair near 2820 and 2720 (Fermi doublet)' },
  { id: 'SH', lo: 2550, hi: 2600, bond: 'S–H', group: 'thiol', strength: 'w' },
  { id: 'CO2', lo: 2330, hi: 2370, bond: 'O=C=O', group: 'carbon dioxide in the beam (background)', strength: 'm', note: 'usually a background artefact' },
  { id: 'CN', lo: 2210, hi: 2260, bond: 'C≡N', group: 'nitrile', strength: 'm', shape: 'sharp' },
  { id: 'NCO', lo: 2250, hi: 2280, bond: 'N=C=O', group: 'isocyanate', strength: 's', shape: 'broad' },
  { id: 'CC-triple', lo: 2100, hi: 2260, bond: 'C≡C', group: 'alkyne', strength: 'w', note: 'weak or missing when the alkyne is symmetrical' },
  { id: 'N3', lo: 2080, hi: 2160, bond: 'N=N=N', group: 'azide', strength: 's' },
  { id: 'CO-anh-hi', lo: 1800, hi: 1840, bond: 'C=O (higher)', group: 'anhydride', strength: 's', note: 'with a second C=O about 60 cm⁻¹ lower' },
  { id: 'CO-anh-lo', lo: 1740, hi: 1780, bond: 'C=O (lower)', group: 'anhydride', strength: 's' },
  { id: 'CO-acylCl', lo: 1770, hi: 1820, bond: 'C=O', group: 'acid chloride', strength: 's' },
  { id: 'CO-lactone', lo: 1760, hi: 1790, bond: 'C=O', group: 'γ-lactone or vinyl / phenyl ester', strength: 's' },
  { id: 'CO-ester', lo: 1730, hi: 1750, bond: 'C=O', group: 'ester', strength: 's' },
  { id: 'CO-ald', lo: 1720, hi: 1740, bond: 'C=O', group: 'aldehyde', strength: 's' },
  { id: 'CO-ketone', lo: 1705, hi: 1725, bond: 'C=O', group: 'ketone', strength: 's' },
  { id: 'CO-acid', lo: 1700, hi: 1725, bond: 'C=O', group: 'carboxylic acid', strength: 's' },
  { id: 'CO-conj', lo: 1660, hi: 1700, bond: 'C=O (conjugated)', group: 'conjugated or aryl ketone, aldehyde or acid', strength: 's', note: 'conjugation lowers C=O by about 20–40 cm⁻¹' },
  { id: 'CO-amide', lo: 1630, hi: 1690, bond: 'C=O (amide I)', group: 'amide', strength: 's' },
  { id: 'NH-bend', lo: 1510, hi: 1650, bond: 'N–H bend (amide II)', group: 'amide or primary amine', strength: 'm' },
  { id: 'CC-alkene', lo: 1620, hi: 1680, bond: 'C=C', group: 'alkene', strength: 'v', note: 'weak when the alkene is symmetrical' },
  { id: 'CC-arom1', lo: 1580, hi: 1620, bond: 'C=C (ring)', group: 'aromatic ring', strength: 'm' },
  { id: 'CC-arom2', lo: 1450, hi: 1520, bond: 'C=C (ring)', group: 'aromatic ring', strength: 'm' },
  { id: 'CN-imine', lo: 1640, hi: 1690, bond: 'C=N', group: 'imine or oxime', strength: 'v' },
  { id: 'NO2-as', lo: 1515, hi: 1560, bond: 'N=O (asymmetric)', group: 'nitro', strength: 's' },
  { id: 'NO2-s', lo: 1335, hi: 1370, bond: 'N=O (symmetric)', group: 'nitro', strength: 's' },
  { id: 'CH-bend', lo: 1430, hi: 1470, bond: 'C–H bend (CH₂, CH₃)', group: 'alkyl', strength: 'm' },
  { id: 'CH3-umb', lo: 1370, hi: 1390, bond: 'C–H bend (CH₃)', group: 'methyl', strength: 'm', note: 'split into two for isopropyl and tert-butyl' },
  { id: 'SO2-as', lo: 1300, hi: 1370, bond: 'S=O (asymmetric)', group: 'sulfone or sulfonamide', strength: 's' },
  { id: 'SO2-s', lo: 1120, hi: 1180, bond: 'S=O (symmetric)', group: 'sulfone or sulfonamide', strength: 's' },
  { id: 'SO', lo: 1030, hi: 1070, bond: 'S=O', group: 'sulfoxide', strength: 's' },
  { id: 'CO-ester-CO', lo: 1150, hi: 1300, bond: 'C–O (C(=O)–O)', group: 'ester', strength: 's' },
  { id: 'CO-acid-CO', lo: 1210, hi: 1320, bond: 'C–O', group: 'carboxylic acid', strength: 's' },
  { id: 'CO-ether', lo: 1050, hi: 1150, bond: 'C–O–C', group: 'ether', strength: 's' },
  { id: 'CO-arylether', lo: 1200, hi: 1275, bond: 'aryl C–O', group: 'aryl ether or phenol', strength: 's' },
  { id: 'CO-alc', lo: 1000, hi: 1260, bond: 'C–O', group: 'alcohol', strength: 's', note: 'primary near 1050, secondary 1100, tertiary 1150' },
  { id: 'CN-amine', lo: 1020, hi: 1250, bond: 'C–N', group: 'amine', strength: 'm' },
  { id: 'CF', lo: 1000, hi: 1400, bond: 'C–F', group: 'fluoro compound', strength: 's' },
  { id: 'SiO', lo: 1000, hi: 1100, bond: 'Si–O–Si', group: 'siloxane or silica', strength: 's', shape: 'broad' },
  { id: 'oop-alkene', lo: 890, hi: 1000, bond: '=C–H out of plane', group: 'alkene (substitution pattern)', strength: 's' },
  { id: 'oop-arom', lo: 690, hi: 900, bond: 'aromatic C–H out of plane', group: 'aromatic ring (substitution pattern)', strength: 's', note: 'monosubstituted: two bands near 750 and 700' },
  { id: 'CCl', lo: 550, hi: 850, bond: 'C–Cl', group: 'chloro compound', strength: 's' },
  { id: 'CBr', lo: 500, hi: 690, bond: 'C–Br', group: 'bromo compound', strength: 's' },
];

/** Groups recognised from several bands together: all of `need` (any one band id from each inner list), and none of `not`. */
export const GROUPS: { name: string; need: string[][]; not?: string[][]; hint: string }[] = [
  { name: 'Carboxylic acid', need: [['OH-acid'], ['CO-acid', 'CO-conj']], hint: 'very broad O–H from 2500 to 3300 together with C=O near 1710' },
  { name: 'Ester', need: [['CO-ester', 'CO-lactone', 'CO-conj'], ['CO-ester-CO']], not: [['OH-acid']], hint: 'C=O near 1740 with strong C–O between 1150 and 1300, and no broad O–H' },
  { name: 'Aldehyde', need: [['CO-ald', 'CO-conj'], ['CH-ald']], hint: 'C=O near 1730 with the pair of weak C–H bands near 2820 and 2720' },
  { name: 'Ketone', need: [['CO-ketone', 'CO-conj']], not: [['OH-acid'], ['CH-ald'], ['CO-ester-CO'], ['NH-amide', 'NH-amine']], hint: 'C=O near 1715 with no O–H, aldehyde C–H, ester C–O or N–H' },
  { name: 'Amide', need: [['CO-amide'], ['NH-amine', 'NH-amide', 'NH-bend']], hint: 'C=O (amide I) near 1650 with N–H stretch or bend' },
  { name: 'Anhydride', need: [['CO-anh-hi'], ['CO-anh-lo']], hint: 'two C=O bands, near 1820 and 1760' },
  { name: 'Acid chloride', need: [['CO-acylCl']], not: [['CO-anh-lo']], hint: 'one high C=O near 1800' },
  { name: 'Alcohol or phenol', need: [['OH-alc', 'OH-free'], ['CO-alc', 'CO-arylether']], not: [['OH-acid']], hint: 'broad O–H near 3300 with C–O between 1000 and 1260' },
  { name: 'Amine', need: [['NH-amine'], ['CN-amine']], not: [['CO-amide']], hint: 'N–H near 3300 to 3500 (two peaks for NH₂) with C–N, and no amide C=O' },
  { name: 'Nitrile', need: [['CN']], hint: 'sharp band near 2250' },
  { name: 'Terminal alkyne', need: [['CH-alkyne'], ['CC-triple']], hint: 'sharp ≡C–H near 3300 with C≡C near 2120' },
  { name: 'Alkene', need: [['CH-alkene'], ['CC-alkene']], hint: '=C–H just above 3000 with C=C near 1650' },
  { name: 'Aromatic ring', need: [['CH-arom'], ['CC-arom1', 'CC-arom2']], hint: '=C–H just above 3000 with ring bands near 1600 and 1500' },
  { name: 'Nitro', need: [['NO2-as'], ['NO2-s']], hint: 'two strong bands near 1530 and 1350' },
  { name: 'Ether', need: [['CO-ether', 'CO-arylether']], not: [['OH-alc', 'OH-acid'], ['CO-ester', 'CO-ketone', 'CO-ald', 'CO-acid', 'CO-amide', 'CO-conj']], hint: 'strong C–O near 1100 with no O–H or C=O' },
  { name: 'Sulfone or sulfonamide', need: [['SO2-as'], ['SO2-s']], hint: 'two strong S=O bands near 1330 and 1150' },
  { name: 'Alkyl chain', need: [['CH-alkane'], ['CH-bend', 'CH3-umb']], hint: 'C–H just below 3000 with bends near 1460 and 1380' },
];

export const toMicron = (cm: number) => 1e4 / cm;
export const fromMicron = (um: number) => 1e4 / um;
export const toTransmittance = (A: number) => 100 * 10 ** -A;
export const toAbsorbance = (T: number) => -Math.log10(Math.max(T, 1e-6) / 100);

/** Bands containing a peak at wavenumber w, with a tolerance in cm⁻¹. The very broad acid O–H only counts for a broad peak. */
export const bandsAt = (w: number, tol = 10, broad = false) => BANDS.filter((b) => w >= b.lo - tol && w <= b.hi + tol && (b.id !== 'OH-acid' || broad));

export type Peak = { x: number; broad?: boolean };

/** For each peak, the bands it could be; then each group scored. */
export function assign(peaks: Peak[], tol = 10) {
  const perPeak = peaks.map((p) => ({ peak: p.x, broad: !!p.broad, bands: bandsAt(p.x, tol, !!p.broad) }));
  const hit = new Set(perPeak.flatMap((p) => p.bands.map((b) => b.id)));
  const groups = GROUPS.map((g) => {
    const met = g.need.filter((alts) => alts.some((id) => hit.has(id))).length;
    const blocked = (g.not ?? []).some((alts) => alts.some((id) => hit.has(id)));
    return { name: g.name, hint: g.hint, met, total: g.need.length, likely: met === g.need.length && !blocked, blocked };
  }).filter((g) => g.met > 0).sort((a, b) => Number(b.likely) - Number(a.likely) || b.met / b.total - a.met / a.total || b.total - a.total);
  return { perPeak, groups };
}

/**
 * Peaks typed or pasted: one per line or separated by commas, such as "3350 (br, s), 1715 (s), 1240".
 * "br" or "broad" marks a broad band; a range such as "3300–2500 br" counts as one broad peak at its middle.
 */
export function parseIR(text: string): Peak[] {
  const items: string[] = []; let depth = 0, cur = '';
  for (const ch of text) { if (ch === '(') depth++; if (ch === ')') depth = Math.max(0, depth - 1); if ((ch === ',' || ch === ';' || ch === '\n') && depth === 0) { items.push(cur); cur = ''; } else cur += ch; }
  items.push(cur);
  const out: Peak[] = [];
  for (const it of items) {
    const r = it.match(/(\d{3,4}(?:\.\d+)?)\s*[–—-]\s*(\d{3,4}(?:\.\d+)?)/), broad = /\bbr\b|broad|\bbr\.|\(br/i.test(it);
    if (r) { const a = +r[1], b = +r[2]; if (a >= 300 && a <= 5000 && b >= 300 && b <= 5000) out.push({ x: Math.round((a + b) / 2), broad: true }); continue; }
    const m = it.match(/\d{3,4}(?:\.\d+)?/); if (!m) continue;
    const x = +m[0]; if (x >= 300 && x <= 5000) out.push({ x, broad });
  }
  return out;
}

/**
 * Absorption peaks of a spectrum: minima of %T (or maxima of absorbance) at least `prominence` (fraction of the
 * range) deep compared with both neighbouring maxima, within 400 to 4000 cm⁻¹. Sorted high to low wavenumber.
 */
export function pickPeaks(x: number[], y: number[], transmittance: boolean, prominence = 0.05) {
  const a = transmittance ? y.map((v) => -v) : y, n = a.length, out: { x: number; y: number; depth: number; width: number }[] = [];
  const range = Math.max(...a) - Math.min(...a) || 1;
  for (let i = 1; i < n - 1; i++) {
    if (!(a[i] > a[i - 1] && a[i] >= a[i + 1])) continue;
    let l = a[i], r = a[i];
    for (let j = i - 1; j >= 0 && a[j] <= a[i]; j--) l = Math.min(l, a[j]);
    for (let j = i + 1; j < n && a[j] <= a[i]; j++) r = Math.min(r, a[j]);
    const depth = (a[i] - Math.max(l, r)) / range;
    if (depth < prominence) continue;
    // Full width at half depth, to tell broad bands (O–H, N–H) from sharp ones.
    const half = a[i] - (a[i] - Math.max(l, r)) / 2; let jl = i, jr = i;
    while (jl > 0 && a[jl] > half) jl--; while (jr < n - 1 && a[jr] > half) jr++;
    out.push({ x: x[i], y: y[i], depth, width: Math.abs(x[jr] - x[jl]) });
  }
  return out.sort((p, q) => q.x - p.x);
}

/** A simulated %T spectrum of ethyl acetate-like ester with an alkyl chain, for the example (made by fibub). */
export function exampleSpectrum() {
  const bands: [number, number, number][] = [[2984, 0.35, 30], [2940, 0.22, 25], [1742, 0.95, 22], [1447, 0.25, 18], [1373, 0.45, 14], [1240, 0.9, 30], [1047, 0.55, 20], [938, 0.18, 12], [847, 0.15, 12]];
  const x: number[] = [], y: number[] = [];
  for (let w = 4000; w >= 500; w -= 4) {
    let A = 0.02 + 0.00001 * (4000 - w) / 10;
    for (const [c, h, fw] of bands) A += h * Math.exp(-4 * Math.LN2 * ((w - c) / fw) ** 2);
    x.push(w); y.push(+(100 * 10 ** -A + 0.3 * Math.sin(w / 7)).toFixed(2));
  }
  return { x, y };
}
