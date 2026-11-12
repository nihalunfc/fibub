// #T907 Pallet planner
export const path = '/vehicles/pallet-planner/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/vehicles/pallet-planner/`); await page.waitForTimeout(300);
  const big = () => page.textContent('.pp .pp-big'), rows = () => page.textContent('.pp .pp-rows');
  const set = async (k, v) => { await page.fill(`.pp [data-k="${k}"]`, v); await page.waitForTimeout(100); };
  const sel = async (k, v) => { await page.selectOption(`.pp [data-k="${k}"]`, v); await page.waitForTimeout(100); };
  // 636 in x 100 in, 48 x 40 pallets: long side along = 13 rows x 2 = 26; across = 15 rows x 2 = 30
  check((await page.inputValue('.pp [data-k="tl"]')) === '636', 'pallet-planner: 53 ft = 636 in inside');
  await sel('pat', 'along');
  check((await big()) === '26 pallets', `pallet-planner: 26 pallets straight (${await big()})`);
  check((await rows()).includes('31,200') && !(await page.textContent('.pp .pp-warn')).includes('over the payload'), 'pallet-planner: weight 26 x 1,200 = 31,200 lb is under the payload');
  check((await page.$$('.pp .pp-fig rect')).length === 27, 'pallet-planner: drawing has the trailer and 26 pallets');
  await sel('pat', 'across');
  check((await big()) === '30 pallets', `pallet-planner: 30 pallets with the 48 in side across (${await big()})`);
  await sel('pat', 'mix');
  check((await big()) === '30 pallets', 'pallet-planner: pinwheel finds 30');
  await sel('pat', 'along'); await set('stack', '2'); await set('ph', '60');
  const w = await page.textContent('.pp .pp-warn');
  check((await big()) === '52 pallets' && w.includes('over the payload') && w.includes('taller'), `pallet-planner: stacking 2 high doubles the count and warns (${await big()})`);
  await set('stack', '1'); await set('ph', '48'); await sel('tr', 'us48');
  check((await big()) === '24 pallets', `pallet-planner: 48 ft = 12 x 2 = 24 (${await big()})`);
  await sel('unit', 'mm');
  check((await page.inputValue('.pp [data-k="pl"]')) === '1219' && (await big()) === '24 pallets', 'pallet-planner: millimetres give the same count');
  await sel('tr', 'in20'); await sel('pal', 'eur'); await sel('pat', 'across'); // 6100 x 2300 body, 1200 x 800 pallets, 800 along: 7 rows, 1 across (1200 of 2300)
  check((await big()) === '7 pallets', `pallet-planner: Indian 20 ft body with EUR pallets, long side across (${await big()})`);
};
