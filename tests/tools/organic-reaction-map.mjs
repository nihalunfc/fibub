// #1436 Organic reaction map
export const path = '/learn/organic-reaction-map/';
export default async ({ page, check, BASE }) => {
  const R = '.orm ';
  await page.goto(`${BASE}/learn/organic-reaction-map/`); await page.waitForTimeout(500);
  const big = () => page.textContent(R + '.orm-big');
  const steps = () => page.$$eval(R + '.orm-steps li b', (b) => b.map((x) => x.textContent).join(' | '));
  check((await big()) === 'Primary (1°) alcohol → Ketone: 3 steps', `orm: default route (${await big()})`);
  check((await steps()).includes('Alkene → Secondary (2°) alcohol') && (await page.textContent(R + '.orm-steps')).includes('propan-2-ol'), 'orm: steps with examples');
  check((await page.$$eval(R + '.orm-svg .orm-node', (n) => n.length)) === 25 && (await page.$$eval(R + '.orm-svg .orm-e.route', (n) => n.length)) === 3, 'orm: 25 boxes and 3 route arrows');
  check((await page.textContent(R + '.orm-other')).startsWith('Other routes:'), 'orm: other routes listed');
  // pick via selects
  await page.selectOption(R + '.orm-from', 'amide'); await page.selectOption(R + '.orm-to', 'amine'); await page.waitForTimeout(200);
  check((await big()) === 'Amide → Primary (1°) amine: 1 step' && (await page.textContent(R + '.orm-steps')).includes('Hoffmann'), 'orm: Hoffmann');
  await page.check(R + '.orm-keep'); await page.waitForTimeout(200);
  check((await big()).endsWith('2 steps') && (await steps()).includes('Amide → Nitrile'), 'orm: keep carbons goes via nitrile');
  await page.uncheck(R + '.orm-keep');
  // swap: amine to amide
  await page.click(R + '.orm-swap'); await page.waitForTimeout(200);
  check((await page.inputValue(R + '.orm-from')) === 'amine' && (await big()).startsWith('Primary (1°) amine → Amide'), `orm: swap (${await big()})`);
  // dead end
  await page.selectOption(R + '.orm-from', 'azo'); await page.waitForTimeout(200);
  check((await big()).startsWith('No route from azo dye'), 'orm: no route');
  // tap a node on the map, then Start here / End here
  const node = page.locator(R + '.orm-node[data-id="nitrobenzene"]'); await node.scrollIntoViewIfNeeded(); await node.click(); await page.waitForTimeout(200);
  check((await page.textContent(R + '.orm-info h3')).startsWith('Nitrobenzene') && (await page.textContent(R + '.orm-out')).includes('Aniline'), 'orm: tap shows reactions');
  check((await page.$$eval(R + '.orm-e.out', (n) => n.length)) === 1 && (await page.$$eval(R + '.orm-e.in', (n) => n.length)) === 1, 'orm: in and out arrows drawn');
  await page.click(R + '.orm-start'); await page.selectOption(R + '.orm-to', 'phenol'); await page.waitForTimeout(200);
  check((await steps()) === 'Nitrobenzene → Aniline (aryl amine) | Aniline (aryl amine) → Benzenediazonium salt | Benzenediazonium salt → Phenol', `orm: nitrobenzene to phenol (${await steps()})`);
  await page.click(R + '.orm-node[data-id="alkene"]'); await page.click(R + '.orm-end'); await page.waitForTimeout(200);
  check((await page.inputValue(R + '.orm-to')) === 'alkene', 'orm: End here');
  await page.keyboard.press('Tab');
  // Class 11
  await page.click(R + '.orm-lv button[data-v="11"]'); await page.waitForTimeout(200);
  const n11 = await page.$$eval(R + '.orm-svg .orm-node', (n) => n.length);
  check(n11 === 9 && !(await page.$$eval(R + '.orm-from option', (o) => o.map((x) => x.value))).includes('alcohol1'), `orm: Class 11 hides alcohols (${n11})`);
  await page.selectOption(R + '.orm-from', 'alkene'); await page.selectOption(R + '.orm-to', 'alkyne'); await page.waitForTimeout(200);
  check((await big()) === 'Alkene → Alkyne: 2 steps', 'orm: Class 11 alkene to alkyne');
  // Check yourself
  for (const lv of ['11', '12']) {
    await page.click(R + `.orm-lv button[data-v="${lv}"]`); await page.waitForTimeout(150);
    const items = page.locator(R + '.lq-item'); const n = await items.count(); let ok = 0;
    for (let i = 0; i < n; i++) {
      const it = items.nth(i), ans = Number(await it.getAttribute('data-ans'));
      if (await it.locator('.lq-choice').count()) await it.locator('.lq-choice').nth(ans).click();
      else { await it.locator('.lq-in').fill(String(ans)); await it.locator('.lq-check').click(); }
      if ((await it.locator('.lq-fb').textContent()) === 'Right.') ok++;
    }
    check(n === 4 && ok === 4, `orm: Class ${lv} quiz ${ok}/${n}`);
  }
  const wrong = page.locator(R + '.lq-item').first(); const a = Number(await wrong.getAttribute('data-ans'));
  await page.click(R + '.lq-new'); await page.locator(R + '.lq-item').first().locator('.lq-choice').nth((Number(await page.locator(R + '.lq-item').first().getAttribute('data-ans')) + 1) % 4).click();
  check((await page.locator(R + '.lq-item .lq-fb').first().textContent()).startsWith('Not quite'), 'orm: wrong answer marked' + (a >= 0 ? '' : ''));
};
