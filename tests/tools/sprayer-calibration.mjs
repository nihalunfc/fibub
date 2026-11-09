// #387 sprayer calibration
export const path = '/science/sprayer-calibration/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  await page.goto(`${BASE}${path}`); await page.waitForTimeout(500);
  const big = () => page.textContent('.spc .sp-big'), facts = () => page.textContent('.spc .sp-facts');
  const tbig = () => page.textContent('.spc .sp-tbig'), tfacts = () => page.textContent('.spc .sp-tfacts');
  check((await big()) === 'Spray volume 180.0 L/ha', `sprayer: example rate (${await big()})`);
  { const f = await facts(); check(f.includes('19.24 gal/acre') && f.includes('12 m wide, 28.8 L/min in all; covers 9.60 ha per hour') && f.includes('4.32 bar'), 'sprayer: example facts and pressure'); }
  check((await page.textContent('.spc .sp-run')) === '8.00 km/h', 'sprayer: timed run speed');
  check((await page.textContent('.spc .sp-cbig')) === 'Mean 1.181 L/min; 1 of 6 nozzles off by more than 10 %: clean or replace them' && (await page.textContent('.spc .sp-ctab')).includes('−11.1 %fix') && (await page.textContent('.spc .sp-cnote')).includes('177.1 L/ha'), 'sprayer: catch test');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.spc .sp-csv')]); const f = OUT + 'spray.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows.length === 7 && rows[0] === 'nozzle,caught_mL,flow_L_per_min,percent_from_mean,flag' && rows[4] === '4,1050,1.0500,-11.08,out', 'sprayer: catch test CSV'); }
  check((await tbig()) === 'One 3000 L tank covers 16.67 ha' && (await tfacts()).includes('2 full tanks and a last one of 2,460 L for 13.67 ha') && !(await tfacts()).includes('Product'), 'sprayer: tank coverage without a label rate');
  check((await page.inputValue('.spc .sp-lab')) === '', 'sprayer: label rate starts blank (never suggested)');
  await page.fill('.spc .sp-lab', '1.5'); await page.waitForTimeout(100);
  { const f = await tfacts(); check(f.includes('Product per full tank25 L') && f.includes('Product in the last tank20.5 L') && f.includes('70.5 L (label rate 1.5 L per ha)'), 'sprayer: product per tank'); }
  await page.selectOption('.spc .sp-labu', 'mL'); await page.waitForTimeout(100);
  check((await tfacts()).includes('25 mL'), 'sprayer: label unit');
  // Flow for a rate.
  await page.selectOption('.spc .sp-m', 'flow'); await page.fill('.spc .sp-r', '150'); await page.waitForTimeout(100);
  check((await big()) === 'Each nozzle must give 1.000 L/min' && (await facts()).includes('3 bar (nozzle rated') && (await tbig()).includes('covers 20.00 ha'), 'sprayer: nozzle flow for a rate, tank follows');
  await page.click('.spc .sp-usemean'); await page.waitForTimeout(100);
  check((await page.inputValue('.spc .sp-m')) === 'rate' && (await big()) === 'Spray volume 177.1 L/ha', 'sprayer: use the mean catch flow');
  await page.fill('.spc .sp-time', '40'); await page.waitForTimeout(100); await page.click('.spc .sp-userun'); await page.waitForTimeout(100);
  check((await page.inputValue('.spc .sp-v')) === '9' && (await big()) === 'Spray volume 157.4 L/ha', 'sprayer: use the timed speed');
  // US units and the 1/128-acre method.
  await page.selectOption('.spc .sp-u', 'us'); await page.fill('.spc .sp-q', '0.3'); await page.fill('.spc .sp-v', '6'); await page.fill('.spc .sp-w', '20'); await page.fill('.spc .sp-q1', ''); await page.waitForTimeout(100);
  check((await big()) === 'Spray volume 14.85 gal/acre' && (await facts()).includes('138.9 L/ha = 14.85 gal/acre'), 'sprayer: US units (5940 rule)');
  check(await page.isVisible('.spc .sp-128') && (await page.textContent('.spc .sp-128t')).includes('204.2 ft'), 'sprayer: 1/128-acre course');
  await page.fill('.spc .sp-oz', '15'); await page.waitForTimeout(100);
  check((await page.textContent('.spc .sp-128r')) === '15.0 fl oz caught = 15.0 gal/acre', 'sprayer: ounces = gallons per acre');
  check((await page.textContent('.spc .sp-labu')).includes('fl oz per acre') && (await page.textContent('.spc .sp-ltank')) === 'Tank (gal)', 'sprayer: US labels');
  // Bad input.
  await page.fill('.spc .sp-v', '0'); await page.waitForTimeout(100);
  check((await page.textContent('.spc .sp-err')).includes('travel speed in mph') && (await page.textContent('.spc .sp-terr')).includes('spray volume above first'), 'sprayer: bad speed');
  await page.fill('.spc .sp-v', '6'); await page.fill('.spc .sp-c', '40 x'); await page.waitForTimeout(100);
  check((await page.textContent('.spc .sp-cerr')).includes('"x" is not a volume') && await page.isHidden('.spc .sp-cout'), 'sprayer: bad catch volume');
  await page.fill('.spc .sp-lab', 'lots'); await page.waitForTimeout(100);
  check((await page.textContent('.spc .sp-terr')).includes('label as a number'), 'sprayer: bad label rate');
  await page.fill('.spc .sp-lab', ''); await page.fill('.spc .sp-c', '40 41 39'); await page.waitForTimeout(100);
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.spc .dl [data-f=pdf]')]); check((await d.suggestedFilename()).endsWith('.pdf'), 'sprayer: PDF report'); }
};
