// #1027 Kepler's laws orbit lab
export const path = '/learn/kepler-orbits/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/kepler-orbits/`); await page.waitForTimeout(700);
  const facts = () => page.textContent('.ko .ko-facts'), eq = () => page.textContent('.ko .ko-eq'), pill = () => page.textContent('.ko .ko-pill');
  const setR = async (sel, v) => { await page.$eval(sel, (e, v) => { e.value = v; e.dispatchEvent(new Event('input', { bubbles: true })); }, String(v)); await page.waitForTimeout(150); };
  { const f = await facts(); check((await pill()) === 'An ellipse (e = 0.46)' && f.includes('Period T2.526 years923 days') && f.includes('Semi-major axis a1.855 AU') && f.includes('Farthest from the star2.709 AU') && f.includes('0.7993 AU²') && f.includes('76.9 days'), 'kepler-orbits: 36 km/s: e 0.46, a 1.855 AU, T 2.526 yr, slice 0.7993 AU²'); }
  check((await eq()).includes('2.526² = 6.38 and 1.855³ = 6.38'), 'kepler-orbits: third law with the numbers');
  check(await page.$eval('.ko .ko-c', (c) => { const x = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let n = 0; for (let i = 0; i < x.length; i += 4) if (x[i] < 100) n++; return n > 300; }), 'kepler-orbits: orbit drawn');
  await setR('.ko .ko-v', 29.5);
  check((await pill()).startsWith('An ellipse (e = 0.02)') || (await pill()) === 'A circle', 'kepler-orbits: near the circular speed');
  await setR('.ko .ko-v', 25);
  { const f = await facts(); check(f.includes('Closest to the star0.544 AU') && f.includes('248 days') && f.includes('Farthest from the star1 AU'), 'kepler-orbits: 25 km/s launched at aphelion: 0.544 AU, 248 days'); }
  await setR('.ko .ko-v', 43);
  check((await pill()).startsWith('Escapes') && (await facts()).includes('Escape speed here42.1 km/s'), 'kepler-orbits: 43 km/s escapes (escape 42.1 km/s)');
  // drag the arrow tip back down to about 30 km/s
  await setR('.ko .ko-v', 36);
  { const b = await page.$eval('.ko .ko-c', (c) => { c.scrollIntoView({ block: 'center' }); const r = c.getBoundingClientRect(); const [x, y] = c.dataset.tip.split(',').map(Number); return { x: r.left + x, y: r.top + y }; });
    await page.mouse.move(b.x, b.y); await page.mouse.down(); await page.mouse.move(b.x, b.y + 13.2, { steps: 4 }); await page.mouse.up(); await page.waitForTimeout(150);
    check(await page.inputValue('.ko .ko-v') === '30', `kepler-orbits: drag the arrow tip down to 30 km/s (${await page.inputValue('.ko .ko-v')})`); }
  await page.click('.ko .ko-go'); await page.waitForTimeout(700);
  check((await page.textContent('.ko .ko-go')) === 'Pause', 'kepler-orbits: play');
  await page.click('.ko .ko-go');
  await page.click('.ko .ko-level [data-l="9"]'); await page.waitForTimeout(100);
  check(!(await facts()).includes('Each shaded slice') && (await page.$$('.ko .sq-q')).length === 3, 'kepler-orbits: Class 9 hides slice areas, 3 questions');
  await page.click('.ko .ko-level [data-l="11"]'); await page.waitForTimeout(100);
  // third law
  await page.click('.ko .ko-mode [data-m="third"]'); await page.waitForTimeout(150);
  check((await page.$$('.ko .ko-tab tbody tr')).length === 8 && (await page.textContent('.ko .ko-tab')).includes('Jupiter') && (await facts()).includes('T² ÷ a³1'), 'kepler-orbits: planet table and your orbit T²/a³ = 1');
  // g
  await page.click('.ko .ko-mode [data-m="g"]'); await page.waitForTimeout(150);
  { const f = await facts(); check((await pill()).startsWith('g = 2.45 m/s²') && f.includes('122.5 N') && f.includes('11.2 km/s') && f.includes('7.9 km/s'), 'kepler-orbits: one radius up: g 2.45, 122.5 N, escape 11.2 km/s'); }
  await setR('.ko .ko-h', -3171);
  check((await pill()).startsWith('g = 4.92 m/s²') && (await eq()).includes('Below the surface'), 'kepler-orbits: 3,171 km deep: g ≈ 4.92 m/s²');
  await setR('.ko .ko-h', -6371);
  check((await pill()).startsWith('g = 0 m/s²'), 'kepler-orbits: centre g = 0');
  const ans = await page.$eval('.ko .sq-q', (e) => e.dataset.ans);
  await page.fill('.ko .sq-q .sq-in', ans); await page.click('.ko .sq-q .sq-check');
  check((await page.textContent('.ko .sq-q .sq-res')) === 'Right!', 'kepler-orbits: quiz');
};
