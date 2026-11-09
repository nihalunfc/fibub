// #467 survival analysis: Kaplan-Meier, log-rank and Cox regression.
export const path = '/science/survival-analysis/';
export default async ({ page, check, BASE, OUT, readFileSync, writeFileSync }) => {
  await page.goto(`${BASE}/science/survival-analysis/`); await page.waitForTimeout(700);
  const txt = (s) => page.textContent(`.sv ${s}`);
  const settle = () => page.waitForTimeout(450);
  check((await page.textContent('.sv')).includes('For study and teaching, not medical advice. Check with a qualified professional.'), 'survival: medical notice near the top');
  check((await txt('.sv-big')) === 'Median survival: Control 9.5 months, Treatment not reached', `survival: example medians (${await txt('.sv-big')})`);
  { const f = await txt('.sv-facts'); check(f.includes('40, 22, 18') && f.includes('6.119 (1 df)') && f.includes('p value0.013'), `survival: facts and log-rank (${f})`); }
  { const m = await txt('.sv-medtab'); check(m.includes('4 to 18') && m.includes('14 to –') && m.includes('not reached'), 'survival: median table with intervals'); }
  { const r = await page.$$eval('.sv .sv-risk tbody tr', (rows) => rows.map((tr) => [...tr.cells].map((c) => c.textContent))); check(r[0][0] === 'Control' && r[0][1] === '20' && r[1][1] === '20' && r.length === 2, `survival: number at risk (${JSON.stringify(r)})`); }
  { const c = await txt('.sv-coxtab'); check(c.includes('Treatment vs Control') && c.includes('0.3384') && c.includes('0.1369 to 0.8364') && c.includes('0.019') && c.includes('1.022') && c.includes('0.9818 to 1.065'), 'survival: Cox hazard ratios as statsmodels/lifelines'); }
  check((await txt('.sv-coxfacts')).includes('χ² = 7.312 (2 df), p = 0.026'), 'survival: Cox likelihood ratio test');
  check(await page.isVisible('.sv .sv-fig'), 'survival: curve drawn');
  // Confidence bands on: the picture changes.
  const before = await page.$eval('.sv .sv-fig', (c) => c.toDataURL());
  await page.locator('.sv .sv-bands').scrollIntoViewIfNeeded(); await page.check('.sv .sv-bands'); await settle();
  check(before !== await page.$eval('.sv .sv-fig', (c) => c.toDataURL()), 'survival: confidence bands drawn');
  // Interval scale and level.
  await page.click('.sv .sv-lifew summary');
  const lifeRow = async (t) => page.$$eval('.sv .sv-life tbody tr', (rows, t) => rows.map((tr) => [...tr.cells].map((c) => c.textContent)).find((r) => r[0] === 'Control' && r[1] === t), t);
  check((await lifeRow('10'))[7] === '0.231 to 0.647', 'survival: log-log interval at 10 (lifelines)');
  await page.selectOption('.sv .sv-ci', 'plain'); await settle();
  check((await lifeRow('10'))[7] === '0.232 to 0.668', 'survival: plain interval');
  await page.selectOption('.sv .sv-ci', 'log'); await settle();
  check((await lifeRow('10'))[7] === '0.277 to 0.731', 'survival: log interval');
  await page.selectOption('.sv .sv-lvl', '0.9'); await settle();
  check((await txt('.sv-medtab')).includes('90 % interval') && (await txt('.sv-life')).includes('90 % interval'), 'survival: 90 % level');
  await page.selectOption('.sv .sv-lvl', '0.95'); await page.selectOption('.sv .sv-ci', 'log-log'); await settle();
  // Cox options: reference group and terms.
  await page.selectOption('.sv .sv-ref', 'Treatment'); await settle();
  check((await txt('.sv-coxtab')).includes('Control vs Treatment') && (await txt('.sv-coxtab')).includes('2.955'), 'survival: other reference group inverts the HR');
  await page.selectOption('.sv .sv-ref', 'Control');
  await page.locator('.sv .sv-terms input[data-t="Age"]').scrollIntoViewIfNeeded(); await page.uncheck('.sv .sv-terms input[data-t="Age"]'); await settle();
  { const c = await txt('.sv-coxtab'); check(c.includes('0.3344') && !c.includes('Age'), 'survival: group-only Cox HR 0.3344 (statsmodels 0.334376)'); }
  await page.uncheck('.sv .sv-terms input[data-t="Group"]'); await settle();
  check((await txt('.sv-coxerr')).includes('Tick at least one term') && await page.isHidden('.sv .sv-coxout'), 'survival: no terms message');
  await page.check('.sv .sv-terms input[data-t="Group"]'); await page.check('.sv .sv-terms input[data-t="Age"]'); await settle();
  // Life table CSV.
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.sv .sv-csv')]); const f = OUT + 'life.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n');
    check(rows[0] === 'group,time,at_risk,events,censored,survival,std_error,lower_95,upper_95' && rows[1].startsWith('Control,1,20,3,0,0.85,') && rows.length > 20, `survival: life table CSV (${rows[1]})`); }
  // Report download.
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.sv .dl button[data-f="png"]')]); check(d.suggestedFilename() === 'survival-analysis.png', 'survival: PNG report'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.sv .dl button[data-f="pdf"]')]); const f = OUT + 'sv.pdf'; await d.saveAs(f); check(readFileSync(f).subarray(0, 4).toString() === '%PDF', 'survival: PDF report'); }
  // Three groups from a file.
  const three = '2.964,1,C;30.501,0,T;3.912,1,O;12.24,1,C;38.861,0,T;1.018,1,O;32.146,0,C;21.483,0,T;4.822,1,O;34.724,0,C;14.43,1,T;13.033,1,O;29.239,0,C;12.569,0,T;9.731,1,O;18.479,0,C;19.253,0,T;3.66,1,O;8.48,0,C;26.711,0,T;25.107,0,O;8.847,1,C;4.49,1,T;13.682,1,O;0.525,1,C;20.606,0,T;17.812,0,O;0.239,1,C;26.467,0,T;4.304,1,O;0.958,1,C;20.986,0,T;9.423,1,O;16.881,1,C;18.498,0,T;15.055,1,O;18.887,1,C;24.579,0,T;10.536,1,O;0.235,1,C;20.299,1,T;9.5,1,O;17.604,0,C';
  writeFileSync(OUT + 'three.csv', 'time,status,arm\n' + three.split(';').join('\n') + '\n');
  await page.setInputFiles('.sv .dfb-in', OUT + 'three.csv'); await page.waitForTimeout(800);
  { const f = await txt('.sv-facts'); check(f.includes('12.52 (2 df)') && f.includes('0.002') && (await page.$$('.sv .sv-lr tbody tr')).length === 3, `survival: 3-group log-rank from a CSV file (lifelines 12.5247) (${f})`); }
  check((await txt('.sv-coxtab')).includes('O vs C') && (await txt('.sv-coxtab')).includes('T vs C'), 'survival: Cox with three groups');
  // Column 3 as a covariate.
  await page.fill('.sv .sv-data', 'time\tevent\tage\n5\t1\t60\n8\t0\t50\n3\t1\t70\n12\t1\t55\n9\t0\t65\n2\t1\t72\n15\t0\t48\n7\t1\t66');
  await page.selectOption('.sv .sv-gc', 'cov'); await settle();
  check((await txt('.sv-big')).startsWith('Median survival: 9.5 months') && await page.isHidden('.sv .sv-lrw') && (await txt('.sv-coxtab')).includes('age'), `survival: one group with a covariate (${await txt('.sv-big')})`);
  await page.selectOption('.sv .sv-gc', 'group');
  // Bad input.
  await page.fill('.sv .sv-data', ''); await settle();
  check((await txt('.sv-err')).startsWith('Paste your data first') && await page.isHidden('.sv .sv-out'), 'survival: empty message');
  await page.fill('.sv .sv-data', '5\t0\tA\n6\t0\tB'); await settle();
  check((await txt('.sv-err')).includes('No events'), 'survival: no events message');
  await page.fill('.sv .sv-data', '5\t1\tA\n6\t1\tB\n7\tmaybe\tA\n-2\t1\tB\n8\t0\tA\n4\t1\tB'); await settle();
  check((await txt('.sv-skip')).startsWith('2 rows left out') && await page.isVisible('.sv .sv-fig'), 'survival: bad rows left out with a note');
};
