// #671 drone flight time calculator
export const path = '/science/drone-flight-time/';
export default async ({ page, check, OUT, readFileSync, BASE }) => {
  await page.goto(`${BASE}/science/drone-flight-time/`); await page.waitForTimeout(500);
  const t = (c) => page.textContent(`.dft ${c}`);
  check((await t('.df-big')) === 'Hover 24.3 min, cruise at 10 m/s 34.7 min (20.8 km)', `drone: example (${await t('.df-big')})`);
  { const f = await t('.df-facts'); check(f.includes('146.5 W') && f.includes('9.9 A') && f.includes('(2 C)') && f.includes('8.19 g/W') && f.includes('3.33 : 1') && f.includes('34.9 min') && f.includes('23.4 km') && f.includes('74 Wh'), 'drone: hover power, current, loading, T/W, best speeds'); }
  check(await page.isVisible('.dft .df-f1') && await page.isVisible('.dft .df-f2'), 'drone: two plots');
  await page.selectOption('.dft .df-mode', 'meas'); await page.fill('.dft .df-I', '10'); await page.waitForTimeout(150);
  check((await t('.df-big')).startsWith('Hover 24 min') && (await t('.df-facts')).includes('implied figure of merit'), `drone: measured hover current (${await t('.df-big')})`);
  await page.fill('.dft .df-I', '0.1'); await page.waitForTimeout(150);
  check((await t('.df-err')).includes('less than the electronics'), 'drone: current below electronics message');
  await page.selectOption('.dft .df-mode', 'theory'); await page.fill('.dft .df-v', '0'); await page.waitForTimeout(150);
  check((await t('.df-big')) === 'Hover 24.3 min', 'drone: hover only');
  await page.fill('.dft .df-alt', '2000'); await page.fill('.dft .df-t', '2'); await page.waitForTimeout(150);
  { const m = parseFloat((await t('.df-big')).replace('Hover ', '')); check(m < 24.3 && m > 20, `drone: thinner air shortens the hover (${m} min)`); }
  await page.fill('.dft .df-alt', '0'); await page.fill('.dft .df-t', '15'); await page.fill('.dft .df-tmax', '400'); await page.waitForTimeout(150);
  check((await t('.df-facts')).includes('little margin'), 'drone: low thrust-to-weight warning');
  await page.fill('.dft .df-use', '150'); await page.waitForTimeout(150);
  check((await t('.df-err')).includes('usable share') && await page.isHidden('.dft .df-out'), 'drone: bad usable share message');
  await page.fill('.dft .df-use', '80'); await page.fill('.dft .df-v', '10'); await page.waitForTimeout(150);
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.dft .df-csv')]); const f = OUT + 'drone.csv'; await d.saveAs(f); const r = readFileSync(f, 'utf8').trim().split('\n'); check(r.length === 82 && r[0].startsWith('speed_m_s,electrical_power_W') && r[1].startsWith('0.000,146.451'), 'drone: power CSV'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.dft .dl button[data-f="docx"]')]); check((await d.suggestedFilename()).endsWith('.docx'), 'drone: Word report'); }
};
