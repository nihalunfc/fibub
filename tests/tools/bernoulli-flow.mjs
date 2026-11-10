// #1342 Bernoulli, Venturi and Torricelli
export const path = '/learn/bernoulli-flow/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/bernoulli-flow/`); await page.waitForTimeout(700);
  const facts = () => page.textContent('.bf .bf-facts');
  const setR = async (sel, v) => { await page.$eval(sel, (e, v) => { e.value = v; e.dispatchEvent(new Event('input', { bubbles: true })); }, String(v)); await page.waitForTimeout(100); };
  { const f = await facts(); check(f.includes('8 m/s') && f.includes('30000 Pa') && f.includes('306.1 cm') && f.includes('15.71 litres/s'), 'bernoulli-flow: Venturi example'); }
  const px = () => page.$eval('.bf .bf-c', (c) => { const x = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let n = 0; for (let i = 0; i < x.length; i += 4) if (x[i] < 100) n++; return n; });
  check((await px()) > 500, 'bernoulli-flow: picture drawn');
  { const a = await page.$eval('.bf .bf-c', (c) => c.toDataURL()); await page.waitForTimeout(300); const b = await page.$eval('.bf .bf-c', (c) => c.toDataURL()); check(a !== b, 'bernoulli-flow: the dots move'); }
  await setR('.bf .bf-d2', 2.5);
  check((await facts()).includes('32 m/s') && (await facts()).includes('510 kPa'), 'bernoulli-flow: half the throat: 4× speed, ~17× drop');
  await setR('.bf .bf-d2', 15);
  check((await page.inputValue('.bf .bf-d2')) === '10', 'bernoulli-flow: throat cannot be wider than the pipe');
  await setR('.bf .bf-d2', 5);
  await page.click('.bf .bf-fluid [data-v="air"]'); await page.waitForTimeout(100);
  check((await facts()).includes('36 Pa') && (await facts()).includes('0.3673 cm'), 'bernoulli-flow: air: 36 Pa');
  await page.click('.bf .bf-mode [data-v="tank"]'); await page.waitForTimeout(150);
  { const f = await facts(); check(f.includes('3.96 m/s') && f.includes('1.2 m') && f.includes('0.311 litres/s') && f.includes('67.3 min'), 'bernoulli-flow: tank example'); }
  await setR('.bf .bf-h', 0.2);
  check((await facts()).includes('1.98 m/s'), 'bernoulli-flow: a quarter of the depth, half the speed');
  await setR('.bf .bf-y', 0);
  check((await facts()).includes('Lands this far from the tank0 m'), 'bernoulli-flow: hole at floor level');
  const ans = await page.$eval('.bf .sq-q', (e) => e.dataset.ans);
  await page.fill('.bf .sq-q .sq-in', ans); await page.click('.bf .sq-q .sq-check');
  check((await page.textContent('.bf .sq-q .sq-res')) === 'Right!' && (await page.$$('.bf .sq-q')).length === 4, 'bernoulli-flow: quiz');
};
