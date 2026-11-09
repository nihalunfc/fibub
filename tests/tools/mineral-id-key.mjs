// #515 mineral identification key
export const path = '/science/mineral-id-key/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  await page.goto(`${BASE}/science/mineral-id-key/`); await page.waitForTimeout(500);
  const t = (c) => page.textContent('.mik ' + c);
  const names = () => page.$$eval('.mik .mk-list > li strong', (e) => e.map((x) => x.textContent));
  const pill = (i) => page.textContent(`.mik .mk-list > li:nth-child(${i + 1}) .ax-pill`);
  const so = async (c, v) => { await page.selectOption('.mik ' + c, v); await page.waitForTimeout(80); };
  { const n = await names(); check(n[0] === 'Calcite' && (await pill(0)) === '5 of 5' && n[1] === 'Barite' && n.includes('Dolomite'), 'mineral key: example ranks calcite first, then barite'); }
  check((await t('.mk-sum')).includes('5 of 51') || (await t('.mk-sum')).startsWith('5 of'), 'mineral key: summary count');
  check((await t('.mk-list > li:nth-child(2) ul')).includes('✗ fizzes in cold dilute acid: no'), 'mineral key: reasons show the mismatch');
  check((await page.locator('.mik .mk-table tbody tr').count()) >= 40, 'mineral key: property table of 40+ minerals');
  await so('.mk-tests select[data-t="fizz-cold"]', 'no'); await so('.mk-tests select[data-t="fizz-powder"]', 'yes'); await page.fill('.mik .mk-h', '3.5'); await page.waitForTimeout(80);
  check((await names())[0] === 'Dolomite', 'mineral key: powder fizz only → dolomite');
  await so('.mk-tests select[data-t="fizz-cold"]', ''); await so('.mk-tests select[data-t="fizz-powder"]', '');
  await so('.mk-hm', 'glass'); await so('.mk-lu', 'metallic'); await so('.mk-st', 'greenish-black'); await so('.mk-cl', 'none'); await so('.mk-co', 'brassy');
  check(!(await page.isVisible('.mik .mk-h')) && (await names())[0] === 'Pyrite', 'mineral key: scratches glass, brassy → pyrite');
  await so('.mk-hm', 'knife');
  check((await names())[0] === 'Chalcopyrite', 'mineral key: knife scratches it → chalcopyrite');
  await so('.mk-hm', ''); await so('.mk-co', ''); await so('.mk-st', 'grey'); await so('.mk-cl', '3-90');
  await page.click('.mik .mk-sgcalc summary'); await page.fill('.mik .mk-wa', '30'); await page.fill('.mik .mk-ww', '26'); await page.waitForTimeout(100);
  check((await page.inputValue('.mik .mk-sg')) === '7.50' && (await t('.mk-sgout')).includes('= 7.50') && (await names())[0] === 'Galena', 'mineral key: SG from weighings 7.50 → galena');
  await page.fill('.mik .mk-ww', '40'); await page.waitForTimeout(80);
  check((await t('.mk-sgout')).includes('must be less'), 'mineral key: bad weighing message');
  await page.fill('.mik .mk-wa', ''); await page.fill('.mik .mk-ww', ''); await page.fill('.mik .mk-sg', '30'); await page.waitForTimeout(80);
  check((await t('.mk-err')).includes('between about 1 and 25') && await page.isHidden('.mik .mk-out'), 'mineral key: bad SG message');
  await page.fill('.mik .mk-sg', ''); await so('.mk-cl', ''); await so('.mk-st', 'black'); await so('.mk-tests select[data-t="magnetic"]', 'yes'); await so('.mk-mm', '0');
  { const n = await names(); check(n.length === 1 && n[0] === 'Magnetite', 'mineral key: no mismatches allowed, magnetic → only magnetite'); }
  await so('.mk-mm', '99'); await page.waitForTimeout(80);
  check(await page.isVisible('.mik .mk-more') && (await names()).length === 8, 'mineral key: any mismatches shows top 8 and a Show all button');
  await page.click('.mik .mk-more'); await page.waitForTimeout(80);
  check((await names()).length === 51 && await page.isHidden('.mik .mk-more'), 'mineral key: show all');
  await so('.mk-grp', 'rock-forming'); await page.click('.mik .mk-more'); await page.waitForTimeout(80);
  check(!(await names()).includes('Magnetite') && (await names()).includes('Quartz'), 'mineral key: rock-forming group only');
  await so('.mk-grp', 'all'); await so('.mk-th', '1'); await so('.mk-ts', '0.5');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.mik .mk-csv')]); const f = OUT + 'mk.csv'; await d.saveAs(f); const s = readFileSync(f, 'utf8').trim().split('\n'); check(s[0].startsWith('rank,mineral,formula,score') && s[1].startsWith('1,Magnetite'), 'mineral key: matches CSV'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.mik .mk-tcsv')]); const f = OUT + 'mkt.csv'; await d.saveAs(f); const s = readFileSync(f, 'utf8').trim().split('\n'); check(s.length >= 41 && s[0].startsWith('mineral,formula,group,hardness_min') && s.some((r) => r.startsWith('Quartz,SiO₂,rock-forming,7,7,2.6,2.7')), 'mineral key: table CSV'); }
  await page.evaluate(() => { window.print = () => { window.__printed = document.documentElement.classList.contains('mk-printing'); }; });
  await page.click('.mik .mk-print'); await page.waitForTimeout(50);
  check(await page.evaluate(() => window.__printed === true), 'mineral key: print button prints the table');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.mik .mk-out > .dl:last-child [data-f=docx]')]); const f = OUT + 'mk.docx'; await d.saveAs(f); check(readFileSync(f).subarray(0, 2).toString() === 'PK', 'mineral key: Word report'); }
};
