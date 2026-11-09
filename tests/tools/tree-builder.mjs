// #308 tree builder
export const path = '/science/tree-builder/';
export default async ({ page, check, BASE, OUT, readFileSync, writeFileSync }) => {
  await page.goto(`${BASE}/science/tree-builder/`); await page.waitForTimeout(900);
  const t = (s) => page.textContent(`.tbld ${s}`), nwk = () => page.inputValue('.tbld .tb-nwk');
  check((await t('.tb-big')) === 'Neighbour-joining tree of 8 sequences' && (await t('.tb-facts')).includes('Total branch length0.7362'), 'tree builder: example NJ, total length = Biopython');
  check((await t('.tb-note')).includes('1 branch length came out slightly negative') && await page.isVisible('.tbld .tb-fig'), 'tree builder: negative NJ branch noted, tree drawn');
  { const d = await t('.tb-dm'); check(d.includes('0.3293') && d.includes('Theta'), 'tree builder: K2P matrix (Alpha-Theta 0.3293)'); }
  check((await nwk()).includes('(Alpha:') && (await nwk()).includes('(Epsilon:') && (await nwk()).endsWith(';'), 'tree builder: Newick shown');
  await page.selectOption('.tbld .tb-d', 'jc'); await page.waitForTimeout(700);
  check((await t('.tb-dm')).includes('0.3282') && (await t('.tb-facts')).includes('0.7333'), 'tree builder: Jukes-Cantor = Biopython NJ');
  await page.selectOption('.tbld .tb-d', 'p'); await page.waitForTimeout(700);
  check((await t('.tb-dm')).includes('0.2658') && (await t('.tb-facts')).includes('0.6031'), 'tree builder: p-distance');
  await page.selectOption('.tbld .tb-g', 'complete'); await page.waitForTimeout(700);
  check((await t('.tb-facts')).includes('Columns used76 of 80'), 'tree builder: complete deletion');
  await page.selectOption('.tbld .tb-g', 'pairwise'); await page.selectOption('.tbld .tb-d', 'k2p');
  await page.selectOption('.tbld .tb-r', 'Theta'); await page.waitForTimeout(700);
  { const s = await nwk(); check((await t('.tb-facts')).includes('Rootoutgroup Theta') && (/^\(Theta:/.test(s) || /,Theta:[\d.]+\);$/.test(s)), `tree builder: outgroup root on Theta`); }
  await page.selectOption('.tbld .tb-m', 'upgma'); await page.waitForTimeout(700);
  check((await t('.tb-big')) === 'UPGMA tree of 8 sequences' && await page.isHidden('.tbld .tb-rw'), 'tree builder: UPGMA');
  { const s = await nwk(); check(s.includes('(Epsilon:0.02000474276,Zeta:0.02000474276)') || s.includes('(Zeta:0.02000474276,Epsilon:0.02000474276)'), 'tree builder: UPGMA ultrametric pair = half the K2P distance'); }
  await page.selectOption('.tbld .tb-m', 'mp'); await page.waitForTimeout(1200);
  check((await t('.tb-big')) === 'Most parsimonious tree: 52 changes' && (await t('.tb-facts')).includes('Informative sites2642 variable of 80') && (await t('.tb-facts')).includes('branch and bound (exact)') && (await t('.tb-facts')).includes('1 equally best'), 'tree builder: exact parsimony = Biopython brute force (52)');
  check(await page.isHidden('.tbld .tb-dmw') && await page.isVisible('.tbld .tb-sw'), 'tree builder: parsimony options');
  await page.selectOption('.tbld .tb-s', 'heuristic'); await page.waitForTimeout(900);
  check((await t('.tb-big')).endsWith('52 changes') && (await t('.tb-note')).includes('fast search'), 'tree builder: fast search finds 52 too');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.tbld .tb-dnwk')]); const f = OUT + 'tb.nwk'; await d.saveAs(f); const s = readFileSync(f, 'utf8').trim(); check(s.endsWith(';') && (s.match(/Alpha|Beta|Gamma|Delta|Epsilon|Zeta|Eta|Theta/g) || []).length === 8, 'tree builder: Newick download'); }
  await page.selectOption('.tbld .tb-m', 'nj'); await page.waitForTimeout(700);
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.tbld .tb-dcsv')]); const f = OUT + 'tb.csv'; await d.saveAs(f); const r = readFileSync(f, 'utf8').trim().split('\n'); check(r.length === 9 && r[1].startsWith('Alpha,0,') && r[1].split(',')[8].startsWith('0.32934244'), 'tree builder: distances CSV'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.tbld .dl [data-f="png"]')]); const f = OUT + 'tb.png'; await d.saveAs(f); check(readFileSync(f).slice(1, 4).toString() === 'PNG', 'tree builder: PNG report'); }
  writeFileSync(OUT + 'tb.fa', '>a\nACGTACGTAA\n>b\nACGTACGTTA\n>c\nACGAACGTTA\n>d\nTCGAACCTTA\n');
  await page.setInputFiles('.tbld .tb-file', OUT + 'tb.fa'); await page.waitForTimeout(800);
  check((await t('.tb-facts')).includes('Sequences4') && (await t('.tb-facts')).includes('10 columns'), 'tree builder: FASTA file opened');
  await page.fill('.tbld .tb-in', '>a\nACGT\n>b\nACG\n>c\nACGT'); await page.waitForTimeout(600);
  check((await t('.tb-err')).includes('not aligned') && await page.isHidden('.tbld .tb-out'), 'tree builder: unaligned message');
  await page.fill('.tbld .tb-in', '>a\nACGT\n>b\nACGA'); await page.waitForTimeout(600);
  check((await t('.tb-err')).includes('at least three'), 'tree builder: too few sequences');
  await page.fill('.tbld .tb-in', '>a\nMKLV\n>b\nMKLV\n>c\nMKIV'); await page.waitForTimeout(600);
  check((await t('.tb-err')).includes('protein'), 'tree builder: protein message');
  await page.fill('.tbld .tb-in', '>a\nAAAAAAAA\n>b\nCCCCCCCC\n>c\nAAAAAAAT'); await page.waitForTimeout(600);
  check((await t('.tb-err')).includes('too many for the Kimura'), 'tree builder: saturated distance message');
  await page.fill('.tbld .tb-in', '>a\nACGT\n>a\nACGA\n>c\nACGG'); await page.waitForTimeout(600);
  check((await t('.tb-err')).includes('used twice'), 'tree builder: duplicate names');
};
