// Matter sorter (Learn #1220): everyday things as the particles they are made of. Whether a thing is an
// element, a compound or a mixture is worked out from its particles, never typed in by hand:
//   one kind of particle made of one kind of atom          → element
//   one kind of particle made of two or more kinds of atom → compound
//   two or more kinds of particle                          → mixture
// Plain TypeScript, no DOM.

export type Look = 'atom' | 'molecule' | 'lattice';
export type Species = {
  id: string; name: string; formula: string;
  /** Atoms in one particle (molecule or formula unit). */
  atoms: Record<string, number>;
  look: Look;
  /** Atoms drawn for one particle, first one in the middle (big molecules are simplified). */
  pic: string[];
};
export const SPECIES: Record<string, Species> = {
  O2: { id: 'O2', name: 'oxygen', formula: 'O₂', atoms: { O: 2 }, look: 'molecule', pic: ['O', 'O'] },
  N2: { id: 'N2', name: 'nitrogen', formula: 'N₂', atoms: { N: 2 }, look: 'molecule', pic: ['N', 'N'] },
  Ar: { id: 'Ar', name: 'argon', formula: 'Ar', atoms: { Ar: 1 }, look: 'atom', pic: ['Ar'] },
  He: { id: 'He', name: 'helium', formula: 'He', atoms: { He: 1 }, look: 'atom', pic: ['He'] },
  Fe: { id: 'Fe', name: 'iron', formula: 'Fe', atoms: { Fe: 1 }, look: 'lattice', pic: ['Fe'] },
  Cu: { id: 'Cu', name: 'copper', formula: 'Cu', atoms: { Cu: 1 }, look: 'lattice', pic: ['Cu'] },
  Zn: { id: 'Zn', name: 'zinc', formula: 'Zn', atoms: { Zn: 1 }, look: 'lattice', pic: ['Zn'] },
  Au: { id: 'Au', name: 'gold', formula: 'Au', atoms: { Au: 1 }, look: 'lattice', pic: ['Au'] },
  Al: { id: 'Al', name: 'aluminium', formula: 'Al', atoms: { Al: 1 }, look: 'lattice', pic: ['Al'] },
  C: { id: 'C', name: 'carbon', formula: 'C', atoms: { C: 1 }, look: 'lattice', pic: ['C'] },
  S8: { id: 'S8', name: 'sulphur', formula: 'S₈', atoms: { S: 8 }, look: 'molecule', pic: ['S', 'S', 'S', 'S', 'S', 'S'] },
  H2O: { id: 'H2O', name: 'water', formula: 'H₂O', atoms: { H: 2, O: 1 }, look: 'molecule', pic: ['O', 'H', 'H'] },
  CO2: { id: 'CO2', name: 'carbon dioxide', formula: 'CO₂', atoms: { C: 1, O: 2 }, look: 'molecule', pic: ['C', 'O', 'O'] },
  NaCl: { id: 'NaCl', name: 'sodium chloride', formula: 'NaCl', atoms: { Na: 1, Cl: 1 }, look: 'lattice', pic: ['Na', 'Cl'] },
  sugar: { id: 'sugar', name: 'sucrose', formula: 'C₁₂H₂₂O₁₁', atoms: { C: 12, H: 22, O: 11 }, look: 'molecule', pic: ['C', 'O', 'C', 'H', 'O', 'H'] },
  NaHCO3: { id: 'NaHCO3', name: 'sodium hydrogencarbonate', formula: 'NaHCO₃', atoms: { Na: 1, H: 1, C: 1, O: 3 }, look: 'lattice', pic: ['Na', 'C', 'O', 'O', 'O', 'H'] },
  CaCO3: { id: 'CaCO3', name: 'calcium carbonate', formula: 'CaCO₃', atoms: { Ca: 1, C: 1, O: 3 }, look: 'lattice', pic: ['Ca', 'C', 'O', 'O', 'O'] },
  Fe2O3: { id: 'Fe2O3', name: 'iron oxide', formula: 'Fe₂O₃', atoms: { Fe: 2, O: 3 }, look: 'lattice', pic: ['Fe', 'O', 'Fe', 'O', 'O'] },
  NH3: { id: 'NH3', name: 'ammonia', formula: 'NH₃', atoms: { N: 1, H: 3 }, look: 'molecule', pic: ['N', 'H', 'H', 'H'] },
  CH4: { id: 'CH4', name: 'methane', formula: 'CH₄', atoms: { C: 1, H: 4 }, look: 'molecule', pic: ['C', 'H', 'H', 'H', 'H'] },
  SiO2: { id: 'SiO2', name: 'silicon dioxide (sand)', formula: 'SiO₂', atoms: { Si: 1, O: 2 }, look: 'lattice', pic: ['Si', 'O', 'O'] },
  FeS: { id: 'FeS', name: 'iron sulphide', formula: 'FeS', atoms: { Fe: 1, S: 1 }, look: 'lattice', pic: ['Fe', 'S'] },
  oil: { id: 'oil', name: 'cooking oil (a fat)', formula: 'C₅₇H₁₀₄O₆', atoms: { C: 57, H: 104, O: 6 }, look: 'molecule', pic: ['C', 'C', 'C', 'H', 'O', 'H'] },
  ethanol: { id: 'ethanol', name: 'ethanol', formula: 'C₂H₅OH', atoms: { C: 2, H: 6, O: 1 }, look: 'molecule', pic: ['C', 'C', 'O', 'H', 'H', 'H'] },
};

export type Part = { s: string; share: number };
export type Thing = {
  id: string; name: string; parts: Part[];
  /** For mixtures: true if it looks the same all through (homogeneous). */
  same?: boolean;
  /** One plain sentence about it. */
  note: string;
};
/** Everyday things, simplified to their main particles. Shares are rough, rounded teaching values. */
export const THINGS: Thing[] = [
  { id: 'oxygen', name: 'Oxygen gas', parts: [{ s: 'O2', share: 1 }], note: 'Oxygen molecules are two oxygen atoms joined together: still only one kind of atom.' },
  { id: 'nitrogen', name: 'Nitrogen gas', parts: [{ s: 'N2', share: 1 }], note: 'Each molecule is two nitrogen atoms, and there is no other kind of atom.' },
  { id: 'helium', name: 'Helium in a balloon', parts: [{ s: 'He', share: 1 }], note: 'Helium atoms float around on their own, not joined to anything.' },
  { id: 'iron', name: 'Iron nail', parts: [{ s: 'Fe', share: 1 }], note: 'A pure iron nail is rows of iron atoms only (real nails may be steel, a mixture).' },
  { id: 'copper', name: 'Copper wire', parts: [{ s: 'Cu', share: 1 }], note: 'Electric wire is made of very pure copper: one kind of atom.' },
  { id: 'gold', name: 'Pure gold (24 carat)', parts: [{ s: 'Au', share: 1 }], note: '24 carat gold is gold atoms only. 22 carat jewellery has other metals mixed in.' },
  { id: 'aluminium', name: 'Aluminium foil', parts: [{ s: 'Al', share: 1 }], note: 'Kitchen foil is nearly pure aluminium.' },
  { id: 'diamond', name: 'Diamond', parts: [{ s: 'C', share: 1 }], note: 'A diamond is carbon atoms joined in a strong 3-D network, nothing else.' },
  { id: 'sulphur', name: 'Sulphur powder', parts: [{ s: 'S8', share: 1 }], note: 'Sulphur molecules are rings of eight sulphur atoms.' },
  { id: 'water', name: 'Pure (distilled) water', parts: [{ s: 'H2O', share: 1 }], note: 'Every molecule is two hydrogen atoms joined to one oxygen atom, always in that ratio.' },
  { id: 'salt', name: 'Table salt', parts: [{ s: 'NaCl', share: 1 }], note: 'Sodium and chlorine are joined one to one in a crystal: a compound.' },
  { id: 'sugar', name: 'Sugar', parts: [{ s: 'sugar', share: 1 }], note: 'A sugar molecule has carbon, hydrogen and oxygen atoms joined in a fixed pattern.' },
  { id: 'co2', name: 'Carbon dioxide', parts: [{ s: 'CO2', share: 1 }], note: 'One carbon atom joined to two oxygen atoms in every molecule.' },
  { id: 'soda', name: 'Baking soda', parts: [{ s: 'NaHCO3', share: 1 }], note: 'Sodium hydrogencarbonate: four kinds of atom joined in a fixed ratio.' },
  { id: 'marble', name: 'Pure calcium carbonate', parts: [{ s: 'CaCO3', share: 1 }], note: 'The white powder in marble and limestone: calcium, carbon and oxygen joined together.' },
  { id: 'rust', name: 'Rust', parts: [{ s: 'Fe2O3', share: 1 }], note: 'Iron that has joined with oxygen. It looks and behaves nothing like iron any more.' },
  { id: 'ammonia', name: 'Ammonia gas', parts: [{ s: 'NH3', share: 1 }], note: 'One nitrogen atom joined to three hydrogen atoms.' },
  { id: 'methane', name: 'Methane gas', parts: [{ s: 'CH4', share: 1 }], note: 'One carbon atom joined to four hydrogen atoms.' },
  { id: 'fes', name: 'Iron sulphide', parts: [{ s: 'FeS', share: 1 }], note: 'Made by heating iron and sulphur: they join, and a magnet can no longer pull the iron out.' },
  { id: 'air', name: 'Air', parts: [{ s: 'N2', share: 0.78 }, { s: 'O2', share: 0.21 }, { s: 'Ar', share: 0.01 }, { s: 'CO2', share: 0.0004 }], same: true, note: 'Mostly nitrogen and oxygen molecules, mixed but not joined, plus a little argon and carbon dioxide.' },
  { id: 'seawater', name: 'Sea water', parts: [{ s: 'H2O', share: 0.965 }, { s: 'NaCl', share: 0.035 }], same: true, note: 'Salt dissolved in water. Boil it away and the salt is left behind.' },
  { id: 'tapwater', name: 'Tap water', parts: [{ s: 'H2O', share: 0.999 }, { s: 'CaCO3', share: 0.001 }], same: true, note: 'Water with a little dissolved minerals, which is why kettles get a white crust.' },
  { id: 'sugarwater', name: 'Sugar dissolved in water', parts: [{ s: 'H2O', share: 0.9 }, { s: 'sugar', share: 0.1 }], same: true, note: 'A solution: sugar molecules spread evenly between water molecules.' },
  { id: 'soda-water', name: 'Soda water', parts: [{ s: 'H2O', share: 0.99 }, { s: 'CO2', share: 0.01 }], same: true, note: 'Carbon dioxide gas dissolved in water under pressure.' },
  { id: 'brass', name: 'Brass', parts: [{ s: 'Cu', share: 0.65 }, { s: 'Zn', share: 0.35 }], same: true, note: 'An alloy: copper and zinc atoms mixed evenly, in any ratio you like.' },
  { id: 'steel', name: 'Steel', parts: [{ s: 'Fe', share: 0.99 }, { s: 'C', share: 0.01 }], same: true, note: 'An alloy: iron with a little carbon mixed in to make it harder.' },
  { id: 'muddy', name: 'Muddy water', parts: [{ s: 'H2O', share: 0.8 }, { s: 'SiO2', share: 0.2 }], same: false, note: 'Bits of soil float in the water and settle if you leave it.' },
  { id: 'oilwater', name: 'Oil and water', parts: [{ s: 'H2O', share: 0.6 }, { s: 'oil', share: 0.4 }], same: false, note: 'They do not mix: the oil floats in a separate layer.' },
  { id: 'sand-iron', name: 'Sand and iron filings', parts: [{ s: 'SiO2', share: 0.7 }, { s: 'Fe', share: 0.3 }], same: false, note: 'You can see grains of both, and a magnet pulls the iron out.' },
  { id: 'iron-sulphur', name: 'Iron filings and sulphur', parts: [{ s: 'Fe', share: 0.5 }, { s: 'S8', share: 0.5 }], same: false, note: 'Just stirred together, not heated: a magnet still picks out the iron.' },
  { id: 'salt-sand', name: 'Salt and sand', parts: [{ s: 'SiO2', share: 0.5 }, { s: 'NaCl', share: 0.5 }], same: false, note: 'Two kinds of grain side by side. Water dissolves the salt but not the sand.' },
  { id: 'alcohol-water', name: 'Alcohol and water', parts: [{ s: 'ethanol', share: 0.7 }, { s: 'H2O', share: 0.3 }], same: true, note: 'The two liquids mix completely in any amounts.' },
];

export type Kind = 'element' | 'compound' | 'mixture';
/** Element, compound or mixture, worked out from the particles. */
export function kindOf(t: Thing): Kind {
  if (t.parts.length > 1) return 'mixture';
  return Object.keys(SPECIES[t.parts[0].s].atoms).length === 1 ? 'element' : 'compound';
}
/** The four bins of the Class 9 level. */
export type Bin = Kind | 'mix-same' | 'mix-diff';
export const binOf = (t: Thing, split: boolean): Bin => { const k = kindOf(t); return k === 'mixture' && split ? (t.same ? 'mix-same' : 'mix-diff') : k; };
export const kindsOfAtom = (s: Species) => Object.keys(s.atoms).length;
export const atomCount = (s: Species) => Object.values(s.atoms).reduce((a, b) => a + b, 0);

/** Why it goes in its bin, in one or two plain sentences. */
export function why(t: Thing, split: boolean): string {
  const k = kindOf(t), sp = t.parts.map((p) => SPECIES[p.s]);
  if (k === 'element') return `${t.name} is an element: all its particles are the same, and they are made of only one kind of atom (${Object.keys(sp[0].atoms)[0]}). ${t.note}`;
  if (k === 'compound') return `${t.name} is a compound: all its particles are the same (${sp[0].formula}), but each one has ${kindsOfAtom(sp[0])} kinds of atom joined together in a fixed ratio. ${t.note}`;
  const list = sp.map((s) => `${s.name} (${s.formula})`).join(', ');
  const tail = split ? (t.same ? ' It looks the same all through, so it is a homogeneous mixture.' : ' You can see the parts or they settle into layers, so it is a heterogeneous mixture.') : '';
  return `${t.name} is a mixture: it has ${sp.length} kinds of particle, ${list}, mixed but not joined.${tail} ${t.note}`;
}

/** A shuffled set of `n` things with every kind present (and both mixture kinds when split). */
export function dealSet(n: number, rnd: () => number = Math.random, split = false): Thing[] {
  const shuffle = <T,>(a: T[]) => { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };
  const bins: Bin[] = split ? ['element', 'compound', 'mix-same', 'mix-diff'] : ['element', 'compound', 'mixture'];
  const pools = bins.map((b) => shuffle(THINGS.filter((t) => binOf(t, split) === b)));
  const out: Thing[] = [];
  for (let i = 0; out.length < n; i++) { const p = pools[i % pools.length]; const x = p.shift(); if (x) out.push(x); if (pools.every((q) => !q.length)) break; }
  return shuffle(out);
}

export type Q = { q: string; ans: number; unit?: string; choices?: string[]; work: string; tol?: number; abs?: number };
const KINDS = ['An element', 'A compound', 'A mixture'];
/** Fresh "Check yourself" questions. */
export function questions(split: boolean, rnd: () => number = Math.random): Q[] {
  const pick = <T,>(a: T[]) => a[Math.floor(rnd() * a.length)];
  const set = dealSet(3, rnd);
  const out: Q[] = set.map((t) => ({ q: `${t.name} is…`, ans: ['element', 'compound', 'mixture'].indexOf(kindOf(t)), choices: KINDS, work: why(t, split) }));
  const comps = Object.values(SPECIES).filter((s) => kindsOfAtom(s) > 1 && atomCount(s) <= 6);
  const s = pick(comps);
  out.push({ q: `How many atoms are there in one particle of ${s.name}, ${s.formula}?`, ans: atomCount(s), unit: 'atoms', abs: 0, work: `${Object.entries(s.atoms).map(([k, v]) => `${v} ${k}`).join(' + ')} = ${atomCount(s)} atoms, of ${kindsOfAtom(s)} kinds.` });
  if (split) {
    const m = pick(THINGS.filter((t) => kindOf(t) === 'mixture'));
    out.push({ q: `Is ${m.name.toLowerCase()} the same all through (homogeneous) or not (heterogeneous)?`, ans: m.same ? 0 : 1, choices: ['Homogeneous', 'Heterogeneous'], work: why(m, true) });
  }
  return out;
}

/** Colours for drawing atoms (made up, just to tell them apart). */
export const ATOM_COLOUR: Record<string, string> = {
  H: '#e8e8e8', O: '#d23c32', N: '#3a62c9', C: '#3b3b3b', Na: '#8e55c7', Cl: '#3fae4a', Fe: '#b8682a', Cu: '#d0844a', Zn: '#8fa0b0',
  Au: '#d7b021', Al: '#b9c2cc', S: '#e2cf2c', He: '#7fd0e0', Ar: '#69b7a8', Ca: '#7b8f3a', Si: '#c9a46b',
};
