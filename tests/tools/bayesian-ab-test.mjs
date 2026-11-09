// #564 Bayesian A/B test and conjugate prior updater
export const path = '/science/bayesian-ab-test/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  const P = '.ba ';
  const txt = (c) => page.textContent(P + c);
  const wait = () => page.waitForTimeout(600);
  await page.goto(`${BASE}/science/bayesian-ab-test/`); await page.waitForTimeout(900);
  check((await txt('.ba-big')) === 'P(B beats A) = 95.02 %', `bayes: example (${await txt('.ba-big')})`);
  { const f = await txt('.ba-facts'); check(f.includes('0.0316 pp') && f.includes('2.53 pp') && f.includes('−0.475 pp to 5.47 pp') && f.includes('Exact sum'), 'bayes: losses, difference interval and method'); }
  check((await txt('.ba-say')).includes('choosing B now is reasonable') && (await txt('.ba-facts')).includes('20.7 % (−3.51 % to 51.3 %)'), 'bayes: plain-English decision and lift');
  check(await page.isVisible(P + '.ba-fig'), 'bayes: posterior figure');
  await page.fill(P + '.ba-thr', '0.01'); await wait();
  check((await txt('.ba-say')).includes('keep the test running'), 'bayes: stricter loss threshold');
  await page.selectOption(P + '.ba-prior', '0.5,0.5'); await wait();
  check((await txt('.ba-facts')).includes('Beta(120.5, 880.5)') && (await txt('.ba-facts')).includes('Numerical integration'), 'bayes: Jeffreys prior uses quadrature');
  await page.selectOption(P + '.ba-prior', 'custom'); await wait();
  check(await page.isVisible(P + '.ba-pa') && (await txt('.ba-facts')).includes('Beta(122, 898)'), 'bayes: custom prior');
  await page.selectOption(P + '.ba-cred', '0.9'); await wait();
  check((await txt('.ba-facts')).includes('90 % interval'), 'bayes: credible level');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(P + '.ba-csv')]); const f = OUT + 'ba.csv'; await d.saveAs(f); const t = readFileSync(f, 'utf8'); check(t.startsWith('quantity,value') && t.includes('P(B > A)'), 'bayes: A/B CSV'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(P + '.dl button[data-f=pdf]')]); check(d.suggestedFilename() === 'bayesian-ab-test.pdf', 'bayes: PDF report'); }
  await page.selectOption(P + '.ba-cred', '0.95'); await page.selectOption(P + '.ba-prior', '1,1');
  await page.fill(P + '.ba-sb', '1200'); await wait();
  check((await txt('.ba-err')).includes('Conversions for B') && await page.isHidden(P + '.ba-out'), 'bayes: more conversions than visitors');
  await page.fill(P + '.ba-sb', '145'); await page.fill(P + '.ba-na', '0'); await wait();
  check((await txt('.ba-err')).includes('Visitors for A'), 'bayes: zero visitors message');
  await page.fill(P + '.ba-na', '1000'); await wait();
  // Conjugate updates.
  await page.click(P + '.ba-mode button[data-m=conj]'); await wait();
  check((await txt('.ba-big')) === 'Posterior Beta(9, 16)' && (await txt('.ba-tab')).includes('0.188 to 0.5532') && (await txt('.ba-tab')).includes('0.36'), `bayes: beta-binomial update (${await txt('.ba-big')})`);
  await page.selectOption(P + '.ba-model', 'gamma'); await wait();
  check((await txt('.ba-big')) === 'Posterior Gamma(shape 39, rate 12.5)' && (await txt('.ba-tab')).includes('2.219 to 4.173'), 'bayes: gamma-Poisson update');
  await page.selectOption(P + '.ba-model', 'normal'); await wait();
  check((await txt('.ba-big')) === 'Posterior Normal(mean 110, SD 6.092)' && (await txt('.ba-tab')).includes('98.08 to 122'), `bayes: normal-normal update (${await txt('.ba-tab')})`);
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(P + '.ba-csv')]); const f = OUT + 'bac.csv'; await d.saveAs(f); const t = readFileSync(f, 'utf8'); check(t.split('\n')[2].startsWith('posterior,110.0206'), 'bayes: update CSV'); }
  await page.fill(P + '.ba-ns', '-2'); await wait();
  check((await txt('.ba-err')).includes('must be above zero'), 'bayes: bad prior SD');
  await page.fill(P + '.ba-ns', '15'); await page.selectOption(P + '.ba-model', 'beta'); await page.fill(P + '.ba-bk', '30'); await wait();
  check((await txt('.ba-err')).includes('no more than trials'), 'bayes: successes above trials');
};
