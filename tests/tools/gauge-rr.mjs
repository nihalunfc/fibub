// #689 gauge R&R study
export const path = '/science/gauge-rr/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  await page.goto(`${BASE}/science/gauge-rr/`); await page.waitForTimeout(800);
  const big = () => page.textContent('.grr .gr-big'), set = async (s, v) => { await page.fill(`.grr ${s}`, v); await page.waitForTimeout(150); };
  check((await big()) === '%GRR 27.5 % of study variation, 18.8 % of tolerance: marginal (10 to 30 %); ndc 4', 'grr: example headline');
  { const t = await page.textContent('.grr .gr-vc'); check(t.includes('0.0009795') && t.includes('7.57 %') && t.includes('27.51 %') && t.includes('18.78 %') && t.includes('92.43 %'), 'grr: variance components table'); }
  { const t = await page.textContent('.grr .gr-an'); check(t.includes('212.3') && t.includes('28.67') && !t.includes('Part × Operator'), 'grr: pooled ANOVA table'); }
  { const t = await page.textContent('.grr .gr-xr'); check(t.includes('0.02359') && t.includes('0.02245') && t.includes('29.16 %'), 'grr: average and range table'); }
  check((await page.textContent('.grr .gr-xrn')).includes('K3 = 1/d2*(10, 1) = 0.3146'), 'grr: K constants shown');
  check((await page.$$eval('.grr canvas.ax-fig', (c) => c.filter((e) => e.getBoundingClientRect().height > 50).length)) === 4, 'grr: four charts');
  await page.selectOption('.grr .gr-a', '0'); await page.waitForTimeout(150);
  check((await page.textContent('.grr .gr-an')).includes('Part × Operator') && (await big()).includes('27.8 %'), 'grr: interaction kept');
  await page.selectOption('.grr .gr-a', '0.05'); await page.selectOption('.grr .gr-k', '5.15'); await page.waitForTimeout(150);
  check((await big()).includes('27.5 % of study') && (await big()).includes('16.1 % of tolerance'), 'grr: 5.15 SD changes %tolerance only');
  await page.selectOption('.grr .gr-k', '6'); await set('.gr-tol', '');
  check((await big()) === '%GRR 27.5 % of study variation: marginal (10 to 30 %); ndc 4' && !(await page.textContent('.grr .gr-vc')).includes('tolerance'), 'grr: no tolerance');
  await set('.gr-tol', '1');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.grr .gr-csv')]); const f = OUT + 'grr.csv'; await d.saveAs(f); const t = readFileSync(f, 'utf8'); check(t.startsWith('ANOVA method') && t.includes('Total gauge R&R') && t.includes('Gauge R&R,0.03257'), 'grr: CSV'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.grr .dl [data-f=pdf]')]); check((await d.suggestedFilename()) === 'gauge-rr.pdf', 'grr: PDF report'); }
  const long = 'part,operator,value\n' + ['1', '2', '3'].flatMap((p) => ['Ann', 'Bo'].flatMap((o) => [0, 1].map((t) => `${p},${o},${(+p * 1 + (o === 'Bo' ? 0.1 : 0) + t * 0.05).toFixed(2)}`))).join('\n');
  await set('.gr-data', long);
  check((await page.textContent('.grr .gr-facts')).includes('3 parts × 2 operators × 2 trials'), 'grr: long format with names');
  await set('.gr-data', '1,A,1,2\n1,B,1,2\n2,A,1,2');
  check((await page.textContent('.grr .gr-err')).includes('no measurement by operator B') && await page.isHidden('.grr .gr-out'), 'grr: missing cell message');
  await set('.gr-data', '1,A,1,2\n2,A,1,x');
  check((await page.textContent('.grr .gr-err')).includes('is not a number'), 'grr: bad number message');
};
