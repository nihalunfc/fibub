// #1338 circular motion and the vertical loop
export const path = '/learn/vertical-circle/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/vertical-circle/`); await page.waitForTimeout(800);
  const facts = () => page.textContent('.vc .vc-facts'), pill = () => page.textContent('.vc .vc-pill');
  const setR = async (sel, v) => { await page.$eval(sel, (e, v) => { e.value = v; e.dispatchEvent(new Event('input', { bubbles: true })); }, String(v)); await page.waitForTimeout(120); };
  { const f = await facts(); check(f.includes('Centripetal acceleration25 m/s²') && f.includes('Pull of the string12.5 N') && f.includes('Time for one turn1.257 s'), 'vertical-circle: stone 0.5 kg, 1 m, 5 m/s: 25 m/s², 12.5 N'); }
  const ink = () => page.$eval('.vc .vc-c', (c) => { const x = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let n = 0; for (let i = 0; i < x.length; i += 4) if (Math.abs(x[i] - x[i + 2]) > 60) n++; return n; });
  check((await ink()) > 100, 'vertical-circle: stone drawn');
  await page.click('.vc .vc-go'); await page.waitForTimeout(200);
  check((await pill()).startsWith('Let go'), 'vertical-circle: let go');
  await page.click('.vc .vc-reset');
  await setR('.vc .vc-u', 10);
  check((await facts()).includes('Pull of the string50 N'), 'vertical-circle: double the speed, four times the pull');
  await page.click('.vc .vc-mode [data-v="v"]'); await page.waitForTimeout(200);
  { const f = await facts(); check((await pill()) === 'It goes all the way round' && f.includes('Least speed at the bottom to loop7 m/s') && f.includes('Speed at the top4.98 m/s') && f.includes('Tension at the top7.5 N') && f.includes('Tension at the bottom36.9 N'), 'vertical-circle: 8 m/s on 1 m loops; 4.98 m/s and 7.5 N at the top'); }
  check(await page.isVisible('.vc .vc-g') && !(await page.isVisible('.vc .vc-go')), 'vertical-circle: tension graph shown, no let go');
  await setR('.vc .vc-u', 6);
  check((await pill()) === 'The string goes slack 123.9° up from the bottom', `vertical-circle: 6 m/s goes slack at acos(−16.4/29.4) = 123.9° (${await pill()})`);
  await page.waitForTimeout(1500);
  check((await ink()) > 50, 'vertical-circle: animation keeps drawing');
  await setR('.vc .vc-u', 4);
  check((await pill()).startsWith('It swings up to'), 'vertical-circle: 4 m/s only swings');
  check((await page.$$('.vc .sq-q')).length === 4, 'vertical-circle: four questions');
  const ans = await page.$eval('.vc .sq-q', (e) => e.dataset.ans);
  await page.fill('.vc .sq-q .sq-in', ans); await page.click('.vc .sq-q .sq-check');
  check((await page.textContent('.vc .sq-q .sq-res')) === 'Right!', 'vertical-circle: quiz');
};
