// #734 Syntax tree drawer: parsing, errors, layout and LaTeX output.
// The forest output and the counts were compared with an independent Python parser written for this tool
// (5 trees, including arrows, triangles, subscripts and LaTeX special characters): all identical.
import * as T from '../../src/lib/sci/syntree.ts';

export default async (check) => {
  const WH = "[CP [DP#1 what] [C' [C did] [TP [DP_i you] [VP [V see] [DP t->1]]]]]";
  const r = T.parseTree(WH), s = T.stats(r);
  check('syntree: wh-question has 9 phrases, 5 words, depth 5', s.phrases === 9 && s.leaves === 5 && s.depth === 5 && s.sentence === 'what did you see t');
  check('syntree: bracket notation round trip', T.toBrackets(r) === WH);
  check('syntree: forest output equals the Python parser', T.toForest(r) === "% \\usepackage[linguistics]{forest}\n\\begin{forest}\n[{CP}\n  [{DP}, name=t1\n    [{what}]\n  ]\n  [{C'}\n    [{C}\n      [{did}]\n    ]\n    [{TP}\n      [{DP$_{i}$}\n        [{you}]\n      ]\n      [{VP}\n        [{V}\n          [{see}]\n        ]\n        [{DP}\n          [{t}, name=s1x1]\n        ]\n      ]\n    ]\n  ]\n]\n\\draw[->] (s1x1) to[out=south, in=south] (t1);\n\\end{forest}");
  check('syntree: LaTeX special characters escaped (Python)', T.toForest(T.parseTree('[X 50% & $5 [Y a_b c{d}]]')) === "% \\usepackage[linguistics]{forest}\n\\begin{forest}\n[{X}\n  [{50\\% \\& \\$5}]\n  [{Y}\n    [{a$_{b}$}]\n    [{c\\{d\\}}]\n  ]\n]\n\\end{forest}");
  const tri = T.parseTree('[S [NP^ the old man] [VP [V saw] [NP_i her]]]');
  check('syntree: qtree with \\qroof', T.toQtree(tri) === '% \\usepackage{qtree}\n\\Tree [.{S} \\qroof{the old man}.{NP} [.{VP} [.{V} {saw} ] [.{NP$_{i}$} {her} ] ] ]');
  check('syntree: triangle words are one leaf, roof in forest', tri.kids[0].kids.length === 1 && tri.kids[0].kids[0].tri && /\[\{the old man\}, roof\]/.test(T.toForest(tri)));
  check('syntree: ^NP and NP^ both mean triangle', T.parseTree('[S [^NP a b]]').kids[0].tri && T.parseTree('[S [NP^ a b]]').kids[0].tri);
  check('syntree: quoted words keep brackets', T.parseTree('[S [N "[x]"]]').kids[0].kids[0].label === '[x]');

  check('syntree: ∅ becomes $\\emptyset$ in LaTeX', T.toQtree(T.parseTree('[T ∅]')).endsWith('[.{T} {$\\emptyset$} ]'));
  const err = (src) => { try { T.parseTree(src); return ''; } catch (e) { return e.message; } };
  check('syntree: missing ] names the bracket and counts', /Missing "\]": the \[S opened at character 1 is never closed \(3 "\[" but 2 "\]"\)/.test(err('[S [NP Kim] [VP sleeps]')));
  check('syntree: extra ] found', /extra "\]" at character 14/.test(err('[S [NP Kim]] ]')));
  check('syntree: must start with [', /must start with "\["/.test(err('S [NP Kim]')));
  check('syntree: [ without label', /needs a label/.test(err('[S [] ]')));
  check('syntree: arrow without target', /->2 has nowhere to go/.test(err('[S [NP t->2]]')));
  check('syntree: landing site used twice', /#1 is used twice/.test(err('[S [NP#1 a] [NP#1 b]]')));
  check('syntree: two trees', /more after the tree ends/.test(err('[S Kim] [S Lee]')));
  check('syntree: line numbers in messages', /line 2, character 4/.test(err('[S\n  ]]')));

  const L = T.layout(T.parseTree('[S [NP [D the] [N dog]] [VP [V chased] [NP [D a] [AdjP [Adj big]] [N cat]]] [PP [P in] [NP^ the garden]]]'));
  const rows = new Map(); for (const p of L.placed) { if (!rows.has(p.y)) rows.set(p.y, []); rows.get(p.y).push(p); }
  let overlap = false;
  for (const ps of rows.values()) { ps.sort((a, b) => a.x - b.x); for (let i = 1; i < ps.length; i++) if (ps[i].x - ps[i].w / 2 < ps[i - 1].x + ps[i - 1].w / 2) overlap = true; }
  check('syntree: no labels overlap on a level', !overlap);
  const pos = new Map(L.placed.map((p) => [p.n, p]));
  const centred = L.placed.filter((p) => p.n.kids.length).every((p) => { const xs = p.n.kids.map((k) => pos.get(k).x); return Math.abs(p.x - (xs[0] + xs[xs.length - 1]) / 2) < 1e-9; });
  check('syntree: parents centred over their children', centred);
  const v = L.placed.find((p) => p.n.label === 'V'), chased = pos.get(v.n.kids[0]);
  check('syntree: one child sits straight below', Math.abs(v.x - chased.x) < 1e-9 && chased.y > v.y);
  check('syntree: one triangle drawn', L.ops.filter((o) => o.k === 'poly').length === 1);
  const B = T.layout(T.parseTree('[S [NP Kim] [VP [V saw] [NP [D the] [N dog]]]]'), { bottomLeaves: true });
  check('syntree: leaves on one line', new Set(B.placed.filter((p) => p.n.leaf).map((p) => p.y)).size === 1);
  const A = T.layout(r), A0 = T.layout(r, { arrows: false });
  check('syntree: arrow drawn below the tree, and left out when off', A.ops.filter((o) => o.k === 'arrow').length === 1 && A0.ops.every((o) => o.k !== 'arrow') && A.h > A0.h);
  const svg = T.toSvg(A);
  check('syntree: SVG has 14 labels, 13 lines, arrow and escapes', (svg.match(/<text /g) || []).length === 14 && (svg.match(/<line /g) || []).length === 13 && svg.includes('<path') && T.toSvg(T.layout(T.parseTree('[A <b>&]'))).includes('&lt;b&gt;&amp;'));
};
