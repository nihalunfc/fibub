// #1221 liquid pressure with depth
export const path = '/learn/liquid-pressure/';
export default async ({ page, check, BASE }) => {
  const R = '.lqp ', t = (s) => page.textContent(R + s);
  const slide = async (sel, v) => { await page.$eval(R + sel, (e, v) => { e.value = v; e.dispatchEvent(new Event('input', { bubbles: true })); }, String(v)); await page.waitForTimeout(150); };
  const rows = () => page.$$eval(R + '.lqp-tab tbody tr', (r) => r.map((x) => [...x.children].map((c) => c.textContent)));
  await page.goto(BASE + path); await page.waitForTimeout(700);
  { const r = await rows();
    check((await t('.lqp-big')) === 'Middle hole lands furthest: 30 cm' && r[2][0] === 'Bottom hole' && r[2][2] === '2.45 kPa' && r[2][3] === '22.4 cm' && r[0][2] === '490 Pa', `liquid: full bottle on the floor (${JSON.stringify(r)})`); }
  const inked = await page.$eval(R + '.lqp-cv', (c) => { const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let n = 0; for (let i = 0; i < d.length; i += 4) if (Math.abs(d[i] - d[i + 2]) > 50) n++; return n; });
  check(inked > 300, `liquid: water and jets drawn (${inked})`);
  await slide('.lqp-s', 60);
  { const r = await rows(); check((await t('.lqp-big')) === 'Bottom hole lands furthest: 80.6 cm' && r[1][3] === '67.1 cm' && r[0][3] === '41.2 cm', 'liquid: on a 60 cm stand the bottom jet wins'); }
  await page.click(R + '[data-level="11"]'); await page.waitForTimeout(100);
  { const r = await rows(), e = await t('.lqp-eq');
    check(r[2][3] === '2.21 m/s' && e.includes('v = √(2gh) = √(2 × 9.8 × 0.250) = 2.21 m/s') && e.includes('= 2,450 Pa') && e.includes('lands v t = 2√(hy) = 80.6 cm'), `liquid: Class 11 speeds and working (${e})`); }
  await page.selectOption(R + '.lqp-liq', 'mercury'); await page.waitForTimeout(100);
  { const r = await rows(); check(r[2][2] === '33.32 kPa' && r[2][3] === '2.21 m/s', 'liquid: mercury 13.6× the pressure, same speed'); }
  await page.selectOption(R + '.lqp-liq', 'water'); await slide('.lqp-l', 10);
  { const r = await rows(); check(r[0][1] === 'above water' && r[1][4] === 'no jet' && r[2][1] === '5 cm', 'liquid: level 10 cm, only the bottom hole flows'); }
  // drag the surface up to the top
  { const b = await page.$eval(R + '.lqp-cv', (c) => { c.scrollIntoView({ block: 'center' }); const r = c.getBoundingClientRect(); return { x: r.left + 25, y: r.top + 5 }; });
    await page.mouse.move(b.x, b.y + 200); await page.mouse.down(); await page.mouse.move(b.x, b.y, { steps: 5 }); await page.mouse.up(); await page.waitForTimeout(150);
    check((await t('.lqp-lv')) === '30 cm', `liquid: dragging the surface fills it (${await t('.lqp-lv')})`); }
  // drain
  const playing = (await t('.lqp-play')) === 'Pause';
  if (!playing) await page.click(R + '.lqp-play');
  await page.uncheck(R + '.lqp-top'); await page.waitForTimeout(1500);
  const lv = parseFloat(await t('.lqp-lv'));
  check(lv < 30 && lv > 5, `liquid: draining lowers the level (${lv} cm)`);
  await page.click(R + '.lqp-play'); await page.check(R + '.lqp-top'); await page.click(R + '.lqp-fill'); await page.waitForTimeout(100);
  check((await t('.lqp-lv')) === '30 cm', 'liquid: fill to the top');
  await page.click(R + '.lq-new'); await page.waitForTimeout(100);
  check((await page.$$(R + '.lq-item')).length === 5, 'liquid: 5 Class 11 questions');
  const ans = await page.$eval(R + '.lq-item', (e) => e.dataset.ans);
  await page.fill(R + '.lq-item .lq-in', ans); await page.click(R + '.lq-item .lq-check');
  check((await t('.lq-item .lq-fb')) === 'Right.', 'liquid: quiz');
  await page.click(R + '[data-level="8"]'); await page.waitForTimeout(100);
};
