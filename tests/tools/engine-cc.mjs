// #T900 Engine CC
export const path = '/vehicles/engine-cc/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/vehicles/engine-cc/`); await page.waitForTimeout(300);
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
  // New options in More options
  await page.evaluate(() => document.querySelectorAll('.tool-ui details').forEach((d) => (d.open = true)));
  await page.selectOption('.ec [data-k="unit"]', 'mm'); await set('bore', '57'); await set('stroke', '58.6'); await set('cyl', '1'); await set('ch', '');
  const o = (k) => page.textContent(`.ec [data-o="${k}"]`);
  await set('ob', '1');
  // 58 x 58.6: 154.8 cc, +5.3 cc, +3.5%
  check((await o('what')).startsWith('154.8 cc (+5.3 cc, +3.5%)'), `engine-cc: 1 mm overbore (${await o('what')})`);
  await set('os', '2');
  check((await o('what')).startsWith('160.1 cc'), `engine-cc: overbore and stroker (${await o('what')})`);
  await set('tcc', '650');
  check((await o('find')).includes('stroke of 254.7 mm') && (await o('find')).includes('bore of 118.8 mm'), `engine-cc: find stroke and bore for 650 cc (${await o('find')})`);
  await set('rpm', '8000');
  // 2 x 58.6 x 8000 / 60000 = 15.6 m/s
  check((await o('mps')).includes('15.6 m/s'), `engine-cc: mean piston speed (${await o('mps')})`);
  await set('pw', '12');
  // 12 kW / 0.14953 L = 80.2 kW/L = 107.6 hp/L
  check((await o('spec')).includes('80.2 kW/L') && (await o('spec')).includes('107.6 hp/L'), `engine-cc: power per litre (${await o('spec')})`);
  await page.selectOption('.tool-ui [data-k="cvu"]', 'l'); await set('cvv', '1.6');
  check((await o('conv')).includes('1,600.0 cc') && (await o('conv')).includes('97.6 cu in'), `engine-cc: 1.6 L converter (${await o('conv')})`);
  await page.selectOption('.ec [data-k="cvu"]', 'cuin'); await set('cvv', '100');
  // 100 cu in = 1,638.7 cc
  check((await o('conv')).includes('1,638.7 cc'), `engine-cc: 100 cu in (${await o('conv')})`);
  await set('bore', '0');
  check(!(await page.textContent('.ec')).includes('NaN') && (await page.textContent('.ec .ec-warn')).length > 5, 'engine-cc: zero bore, friendly message');
};
