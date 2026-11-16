// "Solve my numbers" for the carbon chain namer: the IUPAC name, formula and molar mass of a chain you describe in words
// (carbons, family, where the bond or group sits, an optional methyl or ethyl branch), and the likely family of a
// formula CₓHᵧOz from its degrees of unsaturation. Uses the namer in chainname.ts. Plain TypeScript, no DOM.
import { sf, type SSpec, type SIn, type SOut } from '../learn/solvecore-b.ts';
import { nameOf, check, type Build, type Group } from './chainname.ts';

const SUB = '₀₁₂₃₄₅₆₇₈₉';
const sub = (n: number) => String(n).split('').map((c) => SUB[+c]).join('');
/** Standard atomic weights (IUPAC conventional values), g/mol. */
export const AW = { C: 12.011, H: 1.008, O: 15.999, Cl: 35.45, Br: 79.904 };
/** Structural isomers of the alkanes CₙH₂ₙ₊₂ for n = 1 to 10 (a standard result: 1, 1, 1, 2, 3, 5, 9, 18, 35, 75). */
export const ALKANE_ISOMERS = [1, 1, 1, 2, 3, 5, 9, 18, 35, 75];

const FAMILY: Record<string, string> = { alkane: 'an alkane', alkene: 'an alkene', alkyne: 'an alkyne', OH: 'an alcohol', CHO: 'an aldehyde', CO: 'a ketone', COOH: 'a carboxylic acid', Cl: 'a chloroalkane', Br: 'a bromoalkane' };

function nameIt(i: Record<string, SIn>, ch: Record<string, string>): SOut {
  const n = i.n.v, s = ch.series ?? 'alkane';
  if (!Number.isInteger(n) || n < 1 || n > 10) return { error: 'This card names chains of 1 to 10 carbons. Type a whole number from 1 to 10.' };
  const posRaw = i.pos && !i.pos.blank ? i.pos.v : NaN;
  const needsPos = ['alkene', 'alkyne', 'OH', 'CO', 'Cl', 'Br'].includes(s);
  const pos = needsPos ? (Number.isFinite(posRaw) ? posRaw : s === 'CO' ? 2 : 1) : 1;
  if (needsPos && !Number.isInteger(pos)) return { error: 'The position is a whole number: the carbon the group is on (for a double or triple bond, the lower of its two carbons).' };
  const branches: number[][] = Array.from({ length: n }, () => []);
  for (const [k, len, nm] of [['me', 1, 'methyl'], ['et', 2, 'ethyl']] as [string, number, string][]) {
    const f = i[k]; if (!f || f.blank) continue;
    if (!Number.isInteger(f.v) || f.v < 1 || f.v > n) return { error: `Put the ${nm} branch on a carbon from 1 to ${n}.` };
    branches[f.v - 1].push(len);
  }
  const b: Build = { n, branches, bond: { kind: s === 'alkene' ? 'double' : s === 'alkyne' ? 'triple' : 'single', at: pos - 1 }, group: { kind: (['OH', 'CHO', 'CO', 'COOH', 'Cl', 'Br'].includes(s) ? s : 'none') as Group, at: s === 'CHO' || s === 'COOH' ? 0 : pos - 1 } };
  if (s === 'alkene' || s === 'alkyne') { if (pos < 1 || pos > n - 1) return { error: `A ${s === 'alkene' ? 'double' : 'triple'} bond sits between two carbons, so its position runs from 1 to ${Math.max(1, n - 1)} for this chain.` }; }
  else if (needsPos && (pos < 1 || pos > n)) return { error: `The position must be from 1 to ${n}.` };
  const bad = check(b); if (bad.length) return { error: bad[0] };
  const r = nameOf(b); if (typeof r === 'string') return { error: r };
  const c = r.counts, M = c.C * AW.C + c.H * AW.H + c.O * AW.O + (c.X ? c.X * (c.hal === 'Br' ? AW.Br : AW.Cl) : 0);
  const lines = [...r.steps, `Molecular formula: ${r.formula}  (family: ${r.series}, general formula ${r.general})`, `Molar mass = ${c.C} × 12.011 + ${c.H} × 1.008${c.O ? ` + ${c.O} × 15.999` : ''}${c.X ? ` + ${c.X} × ${c.hal === 'Br' ? 79.904 : 35.45}` : ''} = ${sf(M, 4)} g/mol`];
  if (s === 'alkane' && n <= 10 && !branches.some((x) => x.length)) lines.push(`${r.formula} has ${ALKANE_ISOMERS[n - 1]} structural isomer${ALKANE_ISOMERS[n - 1] > 1 ? 's' : ''} in total (${n <= 3 ? 'it cannot branch' : 'straight chain and branched'}).`);
  return { answer: `${r.name} (${r.formula}, ${FAMILY[s]}, molar mass ${sf(M, 4)} g/mol).`, lines, tip: 'Common mistakes: numbering from the wrong end (the principal group or double bond gets the lowest number), and choosing a chain that is not the longest one through the branch. Branches are listed in alphabetical order.' };
}

function seriesOf(i: Record<string, SIn>): SOut {
  const C = i.C.v, H = i.H.v, O = i.O && !i.O.blank ? i.O.v : 0;
  if (![C, H, O].every(Number.isInteger) || C < 1 || H < 0 || O < 0) return { error: 'Type whole numbers: carbons (at least 1), hydrogens and oxygens.' };
  const dou = (2 * C + 2 - H) / 2;
  const lines = [`Degrees of unsaturation = (2C + 2 − H) ÷ 2 = (2 × ${C} + 2 − ${H}) ÷ 2 = ${sf(dou, 4)}`, 'Each double bond or ring counts 1, each triple bond counts 2, and a C=O counts 1 (oxygen does not change the count).'];
  if (!Number.isInteger(dou) || dou < 0) return { error: `C${sub(C)}H${sub(H)}${O ? 'O' + (O > 1 ? sub(O) : '') : ''} is not possible for a neutral molecule of only C, H and O: the number of hydrogens must be even and at most ${2 * C + 2}.` };
  const f = `C${sub(C)}H${sub(H)}${O ? 'O' + (O > 1 ? sub(O) : '') : ''}`;
  let a: string;
  if (O === 0) {
    a = dou === 0 ? `${f} fits an alkane (CₙH₂ₙ₊₂), all single bonds.` : dou === 1 ? `${f} fits an alkene (CₙH₂ₙ, one C=C), or a ring such as a cycloalkane.` : dou === 2 ? `${f} fits an alkyne (CₙH₂ₙ₋₂, one C≡C), or a diene (two C=C), or a ring with a double bond.` : `${f} has ${dou} degrees of unsaturation: several double or triple bonds or rings (an aromatic ring such as benzene counts 4).`;
  } else if (O === 1) {
    a = dou === 0 ? `${f} fits an alcohol (CₙH₂ₙ₊₂O) or an ether, with only single bonds.` : dou === 1 ? `${f} fits an aldehyde or a ketone (CₙH₂ₙO, one C=O), or an alcohol with a C=C or a ring.` : `${f} has ${dou} degrees of unsaturation with one oxygen: a C=O together with more double or triple bonds, or rings.`;
  } else if (O === 2) {
    a = dou === 0 ? `${f} fits a diol or an alcohol-ether, with only single bonds.` : dou === 1 ? `${f} fits a carboxylic acid (CₙH₂ₙO₂, –COOH) or an ester.` : `${f} has ${dou} degrees of unsaturation with two oxygens: for example an acid or ester with extra double bonds.`;
  } else a = `${f}: more than two oxygens, so look at the groups it carries (diacids, polyols and so on).`;
  return { answer: a, lines, tip: 'A formula alone never gives one name: C₄H₁₀O has several alcohol and ether isomers. Use the builder to draw the one you mean.' };
}

export const CHAIN_SPEC: SSpec = {
  id: 'chain',
  finds: [['name', 'Name and formula of a chain'], ['series', 'Family from a formula']],
  fields: [
    { k: 'n', label: 'Carbons in the main chain (1 to 10)', show: (c) => c.find === 'name', ph: 'e.g. 5' },
    { k: 'series', kind: 'choice', label: 'Family', def: 'alkane', show: (c) => c.find === 'name', options: [['alkane', 'Alkane (all single bonds)'], ['alkene', 'Alkene (C=C)'], ['alkyne', 'Alkyne (C≡C)'], ['OH', 'Alcohol (–OH)'], ['CHO', 'Aldehyde (–CHO)'], ['CO', 'Ketone (C=O)'], ['COOH', 'Carboxylic acid (–COOH)'], ['Cl', 'Chloroalkane'], ['Br', 'Bromoalkane']] },
    { k: 'pos', label: 'Position (carbon number; bond: lower carbon)', optional: true, show: (c) => c.find === 'name' && ['alkene', 'alkyne', 'OH', 'CO', 'Cl', 'Br'].includes(c.ch.series), ph: 'leave blank for 1 (ketone: 2)' },
    { k: 'me', label: 'Methyl branch on carbon', optional: true, show: (c) => c.find === 'name', ph: 'blank for none' },
    { k: 'et', label: 'Ethyl branch on carbon', optional: true, show: (c) => c.find === 'name', ph: 'blank for none' },
    { k: 'C', label: 'Carbons C', show: (c) => c.find === 'series', ph: 'e.g. 4' },
    { k: 'H', label: 'Hydrogens H', show: (c) => c.find === 'series', ph: 'e.g. 8' },
    { k: 'O', label: 'Oxygens O (blank for none)', optional: true, show: (c) => c.find === 'series', ph: 'e.g. 1' },
  ],
  presets: [
    { name: 'Straight chain: pent-2-ene', find: 'name', vals: { n: '5', pos: '2' }, ch: { series: 'alkene' } },
    { name: 'Butan-2-ol', find: 'name', vals: { n: '4', pos: '2' }, ch: { series: 'OH' } },
    { name: 'Alkane with a methyl on carbon 2 of 4', find: 'name', vals: { n: '4', me: '2' }, ch: { series: 'alkane' } },
    { name: 'Pentan-3-one', find: 'name', vals: { n: '5', pos: '3' }, ch: { series: 'CO' } },
    { name: 'Propanoic acid', find: 'name', vals: { n: '3' }, ch: { series: 'COOH' } },
    { name: 'C₄H₈: which family?', find: 'series', vals: { C: '4', H: '8' } },
    { name: 'C₃H₆O: which family?', find: 'series', vals: { C: '3', H: '6', O: '1' } },
    { name: 'C₂H₄O₂: which family?', find: 'series', vals: { C: '2', H: '4', O: '2' } },
  ],
  solve: (i, c) => (c.find === 'name' ? nameIt(i, c.ch) : seriesOf(i)),
};
