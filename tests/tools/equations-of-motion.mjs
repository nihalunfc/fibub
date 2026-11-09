// #1022 equations of motion from the v-t graph
export const path = '/learn/equations-of-motion/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/equations-of-motion/`); await page.waitForTimeout(700);
  const facts = () => page.textContent('.em .em-facts'), eq = () => page.textContent('.em .em-eq');
  const setR = async (sel, v) => { await page.$eval(sel, (e, v) => { e.value = v; e.dispatchEvent(new Event('input', { bubbles: true })); }, String(v)); await page.waitForTimeout(120); };
  { const f = await facts(), e = await eq(); check(f.includes('Final velocity v8 m/s') && f.includes('Displacement s20 m') && e.includes('8 = 2 + 1.5 × 4') && e.includes('20 = 2 × 4 + ½ × 1.5 × 4² = 8 + 12') && e.includes('64 = 4 + 2 × 1.5 × 20 = 64 ✓'), 'equations-of-motion: example u 2, a 1.5, t 4 → v 8, s 20'); }
  check((await page.textContent('.em .em-leg')).includes('u × t = 2 × 4 = 8 m') && (await page.textContent('.em .em-leg')).includes('= 12 m'), 'equations-of-motion: rectangle and triangle areas');
  check(await page.$eval('.em .em-g', (c) => { const x = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let n = 0; for (let i = 0; i < x.length; i += 4) if (x[i] < 100) n++; return n > 500; }), 'equations-of-motion: graph drawn');
  // drag the right handle: to t = 6 s, v = 14 m/s → a = 2
  { const b = await page.$eval('.em .em-g', (c) => { c.scrollIntoView({ block: 'center' }); const r = c.getBoundingClientRect(); return { x: r.left, y: r.top, w: r.width }; });
    const X = (t) => b.x + 44 + (t / 12) * (b.w - 56), Y = (v) => b.y + 250 - ((v + 10) / 30) * 240;
    await page.mouse.move(X(4), Y(8)); await page.mouse.down(); await page.mouse.move(X(5), Y(11), { steps: 4 }); await page.mouse.move(X(6), Y(14), { steps: 4 }); await page.mouse.up(); await page.waitForTimeout(150);
    check(await page.inputValue('.em .em-t') === '6' && await page.inputValue('.em .em-a') === '2' && (await facts()).includes('Final velocity v14 m/s'), 'equations-of-motion: drag the end handle to t 6 s, v 14 m/s');
    await page.mouse.move(X(0), Y(2)); await page.mouse.down(); await page.mouse.move(X(0), Y(5), { steps: 4 }); await page.mouse.up(); await page.waitForTimeout(150);
    check(await page.inputValue('.em .em-u') === '5', 'equations-of-motion: drag the start handle to u 5 m/s'); }
  await setR('.em .em-u', 6); await setR('.em .em-a', -1); await setR('.em .em-t', 12);
  { const f = await facts(); check(f.includes('Final velocity v−6 m/s') && f.includes('Displacement s0 m') && f.includes('Distance travelled36 m') && f.includes('turned round'), 'equations-of-motion: turning round: s 0, distance 36 m'); }
  await page.click('.em .em-level [data-l="11"]'); await page.waitForTimeout(150);
  check((await eq()).includes('With calculus') && (await eq()).includes('v dv/dx'), 'equations-of-motion: Class 11 derivation');
  await page.click('.em .em-level [data-l="9"]'); await page.waitForTimeout(100);
  check((await eq()).includes('the slope of the v-t line is the acceleration'), 'equations-of-motion: Class 9 derivation');
  await setR('.em .em-u', 2); await setR('.em .em-a', 1.5); await setR('.em .em-t', 4);
  await page.click('.em .em-play'); await page.waitForTimeout(400);
  check((await page.textContent('.em .em-play')) === 'Pause', 'equations-of-motion: play');
  await page.waitForTimeout(5200);
  check((await page.textContent('.em .em-play')) === 'Play', 'equations-of-motion: play ends');
  // solve
  await page.click('.em .em-mode [data-m="solve"]'); await page.waitForTimeout(150);
  { const s = await page.textContent('.em .em-sol'); check(s.includes('a = 2 m/s², s = 100 m, t = 10 s'), 'equations-of-motion: solve u 0, v 20, s 100 → a 2, t 10'); }
  await page.fill('.em .em-su', '20'); await page.fill('.em .em-sv', ''); await page.fill('.em .em-sa', '-10'); await page.fill('.em .em-ss', '15'); await page.waitForTimeout(150);
  { const s = await page.textContent('.em .em-sol'); check(s.includes('Answer 1') && s.includes('t = 1 s') && s.includes('t = 3 s') && s.includes('v = −10 m/s'), 'equations-of-motion: two answers for a ball thrown up'); }
  await page.fill('.em .em-ss', '25'); await page.waitForTimeout(150);
  check((await page.textContent('.em .em-err')).includes('never gets that far') && await page.isVisible('.em .em-err'), 'equations-of-motion: too high is refused');
  await page.fill('.em .em-st', '2'); await page.waitForTimeout(150);
  check((await page.textContent('.em .em-err')).includes('exactly three'), 'equations-of-motion: four values is refused');
  await page.fill('.em .em-st', ''); await page.fill('.em .em-ss', 'abc'); await page.waitForTimeout(150);
  check((await page.textContent('.em .em-err')).includes('s is not a number'), 'equations-of-motion: bad number message');
  await page.fill('.em .em-ss', '15'); await page.waitForTimeout(100);
  // stopping distance
  await page.click('.em .em-mode [data-m="brake"]'); await page.waitForTimeout(150);
  { const f = await facts(); check(f.includes('Stopping distance31.1 m') && f.includes('Thinking distance15 m') && f.includes('Braking distance16.1 m') && f.includes('94.3 m'), 'equations-of-motion: 54 km/h dry road: 15 + 16.1 = 31.1 m, 94.3 m at 108 km/h'); }
  await page.selectOption('.em .em-road-type', '4.5'); await setR('.em .em-k', 72); await setR('.em .em-r', 1.5);
  { const f = await facts(); check(f.includes('Thinking distance30 m') && f.includes('Braking distance44.4 m') && f.includes('Stopping distance74.4 m'), 'equations-of-motion: 72 km/h wet, 1.5 s: 30 + 44.4 m'); }
  await page.click('.em .em-mode [data-m="explore"]'); await page.waitForTimeout(150);
  // quiz
  check((await page.$$('.em .sq-q')).length === 4, 'equations-of-motion: four questions');
  const ans = await page.$eval('.em .sq-q', (e) => e.dataset.ans);
  await page.fill('.em .sq-q .sq-in', 'x'); await page.click('.em .sq-q .sq-check');
  check((await page.textContent('.em .sq-q .sq-res')) === 'Type a number first.', 'equations-of-motion: quiz needs a number');
  await page.fill('.em .sq-q .sq-in', ans); await page.click('.em .sq-q .sq-check');
  check((await page.textContent('.em .sq-q .sq-res')) === 'Right!' && (await page.textContent('.em .sq-q .sq-work')).startsWith('v = u + at'), 'equations-of-motion: right answer and working');
  await page.click('.em .em-level [data-l="11"]'); await page.waitForTimeout(100);
  check((await page.textContent('.em .em-quiz')).includes('thrown straight up'), 'equations-of-motion: Class 11 questions');
};
