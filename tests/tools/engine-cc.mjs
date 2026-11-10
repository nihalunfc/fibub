// #T901 Engine CC
export const path = '/money/engine-cc/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/money/engine-cc/`); await page.waitForTimeout(300);
  const big = () => page.textContent('.ec .ec-big'), rows = () => page.textContent('.ec .ec-rows');
  const set = async (k, v) => { await page.fill(`.ec [data-k="${k}"]`, v); await page.waitForTimeout(80); };
  check((await big()).startsWith('149.5 cc'), `engine-cc: 57 x 58.6 mm, 1 cylinder = 149.5 cc (${await big()})`);
  check((await rows()).includes('0.150 L') && (await rows()).includes('9.1 cu in'), `engine-cc: litres and cubic inches (${await rows()})`);
  await set('cyl', '2');
  check((await big()).startsWith('299.1 cc'), 'engine-cc: two cylinders double it');
  await set('cyl', '1'); await set('ch', '14.5');
  check((await rows()).includes('11.3 : 1'), `engine-cc: compression ratio (149.5 + 14.5) / 14.5 = 11.3 (${await rows()})`);
  await page.selectOption('.ec [data-k="unit"]', 'in'); await set('bore', '3.5'); await set('stroke', '3.5'); await set('cyl', '8');
  check((await rows()).includes('Bore / stroke ratio1.00') && (await rows()).includes('square'), 'engine-cc: inches, square engine');
  check((await big()).startsWith('4,414.5 cc'), `engine-cc: 3.5 x 3.5 in, 8 cylinders = 269 cu in = 4,414.5 cc (${await big()})`);
};
