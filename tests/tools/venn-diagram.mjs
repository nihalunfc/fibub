// #1186 Venn diagram calculator (set maths checked against Python sets in tests/sci-tools/venn-diagram.mjs)
export const path = '/learn/venn-diagram/';
export default async ({ page, check, BASE }) => {
  const R = '.vnd ';
  const t = (s) => page.textContent(R + s);
  await page.goto(`${BASE}/learn/venn-diagram/`); await page.waitForTimeout(500);
  check((await t('.vn-title')) === '(A ∪ B)′ ∩ C' && (await t('.vn-regions')) === 'Shaded: A′ ∩ B′ ∩ C.', `venn: example (${await t('.vn-regions')})`);
  const blue = async (sel) => page.evaluate((s) => { const c = document.querySelector(s); const g = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let n = 0; for (let i = 0; i < g.length; i += 4) if (g[i + 2] > g[i] + 40) n++; return n; }, sel);
  const b1 = await blue('.vn-fig'); check(b1 > 1000, `venn: region shaded (${b1} px)`);
  check((await t('.vn-cmp')).startsWith('Equal'), `venn: compare equal (${await t('.vn-cmp')})`);
  await page.fill(R + '.vn-e', "a u b n c"); await page.waitForTimeout(50);
  check((await t('.vn-title')) === 'A ∪ (B ∩ C)' && (await t('.vn-regions')).includes('A ∩ B ∩ C'), `venn: typed shortcuts and order (${await t('.vn-title')})`);
  const b2 = await blue('.vn-fig'); check(b2 > b1, 'venn: bigger region shaded');
  check((await t('.vn-cmp')).startsWith('Not equal'), 'venn: compare not equal');
  await page.click(R + '.vn-dm1');
  check((await t('.vn-cmp')).includes('Equal') && (await t('.vn-title')) === '(A ∪ B)′', 'venn: De Morgan 1');
  await page.click(R + '.vn-dm2'); check((await t('.vn-cmp')).startsWith('Equal'), 'venn: De Morgan 2');
  await page.click(R + '.vn-dist'); check((await t('.vn-cmp')).startsWith('Equal') && (await t('.vn-regions')).split(';').length === 3, 'venn: distributive law');
  await page.fill(R + '.vn-c', "A' ∪ B'"); await page.fill(R + '.vn-e', "(A ∪ B)'"); await page.waitForTimeout(50);
  check((await t('.vn-cmp')).includes('differ in') && (await t('.vn-cmp')).includes('A ∩ B′ ∩ C'), `venn: wrong De Morgan shows the differences (${await t('.vn-cmp')})`);
  // Keys.
  await page.fill(R + '.vn-e', ''); for (const k of ['A', '∩', 'B', '′']) await page.click(R + `.vn-keys button:text-is("${k}")`);
  check((await t('.vn-title')) === 'A ∩ B′' && (await t('.vn-regions')).includes('A ∩ B′ ∩ C′'), `venn: symbol keys (${await t('.vn-title')})`);
  await page.click(R + '.vn-del'); await page.waitForTimeout(50);
  check((await t('.vn-title')) === 'A ∩ B', 'venn: delete key');
  // Two sets.
  await page.click(R + '.vn-n button[data-n="2"]');
  check(await page.isHidden(R + '.vn-kc') && (await t('.vn-regions')) === 'Shaded: A ∩ B.', `venn: two sets (${await t('.vn-regions')})`);
  await page.fill(R + '.vn-e', 'A ∪ C'); await page.waitForTimeout(50);
  check((await t('.vn-err')).includes('Switch to 3 sets') && await page.isHidden(R + '.vn-out'), 'venn: no C with two sets');
  await page.fill(R + '.vn-e', '(A ∪ B'); await page.waitForTimeout(50);
  check((await t('.vn-err')).includes('never closed'), 'venn: bracket message');
  await page.fill(R + '.vn-e', 'A Δ B'); await page.waitForTimeout(50);
  check((await t('.vn-regions')) === 'Shaded: A ∩ B′; A′ ∩ B.', 'venn: symmetric difference');
  await page.fill(R + '.vn-e', "A ∩ A'"); await page.waitForTimeout(50);
  check((await t('.vn-regions')).includes('empty set'), 'venn: empty set');
  await page.selectOption(R + '.vn-ex', '(A ∪ B)′ ∩ C');
  check((await page.getAttribute(R + '.vn-n button[data-n="3"]', 'aria-pressed')) === 'true', 'venn: example with C switches to 3 sets');
  // Own elements.
  await page.check(R + '.vn-own'); await page.waitForTimeout(50);
  check((await t('.vn-res')).includes('= {9}, so n = 1'), `venn: own elements result (${await t('.vn-res')})`);
  { const f = await t('.vn-count'); check(f.includes('n(A ∪ B)9= 6 + 6 − 3 = 9') && f.includes('n(A ∪ B ∪ C)10') && f.includes('n(A′ ∩ B′)3'), `venn: counting facts (${f})`); }
  await page.fill(R + '.vn-A', '1-6, 40'); await page.waitForTimeout(50);
  check((await t('.vn-res')).includes('Not in U, so left out: 40'), 'venn: element outside U');
  await page.fill(R + '.vn-A', '9-1'); await page.waitForTimeout(50);
  check((await t('.vn-res')).includes('too long or backwards'), 'venn: bad range message');
  await page.fill(R + '.vn-A', '1-6');
  check((await page.$$eval(R + '.smq-q', (e) => e.length)) === 5, 'venn: five quiz questions');
  await page.click(R + '.smq-q:nth-child(3) .smq-choices button:nth-child(1)'); await page.click(R + '.smq-q:nth-child(3) .smq-check');
  check((await t('.smq-q:nth-child(3) .smq-out')) === 'Right!', 'venn: De Morgan quiz');
  const q1 = await t('.smq-q:nth-child(1) .smq-text'); const [a, b, ab] = q1.match(/\d+/g).map(Number);
  await page.fill(R + '.smq-q:nth-child(1) .smq-in', String(a + b - ab)); await page.click(R + '.smq-q:nth-child(1) .smq-check');
  check((await t('.smq-q:nth-child(1) .smq-out')) === 'Right!', 'venn: counting quiz');
};
