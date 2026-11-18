// #T1034 Chord helper
export const path = '/everyday/chord-scale-helper/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  await page.goto(`${BASE}/everyday/chord-scale-helper/`); await page.waitForTimeout(300);
  const R = '.csh ';
  await page.selectOption(R + '.csh-root', '0'); await page.selectOption(R + '.csh-scale', 'major');
  check((await page.textContent(R + '.csh-sum')) === 'C major: C D E F G A B', `chord-scale-helper: C major notes (${await page.textContent(R + '.csh-sum')})`);
  check((await page.textContent(R + '.csh-cam')).startsWith('Camelot code: 8B'), 'chord-scale-helper: C major is 8B');
  const rom = await page.$$eval(R + '.csh-ch .r', (l) => l.map((x) => x.textContent).join(' '));
  const sym = await page.$$eval(R + '.csh-ch .s', (l) => l.map((x) => x.textContent).join(' '));
  check(rom === 'I ii iii IV V vi vii°' && sym === 'C Dm Em F G Am Bdim', `chord-scale-helper: C major chords (${rom} | ${sym})`);
  const pop = await page.$eval(R + '.csh-prog .c', (e) => e.textContent);
  check(pop === 'C – G – Am – F', `chord-scale-helper: pop pattern in C (${pop})`);
  await page.selectOption(R + '.csh-scale', 'dorian'); await page.selectOption(R + '.csh-root', '2');
  check((await page.textContent(R + '.csh-cam')).startsWith('Camelot code: 8B'), 'chord-scale-helper: D dorian files under 8B');
  await page.click(R + '.csh-t-find');
  check((await page.textContent(R + '.csh-sum')) === 'A natural minor: A B C D E F G', `chord-scale-helper: Am F C G finds A minor (${await page.textContent(R + '.csh-sum')})`);
  check((await page.textContent(R + '.csh-cam')).startsWith('Camelot code: 8A'), 'chord-scale-helper: A minor is 8A');
  await page.click(R + '.csh-t-key');
  await page.selectOption(R + '.csh-root', '0'); await page.selectOption(R + '.csh-scale', 'major');
  const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.csh-mid')]); const f = OUT + 'csh.mid'; await d.saveAs(f);
  const b = readFileSync(f);
  check(b.slice(0, 4).toString() === 'MThd' && b.includes(Buffer.from('MTrk')) && b.length > 100, `chord-scale-helper: MIDI file (${b.length} bytes)`);
};
