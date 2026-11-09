// #421 tuning system and cents calculator
export const path = '/science/tuning-calculator/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  const R = '.tun ', big = () => page.textContent(R + '.tu-big'), facts = () => page.textContent(R + '.tu-facts'), tab = () => page.textContent(R + '.tu-tab');
  await page.goto(`${BASE}${path}`); await page.waitForTimeout(500);
  check((await big()) === '1/4 comma meantone on C: C4 = 263.18 Hz (A4 = 440 Hz)', 'tuning: quarter-comma meantone on C');
  { const f = await facts(); check(f.includes('Major third386.31 ¢0.00 ¢ from pure 5/4') && f.includes('Fifth696.58 ¢−5.38 ¢ from pure 3/2') && f.includes('Wolf fifth G♯–E♭737.64 ¢+35.68 ¢ from pure'), 'tuning: thirds, fifth and wolf'); }
  { const t = await tab(); check(t.includes('889.74') && t.includes('440.00') && t.includes('526.36') && t.includes('C (octave)') && await page.isVisible(R + '.tu-fig'), 'tuning: table and chart'); }
  check((await page.textContent(R + '.tu-cbig')) === '701.96 ¢' && (await page.textContent(R + '.tu-cnote')).includes('perfect fifth 3/2, 0.00 ¢'), 'tuning: 440 to 660 Hz is a pure fifth');
  await page.selectOption(R + '.tu-sys', 'just'); await page.waitForTimeout(200);
  check((await big()).startsWith('Just intonation (5-limit) on C: C4 = 264.00 Hz') && (await tab()).includes('45/32') && await page.isHidden(R + '.tu-below'), 'tuning: just intonation C4 = 264');
  await page.selectOption(R + '.tu-sys', 'pyth'); await page.waitForTimeout(200);
  check((await big()).includes('C4 = 260.74 Hz') && (await tab()).includes('6561/4096') && (await facts()).includes('Pythagorean comma23.46 ¢') && (await facts()).includes('Wolf fifth G♯–E♭678.49 ¢'), 'tuning: Pythagorean');
  await page.selectOption(R + '.tu-below', '1'); await page.waitForTimeout(200);
  check((await facts()).includes('Wolf fifth A♯') || (await facts()).includes('Wolf fifth B'), 'tuning: moving the chain moves the wolf');
  await page.selectOption(R + '.tu-sys', 'meantone'); await page.selectOption(R + '.tu-below', '3'); await page.selectOption(R + '.tu-frac', '0.166666666667'); await page.waitForTimeout(200);
  check((await facts()).includes('Fifth698.37 ¢'), 'tuning: sixth-comma meantone fifth 698.37');
  await page.selectOption(R + '.tu-sys', 'edo'); await page.waitForTimeout(200);
  check((await big()) === '12-tone equal temperament (12-TET) on C: C4 = 261.63 Hz (A4 = 440 Hz)' && (await tab()).includes('B♭'), '12-TET');
  await page.fill(R + '.tu-n', '31'); await page.waitForTimeout(400);
  check((await big()).startsWith('31-tone equal temperament on C') && (await tab()).includes('step 25') && (await tab()).includes('7/4 harmonic seventh') && (await page.textContent(R + '.tu-help')).includes('38.71'), 'tuning: 31-EDO');
  await page.fill(R + '.tu-n', '0'); await page.waitForTimeout(400);
  check((await page.textContent(R + '.tu-err')).includes('whole number from 1 to 72') && await page.isHidden(R + '.tu-out'), 'tuning: bad steps message');
  await page.fill(R + '.tu-n', '12'); await page.selectOption(R + '.tu-sys', 'just'); await page.selectOption(R + '.tu-tonic', '2'); await page.fill(R + '.tu-rhz', '415'); await page.waitForTimeout(400);
  check((await big()) === 'Just intonation (5-limit) on D: D4 = 276.67 Hz (A4 = 415 Hz)', 'tuning: tonic D with A = 415');
  await page.fill(R + '.tu-rhz', '-1'); await page.waitForTimeout(400);
  check((await page.textContent(R + '.tu-err')).includes('above 0 Hz'), 'tuning: bad reference message');
  await page.fill(R + '.tu-rhz', '440'); await page.waitForTimeout(400);
  // Sound: buttons make tones without errors.
  await page.locator(R + '.tu-tab button').first().scrollIntoViewIfNeeded(); await page.click(R + '.tu-tab button >> nth=4'); await page.waitForTimeout(200);
  check((await page.textContent(R + '.tu-now')) === 'Playing F♯ (366.67 Hz).', 'tuning: play one note');
  await page.click(R + '.tu-triad'); await page.waitForTimeout(100);
  check((await page.textContent(R + '.tu-now')).startsWith('Playing D 293.33 Hz, F♯ 366.67 Hz, A 440.00 Hz together'), 'tuning: play the triad');
  await page.selectOption(R + '.tu-wave', 'sine'); await page.click(R + '.tu-scale'); await page.waitForTimeout(100);
  check((await page.textContent(R + '.tu-now')).startsWith('Playing the 12-note scale from D'), 'tuning: play the scale (sine)');
  await page.click(R + '.tu-stop'); check((await page.textContent(R + '.tu-now')) === 'Stopped.', 'tuning: stop');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.tu-csv')]); const f = OUT + 'tuning.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows.length === 14 && rows[0].startsWith('note,ratio,cents') && rows[8].startsWith('A,3/2,701.9550') && rows[8].includes(',440.0000,'), 'tuning: CSV'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.dl [data-f=pdf]')]); check((await d.suggestedFilename()).endsWith('.pdf'), 'tuning: PDF'); }
  // Cents box.
  await page.fill(R + '.tu-a', '5/4'); await page.fill(R + '.tu-b', '3:2'); await page.fill(R + '.tu-c', '386.3137'); await page.waitForTimeout(400);
  check((await page.textContent(R + '.tu-cbig')) === '315.64 ¢' && (await page.textContent(R + '.tu-cnote')).includes('minor third 6/5') && (await page.textContent(R + '.tu-cnote')).includes('ratio of 1.250000'), 'tuning: cents between ratios and cents to ratio');
  await page.fill(R + '.tu-b', 'abc'); await page.waitForTimeout(400);
  check((await page.textContent(R + '.tu-cnote')).startsWith('Type two ratios or two frequencies'), 'tuning: bad ratio message');
};
