// #492 DALY and QALY calculator with ICER
export const path = '/science/daly-qaly/';
export default async ({ page, check, BASE, OUT, readFileSync, writeFileSync }) => {
  await page.goto(`${BASE}/science/daly-qaly/`); await page.waitForTimeout(600);
  const set = async (sel, v) => { await page.fill(`.dqy ${sel}`, v); await page.waitForTimeout(450); };
  const abig = () => page.textContent('.dqy .dq-abig'), facts = () => page.textContent('.dqy .dq-facts');
  check((await page.textContent('.dqy .dq-warn')).includes('For study and teaching, not medical advice. Check with a qualified professional.'), 'daly: medical line shown');
  check((await page.textContent('.dqy .dq-bbig')) === '1,154.98 DALYs (YLL 480.28 + YLD 674.69)', `daly: example burden (${await page.textContent('.dqy .dq-bbig')})`);
  check((await page.textContent('.dqy .dq-btab')).includes('395.62376.93772.55') && (await page.textContent('.dqy .dq-btab')).includes('Total'), 'daly: burden table');
  check((await abig()) === 'ICER $4,033 per QALY gained', `daly: example ICER (${await abig()})`);
  { const f = await facts(); check(f.includes('2.79') && f.includes('5.27') && f.includes('QALYs gained2.48') && f.includes('DALYs averted2.58') && f.includes('$3,871') && !f.includes('Net monetary'), 'daly: example QALYs, DALYs, cost per DALY'); }
  check(await page.isVisible('.dqy .dq-fig'), 'daly: profile chart');
  await set('.dq-wtp', '30000');
  check((await facts()).includes('Net monetary benefit$64,392') && (await facts()).includes('worth it'), 'daly: net monetary benefit');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.dqy .dq-bcsv')]); const f = OUT + 'daly.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n');
    check(rows.length === 3 && rows[0].startsWith('condition,deaths') && rows[1].startsWith('Condition X (made up),20,30,500,0.2,4,3,395.62') && rows[1].endsWith(',772.552104'), `daly: burden CSV (${rows[1]})`); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.dqy .dq-acsv')]); const f = OUT + 'qaly.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n');
    check(rows[0] === 'measure,Usual care,New treatment,difference' && rows[2] === 'QALYs (discounted),2.78584,5.265579,2.479739' && rows[5].startsWith('cost per QALY gained,,,4032.68'), `daly: comparison CSV (${rows[2]})`); }
  for (const f of ['png', 'pdf', 'docx']) {
    await page.locator(`.dqy .dl [data-f=${f}]`).scrollIntoViewIfNeeded();
    const [d] = await Promise.all([page.waitForEvent('download'), page.click(`.dqy .dl [data-f=${f}]`)]);
    check(d.suggestedFilename() === `daly-qaly.${f}`, `daly: ${f} report download`);
  }
  // No discounting.
  await set('.dq-r', '0');
  check((await page.textContent('.dqy .dq-bbig')) === '1,487.50 DALYs (YLL 787.50 + YLD 700.00)' && (await facts()).includes('3.00') && (await facts()).includes('5.90'), `daly: no discounting (${await page.textContent('.dqy .dq-bbig')})`);
  await set('.dq-r', '3');
  // Without weights, DALYs averted equal QALYs gained.
  await set('.dq-s0', '0.6, 5'); await set('.dq-s1', '0.8, 3\n0.7, 5');
  { const f = await facts(); check(f.includes('QALYs gained2.48') && f.includes('DALYs averted2.48'), 'daly: without weights DALYs averted = QALYs gained'); }
  // Dominant and dominated.
  await set('.dq-c1', '1500');
  check((await abig()).includes('dominant'), 'daly: dominant');
  await set('.dq-c1', '12000'); await set('.dq-s1', '0.5, 4');
  check((await abig()).includes('dominated'), 'daly: dominated');
  await set('.dq-s1', '0.8, 3, 0.15\n0.7, 5, 0.2');
  // Open a CSV file for the burden table.
  writeFileSync(OUT + 'burden.csv', 'Condition,Deaths,Years,Cases,Weight,Years with it\nZ,10,40,0,0,0\n');
  await page.setInputFiles('.dqy .dfb-in', OUT + 'burden.csv'); await page.waitForTimeout(800);
  check((await page.textContent('.dqy .dq-bbig')).startsWith('232.94') && (await page.$$('.dqy .dq-btab tbody tr')).length === 1, `daly: burden from a CSV file (${await page.textContent('.dqy .dq-bbig')})`);
  // Bad inputs.
  await set('.dq-b', 'X, 1, 2, 3, 1.5, 4');
  check((await page.textContent('.dqy .dq-berr')).includes('disability weight') && await page.isHidden('.dqy .dq-bout'), 'daly: bad weight message');
  await set('.dq-s0', '2, 5');
  check((await page.textContent('.dqy .dq-aerr')).includes('Usual care: ') && await page.isHidden('.dqy .dq-aout'), 'daly: bad utility message');
  await set('.dq-s0', '0.6, 5, 0.3'); await set('.dq-h', '6');
  check((await page.textContent('.dqy .dq-aerr')).includes('horizon'), 'daly: horizon too short message');
  await set('.dq-h', '10'); await set('.dq-r', '50');
  check(await page.isVisible('.dqy .dq-err') && await page.isHidden('.dqy .dq-aout'), 'daly: discount rate message');
  await set('.dq-r', '3');
  check(await page.isHidden('.dqy .dq-err') && await page.isVisible('.dqy .dq-aout') && (await abig()) === 'ICER $4,033 per QALY gained', 'daly: recovers after a fix');
};
