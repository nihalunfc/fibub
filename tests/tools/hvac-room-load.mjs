// #663 room heating and cooling load
export const path = '/science/hvac-room-load/';
export default async ({ page, check, BASE, OUT, readFileSync, writeFileSync }) => {
  const R = '.hvl ';
  await page.goto(`${BASE}/science/hvac-room-load/`); await page.waitForTimeout(600);
  check((await page.textContent(R + '.hv-big')) === 'Heating 1,691 W, cooling 2,048 W', 'hvac: example loads');
  { const t = await page.textContent(R + '.hv-facts'); check(t.includes('5,771 BTU/h') && t.includes('6,989 BTU/h') && t.includes('0.582 tons') && t.includes('1,699 W') && t.includes('349 W') && t.includes('0.83') && t.includes('27.5 L/s'), 'hvac: example facts'); }
  { const t = await page.textContent(R + '.hv-tab'); check(t.includes('Window: sun') && t.includes('480') && t.includes('1,151') && t.includes('Total (+10 %)'), 'hvac: breakdown table'); }
  check(await page.isVisible(R + '.hv-fig'), 'hvac: bar chart drawn');
  check((await page.textContent('.hvl .hv-note')).includes('not a full ASHRAE or CIBSE'), 'hvac: simplified-estimate note');
  await page.check(R + '.hv-credit'); await page.waitForTimeout(100);
  check((await page.textContent(R + '.hv-big')) === 'Heating 976 W, cooling 2,048 W', 'hvac: internal gains credited to heating');
  await page.uncheck(R + '.hv-credit'); await page.fill(R + '.hv-mg', '0'); await page.waitForTimeout(100);
  check((await page.textContent(R + '.hv-big')) === 'Heating 1,538 W, cooling 1,862 W', 'hvac: no margin');
  await page.fill(R + '.hv-z', '2000'); await page.waitForTimeout(100);
  check((await page.textContent(R + '.hv-big')) !== 'Heating 1,538 W, cooling 1,862 W', 'hvac: altitude changes the air loads');
  await page.fill(R + '.hv-z', '0');
  await page.fill(R + '.hv-els', 'Wall, 10, 0.5'); await page.fill(R + '.hv-ach', '0'); await page.fill(R + '.hv-vent', '0'); await page.fill(R + '.hv-np', '0'); await page.fill(R + '.hv-lt', '0'); await page.fill(R + '.hv-eq', '0'); await page.waitForTimeout(500);
  check((await page.textContent(R + '.hv-big')) === 'Heating 155 W, cooling 40 W', 'hvac: one wall alone, U·A·ΔT');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.hv-csv')]); const f = OUT + 'hvac.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows.length === 7 && rows[0] === 'part,heating_W,cooling_sensible_W,cooling_latent_W' && rows[1] === 'Wall,155,40,0', 'hvac: breakdown CSV'); }
  await page.fill(R + '.hv-els', 'Window, 2, 1.5, 1.4, 300'); await page.waitForTimeout(500);
  check((await page.textContent(R + '.hv-eerr')).includes('SHGC is a fraction') && await page.isHidden(R + '.hv-out'), 'hvac: bad SHGC message');
  await page.fill(R + '.hv-els', 'Wall, 10, 0.5'); await page.fill(R + '.hv-tih', '-20'); await page.waitForTimeout(500);
  check((await page.textContent(R + '.hv-err')).includes('inside temperature should be above'), 'hvac: heating temperatures message');
  await page.fill(R + '.hv-tih', '21'); await page.fill(R + '.hv-rhic', '120'); await page.waitForTimeout(100);
  check((await page.textContent(R + '.hv-err')).includes('humidities'), 'hvac: humidity message');
  await page.fill(R + '.hv-rhic', '50');
  writeFileSync(OUT + 'hvac-els.csv', 'Element,Area,U,SHGC,Sun,Extra\nWall,10,0.5,,,\nGlass,2,2,0.5,500,\n');
  await page.setInputFiles(R + '.dfb-in', OUT + 'hvac-els.csv'); await page.waitForTimeout(600);
  check((await page.textContent(R + '.hv-tab')).includes('Glass: sun') && (await page.textContent(R + '.hv-tab')).includes('500'), 'hvac: elements opened from a file');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.dl button[data-f=pdf]')]); check((await d.suggestedFilename()) === 'room-load.pdf', 'hvac: PDF report'); }
};
