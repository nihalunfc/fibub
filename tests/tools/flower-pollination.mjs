// #1268 Flower parts and pollination
export const path = '/learn/flower-pollination/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/flower-pollination/`); await page.waitForSelector('.fl .fl-fig [data-part]');
  const R = '.fl ', txt = (s) => page.textContent(R + s);
  const parts = await page.$$eval(R + '.fl-fig [data-part]', (e) => [...new Set(e.map((x) => x.getAttribute('data-part')))]);
  check(parts.length === 9 && (await page.$$(R + '.fl-tab tbody tr')).length === 9, `flower: nine tappable parts (${parts.join(',')})`);
  await page.click(R + '.fl-fig .p-stigma');
  check((await txt('.fl-cap')).startsWith('Stigma (Pistil') && (await page.$$(R + '.fl-fig .on')).length === 1, 'flower: tap the stigma');
  await page.click(R + '.fl-find');
  const ask = /Tap the (.+)\./.exec(await txt('.fl-cap'))[1];
  const id = { sepal: 'sepal', petal: 'petal', anther: 'anther', filament: 'filament', stigma: 'stigma', style: 'style', ovary: 'ovary', ovule: 'ovule', receptacle: 'receptacle' }[ask];
  await page.click(`${R}.fl-fig .p-${id} >> nth=0`, { force: true });
  check((await txt('.fl-cap')).startsWith('Yes, that is the') && (await txt('.fl-score')).startsWith('1 of 1'), `flower: find the ${ask}`);
  await page.click(R + '.fl-find'); const ask2 = /Tap the (.+)\./.exec(await txt('.fl-cap'))[1];
  const wrong = ask2 === 'receptacle' ? 'sepal' : 'receptacle';
  await page.click(`${R}.fl-fig .p-${wrong} >> nth=0`, { force: true });
  check((await txt('.fl-cap')).includes('is now outlined') && (await txt('.fl-score')).startsWith('1 of 2'), 'flower: wrong part');
  await page.click(R + '.fl-mode [data-m=poll]');
  check(await page.isVisible(R + '.fl-pollui') && (await txt('.fl-step')).includes('bee') && (await page.$$(R + '.fl-fig .fl-bee')).length === 1, 'flower: cross-pollination starts with a bee');
  await page.locator(R + '.fl-t').fill('0.4');
  check((await page.$$(R + '.fl-fig .fl-tube')).length === 1 && (await txt('.fl-step')).includes('pollen tube'), 'flower: pollen tube');
  await page.locator(R + '.fl-t').fill('0.6');
  check((await page.$$(R + '.fl-fig .fl-fert')).length === 1 && (await txt('.fl-step')).startsWith('Fertilisation'), 'flower: fertilisation');
  await page.locator(R + '.fl-t').fill('1');
  check((await page.$$(R + '.fl-fig .fl-seed')).length === 2 && (await page.$$(R + '.fl-fig .fl-fade')).length >= 8 && (await txt('.fl-fig')).includes('Ovary → fruit'), 'flower: seeds and fruit');
  await page.click(R + '.fl-kind [data-k=self]');
  check((await txt('.fl-step')).includes('self-pollination') && (await page.$$(R + '.fl-fig .fl-bee')).length === 0, 'flower: self-pollination');
  await page.click(R + '.fl-level [data-level="12"]'); await page.locator(R + '.fl-t').fill('0.6');
  check((await txt('.fl-step')).startsWith('Double fertilisation') && (await txt('.fl-fig')).includes('zygote 2n') && await page.isVisible(R + '.fl-sac'), 'flower: Class 12 double fertilisation');
  const items = await page.$$(R + '.lq-item');
  for (const [i, it] of items.entries()) {
    const ans = Number(await it.getAttribute('data-ans')), ch = await it.$$('.lq-choice');
    if (ch.length) await ch[ans].click(); else { await (await it.$('.lq-in')).fill(String(ans)); await (await it.$('.lq-check')).click(); }
    check((await (await it.$('.lq-fb')).textContent()) === 'Right.', `flower: quiz ${i + 1}`);
  }
  check(items.length === 4, 'flower: four questions');
};
