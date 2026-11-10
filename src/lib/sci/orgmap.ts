// Organic reaction map (Learn, #1436): families of carbon compounds as nodes and textbook conversions as arrows,
// with a fewest-steps route finder. 1°, 2° and 3° alcohols and halides are separate nodes so that a route never
// turns a ketone into an aldehyde by mistake. Plain data and graph search, no DOM.

export type Fam = {
  id: string; name: string; short: string; general: string; example: string; exFormula: string;
  x: number; y: number; lv: 11 | 12; aromatic?: boolean;
};
/** dc: what happens to the number of carbons: 0 same, 1 one more, -1 one fewer, 'join' two pieces joined. */
export type Rx = { from: string; to: string; reagent: string; name: string; dc: 0 | 1 | -1 | 'join'; lv: 11 | 12; note?: string };

const X = [45, 130, 215, 300];
export const FAMS: Fam[] = [
  { id: 'alkyne', name: 'Alkyne', short: 'Alkyne', general: 'R–C≡C–H', example: 'propyne', exFormula: 'CH₃C≡CH', x: X[0], y: 30, lv: 11 },
  { id: 'dihalide', name: 'Vicinal dihalide', short: 'Dihalide', general: 'R–CHX–CH₂X', example: '1,2-dibromopropane', exFormula: 'CH₃CHBrCH₂Br', x: X[1], y: 30, lv: 11 },
  { id: 'alkene', name: 'Alkene', short: 'Alkene', general: 'R–CH=CH₂', example: 'propene', exFormula: 'CH₃CH=CH₂', x: X[2], y: 30, lv: 11 },
  { id: 'alkane', name: 'Alkane', short: 'Alkane', general: 'R–H', example: 'propane', exFormula: 'CH₃CH₂CH₃', x: X[3], y: 30, lv: 11 },
  { id: 'halide2', name: 'Secondary (2°) haloalkane', short: '2° halide', general: 'R₂CH–X', example: '2-bromopropane', exFormula: 'CH₃CHBrCH₃', x: X[0], y: 92, lv: 11 },
  { id: 'alcohol2', name: 'Secondary (2°) alcohol', short: '2° alcohol', general: 'R₂CH–OH', example: 'propan-2-ol', exFormula: 'CH₃CH(OH)CH₃', x: X[1], y: 92, lv: 12 },
  { id: 'alcohol1', name: 'Primary (1°) alcohol', short: '1° alcohol', general: 'R–CH₂–OH', example: 'propan-1-ol', exFormula: 'CH₃CH₂CH₂OH', x: X[2], y: 92, lv: 12 },
  { id: 'halide1', name: 'Primary (1°) haloalkane', short: '1° halide', general: 'R–CH₂–X', example: '1-bromopropane', exFormula: 'CH₃CH₂CH₂Br', x: X[3], y: 92, lv: 11 },
  { id: 'ketone', name: 'Ketone', short: 'Ketone', general: 'R–CO–R′', example: 'propanone', exFormula: 'CH₃COCH₃', x: X[0], y: 154, lv: 12 },
  { id: 'alcohol3', name: 'Tertiary (3°) alcohol', short: '3° alcohol', general: 'R₃C–OH', example: '2-methylpropan-2-ol', exFormula: '(CH₃)₃COH', x: X[1], y: 154, lv: 12 },
  { id: 'aldehyde', name: 'Aldehyde', short: 'Aldehyde', general: 'R–CHO', example: 'propanal', exFormula: 'CH₃CH₂CHO', x: X[2], y: 154, lv: 12 },
  { id: 'ether', name: 'Ether', short: 'Ether', general: 'R–O–R′', example: '1-methoxypropane', exFormula: 'CH₃CH₂CH₂OCH₃', x: X[3], y: 154, lv: 12 },
  { id: 'grignard', name: 'Grignard reagent', short: 'Grignard', general: 'R–MgX', example: 'propylmagnesium bromide', exFormula: 'CH₃CH₂CH₂MgBr', x: X[0], y: 216, lv: 12 },
  { id: 'ester', name: 'Ester', short: 'Ester', general: 'R–COO–R′', example: 'ethyl propanoate', exFormula: 'CH₃CH₂COOC₂H₅', x: X[1], y: 216, lv: 12 },
  { id: 'acid', name: 'Carboxylic acid', short: 'Acid', general: 'R–COOH', example: 'propanoic acid', exFormula: 'CH₃CH₂COOH', x: X[2], y: 216, lv: 12 },
  { id: 'nitrile', name: 'Nitrile (cyanide)', short: 'Nitrile', general: 'R–C≡N', example: 'propanenitrile', exFormula: 'CH₃CH₂CN', x: X[3], y: 216, lv: 12 },
  { id: 'amide', name: 'Amide', short: 'Amide', general: 'R–CONH₂', example: 'propanamide', exFormula: 'CH₃CH₂CONH₂', x: X[2], y: 278, lv: 12 },
  { id: 'amine', name: 'Primary (1°) amine', short: '1° amine', general: 'R–CH₂–NH₂', example: 'propan-1-amine', exFormula: 'CH₃CH₂CH₂NH₂', x: X[3], y: 278, lv: 12 },
  { id: 'benzene', name: 'Benzene', short: 'Benzene', general: 'C₆H₆', example: 'benzene', exFormula: 'C₆H₆', x: X[0], y: 350, lv: 11, aromatic: true },
  { id: 'chlorobenzene', name: 'Chlorobenzene (haloarene)', short: 'Chloro-\nbenzene', general: 'C₆H₅Cl', example: 'chlorobenzene', exFormula: 'C₆H₅Cl', x: X[1], y: 350, lv: 11, aromatic: true },
  { id: 'phenol', name: 'Phenol', short: 'Phenol', general: 'C₆H₅OH', example: 'phenol', exFormula: 'C₆H₅OH', x: X[2], y: 350, lv: 12, aromatic: true },
  { id: 'azo', name: 'Azo dye', short: 'Azo dye', general: 'Ar–N=N–Ar′', example: '4-hydroxyazobenzene (orange)', exFormula: 'C₆H₅N=NC₆H₄OH', x: X[3], y: 350, lv: 12, aromatic: true },
  { id: 'nitrobenzene', name: 'Nitrobenzene', short: 'Nitro-\nbenzene', general: 'C₆H₅NO₂', example: 'nitrobenzene', exFormula: 'C₆H₅NO₂', x: X[0], y: 412, lv: 11, aromatic: true },
  { id: 'aniline', name: 'Aniline (aryl amine)', short: 'Aniline', general: 'C₆H₅NH₂', example: 'aniline', exFormula: 'C₆H₅NH₂', x: X[1], y: 412, lv: 12, aromatic: true },
  { id: 'diazonium', name: 'Benzenediazonium salt', short: 'Diazonium', general: 'C₆H₅N₂⁺Cl⁻', example: 'benzenediazonium chloride', exFormula: 'C₆H₅N₂⁺Cl⁻', x: X[2], y: 412, lv: 12, aromatic: true },
];

const R = (from: string, to: string, reagent: string, name: string, dc: Rx['dc'] = 0, lv: 11 | 12 = 12, note?: string): Rx => ({ from, to, reagent, name, dc, lv, note });
export const RXNS: Rx[] = [
  // Hydrocarbons (Class 11)
  R('alkyne', 'alkene', 'H₂, Pd/BaSO₄ (Lindlar catalyst)', 'partial hydrogenation', 0, 11),
  R('alkyne', 'alkane', 'excess H₂, Ni (or Pt)', 'hydrogenation', 0, 11),
  R('alkene', 'alkane', 'H₂, Ni (or Pt, Pd), heat', 'hydrogenation', 0, 11),
  R('alkene', 'dihalide', 'Br₂ in CCl₄', 'addition of halogen (bromine water is decolourised)', 0, 11),
  R('dihalide', 'alkyne', 'alcoholic KOH, then NaNH₂', 'double dehydrohalogenation', 0, 11),
  R('alkene', 'halide2', 'HBr', 'addition, Markovnikov’s rule (H goes to the carbon that already has more H)', 0, 11),
  R('alkene', 'halide1', 'HBr with a peroxide', 'anti-Markovnikov addition (peroxide effect)', 0, 11),
  R('alkane', 'halide1', 'Cl₂ or Br₂, sunlight (hν)', 'free-radical substitution', 0, 11, 'gives a mixture of products'),
  R('alkane', 'halide2', 'Br₂, sunlight (hν)', 'free-radical substitution', 0, 11, 'a mixture; bromine mostly replaces an H on the 2° carbon'),
  R('halide1', 'alkene', 'alcoholic KOH, heat', 'dehydrohalogenation (β-elimination)', 0, 11),
  R('halide2', 'alkene', 'alcoholic KOH, heat', 'dehydrohalogenation (Saytzeff product)', 0, 11),
  R('alkyne', 'ketone', 'H₂O, HgSO₄ + dil. H₂SO₄, 333 K', 'hydration of an alkyne', 0, 11, 'ethyne gives ethanal (an aldehyde); other end-of-chain alkynes give methyl ketones'),
  R('acid', 'alkane', 'soda lime (NaOH + CaO), heat, on the sodium salt', 'decarboxylation', -1, 11, 'loses one carbon as CO₂'),
  // Haloalkanes and alcohols (Class 12)
  R('halide1', 'alcohol1', 'aqueous KOH (or moist Ag₂O)', 'nucleophilic substitution', 0),
  R('halide2', 'alcohol2', 'aqueous KOH', 'nucleophilic substitution', 0),
  R('alcohol1', 'halide1', 'SOCl₂ (or PCl₅, PBr₃, or HCl + ZnCl₂)', 'replacing –OH by a halogen', 0),
  R('alcohol2', 'halide2', 'SOCl₂ (or PCl₅, PBr₃, or HCl + ZnCl₂)', 'replacing –OH by a halogen', 0),
  R('alcohol3', 'alkene', 'conc. H₂SO₄ or 85 % H₃PO₄, 358 K', 'dehydration (easiest for 3° alcohols)', 0),
  R('alkene', 'alcohol2', 'H₂O with dil. H₂SO₄', 'acid-catalysed hydration (Markovnikov)', 0),
  R('alkene', 'alcohol1', 'B₂H₆, then H₂O₂ and NaOH', 'hydroboration–oxidation (anti-Markovnikov)', 0),
  R('alcohol1', 'alkene', 'conc. H₂SO₄, 443 K', 'dehydration', 0),
  R('alcohol2', 'alkene', 'conc. H₂SO₄, 443 K', 'dehydration', 0),
  R('alcohol1', 'ether', 'excess alcohol, conc. H₂SO₄, 413 K', 'dehydration between two molecules', 'join', 12, 'makes a symmetrical ether such as ethoxyethane'),
  R('halide1', 'ether', 'sodium alkoxide (R′O⁻Na⁺)', 'Williamson synthesis', 'join'),
  R('alcohol1', 'aldehyde', 'PCC (or CrO₃ in anhydrous medium)', 'mild oxidation', 0),
  R('alcohol1', 'acid', 'acidified KMnO₄ (or K₂Cr₂O₇ + H₂SO₄)', 'strong oxidation', 0),
  R('alcohol2', 'ketone', 'K₂Cr₂O₇ + dil. H₂SO₄ (or CrO₃)', 'oxidation', 0),
  R('halide1', 'grignard', 'Mg in dry ether', 'making a Grignard reagent', 0),
  R('halide2', 'grignard', 'Mg in dry ether', 'making a Grignard reagent', 0),
  R('grignard', 'alkane', 'H₂O (any source of H⁺)', 'protonation', 0),
  R('grignard', 'alcohol1', 'HCHO (methanal), then H₃O⁺', 'Grignard addition', 1, 12, 'adds one carbon'),
  R('grignard', 'alcohol2', 'an aldehyde R′CHO, then H₃O⁺', 'Grignard addition', 'join'),
  R('grignard', 'alcohol3', 'a ketone R′COR″, then H₃O⁺', 'Grignard addition', 'join'),
  R('grignard', 'acid', 'dry ice (CO₂), then H₃O⁺', 'carboxylation', 1, 12, 'adds one carbon'),
  // Aldehydes, ketones and acids
  R('aldehyde', 'alcohol1', 'NaBH₄ or LiAlH₄ (or H₂, Pd)', 'reduction', 0),
  R('ketone', 'alcohol2', 'NaBH₄ or LiAlH₄ (or H₂, Pd)', 'reduction', 0),
  R('aldehyde', 'acid', 'Tollens’ reagent, or acidified KMnO₄ / K₂Cr₂O₇', 'oxidation', 0),
  R('aldehyde', 'alkane', 'Zn–Hg + conc. HCl (Clemmensen), or NH₂NH₂ then KOH in ethylene glycol (Wolff–Kishner)', 'reduction of C=O to CH₂', 0),
  R('ketone', 'alkane', 'Zn–Hg + conc. HCl (Clemmensen), or NH₂NH₂ then KOH in ethylene glycol (Wolff–Kishner)', 'reduction of C=O to CH₂', 0),
  R('acid', 'alcohol1', 'LiAlH₄ (or B₂H₆), then H₂O', 'reduction', 0),
  R('acid', 'ester', 'an alcohol R′OH with conc. H₂SO₄', 'esterification', 'join'),
  R('ester', 'acid', 'dilute acid (H₃O⁺), heat', 'hydrolysis (the alcohol comes off too)', 0),
  R('acid', 'amide', 'NH₃, then heat the ammonium salt (or SOCl₂ then NH₃)', 'making an amide', 0),
  R('nitrile', 'acid', 'H₃O⁺, heat', 'hydrolysis', 0),
  R('nitrile', 'amine', 'LiAlH₄ (or H₂, Ni, or Na in ethanol)', 'reduction', 0),
  R('halide1', 'nitrile', 'alcoholic KCN', 'nucleophilic substitution', 1, 12, 'adds one carbon, a common way to step up a chain'),
  R('amide', 'amine', 'Br₂ + NaOH', 'Hoffmann bromamide degradation', -1, 12, 'the amine has one carbon fewer than the amide'),
  R('amide', 'nitrile', 'P₄O₁₀ (P₂O₅), heat', 'dehydration', 0),
  R('halide1', 'amine', 'excess alcoholic NH₃, heat (sealed tube)', 'ammonolysis', 0, 12, 'gives a mixture of 1°, 2° and 3° amines'),
  R('amine', 'alcohol1', 'NaNO₂ + HCl (nitrous acid)', 'diazotisation; the aliphatic diazonium salt breaks up', 0, 12, 'N₂ bubbles off; this is also a test for 1° aliphatic amines'),
  // Aromatic
  R('benzene', 'nitrobenzene', 'conc. HNO₃ + conc. H₂SO₄, 323–333 K', 'nitration (electrophilic substitution)', 0, 11),
  R('benzene', 'chlorobenzene', 'Cl₂, anhydrous FeCl₃', 'halogenation (electrophilic substitution)', 0, 11),
  R('benzene', 'ketone', 'CH₃COCl, anhydrous AlCl₃', 'Friedel–Crafts acylation', 'join', 11, 'makes acetophenone, an aromatic ketone'),
  R('nitrobenzene', 'aniline', 'Sn + HCl (or Fe + HCl)', 'reduction', 0),
  R('aniline', 'diazonium', 'NaNO₂ + HCl, 273–278 K (ice cold)', 'diazotisation', 0),
  R('diazonium', 'phenol', 'warm water', 'hydrolysis; N₂ given off', 0),
  R('diazonium', 'chlorobenzene', 'CuCl + HCl', 'Sandmeyer reaction', 0),
  R('diazonium', 'benzene', 'H₃PO₂ (or ethanol)', 'replacing –N₂⁺ by H', 0),
  R('diazonium', 'azo', 'phenol in NaOH, ice cold', 'coupling', 'join', 12, 'gives an orange azo dye; with aniline a yellow one'),
  R('chlorobenzene', 'phenol', 'NaOH, 623 K, 300 atm, then H⁺', 'Dow process (haloarenes are very slow to substitute)', 0),
  R('phenol', 'benzene', 'zinc dust, heat', 'reduction', 0),
];

export const famById = (id: string) => FAMS.find((f) => f.id === id);
export const outOf = (id: string, lv: 11 | 12 = 12) => RXNS.filter((r) => r.from === id && r.lv <= lv);
export const into = (id: string, lv: 11 | 12 = 12) => RXNS.filter((r) => r.to === id && r.lv <= lv);
export const visible = (lv: 11 | 12) => FAMS.filter((f) => f.lv <= lv);

export type RouteOpts = { lv?: 11 | 12; keepCarbons?: boolean };
const usable = (o: RouteOpts) => { const L = o.lv ?? 12; return RXNS.filter((r) => r.lv <= L && famById(r.from)!.lv <= L && famById(r.to)!.lv <= L && (!o.keepCarbons || r.dc === 0)); };

/** Fewest steps from a to b (breadth-first). Returns the list of steps (one reaction per step, the first listed when
 * two reagents join the same pair) or null if no route exists. a === b gives []. */
export function route(a: string, b: string, o: RouteOpts = {}): Rx[] | null {
  if (a === b) return [];
  const edges = usable(o), prev = new Map<string, Rx>(), seen = new Set([a]), queue = [a];
  while (queue.length) {
    const u = queue.shift()!;
    for (const e of edges) if (e.from === u && !seen.has(e.to)) {
      seen.add(e.to); prev.set(e.to, e);
      if (e.to === b) { const out: Rx[] = []; let n = b; while (n !== a) { const p = prev.get(n)!; out.unshift(p); n = p.from; } return out; }
      queue.push(e.to);
    }
  }
  return null;
}
/** Shortest distance in steps, or Infinity. */
export const distance = (a: string, b: string, o: RouteOpts = {}) => { const r = route(a, b, o); return r ? r.length : Infinity; };

/** Every simple route (no family visited twice) from a to b with at most maxLen steps, shortest first, counting
 * each pair of families once (alternative reagents for the same step are shown with the step, not as new routes). */
export function routes(a: string, b: string, maxLen: number, o: RouteOpts = {}, limit = 6): string[][] {
  const edges = usable(o), out: string[][] = [];
  const next = new Map<string, string[]>();
  for (const e of edges) { const l = next.get(e.from) ?? []; if (!l.includes(e.to)) l.push(e.to); next.set(e.from, l); }
  const walk = (path: string[]) => {
    const u = path[path.length - 1];
    if (u === b) { out.push([...path]); return; }
    if (path.length - 1 >= maxLen) return;
    for (const v of next.get(u) ?? []) if (!path.includes(v)) { path.push(v); walk(path); path.pop(); }
  };
  walk([a]);
  return out.sort((x, y) => x.length - y.length || x.join().localeCompare(y.join())).slice(0, limit);
}
/** All reactions that join family a to family b directly. */
export const steps = (a: string, b: string, lv: 11 | 12 = 12) => RXNS.filter((r) => r.from === a && r.to === b && r.lv <= lv);
export const dcText = (dc: Rx['dc']) => (dc === 0 ? '' : dc === 1 ? 'one carbon more' : dc === -1 ? 'one carbon fewer' : 'joins two pieces');
