export const path = '/science/fertility-rates/';
export default async ({ page, check, BASE, readFileSync, writeFileSync, OUT }) => {
  await page.goto(BASE + path);
  const big = () => page.textContent('.fr-big');
  const waitFacts = (re) => page.waitForFunction((src) => new RegExp(src).test(document.querySelector('.fr-facts')?.textContent || ''), re, { timeout: 15000 }).then(() => true, () => false);
  check((await big()) === 'Total fertility rate 1.56 children per woman', `fertility: TFR (${await big()})`);
  const facts = await page.textContent('.fr-facts');
  check(/0\.761/.test(facts) && /0\.751/.test(facts) && /30\.60 years/.test(facts) && /46\.0 per 1,000/.test(facts) && /11\.05 per 1,000/.test(facts) && /954/.test(facts), 'fertility: GRR, NRR, mean age, GFR, CBR');
  const rows = await page.$$eval('.fr-tab tbody tr', (rs) => rs.map((r) => [...r.cells].map((c) => c.textContent)));
  check(rows.length === 7 && rows[3][3] === '94.98' && rows[0][3] === '9.92', `fertility: ASFR table (${rows[3].join(' ')})`);
  check(await page.waitForFunction(() => { const c = document.querySelector('.fr-fig'); return c && c.width > 0 && /fertility rates/.test(c.getAttribute('aria-label') || ''); }, null, { timeout: 15000 }).then(() => true, () => false), 'fertility: chart drawn');
  // NRR from survival to mean age.
  await page.selectOption('.fr-nrr', 'p');
  check(await waitFacts('0\\.753'), 'fertility: NRR = GRR × 0.99');
  await page.selectOption('.fr-nrr', 'L');
  await page.fill('.fr-yrs', '2');
  check(await page.waitForFunction(() => /0\.78 children/.test(document.querySelector('.fr-big')?.textContent || ''), null, { timeout: 15000 }).then(() => true, () => false), 'fertility: births over 2 years');
  await page.fill('.fr-yrs', '1'); await page.fill('.fr-pop', '');
  check(await waitFacts('Crude birth rate–'), 'fertility: no CBR without population');
  await page.fill('.fr-srb', '1');
  check(await waitFacts('0\\.780'), 'fertility: sex ratio 1 gives GRR = TFR/2');
  await page.fill('.fr-srb', '1.05');
  const [dl] = await Promise.all([page.waitForEvent('download'), page.click('.fr-csv')]);
  const txt = readFileSync(await dl.path(), 'utf8');
  check(dl.suggestedFilename() === 'fertility-rates.csv' && /^Age,Births,Women,ASFR/.test(txt) && /TFR,1\.559/.test(txt), 'fertility: CSV');
  const [doc] = await Promise.all([page.waitForEvent('download'), page.click('.fr .dl button[data-f="docx"]')]);
  check(doc.suggestedFilename() === 'fertility-rates.docx', 'fertility: Word report');
  // Female births column from a file.
  const f = OUT + 'fert.csv';
  writeFileSync(f, 'Age,Births,Female births,Women,nLx\n15-19,26,12,2620,496954\n20-24,126,62,2810,495904\n25-29,275,134,3050,494683\n30-34,303,148,3190,493195\n35-39,173,85,3150,491289\n40-44,45,22,3000,488730\n45-49,6,3,2900,485158\n');
  await page.setInputFiles('.fr .dfb-in', f);
  check(await waitFacts('0\\.762') && await waitFacts('0\\.752'), 'fertility: GRR and NRR from female births');
  // Bad input.
  await page.fill('.fr-in', 'Age,Births\n15-19,3');
  check(await page.waitForFunction(() => /Births and Women/.test(document.querySelector('.fr-err')?.textContent || ''), null, { timeout: 15000 }).then(() => true, () => false), 'fertility: missing Women column');
  await page.fill('.fr-in', 'Age,Births,Women,nLx\n15-19,3,0,1');
  check(await page.waitForFunction(() => /more than 0/.test(document.querySelector('.fr-err')?.textContent || ''), null, { timeout: 15000 }).then(() => true, () => false), 'fertility: zero women refused');
};
