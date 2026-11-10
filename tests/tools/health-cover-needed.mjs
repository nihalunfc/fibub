// #T880 How much health insurance cover do I need?
export const path = '/money/health-cover-needed/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/money/health-cover-needed/`); await page.waitForTimeout(300);
  const set = async (k, v) => { await page.fill(`.hcn [data-k="${k}"]`, v); await page.waitForTimeout(80); };
  const txt = async (c) => page.textContent(`.hcn ${c}`);
  await page.selectOption('.hcn [data-k="cur"]', 'INR');
  await set('stay', '500000'); await set('g', '0'); await set('years', '0'); await set('own', '300000'); await set('emp', '0');
  check((await txt('.hcn-s-gap')).includes('2,00,000'), 'health-cover-needed: gap 2,00,000 (' + (await txt('.hcn-s-gap')) + ')');
  await set('g', '10'); await set('years', '2');
  check((await txt('.hcn-s-fut')).includes('6,05,000'), 'health-cover-needed: need 6,05,000 after 2 years at 10% (' + (await txt('.hcn-s-fut')) + ')');
  await set('emp', '200000');
  check((await txt('.hcn-s-gap')).includes('None') && (await txt('.hcn-s-end')).includes('2,00,000'), 'health-cover-needed: employer cover closes the gap now, ends leaves 2,00,000 (' + (await txt('.hcn-s-end')) + ')');
  await page.selectOption('.hcn [data-k="stays"]', '2'); await page.waitForTimeout(80);
  check((await txt('.hcn-s-now')).includes('10,00,000'), 'health-cover-needed: two stays double the need');
  check((await page.$$('.hcn .hcn-svg svg')).length === 1, 'health-cover-needed: chart drawn');
  await set('stay', '0');
  check(await page.isVisible('.hcn .hcn-err'), 'health-cover-needed: no stay cost shows a message');
};
