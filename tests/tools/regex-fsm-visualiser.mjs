// #559 finite state machine and regex visualiser
export const path = '/science/regex-fsm-visualiser/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  const P = '.fsm ';
  const facts = async () => Object.fromEntries(await page.$$eval(P + '.fsm-facts div', (ds) => ds.map((d) => [d.querySelector('dt').textContent, d.querySelector('dd').textContent])));
  const click = async (sel) => { await page.locator(P + sel).first().scrollIntoViewIfNeeded(); await page.click(P + sel); await page.waitForTimeout(120); };
  const status = () => page.textContent(P + '.fsm-status');
  const rows = () => page.$$eval(P + '.fsm-tab tbody tr', (rs) => rs.map((r) => [...r.cells].map((c) => c.textContent)));

  await page.goto(`${BASE}/science/regex-fsm-visualiser/`); await page.waitForTimeout(700);
  check((await page.textContent(P + '.fsm-big')) === 'Minimal DFA: 4 states', 'fsm: example (a|b)*abb has a 4-state minimal DFA');
  { const f = await facts(); check(f['NFA states (Thompson)'] === '14' && f['DFA states (subset construction)'] === '5' && f['Shortest matches'].startsWith('abb, aabb, babb') && f['Matches of length 0, 1, 2, …, 8'] === '0, 0, 0, 1, 2, 4, 8, 16, 32' && f['Language'] === 'Infinite', 'fsm: state counts and language facts'); }
  check((await facts())['Check'] === "Agrees with your browser's own RegExp on all 16,383 strings up to length 13.", 'fsm: cross-check against the browser RegExp');
  { const r = await rows(); check(r.length === 4 && r[0][0] === '→ 0' && r[3][0] === '* 3' && r[3].join('|') === '* 3|1|0', 'fsm: minimal DFA transition table'); }
  // Step through babb.
  await click('.fsm-step');
  check((await status()) === 'After reading 1 of 4: state 0', 'fsm: step 1');
  await click('.fsm-step'); await click('.fsm-step');
  check((await status()) === 'After reading 3 of 4: state 2' && (await page.textContent(P + '.fsm-tape .cur')) === 'b', 'fsm: step 3 with the tape marker');
  await click('.fsm-back');
  check((await status()) === 'After reading 2 of 4: state 1', 'fsm: back');
  await click('.fsm-run');
  check((await status()) === 'After reading 4 of 4: state 3. Accepted.' && (await page.getAttribute(P + '.fsm-status', 'class')).includes('good'), 'fsm: run to the end, accepted');
  await page.fill(P + '.fsm-w', 'abc'); await click('.fsm-run');
  check((await status()).includes('stuck in the dead state. Rejected. (It uses a symbol outside the alphabet.)'), 'fsm: symbol outside the alphabet');
  // Other views.
  await click('.fsm-views button[data-v="nfa"]');
  await page.fill(P + '.fsm-w', 'ab'); await click('.fsm-step');
  { const r = await rows(); check(r.length === 14 && (await status()).startsWith('After reading 1 of 2: states {') && r[0].at(-1) !== '∅', 'fsm: NFA view, table with ε column, stepping through sets'); }
  await click('.fsm-views button[data-v="dfa"]');
  { const r = await rows(); check(r.length === 5 && r[0][3] === '{0, 1, 2, 3, 4, 5}', 'fsm: subset DFA lists NFA state sets'); }
  const w0 = await page.$eval(P + '.fsm-fig', (c) => c.width);
  await click('.fsm-views button[data-v="min"]');
  await page.fill(P + '.fsm-re', 'ab'); await page.waitForTimeout(500);
  const w1 = await page.$eval(P + '.fsm-fig', (c) => c.width * c.height), r1 = (await rows()).length;
  await click('.fsm-dead');
  check((await page.$eval(P + '.fsm-fig', (c) => c.width * c.height)) > w1 && w0 > 0 && r1 === 3, 'fsm: dead state adds a node');
  { const lines = await (async () => { await page.locator(P + '.fsm-csv').scrollIntoViewIfNeeded(); const [d] = await Promise.all([page.waitForEvent('download'), page.click(P + '.fsm-csv')]); const f = OUT + 'fsm.csv'; await d.saveAs(f); return readFileSync(f, 'utf8').trim().split('\n'); })(); check(lines[0] === 'State,a,b' && lines.length === 4, 'fsm: transition table CSV'); }
  // Many strings.
  await page.fill(P + '.fsm-re', '[a-c]{2,3}|x*'); await page.waitForTimeout(500);
  await page.fill(P + '.fsm-many', 'ab\nabcd\n\nxxx'); await page.waitForTimeout(200);
  { const t = await page.$$eval(P + '.fsm-mt tbody tr', (rs) => rs.map((r) => [...r.cells].map((c) => c.textContent).join('|'))); check(t.join(';') === 'ab|accepted|match;abcd|rejected|no match;(empty)|accepted|match;xxx|accepted|match', 'fsm: several strings against the DFA and RegExp'); }
  await page.fill(P + '.fsm-re', '.b'); await page.fill(P + '.fsm-alpha', 'xy'); await page.waitForTimeout(500);
  check((await facts())['Alphabet'] === '{b,x,y}' && (await facts())['Shortest matches'] === 'bb, xb, yb', 'fsm: extra alphabet for .');
  await page.fill(P + '.fsm-re', 'a(b'); await page.waitForTimeout(500);
  check((await page.textContent(P + '.fsm-err')).includes('not closed') && await page.isHidden(P + '.fsm-out'), 'fsm: bad regex message');
  await page.fill(P + '.fsm-re', '(ab|ba)*'); await page.waitForTimeout(500);
  // Editor.
  await click('.fsm-edit'); await page.waitForTimeout(300);
  check((await page.inputValue(P + '.fsm-dfa')).startsWith('start 0\naccept 0') && (await page.textContent(P + '.fsm-big')) === '3 states → minimal 3', 'fsm: minimal DFA copied into the editor');
  await click('.fsm-modes button[data-m="re"]'); await page.fill(P + '.fsm-re', '(a|b)*abb'); await page.waitForTimeout(400);
  await click('.fsm-modes button[data-m="dfa"]');
  await page.fill(P + '.fsm-dfa', 'start q0\naccept q0\nq0 0 q0\nq0 1 q1\nq1 0 q2\nq1 1 q0\nq2 0 q1\nq2 1 q2'); await page.waitForTimeout(500);
  await page.fill(P + '.fsm-w', '110'); await click('.fsm-run');
  { const f = await facts(); check((await page.textContent(P + '.fsm-big')) === '3 states → minimal 3' && f['Shortest accepted'] === 'ε, 0, 00, 11, 000, 011, 110, 0000' && (await status()).endsWith('Accepted.'), 'fsm: typed DFA (binary multiples of 3)'); }
  await page.fill(P + '.fsm-dfa', 'start a\naccept c\na x b\nb x c\na y d\nd x c\nc x c'); await page.waitForTimeout(500);
  check((await page.textContent(P + '.fsm-big')) === '4 states → minimal 3', 'fsm: typed DFA minimised (b and d merge)');
  await page.fill(P + '.fsm-dfa', 'start q0\nq0 a q1\nq0 a q2'); await page.waitForTimeout(500);
  check((await page.textContent(P + '.fsm-err')).includes('two moves on a'), 'fsm: nondeterministic DFA message');
  await page.fill(P + '.fsm-dfa', 'start q0\naccept q1\nq0 a q1'); await page.waitForTimeout(500);
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(P + '.dl [data-f="png"]')]); check((await d.suggestedFilename()).endsWith('.png'), 'fsm: image download'); }
};
