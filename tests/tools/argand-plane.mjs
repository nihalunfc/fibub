// #1187 Argand plane (maths checked against Python complex numbers and numpy.roots in tests/sci-tools/argand-plane.mjs)
export const path = '/learn/argand-plane/';
export default async ({ page, check, BASE }) => {
  const R = '.agp ';
  const t = (s) => page.textContent(R + s);
  const slide = (s, v) => page.$eval(R + s, (e, v) => { e.value = v; e.dispatchEvent(new Event('input', { bubbles: true })); }, String(v));
  const op = (o) => page.click(R + `.ag-op button[data-o="${o}"]`);
  await page.goto(`${BASE}/learn/argand-plane/`); await page.waitForTimeout(500);
  check((await t('.ag-formula')).endsWith('= 4 + 3i'), `argand: z + w (${await t('.ag-formula')})`);
  const g = await page.evaluate(() => { const c = document.querySelector('.ag-fig'); const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let n = 0; for (let i = 0; i < d.length; i += 4) if (d[i + 1] > d[i] + 40 && d[i + 1] > d[i + 2]) n++; return n; });
  check(g > 100, `argand: answer arrow drawn in green (${g} px)`);
  await op('sub'); check((await t('.ag-formula')).endsWith('= 2 − i'), 'argand: z − w');
  await op('mul'); { const f = await t('.ag-facts'); check((await t('.ag-formula')).includes('= 1 + 7i') && f.includes('|z × w| = |z| × |w|7.0711') && f.includes('arg(z × w)81.87°'), `argand: z × w (${f})`); }
  await op('div'); check((await t('.ag-formula')).endsWith('= 1 − i'), `argand: z ÷ w (${await t('.ag-formula')})`);
  await page.fill(R + '.ag-wa', '0'); await page.fill(R + '.ag-wb', '0'); await page.waitForTimeout(50);
  check((await t('.ag-err')).includes('divide by 0'), 'argand: divide by zero message');
  await page.fill(R + '.ag-wa', '1'); await page.fill(R + '.ag-wb', 'x'); await page.waitForTimeout(50);
  check((await t('.ag-err')).includes('Type each part'), 'argand: bad number message');
  await page.fill(R + '.ag-wb', '2');
  await op('conj'); check((await t('.ag-formula')).startsWith('z̄ = 3 − i') && await page.isHidden(R + '.ag-wa'), 'argand: conjugate hides w');
  await op('ipow'); check((await t('.ag-formula')).startsWith('i × (3 + i) = −1 + 3i'), 'argand: i × z');
  await op('pow'); await slide('.ag-n', 2);
  check((await t('.ag-formula')).startsWith('z² = 8 + 6i'), `argand: z² (${await t('.ag-formula')})`);
  { const f = await t('.ag-facts'); check(f.includes('Polar form of the answer10(cos 36.87° + i sin 36.87°)'), `argand: polar form (${f})`); }
  // Drag z to (−2, 2).
  await op('add');
  await page.$eval(R + '.ag-fig', (e) => e.scrollIntoView({ block: 'center' }));
  const b = await (await page.$(R + '.ag-fig')).boundingBox();
  const X = (re) => b.x + (b.width / 380) * (34 + ((re + 5) / 10) * 336), Y = (im) => b.y + (b.height / 340) * (316 - ((im + 4.55) / 9.1) * 306);
  await page.mouse.move(X(3), Y(1)); await page.mouse.down(); await page.mouse.move(X(-2), Y(2), { steps: 5 }); await page.mouse.up();
  check((await page.inputValue(R + '.ag-za')) === '-2' && (await page.inputValue(R + '.ag-zb')) === '2', `argand: drag z (${await page.inputValue(R + '.ag-za')}, ${await page.inputValue(R + '.ag-zb')})`);
  // Quadratic.
  check((await t('.ag-qnote')).includes('−1 + 2i and −1 − 2i') && (await t('.ag-qeq')) === '1x² + 2x + 5 = 0', `argand: complex roots (${await t('.ag-qnote')})`);
  await slide('.ag-qc', 1); check((await t('.ag-qnote')).includes('one repeated real root, x = −1') || (await t('.ag-qnote')).includes('One repeated real root, x = −1'), 'argand: repeated root');
  await slide('.ag-qc', -3); check((await t('.ag-qnote')).includes('x = −3 and 1'), `argand: real roots (${await t('.ag-qnote')})`);
  await slide('.ag-qa', 0); check((await t('.ag-qnote')).includes('not a quadratic'), 'argand: a = 0 message');
  check((await page.$$eval(R + '.smq-q', (e) => e.length)) === 5, 'argand: five quiz questions');
  await page.fill(R + '.smq-q:nth-child(4) .smq-in', '135'); await page.click(R + '.smq-q:nth-child(4) .smq-check');
  check((await t('.smq-q:nth-child(4) .smq-out')) === 'Right!', 'argand: quiz answer');
  // Solve your own numbers (shared card, src/lib/learn/solvecard-b.ts)
  await page.goto(`${BASE}/learn/argand-plane/`); await page.waitForTimeout(600);
  {
  const S = '.ag-solve ', ans = () => page.textContent(S + '.sv-answer'), work = () => page.textContent(S + '.sv-work');
  const pre = async (n) => { await page.selectOption(S + '[data-k="sv-example"]', ''); await page.selectOption(S + '[data-k="sv-example"]', String(n)); await page.waitForTimeout(60); };
  const fill = async (k, v) => { await page.fill(S + `[data-k="sv-${k}"]`, v); await page.waitForTimeout(40); };
  const pick = async (k, v) => { await page.selectOption(S + `[data-k="sv-${k}"]`, v); await page.waitForTimeout(40); };
  await pre(0); check((await ans()) === 'z × w = 1 + 7i.' && (await work()).includes('= (3×1 − 1×2) + (3×2 + 1×1)i'), `argand solve: product (${await ans()})`);
  await pick('op', 'add'); check((await ans()) === 'z + w = 4 + 3i.', `argand solve: sum (${await ans()})`);
  await pre(1); check((await ans()) === 'z ÷ w = 1 − i.' && (await work()).includes('Top: (3 + i) × (1 − 2i) = 5 − 5i'), `argand solve: quotient (${await ans()})`);
  await pre(2); check((await ans()) === '|z| = 5 and arg z = 126.87° (2.214 rad).' && (await work()).includes('second quadrant'), `argand solve: modulus and argument (${await ans()})`);
  await pre(3); check((await ans()) === 'z = 1 + 1.732i.', `argand solve: polar to rectangular (${await ans()})`);
  await pick('th-unit', 'radians'); await fill('th', '1.0471975512'); check((await ans()) === 'z = 1 + 1.732i.', `argand solve: radians (${await ans()})`);
  await pre(4); check((await ans()) === 'zⁿ = (1 + i)^8 = 16.' && (await work()).includes('360° (the same direction as 0°)'), `argand solve: (1 + i)^8 (${await ans()})`);
  await pre(5); check((await ans()) === 'The roots are −1 + 2i and −1 − 2i.' && (await work()).includes('D = b² − 4ac = 2² − 4(1)(5) = −16'), `argand solve: complex roots (${await ans()})`);
  await fill('qb', '-5'); await fill('qc', '6'); await fill('qa', '1'); check((await ans()) === 'The roots are real: x = 2 and x = 3.', `argand solve: real roots (${await ans()})`);
  await fill('qa', '0'); check((await ans()).includes('not a quadratic'), `argand solve: a = 0 (${await ans()})`);
  await pre(1); await fill('wa', '0'); await fill('wb', '0'); check((await ans()).includes('cannot divide by 0'), `argand solve: divide by 0 (${await ans()})`);
  await pre(4); await fill('n', '2.5'); check((await ans()).includes('whole number'), `argand solve: fractional power (${await ans()})`);
  await pre(2); await fill('za', '0'); await fill('zb', '0'); check((await ans()).includes('modulus 0'), `argand solve: zero modulus (${await ans()})`);
  }
};
