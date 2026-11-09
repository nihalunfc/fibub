// #1125 Central dogma lab
export const path = '/learn/central-dogma/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  const R = '.cdg ';
  await page.goto(`${BASE}/learn/central-dogma/`); await page.waitForTimeout(600);
  const tap = async (sel) => { await page.locator(R + sel).first().scrollIntoViewIfNeeded(); await page.locator(R + sel).first().click(); await page.waitForTimeout(250); };
  const big = () => page.textContent(R + '.cdg-big'), facts = () => page.textContent(R + '.cdg-facts');
  check((await big()) === 'No change yet' && (await facts()).includes('Met-Ala-Trp-Lys-Gly-Leu-Phe-His'), 'dogma: example protein');
  { const aa = await page.$$eval(R + '.cdg-aa', (a) => a.map((x) => x.textContent)); check(aa.join() === 'before the start,Met,Ala,Trp,Lys,Gly,Leu,Phe,His,Stop,after the stop', `dogma: codon cards (${aa.join()})`); }
  { const rows = await page.$$eval(R + '.cdg-card[data-g="1"] .cdg-row', (r) => r.map((x) => x.textContent)); check(rows.join() === 'ATG,TAC,AUG', `dogma: coding, template, mRNA (${rows})`); }
  check((await page.$$eval(R + '.cdg-chain circle', (c) => c.length)) === 16, 'dogma: two chains of 8 beads');
  // Missense: base 9 (index 8) T -> C
  await tap('.cdg-base button[data-v=C]');
  await tap('.cdg-b[data-i="8"]');
  check((await big()) === 'Missense: one amino acid changed (Trp → Arg at amino acid 3)' && (await page.$$eval(R + '.cdg-chain .cdg-diff', (c) => c.length)) === 1, `dogma: missense (${await big()})`);
  check(await page.$eval(R + '.cdg-b[data-i="8"]', (b) => b.classList.contains('cdg-new')), 'dogma: changed base marked');
  await tap('.cdg-undo');
  check((await big()) === 'No change yet' && await page.isDisabled(R + '.cdg-undo'), 'dogma: undo');
  // Silent: GCT -> GCC (index 7)
  await tap('.cdg-b[data-i="7"]');
  check((await big()) === 'Silent: same protein (GCU → GCC, both Ala)', `dogma: silent (${await big()})`);
  await tap('.cdg-undo');
  // Nonsense: TGG -> TGA (index 10)
  await tap('.cdg-base button[data-v=A]'); await tap('.cdg-b[data-i="10"]');
  check((await big()) === 'Nonsense: the chain stops early' && (await facts()).includes('Protein afterMet-Ala'), 'dogma: nonsense');
  await tap('.cdg-undo');
  // Frameshift by insertion, then back in frame with three
  await tap('.cdg-mode button[data-v=insert]'); await tap('.cdg-b[data-i="11"]');
  check((await big()).startsWith('Frameshift') && (await facts()).includes('32 → 33'), 'dogma: insertion frameshift');
  await tap('.cdg-b[data-i="11"]'); await tap('.cdg-b[data-i="11"]');
  check((await big()).startsWith('In-frame') && (await page.textContent(R + '.cdg-say')).includes('3 changes so far'), 'dogma: three insertions in frame');
  await tap('.cdg-undo');
  // Delete
  await tap('.cdg-mode button[data-v=delete]');
  check(await page.isHidden(R + '.cdg-baserow'), 'dogma: no base choice when deleting');
  await tap('.cdg-b[data-i="14"]');
  check((await big()).startsWith('Frameshift') && (await facts()).includes('32 → 31'), 'dogma: deletion frameshift');
  await tap('.cdg-undo');
  // Start lost and outside the gene
  await tap('.cdg-mode button[data-v=swap]'); await tap('.cdg-base button[data-v=C]'); await tap('.cdg-b[data-i="3"]');
  check((await big()) === 'Start lost', 'dogma: start lost');
  await tap('.cdg-undo'); await tap('.cdg-b[data-i="0"]');
  check((await big()) === 'Outside the gene', 'dogma: change before the start');
  // Play translation highlights codons
  await tap('.cdg-play'); await page.waitForTimeout(700);
  check((await page.$$eval(R + '.cdg-card.cdg-on', (c) => c.length)) === 1, 'dogma: play translation');
  // Typed input and errors
  await page.fill(R + '.cdg-in', 'cccggg'); await page.waitForTimeout(500);
  check((await page.textContent(R + '.cdg-err')).includes('No ATG') && (await facts()).includes('Protein beforenone'), 'dogma: no start codon message');
  await page.fill(R + '.cdg-in', 'aug uuu xx uaa'); await page.waitForTimeout(500);
  check((await page.textContent(R + '.cdg-err')).includes('2 letters') && (await facts()).includes('Met-Phe'), 'dogma: U read as T, junk dropped');
  await page.fill(R + '.cdg-in', 'a'); await page.waitForTimeout(500);
  check((await page.textContent(R + '.cdg-err')).includes('at least three'), 'dogma: too short');
  await tap('.cdg-rand');
  check(/^Met(-\w{3}){7}$/.test((await facts()).match(/Protein before(.*?)Protein after/)[1]), 'dogma: random gene has 8 amino acids');
  await tap('.cdg-reset');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.cdg-csv')]); const f = OUT + 'dogma.csv'; await d.saveAs(f); const l = readFileSync(f, 'utf8').trim().split('\n');
    check(l[0] === 'codon_number,dna_coding,mrna,amino_acid,one_letter' && l[1] === '1,ATG,AUG,Met,M' && l.length === 10 && l[9] === '9,TAA,UAA,Stop,*', 'dogma: CSV'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.dl button[data-f=png]')]); const f = OUT + 'dogma.png'; await d.saveAs(f); check(readFileSync(f).subarray(1, 4).toString() === 'PNG', 'dogma: image report'); }
  // Genetic code table
  await tap('.cdg-code summary');
  check((await page.textContent(R + '.cdg-table')).includes('UGG Trp') && (await page.$$eval(R + '.cdg-table td span', (s) => s.length)) === 64, 'dogma: genetic code table');
  // Check yourself
  await tap('.cdg-check');
  check((await page.textContent(R + '.cdg-score')) === '0 of 4 right.', 'dogma: quiz blanks wrong');
  await page.$$eval(R + '.cdg-qs li', (lis) => lis.forEach((li) => { const el = li.querySelector('.cdg-ans'); el.value = el.tagName === 'INPUT' ? li.dataset.a.toLowerCase().split('').join(' ') : li.dataset.a; }));
  await tap('.cdg-check');
  check((await page.textContent(R + '.cdg-score')) === '4 of 4 right.', 'dogma: quiz answers (lower case with spaces accepted)');
};
