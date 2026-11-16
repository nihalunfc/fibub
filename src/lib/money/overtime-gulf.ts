// Overtime presets for Gulf countries (used only by #T810 Overtime). Each figure was read on the official page in `url` (checked 2026-11-16).
// Qatar, Bahrain and Kuwait are left out: their labour law pages could not be read on an official site that day.
import type { OtRule } from './overtime';
export type LawRule = OtRule & { law: string; url: string };
const CHECK = ' Estimate, not legal advice; check the official source.';
export const GULF_RULES: LawRule[] = [
  { id: 'om', label: 'Oman', daily: 8, weekly: 40, dailyDouble: 0, mult: 1.25, mult2: 1.5, mode: 'greater',
    note: 'What the law sets: up to 8 hours a day and 40 a week; overtime pays the basic wage for the hour plus at least 25% by day and at least 50% at night (9 pm to 5 am), with normal and extra hours together at most 12 a day. Work on a weekly rest day or public holiday pays an extra 100% of the daily basic wage (or a day off instead). The premium is on the basic wage, so if yours is less than your full pay, type the basic hourly rate. For night hours, set Overtime pays to 1.5.' + CHECK,
    law: 'Oman Labour Law (Royal Decree 53/2023), Art. 70 and 71', url: 'https://mol.gov.om/Laborlaw', src: 'Oman Labour Law (Royal Decree 53/2023), Art. 70 and 71, Ministry of Labour (checked 2026-11-16)', confirmed: true },
  { id: 'sa', label: 'Saudi Arabia', daily: 8, weekly: 48, dailyDouble: 0, mult: 1.5, mult2: 2, mode: 'greater',
    note: 'What the law sets: up to 8 hours a day and 48 a week; each overtime hour pays the hourly wage plus 50% of the basic wage. If your basic wage is less than your full pay, the extra is smaller: type 1 + 0.5 x basic / full pay in Overtime pays (for example 1.4 when basic is 80% of full pay).' + CHECK,
    law: 'Saudi Labor Law, Art. 98 and 107 (Part Six), as summarised on my.gov.sa', url: 'https://my.gov.sa/en/content/employment', src: 'Saudi Labor Law, Part Six (Art. 98 and 107), as summarised on the national portal my.gov.sa (checked 2026-11-16)', confirmed: true },
  { id: 'ae', label: 'United Arab Emirates', daily: 8, weekly: 48, dailyDouble: 0, mult: 1.25, mult2: 1.5, mode: 'greater',
    note: 'What the law sets: up to 8 hours a day and 48 a week, and at most 2 overtime hours a day; overtime pays the normal-hours wage (based on the basic salary) plus at least 25%, or 50% between 10 pm and 4 am (not for shift workers). Work on a rest day gives another day off or the normal wage plus 50%. The premium is on the basic salary, so if yours is less than your full pay, type the basic hourly rate. For night or rest-day hours, set Overtime pays to 1.5.' + CHECK,
    law: 'UAE Federal Decree-Law No. 33 of 2021, Art. 17 and 19, as summarised on u.ae', url: 'https://u.ae/en/information-and-services/jobs/Sector-of-employment/employment-in-the-private-sector/working-hours', src: 'UAE Federal Decree-Law No. 33 of 2021, Art. 17 and 19, as summarised on the official portal u.ae (checked 2026-11-16)', confirmed: true },
];
