// #964 heat capacity fitter
export const path = '/science/heat-capacity-fitter/';
export default async ({ page, check, BASE, OUT, readFileSync, writeFileSync }) => {
  const R = '.hcf ';
  const big = () => page.textContent(R + '.hc-big'), facts = () => page.textContent(R + '.hc-facts'), err = () => page.textContent(R + '.hc-err');
  const set = async (c, v) => { await page.fill(R + c, v); await page.waitForTimeout(450); };
  const opt = async (c, v) => { await page.selectOption(R + c, v); await page.waitForTimeout(450); };
  await page.goto(`${BASE}/science/heat-capacity-fitter/`); await page.waitForTimeout(900);
  check((await big()) === 'Debye θ = 340.24 ± 0.39 K, γ = 0.701 ± 0.012 mJ/(mol·K²)', 'heat: example Debye + γT fit (matches SciPy curve_fit)');
  { const f = await facts(); check(f.includes('0.822 % rms') && f.includes('24.94 J/(mol·K)') && f.includes('θ_D = 341.31 ± 0.23 K') && f.includes('on 6 points'), 'heat: fit quality, 3nR and low-T line'); }
  { const t = await page.textContent(R + '.hc-tab'); check(t.includes('328.7 ± 4.0') && t.includes('207 ± 15') && t.includes('60.2'), 'heat: all four models table'); }
  check(await page.isVisible(R + '.hc-fig') && await page.isVisible(R + '.hc-rfig') && await page.isVisible(R + '.hc-lfig'), 'heat: three figures');
  await opt('.hc-g', '0'); check((await big()) === 'Debye θ = 328.7 ± 4.0 K', 'heat: Debye without γT');
  await opt('.hc-w', 'abs'); check((await big()) === 'Debye θ = 339.17 ± 0.98 K', 'heat: equal weights');
  await opt('.hc-model', 'einstein'); check((await big()).startsWith('Einstein θ = 242') || (await big()).startsWith('Einstein θ ='), 'heat: Einstein model');
  await opt('.hc-g', '1'); check((await big()).startsWith('Einstein θ = 242.0 ± 3.7 K, γ = −2.0 ± 1.0') && (await facts()).includes('negative'), 'heat: Einstein + γT, negative γ flagged');
  await opt('.hc-model', 'debye'); await opt('.hc-w', 'rel');
  await set('.hc-t0', '20'); check((await facts()).includes('over 14 points'), 'heat: fit range from 20 K');
  await set('.hc-t0', ''); await set('.hc-tl', '3'); check((await facts()).includes('needs 3 points') && await page.isHidden(R + '.hc-lfig'), 'heat: low-T line needs points');
  await set('.hc-tl', '15');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.hc-csv')]); const f = OUT + 'hc.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows.length === 21 && rows[0].startsWith('T (K),C measured') && rows[1].startsWith('4,0.00597,yes'), 'heat: fit CSV'); }
  // Units: the same data in mJ/(mol·K) and in J/(g·K) give the same θ.
  const orig = await page.inputValue(R + '.hc-data');
  const lines = orig.trim().split('\n').slice(1).map((l) => l.split('\t').map(Number));
  await set('.hc-data', lines.map(([t, c]) => `${t}\t${(c * 1000).toPrecision(6)}`).join('\n')); await opt('.hc-u', '0.001');
  check((await big()).startsWith('Debye θ = 340.24 ± 0.39 K'), 'heat: mJ/(mol·K) units');
  await opt('.hc-u', 'g'); await page.fill(R + '.hc-mm', '50'); await set('.hc-data', lines.map(([t, c]) => `${t}\t${(c / 50).toPrecision(8)}`).join('\n'));
  check(await page.isVisible(R + '.hc-mm') && (await big()).startsWith('Debye θ = 340.24'), 'heat: J/(g·K) with molar mass');
  await opt('.hc-u', '1');
  check((await err()).includes('3nR'), 'heat: values far above 3nR are caught (wrong units)');
  // File open.
  writeFileSync(OUT + 'hc.csv', 'T,C\n' + lines.map(([t, c]) => `${t},${c}`).join('\n'));
  await page.setInputFiles(R + '.dfb-in', OUT + 'hc.csv'); await page.waitForTimeout(700);
  { const b = await big(), n = await page.textContent(R + '.dfb-note'); check(b.startsWith('Debye θ = 340.24') && n.includes('hc.csv'), `heat: open a CSV file (${b} | ${n})`); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.dl button[data-f=png]')]); const f = OUT + 'hc.png'; await d.saveAs(f); check(readFileSync(f).subarray(1, 4).toString() === 'PNG', 'heat: image report'); }
  await set('.hc-data', '10 0.1\n20 0.5'); check((await err()).includes('at least 4 rows') && await page.isHidden(R + '.hc-out'), 'heat: too few rows message');
  await set('.hc-data', '-10 0.1\n20 0.5\n30 1\n40 2'); check((await err()).includes('above 0 K'), 'heat: negative temperature message');
  await set('.hc-data', '10 0.1\n20 0\n30 1\n40 2'); check((await err()).includes('heat capacity must be above 0'), 'heat: zero heat capacity message');
  await set('.hc-data', orig); await set('.hc-n', '0'); check((await err()).includes('atoms per formula unit'), 'heat: bad n message');
  await set('.hc-n', '1'); check((await big()).startsWith('Debye θ = 340.24'), 'heat: back to the example');
};
