// Data management plan builder: the sections, guiding questions (written by fibub), word counts, and turning a
// plan into Markdown and back. No DOM.

export type DmpSection = { id: string; title: string; blurb: string; prompts: string[] };
export type DmpPlan = { title: string; author: string; funder: string; date: string; texts: Record<string, string>; limits: Record<string, number | null> };

/** Generic sections that most data management plans ask for, in fibub's own words. */
export const DMP_SECTIONS: DmpSection[] = [
  { id: 'data', title: 'Data description', blurb: 'What data the project will make or reuse.', prompts: [
    'What will you collect, measure, record or reuse (surveys, images, readings, code, samples, interviews)?',
    'Which file formats will you use, and are they open or widely readable?',
    'Roughly how much data do you expect (number of files, gigabytes)?',
    'How is each kind of data made: by which instrument, software or method?',
    'Is there existing data you could reuse instead of collecting new data?',
  ] },
  { id: 'docs', title: 'Documentation and metadata', blurb: 'How someone else (or you, later) will understand the files.', prompts: [
    'What goes in a README for the dataset (who, what, when, where, how)?',
    'Will you keep a data dictionary or codebook that explains every variable, unit and code?',
    'Is there a metadata standard used in your field that you will follow?',
    'How will you name files and folders, and keep track of versions?',
    'Where will methods, settings and processing steps be written down?',
  ] },
  { id: 'storage', title: 'Storage and backup', blurb: 'Keeping the data safe while the project runs.', prompts: [
    'Where will the working data live (institution storage, lab server, encrypted laptop)?',
    'How often is it backed up, how many copies are kept, and is one copy in a different place?',
    'Who can read or change the data, and how is access controlled?',
    'How will sensitive data be protected (encryption, locked rooms, separate keys)?',
    'Have you tried restoring a file from a backup?',
  ] },
  { id: 'ethics', title: 'Ethics and legal', blurb: 'Consent, personal data, ownership and permissions.', prompts: [
    'Does the data involve people, and what will participants be told and agree to?',
    'Which approvals do you need (ethics board, data protection, permits), and have you applied?',
    'How will you remove or hide details that could identify someone?',
    'Who owns the data, and are there contracts, licences or third-party rights to respect?',
    'Which laws or policies on personal or sensitive data apply where the data is collected and stored?',
  ] },
  { id: 'sharing', title: 'Sharing and access', blurb: 'Who can use the data, when and how.', prompts: [
    'Which data will you share, and which can you not share (and why)?',
    'When will it be shared: with a paper, at the end of the project, after an embargo?',
    'Where will it go (a subject repository, a general repository, your institution)?',
    'Under which licence or terms of use?',
    'Will the dataset get a persistent identifier (such as a DOI) so it can be cited?',
  ] },
  { id: 'preservation', title: 'Preservation', blurb: 'What is kept after the project ends, and for how long.', prompts: [
    'Which data has long-term value and which can be deleted?',
    'How long will it be kept, and who decided (policy, funder, your field)?',
    'Which formats will you convert to for the long term?',
    'Which repository or archive will look after it?',
    'How will data that must be destroyed be destroyed safely?',
  ] },
  { id: 'roles', title: 'Responsibilities', blurb: 'Who does what.', prompts: [
    'Who is responsible for each part of this plan (collection, documentation, backup, sharing)?',
    'Who looks after the data day to day, and who checks the plan is followed?',
    'What happens if someone leaves the project?',
    'Do partners or collaborators share the work, and is it written down?',
  ] },
  { id: 'costs', title: 'Costs and resources', blurb: 'Time and money that managing the data needs.', prompts: [
    'What storage, backup or software will you pay for?',
    'How much staff time goes to cleaning, documenting and preparing data for sharing?',
    'Are there repository fees or charges for long-term archiving?',
    'Is any training or specialist help needed?',
  ] },
];

/** Words: runs of non-space characters that hold at least one letter or digit ("long-term" is one word). */
export function countWords(s: string): number {
  let n = 0;
  for (const t of s.split(/\s+/)) if (/[\p{L}\p{N}]/u.test(t)) n++;
  return n;
}

export type SectionSummary = { id: string; title: string; words: number; limit: number | null; status: 'empty' | 'ok' | 'over' };
export function summarise(p: DmpPlan): { rows: SectionSummary[]; total: number; filled: number; over: number } {
  const rows = DMP_SECTIONS.map((s) => {
    const words = countWords(p.texts[s.id] ?? ''), limit = p.limits[s.id] ?? null;
    const status: SectionSummary['status'] = words === 0 ? 'empty' : limit != null && words > limit ? 'over' : 'ok';
    return { id: s.id, title: s.title, words, limit, status };
  });
  return { rows, total: rows.reduce((a, r) => a + r.words, 0), filled: rows.filter((r) => r.words > 0).length, over: rows.filter((r) => r.status === 'over').length };
}

export function emptyPlan(): DmpPlan {
  return { title: '', author: '', funder: '', date: '', texts: Object.fromEntries(DMP_SECTIONS.map((s) => [s.id, ''])), limits: Object.fromEntries(DMP_SECTIONS.map((s) => [s.id, null])) };
}

/** The plan as Markdown: a title, a details list, then one "## Section" per section (empty ones marked). */
export function toMarkdown(p: DmpPlan): string {
  const out = [`# ${p.title.trim() || 'Data management plan'}`, ''];
  const meta: [string, string][] = [['Prepared by', p.author], ['Funder or programme', p.funder], ['Date', p.date]];
  for (const [k, v] of meta) if (v.trim()) out.push(`- **${k}:** ${v.trim()}`);
  if (meta.some(([, v]) => v.trim())) out.push('');
  for (const s of DMP_SECTIONS) {
    out.push(`## ${s.title}`, '');
    const t = (p.texts[s.id] ?? '').trim();
    out.push(t ? t.replace(/\r\n?/g, '\n') : '_Not written yet._', '');
  }
  return out.join('\n').replace(/\n+$/, '\n');
}

/** Read a plan back from Markdown made by toMarkdown (or any file whose "## " headings match the section titles). */
export function fromMarkdown(md: string): { plan: DmpPlan; matched: number; unknown: string[] } {
  const p = emptyPlan(), unknown: string[] = [];
  const lines = md.replace(/^﻿/, '').replace(/\r\n?/g, '\n').split('\n');
  let cur: string | null = null, buf: string[] = [], matched = 0;
  const flush = () => { if (cur) { const t = buf.join('\n').trim(); p.texts[cur] = t === '_Not written yet._' ? '' : t; } buf = []; };
  const norm = (s: string) => s.toLowerCase().replace(/[^a-z]+/g, ' ').trim();
  for (const l of lines) {
    const h1 = /^#\s+(.+)$/.exec(l), h2 = /^##\s+(.+)$/.exec(l);
    if (h2) {
      flush();
      const s = DMP_SECTIONS.find((x) => norm(x.title) === norm(h2[1]));
      if (s) { cur = s.id; matched++; } else { cur = null; unknown.push(h2[1].trim()); }
      continue;
    }
    if (h1 && !cur) { p.title = h1[1].trim(); continue; }
    const m = /^-\s+\*\*(.+?):\*\*\s*(.*)$/.exec(l);
    if (m && !cur) {
      const k = m[1].toLowerCase(), v = m[2].trim();
      if (k.startsWith('prepared')) p.author = v; else if (k.startsWith('funder')) p.funder = v; else if (k === 'date') p.date = v;
      continue;
    }
    if (cur) buf.push(l);
  }
  flush();
  return { plan: p, matched, unknown };
}

/** A made-up example project, so the page can show what a filled plan looks like. */
export function examplePlan(): DmpPlan {
  const p = emptyPlan();
  p.title = 'Soil life in city allotment gardens (made-up example)';
  p.author = 'A. Researcher, Example University';
  p.funder = 'Any funder';
  p.date = '2026-11-09';
  p.texts.data = 'We will collect soil samples from 40 allotment plots twice a year for three years. For each sample we record pH, moisture, organic matter and earthworm counts in a spreadsheet, and take one photo of the soil profile. We also run a short survey of plot holders about how they garden.\n\nSpreadsheets are kept as CSV, photos as JPEG and survey answers as CSV exported from the survey tool. We expect about 30 GB in total, almost all of it photos.';
  p.texts.docs = 'Every dataset gets a README that says who collected it, where, when and how. A data dictionary lists each column with its unit and allowed values. Files are named site_plot_date_type, for example A07_2026-05-12_soil.csv, and changes are tracked in a change log kept with the data.';
  p.texts.storage = 'Working data lives on the university research drive, which is backed up every night. A second copy is synced weekly to an encrypted external drive kept in a different building. Only the project team can open the project folder.';
  p.texts.ethics = 'Plot holders sign a consent form before the survey. Names and plot numbers are replaced with codes, and the key linking codes to people is kept in a separate encrypted file that only the lead researcher can open. The project has applied for approval from the university ethics board.';
  p.texts.sharing = 'Soil measurements and photos will be shared in a general-purpose repository with a DOI when the first paper is published, under an open licence. Survey answers will be shared only as summary tables, because the full answers could identify people.';
  p.texts.preservation = 'Soil data, photos and summary tables are kept for at least ten years in the repository. The consent forms and the key file are destroyed five years after the project ends.';
  p.texts.roles = 'The lead researcher owns this plan and checks it every six months. The research assistant enters data, writes the README files and checks the backups each month.';
  p.texts.costs = 'Storage is covered by the university. We budget ten days of assistant time in the last year for cleaning and documenting the data before it is shared.';
  p.limits.data = 120;
  p.limits.ethics = 50;
  return p;
}
