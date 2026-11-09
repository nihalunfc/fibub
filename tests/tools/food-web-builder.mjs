// #1129 Food web builder
export const path = '/learn/food-web-builder/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  const R = '.fwb ';
  await page.goto(`${BASE}/learn/food-web-builder/`); await page.waitForTimeout(600);
  const tap = async (sel) => { await page.locator(R + sel).first().scrollIntoViewIfNeeded(); await page.locator(R + sel).first().click(); await page.waitForTimeout(250); };
  const big = () => page.textContent(R + '.fwb-big'), say = () => page.textContent(R + '.fwb-say');
  check((await big()) === '14 food chains in this forest web' && (await say()).startsWith('Longest: ') && (await say()).endsWith('→ Hawk.'), `web: forest (${await big()} / ${await say()})`);
  check((await page.$$eval(R + '.fwb-node', (n) => n.length)) === 13 && (await page.$$eval(R + '.fwb-link', (n) => n.length)) === 20, 'web: 13 organisms, 20 arrows');
  // remove the deer
  await tap('.fwb-mode button[data-v=remove]');
  await tap('.fwb-node[data-o=deer]');
  check((await big()) === 'Without the deer: 1 more species dies out' && (await say()).startsWith('Tiger has nothing left to eat'), `web: remove deer (${await big()})`);
  check(await page.$eval(R + '.fwb-node[data-o=tiger]', (g) => g.classList.contains('fwb-dead') && g.textContent.includes('dies out')), 'web: tiger marked');
  await tap('.fwb-back');
  await tap('.fwb-node[data-o=snake]');
  check((await big()) === 'Without the snake: no other species dies out' && (await say()).includes('Mouse, Frog, Sparrow are eaten less') && (await say()).includes('Hawk lost some food'), `web: remove snake (${await say()})`);
  await tap('.fwb-node[data-o=snake]');
  check((await big()).startsWith('14 food chains'), 'web: tap again brings it back');
  // draw links
  await tap('.fwb-mode button[data-v=link]');
  await tap('.fwb-node[data-o=grass]');
  check((await page.textContent(R + '.fwb-hint')).startsWith('Now tap who eats Grass'), 'web: first tap selects the food');
  await tap('.fwb-node[data-o=tiger]');
  check((await page.textContent(R + '.fwb-hint')) === 'Added: Grass → Tiger (Tiger eats grass).' && (await page.$$eval(R + '.fwb-link', (n) => n.length)) === 21, 'web: add a link');
  await tap('.fwb-node[data-o=grass]'); await tap('.fwb-node[data-o=tiger]');
  check((await page.textContent(R + '.fwb-hint')).startsWith('Removed: Grass → Tiger'), 'web: remove a link');
  await tap('.fwb-node[data-o=frog]'); await tap('.fwb-node[data-o=trees]');
  check((await page.textContent(R + '.fwb-hint')).includes('makes its own food'), 'web: plants do not eat');
  // clear and build
  await tap('.fwb-blank');
  check((await big()) === '0 food chains in this forest web' && (await page.textContent(R + '.fwb-svg')).includes('no food yet'), 'web: cleared links');
  await tap('.fwb-node[data-o=grass]'); await tap('.fwb-node[data-o=deer]'); await tap('.fwb-node[data-o=deer]'); await tap('.fwb-node[data-o=tiger]');
  check((await big()) === '1 food chain in this forest web' && (await say()) === 'Longest: Grass → Deer → Tiger.', `web: built a chain (${await say()})`);
  await tap('.fwb-reset');
  // pond
  await tap('.fwb-web button[data-v=pond]');
  check((await big()) === '9 food chains in this pond web', `web: pond (${await big()})`);
  // pyramid
  check((await page.textContent(R + '.fwb-formula')).includes('10,000 → 1,000 → 100 → 10.0 kJ'), `web: 10 % pyramid (${await page.textContent(R + '.fwb-formula')})`);
  await tap('.fwb-level button[data-v="12"]');
  check((await page.textContent(R + '.fwb-svg')).includes('level 4') && (await page.textContent(R + '.fwb-facts')).includes('Highest level4'), 'web: Class 12 levels');
  await page.$eval(R + '.fwb-f', (el) => { el.value = '20'; el.dispatchEvent(new Event('input', { bubbles: true })); }); await page.waitForTimeout(250);
  check((await page.textContent(R + '.fwb-formula')).includes('10,000 → 2,000 → 400 → 80.0 kJ'), 'web: 20 % efficiency');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.fwb-csv')]); const f = OUT + 'web.csv'; await d.saveAs(f); const l = readFileSync(f, 'utf8').trim().split('\n');
    check(l[0] === 'chain,length,top_consumer' && l.length === 10 && l.some((x) => x.startsWith('Algae > Water fleas > Small fish > Heron,4,Heron')), 'web: CSV'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.dl button[data-f=png]')]); const f = OUT + 'web.png'; await d.saveAs(f); check(readFileSync(f).subarray(1, 4).toString() === 'PNG', 'web: image report'); }
  for (const lv of ['12', '8']) {
    await tap(`.fwb-level button[data-v="${lv}"]`);
    const n = await page.$$eval(R + '.fwb-qs li', (l) => l.length);
    await tap('.fwb-check');
    check((await page.textContent(R + '.fwb-score')) === `0 of ${n} right.`, `web: Class ${lv} blanks wrong`);
    await page.$$eval(R + '.fwb-qs li', (lis) => lis.forEach((li) => { li.querySelector('.fwb-ans').value = li.dataset.a; }));
    await tap('.fwb-check');
    check((await page.textContent(R + '.fwb-score')) === `${n} of ${n} right.` && n === (lv === '12' ? 5 : 4), `web: Class ${lv} quiz (${n})`);
  }
};
