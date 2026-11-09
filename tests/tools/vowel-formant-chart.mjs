import { synthVowel } from '../../src/lib/sci/formant.ts';
import { writeWav } from '../../src/lib/sci/formant-audio.ts';

export const path = '/science/vowel-formant-chart/';
export default async ({ page, check, BASE, OUT, readFileSync, writeFileSync }) => {
  const dl = async (sel) => { const [d] = await Promise.all([page.waitForEvent('download'), page.click(sel)]); const p = OUT + d.suggestedFilename(); await d.saveAs(p); return p; };
  await page.goto(BASE + path);
  await page.waitForSelector('.vf-means tbody tr');
  check((await page.$$('.vf-means tbody tr')).length === 10, 'vowel chart: made-up table gives 10 speaker-vowel means');
  check(/A\s*i\s*2\s*300\s*2215\s*2925/.test(await page.textContent('.vf-means tbody tr:first-child')), `vowel chart: mean of A's [i] (${await page.textContent('.vf-means tbody tr:first-child')})`);

  await page.click('.vf-ex');
  await page.waitForFunction(() => /F1 \d+ Hz/.test(document.querySelector('.vf-big')?.textContent || ''));
  check((await page.$$('.vf-spans button')).length === 3, 'vowel chart: example has three loud stretches');
  const big = await page.textContent('.vf-big');
  const m = big.match(/F1 (\d+) Hz, F2 (\d+) Hz, F3 (\d+) Hz/);
  check(m && Math.abs(+m[1] - 300) < 15 && Math.abs(+m[2] - 2300) < 50 && Math.abs(+m[3] - 3000) < 60, `vowel chart: [i] measured (${big})`);
  await page.click('.vf-spans button >> nth=1');
  const big2 = await page.textContent('.vf-big'), m2 = big2.match(/F1 (\d+) Hz, F2 (\d+) Hz/);
  check(m2 && Math.abs(+m2[1] - 750) < 40 && Math.abs(+m2[2] - 1300) < 50, `vowel chart: [a] measured (${big2})`);
  await page.fill('.vf-lab', 'a'); await page.fill('.vf-spk', 'C');
  await page.click('.vf-add');
  check(/\na\t7\d\d\t1[23]\d\d\t2\d\d\d\tC$/.test(await page.inputValue('.vf-tab')), 'vowel chart: measurement added to the table');
  check(/C\s*a\s*1/.test(await page.textContent('.vf-means')), 'vowel chart: added vowel in the means table');
  // Settings change the analysis.
  await page.selectOption('.vf-n', '4');
  check(/F1 \d+ Hz/.test(await page.textContent('.vf-big')), 'vowel chart: re-analysed with 4 formants');
  await page.selectOption('.vf-n', '5');
  await page.fill('.vf-win', '2'); await page.dispatchEvent('.vf-win', 'change');
  check(/between 5 and 100 ms/.test(await page.textContent('.vf-err')), 'vowel chart: bad window explained');
  await page.fill('.vf-win', '25'); await page.dispatchEvent('.vf-win', 'change');
  check(await page.isHidden('.vf-err'), 'vowel chart: error cleared');
  // Typed and dragged stretches.
  await page.fill('.vf-t0', '1.30'); await page.fill('.vf-t1', '1.40'); await page.dispatchEvent('.vf-t1', 'change');
  const m3 = (await page.textContent('.vf-big')).match(/F1 (\d+) Hz, F2 (\d+) Hz/);
  check(m3 && Math.abs(+m3[2] - 800) < 60, `vowel chart: typed stretch gives [u] (${m3 && m3[0]})`);
  await page.locator('.vf-wave').scrollIntoViewIfNeeded();
  const box = await page.locator('.vf-wave').boundingBox(), xAt = (t) => box.x + 44 + (t / 1.65) * (box.width - 52);
  await page.mouse.move(xAt(0.25), box.y + 100); await page.mouse.down(); await page.mouse.move(xAt(0.35), box.y + 100, { steps: 4 }); await page.mouse.up();
  const t0 = +(await page.inputValue('.vf-t0')), t1 = +(await page.inputValue('.vf-t1'));
  check(Math.abs(t0 - 0.25) < 0.03 && Math.abs(t1 - 0.35) < 0.03 && /F2 2\d\d\d Hz/.test(await page.textContent('.vf-big')), `vowel chart: drag picks a stretch (${t0}–${t1})`);
  // Track CSV.
  const tcsv = readFileSync(await dl('.vf-tcsv'), 'utf8').trim().split(/\r?\n/);
  check(tcsv[0] === 'time_s,F1_Hz,F2_Hz,F3_Hz,B1_Hz,B2_Hz,B3_Hz,rms' && tcsv.length > 250, `vowel chart: track CSV (${tcsv.length} lines)`);
  // Lobanov and means.
  await page.selectOption('.vf-norm', 'lob');
  check(/Lobanov needs/.test(await page.textContent('.vf-terr')), 'vowel chart: speaker C with one vowel cannot be normalised');
  await page.click('.vf-tex');
  check(/z F1/.test(await page.textContent('.vf-means thead')), 'vowel chart: Lobanov columns');
  check(await page.isHidden('.vf-terr') && /^Ai230022152925-0\.961\.31$/.test(await page.textContent('.vf-means tbody tr:first-child')), `vowel chart: Lobanov z for A [i] (${await page.textContent('.vf-means tbody tr:first-child')})`);
  await page.selectOption('.vf-show', 'mean');
  check(await page.isVisible('.vf-chart'), 'vowel chart: means view drawn');
  const ccsv = readFileSync(await dl('.vf-csv'), 'utf8').trim().split(/\r?\n/);
  check(ccsv[0] === 'vowel,speaker,F1_Hz,F2_Hz,F3_Hz,z_F1,z_F2,z_F3' && ccsv.length === 21 && /^i,A,290,2250,2950,-1\.\d+,/.test(ccsv[1]), `vowel chart: chart CSV (${ccsv[1]})`);
  const png = readFileSync(await dl('.vf .dl button[data-f=png]'));
  check(png.length > 5000 && png[1] === 0x50, 'vowel chart: PNG report');
  await page.selectOption('.vf-norm', 'hz');
  await page.fill('.vf-tab', 'vowel,F1,F2\ni,abc,2300'); await page.waitForFunction(() => /No row has numbers/.test(document.querySelector('.vf-terr')?.textContent || ''), null, { timeout: 5000 }).catch(() => {});
  check(/No row has numbers/.test(await page.textContent('.vf-terr')), 'vowel chart: table without numbers explained');
  await page.click('.vf-clear');
  check(await page.isHidden('.vf-cout'), 'vowel chart: clear hides the chart');
  // A 44.1 kHz WAV file.
  const wav = OUT + 'vowel-u.wav';
  writeFileSync(wav, writeWav(synthVowel([320, 800, 2300, 3400, 4400], [60, 90, 130, 200, 250], 150, 0.5, 44100), 44100));
  await page.setInputFiles('.vf-file', wav);
  await page.waitForFunction(() => /vowel-u\.wav/.test(document.querySelector('.vf-info')?.textContent || ''));
  check(/0\.50 s, 44,100 Hz, mono, PCM/.test(await page.textContent('.vf-info')), `vowel chart: WAV file read (${await page.textContent('.vf-info')})`);
  const m4 = (await page.textContent('.vf-big')).match(/F1 (\d+) Hz, F2 (\d+) Hz/);
  check(m4 && Math.abs(+m4[1] - 320) < 25 && Math.abs(+m4[2] - 800) < 50, `vowel chart: WAV [u] measured (${m4 && m4[0]})`);
  const bad = OUT + 'not-sound.wav'; writeFileSync(bad, 'hello, this is text');
  await page.setInputFiles('.vf-file', bad);
  await page.waitForFunction(() => !document.querySelector('.vf-err')?.hidden);
  check(/could not be read as sound/.test(await page.textContent('.vf-err')), 'vowel chart: not a sound file explained');
};
