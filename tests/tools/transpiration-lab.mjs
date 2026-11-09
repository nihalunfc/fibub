// #1133 Transpiration lab
export const path = '/learn/transpiration-lab/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  const R = '.trl ';
  await page.goto(`${BASE}/learn/transpiration-lab/`); await page.waitForTimeout(800);
  const big = () => page.textContent(R + '.trl-big'), facts = () => page.textContent(R + '.trl-facts'), say = () => page.textContent(R + '.trl-say');
  const tap = async (sel) => { await page.locator(R + sel).scrollIntoViewIfNeeded(); await page.click(R + sel); await page.waitForTimeout(250); };
  const slide = async (sel, v) => { await page.$eval(R + sel, (el, v) => { el.value = String(v); el.dispatchEvent(new Event('input', { bubbles: true })); }, v); await page.waitForTimeout(250); };
  check((await big()) === '0.54 mL of water an hour: the bubble moves 57.1 mm in 5 minutes', `transpiration: worked example (${await big()})`);
  check((await page.textContent(R + '.trl-formula')).includes('57.1 mm ÷ 5 min = 11.42 mm/min') && (await say()).startsWith('Still air'), 'transpiration: Class 10 formula and still-air note');
  const snap = () => page.$eval(R + '.trl-fig', (c) => c.toDataURL());
  await page.waitForTimeout(1200); const a = await snap(); await page.waitForTimeout(800);
  check(a !== await snap() && a.length > 3000, 'transpiration: bubble moves');
  await slide('.trl-w', 2);
  const windy = await big();
  check(Number(windy.split(' ')[0]) > 0.54 && (await say()).includes('wind'), `transpiration: wind speeds it up (${windy})`);
  await slide('.trl-h', 100);
  check((await big()).startsWith('0.00 mL') && (await say()).includes('full of water vapour'), `transpiration: saturated air (${await big()})`);
  await slide('.trl-h', 50); await slide('.trl-w', 0);
  await slide('.trl-l', 0);
  check((await say()).includes('dark') && (await facts()).includes('Stomata open5 %'), `transpiration: dark closes stomata (${(await facts()).slice(0, 120)})`);
  await slide('.trl-l', 50);
  await tap('.trl-coat button[data-v=upper]'); const up = Number((await big()).split(' ')[0]);
  await tap('.trl-coat button[data-v=lower]'); const low = Number((await big()).split(' ')[0]);
  check(low < up && up < 0.54 && (await say()).includes('lower side'), `transpiration: lower jelly slows more (${up}, ${low})`);
  await tap('.trl-coat button[data-v=both]');
  check((await big()).startsWith('0.00 mL') && (await say()).startsWith('Jelly on both'), 'transpiration: both sides blocked');
  await tap('.trl-coat button[data-v=none]');
  // Class 11
  await tap('.trl-level button[data-v="11"]');
  { const f = await facts(); check(f.includes('Vapour pressure deficit1.17 kPa') && f.includes('2.34 × (1 − 0.5)') && (await page.textContent(R + '.trl-formula')).includes('π × 0.5² × 57.1 = 44.8 mm³'), `transpiration: Class 11 facts (${f.slice(0, 200)})`); }
  // graph
  const g0 = await page.$eval(R + '.trl-graph', (c) => c.toDataURL());
  await tap('.trl-axis button[data-v=h]');
  check((await page.textContent(R + '.trl-gnote')).includes('100 %') && g0 !== await page.$eval(R + '.trl-graph', (c) => c.toDataURL()), 'transpiration: humidity graph');
  await tap('.trl-axis button[data-v=w]');
  check((await page.textContent(R + '.trl-gnote')).startsWith('Wind blows'), 'transpiration: wind graph');
  // readings
  check(await page.isDisabled(R + '.trl-csv'), 'transpiration: CSV waits for a reading');
  await tap('.trl-read'); await tap('.trl-read');
  const rows = await page.$$eval(R + '.trl-tab tbody tr td:last-child', (t) => t.map((r) => Number(r.textContent)));
  check(rows.length === 2 && rows.every((x) => Math.abs(x - 57.1) < 2.5), `transpiration: readings near 57 mm (${rows})`);
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.trl-csv')]); const f = OUT + 'potometer.csv'; await d.saveAs(f); const l = readFileSync(f, 'utf8').trim().split('\n');
    check(l[0] === 'light_percent,temperature_C,humidity_percent,wind_m_s,jelly,bubble_mm_5min' && l.length === 3 && l[1].startsWith('50,20,50,0,none,'), `transpiration: CSV (${l[1]})`); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.dl button[data-f=png]')]); const f = OUT + 'potometer.png'; await d.saveAs(f); check(readFileSync(f).subarray(1, 4).toString() === 'PNG', 'transpiration: image report'); }
  await tap('.trl-clear');
  check((await page.$$eval(R + '.trl-tab tr', (t) => t.length)) === 0, 'transpiration: clear readings');
  for (const [lv, n] of [['11', 5], ['10', 4]]) {
    await tap(`.trl-level button[data-v="${lv}"]`);
    await tap('.trl-check');
    check((await page.textContent(R + '.trl-score')) === `0 of ${n} right.`, `transpiration: Class ${lv} quiz blanks are wrong`);
    await page.$$eval(R + '.trl-qs li', (lis) => lis.forEach((li) => { li.querySelector('.trl-ans').value = li.dataset.a; }));
    await tap('.trl-check');
    check((await page.textContent(R + '.trl-score')) === `${n} of ${n} right.` && (await page.$$eval(R + '.trl-worked', (w) => w.every((e) => e.textContent.startsWith('✓')))), `transpiration: Class ${lv} quiz right answers`);
  }
  await tap('.trl-new');
  check((await page.textContent(R + '.trl-score')) === '', 'transpiration: new questions');
};
