// #980 genetic circuit designer
export const path = '/science/genetic-circuit-designer/';
export default async ({ page, check, OUT, BASE, readFileSync }) => {
  await page.goto(`${BASE}/science/genetic-circuit-designer/`); await page.waitForTimeout(600);
  const big = () => page.textContent('.gcd .gc-big'), warn = () => page.textContent('.gcd .gc-warn'), ta = '.gcd .gc-in';
  check((await big()) === '12 parts, 3 transcription units, 3 interactions' && (await warn()) === 'No problems found.', 'circuit: example repressilator');
  check((await page.$$eval('.gcd .gc-pic svg path', (e) => e.length)) > 20 && (await page.$$eval('.gcd .gc-pic svg text', (e) => e.length)) === 12, 'circuit: diagram drawn as SVG');
  check((await page.textContent('.gcd .gc-tab')).includes('rbs3, lacI, T3'), 'circuit: transcription unit table');
  { const v = await page.inputValue(ta); await page.fill(ta, v.replace('rbs2:rbs, ', '').replace(', T3:terminator', '')); await page.waitForTimeout(150); const w = await warn(); check(w.includes('cI: no ribosome binding site') && w.includes('pR: no terminator'), 'circuit: missing RBS and terminator warnings'); }
  await page.click('.gcd .gc-ex'); await page.selectOption('.gcd .gc-t', 'cds'); await page.fill('.gcd .gc-n', 'gfp'); await page.selectOption('.gcd .gc-s', 'r'); await page.click('.gcd .gc-addp'); await page.waitForTimeout(150);
  check((await page.inputValue(ta)).endsWith('<gfp:cds') && (await big()).startsWith('13 parts') && (await warn()).includes('gfp: no ribosome binding site'), 'circuit: add a reverse part');
  await page.selectOption('.gcd .gc-from', 'tetR'); await page.selectOption('.gcd .gc-k', '->'); await page.selectOption('.gcd .gc-to', 'pR'); await page.click('.gcd .gc-addi'); await page.waitForTimeout(150);
  check((await page.inputValue(ta)).endsWith('tetR -> pR') && (await big()).endsWith('4 interactions'), 'circuit: add an activation');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.gcd .gc-svg')]); const f = OUT + 'gc.svg'; await d.saveAs(f); const s = readFileSync(f, 'utf8'); check(s.startsWith('<svg xmlns') && s.includes('>gfp</text>') && s.includes('#ffffff'), 'circuit: SVG download (light colours)'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.gcd .gc-png')]); const f = OUT + 'gc.png'; await d.saveAs(f); const b = readFileSync(f); check(b[1] === 0x50 && b[2] === 0x4e && b.length > 3000, 'circuit: PNG download'); }
  for (const fm of ['png', 'pdf', 'docx']) { const [d] = await Promise.all([page.waitForEvent('download'), page.click(`.gcd .dl button[data-f=${fm}]`)]); check(d.suggestedFilename() === `genetic-circuit.${fm}`, `circuit: ${fm} report download`); }
  await page.fill(ta, 'pA:promoter, x:widget'); await page.waitForTimeout(150);
  check((await page.textContent('.gcd .gc-err')).includes('unknown type') && await page.isHidden('.gcd .gc-out'), 'circuit: unknown type message');
  await page.click('.gcd .gc-clear'); await page.waitForTimeout(150);
  check((await page.textContent('.gcd .gc-err')).includes('at least one part'), 'circuit: empty design message');
  await page.fill(ta, 'p:promoter, r:rbs, g:cds, t:terminator, g -| t, q -| p'); await page.waitForTimeout(150);
  { const w = await warn(); check(w.includes('which is a terminator') && w.includes('no part called "q"'), 'circuit: bad interaction warnings'); }
};
