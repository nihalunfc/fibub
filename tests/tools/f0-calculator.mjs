// #196 autoclave F0 value calculator
export const path = '/science/f0-calculator/';
export default async ({ page, check, BASE, OUT, readFileSync, writeFileSync }) => {
  const R = '.f0c ';
  const txt = async (s) => (await page.textContent(R + s)).replace(/\s+/g, ' ');
  const tap = async (s) => { await page.locator(s).scrollIntoViewIfNeeded(); await page.click(s); await page.waitForTimeout(100); };
  const set = async (s, v) => { await page.fill(R + s, v); await page.waitForTimeout(100); };
  await page.goto(`${BASE}${path}`); await page.waitForTimeout(500);
  // The example: two probes, the load centre is the coldest.
  check((await txt('.f0-big')) === 'F0 = 22.10 min at the coldest probe (Load centre)', 'f0: example F0 at the coldest probe');
  { const s = await txt('.f0-sub'); check(s.includes('1.134 min at 134 °C') && s.includes('15.45 min at or above 121 °C, from 16.60 to 32.05 min'), 'f0: example equivalent time and hold'); }
  { const t = await txt('.f0-tab'); check(t.includes('Chamber') && t.includes('27.65') && t.includes('24.81') && t.includes('16.58') && t.includes('21.13 min') && t.includes('122.1 °C at 16 min') && t.includes('1.418 min') && (await page.$$(R + 'tr.f0-cold')).length >= 1, 'f0: example table'); }
  check((await txt('.f0-warn')) === '' && await page.isHidden(R + '.f0-perr'), 'f0: no warnings on the example');
  check(await page.evaluate(() => ['.f0-figt', '.f0-figf'].every((c) => document.querySelector('.f0c ' + c).width > 0)) && (await txt('.f0-legend')).includes('Load centre'), 'f0: both plots and the legend drawn');
  // Organism.
  check((await txt('.f0-obig')) === '14.73 log reduction at Load centre' && (await txt('.f0-pill')) === 'Meets the target' && (await txt('.f0-vtext')).includes('2.735 logs to spare'), 'organism: example log reduction and verdict');
  { const f = await txt('.f0-ofacts'); check(f.includes('1.84 × 10⁻⁹') && f.includes('22.10 min') && f.includes('Logs needed12') && f.includes('18 min'), 'organism: example facts'); }
  { const t = await txt('.f0-plan'); check(t.includes('134 °C') && t.includes('0.9232 min') && t.includes('73.33 min') && t.includes('0.07693 min'), 'organism: hold time table'); }
  // The chamber probe instead.
  await page.selectOption(R + '.f0-probe', '0'); await page.waitForTimeout(100);
  check((await txt('.f0-obig')) === '18.43 log reduction at Chamber', 'organism: chamber probe');
  await page.selectOption(R + '.f0-probe', '1'); await page.waitForTimeout(100);
  // Organism z = 8 and a shortfall.
  await set('.f0-oz', '8');
  check((await txt('.f0-obig')).startsWith('14.59 log'), 'organism: own z-value');
  await set('.f0-oz', '10'); await set('.f0-d', '2.5');
  check((await txt('.f0-pill')) === 'Short of the target' && (await txt('.f0-vtext')).includes('logs short') && await page.$eval(R + '.f0-pill', (e) => e.classList.contains('bad')), 'organism: short of the target');
  await set('.f0-d', '1.5');
  // Plan temperature joins the table.
  await set('.f0-pt', '130');
  check((await txt('.f0-ofacts')).includes('Hold at 130 °C') && (await txt('.f0-plan')).includes('130 °C'), 'organism: plan temperature');
  await set('.f0-pt', '121.1');
  // Organism bad input.
  await set('.f0-sal', '0');
  check((await txt('.f0-oerr')).includes('target SAL') && await page.isHidden(R + '.f0-oout'), 'organism: bad SAL message');
  await set('.f0-sal', '1e-6'); await set('.f0-d', '');
  check((await txt('.f0-oerr')).includes('D-value'), 'organism: empty D message');
  await set('.f0-d', '1.5');
  // Settings: z, reference, method, hold, equivalent temperature.
  await set('.f0-z', '20');
  check(!(await txt('.f0-big')).includes('22.10'), 'f0: z-value changes F0');
  await set('.f0-z', '0');
  check((await txt('.f0-err')).includes('z-value above 0') && await page.isHidden(R + '.f0-out'), 'f0: bad z message');
  await set('.f0-z', '10'); await set('.f0-tref', '');
  check((await txt('.f0-err')).includes('reference temperature'), 'f0: empty reference message');
  await set('.f0-tref', '121.1');
  await page.selectOption(R + '.f0-meth', 'left'); await page.waitForTimeout(100);
  check((await txt('.f0-big')).startsWith('F0 = 22.10 min'), 'f0: held readings (same here, the cycle starts and ends cold)');
  await page.selectOption(R + '.f0-meth', 'trap');
  await set('.f0-hold', '125');
  check((await txt('.f0-warn')).includes('Chamber never reached 125 °C') && (await txt('.f0-tab')).includes('Time at ≥ 125 °C'), 'f0: hold temperature not reached warning');
  await set('.f0-hold', '121'); await set('.f0-eqt', '');
  check(!(await txt('.f0-tab')).includes('Equivalent') && !(await txt('.f0-sub')).includes('134'), 'f0: no equivalent time when empty');
  await set('.f0-eqt', '134');
  // °F and seconds, one probe, clock times, a gap.
  await set('.f0-in', 'sec,temp\n0,250\n60,250\n120,250\n180,250');
  await page.selectOption(R + '.f0-tu', 's'); await page.selectOption(R + '.f0-tf', 'f'); await page.waitForTimeout(100);
  check((await txt('.f0-big')) === 'F0 = 3.008 min' && await page.isHidden(R + '.f0-probe'), 'f0: seconds and °F (250 °F for 3 min)');
  await page.selectOption(R + '.f0-tf', 'c'); await page.selectOption(R + '.f0-tu', 'min');
  await set('.f0-in', 'time\tT\n23:58\t121.1\n23:59\t121.1\n00:01\t121.1\n00:02\t121.1');
  check((await txt('.f0-big')) === 'F0 = 4 min' && (await txt('.f0-sub')).includes('from 0 to 4 min'), 'f0: clock times across midnight');
  await set('.f0-in', '0,121.1\n1,121.1\n2,121.1\n12,121.1\n13,121.1');
  check((await txt('.f0-warn')).includes('gap of 10 minutes'), 'f0: gap warning');
  // Bad input.
  await set('.f0-in', 't,a\n0,120\nabc,121\n1,x\n2,121');
  check((await txt('.f0-perr')).includes('Line 3') && (await txt('.f0-perr')).includes('Line 4') && await page.isVisible(R + '.f0-out'), 'f0: bad lines left out with a message');
  await set('.f0-in', '0,120\n2,121\n1,122');
  check((await txt('.f0-err')).includes('go up'), 'f0: times going back message');
  await set('.f0-in', '0,120');
  check((await txt('.f0-err')).includes('two readings') && (await txt('.f0-oerr')).includes('working log'), 'f0: one reading message');
  await tap(R + '.f0-clear');
  check((await txt('.f0-err')).includes('Paste a temperature log'), 'f0: empty log message');
  // Back to the example; the CSV and the report.
  await tap(R + '.f0-ex');
  check((await txt('.f0-big')).startsWith('F0 = 22.10 min'), 'f0: example again');
  { const [d] = await Promise.all([page.waitForEvent('download'), tap(R + '.f0-csv')]); const f = OUT + 'f0.csv'; await d.saveAs(f); const t = readFileSync(f, 'utf8'); check(d.suggestedFilename() === 'f0-log.csv' && t.startsWith('time_min,Chamber_C,Chamber_lethal_rate,Chamber_F0_min,Load_centre_C,') && t.includes('\n0,22,') && t.includes('F0_min_Load_centre,22.1022') && t.includes('reference_C,121.1'), 'f0: CSV'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), tap(R + '.dl button[data-f=pdf]')]); check(d.suggestedFilename() === 'f0-calculator.pdf', 'report: PDF'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), tap(R + '.dl button[data-f=png]')]); check(d.suggestedFilename() === 'f0-calculator.png', 'report: image'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), tap(R + '.dl button[data-f=docx]')]); check(d.suggestedFilename() === 'f0-calculator.docx', 'report: Word'); }
};
