// #1028 banked road and friction
export const path = '/learn/banked-curve/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/banked-curve/`); await page.waitForTimeout(700);
  const facts = () => page.textContent('.bc .bc-facts'), eq = () => page.textContent('.bc .bc-eq'), pill = () => page.textContent('.bc .bc-pill');
  const setR = async (sel, v) => { await page.$eval(sel, (e, v) => { e.value = v; e.dispatchEvent(new Event('input', { bubbles: true })); }, String(v)); await page.waitForTimeout(120); };
  { const f = await facts(); check((await pill()) === 'Safe: the tyres grip' && f.includes('4 m/s²') && f.includes('0.41 × g') && f.includes('58 km/h') && f.includes('0 km/h to 123 km/h') && f.includes('μ = 0.126') && f.includes('down the slope'), 'banked-curve: 72 km/h, 100 m, 15°, dry: safe, μ needed 0.126, 0 to 123 km/h'); }
  check((await eq()).includes('N = g cos θ + (v²/r) sin θ = 10.501 N/kg') && (await eq()).includes('= 1.327 N/kg'), 'banked-curve: forces per kg with the numbers');
  check(await page.$eval('.bc .bc-c', (c) => { const x = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let n = 0; for (let i = 0; i < x.length; i += 4) if (x[i] < 100) n++; return n > 500; }), 'banked-curve: picture drawn');
  await page.selectOption('.bc .bc-surf', '0.1'); await page.waitForTimeout(120);
  check((await pill()).startsWith('Too fast') && (await facts()).includes('46 km/h to 69 km/h'), 'banked-curve: icy road: 46 to 69 km/h, 72 km/h skids out');
  await setR('.bc .bc-v', 40);
  check((await pill()).startsWith('Too slow') && (await facts()).includes('up the slope'), 'banked-curve: 40 km/h on ice slides in');
  await page.selectOption('.bc .bc-surf', '0.7'); await setR('.bc .bc-a', 0); await setR('.bc .bc-v', 72);
  check((await facts()).includes('0 km/h to 94 km/h') && (await facts()).includes('μ = 0.408'), 'banked-curve: flat dry road: top speed √(μ r g) = 94 km/h');
  await page.selectOption('.bc .bc-surf', '0'); await setR('.bc .bc-a', 15);
  check((await facts()).includes('58 km/h to 58 km/h'), 'banked-curve: no friction: only the ideal speed works');
  // drag on the road picture tilts it
  { const b = await page.$eval('.bc .bc-c', (c) => { c.scrollIntoView({ block: 'center' }); const r = c.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + 260 }; });
    await page.mouse.move(b.x, b.y); await page.mouse.down(); await page.mouse.move(b.x + 50, b.y, { steps: 5 }); await page.mouse.up(); await page.waitForTimeout(120);
    check(await page.inputValue('.bc .bc-a') === '25', `banked-curve: drag tilts the bank to 25° (${await page.inputValue('.bc .bc-a')})`); }
  const ans = await page.$eval('.bc .sq-q', (e) => e.dataset.ans);
  await page.fill('.bc .sq-q .sq-in', ans); await page.click('.bc .sq-q .sq-check');
  check((await page.textContent('.bc .sq-q .sq-res')) === 'Right!' && (await page.$$('.bc .sq-q')).length === 4, 'banked-curve: quiz');
};
