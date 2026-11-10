// #1736 RRSP or TFSA
export const path = '/money/rrsp-tfsa/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/money/rrsp-tfsa/`); await page.waitForTimeout(300);
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
};
