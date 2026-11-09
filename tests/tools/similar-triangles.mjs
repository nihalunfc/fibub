// #1159 Similar triangles
export const path = '/learn/similar-triangles/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/similar-triangles/`); await page.waitForSelector('.st .st-hD');
  const R = '.st ';
  const txt = (s) => page.textContent(R + s);
  const ratios = async () => { const m = /= (\S+)   and   .* = (\S+)$/.exec(await txt('.st-bpt')); return [Number(m[1]), Number(m[2])]; };
  { const [a, b] = await ratios(); check(a === 0.667 && b === 0.667 && (await txt('.st-bpt2')).endsWith('= 0.4.'), `similar: BPT at 0.4 (${a}, ${b})`); }
  await page.locator(R + '.st-t').fill('0.5'); await page.waitForTimeout(100);
  { const [a, b] = await ratios(); check(a === 1 && b === 1 && (await txt('.st-tv')) === 'AD : AB = 0.5', 'similar: D at the midpoint gives 1 and 1'); }
  // Drag A: ratios stay equal.
  const fig = page.locator(R + '.st-fig'); await page.setViewportSize({ width: 1280, height: 1600 }); await fig.scrollIntoViewIfNeeded();
  { const h = await page.locator(R + '.st-hA').boundingBox(); await page.mouse.move(h.x + h.width / 2, h.y + h.height / 2); await page.mouse.down(); await page.mouse.move(h.x + 120, h.y + 40, { steps: 6 }); await page.mouse.up(); await page.waitForTimeout(150);
    const [a, b] = await ratios(); check(a === b && a === 1 && (await page.getAttribute(R + '.st-hA', 'cx')) !== '120', `similar: drag A keeps the ratios equal (${a}, ${b})`); }
  // Drag D towards B.
  { const d = await page.locator(R + '.st-hD').boundingBox(), b = await page.locator(R + '.st-hB').boundingBox();
    await page.mouse.move(d.x + d.width / 2, d.y + d.height / 2); await page.mouse.down(); await page.mouse.move((d.x + b.x) / 2 + 6, (d.y + b.y) / 2 + 6, { steps: 6 }); await page.mouse.up(); await page.waitForTimeout(150);
    const t = Number(await page.inputValue(R + '.st-t')); const [a, c] = await ratios(); check(t > 0.6 && a === c, `similar: drag D along AB (t ${t}, ratios ${a}, ${c})`); }
  await page.setViewportSize({ width: 1280, height: 720 });
  // Similarity tests.
  check((await txt('.st-res')) === 'Similar' && (await txt('.st-why')).includes('= 70°') && (await page.$$(R + '.st-pair polygon')).length === 2, 'similar: AA example similar');
  await page.fill(R + '.st-v1-∠2', '65'); await page.waitForTimeout(100);
  check((await txt('.st-res')) === 'Not similar', 'similar: AA 50, 65 not similar');
  await page.fill(R + '.st-v1-∠2', '140'); await page.waitForTimeout(100);
  check((await txt('.st-why')).includes('less than 180°'), 'similar: AA invalid angles');
  await page.click(R + '.st-test button[data-t="sss"]'); await page.waitForTimeout(100);
  check((await txt('.st-res')) === 'Similar' && (await txt('.st-why')).includes('scale factor 2') && (await txt('.st-why')).includes('4 : 1'), 'similar: SSS 3-4-5 and 6-8-10');
  await page.fill(R + '.st-v1-r', '10.5'); await page.waitForTimeout(100);
  check((await txt('.st-res')) === 'Not similar', 'similar: SSS fails after a change');
  await page.fill(R + '.st-v1-r', '20'); await page.waitForTimeout(100);
  check((await txt('.st-why')).includes('cannot make a triangle'), 'similar: SSS impossible triangle');
  await page.click(R + '.st-test button[data-t="sas"]'); await page.waitForTimeout(100);
  check((await txt('.st-res')) === 'Similar' && (await txt('.st-why')).includes('6/9 = 0.667'), 'similar: SAS example');
  await page.fill(R + '.st-v1-θ', '45'); await page.waitForTimeout(100);
  check((await txt('.st-res')) === 'Not similar' && (await txt('.st-why')).includes('angles between the sides differ'), 'similar: SAS different angles');
  // Shadows.
  check((await txt('.st-shadow')).endsWith('= 9 m.'), 'similar: shadow example 9 m');
  await page.fill(R + '.st-s2', '8'); await page.waitForTimeout(100);
  check((await txt('.st-shadow')).endsWith('= 6 m.'), 'similar: shadow 8 m gives 6 m');
  await page.fill(R + '.st-s1', '0'); await page.waitForTimeout(100);
  check(await page.isVisible(R + '.st-serr'), 'similar: zero shadow message');
  await page.fill(R + '.st-s1', '2'); await page.waitForTimeout(100);
  // Quiz.
  check((await page.$$(R + '.sm-q')).length === 4, 'similar: four questions');
  for (const [i, re] of [[1, /= (\S+) cm\.$/], [2, /= (\d+) cm\.$/], [3, /= (\S+) m\.$/], [4, /= (\d+) cm²\.$/]]) {
    await page.click(`${R}.sm-q:nth-child(${i}) .sm-qshow`);
    const w = await txt(`.sm-q:nth-child(${i}) .sm-qwork`); const m = re.exec(w);
    await page.fill(`${R}.sm-q:nth-child(${i}) .sm-qin`, m ? m[1] : 'x'); await page.click(`${R}.sm-q:nth-child(${i}) .sm-qcheck`);
    check((await txt(`.sm-q:nth-child(${i}) .sm-qres`)) === 'Right!', `similar: quiz ${i} (${w})`);
  }
};
