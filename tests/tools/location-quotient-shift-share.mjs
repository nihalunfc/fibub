export const path = '/science/location-quotient-shift-share/';
export default async ({ page, check, BASE, OUT, readFileSync, writeFileSync }) => {
  await page.goto(BASE + path);
  await page.waitForSelector('.lqs-out:not([hidden])');
  check((await page.textContent('.lqs-big')) === 'Base multiplier 8.33', `lq tool: example multiplier (${await page.textContent('.lqs-big')})`);
  const facts = await page.textContent('.lqs-facts');
  check(/\+4,250 \(\+12\.2 %\)/.test(facts) && /\+8\.6 %/.test(facts) && /\+3,002/.test(facts) && /−768/.test(facts) && /\+2,015/.test(facts), 'lq tool: shift-share totals 3,002 / −768 / 2,015');
  check(/4,706 of 39,200/.test(facts) && /0\.12/.test(facts), 'lq tool: basic jobs and specialisation');
  const mining = await page.textContent('.lqs-tab tbody tr:nth-child(2)');
  check(/2\.70/.test(mining) && /3\.81/.test(mining) && /885/.test(mining), `lq tool: mining LQ 2.70 → 3.81 (${mining})`);
  check(await page.locator('.lqs-tab tbody tr:nth-child(2) td.lqs-hi').count() === 1, 'lq tool: high LQ in bold');
  check(/Mining and quarrying is the most concentrated/.test(await page.textContent('.lqs-note')), 'lq tool: note names the top industry');
  check((await page.locator('.lqs-tab thead th').first().textContent()) === 'Industry' && /LQ 2015/.test(await page.textContent('.lqs-tab thead')), 'lq tool: years taken from the header');
  check(await page.isVisible('.lqs-fig2'), 'lq tool: shift-share chart shown');

  // CSV download
  const csvBtn = page.locator('.lqs-csv'); await csvBtn.scrollIntoViewIfNeeded();
  const [dl] = await Promise.all([page.waitForEvent('download'), csvBtn.click()]);
  const p = OUT + 'lq.csv'; await dl.saveAs(p); const text = readFileSync(p, 'utf8');
  check(dl.suggestedFilename() === 'location-quotients-shift-share.csv' && text.split('\n').length === 11 && /^Mining and quarrying,950,1200,60000,52000,2\.70004768/m.test(text), 'lq tool: CSV download');
  // Report image
  const png = page.locator('.dl button[data-f="png"]'); await png.scrollIntoViewIfNeeded();
  const [d2] = await Promise.all([page.waitForEvent('download'), png.click()]);
  check(d2.suggestedFilename() === 'location-quotients-shift-share.png', 'lq tool: PNG report');

  // Base year option
  await page.selectOption('.lqs-year', '0');
  check(/3,924 of 34,950/.test(await page.textContent('.lqs-facts')), 'lq tool: basic jobs for the first year');

  // One year only
  await page.fill('.lqs-in', 'Sector,Town,Nation\nA,300,10000\nB,100,20000\nC,100,10000');
  await page.waitForTimeout(450);
  const f1 = await page.textContent('.lqs-facts');
  check(!(await page.isVisible('.lqs-fig2')) && /175 of 500/.test(f1) && (await page.textContent('.lqs-big')) === 'Base multiplier 2.86', `lq tool: one year (${f1})`);
  check(/^A300/.test((await page.textContent('.lqs-tab tbody tr:first-child')).replace(/\s/g, '')) && /2\.40/.test(await page.textContent('.lqs-tab tbody tr:first-child')), 'lq tool: one-year LQ 2.40');

  // Opening a file
  writeFileSync(OUT + 'lq-in.csv', 'Industry,Region,Reference\nX,50,1000\nY,50,3000\n');
  await page.setInputFiles('.lqs .dfb-in', OUT + 'lq-in.csv');
  await page.waitForTimeout(450);
  check(/LQ/.test(await page.textContent('.lqs-tab thead')) && /2\.00/.test(await page.textContent('.lqs-tab tbody tr:first-child')), 'lq tool: opens a CSV file');

  // Bad input
  await page.fill('.lqs-in', 'A,1,2,3\nB,4,5,6');
  await page.waitForTimeout(450);
  check(/3 columns .* or 5/.test(await page.textContent('.lqs-err')) && await page.isHidden('.lqs-out'), 'lq tool: wrong column count explained');
  await page.fill('.lqs-in', 'A,10,x\nB,4,5');
  await page.waitForTimeout(450);
  check(/"x" in row 1, column 3 is not a number/.test(await page.textContent('.lqs-err')), 'lq tool: text in numbers reported');
  await page.fill('.lqs-in', 'A,10,0\nB,4,5');
  await page.waitForTimeout(450);
  check(/none in the reference area/.test(await page.textContent('.lqs-err')), 'lq tool: zero reference jobs reported');
};
