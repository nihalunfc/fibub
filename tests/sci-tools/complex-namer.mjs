// #1434 Coordination compound namer. Names and formulas checked against standard IUPAC-style names of well-known
// complexes (written out by hand from the naming rules), Werner's AgCl counts (3, 2, 1) and the charge balance.
import * as C from '../../src/lib/sci/coordname.ts';
const WANT = [
  ['CoCl₃·6NH₃', '[Co(NH₃)₆]Cl₃', 'hexaamminecobalt(III) chloride', 6, 4, 3],
  ['CoCl₃·5NH₃', '[CoCl(NH₃)₅]Cl₂', 'pentaamminechloridocobalt(III) chloride', 6, 3, 2],
  ['CoCl₃·4NH₃', '[CoCl₂(NH₃)₄]Cl', 'tetraamminedichloridocobalt(III) chloride', 6, 2, 1],
  ['K₃[Fe(CN)₆]', 'K₃[Fe(CN)₆]', 'potassium hexacyanidoferrate(III)', 6, 4, 0],
  ['K₄[Fe(CN)₆]', 'K₄[Fe(CN)₆]', 'potassium hexacyanidoferrate(II)', 6, 5, 0],
  ['[Ni(CO)₄]', '[Ni(CO)₄]', 'tetracarbonylnickel(0)', 4, 0, 0],
  ['[Cu(NH₃)₄]SO₄', '[Cu(NH₃)₄]SO₄', 'tetraamminecopper(II) sulfate', 4, 2, 0],
  ['[Co(en)₃]Cl₃', '[Co(en)₃]Cl₃', 'tris(ethane-1,2-diamine)cobalt(III) chloride', 6, 4, 3],
  ['[PtCl₂(NH₃)₂]', '[PtCl₂(NH₃)₂]', 'diamminedichloridoplatinum(II)', 4, 0, 0],
  ['K₃[Fe(ox)₃]', 'K₃[Fe(ox)₃]', 'potassium trioxalatoferrate(III)', 6, 4, 0],
];
export default async (check) => {
  for (const [label, f, n, cn, ions, ag] of WANT) {
    const a = C.analyse(C.PRESETS.find((p) => p.label === label).spec);
    check(`complex: ${label}`, a.formula === f && a.name === n && a.cn === cn && a.ionsInWater === ions && a.agclPerMole === ag);
  }
  check('complex: sulfate with a 3+ complex', C.analyse({ metal: 'Co', ox: 3, ligands: { NH3: 6 }, counter: 'SO4' }).formula === '[Co(NH₃)₆]₂(SO₄)₃');
  check('complex: nitrito-N hyphen', C.analyse({ metal: 'Co', ox: 3, ligands: { NH3: 3, NO2: 3 } }).name === 'triamminetrinitrito-N-cobalt(III)');
  check('complex: platinate(IV) and hydroxidozincate', C.analyse({ metal: 'Pt', ox: 4, ligands: { Cl: 6 }, counter: 'K' }).formula === 'K₂[PtCl₆]' && C.analyse({ metal: 'Zn', ox: 2, ligands: { OH: 4 }, counter: 'Na' }).name === 'sodium tetrahydroxidozincate(II)');
  check('complex: aqua in brackets, alphabetical formula', C.analyse({ metal: 'Co', ox: 3, ligands: { NH3: 4, H2O: 1, Cl: 1 }, counter: 'Cl' }).formula === '[CoCl(H₂O)(NH₃)₄]Cl₂');
  check('complex: en enclosed even once', C.analyse({ metal: 'Pt', ox: 2, ligands: { en: 1, Cl: 2 } }).name === 'dichlorido(ethane-1,2-diamine)platinum(II)');
  check('complex: charge and ion symbol', C.analyse({ metal: 'Fe', ox: 3, ligands: { CN: 6 }, counter: 'K' }).ionCharge === '3−' && C.analyse({ metal: 'Co', ox: 3, ligands: { NH3: 5, Cl: 1 }, counter: 'Cl' }).ionCharge === '2+');
  let bad = 0; for (const s of [{ metal: 'Co', ox: 3, ligands: {} }, { metal: 'Co', ox: 3, ligands: { NH3: 6 }, counter: 'K' }, { metal: 'Fe', ox: 3, ligands: { CN: 6 } }, { metal: 'Xx', ox: 1, ligands: { NH3: 1 } }]) { try { C.analyse(s); } catch { bad++; } }
  check('complex: bad input refused', bad === 4);
};
