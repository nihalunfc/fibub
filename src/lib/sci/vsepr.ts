// VSEPR (valence shell electron pair repulsion) shapes for school chemistry: electron pairs around a central
// atom spread out as far as they can; the shape is named from where the atoms sit, ignoring lone pairs.
// Pure maths and rules, no DOM. Used by the #1101 VSEPR shape viewer.

export type Vec = [number, number, number];

export type Shape = {
  domains: number;          // steric number: bond pairs (counting a multiple bond once) + lone pairs
  bonds: number;
  lone: number;
  electronGeometry: string;
  shape: string;
  ideal: string;            // the ideal angle(s) between bonds, as text
  angles: number[];         // the distinct ideal bond-bond angles in degrees
  hybrid: string;           // hybridisation of the central atom (school model)
  note: string;             // a one-line note on squeezed angles or where lone pairs go
  positions: Vec[];         // unit vectors of every domain, bonds first then lone pairs
};

const s3 = Math.sqrt(3) / 2;
const TET = 1 / Math.sqrt(3);
// Where the electron domains point, by steric number. For 5, the first two are axial (±z).
const SITES: Record<number, Vec[]> = {
  1: [[0, 0, 1]],
  2: [[0, 0, 1], [0, 0, -1]],
  3: [[1, 0, 0], [-0.5, s3, 0], [-0.5, -s3, 0]],
  4: [[TET, TET, TET], [-TET, -TET, TET], [-TET, TET, -TET], [TET, -TET, -TET]],
  5: [[0, 0, 1], [0, 0, -1], [1, 0, 0], [-0.5, s3, 0], [-0.5, -s3, 0]],
  6: [[1, 0, 0], [0, 1, 0], [-1, 0, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]],
};
// Which sites take the lone pairs (in order), so lone pairs sit where they repel least.
const LONE_SITES: Record<number, number[]> = {
  1: [0], 2: [1, 0], 3: [2, 1, 0], 4: [3, 2, 1, 0],
  5: [4, 3, 2, 1, 0],    // equatorial first: lone pairs then have only two neighbours at 90°
  6: [5, 4, 3, 2, 1, 0],  // the first two go trans to each other (±z)
};

const GEOM = ['', 'single domain', 'linear', 'trigonal planar', 'tetrahedral', 'trigonal bipyramidal', 'octahedral'];
const HYB = ['', 's', 'sp', 'sp²', 'sp³', 'sp³d', 'sp³d²'];
// Shape names by [domains][lone pairs].
const NAMES: Record<number, string[]> = {
  2: ['linear', 'linear'],
  3: ['trigonal planar', 'bent (V-shaped)', 'linear'],
  4: ['tetrahedral', 'trigonal pyramidal', 'bent (V-shaped)', 'linear'],
  5: ['trigonal bipyramidal', 'see-saw', 'T-shaped', 'linear'],
  6: ['octahedral', 'square pyramidal', 'square planar'],
};

export const dot = (a: Vec, b: Vec) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
export const angleDeg = (a: Vec, b: Vec) => (Math.acos(Math.max(-1, Math.min(1, dot(a, b) / Math.sqrt(dot(a, a) * dot(b, b))))) * 180) / Math.PI;

/** The shape for `bonds` bonded atoms and `lone` lone pairs on the central atom, or an error message. */
export function shapeOf(bonds: number, lone: number): Shape | string {
  if (!Number.isInteger(bonds) || !Number.isInteger(lone) || bonds < 1 || lone < 0) return 'Use at least 1 bonded atom and 0 or more lone pairs.';
  const d = bonds + lone;
  if (d > 6) return `${bonds} bonded atoms and ${lone} lone pairs make ${d} electron pairs: VSEPR at school goes up to 6.`;
  if (d === 1) return 'One bonded atom and no lone pairs is just a two-atom molecule: always linear.';
  if (!NAMES[d][lone]) return `${lone} lone pairs with ${bonds} bonded atoms is not a shape you meet: try fewer lone pairs.`;
  const sites = SITES[d], lsites = LONE_SITES[d].slice(0, lone);
  const bsites = sites.map((_, i) => i).filter((i) => !lsites.includes(i));
  const positions = [...bsites.map((i) => sites[i]), ...lsites.map((i) => sites[i])];
  const angles: number[] = [];
  for (let i = 0; i < bonds; i++) for (let j = i + 1; j < bonds; j++) {
    const a = Math.round(angleDeg(positions[i], positions[j]) * 10) / 10;
    if (!angles.some((x) => Math.abs(x - a) < 0.05)) angles.push(a);
  }
  angles.sort((a, b) => a - b);
  const fmt = (a: number) => (Math.abs(a - 109.5) < 0.05 ? '109.5°' : `${a}°`);
  let ideal = bonds < 2 ? 'no bond angle (one bond)' : angles.map(fmt).join(' and ');
  let note = 'All the pairs are bonds, so every angle is the ideal one.';
  if (lone > 0) {
    if (d === 4 || d === 3) {
      ideal = bonds < 2 ? ideal : `less than ${fmt(angles[angles.length - 1])}`;
      note = 'Lone pairs push harder than bond pairs (lone–lone > lone–bond > bond–bond), so the bond angles close up a little below the ideal.';
    } else if (d === 5) note = 'Lone pairs take the equatorial places: there they have only two neighbours at 90°, instead of three.';
    else if (d === 6) note = lone === 2 ? 'The two lone pairs sit opposite each other (180° apart), as far apart as they can be.' : 'One lone pair: the four atoms around the middle bend slightly away from it.';
    if (d === 2 || (d === 5 && lone === 3) || (d === 4 && lone === 3) || (d === 3 && lone === 2)) ideal = bonds < 2 ? ideal : '180°';
  }
  return { domains: d, bonds, lone, electronGeometry: GEOM[d], shape: NAMES[d][lone], ideal, angles, hybrid: HYB[d], note, positions };
}

/** Is the molecule polar when all the outer atoms are the same? (Bond dipoles add up to zero only for symmetric shapes.) */
export function isSymmetric(sh: Shape) {
  const s: Vec = [0, 0, 0];
  for (let i = 0; i < sh.bonds; i++) for (let k = 0; k < 3; k++) s[k] += sh.positions[i][k];
  return Math.hypot(...s) < 1e-9;
}

// Valence electrons of main-group atoms (group number for the s and p blocks).
export const VALENCE: Record<string, number> = { H: 1, Be: 2, B: 3, Al: 3, C: 4, Si: 4, Ge: 4, Sn: 4, N: 5, P: 5, As: 5, Sb: 5, O: 6, S: 6, Se: 6, Te: 6, F: 7, Cl: 7, Br: 7, I: 7, Xe: 8, Kr: 8 };
// How many electrons the central atom uses to bond to each kind of outer atom: one for H and halogens (single
// bond), two for O and S (double bond), three for N (triple bond).
export const BOND_USE: Record<string, number> = { H: 1, F: 1, Cl: 1, Br: 1, I: 1, O: 2, S: 2, N: 3 };

export type Count = { bonds: number; lone: number; odd: boolean; leftover: number; available: number; used: number; steps: string[] } | string;

/** Count bond pairs and lone pairs on a central atom from its valence electrons, the outer atoms and the charge. */
export function countPairs(central: string, outer: { el: string; n: number }[], charge = 0): Count {
  const v = VALENCE[central];
  if (v === undefined) return `No valence count for "${central}".`;
  let bonds = 0, used = 0;
  for (const o of outer) {
    if (!(o.el in BOND_USE)) return `Outer atom "${o.el}" is not in the list (H, F, Cl, Br, I, O, S, N).`;
    if (!Number.isInteger(o.n) || o.n < 0) return 'Use a whole number of outer atoms.';
    bonds += o.n; used += o.n * BOND_USE[o.el];
  }
  if (bonds < 1) return 'Add at least one outer atom.';
  const available = v - charge;
  const leftover = available - used;
  const sign = charge > 0 ? `− ${charge} (charge ${charge}+)` : charge < 0 ? `+ ${-charge} (charge ${-charge}−)` : '';
  const steps = [
    `${central} has ${v} valence electrons${sign ? `; ${v} ${sign} = ${available}` : ''}.`,
    `Bonds use ${outer.filter((o) => o.n).map((o) => `${o.n} × ${BOND_USE[o.el]} for ${o.el}`).join(' + ')} = ${used} of them.`,
  ];
  if (leftover < 0) return `${central} does not have enough electrons for these bonds (${available} available, ${used} needed).`;
  const lone = Math.ceil(leftover / 2), odd = leftover % 2 === 1;
  steps.push(`${leftover} left over = ${odd ? `${Math.floor(leftover / 2)} lone pair${Math.floor(leftover / 2) === 1 ? '' : 's'} and one single (unpaired) electron, which counts as a domain` : `${lone} lone pair${lone === 1 ? '' : 's'}`}.`);
  steps.push(`${bonds} bonded atom${bonds === 1 ? '' : 's'} + ${lone} lone pair${lone === 1 ? '' : 's'} = ${bonds + lone} electron domains.`);
  return { bonds, lone, odd, leftover, available, used, steps };
}

export type Example = { id: string; name: string; central: string; outer: { el: string; n: number }[]; charge: number; measured?: string };
// Examples; "measured" angles are the commonly quoted rounded textbook values (general chemistry facts).
export const EXAMPLES: Example[] = [
  { id: 'becl2', name: 'BeCl₂', central: 'Be', outer: [{ el: 'Cl', n: 2 }], charge: 0 },
  { id: 'co2', name: 'CO₂', central: 'C', outer: [{ el: 'O', n: 2 }], charge: 0 },
  { id: 'bf3', name: 'BF₃', central: 'B', outer: [{ el: 'F', n: 3 }], charge: 0 },
  { id: 'so2', name: 'SO₂', central: 'S', outer: [{ el: 'O', n: 2 }], charge: 0, measured: 'about 119°' },
  { id: 'ch4', name: 'CH₄', central: 'C', outer: [{ el: 'H', n: 4 }], charge: 0 },
  { id: 'nh4', name: 'NH₄⁺', central: 'N', outer: [{ el: 'H', n: 4 }], charge: 1 },
  { id: 'nh3', name: 'NH₃', central: 'N', outer: [{ el: 'H', n: 3 }], charge: 0, measured: 'about 107°' },
  { id: 'h2o', name: 'H₂O', central: 'O', outer: [{ el: 'H', n: 2 }], charge: 0, measured: 'about 104.5°' },
  { id: 'pcl5', name: 'PCl₅', central: 'P', outer: [{ el: 'Cl', n: 5 }], charge: 0 },
  { id: 'sf4', name: 'SF₄', central: 'S', outer: [{ el: 'F', n: 4 }], charge: 0 },
  { id: 'clf3', name: 'ClF₃', central: 'Cl', outer: [{ el: 'F', n: 3 }], charge: 0 },
  { id: 'xef2', name: 'XeF₂', central: 'Xe', outer: [{ el: 'F', n: 2 }], charge: 0 },
  { id: 'sf6', name: 'SF₆', central: 'S', outer: [{ el: 'F', n: 6 }], charge: 0 },
  { id: 'brf5', name: 'BrF₅', central: 'Br', outer: [{ el: 'F', n: 5 }], charge: 0 },
  { id: 'xef4', name: 'XeF₄', central: 'Xe', outer: [{ el: 'F', n: 4 }], charge: 0 },
  { id: 'so4', name: 'SO₄²⁻', central: 'S', outer: [{ el: 'O', n: 4 }], charge: -2 },
  { id: 'co3', name: 'CO₃²⁻', central: 'C', outer: [{ el: 'O', n: 3 }], charge: -2 },
  { id: 'i3', name: 'I₃⁻', central: 'I', outer: [{ el: 'I', n: 2 }], charge: -1 },
];

/** Formula text such as "SF₄" or "SO₄²⁻" for a central atom, outer atoms and charge. */
export function formulaText(central: string, outer: { el: string; n: number }[], charge: number) {
  const sub = (n: number) => (n === 1 ? '' : String(n).replace(/\d/g, (d) => '₀₁₂₃₄₅₆₇₈₉'[+d]));
  const sup = (n: number) => String(n).replace(/\d/g, (d) => '⁰¹²³⁴⁵⁶⁷⁸⁹'[+d]);
  const ch = charge === 0 ? '' : `${Math.abs(charge) === 1 ? '' : sup(Math.abs(charge))}${charge > 0 ? '⁺' : '⁻'}`;
  const same = outer.filter((o) => o.n > 0 && o.el === central).reduce((s, o) => s + o.n, 0);
  if (same) return `${central}${sub(same + 1)}${outer.filter((o) => o.n > 0 && o.el !== central).map((o) => o.el + sub(o.n)).join('')}${ch}`;
  // Hydrides of oxygen and sulfur are written hydrogen first (H₂O, H₃O⁺, H₂S); the rest central atom first (NH₃, CH₄).
  if (outer.length === 1 && outer[0].el === 'H' && ['O', 'S', 'Se', 'Te'].includes(central)) return `H${sub(outer[0].n)}${central}${ch}`;
  return `${central}${outer.filter((o) => o.n > 0).map((o) => o.el + sub(o.n)).join('')}${ch}`;
}

// Real molecules and ions for practice questions: [central, [outer atom, count]..., charge].
const POOL: [string, [string, number][], number][] = [
  ['Be', [['Cl', 2]], 0], ['C', [['O', 2]], 0], ['C', [['S', 2]], 0], ['B', [['F', 3]], 0], ['B', [['Cl', 3]], 0], ['Al', [['Cl', 3]], 0],
  ['S', [['O', 3]], 0], ['N', [['O', 3]], -1], ['C', [['O', 3]], -2], ['S', [['O', 2]], 0], ['O', [['O', 2]], 0], ['N', [['O', 2]], -1],
  ['C', [['H', 4]], 0], ['C', [['Cl', 4]], 0], ['Si', [['Cl', 4]], 0], ['Si', [['H', 4]], 0], ['N', [['H', 4]], 1], ['B', [['F', 4]], -1],
  ['S', [['O', 4]], -2], ['P', [['O', 4]], -3], ['Cl', [['O', 4]], -1], ['N', [['H', 3]], 0], ['P', [['Cl', 3]], 0], ['P', [['H', 3]], 0],
  ['N', [['F', 3]], 0], ['O', [['H', 3]], 1], ['Cl', [['O', 3]], -1], ['S', [['O', 3]], -2], ['O', [['H', 2]], 0], ['S', [['H', 2]], 0],
  ['O', [['F', 2]], 0], ['S', [['Cl', 2]], 0], ['N', [['H', 2]], -1], ['Cl', [['O', 2]], -1], ['P', [['Cl', 5]], 0], ['P', [['F', 5]], 0],
  ['S', [['F', 4]], 0], ['Se', [['F', 4]], 0], ['Cl', [['F', 3]], 0], ['Br', [['F', 3]], 0], ['I', [['Cl', 2]], -1], ['Xe', [['F', 2]], 0],
  ['I', [['I', 2]], -1], ['S', [['F', 6]], 0], ['P', [['F', 6]], -1], ['Si', [['F', 6]], -2], ['Br', [['F', 5]], 0], ['I', [['F', 5]], 0],
  ['Xe', [['F', 4]], 0], ['I', [['Cl', 4]], -1], ['Xe', [['O', 3]], 0], ['Xe', [['O', 1], ['F', 4]], 0],
];
export const QUIZ: Example[] = POOL.map(([c, o, q], i) => { const outer = o.map(([el, n]) => ({ el, n })); return { id: 'q' + i, name: formulaText(c, outer, q), central: c, outer, charge: q }; });

/** `n` different practice molecules picked at random from QUIZ. */
export function pickQuiz(n: number, rand: () => number = Math.random): Example[] {
  const a = QUIZ.slice();
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rand() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a.slice(0, n);
}
