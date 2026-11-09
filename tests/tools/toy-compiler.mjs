// #577 compiler stage visualiser
export const path = '/science/toy-compiler/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  await page.goto(`${BASE}/science/toy-compiler/`); await page.waitForTimeout(700);
  const R = '.tc';
  const txt = (s) => page.textContent(`${R} ${s}`);
  check((await txt('.tc-tcount')) === '47 tokens' && (await txt('.tc-ncount')) === '32 nodes' && (await txt('.tc-icount')) === '31 instructions', 'toycomp: example stage counts');
  check((await page.$$(`${R} .tk-keyword`)).length === 6 && (await page.getAttribute(`${R} .tk >> nth=0`, 'title')) === 'name, line 2, column 1', 'toycomp: tokens coloured by kind with positions');
  check(await page.isVisible(`${R} .tc-tree`) && (await page.getAttribute(`${R} .tc-tree`, 'aria-label')) === 'Syntax tree with 32 nodes', 'toycomp: tree drawn');
  { const rows = await page.$$eval(`${R} .tc-code tr`, (rs) => rs.map((r) => [...r.children].map((c) => c.textContent).join(' '))); check(rows[8] === '7 JUMP_IF_ZERO 17 4' && rows[17] === '16 JUMP 4 4' && rows.at(-1) === '30 HALT  9', `toycomp: bytecode table (${rows[8]})`); }
  check((await txt('.tc-say')) === 'Step 0. Next: 0 PUSH 0 (line 2).', 'toycomp: VM starts at instruction 0');
  await page.click(`${R} .tc-step`);
  check((await page.$$eval(`${R} .tc-stack li`, (l) => l.map((x) => x.textContent))).join() === '0' && (await txt('.tc-say')).startsWith('Step 1. Next: 1 STORE total'), 'toycomp: one step pushes 0');
  await page.click(`${R} .tc-step`);
  check((await page.$$(`${R} .tc-stack li`)).length === 0 && (await txt('.tc-vars')) === 'total0', 'toycomp: STORE moves it into a variable');
  await page.click(`${R} .tc-end`);
  check((await txt('.tc-out')) === '55\n0' && (await txt('.tc-say')) === 'Finished after 149 steps.' && (await txt('.tc-vars')).includes('i11'), 'toycomp: runs to the end: 55 then 0 in 149 steps');
  await page.click(`${R} .tc-reset`);
  check((await txt('.tc-out')) === '' && (await txt('.tc-say')).startsWith('Step 0.'), 'toycomp: reset');
  await page.selectOption(`${R} .tc-speed`, '1'); await page.click(`${R} .tc-play`);
  check((await txt('.tc-play')) === 'Pause', 'toycomp: Run turns into Pause');
  await page.waitForFunction(() => document.querySelector('.tc-say').textContent.startsWith('Finished'), null, { timeout: 15000 });
  check((await txt('.tc-out')) === '55\n0' && (await txt('.tc-play')) === 'Run', 'toycomp: Run plays to the end');
  // Examples, compared with Python's answers.
  for (const [ex, out] of [['fact', '15511210043330985984000000'], ['gcd', '21'], ['collatz', '111'], ['primes', '2\n3\n5\n7\n11\n13\n17\n19\n23\n29\n31\n37\n41\n43\n47\n53\n59'], ['fib', '0\n1\n1\n2\n3\n5\n8\n13\n21\n34\n55\n89\n144\n233\n377']]) {
    await page.selectOption(`${R} .tc-ex`, ex); await page.click(`${R} .tc-end`);
    check((await txt('.tc-out')) === out, `toycomp: example ${ex}`);
  }
  // Typed program: precedence shows in the bytecode.
  await page.fill(`${R} .tc-src`, 'x = 2 + 3 * 4;\nprint -7 / 2;\nprint -7 % 2;\nprint x;'); await page.waitForTimeout(500);
  { const ops = await page.$$eval(`${R} .tc-code tr td:nth-child(2)`, (t) => t.map((x) => x.textContent)); check(ops.slice(0, 5).join() === 'PUSH,PUSH,PUSH,MUL,ADD', 'toycomp: * before + in the bytecode'); }
  await page.click(`${R} .tc-end`);
  check((await txt('.tc-out')) === '-4\n1\n14', 'toycomp: division rounds down');
  // Errors
  await page.fill(`${R} .tc-src`, 'x = 3\nprint x;'); await page.waitForTimeout(500);
  check((await txt('.tc-err')).startsWith('Syntax tree, line 2, column 1: Expected ";" at the end of the line but found "print".\nprint x;\n^') && await page.isHidden(`${R} .tc-code`), 'toycomp: syntax error with position and caret');
  await page.fill(`${R} .tc-src`, 'x = 3 @ 4;'); await page.waitForTimeout(500);
  check((await txt('.tc-err')).startsWith('Tokens, line 1, column 7: "@" is not part of the language'), 'toycomp: lexer error');
  await page.fill(`${R} .tc-src`, 'x = 1;\nprint 10 / (x - 1);'); await page.waitForTimeout(500); await page.click(`${R} .tc-end`);
  check((await txt('.tc-rerr')) === 'Line 2: Division by zero.' && (await txt('.tc-say')).startsWith('Stopped after'), 'toycomp: runtime error');
  await page.fill(`${R} .tc-src`, 'while 1 { }'); await page.waitForTimeout(500); await page.click(`${R} .tc-end`);
  check((await txt('.tc-say')) === 'Stopped after 200,000 steps: is there a loop that never ends?', 'toycomp: endless loop stops');
  // Downloads
  await page.selectOption(`${R} .tc-ex`, 'gcd');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(`${R} .tc-csv`)]); const f = OUT + 'tc-code.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows[0] === 'address,instruction,argument,line' && rows[1] === '0,PUSH,1071,2' && rows.at(-1).includes('HALT'), 'toycomp: bytecode CSV'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(`${R} .tc-tcsv`)]); const f = OUT + 'tc-tok.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows[1] === 'name,a,2,1' && rows.at(-1).startsWith('end,'), 'toycomp: tokens CSV'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(`${R} .dl button[data-f=docx]`)]); check((await d.suggestedFilename()) === 'compiler-stages.docx', 'toycomp: Word report'); }
  await page.screenshot({ path: OUT + 'toy-compiler.png', fullPage: true });
};
