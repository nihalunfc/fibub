// #T1045 Chord transposer
export const path = '/everyday/chord-transposer/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  await page.goto(`${BASE}/everyday/chord-transposer/`); await page.waitForTimeout(300);
  const R = '.ct ';
  const out = () => page.textContent(R + '.ct-out');
  const set = async (txt, n) => { await page.fill(R + '.ct-in', txt); await page.fill(R + '.ct-n', String(n)); await page.dispatchEvent(R + '.ct-n', 'input'); };
  await set('Am F C G', 2);
  check((await out()) === 'Bm G D A', `chord-transposer: Am F C G +2 (${await out()})`);
  await set('F#m7/C#', -1);
  check((await out()) === 'Fm7/C', `chord-transposer: F#m7/C# -1 (${await out()})`);
  // Spacing: chords stay above the same words when a name gets longer.
  await set('Am        F\nHello my old friend\n[Verse]\nI [Am]love [F]you', 2);
  check((await out()) === 'Bm        G\nHello my old friend\n[Verse]\nI [Bm]love [G]you', `chord-transposer: lyrics and spacing kept (${JSON.stringify(await out())})`);
  // Flats in a flat key: Am F C G up 3 is Cm Ab Eb Bb.
  await set('Am F C G', 3);
  check((await out()) === 'Cm Ab Eb Bb', `chord-transposer: flats for C minor (${await out()})`);
  await page.click(R + '.ct-more summary');
  await page.selectOption(R + '.ct-spell', 'sharps');
  check((await out()) === 'Cm G# D# A#', `chord-transposer: sharps on request (${await out()})`);
  await page.selectOption(R + '.ct-spell', 'auto');
  // To a key: Am F C G (A minor) to the key of D moves +5 and keeps the minor mode: Dm Bb F C.
  await page.selectOption(R + '.ct-to', '2');
  check((await out()) === 'Dm Bb F C' && (await page.inputValue(R + '.ct-n')) === '5', `chord-transposer: move to key of D (${await out()})`);
  // Capo: Bm G D A with capo 7 gives open shapes Em C G D.
  await page.selectOption(R + '.ct-to', ''); await set('Bm G D A', 0);
  await page.fill(R + '.ct-capo-n', '7'); await page.dispatchEvent(R + '.ct-capo-n', 'input');
  check((await out()).endsWith('Em C G D'), `chord-transposer: capo 7 (${JSON.stringify(await out())})`);
  const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.ct-dl')]); const f = OUT + 'ct.txt'; await d.saveAs(f);
  check(readFileSync(f, 'utf8').includes('Em C G D'), 'chord-transposer: .txt download');
};
