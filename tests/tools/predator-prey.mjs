// #1453 predator-prey (maths checked against scipy in tests/sci-tools/predator-prey.mjs)
export const path = '/learn/predator-prey/';
export default async ({ page, check, BASE }) => {
  const R = '.ppr ';
  const t = (s) => page.textContent(R + s);
  const slide = (s, v) => page.$eval(R + s, (e, v) => { e.value = v; e.dispatchEvent(new Event('input', { bubbles: true })); }, String(v));
  await page.goto(`${BASE}/learn/predator-prey/`); await page.waitForTimeout(500);
  { const f = await t('.pp-facts'); check(f.includes('80 prey, 50 predators') && f.includes('8.34') && f.includes('275.2') && f.includes('154.7') && f.includes('7.02'), `lv: facts (${f})`); }
  check((await t('.pp-formula')).includes('dH/dt = 1H − 0.02HP'), 'lv: formula');
  await slide('.pp-t', 10); check((await t('.pp-now')).includes('155.7 prey, 10.9 predators'), `lv: time 10 (${await t('.pp-now')})`);
  const px = await page.evaluate(() => { const c = document.querySelector('.pp-ph'); const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let n = 0; for (let i = 0; i < d.length; i += 4) if (d[i] < 200 && d[i + 2] > 120) n++; return n; });
  check(px > 300, `lv: phase loop drawn (${px})`);
  await page.click(R + '.pp-play'); await page.waitForTimeout(600); check((await t('.pp-play')) === 'Pause', 'lv: playing'); await page.click(R + '.pp-play');
  await page.click(R + '.pp-lv button[data-v=k]');
  check((await t('.pp-facts')).includes('36.7 predators') && (await t('.pp-say')).includes('spiral'), `lv: prey limit (${await t('.pp-facts')})`);
  await slide('.pp-k', 100); await slide('.pp-k', 60 < 100 ? 100 : 60);
  await slide('.pp-d', 1.5);
  check((await t('.pp-say')).includes('die out'), `lv: predators die out when K < d/c (${await t('.pp-say')})`);
  check((await t('.pp-iname')).startsWith('Predation or Parasitism') && (await t('.pp-iname')).includes('swapped'), `lv: interaction − + (${await t('.pp-iname')})`);
  await page.selectOption(R + '.pp-ia', '+'); check((await t('.pp-iname')).startsWith('Mutualism'), 'lv: mutualism');
  await page.selectOption(R + '.pp-ib', '0'); check((await t('.pp-iname')).startsWith('Commensalism') && (await page.$$eval(R + '.pp-itab tr.pp-hit', (e) => e.length)) === 1, 'lv: commensalism highlighted');
  await page.selectOption(R + '.pp-ia', '0'); await page.selectOption(R + '.pp-ib', '-'); check((await t('.pp-iname')).startsWith('Amensalism'), 'lv: amensalism');
  await page.selectOption(R + '.pp-ib', '0'); check((await t('.pp-iname')).includes('neutralism'), 'lv: neutralism');
  check((await page.$$eval(R + '.smq-q', (e) => e.length)) === 5, 'lv: five quiz questions');
  const q1 = (await t('.smq-q:nth-child(1) .smq-text')).match(/\d+(?:\.\d+)?/g).map(Number);
  await page.fill(R + '.smq-q:nth-child(1) .smq-in', String(q1[1] / q1[0])); await page.click(R + '.smq-q:nth-child(1) .smq-check');
  check((await t('.smq-q:nth-child(1) .smq-out')) === 'Right!', `lv: quiz still point (${q1})`);
};
