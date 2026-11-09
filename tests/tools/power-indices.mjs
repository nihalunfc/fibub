export const path = '/science/power-indices/';
export default async ({ page, check, BASE, readFileSync }) => {
  await page.goto(BASE + path);
  const big = () => page.textContent('.pw-big');
  const cells = () => page.$$eval('.pw-tab tbody tr', (rs) => rs.map((r) => [...r.cells].map((c) => c.textContent)));
  check(/Harbour: 40\.0 % of the power with 34\.0 %/.test(await big()), `power: example headline (${await big()})`);
  let c = await cells();
  check(c[0][3] === '0.4000' && c[1][3] === '0.2333' && c[2][3] === '0.2333' && c[3][3] === '0.0667' && c[5][3] === '0.0000', `power: Shapley-Shubik column (${c.map((r) => r[3]).join()})`);
  check(c.map((r) => r[6]).join() === '20,12,12,4,4,0' && c[0][4] === '0.3846' && c[0][5] === '0.6250' && c[0][7] === '288', 'power: Banzhaf, swings and pivots');
  check(c[0].length === 11 && c[0][8] === '0.2667' && c[0][10] === '0.4872', 'power: Deegan-Packel and Johnston');
  const facts = await page.textContent('.pw-facts');
  check(/Lake/.test(facts) && /32 of 64/.test(facts) && /\[51; 34, 27, 18, 12, 6, 3\]/.test(facts), 'power: dummy, winning count and game shown');
  check((await page.locator('.pw-mwt tbody tr').count()) === 5, 'power: five minimal winning coalitions');
  check(await page.$eval('.pw-fig', (cv) => cv.width > 0), 'power: chart drawn');
  // Quota as a percentage converts the number.
  await page.selectOption('.pw-qt', 'pct'); await page.waitForTimeout(300);
  check((await page.inputValue('.pw-q')) === '51' && /Harbour: 40\.0 %/.test(await big()), 'power: % quota keeps the game');
  await page.fill('.pw-q', '67'); await page.waitForTimeout(400);
  check(/\[67;/.test(await page.textContent('.pw-facts')), 'power: two-thirds quota');
  await page.selectOption('.pw-qt', 'abs'); await page.waitForTimeout(300);
  // EEC 1958 game on one line.
  await page.fill('.pw-in', '4, 4, 4, 2, 2, 1'); await page.fill('.pw-q', '12'); await page.waitForTimeout(400);
  c = await cells();
  check(c.map((r) => r[3]).join() === '0.2333,0.2333,0.2333,0.1500,0.1500,0.0000', `power: EEC 1958 game (${c.map((r) => r[3]).join()})`);
  // 50 players: exact, without the minimal-coalition indices.
  await page.fill('.pw-in', Array(50).fill(1).join(', ')); await page.fill('.pw-q', '26'); await page.waitForTimeout(600);
  c = await cells();
  check(c.length === 50 && c[0][3] === '0.0200' && c[0].length === 8 && /up to 20 players/.test(await page.textContent('.pw-what')), 'power: 50 equal players');
  const [dl] = await Promise.all([page.waitForEvent('download'), page.click('.pw-csv')]);
  const txt = readFileSync(await dl.path(), 'utf8');
  check(dl.suggestedFilename() === 'power-indices.csv' && txt.split('\n').length === 52 && /Shapley-Shubik/.test(txt), 'power: CSV download');
  const [pdf] = await Promise.all([page.waitForEvent('download'), page.click('.pw .dl button[data-f="pdf"]')]);
  check(pdf.suggestedFilename() === 'power-indices.pdf', 'power: PDF download');
  // Bad input.
  await page.fill('.pw-in', '4, 4'); await page.fill('.pw-q', '20'); await page.waitForTimeout(400);
  check(/more than all the weights/.test(await page.textContent('.pw-err')), 'power: quota above total refused');
  await page.fill('.pw-in', 'North lots'); await page.waitForTimeout(400);
  check(/Line 1/.test(await page.textContent('.pw-err')), 'power: bad line refused');
};
