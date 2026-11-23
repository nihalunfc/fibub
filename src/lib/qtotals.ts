// Question counts for the home page, the Learn hubs, exam course homes and /stats/, worked out at build time
// from the question banks in public/qbank/ (nihal, 2026-11-22). Nothing is typed in by hand: a new bank or a
// new question shows up on the next build. Written questions and templates (which make new numbers every
// time but are counted once) are kept apart, as everywhere else on the site.
// To add an exam to the per-exam row, add one line to EXAMS: the banks it draws on (a name, or a prefix ending
// in *) and the exam tag its questions carry in that bank (left out = every question in the bank).
import { readdirSync, statSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { bankCounts } from './qbank/build';

type Src = [bank: string, tag?: string];
export type ExamCount = { id: string; name: string; href: string; items: number; gens: number };
const ENT = (tag: string, subjects = ['physics', 'chemistry', 'maths']): Src[] => subjects.map((s) => [`entrance-${s}`, tag]);
const C = (id: string) => `/learn/courses/${id}/`;
export const EXAMS: { id: string; name: string; href: string; from: Src[] }[] = [
  { id: 'jee-main', name: 'JEE Main', href: C('engineering-entrance'), from: ENT('jee-main') },
  { id: 'jee-adv', name: 'JEE Advanced', href: C('engineering-entrance'), from: ENT('jee-adv') },
  { id: 'neet', name: 'NEET', href: C('medical-entrance'), from: ENT('neet', ['physics', 'chemistry', 'biology']) },
  { id: 'keam', name: 'KEAM', href: C('engineering-entrance'), from: ENT('keam') },
  { id: 'comedk', name: 'COMEDK', href: C('engineering-entrance'), from: ENT('comedk') },
  { id: 'cusat', name: 'CUSAT CAT', href: C('engineering-entrance'), from: ENT('cusat') },
  { id: 'cuet', name: 'CUET (UG)', href: C('cuet'), from: [['cuet-*'], ...ENT('cuet', ['physics', 'chemistry', 'maths', 'biology'])] },
  { id: 'jam', name: 'JAM Physics', href: C('iit-jam-physics'), from: [['physics', 'jam']] },
  { id: 'gate', name: 'GATE Physics', href: C('gate-physics'), from: [['physics', 'gate']] },
  { id: 'net', name: 'NET Physics', href: C('csir-net-physics'), from: [['physics', 'net']] },
  { id: 'sat', name: 'SAT', href: C('sat'), from: [['sat']] },
  { id: 'lsat', name: 'LSAT', href: C('lsat'), from: [['lsat']] },
  { id: 'gmat', name: 'GMAT', href: C('gmat'), from: [['gmat-di'], ['grad-quant', 'gmat'], ['grad-verbal', 'gmat']] },
  { id: 'gre', name: 'GRE', href: C('gre'), from: [['gre-*'], ['grad-quant', 'gre'], ['grad-verbal', 'gre']] },
  { id: 'ielts', name: 'IELTS', href: C('ielts'), from: [['ielts'], ['english', 'ielts']] },
  { id: 'celpip', name: 'CELPIP', href: C('celpip'), from: [['celpip'], ['english', 'celpip']] },
  { id: 'toefl', name: 'TOEFL', href: C('toefl'), from: [['toefl'], ['english', 'toefl']] },
  { id: 'ncert', name: 'NCERT school', href: '/learn/school/', from: [['ncert-*']] },
];
// Which Learn hub a bank's questions belong to (for the hub pages); everything else is exam prep.
export const bankCat = (bank: string) => (bank.startsWith('ncert-') ? 'school' : 'exams');
// Which exam course a bank serves, for its course home (several banks can serve one course).
export const examsFor = (courseId: string) => EXAMS.filter((e) => e.href === C(courseId));

let memo: Promise<{ items: number; gens: number; banks: number; byBank: Record<string, { items: number; gens: number }>; exams: ExamCount[] }> | null = null;
export function questionTotals() {
  return (memo ??= (async () => {
    const root = resolve(process.cwd(), 'public/qbank');
    const banks = readdirSync(root).filter((d) => !d.startsWith('_') && statSync(resolve(root, d)).isDirectory() && existsSync(resolve(root, d, 'index.js')));
    const counts = Object.fromEntries(await Promise.all(banks.map(async (b) => [b, await bankCounts(b)] as const)));
    const byBank: Record<string, { items: number; gens: number }> = {};
    for (const b of banks) byBank[b] = counts[b].total;
    const match = (pat: string) => banks.filter((b) => (pat.endsWith('*') ? b.startsWith(pat.slice(0, -1)) : b === pat));
    const exams = EXAMS.map((e) => {
      let items = 0, gens = 0;
      for (const [pat, tag] of e.from) for (const b of match(pat)) {
        if (!tag) { items += byBank[b].items; gens += byBank[b].gens; continue; }
        for (const t of Object.values(counts[b].topics)) { const g = t.gensByExam[tag] ?? 0; items += (t.exams[tag] ?? 0) - g; gens += g; }
      }
      return { id: e.id, name: e.name, href: e.href, items, gens };
    }).filter((e) => e.items + e.gens > 0);
    const items = banks.reduce((s, b) => s + byBank[b].items, 0), gens = banks.reduce((s, b) => s + byBank[b].gens, 0);
    return { items, gens, banks: banks.length, byBank, exams };
  })());
}
