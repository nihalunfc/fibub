// #559 finite state machine and regex visualiser: maths checks. The independent reference is JavaScript's own
// RegExp engine (a backtracking matcher, a different method from automata): for each regex, every string over
// the alphabet up to a set length is tested with new RegExp('^(?:' + re + ')$') and must get the same answer
// from the Thompson NFA, the subset-construction DFA and the minimal DFA. Minimality is checked separately
// (every pair of states can be told apart, and minimising again changes nothing), as is the textbook example
// (a|b)*abb (Aho, Sethi and Ullman): 5 DFA states from the subset construction, 4 after minimising.
import { parseRegex, fromRegex, nfaAccepts, dfaAccepts, minimise, allDistinguishable, countByLength, shortest, isFinite, parseDFA, dfaText, symLabel } from '../../src/lib/sci/automata.ts';

const words = (alpha, L) => { const out = ['']; let layer = ['']; for (let l = 1; l <= L; l++) { layer = layer.flatMap((w) => alpha.map((c) => w + c)); out.push(...layer); } return out; };
function agree(re, alpha, L, extra = '') {
  const r = fromRegex(re, extra), js = new RegExp('^(?:' + re + ')$'), bad = [];
  for (const w of words(alpha, L)) { const want = js.test(w); if (nfaAccepts(r.nfa, w) !== want || dfaAccepts(r.dfa, w) !== want || dfaAccepts(r.min, w) !== want) { bad.push(w); if (bad.length > 3) break; } }
  return { r, bad };
}
// A small random regex over a, b, c with every operator (seeded, so the run is repeatable).
function rng(seed) { let s = seed >>> 0; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 2 ** 32); }
function randomRegex(R, depth = 0) {
  const k = R();
  if (depth > 3 || k < 0.3) { const c = R(); return c < 0.6 ? 'abc'[Math.floor(R() * 3)] : c < 0.75 ? '.' : c < 0.88 ? ['[ab]', '[^a]', '[a-c]', '[bc]'][Math.floor(R() * 4)] : '()'; }
  if (k < 0.55) return randomRegex(R, depth + 1) + randomRegex(R, depth + 1);
  if (k < 0.75) return '(' + randomRegex(R, depth + 1) + '|' + randomRegex(R, depth + 1) + ')';
  const q = ['*', '+', '?', '{2}', '{1,3}', '{2,}', '{0,2}'][Math.floor(R() * 7)];
  return '(' + randomRegex(R, depth + 1) + ')' + q;
}

export default async (check) => {
  const AB = ['a', 'b', 'c'];
  { const { r, bad } = agree('(a|b)*abb', ['a', 'b'], 10); check(`fsm: (a|b)*abb agrees with RegExp on all ${2 ** 11 - 1} strings up to length 10; DFA 5 states, minimal 4 (textbook)`, bad.length === 0 && r.dfa.n === 5 && r.min.n === 4); }
  const fixed = ['a*b*', '(ab|ba)*', 'a+b?c', '(a|b)*a(a|b)', '((a|b)(a|b))*', 'a{2,3}', 'a{2,}b', '(abc){0,2}', '[^ab]*', '.*c.*', '', '()', 'a|', '(a|b|c)*abc(a|b|c)*', 'a*?b', '(?:ab)+', '[a-c]{3}', 'a\\.b', '\\d+', '(a*b*)*', '((a*)*)*b'];
  let bad = [];
  for (const re of fixed) { const ab = re.includes('\\d') ? ['1', '7', 'a'] : re.includes('\\.') ? ['a', 'b', '.'] : AB; const res = agree(re, ab, 6, ab.join('')); if (res.bad.length) bad.push(re + ' on ' + res.bad.join('/')); }
  check(`fsm: ${fixed.length} hand-picked regexes (classes, ., {m,n}, lazy marks, empty) agree with RegExp on every string up to length 6 ${bad.join(' | ')}`, bad.length === 0);
  const R = rng(559); bad = []; let minimal = 0, total = 0, counts = 0;
  for (let k = 0; k < 300; k++) {
    const re = randomRegex(R);
    let res; try { res = agree(re, AB, 6, 'abc'); } catch (e) { if (/more than/.test(e.message)) continue; bad.push(re + ' threw ' + e.message); continue; }
    total++;
    if (res.bad.length) bad.push(re + ' on ' + res.bad.join('/'));
    const m = res.r.min, again = minimise(m);
    if (allDistinguishable(m) && again.n === m.n && m.n <= res.r.dfa.n) minimal++;
    const js = new RegExp('^(?:' + re + ')$'), want = [0, 1, 2, 3, 4].map((L) => words(AB, L).filter((w) => w.length === L && js.test(w)).length);
    if (countByLength(m, 4).map(Number).join() === want.join()) counts++;
  }
  check(`fsm: ${total} random regexes agree with RegExp on all 1093 strings up to length 6 (NFA, DFA and minimal DFA) ${bad.slice(0, 3).join(' | ')}`, bad.length === 0 && total >= 250);
  check(`fsm: every minimal DFA is minimal (all ${total} have every pair of states distinguishable, and minimising again changes nothing)`, minimal === total);
  check(`fsm: counts of accepted strings of each length agree with RegExp for all ${total}`, counts === total);
  // Language facts.
  { const { min } = fromRegex('(a|b)*abb'); check('fsm: shortest accepted strings and counts', shortest(min, 4).join() === 'abb,aabb,babb,aaabb' && countByLength(min, 6).join() === '0,0,0,1,2,4,8' && !isFinite(min)); }
  { const { min } = fromRegex('a{2,3}|b'); check('fsm: finite language', isFinite(min) && shortest(min, 10).join() === 'b,aa,aaa'); }
  { const { min } = fromRegex('a[^a]', 'a'); check('fsm: empty language gives one rejecting state', min.n === 1 && !min.accept[0] && shortest(min).length === 0 && isFinite(min)); }
  // Typed DFA.
  { const d = parseDFA('start q0\naccept q2\nq0 a q1\nq0, b, q0\nq1 -a-> q1\nq1 b q2\nq2 a,b q0'); check('fsm: typed DFA in three styles', d.n === 3 && dfaAccepts(d, 'ab') && dfaAccepts(d, 'bbaab') && !dfaAccepts(d, 'aba')); }
  { const d = parseDFA('start s\naccept s t\ns a t\nt a s\nu a u'); const m = minimise(d); check('fsm: minimising drops unreachable states and merges equal ones', m.n === 1 && m.accept[0]); }
  { const { min } = fromRegex('(ab|ba)*'); const back = parseDFA(dfaText(min)); check('fsm: DFA text round trip', back.n === min.n && ['', 'ab', 'abba', 'aab'].every((w) => dfaAccepts(back, w) === dfaAccepts(min, w))); }
  { let ok = 0; for (const t of ['start q0', 'q0 a', 'q0 ab q1', 'q0 a q1\nq0 a q2']) { try { parseDFA(t); } catch { ok++; } } check('fsm: bad DFA text rejected (no moves, short line, long symbol, two moves on one symbol)', ok === 4); }
  { let ok = 0; for (const re of ['(a', 'a)', '*a', 'a**', '[ab', 'a{3,1}', '^a', 'a{', '\\q', '(?=a)']) { try { parseRegex(re); } catch { ok++; } } check('fsm: bad regexes rejected with a message (10 kinds)', ok === 10); }
  check('fsm: symbol labels', symLabel(['a', 'b', 'c', 'd', 'x']) === 'a-d,x' && symLabel(['a', 'b']) === 'a,b' && symLabel([' ']) === '␣');
};
