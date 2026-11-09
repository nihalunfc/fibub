// #949 Feynman diagram drawer
export const path = '/science/feynman-diagram/';
export default async ({ page, check, OUT, BASE, readFileSync }) => {
  await page.goto(`${BASE}/science/feynman-diagram/`); await page.waitForTimeout(600);
  const wait = () => page.waitForTimeout(200);
  check(await page.isVisible('.fey .fy-svg svg') && (await page.$$('.fey .fy-svg svg path')).length >= 10 && (await page.textContent('.fey .fy-svg')).includes('γ'), 'feynman: e+e- example drawn as SVG');
  { const t = await page.inputValue('.fey .fy-tikz'); check(t.includes('\\vertex (i1) at (0, 2);') && t.includes("(v1) -- [photon, edge label=\\(\\gamma\\), momentum'=\\(q\\)] (v2)"), 'feynman: TikZ-Feynman code'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.fey .fy-dsvg')]); const f = OUT + 'fey.svg'; await d.saveAs(f); const s = readFileSync(f, 'utf8'); check(s.startsWith('<svg xmlns="http://www.w3.org/2000/svg"') && s.includes('stroke="#000000"') && !s.includes('currentColor'), 'feynman: SVG download, black on white'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.fey .fy-dpng')]); const f = OUT + 'fey.png'; await d.saveAs(f); const b = readFileSync(f); check(b.slice(1, 4).toString() === 'PNG' && b.readUInt32BE(16) > 1000, 'feynman: PNG download at 4× size'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.fey .fy-dtex')]); const f = OUT + 'fey.tex'; await d.saveAs(f); check(readFileSync(f, 'utf8').includes('\\begin{feynman}'), 'feynman: .tex download'); }
  for (const fmt of ['png', 'pdf', 'docx']) { const [d] = await Promise.all([page.waitForEvent('download'), page.click(`.fey .dl [data-f=${fmt}]`)]); check(d.suggestedFilename() === `feynman-diagram.${fmt}`, `feynman: report ${fmt} download`); }
  await page.click('.fey .fy-copy'); await wait();
  check((await page.textContent('.fey .fy-copied')).length > 0, 'feynman: copy button responds');
  await page.selectOption('.fey .fy-ex', 'ggh'); await wait();
  check((await page.inputValue('.fey .fy-tikz')).includes('gluon') && (await page.inputValue('.fey .fy-tikz')).includes('scalar'), 'feynman: gluon fusion example');
  await page.selectOption('.fey .fy-ex', 'loop'); await wait();
  check((await page.inputValue('.fey .fy-tikz')).includes('bend left=70'), 'feynman: bent photon loop');
  await page.selectOption('.fey .fy-ex', 'beta'); await wait();
  check((await page.inputValue('.fey .fy-tikz')).includes('charged boson') && (await page.inputValue('.fey .fy-tikz')).includes('\\bar{\\nu}_{e}'), 'feynman: beta decay with W and antineutrino');
  await page.selectOption('.fey .fy-sw', '2.4'); await page.fill('.fey .fy-unit', '90'); await page.fill('.fey .fy-fs', '20'); await wait();
  check((await page.getAttribute('.fey .fy-svg svg path', 'stroke-width')) === '2.4', 'feynman: line width, size and label size');
  await page.fill('.fey .fy-in', 'a 0 0\nb 2 0 blob\nc 4 1 cross\na b double X\nb c ghost u'); await wait();
  check((await page.inputValue('.fey .fy-ex')) === 'custom' && (await page.inputValue('.fey .fy-tikz')).includes('[blob] (b)') && (await page.inputValue('.fey .fy-tikz')).includes('crossed dot'), 'feynman: own diagram, double, ghost, blob, cross');
  await page.fill('.fey .fy-in', 'a 0 0\nb 1 0\na b laser'); await wait();
  check((await page.textContent('.fey .fy-err')).includes('unknown line type') && await page.isHidden('.fey .fy-out'), 'feynman: unknown type message');
  await page.fill('.fey .fy-in', 'a 0 0\na c fermion'); await wait();
  check((await page.textContent('.fey .fy-err')).includes('position first'), 'feynman: missing vertex message');
  await page.fill('.fey .fy-in', 'a 0 0\nb 1 0\na b fermion'); await page.fill('.fey .fy-unit', '5'); await wait();
  check((await page.textContent('.fey .fy-err')).includes('Size'), 'feynman: bad size message');
};
