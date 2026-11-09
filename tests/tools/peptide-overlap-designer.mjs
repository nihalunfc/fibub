// #201 overlapping peptide library and pool designer
export const path = '/science/peptide-overlap-designer/';
export default async ({ page, check, BASE, OUT, readFileSync, writeFileSync }) => {
  const R = '.pod ';
  const txt = (s) => page.textContent(R + s);
  await page.goto(`${BASE}/science/peptide-overlap-designer/`); await page.waitForTimeout(500);
  check(await page.isHidden(R + '.po-out'), 'overlap: nothing shown before a protein');
  await page.click(R + '.po-ex'); await page.waitForTimeout(300);
  check((await txt('.po-big')) === '27 peptides of 15 amino acids, overlapping by 11 (a new one every 4)', 'overlap: example gives 27 15-mers overlapping by 11');
  { const f = await txt('.po-facts'); check(f.includes('405 (3.40 × the protein)') && f.includes('12 amino acids lies wholly') && f.includes('16 of 27 peptides') && f.includes('regular peptides reach the end'), 'overlap: example facts (residues, guaranteed stretch, flagged)'); }
  { const t = await txt('.po-tab'); check(t.includes('P014') && t.includes('HGFLIVALLFAGIVM') && t.includes('1599.9211') && t.includes('1601.03') && t.includes('80 % water-repelling') && t.includes('DP, NG, N-terminal E') && t.includes('2 Cys'), 'overlap: example table masses and flags'); }
  check(await page.isVisible(R + '.po-fig'), 'overlap: coverage map drawn');
  check((await txt('.po-pbig')) === '6 rows × 5 columns = 11 pools, up to 6 peptides in each', 'overlap: example pools 6 × 5');
  check((await txt('.po-dbig')) === 'No positive pools chosen yet.', 'overlap: no pools chosen yet');
  const tap = async (k) => { const b = page.locator(`${R}.po-mat button[data-k="${k}"]`); await b.scrollIntoViewIfNeeded(); await b.click(); await page.waitForTimeout(80); };
  await tap('r2');
  check((await txt('.po-dbig')) === 'Choose at least one column pool too.', 'overlap: a row alone asks for a column');
  await tap('c3'); await tap('c4');
  check((await txt('.po-dbig')) === '2 candidates: P014, P015' && (await txt('.po-dl')).includes('residues 57–67: IVALLFAGIVM') && await page.locator(R + '.po-mat td.hit').count() === 2, 'overlap: R3 + C4 + C5 -> P014, P015 sharing 57–67');
  await tap('c4');
  check((await txt('.po-dbig')) === 'One candidate: P014', 'overlap: one row and one column -> one peptide');
  await tap('r4');
  check((await txt('.po-dbig')) === '2 candidates: P014, P024' && !(await txt('.po-dl')).includes('neighbours'), 'overlap: two rows give two candidates, not neighbours');
  await tap('r4'); await tap('r5');
  check((await txt('.po-dbig')) === 'One candidate: P014' && (await txt('.po-dl')).includes('Positive pools with no candidate: R6'), 'overlap: an empty crossing is reported');
  // CSV files
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.po-csv')]); const f = OUT + 'pod.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n');
    check(rows.length === 28 && rows[0].startsWith('name,sequence,length,start,end,mono_mass,avg_mass') && rows[14] === 'P014,HGFLIVALLFAGIVM,15,53,67,1599.9211,1601.03,80,0,R3,C4,80 % water-repelling', `overlap: order list CSV (${rows[14]})`); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.po-pcsv')]); const f = OUT + 'podp.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n');
    check(rows.length === 12 && rows[3] === 'R3,P011 P012 P013 P014 P015,5' && rows[7] === 'C1,P001 P006 P011 P016 P021 P026,6', 'overlap: pool list CSV'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.dl button[data-f="png"]')]); check((await d.suggestedFilename()).endsWith('.png'), 'overlap: report image download'); }
  // Clear
  await page.locator(R + '.po-clear').scrollIntoViewIfNeeded(); await page.click(R + '.po-clear'); await page.waitForTimeout(80);
  check((await txt('.po-dbig')) === 'No positive pools chosen yet.' && await page.locator(R + '.po-mat button[aria-pressed=true]').count() === 0, 'overlap: clear the positive pools');
  // Rows option
  await page.fill(R + '.po-rows', '3'); await page.waitForTimeout(400);
  check((await txt('.po-pbig')) === '3 rows × 9 columns = 12 pools, up to 9 peptides in each', 'overlap: 3 rows');
  await page.fill(R + '.po-rows', ''); await page.waitForTimeout(400);
  // Offset mode keeps the design, then 20-mers every 10 need an end peptide
  await page.selectOption(R + '.po-mode', 'step'); await page.waitForTimeout(150);
  check((await page.inputValue(R + '.po-val')) === '4' && (await txt('.po-vl')) === 'Offset (amino acids)' && (await txt('.po-big')).startsWith('27 peptides'), 'overlap: switching to offset keeps the design (offset 4)');
  await page.fill(R + '.po-len', '20'); await page.fill(R + '.po-val', '10'); await page.waitForTimeout(400);
  { const f = await txt('.po-facts'); check((await txt('.po-big')) === '11 peptides of 20 amino acids, overlapping by 10 (a new one every 10)' && f.includes('P011 (100–119) added') && f.includes('11 amino acids lies wholly'), 'overlap: 20/10 adds a last peptide to the C-terminus'); }
  await page.uncheck(R + '.po-end'); await page.waitForTimeout(200);
  check((await txt('.po-big')).startsWith('10 peptides') && (await txt('.po-facts')).includes('some residues are in no peptide'), 'overlap: without the end peptide, residues are missed');
  await page.check(R + '.po-end'); await page.waitForTimeout(200);
  // Flag rules
  await page.click(R + '.po-rules summary');
  await page.fill(R + '.po-long', '19'); await page.waitForTimeout(400);
  check((await txt('.po-tab')).includes('20 long') && (await txt('.po-facts')).includes('11 of 11 peptides'), 'overlap: long-peptide flag');
  await page.fill(R + '.po-long', '20'); await page.fill(R + '.po-mot', ''); await page.fill(R + '.po-cys', '0'); await page.fill(R + '.po-nt', ''); await page.fill(R + '.po-hmax', '100'); await page.waitForTimeout(400);
  check((await txt('.po-facts')).includes('0 of 11 peptides'), 'overlap: every flag can be turned off');
  await page.fill(R + '.po-cys', '1'); await page.waitForTimeout(400);
  check((await txt('.po-tab')).includes('1 Cys'), 'overlap: Cys flag from 1');
  await page.fill(R + '.po-pre', 'EX-'); await page.waitForTimeout(400);
  check((await txt('.po-tab')).includes('EX-001'), 'overlap: name prefix');
  // Bad input
  await page.selectOption(R + '.po-mode', 'overlap'); await page.fill(R + '.po-val', '20'); await page.waitForTimeout(400);
  check((await txt('.po-err')).includes('overlap must be from 0 to 19') && await page.isHidden(R + '.po-out'), 'overlap: overlap too large message');
  await page.fill(R + '.po-len', '2'); await page.waitForTimeout(400);
  check((await txt('.po-err')).includes('length from 4 to 60'), 'overlap: length too small message');
  await page.fill(R + '.po-len', '15'); await page.fill(R + '.po-val', '11'); await page.fill(R + '.po-in', '12345 ---'); await page.waitForTimeout(400);
  check((await txt('.po-err')).includes('No amino acids found'), 'overlap: no amino acids message');
  await page.fill(R + '.po-in', '>short\nMKXTLLB'); await page.waitForTimeout(400);
  check((await txt('.po-big')).startsWith('1 peptide: the whole protein (5 amino acids)') && (await txt('.po-warn')).includes('Left out 2 characters') && (await txt('.po-pbig')) === '1 row × 1 column = 2 pools, up to 1 peptide in each', 'overlap: short protein with X and B left out');
  // FASTA file
  writeFileSync(OUT + 'pod.fasta', '>A\n' + 'MKTAYIAKQRQISFVKSHFSRQ'.repeat(5) + '\n>B\nAAAA\n');
  await page.setInputFiles(R + '.po-file', OUT + 'pod.fasta'); await page.waitForTimeout(400);
  check((await txt('.po-big')).startsWith('25 peptides of 15') && (await txt('.po-facts')).includes('A, 110 amino acids') && (await txt('.po-facts')).includes('added to reach'), 'overlap: FASTA file, first protein only');
};
