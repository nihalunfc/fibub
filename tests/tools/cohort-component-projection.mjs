export const path = '/science/cohort-component-projection/';
export default async ({ page, check, BASE, readFileSync, writeFileSync, OUT }) => {
  await page.goto(BASE + path);
  const big = () => page.textContent('.cc-big');
  const waitBig = (re) => page.waitForFunction((src) => new RegExp(src).test(document.querySelector('.cc-big')?.textContent || ''), re, { timeout: 15000 }).then(() => true, () => false);
  check((await big()) === '2075: 98,353 people (+14.0 % on 2025)', `ccproj: example (${await big()})`);
  const facts = await page.textContent('.cc-facts');
  check(/1\.56/.test(facts) && /4,767/.test(facts) && /38\.6 → 47\.3/.test(facts) && /15\.8 % → 28\.5 %/.test(facts), 'ccproj: TFR, births, median age, 65+');
  const sum = await page.$$eval('.cc-sum tbody tr', (rs) => rs.map((r) => [...r.cells].map((c) => c.textContent)));
  check(sum.length === 11 && sum[1][1] === '89,835' && sum[1][4] === '4,767' && sum[0][4] === '–', `ccproj: totals table (${sum[1].join(' ')})`);
  const drawn = (sel, re) => page.waitForFunction(([s, src]) => { const c = document.querySelector(s); return c && c.width > 0 && new RegExp(src).test(c.getAttribute('aria-label') || ''); }, [sel, re], { timeout: 15000 }).then(() => true, () => false);
  check(await drawn('.cc-tot', 'total population') && await drawn('.cc-pyr', '2075 with 2025 as an outline'), 'ccproj: total chart and pyramid drawn');
  // Pick another year.
  await page.selectOption('.cc-pick', '1');
  check(await drawn('.cc-pyr', '2030') && /Population by age, 2030/.test(await page.textContent('.cc-agh')), 'ccproj: pyramid for 2030');
  const ag = await page.$$eval('.cc-age tbody tr', (rs) => rs.map((r) => [...r.cells].map((c) => c.textContent)));
  check(ag[17][1] === '1,234' && ag[0][3] === '4,842', `ccproj: 2030 by age (${ag[17].join(' ')} | ${ag[0].join(' ')})`);
  // Migration off.
  await page.selectOption('.cc-mig', 'off');
  check(await waitBig('^2075: 77,169 people'), `ccproj: closed population (${await big()})`);
  await page.selectOption('.cc-mig', 'on');
  await page.fill('.cc-n', '2');
  check(await waitBig('^2035:'), 'ccproj: steps');
  await page.fill('.cc-srb', '1.10');
  check(await waitBig('^2035:') && (await page.$$eval('.cc-sum tbody tr', (rs) => rs.length)) === 3, 'ccproj: sex ratio at birth');
  await page.fill('.cc-srb', '1.05'); await page.fill('.cc-n', '10');
  check(await waitBig('^2075: 98,353'), 'ccproj: back to the example');
  // CSV and report.
  const [dl] = await Promise.all([page.waitForEvent('download'), page.click('.cc-csv')]);
  const txt = readFileSync(await dl.path(), 'utf8');
  check(dl.suggestedFilename() === 'cohort-component-projection.csv' && txt.trim().split('\n').length === 1 + 11 * 18 && /^Year,Age,Female,Male,Total/.test(txt), 'ccproj: CSV');
  const [pdf] = await Promise.all([page.waitForEvent('download'), page.click('.cc .dl button[data-f="pdf"]')]);
  check(pdf.suggestedFilename() === 'cohort-component-projection.pdf', 'ccproj: PDF report');
  // nLx mode: constant hazard 0.01 gives ratios exp(-0.05).
  const m = 0.01, L = (a, open) => (open ? 1e5 * Math.exp(-m * a) / m : 1e5 * Math.exp(-m * a) * (1 - Math.exp(-5 * m)) / m);
  const rows = ['Age\tFemale\tMale\tFemale nLx\tMale nLx\tASFR'];
  for (let i = 0; i < 4; i++) rows.push(`${5 * i}${i === 3 ? '+' : ''}\t1000\t1000\t${L(5 * i, i === 3)}\t${L(5 * i, i === 3)}\t${i === 1 ? 0.1 : 0}`);
  const f = OUT + 'cc.tsv'; writeFileSync(f, rows.join('\n'));
  await page.selectOption('.cc-sv', 'L');
  await page.setInputFiles('.cc .dfb-in', f); await page.fill('.cc-n', '1');
  const want = Math.round(8000 * Math.exp(-0.05) + 5 * 0.1 * (1000 + 1000 * Math.exp(-0.05)) / 2 * (1 - Math.exp(-0.05)) / 0.05);
  check(await waitBig(`^2030: ${want.toLocaleString('en')} people`), `ccproj: nLx route by hand (${await big()} vs ${want})`);
  // Bad input.
  await page.fill('.cc-in', 'Age\tFemale\tMale\n0\t1\t1\n5\t1\t1\n10+\t1\t1');
  check(await page.waitForFunction(() => /Female survival/.test(document.querySelector('.cc-err')?.textContent || ''), null, { timeout: 15000 }).then(() => true, () => false), 'ccproj: missing columns explained');
  await page.selectOption('.cc-sv', 'ratio');
};
