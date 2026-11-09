// #941 standing waves
export const path = '/science/standing-waves/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  const R = '.stw ';
  const t = (s) => page.textContent(R + s);
  const set = async (sel, v) => { await page.fill(R + sel, v); await page.waitForTimeout(300); };
  const pick = async (sel, v) => { await page.selectOption(R + sel, v); await page.waitForTimeout(300); };
  await page.goto(`${BASE}/science/standing-waves/`); await page.waitForTimeout(500);
  check((await t('.sw-big')) === 'Fundamental 328.87 Hz (E4 −4.0 cents)', 'standing: example string 328.87 Hz, E4 −4.0 cents (SymPy)');
  { const f = await t('.sw-facts'); check(f.includes('0.3853 g/m') && f.includes('426.2 m/s') && f.includes('7.14 kg-force'), 'standing: μ, wave speed, kg-force'); }
  { const rows = await page.$$eval(R + '.sw-tab tbody tr', (r) => r.map((x) => x.textContent)); check(rows.length === 8 && rows[1].includes('657.74 Hz') && rows[1].includes('E5'), 'standing: 8 harmonics, 2nd at 657.74 Hz E5'); }
  check(await page.isVisible(R + '.sw-fig') && await page.isHidden(R + '.sw-pipe'), 'standing: chart, pipe inputs hidden');
  await pick('.sw-goal', 'tune');
  check((await t('.sw-big')) === 'Tension 70.32 N (7.17 kg-force) for 329.63 Hz' && await page.isHidden(R + '.sw-T'), 'standing: tension for E4 = 70.32 N (SymPy 70.3229)');
  await set('.sw-target', 'A4'); await set('.sw-a4', '432');
  check((await t('.sw-big')).endsWith('for 432.00 Hz'), 'standing: A4 = 432 tuning');
  await set('.sw-a4', '440'); await set('.sw-target', '196 Hz');
  check((await t('.sw-big')).endsWith('for 196.00 Hz'), 'standing: target in Hz');
  await set('.sw-target', 'H9');
  check((await t('.sw-err')).includes('note such as E4') && await page.isHidden(R + '.sw-out'), 'standing: bad note message');
  await set('.sw-target', 'E4'); await pick('.sw-goal', 'freq');
  await pick('.sw-mm', 'mu'); await set('.sw-muv', '0.3853359739');
  check((await t('.sw-big')) === 'Fundamental 328.87 Hz (E4 −4.0 cents)' && await page.isHidden(R + '.sw-d'), 'standing: mass per metre gives the same');
  await pick('.sw-mm', 'd'); await pick('.sw-rho', 'own'); await set('.sw-rhov', '1140');
  check(await page.isVisible(R + '.sw-rhov') && (await t('.sw-facts')).includes('0.05596 g/m'), 'standing: own density (nylon-like 1140)');
  await pick('.sw-rho', '7850'); await set('.sw-d', '0');
  check((await t('.sw-err')).includes('string diameter'), 'standing: bad diameter message');
  await set('.sw-d', '0.25');
  // Pipes
  await pick('.sw-sys', 'pipe');
  check((await t('.sw-big')) === 'Fundamental 280.56 Hz (C♯4 +21.0 cents)' && (await t('.sw-facts')).includes('611.7 mm') && (await t('.sw-facts')).includes('5.83 mm'), 'standing: open pipe 280.56 Hz with end corrections (SymPy)');
  await pick('.sw-pk', 'closed-open');
  { const rows = await page.$$eval(R + '.sw-tab tbody tr', (r) => r.map((x) => x.textContent)); check((await t('.sw-big')) === 'Fundamental 141.63 Hz (C♯3 +37.6 cents)' && rows[1].startsWith('23') && (await t('.sw-facts')).includes('odd only'), 'standing: closed one end, odd harmonics'); }
  await pick('.sw-pk', 'closed'); 
  check((await t('.sw-facts')).includes('no end correction') && (await t('.sw-big')).startsWith('Fundamental 286.01 Hz'), 'standing: closed both ends, no correction');
  await pick('.sw-pk', 'open'); await pick('.sw-end', 'flanged');
  check((await t('.sw-facts')).includes('7.81 mm'), 'standing: flanged end correction 0.8216 r');
  await pick('.sw-end', 'unflanged'); await pick('.sw-goal', 'tune'); await set('.sw-target', 'A4');
  check((await t('.sw-big')) === 'Pipe length 378.4 mm for 440.00 Hz', 'standing: pipe length for A4 = 378.4 mm');
  await set('.sw-target', '20000');
  check((await t('.sw-err')).includes('shorter than its end corrections'), 'standing: impossible length message');
  await set('.sw-target', 'A4'); await set('.sw-t', '100');
  check((await t('.sw-err')).includes('air temperature'), 'standing: bad temperature message');
  await set('.sw-t', '30');
  check((await t('.sw-big')) !== 'Pipe length 378.4 mm for 440.00 Hz', 'standing: warmer air needs a longer pipe');
  await set('.sw-t', '20'); await set('.sw-nh', '3');
  check((await page.$$eval(R + '.sw-tab tbody tr', (r) => r.length)) === 3, 'standing: 3 harmonics');
  await set('.sw-nh', '0');
  check((await t('.sw-err')).includes('1 to 64 harmonics'), 'standing: bad harmonic count');
  await set('.sw-nh', '8');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.sw-csv')]); const f = OUT + 'sw.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows.length === 9 && rows[0] === 'resonance,harmonic,frequency_hz,note,cents,wavelength_m' && rows[1].startsWith('1,1,440,A4,'), 'standing: harmonics CSV'); }
  for (const fmt of ['png', 'pdf', 'docx']) { const [d] = await Promise.all([page.waitForEvent('download'), page.click(`${R}.dl button[data-f=${fmt}]`)]); check(d.suggestedFilename() === `standing-waves.${fmt}`, `standing: ${fmt} download`); }
};
