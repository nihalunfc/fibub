// #495 audiogram plotter
export const path = '/science/audiogram/';
export default async ({ page, check, BASE, OUT, readFileSync, writeFileSync }) => {
  await page.goto(`${BASE}/science/audiogram/`); await page.waitForTimeout(600);
  const big = () => page.textContent('.au .au-big'), facts = () => page.textContent('.au .au-facts'), flags = () => page.textContent('.au .au-flags');
  check((await page.textContent('.au .au-warn')).includes('not medical advice') && (await page.textContent('.au .au-warn')).includes('not a hearing test'), 'audiogram: medical and not-a-test note');
  check((await big()) === 'Right: mild (PTA4 33.8 dB HL) · Left: moderate (PTA4 40 dB HL)', `audiogram: example grades (${await big()})`);
  { const f = await facts(); check(f.includes('26.7 dB HL') && f.includes('41.7 dB HL') && f.includes('conductive') && f.includes('sensorineural') && f.includes('Right: Mild'), 'audiogram: example PTAs, types, better ear'); }
  { const f = await flags(); check(f.includes('Left ear: air-bone gap of 15 dB or more at 500 Hz (30 dB)') && f.includes('left ear is 15 dB or more worse at 3 adjacent frequencies (250, 500, 1k Hz)'), 'audiogram: gap and asymmetry flags'); }
  check((await page.textContent('.au .au-cite')).includes('World report on hearing') && (await page.textContent('.au .au-cite')).includes('Check the official source'), 'audiogram: scheme source shown');
  check(await page.isVisible('.au .au-fig') && (await page.textContent('.au .au-tab')).includes('15m'), 'audiogram: figure and table');
  await page.selectOption('.au .au-scheme', 'clark1981'); await page.waitForTimeout(200);
  check((await big()) === 'Right: mild (PTA3 26.7 dB HL) · Left: moderate (PTA3 41.7 dB HL)' && (await page.textContent('.au .au-cite')).includes('Clark JG (1981)'), 'audiogram: Clark 1981 with PTA3');
  await page.selectOption('.au .au-pta', '4'); await page.waitForTimeout(200);
  check((await big()).includes('Right: mild (PTA4 33.8') && (await big()).includes('Left: mild (PTA4 40'), 'audiogram: Clark with PTA4 (40 is up to and including mild)');
  await page.fill('.au .au-cut', 'Fine < 30\nNot fine'); await page.waitForTimeout(500);
  check((await page.inputValue('.au .au-scheme')) === 'custom' && (await big()).startsWith('Right: not fine') && (await big()).includes('Left: not fine'), 'audiogram: own cutoffs');
  await page.fill('.au .au-cut', 'A < 30\nB < 20\nC'); await page.waitForTimeout(500);
  check((await page.textContent('.au .au-err')).includes('rise') && await page.isHidden('.au .au-out'), 'audiogram: bad cutoffs message');
  await page.selectOption('.au .au-scheme', 'who2021'); await page.waitForTimeout(200);
  await page.fill('.au .au-gap', '40'); await page.waitForTimeout(500);
  check(!(await flags()).includes('air-bone gap') && (await facts()).includes('sensorineural'), 'audiogram: gap limit');
  await page.fill('.au .au-gap', '15'); await page.fill('.au .au-ad', '25'); await page.waitForTimeout(500);
  check((await flags()).includes('No asymmetry by your rule (25 dB'), 'audiogram: asymmetry rule');
  await page.fill('.au .au-ad', '15'); await page.fill('.au .au-an', '4'); await page.waitForTimeout(500);
  check((await flags()).includes('No asymmetry'), 'audiogram: asymmetry count');
  await page.fill('.au .au-an', '0'); await page.waitForTimeout(500);
  check((await page.textContent('.au .au-err')).includes('whole number'), 'audiogram: bad setting message');
  await page.fill('.au .au-an', '2'); await page.fill('.au .au-norm', '10'); await page.waitForTimeout(500);
  check((await facts()).includes('mixed'), 'audiogram: normal limit changes the type (left becomes mixed)');
  await page.fill('.au .au-norm', '20');
  await page.fill('.au .au-in', '0.5 kHz,50,105NR,45m,\n1,55,110NR,50,\n2,60,110NR,,\n4,65,110NR,,\n3,22,30,,'); await page.waitForTimeout(500);
  check((await big()).includes('Right: moderately severe (PTA4 57.5') && (await big()).includes('Left: complete or total (PTA4 109') && (await facts()).includes('or more') && (await page.textContent('.au .au-note')).includes('not a 5 dB step'), 'audiogram: NR, masked, kHz and 5 dB note');
  await page.fill('.au .au-in', '500,20\n500,30'); await page.waitForTimeout(500);
  check((await page.textContent('.au .au-err')).includes('listed twice'), 'audiogram: duplicate frequency message');
  await page.fill('.au .au-in', '500,abc'); await page.waitForTimeout(500);
  check((await page.textContent('.au .au-err')).includes('not a threshold'), 'audiogram: bad threshold message');
  await page.fill('.au .au-in', '500,20\n1000,25'); await page.waitForTimeout(500);
  check((await big()).includes('no PTA4') && (await facts()).includes('missing 2k, 4k Hz'), 'audiogram: missing frequencies');
  await page.fill('.au .au-in', 'Hz,R air,L air,R bone,L bone\n500,20,40,15,10\n1000,25,45,20,10\n2000,35,40,30,15\n4000,55,35,50,15'); await page.waitForTimeout(500);
  await page.locator('.au .au-csv').scrollIntoViewIfNeeded();
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.au .au-csv')]); const f = OUT + 'audiogram.csv'; await d.saveAs(f); const r = readFileSync(f, 'utf8').trim().split('\n'); check(r.length === 5 && r[0].startsWith('frequency_hz,right_air') && r[1] === '500,20,40,15,10,5,30,-20', `audiogram: CSV (${r[1]})`); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.au .dl [data-f=png]')]); const f = OUT + 'audiogram.png'; await d.saveAs(f); check(readFileSync(f).length > 20000, 'audiogram: PNG report'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.au .dl [data-f=pdf]')]); const f = OUT + 'audiogram.pdf'; await d.saveAs(f); check(readFileSync(f).slice(0, 4).toString() === '%PDF', 'audiogram: PDF report'); }
  writeFileSync(OUT + 'aud.csv', 'Hz,R,L\n500,30,30\n1000,30,30\n2000,30,30\n4000,30,30\n');
  await page.setInputFiles('.au .dfb-in', OUT + 'aud.csv'); await page.waitForTimeout(600);
  check((await big()) === 'Right: mild (PTA4 30 dB HL) · Left: mild (PTA4 30 dB HL)', 'audiogram: open a file');
};
