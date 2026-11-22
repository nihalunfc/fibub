// Sets, relations and functions (Plus Two entrance, Mathematics). Original fibub questions.
import { pick, int, choose, fmt, shuffleOpts, numOpts } from '../_entrance.js';

const R = String.raw;
const EXS = {
  1: ['keam', 'cusat', 'comedk', 'jee-main'],
  2: ['keam', 'cusat', 'comedk', 'jee-main'],
  3: ['jee-main', 'keam', 'comedk'],
  4: ['jee-main', 'jee-adv'],
  5: ['jee-adv'],
};
const POS = [1, 3, 0, 2, 2, 0, 3, 1];
let _n = 0;
const place = (correct, wrongs) => {
  const p = POS[_n++ % POS.length];
  const o = [...wrongs];
  o.splice(p, 0, correct);
  return { options: o, answer: p };
};
const base = (id, level, sub, extra) => ({ id, level, exams: EXS[level], sub, ...extra });
/** single-answer mcq: correct text goes to a rotating position */
const M = (id, level, sub, q, correct, wrongs, sol, trap, more = {}) =>
  base(id, level, sub, { type: 'mcq', format: 'single', q, ...place(correct, wrongs), sol, trap, ...more });
/** integer answer */
const I = (id, level, sub, q, answer, sol, trap, more = {}) =>
  base(id, level, sub, { type: 'nat', format: 'integer', q, answer, tol: 0, sol, trap, ...more });
/** decimal answer */
const N = (id, level, sub, q, answer, tol, sol, trap, more = {}) =>
  base(id, level, sub, { type: 'nat', format: 'numeric', q, answer, tol, sol, trap, ...more });
/** one-or-more correct */
const X = (id, level, sub, q, options, answer, sol, trap, more = {}) =>
  base(id, level, sub, { type: 'msq', format: 'multi', q, options, answer, sol, trap, ...more });
const AOPT = [
  'Both A and R are true and R is the correct explanation of A',
  'Both A and R are true but R is not the correct explanation of A',
  'A is true but R is false',
  'A is false but R is true',
];
const SOPT = [
  'Both Statement I and Statement II are true',
  'Statement I is true and Statement II is false',
  'Statement I is false and Statement II is true',
  'Both Statement I and Statement II are false',
];
/** assertion-reason (answer = index into AOPT) */
const A = (id, level, sub, a, r, answer, sol, trap, more = {}) =>
  base(id, level, sub, { type: 'mcq', format: 'assertion', q: `<p><b>Assertion (A):</b> ${a}</p><p><b>Reason (R):</b> ${r}</p>`, options: AOPT, answer, sol, trap, ...more });
/** two statements */
const S = (id, level, sub, s1, s2, answer, sol, trap, more = {}) =>
  base(id, level, sub, { type: 'mcq', format: 'statements', q: `<p><b>Statement I:</b> ${s1}</p><p><b>Statement II:</b> ${s2}</p>`, options: SOPT, answer, sol, trap, ...more });
/** match (codes placed in rotating position) */
const MT = (id, level, sub, group, q, correct, wrongs, sol, trap) =>
  base(id, level, sub, { type: 'mcq', format: 'match', group, q, ...place(correct, wrongs), sol, trap });
/** passage item */
const P = (id, level, sub, group, q, correct, wrongs, sol, trap) =>
  base(id, level, sub, { type: 'mcq', format: 'passage', group, q, ...place(correct, wrongs), sol, trap });
const PI = (id, level, sub, group, q, answer, sol, trap) =>
  base(id, level, sub, { type: 'nat', format: 'passage', group, q, answer, tol: 0, sol, trap });

const groups = {
  m1: {
    title: 'Types of function',
    passage: R`<p>Each function in List I is defined from $\mathbb{R}$ to $\mathbb{R}$. Match it with its type in List II.</p>`,
    list1: ['A. $f(x)=e^{x}$', 'B. $f(x)=x^{3}-x$', 'C. $f(x)=2x+1$', 'D. $f(x)=|x|$'],
    list2: ['p. one-one but not onto', 'q. onto but not one-one', 'r. both one-one and onto', 's. neither one-one nor onto'],
  },
  m2: {
    title: 'Relations on the integers',
    passage: R`<p>A relation $R$ is defined on $\mathbb{Z}$. Match each rule in List I with the property list in List II (choose the one that describes it exactly).</p>`,
    list1: ['A. $aRb \\iff a<b$', 'B. $aRb \\iff a+b=0$', 'C. $aRb \\iff a\\equiv b \\pmod 4$', 'D. $aRb \\iff a\\le b$'],
    list2: ['p. reflexive and transitive, not symmetric', 'q. symmetric only', 'r. reflexive, symmetric and transitive', 's. transitive only'],
  },
  m3: {
    title: 'Counting on a 3-element set',
    passage: R`<p>Let $A$ be a set with exactly 3 elements. Match each count in List I with its value in List II.</p>`,
    list1: ['A. functions from $A$ to $A$', 'B. one-one functions from $A$ onto $A$', 'C. relations on $A$ that are reflexive and symmetric', 'D. equivalence relations on $A$'],
    list2: ['p. 5', 'q. 6', 'r. 8', 's. 27'],
  },
  m4: {
    title: 'Periods',
    passage: R`<p>Match each function in List I with its fundamental period in List II.</p>`,
    list1: ['A. $|\\sin x|+|\\cos x|$', 'B. $\\sin 2x$', 'C. $\\sin x+\\cos x$', 'D. $\\cos(x/2)$'],
    list2: ['p. $\\pi/2$', 'q. $\\pi$', 'r. $2\\pi$', 's. $4\\pi$'],
  },
  p1: {
    title: 'Passage: the function [2x] - 2[x]',
    passage: R`<p>Let $[t]$ be the greatest integer not exceeding $t$ and $\{t\}=t-[t]$. Define $f(x)=[2x]-2[x]$. Writing $x=[x]+\{x\}$ we get $[2x]=2[x]+[2\{x\}]$, so $f(x)=[2\{x\}]$. Hence $f(x)=0$ when $\{x\}<\tfrac12$ and $f(x)=1$ when $\{x\}\ge\tfrac12$.</p>`,
  },
  p2: {
    title: 'Passage: functions between finite sets',
    passage: R`<p>Let $A$ have 5 elements and $B$ have 3 elements. Functions $f:A\to B$ are counted by what they do to each of the 5 elements. The number of onto functions from an $m$-element set to an $n$-element set is $\sum_{k=0}^{n}(-1)^{k}\binom nk (n-k)^{m}$.</p>`,
  },
};

const items = [
  // ---------- sets ----------
  M('srf-001', 1, 'power set', R`A set $A$ has 5 elements. How many subsets does $A$ have?`, '32', ['10', '25', '31'],
    R`<p>Each of the 5 elements is either in a subset or not in it: 2 choices each.</p><p>Number of subsets $=2^5=32$. (This includes the empty set and $A$ itself.)</p>`,
    'Writing 31 (leaving out the empty set) or 25 (5 squared) are the usual slips.'),
  M('srf-002', 1, 'counting', R`If $n(A)=20$, $n(B)=15$ and $n(A\cap B)=8$, then $n(A\cup B)$ equals`, '27', ['35', '43', '12'],
    R`<p>Use $n(A\cup B)=n(A)+n(B)-n(A\cap B)$.</p><p>$=20+15-8=27$.</p>`,
    'Adding 20 + 15 = 35 counts the common elements twice.'),
  M('srf-003', 2, 'counting', R`In a class of 60 students, 35 play cricket, 28 play football and 12 play both. How many play neither game?`, '9', ['3', '12', '15'],
    R`<p>Students playing at least one game $=35+28-12=51$.</p><p>Neither $=60-51=9$.</p>`,
    'The number 3 comes from 35 + 28 - 60, which wrongly treats the whole overlap as the answer.'),
  M('srf-004', 2, 'counting', R`If $n(A)=30$, $n(B)=25$, $n(C)=20$, $n(A\cap B)=10$, $n(B\cap C)=8$, $n(C\cap A)=6$ and $n(A\cap B\cap C)=4$, then $n(A\cup B\cup C)$ is`, '55', ['51', '75', '47'],
    R`<p>$n(A\cup B\cup C)=\sum n(A)-\sum n(A\cap B)+n(A\cap B\cap C)$.</p><p>$=75-24+4=55$.</p>`,
    'Forgetting to add back the triple overlap gives 51. Subtracting it again gives 47.'),
  I('srf-005', 3, 'counting', R`In a town, 60% of the people read paper $P$, 50% read $Q$ and 40% read $R$. Also 30% read both $P$ and $Q$, 20% read both $Q$ and $R$, 25% read both $P$ and $R$, and 10% read all three. What percentage read <b>exactly one</b> of the three papers?`, 30,
    R`<p>Use region counting. Only $P$ and $Q$ (not $R$): $30-10=20$. Only $Q$ and $R$: $20-10=10$. Only $P$ and $R$: $25-10=15$.</p><p>Only $P$: $60-20-15-10=15$. Only $Q$: $50-20-10-10=10$. Only $R$: $40-10-15-10=5$.</p><p>Exactly one $=15+10+5=30$.</p><p>Check: union $=60+50+40-30-20-25+10=85$ and exactly two $=20+10+15=45$, so $85-45-10=30$.</p>`,
    'The pair counts 30, 20, 25 include the people in all three, so subtract 10 from each first.'),
  M('srf-006', 1, 'power set', R`If $A=\{1,2\}$, the number of elements of $P(P(A))$ is`, '16', ['8', '4', '32'],
    R`<p>$P(A)$ has $2^2=4$ elements. $P(P(A))$ has $2^4=16$ elements.</p>`,
    '2^3 = 8 comes from forgetting to take the power set twice.'),
  M('srf-007', 3, 'counting', R`A universal set $U$ has 60 elements. $A$ and $B$ are subsets with $n(A)=40$ and $n(B)=30$. The least possible value of $n(A\cap B)$ is`, '10', ['0', '20', '30'],
    R`<p>$n(A\cup B)\le 60$, so $n(A\cap B)=n(A)+n(B)-n(A\cup B)\ge 70-60=10$.</p><p>It is attained when $A\cup B=U$.</p>`,
    '0 is tempting, but the two sets together are too big to be disjoint inside 60 elements.'),
  M('srf-008', 2, 'set operations', R`If $A=\{2,4,6,8,10\}$ and $B=\{3,6,9\}$, then $n(A\,\triangle\,B)$, the number of elements in exactly one of the two sets, is`, '6', ['7', '1', '8'],
    R`<p>$A\cap B=\{6\}$. $A\triangle B=(A\cup B)\setminus(A\cap B)=\{2,3,4,8,9,10\}$.</p><p>It has $5+3-2\times1=6$ elements.</p>`,
    '7 is n(A ∪ B); the symmetric difference also removes the common element.'),
  M('srf-009', 2, 'intervals', R`If $A=[1,5)$ and $B=(3,8]$, then $A-B$ equals`, R`$[1,3]$`, [R`$[1,3)$`, R`$(3,5)$`, R`$[3,5)$`],
    R`<p>$A-B$ keeps the points of $A$ that are not in $B$. $B$ starts just after 3, so 3 itself is not in $B$.</p><p>Points of $A$ with $x\le 3$: $[1,3]$.</p>`,
    'Decide whether the end point 3 belongs: 3 is in A and not in B, so it stays.'),
  I('srf-010', 4, 'subsets', R`Let $S=\{1,2,3,4,5,6\}$. How many subsets $X$ of $S$ satisfy $\{1,2\}\subseteq X$?`, 16,
    R`<p>Elements 1 and 2 must be in $X$. Each of the other 4 elements is free.</p><p>Count $=2^4=16$.</p>`,
    'The condition fixes two elements; only the remaining 4 give a choice.'),
  I('srf-011', 4, 'counting subsets', R`Find the number of ordered pairs $(A,B)$ of subsets of $\{1,2,3,4\}$ with $A\subseteq B$.`, 81,
    R`<p>Treat each element separately. It can be in neither set, in $B$ only, or in both $A$ and $B$ (it cannot be in $A$ only).</p><p>3 choices per element, so $3^4=81$.</p>`,
    'Counting 2 choices per set gives 2^8 = 256, which includes pairs with A not inside B.'),
  I('srf-012', 4, 'counting subsets', R`Find the number of ordered pairs $(A,B)$ of subsets of $X=\{1,2,3,4,5\}$ such that $A\cup B=X$.`, 243,
    R`<p>Each element must lie in $A$ only, $B$ only, or both: 3 choices. The case "in neither" is not allowed.</p><p>Total $=3^5=243$.</p>`,
    'The same 3^n shows up with A inside B, but the reason is different.'),
  I('srf-013', 5, 'counting subsets', R`How many subsets of $\{1,2,\dots,10\}$ (including the empty set) contain no two consecutive integers?`, 144,
    R`<p>Let $a_n$ be the count for $\{1,\dots,n\}$. Subsets without $n$: $a_{n-1}$. Subsets with $n$ cannot have $n-1$: $a_{n-2}$. So $a_n=a_{n-1}+a_{n-2}$.</p><p>$a_0=1$, $a_1=2$, then $3,5,8,13,21,34,55,89,144$.</p><p>$a_{10}=144$.</p>`,
    'This is a Fibonacci count in disguise; a_10 is the twelfth Fibonacci number.'),
  I('srf-014', 5, 'counting subsets', R`Find the number of ordered triples $(A,B,C)$ of subsets of $\{1,2,3\}$ such that $A\cup B\cup C=\{1,2,3\}$.`, 343,
    R`<p>Each element must belong to at least one of $A,B,C$. The number of non-empty choices of which sets contain it is $2^3-1=7$.</p><p>Elements are independent, so the total is $7^3=343$.</p>`,
    'Count per element, not per set.'),
  A('srf-015', 2, 'power set', R`If $A\subseteq B$ then $P(A)\subseteq P(B)$.`, R`Every subset of $A$ is also a subset of $B$ when $A\subseteq B$.`, 0,
    R`<p>Take any $X\in P(A)$, so $X\subseteq A\subseteq B$. Then $X\subseteq B$, so $X\in P(B)$. The reason is exactly this argument, so A and R are true and R explains A.</p>`,
    'Do not confuse "X is a subset of A" with "X is an element of A".'),
  S('srf-016', 2, 'set algebra', R`$(A\cup B)'=A'\cap B'$.`, R`$(A\cap B)'=A'\cap B'$.`, 1,
    R`<p>De Morgan: the complement of a union is the intersection of the complements, so I is true.</p><p>The complement of an intersection is the <i>union</i> of the complements: $(A\cap B)'=A'\cup B'$. So II is false.</p>`,
    'Remember: when the complement goes inside the brackets, union and intersection swap.'),
  S('srf-017', 3, 'counting', R`If $A\cap B=\varnothing$, then $n(A\cup B)=n(A)+n(B)$.`, R`For all finite sets, $n(A\cup B)=n(A)+n(B)-n(A\cap B)$.`, 0,
    R`<p>II is the general rule. When $A\cap B=\varnothing$ we have $n(A\cap B)=0$, and the rule gives I. Both are true.</p>`,
    'Statement I is just a special case of II.'),
  S('srf-018', 2, 'equivalence classes', R`An equivalence relation on a set splits it into non-overlapping classes.`, R`Every element belongs to exactly one equivalence class.`, 0,
    R`<p>Reflexivity puts $a$ in its own class. Symmetry and transitivity show two classes are either equal or disjoint. So both statements are true.</p>`,
    'The partition fact and the "exactly one class" fact are two views of the same result.'),
  X('srf-019', 3, 'power set', R`Let $A=\{1,2\}$. Which of the following are true?`,
    [R`$\{1\}\in P(A)$`, R`$\{1\}\subset P(A)$`, R`$\varnothing\subset P(A)$`, R`$\varnothing\in P(A)$`, R`$1\in P(A)$`], [0, 2, 3],
    R`<p>$P(A)=\{\varnothing,\{1\},\{2\},\{1,2\}\}$.</p><p>$\{1\}$ is an element: first option true. $\{1\}\subset P(A)$ would need 1 to be an element of $P(A)$: false. $\varnothing$ is a subset of every set: true. $\varnothing$ is also an element of $P(A)$: true. $1\in P(A)$ false.</p>`,
    'Elements of P(A) are sets; 1 is not one of them.'),

  // ---------- relations ----------
  M('srf-020', 1, 'counting relations', R`How many relations are there from $A=\{1,2,3\}$ to $A$ itself?`, '512', ['9', '81', '256'],
    R`<p>$A\times A$ has 9 ordered pairs. A relation is any subset, so there are $2^9=512$.</p>`,
    '9 is the size of A × A, not the number of subsets of it.'),
  M('srf-021', 2, 'counting relations', R`The number of reflexive relations on a set of 4 elements is`, '4096', ['65536', '4095', '144'],
    R`<p>A reflexive relation must contain the 4 pairs $(a,a)$. The other $16-4=12$ pairs are free: $2^{12}=4096$.</p>`,
    '65536 = 2^16 counts all relations.'),
  I('srf-022', 3, 'counting relations', R`How many symmetric relations are there on a set of 3 elements?`, 64,
    R`<p>Pairs split into 3 diagonal pairs $(a,a)$ and 3 unordered pairs $\{a,b\}$. Each of these $3+3=6$ is in or out together with its mirror image.</p><p>$2^6=64$ (general formula $2^{n(n+1)/2}$).</p>`,
    'The diagonal pairs are their own mirror image, so they count as separate free choices.'),
  I('srf-023', 3, 'equivalence relations', R`How many different equivalence relations can be defined on $\{1,2,3\}$?`, 5,
    R`<p>An equivalence relation is the same as a partition. Partitions of a 3-set: one block (1), blocks of sizes 2+1 (3 ways), three singletons (1).</p><p>$1+3+1=5$.</p>`,
    'Count partitions, not relations. The answer is the Bell number B(3).'),
  I('srf-024', 3, 'counting relations', R`How many relations on a 4-element set are both reflexive and symmetric?`, 64,
    R`<p>Diagonal pairs are forced. The off-diagonal pairs form $\binom42=6$ mirror pairs, each free: $2^6=64$.</p>`,
    'The diagonal gives no freedom here; the freedom is only in the 6 pairs {a,b}.'),
  I('srf-025', 4, 'counting relations', R`How many antisymmetric relations are there on a set of 3 elements?`, 216,
    R`<p>Antisymmetric: never both $(a,b)$ and $(b,a)$ for $a\ne b$.</p><p>The 3 diagonal pairs are free: $2^3$. For each of the 3 unordered pairs $\{a,b\}$ there are 3 choices (none, only $(a,b)$, only $(b,a)$): $3^3$.</p><p>Total $=8\times27=216$.</p>`,
    'A pair may be absent: that is why the factor is 3, not 2.'),
  I('srf-026', 4, 'equivalence relations', R`How many equivalence relations on $\{1,2,3,4\}$ have exactly two equivalence classes?`, 7,
    R`<p>Partitions into 2 blocks: sizes 3+1 give $\binom41=4$ ways; sizes 2+2 give $\tfrac12\binom42=3$ ways.</p><p>$4+3=7$ (Stirling number $S(4,2)=7$).</p>`,
    'For 2+2 divide by 2 because the two blocks are not ordered.'),
  M('srf-027', 2, 'types of relation', R`On $\mathbb{Z}$, $aRb$ means $a-b$ is divisible by 5. The number of distinct equivalence classes is`, '5', ['4', '10', 'infinite'],
    R`<p>$R$ is "same remainder on division by 5". Remainders $0,1,2,3,4$ give 5 classes (e.g. the class of 2 is $\{\dots,-3,2,7,\dots\}$).</p>`,
    'Negative integers do not create new classes: -3 has remainder 2.'),
  M('srf-028', 2, 'types of relation', R`On $\mathbb{N}$, $aRb$ means "$a$ divides $b$". Then $R$ is`, 'reflexive and transitive but not symmetric', ['an equivalence relation', 'symmetric and transitive but not reflexive', 'reflexive and symmetric but not transitive'],
    R`<p>$a\mid a$: reflexive. $a\mid b$ and $b\mid c\Rightarrow a\mid c$: transitive. $2\mid 4$ but $4\nmid 2$: not symmetric.</p>`,
    'Divisibility looks like equality, but it has direction.'),
  M('srf-029', 1, 'types of relation', R`On the set of straight lines in a plane, $L_1RL_2$ means $L_1\perp L_2$. The relation $R$ is`, 'symmetric only', ['reflexive only', 'an equivalence relation', 'transitive only'],
    R`<p>A line is not perpendicular to itself: not reflexive. If $L_1\perp L_2$ then $L_2\perp L_1$: symmetric. If $L_1\perp L_2$ and $L_2\perp L_3$ then $L_1\parallel L_3$, not perpendicular: not transitive.</p>`,
    'Two perpendicular steps bring you back to a parallel line.'),
  I('srf-030', 4, 'closure', R`On $A=\{1,2,3\}$, $R=\{(1,2),(2,3)\}$. The least number of ordered pairs that must be added to $R$ to make it an equivalence relation is`, 7,
    R`<p>Reflexive needs $(1,1),(2,2),(3,3)$. Symmetric needs $(2,1),(3,2)$. Then $(1,2),(2,3)$ force $(1,3)$ by transitivity and $(3,1)$ by symmetry.</p><p>The relation becomes all 9 pairs of $A\times A$. We started with 2, so we add $9-2=7$.</p>`,
    'Adding pairs for one property can break another: work until nothing more is forced.'),
  M('srf-031', 3, 'closure', R`$R=\{(1,2),(2,3),(3,4)\}$ on $\{1,2,3,4\}$. The least number of ordered pairs to add to make $R$ transitive is`, '3', ['1', '2', '6'],
    R`<p>Forced: $(1,2),(2,3)\Rightarrow(1,3)$. $(2,3),(3,4)\Rightarrow(2,4)$. $(1,3),(3,4)\Rightarrow(1,4)$.</p><p>That is 3 new pairs and nothing else is forced.</p>`,
    '6 is the size of the final relation, not the number added.'),
  X('srf-032', 3, 'types of relation', R`On $\mathbb{Z}$, define $aRb$ iff $|a-b|\le1$. Which of the following are true?`,
    ['R is reflexive', 'R is symmetric', 'R is transitive', 'R is antisymmetric'], [0, 1],
    R`<p>$|a-a|=0\le1$: reflexive. $|a-b|=|b-a|$: symmetric. $1R2$ and $2R3$ but $|1-3|=2$: not transitive. $1R2$ and $2R1$ with $1\ne2$: not antisymmetric.</p>`,
    'Closeness is not transitive: a small step twice can be too big.'),
  M('srf-033', 3, 'types of relation', R`On $A=\{1,2,3\}$ let $R=\{(1,1),(2,2),(1,2),(2,1)\}$. Which statement is correct?`, 'R is symmetric and transitive but not reflexive', ['R is an equivalence relation', 'R is reflexive and transitive but not symmetric', 'R is reflexive and symmetric but not transitive'],
    R`<p>$(3,3)\notin R$, so not reflexive. The pairs are mirror images of each other: symmetric. Any chain stays within $\{1,2\}$ and all four pairs are present: transitive.</p>`,
    'Reflexive means ALL elements of the set A, including 3, which does not appear in any pair.'),
  M('srf-034', 3, 'equivalence classes', R`On $\mathbb{N}\times\mathbb{N}$, $(a,b)\,R\,(c,d)$ means $ad=bc$. Which pair is related to $(6,9)$?`, '$(4,6)$', ['$(3,5)$', '$(9,6)$', '$(8,10)$'],
    R`<p>The rule says the fractions $a/b$ and $c/d$ are equal. $6/9=2/3$.</p><p>$(4,6)$: $4\cdot9=36=6\cdot6$. Yes. $(3,5)$: $27\ne30$. $(9,6)$: $81\ne36$. $(8,10)$: $72\ne60$.</p>`,
    'Check the cross products ad and bc, not the sums or differences.'),
  A('srf-035', 3, 'types of relation', R`$R=\{(1,1)\}$ on the set $\{1,2\}$ is symmetric and transitive but not reflexive.`, R`Every symmetric and transitive relation is reflexive.`, 2,
    R`<p>$R$ is symmetric and transitive (check: the only pair is its own mirror, and the only chain is $(1,1),(1,1)$). But $(2,2)\notin R$, so it is not reflexive. A is true.</p><p>The "proof" of R (take $aRb$, then $bRa$, then $aRa$) works only for elements that appear in some pair. So R is false.</p>`,
    'The classic wrong proof of reflexivity assumes every element is related to something.'),
  A('srf-036', 2, 'types of relation', R`"Is a divisor of" is an equivalence relation on $\mathbb{N}$.`, R`"Is a divisor of" is reflexive and transitive.`, 3,
    R`<p>It is reflexive and transitive, so R is true. But $2\mid4$ and $4\nmid2$, so it is not symmetric. A is false.</p>`,
    'Two of three properties are not enough.'),
  A('srf-037', 3, 'counting relations', R`The number of symmetric relations on a set with $n$ elements is $2^{n(n+1)/2}$.`, R`A symmetric relation is fixed by choosing freely whether each of the $n$ diagonal pairs and each of the $\binom n2$ unordered pairs $\{a,b\}$ is present.`, 0,
    R`<p>$n+\binom n2=\tfrac{n(n+1)}2$ independent yes/no choices. R is exactly the reason for A.</p>`,
    'Do not count (a,b) and (b,a) separately.'),
  S('srf-038', 2, 'types of relation', R`The empty relation on a non-empty set is symmetric and transitive.`, R`The empty relation on a non-empty set is reflexive.`, 1,
    R`<p>No pairs exist, so the conditions "if $(a,b)\in R$ then..." hold with nothing to check: I is true.</p><p>Reflexive needs $(a,a)\in R$ for every $a$, so II is false.</p>`,
    'Statements that begin with "if" are true when nothing triggers the "if".'),
  S('srf-039', 2, 'equivalence relations', R`On $\mathbb{R}$, $xRy\iff|x|=|y|$ is an equivalence relation.`, R`The equivalence class of 3 is $\{3\}$.`, 1,
    R`<p>$|x|=|x|$ (reflexive); $|x|=|y|\Rightarrow|y|=|x|$ (symmetric); equal-to-equal chains give transitivity. So I is true.</p><p>The class of 3 is every $y$ with $|y|=3$, that is $\{3,-3\}$. So II is false.</p>`,
    'Absolute value forgets the sign, so -3 is related to 3.'),
  MT('srf-040', 3, 'types of relation', 'm2', 'Match List I with List II.', 'A-s, B-q, C-r, D-p', ['A-p, B-q, C-r, D-s', 'A-s, B-r, C-q, D-p', 'A-q, B-s, C-r, D-p'],
    R`<p>A: $a<b$ is transitive; it is not reflexive ($a<a$ false) and not symmetric: s.</p><p>B: $a+b=0$ is symmetric. Not reflexive (only $a=0$). Not transitive ($1\,R\,(-1)$ and $(-1)\,R\,1$ would force $1\,R\,1$, which needs $2=0$): q.</p><p>C: same remainder mod 4: equivalence, r.</p><p>D: $a\le b$ is reflexive and transitive, not symmetric: p.</p>`,
    'a < b and a ≤ b differ only in reflexivity.'),
  MT('srf-041', 4, 'counting', 'm3', 'Match List I with List II.', 'A-s, B-q, C-r, D-p', ['A-q, B-s, C-r, D-p', 'A-s, B-q, C-p, D-r', 'A-r, B-q, C-s, D-p'],
    R`<p>A: $3^3=27$ functions. B: bijections $=3!=6$. C: three diagonal pairs forced, 3 mirror pairs free: $2^3=8$. D: partitions of a 3-set: 5.</p>`,
    'Reflexive plus symmetric leaves only the off-diagonal mirror pairs free.'),

  // ---------- functions: domain and range ----------
  M('srf-042', 1, 'domain', R`The domain of $f(x)=\sqrt{x-3}$ is`, R`$[3,\infty)$`, [R`$(3,\infty)$`, R`$(-\infty,3]$`, R`$(-\infty,3)$`],
    R`<p>A square root needs $x-3\ge0$, so $x\ge3$. At $x=3$ the root is 0, which is fine.</p>`,
    'Square root allows 0; only a denominator or a log excludes the end point.'),
  M('srf-043', 2, 'domain', R`The domain of $f(x)=\sqrt{x^2-5x+6}$ is`, R`$(-\infty,2]\cup[3,\infty)$`, [R`$[2,3]$`, R`$(2,3)$`, R`$(-\infty,2)\cup(3,\infty)$`],
    R`<p>Need $x^2-5x+6=(x-2)(x-3)\ge0$. A product of two factors is non-negative outside the roots, and equal to zero at them.</p><p>Domain: $(-\infty,2]\cup[3,\infty)$.</p>`,
    'Between the roots the quadratic is negative, so that gap is excluded.'),
  M('srf-044', 2, 'domain', R`The domain of $f(x)=\log(x^2-4x+3)$ is`, R`$(-\infty,1)\cup(3,\infty)$`, [R`$(1,3)$`, R`$(-\infty,1]\cup[3,\infty)$`, R`$[1,3]$`],
    R`<p>A logarithm needs a positive argument: $(x-1)(x-3)>0$, true for $x<1$ or $x>3$. The roots themselves give $\log 0$, not allowed.</p>`,
    'Log needs strictly positive, square root needs non-negative.'),
  M('srf-045', 2, 'domain', R`The domain of $f(x)=\dfrac{1}{\sqrt{|x|-x}}$ is`, R`$(-\infty,0)$`, [R`$(-\infty,0]$`, R`$(0,\infty)$`, R`$\mathbb{R}$`],
    R`<p>Need $|x|-x>0$ (it sits under a root and in a denominator). For $x\ge0$, $|x|-x=0$: no. For $x<0$, $|x|-x=-2x>0$: yes.</p>`,
    'x = 0 gives 0 in the denominator, so 0 is excluded.'),
  M('srf-046', 4, 'domain', R`The domain of $f(x)=\sqrt{\log_{10}\!\Big(\dfrac{5x-x^2}{4}\Big)}$ is`, R`$[1,4]$`, [R`$(1,4)$`, R`$(0,5)$`, R`$[0,5]$`],
    R`<p>The root needs $\log_{10}(\cdot)\ge0$, i.e. $\dfrac{5x-x^2}{4}\ge1$. That is $x^2-5x+4\le0$, so $(x-1)(x-4)\le0$ and $1\le x\le4$.</p><p>The log's own condition $5x-x^2>0$ is then automatically satisfied.</p>`,
    'The log condition (0, 5) is weaker than the root condition; the stronger one wins.'),
  M('srf-047', 1, 'range', R`The range of $f(x)=x^2-4x+7$ for real $x$ is`, R`$[3,\infty)$`, [R`$[7,\infty)$`, R`$(-\infty,3]$`, R`$[4,\infty)$`],
    R`<p>$f(x)=(x-2)^2+3\ge3$, with equality at $x=2$. The graph is an upward parabola, so every value from 3 upward is reached.</p>`,
    '7 is f(0), the y-intercept, not the minimum.'),
  M('srf-048', 2, 'range', R`The range of $f(x)=\dfrac{1}{2-\cos3x}$ is`, R`$\left[\tfrac13,1\right]$`, [R`$[1,3]$`, R`$\left[\tfrac12,\tfrac32\right]$`, R`$(0,1]$`],
    R`<p>$-1\le\cos3x\le1$, so $1\le2-\cos3x\le3$. Taking reciprocals reverses the order: $\tfrac13\le f\le1$. The multiple angle $3x$ does not change the range of cosine.</p>`,
    'Reciprocal flips the inequality; [1, 3] is the range of the denominator.'),
  M('srf-049', 5, 'range', R`The range of $f(x)=\dfrac{x^2+x+1}{x^2-x+1}$ is`, R`$\left[\tfrac13,3\right]$`, [R`$(0,3]$`, R`$[1,3]$`, R`$\left(\tfrac13,3\right)$`],
    R`<p>Put $y=f(x)$: $(y-1)x^2-(y+1)x+(y-1)=0$. For $y=1$ this gives $x=0$, so 1 is attained. For $y\ne1$ real $x$ needs $D\ge0$:</p><p>$(y+1)^2-4(y-1)^2\ge0\Rightarrow(3-y)(3y-1)\ge0\Rightarrow\tfrac13\le y\le3$.</p><p>Both ends are attained (at $x=-1$ and $x=1$). Range $\left[\tfrac13,3\right]$.</p>`,
    'Check the end points and the special value y = 1 separately; the discriminant method needs the x-squared coefficient not equal to 0.'),

  // ---------- extra top-rank and mixed ----------
  I('srf-113', 5, 'counting subsets', R`Find the number of ordered triples $(A,B,C)$ of subsets of $\{1,2,3,4\}$ such that $A\cup B\cup C=\{1,2,3,4\}$ and $A\cap B\cap C=\varnothing$.`, 1296,
    R`<p>Per element, record which of $A,B,C$ contain it: a subset $T\subseteq\{A,B,C\}$. The union condition forbids $T=\varnothing$; the empty triple intersection forbids $T=\{A,B,C\}$. That leaves $8-2=6$ choices.</p><p>Four independent elements: $6^4=1296$.</p>`,
    'Two forbidden patterns per element, not one.'),
  I('srf-114', 5, 'counting functions', R`How many onto functions $f:\{1,2,3,4,5,6\}\to\{a,b,c\}$ satisfy $f(1)=a$?`, 180,
    R`<p>Element 1 is fixed. For the function to be onto, the other 5 elements must cover $b$ and $c$ (they may also hit $a$).</p><p>Functions of 5 elements to $\{a,b,c\}$: $3^5=243$. Remove those missing $b$ ($2^5=32$) and those missing $c$ ($32$), add back those missing both ($1$): $243-64+1=180$.</p>`,
    'Check: by symmetry the 540 onto functions split equally over f(1) = a, b, c, so 540/3 = 180 too.'),
  I('srf-115', 4, 'counting functions', R`How many functions $f:\{1,2,3,4,5\}\to\{1,2,3,4,5\}$ satisfy $f(f(x))=x$ for all $x$?`, 26,
    R`<p>$f$ is its own inverse, hence a bijection that is a product of disjoint swaps. 0 swaps: 1. One swap: $\binom52=10$. Two swaps: $\dfrac{\binom52\binom32}{2}=15$.</p><p>$1+10+15=26$.</p>`,
    'Divide by 2 for two swaps, since the order of the swaps does not matter.'),
  I('srf-116', 4, 'equivalence relations', R`How many equivalence relations on $\{1,2,3,4,5\}$ contain both $(1,2)$ and $(3,4)$?`, 5,
    R`<p>1 and 2 lie in one class, 3 and 4 lie in one class. Treat $\{1,2\}$, $\{3,4\}$ and $\{5\}$ as three objects and partition them: the Bell number $B_3=5$.</p>`,
    'The two forced pairs may or may not end in the same class.'),
  M('srf-117', 3, 'mixed', R`The domain of $f(x)=\sqrt{9-x^2}+\dfrac1{\sqrt{x^2-x-2}}$ is`, R`$[-3,-1)\cup(2,3]$`, [R`$[-3,3]$`, R`$[-3,-1]\cup[2,3]$`, R`$(-1,2)$`],
    R`<p>First root: $9-x^2\ge0\Rightarrow-3\le x\le3$. Second: $x^2-x-2=(x-2)(x+1)>0$ (strict because it is in a denominator) $\Rightarrow x<-1$ or $x>2$.</p><p>Intersect: $[-3,-1)\cup(2,3]$.</p>`,
    'The denominator condition is strict; the numerator root condition is not.', { sub: 'mixed' }),
  M('srf-050', 2, 'range', R`The range of $f(x)=\dfrac{1}{x^2-4x+5}$ is`, R`$(0,1]$`, [R`$[1,\infty)$`, R`$\left(0,\tfrac12\right]$`, R`$(-\infty,1]$`],
    R`<p>$x^2-4x+5=(x-2)^2+1\ge1$, so $f(x)\le1$, equal to 1 at $x=2$. As the denominator grows, $f\to0^{+}$ but never reaches 0.</p>`,
    'The value 0 is approached, not attained.'),
  I('srf-051', 3, 'range', R`How many integers lie in the range of $f(x)=3\sin x+4\cos x+6$?`, 11,
    R`<p>$3\sin x+4\cos x$ takes every value in $[-5,5]$ (since $\sqrt{3^2+4^2}=5$). So $f$ takes every value in $[1,11]$.</p><p>Integers $1,2,\dots,11$: 11 of them.</p>`,
    'Do not forget both end values 1 and 11.', { sub: 'mixed' }),
  X('srf-052', 4, 'range', R`Let $g(x)=\sqrt{x-2}+\sqrt{4-x}$. Which of the following values does $g$ take for some real $x$?`,
    [R`$\sqrt2$`, '1.3', '2', '2.1'], [0, 2],
    R`<p>Domain $[2,4]$. Square: $g^2=2+2\sqrt{(x-2)(4-x)}$. The product $(x-2)(4-x)$ goes from 0 (at the ends) to 1 (at $x=3$). So $g^2$ lies in $[2,4]$ and $g\in[\sqrt2,2]$ with every value between.</p><p>$\sqrt2\approx1.414$ is the smallest value (at $x=2$ or $4$) and 2 the largest (at $x=3$). So $\sqrt2$ and 2 are attained, 1.3 is below the minimum and 2.1 above the maximum.</p>`,
    'Careful: the range is a whole interval, not only the end values.'),

  // ---------- counting functions ----------
  M('srf-053', 1, 'counting functions', R`How many functions are there from $\{1,2,3\}$ to $\{a,b,c,d\}$?`, '64', ['81', '12', '24'],
    R`<p>Each of the 3 elements of the domain can go to any of the 4 elements of the codomain: $4^3=64$.</p>`,
    '3^4 = 81 reverses the roles of domain and codomain.'),
  M('srf-054', 1, 'counting functions', R`The number of one-one functions from a 3-element set to a 5-element set is`, '60', ['125', '243', '10'],
    R`<p>First element: 5 choices, second: 4, third: 3. $5\times4\times3=60$ ($={}^5P_3$).</p>`,
    '125 = 5^3 is the count of ALL functions.'),
  I('srf-055', 3, 'counting functions', R`How many onto functions are there from a 5-element set to a 3-element set?`, 150,
    R`<p>By inclusion-exclusion: total $3^5=243$, minus functions missing at least one target value: $\binom31 2^5=96$, plus those missing two: $\binom32 1^5=3$.</p><p>$243-96+3=150$.</p>`,
    '243 - 96 = 147 forgets the last correction.'),
  I('srf-056', 4, 'counting functions', R`Find the number of onto functions from $\{1,2,3,4,5,6\}$ to $\{1,2,3,4\}$.`, 1560,
    R`<p>$\sum_{k=0}^{4}(-1)^k\binom4k(4-k)^6=4^6-4\cdot3^6+6\cdot2^6-4\cdot1^6$.</p><p>$=4096-2916+384-4=1560$.</p>`,
    'The signs alternate and the last term is 4, not 1.'),
  I('srf-057', 3, 'counting functions', R`How many bijections $f$ of $\{1,2,3,4,5\}$ onto itself satisfy $f(1)\ne1$?`, 96,
    R`<p>All bijections: $5!=120$. Those with $f(1)=1$: the other four elements are permuted: $4!=24$.</p><p>$120-24=96$.</p>`,
    'Subtract the unwanted case from the total; counting "4 choices for f(1)" then 4! gives the same 96.'),
  M('srf-058', 4, 'counting functions', R`How many functions $f:\{1,2,3\}\to\{1,2,3,4,5\}$ satisfy $f(1)\le f(2)\le f(3)$?`, '35', ['10', '60', '125'],
    R`<p>A non-decreasing function is a choice of 3 values with repetition allowed, written in order. Number of multisets of size 3 from 5 values: $\binom{5+3-1}{3}=\binom73=35$.</p>`,
    '10 = C(5,3) counts strictly increasing functions.'),
  I('srf-059', 4, 'counting functions', R`How many functions $f:\{1,2,3,4\}\to\{1,2,3,4\}$ satisfy $f(f(x))=x$ for every $x$?`, 10,
    R`<p>Such an $f$ is its own inverse, so it is a bijection made of swaps and fixed points (an involution).</p><p>0 swaps: 1. One swap: $\binom42=6$. Two swaps: 3.</p><p>$1+6+3=10$.</p>`,
    'Self-inverse means f is a bijection first.'),
  I('srf-060', 5, 'counting functions', R`How many functions $f:\{1,2,3,4,5\}\to\{1,2,3,4,5\}$ satisfy $f\circ f=f$?`, 196,
    R`<p>$f\circ f=f$ means $f(y)=y$ for every $y$ in the range of $f$. Choose the range (the set of fixed points), of size $k$; each of the other $5-k$ elements maps into that range freely: $k^{5-k}$ ways.</p><p>$\sum_{k=1}^{5}\binom5k k^{5-k}=5\cdot1+10\cdot8+10\cdot9+5\cdot4+1\cdot1=5+80+90+20+1=196$.</p>`,
    'Counting by the range (the set of fixed points) is the key step.'),
  A('srf-061', 2, 'counting functions', R`The number of onto functions from a 2-element set to a 3-element set is 0.`, R`An onto function needs the domain to have at least as many elements as the codomain.`, 0,
    R`<p>Two elements can hit at most two target values, never all three. So A is true because of R.</p>`,
    'The reverse (domain larger) does not guarantee onto; it only makes onto possible.'),

  // ---------- types of function ----------
  M('srf-062', 3, 'one-one onto', R`Which of the following functions $f:\mathbb{R}\to\mathbb{R}$ is a bijection?`, R`$f(x)=x|x|$`, [R`$f(x)=e^{x}$`, R`$f(x)=x^3-x$`, R`$f(x)=\sin x$`],
    R`<p>$x|x|$ equals $x^2$ for $x\ge0$ and $-x^2$ for $x<0$. It is strictly increasing and takes every real value: bijective.</p><p>$e^x$ is one-one but only positive. $x^3-x$ is onto but $f(0)=f(1)=0$. $\sin x$ is neither.</p>`,
    'The modulus makes x|x| look odd-shaped but it is monotonic.'),
  S('srf-063', 2, 'one-one onto', R`$f:\mathbb{R}\to\mathbb{R}$, $f(x)=x^3$ is a bijection.`, R`$f:\mathbb{R}\to[0,\infty)$, $f(x)=x^2$ is a bijection.`, 1,
    R`<p>$x^3$ is strictly increasing and covers $\mathbb{R}$: I true.</p><p>$x^2$ is onto $[0,\infty)$ but $f(2)=f(-2)$: not one-one. II false.</p>`,
    'Making the codomain equal to the range fixes onto, not one-one.'),
  MT('srf-064', 3, 'one-one onto', 'm1', 'Match List I with List II.', 'A-p, B-q, C-r, D-s', ['A-q, B-p, C-r, D-s', 'A-p, B-q, C-s, D-r', 'A-r, B-q, C-p, D-s'],
    R`<p>A: $e^x$ is increasing so one-one, but only positive: p.</p><p>B: $x^3-x$ takes every real value but $f(0)=f(1)$: q.</p><p>C: $2x+1$ is bijective: r.</p><p>D: $|x|$ has $f(1)=f(-1)$ and is never negative: s.</p>`,
    'Check both properties separately.'),
  S('srf-065', 1, 'basics', R`Every function from $A$ to $B$ is a relation from $A$ to $B$.`, R`Every relation from $A$ to $B$ is a function.`, 1,
    R`<p>A function is a special relation (each element of $A$ has exactly one image), so I is true. A relation may relate one element to several, or none, so II is false.</p>`,
    'Function is the special case; the reverse fails.'),
  I('srf-066', 3, 'statements', R`How many of the following statements are correct?
<br>(i) If $|A|>|B|$, no function from $A$ to $B$ is one-one.
<br>(ii) If $|A|<|B|$, no function from $A$ to $B$ is onto.
<br>(iii) A function that is both even and odd, on a domain symmetric about 0, must be the zero function.
<br>(iv) The sum of any two periodic functions is periodic.`, 3,
    R`<p>(i) True (pigeonhole). (ii) True: fewer inputs than outputs cannot cover every output. (iii) True: $f(-x)=f(x)$ and $f(-x)=-f(x)$ give $f(x)=0$. (iv) False: $\sin x+\cos(\sqrt2x)$ is not periodic.</p><p>Three are correct.</p>`,
    'Statement (iv) fails when the periods are incommensurable.', { format: 'statements' }),

  // ---------- composition, inverse ----------
  M('srf-067', 1, 'composition', R`If $f(x)=2x+3$ and $g(x)=x^2$, then $(g\circ f)(1)$ equals`, '25', ['11', '5', '7'],
    R`<p>$(g\circ f)(1)=g(f(1))$. $f(1)=5$, $g(5)=25$.</p>`,
    '$(f\circ g)(1)=2\cdot1+3=5$ is the other order; read right to left.'),
  N('srf-068', 4, 'composition', R`Let $f(x)=\dfrac{x}{1-x}$ for $x\ne1$. Find $f(f(f(\dots f(x))))$ with $f$ applied 10 times, evaluated at $x=\tfrac1{20}$. Give the decimal.`, 0.1, 0.001,
    R`<p>$f(f(x))=\dfrac{x/(1-x)}{1-x/(1-x)}=\dfrac{x}{1-2x}$. By induction $f^{(n)}(x)=\dfrac{x}{1-nx}$.</p><p>$f^{(10)}(1/20)=\dfrac{1/20}{1-10/20}=\dfrac{1/20}{1/2}=0.1$.</p>`,
    'Find the pattern from two compositions; do not iterate ten times by hand.'),
  M('srf-069', 2, 'inverse', R`If $f(x)=\dfrac{2x+1}{x-3}$, then $f^{-1}(x)$ is`, R`$\dfrac{3x+1}{x-2}$`, [R`$\dfrac{x-3}{2x+1}$`, R`$\dfrac{3x-1}{x+2}$`, R`$\dfrac{2x+1}{x-3}$`],
    R`<p>Put $y=\dfrac{2x+1}{x-3}$: $yx-3y=2x+1\Rightarrow x(y-2)=3y+1\Rightarrow x=\dfrac{3y+1}{y-2}$.</p><p>Swap the names: $f^{-1}(x)=\dfrac{3x+1}{x-2}$.</p>`,
    '1/f(x) is not the inverse.'),
  M('srf-070', 3, 'inverse', R`The function $f:[-1,\infty)\to[-1,\infty)$ is $f(x)=x^2+2x$. Its inverse is`, R`$f^{-1}(x)=-1+\sqrt{x+1}$`, [R`$f^{-1}(x)=-1-\sqrt{x+1}$`, R`$f^{-1}(x)=\sqrt{x+1}$`, R`$f^{-1}(x)=1+\sqrt{x+1}$`],
    R`<p>$y=(x+1)^2-1\Rightarrow x+1=\pm\sqrt{y+1}$. The domain is $x\ge-1$, so $x+1\ge0$: take the plus sign. $x=-1+\sqrt{y+1}$.</p>`,
    'The domain decides the sign of the root.'),
  I('srf-071', 3, 'inverse', R`If $f(x)=x^3+3x+1$ for real $x$, find $f^{-1}(5)$.`, 1,
    R`<p>$f$ is strictly increasing ($f'(x)=3x^2+3>0$), so it has an inverse. Solve $x^3+3x+1=5$: try $x=1$: $1+3+1=5$. Yes.</p><p>$f^{-1}(5)=1$.</p>`,
    'You never need the inverse formula: just solve f(x) = 5 by inspection.'),
  I('srf-072', 4, 'inverse', R`The function $f(x)=x^3$ on $\mathbb{R}$ has an inverse. How many real solutions does $f(x)=f^{-1}(x)$ have?`, 3,
    R`<p>$f$ is increasing. For an increasing function the graph of $f$ meets its inverse's graph only on the line $y=x$. So solve $x^3=x$: $x=0,1,-1$.</p><p>3 solutions.</p>`,
    'This works only for increasing functions; for decreasing ones there can be extra off-line points.'),
  A('srf-073', 2, 'inverse', R`$f(x)=\dfrac1x$ on $\mathbb{R}\setminus\{0\}$ is its own inverse.`, R`$f(f(x))=x$ for every $x\ne0$.`, 0,
    R`<p>$f(f(x))=1/(1/x)=x$. A function with $f\circ f=\text{identity}$ is its own inverse. R explains A.</p>`,
    'Do not confuse the reciprocal with the inverse function; they coincide here only because the function is x -> 1/x.'),
  A('srf-074', 3, 'inverse', R`$f(x)=\sin x$ from $\mathbb{R}$ to $\mathbb{R}$ is not invertible.`, R`$f$ is not one-one (and not onto $\mathbb{R}$).`, 0,
    R`<p>$\sin0=\sin\pi$ and the range is only $[-1,1]$. Failing either condition kills invertibility.</p>`,
    'Restricting to [-pi/2, pi/2] with codomain [-1, 1] makes it invertible.'),

  // ---------- even, odd, periodic ----------
  M('srf-075', 1, 'even and odd', R`Which of the following is an even function?`, R`$x\sin x$`, [R`$x^2\sin x$`, R`$x\,(e^{x}+e^{-x})$`, R`$\sin x+x^2$`],
    R`<p>Even $\times$ even or odd $\times$ odd is even. $x$ and $\sin x$ are both odd, so $x\sin x$ is even.</p><p>$x^2\sin x$: even times odd is odd. $x(e^x+e^{-x})$: odd times even is odd. $\sin x+x^2$: neither.</p>`,
    'Sum of an odd and an even function is neither (unless one is zero).'),
  I('srf-076', 3, 'even and odd', R`The even part of $f(x)=(x+1)^3$ is $\dfrac{f(x)+f(-x)}2$. Find its value at $x=2$.`, 13,
    R`<p>$f(2)=27$, $f(-2)=(-1)^3=-1$.</p><p>Even part $=\dfrac{27+(-1)}2=13$.</p><p>Check with the formula: even part $=1+3x^2$, at $x=2$: $13$.</p>`,
    'f(-2) = (-2+1)^3, not (−2)^3 + 1.'),
  A('srf-077', 2, 'even and odd', R`The product of two odd functions is an even function.`, R`If $f$ and $g$ are odd, $f(-x)g(-x)=(-f(x))(-g(x))=f(x)g(x)$.`, 0,
    R`<p>The algebra in R shows $h=fg$ satisfies $h(-x)=h(x)$. R is the proof of A.</p>`,
    'Odd × even is odd; odd × odd is even.'),
  A('srf-078', 3, 'even and odd', R`The signum function is odd.`, R`The signum function takes only the values $-1$, $0$ and $1$.`, 1,
    R`<p>$\operatorname{sgn}(-x)=-\operatorname{sgn}(x)$ for all $x$ (also at 0): A is true. R is also true, but listing the values taken does not explain oddness; what matters is that $x$ and $-x$ get opposite values. So both are true and R is not the explanation.</p>`,
    'Taking three values does not by itself make a function odd.'),
  M('srf-079', 2, 'periodic', R`The period of $\sin 3x+\cos 2x$ is`, R`$2\pi$`, [R`$\pi$`, R`$\dfrac{2\pi}{3}$`, R`$6\pi$`],
    R`<p>$\sin3x$ has period $\dfrac{2\pi}3$; $\cos2x$ has period $\pi$. The sum repeats at the least common multiple of $\dfrac{2\pi}3$ and $\pi$.</p><p>$\dfrac{2\pi}{3}\times3=2\pi$ and $\pi\times2=2\pi$: LCM $=2\pi$.</p>`,
    'LCM of 2/3 and 1 (in units of pi) is 2, not 2/3.'),
  M('srf-080', 3, 'periodic', R`The fundamental period of $f(x)=|\sin x|+|\cos x|$ is`, R`$\dfrac\pi2$`, [R`$\pi$`, R`$2\pi$`, R`$\dfrac\pi4$`],
    R`<p>Replace $x$ by $x+\dfrac\pi2$: $|\sin(x+\tfrac\pi2)|+|\cos(x+\tfrac\pi2)|=|\cos x|+|\sin x|$. So $\pi/2$ is a period. A smaller period like $\pi/4$ fails: at $x=0$, $f=1$, but at $x=\pi/4$, $f=\sqrt2$.</p>`,
    'Each term alone has period pi; the sum repeats sooner.'),
  I('srf-081', 3, 'periodic', R`Find the fundamental period of $f(x)=\cos\dfrac{\pi x}{2}+\sin\dfrac{\pi x}{3}$.`, 12,
    R`<p>$\cos\frac{\pi x}2$ has period $\dfrac{2\pi}{\pi/2}=4$. $\sin\frac{\pi x}3$ has period $\dfrac{2\pi}{\pi/3}=6$.</p><p>LCM$(4,6)=12$.</p>`,
    'LCM, not the product 24.'),
  X('srf-082', 4, 'periodic', R`Which of the following functions are periodic?`,
    [R`$\sin(x^2)$`, R`$\sin x+\cos(\sqrt2\,x)$`, R`$x-[x]$`, R`$\cos|x|$`], [2, 3],
    R`<p>$x-[x]$ repeats every 1: periodic. $\cos|x|=\cos x$ (cos is even): periodic with $2\pi$.</p><p>$\sin(x^2)$: zeros are at $\sqrt{n\pi}$, spacing shrinks, so no period. $\sin x+\cos\sqrt2x$: periods $2\pi$ and $\sqrt2\pi$ have an irrational ratio, so no common period.</p>`,
    'Incommensurable periods give a function that is almost periodic but not periodic.'),
  MT('srf-083', 3, 'periodic', 'm4', 'Match List I with List II.', 'A-p, B-q, C-r, D-s', ['A-q, B-p, C-r, D-s', 'A-p, B-q, C-s, D-r', 'A-p, B-r, C-q, D-s'],
    R`<p>A: $\pi/2$ (see the shift argument). B: $\sin2x$: $2\pi/2=\pi$. C: $\sin x+\cos x=\sqrt2\sin(x+\pi/4)$: $2\pi$. D: $\cos(x/2)$: $2\pi/(1/2)=4\pi$.</p>`,
    'Period of cos(kx) is 2 pi / |k|.'),

  // ---------- greatest integer, fractional part ----------
  M('srf-084', 1, 'greatest integer', R`The value of $[3.7]+[-3.7]$ is`, '-1', ['0', '-8', '7'],
    R`<p>$[3.7]=3$. $[-3.7]=-4$ (the greatest integer not above $-3.7$).</p><p>Sum $=-1$.</p>`,
    '[-3.7] is -4, not -3.'),
  M('srf-085', 2, 'greatest integer', R`The solution set of $[x]^2-5[x]+6=0$ is`, R`$[2,4)$`, [R`$\{2,3\}$`, R`$[2,3]$`, R`$(2,4)$`],
    R`<p>Treat $[x]$ as $t$: $t^2-5t+6=0\Rightarrow t=2$ or $3$.</p><p>$[x]=2\Rightarrow2\le x<3$; $[x]=3\Rightarrow3\le x<4$. Together $x\in[2,4)$.</p>`,
    'The solutions are intervals, not just the integers 2 and 3.'),
  I('srf-086', 5, 'fractional part', R`How many real solutions does $\{x\}=\dfrac x5$ have, where $\{x\}$ is the fractional part?`, 4,
    R`<p>Write $x=n+\{x\}$ with $n=[x]$. Then $\{x\}=x/5\Rightarrow x-n=x/5\Rightarrow x=\dfrac{5n}4$.</p><p>Need $0\le\{x\}<1$, i.e. $0\le\dfrac{x}5<1$, so $0\le x<5$ and $0\le n<4$: $n=0,1,2,3$, giving $x=0,\tfrac54,\tfrac52,\tfrac{15}4$.</p><p>Check $x=\frac54$: $\{x\}=0.25=\frac{1.25}5$. Yes. 4 solutions.</p>`,
    'The condition 0 ≤ {x} < 1 limits n; n = 4 would give {x} = 1.'),
  I('srf-087', 3, 'greatest integer', R`Evaluate $[x]+\left[x+\tfrac13\right]+\left[x+\tfrac23\right]$ at $x=7.5$.`, 22,
    R`<p>$[7.5]=7$; $[7.5+0.333\ldots]=[7.833\ldots]=7$; $[7.5+0.666\ldots]=[8.1666\ldots]=8$.</p><p>Sum $=22$, which equals $[3x]=[22.5]=22$ (Hermite's identity).</p>`,
    'Hermite: the sum of [x + k/n] for k = 0..n-1 equals [nx].'),
  I('srf-088', 4, 'greatest integer', R`Find $\displaystyle\sum_{n=1}^{50}\big[\sqrt n\big]$.`, 217,
    R`<p>$[\sqrt n]=k$ for $k^2\le n\le(k+1)^2-1$, which is $2k+1$ values.</p><p>$k=1$: 3 values; $k=2$: 5; $k=3$: 7; $k=4$: 9; $k=5$: 11; $k=6$: 13 (up to $n=48$); $k=7$: $n=49,50$ gives 2 values.</p><p>$1\cdot3+2\cdot5+3\cdot7+4\cdot9+5\cdot11+6\cdot13+7\cdot2=3+10+21+36+55+78+14=217$.</p>`,
    'The last block is incomplete: only 2 values of n have square root floor 7.'),
  S('srf-089', 3, 'greatest integer', R`$[x]+[-x]=-1$ for every real $x$.`, R`$[x]+[-x]=0$ when $x$ is an integer.`, 2,
    R`<p>If $x$ is an integer, $[x]+[-x]=x-x=0$, so I is false and II is true. For non-integers the sum is $-1$.</p>`,
    'The result is -1 only for non-integers.'),
  A('srf-090', 3, 'greatest integer', R`$f(x)=[x]$ is periodic with period 1.`, R`$[x+1]=[x]+1$ for all real $x$.`, 3,
    R`<p>R is true. But it says $f(x+1)=f(x)+1\neq f(x)$, so $[x]$ is not periodic. A is false. It is $\{x\}=x-[x]$ that has period 1.</p>`,
    'The periodic one is the fractional part.'),
  A('srf-091', 2, 'greatest integer', R`$\{x\}=x-[x]$ has period 1.`, R`$[x+1]=[x]+1$.`, 0,
    R`<p>$\{x+1\}=x+1-[x+1]=x+1-[x]-1=\{x\}$, using R. So R is exactly the reason.</p>`,
    'Fractional part always lies in [0, 1).'),
  PI('srf-092', 2, 'greatest integer', 'p1', R`Find $f(3.6)+f(-1.7)+f(0.5)$.`, 2,
    R`<p>Use $f(x)=1$ if $\{x\}\ge\tfrac12$, else $0$.</p><p>$\{3.6\}=0.6$: $f=1$. $\{-1.7\}=-1.7-(-2)=0.3$: $f=0$. $\{0.5\}=0.5$: $f=1$.</p><p>Sum $=2$.</p>`,
    '{-1.7} is 0.3, not 0.7.'),
  P('srf-093', 3, 'greatest integer', 'p1', R`The fundamental period of $f$ is`, '1', ['1/2', '2', '0.25'],
    R`<p>$f(x)$ depends only on $\{x\}$, which has period 1. Within one period $f$ is 0 on $[0,\tfrac12)$ and 1 on $[\tfrac12,1)$, so no shorter period works.</p>`,
    'Period 1/2 would need f(0) = f(1/2); but f(0) = 0 and f(0.5) = 1.'),
  PI('srf-094', 4, 'greatest integer', 'p1', R`For how many integers $n$ with $1\le n\le20$ is $f(n/3)=1$?`, 7,
    R`<p>$\{n/3\}=\tfrac13$ if $n\equiv1\pmod3$, $\tfrac23$ if $n\equiv2$, $0$ if $n\equiv0$. Only $\tfrac23\ge\tfrac12$.</p><p>$n=2,5,8,11,14,17,20$: 7 values.</p>`,
    'Residue 1 gives 1/3 which is below one half.'),

  // ---------- modulus, signum ----------
  I('srf-095', 1, 'modulus', R`How many real solutions does $\big||x|-2\big|=1$ have?`, 4,
    R`<p>$|x|-2=\pm1\Rightarrow|x|=3$ or $|x|=1$.</p><p>$x=\pm3,\pm1$: 4 solutions.</p>`,
    'Peel the outer modulus first, then the inner one.'),
  I('srf-096', 3, 'modulus', R`Find the minimum value of $|x-1|+|x-4|+|x-6|$.`, 5,
    R`<p>The sum of distances to points is least at the median of the points, here $x=4$.</p><p>$|3|+|0|+|-2|=3+0+2=5$.</p>`,
    'For three points the minimum is at the middle point, not at the mean.'),
  I('srf-097', 5, 'modulus', R`How many real solutions does $|x-1|+|x-2|+|x-3|=3$ have?`, 2,
    R`<p>Split at 1, 2, 3.</p><p>$x<1$: $6-3x=3\Rightarrow x=1$ (not $<1$). $1\le x<2$: $4-x=3\Rightarrow x=1$ valid. $2\le x<3$: $x=3$, not $<3$. $x\ge3$: $3x-6=3\Rightarrow x=3$ valid.</p><p>Solutions $x=1$ and $x=3$: 2.</p>`,
    'The solutions sit on the break points; check each piece includes its end.'),
  M('srf-098', 1, 'signum', R`The value of $\operatorname{sgn}(x^2-5x+6)$ at $x=2$, plus its value at $x=0$, plus its value at $x=2.5$, is`, '0', ['1', '-1', '2'],
    R`<p>At $x=2$: $4-10+6=0$, so sgn $=0$. At $x=0$: $6>0$, sgn $=1$. At $x=2.5$: $6.25-12.5+6=-0.25<0$, sgn $=-1$.</p><p>Sum $=0+1-1=0$.</p>`,
    'sgn(0) is 0, not 1.'),

  // ---------- graphs and transformations ----------
  M('srf-099', 2, 'transformations', R`The point $(3,4)$ lies on the graph of $y=f(x)$. A point on the graph of $y=2f(x-1)+3$ is`, '$(4,11)$', ['$(2,11)$', '$(4,7)$', '$(2,5)$'],
    R`<p>$x-1=3\Rightarrow x=4$. Then $y=2\cdot f(3)+3=2\cdot4+3=11$.</p>`,
    'x - 1 shifts the graph RIGHT by 1.'),
  M('srf-100', 3, 'transformations', R`The graph of $y=-f(x+2)+1$ is obtained from that of $y=f(x)$ by`, 'shifting left by 2, reflecting in the x-axis, and then moving up 1', ['shifting right by 2, reflecting in the y-axis, and moving up 1', 'shifting left by 2, moving up 1 and then reflecting in the x-axis', 'shifting right by 2, reflecting in the x-axis, and moving down 1'],
    R`<p>Inside the bracket $x\to x+2$: left 2. The minus sign flips $f$ about the x-axis. Then the $+1$ outside lifts the flipped graph up 1.</p><p>The order matters: if the reflection came after the lift, the shift would be a drop of 1.</p>`,
    'Inside changes act on x (opposite to the sign), outside changes act on y.'),
  I('srf-101', 5, 'graphs', R`How many real solutions does $\sin x=\dfrac{x}{10}$ have?`, 7,
    R`<p>Both sides are odd, so solutions come in pairs plus $x=0$. For $x>0$ the line $y=x/10$ meets the sine curve only while $x/10\le1$, i.e. $x\le10$.</p><p>The first hump of $\sin x$ (from 0 to $\pi$) crosses the line once (beyond 0). The second hump is negative: no crossing. The third hump (from $2\pi$ to $3\pi$) crosses twice, near 7.07 and 8.42. Humps after that are beyond $x=10$ or below the line.</p><p>So 3 positive roots, 3 negative, and $x=0$: 7.</p>`,
    'Sketch both graphs; the line leaves the band [-1, 1] at x = 10.'),

  // ---------- functional equations ----------
  I('srf-102', 3, 'functional equations', R`A function satisfies $f(x+y)=f(x)+f(y)$ for all rational $x,y$ and $f(1)=3$. Find $f(5)$.`, 15,
    R`<p>$f(2)=f(1)+f(1)=6$, and by repeating, $f(n)=3n$.</p><p>$f(5)=15$.</p>`,
    'For all real x and no other condition the solution may be strange; on the rationals it is linear.'),
  I('srf-103', 4, 'functional equations', R`If $f(x)+2f\!\left(\dfrac1x\right)=3x$ for all $x\ne0$, find $f(2)$.`, -1,
    R`<p>Put $x=2$: $f(2)+2f(\tfrac12)=6$. Put $x=\tfrac12$: $f(\tfrac12)+2f(2)=\tfrac32$.</p><p>Let $a=f(2)$, $b=f(\tfrac12)$. From the second, $b=1.5-2a$. In the first: $a+3-4a=6\Rightarrow a=-1$.</p><p>$f(2)=-1$. Check: $b=3.5$, first equation: $-1+7=6$ ✓.</p>`,
    'Substitute x and 1/x to get two equations in two unknowns.'),
  I('srf-104', 5, 'functional equations', R`A polynomial $f$ satisfies $f(x)f(y)=f(x)+f(y)+f(xy)-2$ for all real $x,y$, and $f(2)=5$. Find $f(3)$.`, 10,
    R`<p>Put $g=f-1$, so $f=g+1$. Left side: $(g(x)+1)(g(y)+1)=g(x)g(y)+g(x)+g(y)+1$. Right side: $g(x)+1+g(y)+1+g(xy)+1-2=g(x)+g(y)+g(xy)+1$. Cancelling gives $g(x)g(y)=g(xy)$.</p><p>Polynomial solutions of $g(xy)=g(x)g(y)$ are $g(x)=x^n$ (or $0$). $f(2)=5\Rightarrow g(2)=4=2^n\Rightarrow n=2$.</p><p>$f(x)=1+x^2$, $f(3)=10$. Check: $(1+x^2)(1+y^2)=1+x^2+y^2+x^2y^2=f(x)+f(y)+f(xy)-2$ ✓.</p>`,
    'The shift f - 1 turns an ugly equation into a multiplicative one.'),
  N('srf-105', 4, 'functional equations', R`If $f(x)+f(1-x)=1$ for all real $x$, find $\displaystyle\sum_{k=1}^{99}f\!\left(\frac k{100}\right)$.`, 49.5, 0.01,
    R`<p>Pair $k$ with $100-k$: $f(\tfrac k{100})+f(\tfrac{100-k}{100})=1$. The 99 terms make 49 pairs and a middle term $k=50$ with $2f(\tfrac12)=1$, so $f(\tfrac12)=\tfrac12$.</p><p>Sum $=49\cdot1+\tfrac12=49.5$.</p>`,
    'The middle term pairs with itself.'),
  X('srf-106', 5, 'graphs and types', R`Let $f:\mathbb{R}\to\mathbb{R}$, $f(x)=\dfrac{x}{1+|x|}$. Which of the following are true?`,
    ['$f$ is one-one', '$f$ is onto $\\mathbb{R}$', 'the range of $f$ is $(-1,1)$', '$f(f(x))=\\dfrac{x}{1+2|x|}$'], [0, 2, 3],
    R`<p>For $x\ge0$, $f=\frac{x}{1+x}$ increases from 0 towards 1. For $x<0$, it decreases from 0 towards $-1$. So $f$ is strictly increasing (one-one) with range $(-1,1)$, hence not onto $\mathbb{R}$.</p><p>$f(f(x))$: for $x\ge0$, $\dfrac{x/(1+x)}{1+x/(1+x)}=\dfrac{x}{1+2x}$; same form for negative $x$ with $|x|$.</p>`,
    'Range is an open interval, so f is not onto R.'),
  X('srf-107', 4, 'graphs and types', R`For $f(x)=x^3-3x$ on $\mathbb{R}$ which statements are true?`,
    ['$f$ is an odd function', '$f$ is onto $\\mathbb{R}$', '$f$ is one-one', '$f(x)=0$ has three distinct real roots'], [0, 1, 3],
    R`<p>$f(-x)=-f(x)$: odd. It is a cubic, so it takes all real values: onto. $f(x)=x(x^2-3)=0$ at $x=0,\pm\sqrt3$: three roots, so $f(0)=f(\sqrt3)$ and $f$ is not one-one.</p>`,
    'Three roots mean one-one fails.'),
  X('srf-108', 3, 'counting', R`Let $A$ have 4 elements. Which of the following counts are correct?`,
    ['functions $A\\to A$: 256', 'bijections $A\\to A$: 24', 'reflexive relations on $A$: 4096', 'symmetric relations on $A$: 256'], [0, 1, 2],
    R`<p>$4^4=256$; $4!=24$; reflexive: $2^{16-4}=4096$. Symmetric: $2^{4\cdot5/2}=2^{10}=1024$, not 256.</p>`,
    '256 = 2^8 would be right only if the diagonal pairs were not free.'),

  // ---------- passage: counting functions ----------
  PI('srf-109', 2, 'counting functions', 'p2', R`The total number of functions from $A$ to $B$ is`, 243,
    R`<p>Each of the 5 elements has 3 choices: $3^5=243$.</p>`, 'Count choices for each domain element.'),
  PI('srf-110', 3, 'counting functions', 'p2', R`The number of onto functions from $A$ to $B$ is`, 150,
    R`<p>$3^5-3\cdot2^5+3\cdot1^5=243-96+3=150$.</p>`, 'Inclusion-exclusion: signs alternate.'),
  PI('srf-111', 4, 'counting functions', 'p2', R`The number of functions from $A$ to $B$ whose range has <b>exactly 2</b> elements is`, 90,
    R`<p>Choose the 2 target values that appear: $\binom32=3$. The functions from $A$ onto a 2-set: $2^5-2=30$.</p><p>$3\times30=90$. Check: $3+90+150=243$ (range of size 1, 2, 3).</p>`,
    'A check against the total (3 + 90 + 150) catches slips.'),

  // ---------- mixed ----------
  M('srf-112', 3, 'mixed', R`The number of integers in the domain of $f(x)=\sqrt{\dfrac{x-2}{6-x}}$ is`, '4', ['3', '5', '2'],
    R`<p>Need $\dfrac{x-2}{6-x}\ge0$ with $x\ne6$. Sign scheme: zero at 2, not allowed at 6. The expression is non-negative for $2\le x<6$.</p><p>Integers: $2,3,4,5$: 4.</p>`,
    'x = 2 is included (the root is 0), x = 6 is excluded.', { sub: 'mixed' }),
];

const CACHE = {};
const gens = [
  {
    id: 'srf-g01', type: 'nat', format: 'integer', level: 3, exams: EXS[3], sub: 'counting',
    make(rng) {
      const t = int(rng, 1, 5), x = int(rng, 1, 6), y = int(rng, 1, 6), z = int(rng, 1, 6);
      const oa = int(rng, 3, 12), ob = int(rng, 3, 12), oc = int(rng, 3, 12);
      const a = oa + x + z + t, b = ob + x + y + t, c = oc + y + z + t;
      const ab = x + t, bc = y + t, ca = z + t;
      const answer = a + b + c - ab - bc - ca + t;
      return { a, b, c, ab, bc, ca, t, oa, ob, oc, x, y, z, answer, tol: 0,
        q: R`For three sets, $n(A)=${a}$, $n(B)=${b}$, $n(C)=${c}$, $n(A\cap B)=${ab}$, $n(B\cap C)=${bc}$, $n(C\cap A)=${ca}$ and $n(A\cap B\cap C)=${t}$. Find $n(A\cup B\cup C)$.`,
        sol: R`<p>Use $n(A\cup B\cup C)=n(A)+n(B)+n(C)-n(A\cap B)-n(B\cap C)-n(C\cap A)+n(A\cap B\cap C)$.</p><p>$=${a}+${b}+${c}-${ab}-${bc}-${ca}+${t}=${answer}$.</p>` };
    },
    verify: (p) => p.oa + p.ob + p.oc + p.x + p.y + p.z + p.t,
  },
  {
    id: 'srf-g02', type: 'mcq', format: 'single', level: 1, exams: EXS[1], sub: 'counting functions',
    make(rng) {
      const m = int(rng, 3, 5), n = int(rng, 2, 6);
      const c = n ** m;
      const { options, answer } = numOpts(rng, c, [m ** n, m * n, n ** (m - 1)], '', 6);
      return { m, n, c, options, answer,
        q: R`The number of functions from a set with ${m} elements to a set with ${n} elements is`,
        sol: R`<p>Each of the ${m} domain elements has ${n} choices of image: $${n}^{${m}}=${c}$.</p><p>The reversed power $${m}^{${n}}=${m ** n}$ is the common mistake.</p>` };
    },
    verify(p) { let c = 1; for (let i = 0; i < p.m; i++) c *= p.n; return p.options.indexOf(String(c)); },
  },
  {
    id: 'srf-g03', type: 'nat', format: 'integer', level: 2, exams: EXS[2], sub: 'counting functions',
    make(rng) {
      const m = int(rng, 2, 5), n = int(rng, m + 1, 8);
      let ans = 1; for (let i = 0; i < m; i++) ans *= n - i;
      return { m, n, answer: ans, tol: 0,
        q: R`How many one-one functions are there from a set of ${m} elements to a set of ${n} elements?`,
        sol: R`<p>Choose images in turn: ${Array.from({ length: m }, (_, i) => n - i).join(' $\\times$ ')}.</p><p>$={}^{${n}}P_{${m}}=${ans}$.</p>` };
    },
    verify(p) { let f = (k) => (k <= 1 ? 1 : k * f(k - 1)); return f(p.n) / f(p.n - p.m); },
  },
  {
    id: 'srf-g04', type: 'nat', format: 'integer', level: 4, exams: EXS[4], sub: 'counting functions',
    make(rng) {
      const n = int(rng, 2, 4), m = int(rng, n + 1, 6);
      const C = (a, b) => { let r = 1; for (let i = 1; i <= b; i++) r = r * (a - b + i) / i; return Math.round(r); };
      let ans = 0, terms = [];
      for (let k = 0; k <= n; k++) { const t = (k % 2 ? -1 : 1) * C(n, k) * (n - k) ** m; ans += t; terms.push(t); }
      return { m, n, answer: ans, tol: 0,
        q: R`Find the number of onto functions from a set of ${m} elements to a set of ${n} elements.`,
        sol: R`<p>$\sum_{k=0}^{${n}}(-1)^k\binom{${n}}{k}(${n}-k)^{${m}}$ gives the terms ${terms.join(', ')}.</p><p>Their sum is $${ans}$.</p>` };
    },
    verify(p) { // Stirling recursion S(m,n)*n!
      const S = Array.from({ length: p.m + 1 }, () => Array(p.n + 1).fill(0)); S[0][0] = 1;
      for (let i = 1; i <= p.m; i++) for (let j = 1; j <= p.n; j++) S[i][j] = j * S[i - 1][j] + S[i - 1][j - 1];
      let f = 1; for (let i = 2; i <= p.n; i++) f *= i; return S[p.m][p.n] * f;
    },
  },
  {
    id: 'srf-g05', type: 'nat', format: 'integer', level: 3, exams: EXS[3], sub: 'counting relations',
    make(rng) {
      const n = int(rng, 3, 5), kind = choose(rng, ['reflexive', 'symmetric', 'reflexive and symmetric']);
      const e = kind === 'reflexive' ? n * n - n : kind === 'symmetric' ? n * (n + 1) / 2 : n * (n - 1) / 2;
      return { n, kind, e, answer: 2 ** e, tol: 0,
        q: R`How many ${kind} relations are there on a set of ${n} elements?`,
        sol: kind === 'reflexive'
          ? R`<p>The ${n} diagonal pairs are forced. The other $${n}^2-${n}=${e}$ pairs are free: $2^{${e}}=${2 ** e}$.</p>`
          : kind === 'symmetric'
            ? R`<p>Independent choices: ${n} diagonal pairs and $\binom{${n}}2=${n * (n - 1) / 2}$ mirror pairs, total ${e}. Count $=2^{${e}}=${2 ** e}$.</p>`
            : R`<p>Diagonal forced. The $\binom{${n}}2=${e}$ mirror pairs are free: $2^{${e}}=${2 ** e}$.</p>` };
    },
    verify(p) { // brute force on pairs, small n only (n<=4), formula check otherwise
      if (p.n > 4) return 2 ** p.e;
      const pairs = []; for (let i = 0; i < p.n; i++) for (let j = 0; j < p.n; j++) pairs.push([i, j]);
      const N = pairs.length; let cnt = 0;
      const key = p.n + p.kind;
      if (CACHE[key] !== undefined) return CACHE[key];
      for (let mask = 0; mask < 1 << N; mask++) {
        const has = (i, j) => (mask >> (i * p.n + j)) & 1;
        let ok = true;
        for (let i = 0; i < p.n && ok; i++) for (let j = 0; j < p.n && ok; j++) {
          if (p.kind !== 'symmetric' && i === j && !has(i, i)) ok = false;
          if (p.kind !== 'reflexive' && has(i, j) !== has(j, i)) ok = false;
        }
        if (ok) cnt++;
      }
      return (CACHE[key] = cnt);
    },
  },
  {
    id: 'srf-g06', type: 'nat', format: 'integer', level: 4, exams: EXS[4], sub: 'equivalence relations',
    make(rng) {
      const n = int(rng, 3, 6);
      const bell = [1, 1, 2, 5, 15, 52, 203];
      return { n, answer: bell[n], tol: 0,
        q: R`How many equivalence relations exist on a set of ${n} elements?`,
        sol: R`<p>An equivalence relation is a partition into classes. The number of partitions is the Bell number $B_{${n}}$.</p><p>Using $B_{k+1}=\sum_{j}\binom kj B_j$ from $B_0=1$: the values go 1, 1, 2, 5, 15, 52, 203. So $B_{${n}}=${bell[n]}$.</p>` };
    },
    verify(p) { const S = (n, k) => (n === k ? 1 : k === 0 || k > n ? 0 : k * S(n - 1, k) + S(n - 1, k - 1)); let t = 0; for (let k = 1; k <= p.n; k++) t += S(p.n, k); return t; },
  },
  {
    id: 'srf-g07', type: 'nat', format: 'integer', level: 3, exams: EXS[3], sub: 'greatest integer',
    make(rng) {
      const m = int(rng, 2, 5), N = int(rng, 150, 999);
      const x = N / 100; const answer = Math.floor(N * m / 100);
      const terms = Array.from({ length: m }, (_, j) => Math.floor((N * m + 100 * j) / (100 * m)));
      return { m, N, answer, tol: 0,
        q: R`Evaluate $\displaystyle\sum_{j=0}^{${m - 1}}\left[${x}+\frac{j}{${m}}\right]$, where $[t]$ is the greatest integer not above $t$.`,
        sol: R`<p>Compute each term: ${terms.join(', ')}. Their sum is $${terms.reduce((s, v) => s + v, 0)}$.</p><p>Shortcut (Hermite): the sum equals $[${m}x]=[${fmt(m * x, 6)}]=${answer}$.</p>` };
    },
    verify(p) { let s = 0; for (let j = 0; j < p.m; j++) s += Math.floor((p.N * p.m + 100 * j) / (100 * p.m)); return s; },
  },
  {
    id: 'srf-g08', type: 'mcq', format: 'single', level: 2, exams: EXS[2], sub: 'domain',
    make(rng) {
      const a = int(rng, -4, 1), b = a + int(rng, 2, 6), L = 10;
      const fac = (v) => (v < 0 ? `(x+${-v})` : v === 0 ? 'x' : `(x-${v})`);
      const c = (2 * L + 1) - (b - a + 1);
      const { options, answer } = numOpts(rng, c, [2 * L + 1 - (b - a - 1), 2 * L + 1 - (b - a), b - a + 1], '', 3);
      return { a, b, c, L, options, answer,
        q: R`How many integers in $[-${L},${L}]$ lie in the domain of $f(x)=\ln\big(${fac(a)}${fac(b)}\big)$?`,
        sol: R`<p>Need $${fac(a)}${fac(b)}>0$, so $x<${a}$ or $x>${b}$. The integers NOT allowed are $${a},\dots,${b}$: ${b - a + 1} of them.</p><p>Allowed $=${2 * L + 1}-${b - a + 1}=${c}$.</p>` };
    },
    verify(p) { let c = 0; for (let x = -p.L; x <= p.L; x++) if ((x - p.a) * (x - p.b) > 0) c++; return p.options.indexOf(String(c)); },
  },
  {
    id: 'srf-g09', type: 'nat', format: 'integer', level: 3, exams: EXS[3], sub: 'modulus',
    make(rng) {
      const k = choose(rng, [3, 5]);
      const pts = []; while (pts.length < k) { const v = int(rng, -8, 12); if (!pts.includes(v)) pts.push(v); }
      pts.sort((u, v) => u - v);
      const med = pts[(k - 1) / 2];
      const answer = pts.reduce((s, v) => s + Math.abs(v - med), 0);
      const expr = pts.map((v) => (v < 0 ? `|x+${-v}|` : v === 0 ? '|x|' : `|x-${v}|`)).join('+');
      return { pts, answer, tol: 0,
        q: R`Find the minimum value of $${expr}$ over real $x$.`,
        sol: R`<p>A sum of distances to fixed points is least at the median point, here $x=${med}$.</p><p>Value $=${pts.map((v) => Math.abs(v - med)).join('+')}=${answer}$.</p>` };
    },
    verify(p) { let m = 1e9; for (let x = -10; x <= 14; x += 0.5) m = Math.min(m, p.pts.reduce((s, v) => s + Math.abs(x - v), 0)); return m; },
  },
  {
    id: 'srf-g10', type: 'nat', format: 'integer', level: 3, exams: EXS[3], sub: 'range',
    make(rng) {
      const [a, b, r] = choose(rng, [[3, 4, 5], [5, 12, 13], [6, 8, 10], [8, 15, 17]]);
      const c = int(rng, -4, 6), half = rng() < 0.5;
      const cc = half ? c + 0.5 : c;
      const lo = cc - r, hi = cc + r;
      const answer = Math.floor(hi) - Math.ceil(lo) + 1;
      return { a, b, r, cc, answer, tol: 0,
        q: R`How many integers lie in the range of $f(x)=${a}\sin x+${b}\cos x${cc < 0 ? '-' + (-cc) : '+' + cc}$?`,
        sol: R`<p>$${a}\sin x+${b}\cos x$ takes all values in $[-${r},${r}]$ because $\sqrt{${a}^2+${b}^2}=${r}$.</p><p>So the range of $f$ is $[${fmt(lo, 6)},${fmt(hi, 6)}]$ and it contains $${answer}$ integers.</p>` };
    },
    verify(p) { let mn = 1e9, mx = -1e9; for (let x = 0; x < 2 * Math.PI; x += 1e-4) { const v = p.a * Math.sin(x) + p.b * Math.cos(x) + p.cc; mn = Math.min(mn, v); mx = Math.max(mx, v); } return Math.floor(mx + 1e-6) - Math.ceil(mn - 1e-6) + 1; },
  },
  {
    id: 'srf-g11', type: 'nat', format: 'integer', level: 3, exams: EXS[3], sub: 'periodic',
    make(rng) {
      let a = int(rng, 2, 9), b = int(rng, 2, 9); while (a === b) b = int(rng, 2, 9);
      const gcd = (x, y) => (y ? gcd(y, x % y) : x);
      const answer = (2 * a * 2 * b) / gcd(2 * a, 2 * b);
      return { a, b, answer, tol: 0,
        q: R`Find the fundamental period of $f(x)=\cos\dfrac{\pi x}{${a}}+\sin\dfrac{\pi x}{${b}}$.`,
        sol: R`<p>The first term has period $\dfrac{2\pi}{\pi/${a}}=${2 * a}$. The second has period $${2 * b}$.</p><p>LCM$(${2 * a},${2 * b})=${answer}$.</p>` };
    },
    verify(p) {
      const f = (x) => Math.cos(Math.PI * x / p.a) + Math.sin(Math.PI * x / p.b);
      for (let T = 1; T <= 400; T++) if ([0.3, 1.7, 2.9, 5.1].every((x) => Math.abs(f(x + T) - f(x)) < 1e-9)) return T;
      return -1;
    },
  },
  {
    id: 'srf-g12', type: 'nat', format: 'integer', level: 2, exams: EXS[2], sub: 'composition',
    make(rng) {
      const a = int(rng, 2, 5), b = int(rng, -6, 6), c = int(rng, 2, 4), d = int(rng, -5, 5), k = int(rng, -3, 4);
      const answer = a * (c * k + d) + b;
      const lin = (p, q) => `${p}x${q < 0 ? '-' + (-q) : q > 0 ? '+' + q : ''}`;
      return { a, b, c, d, k, answer, tol: 0,
        q: R`If $f(x)=${lin(a, b)}$ and $g(x)=${lin(c, d)}$, find $(f\circ g)(${k})$.`,
        sol: R`<p>$(f\circ g)(${k})=f(g(${k}))$. First $g(${k})=${c * k + d}$. Then $f(${c * k + d})=${answer}$.</p>` };
    },
    verify: (p) => (p.a * (p.c * p.k + p.d) + p.b),
  },
  {
    id: 'srf-g13', type: 'nat', format: 'integer', level: 3, exams: EXS[3], sub: 'inverse',
    make(rng) {
      const p = int(rng, 2, 5), r = int(rng, -3, 3), s = choose(rng, [1, 2, 3, -1, -2]), t = int(rng, 1, 4);
      const x0 = r + s, q = s * t - p * r, k = p + t;
      const num = q < 0 ? `${p}x-${-q}` : q > 0 ? `${p}x+${q}` : `${p}x`;
      const den = r < 0 ? `x+${-r}` : r > 0 ? `x-${r}` : 'x';
      return { p, qq: q, r, k, x0, answer: x0, tol: 0,
        q: R`Let $f(x)=\dfrac{${num}}{${den}}$. Find $f^{-1}(${k})$.`,
        sol: R`<p>Solve $f(x)=${k}$: $${num}=${k}(${den})$. Collect x terms: $x(${k}-${p})=${k * r}${q < 0 ? '-' : '+'}${Math.abs(q)}$, that is $x=${x0}$.</p><p>Check: $f(${x0})=${k}$.</p>` };
    },
    verify: (p) => (p.r * p.k + p.qq) / (p.k - p.p),
  },
  {
    id: 'srf-g14', type: 'nat', format: 'integer', level: 4, exams: EXS[4], sub: 'greatest integer',
    make(rng) {
      const N = int(rng, 20, 70);
      let s = 0; for (let k = 1; k * k <= N; k++) { const hi = Math.min((k + 1) ** 2 - 1, N); s += k * (hi - k * k + 1); }
      return { N, answer: s, tol: 0,
        q: R`Find $\displaystyle\sum_{n=1}^{${N}}\big[\sqrt n\big]$.`,
        sol: R`<p>$[\sqrt n]=k$ for $k^2\le n\le(k+1)^2-1$, a block of $2k+1$ values (the last block is cut at $n=${N}$).</p><p>Adding $k\times$(block size) over all blocks gives $${s}$.</p>` };
    },
    verify(p) { let t = 0; for (let n = 1; n <= p.N; n++) t += Math.floor(Math.sqrt(n)); return t; },
  },
  {
    id: 'srf-g15', type: 'nat', format: 'numeric', level: 4, exams: EXS[4], sub: 'functional equations',
    make(rng) {
      const a = choose(rng, [2, 3, 4]), m = choose(rng, [2, 3]), p = int(rng, 2, 9);
      const ans = +(p * (a - m / a) / (1 - m * m)).toFixed(4);
      return { a, m, p, answer: ans, tol: 0.01,
        q: R`A function satisfies $f(x)+${m}f\!\left(\dfrac1x\right)=${p}x$ for all $x\ne0$. Find $f(${a})$ correct to two decimals.`,
        sol: R`<p>Put $x=${a}$: $f(${a})+${m}f(\tfrac1{${a}})=${p * a}$. Put $x=\tfrac1{${a}}$: $f(\tfrac1{${a}})+${m}f(${a})=\tfrac{${p}}{${a}}$.</p><p>Eliminate $f(1/${a})$: $f(${a})(1-${m * m})=${p * a}-${m}\cdot\tfrac{${p}}{${a}}$, so $f(${a})=${fmt(ans, 5)}$.</p>` };
    },
    verify(p) { // solve 2x2 by Cramer
      const A = [[1, p.m], [p.m, 1]], B = [p.p * p.a, p.p / p.a];
      const det = A[0][0] * A[1][1] - A[0][1] * A[1][0];
      return (B[0] * A[1][1] - A[0][1] * B[1]) / det;
    },
  },
  {
    id: 'srf-g16', type: 'nat', format: 'numeric', level: 4, exams: EXS[4], sub: 'composition',
    make(rng) {
      const c = int(rng, 1, 3), n = int(rng, 3, 8), k = int(rng, 2, 6);
      const ans = 1 / (k + n * c);
      return { c, n, k, answer: +ans.toFixed(5), tol: 0.0005,
        q: R`Let $f(x)=\dfrac{x}{1+${c === 1 ? '' : c}x}$. If $f$ is applied ${n} times, find the value at $x=\dfrac1{${k}}$ correct to 4 decimals.`,
        sol: R`<p>$f^{(m)}(x)=\dfrac{x}{1+${c}mx}$ (check by composing twice). With $m=${n}$ and $x=1/${k}$: $\dfrac{1/${k}}{1+${c * n}/${k}}=\dfrac1{${k + c * n}}\approx${fmt(ans, 4)}$.</p>` };
    },
    verify(p) { let y = 1 / p.k; for (let i = 0; i < p.n; i++) y = y / (1 + p.c * y); return y; },
  },
];

export default { topic: 'sets-relations-functions', groups, items, gens };
