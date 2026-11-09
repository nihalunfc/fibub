// #734 Syntax tree drawer: browser checks.
export const path = '/science/syntax-tree-drawer/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  await page.setViewportSize({ width: 1200, height: 900 });
  await page.goto(BASE + path); await page.waitForTimeout(700);
  const fact = (k) => page.$$eval('.st-facts div', (ds, k) => ds.find((d) => d.querySelector('dt').textContent === k)?.querySelector('dd').textContent, k);
  const type = async (v) => { await page.fill('.st-in', v); await page.waitForTimeout(450); };
  const svgCount = (sel) => page.$$eval('.st-pic svg ' + sel, (e) => e.length);

  check((await fact('Phrases (labels)')) === '11' && (await fact('Word groups')) === '6' && (await fact('Depth (levels)')) === '6' && (await fact('Arrows')) === '1', 'st: wh example counts 11/6/6/1');
  check((await fact('Sentence')) === 'what did you ∅ see t', 'st: sentence read off');
  check((await svgCount('text')) === 17 && (await svgCount('path')) === 1 && (await svgCount('line')) === 16, `st: SVG drawn (${await svgCount('text')} labels, ${await svgCount('line')} lines)`);
  const latex = () => page.inputValue('.st-latex');
  check((await latex()).includes('\\draw[->] (s1x1) to[out=south, in=south] (t1);') && (await latex()).includes('[{$\\emptyset$}]'), 'st: forest LaTeX with arrow and ∅');
  await page.click('.st-tex button[data-p="qtree"]'); await page.waitForTimeout(150);
  check((await latex()).startsWith('% \\usepackage{qtree}\n\\Tree [.{CP} [.{DP} {what} ]') && /cannot draw movement arrows/.test(await page.textContent('.st-texnote')), 'st: qtree LaTeX');
  const [tex] = await Promise.all([page.waitForEvent('download'), page.click('.st-dltex')]);
  check(tex.suggestedFilename() === 'syntax-tree-qtree.tex' && readFileSync(await tex.path(), 'utf8').includes('\\Tree'), 'st: .tex download');
  await page.click('.st-tex button[data-p="forest"]');

  await page.locator('.st-arrows').uncheck(); await page.waitForTimeout(150);
  check((await svgCount('path')) === 0 && (await fact('Arrows')) === '0', 'st: arrows off');
  await page.locator('.st-arrows').check();
  const h0 = await page.$eval('.st-pic svg', (s) => Number(s.getAttribute('height')));
  await page.selectOption('.st-size', '20'); await page.waitForTimeout(150);
  check((await page.$eval('.st-pic svg', (s) => Number(s.getAttribute('height')))) > h0 * 1.15, 'st: larger text size gives a larger tree');
  await page.selectOption('.st-size', '16');

  await page.selectOption('.st-ex', 'tri'); await page.waitForTimeout(150);
  check((await svgCount('polygon')) === 2 && (await svgCount('tspan')) === 2, `st: triangles and subscripts (${await svgCount('polygon')})`);
  await page.locator('.st-bottom').check(); await page.waitForTimeout(150);
  const ys = await page.$$eval('.st-pic svg text:not([font-weight])', (ts) => [...new Set(ts.map((t) => t.getAttribute('y')))]);
  check(ys.length === 1, `st: all words on one line (${ys.length})`);
  await page.locator('.st-bottom').uncheck();

  const [svg] = await Promise.all([page.waitForEvent('download'), page.click('.st-svg')]);
  const svgText = readFileSync(await svg.path(), 'utf8');
  check(svg.suggestedFilename() === 'syntax-tree.svg' && svgText.startsWith('<svg xmlns') && svgText.includes('fill="#ffffff"') && !svgText.includes('currentColor'), 'st: SVG download is black on white');
  const [png] = await Promise.all([page.waitForEvent('download'), page.click('.st-png')]);
  const pb = readFileSync(await png.path());
  check(png.suggestedFilename() === 'syntax-tree.png' && pb[1] === 0x50 && pb.readUInt32BE(16) > 300, 'st: PNG download');

  await type('[S [NP Kim] [VP sleeps]');
  check(await page.locator('.st-err').isVisible() && /Missing "\]".*3 "\[" but 2 "\]"/.test(await page.textContent('.st-err')) && await page.locator('.st-out').isHidden(), 'st: unbalanced message');
  check((await page.inputValue('.st-ex')) === '', 'st: typing clears the example choice');
  await type('[S [NP Kim]] [VP sleeps]]');
  check(/more after the tree ends, at character 14/.test(await page.textContent('.st-err')), 'st: text after the tree');
  await page.click('.st-goto');
  check(await page.$eval('.st-in', (t) => t.selectionStart) === 13, 'st: Show me where selects the spot');
  await type('[S [NP t->3]]'); check(/->3 has nowhere to go/.test(await page.textContent('.st-err')), 'st: arrow without landing site');
  await type('[S [NP Kim] [VP sleeps]]');
  check(await page.locator('.st-err').isHidden() && (await fact('Sentence')) === 'Kim sleeps', 'st: fixed tree draws again');

  await page.selectOption('.st-ex', 'wh'); await page.waitForTimeout(200);
  await page.setViewportSize({ width: 375, height: 800 });
  await page.screenshot({ path: OUT + 'syntax-tree-drawer-375.png', fullPage: false });
  const fits = await page.$eval('.st-pic svg', (s) => s.getBoundingClientRect().width <= s.parentElement.clientWidth + 1);
  check(fits, 'st: tree fits a phone screen');
  await page.setViewportSize({ width: 1200, height: 900 });
};
