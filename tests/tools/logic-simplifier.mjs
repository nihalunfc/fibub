// #558 truth table and Karnaugh map simplifier
export const path = '/science/logic-simplifier/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  const R = '.lgc ';
  const sop = () => page.textContent(R + '.lg-sop'), pos = () => page.textContent(R + '.lg-pos'), facts = () => page.textContent(R + '.lg-facts');
  const fill = async (c, v) => { await page.fill(R + c, v); await page.waitForTimeout(450); };
  await page.goto(`${BASE}/science/logic-simplifier/`); await page.waitForTimeout(700);
  check((await sop()) === 'F = AB + A′C' && (await pos()) === 'F = (A′ + B)(A + C)', `logic: example consensus (${await sop()} / ${await pos()})`);
  check((await facts()).includes('Σm(1, 3, 6, 7)') && (await facts()).includes('ΠM(0, 2, 4, 5)') && (await facts()).includes('3 (2 essential)'), 'logic: minterms, maxterms and primes');
  check((await page.$$(R + '.lg-tt tbody tr')).length === 8 && await page.isVisible(R + '.lg-km') && await page.isVisible(R + '.lg-gates'), 'logic: truth table, K-map and gates shown');
  check((await page.$$eval(R + '.lg-kleg span', (ss) => ss.map((x) => x.textContent).join(','))) === 'AB,A′C', 'logic: K-map legend lists the 2 groups');
  { const rows = await page.$$eval(R + '.lg-pi tbody tr', (trs) => trs.map((tr) => [...tr.cells].map((c) => c.textContent).join('|'))); check(rows.length === 3 && rows.some((r) => r.startsWith('-11|BC|') && r.endsWith('||')), `logic: prime chart shows BC as unused (${rows.join(' ; ')})`); }
  await page.selectOption(R + '.lg-nt', 'python'); await page.waitForTimeout(200);
  check((await sop()) === 'F = (A & B) | (~A & C)' && (await pos()) === 'F = (~A | B) & (A | C)', `logic: SymPy notation (${await sop()})`);
  await page.selectOption(R + '.lg-nt', 'math'); await page.waitForTimeout(200);
  check((await sop()) === 'F = A∧B ∨ ¬A∧C', `logic: logic notation (${await sop()})`);
  await page.selectOption(R + '.lg-nt', 'prime');
  await page.selectOption(R + '.lg-gf', 'pos'); await page.waitForTimeout(200);
  check(await page.isVisible(R + '.lg-gates'), 'logic: POS gate diagram');
  await page.click(R + '.lg-ex[data-ex^="expr|A ^"]'); await page.waitForTimeout(300);
  check((await sop()) === 'F = ABC + AB′C′ + A′BC′ + A′B′C' && (await facts()).includes('4 terms, 12 literals'), 'logic: 3-way XOR does not simplify');
  await page.click(R + '.lg-ex[data-ex^="list"]'); await page.waitForTimeout(300);
  check((await sop()) === 'F = A′D + CD' && (await pos()) === 'F = D(A′ + C)' && (await facts()).includes('+ d(0, 2, 5)'), "logic: don't-cares example");
  check((await page.$$eval(R + '.lg-tt tbody td', (tds) => tds.filter((t) => t.textContent === 'X').length)) === 3, "logic: don't-cares marked X in the table");
  await fill('.lg-d', '1');
  check((await page.textContent(R + '.lg-err')).includes('both a minterm and a don\'t-care'), 'logic: overlapping lists refused');
  await fill('.lg-d', '');
  await fill('.lg-m', '0, 1, 2, 5, 6, 7, 8, 9, 10, 14');
  check((await sop()) === 'F = B′C′ + CD′ + A′BD' && (await facts()).includes('6 (2 essential)'), 'logic: textbook 4-variable example');
  await fill('.lg-m', '16');
  check((await page.textContent(R + '.lg-err')).includes('too big for 4 variables'), 'logic: row number too big');
  await fill('.lg-vars', 'A B C D E'); await fill('.lg-m', '0-3, 8, 12, 16-19, 31');
  check(await page.isHidden(R + '.lg-kw') && (await page.textContent(R + '.lg-knote')).includes('2 to 4 variables') && (await page.$$(R + '.lg-tt tbody tr')).length === 32, 'logic: 5 variables, no K-map, full table');
  await fill('.lg-vars', 'A A B');
  check((await page.textContent(R + '.lg-err')).includes('only once'), 'logic: repeated variable refused');
  await page.click(R + '.lg-mode button[data-m=expr]'); await page.waitForTimeout(200);
  await fill('.lg-in', '(A + B');
  check((await page.textContent(R + '.lg-err')) === 'A bracket is not closed.' && await page.isHidden(R + '.lg-out'), 'logic: parse error');
  await fill('.lg-in', 'ABCDEFG');
  check((await page.textContent(R + '.lg-err')).includes('Up to 6 variables'), 'logic: more than 6 variables refused');
  await fill('.lg-in', 'A -> B');
  check((await sop()) === 'F = A′ + B' && (await pos()) === 'F = A′ + B', 'logic: implication');
  await fill('.lg-in', 'A & !A | B & !B');
  check((await sop()) === 'F = 0' && (await page.textContent(R + '.lg-note')).includes('0 on every row') && await page.isHidden(R + '.lg-gates'), 'logic: contradiction is 0');
  await fill('.lg-in', "(A + B)(A' + C)(B + C)");
  check((await sop()) === 'F = AC + A′B', 'logic: POS input simplified');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.lg-csv')]); const f = OUT + 'tt.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows.length === 9 && rows[0] === 'row,A,B,C,F' && rows[3] === '2,0,1,0,1', 'logic: truth table CSV'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.dl button[data-f=pdf]')]); const f = OUT + 'logic.pdf'; await d.saveAs(f); check(readFileSync(f).slice(0, 5).toString() === '%PDF-', 'logic: PDF report'); }
  await page.click(R + '.lg-steps summary'); await page.waitForTimeout(100);
  check((await page.$$(R + '.lg-qm tbody tr')).length > 4 && (await page.textContent(R + '.lg-qm')).includes('groups of 2'), 'logic: Quine-McCluskey steps');
};
