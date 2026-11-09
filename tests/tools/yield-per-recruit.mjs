// #341 yield per recruit and surplus production
export const path = '/science/yield-per-recruit/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  const R = '.ypr ';
  const t = async (c) => (await page.textContent(R + c)) ?? '';
  const fill = async (c, v) => { await page.fill(R + c, v); await page.waitForTimeout(400); };
  await page.goto(`${BASE}${path}`); await page.waitForTimeout(900);
  check((await t('.yp-big')) === 'F0.1 0.332, Fmax 1.07 per year', 'yield per recruit: example F0.1 and Fmax');
  { const f = await t('.yp-facts'); check(f.includes('283.4 per recruit') && f.includes('1.51 × F0.1') && f.includes('260.4 per recruit') && f.includes('297.4 per recruit') && f.includes('3.17 years'), 'yield per recruit: example facts'); }
  check(await page.isVisible(R + '.yp-fig1') && await page.isVisible(R + '.yp-fig2'), 'yield per recruit: both charts');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.yp-csv')]); const f = OUT + 'ypr.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows.length === 202 && rows[0] === 'F,yield_per_recruit' && rows[1] === '0,0', 'yield per recruit: CSV'); }
  await fill('.yp-tl', ''); check((await t('.yp-facts')).includes('283.5 per recruit'), 'yield per recruit: no maximum age');
  await fill('.yp-tc', '8'); check((await t('.yp-big')).includes('Fmax above 5') && (await t('.yp-facts')).includes('keeps rising'), 'yield per recruit: late first capture has no Fmax');
  await fill('.yp-tc', '0.5'); check((await t('.yp-err')).includes('at least the age at recruitment') && await page.isHidden(R + '.yp-out'), 'yield per recruit: tc below tr message');
  await fill('.yp-tc', '3'); await fill('.yp-tl', '15'); await fill('.yp-M', '0'); check((await t('.yp-err')).includes('natural mortality'), 'yield per recruit: bad M message');
  await fill('.yp-M', '0.3');
  // Surplus production.
  check((await t('.yp-pbig')) === 'MSY 973, BMSY 5752, FMSY 0.169 per year', 'surplus production: Schaefer fit');
  { const f = await t('.yp-pfacts'); check(f.includes('r 0.338, K 11503') && f.includes('0.000429') && f.includes('1.51 × BMSY') && f.includes('75.3 % of K') && f.includes('0.384 × FMSY'), 'surplus production: fitted parameters and status'); }
  check(await page.isVisible(R + '.yp-fig3') && await page.isVisible(R + '.yp-fig4'), 'surplus production: both charts');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.yp-pcsv')]); const f = OUT + 'sp.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows.length === 21 && rows[0].startsWith('year,catch,cpue,biomass_start') && rows[1].startsWith('2005,200,5.095,11503'), 'surplus production: CSV'); }
  await page.selectOption(R + '.yp-m', 'fox'); await page.waitForTimeout(1500);
  check((await t('.yp-pbig')) === 'MSY 1163, BMSY 4580, FMSY 0.254 per year', 'surplus production: Fox fit');
  await page.selectOption(R + '.yp-src', 'par'); await page.selectOption(R + '.yp-m', 'schaefer'); await page.waitForTimeout(500);
  check((await t('.yp-pbig')) === 'MSY 1000, BMSY 5000, FMSY 0.2 per year' && await page.isHidden(R + '.yp-fig4') && await page.isHidden(R + '.yp-fit'), 'surplus production: from r and K');
  await fill('.yp-r', '-1'); check((await t('.yp-perr')).includes('growth rate r'), 'surplus production: bad r message');
  await fill('.yp-r', '0.4');
  await page.selectOption(R + '.yp-src', 'fit'); await fill('.yp-data', '2001,10,5\n2003,10,4\n2004,10,3\n2005,10,3\n2006,10,3');
  check((await t('.yp-perr')).includes('none missing'), 'surplus production: missing year message');
  await fill('.yp-data', '2001,10,5\n2002,10,\n2003,10,\n2004,10,3\n2005,10,'); check((await t('.yp-perr')).includes('at least 4 years'), 'surplus production: too few CPUE message');
  await page.selectOption(R + '.yp-src', 'par'); await page.waitForTimeout(400);
  for (const f of ['png', 'pdf', 'docx']) { const [d] = await Promise.all([page.waitForEvent('download'), page.click(`${R}.dl button[data-f=${f}]`)]); check((await d.suggestedFilename()) === `yield-per-recruit-msy.${f}`, `yield per recruit: ${f} download`); }
};
