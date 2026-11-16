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

  // ---- Solve my numbers ----
  {
    await page.goto(BASE + path); await page.waitForTimeout(500);
    const ans = () => page.textContent('.ps-host .ps-ans'), work = () => page.textContent('.ps-host .ps-work');
    const pre = async (n) => { await page.click(`.ps-host .ps-pre button:has-text("${n}")`); await page.waitForTimeout(80); };
    const set = async (id, vals) => { await page.selectOption('.ps-host [data-k="prob"]', id); for (const [k, v] of Object.entries(vals)) { if (v[0] === '#') await page.selectOption(`.ps-host [data-k="${k}"]`, v.slice(1)); else await page.fill(`.ps-host [data-k="${k}"]`, v); } await page.waitForTimeout(80); };
    const ok = async (s, m) => check((await ans()).includes(s), `${'vertical-circle'}: ${m} (${await ans()})`);
    await pre('Stone on a string'); await ok('20 m/s² towards the centre, so the force needed is 10 N', 'v²/r = 20, F = 10 N');
    await pre('Merry-go-round'); await ok('3.77 m/s', '12 rpm at 3 m: 3.77 m/s');
    await pre('Least loop speeds'); await ok('at least 2.8 m/s; at the bottom at least 6.26 m/s', '√(gr), √(5gr) for r = 0.8');
    await pre('Bucket of water'); await ok('tension at the top is 0.4 N', '2·9/0.9 − 19.6 = 0.4 N');
    await pre('Too slow'); await ok('does not reach the top', '5 m/s < √(5·9.8·1) = 7');
    await set('bot', { 'bot-m': '0.5', 'bot-v': '6', 'bot-r': '0.8' }); await ok('27.4 N', 'bottom tension 22.5 + 4.9');
    await set('top', { 'top-m': '2', 'top-v': '1', 'top-r': '0.9' }); await ok('string goes slack', 'slow at the top: slack');
    await set('ac', { 'ac-r': '0' }); await ok('must be more than 0', 'zero radius refused');
    await page.click('.ps-host .ps-pre button'); await page.waitForTimeout(80);
    check((await work()).length > 20 && !/NaN|Infinity/.test(await page.textContent('.ps-host')), `vertical-circle: working shown, no NaN`);
  }
};
