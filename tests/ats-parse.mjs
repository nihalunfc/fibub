// Checks for the ATS checker's one-click fix (src/lib/ats/parse.ts): messy resume text in, the builder's
// fields out, with every word kept and nothing made up. Run: node tests/ats-parse.mjs (part of npm test).
import { parseResume, normDate } from '../src/lib/ats/parse.ts';
import { blocks, plainText } from '../src/lib/resume/model.ts';
import { score } from '../src/lib/ats/score.ts';

let failures = 0;
const check = (ok, msg) => { console.log(`${ok ? 'PASS' : 'FAIL'}  ${msg}`); if (!ok) failures++; };
const eq = (a, b, msg) => check(JSON.stringify(a) === JSON.stringify(b), `${msg} -> ${JSON.stringify(a)}`);

eq(normDate('Jan 2023'), { v: '2023-01', now: false }, 'date: Jan 2023');
eq(normDate('September, 2021'), { v: '2021-09', now: false }, 'date: September, 2021');
eq(normDate('03/2020'), { v: '2020-03', now: false }, 'date: 03/2020');
eq(normDate('2019'), { v: '2019', now: false }, 'date: a year stays a year (no month made up)');
eq(normDate('Present'), { v: '', now: true }, 'date: Present');

// A typical exported two-column resume, already read column by column, with icons and creative headings.
const messy = `PRIYA SHARMA
Data Analyst
\uf0e0 priya.sharma@example.com | \uf095 +1 (416) 555-0199 | Toronto, ON | linkedin.com/in/priyasharma
Detail-minded analyst with 3 years of experience building dashboards and SQL reports for retail and
logistics teams.
CORE SKILLS
SQL
Power BI
Excel
Python
Tableau
WORK HISTORY
Data Analyst | Northwind Retail | Jan 2023 – Present
• Built 12 Power BI dashboards used by 40 store managers each week, replacing manual
reports in Excel
• Reduced reporting time by 60% by automating SQL extracts
Junior Analyst
Contoso Logistics, Mississauga, ON
June 2020 - Dec 2022
- Created weekly KPI reports on delivery times across 30 depots
- Improved data quality checks, cutting duplicate records by 25%
EDUCATION
Master of Data Analytics, Example University 2019 – 2020
BSc Statistics
Example College
2015 - 2019
Dean's list, 2018
CERTIFICATIONS
Microsoft Certified: Power BI Data Analyst Associate (PL-300), 2024
LANGUAGES
English, French
`;
const p = parseResume(messy);
const R = p.resume;
eq([R.name, R.headline, R.email, R.phone, R.location, R.links], ['Priya Sharma', 'Data Analyst', 'priya.sharma@example.com', '+1 (416) 555-0199', 'Toronto, ON', 'linkedin.com/in/priyasharma'], 'contact block');
check(/^Detail-minded analyst .* logistics teams\.$/.test(R.summary), `summary from the paragraph under the name -> ${R.summary}`);
eq(R.skills, 'SQL, Power BI, Excel, Python, Tableau', 'one-per-line skills joined');
eq(R.experience.map((j) => [j.title, j.company, j.location, j.start, j.end, j.current]), [['Data Analyst', 'Northwind Retail', '', '2023-01', '', true], ['Junior Analyst', 'Contoso Logistics', 'Mississauga, ON', '2020-06', '2022-12', false]], 'jobs: title, employer, location, dates');
eq(R.experience[0].bullets.split('\n'), ['Built 12 Power BI dashboards used by 40 store managers each week, replacing manual reports in Excel', 'Reduced reporting time by 60% by automating SQL extracts'], 'wrapped bullet joined back together');
eq(R.experience[1].bullets.split('\n').length, 2, 'dash bullets read');
eq(R.education.map((e) => [e.degree, e.school, e.start, e.end, e.details]), [['Master of Data Analytics', 'Example University', '2019', '2020', ''], ['BSc Statistics', 'Example College', '2015', '2019', "Dean's list, 2018"]], 'education entries');
eq(R.certs, 'Microsoft Certified: Power BI Data Analyst Associate (PL-300), 2024', 'certifications');
eq(R.extras, [{ title: 'Languages', body: 'English, French' }], 'extra section keeps its own title');
check(p.changes.some((c) => /"WORK HISTORY" → Experience/.test(c)) && p.changes.some((c) => /icon/.test(c)), `changes listed -> ${p.changes.join(' / ')}`);
eq(p.unplaced, [], 'nothing left over');
eq(R.order.slice(0, 4), ['summary', 'skills', 'experience', 'education'], 'keeps the visitor\'s section order');

// Nothing invented: every word in the fixed resume came from the original file.
const outText = plainText(blocks(R));
const src = new Set(messy.toLowerCase().match(/[a-z0-9%$]+/g));
const made = [...new Set(outText.toLowerCase().match(/[a-z0-9%$]+/g))].filter((w) => !src.has(w) && !['summary', 'skills', 'experience', 'education', 'certifications', 'present', 'jun', 'dec', 'jan'].includes(w));
eq(made, [], 'no words added beyond standard headings and dates');
const before = score({ text: messy, kind: 'PDF', columns: true, oddChars: 3 }, 'r.pdf', 90000).score;
const after = score({ text: outText, kind: 'Word', oddChars: 0 }, 'r.docx', 30000).score;
check(after > before && after >= 80, `score goes up after the fix: ${before} -> ${after}`);

// Other common layouts.
{
  const t = `John O'Neil
john@site.io
Summary: Warehouse lead who keeps shifts on time.
Professional Experience
Shift Lead at Acme Logistics Inc.  (03/2021 – Present)
Ran a 12-person night shift; cut picking errors 18%.
Warehouse Associate — Acme Logistics Inc. — 2018 to 2021
• Picked and packed 300 orders a day
Projects
Forklift route map | github.com/joneil/routes
• Mapped aisles to cut walking time
Education
High School Diploma
Lincoln Secondary School, 2017
Volunteering
Food bank driver, weekends
`;
  const q = parseResume(t).resume;
  eq([q.name, q.email, q.summary], ["John O'Neil", 'john@site.io', 'Warehouse lead who keeps shifts on time.'], 'inline "Summary:" heading');
  eq(q.experience.map((j) => [j.title, j.company, j.start, j.end, j.current, j.bullets]), [['Shift Lead', 'Acme Logistics Inc.', '2021-03', '', true, 'Ran a 12-person night shift; cut picking errors 18%.'], ['Warehouse Associate', 'Acme Logistics Inc.', '2018', '2021', false, 'Picked and packed 300 orders a day']], '"at" and em-dash headers, paragraph description kept');
  eq(q.projects.map((x) => [x.name, x.link, x.bullets]), [['Forklift route map', 'github.com/joneil/routes', 'Mapped aisles to cut walking time']], 'project with link');
  eq(q.education.map((e) => [e.degree, e.school, e.end]), [['High School Diploma', 'Lincoln Secondary School', '2017']], 'school with a single year');
  eq(q.extras, [{ title: 'Volunteering', body: 'Food bank driver, weekends' }], 'volunteering kept');
}
{
  // Contact in a Word page header, and a line that fits no field is handed back, never dropped.
  const r = parseResume('Experience\nCashier, Corner Mart 2022 – 2023\n• Served 200 customers a day', { headerLines: ['Sam Lee', 'sam@example.com | 905 555 0100'] });
  eq([r.resume.name, r.resume.email, r.resume.phone], ['Sam Lee', 'sam@example.com', '905 555 0100'], 'contact details from the page header');
  check(r.changes[0].includes('page header'), 'page header move is listed');
}

{
  // The builder's own layout reads back into the same fields.
  const { EXAMPLE } = await import('../src/lib/resume/model.ts');
  const back = parseResume(plainText(blocks(EXAMPLE))).resume;
  const pick = (r) => ({ ...r, order: undefined, style: undefined, paper: undefined, experience: r.experience.map((j) => ({ ...j })), headline: r.headline });
  for (const k of ['name', 'headline', 'email', 'phone', 'location', 'links', 'summary', 'certs']) eq(back[k], EXAMPLE[k], `round trip: ${k}`);
  eq(back.skills, EXAMPLE.skills, 'round trip: skills');
  eq(back.experience, EXAMPLE.experience, 'round trip: experience');
  eq(back.education.map((e) => [e.degree, e.school, e.start, e.end, e.details]), EXAMPLE.education.map((e) => [e.degree, e.school, e.start, e.end, e.details]), 'round trip: education');
  eq(back.projects, EXAMPLE.projects, 'round trip: projects');
  eq(back.extras, EXAMPLE.extras, 'round trip: extras');
}

if (failures) { console.log(`\n${failures} ATS-fix check(s) failed`); process.exit(1); }
console.log('\nAll ATS-fix checks passed');
