// #1023 Newton's laws sandbox
export const path = '/learn/newtons-laws/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/newtons-laws/`); await page.waitForTimeout(700);
  const facts = () => page.textContent('.nl .nl-facts'), eq = () => page.textContent('.nl .nl-eq'), pill = () => page.textContent('.nl .nl-pill');
  const setR = async (sel, v) => { await page.$eval(sel, (e, v) => { e.value = v; e.dispatchEvent(new Event('input', { bubbles: true })); }, String(v)); await page.waitForTimeout(120); };
  check((await eq()).includes('(10 − 1.96) ÷ 2 = 4.02 m/s²') && (await pill()) === 'At rest: press Push', 'newtons-laws: example a = (10 − 1.96) ÷ 2 = 4.02 m/s²');
  check(await page.$eval('.nl .nl-scene', (c) => { const x = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let n = 0; for (let i = 0; i < x.length; i += 4) if (x[i] < 100) n++; return n > 300; }), 'newtons-laws: scene drawn');
  await page.click('.nl .nl-go'); await page.waitForTimeout(800);
  check((await facts()).includes('Acceleration a4.02 m/s²') && (await facts()).includes('Push F10 N') && (await pill()).startsWith('Unbalanced force of 8.04 N'), 'newtons-laws: while pushing, a = 4.02 m/s²');
  await page.waitForTimeout(10500);
  { const f = await facts(), p = await pill(); check(f.includes('8.04 m/s when you let go') && p === 'Stopped after 41.02 m', `newtons-laws: lets go at 8.04 m/s and coasts to 41.02 m (${p})`); }
  // ice: inertia
  await page.click('.nl .nl-reset'); await page.selectOption('.nl .nl-surf', 'ice'); await page.waitForTimeout(100);
  await page.click('.nl .nl-go'); await page.waitForTimeout(2600);
  { const f = await facts(); check(f.includes('Velocity v10 m/s') && f.includes('10 m/s when you let go') && (await pill()).includes('inertia') && f.includes('Momentum p20 kg m/s'), 'newtons-laws: on ice it keeps 10 m/s after you let go (first law)'); }
  await page.click('.nl .nl-reset'); await page.selectOption('.nl .nl-surf', 'carpet'); await setR('.nl .nl-f', 5);
  check((await eq()).includes('not more than the 7.84 N friction can hold'), 'newtons-laws: 5 N on carpet is balanced by friction');
  await page.click('.nl .nl-go'); await page.waitForTimeout(500);
  check((await pill()).startsWith('Balanced forces') && (await facts()).includes('Velocity v0 m/s') && (await facts()).includes('Friction5 N'), 'newtons-laws: balanced: friction matches the push, no motion');
  await page.waitForTimeout(1800);
  // hold to push
  await page.click('.nl .nl-reset'); await setR('.nl .nl-f', 20);
  { const b = await page.$eval('.nl .nl-hold', (e) => { e.scrollIntoView({ block: 'center' }); const r = e.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; });
    await page.mouse.move(b.x, b.y); await page.mouse.down(); await page.waitForTimeout(600);
    const during = await facts(); await page.mouse.up(); await page.waitForTimeout(200);
    check(during.includes('Acceleration a7.06 m/s²') && (await facts()).includes('when you let go'), 'newtons-laws: hold to push on carpet: a = (20 − 5.88) ÷ 2 = 7.06 m/s²'); }
  await page.click('.nl .nl-reset');
  // level 11 and 8
  await page.click('.nl .nl-level [data-l="11"]'); await page.waitForTimeout(150);
  check((await eq()).includes('Free-body diagram') && (await page.textContent('.nl .nl-mu')).includes('μs = 0.4'), 'newtons-laws: Class 11 free-body and static/kinetic μ');
  check((await page.$$('.nl .sq-q')).length === 5, 'newtons-laws: Class 11 has five questions');
  await page.click('.nl .nl-level [data-l="8"]'); await page.waitForTimeout(150);
  check(!(await facts()).includes('Momentum') && (await eq()).includes('Remember'), 'newtons-laws: Class 8 leaves out momentum');
  await page.click('.nl .nl-level [data-l="9"]'); await page.waitForTimeout(100);
  // action and reaction
  await page.click('.nl .nl-mode [data-m="pair"]'); await page.waitForTimeout(150);
  { const f = await facts(); check(f.includes('Final velocity of A−1 m/s') && f.includes('Final velocity of B2 m/s') && f.includes('Total momentum0 kg m/s') && (await eq()).includes('50 × (−1) + 25 × 2'), 'newtons-laws: 50 kg and 25 kg, 100 N: −1 and 2 m/s, total momentum 0'); }
  await page.click('.nl .nl-apart'); await page.waitForTimeout(200);
  check((await pill()).startsWith('Pushing'), 'newtons-laws: pushing apart');
  await page.waitForTimeout(800);
  check((await pill()).startsWith('Rolling apart'), 'newtons-laws: rolling apart');
  await setR('.nl .nl-m2', 100);
  check((await facts()).includes('Final velocity of B0.5 m/s'), 'newtons-laws: heavier B moves slower');
  await page.click('.nl .nl-reset2');
  // catch
  await page.click('.nl .nl-mode [data-m="catch"]'); await page.waitForTimeout(150);
  { const f = await facts(); check(f.includes('Impulse (change in momentum)4 N s') && f.includes('Average force on the hands40 N'), 'newtons-laws: 160 g at 25 m/s in 0.1 s: 4 N s, 40 N'); }
  check((await page.textContent('.nl .nl-bmv')) === '160 g' && (await page.textContent('.nl .nl-bvv')) === '25 m/s (90 km/h)', 'newtons-laws: ball labels 160 g, 90 km/h');
  await setR('.nl .nl-bt', 0.4);
  check((await facts()).includes('Average force on the hands10 N') && (await facts()).includes('4 N s'), 'newtons-laws: four times the time, a quarter of the force');
  await setR('.nl .nl-bt', 0.02); await setR('.nl .nl-bm', 0.5); await setR('.nl .nl-bv', 40);
  check((await facts()).includes('1000 N') && (await pill()).startsWith('Ouch'), 'newtons-laws: hard catch warning');
  // quiz
  const ans = await page.$eval('.nl .sq-q', (e) => e.dataset.ans);
  await page.fill('.nl .sq-q .sq-in', ans); await page.press('.nl .sq-q .sq-in', 'Enter');
  check((await page.textContent('.nl .sq-q .sq-res')) === 'Right!', 'newtons-laws: quiz answer with Enter');
};
