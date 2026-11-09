// #1131 Enzyme activity lab
export const path = '/learn/enzyme-activity/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  const R = '.enz ';
  await page.goto(`${BASE}/learn/enzyme-activity/`); await page.waitForTimeout(800);
  const big = () => page.textContent(R + '.enz-big'), facts = () => page.textContent(R + '.enz-facts');
  const tap = async (sel) => { await page.locator(R + sel).scrollIntoViewIfNeeded(); await page.click(R + sel); await page.waitForTimeout(250); };
  const slide = async (sel, v) => { await page.$eval(R + sel, (el, v) => { el.value = String(v); el.dispatchEvent(new Event('input', { bubbles: true })); }, v); await page.waitForTimeout(250); };
  check((await big()) === 'Rate 78.6 units a minute: the starch is gone after 4 min', `enzyme: worked example (${await big()})`);
  check((await page.textContent(R + '.enz-formula')).includes('1 ÷ 4.0 = 0.25 per minute') && (await facts()).includes('× 0.94'), 'enzyme: Class 10 formula and facts');
  check(!(await page.isVisible(R + '.enz-s')), 'enzyme: Class 10 hides substrate');
  const snap = () => page.$eval(R + '.enz-fig', (c) => c.toDataURL());
  const a = await snap();
  await slide('.enz-t', 60);
  check((await big()).includes('still there after 20 minutes') && (await page.textContent(R + '.enz-say')).startsWith('Too hot') && a !== await snap(), `enzyme: too hot (${await big()})`);
  await slide('.enz-t', 15);
  check((await page.textContent(R + '.enz-say')).startsWith('Cool'), 'enzyme: cool');
  await slide('.enz-t', 37);
  await tap('.enz-enz button[data-v="1"]');
  check((await big()).includes('protein is still there') && (await page.textContent(R + '.enz-say')).includes('pH 2'), `enzyme: pepsin at 6.8 (${await big()})`);
  await slide('.enz-p', 2);
  check((await big()).includes('the protein is gone after 4 min'), `enzyme: pepsin at pH 2 (${await big()})`);
  await tap('.enz-enz button[data-v="0"]'); await slide('.enz-p', 6.8);
  await page.check(R + '.enz-boil'); await page.waitForTimeout(250);
  check((await big()).startsWith('Rate 0.0') && (await page.textContent(R + '.enz-say')).startsWith('Boiled'), 'enzyme: boiled');
  await page.uncheck(R + '.enz-boil'); await page.waitForTimeout(250);
  // runs table and CSV
  check(await page.isDisabled(R + '.enz-csv'), 'enzyme: CSV waits for a run');
  await tap('.enz-rec'); await slide('.enz-t', 20); await tap('.enz-rec');
  const rows = await page.$$eval(R + '.enz-tab tbody tr', (t) => t.map((r) => r.textContent));
  check(rows.length === 2 && rows[0].includes('4 min') && rows[0].includes('0.250'), `enzyme: runs table (${rows[0]})`);
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.enz-csv')]); const f = OUT + 'enzyme.csv'; await d.saveAs(f); const l = readFileSync(f, 'utf8').trim().split('\n');
    check(l[0].startsWith('enzyme,temperature_C,pH') && l.length === 3 && l[1] === 'Amylase,37,6.8,10,none,0,no,4,0.25', `enzyme: CSV (${l[1]})`); }
  await tap('.enz-clear');
  check((await page.$$eval(R + '.enz-tab tr', (t) => t.length)) === 0, 'enzyme: clear runs');
  await slide('.enz-t', 37);
  // Class 11
  await tap('.enz-level button[data-v="11"]');
  check(await page.isVisible(R + '.enz-s') && (await page.textContent(R + '.enz-formula')).includes('= 78.6 units/min') && (await facts()).includes('Km2.0 mM'), 'enzyme: Class 11 Michaelis-Menten');
  await tap('.enz-inh button[data-v=competitive]');
  check((await facts()).includes('Km6.0 mM') && (await big()).startsWith('Rate 58.9'), `enzyme: competitive (${await big()})`);
  await tap('.enz-inh button[data-v=noncompetitive]');
  check((await facts()).includes('Km2.0 mM') && (await big()).startsWith('Rate 26.2'), `enzyme: non-competitive (${await big()})`);
  // graph axes
  const g0 = await page.$eval(R + '.enz-graph', (c) => c.toDataURL());
  await tap('.enz-axis button[data-v=s]');
  check((await page.textContent(R + '.enz-gnote')).startsWith('A non-competitive') && g0 !== await page.$eval(R + '.enz-graph', (c) => c.toDataURL()), 'enzyme: substrate graph');
  await tap('.enz-axis button[data-v=ph]');
  check((await page.textContent(R + '.enz-gnote')).includes('pepsin in the acid stomach'), 'enzyme: pH graph');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.dl button[data-f=png]')]); const f = OUT + 'enzyme.png'; await d.saveAs(f); check(readFileSync(f).subarray(1, 4).toString() === 'PNG', 'enzyme: image report'); }
  // Check yourself at both levels
  for (const [lv, n] of [['11', 5], ['10', 4]]) {
    await tap(`.enz-level button[data-v="${lv}"]`);
    await tap('.enz-check');
    check((await page.textContent(R + '.enz-score')) === `0 of ${n} right.`, `enzyme: Class ${lv} quiz blanks are wrong`);
    await page.$$eval(R + '.enz-qs li', (lis) => lis.forEach((li) => { li.querySelector('.enz-ans').value = li.dataset.a; }));
    await tap('.enz-check');
    check((await page.textContent(R + '.enz-score')) === `${n} of ${n} right.` && (await page.$$eval(R + '.enz-worked', (w) => w.every((e) => e.textContent.startsWith('✓')))), `enzyme: Class ${lv} quiz right answers`);
  }
  await tap('.enz-new');
  check((await page.textContent(R + '.enz-score')) === '', 'enzyme: new questions');
};
