// #1345 floating and buoyancy
export const path = '/learn/buoyancy-lab/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/buoyancy-lab/`); await page.waitForTimeout(700);
  const facts = () => page.textContent('.by .by-facts'), pill = () => page.textContent('.by .by-pill');
  const setR = async (sel, v) => { await page.$eval(sel, (e, v) => { e.value = v; e.dispatchEvent(new Event('input', { bubbles: true })); }, String(v)); await page.waitForTimeout(100); };
  { const f = await facts(); check(f.includes('4.9 N') && f.includes('500 mL') && f.includes('50 %') && f.includes('it floats by itself') && (await pill()).startsWith('Floats'), 'buoyancy-lab: pine cube example'); }
  check(await page.$eval('.by .by-c', (c) => { const x = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let n = 0; for (let i = 0; i < x.length; i += 4) if (x[i] < 100) n++; return n > 300; }), 'buoyancy-lab: picture drawn');
  await setR('.by .by-p', 100);
  check((await facts()).includes('Your push4.9 N') && (await facts()).includes('9.8 N'), 'buoyancy-lab: held fully under: 4.9 N push');
  await page.click('.by .by-obj [data-v="iron"]'); await page.waitForTimeout(100);
  { const f = await facts(); check((await pill()).startsWith('Sinks') && f.includes('77.42 N') && f.includes('67.62 N') && f.includes('7.9') && !(await page.isVisible('.by .by-p')), 'buoyancy-lab: iron sinks, balance 67.62 N, RD 7.9'); }
  await page.click('.by .by-liq [data-v="mercury"]'); await page.waitForTimeout(100);
  check((await pill()).startsWith('Floats') && (await facts()).includes('58.09 %'), 'buoyancy-lab: iron floats on mercury');
  await page.click('.by .by-obj [data-v="ice"]'); await page.click('.by .by-liq [data-v="sea"]'); await page.waitForTimeout(100);
  check((await facts()).includes('89.76 %'), 'buoyancy-lab: ice in sea water 89.76 % under');
  // drag the floating block down
  { const b = await page.evaluate(() => { const c = document.querySelector('.by .by-c'); c.scrollIntoView({ block: 'center' }); const r = c.getBoundingClientRect(); return { x: r.left, y: r.top, w: r.width }; });
    const cx = b.x + 16 + Math.min(b.w - 32, 360) / 2;
    await page.mouse.move(cx, b.y + 110); await page.mouse.down(); await page.mouse.move(cx, b.y + 125, { steps: 3 }); await page.mouse.up(); await page.waitForTimeout(100);
    check(Number(await page.inputValue('.by .by-p')) > 90, `buoyancy-lab: drag pushes the block down (${await page.inputValue('.by .by-p')} %)`); }
  const ans = await page.$eval('.by .sq-q', (e) => e.dataset.ans);
  await page.fill('.by .sq-q .sq-in', ans); await page.click('.by .sq-q .sq-check');
  check((await page.textContent('.by .sq-q .sq-res')) === 'Right!' && (await page.$$('.by .sq-q')).length === 4, 'buoyancy-lab: quiz');

  // ---- Solve my numbers ----
  {
    await page.goto(BASE + path); await page.waitForTimeout(500);
    const ans = () => page.textContent('.ps-host .ps-ans'), work = () => page.textContent('.ps-host .ps-work');
    const pre = async (n) => { await page.click(`.ps-host .ps-pre button:has-text("${n}")`); await page.waitForTimeout(80); };
    const set = async (id, vals) => { await page.selectOption('.ps-host [data-k="prob"]', id); for (const [k, v] of Object.entries(vals)) { if (v[0] === '#') await page.selectOption(`.ps-host [data-k="${k}"]`, v.slice(1)); else await page.fill(`.ps-host [data-k="${k}"]`, v); } await page.waitForTimeout(80); };
    const ok = async (s, m) => check((await ans()).includes(s), `${'buoyancy-lab'}: ${m} (${await ans()})`);
    await pre('Pine block'); await ok('50 % of its volume under', 'density ratio 0.5');
    await pre('Iron in water'); await ok('It sinks', '7.9 g/cm³ sinks in water');
    await pre('Balance readings'); await ok('relative density is 2.7', '2.7 ÷ 1.0 = 2.7');
    await pre('Ship in the sea'); await ok('4880 m³', '5000 t / 1025 = 4878 m³');
    await pre('Sunk 500'); await ok('upthrust is 4.9 N', '1000·5e-4·9.8 = 4.9 N');
    await set('app', { 'app-m': '2', 'app-V': '0.0005', 'app-rho': '1000' }); await ok('apparent weight is 14.7 N', '19.6 − 4.9 = 14.7 N');
    await set('app', { 'app-m': '0.2' }); await ok('It floats', 'light object floats: nothing hangs');
    await set('rd', { 'rd-Wa': '2', 'rd-Wl': '3' }); await ok('less than the weight in air', 'water reading above air reading refused');
    await set('load', { 'load-rb': '500', 'load-rl': '1000', 'load-V': '0.001' }); await ok('500 g', 'extra load 0.5 kg');
    await page.click('.ps-host .ps-pre button'); await page.waitForTimeout(80);
    check((await work()).length > 20 && !/NaN|Infinity/.test(await page.textContent('.ps-host')), `buoyancy-lab: working shown, no NaN`);
  }
};
