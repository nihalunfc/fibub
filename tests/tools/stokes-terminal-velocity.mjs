// #1343 terminal velocity in oil
export const path = '/learn/stokes-terminal-velocity/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/stokes-terminal-velocity/`); await page.waitForTimeout(700);
  const facts = () => page.textContent('.sk .sk-facts'), pill = () => page.textContent('.sk .sk-pill');
  const setR = async (v) => { await page.$eval('.sk .sk-r', (e, v) => { e.value = v; e.dispatchEvent(new Event('input', { bubbles: true })); }, String(v)); await page.waitForTimeout(100); };
  { const f = await facts(); check(f.includes('1.017 cm/s') && f.includes('5.7 ms') && f.includes('0.32 mN down') && f.includes('0.0517 mN') && f.includes('0.268 mN') && (await pill()).includes('0.018'), 'stokes-terminal-velocity: steel in glycerine example'); }
  check(await page.$eval('.sk .sk-c', (c) => { const x = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let n = 0; for (let i = 0; i < x.length; i += 4) if (x[i] < 100) n++; return n > 500; }), 'stokes-terminal-velocity: picture drawn');
  await page.click('.sk .sk-drop'); await page.waitForTimeout(500);
  check(!(await page.$eval('.sk .sk-skip', (b) => b.disabled)) && !(await facts()).includes('Your stopwatch'), 'stokes-terminal-velocity: drop starts the stopwatch');
  await page.click('.sk .sk-skip'); await page.waitForTimeout(100);
  { const f = await facts(); check(f.includes('A at 9.83 s, B at 29.49 s') && f.includes('1.017 cm/s') && f.includes('1.4 Pa s'), 'stokes-terminal-velocity: timing and viscosity'); }
  await setR(2);
  check((await facts()).includes('4.069 cm/s') && !(await facts()).includes('Your stopwatch'), 'stokes-terminal-velocity: double radius: 4× speed, timing cleared');
  await setR(1);
  await page.click('.sk .sk-liq [data-v="honey"]'); await page.waitForTimeout(100);
  check((await facts()).includes('0.1389 cm/s'), 'stokes-terminal-velocity: honey');
  await page.click('.sk .sk-ball [data-v="nylon"]'); await page.waitForTimeout(100);
  check((await pill()).startsWith('Floats') && (await facts()).includes('none: it floats'), 'stokes-terminal-velocity: nylon floats in honey');
  await page.click('.sk .sk-ball [data-v="steel"]'); await page.click('.sk .sk-liq [data-v="water"]'); await page.waitForTimeout(100);
  check((await pill()).startsWith('Too fast'), 'stokes-terminal-velocity: water: Re far above 1');
  await page.click('.sk .sk-liq [data-v="mystery"]'); await page.waitForTimeout(100);
  await page.click('.sk .sk-drop'); await page.click('.sk .sk-skip'); await page.waitForTimeout(100);
  check((await facts()).includes('η = ? (find it)') && (await facts()).includes('reveal to compare'), 'stokes-terminal-velocity: mystery oil hidden');
  await page.click('.sk .sk-reveal'); await page.waitForTimeout(100);
  check(/set value [\d.]+ Pa s/.test(await facts()), 'stokes-terminal-velocity: reveal');
  const ans = await page.$eval('.sk .sq-q', (e) => e.dataset.ans);
  await page.fill('.sk .sq-q .sq-in', ans); await page.click('.sk .sq-q .sq-check');
  check((await page.textContent('.sk .sq-q .sq-res')) === 'Right!' && (await page.$$('.sk .sq-q')).length === 4, 'stokes-terminal-velocity: quiz');

  // ---- Solve my numbers ----
  await page.goto(`${BASE}${path}`); await page.waitForTimeout(500);
  {
  const psAns = () => page.textContent('.ps-host .ps-ans'), psWork = () => page.textContent('.ps-host .ps-work');
  const psPre = async (n) => { await page.click(`.ps-host .ps-pre button:has-text("${n}")`); await page.waitForTimeout(80); };
  const psSet = async (id, vals, units = {}) => {
    await page.selectOption('.ps-host [data-k="prob"]', id);
    for (const [k, v] of Object.entries(vals)) { const sel = await page.$eval(`.ps-host [data-k="${id}-${k}"]`, (e) => e.tagName === 'SELECT'); if (sel) await page.selectOption(`.ps-host [data-k="${id}-${k}"]`, v); else await page.fill(`.ps-host [data-k="${id}-${k}"]`, v); }
    for (const [k, u] of Object.entries(units)) await page.selectOption(`.ps-host [data-k="${id}-${k}-u"]`, u);
    await page.waitForTimeout(80);
  };
  const T = (cond, msg) => check(cond, `stokes-terminal-velocity: ${msg}`);
  await psPre('Steel ball in glycerine'); T((await psAns()).includes('The terminal (falling) speed is 1.02 cm/s'), 'example Steel ball in glycerine');
  await psPre('Glass in castor oil'); T((await psAns()).includes('7.55 mm/s'), 'example Glass in castor oil');
  await psPre('Fog droplet in air'); T((await psAns()).includes('The radius is 0.00997 mm (9.97 µm)'), 'example Fog droplet in air');
  await psPre('Measure viscosity'); T((await psAns()).includes('The viscosity is 1.4 Pa·s (14 poise)'), 'example Measure viscosity');
  await psPre('Fall 20 cm'); T((await psAns()).includes('takes 19.7 s to fall 20 cm'), 'example Fall 20 cm');
  await psSet('vt', {'r': '0.1', 'rb': '7.8', 'rl': '1.26', 'eta': '1400', 'g': '9.8'}, {'r': 'cm', 'rb': 'g/cm³', 'rl': 'g/cm³', 'eta': 'mPa·s'}); T((await psAns()).includes('The terminal (falling) speed is 1.02 cm/s'), 'cm, g/cm3 and mPa.s units give 1.02 cm/s');
  await psSet('vt', {'r': '1', 'rb': '700', 'rl': '1260', 'eta': '1.4', 'g': '9.8'}, {'r': 'mm', 'rb': 'kg/m³', 'rl': 'kg/m³', 'eta': 'Pa·s'}); T((await psAns()).includes('The rising speed is 0.871 mm/s'), 'lighter ball rises');
  await psSet('vt', {'r': '1', 'rb': '1260', 'rl': '1260', 'eta': '1.4', 'g': '9.8'}, {}); T((await psAns()).includes('neither sinks nor rises'), 'equal densities give 0');
  await psSet('eta', {'v': '1', 'r': '1', 'rb': '800', 'rl': '1260', 'g': '9.8'}); T((await psAns()).includes('denser than the liquid'), 'lighter ball cannot give a steady fall');
  await psSet('vt', {'r': '0', 'rb': '7800', 'rl': '1260', 'eta': '1.4', 'g': '9.8'}); T((await psAns()).includes('must be more than 0'), 'radius 0 gives a friendly message');
  await psPre('Steel ball in glycerine');
  await psPre('Steel ball in glycerine'); T((await psWork()).length > 20 && !/NaN|Infinity/.test(await page.textContent('.ps-host')), 'working shown, no NaN');
  }
};
