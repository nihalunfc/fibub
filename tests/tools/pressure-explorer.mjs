// #1219 pressure explorer
export const path = '/learn/pressure-explorer/';
export default async ({ page, check, BASE }) => {
  const R = '.pex ', t = (s) => page.textContent(R + s);
  const slide = async (sel, v) => { await page.$eval(R + sel, (e, v) => { e.value = v; e.dispatchEvent(new Event('input', { bubbles: true })); }, String(v)); await page.waitForTimeout(120); };
  await page.goto(BASE + path); await page.waitForTimeout(700);
  { const f = await t('.pex-facts');
    check(f.includes('Needle point10 GPa') && f.includes('Flat palm10 kPa') && (await t('.pex-ratio')) === 'Needle point: 1,000,000 times more pressure', `pressure: example 100 N: needle 10 GPa, palm 10 kPa, a million times (${f})`); }
  check((await t('.pex-eq')).includes('P = F ÷ A = 100 N ÷ 0.00000001 m² = 10,000,000,000 Pa'), 'pressure: equation with numbers');
  const inked = await page.$eval(R + '.pex-cv', (c) => { const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let n = 0; for (let i = 0; i < d.length; i += 4) if (d[i] < 150) n++; return n; });
  check(inked > 500, `pressure: picture drawn (${inked})`);
  await page.selectOption(R + '.pex-a', 'brick-end'); await page.selectOption(R + '.pex-b', 'brick-flat'); await slide('.pex-f', 50);
  check((await t('.pex-facts')).includes('Brick on its end10 kPa') && (await t('.pex-facts')).includes('Brick lying flat2,500 Pa') && (await t('.pex-ratio')) === 'Brick on its end: 4 times more pressure', 'pressure: bricks 50 N: 10 kPa vs 2,500 Pa');
  await page.selectOption(R + '.pex-b', 'palm'); await page.selectOption(R + '.pex-a', 'own'); await page.waitForTimeout(100);
  check(await page.isVisible(R + '.pex-own'), 'pressure: own-area slider shows');
  await slide('.pex-own', 600);
  check((await t('.pex-ownv')) === '100 cm²' && (await t('.pex-ratio')) === 'Same area, same pressure', 'pressure: own area 100 cm² equals the palm');
  await page.selectOption(R + '.pex-a', 'needle'); await slide('.pex-f', 100);
  // drag on the picture raises the force
  { const b = await page.$eval(R + '.pex-cv', (c) => { c.scrollIntoView({ block: 'center' }); const r = c.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + 200 }; });
    await page.mouse.move(b.x, b.y); await page.mouse.down(); await page.mouse.move(b.x, b.y - 60, { steps: 6 }); await page.mouse.up(); await page.waitForTimeout(150);
    const v = Number(await page.inputValue(R + '.pex-f')); check(v > 100, `pressure: dragging up presses harder (${v} N)`); }
  await page.click(R + '[data-level="11"]'); await page.waitForTimeout(100);
  await page.click(R + '.pex-src [data-s="mass"]'); await page.selectOption(R + '.pex-a', 'brick-end'); await page.selectOption(R + '.pex-b', 'brick-flat'); await slide('.pex-m', 2);
  { const f = await t('.pex-facts'), e = await t('.pex-eq');
    check(f.includes('Brick on its end3,920 Pa') && f.includes('Brick lying flat980 Pa') && f.includes('Thrust (the weight)19.6 N') && e.includes('Thrust = mg = 2 × 9.8 = 19.6 N') && e.includes('= 3.92 × 10³ Pa'), `pressure: Class 11 2 kg brick 3,920 vs 980 Pa (${f} | ${e})`); }
  check(await page.isHidden(R + '.pex-f'), 'pressure: force slider hidden in mass mode');
  await page.click(R + '.lq-new'); await page.waitForTimeout(100);
  check((await page.$$(R + '.lq-item')).length === 5, 'pressure: 5 Class 11 questions');
  const ans = await page.$eval(R + '.lq-item', (e) => e.dataset.ans);
  await page.fill(R + '.lq-item .lq-in', ans); await page.click(R + '.lq-item .lq-check');
  check((await t('.lq-item .lq-fb')) === 'Right.', 'pressure: quiz answer checked');
  await page.click(R + '[data-level="8"]'); await page.waitForTimeout(100);
  await page.click(R + '.lq-new'); await page.waitForTimeout(100);
  check((await page.$$(R + '.lq-item')).length === 4, 'pressure: 4 Class 8 questions');
};
