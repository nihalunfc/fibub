// #1343 terminal velocity in oil
export const path = '/learn/stokes-terminal-velocity/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/stokes-terminal-velocity/`); await page.waitForTimeout(700);
  const facts = () => page.textContent('.sk .sk-facts'), pill = () => page.textContent('.sk .sk-pill');
  const setR = async (v) => { await page.$eval('.sk .sk-r', (e, v) => { e.value = v; e.dispatchEvent(new Event('input', { bubbles: true })); }, String(v)); await page.waitForTimeout(100); };
  { const f = await facts(); check(f.includes('1.017 cm/s') && f.includes('5.7 ms') && f.includes('0.32 mN down') && f.includes('0.0517 mN') && f.includes('0.268 mN') && (await pill()).includes('0.018'), 'stokes-terminal-velocity: steel in glycerine example'); }
  check(await page.$eval('.sk .sk-c', (c) => { const x = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let n = 0; for (let i = 0; i < x.length; i += 4) if (x[i] < 100) n++; return n > 500; }), 'stokes-terminal-velocity: picture drawn');
  await page.click('.sk .sk-drop'); await page.waitForTimeout(500);
  check(!(await page.$eval('.sk .sk-skip', (b) => b.disabled)) && !(await facts()).includes('Your stopwatch'), 'stokes-terminal-velocity: drop starts the stopwatch');
  await page.click('.sk .sk-skip'); await page.waitForTimeout(100);
  { const f = await facts(); check(f.includes('A at 9.83 s, B at 29.49 s') && f.includes('1.017 cm/s') && f.includes('1.4 Pa s'), 'stokes-terminal-velocity: timing and viscosity'); }
  await setR(2);
  check((await facts()).includes('4.069 cm/s') && !(await facts()).includes('Your stopwatch'), 'stokes-terminal-velocity: double radius: 4× speed, timing cleared');
  await setR(1);
  await page.click('.sk .sk-liq [data-v="honey"]'); await page.waitForTimeout(100);
  check((await facts()).includes('0.1389 cm/s'), 'stokes-terminal-velocity: honey');
  await page.click('.sk .sk-ball [data-v="nylon"]'); await page.waitForTimeout(100);
  check((await pill()).startsWith('Floats') && (await facts()).includes('none: it floats'), 'stokes-terminal-velocity: nylon floats in honey');
  await page.click('.sk .sk-ball [data-v="steel"]'); await page.click('.sk .sk-liq [data-v="water"]'); await page.waitForTimeout(100);
  check((await pill()).startsWith('Too fast'), 'stokes-terminal-velocity: water: Re far above 1');
  await page.click('.sk .sk-liq [data-v="mystery"]'); await page.waitForTimeout(100);
  await page.click('.sk .sk-drop'); await page.click('.sk .sk-skip'); await page.waitForTimeout(100);
  check((await facts()).includes('η = ? (find it)') && (await facts()).includes('reveal to compare'), 'stokes-terminal-velocity: mystery oil hidden');
  await page.click('.sk .sk-reveal'); await page.waitForTimeout(100);
  check(/set value [\d.]+ Pa s/.test(await facts()), 'stokes-terminal-velocity: reveal');
  const ans = await page.$eval('.sk .sq-q', (e) => e.dataset.ans);
  await page.fill('.sk .sq-q .sq-in', ans); await page.click('.sk .sq-q .sq-check');
  check((await page.textContent('.sk .sq-q .sq-res')) === 'Right!' && (await page.$$('.sk .sq-q')).length === 4, 'stokes-terminal-velocity: quiz');
};
