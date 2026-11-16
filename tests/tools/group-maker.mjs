// #T928 Group maker
export const path = '/everyday/group-maker/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/everyday/group-maker/`); await page.waitForTimeout(300);
  const R = '.gm ';
  const sizes = () => page.$$eval(R + '.gm-group ul', (u) => u.map((x) => x.children.length).join(','));
  check((await sizes()) === '4,3,3', `group-maker: 10 names into 3 groups -> 4,3,3 (${await sizes()})`);
  const all = (await page.$$eval(R + '.gm-group li', (l) => l.map((x) => x.textContent))).sort().join(',');
  check(all === 'Aisha,Ben,Chen,Divya,Ethan,Fatima,George,Hana,Isaac,Jaya', 'group-maker: every name in exactly one group');
  await page.selectOption(R + '[data-k="by"]', 'size'); await page.fill(R + '[data-k="n"]', '4'); await page.waitForTimeout(100);
  check((await sizes()) === '4,3,3', `group-maker: size 4 -> 3 groups of 4,3,3 (${await sizes()})`);
  await page.click(R + '.gm-tabs [data-m="pick"]');
  const seen = [];
  for (let i = 0; i < 10; i++) { await page.click(R + '.gm-pick'); seen.push(await page.textContent(R + '.gm-big')); }
  await page.click(R + '.gm-pick');
  check(new Set(seen).size === 10 && (await page.textContent(R + '.gm-say2')).includes('Everyone has been picked'), `group-maker: picker never repeats with remove ticked (${seen.join(',')})`);
  check(!(await page.isChecked(R + '[data-k="keep"]')) && (await page.evaluate(() => localStorage.getItem('fibub-group-maker-v1'))) === null, 'group-maker: nothing saved until Remember is ticked');
  // keep apart / together
  await page.click(R + '.gm-tabs [data-m="groups"]'); await page.waitForTimeout(100);
  await page.evaluate(() => document.querySelectorAll('.tool-ui details').forEach((d) => (d.open = true)));
  await page.fill(R + '.gm-apart', 'Aisha + Ben\nChen + Divya'); await page.fill(R + '.gm-tog', 'Ethan + Fatima');
  let okRules = true;
  for (let i = 0; i < 8; i++) {
    await page.click(R + '.gm-make');
    const gs = await page.$$eval(R + '.gm-group', (els) => els.map((e) => [...e.querySelectorAll('li')].map((l) => l.textContent)));
    const g = (n) => gs.findIndex((x) => x.includes(n));
    if (g('Aisha') === g('Ben') || g('Chen') === g('Divya') || g('Ethan') !== g('Fatima')) okRules = false;
  }
  check(okRules, 'group-maker: keep-apart and keep-together rules hold over 8 shuffles');
};
