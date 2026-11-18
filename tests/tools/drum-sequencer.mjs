// #T1035 Drum sketcher
export const path = '/everyday/drum-sequencer/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  await page.goto(`${BASE}/everyday/drum-sequencer/`); await page.waitForTimeout(300);
  const R = '.dsq ';
  await page.selectOption(R + '.dsq-preset', 'house');
  check((await page.inputValue(R + '.dsq-bpm')) === '124' && (await page.$$(R + '.dsq-c.on')).length === 4 + 2 + 4 + 4, 'drum sketcher: house preset sets 124 BPM and 14 hits');
  await page.fill(R + '.dsq-bars', '2');
  const [w] = await Promise.all([page.waitForEvent('download'), page.click(R + '.dsq-wav')]); const wf = OUT + 'dr.wav'; await w.saveAs(wf); const wb = readFileSync(wf);
  const want = Math.round(2 * 4 * (60 / 124) * 44100) * 2;
  check(wb.readUInt32LE(40) === want && w.suggestedFilename() === 'drums-124bpm-2bars.wav', `drum sketcher: 2-bar WAV length ${wb.readUInt32LE(40)} = ${want}`);
  const [m] = await Promise.all([page.waitForEvent('download'), page.click(R + '.dsq-mid')]); const mf = OUT + 'dr.mid'; await m.saveAs(mf); const mb = readFileSync(mf);
  let kicks = 0; for (let i = 14; i < mb.length - 2; i++) if (mb[i] === 0x99 && mb[i + 1] === 36) kicks++;
  check(mb.toString('latin1', 0, 4) === 'MThd' && kicks === 8, `drum sketcher: MIDI header and 8 kick notes (${kicks})`);
  await page.click(R + '.dsq-go'); await page.waitForTimeout(700);
  check((await page.textContent(R + '.dsq-go')) === 'Stop' && (await page.$$(R + '.dsq-c.now')).length > 0, 'drum sketcher: plays and shows the playhead'); await page.click(R + '.dsq-go');
  const hash = await page.evaluate(() => location.hash);
  await page.goto(`${BASE}/everyday/drum-sequencer/` + hash); await page.reload(); await page.waitForTimeout(300);
  check((await page.inputValue(R + '.dsq-bpm')) === '124' && (await page.$$(R + '.dsq-c.on')).length === 14, 'drum sketcher: pattern comes back from the link');
};
