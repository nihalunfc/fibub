// #577 compiler stage visualiser: lexer, parser, code generator and VM.
// Reference outputs below were produced by running hand-written Python equivalents of each program
// (python 3, scratch script toy_ref.py; // and % for the language's rounding-down division and remainder,
// Python's unbounded integers for the big factorial and 2^100).
import * as T from '../../src/lib/sci/toycomp.ts';

const PROGRAMS = [{"name": "sum", "src": "total = 0;\ni = 1;\nwhile i <= 10 {\n  total = total + i;\n  i = i + 1;\n}\nprint total;\n", "out": ["55"]}, {"name": "factorial", "src": "n = 25; f = 1;\nwhile n > 1 { f = f * n; n = n - 1; }\nprint f;", "out": ["15511210043330985984000000"]}, {"name": "fib", "src": "a = 0; b = 1; k = 0;\nwhile k < 15 { print a; t = a + b; a = b; b = t; k = k + 1; }", "out": ["0", "1", "1", "2", "3", "5", "8", "13", "21", "34", "55", "89", "144", "233", "377"]}, {"name": "gcd", "src": "a = 1071; b = 462;\nwhile b != 0 { t = b; b = a % b; a = t; }\nprint a;", "out": ["21"]}, {"name": "primes", "src": "n = 2;\nwhile n < 60 {\n  d = 2; prime = 1;\n  while d * d <= n and prime { if n % d == 0 { prime = 0; } d = d + 1; }\n  if prime { print n; }\n  n = n + 1;\n}", "out": ["2", "3", "5", "7", "11", "13", "17", "19", "23", "29", "31", "37", "41", "43", "47", "53", "59"]}, {"name": "collatz", "src": "n = 27; steps = 0;\nwhile n != 1 { if n % 2 == 0 { n = n / 2; } else { n = 3 * n + 1; } steps = steps + 1; }\nprint steps;", "out": ["111"]}, {"name": "floordiv", "src": "print -7 / 2; print -7 % 2; print 7 / -2; print 7 % -2; print -(3 - 10) * 2; print 2 - 3 - 4; print 100 / 7 / 2;", "out": ["-4", "1", "-4", "-1", "14", "-5", "7"]}, {"name": "logic", "src": "x = 5;\nprint x > 3 and x < 10; print x == 4 or x == 5; print not x; print not 0; print (x != 5) or (x <= 5); print 1 + 2 * 3 == 7;\nif x >= 5 { print 1; } else if x > 2 { print 2; } else { print 3; }", "out": ["1", "1", "0", "1", "1", "1", "1"]}, {"name": "power", "src": "p = 1; i = 0;\nwhile i < 100 { p = p * 2; i = i + 1; }\nprint p; print p % 1000007;", "out": ["1267650600228229401496703205376", "698635"]}, {"name": "nested", "src": "i = 1;\nwhile i <= 4 { j = 1; row = 0; while j <= i { row = row * 10 + j; j = j + 1; } print row; i = i + 1; }", "out": ["1", "12", "123", "1234"]}];

export default async (check) => {
  let ok = 0, bad = '';
  for (const p of PROGRAMS) {
    const { code } = T.build(p.src), vm = T.runAll(code);
    if (!vm.error && !vm.limited && vm.out.join(' ') === p.out.join(' ')) ok++; else if (!bad) bad = `${p.name}: ${vm.out.join(' ')} ${vm.error?.message ?? ''}`;
  }
  check(`toycomp: ${ok}/${PROGRAMS.length} test programs print exactly what their Python equivalents print ${bad}`, ok === PROGRAMS.length);
  // Golden stages for a small program.
  const src = 'x = 2 + 3 * 4;\nwhile x > 10 { x = x - 1; }\nprint x;';
  const toks = T.lex(src);
  check('toycomp: tokens of the small program (24, by kind)', toks.length === 24 && toks.map((t) => t.kind[0]).join('') === 'nonononpknonpnononppknpe' && toks[8].text === 'while' && toks.at(-1).kind === 'end');
  check('toycomp: token positions (line, column)', toks[8].line === 2 && toks[8].col === 1 && toks.at(-2).line === 3 && toks.at(-2).col === 8);
  const code = T.compile(T.parse(toks)).map((i) => i.op + (i.arg !== undefined ? ' ' + i.arg : '')).join('; ');
  check('toycomp: bytecode with * before + and the loop jumps', code === 'PUSH 2; PUSH 3; PUSH 4; MUL; ADD; STORE x; LOAD x; PUSH 10; GT; JUMP_IF_ZERO 15; LOAD x; PUSH 1; SUB; STORE x; JUMP 6; LOAD x; PRINT; HALT');
  { const vm = T.runAll(T.compile(T.parse(toks))); check('toycomp: the small program prints 10 after 49 steps (6 + 4 loops of 9 + 4 + 3)', vm.out.join() === '10' && vm.steps === 49 && vm.vars.get('x') === 10n && vm.stack.length === 0); }
  { const tree = T.toTree(T.parse(T.lex('if a < 2 { print a; } else { a = -a; }'))); const L = T.layoutTree(tree);
    check('toycomp: syntax tree shape (program > if > [<, then, else])', tree.kids[0].label === 'if' && tree.kids[0].kids.map((k) => k.label).join() === '<,then,else' && tree.kids[0].kids[2].kids[0].kids[0].label === '-' && L.nodes.length === 12 && L.depth === 5 && L.width === 4); }
  { const L = T.layoutTree({ label: 'r', kids: [{ label: 'a', kids: [] }, { label: 'b', kids: [] }] }); check('toycomp: parents sit centred over their children', L.nodes[0].x === 0.5 && L.nodes[1].x === 0 && L.nodes[2].x === 1); }
  // Step by step equals running to the end.
  { const { code } = T.build(PROGRAMS[0].src), vm = T.newVM(); while (!vm.halted) T.stepVM(vm, code); check('toycomp: stepping one instruction at a time gives the same output', vm.out.join() === '55'); }
  // Errors with positions.
  const err = (src) => { try { T.build(src); return null; } catch (e) { return `${e.stage}|${e.line}:${e.col}|${e.message}`; } };
  check('toycomp: unknown character', err('x = 3 $ 4;') === 'Tokens|1:7|"$" is not part of the language');
  check('toycomp: decimals are refused', err('x = 3.5;').startsWith('Tokens|1:5|"3.": numbers are whole numbers'));
  check('toycomp: missing semicolon', err('x = 3\nprint x;') === 'Syntax tree|2:1|Expected ";" at the end of the line but found "print"');
  check('toycomp: unclosed block', err('while 1 { print 1;') === 'Syntax tree|1:19|A block opened with "{" is not closed with "}"');
  check('toycomp: bad start of statement', err('+ 3;') === 'Syntax tree|1:1|A statement cannot start with "+"');
  check('toycomp: unclosed bracket', err('print (1 + 2;') === 'Syntax tree|1:13|Expected ")" to close the bracket but found ";"');
  { const vm = T.runAll(T.build('print y;').code); check('toycomp: using a variable before it has a value is a runtime error on its line', vm.error?.message === 'y is used before it is given a value' && vm.error.line === 1); }
  { const vm = T.runAll(T.build('x = 0;\nprint 5 / x;').code); check('toycomp: division by zero', vm.error?.message === 'Division by zero' && vm.error.line === 2); }
  { const vm = T.runAll(T.build('while 1 { }').code, 1000); check('toycomp: endless loop stops at the step limit', vm.limited === true && vm.steps === 1000); }
  { const vm = T.runAll(T.build('x = 10; while 1 { x = x * x; }').code); check('toycomp: runaway numbers stop at 10,000 digits', vm.error?.message === 'A number grew past 10,000 digits'); }
  check('toycomp: comments and an empty program', T.runAll(T.build('# nothing here\n').code).out.length === 0);
};
