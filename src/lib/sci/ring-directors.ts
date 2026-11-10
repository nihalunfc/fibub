// Directing effects in electrophilic substitution of benzene (Class 11 hydrocarbons, Class 12 haloarenes, phenols,
// amines, aldehydes and acids): which groups send the next group ortho/para or meta, which activate or deactivate
// the ring, and the IUPAC name of each product. Plain logic, no DOM.

export type Sub = {
  id: string; label: string; formula: string; dir: 'op' | 'm'; activates: boolean; strength: 'strong' | 'moderate' | 'weak';
  effect: string; /** Name used as a parent (phenol) or as a prefix on benzene (methyl). */ parent?: string; prefix?: string; compound: string;
  /** +R groups push lone-pair electrons into the ring (− charges at o/p); −R groups pull them out (+ at o/p). */ resonance: '+R' | '−R' | 'none';
};
export const SUBS: Sub[] = [
  { id: 'OH', label: '–OH', formula: 'OH', dir: 'op', activates: true, strength: 'strong', resonance: '+R', effect: 'The O lone pair is pushed into the ring (+R), which outweighs O pulling electrons along the bond (−I).', parent: 'phenol', compound: 'Phenol' },
  { id: 'NH2', label: '–NH₂', formula: 'NH₂', dir: 'op', activates: true, strength: 'strong', resonance: '+R', effect: 'The N lone pair is pushed into the ring (+R), much stronger than N pulling electrons (−I).', parent: 'aniline', compound: 'Aniline' },
  { id: 'OCH3', label: '–OCH₃', formula: 'OCH₃', dir: 'op', activates: true, strength: 'moderate', resonance: '+R', effect: 'The O lone pair is pushed into the ring (+R).', prefix: 'methoxy', compound: 'Anisole (methoxybenzene)' },
  { id: 'CH3', label: '–CH₃', formula: 'CH₃', dir: 'op', activates: true, strength: 'weak', resonance: 'none', effect: 'The methyl group pushes a little electron density into the ring (+I and hyperconjugation).', prefix: 'methyl', compound: 'Toluene (methylbenzene)' },
  { id: 'Cl', label: '–Cl', formula: 'Cl', dir: 'op', activates: false, strength: 'weak', resonance: '+R', effect: 'Cl pulls electrons along the bond (−I), which slows the ring down, but its lone pair (+R) still sends the new group ortho and para.', prefix: 'chloro', compound: 'Chlorobenzene' },
  { id: 'Br', label: '–Br', formula: 'Br', dir: 'op', activates: false, strength: 'weak', resonance: '+R', effect: 'Like Cl: −I slows the ring, +R still directs ortho and para.', prefix: 'bromo', compound: 'Bromobenzene' },
  { id: 'NO2', label: '–NO₂', formula: 'NO₂', dir: 'm', activates: false, strength: 'strong', resonance: '−R', effect: 'The nitro group pulls electrons out of the ring (−R and −I), leaving + charge at ortho and para, so the electrophile goes meta.', prefix: 'nitro', compound: 'Nitrobenzene' },
  { id: 'CN', label: '–CN', formula: 'CN', dir: 'm', activates: false, strength: 'strong', resonance: '−R', effect: 'C≡N pulls electrons out of the ring (−R, −I).', parent: 'benzonitrile', compound: 'Benzonitrile' },
  { id: 'CHO', label: '–CHO', formula: 'CHO', dir: 'm', activates: false, strength: 'moderate', resonance: '−R', effect: 'The C=O pulls electrons out of the ring (−R, −I).', parent: 'benzaldehyde', compound: 'Benzaldehyde' },
  { id: 'COOH', label: '–COOH', formula: 'COOH', dir: 'm', activates: false, strength: 'moderate', resonance: '−R', effect: 'The C=O pulls electrons out of the ring (−R, −I).', parent: 'benzoic acid', compound: 'Benzoic acid' },
];

export type Electrophile = { id: string; name: string; formula: string; prefix: string; reagent: string; ion: string };
export const ELECTROPHILES: Electrophile[] = [
  { id: 'nitration', name: 'Nitration', formula: 'NO₂', prefix: 'nitro', reagent: 'conc. HNO₃ + conc. H₂SO₄', ion: 'NO₂⁺' },
  { id: 'bromination', name: 'Bromination', formula: 'Br', prefix: 'bromo', reagent: 'Br₂ with FeBr₃', ion: 'Br⁺' },
  { id: 'chlorination', name: 'Chlorination', formula: 'Cl', prefix: 'chloro', reagent: 'Cl₂ with anhydrous FeCl₃ or AlCl₃', ion: 'Cl⁺' },
];

/** Ring positions (numbered from the first group at 1) where the new group goes. */
export const positions = (s: Sub) => (s.dir === 'op' ? [2, 4] : [3]);
export const posName = (k: number) => ({ 2: 'ortho', 3: 'meta', 4: 'para' })[k] as string;

/** IUPAC name of the disubstituted product: a parent name (2-nitrophenol), the same prefix twice
 *  (1,3-dinitrobenzene), or two prefixes in alphabetical order, the first at 1 (1-methyl-2-nitrobenzene). */
export function productName(s: Sub, e: Electrophile, k: number): string {
  if (s.parent) return `${k}-${e.prefix}${s.parent}`;
  const p = s.prefix!;
  if (p === e.prefix) return `1,${k}-di${p}benzene`;
  const [a, b] = [p, e.prefix].sort();
  return `1-${a}-${k}-${b}benzene`;
}
