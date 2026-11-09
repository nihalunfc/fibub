// #560 hypothesis test chooser and runner
export const path = '/science/hypothesis-tests/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  const P = '.ht ';
  const txt = (c) => page.textContent(P + c);
  const wait = () => page.waitForTimeout(450);
  await page.goto(`${BASE}/science/hypothesis-tests/`); await page.waitForTimeout(700);
  // Two-group example: Shapiro-Wilk finds both normal, so Welch's t test.
  check((await txt('.ht-name')) === "Welch's t test" && (await txt('.ht-big')) === 't(17.54) = −5.119, p < 0.001', `hyp: example runs Welch (${await txt('.ht-big')})`);
  check((await txt('.ht-rec')).includes('no clear departure from normal'), 'hyp: chooser explains the choice from Shapiro-Wilk');
  { const f = await txt('.ht-facts'); check(f.includes('−3.49') && f.includes('−4.925 to −2.055') && f.includes('−2.289'), 'hyp: Welch difference, CI and d'); }
  check((await txt('.ht-say')).includes('give evidence that the mean of Control differs from Fertiliser') && (await txt('.ht-say')).includes('large by Cohen'), 'hyp: plain-English verdict and effect size');
  check((await txt('.ht-assume')).includes('Not needed for Welch') && await page.isVisible(P + '.ht-fig'), 'hyp: assumptions and figure');
  // Student's t test picked by hand.
  await page.selectOption(P + '.ht-test', 'student'); await wait();
  check((await txt('.ht-big')).startsWith('t(18) = −5.119') && (await txt('.ht-rec')).includes('Your answers point to'), "hyp: Student's t picked by hand");
  await page.selectOption(P + '.ht-alt', 'less'); await wait();
  check((await txt('.ht-facts')).includes('−∞ to'), 'hyp: one-sided interval');
  await page.selectOption(P + '.ht-alt', 'two-sided');
  // Mann-Whitney: exact.
  await page.selectOption(P + '.ht-test', 'mw'); await wait();
  check((await txt('.ht-big')) === 'U = 4, p < 0.001' && (await txt('.ht-facts')).includes('Exact') && (await txt('.ht-facts')).includes('−0.92'), `hyp: Mann-Whitney exact (${await txt('.ht-big')})`);
  // CSV download.
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(P + '.ht-csv')]); const f = OUT + 'ht.csv'; await d.saveAs(f); const t = readFileSync(f, 'utf8'); check(t.startsWith('Test,Mann-Whitney U test') && t.includes('Summary'), 'hyp: results CSV'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(P + '.dl button[data-f=pdf]')]); check(d.suggestedFilename() === 'hypothesis-test.pdf', 'hyp: PDF report'); }
  // Back to auto; three groups: ANOVA + Tukey.
  await page.selectOption(P + '.ht-test', 'auto'); await page.selectOption(P + '.ht-design', 'many'); await wait();
  check((await txt('.ht-name')) === 'One-way ANOVA' && (await txt('.ht-big')) === 'F(2, 20) = 33.88, p < 0.001', `hyp: ANOVA example (${await txt('.ht-big')})`);
  { const t = await txt('.ht-tables'); check(t.includes('Tukey HSD') && t.includes('Diet C − Diet B') && t.includes('0.059'), 'hyp: Tukey table'); }
  check((await txt('.ht-say')).includes('Diet B − Diet A') && (await txt('.ht-facts')).includes('0.7721'), 'hyp: Tukey pairs named and eta squared');
  await page.selectOption(P + '.ht-normal', 'no'); await wait();
  check((await txt('.ht-name')) === 'Kruskal-Wallis test' && (await txt('.ht-big')).startsWith('H(2) = 16.9'), 'hyp: Kruskal-Wallis when not normal');
  // Paired.
  await page.selectOption(P + '.ht-normal', 'unsure'); await page.selectOption(P + '.ht-design', 'paired'); await wait();
  check((await txt('.ht-name')) === 'Paired t test' && (await txt('.ht-big')) === 't(9) = 3.909, p = 0.004', `hyp: paired t (${await txt('.ht-big')})`);
  await page.selectOption(P + '.ht-normal', 'no'); await wait();
  check((await txt('.ht-big')) === 'W = 1.5, p = 0.008' && (await txt('.ht-facts')).includes('Normal approximation'), `hyp: Wilcoxon paired (${await txt('.ht-big')})`);
  // One group against a value.
  await page.selectOption(P + '.ht-normal', 'yes'); await page.selectOption(P + '.ht-design', 'one'); await wait();
  check((await txt('.ht-big')) === 't(11) = 3.595, p = 0.004' && (await txt('.ht-facts')).includes('254.5 to 268.5'), `hyp: one-sample t (${await txt('.ht-big')})`);
  await page.fill(P + '.ht-mu', '262'); await wait();
  check((await txt('.ht-say')).includes('do not give clear evidence'), 'hyp: changing the value gives a non-significant result');
  await page.selectOption(P + '.ht-normal', 'no'); await wait();
  check((await txt('.ht-name')).startsWith('Wilcoxon signed-rank test (one group)'), 'hyp: one-group Wilcoxon');
  // Normality check.
  await page.selectOption(P + '.ht-design', 'normal'); await wait();
  check((await txt('.ht-big')) === 'W = 0.8085, p = 0.001' && (await txt('.ht-tables')).includes('not normal'), `hyp: Shapiro-Wilk (${await txt('.ht-big')})`);
  // Counts: goodness of fit and independence.
  await page.selectOption(P + '.ht-kind', 'counts'); await wait();
  check((await txt('.ht-big')) === 'χ²(3) = 0.6599, p = 0.883' && (await txt('.ht-tables')).includes('297'), `hyp: goodness of fit (${await txt('.ht-big')})`);
  await page.selectOption(P + '.ht-cdesign', 'table'); await wait();
  check((await txt('.ht-big')) === 'χ²(2) = 15.8, p < 0.001' && (await txt('.ht-facts')).includes('0.3975'), `hyp: independence (${await txt('.ht-big')})`);
  await page.fill(P + '.ht-data', '\tYes\tNo\nA\t12\t5\nB\t3\t10'); await wait();
  check((await txt('.ht-big')) === 'χ²(1) = 4.887, p = 0.027', `hyp: 2 x 2 with Yates (${await txt('.ht-big')})`);
  await page.uncheck(P + '.ht-yates'); await wait();
  check((await txt('.ht-big')) === 'χ²(1) = 6.652, p = 0.010', 'hyp: Yates off');
  await page.fill(P + '.ht-data', '\tYes\tNo\nA\t6\t1\nB\t2\t7'); await wait();
  check((await txt('.ht-name')) === "Fisher's exact test" && (await txt('.ht-rec')).includes('below 5'), 'hyp: small 2 x 2 picks Fisher');
  await page.selectOption(P + '.ht-test', 'fisher'); await page.fill(P + '.ht-data', '\tImproved\tNot improved\nNew treatment\t12\t5\nPlacebo\t3\t10'); await wait();
  check((await txt('.ht-big')) === 'Odds ratio = 8, p = 0.025' && (await txt('.ht-facts')).includes('1.522 to 42.04'), `hyp: Fisher exact (${await txt('.ht-big')})`);
  // Bad input.
  await page.selectOption(P + '.ht-test', 'welch'); await page.fill(P + '.ht-data', 'A\tB\n1\tx\n2\t3'); await wait();
  check((await txt('.ht-err')).includes('"x" in row 1 of B is not a number') && await page.isHidden(P + '.ht-out'), 'hyp: bad number message');
  await page.fill(P + '.ht-data', ''); await wait();
  check((await txt('.ht-err')).includes('Paste your data'), 'hyp: empty box message');
  // Long format and a data file.
  await page.fill(P + '.ht-data', 'group,value\nA,1\nA,2\nA,3\nB,4\nB,6\nB,5'); await wait();
  check((await txt('.ht-say')).includes('Read as group name and value') && (await txt('.ht-big')).startsWith('t(4) = −3.674'), `hyp: long format (${await txt('.ht-big')})`);
  const { writeFileSync } = await import('node:fs');
  writeFileSync(OUT + 'ht-in.csv', 'Old,New\n10,12\n11,14\n9,13\n12,15\n');
  await page.setInputFiles(P + '.dfb-in', OUT + 'ht-in.csv'); await wait();
  check((await txt('.dfb-note')).includes('Opened ht-in.csv') && (await txt('.ht-big')).startsWith('t('), 'hyp: opens a CSV file');
};
