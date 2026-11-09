// Molecular orbital diagrams for homonuclear diatomic molecules and ions from H₂ to Ne₂ (school LCAO model):
// fill the MOs in energy order (Aufbau, Pauli, Hund), bond order, unpaired electrons and magnetism.
// Plain maths, no DOM. Used by the #1103 MO diagram tool.

export const ELEMENTS = ['H', 'He', 'Li', 'Be', 'B', 'C', 'N', 'O', 'F', 'Ne'];
export const Z: Record<string, number> = Object.fromEntries(ELEMENTS.map((e, i) => [e, i + 1]));

export type MO = { id: string; label: string; bonding: boolean; cap: number; group: string };
// Each π level is listed as its two equal (degenerate) orbitals, x and y, with the same group.
const CORE: MO[] = [
  { id: 's1s', label: 'σ1s', bonding: true, cap: 2, group: 's1s' },
  { id: 's1s*', label: 'σ*1s', bonding: false, cap: 2, group: 's1s*' },
  { id: 's2s', label: 'σ2s', bonding: true, cap: 2, group: 's2s' },
  { id: 's2s*', label: 'σ*2s', bonding: false, cap: 2, group: 's2s*' },
];
const SIG = { id: 's2pz', label: 'σ2pz', bonding: true, cap: 2, group: 's2pz' };
const PIX = { id: 'p2px', label: 'π2px', bonding: true, cap: 2, group: 'p2p' };
const PIY = { id: 'p2py', label: 'π2py', bonding: true, cap: 2, group: 'p2p' };
const PSX = { id: 'p2px*', label: 'π*2px', bonding: false, cap: 2, group: 'p2p*' };
const PSY = { id: 'p2py*', label: 'π*2py', bonding: false, cap: 2, group: 'p2p*' };
const SIGS = { id: 's2pz*', label: 'σ*2pz', bonding: false, cap: 2, group: 's2pz*' };

/** The MOs in order of rising energy. With s–p mixing (B₂, C₂, N₂) the π2p pair lies below σ2pz. */
export const order = (mixing: boolean): MO[] => [...CORE, ...(mixing ? [PIX, PIY, SIG] : [SIG, PIX, PIY]), PSX, PSY, SIGS];

/** s–p mixing is strong for the lighter atoms (up to nitrogen) and weak from oxygen on. */
export const autoMixing = (el: string) => Z[el] <= 7;

export type Result = {
  electrons: number;
  fill: number[];             // electrons in each MO, in `order(mixing)` order
  spins: ('up' | 'down')[][]; // arrows in each MO
  bonding: number; antibonding: number;
  bondOrder: number;
  unpaired: number;
  magnetic: 'paramagnetic' | 'diamagnetic';
  config: string;             // e.g. "σ1s² σ*1s² σ2s² σ*2s² σ2pz² π2px² π2py² π*2px¹ π*2py¹"
  exists: boolean;            // bond order above zero
  mixing: boolean;
  mos: MO[];
};

/** Fill `n` electrons (or all of them) into the MOs of X₂ with the given charge. */
export function fillMO(el: string, charge = 0, mixing = autoMixing(el), upTo?: number): Result | string {
  if (!(el in Z)) return `Pick an element from H to Ne.`;
  const total = 2 * Z[el] - charge;
  if (!Number.isInteger(charge)) return 'The charge must be a whole number.';
  if (total < 1) return `${el}₂ with charge ${charge} would have no electrons.`;
  if (total > 20) return `${el}₂ with charge ${charge} has ${total} electrons; the 2p MOs hold at most 20.`;
  const n = upTo === undefined ? total : Math.max(0, Math.min(total, upTo));
  const mos = order(mixing);
  const fill = new Array(mos.length).fill(0);
  let left = n;
  for (let i = 0; i < mos.length && left > 0;) {
    // Degenerate pair (same group): one electron in each before pairing (Hund's rule).
    const j = i + 1 < mos.length && mos[i + 1].group === mos[i].group ? i + 1 : i;
    const idx = j === i ? [i] : [i, j];
    for (const pass of [0, 1]) for (const k of idx) if (left > 0 && fill[k] === pass) { fill[k]++; left--; }
    i = j + 1;
  }
  const spins = fill.map((f) => (f === 0 ? [] : f === 1 ? ['up'] : ['up', 'down']) as ('up' | 'down')[]);
  const bonding = fill.reduce((s, f, i) => s + (mos[i].bonding ? f : 0), 0), antibonding = n - bonding;
  const unpaired = fill.filter((f) => f === 1).length;
  const sup = (k: number) => '⁰¹²³⁴⁵⁶⁷⁸⁹'[k];
  const config = mos.map((m, i) => (fill[i] ? `${m.label}${sup(fill[i])}` : '')).filter(Boolean).join(' ');
  const bondOrder = (bonding - antibonding) / 2;
  return { electrons: n, fill, spins, bonding, antibonding, bondOrder, unpaired, magnetic: unpaired ? 'paramagnetic' : 'diamagnetic', config, exists: bondOrder > 0, mixing, mos };
}

/** Name of the species, e.g. O₂, O₂⁻, O₂²⁺. */
export function speciesName(el: string, charge: number) {
  if (!charge) return `${el}₂`;
  const sup = Math.abs(charge) === 1 ? '' : '⁰¹²³⁴⁵⁶⁷⁸⁹'[Math.abs(charge)];
  return `${el}₂${sup}${charge > 0 ? '⁺' : '⁻'}`;
}

/** Bond order as text: 2.5 → "2½". */
export const boText = (b: number) => (Number.isInteger(b) ? String(b) : `${Math.floor(b) || ''}½`);
