// Study time from what a lesson actually holds (nihal, 2026-11-23): a page of history reads fast, a page of
// equations slowly and a proof slower still, and figures, live problems, practice questions and the quiz take
// time of their own. Worked out at build time from the Markdown, so it stays right as lessons change; the
// `minutes` in a lesson's front matter is no longer used for display.
//
// Rates (words per minute) are for studying, not skimming: about 230 for a story, 180 for ordinary teaching
// text, 110 for text full of maths, 70 for proofs and derivations. Everything else is seconds per item below.

export type StudyParts = { prose: number; maths: number; code: number; figures: number; problems: number; practice: number; quiz: number };

const S = {
  mathBlock: 25, mathLine: 15,          // a displayed equation: read it, see where each symbol comes from
  inlineMath: 3, inlineChar: 0.12,      // `$...$` in a sentence: longer formulas take longer
  codeBlock: 20, codeLine: 7,           // read, type and run a code example
  figure: 60, tool: 150, step: 4,       // an interactive figure, an embedded tool, one click of a step player
  problem: 120,                         // a live problem (data-problem)
  tryFirst: 60,                         // a hidden worked answer (<details>): try it before opening
  row: 3,                               // a table row
  quiz: 40,                             // one "Check yourself" question
};
const WPM = { story: 230, normal: 180, maths: 110, proof: 70 };

const words = (t: string) => (t.match(/[\p{L}\p{N}][\p{L}\p{N}'’.-]*/gu) ?? []).length;
const plain = (t: string) => t.replace(/<!--[\s\S]*?-->/g, ' ').replace(/<[^>]+>/g, ' ').replace(/\[([^\]]*)\]\([^)]*\)/g, '$1').replace(/\[\[[^\]|]*\|?([^\]]*)\]\]/g, '$1').replace(/[*_#>|`]/g, ' ');

/** Seconds a practice question bank takes: each question is tried, then the answer is read. */
function bankSeconds(tag: string) {
  const n = Number(tag.match(/data-n="(\d+)"/)?.[1] ?? 10);
  const bank = tag.match(/data-bank="([^"]+)"/)?.[1] ?? '';
  // Calculation-heavy banks take longer per question than vocabulary or reading ones.
  const per = /physics|chem|math|jee|neet|gate|jam|net|quant|entrance|stat/.test(bank) ? 100 : /celpip|toefl|ielts|english|verbal|lsat/.test(bank) ? 75 : 85;
  return n * per;
}

export function studyParts(body: string, quizCount = 0): StudyParts {
  const p: StudyParts = { prose: 0, maths: 0, code: 0, figures: 0, problems: 0, practice: 0, quiz: quizCount * S.quiz };
  let text = body.replace(/^---[\s\S]*?\n---\n/, '');

  // Fenced blocks: displayed maths, code, hints.
  text = text.replace(/^```([a-z-]*)[^\n]*\n([\s\S]*?)^```/gm, (_m, lang: string, inner: string) => {
    const lines = inner.split('\n').filter((l) => l.trim()).length;
    if (lang === 'math') p.maths += S.mathBlock + lines * S.mathLine;
    else if (lang === 'hint' || lang === 'text') p.prose += (words(inner) / WPM.normal) * 60;
    else p.code += S.codeBlock + lines * S.codeLine;
    return '\n';
  });

  // Interactive parts.
  text = text.replace(/<!--fig:\s*tool\b[^>]*-->/g, () => { p.figures += S.tool; return ' '; });
  text = text.replace(/<!--fig:[^>]*-->/g, () => { p.figures += S.figure; return ' '; });
  text = text.replace(/<div class="qbank"[^>]*>/g, (tag) => { p.practice += bankSeconds(tag); return ' '; });
  p.figures += (text.match(/data-fig=/g)?.length ?? 0) * S.figure;
  p.figures += (text.match(/<div class="step"/g)?.length ?? 0) * S.step;
  p.problems += (text.match(/data-problem=/g)?.length ?? 0) * S.problem;
  p.practice += (text.match(/<details/g)?.length ?? 0) * S.tryFirst;
  p.prose += (text.match(/^\|.*\|\s*$/gm)?.length ?? 0) * S.row;

  // Prose, paragraph by paragraph, at a speed that fits it.
  let mode: 'story' | 'normal' | 'proof' = 'normal';
  let depth = 0; // inside a <div class="history"> or "myth" box
  for (const para of text.split(/\n\s*\n/)) {
    const head = para.match(/^#{2,4}\s+(.*)/m)?.[1];
    if (head) mode = /\b(proof|prove|theorem|lemma|derivation|deriving|derive)\b/i.test(head) ? 'proof' : /\b(history|story|who found|timeline)\b/i.test(head) ? 'story' : 'normal';
    if (/<div class="(history|myth|cc)"/.test(para)) depth++;
    const maths = para.match(/`\$[^`]+`/g) ?? [];
    const mathChars = maths.reduce((s, m) => s + m.length, 0);
    p.maths += maths.length * S.inlineMath + mathChars * S.inlineChar;
    const w = words(plain(para.replace(/`\$[^`]+`/g, ' ')));
    const dense = maths.length >= 3 || (w > 0 && maths.length / w > 0.04);
    const rate = mode === 'proof' || (/\b(proof|we prove|hence proved|q\.e\.d)\b/i.test(para) && maths.length) ? WPM.proof
      : dense ? WPM.maths
      : (mode === 'story' || depth > 0) ? WPM.story : WPM.normal;
    p.prose += (w / rate) * 60;
    if (depth > 0 && /<\/div>/.test(para)) depth = Math.max(0, depth - 1);
  }
  return p;
}

/** Whole minutes of study for one lesson (at least 3). */
export function studyMinutes(body: string, quizCount = 0) {
  const p = studyParts(body, quizCount);
  const sec = p.prose + p.maths + p.code + p.figures + p.problems + p.practice + p.quiz;
  return Math.max(3, Math.round(sec / 60));
}

type LessonEntry = { id: string; body?: string; data: { quiz: unknown[] } };
const cache = new Map<string, number>();
/** Study minutes for a lesson entry of the `lessons` collection (cached per build). */
export function lessonMinutes(e: LessonEntry) {
  let m = cache.get(e.id);
  if (m === undefined) { m = studyMinutes(e.body ?? '', e.data.quiz.length); cache.set(e.id, m); }
  return m;
}

/** "45 min", "2 h 10 min", "38 h": a study time for people. */
export function fmtStudy(min: number) {
  if (min < 60) return `${min} min`;
  if (min < 600) { const h = Math.floor(min / 60), r = Math.round((min % 60) / 5) * 5; return r ? (r === 60 ? `${h + 1} h` : `${h} h ${r} min`) : `${h} h`; }
  return `${Math.round(min / 60)} h`;
}
