// #1432 Logic gates and truth tables
import { quiz } from '../school-quiz-q.mjs';
export const path = '/learn/logic-gates/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/logic-gates/`); await page.waitForSelector('.lg .lg-svg .lamp');
  const big = () => page.textContent('.lg .lg-big'), onRow = () => page.textContent('.lg .lg-tt tr.on'), lamp = () => page.locator('.lg .lg-svg .lamp.hi').count();
  check((await big()) === 'Y = 0' && (await onRow()) === '000' && (await lamp()) === 0, 'gates: AND 0,0');
  await page.click('.lg .lg-a'); await page.click('.lg .lg-b');
  check((await big()) === 'Y = 1' && (await onRow()) === '111' && (await lamp()) === 1 && (await page.textContent('.lg .lg-a')) === 'A = 1', 'gates: AND 1,1 lights the lamp');
  const ys = async () => page.locator('.lg .lg-tt tbody tr td:last-child').allTextContents();
  const want = { OR: '0111', NAND: '1110', NOR: '1000', XOR: '0110', XNOR: '1001' };
  for (const [g, w] of Object.entries(want)) { await page.click(`.lg .lg-g [data-g="${g}"]`); check((await ys()).join('') === w && (await page.textContent('.lg .lg-expr')).length > 4, `gates: ${g} table`); }
  await page.click('.lg .lg-g [data-g="NOT"]');
  check((await page.isHidden('.lg .lg-b')) && (await big()) === 'Y = 0' && (await ys()).join('') === '10' && (await page.locator('.lg .lg-svg circle.body').count()) === 1, 'gates: NOT hides B, has a bubble');
  // universal gates
  const ut = async () => page.locator('.lg .lg-ut tbody tr').evaluateAll((rs) => rs.every((r) => { const c = [...r.cells].map((x) => x.textContent); return c[c.length - 1] === c[c.length - 2]; }));
  for (const u of ['NAND', 'NOR']) for (const t of ['NOT', 'AND', 'OR']) { await page.click(`.lg .lg-u [data-u="${u}"]`); await page.click(`.lg .lg-t [data-t="${t}"]`); check(await ut(), `gates: ${t} from ${u} matches`); }
  check((await page.textContent('.lg .lg-urecipe')).includes('3 NOR gates'), 'gates: OR from NOR... recipe count');
  // chain
  check((await page.textContent('.lg .lg-cbig')) === 'Y = 1' && (await page.textContent('.lg .lg-cwork')).includes('G1 = AND(1, 0) = 0; Y = OR(0, 1) = 1') && (await page.locator('.lg .lg-ct tbody tr').count()) === 8, 'gates: chain worked example');
  await page.selectOption('.lg .lg-g2', 'NOT');
  check((await page.isHidden('.lg .lg-cc')) && (await page.locator('.lg .lg-ct tbody tr td:last-child').allTextContents()).join('') === '11111100', 'gates: AND then NOT is NAND');
  await page.click('.lg .lg-cb'); check((await page.textContent('.lg .lg-cbig')) === 'Y = 0', 'gates: chain input toggles');
  await quiz(page, check, '.lg', 'gates');

  // "Solve my numbers" card helpers
  const sv = (ns, root = '') => ({
    ans: () => page.textContent(`${root}[data-k="${ns}-answer"]`),
    work: () => page.textContent(`${root}[data-k="${ns}-working"]`),
    find: (v) => page.selectOption(`${root}[data-k="${ns}-find"]`, v),
    ex: (i) => page.selectOption(`${root}[data-k="${ns}-example"]`, String(i)),
    ch: (k, v) => page.selectOption(`${root}[data-k="${ns}-${k}"]`, v),
    set: async (k, v, u) => { await page.fill(`${root}[data-k="${ns}-${k}"]`, v); if (u) await page.selectOption(`${root}[data-k="${ns}-${k}-unit"]`, u); },
    clear: () => page.click(`${root}.sv-clear`),
  });
  {
    const x = '.lg-xp ', ans = () => page.textContent(x + '.lg-xa');
    const heads = () => page.locator(x + 'thead th').allTextContents(), onRows = () => page.locator(x + 'tbody tr.on').count(), allRows = () => page.locator(x + 'tbody tr').count();
    const type = async (v) => { await page.fill(x + '.lg-xi', v); };
    check((await ans()) === 'A ∧ ¬B is 1 in 1 of 4 rows.', `expr: first example (${await ans()})`);
    check((await heads()).join('|') === 'A|B|¬B|A ∧ ¬B' && (await allRows()) === 4 && (await onRows()) === 1, `expr: a column for every step (${(await heads()).join('|')})`);
    check((await page.locator(x + 'tbody tr.on').textContent()) === '1011', 'expr: the row A=1, B=0 gives 1');
    await type("(A+B)'"); check((await ans()).includes('the same as a NOR gate') && (await onRows()) === 1, `expr: NOR recognised (${await ans()})`);
    await type('A xor B'); check((await ans()).includes('XOR gate') && (await onRows()) === 2, `expr: XOR words (${await ans()})`);
    await type("A'B + AB'"); check((await ans()).includes('XOR gate') && (await page.textContent(x + '.lg-xs')).includes('AB′ + A′B'), `expr: textbook symbols (${await ans()})`);
    await type('A(B + C)'); check((await allRows()) === 8 && (await onRows()) === 3 && (await page.textContent(x + '.lg-xs')).includes('Y = AB + AC'), `expr: three inputs (${await ans()})`);
    await type('A or not A'); check((await ans()).includes('always 1'), `expr: tautology (${await ans()})`);
    await type('A and not A'); check((await ans()).includes('always 0'), `expr: contradiction (${await ans()})`);
    await type('A NAND B'); check((await ans()).includes('NAND gate'), 'expr: NAND recognised');
    await page.click(x + '.lg-chips [data-e="(A NAND B) NAND C"]'); check((await allRows()) === 8 && (await page.inputValue(x + '.lg-xi')) === '(A NAND B) NAND C', 'expr: example button fills the box');
    await type('A and'); check((await ans()).includes('ends too soon') && (await allRows()) === 0, `expr: unfinished expression (${await ans()})`);
    await type('A + (B'); check((await ans()).includes('bracket'), `expr: open bracket (${await ans()})`);
    await type('ABCDEFG'); check((await ans()).includes('Up to 6 inputs'), `expr: too many inputs (${await ans()})`);
    await type('1 + 1'); check((await ans()).includes('at least one letter'), `expr: no inputs (${await ans()})`);
    await type(''); check((await ans()).startsWith('Type an expression') && (await allRows()) === 0, 'expr: blank asks for an expression');
    await type('A'); check((await allRows()) === 2 && (await ans()).includes('A is 1 in 1 of 2 rows'), `expr: single input (${await ans()})`);
  }
};
