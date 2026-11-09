// #572 embedding visualiser (PCA and t-SNE)
export const path = '/science/embedding-visualiser/';
export default async ({ page, check, BASE, OUT, readFileSync, writeFileSync }) => {
  const T = (s) => page.textContent('.emv ' + s);
  const done = async () => { await page.waitForTimeout(500); await page.waitForFunction(() => document.querySelector('.emv .emv-status').textContent === '', null, { timeout: 60000 }); await page.waitForTimeout(100); };
  await page.goto(`${BASE}/science/embedding-visualiser/`); await done();
  check((await T('.emv-pbig')) === 'PC1 and PC2 explain 93.9 % of the variance' && (await page.inputValue('.emv .emv-label')) === 'machine', 'embedding: PCA of the example, coloured by machine');
  { const t = await T('.emv-load'); check(t.includes('speed_rpm−0.378−0.507') && t.includes('Variance explained74.2 %19.6 %3.5 %') && t.includes('Cumulative74.2 %93.9 %'), 'embedding: loadings and explained variance'); }
  check((await T('.emv-tbig')) === 'KL divergence 0.057 after 1000 steps', `embedding: t-SNE of the example (${await T('.emv-tbig')})`);
  { const t = await T('.emv-tfacts'); check(t.includes('Trustworthiness (5 nearest)0.981') && t.includes('Neighbours kept (10 nearest)77.1 %') && t.includes('PCA (PC1–PC2) keeps67.3 %'), 'embedding: trustworthiness and neighbours kept, t-SNE against PCA'); }
  check(await page.isVisible('.emv .emv-pfig') && await page.isVisible('.emv .emv-scree') && await page.isVisible('.emv .emv-tfig'), 'embedding: PCA scatter, scree plot and t-SNE map drawn');
  await page.selectOption('.emv .emv-px', '1'); await page.selectOption('.emv .emv-py', '2'); await page.waitForTimeout(200);
  check((await page.getAttribute('.emv .emv-pfig', 'aria-label')).includes('PC2 against PC3'), 'embedding: choose the components to plot');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.emv .emv-csv')]); const f = OUT + 'emb.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n');
    check(d.suggestedFilename() === 'machines-embedding.csv' && rows.length === 121 && rows[0] === 'row,machine,PC1,PC2,PC3,PC4,PC5,PC6,tSNE1,tSNE2' && rows[1].startsWith('1,Press A,'), 'embedding: coordinates CSV'); }
  for (const ff of ['pdf', 'docx', 'png']) { const [d] = await Promise.all([page.waitForEvent('download'), page.click(`.emv .dl [data-f=${ff}]`)]); const f = OUT + 'e.' + ff; await d.saveAs(f); check(readFileSync(f).length > 5000, `embedding: ${ff} report`); }
  await page.click('.emv .emv-std'); await done();
  { const t = await T('.emv-pbig'); check(t.startsWith('PC1 and PC2 explain') && t !== 'PC1 and PC2 explain 93.9 % of the variance' && !(await T('.emv-note')).includes('standardised'), `embedding: without standardising (${t})`); }
  await page.click('.emv .emv-std');
  await page.selectOption('.emv .emv-m', 'pca'); await done();
  check(await page.isHidden('.emv .emv-c-ts') && await page.isHidden('.emv .emv-perp') && await page.isVisible('.emv .emv-c-pca'), 'embedding: PCA only');
  await page.selectOption('.emv .emv-m', 'tsne'); await page.fill('.emv .emv-perp', '10'); await done();
  check(await page.isHidden('.emv .emv-c-pca') && (await T('.emv-tfacts')).includes('Perplexity10') && !(await T('.emv-tfacts')).includes('PCA (PC1'), 'embedding: t-SNE only, perplexity 10');
  await page.selectOption('.emv .emv-init', 'random'); await done();
  const a = await T('.emv-tbig'); await page.fill('.emv .emv-seed', '7'); await done();
  check(await page.isVisible('.emv .emv-seed') && (await T('.emv-tfacts')).includes('random, seed 7') && /^KL divergence [\d.]+ after \d+ steps$/.test(a), 'embedding: random start with a seed');
  await page.fill('.emv .emv-perp', '200'); await page.waitForTimeout(700);
  check((await T('.emv-err')).includes('perplexity must be from 1 to 100'), 'embedding: bad perplexity message');
  await page.fill('.emv .emv-perp', '30'); await page.fill('.emv .emv-iter', '100'); await page.waitForTimeout(700);
  check((await T('.emv-err')).includes('Steps must be a whole number from 250'), 'embedding: bad steps message');
  await page.fill('.emv .emv-iter', '1000');
  // Stop a long run: 600 rows.
  const big = ['a,b,c,g', ...Array.from({ length: 600 }, (_, i) => `${Math.sin(i)},${Math.cos(i * 1.3)},${(i % 17) / 3},${i % 3 ? 'x' : 'y'}`)].join('\n');
  await page.fill('.emv .emv-in', big); await page.waitForTimeout(1200);
  await page.waitForFunction(() => /t-SNE: step/.test(document.querySelector('.emv .emv-status').textContent), null, { timeout: 30000 }).catch(() => {});
  const prog = await T('.emv-status');
  await page.click('.emv .emv-stop'); await page.waitForTimeout(200);
  check(/t-SNE: (step \d+ of 1000|starting)/.test(prog) && (await T('.emv-status')) === 'Stopped.' && await page.isHidden('.emv .emv-stop'), `embedding: progress shown and Stop works (${prog})`);
  // A file with a text column, a gap and a constant column.
  writeFileSync(OUT + 'cells.csv', 'id,x,y,z,k,type\n' + Array.from({ length: 30 }, (_, i) => `c${i},${i % 5},${(i * 7) % 11},${i === 3 ? '' : (i * 3) % 7},1,${i % 2 ? 'B' : 'T'}`).join('\n') + '\n');
  await page.selectOption('.emv .emv-m', 'both'); await page.fill('.emv .emv-perp', '10'); await page.waitForTimeout(100);
  await page.setInputFiles('.emv .dfb-in', OUT + 'cells.csv'); await page.waitForTimeout(600); await done();
  { const n = await T('.emv-note'); check(n.includes('29 rows and 4 columns used') && n.includes('1 row with a gap') && n.includes('k has the same value in every row') && (await page.inputValue('.emv .emv-label')) === 'type' && await page.isDisabled('.emv .emv-f[value="id"]'), `embedding: opened file (${n})`); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.emv .emv-csv')]); check(d.suggestedFilename() === 'cells-embedding.csv', 'embedding: download named after the file'); }
  for (const b of await page.$$('.emv .emv-f:checked')) await b.click();
  await page.waitForTimeout(600);
  check((await T('.emv-err')).includes('at least two number columns'), 'embedding: no columns message');
  await page.setViewportSize({ width: 375, height: 800 }); await page.goto(`${BASE}/science/embedding-visualiser/`); await done();
  await page.screenshot({ path: OUT + 'embedding-375.png', fullPage: true });
  await page.setViewportSize({ width: 1280, height: 800 });
};
