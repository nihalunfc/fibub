// #565 effect size converter
export const path = '/science/effect-size-converter/';
export default async ({ page, check, OUT, BASE, readFileSync }) => {
  const P = '.es ';
  const txt = (c) => page.textContent(P + c);
  const wait = () => page.waitForTimeout(350);
  const row = async (name) => page.$$eval(P + '.es-tab tbody tr', (rs, n) => { const r = rs.find((x) => x.cells[0].firstChild.textContent === n); return r ? [...r.cells].slice(1).map((c) => c.textContent) : null; }, name);
  await page.goto(`${BASE}/science/effect-size-converter/`); await page.waitForTimeout(600);
  check((await txt('.es-big')) === "Cohen's d = 0.75 ≈ r = 0.3562 ≈ Odds ratio = 3.898", `effsize: example from t (${await txt('.es-big')})`);
  { const d = await row("Cohen's d"); check(d && d[1] === '0.1419 to 1.358' && d[2] === 'medium', 'effsize: d interval and label'); }
  { const g = await row("Hedges' g"); const e = await row('η² (eta squared)'); check(g?.[0] === '0.7368' && e?.[0] === '0.1269', 'effsize: g and eta squared'); }
  check(await page.isVisible(P + '.es-fig'), 'effsize: overlap figure');
  await page.selectOption(P + '.es-conf', '0.9'); await wait();
  check((await page.textContent(P + '.es-tab thead')).includes('90 % CI'), 'effsize: confidence level');
  await page.selectOption(P + '.es-conf', '0.95');
  await page.selectOption(P + '.es-from', 'f-stat'); await wait();
  { const e = await row('Partial η²'); const o = await row('Partial ω²'); const f = await row("Cohen's f"); check(e?.[0] === '0.2781' && o?.[0] === '0.2188' && f?.[0] === '0.6206' && !(await row("Cohen's d")), 'effsize: F(2, 27) = 5.2'); }
  await page.fill(P + '.es-df1', '1'); await page.fill(P + '.es-df2', '38'); await page.fill(P + '.es-v', '6.25'); await wait();
  check((await row("Cohen's d"))?.[0] === '0.7906' && (await txt('.es-notes')).includes('taken as equal (20 each)'), 'effsize: F with 1 df gives d');
  await page.selectOption(P + '.es-from', 'chi2'); await wait();
  check((await row("Cohen's w (phi for 2 × 2)"))?.[0] === '0.2236' && (await row('r (phi)'))?.[1] === '0.04622 to 0.3873', 'effsize: chi-square 2 x 2');
  await page.fill(P + '.es-cdf', '4'); await page.fill(P + '.es-m', '3'); await page.fill(P + '.es-v', '12'); await page.fill(P + '.es-n', '200'); await wait();
  check((await row("Cramér's V"))?.[0] === '0.1732' && !(await row("Cohen's d")), 'effsize: chi-square larger table');
  await page.selectOption(P + '.es-from', 't-paired'); await wait();
  check((await row("Cohen's dz"))?.[0] === '0.775' && !(await row('r (point-biserial)')), 'effsize: paired t gives dz');
  await page.selectOption(P + '.es-from', 'r'); await wait();
  check((await row('r (point-biserial)'))?.[1] === '0.1101 to 0.4688' && (await row("Cohen's d"))?.[0] === '0.629', 'effsize: from r with Fisher z');
  for (const [from, name, v] of [['d', "Cohen's d", '0.5'], ['g', "Hedges' g", '0.5'], ['or', 'Odds ratio', '2.5'], ['logor', 'log odds ratio', '0.9'], ['cliff', "Cliff's delta (approx.)", '0.4'], ['eta2', 'η² (eta squared)', '0.1'], ['cohen-f', "Cohen's f", '0.25']]) {
    await page.selectOption(P + '.es-from', from); await wait();
    check((await row(name))?.[0] === v, `effsize: start from ${from}`);
  }
  await page.fill(P + '.es-k', '2'); await wait();
  check((await row("Cohen's d"))?.[0] === '0.5', "effsize: Cohen's f with 2 groups gives d = 2f");
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(P + '.es-csv')]); const f = OUT + 'es.csv'; await d.saveAs(f); const t = readFileSync(f, 'utf8'); check(t.startsWith('measure,value,ci_low') && t.includes("Cohen's f"), 'effsize: CSV'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(P + '.dl button[data-f=png]')]); check(d.suggestedFilename() === 'effect-sizes.png', 'effsize: image report'); }
  await page.selectOption(P + '.es-from', 'r'); await page.fill(P + '.es-v', '1.5'); await wait();
  check((await txt('.es-err')).includes('between −1 and 1') && await page.isHidden(P + '.es-out'), 'effsize: r out of range message');
  await page.fill(P + '.es-v', 'abc'); await wait();
  check((await txt('.es-err')).includes('is not a number'), 'effsize: not a number message');
  await page.selectOption(P + '.es-from', 't-ind'); await page.fill(P + '.es-n2', ''); await wait();
  check((await txt('.es-err')).includes('both group sizes'), 'effsize: missing group size message');
};
