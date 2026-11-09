// #967 spacetime diagram
export const path = '/science/spacetime-diagram/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  const R = '.std ';
  const big = () => page.textContent(R + '.sd-big'), facts = () => page.textContent(R + '.sd-facts'), err = () => page.textContent(R + '.sd-err');
  const set = async (c, v) => { await page.fill(R + c, v); await page.waitForTimeout(250); };
  await page.goto(`${BASE}/science/spacetime-diagram/`); await page.waitForTimeout(800);
  check((await big()) === 'Frame S′ moves at 0.5c: γ = 1.155', 'sr: example frame');
  { const t = await page.textContent(R + '.sd-tab'); check(t.includes('A211.7320') && t.includes('B13−0.57742.887'), 'sr: events transformed'); }
  { const rows = await page.$$eval(R + '.sd-pairs tr', (r) => r.map((x) => [...x.children].map((c) => c.textContent))); const m = Object.fromEntries(rows.slice(1).map((r) => [r[0], r]));
    check(rows.length === 7 && m['O–A'][2] === 'timelike' && m['O–A'][3] === '1.732 y' && m['O–A'][5] === 'same place at β = 0.5', 'sr: timelike pair, proper time');
    check(m['O–B'][1] === '−8' && m['O–B'][2] === 'spacelike' && m['O–B'][4] === 'reversed' && m['O–B'][5] === 'simultaneous at β = 0.333', 'sr: spacelike pair reversed');
    check(m['O–C'][2] === 'lightlike' && m['A–C'][4] === 'simultaneous' && m['A–B'][4] === 'same order', 'sr: lightlike and simultaneous pairs'); }
  check(await page.isVisible(R + '.sd-fig') && await page.isVisible(R + '.sd-fig2'), 'sr: both diagrams');
  await page.fill(R + '.sd-bs', '-0.3'); await page.dispatchEvent(R + '.sd-bs', 'input'); await page.waitForTimeout(250);
  check((await page.inputValue(R + '.sd-b')) === '-0.3' && (await big()).startsWith('Frame S′ moves at −0.3c'), 'sr: speed slider');
  await page.selectOption(R + '.sd-u', 's|ls'); await page.waitForTimeout(250); check((await page.textContent(R + '.sd-tab')).includes('t (s)'), 'sr: units');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.sd-csv')]); const f = OUT + 'sr.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows.length === 5 && rows[0] === "event,t,x,t',x'", 'sr: events CSV'); }
  await page.selectOption(R + '.sd-u', 'y|ly'); await set('.sd-data', 'P, 1'); check((await err()).includes('name, a time and a position'), 'sr: short row message');
  await set('.sd-data', 'P, a, 1'); check((await err()).includes('needs numbers') && await page.isHidden(R + '.sd-out'), 'sr: non-numeric message');
  await set('.sd-data', 'O, 0, 0\nA, 2, 1\nB, 1, 3\nC, 3, 3');
  await set('.sd-b', '1.2'); check((await err()).includes('between −0.99 and 0.99'), 'sr: speed limit message');
  await page.selectOption(R + '.sd-mode', 'twin'); await set('.sd-b', '0.8'); await set('.sd-d', '4');
  check((await big()) === 'Traveller ages 6 y, Earth twin 10 y' && await page.isHidden(R + '.sd-data') && await page.isHidden(R + '.sd-fig2'), 'sr: twin paradox');
  { const f = await facts(); check(f.includes('6.4 y') && f.includes('t = 1.8') && f.includes('t = 8.2') && f.includes('1 on the way out, 9 back') && f.includes('Doppler factor 3'), 'sr: twin jump and signals'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.dl button[data-f=png]')]); const f = OUT + 'twin.png'; await d.saveAs(f); check(readFileSync(f).subarray(1, 4).toString() === 'PNG', 'sr: image report'); }
  await set('.sd-d', '0'); check((await err()).includes('distance'), 'sr: bad distance message');
  await set('.sd-d', '4'); await set('.sd-b', '0'); check((await err()).includes('at least 0.01'), 'sr: zero speed twin message');
  await set('.sd-b', '-0.8'); check((await big()) === 'Traveller ages 6 y, Earth twin 10 y', 'sr: negative speed in twin mode');
};
