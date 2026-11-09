// #200 antibody dilution and titre calculator
export const path = '/science/antibody-dilution/';
export default async ({ page, check, OUT, BASE, readFileSync }) => {
  const T = (c) => page.textContent(`.abd ${c}`);
  const wait = () => page.waitForTimeout(350);
  await page.goto(`${BASE}/science/antibody-dilution/`); await page.waitForTimeout(600);
  // The made-up example, as the guide describes it.
  check((await T('.ab-wbig')) === '5 µL of stock + 9.995 mL of diluent', 'antibody: example working dilution');
  { const f = await T('.ab-wfacts'); check(f.includes('1:2,000') && f.includes('400 ng/mL') && f.includes('4 µg') && await page.isHidden('.abd .ab-inter'), 'antibody: example facts'); }
  check((await T('.ab-sbig')) === '1:100 to 1:12,800, move 100 µL each step', 'antibody: example serial dilution');
  { const t = await T('.ab-stab'); check(t.includes('198 µL2 µL of stock') && t.includes('1:12,80062.5 ng/mL100 µL100 µL of #7') && (await T('.ab-snote')).includes('throw 100 µL away from tube 8'), 'antibody: serial table'); }
  check((await T('.ab-tbig')) === 'Endpoint titre 1:68,382', 'antibody: example endpoint titre');
  { const f = await T('.ab-tfacts'); check(f.includes('0.071blank mean + 3 SD') && f.includes('0.053 ± 0.0058') && f.includes('1:24,300') && f.includes('4.83'), 'antibody: titre facts'); }
  check(await page.isVisible('.abd .ab-fig') && (await page.locator('.abd .ab-ttab tr.on').textContent()).startsWith('1:24,300') && (await T('.ab-ttab')).includes('0.146'), 'antibody: titre chart and table');
  check((await T('.ab-nbig')) === '33 µL of antibody in 66 mL' && (await T('.ab-nfacts')).includes('26.4 µg') && (await T('.ab-nfacts')).includes('18 blots67 µL left'), 'antibody: example run of blots');
  // CSV and report downloads.
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.abd .ab-scsv')]); const f = OUT + 'abd-s.csv'; await d.saveAs(f); const r = readFileSync(f, 'utf8').trim().split('\n');
    check(r.length === 9 && r[0].startsWith('tube,dilution_1_in') && r[1] === '1,100,8,198,2,stock,100' && r[8] === '8,12800,0.0625,100,100,tube 7,100', 'antibody: series CSV'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.abd .ab-tcsv')]); const f = OUT + 'abd-t.csv'; await d.saveAs(f); const r = readFileSync(f, 'utf8').trim().split('\n');
    check(r[0] === 'dilution_1_in,od_1,od_2,mean,sd,above_cutoff' && r[6] === '24300,0.152,0.141,0.1465,0.0078,yes' && r[7].endsWith(',no') && r.at(-1) === 'endpoint_titre,68382', 'antibody: titre CSV'); }
  for (const f of ['png', 'pdf', 'docx']) { const [d] = await Promise.all([page.waitForEvent('download'), page.click(`.abd .dl button[data-f="${f}"]`)]); const out = OUT + 'abd.' + f; await d.saveAs(out); check((await d.suggestedFilename()) === `antibody-dilution.${f}` && readFileSync(out).length > 2000, `antibody: ${f} report`); }
  // Working dilution: a concentration target, µL, an intermediate, no stock, bad input.
  await page.click('.abd .ab-mode button[data-m="conc"]'); await wait();
  check((await T('.ab-wbig')).startsWith('6.25 µL of stock + 9.99') && (await T('.ab-wfacts')).includes('1:1,600') && (await T('.ab-wfacts')).includes('500 ng/mL'), 'antibody: dilute to 0.5 µg/mL');
  await page.fill('.abd .ab-target', '5000'); await wait();
  check((await T('.ab-werr')).includes('stronger than the stock') && await page.isHidden('.abd .ab-wout'), 'antibody: target above the stock');
  await page.click('.abd .ab-mode button[data-m="ratio"]'); await page.selectOption('.abd .ab-vunit', '1'); await page.fill('.abd .ab-vol', '500'); await wait();
  check((await T('.ab-wbig')) === '0.25 µL of stock + 499.8 µL of diluent' && (await T('.ab-inter')).includes('mix 2 µL of stock with 18 µL of diluent (1:10), then take 2.5 µL of that + 497.5 µL') && (await T('.ab-wwarn')).includes('Only 0.25 µL'), 'antibody: intermediate dilution in µL');
  await page.fill('.abd .ab-stock', ''); await wait();
  check((await T('.ab-wfacts')).includes('give the stock to see it') && (await T('.ab-nfacts')).includes('give the stock in part 1') && !(await T('.ab-stab')).includes('Conc.'), 'antibody: no stock concentration');
  await page.click('.abd .ab-mode button[data-m="conc"]'); await wait();
  check((await T('.ab-werr')).includes('Give the stock concentration'), 'antibody: concentration needs the stock');
  await page.click('.abd .ab-mode button[data-m="ratio"]'); await page.fill('.abd .ab-stock', 'abc'); await wait();
  check((await T('.ab-werr')).includes('must be a number'), 'antibody: bad stock');
  await page.fill('.abd .ab-stock', '0.8'); await page.fill('.abd .ab-vol', '0'); await wait();
  check((await T('.ab-werr')).includes('final volume must be above zero'), 'antibody: zero volume');
  // Serial: 3-fold, custom, too few tubes.
  await page.selectOption('.abd .ab-fold', '3'); await wait();
  check((await T('.ab-sbig')) === '1:100 to 1:218,700, move 50 µL each step' && (await T('.ab-stab')).includes('148.5 µL1.5 µL of stock'), 'antibody: 3-fold series');
  await page.selectOption('.abd .ab-fold', 'custom'); await page.fill('.abd .ab-cfold', '1.5'); await wait();
  check(await page.isVisible('.abd .ab-cfold') && (await T('.ab-sbig')) === '1:100 to 1:1,709, move 200 µL each step', 'antibody: custom 1.5-fold');
  await page.fill('.abd .ab-cfold', '1'); await wait();
  check((await T('.ab-serr')).includes('more than 1-fold'), 'antibody: fold of 1');
  await page.selectOption('.abd .ab-fold', '2'); await page.fill('.abd .ab-tubes', '1'); await wait();
  check((await T('.ab-serr')).includes('between 2 and 48') && await page.isHidden('.abd .ab-sout'), 'antibody: one tube');
  await page.fill('.abd .ab-tubes', '4'); await page.fill('.abd .ab-start', '1000'); await page.fill('.abd .ab-svol', '50'); await wait();
  check((await T('.ab-swarn')).includes('intermediate'), 'antibody: tiny first volume warning');
  // Titre cutoffs.
  await page.selectOption('.abd .ab-cut', 'times'); await wait();
  check(await page.inputValue('.abd .ab-k') === '2' && (await T('.ab-tbig')) === 'Endpoint titre 1:41,850', 'antibody: 2 × blank mean');
  await page.selectOption('.abd .ab-cut', 'fixed'); await wait();
  check(await page.inputValue('.abd .ab-k') === '0.1' && (await T('.ab-kl')) === 'Cutoff OD' && (await T('.ab-tbig')) === 'Endpoint titre 1:45,836', 'antibody: fixed OD 0.1');
  await page.fill('.abd .ab-k', '3'); await wait();
  check((await T('.ab-tbig')) === 'Titre below 1:100' && (await T('.ab-tfacts')).includes('none'), 'antibody: nothing above the cutoff');
  await page.fill('.abd .ab-k', '0.1'); await page.fill('.abd .ab-series', '1:100, 2.4\n1:300, 2.3\n1/900, 2.0\n2700, 1.3'); await wait();
  check((await T('.ab-tbig')) === 'Titre above 1:2,700' && (await T('.ab-twarn')).includes('Dilute further'), 'antibody: every dilution above the cutoff');
  await page.fill('.abd .ab-series', '100, 2\n100, 1.5'); await wait();
  check((await T('.ab-terr')).includes('listed twice') && await page.isHidden('.abd .ab-tout'), 'antibody: duplicate dilution');
  await page.selectOption('.abd .ab-cut', 'sd'); await page.fill('.abd .ab-blanks', '0.05 x'); await wait();
  check((await T('.ab-terr')).includes('blank ODs must be numbers'), 'antibody: bad blank');
  await page.fill('.abd .ab-blanks', '0.05'); await wait();
  check((await T('.ab-terr')).includes('at least two blank'), 'antibody: one blank for mean + SD');
  // A run of plates with a vial that is too small.
  await page.selectOption('.abd .ab-kind', 'plate'); await page.fill('.abd .ab-n', '4'); await page.fill('.abd .ab-nratio', '1000'); await page.fill('.abd .ab-spare', '0'); await page.fill('.abd .ab-vial', '20'); await wait();
  check(await page.isVisible('.abd .ab-wells') && await page.isHidden('.abd .ab-ml') && (await T('.ab-nbig')) === '38.4 µL of antibody in 38.4 mL' && (await T('.ab-nfacts')).includes('2 plates18.4 µL short'), 'antibody: plates and a short vial');
  await page.fill('.abd .ab-n', '0'); await wait();
  check((await T('.ab-nerr')).includes('how many blots or plates'), 'antibody: zero plates');
  // The example button puts everything back; dark mode repaints the chart.
  await page.click('.abd .ab-ex'); await wait();
  check((await T('.ab-wbig')) === '5 µL of stock + 9.995 mL of diluent' && (await T('.ab-tbig')) === 'Endpoint titre 1:68,382' && (await T('.ab-nbig')) === '33 µL of antibody in 66 mL' && (await T('.ab-sbig')).endsWith('move 100 µL each step') && await page.isHidden('.abd .ab-cfold'), 'antibody: example button');
  await page.evaluate(() => { document.documentElement.dataset.theme = 'dark'; document.dispatchEvent(new Event('fibub:theme')); }); await wait();
  check(await page.isVisible('.abd .ab-fig'), 'antibody: dark mode');
};
