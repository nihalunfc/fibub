// One-click fix for the ATS checker: reads the plain text of a resume and sorts it into the fields of
// the ATS resume builder (src/lib/resume/model.ts), so it can be laid out again in one clean column.
// Formatting only: the words are the visitor's own. Nothing is added, reworded or summarised; lines
// that do not fit a field are handed back (`unplaced`) so the visitor can put them where they belong.
// Plain TypeScript with no DOM, so tests/ats-parse.mjs can check it in Node.
import { type Resume, type Job, type Edu, type Project, type Extra, type SectionId, emptyResume, DEFAULT_ORDER } from '../resume/model.ts';

export interface Parsed {
  resume: Resume;
  /** What was changed, in plain words, for the review banner. */
  changes: string[];
  /** Lines from the file that did not fit any field (kept so nothing is lost). */
  unplaced: string[];
}

const ODD = /[\u{E000}-\u{F8FF}\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{FE0F}\u{200B}-\u{200D}\u{FFFD}]/gu;
const BULLET = /^\s*([•●▪◦‣■□▫▸►➢✓✔∙⁃○*·]|[-–—](?=\s)|\d{1,2}[.)](?=\s))\s*/;
const EMAIL = /[\w.+-]+@[\w-]+(\.[\w-]+)+/;
const PHONE = /(?:\+?\d[\d\s().-]{7,}\d)/;
const URL_RE = /\b((?:https?:\/\/)?(?:www\.)?(?:linkedin\.com\/in\/|github\.com\/|gitlab\.com\/|behance\.net\/|dribbble\.com\/|medium\.com\/@?|kaggle\.com\/)[\w\-./%@]+|https?:\/\/[^\s,|]+|www\.[^\s,|]+|\b[\w-]+\.(?:com|ca|io|dev|me|net|org|co\.uk|in|ae)(?:\/[^\s,|]*)?\b)/gi;
const LOCATION_RE = /^[A-Z][A-Za-z.'-]+(?:\s[A-Z][A-Za-z.'-]+){0,2},\s*(?:[A-Z]{2,3}|[A-Z][a-z]+(?:\s(?:Columbia|York|Jersey|Brunswick|Scotia|Wales|Bengal|Pradesh|Nadu|Kingdom|States|Arab Emirates|Island|Carolina|Dakota|Mexico|Hampshire|Virginia|East))?)(?:,\s*(?:Canada|USA|US|United States|UK|United Kingdom|India|UAE|United Arab Emirates|Qatar|Oman|Kuwait|Bahrain|Saudi Arabia|Australia|Ireland))?$/;
const LOCATION = { test: (s: string) => LOCATION_RE.test(s) && !TITLE_WORDS.test(s) && !ORG_WORDS.test(s) && !DEGREE.test(s) && !SCHOOL.test(s) };

const MON = '(?:jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)[a-z]*\\.?';
const ONE = `(?:${MON}\\s*,?\\s*(?:19|20)\\d{2}|(?:0?[1-9]|1[0-2])\\s*[/.-]\\s*(?:19|20)\\d{2}|(?:19|20)\\d{2}\\s*[/.-]\\s*(?:0[1-9]|1[0-2])|(?:spring|summer|fall|autumn|winter)\\s+(?:19|20)\\d{2}|(?:19|20)\\d{2})`;
const END = `(?:${ONE}|present|current|now|today|ongoing|date)`;
const RANGE = new RegExp(`(${ONE})\\s*(?:–|—|-|to|until|till)\\s*(${END})`, 'i');
const SINGLE = new RegExp(`(?:^|[\\s(|,–-])(${MON}\\s*,?\\s*(?:19|20)\\d{2}|(?:0?[1-9]|1[0-2])/(?:19|20)\\d{2}|(?:expected\\s+)?(?:19|20)\\d{2})\\s*\\)?\\s*$`, 'i');
const MONTHS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];

/** "Jan 2023" -> "2023-01", "01/2023" -> "2023-01", "2023" stays "2023" (no month is ever made up). */
export function normDate(s: string): { v: string; now: boolean } {
  const t = s.trim().toLowerCase().replace(/\.$/, '');
  if (/^(present|current|now|today|ongoing|date)$/.test(t)) return { v: '', now: true };
  let m = /^([a-z]{3})[a-z]*\.?\s*,?\s*((?:19|20)\d{2})$/.exec(t);
  if (m && !MONTHS.includes(m[1].slice(0, 3))) m = null;
  if (m) return { v: `${m[2]}-${String(MONTHS.indexOf(m[1].slice(0, 3)) + 1).padStart(2, '0')}`, now: false };
  m = /^(0?[1-9]|1[0-2])\s*[/.-]\s*((?:19|20)\d{2})$/.exec(t);
  if (m) return { v: `${m[2]}-${m[1].padStart(2, '0')}`, now: false };
  m = /^((?:19|20)\d{2})\s*[/.-]\s*(0[1-9]|1[0-2])$/.exec(t);
  if (m) return { v: `${m[1]}-${m[2]}`, now: false };
  return { v: s.trim().replace(/^expected\s+/i, 'Expected '), now: false };
}

// Headings people use, mapped to the builder's sections. Anything else that looks like a heading
// becomes its own "More sections" entry with the visitor's own title.
const HEADS: [SectionId, RegExp][] = [
  ['summary', /^(professional |career |executive |personal )?(summary|profile|objective|overview)( statement)?$|^about( me)?$|^summary of qualifications$|^introduction$/],
  ['skills', /^((technical|key|core|relevant|professional|hard|soft|it|computer|digital) )?(skills|competencies|proficiencies|expertise|strengths)( (and|&) (tools|technologies|abilities|expertise|interests))?$|^skills summary$|^areas of expertise$|^tools( (and|&) technologies)?$|^tech(nical)? stack$|^technologies$|^skill set$|^skillset$|^what i (do|know|bring)$|^toolbox$|^tool ?kit$/],
  ['experience', /^((professional|work|relevant|employment|career|industry|internship|work and) )?(experience|history|background)$|^employment( history)?$|^work history$|^career history$|^experience$|^internships?$|^positions held$|^professional background$|^where i('ve| have) worked$|^(my |career )?(journey|path)$|^career highlights$|^jobs$|^work$/],
  ['projects', /^((key|selected|personal|academic|relevant|technical|side|portfolio) )?projects?$|^portfolio$|^project experience$/],
  ['education', /^education( (and|&) (training|qualifications|certifications))?$|^academic (background|qualifications|history|profile)$|^qualifications$|^educational (background|qualifications)$|^academics$|^training$|^studies$|^(my )?education( and training)?$|^schooling$/],
  ['certs', /^(licen[cs]es? (and|&) )?certifications?( (and|&) (licen[cs]es?|training|courses))?$|^certificates?$|^licen[cs]es?$|^courses?( (and|&) certifications?)?$|^professional development$/],
];
const STANDARD: Partial<Record<SectionId, string>> = { summary: 'Summary', skills: 'Skills', experience: 'Experience', projects: 'Projects', education: 'Education', certs: 'Certifications' };
const EXTRA_HEAD = /^(languages?|volunteer(ing)?( experience| work)?|awards?( (and|&) (honou?rs|achievements))?|honou?rs( (and|&) awards)?|achievements|accomplishments|publications?|presentations|research|interests|hobbies( (and|&) interests)?|activities|extracurricular( activities)?|leadership( experience)?|memberships?|affiliations|professional (memberships|affiliations)|references|additional information|other|patents|conferences|community( involvement)?)$/;

const clean = (l: string) => l.replace(ODD, ' ').replace(/[\t ]+/g, ' ').replace(/\s+([,.;:])/g, '$1').trim();
const headKey = (l: string) => l.toLowerCase().replace(/[:\-–—_.|•]+\s*$/, '').replace(/^[\s:\-–—_|•]+/, '').replace(/\s+/g, ' ').trim();
const words = (l: string) => l.split(/\s+/).filter(Boolean).length;
/** A line that reads as a sentence (a description), not a job or school header. */
const sentence = (l: string) => words(l) > 10 || (words(l) > 5 && /[.!;]$|;\s/.test(l) && !ORG_WORDS.test(l));

function heading(raw: string, caps = true): { id: SectionId | 'extra'; title: string } | null {
  const l = raw.trim();
  if (!l || l.length > 48 || BULLET.test(raw) || /@|\d{3,}/.test(l)) return null;
  const k = headKey(l);
  if (!k || words(k) > 5) return null;
  for (const [id, re] of HEADS) if (re.test(k)) return { id, title: l.replace(/[:\s]+$/, '') };
  if (EXTRA_HEAD.test(k)) return { id: 'extra', title: titleCase(l.replace(/[:\s]+$/, '')) };
  // An unknown line in capitals with no digits ("CORE STRENGTHS") reads as a heading too.
  if (caps && /^[A-Z][A-Z &/'-]{3,}$/.test(l.replace(/:$/, '')) && words(l) <= 4 && !/\d/.test(l)) return { id: 'extra', title: titleCase(l.replace(/:$/, '')) };
  return null;
}
const titleCase = (s: string) => (s === s.toUpperCase() ? s.toLowerCase().replace(/(^|[\s/&-])([a-z])/g, (_, a, b) => a + b.toUpperCase()).replace(/\b(And|Of|The|In|For)\b/g, (w) => w.toLowerCase()).replace(/^./, (c) => c.toUpperCase()) : s);

const TITLE_WORDS = /\b(analyst|manager|engineer|developer|intern|assistant|specialist|coordinator|director|lead|officer|consultant|supervisor|associate|designer|scientist|administrator|representative|technician|teacher|tutor|nurse|clerk|accountant|cashier|executive|head|owner|founder|co-founder|volunteer|programmer|architect|advisor|adviser|agent|attendant|auditor|barista|chef|cook|driver|editor|writer|operator|planner|president|vice|chief|cto|ceo|cfo|researcher|fellow|trainee|apprentice|server|receptionist|sales|associate|worker|member|staff|instructor|lecturer|professor|therapist|pharmacist|doctor|physician|controller|strategist|buyer|merchandiser|bookkeeper|steward|host|captain|mechanic|electrician|welder|carpenter|labourer|laborer|guard|bartender|housekeeper|concierge|crew)\b/i;
const ORG_WORDS = /\b(inc|ltd|llc|llp|plc|corp|corporation|company|co\.|group|bank|hospital|hotel|resort|services|solutions|technologies|technology|systems|labs?|limited|pvt|gmbh|partners|associates|agency|foundation|university|college|institute|school|council|ministry|department|government|authority|clinic|store|stores|restaurant|cafe|café|retail|logistics|consulting|studio|media|networks|international|global)\b/i;
const DEGREE = /\b(bachelor|master|ph\.?d|doctor(ate)?|diploma|certificate|degree|associate|b\.?\s?sc|m\.?\s?sc|b\.?\s?a\b|m\.?\s?a\b|b\.?\s?tech|m\.?\s?tech|b\.?\s?e\b|m\.?\s?e\b|b\.?\s?com|m\.?\s?com|mba|bba|bca|mca|b\.?\s?ed|llb|llm|mbbs|md\b|high school|secondary|higher secondary|hsc|ssc|cbse|a-levels?|gcse|ged|post-?graduate|undergraduate|honours|hons|major|minor)\b/i;
const SCHOOL = /\b(university|college|institute|school|academy|polytechnic|iit|nit|conservatory|seminary|campus)\b/i;

const splitParts = (s: string) => s.split(/\s+[|•·–—]\s+|\s+-\s+|\s{2,}|\t|\s+@\s+|\s+at\s+(?=[A-Z])/).map((p) => p.trim().replace(/^[,|]+|[,|]+$/g, '').trim()).filter(Boolean);

interface Entry { head: string[]; start: string; end: string; current: boolean; body: string[] }

const tidy = (s: string) => s.replace(/\(\s*\)/g, '').replace(/\s+/g, ' ').trim().replace(/^[\s(),|–—:-]+|[\s(,|–—:-]+$/g, '').trim();

/** Find a date range (or one date) in a line; return it and the line without it. */
function takeDates(l: string): { rest: string; start: string; end: string; current: boolean } | null {
  const m = RANGE.exec(l);
  if (m) {
    const a = normDate(m[1]), b = normDate(m[2]);
    return { rest: tidy(l.slice(0, m.index) + ' ' + l.slice(m.index + m[0].length)), start: a.v, end: b.now ? '' : b.v, current: b.now };
  }
  const s = SINGLE.exec(l);
  if (s && words(l) <= 14) {
    const d = normDate(s[1]);
    return { rest: tidy(l.slice(0, s.index)), start: '', end: d.v, current: false };
  }
  return null;
}

/** Split a section's lines into entries (jobs, schools, projects): a header, dates, then bullets. */
function entries(lines: string[]): Entry[] {
  const out: Entry[] = [];
  let cur: Entry | null = null;
  const isBullet = (l: string) => BULLET.test(l);
  const hasDate = (l: string) => !isBullet(l) && !!takeDates(l) && words(l) <= 16;
  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i];
    if (isBullet(raw)) {
      const t = raw.replace(BULLET, '').trim();
      if (!cur) { cur = { head: [], start: '', end: '', current: false, body: [] }; out.push(cur); }
      if (t) cur.body.push(t);
      continue;
    }
    const d = hasDate(raw) ? takeDates(raw)! : null;
    const prevBullet = i > 0 && cur && cur.body.length > 0;
    // A wrapped bullet: the next line carries on the sentence (starts in lower case, or the last bullet
    // has no full stop and no new job starts within the next two lines).
    if (!d && prevBullet) {
      const soon = lines.slice(i, i + 3).some((l, k) => k > 0 && hasDate(l) || k === 0 && hasDate(l));
      const last = cur!.body[cur!.body.length - 1];
      if (/^[a-z0-9(&,;%$]/.test(raw) || (!soon && !/[.!?:]$/.test(last) && words(raw) > 3)) { cur!.body[cur!.body.length - 1] = `${last} ${raw}`; continue; }
      if (!soon && words(raw) > 8) { cur!.body.push(raw); continue; }
    }
    // "Dean's list, 2018" under a dated entry is a detail of it, not a new entry.
    if (d && cur && (cur.start || cur.end || cur.current) && !RANGE.test(raw) && !(TITLE_WORDS.test(d.rest) || ORG_WORDS.test(d.rest) || DEGREE.test(d.rest) || SCHOOL.test(d.rest))) { cur.body.push(raw); continue; }
    if (d) {
      // A dates line belongs to the entry whose header we are reading, unless that entry already has dates.
      if (cur && !cur.body.length && !cur.start && !cur.end && !cur.current) {
        if (d.rest) cur.head.push(d.rest);
        Object.assign(cur, { start: d.start, end: d.end, current: d.current });
      } else {
        cur = { head: d.rest ? [d.rest] : [], start: d.start, end: d.end, current: d.current, body: [] };
        out.push(cur);
      }
      continue;
    }
    const dated = !!cur && !!(cur.start || cur.end || cur.current);
    // After a full header with dates, a plain line starts the next entry if a date follows it soon.
    const dateSoon = lines.slice(i + 1, i + 3).some((l) => hasDate(l)) && !(lines[i + 1] && isBullet(lines[i + 1]));
    if (!cur || cur.body.length || cur.head.length >= 3 || (dated && dateSoon)) {
      // A long sentence under a header with no bullets is a description line, not a new header.
      if (cur && !cur.body.length && sentence(raw)) { cur.body.push(raw); continue; }
      cur = { head: [raw], start: '', end: '', current: false, body: [] };
      out.push(cur);
    } else if (sentence(raw) && cur.head.length) cur.body.push(raw);
    else cur.head.push(raw);
  }
  return out;
}

/** "Data Analyst | Northwind, Toronto, ON" -> title, organisation and location. */
function who(head: string[], kind: 'job' | 'edu'): { a: string; b: string; loc: string; extra: string[] } {
  const parts = head.flatMap(splitParts);
  let loc = '';
  const li = parts.findIndex((p, i) => (i > 0 || parts.length > 1) && (LOCATION.test(p) || /^(remote|hybrid|on-?site)$/i.test(p)));
  if (li >= 0) loc = parts.splice(li, 1)[0];
  // "Northwind Retail, Toronto, ON": a place at the end of a part.
  for (let i = 0; i < parts.length && !loc; i++) {
    const c = parts[i].split(/,\s*/);
    for (const n of [3, 2]) if (c.length > n && LOCATION.test(c.slice(-n).join(', '))) { loc = c.slice(-n).join(', '); parts[i] = c.slice(0, -n).join(', '); break; }
  }
  // "Data Analyst, Northwind Retail" on its own: split at the comma.
  if (parts.length === 1 && parts[0].split(/,\s*/).length === 2) parts.splice(0, 1, ...parts[0].split(/,\s*/));
  let [a = '', b = '', ...extra] = parts;
  const A = kind === 'job' ? TITLE_WORDS : DEGREE, B = kind === 'job' ? ORG_WORDS : SCHOOL;
  if (b && (B.test(a) && !A.test(a)) && (A.test(b) || !B.test(b))) [a, b] = [b, a];
  return { a, b, loc, extra };
}

export function parseResume(text: string, opts: { headerLines?: string[]; paper?: 'letter' | 'a4'; kind?: string; columns?: boolean; tables?: number; textBoxes?: number } = {}): Parsed {
  const R = emptyResume(opts.paper ?? 'letter');
  R.experience = []; R.education = [];
  const changes: string[] = [], unplaced: string[] = [];
  const odd = (text.match(ODD) ?? []).length;
  let lines = text.replace(/\r/g, '').split('\n').map(clean).filter((l) => l && !/^(page \d+( of \d+)?|\d+ ?\/ ?\d+|-? ?\d+ ?-?)$/i.test(l));
  // Contact lines from a Word page header go to the top of the body, where every ATS reads them.
  const hl = (opts.headerLines ?? []).map(clean).filter((l) => l && !lines.includes(l) && !/^page \d+/i.test(l));
  if (hl.length) { lines = [...hl, ...lines]; changes.push('Moved your contact details out of the page header and into the body, where every ATS reads them.'); }

  // ---- sections ----
  type Sec = { id: SectionId | 'extra' | 'top'; title: string; lines: string[] };
  const secs: Sec[] = [{ id: 'top', title: '', lines: [] }];
  const renamed: string[] = [];
  for (const [n, l] of lines.entries()) {
    // A name in capitals at the very top is not a heading.
    const h = heading(l, n > 1 || secs.length > 1);
    if (h) {
      secs.push({ id: h.id, title: h.title, lines: [] });
      if (h.id !== 'extra' && headKey(h.title) !== STANDARD[h.id]!.toLowerCase()) renamed.push(`"${h.title}" → ${STANDARD[h.id]}`);
      continue;
    }
    // "Skills: SQL, Excel" on one line: a heading with its content.
    const inline = /^([A-Za-z &]{3,30}):\s+(.+)$/.exec(l);
    if (inline && !BULLET.test(l)) {
      const h2 = heading(inline[1]);
      if (h2 && (h2.id === 'skills' || h2.id === 'summary' || h2.id === 'certs' || h2.id === 'extra')) { secs.push({ id: h2.id, title: h2.title, lines: [inline[2]] }); continue; }
    }
    secs[secs.length - 1].lines.push(l);
  }
  if (renamed.length) changes.push(`Renamed headings to the standard ones an ATS looks for: ${renamed.join(', ')}.`);

  // ---- contact block (before the first heading) ----
  // Join a paragraph that wrapped onto several lines under the name.
  const top: string[] = [];
  for (const l of secs[0].lines) {
    if (top.length && /^[a-z(]/.test(l) && words(top[top.length - 1]) > 8) top[top.length - 1] += ' ' + l; else top.push(l);
  }
  const links: string[] = [];
  const rest: string[] = [];
  for (const raw of top) {
    let l = raw;
    const e = EMAIL.exec(l); if (e && !R.email) { R.email = e[0]; l = l.replace(e[0], ' '); }
    for (const u of l.match(URL_RE) ?? []) { if (!EMAIL.test(u) && !links.includes(u)) { links.push(u.replace(/\/$/, '')); } l = l.replace(u, ' '); }
    const p = PHONE.exec(l); if (p && !R.phone && p[0].replace(/\D/g, '').length >= 9) { R.phone = p[0].trim(); l = l.replace(p[0], ' '); }
    l = l.replace(/\b(e-?mail|phone|mobile|tel|cell|linkedin|github|portfolio|website|address|location)\s*:/gi, ' ');
    const bits = l.split(/\s*[|•·◆]\s*|\s{2,}/).map((b) => b.replace(/^[,;\s]+|[,;\s]+$/g, '').trim()).filter(Boolean);
    for (const b of bits) {
      if (!R.location && LOCATION.test(b) && words(b) <= 6) { R.location = b; continue; }
      rest.push(b);
    }
  }
  R.links = links.join(', ');
  const nameAt = rest.findIndex((b) => /^[\p{Lu}][\p{L}.'’-]*(\s+[\p{L}.'’-]+){0,4}$/u.test(b) && words(b) <= 5 && !TITLE_WORDS.test(b));
  if (nameAt >= 0) R.name = rest.splice(nameAt, 1)[0];
  else if (rest.length && words(rest[0]) <= 5) R.name = rest.shift()!;
  if (R.name === R.name.toUpperCase() && /[A-Z]{2}/.test(R.name)) R.name = titleCase(R.name);
  for (const b of rest) {
    if (!R.headline && words(b) <= 8 && !/[.!?]$/.test(b)) R.headline = b;
    else if (words(b) > 8) R.summary = R.summary ? `${R.summary} ${b}` : b;
    else unplaced.push(b);
  }
  if (rest.some((b) => words(b) > 8) && !secs.some((s) => s.id === 'summary')) changes.push('Put the paragraph under your name in a "Summary" section.');

  // ---- each section ----
  const strip = (l: string) => l.replace(BULLET, '').trim();
  const para = (ls: string[]) => ls.map(strip).join(' ').replace(/\s+/g, ' ').trim();
  let dateCount = 0;
  const seen = new Set<string>();
  for (const s of secs.slice(1)) {
    const ls = s.lines;
    if (!ls.length) continue;
    if (s.id !== 'extra') seen.add(s.id);
    if (s.id === 'summary') R.summary = [R.summary, para(ls)].filter(Boolean).join(' ');
    else if (s.id === 'skills') {
      const items = ls.map(strip).filter(Boolean);
      // A sidebar list with one skill per line becomes one comma-separated line, which ATS read best.
      const short = items.filter((x) => words(x) <= 4 && !/[:,]/.test(x));
      const add = short.length >= 4 && short.length >= items.length * 0.7 ? [items.join(', ')] : items;
      if (add.length < items.length) changes.push('Put your one-per-line skills on one line, separated by commas.');
      R.skills = [R.skills, ...add].filter(Boolean).join('\n');
    } else if (s.id === 'certs') R.certs = [R.certs, ...ls.map(strip)].filter(Boolean).join('\n');
    else if (s.id === 'experience' || s.id === 'education' || s.id === 'projects') {
      for (const e of entries(ls)) {
        if (e.start || e.end || e.current) dateCount++;
        if (s.id === 'experience') {
          const w = who(e.head, 'job');
          const j: Job = { title: w.a, company: w.b, location: w.loc, start: e.start, end: e.end, current: e.current, bullets: [...w.extra, ...e.body].join('\n') };
          if (!j.title && !j.company) { if (j.bullets) unplaced.push(...j.bullets.split('\n')); continue; }
          R.experience.push(j);
        } else if (s.id === 'education') {
          const w = who(e.head, 'edu');
          const ed: Edu = { degree: w.a, school: w.b, location: w.loc, start: e.start, end: e.end, details: [...w.extra, ...e.body].join('\n') };
          if (!ed.degree && !ed.school) { if (ed.details) unplaced.push(...ed.details.split('\n')); continue; }
          R.education.push(ed);
        } else {
          const parts = e.head.flatMap(splitParts);
          const li = parts.findIndex((p) => new RegExp(URL_RE.source, 'i').test(p));
          const link = li >= 0 ? parts.splice(li, 1)[0] : '';
          const p: Project = { name: parts.shift() ?? '', link, start: e.start, end: e.end, bullets: [...parts, ...e.body].join('\n') };
          if (!p.name) { if (p.bullets) R.projects.length ? (R.projects[R.projects.length - 1].bullets += '\n' + p.bullets) : unplaced.push(...p.bullets.split('\n')); continue; }
          R.projects.push(p);
        }
      }
    } else if (s.id === 'extra') {
      const x: Extra = { title: s.title, body: ls.map(strip).filter(Boolean).join('\n') };
      const same = R.extras.find((y) => y.title.toLowerCase() === x.title.toLowerCase());
      if (same) same.body += '\n' + x.body; else R.extras.push(x);
    }
  }
  R.order = orderFrom(text);
  if (R.summary && R.order[0] !== 'summary') R.order = ['summary', ...R.order.filter((x) => x !== 'summary')];

  // ---- what changed ----
  if (opts.columns) changes.unshift('Turned two columns into one, so an ATS reads your resume top to bottom in the right order.');
  if (opts.tables) changes.unshift(`Took your text out of ${opts.tables === 1 ? 'a table' : `${opts.tables} tables`} and laid it out as plain lines.`);
  if (opts.textBoxes) changes.unshift('Moved the text out of text boxes into the main body.');
  if (odd) changes.push(`Removed ${odd} icon or emoji character${odd === 1 ? '' : 's'} that ATS show as boxes.`);
  if (dateCount) changes.push('Wrote every date the same way ("Jan 2023 – Present") on the right of each entry.');
  changes.push('Used one column, standard fonts, real bullet points and no pictures, tables or page headers.');
  return { resume: R, changes, unplaced: [...new Set(unplaced)].filter((u) => u.length > 1) };
}

/** Section order for the builder: the visitor's own order where we found it, then the rest. */
export function orderFrom(text: string): SectionId[] {
  const found: SectionId[] = [];
  for (const [n, l] of text.split('\n').entries()) { const h = heading(clean(l), n > 1); if (h && h.id !== 'extra' && !found.includes(h.id)) found.push(h.id); }
  if (found[0] !== 'summary' && found.includes('summary')) found.splice(found.indexOf('summary'), 1), found.unshift('summary');
  return [...found, ...DEFAULT_ORDER.filter((x) => !found.includes(x))];
}
