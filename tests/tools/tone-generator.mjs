// #T958 Tone generator
export const path = '/everyday/tone-generator/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  await page.goto(`${BASE}/everyday/tone-generator/`); await page.waitForTimeout(300);
  const R = '.tg ', info = () => page.textContent(R + '.tg-info');
  check((await info()).includes('3.00 s at 48,000 Hz'), `tone-generator: 3 s at 48 kHz by default (${await info()})`);
  const save = async (sel, name) => { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + sel)]); const f = OUT + name; await d.saveAs(f); return { b: readFileSync(f), n: d.suggestedFilename() }; };
  await page.fill(R + '.tg-dur', '1'); await page.fill(R + '.tg-f', '1000'); await page.fill(R + '.tg-vol', '-6');
  const w = await save('.tg-save', 'tg.wav');
  let peak = 0; for (let i = 44; i < w.b.length; i += 2) peak = Math.max(peak, w.b.readInt16LE(i));
  check(w.n === 'tone-1000hz-sine.wav' && w.b.length === 44 + 96000 && Math.abs(peak / 32767 - 0.501) < 0.01, `tone-generator: 1 s, 1 kHz at -6 dB (peak ${(peak / 32767).toFixed(3)})`);
  await page.selectOption(R + '.tg-rate', '8000'); await page.fill(R + '.tg-f', '5000');
  check((await info()).includes('between 1 and 4,000 Hz') && await page.isDisabled(R + '.tg-save'), 'tone-generator: refuses a tone above half the sample rate');
  await page.click(R + '[data-mode=dtmf]');
  check((await info()).includes('Press some keys'), 'tone-generator: keypad waits for keys');
  await page.click(R + '.tg-key[data-key="5"]'); await page.click(R + '.tg-key[data-key="#"]');
  check((await page.inputValue(R + '.tg-seq')) === '5#' && (await info()).includes('0.40 s'), `tone-generator: keys add to the sequence, 0.4 s (${await info()})`);
  const u = await save('.tg-ulaw', 'tg.ulaw');
  check(u.n === 'dtmf-5hash.ulaw' && u.b.length === 3200, `tone-generator: DTMF 5# as u-law, 3,200 bytes (${u.b.length})`);
  await page.click(R + '[data-mode=signal]'); await page.selectOption(R + '.tg-sig', 'uk-busy');
  check(await page.isVisible(R + '.tg-dur') && (await info()).includes('1.00 s at 8,000 Hz'), 'tone-generator: phone signals use the length box');
};
