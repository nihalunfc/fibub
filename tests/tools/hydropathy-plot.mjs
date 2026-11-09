// #182 Hydropathy plot and transmembrane helix finder
export const path = '/science/hydropathy-plot/';
export default async ({ page, check, BASE, OUT, readFileSync, writeFileSync }) => {
  await page.goto(`${BASE}/science/hydropathy-plot/`); await page.waitForTimeout(500);
  const big = () => page.textContent('.hyd .hy-big'), tab = () => page.textContent('.hyd .hy-tab'), facts = () => page.textContent('.hyd .hy-facts');
  const EX = 'GRAVY −0.473 · 3 likely transmembrane segments';
  check(await page.isHidden('.hyd .hy-out') && (await page.textContent('.hyd .hy-sname')).startsWith("fibub's rounded scale") && (await page.$$('.hyd .hy-scale input')).length === 20, 'hydropathy: empty page, 20 scale boxes, fibub scale named');
  await page.click('.hyd .hy-ex'); await page.waitForTimeout(200);
  check((await big()) === EX, `hydropathy: example GRAVY and segments (${await big()})`);
  { const t = await tab(); check(t.includes('2652272.63') && t.includes('6590262.58') && t.includes('105132282.63') && t.includes('WLAVLIGFAVLLSVIAFGL'), 'hydropathy: example segment table'); }
  { const f = await facts(); check(f.includes('Length148') && f.includes('Highest 9-window mean3.22around residue 38') && f.includes('Lowest 9-window mean−3.22around residue 135'), `hydropathy: example facts (${f})`); }
  check(await page.isVisible('.hyd .hy-fig') && (await page.getAttribute('.hyd .hy-fig', 'aria-label')).includes('3 likely transmembrane'), 'hydropathy: plot drawn');
  // Per-residue CSV
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.hyd .hy-csv')]); const f = OUT + 'hyd.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n');
    check(rows.length === 149 && rows[0] === 'position,residue,value,window_9_mean,window_19_mean,tm_segment' && rows[1] === '1,M,2,,,' && rows[5] === '5,K,-4,-2.1111,,' && rows[40].startsWith('40,') && rows[40].endsWith(',1') && rows[148] === '148,E,-3.5,,,', `hydropathy: per-residue CSV (${rows[5]} | ${rows[40]})`); }
  // Threshold, membrane window and plot window
  await page.fill('.hyd .hy-th', '2.6'); await page.waitForTimeout(400);
  check((await big()).endsWith('2 likely transmembrane segments') && (await tab()).includes('3149') && (await tab()).includes('109128'), 'hydropathy: threshold 2.6');
  await page.fill('.hyd .hy-th', '1.6'); await page.fill('.hyd .hy-tw', '21'); await page.waitForTimeout(400);
  check((await tab()).includes('2552') && (await tab()).includes('6591') && (await facts()).includes('21-residue windows above 1.6'), 'hydropathy: membrane window 21');
  await page.fill('.hyd .hy-tw', '19'); await page.fill('.hyd .hy-w', '3'); await page.waitForTimeout(400);
  check((await facts()).includes('Highest 3-window mean') && (await page.textContent('.hyd .hy-note')).includes('mean of 3 residues'), 'hydropathy: plot window 3');
  // Bad inputs
  await page.fill('.hyd .hy-w', '8'); await page.waitForTimeout(400);
  check((await page.textContent('.hyd .hy-err')).includes('odd whole number') && await page.isHidden('.hyd .hy-out'), 'hydropathy: even window message');
  await page.fill('.hyd .hy-w', '9'); await page.fill('.hyd .hy-th', ''); await page.waitForTimeout(400);
  check((await page.textContent('.hyd .hy-err')).includes('threshold') && await page.isHidden('.hyd .hy-out'), 'hydropathy: missing threshold message');
  await page.fill('.hyd .hy-th', '1.6'); await page.fill('.hyd .hy-in', 'MKLV'); await page.waitForTimeout(400);
  check((await page.textContent('.hyd .hy-err')).includes('fewer than the plot window of 9'), 'hydropathy: protein shorter than the window');
  await page.fill('.hyd .hy-in', '12345 !!'); await page.waitForTimeout(400);
  check((await page.textContent('.hyd .hy-err')).includes('No amino acids found'), 'hydropathy: no amino acids message');
  // A soluble protein, with selenocysteine and X
  await page.fill('.hyd .hy-in', '>soluble\nMSDEKRNQGTSPEDKRGHNQSTEDKUXRGSEDNKQ'); await page.waitForTimeout(400);
  { const n = await page.textContent('.hyd .hy-note'); check((await big()).endsWith('no likely transmembrane segments') && n.includes('No scale value for U (1×)') && n.includes('ambiguous: X (1×)') && (await page.textContent('.hyd .hy-tnote')).includes('Soluble proteins'), 'hydropathy: soluble protein, U and X notes'); }
  // Edit one scale value, then reset
  await page.click('.hyd .hy-ex'); await page.waitForTimeout(200);
  await page.fill('.hyd .hy-scale input[data-aa="L"]', '3.8'); await page.waitForTimeout(400);
  check((await page.textContent('.hyd .hy-sname')).includes('1 of 20 values changed') && (await big()) !== EX && await page.$eval('.hyd .hy-scale input[data-aa="L"]', (e) => e.classList.contains('off')), 'hydropathy: edited scale value');
  await page.locator('.hyd .hy-reset').scrollIntoViewIfNeeded(); await page.click('.hyd .hy-reset'); await page.waitForTimeout(200);
  check((await big()) === EX && (await page.textContent('.hyd .hy-sname')).startsWith("fibub's"), 'hydropathy: reset scale');
  // Pasted scales
  await page.fill('.hyd .hy-paste', 'A 1.8\nL 3.8\nV 4.2'); await page.locator('.hyd .hy-use').scrollIntoViewIfNeeded(); await page.click('.hyd .hy-use'); await page.waitForTimeout(200);
  check((await page.textContent('.hyd .hy-perr')).includes('No value for C, D, E') && (await page.textContent('.hyd .hy-sname')).includes('20 of 20') && (await page.inputValue('.hyd .hy-scale input[data-aa="I"]')) === '', 'hydropathy: partial pasted scale leaves the other boxes empty');
  // A made-up scale: fibub's values plus 0.5, in three-letter codes, so GRAVY rises by exactly 0.5.
  await page.fill('.hyd .hy-paste', 'Ile 5\nVal 4.5\nLeu 4.5\nPhe 3.5\nCys 3\nMet 2.5\nAla 2.5\nGly 0\nThr 0\nSer -0.5\nTrp -0.5\nTyr -1\nPro -1\nHis -2.5\nGlu -3\nGln -3\nAsp -3\nAsn -3\nLys -3.5\nArg -4');
  await page.click('.hyd .hy-use'); await page.waitForTimeout(200);
  check((await big()).startsWith('GRAVY 0.027 · ') && await page.isHidden('.hyd .hy-perr') && (await page.textContent('.hyd .hy-sname')).includes('20 of 20'), `hydropathy: full pasted scale with three-letter codes (${await big()})`);
  await page.fill('.hyd .hy-paste', 'A one\nZZ 2'); await page.click('.hyd .hy-use'); await page.waitForTimeout(200);
  check((await page.textContent('.hyd .hy-perr')).startsWith('Not used:'), 'hydropathy: bad pasted scale message');
  // Report downloads
  for (const f of ['png', 'pdf', 'docx']) {
    await page.locator(`.hyd .dl button[data-f=${f}]`).scrollIntoViewIfNeeded();
    const [d] = await Promise.all([page.waitForEvent('download'), page.click(`.hyd .dl button[data-f=${f}]`)]);
    const p = OUT + 'hyd.' + f; await d.saveAs(p); check(readFileSync(p).length > 2000 && d.suggestedFilename().endsWith('-hydropathy.' + f), `hydropathy: ${f} report download`);
  }
  // A FASTA file: only the first protein is used
  writeFileSync(OUT + 'hyd.fasta', '>from file\n' + 'MKDE'.repeat(5) + 'LIVLLIVAFLLIVLAVLIF' + 'KDER'.repeat(5) + '\n>second\nMMMM\n');
  await page.setInputFiles('.hyd .hy-file', OUT + 'hyd.fasta'); await page.waitForTimeout(300);
  check((await facts()).includes('Length59') && (await tab()).includes('LIVLLIVAFLLIVLAVLIF'), `hydropathy: FASTA file, first protein only (${await facts()})`);
  // Dark mode repaint
  await page.evaluate(() => { document.documentElement.dataset.theme = 'dark'; document.dispatchEvent(new Event('fibub:theme')); });
  { const px = await page.$eval('.hyd .hy-fig', (c) => Array.from(c.getContext('2d').getImageData(2, 2, 1, 1).data).slice(0, 3)); check(px[0] < 40 && px[1] < 40 && px[2] < 40, 'hydropathy: plot redrawn dark'); }
  await page.evaluate(() => { document.documentElement.dataset.theme = 'light'; document.dispatchEvent(new Event('fibub:theme')); });
};
