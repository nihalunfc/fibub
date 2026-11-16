// #1332 projectile launcher
export const path = '/learn/projectile-launcher/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/projectile-launcher/`); await page.waitForTimeout(700);
  const facts = () => page.textContent('.pl .pl-facts'), eq = () => page.textContent('.pl .pl-eq');
  const setR = async (sel, v) => { await page.$eval(sel, (e, v) => { e.value = v; e.dispatchEvent(new Event('input', { bubbles: true })); }, String(v)); await page.waitForTimeout(120); };
  { const f = await facts(); check(f.includes('Range35.35 m') && f.includes('Highest point5.1 m') && f.includes('Time of flight2.04 s') && f.includes('Time to the top1.02 s') && f.includes('Best angle for distance45°'), 'projectile-launcher: example 20 m/s at 30°: 35.35 m, 5.1 m, 2.04 s'); }
  check((await eq()).includes('20² × sin 60° ÷ 9.8 = 35.35 m') && (await page.textContent('.pl .pl-key')).includes('60°'), 'projectile-launcher: range formula and the 60° partner');
  const ink = () => page.$eval('.pl .pl-c', (c) => { const x = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let n = 0; for (let i = 0; i < x.length; i += 4) if (Math.abs(x[i] - x[i + 2]) > 60) n++; return n; });
  check((await ink()) > 200, 'projectile-launcher: path drawn');
  await setR('.pl .pl-a', 60);
  check((await facts()).includes('Range35.35 m') && (await facts()).includes('Highest point15.31 m'), 'projectile-launcher: 60° lands at the same 35.35 m, 3 times as high');
  await setR('.pl .pl-a', 0); await setR('.pl .pl-h', 20); await setR('.pl .pl-v', 10);
  check((await facts()).includes('Range20.2 m') && (await facts()).includes('Time of flight2.02 s'), 'projectile-launcher: flat throw from 20 m: 20.2 m in 2.02 s');
  await page.click('.pl .pl-go'); await page.waitForTimeout(400);
  check(await page.isEnabled('.pl .pl-go'), 'projectile-launcher: launch animates');
  await page.waitForTimeout(2000);
  await setR('.pl .pl-h', 0); await setR('.pl .pl-v', 20); await setR('.pl .pl-a', 45);
  await page.click('.pl .pl-level [data-v="air"]'); await page.waitForTimeout(200);
  check(await page.isVisible('.pl .pl-ball'), 'projectile-launcher: ball choice with air');
  { const f = await facts(); const r = Number(f.match(/Range([\d.]+) m/)[1]); check(r < 40.82 && r > 30 && f.includes('Range with no air40.82 m'), `projectile-launcher: cricket ball with air falls short of 40.82 m (${r})`); }
  await page.selectOption('.pl .pl-ball', 'tt'); await setR('.pl .pl-v', 40); await page.waitForTimeout(200);
  { const f = await facts(); const r = Number(f.match(/Range([\d.]+) m/)[1]); check(r > 13 && r < 15, `projectile-launcher: table tennis ball at 40 m/s goes about 14 m (${r})`); }
  check((await facts()).includes('Best angle for distance29.5°'), 'projectile-launcher: best angle with drag below 45°');
  await page.click('.pl .pl-level [data-v="11"]'); await page.waitForTimeout(100);
  check(!(await page.isVisible('.pl .pl-ball')), 'projectile-launcher: no ball choice without air');
  check((await page.$$('.pl .sq-q')).length === 4, 'projectile-launcher: four questions');
  const ans = await page.$eval('.pl .sq-q', (e) => e.dataset.ans);
  await page.fill('.pl .sq-q .sq-in', ans); await page.click('.pl .sq-q .sq-check');
  check((await page.textContent('.pl .sq-q .sq-res')) === 'Right!', 'projectile-launcher: quiz');
  // Solve my numbers: typed boxes, units, presets, find the angle
  { const K = (k) => `.pl [data-k="${k}"]`;
  await page.click('.pl .pl-level [data-v="11"]'); await page.waitForTimeout(100);
  await page.click(K('preset-0')); await page.waitForTimeout(150);
  check((await page.textContent(K('answer'))) === 'Lands 35.3 m away after 2.04 s, highest point 5.1 m', 'projectile-launcher: one-line answer for 20 m/s at 30°');
  await page.fill(K('v'), '72'); await page.selectOption(K('v-unit'), { label: 'km/h' }); await page.waitForTimeout(150);
  check((await facts()).includes('Range35.35 m') && (await eq()).includes('v = 72 km/h = 20 m/s'), 'projectile-launcher: 72 km/h is 20 m/s');
  check((await page.inputValue('.pl .pl-v')) === '20', 'projectile-launcher: slider follows the typed speed');
  await page.selectOption(K('v-unit'), { label: 'm/s' }); await page.fill(K('v'), '20');
  await page.selectOption(K('a-unit'), { label: 'radians' }); await page.fill(K('a'), '0.5236'); await page.waitForTimeout(150);
  check((await facts()).includes('Range35.35 m') && (await eq()).includes('rad = 30°'), 'projectile-launcher: 0.5236 rad is 30°');
  await page.selectOption(K('a-unit'), { label: 'degrees' }); await page.fill(K('a'), '95'); await page.waitForTimeout(150);
  check((await page.textContent('.pl .pl-err')).includes('0° to 90°'), 'projectile-launcher: 95° gives a friendly message');
  await page.fill(K('a'), '30'); await page.fill(K('v'), '0'); await page.waitForTimeout(150);
  check((await page.textContent('.pl .pl-err')).includes('above zero'), 'projectile-launcher: zero speed gives a friendly message');
  await page.fill(K('v'), '');await page.waitForTimeout(100);
  check(await page.isVisible('.pl .pl-err'), 'projectile-launcher: blank speed gives a message');
  await page.click(K('preset-1')); await page.waitForTimeout(150);
  check((await facts()).includes('Range30.3 m') && (await facts()).includes('Time of flight2.02 s') && (await facts()).includes('Highest point20 m'), 'projectile-launcher: preset off a 20 m cliff');
  await page.click(K('preset-2')); await page.waitForTimeout(150);
  check((await facts()).includes('Range42.54 m') && (await eq()).includes('v = 72 km/h = 20 m/s'), 'projectile-launcher: cricket throw 72 km/h from 1.8 m');
  await page.click(K('preset-4')); await page.waitForTimeout(150);
  check((await facts()).includes('Range63.78 m') && (await facts()).includes('Highest point15.94 m'), 'projectile-launcher: longest throw 63.78 m');
  await page.evaluate(() => document.querySelectorAll('.pl details').forEach((d) => (d.open = true)));
  await page.click(K('preset-0')); await page.fill(K('target'), '30'); await page.waitForTimeout(150);
  check((await page.textContent(K('answer-angle'))).includes('23.65°') && (await page.textContent(K('answer-angle'))).includes('66.35°'), 'projectile-launcher: 30 m needs 23.65° or 66.35° at 20 m/s');
  await page.fill(K('target'), '50'); await page.waitForTimeout(150);
  check((await page.textContent(K('answer-angle'))).includes('Out of reach') && (await page.textContent(K('answer-angle'))).includes('40.82 m'), 'projectile-launcher: 50 m is out of reach at 20 m/s');
  await page.fill(K('target'), '30'); await page.waitForTimeout(100);
  await page.click('.pl .pl-fbtn button'); await page.waitForTimeout(150);
  check((await page.inputValue(K('a'))) === '23.65' && (await facts()).includes('Range30 m'), 'projectile-launcher: Try 23.65° lands at 30 m'); }
};
