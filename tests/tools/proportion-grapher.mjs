// #1243 Direct and inverse proportion grapher
export const path = '/learn/proportion-grapher/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/proportion-grapher/`); await page.waitForSelector('.pg .pg-fig .pg-h');
  const R = '.pg ', txt = (s) => page.textContent(R + s);
  check((await txt('.pg-big')) === '6 pencils → ₹30' && (await txt('.pg-f')).includes('= 5 × 6 = 30'), 'pg: 6 pencils at ₹5 = ₹30');
  check((await page.$$eval(R + '.pg-tab td.pg-same', (e) => e.map((x) => x.textContent).join())) === '5,5,5,5,5', 'pg: y ÷ x stays 5');
  // Drag the dot to x = 10 (graph runs 0..12 from 48 to 326).
  const el = await page.$(R + '.pg-fig'); await el.scrollIntoViewIfNeeded(); const box = await el.boundingBox(), k = box.width / 340;
  const gx = 48 + (10 / 12) * 278;
  await page.mouse.move(box.x + gx * k, box.y + 100 * k); await page.mouse.down();
  await page.mouse.move(box.x + gx * k + 1, box.y + 100 * k); await page.mouse.up(); await page.waitForTimeout(80);
  check((await txt('.pg-big')) === '10 pencils → ₹50', 'pg: drag to 10 pencils');
  await page.fill(R + '.pg-k', '7'); await page.waitForTimeout(80);
  check((await txt('.pg-big')) === '10 pencils → ₹70', 'pg: k = 7');
  await page.fill(R + '.pg-k', '-2'); await page.waitForTimeout(80);
  check(await page.isVisible(R + '.pg-err'), 'pg: negative k message');
  await page.click(R + '.pg-sc button[data-s="workers"]'); await page.waitForTimeout(80);
  check(await page.isHidden(R + '.pg-err') && (await txt('.pg-big')) === '4 workers → 6 days' && (await txt('.pg-f')).includes('24 ÷ 4 = 6'), 'pg: workers 24 ÷ 4 = 6 days');
  check((await page.$$eval(R + '.pg-tab td.pg-same', (e) => e.map((x) => x.textContent).join())) === '24,24,24,24,24' && (await txt('.pg-rule')).includes('x × y is 24'), 'pg: x × y stays 24');
  await page.click(R + '.pg-sc button[data-s="speed"]'); await page.waitForTimeout(80);
  check((await txt('.pg-big')) === '40 km/h → 3 h', 'pg: 120 km at 40 km/h = 3 h');
  await page.click(R + '.pg-sc button[data-s="trip"]'); await page.waitForTimeout(80);
  check((await txt('.pg-big')) === '2 h → 120 km' && (await txt('.pg-f')).includes('straight line through 0'), 'pg: 2 h at 60 km/h = 120 km');
  // Quiz.
  check((await page.$$(R + '.sm-q')).length === 4, 'pg: four questions');
  const get = [/= ₹(\d+)\.$/, /= ([\d.]+) days\.$/, /= ([\d.]+) hours\.$/, null];
  for (let i = 1; i <= 4; i++) {
    await page.click(`${R}.sm-q:nth-child(${i}) .sm-qshow`);
    const w = await txt(`.sm-q:nth-child(${i}) .sm-qwork`);
    const a = i === 4 ? (w.includes('so direct') ? '1' : w.includes('so inverse') ? '2' : '3') : (get[i - 1].exec(w) || [0, 'x'])[1];
    await page.fill(`${R}.sm-q:nth-child(${i}) .sm-qin`, a); await page.click(`${R}.sm-q:nth-child(${i}) .sm-qcheck`);
    check((await txt(`.sm-q:nth-child(${i}) .sm-qres`)) === 'Right!', `pg: quiz question ${i} (${w})`);
  }
};
