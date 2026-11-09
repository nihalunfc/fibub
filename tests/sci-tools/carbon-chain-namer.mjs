// #1104 Carbon chain namer. Names checked against 34 standard IUPAC names of simple compounds (alkanes to C10,
// branched alkanes where the longest chain runs through a drawn branch, alkenes and alkynes with locants, alcohols,
// aldehydes, ketones, carboxylic acids and haloalkanes, e.g. 4-methylpentan-2-ol, but-3-en-2-ol, 2-ethylpent-1-ene,
// 4-ethyl-2,4-dimethylheptane); molecular formulas checked by counting atoms by hand.
import { nameOf, blank, check as problems } from '../../src/lib/sci/chainname.ts';

export default async (check) => {
  const B = (n, f) => { const b = blank(n); f && f(b); return b; };
  const cases = [
    [B(1), 'methane'], [B(2), 'ethane'], [B(4), 'butane'], [B(10), 'decane'],
    [B(3, (b) => b.branches[1] = [1]), '2-methylpropane'],
    [B(5, (b) => b.branches[1] = [2]), '3-methylhexane'],
    [B(5, (b) => b.branches[2] = [2, 2]), '3,3-diethylpentane'],
    [B(4, (b) => { b.branches[1] = [1, 1]; }), '2,2-dimethylbutane'],
    [B(4, (b) => { b.branches[2] = [1]; }), '2-methylbutane'],
    [B(4, (b) => { b.bond = { kind: 'double', at: 1 }; }), 'but-2-ene'],
    [B(4, (b) => { b.bond = { kind: 'double', at: 2 }; }), 'but-1-ene'],
    [B(3, (b) => { b.bond = { kind: 'double', at: 0 }; }), 'propene'],
    [B(2, (b) => { b.bond = { kind: 'triple', at: 0 }; }), 'ethyne'],
    [B(2, (b) => { b.group = { kind: 'OH', at: 1 }; }), 'ethanol'],
    [B(3, (b) => { b.group = { kind: 'OH', at: 1 }; }), 'propan-2-ol'],
    [B(3, (b) => { b.group = { kind: 'OH', at: 2 }; }), 'propan-1-ol'],
    [B(3, (b) => { b.group = { kind: 'CHO', at: 2 }; }), 'propanal'],
    [B(1, (b) => { b.group = { kind: 'CHO', at: 0 }; }), 'methanal'],
    [B(2, (b) => { b.group = { kind: 'COOH', at: 0 }; }), 'ethanoic acid'],
    [B(3, (b) => { b.group = { kind: 'CO', at: 1 }; }), 'propanone'],
    [B(5, (b) => { b.group = { kind: 'CO', at: 3 }; }), 'pentan-2-one'],
    [B(4, (b) => { b.group = { kind: 'Cl', at: 1 }; }), '2-chlorobutane'],
    [B(4, (b) => { b.group = { kind: 'Br', at: 3 }; b.branches[1] = [1]; }), '1-bromo-3-methylbutane'],
    [B(4, (b) => { b.group = { kind: 'OH', at: 0 }; b.bond = { kind: 'double', at: 2 }; }), 'but-3-en-1-ol'],
    [B(4, (b) => { b.group = { kind: 'OH', at: 2 }; b.bond = { kind: 'double', at: 0 }; }), 'but-3-en-2-ol'],
    [B(5, (b) => { b.group = { kind: 'OH', at: 1 }; b.branches[3] = [1]; }), '4-methylpentan-2-ol'],
    [B(4, (b) => { b.group = { kind: 'COOH', at: 3 }; b.branches[1] = [1]; }), '3-methylbutanoic acid'],
    [B(4, (b) => { b.group = { kind: 'CHO', at: 0 }; b.bond = { kind: 'double', at: 1 }; }), 'but-2-enal'],
    [B(6, (b) => { b.branches[2] = [2]; b.branches[3] = [1]; }), '3-ethyl-4-methylhexane'],
    [B(5, (b) => { b.bond = { kind: 'double', at: 0 }; b.branches[1] = [2]; }), '2-ethylpent-1-ene'],
    [B(4, (b) => { b.bond = { kind: 'triple', at: 0 }; b.branches[2] = [1]; }), '3-methylbut-1-yne'],
    [B(7, (b) => { b.branches[3] = [1, 2]; b.branches[1] = [1]; }), '4-ethyl-2,4-dimethylheptane'],
    [B(3, (b) => { b.group = { kind: 'Cl', at: 1 }; }), '2-chloropropane'],
    [B(2, (b) => { b.bond = { kind: 'double', at: 0 }; b.group = { kind: 'Cl', at: 0 }; }), 'chloroethene'],
  ];
  const bad = cases.filter(([b, want]) => { const r = nameOf(b); return typeof r === 'string' || r.name !== want; });
  check(`chain: ${cases.length} standard names`, bad.length === 0 && cases.length === 34);
  const f = (b) => nameOf(b).formula;
  check('chain: formulas', f(B(4)) === 'C₄H₁₀' && f(B(4, (b) => { b.group = { kind: 'OH', at: 0 }; })) === 'C₄H₁₀O' && f(B(2, (b) => { b.group = { kind: 'COOH', at: 0 }; })) === 'C₂H₄O₂'
    && f(B(3, (b) => { b.bond = { kind: 'triple', at: 0 }; })) === 'C₃H₄' && f(B(3, (b) => { b.group = { kind: 'Cl', at: 0 }; })) === 'C₃H₇Cl' && f(B(5, (b) => { b.branches[2] = [2, 2]; })) === 'C₉H₂₀');
  check('chain: series', nameOf(B(3, (b) => { b.group = { kind: 'CO', at: 1 }; })).series === 'ketone' && nameOf(B(5, (b) => { b.bond = { kind: 'double', at: 1 }; })).general === 'CₙH₂ₙ' && nameOf(B(5)).series === 'alkane');
  const r = nameOf(B(5, (b) => { b.branches[1] = [2]; }));
  check('chain: re-chosen chain explained', r.length === 6 && r.steps[0].includes('6 carbons') && r.steps[0].includes('turns into a branch'));
  check('chain: wrong-end and drawn-chain names differ', nameOf(B(5, (b) => { b.group = { kind: 'OH', at: 1 }; b.branches[3] = [1]; }), { reverse: true }).name === '2-methylpentan-4-ol' && nameOf(B(5, (b) => { b.branches[1] = [2]; }), { drawnChain: true }).name === '2-ethylpentane');
  check('chain: problems', problems(B(4, (b) => { b.group = { kind: 'CHO', at: 1 }; })).length === 1 && problems(B(4, (b) => { b.group = { kind: 'CO', at: 0 }; })).length === 1
    && problems(B(4, (b) => { b.bond = { kind: 'triple', at: 1 }; b.branches[1] = [1]; }))[0].includes('5 bonds') && problems(B(2, (b) => { b.bond = { kind: 'triple', at: 0 }; b.group = { kind: 'COOH', at: 0 }; })).length === 1
    && problems(B(3, (b) => { b.group = { kind: 'CHO', at: 0 }; b.bond = { kind: 'double', at: 0 }; }))[0].includes('also carries an H') && problems(B(11)).length === 1 && typeof nameOf(B(0)) === 'string');
};
