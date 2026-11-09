// #668 aircraft performance calculator
export const path = '/science/aircraft-performance/';
export default async ({ page, check, OUT, readFileSync, BASE }) => {
  await page.goto(`${BASE}/science/aircraft-performance/`); await page.waitForTimeout(500);
  const t = (c) => page.textContent(`.acp ${c}`);
  check((await t('.ap-big')) === '(L/D)max 12.9, range 1,455 km, endurance 10 h 43 min', `aircraft: prop example (${await t('.ap-big')})`);
  { const f = await t('.ap-facts'); check(f.includes('57.7 kt') && f.includes('86 kt') && f.includes('65.3 kt') && f.includes('149 m') && !f.includes('Jet best-range'), 'aircraft: prop speeds and ground roll'); }
  check((await page.$$('.acp .ap-tab tr')).length === 4 && await page.isVisible('.acp .ap-f1') && await page.isVisible('.acp .ap-f2'), 'aircraft: speed table and two plots');
  await page.selectOption('.acp .ap-vu', 'kmh'); await page.waitForTimeout(100);
  check((await t('.ap-facts')).includes('159 km/h'), 'aircraft: speeds in km/h');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.acp .ap-csv')]); const f = OUT + 'drag.csv'; await d.saveAs(f); const r = readFileSync(f, 'utf8').trim().split('\n'); check(r.length === 122 && r[0] === 'speed_km_h,CL,parasite_drag_N,induced_drag_N,drag_N,power_kW' && r[1].startsWith('106.8'), 'aircraft: drag curve CSV'); }
  await page.selectOption('.acp .ap-vu', 'kt');
  await page.selectOption('.acp .ap-ex', 'jet'); await page.waitForTimeout(150);
  { const f = await t('.ap-facts'); check((await t('.ap-big')).includes('range 3,878 km') && f.includes('3,612 km') && f.includes('388 kt') && f.includes('654 m') && await page.isVisible('.acp .ap-T') && await page.isHidden('.acp .ap-P'), 'aircraft: jet example'); }
  check((await page.$$('.acp .ap-tab tr')).length === 5, 'aircraft: jet table has the best-range speed');
  await page.fill('.acp .ap-T', '1000'); await page.waitForTimeout(100);
  check((await t('.ap-facts')).includes('does not lift off') && (await page.inputValue('.acp .ap-ex')) === '', 'aircraft: too little thrust, example switches to my numbers');
  await page.fill('.acp .ap-fuel', '9000'); await page.waitForTimeout(100);
  check((await t('.ap-err')).includes('less than the mass') && await page.isHidden('.acp .ap-out'), 'aircraft: fuel more than mass message');
  await page.fill('.acp .ap-fuel', '2000'); await page.fill('.acp .ap-e', '1.5'); await page.waitForTimeout(100);
  check((await t('.ap-err')).includes('Oswald'), 'aircraft: bad e message');
  await page.selectOption('.acp .ap-ex', 'prop'); await page.waitForTimeout(100);
  check((await t('.ap-big')).startsWith('(L/D)max 12.9') && await page.isVisible('.acp .ap-P'), 'aircraft: back to the prop example');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.acp .dl button[data-f="docx"]')]); check((await d.suggestedFilename()).endsWith('.docx'), 'aircraft: Word report'); }
};
