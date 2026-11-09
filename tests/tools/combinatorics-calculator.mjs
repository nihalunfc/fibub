// #557 combinatorics calculator
export const path = '/science/combinatorics-calculator/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  const P = '.cmb ';
  const facts = async () => Object.fromEntries(await page.$$eval(P + '.cmb-facts div', (ds) => ds.map((d) => [d.querySelector('dt').textContent, d.querySelector('dd').textContent])));
  const big = () => page.textContent(P + '.cmb-big');
  const mode = async (m) => { await page.locator(`${P}.cmb-modes button[data-m="${m}"]`).scrollIntoViewIfNeeded(); await page.click(`${P}.cmb-modes button[data-m="${m}"]`); await page.waitForTimeout(200); };
  const type = async (sel, v) => { await page.fill(P + sel, v); await page.waitForTimeout(450); };
  const csv = async (name) => { await page.locator(P + '.cmb-csv').scrollIntoViewIfNeeded(); const [d] = await Promise.all([page.waitForEvent('download'), page.click(P + '.cmb-csv')]); const f = OUT + name; await d.saveAs(f); return readFileSync(f, 'utf8').trim().split('\n'); };

  await page.goto(`${BASE}/science/combinatorics-calculator/`); await page.waitForTimeout(600);
  check((await big()) === 'C(10, 3) = 120', 'comb: example C(10, 3)');
  { const f = await facts(); check(f['Permutations nPk = n!/(n − k)!'] === '720' && f['With repetition, order matters n^k'] === '1 000' && f['With repetition, unordered C(n + k − 1, k)'] === '220' && f['n!'] === '3 628 800', 'comb: nPk, n^k, multiset, n!'); }
  { const rows = await csv('cmb-c.csv'); check(rows[1] === 'order matters,720,1000' && rows[2] === 'order does not matter,120,220', 'comb: 2 × 2 table CSV'); }
  await type('.cmb-n', '52'); await type('.cmb-k', '5');
  check((await big()) === 'C(52, 5) = 2 598 960', 'comb: poker hands');
  await type('.cmb-n', '5000'); await type('.cmb-k', '2500');
  { const b = await big(); check(b.includes('(1504 digits)') && (await facts())['Combinations C(n, k)'].includes('× 10^1503'), 'comb: C(5000, 2500) shortened, with scientific form'); }
  await page.click(P + '.cmb-full'); await page.waitForTimeout(300);
  check(/^C\(5000, 2500\) = \d{1504}$/.test(await big()), 'comb: show every digit');
  await page.click(P + '.cmb-full'); await type('.cmb-n', '5001');
  check((await page.textContent(P + '.cmb-err')).includes('5000') && await page.isHidden(P + '.cmb-out'), 'comb: n too large message');
  await type('.cmb-n', 'ten');
  check((await page.textContent(P + '.cmb-err')).includes('whole number'), 'comb: not a number message');

  await mode('m');
  check((await big()) === '11! / (1! 4! 4! 2!) = 34 650', 'comb: MISSISSIPPI multinomial');
  await type('.cmb-word', 'BANANA');
  check((await big()) === '6! / (1! 3! 2!) = 60', 'comb: word fills group sizes');
  await type('.cmb-ks', '2, x');
  check((await page.textContent(P + '.cmb-err')).includes('"x"'), 'comb: bad group size');

  await mode('s');
  { const f = await facts(); check((await big()) === 'p(10) = 42' && f['Bell number B(n)'] === '115 975' && f['Catalan number C(n)'] === '16 796' && f['Derangements !n'] === '1 334 961' && f['Chance a shuffle moves everything'].startsWith('!n / n! ≈ 0.367879'), 'comb: special numbers for 10'); }
  { const rows = await csv('cmb-s.csv'); check(rows.length === 12 && rows[0] === 'n,n!,Bell B(n),Catalan C(n),partitions p(n),derangements !n' && rows[6] === '5,120,52,42,7,44', 'comb: sequences CSV'); }
  await type('.cmb-sn', '1000');
  { const f = await facts(); check(f['Bell number B(n)'].includes('400') && f['Partitions p(n)'].includes('24 061 467 864 032 622 473 692 149 727 991'), 'comb: p(1000) and Bell limit'); }

  await mode('t');
  { const f = await facts(); check((await big()) === 'S(5, 2) = 15' && f['Row 5 sum'] === '52' && (await page.textContent(P + '.cmb-tab td.hi')) === '15', 'comb: Stirling S(5, 2) highlighted'); }
  await page.selectOption(P + '.cmb-tk', 's1'); await page.waitForTimeout(200);
  check((await big()) === 'c(5, 2) = 50' && (await facts())['Row 5 sum'] === '120', 'comb: Stirling first kind');
  await page.selectOption(P + '.cmb-tk', 'pascal'); await page.waitForTimeout(200);
  check((await big()) === 'C(5, 2) = 10', 'comb: Pascal');
  await page.selectOption(P + '.cmb-tk', 'lah'); await page.waitForTimeout(200);
  check((await big()) === 'L(5, 2) = 240', 'comb: Lah');
  await page.selectOption(P + '.cmb-tk', 'pk'); await type('.cmb-tn', '10'); await type('.cmb-tkk', '3');
  check((await big()) === 'p(10, 3) = 8' && (await facts())['Row 10 sum'] === '42', 'comb: partitions into k parts');
  await type('.cmb-tn', '30');
  { const rows = await csv('cmb-t.csv'); check(rows.length === 32 && rows[0].split(',').length === 32 && (await page.$$(P + '.cmb-tab tbody tr')).length === 20, 'comb: triangle CSV has every row, page shows 20'); }
  await type('.cmb-tn', '401');
  check((await page.textContent(P + '.cmb-err')).includes('400'), 'comb: triangle limit');
  await type('.cmb-tn', '6');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(P + '.dl [data-f="docx"]')]); check((await d.suggestedFilename()).endsWith('.docx'), 'comb: Word download'); }
};
