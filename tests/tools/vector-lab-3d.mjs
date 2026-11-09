// #1190 3D vector lab (maths checked against NumPy and SciPy in tests/sci-tools/vector-lab-3d.mjs)
export const path = '/learn/vector-lab-3d/';
export default async ({ page, check, BASE }) => {
  const R = '.v3l ';
  const t = (s) => page.textContent(R + s);
  const op = (o) => page.click(R + `.v3-op button[data-o="${o}"]`);
  await page.goto(`${BASE}/learn/vector-lab-3d/`); await page.waitForTimeout(500);
  check((await t('.v3-formula')).endsWith('= (3, 4, −1)') && (await t('.v3-facts')).includes('|a|3'), `vectors: a + b (${await t('.v3-formula')})`);
  const shot = () => page.evaluate(() => document.querySelector('.v3-fig').toDataURL());
  const before = await shot();
  await page.$eval(R + '.v3-fig', (e) => e.scrollIntoView({ block: 'center' }));
  const b = await (await page.$(R + '.v3-fig')).boundingBox();
  await page.mouse.move(b.x + b.width / 2, b.y + b.height / 2); await page.mouse.down(); await page.mouse.move(b.x + b.width / 2 + 60, b.y + b.height / 2 + 20, { steps: 4 }); await page.mouse.up();
  check((await shot()) !== before, 'vectors: dragging turns the picture');
  await page.click(R + '.v3-view[data-v="top"]'); check((await shot()) !== before, 'vectors: view buttons');
  await op('dot'); { const f = await t('.v3-facts'); check((await t('.v3-formula')).includes('= 3 = |a||b| cos θ') && f.includes('72.45°') && f.includes('Projection of b on a1'), `vectors: dot (${f})`); }
  await page.fill(R + '.v3-b0', '1'); await page.fill(R + '.v3-b1', '0'); await page.fill(R + '.v3-b2', '1'); await page.waitForTimeout(50);
  check((await t('.v3-facts')).includes('perpendicular'), 'vectors: perpendicular dot');
  await page.fill(R + '.v3-b0', '1'); await page.fill(R + '.v3-b1', '3'); await page.fill(R + '.v3-b2', '1');
  await op('cross'); { const f = await t('.v3-facts'); check((await t('.v3-formula')).endsWith('= (7, −4, 5)') && f.includes('9.4868') && f.includes('4.7434') && f.includes('(a × b) · a0'), `vectors: cross (${f})`); }
  await op('lines'); { const f = await t('.v3-facts'); check((await t('.v3-title')).startsWith('Skew') && f.includes('Shortest distance0.6882') && (await page.isVisible(R + '.v3-p0')), `vectors: skew lines (${f})`); }
  await page.fill(R + '.v3-b0', '2'); await page.fill(R + '.v3-b1', '-6'); await page.fill(R + '.v3-b2', '4'); await page.waitForTimeout(50);
  check((await t('.v3-title')) === 'Parallel lines' && (await t('.v3-formula')).startsWith('Parallel'), 'vectors: parallel lines');
  await page.fill(R + '.v3-b0', '0'); await page.fill(R + '.v3-b1', '0'); await page.fill(R + '.v3-b2', '0'); await page.waitForTimeout(50);
  check((await t('.v3-err')).includes('cannot be (0, 0, 0)'), 'vectors: zero direction message');
  await page.fill(R + '.v3-b0', 'q'); await page.waitForTimeout(50);
  check((await t('.v3-err')).includes('Type a number'), 'vectors: bad number message');
  await op('sum'); check((await page.inputValue(R + '.v3-a0')) === '2' && await page.isHidden(R + '.v3-p0'), 'vectors: back to a + b resets the example');
  check((await page.$$eval(R + '.smq-q', (e) => e.length)) === 5, 'vectors: five quiz questions');
  await page.click(R + '.smq-q:nth-child(5) .smq-choices button:nth-child(2)'); await page.click(R + '.smq-q:nth-child(5) .smq-check');
  check((await t('.smq-q:nth-child(5) .smq-out')) === 'Right!', 'vectors: quiz answer');
};
