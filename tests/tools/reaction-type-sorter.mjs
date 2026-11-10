// #1291 Reaction type sorter
export const path = '/learn/reaction-type-sorter/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/reaction-type-sorter/`); await page.waitForSelector('.rs .rs-fig .rs-atom');
  const R = '.rs ';
  const txt = (s) => page.textContent(R + s);
  check((await page.$$(R + '.rs-atom')).length === 4 && (await txt('.rs-eq')).startsWith('2Mg(s) + O₂(g) → ?'), 'sorter: magnesium burning, 4 atoms, products hidden');
  const pos = () => page.$eval(R + '.rs-atom', (g) => g.getAttribute('transform'));
  const p0 = await pos();
  await page.$eval(R + '.rs-t', (e) => { e.value = '100'; e.dispatchEvent(new Event('input')); }); await page.waitForTimeout(100);
  check(p0 !== (await pos()) && (await txt('.rs-eq')).includes('→ 2MgO(s)') && (await txt('.rs-fig')).includes('Products'), 'sorter: slider moves atoms to the products');
  await page.click(R + '.rs-ans[data-t="decomposition"]'); await page.waitForTimeout(100);
  check((await txt('.rs-fb')).includes('combination') && (await page.$$(R + '.rs-ans.wrong')).length === 1 && (await page.$$(R + '.rs-ans.right')).length === 1, 'sorter: wrong answer marked, right one shown');
  check((await txt('.rs-score')) === '0 of 1 right' && (await txt('.rs-redox')).includes('Oxidised: Mg') && (await txt('.rs-redox')).includes('gaining oxygen'), 'sorter: score and Class 10 redox');
  await page.click(R + '.rs-level button[data-l="11"]'); await page.waitForTimeout(100);
  check((await txt('.rs-redox')).includes('from 0 to +2') && (await txt('.rs-redox')).includes('electrons'), 'sorter: Class 11 oxidation numbers');
  await page.$eval(R + '.rs-ans[data-t="combination"]', (b) => b.click());
  check((await txt('.rs-score')) === '0 of 1 right', 'sorter: one answer per reaction');
  await page.selectOption(R + '.rs-pick', 'baso4'); await page.waitForTimeout(100);
  check((await page.$$(R + '.rs-atom')).length === 10 && (await txt('.rs-fb')) === '', 'sorter: pick barium sulfate (10 atoms), fresh question');
  await page.click(R + '.rs-ans[data-t="double"]'); await page.waitForTimeout(100);
  check((await txt('.rs-fb')) === 'Right!' && (await txt('.rs-score')) === '1 of 2 right' && (await txt('.rs-redox')).includes('Not redox') && (await txt('.rs-seen')).includes('precipitate'), 'sorter: double displacement right, not redox');
  await page.selectOption(R + '.rs-pick', 'limestone'); await page.click(R + '.rs-ans[data-t="decomposition"]'); await page.waitForTimeout(100);
  check((await txt('.rs-rule')).includes('energy comes from heat'), 'sorter: decomposition by heat');
  await page.selectOption(R + '.rs-pick', 'pbno3-heat'); await page.waitForTimeout(100);
  check((await page.$$(R + '.rs-atom')).length === 18, 'sorter: lead nitrate has 18 atoms');
  await page.click(R + '.rs-play'); await page.waitForTimeout(2500);
  check((await page.inputValue(R + '.rs-t')) === '100' && (await txt('.rs-play')) === 'Play again', 'sorter: play runs to the products');
  const seen = new Set();
  for (let i = 0; i < 20; i++) { await page.click(R + '.rs-next'); seen.add(await page.inputValue(R + '.rs-pick')); }
  check(seen.size >= 19, `sorter: next reaction goes through the deck (${seen.size} different)`);
  // Every atom ends up somewhere for every reaction.
  const ids = await page.$$eval(R + '.rs-pick option', (o) => o.map((x) => x.value));
  let ok = 0;
  for (const id of ids) {
    await page.selectOption(R + '.rs-pick', id);
    await page.$eval(R + '.rs-t', (e) => { e.value = '100'; e.dispatchEvent(new Event('input')); });
    const good = await page.$$eval(R + '.rs-atom', (g) => g.every((x) => !/NaN|undefined/.test(x.getAttribute('transform'))));
    if (good) ok++;
  }
  check(ok === ids.length, `sorter: every reaction animates cleanly (${ok}/${ids.length})`);
};
