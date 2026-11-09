// #199 MOI calculator
export const path = '/science/moi-calculator/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  const T = (c) => page.textContent(`.moi ${c}`);
  const wait = () => page.waitForTimeout(300);
  await page.goto(`${BASE}/science/moi-calculator/`); await page.waitForTimeout(600);
  // Starting values are the example: 2e5 cells, 5e7 PFU/mL, 4 µL → MOI 1.
  check((await T('.mo-big')) === 'MOI 1 PFU per cell', 'moi: 4 µL of 5e7 PFU/mL on 2e5 cells is MOI 1');
  { const f = await T('.mo-facts'); check(f.includes('200,000 PFU') && f.includes('63.2 %') && f.includes('36.8 %'), `moi: example facts (${f})`); }
  // Poisson at MOI 3 and the target MOI.
  check((await T('.mo-pbig')).includes('4.98 % of cells get no particle') && (await T('.mo-pbig')).includes('95.0 % get at least one') && (await T('.mo-pbig')).includes('80.1 % get two or more'), `moi: Poisson at MOI 3 (${await T('.mo-pbig')})`);
  { const t = await T('.mo-ptab'); check(t.includes('14.9 %') && t.includes('22.4 %') && t.includes('11 or more') && t.includes('57.7 %'), 'moi: Poisson table rows'); }
  check((await T('.mo-need')) === 'To infect 90.0 % of cells with at least 1 particle, use MOI 2.303.', `moi: MOI for 90 % infected (${await T('.mo-need')})`);
  check(await page.isVisible('.moi .mo-fig') && (await page.getAttribute('.moi .mo-fig', 'aria-label')).includes('0 to 11 or more particles'), 'moi: bar chart drawn');
  // Plate plan with predilutions.
  check((await T('.mo-wbig')) === '5 mixes of 660 µL each, for 3 wells per MOI', `moi: plate plan mixes (${await T('.mo-wbig')})`);
  { const t = await T('.mo-wtab'); check(t.includes('132 µL') && t.includes('528 µL') && t.includes('13.2 µL') && t.includes('1 : 10 — 2 µL + 18 µL') && t.includes('1 : 100 — 2 µL + 198 µL') && t.includes('nothing'), 'moi: plate plan predilutions'); }
  check(await page.isHidden('.moi .mo-warn'), 'moi: no warnings for the example');
  // Volume for a target MOI.
  await page.click('.moi .mo-mode[data-m="vol"]'); await wait();
  check((await T('.mo-big')) === 'Add 12 µL of virus per well' && (await T('.mo-facts')).includes('600,000 PFU'), `moi: MOI 3 needs 12 µL (${await T('.mo-big')})`);
  // TCID50 unit shows its factor and converts with ln 2.
  await page.selectOption('.moi .mo-unit', 'tcid50'); await wait();
  check(await page.isVisible('.moi .mo-lf') && (await T('.mo-big')) === 'Add 17.3 µL of virus per well' && (await T('.mo-facts')).includes('3.47 × 10⁷ units/mL'), `moi: TCID50 counted as ln 2 units (${await T('.mo-big')})`);
  await page.fill('.moi .mo-tf', '1'); await wait();
  check((await T('.mo-big')) === 'Add 12 µL of virus per well', 'moi: a TCID50 factor of 1 gives the PFU answer');
  await page.selectOption('.moi .mo-unit', 'tu'); await wait();
  check(await page.isHidden('.moi .mo-lf') && (await T('.mo-big')) === 'Add 12 µL of virus per well' && (await T('.mo-wtab')).includes('TU per well'), 'moi: transducing units');
  await page.selectOption('.moi .mo-unit', 'pfu'); await page.click('.moi .mo-mode[data-m="moi"]'); await wait();
  // Another MOI: target with at least 2 particles, and sending the MOI to the top.
  await page.fill('.moi .mo-pm', '0.1'); await page.fill('.moi .mo-k', '2'); await page.fill('.moi .mo-target', '50'); await wait();
  check((await T('.mo-pbig')).includes('At MOI 0.1') && (await T('.mo-pbig')).includes('90.5 % of cells get no particle') && (await T('.mo-need')) === 'To infect 50.0 % of cells with at least 2 particles, use MOI 1.678.', `moi: MOI 0.1 and at least 2 particles (${await T('.mo-need')})`);
  await page.locator('.moi .mo-pmoi').scrollIntoViewIfNeeded(); await page.click('.moi .mo-pmoi'); await wait();
  check((await page.inputValue('.moi .mo-moi')) === '0.1' && (await T('.mo-big')) === 'Add 0.400 µL of virus per well', `moi: "use this MOI above" (${await T('.mo-big')})`);
  await page.fill('.moi .mo-k', '1'); await page.fill('.moi .mo-target', '90'); await page.fill('.moi .mo-pm', '3'); await wait();
  // Bad input messages.
  await page.fill('.moi .mo-titre', '0'); await wait();
  check((await T('.mo-err')).includes('titre') && (await T('.mo-werr')).includes('titre') && (await T('.mo-big')) === '', 'moi: titre of 0 message');
  await page.fill('.moi .mo-titre', '5e7'); await page.fill('.moi .mo-cells', 'abc'); await wait();
  check((await T('.mo-err')).includes('number of cells'), 'moi: cells not a number message');
  await page.fill('.moi .mo-cells', '2e5'); await page.fill('.moi .mo-target', '100'); await wait();
  check((await T('.mo-perr')).includes('above 0 % and below 100 %'), 'moi: 100 % target message');
  await page.fill('.moi .mo-target', '90'); await page.fill('.moi .mo-mois', '1, five'); await wait();
  check((await T('.mo-werr')).includes('is not a number'), 'moi: bad MOI list message');
  await page.fill('.moi .mo-mois', '0, 0.01, 0.1, 1, 10'); await page.fill('.moi .mo-wells', '0'); await wait();
  check((await T('.mo-werr')).includes('whole number from 1 to 1536'), 'moi: wells of 0 message');
  await page.fill('.moi .mo-wells', '3'); await page.fill('.moi .mo-mois', '500'); await wait();
  check((await T('.mo-warn')).includes('too weak') && (await page.locator('.moi .mo-warn li.bad').count()) === 1, 'moi: a stock too weak for MOI 500 is flagged');
  // Back to the example, then the downloads.
  await page.locator('.moi .mo-ex').scrollIntoViewIfNeeded(); await page.click('.moi .mo-ex'); await wait();
  check((await T('.mo-big')) === 'MOI 1 PFU per cell' && (await T('.mo-wbig')) === '5 mixes of 660 µL each, for 3 wells per MOI' && await page.isHidden('.moi .mo-werr'), 'moi: the example button resets everything');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.moi .mo-pcsv')]); const f = OUT + 'moi-p.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n');
    check(rows.length === 13 && rows[0] === 'moi,particles_per_cell,exactly_fraction,this_many_or_more_fraction' && rows[1].startsWith('3,0,0.049787068367863944,1') && rows[12].startsWith('3,11+,0.000292336') && (await d.suggestedFilename()) === 'moi-3-poisson.csv', 'moi: Poisson CSV'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.moi .mo-wcsv')]); const f = OUT + 'moi-w.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n');
    check(rows.length === 6 && rows[0].startsWith('moi,virus_ul,medium_ul,total_ul') && rows[5].startsWith('10,132,528,660,10000000,2000000,0.9999546') && rows[3].includes(',10,2,18,') && (await d.suggestedFilename()) === 'moi-plate-plan.csv', `moi: plate plan CSV (${rows[5]})`); }
  for (const f of ['png', 'pdf', 'docx']) { const [d] = await Promise.all([page.waitForEvent('download'), page.click(`.moi .dl button[data-f="${f}"]`)]); const out = OUT + 'moi.' + f; await d.saveAs(out); check((await d.suggestedFilename()) === `moi-report.${f}` && readFileSync(out).length > 2000, `moi: ${f} report download`); }
};
