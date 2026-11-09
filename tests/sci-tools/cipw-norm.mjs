// #871 CIPW norm: checked against pyrolite's CIPW_norm (Verma et al. 2003 procedure; pyrolite uses its own
// periodictable atomic weights, so agreement is to about 0.001 wt%) on made-up basalt, granite, nephelinite,
// peraluminous, peralkaline, ultrapotassic and extremely silica-poor compositions, with no iron adjustment and with
// Le Maitre's volcanic and plutonic corrections; plus mass balance and hand-checkable cases.
import { cipw, adjustIron, M, MINERALS } from '../../src/lib/sci/cipw.ts';

const COMPS = {"basalt": {"SiO2": 49.5, "TiO2": 1.8, "Al2O3": 15, "Fe2O3": 0, "FeO": 10.5, "MnO": 0.18, "MgO": 8, "CaO": 10.5, "Na2O": 2.8, "K2O": 0.6, "P2O5": 0.25}, "granite": {"SiO2": 72.5, "TiO2": 0.3, "Al2O3": 14, "Fe2O3": 0.8, "FeO": 1.2, "MnO": 0.05, "MgO": 0.5, "CaO": 1.5, "Na2O": 3.6, "K2O": 4.5, "P2O5": 0.1}, "nephelinite": {"SiO2": 40.5, "TiO2": 2.6, "Al2O3": 12.5, "Fe2O3": 5, "FeO": 7.5, "MnO": 0.2, "MgO": 10.5, "CaO": 13, "Na2O": 4.5, "K2O": 1.5, "P2O5": 0.9}, "peraluminous": {"SiO2": 70, "TiO2": 0.2, "Al2O3": 17, "Fe2O3": 0.5, "FeO": 1, "MnO": 0.03, "MgO": 0.6, "CaO": 0.4, "Na2O": 2.5, "K2O": 5, "P2O5": 0.2}, "peralkaline": {"SiO2": 74, "TiO2": 0.2, "Al2O3": 9, "Fe2O3": 2.5, "FeO": 1.5, "MnO": 0.08, "MgO": 0.05, "CaO": 0.3, "Na2O": 6.5, "K2O": 4.4, "P2O5": 0.02}, "ultrapotassic": {"SiO2": 38, "TiO2": 3.5, "Al2O3": 9, "Fe2O3": 4, "FeO": 6, "MnO": 0.2, "MgO": 12, "CaO": 18, "Na2O": 1, "K2O": 7.5, "P2O5": 1.5}, "extreme": {"SiO2": 30, "TiO2": 4, "Al2O3": 8, "Fe2O3": 6, "FeO": 6, "MnO": 0.2, "MgO": 14, "CaO": 20, "Na2O": 3, "K2O": 6, "P2O5": 1.5}};
const PYROLITE = {"basalt_volc": {"Or": 3.563, "Ab": 23.808, "An": 26.7175, "Di": 19.2522, "Hy": 14.7439, "Ol": 2.3052, "Mt": 5.5928, "Il": 3.4354, "Ap": 0.582}, "basalt_plut": {"Or": 3.5655, "Ab": 23.8246, "An": 26.7361, "Di": 19.3702, "Hy": 13.5054, "Ol": 4.3897, "Mt": 4.5883, "Il": 3.4378, "Ap": 0.5825}, "granite_none": {"Q": 30.431, "C": 0.7258, "Or": 26.848, "Ab": 30.7539, "An": 6.8534, "Hy": 2.408, "Mt": 1.1709, "Il": 0.5752, "Ap": 0.2339}, "nephelinite_none": {"An": 9.6024, "Lc": 7.0423, "Ne": 20.8993, "Di": 35.1117, "Ol": 11.153, "Cs": 1.7312, "Mt": 7.3443, "Il": 5.0031, "Ap": 2.1127}, "peraluminous_none": {"Q": 35.5258, "C": 7.4174, "Or": 30.3272, "Ab": 21.712, "An": 0.6957, "Hy": 2.7126, "Mt": 0.744, "Il": 0.3899, "Ap": 0.4756}, "peralkaline_none": {"Q": 34.5137, "Or": 26.3846, "Ab": 22.1155, "Ac": 7.3393, "Ns": 5.9032, "Di": 1.2189, "Hy": 2.0924, "Il": 0.3854, "Ap": 0.047}, "ultrapotassic_none": {"Lc": 26.3866, "Ne": 2.4399, "Kp": 5.8886, "Ac": 3.4346, "Ol": 23.3222, "Cs": 24.4383, "Mt": 4.0375, "Il": 6.601, "Ap": 3.4512}, "extreme_none": {"Ne": 4.25, "Kp": 20.4142, "Ac": 15.7458, "Ol": 28.0919, "Cs": 28.0454, "Mt": 0.9228, "Il": 7.6968, "Ap": 3.5211}};

export default async (check) => {
  const near = (a, b, tol) => Math.abs(a - b) <= tol;
  const FE = { none: { mode: 'none' }, volc: { mode: 'lemaitre', rock: 'volcanic' }, plut: { mode: 'lemaitre', rock: 'plutonic' } };
  for (const [key, want] of Object.entries(PYROLITE)) {
    const [rock, fe] = key.split('_'), r = cipw(COMPS[rock], FE[fe]);
    const bad = MINERALS.filter((m) => !near(r.wt[m], want[m] ?? 0, 2e-3));
    check(`cipw: ${rock} (${fe}) matches pyrolite to 0.002 wt%${bad.length ? ' — off: ' + bad.join(',') : ''}`, bad.length === 0);
  }
  // Mass balance: the norm adds up to the oxides (100 % after closure), plus any silica that had to be borrowed.
  check('cipw: norm totals 100 % for every made-up rock', Object.values(COMPS).every((c) => { const r = cipw(c); return near(r.total - r.silicaDeficit, 100, 1e-9); }));
  { const r = cipw(COMPS.extreme); check('cipw: too little silica even for kaliophilite and Ca2SiO4 is reported', r.silicaDeficit > 8 && r.wt.Kp > 0 && r.wt.Lc === 0 && r.wt.Di === 0); }
  // Differentiation index and plagioclase.
  { const g = cipw(COMPS.granite); check('cipw: granite DI = Q + Or + Ab', near(g.DI, g.wt.Q + g.wt.Or + g.wt.Ab, 1e-12) && near(g.DI, 88.03, 0.01) && g.saturation.startsWith('quartz')); }
  { const b = cipw(COMPS.basalt); check('cipw: basalt is olivine and hypersthene-normative, An in plagioclase', b.saturation.startsWith('olivine and hyp') && near(b.anPlag, 100 * b.wt.An / (b.wt.An + b.wt.Ab), 1e-12)); }
  { const n = cipw(COMPS.nephelinite); check('cipw: nephelinite is nepheline-normative with no Q, Hy or Ab', n.wt.Ne > 20 && n.wt.Q === 0 && n.wt.Hy === 0 && n.wt.Ab === 0 && n.saturation.startsWith('nepheline')); }
  // Hand-checkable: pure albite composition gives 100 % Ab; pure forsterite-enstatite mix.
  { const ab = { Na2O: M.Na2O, Al2O3: M.Al2O3, SiO2: 6 * M.SiO2 }; const r = cipw(ab); check('cipw: NaAlSi3O8 composition is 100 % albite', near(r.wt.Ab, 100, 1e-9) && near(r.total, 100, 1e-9)); }
  { const fo = { MgO: 3 * M.MgO, SiO2: 2 * M.SiO2 }; const r = cipw(fo); // 3 MgO + 2 SiO2 = 1 enstatite + 1 forsterite
    check('cipw: 3MgO·2SiO2 splits into hypersthene and olivine 1:1 by moles', near(r.mol.Hy / r.mol.Ol, 1, 1e-12) && r.wt.Q === 0); }
  { const q = cipw({ SiO2: 50, CaO: 50 * M.CaO / M.SiO2 / 2 }); check('cipw: CaO + excess SiO2 gives wollastonite and quartz', q.wt.Wo > 0 && q.wt.Q > 0 && near(q.mol.Wo, q.mol.Q, 1e-9)); }
  // Iron adjustment.
  { const a = adjustIron({ ...COMPS.basalt }, { mode: 'ratio', ratio: 0.2 }); const feT = (x) => x.FeO + x.Fe2O3 * 2 * M.FeO / M.Fe2O3;
    check('cipw: fixed Fe2O3/FeO ratio keeps total iron', near(a.Fe2O3 / a.FeO, 0.2, 1e-12) && near(feT(a), 10.5, 1e-12)); }
  { const c = COMPS.basalt, a = adjustIron({ ...c }, { mode: 'lemaitre', rock: 'volcanic' }), r = 0.93 - 0.0042 * c.SiO2 - 0.022 * (c.Na2O + c.K2O);
    check('cipw: Le Maitre volcanic FeO/(FeO + Fe2O3) by weight', near(a.FeO / (a.FeO + a.Fe2O3), r, 1e-12)); }
  { const c = cipw({ SiO2: 50, Al2O3: 15, FeO: 10, MgO: 10, CaO: 10, Na2O: 3, K2O: 1, TiO2: 1 }, { mode: 'none' }, false); check('cipw: closure off keeps the sum as given', near(c.sumIn, 100, 1e-12) && near(c.total, 100, 1e-9)); }
  { const c = cipw({ SiO2: 25, Al2O3: 7.5, FeO: 5, MgO: 5, CaO: 5, Na2O: 1.5, K2O: 0.5, TiO2: 0.5 }), d = cipw({ SiO2: 50, Al2O3: 15, FeO: 10, MgO: 10, CaO: 10, Na2O: 3, K2O: 1, TiO2: 1 });
    check('cipw: closure makes a halved analysis give the same norm', MINERALS.every((m) => near(c.wt[m], d.wt[m], 1e-9))); }
};
