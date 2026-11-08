// Electron counting for transition-metal complexes with Green's covalent bond classification (L, X ligands):
// valence electrons, oxidation state, d-electron count and the ligand bond number, with the ionic count alongside.

/** Transition metals with their group number (= valence electrons of the neutral atom in the count). */
export const METALS: [string, number][] = [
  ['Sc', 3], ['Ti', 4], ['V', 5], ['Cr', 6], ['Mn', 7], ['Fe', 8], ['Co', 9], ['Ni', 10], ['Cu', 11], ['Zn', 12],
  ['Y', 3], ['Zr', 4], ['Nb', 5], ['Mo', 6], ['Tc', 7], ['Ru', 8], ['Rh', 9], ['Pd', 10], ['Ag', 11], ['Cd', 12],
  ['La', 3], ['Hf', 4], ['Ta', 5], ['W', 6], ['Re', 7], ['Os', 8], ['Ir', 9], ['Pt', 10], ['Au', 11], ['Hg', 12],
];

/** Ligands by type: l = number of L functions (2-electron neutral donors), x = number of X functions (1 electron
 *  in the covalent count, an anion in the ionic count). */
export const LIGANDS = [
  { id: 'CO', name: 'CO (carbonyl)', l: 1, x: 0, ion: 'CO' },
  { id: 'PR3', name: 'PR₃ (phosphine, e.g. PPh₃)', l: 1, x: 0, ion: 'PR₃' },
  { id: 'NH3', name: 'NH₃ (ammine)', l: 1, x: 0, ion: 'NH₃' },
  { id: 'H2O', name: 'H₂O (aqua)', l: 1, x: 0, ion: 'H₂O' },
  { id: 'py', name: 'pyridine or MeCN, THF', l: 1, x: 0, ion: 'L' },
  { id: 'CNR', name: 'CNR (isocyanide)', l: 1, x: 0, ion: 'CNR' },
  { id: 'NHC', name: 'N-heterocyclic carbene', l: 1, x: 0, ion: 'NHC' },
  { id: 'alkene', name: 'η²-alkene (C₂H₄)', l: 1, x: 0, ion: 'C₂H₄' },
  { id: 'H2', name: 'η²-H₂', l: 1, x: 0, ion: 'H₂' },
  { id: 'N2', name: 'N₂ (end-on)', l: 1, x: 0, ion: 'N₂' },
  { id: 'Cl', name: 'Cl, Br, I or F (halide)', l: 0, x: 1, ion: 'X⁻' },
  { id: 'H', name: 'H (hydride)', l: 0, x: 1, ion: 'H⁻' },
  { id: 'R', name: 'CH₃, alkyl or aryl', l: 0, x: 1, ion: 'R⁻' },
  { id: 'CN', name: 'CN (cyanide)', l: 0, x: 1, ion: 'CN⁻' },
  { id: 'OR', name: 'OH, OR, SR, NR₂ (one bond)', l: 0, x: 1, ion: 'OR⁻' },
  { id: 'OAc', name: 'κ¹-acetate or NO₃, NO₂', l: 0, x: 1, ion: 'OAc⁻' },
  { id: 'en', name: 'en, bipy, phen, dppe (chelate)', l: 2, x: 0, ion: 'L₂' },
  { id: 'acac', name: 'acac or κ²-acetate (chelate)', l: 1, x: 1, ion: 'acac⁻' },
  { id: 'ox', name: 'oxalate or catecholate', l: 0, x: 2, ion: 'ox²⁻' },
  { id: 'allyl', name: 'η³-allyl', l: 1, x: 1, ion: 'C₃H₅⁻' },
  { id: 'diene', name: 'η⁴-butadiene or COD', l: 2, x: 0, ion: 'diene' },
  { id: 'Cp', name: 'η⁵-Cp or Cp*', l: 2, x: 1, ion: 'Cp⁻' },
  { id: 'arene', name: 'η⁶-benzene (arene)', l: 3, x: 0, ion: 'C₆H₆' },
  { id: 'O', name: '=O (oxo) or =NR (imido, bent)', l: 0, x: 2, ion: 'O²⁻' },
  { id: 'CR2', name: '=CR₂ (alkylidene, Schrock)', l: 0, x: 2, ion: 'CR₂²⁻' },
  { id: 'N', name: '≡N (nitrido) or ≡CR (alkylidyne)', l: 0, x: 3, ion: 'N³⁻' },
];
export const ligand = (id: string) => LIGANDS.find((l) => l.id === id);

export type Item = { id: string; n: number };

/** Count for one metal: group number N, overall charge q of the complex, ligands, and metal–metal bonds (each
 *  adds one electron to this metal's count but does not change its oxidation state). */
export function count(N: number, q: number, items: Item[], mm = 0) {
  let l = 0, x = 0;
  for (const it of items) { const g = ligand(it.id); if (!g || !(it.n > 0)) continue; l += g.l * it.n; x += g.x * it.n; }
  const ve = N + 2 * l + x + mm - q, os = q + x, d = N - os;
  return { l, x, ve, os, d, lbn: l + x, mm };
}

export function verdict(ve: number, d: number, lbn: number) {
  if (ve === 18) return '18 electrons: a filled valence shell, as in most stable complexes';
  if (d === 0) return `${ve} electrons, d⁰: the 18-electron rule seldom holds for d⁰ metals; π donation from oxo, imido or Cp ligands adds electrons the simple count leaves out`;
  if (ve === 16 && d === 8 && lbn === 4) return '16 electrons, square-planar d⁸: stable, typical of Rh(I), Ir(I), Pd(II) and Pt(II); such complexes take part in oxidative addition';
  if (ve === 16) return '16 electrons: one site short of 18; can bind another ligand, common in catalytic intermediates';
  if (ve < 16) return `${ve} electrons: electron-poor; usual for early metals (Ti, Zr, V) or with bulky ligands`;
  if (ve === 17 || ve === 19) return `${ve} electrons: a radical (odd count); such complexes are often reactive or dimerise (Mn(CO)₅ → Mn₂(CO)₁₀) unless stable like cobaltocene (19)`;
  return `${ve} electrons: more than 18; check the hapticity of the ring ligands (η⁵ or η³ Cp, η⁶ or η⁴ arene) and the charge`;
}

export const roman = (n: number) => { if (n === 0) return '0'; const s = n < 0 ? '−' : ''; let v = Math.abs(n), r = ''; for (const [a, b] of [[10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']] as [number, string][]) while (v >= a) { r += b; v -= a; } return s + r; };

/** Ready-made examples (metal, charge, ligands, metal–metal bonds, expected VE). */
export const PRESETS = [
  { id: 'ferrocene', name: 'Ferrocene, Cp₂Fe', m: 'Fe', q: 0, items: [{ id: 'Cp', n: 2 }], mm: 0, ve: 18 },
  { id: 'feco5', name: 'Iron pentacarbonyl, Fe(CO)₅', m: 'Fe', q: 0, items: [{ id: 'CO', n: 5 }], mm: 0, ve: 18 },
  { id: 'nico4', name: 'Nickel tetracarbonyl, Ni(CO)₄', m: 'Ni', q: 0, items: [{ id: 'CO', n: 4 }], mm: 0, ve: 18 },
  { id: 'crbz', name: 'Bis(benzene)chromium, Cr(η⁶-C₆H₆)₂', m: 'Cr', q: 0, items: [{ id: 'arene', n: 2 }], mm: 0, ve: 18 },
  { id: 'mn2', name: 'Dimanganese decacarbonyl, per Mn', m: 'Mn', q: 0, items: [{ id: 'CO', n: 5 }], mm: 1, ve: 18 },
  { id: 'wilk', name: "Wilkinson's catalyst, RhCl(PPh₃)₃", m: 'Rh', q: 0, items: [{ id: 'Cl', n: 1 }, { id: 'PR3', n: 3 }], mm: 0, ve: 16 },
  { id: 'vaska', name: "Vaska's complex, IrCl(CO)(PPh₃)₂", m: 'Ir', q: 0, items: [{ id: 'Cl', n: 1 }, { id: 'CO', n: 1 }, { id: 'PR3', n: 2 }], mm: 0, ve: 16 },
  { id: 'zeise', name: "Zeise's salt anion, [PtCl₃(C₂H₄)]⁻", m: 'Pt', q: -1, items: [{ id: 'Cl', n: 3 }, { id: 'alkene', n: 1 }], mm: 0, ve: 16 },
  { id: 'cisplatin', name: 'Cisplatin, PtCl₂(NH₃)₂', m: 'Pt', q: 0, items: [{ id: 'Cl', n: 2 }, { id: 'NH3', n: 2 }], mm: 0, ve: 16 },
  { id: 'coam', name: 'Hexaamminecobalt(III), [Co(NH₃)₆]³⁺', m: 'Co', q: 3, items: [{ id: 'NH3', n: 6 }], mm: 0, ve: 18 },
  { id: 'fecn', name: 'Ferrocyanide, [Fe(CN)₆]⁴⁻', m: 'Fe', q: -4, items: [{ id: 'CN', n: 6 }], mm: 0, ve: 18 },
  { id: 'cp2ticl2', name: 'Titanocene dichloride, Cp₂TiCl₂', m: 'Ti', q: 0, items: [{ id: 'Cp', n: 2 }, { id: 'Cl', n: 2 }], mm: 0, ve: 16 },
  { id: 'cobaltocene', name: 'Cobaltocene, Cp₂Co', m: 'Co', q: 0, items: [{ id: 'Cp', n: 2 }], mm: 0, ve: 19 },
  { id: 'mno4', name: 'Permanganate, [MnO₄]⁻', m: 'Mn', q: -1, items: [{ id: 'O', n: 4 }], mm: 0, ve: 16 },
  { id: 'cpfeco2me', name: 'CpFe(CO)₂CH₃', m: 'Fe', q: 0, items: [{ id: 'Cp', n: 1 }, { id: 'CO', n: 2 }, { id: 'R', n: 1 }], mm: 0, ve: 18 },
];
