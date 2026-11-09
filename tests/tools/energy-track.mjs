// #1025 energy skate track
export const path = '/learn/energy-track/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/energy-track/`); await page.waitForTimeout(700);
  const facts = () => page.textContent('.et .et-facts'), eq = () => page.textContent('.et .et-eq'), pill = () => page.textContent('.et .et-pill');
  const setR = async (sel, v) => { await page.$eval(sel, (e, v) => { e.value = v; e.dispatchEvent(new Event('input', { bubbles: true })); }, String(v)); await page.waitForTimeout(120); };
  { const f = await facts(); check(f.includes('Height6 m') && f.includes('Potential energy117.6 J') && f.includes('Total117.6 J') && (await page.textContent('.et .et-v-pe')) === '118 J', 'energy-track: 2 kg at 6 m: PE 117.6 J'); }
  check(await page.$eval('.et .et-c', (c) => { const x = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let n = 0; for (let i = 0; i < x.length; i += 4) if (x[i] < 100) n++; return n > 500; }), 'energy-track: track drawn');
  await page.click('.et .et-go'); await page.waitForTimeout(900);
  { const f = await facts(), ke = parseFloat(f.split('Kinetic energy')[1]), pe = parseFloat(f.split('Potential energy')[1]);
    check(ke > 10 && Math.abs(ke + pe - 117.6) < 0.11 && f.includes('Total117.6 J') && f.includes('Heat from friction0 J'), `energy-track: rolling, KE + PE = 117.6 J (${ke} + ${pe})`); }
  let maxV = 0; for (let i = 0; i < 20; i++) { await page.waitForTimeout(100); const v = parseFloat((await facts()).split('Speed')[1]); maxV = Math.max(maxV, v); }
  check(maxV > 9 && maxV <= 10.4, `energy-track: top speed below √(2g × 5.5) = 10.4 m/s (${maxV})`);
  await page.click('.et .et-go'); await page.waitForTimeout(100);
  check((await page.textContent('.et .et-go')) === 'Play', 'energy-track: pause');
  // friction
  await page.click('.et .et-reset'); await setR('.et .et-mu', 0.2); await setR('.et .et-m', 4);
  check((await facts()).includes('Total235.2 J'), 'energy-track: mass 4 kg doubles the energy');
  await page.click('.et .et-go'); await page.waitForTimeout(9000);
  { const f = await facts(), heat = parseFloat(f.split('Heat from friction')[1]); check((await pill()).startsWith('Stopped') && heat > 100 && f.includes('Total235.2 J') && (await eq()).includes('With friction'), `energy-track: friction stops the ball, ${heat} J of heat, total still 235.2 J`); }
  // drag the first handle and tap to place the ball
  await page.click('.et .et-reset'); await setR('.et .et-mu', 0); await setR('.et .et-m', 2);
  { const b = await page.$eval('.et .et-c', (c) => { c.scrollIntoView({ block: 'center' }); const r = c.getBoundingClientRect(); return { x: r.left, y: r.top, w: r.width }; });
    const Y = (y) => b.y + 236 - (y / 8) * 220;
    await page.mouse.move(b.x + 34, Y(6)); await page.mouse.down(); await page.mouse.move(b.x + 34, Y(7), { steps: 4 }); await page.mouse.up(); await page.waitForTimeout(150);
    check((await facts()).includes('Height7 m') && (await facts()).includes('Total137.2 J'), 'energy-track: drag the start handle up to 7 m');
    const X = (x) => b.x + 34 + (x / 10) * (b.w - 50);
    await page.mouse.click(X(5), Y(3) + 34); await page.waitForTimeout(150);
    check((await facts()).includes('Height3 m') && (await facts()).includes('Total58.8 J'), 'energy-track: tap the track to put the ball on the middle hump'); }
  await page.click('.et .et-level [data-l="11"]'); await page.waitForTimeout(100);
  check((await eq()).includes('Work-energy theorem'), 'energy-track: Class 11 work-energy theorem');
  // loop
  await page.click('.et .et-mode [data-m="loop"]'); await page.waitForTimeout(150);
  { const f = await facts(); check((await pill()) === 'Makes it round the loop' && f.includes('Speed at the bottom10.84 m/s') && f.includes('Lowest start that works5 m') && f.includes('Speed at the top6.26 m/s') && f.includes('4.43 m/s'), 'energy-track: loop r 2 from 6 m makes it round'); }
  await setR('.et .et-h', 4);
  check((await pill()) === 'Falls off the loop 3.3 m up' && (await facts()).includes('131.8°') && (await eq()).includes('cos θ = −2(h − r) ÷ 3r = −0.667'), 'energy-track: from 4 m it falls off at 131.8°');
  await page.click('.et .et-go'); await page.waitForTimeout(6500);
  check((await page.textContent('.et .et-go')) === 'Play', 'energy-track: loop run ends');
  await setR('.et .et-h', 1.5);
  check((await pill()).startsWith('Rolls back'), 'energy-track: too low rolls back');
  await page.click('.et .et-mode [data-m="track"]'); await page.waitForTimeout(100);
  check((await page.$$('.et .sq-q')).length === 4 && (await page.textContent('.et .et-quiz')).includes('loop of radius'), 'energy-track: Class 11 questions');
  const ans = await page.$eval('.et .sq-q', (e) => e.dataset.ans);
  await page.fill('.et .sq-q .sq-in', ans); await page.click('.et .sq-q .sq-check');
  check((await page.textContent('.et .sq-q .sq-res')) === 'Right!', 'energy-track: quiz');
};
