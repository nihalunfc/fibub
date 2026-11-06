// ATS-readiness checks and score. Each check has points; the score is points earned out of 100.
import type { Extracted } from './extract';

export type Status = 'pass' | 'warn' | 'fail';
export interface Check { id: string; title: string; status: Status; points: number; max: number; fix: string }
export interface Report { score: number; checks: Check[]; words: number; keywords?: { matched: string[]; missing: string[]; percent: number } }

const EMAIL = /[\w.+-]+@[\w-]+\.[\w.-]+/;
const PHONE = /(\+?\d[\d\s().-]{7,}\d)/;
const LINK = /(linkedin\.com\/in\/|github\.com\/|https?:\/\/|www\.)/i;
const HEAD = (words: string) => new RegExp(`^\\s*(${words})\\s*:?\\s*$`, 'im');
const EXPERIENCE = HEAD('(professional |work |relevant |employment )?(experience|history)|work history|employment|career history');
const EDUCATION = HEAD('education( and training| & training)?|academic (background|qualifications)|qualifications');
const SKILLS = HEAD('(technical |key |core )?skills( and tools| & tools)?|core competencies|competencies|technical proficiencies|tools( and technologies)?');
const SUMMARY = HEAD('(professional )?(summary|profile)|about( me)?|objective|career (summary|objective)');
const MONTH = '(jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)[a-z]*\\.?';
const DATE_RANGE = new RegExp(`(${MONTH}\\s+\\d{4}|\\d{1,2}/\\d{4}|\\b(19|20)\\d{2})\\s*(–|-|—|to)\\s*(${MONTH}\\s+\\d{4}|\\d{1,2}/\\d{4}|(19|20)\\d{2}|present|current|now|today)`, 'gi');
const BULLET = /^\s*([•●▪◦‣\-–*·]|\d+[.)])\s+\S/;
const VERBS = /^(achieved|analy[sz]ed|automated|built|created|cut|delivered|designed|developed|drove|improved|increased|introduced|launched|led|managed|migrated|modeled|modelled|optimi[sz]ed|organi[sz]ed|owned|planned|produced|reduced|resolved|saved|shipped|streamlined|supported|trained|transformed|wrote|coordinated|implemented|maintained|prepared|presented|monitored|negotiated|mentored|established|engineered|forecast(ed)?|cleaned|visuali[sz]ed|tested|reported|configured|deployed|collaborated|partnered|generated|grew|won)\b/i;

const STOP = new Set('a about above after again all also am an and any are as at be because been being below between both but by can could did do does doing down during each few for from further had has have having he her here hers him his how i if in into is it its just me more most my no nor not now of off on once only or other our ours out over own same she should so some such than that the their theirs them then there these they this those through to too under until up very was we were what when where which while who whom why will with you your yours able across etc per via within without must strong work working team role job candidate candidates experience years year looking including include includes plus ideal ability skills skill well new using use used based help will would may make makes ensure responsible responsibilities required requirements preferred qualifications position company opportunity join us our we\'re you\'ll'.split(' '));

/** Important terms from a job ad: words and two-word phrases, most frequent and most specific first. */
export function jobKeywords(jd: string, max = 30): string[] {
  const count = new Map<string, number>();
  const bump = (t: string, n = 1) => count.set(t, (count.get(t) ?? 0) + n);
  const keep = (w: string) => !STOP.has(w) && !/^\d+$/.test(w) && (w.length > 2 || /^(r|c|go|bi|ai|ml|qa|ui|ux|hr|pm)$/.test(w));
  // Phrases never cross punctuation, so "SQL, Power BI" does not make "sql power".
  for (const chunk of jd.toLowerCase().split(/[,;:()!?\n|]|\.(?=\s|$)|\s-\s|\band\b|\bor\b/)) {
    const words = chunk.replace(/[^a-z0-9+#./\s-]/g, ' ').split(/\s+/).map((w) => w.replace(/^[-./]+|[-./]+$/g, '')).filter(Boolean);
    for (let i = 0; i < words.length; i++) {
      if (keep(words[i])) bump(words[i]);
      const n = words[i + 1];
      if (n && keep(words[i]) && keep(n)) bump(`${words[i]} ${n}`, 1.2);
    }
  }
  const TECH = /[+#]|^(sql|python|excel|tableau|power bi|aws|azure|gcp|java|react|dax|etl|snowflake|spark|looker|sap|salesforce|jira|figma|kubernetes|docker)$/;
  const terms = [...count].filter(([t, c]) => c >= 2 || TECH.test(t)).sort((a, b) => b[1] - a[1]).map(([t]) => t);
  // Drop single words already covered by a chosen phrase.
  const out: string[] = [];
  for (const t of terms) { if (out.length >= max) break; if (!out.some((o) => o.includes(' ') && o.split(' ').includes(t))) out.push(t); }
  return out;
}

export function score(x: Extracted, fileName: string, fileSize: number, jd = ''): Report {
  const t = x.text;
  const lines = t.split('\n');
  const words = (t.match(/[A-Za-z][A-Za-z'-]+/g) ?? []).length;
  const checks: Check[] = [];
  const add = (id: string, title: string, max: number, status: Status, fix: string, partial = 0.5) =>
    checks.push({ id, title, max, status, points: status === 'pass' ? max : status === 'warn' ? Math.round(max * partial) : 0, fix });

  const readable = words >= 80;
  add('text', 'Text can be read', 16, readable ? 'pass' : 'fail',
    readable ? 'An ATS can read the words in this file.' : 'Almost no text could be read. The file is probably a scan or an image. Rebuild it in Word or Google Docs and export a text-based PDF or .docx.');

  const top = lines.slice(0, 12).join('\n');
  const inHeader = (x.headerFooterText ?? '');
  add('email', 'Email address', 5, EMAIL.test(t) ? 'pass' : EMAIL.test(inHeader) ? 'warn' : 'fail',
    EMAIL.test(t) ? 'Found.' : EMAIL.test(inHeader) ? 'Your email is in the page header, which many ATS skip. Move it into the main body near your name.' : 'Add your email address near your name.');
  add('phone', 'Phone number', 4, PHONE.test(t) ? 'pass' : PHONE.test(inHeader) ? 'warn' : 'fail',
    PHONE.test(t) ? 'Found.' : PHONE.test(inHeader) ? 'Your phone number is in the page header, which many ATS skip. Move it into the main body.' : 'Add a phone number near your name.');
  add('link', 'LinkedIn or portfolio link', 2, LINK.test(t) ? 'pass' : 'warn', LINK.test(t) ? 'Found.' : 'Add your LinkedIn profile or portfolio address as plain text (for example linkedin.com/in/yourname).', 0);
  add('contact-top', 'Contact details at the top', 3, EMAIL.test(top) || PHONE.test(top) ? 'pass' : 'warn', EMAIL.test(top) || PHONE.test(top) ? 'Your contact details are near the top.' : 'Put your name, email and phone in the first lines of the resume body.', 0);

  add('h-exp', 'Experience section heading', 9, EXPERIENCE.test(t) ? 'pass' : 'fail', EXPERIENCE.test(t) ? 'Found a standard heading such as "Experience".' : 'Use a plain heading such as "Experience" or "Work Experience" on its own line. Creative headings ("My Journey") are often missed.');
  add('h-edu', 'Education section heading', 6, EDUCATION.test(t) ? 'pass' : 'fail', EDUCATION.test(t) ? 'Found.' : 'Add an "Education" heading on its own line.');
  add('h-skills', 'Skills section heading', 6, SKILLS.test(t) ? 'pass' : 'fail', SKILLS.test(t) ? 'Found.' : 'Add a "Skills" section listing your tools and skills as plain words, separated by commas.');
  add('h-summary', 'Summary at the top', 2, SUMMARY.test(t) ? 'pass' : 'warn', SUMMARY.test(t) ? 'Found.' : 'A 2 to 3 line "Summary" under your name helps both the ATS and the recruiter.', 0);

  const dates = (t.match(DATE_RANGE) ?? []).length;
  add('dates', 'Dates for each role', 6, dates >= 2 ? 'pass' : dates === 1 ? 'warn' : 'fail', dates >= 2 ? `Found ${dates} date ranges.` : 'Give every job a date range in one consistent style, such as "Jan 2023 – Present" or "2021 – 2023".');

  const bullets = lines.filter((l) => BULLET.test(l));
  add('bullets', 'Bullet points', 5, bullets.length >= 5 ? 'pass' : bullets.length ? 'warn' : 'fail', bullets.length >= 5 ? `${bullets.length} bullet points.` : 'Describe each role in 3 to 6 short bullet points, using simple bullets (• or -).');
  const withNums = bullets.filter((b) => /\d|%|\$|£|€|₹/.test(b.replace(DATE_RANGE, ''))).length;
  add('numbers', 'Measurable results', 6, bullets.length && withNums / bullets.length >= 0.3 ? 'pass' : withNums ? 'warn' : 'fail', withNums / Math.max(1, bullets.length) >= 0.3 ? `${withNums} bullets include numbers.` : 'Add numbers to your achievements: "cut report time by 40%", "managed a $2M budget", "served 300 customers a day".');
  const verbs = bullets.filter((b) => VERBS.test(b.replace(/^\s*([•●▪◦‣\-–*·]|\d+[.)])\s+/, ''))).length;
  add('verbs', 'Bullets start with action verbs', 4, bullets.length && verbs / bullets.length >= 0.5 ? 'pass' : verbs ? 'warn' : 'fail', verbs / Math.max(1, bullets.length) >= 0.5 ? 'Most bullets start with a strong verb.' : 'Start bullets with verbs such as Built, Led, Reduced, Automated, Analysed.');
  const firstPerson = (t.match(/\b(I|me|my)\b/g) ?? []).length;
  add('pronouns', 'No "I" or "my"', 2, firstPerson <= 2 ? 'pass' : 'warn', firstPerson <= 2 ? 'Written in resume style.' : `"I", "me" or "my" appears ${firstPerson} times. Resume style drops them: "Led a team of 5", not "I led a team of 5".`, 0);

  add('length', 'Length', 6, words >= 300 && words <= 1100 ? 'pass' : words >= 180 && words <= 1500 ? 'warn' : 'fail',
    words < 300 ? `${words} words is short. Most strong resumes have 400 to 900 words.` : words > 1100 ? `${words} words is long. Keep it to 1 to 2 pages; cut older or less relevant roles.` : `${words} words: a good length.`);

  if (x.kind === 'PDF') add('columns', 'Single-column layout', 10, x.columns ? 'fail' : 'pass', x.columns ? 'This looks like two columns side by side. Many ATS read straight across the page and mix the columns together. Use one column.' : 'Reads top to bottom in one column.');
  if (x.kind === 'Word') {
    add('tables', 'No tables for layout', 5, !x.tables ? 'pass' : 'fail', !x.tables ? 'No tables.' : `${x.tables} table${x.tables === 1 ? '' : 's'} found. Many ATS read tables out of order. Use plain paragraphs and tabs instead.`);
    add('textboxes', 'No text boxes', 5, !x.textBoxes ? 'pass' : 'fail', !x.textBoxes ? 'No text boxes.' : 'Text boxes are often skipped completely by ATS. Move their text into the main body.');
  }
  add('icons', 'No icons or emoji', 4, x.oddChars === 0 ? 'pass' : 'warn', x.oddChars === 0 ? 'No icon characters.' : `${x.oddChars} icon or emoji characters found. ATS show them as boxes or "?". Write "Email:" and "Phone:" in words instead.`, 0);
  if (x.kind === 'Word' && x.images) add('images', 'No photo or graphics', 2, 'warn', 'Pictures (photos, skill bars, logos) are ignored by ATS, and photos are discouraged in Canada, the US and the UK.', 0);
  add('file', 'File type and size', 3, /\.(docx|pdf)$/i.test(fileName) && fileSize < 2e6 ? 'pass' : 'warn', /\.(docx|pdf)$/i.test(fileName) ? (fileSize < 2e6 ? 'A .docx or text-based PDF is what most ATS expect.' : 'The file is over 2 MB; some portals reject that. Remove pictures or compress it.') : 'Most portals want .docx or PDF. Save your resume in one of those.', 0);

  let keywords: Report['keywords'];
  if (jd.trim()) {
    const kws = jobKeywords(jd);
    const low = t.toLowerCase();
    const matched = kws.filter((k) => low.includes(k)), missing = kws.filter((k) => !low.includes(k));
    const percent = Math.round((matched.length / Math.max(1, kws.length)) * 100);
    keywords = { matched, missing, percent };
    add('keywords', 'Matches the job ad', 12, percent >= 60 ? 'pass' : percent >= 35 ? 'warn' : 'fail', percent >= 60 ? `${percent}% of the job ad's key terms appear in your resume.` : `Only ${percent}% of the job ad's key terms appear. Add the missing ones you genuinely have, in the job ad's own words.`);
  }

  const max = checks.reduce((n, c) => n + c.max, 0);
  let s = Math.round((checks.reduce((n, c) => n + c.points, 0) / max) * 100);
  if (!readable) s = Math.min(s, 20);
  // Layout problems can scramble the whole resume, so they keep the score below 'ready'.
  if (checks.some((c) => ['columns', 'tables', 'textboxes'].includes(c.id) && c.status === 'fail')) s = Math.min(s, 74);
  return { score: s, checks, words, keywords };
}
