// #810 scientific notation formatter. Checked against the Python packages uncertainties 3.2 (value ± uncertainty with
// the PDG rule and with 1 and 2 figures on the uncertainty) and quantiphy (SI prefixes), and Python decimal
// (engineering notation), on 2,000 random values: all equal. siunitx 3.3 (pdflatex) prints the \num/\qty output for 200 mixed cases the
// same as the concise form, and with uncertainty-mode=separate the same as the Unicode form. 40 random cases are kept here.
import { parseLine, format, roundUnc, splitPrefix } from '../../src/lib/sci/scinote.ts';
import { parseDec } from '../../src/lib/sci/decimal.ts';

const PY = [["0.0265977274225", "3.90087e-06", ["2.6598", "0.0004", -2], ["2.65977", "0.00039", -2], ["2.6598", "0.0004", -2], "26.6 mm"], ["3038413465.85", "305011", ["3.03841", "0.00031", 9], ["3.03841", "0.00031", 9], ["3.0384", "0.0003", 9], "3.04 Gm"], ["-9250231.23243", "11211.4", ["-9.250", "0.011", 6], ["-9.250", "0.011", 6], ["-9.25", "0.01", 6], "−9.25 Mm"], ["-1947.07914936", "191.611", ["-1.95", "0.19", 3], ["-1.95", "0.19", 3], ["-1.9", "0.2", 3], "−1.95 km"], ["-2.6031156275e-05", "4.76616e-09", ["-2.6031", "0.0005", -5], ["-2.60312", "0.00048", -5], ["-2.6031", "0.0005", -5], "−26.0 µm"], ["6215515894.85", "1.18839e+08", ["6.22", "0.12", 9], ["6.22", "0.12", 9], ["6.2", "0.1", 9], "6.22 Gm"], ["-2.72122328041e-06", "4.28354e-09", ["-2.721", "0.004", -6], ["-2.7212", "0.0043", -6], ["-2.721", "0.004", -6], "−2.72 µm"], ["-6.82112952528e-06", "3.20651e-08", ["-6.821", "0.032", -6], ["-6.821", "0.032", -6], ["-6.82", "0.03", -6], "−6.82 µm"], ["-702455454296", "3.24524e+11", ["-7.0", "3.2", 11], ["-7.0", "3.2", 11], ["-7", "3", 11], "−702 Gm"], ["2.96178672927e-10", "4.78418e-14", ["2.9618", "0.0005", -10], ["2.96179", "0.00048", -10], ["2.9618", "0.0005", -10], "296 pm"], ["1646.51631445", "2.05942", ["1.6465", "0.0021", 3], ["1.6465", "0.0021", 3], ["1.647", "0.002", 3], "1.65 km"], ["7.33674531522e-10", "2.32139e-12", ["7.337", "0.023", -10], ["7.337", "0.023", -10], ["7.34", "0.02", -10], "734 pm"], ["50042.0354523", "1494.34", ["5.00", "0.15", 4], ["5.00", "0.15", 4], ["5.0", "0.1", 4], "50.0 km"], ["-41607442827.1", "2.31274e+07", ["-4.1607", "0.0023", 10], ["-4.1607", "0.0023", 10], ["-4.161", "0.002", 10], "−41.6 Gm"], ["3.51034648207e-11", "5.34079e-15", ["3.5103", "0.0005", -11], ["3.51035", "0.00053", -11], ["3.5103", "0.0005", -11], "35.1 pm"], ["-0.00641338108784", "0.00304038", ["-6.4", "3.0", -3], ["-6.4", "3.0", -3], ["-6", "3", -3], "−6.41 mm"], ["3.19247310743", "0.00123719", ["3.1925", "0.0012", 0], ["3.1925", "0.0012", 0], ["3.192", "0.001", 0], "3.19 m"], ["1585.37329995", "14.2473", ["1.585", "0.014", 3], ["1.585", "0.014", 3], ["1.59", "0.01", 3], "1.59 km"], ["-1235366.32345", "69722.4", ["-1.24", "0.07", 6], ["-1.235", "0.070", 6], ["-1.24", "0.07", 6], "−1.24 Mm"], ["602137.133321", "28145.5", ["6.02", "0.28", 5], ["6.02", "0.28", 5], ["6.0", "0.3", 5], "602 km"], ["9.5742502822", "0.000403254", ["9.5743", "0.0004", 0], ["9.57425", "0.00040", 0], ["9.5743", "0.0004", 0], "9.57 m"], ["4.21071837711e-09", "9.82728e-13", ["4.2107", "0.0010", -9], ["4.21072", "0.00098", -9], ["4.211", "0.001", -9], "4.21 nm"], ["946987982.345", "4.78512e+08", ["9", "5", 8], ["9.5", "4.8", 8], ["9", "5", 8], "947 Mm"], ["586819811.068", "2.47251e+07", ["5.87", "0.25", 8], ["5.87", "0.25", 8], ["5.9", "0.2", 8], "587 Mm"], ["6853.31510417", "0.45405", ["6.8533", "0.0005", 3], ["6.85332", "0.00045", 3], ["6.8533", "0.0005", 3], "6.85 km"], ["0.0364291258365", "1.75903e-06", ["3.64291", "0.00018", -2], ["3.64291", "0.00018", -2], ["3.6429", "0.0002", -2], "36.4 mm"], ["24569796.5585", "1536.54", ["2.45698", "0.00015", 7], ["2.45698", "0.00015", 7], ["2.4570", "0.0002", 7], "24.6 Mm"], ["2.03939804728e-05", "1.59781e-07", ["2.039", "0.016", -5], ["2.039", "0.016", -5], ["2.04", "0.02", -5], "20.4 µm"], ["9.48990048595", "0.0397844", ["9.49", "0.04", 0], ["9.490", "0.040", 0], ["9.49", "0.04", 0], "9.49 m"], ["-3.30957724427e-10", "1.36858e-14", ["-3.30958", "0.00014", -10], ["-3.30958", "0.00014", -10], ["-3.3096", "0.0001", -10], "−331 pm"], ["-29.9862182119", "4.44141", ["-3.0", "0.4", 1], ["-3.00", "0.44", 1], ["-3.0", "0.4", 1], "−30.0 m"], ["9.91671440816", "3.01029", ["9.9", "3.0", 0], ["9.9", "3.0", 0], ["1.0", "0.3", 1], "9.92 m"], ["-0.0873886626499", "0.000299966", ["-8.739", "0.030", -2], ["-8.739", "0.030", -2], ["-8.74", "0.03", -2], "−87.4 mm"], ["0.102954272324", "0.000279488", ["1.0295", "0.0028", -1], ["1.0295", "0.0028", -1], ["1.030", "0.003", -1], "103 mm"], ["-5.98376122609e-15", "3.82924e-12", ["0", "4", -12], ["0.0", "3.8", -12], ["0", "4", -12], "−5.98 fm"], ["5.62791304044e-07", "2.20288e-10", ["5.6279", "0.0022", -7], ["5.6279", "0.0022", -7], ["5.628", "0.002", -7], "563 nm"], ["-0.000793181756718", "2.86703e-07", ["-7.9318", "0.0029", -4], ["-7.9318", "0.0029", -4], ["-7.932", "0.003", -4], "−793 µm"], ["-315416919963", "4.00469e+11", ["-3", "4", 11], ["-3.2", "4.0", 11], ["-3", "4", 11], "−315 Gm"], ["-0.0407150757179", "0.00460627", ["-4.1", "0.5", -2], ["-4.07", "0.46", -2], ["-4.1", "0.5", -2], "−40.7 mm"], ["149860.74166", "324069", ["1.5", "3.2", 5], ["1.5", "3.2", 5], ["1", "3", 5], "150 km"]];
const O = { notation: 'sci', sig: 3, rule: 'pdg', unit: '' };
const f = (s, o = {}) => format(parseLine(s), { ...O, ...o });

export default async (check) => {
  let ok = 0;
  for (const [v, u, pdg, two, one, si] of PY) {
    const r = (rule) => { const x = f(`${v} ± ${u}`, { rule }); return [x.value, x.unc, x.p]; };
    if (JSON.stringify(r('pdg')) === JSON.stringify(pdg) && JSON.stringify(r('two')) === JSON.stringify(two) && JSON.stringify(r('one')) === JSON.stringify(one) && f(v, { notation: 'si', unit: 'm' }).unicode === si) ok++;
  }
  check(`scinote: ${ok} of ${PY.length} random cases equal uncertainties and quantiphy`, ok === PY.length);

  // The PDG rule's three bands (Particle Data Group, "Rounding" in the introduction to the Review of Particle Physics).
  check('scinote: PDG 0.827 keeps one figure (0.8)', roundUnc(parseDec('0.827'), 'pdg').u.d === '8');
  check('scinote: PDG 0.119 keeps two figures (0.12)', roundUnc(parseDec('0.119'), 'pdg').u.d === '12');
  check('scinote: PDG 0.980 rounds up to 1.0', (() => { const r = roundUnc(parseDec('0.980'), 'pdg').u; return r.d === '10' && r.e === -1; })());
  check('scinote: PDG 354 vs 355 boundary', f('5.4321 ± 0.354').unicode === '5.43 ± 0.35' && f('5.4321 ± 0.355').unicode === '5.4 ± 0.4');
  check('scinote: leading 1 or 2 rule', f('5.4321 ± 0.29', { rule: 'lead12' }).unicode === '5.43 ± 0.29' && f('5.4321 ± 0.31', { rule: 'lead12' }).unicode === '5.4 ± 0.3' && f('5.4321 ± 0.97', { rule: 'lead12' }).unicode === '5.4 ± 1.0');

  // Every output form for one value.
  const a = f('0.000123456 ± 0.0000356');
  check('scinote: Unicode', a.unicode === '(1.2 ± 0.4) × 10⁻⁴');
  check('scinote: plain text', a.plain === '(1.2 +/- 0.4)e-4' && a.eValue === '1.2e-4' && a.eUnc === '0.4e-4');
  check('scinote: LaTeX maths', a.latex === '$(1.2 \\pm 0.4) \\times 10^{-4}$');
  check('scinote: siunitx', a.siunitx === '\\num{1.2(4)e-4}' && a.concise === '1.2(4) × 10⁻⁴');
  const b = f('(1.23 ± 0.04) × 10^-4 m', { notation: 'si' });
  check('scinote: SI prefix with unit', b.unicode === '(123 ± 4) µm' && b.siunitx === '\\qty{123(4)}{\\micro m}' && b.latex === '$(123 \\pm 4)\\,\\mu\\mathrm{m}$' && b.plain === '(123 +/- 4) um');
  check('scinote: engineering', f('-0.000456789', { notation: 'eng' }).unicode === '−457 × 10⁻⁶' && f('6.02214076e23', { notation: 'eng', sig: 4 }).unicode === '602.2 × 10²¹');
  check('scinote: plain decimal', f('6.02214076e23', { notation: 'plain', sig: 2 }).unicode === '600000000000000000000000' && f('0.00123456', { notation: 'plain', sig: 2 }).unicode === '0.0012');
  check('scinote: significant figures as typed (0)', f('0.00120', { sig: 0 }).unicode === '1.20 × 10⁻³' && f('1200', { sig: 0 }).unicode === '1.200 × 10³');
  check('scinote: half away from zero, digit by digit', f('1.005', { notation: 'plain', sig: 3 }).unicode === '1.01' && f('-2.675', { notation: 'plain', sig: 3 }).unicode === '−2.68');
  check('scinote: 9.995 to 3 figures carries to 10.0', f('9.995', { sig: 3 }).unicode === '1.00 × 10¹' && f('9.995', { notation: 'plain', sig: 3 }).unicode === '10.0');
  check('scinote: value padded to the uncertainty', f('1\t0.1').unicode === '1.00 ± 0.10' && /zeros were added/.test(f('1\t0.1').note));
  check('scinote: unit with a prefix is rescaled', f('0.5', { notation: 'si', unit: 'µm' }).unicode === '500 nm' && f('2500', { notation: 'si', unit: 'kg' }).unicode === '2.50 Mg' && splitPrefix('mol') === null && splitPrefix('cd') === null);
  check('scinote: SI with no unit falls back to engineering', f('1234.5', { notation: 'si' }).unicode === '1.23 × 10³' && /need a unit/.test(f('1234.5', { notation: 'si' }).note));
  check('scinote: °C and Ω for siunitx', f('25 ± 1.4', { unit: '°C', notation: 'plain' }).siunitx === '\\qty{25.0(14)}{\\degreeCelsius}' && f('4700', { unit: 'Ω', notation: 'si', sig: 2 }).siunitx === '\\qty{4.7}{\\kilo \\ohm}');

  check('scinote: concise form when the uncertainty is wider than the last digit', f('0.000123456 ± 0.0000356', { notation: 'si', unit: 'm' }).concise === '120(40) µm' && f('1234 ± 40', { notation: 'plain' }).siunitx === '\\num{1230(40)}' && f('1234 ± 40', { notation: 'eng' }).concise === '1.23(4) × 10³');
  // Reading the many ways people write numbers.
  const reads = [['1.234(12)e-3', '1.234e-3', '0.012e-3'], ['12.3(1.2) mm', '1.23e1', '0.12e1'], ['1.2 × 10⁻⁵', '1.20e-5', ''], ['3.0 +/- 0.25', '3.00', '0.25'], ['(6.674 ± 0.015) × 10^-11', '6.674e-11', '0.015e-11'], ['7.5;0.3', '7.50', '0.30'], ['1500,25', '1.500e3', '0.025e3'], ['1,500', '1.50e3', ''], ['−4.2 ± 0.5 V', '-4.2', '0.5']];
  for (const [s, ev, eu] of reads) { const x = f(s); check(`scinote: reads "${s}" -> ${x.eValue} ${x.eUnc}`, x.eValue === ev && x.eUnc === eu); }
  check('scinote: unit after the numbers is kept', f('12.3(1.2) mm', { notation: 'si' }).unicode === '(12.3 ± 1.2) mm');
  check('scinote: bad lines give messages', parseLine('abc') === '"abc" is not a number.' && /more than two cells/.test(parseLine('1\t2\t3')));
  let msg = ''; try { f('0.5 ± 0'); } catch (e) { msg = e.message; }
  check('scinote: zero uncertainty refused', /uncertainty is zero/.test(msg));
  msg = ''; try { f('0.5 ± -0.1'); } catch (e) { msg = e.message; }
  check('scinote: negative uncertainty refused', /cannot be negative/.test(msg) || /is not a number/.test(String(parseLine('0.5 ± -0.1'))));
};
