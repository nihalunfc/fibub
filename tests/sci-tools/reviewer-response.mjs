// #807 Response to reviewers. The splitter is checked on hand-made reports in the common shapes (numbered,
// bulleted, lettered, "Comment 1:", plain paragraphs, editor notes, major/minor groups). The LaTeX letter was read
// by pylatexenc (balanced, strict parse) and turned back into the same comments and responses; the Word file from
// the page was read with python-docx in the browser checks' cross-check.
import { splitComments, reviewerHeading, toLatex, toMarkdown, toSections, progress, EXAMPLE, OPENING, CLOSING } from '../../src/lib/sci/reviewers.ts';

export default async (check) => {
  const H = (s) => reviewerHeading(s, 1);
  check('heading: Reviewer #1 with text', H('Reviewer #1: The paper is good.')?.label === 'R1' && H('Reviewer #1: The paper is good.').rest === 'The paper is good.');
  check('heading: forms', H('REFEREE 2')?.label === 'R2' && H('Reviewer: 3')?.label === 'R3' && H('Comments from Reviewer 4 (Remarks to the Author):')?.label === 'R4' && H('**Reviewer 2**')?.label === 'R2' && H('Report of Referee B')?.label === 'RB');
  check('heading: editors', H('Editor comments:')?.name === 'Editor' && H("Editor's comments")?.label === 'E' && H('Associate Editor')?.name === 'Associate editor');
  check('heading: sentences are not headings', H('Reviewer 2 suggests that we add more') === null && H('Reviewers agree that') === null && H('The reviewer is right.') === null);

  const R = splitComments(EXAMPLE);
  check('example: two reviewers', R.length === 2 && R[0].name === 'Reviewer 1' && R[1].name === 'Reviewer 2');
  check('example: summary is point 0, own numbers kept, groups', R[0].points.map((p) => `${p.id}|${p.group}`).join(',') === 'R1.0|General,R1.1|Major comments,R1.2|Major comments,R1.3|Minor comments,R1.4|Minor comments');
  check('example: paragraphs become points when nothing is numbered', R[1].points.map((p) => p.id).join() === 'R2.1,R2.2,R2.3' && R[1].points[1].text.startsWith('Could the authors'));

  const b = splitComments('Reviewer 1\n- First bullet\n  goes on here.\n- Second bullet\n\nReviewer 2\n(a) Lettered one\n(b) Lettered two\nReviewer 3\nComment 1: alpha\nComment 2: beta\n1.5 mL is not a number marker');
  check('bullets with continuation lines', b[0].points.length === 2 && b[0].points[0].text === 'First bullet\n  goes on here.');
  check('lettered points numbered in order', b[1].points.map((p) => p.id).join() === 'R2.1,R2.2' && b[1].points[1].text === 'Lettered two');
  check('"Comment 1:" keeps numbers; decimals are not markers', b[2].points.map((p) => p.id).join() === 'R3.1,R3.2' && b[2].points[1].text === 'beta\n1.5 mL is not a number marker');
  const e = splitComments('Thank you for submitting.\n\nEditor:\nPlease shorten the abstract.\n\nReviewer 1:\n1. A\n1. B');
  check('text before any heading, editor block, repeated numbers renumbered', e.map((r) => r.label).join() === 'G,E,R1' && e[2].points.map((p) => p.id).join() === 'R1.1,R1.2');
  check('no headings: one block of paragraphs', splitComments('Point one.\n\nPoint two.')[0].points.length === 2 && splitComments('').length === 0);
  check('two Reviewer 1 headings get distinct labels', splitComments('Reviewer 1\nA\nReviewer 1\nB').map((r) => r.label).join() === 'R1,R1b');

  const A = { 'R1.1': { response: 'We added six plants per group (n = 12).', changes: 'Methods, lines 80-85.' }, 'R1.4': { response: 'Fixed & checked 100%.', changes: '' } };
  const L = { title: 'Plant growth under three light levels', msId: 'MS-2026-001', opening: OPENING, closing: CLOSING };
  const pr = progress(R, A);
  check('progress', pr.total === 8 && pr.done === 2 && pr.missing[0] === 'R1.0');
  const t = toLatex(R, A, L);
  check('latex letter', t.startsWith('\\documentclass[11pt]{article}') && t.includes('\\textbf{Manuscript:} Plant growth under three light levels (MS-2026-001)') && t.includes('\\section*{Reviewer 1}') && t.includes('\\subsection*{Major comments}') && t.includes('\\paragraph{Comment R1.1}\n\\begin{reviewercomment}\nThe number of plants per group (n = 6) seems small.') && t.includes('\\textbf{Response:} We added six plants per group (n = 12).') && t.includes('\\textbf{Changes in the manuscript:} Methods, lines 80-85.') && t.trim().endsWith('\\end{document}'));
  check('latex: escaping and missing answers marked', t.includes('Fixed \\& checked 100\\%.') && t.includes('\\textcolor{red}{[Response to be written.]}'));
  const md = toMarkdown(R, A, L);
  check('markdown', md.includes('## Reviewer 2') && md.includes('**Comment R1.1**\n\n> The number of plants') && md.includes('**Response:** *[Response to be written.]*'));
  const S = toSections(R, A, L);
  check('word sections', S.length === 4 && S[0].title === 'Letter' && S[1].title === 'Reviewer 1' && S[1].text.includes('MAJOR COMMENTS') && S[1].text.includes('Response: We added six plants per group (n = 12).') && S[3].title === 'Closing');
};
