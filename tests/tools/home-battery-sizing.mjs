// #675 home battery sizing
export const path = '/science/home-battery-sizing/';
export default async ({ page, check, BASE, OUT, readFileSync, writeFileSync }) => {
  await page.goto(`${BASE}/science/home-battery-sizing/`); await page.waitForTimeout(900);
  const big = () => page.textContent('.hbs .hb-big'), facts = () => page.textContent('.hbs .hb-facts');
  check((await big()) === 'Recommended size: 8 kWh (4 kW)', `battery: template year recommends 8 kWh (${await big()})`);
  { const t = await facts(); check(t.includes('30.5 % → 64.9 %') && t.includes('44.5 % → 89.7 %') && t.includes('2,430 → 453 kWh') && t.includes('198 cycles a year'), 'battery: self-consumption, self-sufficiency, import, cycles'); }
  { const t = await facts(); check(t.includes('19 h from full') && t.includes('3.79 h from the backup share') && t.includes('417 a year') && t.includes('14.4 years'), 'battery: backup hours, saving and payback'); }
  { const t = await page.textContent('.hbs .hb-swtab'); const rows = await page.$$eval('.hbs .hb-swtab tr', (r) => r.length); check(rows === 17 && t.includes('Payback') && (await page.textContent('.hbs .hb-swtab tr.on')).startsWith('8'), 'battery: sweep table with the recommended row marked'); }
  check((await page.textContent('.hbs .hb-eff')).includes('90 % (yours)') && await page.isVisible('.hbs .hb-swfig') && await page.isVisible('.hbs .hb-wk'), 'battery: efficiency table and both charts');
  await page.fill('.hbs .hb-share', '99'); await page.waitForTimeout(500);
  check((await big()).startsWith('Recommended size: ') && !(await big()).includes('8 kWh'), `battery: higher share gives a bigger size (${await big()})`);
  await page.fill('.hbs .hb-share', '90'); await page.fill('.hbs .hb-pimp', ''); await page.waitForTimeout(500);
  check(!(await facts()).includes('payback') && !(await facts()).includes('Payback') && !(await page.textContent('.hbs .hb-swtab')).includes('Payback'), 'battery: empty price skips the money sums');
  await page.fill('.hbs .hb-pimp', '0.30'); await page.fill('.hbs .hb-crit', '6'); await page.waitForTimeout(500);
  check((await facts()).includes("more than the battery's 5 kW"), 'battery: critical load above the battery power is flagged');
  await page.fill('.hbs .hb-crit', '0.5'); await page.selectOption('.hbs .hb-hemi', 's'); await page.waitForTimeout(500);
  check((await big()).startsWith('Recommended size'), 'battery: southern hemisphere template');
  await page.selectOption('.hbs .hb-hemi', 'n'); await page.fill('.hbs .hb-kwp', '0'); await page.waitForTimeout(500);
  check((await big()).startsWith('No battery needed'), 'battery: no solar, no recommendation');
  await page.fill('.hbs .hb-kwp', '5'); await page.waitForTimeout(500);
  await page.fill('.hbs .hb-day', '172'); await page.waitForTimeout(200);
  check((await page.getAttribute('.hbs .hb-wk', 'aria-label')).includes('days 172 to 178'), 'battery: week picker');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.hbs .hb-swcsv')]); const f = OUT + 'hb-sweep.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows.length === 17 && rows[0].startsWith('capacity_kWh') && rows[5].startsWith('8,4,') && rows[5].endsWith(',yes'), 'battery: sweep CSV'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.hbs .hb-csv')]); const f = OUT + 'hb-steps.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows.length === 8761 && rows[0].startsWith('step,hours,load_kW'), 'battery: time-step CSV (8,760 hours)'); }
  // Own data: two days of half-hours, from a file.
  await page.selectOption('.hbs .hb-src', 'data'); await page.waitForTimeout(200);
  check(await page.isHidden('.hbs .hb-out') && await page.isVisible('.hbs .hb-in'), 'battery: own data box shown, no result while empty');
  const lines = ['time,load_kW,solar_kW']; for (let i = 0; i < 96; i++) { const h = (i % 48) / 2; lines.push(`${i},${h >= 17 && h < 22 ? 2 : 0.4},${h >= 8 && h < 16 ? 3 : 0}`); }
  writeFileSync(OUT + 'hb.csv', lines.join('\n') + '\n');
  await page.selectOption('.hbs .hb-dt', '0.5');
  await page.setInputFiles('.hbs .dfb-in', OUT + 'hb.csv'); await page.waitForTimeout(800);
  // Each day: solar 24 kWh, load 0.4 × 19 h + 2 × 5 h = 17.6 kWh; evening shortfall 10 kWh, night 4.4 − covered by battery.
  { const t = await facts(); check((await page.textContent('.hbs .hb-note')).includes('96 rows = 2 days') && t.includes('over 2 days'), `battery: half-hour file read as 2 days`); }
  await page.fill('.hbs .hb-cap', '100'); await page.fill('.hbs .hb-pw', '50'); await page.fill('.hbs .hb-res', '0'); await page.fill('.hbs .hb-max', '100'); await page.waitForTimeout(600);
  // Day 1 morning (00:00–08:00) has nothing stored: 3.2 kWh import; after that the battery covers everything.
  check((await facts()).includes('→ 3 kWh'), `battery: big battery leaves only the first morning's import`);
  await page.fill('.hbs .hb-in', 'load,solar\n1,2'); await page.waitForTimeout(600);
  check((await page.textContent('.hbs .hb-err')).includes('at least 24 rows') && await page.isHidden('.hbs .hb-out'), 'battery: too little data message');
  await page.selectOption('.hbs .hb-src', 'tpl'); await page.fill('.hbs .hb-rte', '20'); await page.waitForTimeout(500);
  check((await page.textContent('.hbs .hb-err')).includes('round-trip efficiency'), 'battery: bad efficiency message');
  await page.fill('.hbs .hb-rte', '90'); await page.fill('.hbs .hb-cap', '10'); await page.fill('.hbs .hb-pw', '5'); await page.fill('.hbs .hb-res', '20'); await page.fill('.hbs .hb-max', '30'); await page.waitForTimeout(600);
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.hbs .dl [data-f=pdf]')]); const f = OUT + 'hb.pdf'; await d.saveAs(f); check(readFileSync(f).subarray(0, 4).toString() === '%PDF', 'battery: PDF report'); }
};
