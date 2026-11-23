// CUET General Test: clocks and calendars. Original questions for fibub.
import { pick, int, choose, fmt, shuffleOpts, steps } from './_cuet.js';

const T = { exams: ['cuet'], format: 'single' };
const mcq = (id, level, sub, q, options, answer, sol, trap) => ({ id, type: 'mcq', level, sub, q, options, answer, sol, ...(trap ? { trap } : {}), ...T });
const mc = (id, level, sub, q, opts, sol, trap) => {
  const k = parseInt(id.slice(-3), 10) % 4; const o = opts.slice(1); o.splice(k, 0, opts[0]);
  return mcq(id, level, sub, q, o, k, sol, trap);
};
const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const pad = (n) => String(n).padStart(2, '0');
const leap = (y) => (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
const mdays = (y) => [31, leap(y) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const clock12 = (mins) => { const m = ((mins % 1440) + 1440) % 1440, h = Math.floor(m / 60), mm = m % 60; return `${h % 12 === 0 ? 12 : h % 12}:${pad(mm)} ${h < 12 ? 'AM' : 'PM'}`; };

export default {
  topic: 'clocks-calendars',
  items: [
    mc('cc-001', 2, 'angle', 'What is the angle between the hands of a clock at 9:30?', ['105°', '90°', '120°', '135°'], 'Hour hand: 9 × 30 + 30 × 0.5 = 285°. Minute hand: 30 × 6 = 180°. Difference = <b>105°</b>. Shortcut: |30H − 5.5M| = |270 − 165| = 105.', 'The hour hand is not exactly on the 9: it has moved half way to 10.'),
    mc('cc-002', 2, 'angle', 'What is the angle between the hands of a clock at 4:20?', ['10°', '20°', '0°', '30°'], '|30 × 4 − 5.5 × 20| = |120 − 110| = <b>10°</b>.'),
    mc('cc-003', 2, 'angle', 'Find the angle between the hands at 2:40.', ['160°', '200°', '140°', '120°'], '|30 × 2 − 5.5 × 40| = |60 − 220| = 160°. It is less than 180°, so the angle is <b>160°</b>.'),
    mc('cc-004', 2, 'angle', 'What is the angle between the hands of a clock at 12:30?', ['165°', '180°', '150°', '175°'], 'Treat 12 as 0: |0 − 5.5 × 30| = <b>165°</b>.', 'It is not 180°: by 12:30 the hour hand has also moved half way to the 1.'),
    mc('cc-005', 3, 'angle', 'What is the angle between the hands of a clock at 7:15?', ['127.5°', '120°', '112.5°', '135°'], '|30 × 7 − 5.5 × 15| = |210 − 82.5| = <b>127.5°</b>.'),
    mc('cc-006', 3, 'angle', 'What is the smaller angle between the hands of a clock at 10:10?', ['115°', '245°', '125°', '105°'], '|30 × 10 − 5.5 × 10| = |300 − 55| = 245°. The smaller angle is 360 − 245 = <b>115°</b>.', 'The question asks for the smaller angle, which is always 180° or less.'),
    mc('cc-007', 1, 'angle', 'What is the angle between the hands of a clock at 5:00?', ['150°', '120°', '180°', '135°'], 'At exact hours the angle is 30 × (hour gap from 12): 5 × 30 = <b>150°</b>.'),
    mc('cc-008', 2, 'overlap', 'How many times do the two hands of a clock coincide in 12 hours?', ['11', '12', '10', '13'], 'They coincide once each hour, except that the 11 o\'clock and 12 o\'clock meetings are the same one at 12:00. So <b>11</b> times.', 'Answering 12 forgets that the 11th to 12th hour meeting falls exactly on 12:00.'),
    mc('cc-009', 3, 'right angle', 'How many times are the hands of a clock at right angles to each other in 24 hours?', ['44', '48', '24', '46'], 'In 12 hours the hands are at right angles 22 times (2 per hour, less 2 shared). In 24 hours: <b>44</b>.'),
    mc('cc-010', 3, 'overlap', 'At what time between 4 and 5 do the hands of a clock coincide?', ['21 9/11 min past 4', '20 min past 4', '22 min past 4', '21 min past 4'], 'Minutes past H: M = 60H/11 = 240/11 = 21 9/11. So at <b>21 9/11 minutes past 4</b>.'),
    mc('cc-011', 2, 'faulty clock', 'A clock that loses 3 minutes every hour is set right at 6 AM. What time will it show when the true time is 12 noon?', ['11:42 AM', '11:48 AM', '11:57 AM', '12:18 PM'], 'From 6 AM to noon is 6 hours. The clock loses 6 × 3 = 18 minutes. It shows 12:00 − 0:18 = <b>11:42 AM</b>.'),
    mc('cc-012', 3, 'faulty clock', 'A clock gains 5 minutes every hour and is correct at 9 AM. When it shows 3:30 PM, what is the true time?', ['3:00 PM', '3:30 PM', '2:30 PM', '3:15 PM'], 'The clock has run 6.5 hours = 390 minutes. In each true hour it shows 65 minutes. True time elapsed = 390 ÷ 65 = 6 hours, so it is 9 AM + 6 h = <b>3:00 PM</b>.', 'Subtracting 5 × 6.5 = 32.5 minutes gives a wrong answer, because the gain is per true hour, not per hour shown.'),
    mc('cc-013', 2, 'mirror', 'The image of a clock in a mirror shows 3:15. What is the actual time?', ['8:45', '9:15', '8:15', '9:45'], 'Actual time = 11:60 − 3:15 = <b>8:45</b>.'),
    mc('cc-014', 2, 'mirror', 'In a mirror, a clock appears to show 4:40. What is the actual time?', ['7:20', '8:20', '7:40', '6:20'], '11:60 − 4:40 = <b>7:20</b>.'),
    mc('cc-015', 2, 'mirror', 'A clock seen in a mirror shows 10:20. What is the real time?', ['1:40', '2:40', '1:20', '2:20'], '11:60 − 10:20 = <b>1:40</b>.'),
    mc('cc-016', 1, 'hand speed', 'By how many degrees does the hour hand move in 20 minutes?', ['10°', '20°', '5°', '30°'], 'The hour hand moves 30° per hour, that is 0.5° per minute. In 20 minutes: 20 × 0.5 = <b>10°</b>.'),
    mc('cc-017', 1, 'hand speed', 'By how many degrees does the minute hand move in 25 minutes?', ['150°', '125°', '180°', '120°'], 'The minute hand moves 6° per minute: 25 × 6 = <b>150°</b>.'),
    mc('cc-018', 2, 'striking', 'A clock strikes once at 1 o\'clock, twice at 2 o\'clock and so on up to 12 times at 12 o\'clock. How many strokes does it make in 12 hours?', ['78', '72', '66', '156'], 'The total is 1 + 2 + 3 + ... + 12 = 12 × 13 ÷ 2 = <b>78</b>.', 'In 24 hours it would be 156; the question asks for 12.'),
    mc('cc-019', 3, 'striking', 'A clock takes 10 seconds to strike 6 times. How long does it take to strike 10 times?', ['18 seconds', '16.7 seconds', '20 seconds', '15 seconds'], '6 strokes have 5 gaps in them, so each gap is 10 ÷ 5 = 2 s. 10 strokes have 9 gaps: 9 × 2 = <b>18 s</b>.', 'Count gaps, not strokes: the number of gaps is one less than the strokes.'),
    mc('cc-020', 2, 'overlap', 'How many times do the hands of a clock coincide in a full day of 24 hours?', ['22', '24', '23', '21'], 'They coincide 11 times in 12 hours, so <b>22</b> times in 24 hours.'),
    mc('cc-021', 3, 'day of week', 'On which day of the week did 15 August 1947 fall?', ['Friday', 'Thursday', 'Saturday', 'Wednesday'], '1946 completed years: 1600 → 0, 300 → 1, 46 years → 46 + 11 leap years = 57 → 1 odd day. Total = 2 (Tuesday for 31 Dec 1946). Days from 1 Jan to 15 Aug 1947: 212 + 15 = 227 → 227 mod 7 = 3. 2 + 3 = 5 = <b>Friday</b>.'),
    mc('cc-022', 2, 'day of week', 'If 26 January 1950 was a Thursday, which day was 26 January 1951?', ['Friday', 'Thursday', 'Saturday', 'Wednesday'], '1950 was an ordinary year of 365 days = 52 weeks + 1 day. The same date moves one day forward: Thursday + 1 = <b>Friday</b>.'),
    mc('cc-023', 1, 'counting days', 'Today is Wednesday. What day will it be after 100 days?', ['Friday', 'Thursday', 'Saturday', 'Sunday'], '100 = 14 × 7 + 2. The 14 full weeks change nothing; 2 days after Wednesday is <b>Friday</b>.'),
    mc('cc-024', 2, 'counting days', 'Today is Monday. What day was it 61 days ago?', ['Wednesday', 'Thursday', 'Tuesday', 'Friday'], '61 = 8 × 7 + 5. Going back 5 days from Monday: Sun, Sat, Fri, Thu, <b>Wed</b>.', 'Going forward by 5 (Saturday) instead of back is the usual mistake.'),
    mc('cc-025', 1, 'odd days', 'How many odd days are there in 100 years?', ['5', '4', '6', '3'], '100 years have 76 ordinary years and 24 leap years: 76 × 1 + 24 × 2 = 124 odd days, and 124 = 17 × 7 + 5. So <b>5</b> odd days.'),
    mc('cc-026', 1, 'leap years', 'Which of these is a leap year?', ['2000', '1900', '2100', '2200'], 'A century year is a leap year only if divisible by 400. 2000 ÷ 400 = 5, so <b>2000</b> is a leap year; 1900, 2100 and 2200 are not.', 'Century years are special: divisible by 4 is not enough.'),
    mc('cc-027', 3, 'repeat calendar', 'The calendar of 2023 will next be the same as that of which year?', ['2034', '2029', '2030', '2033'], 'Jan 1 moves one day forward each ordinary year and two each leap year. From 2023 to 2034 there are 11 years, and 3 of them are leap years (2024, 2028, 2032), so the start day moves 11 + 3 = 14 days = exactly 2 weeks. 2034 is also an ordinary year. So <b>2034</b>.', 'A year that starts on the same day is not enough: it must also match in leap or ordinary type.'),
    mc('cc-028', 2, 'month layout', 'A month with 31 days starts on a Friday. Which days of the week occur five times?', ['Friday, Saturday, Sunday', 'Thursday, Friday, Saturday', 'Saturday, Sunday, Monday', 'Friday only'], '31 days = 4 weeks + 3 extra days. The extra days are the first three days of the month: Friday, Saturday, Sunday. These occur <b>five times</b>.'),
    mc('cc-029', 2, 'day of week', 'If 1 January 2000 was a Saturday, which day was 1 January 2001?', ['Monday', 'Sunday', 'Tuesday', 'Saturday'], '2000 was a leap year with 366 days = 52 weeks + 2 days. Saturday + 2 = <b>Monday</b>.', 'Adding only 1 day forgets that 2000 was a leap year.'),
    mc('cc-030', 2, 'counting days', 'How many days are there from 12 March to 25 April, counting both of these days?', ['45', '44', '46', '43'], 'March 12 to March 31 is 20 days (31 − 12 + 1). April 1 to 25 is 25 days. Total = <b>45</b>.'),
    mc('cc-031', 2, 'month layout', 'If the 5th of a month is a Tuesday, what day is the 25th?', ['Monday', 'Tuesday', 'Sunday', 'Wednesday'], 'The 25th is 20 days after the 5th. 20 = 2 × 7 + 6, so 6 days after Tuesday is <b>Monday</b>.'),
    mc('cc-032', 1, 'month layout', 'In a certain month the 2nd Saturday falls on the 13th. What is the date of the 4th Saturday?', ['27', '20', '26', '28'], 'Saturdays are a week apart: 13, 20, 27. The 4th Saturday is the <b>27th</b>.'),
    mc('cc-033', 1, 'month layout', 'In a certain month the 3rd Monday falls on the 17th. What is the date of the 1st Monday?', ['3', '1', '10', '2'], 'Go back two weeks: 17 − 14 = <b>3</b>.'),
    mc('cc-034', 2, 'relative days', 'The day before the day after tomorrow is a Friday. What day is it today?', ['Thursday', 'Wednesday', 'Friday', 'Tuesday'], 'The day after tomorrow is today + 2. The day before that is today + 1. So tomorrow is Friday and today is <b>Thursday</b>.'),
    mc('cc-035', 2, 'relative days', 'If yesterday was Sunday, what day will it be 3 days after tomorrow?', ['Friday', 'Thursday', 'Saturday', 'Wednesday'], 'Yesterday was Sunday, so today is Monday and tomorrow is Tuesday. Three days after Tuesday is <b>Friday</b>.'),
    mc('cc-036', 1, 'month layout', 'If the 1st of a month is a Saturday, which day is the 29th?', ['Saturday', 'Sunday', 'Friday', 'Monday'], 'The 29th is 28 days (exactly 4 weeks) after the 1st, so it is also a <b>Saturday</b>.'),
  ],
  gens: [
    { id: 'cc-g01', type: 'mcq', level: 2, sub: 'angle', ...T,
      make(rng) {
        const H = int(rng, 1, 11), M = 5 * int(rng, 0, 11);
        const ang = (h, m) => { const d = Math.abs(30 * h - 5.5 * m); return d > 180 ? 360 - d : d; };
        const a = ang(H, M);
        const { options, answer } = shuffleOpts(rng, a, [ang(H, M + 5 > 55 ? 0 : M) === a ? a + 15 : Math.abs(30 * H - 6 * M) > 180 ? 360 - Math.abs(30 * H - 6 * M) : Math.abs(30 * H - 6 * M), a + 10, Math.abs(a - 15)], (v) => `${fmt(v, 1)}°`);
        return { q: `What is the (smaller) angle between the hands of a clock at ${H}:${pad(M)}?`, options, answer, H, M,
          sol: steps(`Hour hand: ${H} × 30 + ${M} × 0.5 = ${fmt(H * 30 + M * 0.5, 1)}°. Minute hand: ${M} × 6 = ${M * 6}°.`, `Difference = ${fmt(Math.abs(H * 30 + M * 0.5 - M * 6), 1)}°${Math.abs(H * 30 + M * 0.5 - M * 6) > 180 ? `, which is over 180°, so take 360° − that = <b>${fmt(a, 1)}°</b>` : ` = <b>${fmt(a, 1)}°</b>`}.`),
          trap: 'The hour hand moves 0.5° each minute; ignoring that gives a wrong answer.' };
      },
      verify: (p) => { const d = Math.abs(p.H * 30 + p.M * 0.5 - p.M * 6), v = d > 180 ? 360 - d : d; return p.options.indexOf(`${fmt(v, 1)}°`); } },
    { id: 'cc-g02', type: 'mcq', level: 3, sub: 'day of week', ...T,
      make(rng) {
        const Y = int(rng, 1951, 2049), mo = int(rng, 1, 12), d = int(rng, 1, 28);
        const yrs = Y - 1, c = Math.floor(yrs / 100), r = yrs % 100, oc = [0, 5, 3, 1][c % 4], or = (r + Math.floor(r / 4)) % 7;
        let days = d; for (let i = 0; i < mo - 1; i++) days += mdays(Y)[i];
        const tot = (oc + or + days) % 7;
        const { options, answer } = shuffleOpts(rng, DAYS[tot], [DAYS[(tot + 1) % 7], DAYS[(tot + 6) % 7], DAYS[(tot + 2) % 7]], (v) => v);
        return { q: `On which day of the week did ${d} ${MONTHS[mo - 1]} ${Y} fall?`, options, answer, Y, mo, d,
          sol: steps(`Completed years before ${Y}: ${yrs}. ${c * 100} years give ${oc} odd day${oc === 1 ? '' : 's'} (100 → 5, 200 → 3, 300 → 1, 400 → 0 and repeat).`, `The remaining ${r} years: ${r} + ${Math.floor(r / 4)} leap years = ${r + Math.floor(r / 4)}, and ${r + Math.floor(r / 4)} mod 7 = ${or}.`, `Days from 1 January to ${d} ${MONTHS[mo - 1]} ${Y}: ${days}, and ${days} mod 7 = ${days % 7}.`, `Odd days: ${oc} + ${or} + ${days % 7} = ${oc + or + (days % 7)} → mod 7 = ${tot}. (0 = Sunday, 1 = Monday ...) So it was a <b>${DAYS[tot]}</b>.`),
          trap: 'In a leap year February has 29 days, so dates after February are one day later in the year count.' };
      },
      verify: (p) => p.options.indexOf(DAYS[new Date(Date.UTC(p.Y, p.mo - 1, p.d)).getUTCDay()]) },
    { id: 'cc-g03', type: 'mcq', level: 2, sub: 'counting days', ...T,
      make(rng) {
        const s = int(rng, 0, 6), n = int(rng, 20, 300), after = rng() < 0.6;
        const t = (((after ? s + n : s - n) % 7) + 7) % 7;
        const { options, answer } = shuffleOpts(rng, DAYS[t], [DAYS[(t + 1) % 7], DAYS[(t + 6) % 7], DAYS[(t + 2) % 7]], (v) => v);
        return { q: `Today is ${DAYS[s]}. What day will it be ${after ? 'after' : 'was it'} ${n} days${after ? '' : ' ago'}?`, options, answer, s, n, after,
          sol: steps(`${n} ÷ 7 leaves remainder ${n % 7} (${n} = ${Math.floor(n / 7)} × 7 + ${n % 7}); whole weeks change nothing.`, `${n % 7} day${n % 7 === 1 ? '' : 's'} ${after ? 'forward' : 'back'} from ${DAYS[s]} is <b>${DAYS[t]}</b>.`),
          trap: 'Going back, count backwards from today, not forwards.' };
      },
      verify: (p) => { let d = p.s; for (let i = 0; i < p.n; i++) d = (d + (p.after ? 1 : 6)) % 7; return p.options.indexOf(DAYS[d]); } },
    { id: 'cc-g04', type: 'mcq', level: 3, sub: 'faulty clock', ...T,
      make(rng) {
        const k = int(rng, 2, 6), gain = rng() < 0.5, s = int(rng, 6, 9), t = int(rng, 4, 9);
        const shown = (s + t) * 60 + (gain ? 1 : -1) * k * t;
        const { options, answer } = shuffleOpts(rng, clock12(shown), [clock12(shown + (gain ? -2 : 2) * k * t), clock12(shown + k), clock12(shown - k)], (v) => v);
        return { q: `A clock that ${gain ? 'gains' : 'loses'} ${k} minutes every hour is set right at ${s}:00 AM. What time will it show when the true time is ${clock12((s + t) * 60)}?`, options, answer, s, t, k, gain,
          sol: steps(`True time passed: ${t} hours.`, `The clock ${gain ? 'gains' : 'loses'} ${k} × ${t} = ${k * t} minutes in that time.`, `It shows ${clock12((s + t) * 60)} ${gain ? '+' : '−'} ${k * t} min = <b>${clock12(shown)}</b>.`),
          trap: `A clock that ${gain ? 'gains' : 'loses'} time is ${gain ? 'ahead of' : 'behind'} the true time, so ${gain ? 'add' : 'subtract'} the error.` };
      },
      verify: (p) => p.options.indexOf(clock12((p.s + p.t) * 60 + (p.gain ? p.k * p.t : -p.k * p.t))) },
    { id: 'cc-g05', type: 'mcq', level: 2, sub: 'mirror', ...T,
      make(rng) {
        const H = int(rng, 1, 10), M = 5 * int(rng, 1, 11), a = 720 - (60 * H + M), h = Math.floor(a / 60), m = a % 60;
        const f = (x, y) => `${x}:${pad(y)}`;
        const { options, answer } = shuffleOpts(rng, f(h, m), [f(12 - H, M), f(11 - H, M), f(12 - H, 60 - M >= 60 ? 0 : 60 - M), f(h % 12 + 1, m), f(h === 1 ? 12 : h - 1, m), f(H, M), f(h, (m + 30) % 60)], (v) => v);
        return { q: `The image of a clock in a mirror shows ${f(H, M)}. What is the actual time?`, options, answer, H, M,
          sol: steps('Subtract the shown time from 11:60.', `11:60 − ${f(H, M)} = <b>${f(h, m)}</b>.`), trap: 'Subtracting from 12:00 instead of 11:60 is off by one hour when the minutes are not zero.' };
      },
      verify: (p) => { const a = 720 - (60 * p.H + p.M); return p.options.indexOf(`${Math.floor(a / 60)}:${pad(a % 60)}`); } },
  ],
};
