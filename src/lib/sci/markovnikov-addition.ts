// Markovnikov addition predictor (Class 11 chemistry, hydrocarbons): HX or water adds across C=C of an alkene.
// Ionic path: H⁺ adds first to the carbon that gives the more stable carbocation (3° > 2° > 1°), then X⁻ joins
// the positive carbon. With HBr and a peroxide, a Br• radical adds first to give the more stable radical, so H ends
// on the more substituted carbon (anti-Markovnikov, the Kharasch peroxide effect). Plain logic, no DOM.

/** One carbon of the C=C: how many carbon groups it carries, its condensed text in the cation/radical made when
 *  the OTHER carbon takes H (or Br•), and the α C–H bonds that can hyperconjugate with it. */
export type Side = { alkyl: number; alphaH: number };
export type Alkene = {
  id: string; name: string; formula: string;
  sides: [Side, Side];
  /** Condensed cation (positive on side i, after H added to the other side). */
  cation: [string, string];
  /** Names and formulas of the product with X on side i: halide stem uses "X" for the halogen prefix. */
  halide: [string, string]; alcohol: [string, string]; product: [string, string];
};

export const ALKENES: Alkene[] = [
  { id: 'propene', name: 'Propene', formula: 'CH₃–CH=CH₂', sides: [{ alkyl: 1, alphaH: 6 }, { alkyl: 0, alphaH: 2 }],
    cation: ['CH₃–C⁺H–CH₃', 'CH₃–CH₂–C⁺H₂'], halide: ['2-Xpropane', '1-Xpropane'], alcohol: ['propan-2-ol', 'propan-1-ol'], product: ['CH₃–CH(X)–CH₃', 'CH₃–CH₂–CH₂X'] },
  { id: 'but1ene', name: 'But-1-ene', formula: 'CH₃–CH₂–CH=CH₂', sides: [{ alkyl: 1, alphaH: 5 }, { alkyl: 0, alphaH: 2 }],
    cation: ['CH₃–CH₂–C⁺H–CH₃', 'CH₃–CH₂–CH₂–C⁺H₂'], halide: ['2-Xbutane', '1-Xbutane'], alcohol: ['butan-2-ol', 'butan-1-ol'], product: ['CH₃–CH₂–CH(X)–CH₃', 'CH₃–CH₂–CH₂–CH₂X'] },
  { id: 'methylpropene', name: '2-Methylpropene', formula: '(CH₃)₂C=CH₂', sides: [{ alkyl: 2, alphaH: 9 }, { alkyl: 0, alphaH: 1 }],
    cation: ['(CH₃)₂C⁺–CH₃', '(CH₃)₂CH–C⁺H₂'], halide: ['2-X-2-methylpropane', '1-X-2-methylpropane'], alcohol: ['2-methylpropan-2-ol', '2-methylpropan-1-ol'], product: ['(CH₃)₃C–X', '(CH₃)₂CH–CH₂X'] },
  { id: 'methylbut2ene', name: '2-Methylbut-2-ene', formula: '(CH₃)₂C=CH–CH₃', sides: [{ alkyl: 2, alphaH: 8 }, { alkyl: 1, alphaH: 4 }],
    cation: ['(CH₃)₂C⁺–CH₂–CH₃', '(CH₃)₂CH–C⁺H–CH₃'], halide: ['2-X-2-methylbutane', '2-X-3-methylbutane'], alcohol: ['2-methylbutan-2-ol', '3-methylbutan-2-ol'], product: ['(CH₃)₂C(X)–CH₂–CH₃', '(CH₃)₂CH–CH(X)–CH₃'] },
  { id: 'but2ene', name: 'But-2-ene', formula: 'CH₃–CH=CH–CH₃', sides: [{ alkyl: 1, alphaH: 5 }, { alkyl: 1, alphaH: 5 }],
    cation: ['CH₃–CH₂–C⁺H–CH₃', 'CH₃–C⁺H–CH₂–CH₃'], halide: ['2-Xbutane', '2-Xbutane'], alcohol: ['butan-2-ol', 'butan-2-ol'], product: ['CH₃–CH₂–CH(X)–CH₃', 'CH₃–CH(X)–CH₂–CH₃'] },
  { id: 'ethene', name: 'Ethene', formula: 'CH₂=CH₂', sides: [{ alkyl: 0, alphaH: 3 }, { alkyl: 0, alphaH: 3 }],
    cation: ['CH₃–C⁺H₂', 'C⁺H₂–CH₃'], halide: ['Xethane', 'Xethane'], alcohol: ['ethanol', 'ethanol'], product: ['CH₃–CH₂X', 'XCH₂–CH₃'] },
];

export type Reagent = 'HBr' | 'HCl' | 'HI' | 'H2O';
export const PREFIX: Record<Reagent, string> = { HBr: 'bromo', HCl: 'chloro', HI: 'iodo', H2O: '' };
export const GROUP: Record<Reagent, string> = { HBr: 'Br', HCl: 'Cl', HI: 'I', H2O: 'OH' };

/** Carbocation or radical class from the number of carbon groups on the charged carbon (after addition the
 *  carbon also bonds to the carbon it was double-bonded to, so class = alkyl + 1). */
export const klass = (alkyl: number) => ['primary (1°)', 'secondary (2°)', 'tertiary (3°)'][Math.min(2, alkyl)];

export type Prediction = { mode: 'ionic' | 'radical'; xSide: number; tie: boolean; name: string; product: string; markovnikov: boolean };
/** Which carbon gets X: the one whose cation (ionic) or radical (peroxide + HBr) is more stable. Peroxide only
 *  changes HBr: HCl and HI still add the ionic way. */
export function predict(a: Alkene, r: Reagent, peroxide: boolean): Prediction {
  const mode = peroxide && r === 'HBr' ? 'radical' : 'ionic';
  const [s0, s1] = a.sides, tie = s0.alkyl === s1.alkyl;
  // Ionic: positive charge ends on the more substituted carbon, X joins it. Radical: Br• joins the less substituted
  // carbon so the radical sits on the more substituted one; then H joins the radical carbon.
  const more = s0.alkyl > s1.alkyl || (tie && s0.alphaH >= s1.alphaH) ? 0 : 1;
  const xSide = mode === 'ionic' ? more : 1 - more;
  const name = r === 'H2O' ? a.alcohol[xSide] : a.halide[xSide].replace('X', PREFIX[r]);
  return { mode, xSide, tie, name, product: a.product[xSide].replace('X', GROUP[r]), markovnikov: tie || xSide === more };
}
