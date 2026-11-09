// #634 modulation and BER simulator
export const path = '/science/constellation-ber/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  await page.goto(`${BASE}/science/constellation-ber/`); await page.waitForTimeout(1500);
  const R = '.cbr', t = (c) => page.textContent(`${R} ${c}`);
  check((await t('.cb-big')) === '16-QAM at 10 dB: BER 1.72 × 10⁻³ measured, 1.75 × 10⁻³ in theory', `ber: example (${await t('.cb-big')})`);
  { const f = await t('.cb-facts'); check(f.includes('687 in 400,000 bits') && f.includes('1.59 × 10⁻³ to 1.85 × 10⁻³') && f.includes('686 (SER 6.86 × 10⁻³)') && f.includes('exact for Gray coding') && f.includes('16.02 dB') && f.includes('14.4 dB'), 'ber: example facts'); }
  check(await page.isVisible(`${R} .cb-fig`) && await page.isVisible(`${R} .sw-fig`), 'ber: scatter and sweep charts');
  check((await page.$$(`${R} .sw-tab tbody tr`)).length === 15, 'ber: sweep table 0 to 14 dB');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(`${R} .sw-csv`)]); const f = OUT + 'ber.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows.length === 16 && rows[0] === 'ebn0_dB,bits,bit_errors,ber_sim,ber_theory,symbol_errors,ser_sim,ser_theory' && rows[1].startsWith('0,400000,'), 'ber: sweep CSV'); }
  await page.selectOption(`${R} .cb-mod`, 'bpsk'); await page.waitForTimeout(1500);
  check((await t('.cb-big')) === 'BPSK at 10 dB: BER 0 measured, 3.87 × 10⁻⁶ in theory' && (await t('.cb-facts')).includes('none seen'), `ber: BPSK no errors (${await t('.cb-big')})`);
  await page.fill(`${R} .cb-eb`, '4'); await page.waitForTimeout(1000);
  { const m = (await t('.cb-big')).match(/BER ([\d.]+) × 10⁻² measured, 1.25 × 10⁻² in theory/); check(!!m && Math.abs(+m[1] - 1.25) < 0.08, `ber: BPSK at 4 dB near theory (${await t('.cb-big')})`); }
  for (const [mod, name] of [['qpsk', 'QPSK'], ['8psk', '8-PSK'], ['64qam', '64-QAM']]) {
    await page.selectOption(`${R} .cb-mod`, mod); await page.waitForTimeout(1500);
    check((await t('.cb-big')).startsWith(`${name} at 4 dB`), `ber: ${name} runs`);
  }
  check((await t('.cb-facts')).includes('18.78 dB'), 'ber: 64-QAM needs 18.78 dB for 10⁻⁶');
  await page.selectOption(`${R} .cb-mod`, '8psk'); await page.waitForTimeout(1500);
  check((await t('.cb-facts')).includes('Gray approximation'), 'ber: 8-PSK BER labelled approximate');
  const before = await t('.cb-big');
  await page.fill(`${R} .cb-seed`, '2'); await page.waitForTimeout(1500);
  check((await t('.cb-big')) !== before, 'ber: new seed changes the noise');
  await page.fill(`${R} .cb-seed`, '1'); await page.waitForTimeout(1500);
  check((await t('.cb-big')) === before, 'ber: same seed repeats');
  await page.selectOption(`${R} .sw-n`, '20000'); await page.fill(`${R} .sw-s`, '2'); await page.waitForTimeout(1500);
  check((await page.$$(`${R} .sw-tab tbody tr`)).length === 8, 'ber: sweep step');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(`${R} .dl button[data-f=pdf]`)]); check((await d.suggestedFilename()) === 'modulation-ber.pdf', 'ber: PDF report'); }
  await page.fill(`${R} .sw-s`, '0.01'); await page.waitForTimeout(800);
  check((await t('.sw-err')).includes('60 points or fewer') && await page.isHidden(`${R} .sw-out`), 'ber: too many sweep points');
  await page.fill(`${R} .cb-eb`, '99'); await page.waitForTimeout(800);
  check((await t('.cb-err')).includes('between −10 and 40'), 'ber: Eb/N0 out of range');
};
