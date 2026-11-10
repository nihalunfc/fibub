// #1297 How soap cleans
export const path = '/learn/soap-micelle/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/soap-micelle/`); await page.waitForSelector('.sm2 .sm2-head');
  const R = '.sm2 ', txt = (s) => page.textContent(R + s);
  check((await txt('.sm2-big')) === 'Clean: every oil drop is held in a micelle' && (await txt('.sm2-sub')).startsWith('11 micelles, 300 free soap'), 'soap: soft water cleans with 11 micelles');
  check((await page.$$(R + '.sm2-fig .sm2-oil')).length === 4, 'soap: four oil drops in micelles');
  await page.click(R + '.sm2-pre[data-p="300,120,4"]'); await page.waitForTimeout(80);
  check((await txt('.sm2-big')) === '3 of 4 oil drops still on the cloth' && (await txt('.sm2-sub')).includes('240 lost as scum') && (await txt('.sm2-sub')).includes('Least soap that would clean this: 356'), 'soap: hard water leaves 3 drops; needs 356');
  check((await page.$$(R + '.sm2-scum')).length === 60 && (await txt('.sm2-out')).includes('(C₁₇H₃₅COO)₂Ca'), 'soap: scum drawn and explained');
  await page.fill(R + '.sm2-s', '356'); await page.waitForTimeout(80);
  check((await txt('.sm2-big')).startsWith('Clean'), 'soap: 356 is enough');
  await page.fill(R + '.sm2-s', '355'); await page.waitForTimeout(80);
  check((await txt('.sm2-big')).includes('still on the cloth'), 'soap: 355 is not');
  await page.click(R + '.sm2-kind button[data-d="1"]'); await page.waitForTimeout(80);
  check((await txt('.sm2-big')).startsWith('Clean') && (await txt('.sm2-sub')).includes('0 lost as scum') && (await txt('.sm2-out')).includes('sulfonate') && (await txt('.sm2-mol')).includes('SO₃⁻'), 'soap: detergent makes no scum');
  await page.click(R + '.sm2-kind button[data-d="0"]'); await page.click(R + '.sm2-pre[data-p="15,0,2"]'); await page.waitForTimeout(80);
  check((await txt('.sm2-sub')).startsWith('0 micelles') && (await page.$$(R + '.sm2-fig .sm2-head')).length === 15, 'soap: too little soap stays at the surface');
  await page.fill(R + '.sm2-o', '0'); await page.waitForTimeout(80);
  check((await txt('.sm2-big')) === 'Nothing to clean', 'soap: no oil');
  await page.fill(R + '.sm2-h', '-3'); await page.waitForTimeout(80);
  check(await page.isVisible(R + '.sm2-err'), 'soap: negative rejected');
  await page.fill(R + '.sm2-h', '0'); await page.waitForTimeout(80);
  check(await page.isHidden(R + '.sm2-err'), 'soap: message clears');
  const items = page.locator('.sm2 .cq-item'); const n = await items.count(); let right = 0;
  for (let i = 0; i < n; i++) {
    const it = items.nth(i); await it.locator('.cq-show').scrollIntoViewIfNeeded(); await it.locator('.cq-show').click();
    const ans = (await it.locator('.cq-work').textContent()).match(/Answer: (.+)\.$/)[1];
    await it.locator('.cq-in').fill(ans); await it.locator('.cq-check').click();
    if ((await it.locator('.cq-res').textContent()) === 'Right!') right++;
  }
  check(n === 4 && right === n, `soap: every worked answer accepted (${right}/${n})`);
};
