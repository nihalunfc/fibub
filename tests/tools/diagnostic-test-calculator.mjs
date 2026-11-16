// #461 diagnostic test calculator
export const path = '/science/diagnostic-test-calculator/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  const R = '.dxt ';
  const txt = (c) => page.textContent(R + c);
  await page.goto(`${BASE}${path}`); const __op = () => page.evaluate(() => document.querySelectorAll('.tool-ui details').forEach((d) => (d.open = true))); for (const m of ['fill', 'selectOption', 'check', 'uncheck', 'click']) { const o = page[m].bind(page); page[m] = async (...a) => { await __op(); return o(...a); }; } /* WRAP-OPEN */  await page.waitForTimeout(500);
  check((await txt('.dxt-med')).includes('For study and teaching, not medical advice. Check with a qualified professional.'), 'diag: medical line near the top');
  check((await txt('.dxt-big')) === 'Sensitivity 84.0 %, specificity 90.0 %', 'diag: example sensitivity and specificity');
  { const t = await txt('.dxt-tab'); check(t.includes('75.3 % to 90.6 %') && t.includes('86.0 % to 93.2 %') && t.includes('73.7 %') && t.includes('94.4 %') && t.includes('8.4') && t.includes('5.92 to 11.9') && t.includes('0.178') && t.includes('47.3') && t.includes('0.740'), 'diag: example table with exact intervals'); }
  { const t = await txt('.dxt-post'); check(t.includes('Pre-test probability25.0 %') && t.includes('After a positive result73.7 %') && t.includes('After a negative result5.6 %'), 'diag: post-test probabilities from the sample prevalence'); }
  check(await page.isVisible(R + '.dxt-fig'), 'diag: Fagan nomogram drawn');
  await page.selectOption(R + '.dxt-meth', 'wilson'); await page.waitForTimeout(150);
  check((await txt('.dxt-tab')).includes('75.6 % to 89.9 %') && (await txt('.dxt-facts')).includes('Wilson score'), 'diag: Wilson intervals');
  await page.selectOption(R + '.dxt-conf', '0.99'); await page.waitForTimeout(150);
  check((await txt('.dxt-tab')).includes('99 % interval'), 'diag: 99 % confidence');
  await page.selectOption(R + '.dxt-conf', '0.95'); await page.selectOption(R + '.dxt-meth', 'exact');
  await page.fill(R + '.dxt-pre', '10'); await page.waitForTimeout(300);
  check((await txt('.dxt-post')).includes('After a positive result48.3 %'), 'diag: typed pre-test probability (10 % with LR+ 8.4 gives 48.3 %)');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.dxt-csv')]); const f = OUT + 'diag.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows.length === 11 && rows[0] === 'Measure,Value,95 % interval' && rows[1].startsWith('Sensitivity,84.0 %'), 'diag: table CSV'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.dxt-png')]); const f = OUT + 'fagan.png'; await d.saveAs(f); const b = readFileSync(f); check(b[1] === 0x50 && b.length > 5000, 'diag: nomogram PNG'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.dl button[data-f=pdf]')]); const f = OUT + 'diag.pdf'; await d.saveAs(f); check(readFileSync(f).subarray(0, 4).toString() === '%PDF', 'diag: PDF report'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.dl button[data-f=docx]')]); check((await d.suggestedFilename()) === 'diagnostic-test.docx', 'diag: Word report'); }
  await page.fill(R + '.dxt-pre', '');
  await page.fill(R + '.dxt-c', '0'); await page.waitForTimeout(300);
  check((await txt('.dxt-tab')).includes('100.0 %') && (await txt('.dxt-note')).includes('cannot be given'), 'diag: zero false negatives');
  await page.fill(R + '.dxt-c', '2.5'); await page.waitForTimeout(300);
  check((await txt('.dxt-err')).includes('whole number') && await page.isHidden(R + '.dxt-out'), 'diag: bad count message');
  await page.fill(R + '.dxt-c', '16'); await page.fill(R + '.dxt-a', '0'); await page.fill(R + '.dxt-c', '0'); await page.waitForTimeout(300);
  check((await txt('.dxt-err')).includes('No one has the condition'), 'diag: no cases message');
  await page.fill(R + '.dxt-a', '84'); await page.fill(R + '.dxt-c', '16');
  await page.click(R + '.dxt-mode button[data-m=rates]'); await page.waitForTimeout(300);
  check((await txt('.dxt-big')) === 'PPV 15.4 %, NPV 99.89 %' && (await txt('.dxt-tab')).includes('49.5') && (await txt('.dxt-facts')).includes('18'), 'diag: from sensitivity, specificity and prevalence');
  check((await txt('.dxt-post')).includes('Pre-test probability1.0 %') && (await txt('.dxt-post')).includes('After a positive result15.4 %'), 'diag: rates mode post-test');
  await page.fill(R + '.dxt-sp', '120'); await page.waitForTimeout(300);
  check((await txt('.dxt-err')).includes('Specificity must be a percentage'), 'diag: bad percentage message');
  await page.fill(R + '.dxt-sp', '95'); await page.fill(R + '.dxt-pre', '150'); await page.waitForTimeout(300);
  check((await txt('.dxt-err')).includes('Pre-test probability must be'), 'diag: bad pre-test message');
  // Upgrades: plain sentence, examples, slider, prevalence chart, working.
  await page.fill(R + '.dxt-pre', ''); await page.fill(R + '.dxt-sp', '95'); await page.click(R + '.dxt-mode button[data-m=table]'); await page.waitForTimeout(300);
  check((await txt('.dxt-plain')).includes('this test finds about 84') && (await txt('.dxt-plain')).includes('clears about 90'), 'diag: plain sentence for 100 people');
  check(await page.isVisible(R + '.dxt-curve') && (await txt('.dxt-curvenote')).includes('about 11 %'), 'diag: PPV and NPV chart with the 50 % PPV prevalence (1/8.4 odds = 10.6 %)');
  await page.evaluate(() => document.querySelectorAll('.tool-ui details').forEach((d) => (d.open = true)));
  check((await txt('.dxt-wk')).includes('Sensitivity = TP ÷ (TP + FN) = 84 ÷ 100 = 84.0 %'), 'diag: working shows the numbers');
  await page.evaluate(() => { const r = document.querySelector('.dxt-prer'); r.value = '10'; r.dispatchEvent(new Event('input', { bubbles: true })); }); await page.waitForTimeout(300);
  check((await page.inputValue(R + '.dxt-pre')) === '10' && (await txt('.dxt-post')).includes('After a positive result48.3 %'), 'diag: slider drives the pre-test probability');
  await page.selectOption(R + '.dxt-preset', 'coin'); await page.waitForTimeout(300);
  check((await txt('.dxt-big')) === 'PPV 10.0 %, NPV 90.00 %' && (await page.inputValue(R + '.dxt-pre')) === '', 'diag: coin-toss example (PPV 0.05 / 0.5 = 10 %)');
  check((await txt('.dxt-curvenote')).includes('not informative'), 'diag: LR+ of 1 explained');
  await page.selectOption(R + '.dxt-preset', 'rare'); await page.waitForTimeout(300);
  check((await txt('.dxt-big')) === 'PPV 15.4 %, NPV 99.89 %', 'diag: rare-condition example');
  await page.selectOption(R + '.dxt-preset', 'small'); await page.waitForTimeout(300);
  check((await txt('.dxt-big')).startsWith('Sensitivity 90.0 %, specificity 90.0 %'), 'diag: small-study example (9 of 10, 18 of 20)');
};
