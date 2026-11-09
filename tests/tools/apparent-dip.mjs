// #867 apparent dip, true thickness, borehole depth and three-point problem
export const path = '/science/apparent-dip/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  await page.goto(`${BASE}/science/apparent-dip/`); await page.waitForTimeout(500);
  const t = (c) => page.textContent('.apd ' + c);
  check((await t('.ad-big')) === 'Apparent dip: 28.2° towards 090', 'apparent dip: example section');
  check(await page.isVisible('.apd .ad-fig') && (await t('.ad-afacts')).includes('35° towards 130'), 'apparent dip: facts and chart');
  { const f = await t('.ad-tfacts'); check(f.includes('41.04 m') && f.includes('50.10 m') && f.includes('115.9 m horizontally'), 'apparent dip: true and vertical thickness of the example'); }
  { const f = await t('.ad-bfacts'); check(f.includes('187.1 m') && f.includes('55°') && !f.includes('Core length'), 'apparent dip: borehole depth of the example'); }
  { const f = await t('.ad-2facts'); check(f.includes('30.6° towards 128') && f.includes('038 / 30.6'), 'apparent dip: true dip from two apparent dips'); }
  { const f = await t('.ad-3facts'); check(f.includes('6.65° towards 025') && f.includes('295 / 6.65') && f.includes('through B'), 'apparent dip: three-point problem'); }
  await page.fill('.apd .ad-t', '040'); await page.waitForTimeout(100);
  check((await t('.ad-big')).includes('runs along the strike'), 'apparent dip: section along the strike');
  await page.fill('.apd .ad-t', '310'); await page.waitForTimeout(100);
  check((await t('.ad-big')) === 'Apparent dip: -35.0° towards 130', 'apparent dip: section against the dip says which way is down');
  await page.selectOption('.apd .ad-fmt', 'dd'); await page.waitForTimeout(100);
  check((await page.inputValue('.apd .ad-s')) === '130' && (await t('.ad-sl')) === 'Dip direction (°)' && (await t('.ad-big')) === 'Apparent dip: -35.0° towards 130', 'apparent dip: dip direction format converts the value');
  await page.fill('.apd .ad-bT', '40'); await page.waitForTimeout(100);
  check((await t('.ad-bfacts')).includes('48.83 m'), 'apparent dip: core length through the bed');
  await page.fill('.apd .ad-hp', '60'); await page.fill('.apd .ad-ht', '310'); await page.waitForTimeout(100);
  check((await t('.ad-bfacts')).includes('plunging 60°'), 'apparent dip: inclined hole');
  await page.fill('.apd .ad-ht', '130'); await page.fill('.apd .ad-hp', '35'); await page.waitForTimeout(100);
  check((await t('.ad-berr')).includes('parallel'), 'apparent dip: hole parallel to the bed');
  await page.fill('.apd .ad-bt', '310'); await page.fill('.apd .ad-ht', '0'); await page.fill('.apd .ad-hp', '90'); await page.waitForTimeout(100);
  check((await t('.ad-berr')).includes('above the collar'), 'apparent dip: bed above the collar');
  await page.fill('.apd .ad-bt', '130');
  await page.selectOption('.apd .ad-sd', 'up'); await page.waitForTimeout(100);
  check((await t('.ad-tfacts')).includes('91.93 m'), 'apparent dip: walking uphill (120 sin 50°)');
  await page.selectOption('.apd .ad-wm', 'horizontal'); await page.waitForTimeout(100);
  check((await t('.ad-tfacts')).includes('124.2 m along the ground') && (await t('.ad-tfacts')).includes('95.17 m'), 'apparent dip: width read off a map');
  await page.selectOption('.apd .ad-u', 'ft'); await page.waitForTimeout(100);
  check((await t('.ad-tfacts')).includes(' ft'), 'apparent dip: feet');
  await page.fill('.apd .ad-sg', '95'); await page.waitForTimeout(100);
  check(await page.isVisible('.apd .ad-terr'), 'apparent dip: bad slope message');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.apd .ad-csv')]); const f = OUT + 'appdip.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows.length === 73 && rows[0] === 'section_direction,apparent_dip_deg,down_towards' && rows[19].startsWith('090,28.209,090'), 'apparent dip: CSV every 5°'); }
  await page.locator('.apd .ad-use2').scrollIntoViewIfNeeded(); await page.click('.apd .ad-use2'); await page.waitForTimeout(100);
  check((await page.inputValue('.apd .ad-s')) === '128' && (await page.inputValue('.apd .ad-d')) === '30.61', 'apparent dip: use two apparent dips as the bed');
  await page.selectOption('.apd .ad-fmt', 'rhr');
  await page.locator('.apd .ad-use3').scrollIntoViewIfNeeded(); await page.click('.apd .ad-use3'); await page.waitForTimeout(100);
  check((await page.inputValue('.apd .ad-s')) === '295' && (await page.inputValue('.apd .ad-d')) === '6.652', 'apparent dip: use three points as the bed');
  await page.fill('.apd .ad-a2', '25'); await page.fill('.apd .ad-t2', '090'); await page.waitForTimeout(100);
  check((await t('.ad-2err')).includes('same line') && await page.isDisabled('.apd .ad-use2'), 'apparent dip: two identical apparent dips');
  const p = page.locator('.apd .ad-p');
  await p.nth(3).fill('100'); await p.nth(4).fill('100'); await p.nth(5).fill('100'); await p.nth(6).fill('200'); await p.nth(7).fill('200'); await p.nth(8).fill('200'); await p.nth(2).fill('0'); await page.waitForTimeout(100);
  check((await t('.ad-3err')).includes('one line'), 'apparent dip: three points in a line');
  await page.fill('.apd .ad-d', '120'); await page.waitForTimeout(100);
  check(await page.isVisible('.apd .ad-err'), 'apparent dip: bad dip message');
  await page.fill('.apd .ad-d', '35'); await page.waitForTimeout(100);
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.apd .dl [data-f=pdf]')]); const f = OUT + 'appdip.pdf'; await d.saveAs(f); check(readFileSync(f).subarray(0, 5).toString() === '%PDF-', 'apparent dip: PDF report'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.apd .dl [data-f=docx]')]); const f = OUT + 'appdip.docx'; await d.saveAs(f); check(readFileSync(f).subarray(0, 2).toString() === 'PK', 'apparent dip: Word report'); }
};
