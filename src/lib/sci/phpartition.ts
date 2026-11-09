// Canonical partition function of a set of energy levels (with degeneracies): populations, mean energy, entropy,
// Helmholtz energy and heat capacity at any temperature. CODATA 2018 exact constants. No DOM.

export const KB = 1.380649e-23, NA = 6.02214076e23, H = 6.62607015e-34, C0 = 299792458, QE = 1.602176634e-19;
/** Joules per one of each energy unit. */
export const UNIT: Record<string, { j: number; name: string }> = {
  cm: { j: H * C0 * 100, name: 'cm⁻¹' },
  meV: { j: QE / 1000, name: 'meV' },
  eV: { j: QE, name: 'eV' },
  K: { j: KB, name: 'K (E/kB)' },
  kJmol: { j: 1000 / NA, name: 'kJ/mol' },
  zJ: { j: 1e-21, name: 'zJ' },
};

export type Level = { E: number; g: number }; // E in joules

/** Reads "energy, degeneracy" lines (degeneracy optional, default 1). Returns levels in joules or a plain message. */
export function parseLevels(text: string, unitJ: number): { levels: Level[]; error?: string; skipped: number } {
  const levels: Level[] = []; let skipped = 0, line = 0;
  for (const raw of text.replace(/\r\n?/g, '\n').split('\n')) {
    line++;
    const t = raw.trim(); if (!t || t.startsWith('#')) continue;
    const cells = t.split(/[\t;,]+|\s+/).filter(Boolean);
    const E = Number(cells[0].replace('−', '-')), g = cells.length > 1 ? Number(cells[1]) : 1;
    if (!Number.isFinite(E)) { if (levels.length === 0 && line === 1) { skipped++; continue; } return { levels: [], skipped, error: `Line ${line}: "${t}" does not start with an energy.` }; }
    if (!(Number.isFinite(g) && g > 0)) return { levels: [], skipped, error: `Line ${line}: the degeneracy must be a positive number.` };
    levels.push({ E: E * unitJ, g });
  }
  if (!levels.length) return { levels, skipped, error: 'Type at least one energy level.' };
  return { levels, skipped };
}

export type Thermo = { T: number; Z: number; lnZ: number; E0: number; p: number[]; U: number; S: number; F: number; Cv: number; top: number };

/**
 * Thermodynamics per particle at temperature T (K). Z is measured from the true zero of energy; energies are shifted
 * to the lowest level inside so nothing overflows. U, F in J; S, Cv in J/K. `top` is the population of the highest level.
 */
export function thermo(levels: Level[], T: number): Thermo {
  const E0 = Math.min(...levels.map((l) => l.E)), b = 1 / (KB * T);
  const w = levels.map((l) => l.g * Math.exp(-(l.E - E0) * b)), z = w.reduce((s, x) => s + x, 0);
  const p = w.map((x) => x / z);
  const e1 = levels.reduce((s, l, i) => s + p[i] * (l.E - E0), 0), e2 = levels.reduce((s, l, i) => s + p[i] * (l.E - E0) ** 2, 0);
  const lnZ = Math.log(z) - E0 * b;
  let top = 0, hi = -Infinity;
  levels.forEach((l, i) => { if (l.E > hi) { hi = l.E; top = p[i]; } });
  return { T, Z: Math.exp(lnZ), lnZ, E0, p, U: E0 + e1, S: KB * Math.log(z) + e1 / T, F: E0 - KB * T * Math.log(z), Cv: (e2 - e1 * e1) / (KB * T * T), top };
}

/** Level sets made from formulas (energies in the unit given). */
export const presets = {
  twoLevel: (gap: number, g0 = 1, g1 = 1) => [{ E: 0, g: g0 }, { E: gap, g: g1 }],
  oscillator: (quantum: number, n: number) => Array.from({ length: n }, (_, v) => ({ E: (v + 0.5) * quantum, g: 1 })),
  rotor: (B: number, n: number) => Array.from({ length: n }, (_, J) => ({ E: B * J * (J + 1), g: 2 * J + 1 })),
};

/** Exact closed forms for checking: Schottky (two level, g = 1) and Einstein (harmonic oscillator) heat capacities in units of kB. */
export const exact = {
  schottky: (x: number) => (x * x * Math.exp(x)) / (1 + Math.exp(x)) ** 2,
  einstein: (x: number) => (x * x * Math.exp(x)) / (Math.exp(x) - 1) ** 2,
};
