// School chemistry (Class 10, types of chemical reaction): a set of well-known balanced reactions with their type
// (combination, decomposition, displacement, double displacement), which ones are redox and what is oxidised and
// reduced, plus a formula parser that lists the atoms for a particle picture. General chemistry facts; no DOM.

export type RType = 'combination' | 'decomposition' | 'displacement' | 'double';
export type Species = { n: number; f: string; state?: string };
export type Reaction = {
  id: string; left: Species[]; right: Species[]; type: RType;
  /** How the energy is supplied, for decompositions: heat, electricity or light. */
  by?: 'heat' | 'electricity' | 'light';
  /** Redox, Class 10 view: who gains oxygen / loses hydrogen (oxidised) and who loses oxygen / gains hydrogen (reduced). */
  ox?: string; red?: string; why10?: string;
  /** Class 11 view: oxidation-number changes. */
  why11?: string;
  seen: string;
};

export const TYPE_NAME: Record<RType, string> = { combination: 'Combination', decomposition: 'Decomposition', displacement: 'Displacement', double: 'Double displacement' };

export const TYPE_RULE: Record<RType, string> = {
  combination: 'Two or more substances join to make a single product: A + B → AB.',
  decomposition: 'One substance breaks down into two or more simpler ones: AB → A + B. It needs energy: heat, electricity or light.',
  displacement: 'A more reactive element pushes a less reactive one out of its compound: A + BC → AC + B.',
  double: 'Two compounds swap partners: AB + CD → AD + CB. Often a precipitate forms, or an acid and a base give salt and water.',
};

const s = (n: number, f: string, state?: string): Species => ({ n, f, state });

export const REACTIONS: Reaction[] = [
  { id: 'mg-burn', left: [s(2, 'Mg', 's'), s(1, 'O2', 'g')], right: [s(2, 'MgO', 's')], type: 'combination', ox: 'Mg', red: 'O₂', why10: 'Magnesium gains oxygen, so it is oxidised.', why11: 'Mg goes from 0 to +2 (loses 2 electrons each); O goes from 0 to −2 (gains them).', seen: 'A dazzling white flame and a white powder.' },
  { id: 'quicklime', left: [s(1, 'CaO', 's'), s(1, 'H2O', 'l')], right: [s(1, 'Ca(OH)2', 'aq')], type: 'combination', seen: 'A hiss and a lot of heat: slaking lime for whitewash.' },
  { id: 'h2-burn', left: [s(2, 'H2', 'g'), s(1, 'O2', 'g')], right: [s(2, 'H2O', 'l')], type: 'combination', ox: 'H₂', red: 'O₂', why10: 'Hydrogen gains oxygen, so it is oxidised.', why11: 'H goes from 0 to +1; O goes from 0 to −2.', seen: 'A squeaky pop and droplets of water.' },
  { id: 'c-burn', left: [s(1, 'C', 's'), s(1, 'O2', 'g')], right: [s(1, 'CO2', 'g')], type: 'combination', ox: 'C', red: 'O₂', why10: 'Carbon gains oxygen, so it is oxidised.', why11: 'C goes from 0 to +4; O goes from 0 to −2.', seen: 'Coal glows and a colourless gas forms that turns lime water milky.' },
  { id: 'nh3-hcl', left: [s(1, 'NH3', 'g'), s(1, 'HCl', 'g')], right: [s(1, 'NH4Cl', 's')], type: 'combination', seen: 'White smoke where the two gases meet.' },
  { id: 'limestone', left: [s(1, 'CaCO3', 's')], right: [s(1, 'CaO', 's'), s(1, 'CO2', 'g')], type: 'decomposition', by: 'heat', seen: 'Strong heating gives quicklime and a gas that turns lime water milky.' },
  { id: 'water-split', left: [s(2, 'H2O', 'l')], right: [s(2, 'H2', 'g'), s(1, 'O2', 'g')], type: 'decomposition', by: 'electricity', ox: 'the oxygen in water', red: 'the hydrogen in water', why10: 'Water loses its oxygen and its hydrogen: it is split by electricity (electrolysis).', why11: 'H goes from +1 to 0 (reduced); O goes from −2 to 0 (oxidised).', seen: 'Bubbles at both electrodes, twice as much gas at the negative one (hydrogen).' },
  { id: 'agcl-light', left: [s(2, 'AgCl', 's')], right: [s(2, 'Ag', 's'), s(1, 'Cl2', 'g')], type: 'decomposition', by: 'light', ox: 'the chloride', red: 'the silver ion', why10: 'Silver chloride breaks down in sunlight; silver is left behind.', why11: 'Ag goes from +1 to 0 (reduced); Cl goes from −1 to 0 (oxidised).', seen: 'White silver chloride turns grey in sunlight (used in old black-and-white photography).' },
  { id: 'feso4-heat', left: [s(2, 'FeSO4', 's')], right: [s(1, 'Fe2O3', 's'), s(1, 'SO2', 'g'), s(1, 'SO3', 'g')], type: 'decomposition', by: 'heat', ox: 'iron', red: 'sulfur', why10: 'Iron ends up with more oxygen around it in Fe₂O₃.', why11: 'Fe goes from +2 to +3 (oxidised); one S goes from +6 to +4 (reduced).', seen: 'Green crystals turn white then brown, with a smell of burning sulfur.' },
  { id: 'pbno3-heat', left: [s(2, 'Pb(NO3)2', 's')], right: [s(2, 'PbO', 's'), s(4, 'NO2', 'g'), s(1, 'O2', 'g')], type: 'decomposition', by: 'heat', ox: 'oxygen', red: 'nitrogen', why10: 'Lead nitrate breaks down when heated; nitrogen ends up with less oxygen.', why11: 'N goes from +5 to +4 (reduced); some O goes from −2 to 0 (oxidised).', seen: 'Brown fumes of nitrogen dioxide.' },
  { id: 'fe-cuso4', left: [s(1, 'Fe', 's'), s(1, 'CuSO4', 'aq')], right: [s(1, 'FeSO4', 'aq'), s(1, 'Cu', 's')], type: 'displacement', ox: 'Fe', red: 'Cu²⁺ (in CuSO₄)', why10: 'Iron is more reactive than copper and takes its place.', why11: 'Fe goes from 0 to +2 (loses 2 electrons); Cu goes from +2 to 0 (gains them).', seen: 'A brown coat on the iron nail and the blue solution fades to pale green.' },
  { id: 'zn-hcl', left: [s(1, 'Zn', 's'), s(2, 'HCl', 'aq')], right: [s(1, 'ZnCl2', 'aq'), s(1, 'H2', 'g')], type: 'displacement', ox: 'Zn', red: 'H⁺ (in HCl)', why10: 'Zinc pushes hydrogen out of the acid.', why11: 'Zn goes from 0 to +2; H goes from +1 to 0.', seen: 'Fizzing; the gas burns with a pop.' },
  { id: 'zn-cuso4', left: [s(1, 'Zn', 's'), s(1, 'CuSO4', 'aq')], right: [s(1, 'ZnSO4', 'aq'), s(1, 'Cu', 's')], type: 'displacement', ox: 'Zn', red: 'Cu²⁺ (in CuSO₄)', why10: 'Zinc is more reactive than copper and takes its place.', why11: 'Zn goes from 0 to +2; Cu goes from +2 to 0.', seen: 'The blue colour fades and red-brown copper appears.' },
  { id: 'cuo-h2', left: [s(1, 'CuO', 's'), s(1, 'H2', 'g')], right: [s(1, 'Cu', 's'), s(1, 'H2O', 'l')], type: 'displacement', ox: 'H₂', red: 'CuO', why10: 'Copper oxide loses oxygen (reduced); hydrogen gains it (oxidised).', why11: 'Cu goes from +2 to 0; H goes from 0 to +1.', seen: 'Black copper oxide turns brown as copper forms.' },
  { id: 'zno-c', left: [s(1, 'ZnO', 's'), s(1, 'C', 's')], right: [s(1, 'Zn', 's'), s(1, 'CO', 'g')], type: 'displacement', ox: 'C', red: 'ZnO', why10: 'Zinc oxide loses oxygen to carbon: this is how zinc is taken out of its ore.', why11: 'Zn goes from +2 to 0; C goes from 0 to +2.', seen: 'Done in a furnace; zinc vapour forms.' },
  { id: 'baso4', left: [s(1, 'Na2SO4', 'aq'), s(1, 'BaCl2', 'aq')], right: [s(1, 'BaSO4', 's'), s(2, 'NaCl', 'aq')], type: 'double', seen: 'A thick white precipitate of barium sulfate.' },
  { id: 'neutral', left: [s(1, 'NaOH', 'aq'), s(1, 'HCl', 'aq')], right: [s(1, 'NaCl', 'aq'), s(1, 'H2O', 'l')], type: 'double', seen: 'Nothing to see, but the mixture warms up: neutralisation.' },
  { id: 'agno3', left: [s(1, 'AgNO3', 'aq'), s(1, 'NaCl', 'aq')], right: [s(1, 'AgCl', 's'), s(1, 'NaNO3', 'aq')], type: 'double', seen: 'A white, curdy precipitate of silver chloride.' },
  { id: 'pbi2', left: [s(1, 'Pb(NO3)2', 'aq'), s(2, 'KI', 'aq')], right: [s(1, 'PbI2', 's'), s(2, 'KNO3', 'aq')], type: 'double', seen: 'A bright yellow precipitate of lead iodide.' },
  { id: 'cuso4-naoh', left: [s(1, 'CuSO4', 'aq'), s(2, 'NaOH', 'aq')], right: [s(1, 'Cu(OH)2', 's'), s(1, 'Na2SO4', 'aq')], type: 'double', seen: 'A pale blue jelly-like precipitate.' },
];

/** Atoms in a formula, in the order written, e.g. Ca(OH)2 → Ca O H O H. */
export function atoms(formula: string): string[] {
  let i = 0;
  const group = (): string[] => {
    const out: string[] = [];
    while (i < formula.length && formula[i] !== ')') {
      let part: string[];
      if (formula[i] === '(') { i++; part = group(); i++; }
      else { const m = /^[A-Z][a-z]?/.exec(formula.slice(i)); if (!m) throw new Error(`Bad formula ${formula}`); i += m[0].length; part = [m[0]]; }
      const d = /^\d+/.exec(formula.slice(i)); const k = d ? Number(d[0]) : 1; if (d) i += d[0].length;
      for (let j = 0; j < k; j++) out.push(...part);
    }
    return out;
  };
  return group();
}

/** Count of each element on one side. */
export function count(side: Species[]): Record<string, number> {
  const c: Record<string, number> = {};
  for (const sp of side) for (const a of atoms(sp.f)) c[a] = (c[a] ?? 0) + sp.n;
  return c;
}

export function balanced(r: Reaction): boolean {
  const a = count(r.left), b = count(r.right);
  return Object.keys({ ...a, ...b }).every((k) => a[k] === b[k]);
}

export const isRedox = (r: Reaction) => !!r.ox;

/** Formula with subscripts, e.g. Ca(OH)2 → Ca(OH)₂. */
export const pretty = (f: string) => f.replace(/\d/g, (d) => '₀₁₂₃₄₅₆₇₈₉'[+d]);

export function equation(r: Reaction, states = true): string {
  const side = (x: Species[]) => x.map((sp) => `${sp.n > 1 ? sp.n : ''}${pretty(sp.f)}${states && sp.state ? `(${sp.state})` : ''}`).join(' + ');
  return `${side(r.left)} → ${side(r.right)}`;
}
