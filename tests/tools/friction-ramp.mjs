// #1024 force and friction ramp
export const path = '/learn/friction-ramp/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/friction-ramp/`); await page.waitForTimeout(700);
  const facts = () => page.textContent('.fr .fr-facts'), eq = () => page.textContent('.fr .fr-eq'), pill = () => page.textContent('.fr .fr-pill');
  const setR = async (sel, v) => { await page.$eval(sel, (e, v) => { e.value = v; e.dispatchEvent(new Event('input', { bubbles: true })); }, String(v)); await page.waitForTimeout(120); };
  { const f = await facts(); check((await pill()) === 'Stays still: friction holds it' && f.includes('Pull down the slope33.5 N') && f.includes('Friction can hold up to46 N') && f.includes('Friction now33.5 N') && f.includes('Slides on its own above26.6°'), 'friction-ramp: example 10 kg at 20° stays (33.5 N vs 46 N)'); }
  check((await eq()).includes('enough, so the forces balance'), 'friction-ramp: Class 8 explanation');
  check(await page.$eval('.fr .fr-c', (c) => { const x = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let n = 0; for (let i = 0; i < x.length; i += 4) if (x[i] < 100) n++; return n > 500; }), 'friction-ramp: picture drawn');
  await setR('.fr .fr-ang', 30);
  check((await pill()) === 'Slides down the slope' && (await facts()).includes('Push to start it up the slope91.4 N'), 'friction-ramp: 30° slides down; 91.4 N starts it up');
  await page.click('.fr .fr-level [data-l="11"]'); await page.waitForTimeout(150);
  { const f = await facts(); check((await pill()) === 'Slides down the slope at 2.35 m/s²' && f.includes('Normal force N84.9 N') && f.includes('Acceleration−2.35 m/s²') && (await eq()).includes('μk N = 0.3 × 84.87 = 25.46 N'), 'friction-ramp: Class 11: a = −2.35 m/s², N 84.9 N'); }
  await page.click('.fr .fr-go'); await page.waitForTimeout(2500);
  check((await pill()).startsWith('Reached the bottom after 1.3 s (2 m)'), `friction-ramp: let go slides 2 m in √(4/2.354) = 1.3 s (${await pill()})`);
  await setR('.fr .fr-p', 10);
  check((await pill()) === 'Stays still: friction holds it' && (await facts()).includes('Friction now39 N'), 'friction-ramp: a 10 N push up holds it');
  await setR('.fr .fr-p', 100);
  check((await pill()).startsWith('Moves up the slope at 2.55 m/s²'), 'friction-ramp: 100 N moves it up: (100 − 49 − 25.46) ÷ 10');
  await page.click('.fr .fr-go'); await page.waitForTimeout(3300);
  check((await pill()).startsWith('Reached the top'), 'friction-ramp: slides to the top');
  await page.click('.fr .fr-reset'); await setR('.fr .fr-p', -50);
  check((await pill()).startsWith('Slides down') && (await page.textContent('.fr .fr-pv')) === '50 N down the slope', 'friction-ramp: push down the slope');
  await setR('.fr .fr-p', 0);
  await page.selectOption('.fr .fr-surf', 'ice'); await setR('.fr .fr-ang', 10);
  check((await pill()).startsWith('Slides down') && (await facts()).includes('5.7°'), 'friction-ramp: ice slides above 5.7°');
  await page.selectOption('.fr .fr-surf', 'custom'); await page.waitForTimeout(100);
  check(await page.isVisible('.fr .fr-mus'), 'friction-ramp: own μ sliders');
  await setR('.fr .fr-mus', 0.2); await setR('.fr .fr-muk', 0.6);
  check((await page.textContent('.fr .fr-mukv')) === '0.2' && (await facts()).includes('11.3°'), 'friction-ramp: μk kept no bigger than μs');
  // drag the ramp to tilt it
  { const b = await page.$eval('.fr .fr-c', (c) => { c.scrollIntoView({ block: 'center' }); const r = c.getBoundingClientRect(); return { x: r.left, y: r.top }; });
    await page.mouse.move(b.x + 230, b.y + 230); await page.mouse.down(); await page.mouse.move(b.x + 230, b.y + 230 - 200 * Math.tan(Math.PI / 4) + 0, { steps: 5 }); await page.mouse.up(); await page.waitForTimeout(150);
    check(await page.inputValue('.fr .fr-ang') === '45', `friction-ramp: drag tilts the ramp to 45° (${await page.inputValue('.fr .fr-ang')})`); }
  await page.click('.fr .fr-level [data-l="8"]'); await page.waitForTimeout(100);
  check((await page.$$('.fr .sq-q')).length === 3, 'friction-ramp: Class 8 questions');
  const ans = await page.$eval('.fr .sq-q', (e) => e.dataset.ans);
  await page.fill('.fr .sq-q .sq-in', ans); await page.click('.fr .sq-q .sq-check');
  check((await page.textContent('.fr .sq-q .sq-res')) === 'Right!', 'friction-ramp: quiz');
};
