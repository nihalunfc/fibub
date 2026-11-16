// #1355 resonance tube practical
export const path = '/learn/resonance-tube/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/resonance-tube/`); await page.waitForTimeout(700);
  const facts = () => page.textContent('.rt .rt-facts');
  const setL = async (v) => { await page.$eval('.rt .rt-L', (e, v) => { e.value = v; e.dispatchEvent(new Event('input', { bubbles: true })); }, String(v)); await page.waitForTimeout(80); };
  check((await facts()).includes('not recorded') && (await page.textContent('.rt .rt-eq')).startsWith('How'), 'resonance-tube: starts with no readings');
  check(await page.$eval('.rt .rt-c', (c) => { const x = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let n = 0; for (let i = 0; i < x.length; i += 4) if (x[i] < 100) n++; return n > 300; }), 'resonance-tube: picture drawn');
  await setL(15.7);
  check(Number((await facts()).match(/Loudness now(\d+) %/)[1]) >= 98 && (await facts()).includes('resonance'), 'resonance-tube: 15.7 cm is loud');
  await setL(32.6);
  check((await facts()).includes('quiet'), 'resonance-tube: halfway between is quiet');
  await setL(15.7); await page.click('.rt .rt-r1');
  await setL(49.4); await page.click('.rt .rt-up'); await page.waitForTimeout(80);
  check((await page.inputValue('.rt .rt-L')) === '49.5', 'resonance-tube: +1 mm button');
  await page.click('.rt .rt-r2'); await page.waitForTimeout(80);
  { const f = await facts(); check(f.includes('15.7 cm') && f.includes('49.5 cm') && f.includes('67.6 cm') && f.includes('346.1 m/s') && f.includes('1.2 cm'), 'resonance-tube: worked example: 346.1 m/s, e 1.2 cm'); }
  await page.selectOption('.rt .rt-f', '256'); await page.waitForTimeout(80);
  check((await facts()).includes('not recorded'), 'resonance-tube: new fork clears readings');
  await setL(32.6);
  check((await facts()).includes('%') && Number((await facts()).match(/Loudness now(\d+) %/)[1]) > 90, 'resonance-tube: 256 Hz first resonance near 32.6 cm');
  await page.click('.rt .rt-play'); await page.waitForTimeout(150);
  check((await page.textContent('.rt .rt-play')) === 'Stop the sound', 'resonance-tube: hear it');
  await page.click('.rt .rt-play');
  // drag the water level
  { const b = await page.evaluate(() => { const c = document.querySelector('.rt .rt-c'); c.scrollIntoView({ block: 'center' }); const r = c.getBoundingClientRect(); return { x: r.left, y: r.top }; });
    await page.mouse.move(b.x + 45, b.y + 140); await page.mouse.down(); await page.mouse.move(b.x + 45, b.y + 160, { steps: 3 }); await page.mouse.up(); await page.waitForTimeout(80);
    check(Math.abs(Number(await page.inputValue('.rt .rt-L')) - 50) < 1, `resonance-tube: drag sets the water level (${await page.inputValue('.rt .rt-L')} cm)`); }
  await page.click('.rt .rt-clear'); await page.waitForTimeout(80);
  check((await page.inputValue('.rt .rt-L')) === '5', 'resonance-tube: start again');
  const ans = await page.$eval('.rt .sq-q', (e) => e.dataset.ans);
  await page.fill('.rt .sq-q .sq-in', ans); await page.click('.rt .sq-q .sq-check');
  check((await page.textContent('.rt .sq-q .sq-res')) === 'Right!' && (await page.$$('.rt .sq-q')).length === 4, 'resonance-tube: quiz');

  // ---- Solve my numbers (resonance-tube) ----
  await page.goto(`${BASE}${path}`); await page.waitForTimeout(500);
  const psAns = () => page.textContent('.ps-host .ps-ans'), psWork = () => page.textContent('.ps-host .ps-work');
  const psPre = async (n) => { await page.click(`.ps-host .ps-pre button:has-text("${n}")`); await page.waitForTimeout(80); };
  const psSet = async (id, vals) => { await page.selectOption('.ps-host [data-k="prob"]', id); for (const [k, v] of Object.entries(vals)) { const sel = await page.$eval(`.ps-host [data-k="${k}"]`, (e) => e.tagName === 'SELECT'); if (sel) await page.selectOption(`.ps-host [data-k="${k}"]`, v); else await page.fill(`.ps-host [data-k="${k}"]`, v); } await page.waitForTimeout(80); };
  { // new block: no clashes with the checks above
  await psPre("Two lengths"); check((await psAns()).includes("The speed of sound is 346 m/s (wavelength 67.6 cm). The end correction is 1.2 cm."), "resonance-tube: example Two lengths");
  await psPre("One length"); check((await psAns()).includes("The speed of sound is 346 m/s."), "resonance-tube: example One length");
  await psPre("Find the fork"); check((await psAns()).includes("The frequency is 512 Hz"), "resonance-tube: example Find the fork");
  await psPre("Predict the lengths"); check((await psAns()).includes("Resonance at 15.7 cm, 49.5 cm and 83.3 cm"), "resonance-tube: example Predict the lengths");
  await psPre("Speed on a hot day"); check((await psAns()).includes("355 m/s"), "resonance-tube: example Speed on a hot day");
  await psSet("v", {"v-f": "512", "v-L1": "0.157", "v-L2": "0.495"});
  await page.selectOption('.ps-host [data-k="v-L1-u"]', "m"); await page.waitForTimeout(80);
  await page.selectOption('.ps-host [data-k="v-L2-u"]', "m"); await page.waitForTimeout(80);
  check((await psAns()).includes("346 m/s (wavelength 67.6 cm)"), "resonance-tube: typed numbers v 346 m/s (wavelength 67.6 cm)");
  await psSet("v", {"v-L1": "60", "v-L2": "50"}); check((await psAns()).includes("must be longer than the first"), "resonance-tube: friendly message: must be longer than the first");
  await psPre("Two lengths"); { const w = await psWork(); check(w.includes("e = (L₂ − 3 L₁) ÷ 2") && w.length > 20 && !/NaN|Infinity/.test(await page.textContent('.ps-host')), "resonance-tube: working shown, no NaN"); }
  }
};
