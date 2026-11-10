// #1489 Sex determination
export const path = '/learn/sex-determination/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/sex-determination/`); await page.waitForTimeout(300);
  check((await page.textContent('.sd .sd-cross')).includes('2 XX (girls) : 2 XY (boys)'), 'sex-determination: the cross gives 2 XX : 2 XY');
  const cells = await page.$$eval('.sd .sd-c', (e) => e.map((x) => x.textContent));
  check(cells.filter((c) => c === 'XX').length === 2 && cells.filter((c) => c === 'XY').length === 2, 'sex-determination: Punnett square has 2 XX and 2 XY');
  await page.click('.sd .sd-go');
  const sh = Number(await page.getAttribute('.sd .sd-out', 'data-share')), n = Number(await page.getAttribute('.sd .sd-out', 'data-births'));
  check(n === 10000 && Math.abs(sh - 0.5) < 0.01, `sex-determination: 10 000 births, girls ${(sh * 100).toFixed(2)} % within 1 % of half`);
  await page.fill('.sd .sd-n', '10'); await page.click('.sd .sd-go');
  check(Number(await page.getAttribute('.sd .sd-out', 'data-births')) === 10, 'sex-determination: births slider sets the number simulated');
  { const it = (await page.$$('.sd .lq-item'))[0];
    const a = await it.getAttribute('data-ans'); const ch = await it.$$('.lq-choice');
    if (ch.length) await ch[Number(a)].click(); else { await (await it.$('.lq-in')).fill(a); await (await it.$('.lq-check')).click(); }
    check((await (await it.$('.lq-fb')).textContent()) === 'Right.', 'sex-determination: quiz accepts the right answer'); }
};
