// #202 Punnett square and pedigree probability
export const path = '/science/punnett-square/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  await page.goto(`${BASE}/science/punnett-square/`); await page.waitForTimeout(500);
  const T = (c) => page.textContent(`.pun ${c}`);
  check((await T('.pu-big')) === 'Phenotypes 9 : 3 : 3 : 1' && (await T('.pu-warn')).includes('not genetic counselling'), 'punnett: example dihybrid 9:3:3:1 and the warning');
  check((await page.$$eval('.pun .pu-sq tr', (r) => r.length)) === 5 && (await page.$$eval('.pun .pu-sq td', (r) => r.length)) === 16 && (await T('.pu-gam')).includes('AB, Ab, aB, ab'), 'punnett: 4 × 4 square and gametes');
  { const t = await T('.pu-ptab'); check(t.includes('Yellow, Round9/16') && t.includes('Green, Wrinkled1/16'), 'punnett: phenotype table'); }
  check((await T('.pu-facts')).includes('1 : 2 : 1 : 2 : 4 : 2 : 1 : 2 : 1'), 'punnett: genotype ratio');
  check((await T('.pu-qres')).startsWith('1/16') && (await T('.pu-qwork')).includes('1/4 × 1/4 = 1/16'), 'punnett: branch method default (green, wrinkled)');
  // Tap a phenotype row: its 9 boxes light up.
  await page.locator('.pun .pu-ptab tr[data-k]').first().scrollIntoViewIfNeeded(); await page.locator('.pun .pu-ptab tr[data-k]').first().click();
  check((await page.$$eval('.pun .pu-sq td.on', (r) => r.length)) === 9, 'punnett: tapping a phenotype lights up 9 boxes');
  // Binomial defaults: 1/4, 4 children, exactly 1.
  check((await T('.pu-bbig')) === 'Exactly 1 of 4: 27/64 (42.19 %)' && (await T('.pu-bfacts')).includes('175/256 (68.36 %)'), 'punnett: binomial 27/64 and at least one 175/256');
  await page.selectOption('.pun .pu-src', 'query'); await page.waitForTimeout(100);
  check((await page.inputValue('.pun .pu-p')) === '1/16', 'punnett: binomial p taken from the branch-method child');
  await page.selectOption('.pun .pu-src', 'ph0'); await page.waitForTimeout(100);
  check((await page.inputValue('.pun .pu-p')) === '9/16', 'punnett: binomial p taken from a phenotype');
  await page.fill('.pun .pu-p', '2'); await page.waitForTimeout(100);
  check((await T('.pu-berr')).includes('between 0 and 1') && await page.isHidden('.pun .pu-bout'), 'punnett: bad chance message');
  await page.fill('.pun .pu-p', '50 %'); await page.fill('.pun .pu-kids', '3'); await page.fill('.pun .pu-k', '2'); await page.waitForTimeout(100);
  check((await T('.pu-bbig')) === 'Exactly 2 of 3: 3/8 (37.5 %)', 'punnett: 2 of 3 at 50 % = 3/8');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.pun .pu-bcsv')]); const f = OUT + 'pun-bin.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows.length === 5 && rows[3].startsWith('2,3,1/2,3/8,'), 'punnett: binomial CSV'); }
  await page.fill('.pun .pu-k', '9'); await page.waitForTimeout(100);
  check((await T('.pu-berr')).includes('k must be from 0 to 3'), 'punnett: k bigger than n message');
  // Carrier risk defaults: affected siblings both sides, one unaffected child.
  check((await T('.pu-rbig')) === 'Next child affected: 3/32 (1 in 11)' && (await T('.pu-rfacts')).includes('5/8') && (await T('.pu-rfacts')).includes('1/9 affected'), 'punnett: AR Bayes 3/32, carriers 5/8, prior 1/9');
  check((await T('.pu-rtab')).includes('(3/4)1 = 3/4') && (await T('.pu-rtab')).includes('3/8 (37.5 %)'), 'punnett: Bayes table');
  await page.fill('.pun .pu-ch', '0'); await page.waitForTimeout(100);
  check((await T('.pu-rbig')) === 'Next child affected: 1/9 (1 in 9)', 'punnett: no children: 1/9');
  await page.selectOption('.pun .pu-p2', 'custom'); await page.waitForTimeout(100);
  check(await page.isVisible('.pun .pu-p2c') && (await T('.pu-rbig')) === 'Next child affected: 1/300 (1 in 300)', 'punnett: typed partner chance 1/50 gives 2/3 × 1/50 × 1/4 = 1/300');
  await page.fill('.pun .pu-p2c', 'x'); await page.waitForTimeout(100);
  check((await T('.pu-rerr')).includes('between 0 and 1'), 'punnett: bad partner chance message');
  await page.fill('.pun .pu-p2c', '1/50');
  await page.locator('.pun .pu-pat button[data-v=xl]').scrollIntoViewIfNeeded(); await page.click('.pun .pu-pat button[data-v=xl]'); await page.waitForTimeout(100);
  check((await T('.pu-rbig')) === 'She is a carrier: 1/5 (1 in 5)' && (await T('.pu-rfacts')).includes('1/10'), 'punnett: X-linked Bayes 1/5, next son 1/10');
  await page.click('.pun .pu-pat button[data-v=ar]');
  // Examples.
  const ex = async (id) => { await page.selectOption('.pun .pu-preset', id); await page.waitForTimeout(150); };
  await ex('flower');
  check((await T('.pu-big')) === 'Phenotypes 1 : 2 : 1' && (await T('.pu-ptab')).includes('Pink1/2'), 'punnett: incomplete dominance 1:2:1');
  await ex('coat');
  check((await page.$$eval('.pun .pu-sq sup', (s) => s.length)) > 4 && (await T('.pu-ptab')).includes('Roan coat1/2'), 'punnett: codominance with superscripts');
  await ex('abo');
  check((await T('.pu-big')) === 'Phenotypes 1 : 1 : 1 : 1' && (await T('.pu-ptab')).includes('Type AB1/4') && (await T('.pu-gtab')).includes('IA IB'), 'punnett: ABO');
  await ex('xrec');
  check((await T('.pu-ptab')).includes('Female: H not affected1/2') && (await T('.pu-ptab')).includes('Male: H affected1/4') && (await T('.pu-gtab')).includes('Sex'), 'punnett: X-linked recessive split by sex');
  await page.selectOption('.pun .pu-qsex', '1'); await page.waitForTimeout(100);
  check((await T('.pu-qwork')).includes('1/2 (male) × 1/2 = 1/4'), 'punnett: branch method affected son 1/4');
  await ex('three');
  check((await T('.pu-big')) === 'Phenotypes 27 : 9 : 9 : 9 : 3 : 3 : 3 : 1' && (await page.$$eval('.pun .pu-sq td', (r) => r.length)) === 64, 'punnett: trihybrid 27:9:9:9:3:3:3:1, 8 × 8');
  await ex('four');
  check((await page.$$eval('.pun .pu-sq td', (r) => r.length)) === 256 && (await T('.pu-ptab')).includes('81/256'), 'punnett: four genes, 16 × 16 square');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.pun .pu-gcsv')]); const f = OUT + 'pun-g.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows.length === 82 && rows[0].startsWith('genotype,fraction') && rows[1].startsWith('AABBCCDD,1/256'), 'punnett: genotype CSV (81 genotypes)'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.pun .pu-pcsv')]); const f = OUT + 'pun-p.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows.length === 17 && rows[1].startsWith('"A_, B_, C_, D_"') && rows[1].includes(',81/256,81,256,'), 'punnett: phenotype CSV'); }
  // Five genes: no square, branch method only.
  await page.selectOption('.pun .pu-n', '5'); await page.waitForTimeout(300);
  check(await page.isHidden('.pun .pu-sqw') && (await T('.pu-sqnote')).includes('too many to draw') && (await T('.pu-big')).startsWith('Phenotypes 243 : 81'), 'punnett: five genes use the branch method');
  // Change a gene by hand: X-linked dominant, affected father.
  await page.selectOption('.pun .pu-n', '1'); await page.waitForTimeout(200);
  await page.selectOption('.pun .pu-gene .pu-mode', 'xdom'); await page.waitForTimeout(100);
  await page.selectOption('.pun .pu-gene .pu-m', '1,1'); await page.selectOption('.pun .pu-gene .pu-f', '0,-1'); await page.waitForTimeout(300);
  check((await T('.pu-ptab')).includes('Female: A affected1/2') && (await T('.pu-ptab')).includes('Male: A not affected1/2') && (await page.inputValue('.pun .pu-preset')) === '', 'punnett: X-linked dominant, affected father');
  await page.fill('.pun .pu-gene .pu-names', 'Healthy, Has the trait'); await page.waitForTimeout(400);
  check((await T('.pu-ptab')).includes('Female: Has the trait'), 'punnett: own phenotype names');
  await page.fill('.pun .pu-gene .pu-names', 'Only one'); await page.waitForTimeout(400);
  check((await T('.pu-err')).includes('give 2 phenotype names') && await page.isHidden('.pun .pu-out'), 'punnett: wrong number of names message');
  await page.fill('.pun .pu-gene .pu-names', ''); await page.fill('.pun .pu-gene .pu-L', 'Y'); await page.waitForTimeout(400);
  check((await T('.pu-err')).includes('not X or Y'), 'punnett: letter Y refused');
  await page.fill('.pun .pu-gene .pu-L', 'D'); await page.waitForTimeout(400);
  check(await page.isVisible('.pun .pu-out') && (await T('.pu-sq')).includes('XD'), 'punnett: letter changed to D');
  // Report.
  await ex('peas');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.pun .dl [data-f=pdf]')]); check(d.suggestedFilename() === 'punnett-square.pdf', 'punnett: PDF report'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.pun .dl [data-f=docx]')]); check(d.suggestedFilename() === 'punnett-square.docx', 'punnett: Word report'); }
};
