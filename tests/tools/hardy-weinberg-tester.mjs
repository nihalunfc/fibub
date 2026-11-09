// #206 Hardy-Weinberg tester
export const path = '/science/hardy-weinberg-tester/';
export default async ({ page, check, BASE, OUT, readFileSync, writeFileSync }) => {
  const R = '.hwt ';
  await page.goto(`${BASE}/science/hardy-weinberg-tester/`); await page.waitForTimeout(600);
  const big = () => page.textContent(R + '.hw-big'), facts = () => page.textContent(R + '.hw-facts'), err = () => page.textContent(R + '.hw-err');
  const set = async (sel, v) => { await page.fill(R + sel, v); await page.waitForTimeout(400); };
  check((await big()) === 'Exact p = 0.000109: out of Hardy-Weinberg (too many heterozygotes)', `hwe: example (${await big()})`);
  { const f = await facts(); check(f.includes('−0.4051') && f.includes('16.41, p = 5.11 × 10⁻⁵') && f.includes('p = 5.67 × 10⁻⁵') && f.includes('Exact, too few heterozygotesp = 1.00'), 'hwe: example facts'); }
  { const t = await page.textContent(R + '.hw-tab'); check(t.includes('22.09') && t.includes('49.82') && t.includes('28.09'), 'hwe: expected counts'); }
  check(await page.isVisible(R + '.hw-tri') && await page.isVisible(R + '.hw-dist'), 'hwe: de Finetti diagram and exact distribution');
  await page.locator(R + '.hw-yates').scrollIntoViewIfNeeded(); await page.click(R + '.hw-yates'); await page.waitForTimeout(400);
  check((await facts()).includes('Chi-square (Yates)15.21, p = 9.61 × 10⁻⁵') && (await page.textContent(R + '.hw-tab')).includes('(|O − E| − ½)²/E'), 'hwe: continuity correction');
  await page.click(R + '.hw-yates');
  await set('.hw-names', 'C, T');
  check((await page.textContent(R + '.hw-two')).includes('CT') && (await page.textContent(R + '.hw-tab')).includes('TT'), 'hwe: allele names');
  await set('.hw-aa', '10'); await set('.hw-ab', '40'); await set('.hw-bb', '50');
  check((await big()) === 'Exact p = 0.637: consistent with Hardy-Weinberg' && (await facts()).includes('0.04762'), 'hwe: sample in equilibrium');
  await set('.hw-aa', '1'); await set('.hw-ab', '0'); await set('.hw-bb', '3');
  check((await page.textContent(R + '.hw-note')).includes('below 5'), 'hwe: small expected count note');
  await set('.hw-ab', '1.5');
  check((await err()).includes('whole numbers') && await page.isHidden(R + '.hw-out'), 'hwe: bad count message');
  await set('.hw-ab', '0'); await set('.hw-bb', '0');
  check((await err()).includes('Only one allele'), 'hwe: one allele message');
  await set('.hw-aa', '12'); await set('.hw-ab', '70'); await set('.hw-bb', '18');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.hw-csv')]); const f = OUT + 'hwe.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n');
    check(rows[0].startsWith('Genotype,Observed,Expected') && rows[1].startsWith('CC,12,22.09') && rows.some((r) => r.startsWith('Inbreeding coefficient F,−0.4051')), `hwe: CSV (${rows[1]})`); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.dl button[data-f=png]')]); const f = OUT + 'hwe.png'; await d.saveAs(f); check(readFileSync(f).subarray(1, 4).toString() === 'PNG', 'hwe: image report'); }
  // Three or more alleles
  await page.locator(R + '.hw-mode button[data-m=multi]').scrollIntoViewIfNeeded(); await page.click(R + '.hw-mode button[data-m=multi]'); await page.waitForTimeout(400);
  check((await big()) === 'Chi-square p = 0.235: consistent with Hardy-Weinberg' && (await facts()).includes('4.254') && (await facts()).includes('3 degrees of freedom') && (await facts()).includes('0.1179'), `hwe: three alleles (${await big()})`);
  check(await page.isHidden(R + '.hw-figs') && (await page.textContent(R + '.hw-tab')).includes('B/C'), 'hwe: three alleles table, no diagram');
  await set('.hw-mdata', 'A/A 20\nB/A 25\nA/C 15\nB/B 12\nC/B 18\nC/C 10');
  check((await facts()).includes('4.254'), 'hwe: genotype written either way round');
  writeFileSync(OUT + 'hwe-in.csv', 'genotype,count\n1/1,30\n1/2,40\n2/2,10\n1/3,12\n2/3,6\n3/3,2\n');
  await page.setInputFiles(R + '.dfb-in', OUT + 'hwe-in.csv'); await page.waitForTimeout(600);
  check((await big()).startsWith('Chi-square p = ') && (await facts()).includes('1 0.56'), 'hwe: CSV file opened');
  await set('.hw-mdata', 'A-B 25');
  check((await err()).includes('slash'), 'hwe: bad genotype message');
  await set('.hw-mdata', 'A/A 20\nA/B 25\nB/B 12');
  check(await page.isHidden(R + '.hw-err') && (await facts()).includes('1 degree of freedom'), 'hwe: two alleles typed as rows');
};
