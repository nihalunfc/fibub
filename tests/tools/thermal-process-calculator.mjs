// #393 thermal processing F-value calculator
export const path = '/science/thermal-process-calculator/';
export default async ({ page, check, BASE, OUT, readFileSync, writeFileSync }) => {
  const S = '.therm ';
  await page.goto(`${BASE}${path}`); await page.waitForTimeout(500);
  check(await page.isHidden(S + '.tp-out1') && await page.isHidden(S + '.tp-out4'), 'thermal: nothing shown before input');
  await page.click(S + '.tp-ex'); await page.waitForTimeout(300);
  check((await page.textContent(S + '.tp-big1')) === 'D = 2.96 min' && (await page.textContent(S + '.tp-facts1')).includes('0.9999') && await page.isVisible(S + '.tp-fig1'), 'thermal: example D-value');
  check((await page.textContent(S + '.tp-big2')) === 'z = 9.92 °C' && (await page.textContent(S + '.tp-facts2')).includes('D at 121.1 °C1.55 min'), 'thermal: example z-value and D at Tref');
  check((await page.textContent(S + '.tp-big3')) === 'F = 18.6 min (12 log reductions)', 'thermal: F needed');
  check((await page.textContent(S + '.tp-big4')) === 'F = 27.4 min at 121.1 °C (z 10 °C)' && (await page.textContent(S + '.tp-facts4')).includes('121.5 °C at 35 min') && (await page.textContent(S + '.tp-facts4')).includes('17.7'), 'thermal: F0 from the profile');
  check((await page.textContent(S + '.tp-tab')).includes('24.521') && await page.isVisible(S + '.tp-fig5'), 'thermal: profile table and charts');
  await page.fill(S + '.tp-tref', '120'); await page.fill(S + '.tp-z', '8'); await page.waitForTimeout(400);
  check((await page.textContent(S + '.tp-big4')) === 'F = 36.4 min at 120 °C (z 8 °C)', 'thermal: other Tref and z');
  await page.click(S + '.tp-usez'); await page.waitForTimeout(200);
  check((await page.inputValue(S + '.tp-z')) === '9.92' && (await page.inputValue(S + '.tp-D')) === '1.995', 'thermal: use the fitted z and D');
  await page.fill(S + '.tp-tref', '121.1'); await page.fill(S + '.tp-z', '10'); await page.waitForTimeout(400);
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(S + '.tp-csv')]); const f = OUT + 'tp.csv'; await d.saveAs(f); const t = readFileSync(f, 'utf8'); check(t.startsWith('time_min,temperature_C,lethal_rate') && t.includes('F_total_min,27.3561') && t.split('\n').length > 14, 'thermal: CSV'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(S + '.dl [data-f=pdf]')]); check((await d.suggestedFilename()) === 'thermal-process.pdf', 'thermal: PDF download'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(S + '.dl [data-f=png]')]); check((await d.suggestedFilename()) === 'thermal-process.png', 'thermal: PNG download'); }
  await page.fill(S + '.tp-surv', '0, 100\n2, 0'); await page.waitForTimeout(400);
  check((await page.textContent(S + '.tp-err1')).includes('more than 0') && await page.isHidden(S + '.tp-out1'), 'thermal: zero count message');
  await page.fill(S + '.tp-dz', '110, 1\n120, 2'); await page.waitForTimeout(400);
  check((await page.textContent(S + '.tp-err2')).includes('no z-value'), 'thermal: rising D message');
  await page.fill(S + '.tp-n', '5000'); await page.waitForTimeout(400);
  check((await page.textContent(S + '.tp-err3')).includes('smaller than the starting count'), 'thermal: target above start message');
  await page.fill(S + '.tp-prof', '0, 100\n5, 110\n5, 115'); await page.waitForTimeout(400);
  check((await page.textContent(S + '.tp-err4')).includes('Times must increase'), 'thermal: profile times must increase');
  await page.fill(S + '.tp-prof', '0, 100\n5, abc'); await page.waitForTimeout(400);
  check((await page.textContent(S + '.tp-err4')).includes('needs two numbers'), 'thermal: bad profile row');
  writeFileSync(OUT + 'prof.csv', 'time,temp\n0,121.1\n10,121.1\n');
  await page.locator(S + '.dfb-in').nth(2).setInputFiles(OUT + 'prof.csv'); await page.waitForTimeout(400);
  check((await page.textContent(S + '.tp-big4')).startsWith('F = 10 min'), 'thermal: open a profile file');
  await page.click(S + '.tp-ex'); await page.setViewportSize({ width: 375, height: 800 }); await page.waitForTimeout(200);
  await page.locator('.therm').screenshot({ path: OUT + 'therm-375.png' }); await page.setViewportSize({ width: 1280, height: 800 });
};
