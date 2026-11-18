// #T1046 Tab maker
export const path = '/everyday/chord-diagram-maker/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  await page.goto(`${BASE}/everyday/chord-diagram-maker/`); await page.waitForTimeout(300);
  const R = '.tm ';
  const res = () => page.textContent(R + '.tm-res');
  check((await res()).startsWith('Chord: C. Notes: C E G C E.'), `chord-diagram-maker: starts on C (${await res()})`);
  const dots = await page.$$eval(R + '.tm-svg circle.dot', (l) => l.length);
  check(dots === 3, `chord-diagram-maker: C shows 3 pressed dots (${dots})`);
  await page.selectOption(R + '.tm-shape', 'F');
  check((await res()).startsWith('Chord: F.') && (await res()).includes('Barre on fret 1') && (await page.$(R + '.tm-svg rect.barre')) !== null, `chord-diagram-maker: F barre (${await res()})`);
  await page.selectOption(R + '.tm-shape', 'Em');
  await page.selectOption(R + '.tm-tun', 'dropd');
  check((await res()).startsWith('Chord: Em7/D.'), `chord-diagram-maker: Em shape in Drop D (${await res()})`);
  await page.selectOption(R + '.tm-tun', 'std');
  // Build a chord by hand: Am from a cleared board = x02210.
  await page.click(R + '.tm-clear');
  for (const [s, f] of [[1, 0], [2, 2], [3, 2], [4, 1], [5, 0]]) {
    if (f === 0) await page.click(`${R}.tm-grid .top button[data-s="${s}"]`); else await page.click(`${R}.tm-grid button[data-s="${s}"][data-f="${f}"]`);
  }
  check((await res()).startsWith('Chord: Am.'), `chord-diagram-maker: hand-built Am (${await res()})`);
  const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.tm-svgdl')]); const f = OUT + 'tm.svg'; await d.saveAs(f);
  check(readFileSync(f, 'utf8').includes('<svg') && readFileSync(f, 'utf8').includes('>Am<'), 'chord-diagram-maker: SVG download');
  await page.click(R + '.tm-add'); await page.click(R + '.tm-add');
  check((await page.$$eval(R + '.tm-card', (l) => l.length)) === 2, 'chord-diagram-maker: two diagrams on the sheet');
  // Tab: low E fret 3 at step 1, high e open at step 1.
  await page.click(R + '.tm-tabclear');
  await page.fill(`${R}.tm-tabgrid input[data-s="0"][data-c="0"]`, '3');
  await page.fill(`${R}.tm-tabgrid input[data-s="5"][data-c="0"]`, '0');
  const tab = await page.textContent(R + '.tm-tab'), lines = tab.split('\n');
  check(lines.length === 6 && lines[0].startsWith('e|-0---') && lines[5].startsWith('E|-3---'), `chord-diagram-maker: text tab (${JSON.stringify(lines[0])} ${JSON.stringify(lines[5])})`);
  await page.selectOption(R + '.tm-tun', 'dropd');
  check((await page.textContent(R + '.tm-tab')).split('\n')[5].startsWith('D|'), 'chord-diagram-maker: Drop D labels the low string D');
};
