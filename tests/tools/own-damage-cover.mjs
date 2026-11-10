// #T884 Is collision / own-damage cover still worth it on an older car?
export const path = '/money/own-damage-cover/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/money/own-damage-cover/`); await page.waitForTimeout(300);
  const set = async (k, v) => { await page.fill(`.odc [data-k="${k}"]`, v); };
  const txt = async (c) => page.textContent(`.odc ${c}`);
  await page.selectOption('.odc [data-k="cur"]', 'USD');
  await set('value', '1000000000'); await set('dep', '0'); await set('ded', '0'); await set('lambda', '0.1');
  await set('median', '1000'); await set('p90', String(1000 * Math.exp(0.5 * 1.2815515655446004))); await set('prem', '100'); await set('pc', '0'); await set('years', '5');
  await page.waitForTimeout(150);
  check((await txt('.odc-s-y1')).includes('113.3'), 'own-damage-cover: expected payout 113.31 in year 1 (' + (await txt('.odc-s-y1')) + ')');
  check((await page.$$('.odc .odc-body tr')).length === 5, 'own-damage-cover: five year rows');
  check((await txt('.odc-s-first')).includes('Year 1') === false, 'own-damage-cover: payout above premium 100 in all years');
  await set('prem', '500'); await page.waitForTimeout(100);
  check((await txt('.odc-s-first')).includes('Year 1'), 'own-damage-cover: premium 500 beats payout from year 1');
  await set('value', '1000'); await set('median', '1500'); await set('p90', '4000'); await set('prem', '10'); await page.waitForTimeout(100);
  const big = parseFloat((await txt('.odc-s-y1')).replace(/[^\d.]/g, ''));
  check(big <= 0.1 * 1000 + 0.01, 'own-damage-cover: payout never above claims x car value (' + big + ')');
  check((await page.$$('.odc .odc-chart svg')).length === 1, 'own-damage-cover: chart drawn');
  await set('lambda', '0'); await page.waitForTimeout(100);
  check(await page.isVisible('.odc .odc-err'), 'own-damage-cover: no claims shows a message');
};
