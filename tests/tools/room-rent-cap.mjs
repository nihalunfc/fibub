// #T828 Room rent limit and proportionate deduction (India)
export const path = '/money/room-rent-cap/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/money/room-rent-cap/`); await page.waitForTimeout(300);
  const set = async (k, v) => { await page.fill(`.rr [data-k="${k}"]`, v); };
  const txt = async (c) => page.textContent(`.rr ${c}`);
  check((await txt('.rr-s-pay')).includes('70,000'), 'room-rent-cap: insurer pays 70,000 (' + (await txt('.rr-s-pay')) + ')');
  check((await txt('.rr-s-cut')).includes('24,000'), 'room-rent-cap: cut caused by the room is 24,000');
  check((await txt('.rr-s-max')).includes('5,000'), 'room-rent-cap: highest room rent with no cut is 5,000 a day');
  await set('rent', '5,000'); await page.waitForTimeout(100);
  check((await txt('.rr-s-cut')).includes('0') && (await txt('.rr-s-pay')).includes('94,000'), 'room-rent-cap: a room within the limit has no cut');
  await set('copay', '10'); await page.waitForTimeout(100);
  check((await txt('.rr-s-pay')).includes('84,600'), 'room-rent-cap: 10% co-pay lowers the payout (' + (await txt('.rr-s-pay')) + ')');
  await page.click('.rr .rr-del >> nth=0'); await page.waitForTimeout(100);
  check((await page.$$('.rr .rr-body tr')).length === 3, 'room-rent-cap: removing a line leaves two lines and a total');
  await set('si', '0'); await page.waitForTimeout(100);
  check(await page.isVisible('.rr .rr-err'), 'room-rent-cap: no sum insured shows a message');
  await page.reload(); await page.waitForTimeout(300);
  await page.evaluate(() => document.querySelectorAll('.tool-ui details').forEach((d) => (d.open = true)));
  const lad = await page.$$eval('.rr .rr-lad tr', (r) => r.map((x) => x.textContent));
  check(lad.length >= 5 && lad[0].includes('(the limit)') && lad[0].includes('100.0%'), 'room-rent-cap: ladder starts at the limit with 100% paid (' + lad[0] + ')');
  check(lad.some((x) => x.includes('(your room)') && x.includes('62.5%')), 'room-rent-cap: 5,000 limit on an 8,000 room pays 62.5%');
};
