// #1737 FHSA
export const path = '/money/fhsa-calculator/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/money/fhsa-calculator/`); await page.evaluate(() => document.querySelectorAll('.tool-ui details').forEach((d) => (d.open = true))); /* OPEN-DETAILS */ const __op = () => page.evaluate(() => document.querySelectorAll('.tool-ui details').forEach((d) => (d.open = true))); for (const m of ['fill', 'selectOption', 'check', 'uncheck', 'click']) { const o = page[m].bind(page); page[m] = async (...a) => { await __op(); return o(...a); }; } /* WRAP-OPEN */  await page.waitForTimeout(300);
  const set = async (k, v) => { await page.fill(`.fh [data-k="${k}"]`, v); await page.waitForTimeout(80); };
  const t = async (c) => (await page.textContent(`.fh ${c}`)).trim();
  await set('per', '8000'); await set('years', '5'); await set('rate', '5'); await set('tax', '30');
  check((await t('.fh-s-bal')).includes('46,415'), 'fhsa: 8,000/yr 5 yr at 5% = 46,415');
  check((await t('.fh-s-ref')).includes('12,000'), 'fhsa: 30% refund on 40,000 = 12,000');
  check((await t('.fh-hbp')).includes('3,094'), 'fhsa: HBP repays 3,094 a year');
  await set('per', '10000'); await set('years', '6');
  check((await t('.fh-s-put')).includes('40,000') && await page.isVisible('.fh .fh-cap'), 'fhsa: 10,000/yr held to 8,000 and 40,000 lifetime');
  await set('carry', '8000'); await set('per', '16000'); await set('years', '1');
  check((await t('.fh-s-put')).includes('16,000'), 'fhsa: carry-forward allows 16,000 in one year');
  await set('per', '20000');
  check((await t('.fh-s-put')).includes('16,000'), 'fhsa: no more than 8,000 plus 8,000 carried');
  await set('years', '16');
  check(await page.isVisible('.fh .fh-err'), 'fhsa: more than 15 years shows a message');
  // new options
  await set('years', '5'); await set('carry', '0'); await set('per', '3000');
  await page.click('.fh .fh-more summary');
  await set('goal', '30000');
  check((await t('.fh-goal')).includes('5,171'), 'fhsa: goal 30,000 needs about 5,171 a year');
  await set('goal', '60000');
  check((await t('.fh-goal')).includes('even the most'), 'fhsa: goal above the limits says so');
  await page.click('.fh [data-k="max"]'); await page.waitForTimeout(100);
  check((await page.inputValue('.fh [data-k="per"]')) === '8,000' && (await t('.fh-s-bal')).includes('46,415'), 'fhsa: use-the-most button');
  await set('goal', '30000');
  check((await t('.fh-goal')).includes('year 4 of 5'), 'fhsa: goal reached in year 4');
  await page.check('.fh [data-k="reinvest"]'); await set('infl', '2');
  check((await t('.fh-real')).includes('13,262') && (await t('.fh-real')).includes("today's money"), 'fhsa: invested refunds and today\'s money shown');
  await set('goal', '-5'); await set('per', '-1');
  check(await page.isVisible('.fh .fh-err') && !(await t('.fh-err')).includes('NaN'), 'fhsa: negative amount shows a message');
};
