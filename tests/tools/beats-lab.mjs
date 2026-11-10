// #1354 beats lab
export const path = '/learn/beats-lab/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/beats-lab/`); await page.waitForTimeout(700);
  const facts = () => page.textContent('.bt .bt-facts'), big = () => page.textContent('.bt .bt-big');
  const setR = async (sel, v) => { await page.$eval(sel, (e, v) => { e.value = v; e.dispatchEvent(new Event('input', { bubbles: true })); }, String(v)); await page.waitForTimeout(100); };
  { const f = await facts(); check((await big()) === '4 beats per second' && f.includes('0.25 s') && f.includes('258 Hz') && f.includes('silence'), 'beats-lab: 256 and 260 Hz example'); }
  check(await page.$eval('.bt .bt-c', (c) => { const x = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let n = 0; for (let i = 0; i < x.length; i += 4) if (x[i] < 100) n++; return n > 500; }), 'beats-lab: picture drawn');
  await setR('.bt .bt-a', 0.5);
  check((await facts()).includes('50 % of one tone'), 'beats-lab: quieter second tone: never silent');
  await setR('.bt .bt-f2', 256);
  check((await big()).startsWith('No beats'), 'beats-lab: same tones: no beats');
  await setR('.bt .bt-f2', 266.5);
  check((await big()) === '10.5 beats per second', 'beats-lab: 10.5 beats');
  await page.click('.bt .bt-play'); await page.waitForTimeout(200);
  check((await page.textContent('.bt .bt-play')) === 'Stop the sound', 'beats-lab: play');
  await page.click('.bt .bt-play');
  check((await page.textContent('.bt .bt-play')) === 'Play the sound', 'beats-lab: stop');
  // fork puzzle
  await page.click('.bt .bt-mode [data-v="fork"]'); await page.waitForTimeout(100);
  const t = await page.textContent('.bt .bt-forktext'), m = t.match(/A (\d+) Hz fork .* give (\d+) beats/);
  check(!!m && (await page.isVisible('.bt .bt-wax')), 'beats-lab: fork puzzle shown');
  await page.click('.bt .bt-wax'); await page.waitForTimeout(100);
  const after = Number((await page.textContent('.bt .bt-forktext')).match(/give (\d+) beats/)[1]);
  const f0 = Number(m[1]), b = Number(m[2]), ans = after < b ? f0 + b : f0 - b;
  await page.fill('.bt .bt-guess', String(2 * f0 - ans)); await page.click('.bt .bt-check');
  check((await page.textContent('.bt .bt-forkres')).includes('not the wax test'), 'beats-lab: the other candidate is caught');
  await page.fill('.bt .bt-guess', String(ans)); await page.click('.bt .bt-check');
  check((await page.textContent('.bt .bt-forkres')).startsWith('Right!'), `beats-lab: wax reasoning gives ${ans} Hz`);
  const qa = await page.$eval('.bt .sq-q', (e) => e.dataset.ans);
  await page.fill('.bt .sq-q .sq-in', qa); await page.click('.bt .sq-q .sq-check');
  check((await page.textContent('.bt .sq-q .sq-res')) === 'Right!' && (await page.$$('.bt .sq-q')).length === 4, 'beats-lab: quiz');
};
