// #1127 Cardiac cycle and ECG
export const path = '/learn/cardiac-cycle/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  const R = '.ccy ';
  await page.goto(`${BASE}/learn/cardiac-cycle/`); await page.waitForTimeout(800);
  const tap = async (sel) => { await page.locator(R + sel).first().scrollIntoViewIfNeeded(); await page.locator(R + sel).first().click(); await page.waitForTimeout(250); };
  const slide = async (sel, v) => { await page.$eval(R + sel, (el, v) => { el.value = String(v); el.dispatchEvent(new Event('input', { bubbles: true })); }, v); await page.waitForTimeout(250); };
  const big = () => page.textContent(R + '.ccy-big'), facts = () => page.textContent(R + '.ccy-facts');
  check((await big()) === 'Cardiac output 5.25 L a minute', `heart: example output (${await big()})`);
  check((await page.textContent(R + '.ccy-formula')) === 'Cardiac output = stroke volume × heart rate = 70 mL × 75 /min = 5250 mL/min = 5.25 L/min', 'heart: formula with numbers');
  { const f = await facts(); check(f.includes('0.80 s') && f.includes('70 mL') && f.includes('0.30 s') && f.includes('0.40 s'), `heart: timing facts (${f})`); }
  // animation runs: the phase text and picture change over time
  const snap = () => page.$eval(R + '.ccy-fig', (c) => c.toDataURL());
  const a = await snap(); await page.waitForTimeout(600); const b = await snap();
  check(a !== b && a.length > 5000, 'heart: animation drawing');
  const phases = new Set(); for (let i = 0; i < 16; i++) { phases.add(await page.textContent(R + '.ccy-phase')); await page.waitForTimeout(200); }
  check(phases.size >= 3 && [...phases].some((p) => p.includes('AV valves shut, semilunar valves open')), `heart: phases cycle (${phases.size})`);
  // pause
  await tap('.ccy-pause');
  const p1 = await page.textContent(R + '.ccy-phase'); await page.waitForTimeout(600);
  check(p1 === await page.textContent(R + '.ccy-phase') && (await page.textContent(R + '.ccy-pause')) === 'Play', 'heart: pause holds the moment');
  await tap('.ccy-pause'); await tap('.ccy-speed button[data-v="1"]');
  // heart rate
  await slide('.ccy-hr', 150);
  { const f = await facts(); check((await big()) === 'Cardiac output 10.50 L a minute' && f.includes('0.40 s') && f.includes('0.21 s') && f.includes('0.12 s'), `heart: 150 beats a minute (${f})`); }
  await slide('.ccy-hr', 75);
  check(await page.isHidden(R + '.ccy-tab') && await page.isHidden(R + '.ccy-esv'), 'heart: Class 10 hides the phase table and end-systolic volume');
  // Class 11
  await tap('.ccy-level button[data-v="11"]');
  check((await facts()).includes('Ejection fraction58 %') && (await page.textContent(R + '.ccy-path')).includes('mitral'), 'heart: Class 11 facts');
  const rows = await page.$$eval(R + '.ccy-tab tbody tr', (t) => t.map((r) => r.textContent));
  check(rows.length === 5 && rows[0].startsWith('Atrial systole0.100') && rows[1].includes('shut (lub)') && rows[3].includes('shut (dub)'), `heart: phase table (${rows[0]})`);
  await slide('.ccy-edv', 150); await slide('.ccy-esv', 60);
  check((await big()) === 'Cardiac output 6.75 L a minute' && (await facts()).includes('150 − 60 mL'), `heart: more filling (${await big()})`);
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.ccy-csv')]); const f = OUT + 'heart.csv'; await d.saveAs(f); const l = readFileSync(f, 'utf8').trim().split('\n');
    check(l[0] === 'phase,seconds,av_valves,semilunar_valves,ecg' && l.length === 6, 'heart: CSV'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.dl button[data-f=png]')]); const f = OUT + 'heart.png'; await d.saveAs(f); check(readFileSync(f).subarray(1, 4).toString() === 'PNG', 'heart: image report'); }
  for (const lv of ['11', '10']) {
    await tap(`.ccy-level button[data-v="${lv}"]`);
    const n = await page.$$eval(R + '.ccy-qs li', (l) => l.length);
    await tap('.ccy-check');
    check((await page.textContent(R + '.ccy-score')) === `0 of ${n} right.`, `heart: Class ${lv} blanks wrong`);
    await page.$$eval(R + '.ccy-qs li', (lis) => lis.forEach((li) => { li.querySelector('.ccy-ans').value = li.dataset.a; }));
    await tap('.ccy-check');
    check((await page.textContent(R + '.ccy-score')) === `${n} of ${n} right.` && n === (lv === '11' ? 5 : 4), `heart: Class ${lv} quiz (${n})`);
  }
};
