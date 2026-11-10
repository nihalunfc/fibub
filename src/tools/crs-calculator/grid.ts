// CRS points grid, copied from IRCC's page:
// https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry/check-score/crs-criteria.html
// (page modified 2026-11-03; checked 2026-11-10) and the Labour Market Integration rules on
// https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry/changes.html
// (modified 2026-10-16; checked 2026-11-10). Not affiliated with IRCC: check the official source.

export const SOURCE = 'https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry/check-score/crs-criteria.html';
export const CHANGES = 'https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry/changes.html';
export const CHECKED = '2026-11-10';

// [with spouse, without spouse]
type Pair = [number, number];

/** Age 17 or less .. 45 or more. */
export function agePoints(age: number): Pair {
  const t: Record<number, Pair> = {
    18: [90, 99], 19: [95, 105], 30: [95, 105], 31: [90, 99], 32: [85, 94], 33: [80, 88], 34: [75, 83],
    35: [70, 77], 36: [65, 72], 37: [60, 66], 38: [55, 61], 39: [50, 55], 40: [45, 50], 41: [35, 39],
    42: [25, 28], 43: [15, 17], 44: [5, 6],
  };
  if (age <= 17 || age >= 45) return [0, 0];
  if (age >= 20 && age <= 29) return [100, 110];
  return t[age];
}

// Education levels. tr: the skill transferability group ('none' | 'one' = one year or longer | 'top' = two or more, master's, PhD).
export const EDUCATION: { id: string; label: string; core: Pair; spouse: number; tr: 'none' | 'one' | 'top'; canadaStudy: number }[] = [
  { id: 'none', label: 'Less than secondary school (high school)', core: [0, 0], spouse: 0, tr: 'none', canadaStudy: 0 },
  { id: 'sec', label: 'Secondary diploma (high school graduation)', core: [28, 30], spouse: 2, tr: 'none', canadaStudy: 0 },
  { id: 'one', label: 'One-year degree, diploma or certificate', core: [84, 90], spouse: 6, tr: 'one', canadaStudy: 15 },
  { id: 'two', label: 'Two-year program', core: [91, 98], spouse: 7, tr: 'one', canadaStudy: 15 },
  { id: 'bach', label: "Bachelor's degree or a program of three or more years", core: [112, 120], spouse: 8, tr: 'one', canadaStudy: 30 },
  { id: 'multi', label: 'Two or more credentials, one of them three or more years', core: [119, 128], spouse: 9, tr: 'top', canadaStudy: 30 },
  { id: 'mast', label: "Master's degree, or professional degree to practise a licensed profession", core: [126, 135], spouse: 10, tr: 'top', canadaStudy: 30 },
  { id: 'phd', label: 'Doctoral degree (PhD)', core: [140, 150], spouse: 10, tr: 'top', canadaStudy: 30 },
];

/** First official language, per ability. CLB 0-3 = less than CLB 4. */
export function firstLang(clb: number): Pair {
  if (clb >= 10) return [32, 34];
  return ([[0, 0], [0, 0], [0, 0], [0, 0], [6, 6], [6, 6], [8, 9], [16, 17], [22, 23], [29, 31]] as Pair[])[Math.max(0, clb)];
}
/** Second official language, per ability (same both ways; total capped 22 with spouse, 24 without). */
export function secondLang(clb: number): number { return clb >= 9 ? 6 : clb >= 7 ? 3 : clb >= 5 ? 1 : 0; }
export const SECOND_CAP: Pair = [22, 24];

/** Canadian work experience, length (years 0-5, 5 = five or more). */
export const CDN_WORK: Pair[] = [[0, 0], [35, 40], [46, 53], [56, 64], [63, 72], [70, 80]];
/** Extra points for 12 months or more of high-wage Canadian experience, added to length points. */
export const HIGH_WAGE_WORK: Record<string, number> = { none: 0, '1.3': 20, '1.5': 40, '2': 70 };
/** High-wage job offer (same with or without a spouse). */
export const JOB_OFFER: Record<string, number> = { none: 0, '1.3': 50, '1.5': 70, '2': 100 };
export const LMI_CAP = 150;

/** Spouse or partner factors. */
export function spouseLang(clb: number): number { return clb >= 9 ? 5 : clb >= 7 ? 3 : clb >= 5 ? 1 : 0; }
export const SPOUSE_WORK = [0, 5, 7, 8, 9, 10];

export const TRANSFER_CAP = 100;
export const ADDITIONAL = { sibling: 15, frenchOnly: 25, frenchPlusEnglish: 50, studyShort: 15, studyLong: 30, nomination: 600 };
export const ADDITIONAL_CAP = 600;

export type Input = {
  spouse: boolean; // a spouse or partner who is coming with you and is not a Canadian citizen or PR
  age: number;
  edu: string;
  firstIsFrench: boolean;
  first: number[]; // CLB for reading, writing, speaking, listening
  second: number[] | null;
  cdnYears: number; // 0-5
  highWage: string; // none | 1.3 | 1.5 | 2
  offer: string; // none | 1.3 | 1.5 | 2
  foreignYears: number; // 0, 1 (1 or 2 years), 3 (3 or more)
  certificate: boolean;
  spouseEdu: string; spouseLang: number[] | null; spouseYears: number;
  sibling: boolean; study: string; // none | short | long
  nomination: boolean;
};

export type Score = {
  age: number; edu: number; first: number; second: number; cdnWork: number; offer: number; lmi: number; core: number;
  sEdu: number; sLang: number; sWork: number; spouse: number;
  tEduLang: number; tEduWork: number; tEdu: number; tForLang: number; tForWork: number; tFor: number; tCert: number; transfer: number;
  aSibling: number; aFrench: number; aStudy: number; aNom: number; additional: number;
  total: number;
};

export function score(i: Input): Score {
  const k = i.spouse ? 0 : 1;
  const e = EDUCATION.find((x) => x.id === i.edu) ?? EDUCATION[0];
  const age = agePoints(i.age)[k];
  const edu = e.core[k];
  const first = i.first.reduce((s, c) => s + firstLang(c)[k], 0);
  const second = i.second ? Math.min(SECOND_CAP[k], i.second.reduce((s, c) => s + secondLang(c), 0)) : 0;
  const yrs = Math.max(0, Math.min(5, i.cdnYears));
  const cdnWork = CDN_WORK[yrs][k] + (yrs >= 1 ? HIGH_WAGE_WORK[i.highWage] ?? 0 : 0);
  const offer = JOB_OFFER[i.offer] ?? 0;
  const lmi = Math.min(LMI_CAP, Math.max(cdnWork, offer));
  const core = age + edu + first + second + lmi;

  let sEdu = 0, sLang = 0, sWork = 0;
  if (i.spouse) {
    sEdu = (EDUCATION.find((x) => x.id === i.spouseEdu) ?? EDUCATION[0]).spouse;
    sLang = i.spouseLang ? i.spouseLang.reduce((s, c) => s + spouseLang(c), 0) : 0;
    sWork = SPOUSE_WORK[Math.max(0, Math.min(5, i.spouseYears))];
  }
  const spouse = sEdu + sLang + sWork;

  // Skill transferability uses the lowest first-language score and Canadian work length only.
  const minClb = Math.min(...i.first);
  const lang9 = minClb >= 9, lang7 = minClb >= 7;
  const pick = (g: 'none' | 'one' | 'top', hi: boolean, lo: boolean) => (g === 'none' ? 0 : g === 'one' ? (hi ? 25 : lo ? 13 : 0) : hi ? 50 : lo ? 25 : 0);
  const tEduLang = pick(e.tr, lang9, lang7);
  const tEduWork = pick(e.tr, yrs >= 2, yrs >= 1);
  const tEdu = Math.min(50, tEduLang + tEduWork);
  const fg = i.foreignYears >= 3 ? 'top' : i.foreignYears >= 1 ? 'one' : 'none';
  const tForLang = pick(fg, lang9, lang7);
  const tForWork = pick(fg, yrs >= 2, yrs >= 1);
  const tFor = Math.min(50, tForLang + tForWork);
  const tCert = i.certificate ? (minClb >= 7 ? 50 : minClb >= 5 ? 25 : 0) : 0;
  const transfer = Math.min(TRANSFER_CAP, tEdu + tFor + tCert);

  const french = i.firstIsFrench ? i.first : i.second;
  const english = i.firstIsFrench ? i.second : i.first;
  let aFrench = 0;
  if (french && Math.min(...french) >= 7) aFrench = english && Math.min(...english) >= 5 ? ADDITIONAL.frenchPlusEnglish : ADDITIONAL.frenchOnly;
  const aSibling = i.sibling ? ADDITIONAL.sibling : 0;
  const aStudy = i.study === 'long' ? ADDITIONAL.studyLong : i.study === 'short' ? ADDITIONAL.studyShort : 0;
  const aNom = i.nomination ? ADDITIONAL.nomination : 0;
  const additional = Math.min(ADDITIONAL_CAP, aSibling + aFrench + aStudy + aNom);

  return { age, edu, first, second, cdnWork, offer, lmi, core, sEdu, sLang, sWork, spouse, tEduLang, tEduWork, tEdu, tForLang, tForWork, tFor, tCert, transfer, aSibling, aFrench, aStudy, aNom, additional, total: core + spouse + transfer + additional };
}
