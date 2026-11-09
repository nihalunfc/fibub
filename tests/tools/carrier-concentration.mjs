// #862 Carrier concentration and Fermi level
export const path = '/science/carrier-concentration/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  const R = '.carc ';
  const txt = (s) => page.textContent(R + s);
  const big = () => txt('.cc-big');
  await page.goto(`${BASE}${path}`); await page.waitForTimeout(800);
  check((await big()) === 'n-type at 300 K: EF is 0.206 eV below Ec; n = 9.96 × 10¹⁵, p = 7213 cm⁻³', `carriers: example headline (${await big()})`);
  { const f = await txt('.cc-facts'); check(f.includes('1.1226 eV') && f.includes('2.895 × 10¹⁹, 1.796 × 10¹⁹') && f.includes('8.477 × 10⁹') && f.includes('0.9165 eV above Ev') && f.includes('99.61 %') && f.includes('extrinsic') && f.includes('132.1 K') && f.includes('655.3 K'), 'carriers: example facts (gap, Nc, Nv, ni, EF, ionised share, freeze-out and intrinsic temperatures)'); }
  check(await page.isVisible(R + '.cc-fig1') && await page.isVisible(R + '.cc-fig2'), 'carriers: both plots drawn');
  check((await txt('.cc-fout')).startsWith('F½(2) = 2.82372'), 'carriers: F½ box at η = 2');
  await page.fill(R + '.cc-eta', '-10'); await page.waitForTimeout(100);
  check((await txt('.cc-fout')).includes('Boltzmann e^η = 4.53999 × 10⁻⁵'), 'carriers: F½ box non-degenerate');
  await page.fill(R + '.cc-t', '77'); await page.waitForTimeout(500);
  check((await big()).includes('n = 3.67 × 10¹⁵') && (await txt('.cc-facts')).includes('freeze-out'), `carriers: 77 K freeze-out (${await big()})`);
  await page.fill(R + '.cc-t', '900'); await page.waitForTimeout(500);
  check((await txt('.cc-facts')).includes('Regionintrinsic'), 'carriers: 900 K intrinsic');
  await page.fill(R + '.cc-t', '300'); await page.fill(R + '.cc-nd', '0'); await page.fill(R + '.cc-na', '1e17'); await page.waitForTimeout(500);
  check((await big()).startsWith('p-type at 300 K: EF is 0.137 eV above Ev'), `carriers: p-type with acceptors (${await big()})`);
  await page.fill(R + '.cc-nd', '3e16'); await page.fill(R + '.cc-na', '1e16'); await page.waitForTimeout(500);
  check((await txt('.cc-note')).includes('Compensated') && (await txt('.cc-facts')).includes('Ionised acceptors'), 'carriers: compensated note');
  await page.fill(R + '.cc-nd', '0'); await page.fill(R + '.cc-na', '0'); await page.waitForTimeout(500);
  check((await big()).startsWith('Intrinsic at 300 K') && (await txt('.cc-facts')).includes('undoped'), 'carriers: undoped');
  // Degenerate GaAs-like.
  await page.selectOption(R + '.cc-pre', 'gaas'); await page.fill(R + '.cc-nd', '1e19'); await page.waitForTimeout(500);
  check((await big()).includes('above Ec (inside the conduction band)') && (await big()).includes('n = 5.13 × 10¹⁷') && (await txt('.cc-note')).includes('degenerate'), `carriers: degenerate Fermi-Dirac (${await big()})`);
  await page.selectOption(R + '.cc-st', 'boltzmann'); await page.waitForTimeout(400);
  check((await big()).includes('n = 6.18 × 10¹⁷') && (await txt('.cc-note')).includes('switch to Fermi-Dirac'), `carriers: Boltzmann overestimates (${await big()})`);
  await page.selectOption(R + '.cc-st', 'fd');
  await page.fill(R + '.cc-me', '0.08'); await page.waitForTimeout(400);
  check((await page.inputValue(R + '.cc-pre')) === 'own', 'carriers: editing a value switches to your own values');
  await page.selectOption(R + '.cc-pre', 'ge'); await page.fill(R + '.cc-nd', '1e16'); await page.waitForTimeout(400);
  check((await page.inputValue(R + '.cc-eg0')) === '0.74' && (await txt('.cc-facts')).includes('0.6582 eV'), 'carriers: germanium-like preset');
  // CSV.
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.cc-csv')]); const f = OUT + 'carriers.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows.length === 161 && rows[0].startsWith('T_K,Eg_eV,Nc_cm3') && rows[1].startsWith('20,') && rows[160].startsWith('1000,') && rows[1].endsWith('freeze-out') && rows[160].endsWith('intrinsic'), 'carriers: sweep CSV'); }
  // Bad input.
  await page.fill(R + '.cc-nd', 'lots'); await page.waitForTimeout(400);
  check((await txt('.cc-err')).includes('Dopant densities') && await page.isHidden(R + '.cc-out'), 'carriers: bad density');
  await page.fill(R + '.cc-nd', '1e16'); await page.fill(R + '.cc-ed', '2'); await page.waitForTimeout(400);
  check((await txt('.cc-err')).includes('inside the band gap'), 'carriers: dopant level outside the gap');
  await page.fill(R + '.cc-ed', '0.045'); await page.fill(R + '.cc-t1', '10'); await page.waitForTimeout(400);
  check((await txt('.cc-err')).includes('sweep'), 'carriers: bad sweep range');
  await page.fill(R + '.cc-t1', '1000'); await page.fill(R + '.cc-al', '5'); await page.fill(R + '.cc-be', '1'); await page.waitForTimeout(400);
  check((await txt('.cc-err')).includes('gap closes'), 'carriers: gap closing');
  await page.fill(R + '.cc-al', '0.5'); await page.fill(R + '.cc-me', '0'); await page.waitForTimeout(400);
  check((await txt('.cc-err')).includes('effective masses'), 'carriers: bad mass');
  await page.fill(R + '.cc-me', '0.55'); await page.fill(R + '.cc-be', '250'); await page.fill(R + '.cc-t', '0'); await page.waitForTimeout(400);
  check((await txt('.cc-err')).includes('temperature is between'), 'carriers: bad temperature');
};
