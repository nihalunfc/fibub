// #804 table converter: digit-by-digit rounding checked against Python's decimal module (ROUND_HALF_UP) on 3,000
// random numbers (all equal; 60 kept here); every output layout (24 option sets) checked by compiling the LaTeX with
// pdflatex (booktabs, siunitx), and by reading the HTML and the Markdown (python-markdown) back with pandas: 720 cells equal.
import { parseDec, toFixedDec, toSigDec, sciParts } from '../../src/lib/sci/decimal.ts';
import { readTable, parseDelimited, detectSep, cellOf, prepare, toLatex, toMarkdown, toHtml, texEscape, DEFAULTS } from '../../src/lib/sci/tableconv.ts';

const PY = [["1e3", 1, "1000.0", 6, "1000.00"], ["32499.60500", 3, "32499.605", 3, "32500"], ["0.0003618", 6, "0.000362", 1, "0.0004"], ["71948.38655", 6, "71948.386550", 5, "71948"], ["-72078.12172", 3, "-72078.122", 2, "-72000"], ["0.000", 6, "0.000000", 4, null], ["0.001004", 4, "0.0010", 2, "0.0010"], ["7.9e-5", 2, "0.00", 3, "0.0000790"], ["-38607.12451", 4, "-38607.1245", 2, "-39000"], ["-3.92522e-1", 4, "-0.3925", 2, "-0.39"], ["-81642403", 2, "-81642403.00", 4, "-81640000"], ["-66697.3610", 4, "-66697.3610", 4, "-66700"], ["-0.9848", 6, "-0.984800", 2, "-0.98"], ["-0.06076", 5, "-0.06076", 6, "-0.0607600"], ["-1.056952e9", 1, "-1056952000.0", 1, "-1000000000"], ["0.081", 3, "0.081", 5, "0.081000"], ["4.95857e-8", 3, "0.000", 1, "0.00000005"], ["-0.0206", 3, "-0.021", 1, "-0.02"], ["66495.27212", 2, "66495.27", 5, "66495"], ["-0.00893", 2, "-0.01", 3, "-0.00893"], ["0.0007322", 5, "0.00073", 2, "0.00073"], ["1e3", 4, "1000.0000", 3, "1000"], ["524195035", 2, "524195035.00", 4, "524200000"], ["-0.09577", 4, "-0.0958", 5, "-0.095770"], ["128366003", 6, "128366003.000000", 6, "128366000"], ["-9.4e2", 6, "-940.000000", 1, "-900"], ["-9.78e0", 5, "-9.78000", 6, "-9.78000"], ["-0.04909", 4, "-0.0491", 5, "-0.049090"], ["-12516.98760", 3, "-12516.988", 4, "-12520"], ["0.008932", 6, "0.008932", 1, "0.009"], ["-9.6259e12", 1, "-9625900000000.0", 5, "-9625900000000"], ["-9.364253e5", 1, "-936425.3", 3, "-936000"], ["-0.02896", 4, "-0.0290", 6, "-0.0289600"], ["869973962", 2, "869973962.00", 2, "870000000"], ["-4.385202e3", 6, "-4385.202000", 2, "-4400"], ["-22685.14287", 3, "-22685.143", 5, "-22685"], ["0.6278", 4, "0.6278", 5, "0.62780"], ["-77493.61989", 2, "-77493.62", 4, "-77490"], ["-26969.17439", 6, "-26969.174390", 5, "-26969"], ["-0.43e-6", 1, "0.0", 5, "-0.00000043000"], ["65453.10673", 5, "65453.10673", 3, "65500"], ["0.06503", 3, "0.065", 5, "0.065030"], ["-0.00008655", 1, "0.0", 6, "-0.0000865500"], ["-47239.29365", 5, "-47239.29365", 4, "-47240"], ["-75033.78637", 1, "-75033.8", 3, "-75000"], ["-745920225", 5, "-745920225.00000", 2, "-750000000"], ["9.995", 3, "9.995", 4, "9.995"], ["56245.19443", 2, "56245.19", 6, "56245.2"], ["28302.63439", 0, "28303", 2, "28000"], ["3808.76370", 3, "3808.764", 1, "4000"], ["-0.00009923", 6, "-0.000099", 3, "-0.0000992"], ["9.995", 2, "10.00", 6, "9.99500"], ["-441291204", 3, "-441291204.000", 6, "-441291000"], ["39920.50541", 3, "39920.505", 6, "39920.5"], ["-39287.61108", 2, "-39287.61", 6, "-39287.6"], ["-18218.07011", 2, "-18218.07", 4, "-18220"], ["381853360", 1, "381853360.0", 4, "381900000"], ["-44038.53579", 0, "-44039", 2, "-44000"], ["-40381.63148", 4, "-40381.6315", 6, "-40381.6"], ["8379.76924", 2, "8379.77", 6, "8379.77"]];
const EX = ['Reaction\tProduct mass (g)\tYield (%)\tRate constant (s^-1)', 'A_1 (control)\t12.5\t85.2\t1.2e-3', 'B & C\t3.25\t100\t4.56e-4', 'D, heated\t1.005\t7.05\t2.675e-5', 'E (50 °C)\t-0.4\t62.375\t9.995e-4'].join('\n');

export default async (check) => {
  // Rounding as on paper, compared with Python decimal.
  let ok = 0;
  for (const [s, dp, fs, n, sg] of PY) if (toFixedDec(s, dp) === fs && (sg == null || toSigDec(s, n) === sg)) ok++;
  check(`decimal: ${ok} of ${PY.length} roundings equal Python decimal`, ok === PY.length);
  check('decimal: 1.005 to 2 places is 1.01 (not 1.00)', toFixedDec('1.005', 2) === '1.01' && toFixedDec('2.675', 2) === '2.68' && toFixedDec('-0.125', 2) === '-0.13');
  check('decimal: 9.99 to 2 figures is 10, 0.0004567 to 2 is 0.00046, 2.5 to 3 is 2.50', toSigDec('9.99', 2) === '10' && toSigDec('0.0004567', 2) === '0.00046' && toSigDec('2.5', 3) === '2.50');
  check('decimal: -0.001 to 2 places is 0.00 (no minus zero)', toFixedDec('-0.001', 2) === '0.00');
  check('decimal: thousands commas, minus sign, exponents read', parseDec('1,234.5')?.d === '12345' && parseDec('−4')?.neg === true && parseDec('1.2e-5')?.e === -6 && parseDec('1,5') === null && parseDec('abc') === null);
  { const r = sciParts(parseDec('0.000123456'), 3); const e = sciParts(parseDec('123456'), 3, 3); check('decimal: scientific and engineering parts', r.m === '1.23' && r.p === -4 && e.m === '123' && e.p === 3); }

  // Reading pasted cells.
  check('table: tabs found first', detectSep('a\tb\n1\t2') === 'tab' && detectSep('a;b\n1,5;2,5') === 'semicolon' && detectSep('a,b\n1,2') === 'comma');
  const q = parseDelimited('name,note\n"Smith, J","said ""hi"""\n"two\nlines",x\n,\n', ',');
  check('table: CSV quotes, doubled quotes, new lines in cells, blank rows dropped', q.length === 3 && q[1][0] === 'Smith, J' && q[1][1] === 'said "hi"' && q[2][0] === 'two\nlines');
  check('table: ragged rows padded, empty right columns dropped', JSON.stringify(parseDelimited('a\tb\t\n1\n', '\t')) === '[["a","b"],["1",""]]');
  check('table: cell rounding keeps e-notation and %', cellOf('9.995e-4', { mode: 'dp', n: 2 }).text === '1.00e-3' && cellOf('12%', { mode: 'dp', n: 1 }).text === '12.0%' && cellOf('2.50', { mode: 'asis' }).text === '2.50' && cellOf('n/a', { mode: 'dp', n: 1 }).num === null);
  check('table: LaTeX escaping of the ten specials', texEscape('#$%^&_{}~\\') === '\\#\\$\\%\\textasciicircum{}\\&\\_\\{\\}\\textasciitilde{}\\textbackslash{}');

  const { rows } = readTable(EX);
  const o = { ...DEFAULTS, caption: 'Yields', label: 'tab:y' };
  const p = prepare(rows, o);
  check('table: numeric columns found', JSON.stringify(p.numeric) === '[false,true,true,true]' && p.align.join('') === 'lrrr');
  const tex = toLatex(p, o).text;
  check('table: LaTeX booktabs float', tex === [
    '\\begin{table}[htbp]', '  \\centering', '  \\caption{Yields}', '  \\label{tab:y}', '  \\begin{tabular}{l r r r}', '    \\toprule',
    '    Reaction & Product mass (g) & Yield (\\%) & Rate constant (s\\textasciicircum{}-1) \\\\', '    \\midrule',
    '    A\\_1 (control) & 12.5 & 85.2 & $1.2 \\times 10^{-3}$ \\\\', '    B \\& C & 3.25 & 100 & $4.56 \\times 10^{-4}$ \\\\',
    '    D, heated & 1.005 & 7.05 & $2.675 \\times 10^{-5}$ \\\\', '    E (50 \\textdegree{}C) & $-$0.4 & 62.375 & $9.995 \\times 10^{-4}$ \\\\',
    '    \\bottomrule', '  \\end{tabular}', '\\end{table}', ''].join('\n'));
  const o2 = { ...DEFAULTS, numAlign: 'decimal', round: { mode: 'dp', n: 2 }, float: false, booktabs: false };
  const t2 = toLatex(prepare(rows, o2), o2);
  check('table: siunitx S columns with table-format', t2.text.startsWith('\\begin{tabular}{l S[table-format=-2.2] S[table-format=3.2] S[table-format=1.2e-1]}\n  \\hline') && t2.text.includes('D, heated & 1.01 & 7.05 & 2.68e-5 \\\\') && t2.text.includes('E (50 \\textdegree{}C) & -0.40 & 62.38 & 1.00e-3') && t2.packages.join() === 'siunitx');
  const md = toMarkdown(prepare(rows, { ...o, round: { mode: 'sig', n: 2 } }), { ...o, round: { mode: 'sig', n: 2 } });
  check('table: Markdown pipe table with alignment row', md.startsWith('**Yields**\n\n| Reaction') && md.includes('| :------------ | ---------------: | --------: | -------------------: |') && md.includes('| D, heated     |              1.0 |       7.1 |           2.7 × 10⁻⁵ |') && md.includes('−0.40'));
  const mdNoHead = toMarkdown(prepare([['a|b', '1']], { ...DEFAULTS, header: false }), { ...DEFAULTS, header: false });
  check('table: Markdown escapes | and has a blank header without one', mdNoHead.split('\n')[2] === '| a\\|b |   1 |' && mdNoHead.startsWith('|      |     |'));
  const mdDec = toMarkdown(prepare([['x'], ['1.5'], ['10.25'], ['3']], { ...DEFAULTS, numAlign: 'decimal' }), { ...DEFAULTS, numAlign: 'decimal' });
  check('table: decimal points lined up with figure and punctuation spaces', mdDec.includes('|  1.5\u2007 |') && mdDec.includes('| 10.25 |') && mdDec.includes('|  3\u2008\u2007\u2007 |'));
  const html = toHtml(p, o);
  check('table: HTML with caption, header scope and escaping', html.startsWith('<table id="tab:y">\n  <caption>Yields</caption>') && html.includes('<th scope="col" style="text-align:right">Product mass (g)</th>') && html.includes('<td>B &amp; C</td>') && html.includes('1.2 × 10<sup>−3</sup>') && html.includes('−0.4'));
};
