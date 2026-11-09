// #313 Effective population size
export const path = '/science/effective-population-size/';
export default async ({ page, check, BASE, OUT, readFileSync, writeFileSync }) => {
  const R = '.nes ';
  await page.goto(`${BASE}/science/effective-population-size/`); await page.waitForTimeout(600);
  const big = () => page.textContent(R + '.ne-big'), facts = () => page.textContent(R + '.ne-facts'), err = () => page.textContent(R + '.ne-err');
  const mode = async (m) => { await page.locator(`${R}.ne-mode button[data-m=${m}]`).scrollIntoViewIfNeeded(); await page.click(`${R}.ne-mode button[data-m=${m}]`); await page.waitForTimeout(200); };
  const set = async (sel, v) => { await page.fill(R + sel, v); await page.waitForTimeout(400); };
  check((await big()) === 'Ne = 36' && (await facts()).includes('Ne / N0.36'), `ne: sex ratio example (${await big()})`);
  await set('.ne-nm', '50'); await set('.ne-nf', '50');
  check((await big()) === 'Ne = 100', 'ne: equal sexes');
  await set('.ne-nm', '0');
  check((await err()).includes('at least one breeding male') && await page.isHidden(R + '.ne-out'), 'ne: sex ratio bad input');
  await set('.ne-nm', '10');
  await mode('fluct');
  check((await big()) === 'Ne = 161.7' && (await facts()).includes('588'), `ne: harmonic mean example (${await big()})`);
  await set('.ne-sizes', '100, 0');
  check((await err()).includes('size above zero'), 'ne: harmonic bad input');
  await set('.ne-sizes', '100 100 100');
  check((await big()) === 'Ne = 100', 'ne: constant size');
  await mode('family');
  check((await big()) === 'Ne = 49.75', 'ne: family size example');
  await page.selectOption(R + '.ne-fsrc', 'list'); await page.waitForTimeout(400);
  check((await big()) === 'Ne = 9.916' && (await facts()).includes('2.639') && await page.isHidden(R + '.ne-fn'), `ne: offspring list (${await big()})`);
  await set('.ne-klist', '1, 2.5');
  check((await err()).includes('whole number of offspring'), 'ne: offspring list bad input');
  await page.selectOption(R + '.ne-fsrc', 'vk'); await set('.ne-vk', '2');
  check((await big()) === 'Ne = 99.5' && (await facts()).includes('Poisson'), 'ne: Poisson family sizes');
  await mode('temporal');
  check((await big()) === 'Ne = 128.9 (95 % interval 35.65 to 488.4)', `ne: temporal example (${await big()})`);
  { const f = await facts(); check(f.includes('0.0294') && f.includes('Independent alleles n′12'), 'ne: temporal facts'); }
  check((await page.textContent(R + '.ne-tab')).includes('L1130.5 / 0.3 / 0.20.42 / 0.38 / 0.2'), 'ne: per-locus table with the three-allele locus');
  await page.selectOption(R + '.ne-plan', '2'); await page.waitForTimeout(400);
  check((await big()).startsWith('Ne = 116.8') && await page.isVisible(R + '.ne-cn'), 'ne: sampling plan II');
  await page.selectOption(R + '.ne-plan', '1'); await page.selectOption(R + '.ne-conf', '0.9'); await page.waitForTimeout(400);
  check((await big()).startsWith('Ne = 128.9 (90 % interval'), 'ne: 90 % interval');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.ne-csv')]); const f = OUT + 'ne.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n');
    check(rows[0] === 'Quantity,Value' && rows[1].startsWith('Ne,128.9') && rows.some((r) => r.startsWith('Locus,Alleles,Start,Later,Fc')) && rows[rows.length - 1].startsWith('L11,3,'), 'ne: temporal CSV'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.dl button[data-f=png]')]); const f = OUT + 'ne.png'; await d.saveAs(f); check(readFileSync(f).subarray(1, 4).toString() === 'PNG', 'ne: image report'); }
  await set('.ne-s0', '20'); await set('.ne-st', '20');
  check((await big()) === 'Ne = infinite' && (await facts()).includes('too large to measure'), 'ne: no measurable drift');
  await set('.ne-s0', '100'); await set('.ne-st', '100');
  await set('.ne-tdata', 'L1\t1.4\t0.3');
  check((await err()).includes('between 0 and 1'), 'ne: bad frequency message');
  await set('.ne-tdata', 'L1 a\t0.8\t0.3\nL1 b\t0.6\t0.7');
  check((await err()).includes('add up to more than 1'), 'ne: alleles over 1 message');
  writeFileSync(OUT + 'ne-in.csv', 'locus,p0,pt\nA,0.5,0.3\nB,0.4,0.6\nC,0.2,0.35\n');
  await page.setInputFiles(R + '.dfb-in', OUT + 'ne-in.csv'); await page.waitForTimeout(600);
  check((await big()).startsWith('Ne = ') && await page.isHidden(R + '.ne-err') && (await page.textContent(R + '.ne-tab')).includes('C2'), 'ne: CSV file opened');
};
