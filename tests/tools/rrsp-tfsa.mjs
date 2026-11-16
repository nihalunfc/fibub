// #1736 RRSP or TFSA
export const path = '/money/rrsp-tfsa/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/money/rrsp-tfsa/`); await page.evaluate(() => document.querySelectorAll('.tool-ui details').forEach((d) => (d.open = true))); /* OPEN-DETAILS */ const __op = () => page.evaluate(() => document.querySelectorAll('.tool-ui details').forEach((d) => (d.open = true))); for (const m of ['fill', 'selectOption', 'check', 'uncheck', 'click']) { const o = page[m].bind(page); page[m] = async (...a) => { await __op(); return o(...a); }; } /* WRAP-OPEN */  await page.waitForTimeout(300);
  const set = async (k, v) => { await page.fill(`.rt [data-k="${k}"]`, v); await page.waitForTimeout(80); };
  const t = async (c) => (await page.textContent(`.rt ${c}`)).trim();
  await set('amt', '5000'); await set('years', '25'); await set('rate', '5'); await set('now', '30'); await set('later', '20');
  check((await t('.rt-s-tfsa')).includes('250,567'), 'rrsp-tfsa: TFSA 5,000/yr 25 yr at 5% = 250,567');
  check((await t('.rt-s-rrsp')).includes('286,363'), 'rrsp-tfsa: RRSP 30% now 20% later = 286,363');
  await set('later', '30');
  check((await t('.rt-s-rrsp')) === (await t('.rt-s-tfsa')) && (await t('.rt-verdict')).startsWith('Same'), 'rrsp-tfsa: equal tax rates give an equal outcome');
  await page.selectOption('.rt [data-k="refund"]', 'spend'); await page.waitForTimeout(80);
  check((await t('.rt-verdict')).includes('TFSA ends'), 'rrsp-tfsa: spending the refund makes the TFSA win');
  await set('born', '1995');
  check((await t('.rt-room')).includes('$89,000'), 'rrsp-tfsa: born 1995 has 89,000 TFSA room');
  await set('earn', '200000');
  check((await t('.rt-room')).includes('$33,810'), 'rrsp-tfsa: RRSP room capped at 33,810');
  await set('years', '0');
  check(await page.isVisible('.rt .rt-err'), 'rrsp-tfsa: bad years shows a message');
  // new options
  await set('years', '25'); await set('later', '20'); await page.selectOption('.rt [data-k="refund"]', 'grossup'); await page.waitForTimeout(80);
  check((await t('.rt-even')).includes('below 30%'), 'rrsp-tfsa: break-even later rate equals the rate now');
  check((await page.locator('.rt .rt-years tr').count()) === 25 && (await t('.rt-svg')).length >= 0 && await page.isVisible('.rt .rt-svg svg'), 'rrsp-tfsa: year-by-year table and chart follow the inputs');
  await page.click('.rt .rt-more summary');
  await set('infl', '2');
  check((await t('.rt-real')).includes("today's money"), 'rrsp-tfsa: inflation shows today\'s money');
  await set('incnow', '70000'); await page.waitForTimeout(100);
  check((await t('.rt-found')).includes('Marginal rate now: 29.6%'), 'rrsp-tfsa: Ontario marginal rate at 70,000 is 29.6%');
  await page.click('.rt [data-k="use-rates"]'); await page.waitForTimeout(100);
  check((await page.inputValue('.rt [data-k="now"]')) === '29.6', 'rrsp-tfsa: Use these tax rates fills the box');
  check((await t('.rt-limits')).includes('2015 $10,000') || (await page.textContent('.rt .rt-tl')).includes('2015 $10,000'), 'rrsp-tfsa: TFSA limits listed');
  await set('amt', '-5');
  check(await page.isVisible('.rt .rt-err') && !(await t('.rt-err')).includes('NaN'), 'rrsp-tfsa: negative amount shows a message');
};
