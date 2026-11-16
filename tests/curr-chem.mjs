// Checks for src/lib/learn/curr-chem.ts (school chemistry Learn tools) against hand-worked or published values.
// Run with `node tests/curr-chem.mjs`.
import * as C from '../src/lib/learn/curr-chem.ts';
let pass = 0, fail = 0;
const check = (name, ok) => { if (ok) pass++; else { fail++; console.log('FAIL', name); } };
const near = (a, b, t = 0.005) => Math.abs(a - b) <= t * Math.max(1, Math.abs(b));

// Formulae and molar masses
check('parse Ca(OH)2', JSON.stringify(C.parseFormula('Ca(OH)2')) === '{"Ca":1,"O":2,"H":2}');
check('Mr CaCO3 = 100.09', near(C.molarMass('CaCO3'), 100.086));
check('Mr C6H12O6 = 180.16', near(C.molarMass('C6H12O6'), 180.156));
check('Mr Al2(SO4)3 = 342.15', near(C.molarMass('Al2(SO4)3'), 342.15, 0.002));

// Electrolysis
const E = (id) => C.electrolyse(C.ELECTROLYTES.find((e) => e.id === id));
check('molten PbBr2: lead + bromine', E('pbbr2').cathode.formula === 'Pb' && E('pbbr2').anode.formula === 'Br₂');
check('molten NaCl: sodium + chlorine', E('nacl-m').cathode.formula === 'Na' && E('nacl-m').anode.formula === 'Cl₂');
check('brine: hydrogen + chlorine', E('nacl-aq').cathode.formula === 'H₂' && E('nacl-aq').anode.formula === 'Cl₂');
check('CuSO4 inert: copper + oxygen', E('cuso4-i').cathode.formula === 'Cu' && E('cuso4-i').anode.formula === 'O₂');
check('CuSO4 copper electrodes: copper dissolves at anode', E('cuso4-cu').anode.kind === 'dissolves' && E('cuso4-cu').cathode.formula === 'Cu');
check('dilute H2SO4: hydrogen + oxygen', E('h2so4').cathode.formula === 'H₂' && E('h2so4').anode.formula === 'O₂');
check('CuCl2: copper + chlorine', E('cucl2').cathode.formula === 'Cu' && E('cucl2').anode.formula === 'Cl₂');
check('KI: hydrogen + iodine', E('ki').cathode.formula === 'H₂' && E('ki').anode.formula === 'I₂');
check('reactivity rule', C.lessReactiveThanH('Cu') && !C.lessReactiveThanH('Na') && !C.lessReactiveThanH('K'));
check('half-equation Cu', E('cucl2').cathode.eq === 'Cu²⁺ + 2e⁻ → Cu' && E('nacl-m').cathode.eq === 'Na⁺ + e⁻ → Na');
{ // 2.0 A for 965 s: Q = 1930 C = 0.02000 mol e-; Cu (z=2) 0.01000 mol = 0.6355 g
  const f = C.faraday(2, 965, 2, 'Cu');
  check('Faraday Q = It', f.q === 1930);
  check('Faraday mol e- = 0.0200', near(f.ne, 0.02, 0.001));
  check('Faraday Cu mass 0.635 g', near(f.mass, 0.6355, 0.002));
  const g = C.faraday(2, 965, 2, 'H₂', true);
  check('Faraday H2 volume 0.24 dm3', near(g.volume, 0.24, 0.002));
  const o = C.faraday(1, 9648.5, 4, 'O₂', true); // 0.1 mol e- -> 0.025 mol O2 = 0.8 g
  check('Faraday O2 mass 0.80 g', near(o.mass, 0.79995, 0.002));
}

// Ion tests
const cat = C.cationById, an = C.anionById;
check('flame Li crimson, Na yellow, K lilac, Ca orange-red, Cu green', ['crimson', 'yellow', 'lilac', 'orange-red', 'green'].every((n, i) => C.flameTest(cat(['Li+', 'Na+', 'K+', 'Ca2+', 'Cu2+'][i])).text.startsWith(n)));
check('flame Mg none', C.flameTest(cat('Mg2+')).kind === 'none');
check('NaOH: Cu2+ blue, Fe2+ green, Fe3+ brown', C.naohTest(cat('Cu2+'), false).text.startsWith('blue') && C.naohTest(cat('Fe2+'), false).text.startsWith('green') && C.naohTest(cat('Fe3+'), false).text.startsWith('brown'));
check('NaOH: Ca, Mg, Al white', ['Ca2+', 'Mg2+', 'Al3+'].every((i) => C.naohTest(cat(i), false).text.startsWith('white')));
check('Al dissolves in excess, Mg does not', C.naohTest(cat('Al3+'), true).kind === 'none' && C.naohTest(cat('Mg2+'), true).kind === 'ppt');
check('Na+ no precipitate', C.naohTest(cat('Na+'), false).kind === 'none');
check('carbonate + acid milky', C.anionTest(an('CO32-'), 'acid').kind === 'milky' && C.anionTest(an('Cl-'), 'acid').kind === 'none');
check('halides: white, cream, yellow', C.anionTest(an('Cl-'), 'agno3').text.startsWith('white') && C.anionTest(an('Br-'), 'agno3').text.startsWith('cream') && C.anionTest(an('I-'), 'agno3').text.startsWith('yellow'));
check('sulfate + BaCl2 white', C.anionTest(an('SO42-'), 'bacl2').text.startsWith('white') && C.anionTest(an('Cl-'), 'bacl2').kind === 'none');
check('salt formulae', C.saltFormula(cat('Al3+'), an('SO42-')) === 'Al₂(SO₄)₃' && C.saltFormula(cat('Cu2+'), an('Cl-')) === 'CuCl₂' && C.saltFormula(cat('Na+'), an('CO32-')) === 'Na₂CO₃' && C.saltFormula(cat('Ca2+'), an('SO42-')) === 'CaSO₄' && C.saltFormula(cat('Fe3+'), an('Br-')) === 'FeBr₃');
check('Al carbonate does not exist', !C.saltExists(cat('Al3+'), an('CO32-')));
{ let ok = true; for (let i = 0; i < 200; i++) { const m = C.mysterySalt(); ok = ok && C.saltExists(m.c, m.a); } check('mystery salts are real', ok); }
check('guess check', C.checkGuess('Cu2+', 'Cl-', 'Cu2+', 'Br-').cation && !C.checkGuess('Cu2+', 'Cl-', 'Cu2+', 'Br-').anion);

// Crude oil
check('boiling points: C1 -161.5, C5 36.1, C10 174.1, C20 343', C.boilingPoint(1) === -161.5 && C.boilingPoint(5) === 36.1 && C.boilingPoint(10) === 174.1 && C.boilingPoint(20) === 343);
check('boiling points rise with chain length', C.BOILING_C.every((b, i) => i === 0 || b > C.BOILING_C[i - 1]) && C.BOILING_C.length === 20 && C.ALKANE_NAMES.length === 20);
check('state at 20 C', C.stateAt20(4) === 'gas' && C.stateAt20(5) === 'liquid' && C.stateAt20(16) === 'liquid' && C.stateAt20(17) === 'waxy solid');
check('formulae C8H18, C2H4', C.alkaneFormula(8) === 'C₈H₁₈' && C.alkeneFormula(2) === 'C₂H₄');
check('fractions', C.fractionFor(3).id === 'gases' && C.fractionFor(8).id === 'petrol' && C.fractionFor(12).id === 'kerosene' && C.fractionFor(18).id === 'diesel' && C.fractionFor(30).id === 'fueloil');
check('trend scales', C.viscosityTrend(1) === 0 && C.viscosityTrend(20) === 100 && C.flammabilityTrend(1) === 100);
{ const k = C.crack(10, 8);
  check('crack decane -> octane + ethene balanced', k.alkane === 'C₈H₁₈' && k.alkene === 'C₂H₄' && k.balanced && k.alkeneName === 'ethene' && k.eq === 'C₁₀H₂₂ → C₈H₁₈ + C₂H₄'); }
check('crack every valid split balances', (() => { for (let n = 4; n <= 20; n++) for (let k = 1; n - k >= 2; k++) if (!C.crack(n, k).balanced) return false; return true; })());
check('crack invalid', C.crack(4, 3) === null && C.crack(10, 0) === null);

// Yield and atom economy
const RX = (id) => C.YIELD_RX.find((r) => r.id === id);
{ const t = C.theoreticalYield(RX('caco3'), 100); check('CaCO3 100 g -> 56.0 g CaO', near(t.grams, 56.03, 0.003)); check('percent yield 42/56.03 = 75 %', near(C.percentYield(42, t.grams), 74.96, 0.003)); }
check('atom economy CaO = 56.08/100.09 = 56.0 %', near(C.atomEconomy(RX('caco3')).percent, 56.03, 0.003));
check('atom economy Haber = 100 %', near(C.atomEconomy(RX('haber')).percent, 100, 0.001));
check('atom economy fermentation = 51.1 %', near(C.atomEconomy(RX('ferment')).percent, 51.14, 0.003));
check('atom economy hydration = 100 %', near(C.atomEconomy(RX('hydration')).percent, 100, 0.001));
check('atom economy iron = 45.8 %', near(C.atomEconomy(RX('iron')).percent, 45.8, 0.005));
check('Haber 28.014 g N2 -> 34.06 g NH3', near(C.theoreticalYield(RX('haber'), 28.014).grams, 34.06, 0.002));
check('fermentation 180.156 g glucose -> 92.14 g ethanol', near(C.theoreticalYield(RX('ferment'), 180.156).grams, 92.14, 0.002));

// Empirical formula
{ const e = C.empirical([{ sym: 'Mg', amount: 0.24 }, { sym: 'O', amount: 0.16 }]);
  check('MgO from 0.24 g Mg + 0.16 g O', e.formula === 'MgO' && e.k === 1); }
{ const e = C.empirical([{ sym: 'Fe', amount: 69.9 }, { sym: 'O', amount: 30.1 }]);
  check('Fe2O3 from 69.9 % Fe, 30.1 % O (x2 rule)', e.formula === 'Fe₂O₃' && e.k === 2); }
{ const e = C.empirical([{ sym: 'C', amount: 80 }, { sym: 'H', amount: 20 }]); check('CH3 from 80 % C, 20 % H', e.formula === 'CH₃'); }
{ const e = C.empirical([{ sym: 'C', amount: 40 }, { sym: 'H', amount: 6.7 }, { sym: 'O', amount: 53.3 }]);
  check('CH2O from 40/6.7/53.3', e.formula === 'CH₂O');
  const m = C.molecular([{ sym: 'C', amount: 40 }, { sym: 'H', amount: 6.7 }, { sym: 'O', amount: 53.3 }], e.whole, 180);
  check('molecular C6H12O6 from Mr 180', m.formula === 'C₆H₁₂O₆' && m.n === 6); }
{ const e = C.empirical([{ sym: 'Al', amount: 52.9 }, { sym: 'O', amount: 47.1 }]); check('Al2O3 (x2 rule, 1.5)', e.formula === 'Al₂O₃'); }
{ const e = C.empirical([{ sym: 'P', amount: 43.6 }, { sym: 'O', amount: 56.4 }]); check('P2O5 from 43.6 % P', e.formula === 'P₂O₅'); }
check('wholeMultiplier .33 -> 3, .25 -> 4, .2 -> 5', C.wholeMultiplier([1, 1.33]).k === 3 && C.wholeMultiplier([1, 1.25]).k === 4 && C.wholeMultiplier([1, 1.2]).k === 5);
{ const m = C.mgoExperiment(0.3); check('MgO experiment 0.30 g Mg gains 0.20 g O (0.01 g balance)', near(m.mg, 0.3, 0.01) && near(m.oxygen, 0.2, 0.06) && near(m.after - m.before, m.oxygen, 0.001));
  const e = C.empirical([{ sym: 'Mg', amount: m.mg }, { sym: 'O', amount: m.oxygen }]); check('experiment data give MgO', e.formula === 'MgO'); }
console.log(`curr-chem: ${pass} checks passed`);
if (fail) { console.log(`${fail} failed`); process.exit(1); }
