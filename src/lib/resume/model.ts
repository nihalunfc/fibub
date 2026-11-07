// ATS resume maker: the resume data, and one list of "blocks" that the preview, the PDF,
// the Word file and the ATS score all draw from, so they always match.

export interface Job { title: string; company: string; location: string; start: string; end: string; current: boolean; bullets: string }
export interface Edu { degree: string; school: string; location: string; start: string; end: string; details: string }
export interface Project { name: string; link: string; start: string; end: string; bullets: string }
export interface Extra { title: string; body: string }
export type SectionId = 'summary' | 'skills' | 'experience' | 'projects' | 'education' | 'certs' | 'extras';
export interface Resume {
  name: string; headline: string; email: string; phone: string; location: string; links: string;
  summary: string; skills: string; certs: string;
  experience: Job[]; education: Edu[]; projects: Project[]; extras: Extra[];
  order: SectionId[]; style: 'sans' | 'serif'; paper: 'letter' | 'a4';
}

export const SECTION_TITLES: Record<SectionId, string> = {
  summary: 'Summary', skills: 'Skills', experience: 'Experience', projects: 'Projects',
  education: 'Education', certs: 'Certifications', extras: 'Additional sections',
};
export const DEFAULT_ORDER: SectionId[] = ['summary', 'skills', 'experience', 'projects', 'education', 'certs', 'extras'];

export const emptyJob = (): Job => ({ title: '', company: '', location: '', start: '', end: '', current: false, bullets: '' });
export const emptyEdu = (): Edu => ({ degree: '', school: '', location: '', start: '', end: '', details: '' });
export const emptyProject = (): Project => ({ name: '', link: '', start: '', end: '', bullets: '' });
export const emptyExtra = (): Extra => ({ title: '', body: '' });

export const emptyResume = (paper: 'letter' | 'a4' = 'letter'): Resume => ({
  name: '', headline: '', email: '', phone: '', location: '', links: '', summary: '', skills: '', certs: '',
  experience: [emptyJob()], education: [emptyEdu()], projects: [], extras: [],
  order: [...DEFAULT_ORDER], style: 'sans', paper,
});

export const EXAMPLE: Resume = {
  name: 'Alex Morgan', headline: 'Data Analyst', email: 'alex.morgan@example.com', phone: '+1 555 010 0100',
  location: 'Toronto, ON', links: 'linkedin.com/in/alexmorgan, github.com/alexmorgan',
  summary: 'Data analyst with 4 years of experience turning sales and operations data into clear dashboards and SQL reports that managers use every week. Strong in SQL, Power BI and Python, and comfortable presenting findings to non-technical teams.',
  skills: 'Analytics: SQL, Power BI, DAX, Excel, Python (pandas)\nData: ETL, data modelling, data quality checks, A/B testing\nWays of working: stakeholder reporting, documentation, training users',
  certs: 'Microsoft Certified: Power BI Data Analyst Associate (PL-300), 2024',
  experience: [
    { title: 'Data Analyst', company: 'Northwind Retail', location: 'Toronto, ON', start: '2023-01', end: '', current: true,
      bullets: 'Built 12 Power BI dashboards used by 40 store managers each week, replacing manual Excel reports\nReduced monthly reporting time by 60% by automating SQL extracts and data cleaning in Python\nAnalysed 2 million transactions to find product pairs worth $300K a year in cross-selling\nLed weekly reporting for a regional operations team of 8 people' },
    { title: 'Junior Analyst', company: 'Contoso Logistics', location: 'Mississauga, ON', start: '2020-06', end: '2022-12', current: false,
      bullets: 'Created weekly KPI reports on delivery times across 30 depots\nImproved data quality checks, cutting duplicate shipment records by 25%\nMaintained SQL Server views and documented 50 business definitions' },
  ],
  education: [
    { degree: 'Master of Data Analytics', school: 'Example University', location: 'Toronto, ON', start: '2019-09', end: '2020-12', details: '' },
    { degree: 'BSc Statistics', school: 'Example College', location: '', start: '2015-09', end: '2019-05', details: 'Dean’s list, 2018' },
  ],
  projects: [
    { name: 'Hotel demand forecast', link: 'github.com/alexmorgan/hotel-forecast', start: '2024-03', end: '2024-05',
      bullets: 'Forecast room demand with a seasonal model and a Power BI what-if page; forecast error fell to 6%' },
  ],
  extras: [{ title: 'Languages', body: 'English (fluent), French (intermediate)' }],
  order: [...DEFAULT_ORDER], style: 'sans', paper: 'letter',
};

// ---------- blocks ----------
export type Block =
  | { t: 'name'; text: string }
  | { t: 'headline'; text: string }
  | { t: 'contact'; text: string }
  | { t: 'heading'; text: string }
  | { t: 'para'; text: string }
  | { t: 'entry'; left: string; right: string }
  | { t: 'sub'; text: string }
  | { t: 'bullet'; text: string };

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
export const month = (ym: string) => {
  const m = /^(\d{4})-(\d{2})$/.exec(ym ?? '');
  return m ? `${MONTHS[+m[2] - 1]} ${m[1]}` : (ym ?? '').trim();
};
export const range = (start: string, end: string, current = false) => {
  const a = month(start), b = current ? 'Present' : month(end);
  return a && b ? `${a} – ${b}` : a ? (current ? `${a} – Present` : a) : b;
};
const lines = (s: string) => (s ?? '').split('\n').map((l) => l.replace(/^\s*([•●▪◦‣*·-]|\d+[.)])\s+/, '').trim()).filter(Boolean);
const join = (parts: string[], sep = ' | ') => parts.map((p) => (p ?? '').trim()).filter(Boolean).join(sep);

export function blocks(r: Resume): Block[] {
  const out: Block[] = [];
  if (r.name.trim()) out.push({ t: 'name', text: r.name.trim() });
  if (r.headline.trim()) out.push({ t: 'headline', text: r.headline.trim() });
  const contact = join([r.location, r.phone, r.email, ...r.links.split(/[,\n]/)]);
  if (contact) out.push({ t: 'contact', text: contact });
  for (const id of r.order) {
    const sec: Block[] = [];
    if (id === 'summary') lines(r.summary).forEach((text) => sec.push({ t: 'para', text }));
    if (id === 'skills') lines(r.skills).forEach((text) => sec.push({ t: 'para', text }));
    if (id === 'certs') lines(r.certs).forEach((text) => sec.push({ t: 'bullet', text }));
    if (id === 'experience') for (const j of r.experience) {
      if (!j.title.trim() && !j.company.trim()) continue;
      sec.push({ t: 'entry', left: join([j.title, j.company], ', '), right: range(j.start, j.end, j.current) });
      if (j.location.trim()) sec.push({ t: 'sub', text: j.location.trim() });
      lines(j.bullets).forEach((text) => sec.push({ t: 'bullet', text }));
    }
    if (id === 'projects') for (const p of r.projects) {
      if (!p.name.trim()) continue;
      sec.push({ t: 'entry', left: p.name.trim(), right: range(p.start, p.end) });
      if (p.link.trim()) sec.push({ t: 'sub', text: p.link.trim() });
      lines(p.bullets).forEach((text) => sec.push({ t: 'bullet', text }));
    }
    if (id === 'education') for (const e of r.education) {
      if (!e.degree.trim() && !e.school.trim()) continue;
      sec.push({ t: 'entry', left: join([e.degree, e.school], ', '), right: range(e.start, e.end) });
      if (e.location.trim()) sec.push({ t: 'sub', text: e.location.trim() });
      lines(e.details).forEach((text) => sec.push({ t: 'bullet', text }));
    }
    if (id === 'extras') { for (const x of r.extras) {
      const body = lines(x.body);
      if (!x.title.trim() || !body.length) continue;
      out.push({ t: 'heading', text: x.title.trim() });
      body.forEach((text) => out.push(body.length > 1 ? { t: 'bullet', text } : { t: 'para', text }));
    } continue; }
    if (sec.length) out.push({ t: 'heading', text: SECTION_TITLES[id] }, ...sec);
  }
  return out;
}

/** The plain text an ATS would read from the finished file (used for the live score). */
export const plainText = (b: Block[]) => b.map((x) => {
  if (x.t === 'entry') return `${x.left}${x.right ? '  ' + x.right : ''}`;
  if (x.t === 'bullet') return `• ${x.text}`;
  if (x.t === 'heading') return x.text.toUpperCase();
  return x.text;
}).join('\n');

export const fileBase = (r: Resume) => (r.name.trim() ? `${r.name.trim().replace(/[^\p{L}\p{N}]+/gu, '-').replace(/^-|-$/g, '')}-Resume` : 'Resume');
