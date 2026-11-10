// #1438 Double fertilisation stepper
export const path = '/learn/double-fertilisation/';
export default async ({ page, check, BASE }) => {
  const R = '.dbf ';
  await page.goto(`${BASE}/learn/double-fertilisation/`); await page.waitForTimeout(600);
  const title = () => page.textContent(R + '.dbf-title');
  const rows = () => page.$$eval(R + '.dbf-tab tbody tr', (t) => t.map((r) => [...r.cells].map((c) => c.textContent).join('|')));
  check((await title()) === '1. Megaspore mother cell' && (await rows())[0] === 'Megaspore mother cell|1|2n|20', 'dbf: step 1');
  check(await page.isDisabled(R + '.dbf-back'), 'dbf: back disabled at start');
  await page.click(R + '.dbf-next'); await page.waitForTimeout(300);
  check((await rows())[0] === 'Megaspore|4|n|10' && (await page.textContent(R + '.dbf-eq')).includes('2n = 20 → n = 10'), 'dbf: meiosis');
  await page.selectOption(R + '.dbf-step', '6'); await page.waitForTimeout(1600);
  check((await title()).startsWith('7. Embryo sac') && (await page.textContent(R + '.dbf-facts')).includes('7') && (await page.textContent(R + '.dbf-facts')).includes('8'), 'dbf: 7 cells 8 nuclei');
  const px = await page.$eval(R + '.dbf-cv', (c) => c.toDataURL().length); check(px > 8000, 'dbf: picture drawn');
  await page.selectOption(R + '.dbf-plant', '42'); await page.selectOption(R + '.dbf-step', '9'); await page.waitForTimeout(300);
  const r = await rows();
  check(r[0] === 'Zygote (syngamy)|1|2n|42' && r[1] === 'Primary endosperm nucleus (triple fusion)|1|3n|63', `dbf: wheat fusion (${r[1]})`);
  check((await page.textContent(R + '.dbf-eq')).includes('endosperm 3n = 63'), 'dbf: fusion sum');
  check((await page.$$eval(R + '.dbf-tab tr.gone', (t) => t.length)) === 2, 'dbf: synergids and antipodals fading');
  await page.click(R + '.dbf-next'); await page.waitForTimeout(300);
  check((await title()).startsWith('11.') && await page.isDisabled(R + '.dbf-next'), 'dbf: last step');
  await page.click(R + '.dbf-back'); await page.click(R + '.dbf-replay'); await page.waitForTimeout(200);
  check((await title()).startsWith('10.'), 'dbf: back and replay');
  for (let i = 0; i < 11; i++) { await page.selectOption(R + '.dbf-step', String(i)); await page.waitForTimeout(80); }
  const items = page.locator(R + '.lq-item'); const n = await items.count(); let ok = 0;
  for (let i = 0; i < n; i++) {
    const it = items.nth(i), ans = Number(await it.getAttribute('data-ans'));
    if (await it.locator('.lq-choice').count()) await it.locator('.lq-choice').nth(ans).click();
    else { await it.locator('.lq-in').fill(String(ans)); await it.locator('.lq-check').click(); }
    if ((await it.locator('.lq-fb').textContent()) === 'Right.') ok++;
  }
  check(n === 5 && ok === 5, `dbf: quiz ${ok}/${n}`);
};
