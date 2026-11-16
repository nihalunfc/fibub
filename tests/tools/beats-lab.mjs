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

  // ---- Solve my numbers (beats-lab) ----
  await page.goto(`${BASE}${path}`); await page.waitForTimeout(500);
  const psAns = () => page.textContent('.ps-host .ps-ans'), psWork = () => page.textContent('.ps-host .ps-work');
  const psPre = async (n) => { await page.click(`.ps-host .ps-pre button:has-text("${n}")`); await page.waitForTimeout(80); };
  const psSet = async (id, vals) => { await page.selectOption('.ps-host [data-k="prob"]', id); for (const [k, v] of Object.entries(vals)) { const sel = await page.$eval(`.ps-host [data-k="${k}"]`, (e) => e.tagName === 'SELECT'); if (sel) await page.selectOption(`.ps-host [data-k="${k}"]`, v); else await page.fill(`.ps-host [data-k="${k}"]`, v); } await page.waitForTimeout(80); };
  { // new block: no clashes with the checks above
  await psPre("Two guitar"); check((await psAns()).includes("4 beats per second, one swell every 0.25 s. You hear a pitch of 442 Hz."), "beats-lab: example Two guitar");
  await psPre("beats faster"); check((await psAns()).includes("The unknown fork is 254 Hz."), "beats-lab: example beats faster");
  await psPre("beats slower"); check((await psAns()).includes("The unknown fork is 258 Hz."), "beats-lab: example beats slower");
  await psPre("No wax test"); check((await psAns()).includes("517 Hz or 507 Hz"), "beats-lab: example No wax test");
  await psPre("Beats in 10"); check((await psAns()).includes("40 beats in 10 s"), "beats-lab: example Beats in 10");
  await psSet("fb", {"fb-f1": "1", "fb-f2": "0.44"});
  await page.selectOption('.ps-host [data-k="fb-f1-u"]', "kHz"); await page.waitForTimeout(80);
  await page.selectOption('.ps-host [data-k="fb-f2-u"]', "kHz"); await page.waitForTimeout(80);
  check((await psAns()).includes("560 beats per second"), "beats-lab: typed numbers fb 560 beats per second");
  await psSet("fb", {"fb-f1": "440", "fb-f2": "440"}); check((await psAns()).includes("no beats"), "beats-lab: friendly message: no beats");
  await psPre("beats faster"); { const w = await psWork(); check(w.includes("Beats per second = 6 ÷ 3 = 2 Hz") && w.length > 20 && !/NaN|Infinity/.test(await page.textContent('.ps-host')), "beats-lab: working shown, no NaN"); }
  }
};
