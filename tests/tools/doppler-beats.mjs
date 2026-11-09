// #943 Doppler and beats
export const path = '/science/doppler-beats/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  const R = '.dpb ';
  const t = (s) => page.textContent(R + s);
  const set = async (sel, v) => { await page.fill(R + sel, v); await page.waitForTimeout(300); };
  const pick = async (sel, v) => { await page.selectOption(R + sel, v); await page.waitForTimeout(300); };
  await page.goto(`${BASE}/science/doppler-beats/`); await page.waitForTimeout(500);
  check((await t('.dp-big')) === 'Heard: 754.99 Hz (+54.99 Hz)', 'doppler: siren 700 Hz at 25 m/s → 754.99 Hz (NumPy)');
  { const f = await t('.dp-facts'); check(f.includes('+1.31 semitones') && f.includes('754.99 Hz → 652.47 Hz') && f.includes('2.53 semitones') && f.includes('343.21 m/s'), 'doppler: shift, pass-by pair, speed of sound'); }
  check(await page.isVisible(R + '.dp-fig') && await page.isHidden(R + '.dp-f1'), 'doppler: pass-by chart, beat inputs hidden');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.dp-csv')]); const f = OUT + 'pass.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows.length === 242 && rows[0] === 'time_s,frequency_hz', 'doppler: pass-by CSV'); }
  await set('.dp-meas', '754.99');
  check(/Source speed from the measured frequency25(\.0+)? m\/s towards/.test(await t('.dp-facts')), 'doppler: speed back from the measured frequency');
  await set('.dp-meas', ''); await pick('.dp-sd', '-1');
  check((await t('.dp-big')) === 'Heard: 652.47 Hz (−47.53 Hz)', 'doppler: receding siren');
  await pick('.dp-sd', '1'); await set('.dp-w', '10'); await set('.dp-vo', '3');
  check((await t('.dp-big')).startsWith('Heard: 759.72 Hz'), 'doppler: wind and moving listener 759.72 Hz (NumPy)');
  await set('.dp-w', '0'); await set('.dp-vo', '0'); await pick('.dp-u', '0.2777777777777778'); await set('.dp-vs', '90');
  check((await t('.dp-big')) === 'Heard: 754.99 Hz (+54.99 Hz)', 'doppler: 90 km/h is the same as 25 m/s');
  await set('.dp-vs', '1500');
  check((await t('.dp-big')).startsWith('Mach 1.21') && (await t('.dp-facts')).includes('55.5°'), 'doppler: supersonic source, Mach cone');
  await pick('.dp-u', '1'); await set('.dp-vs', '25'); await pick('.dp-med', 'water');
  check((await t('.dp-facts')).includes('1480 m/s'), 'doppler: water');
  await pick('.dp-med', 'own'); await set('.dp-c', 'fast');
  check((await t('.dp-err')).includes('wave speed') && await page.isHidden(R + '.dp-out'), 'doppler: bad wave speed message');
  await pick('.dp-med', 'air'); await set('.dp-f', '0');
  check((await t('.dp-err')).includes('frequency sent out'), 'doppler: bad frequency message');
  // Echo
  await set('.dp-f', '40000'); await pick('.dp-mode', 'echo');
  check((await t('.dp-big')) === 'Echo: 40468.91 Hz (+468.91 Hz)' && await page.isHidden(R + '.dp-vs'), 'doppler: bat echo 40468.91 Hz (NumPy)');
  await set('.dp-emeas', '40468.913');
  check(/Speed from the measured echo2(\.0+)? m\/s towards/.test(await t('.dp-facts')), 'doppler: echo speed back');
  await set('.dp-emeas', ''); await pick('.dp-med', 'radio'); await set('.dp-f', '10500000000'); await set('.dp-vt', '30');
  check((await t('.dp-big')).includes('(+2101.45 Hz)'), 'doppler: radar speed gun +2101.45 Hz at 30 m/s (NumPy)');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.dp-csv')]); const f = OUT + 'echo.csv'; await d.saveAs(f); check(readFileSync(f, 'utf8').startsWith('speed_towards_m_per_s,echo_shift_hz'), 'doppler: echo CSV'); }
  // Light
  await pick('.dp-mode', 'light');
  await pick('.dp-u', '1000');
  check((await t('.dp-big')) === 'Seen at 662.881 nm (redshift z = 0.01006)', 'doppler: H-alpha at 3000 km/s away → 662.881 nm');
  await set('.dp-lmeas', '662.8805');
  check(/Speed from the measured wavelength3000 km\/s away/.test(await t('.dp-facts')), 'doppler: speed from the measured wavelength');
  await pick('.dp-ld', '1');
  check((await t('.dp-big')).includes('blueshift'), 'doppler: blueshift');
  await set('.dp-vl', '400000');
  check((await t('.dp-err')).includes('below the speed of light'), 'doppler: faster than light message');
  await set('.dp-vl', '3000');
  // Beats
  await pick('.dp-mode', 'beats');
  check((await t('.dp-big')) === '3 beats per second' && (await t('.dp-facts')).includes('0.3333 s') && (await t('.dp-facts')).includes('441.5 Hz') && (await t('.dp-facts')).includes('11.8 cents'), 'doppler: beats 440/443 Hz');
  await set('.dp-f2', '440');
  check((await t('.dp-big')) === 'No beats: the tones are the same' && await page.isHidden(R + '.dp-fig'), 'doppler: equal tones');
  await set('.dp-f2', '-5');
  check((await t('.dp-err')).includes('both frequencies'), 'doppler: bad beat frequency');
  await set('.dp-f2', '443');
  for (const fmt of ['png', 'pdf', 'docx']) { const [d] = await Promise.all([page.waitForEvent('download'), page.click(`${R}.dl button[data-f=${fmt}]`)]); check(d.suggestedFilename() === `doppler-beats.${fmt}`, `doppler: ${fmt} download`); }
};
