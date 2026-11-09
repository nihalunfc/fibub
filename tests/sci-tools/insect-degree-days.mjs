// #319 insect degree-days. Single sine values checked against an independent Python implementation that
// integrates the sine-wave day numerically (numpy, 4 million steps per day; scipy.integrate.quad agrees).
import { dailyDD, accumulate, predictDate, readDate } from '../../src/lib/sci/degdays.ts';

export default async (check) => {
  const near = (name, a, b, tol) => check(`degree-days: ${name} (${a} vs ${b})`, Math.abs(a - b) <= tol);
  const sine = [
    [10, 25, 10, null, 'horizontal', 7.5], [5, 25, 10, null, 'horizontal', 6.089978],
    [15, 35, 10, 30, 'horizontal', 13.910022], [15, 35, 10, 30, 'vertical', 7.243352],
    [2, 8, 10, null, 'horizontal', 0], [20, 40, 12, 32, 'horizontal', 15.753024],
    [20, 40, 12, 32, 'vertical', 7.034904], [32, 40, 10, 30, 'horizontal', 20], [32, 40, 10, 30, 'vertical', 0],
    [50, 80, 50, 88, 'horizontal', 15], [45, 95, 50, 88, 'vertical', 10.272679],
  ];
  for (const [a, b, L, U, c, want] of sine) near(`sine ${a}–${b}, L ${L}, U ${U ?? 'none'} ${c}`, dailyDD(a, b, L, U, 'sine', c), want, 2e-5);
  near('average 10–25 above 10', dailyDD(10, 25, 10, null, 'average'), 7.5, 1e-12);
  near('average all below threshold', dailyDD(2, 12, 10, null, 'average'), 0, 1e-12);
  near('average, horizontal cap at 30', dailyDD(20, 36, 10, 30, 'average', 'horizontal'), 15, 1e-12);
  near('average, vertical cutoff (mean 31 > 30)', dailyDD(24, 38, 10, 30, 'average', 'vertical'), 0, 1e-12);
  near('min and max swapped', dailyDD(25, 5, 10, null, 'sine'), 6.089978, 2e-5);
  // The page's made-up 75-day spring, lower 10 °C, upper 30 °C (Python: same numerical integration).
  const lines = EXAMPLE.trim().split('\n').slice(1);
  const days = lines.map((l) => { const [date, a, b] = l.split('\t'); return { date, tmin: +a, tmax: +b }; });
  const sh = accumulate(days, 10, 30, 'sine', 'horizontal');
  near('example sine horizontal total', sh.at(-1).cum, 533.5748, 1e-3);
  near('example sine vertical total', accumulate(days, 10, 30, 'sine', 'vertical').at(-1).cum, 523.0894, 1e-3);
  near('example average total', accumulate(days, 10, 30, 'average', 'horizontal').at(-1).cum, 503.0, 1e-9);
  check('degree-days: example reaches 250 DD on 2026-05-21 (sine)', predictDate(sh, 250).date === '2026-05-21');
  check('degree-days: example reaches 250 DD on 2026-05-24 (average)', predictDate(accumulate(days, 10, 30, 'average', 'horizontal'), 250).date === '2026-05-24');
  const bf = accumulate(days, 10, 30, 'sine', 'horizontal', '2026-04-15');
  near('from a biofix on 15 April', bf.at(-1).cum, 502.479, 1e-3);
  check('degree-days: biofix run reaches 250 DD on 2026-05-24', predictDate(bf, 250).date === '2026-05-24');
  const p = predictDate(sh, 700);
  check(`degree-days: 700 DD projected 13 days after 14 June (${p.date}, ${p.perDay})`, !p.reached && p.daysAhead === 13 && p.date === '2026-06-27' && Math.abs(p.perDay - 13.042857) < 1e-5);
  check('degree-days: dates read', readDate('2026-04-01') === '2026-04-01' && readDate('1/4/2026') === '2026-04-01' && readDate('4/1/2026', true) === '2026-04-01' && readDate('31/2/2026') === '');
};

const EXAMPLE = `date	min	max
2026-04-01	4.0	16.7
2026-04-02	3.6	14.0
2026-04-03	3.5	13.9
2026-04-04	4.7	19.9
2026-04-05	3.8	15.2
2026-04-06	5.9	17.8
2026-04-07	5.3	14.8
2026-04-08	5.3	19.1
2026-04-09	2.8	16.4
2026-04-10	1.9	14.5
2026-04-11	2.2	17.3
2026-04-12	3.5	18.8
2026-04-13	6.6	17.8
2026-04-14	1.4	17.1
2026-04-15	6.6	18.9
2026-04-16	3.8	17.6
2026-04-17	5.1	17.0
2026-04-18	9.3	17.2
2026-04-19	7.3	21.6
2026-04-20	6.4	19.3
2026-04-21	8.0	19.9
2026-04-22	5.5	20.2
2026-04-23	10.9	16.3
2026-04-24	10.1	20.6
2026-04-25	7.3	25.5
2026-04-26	10.3	17.7
2026-04-27	9.1	22.4
2026-04-28	8.7	22.8
2026-04-29	9.2	23.0
2026-04-30	12.4	19.8
2026-05-01	10.1	20.5
2026-05-02	10.1	18.9
2026-05-03	8.9	21.6
2026-05-04	12.0	25.1
2026-05-05	7.8	20.4
2026-05-06	11.9	17.6
2026-05-07	9.9	22.6
2026-05-08	13.5	24.7
2026-05-09	10.5	22.3
2026-05-10	10.9	27.2
2026-05-11	10.7	22.8
2026-05-12	12.5	23.5
2026-05-13	11.6	21.2
2026-05-14	12.1	23.0
2026-05-15	14.7	26.0
2026-05-16	12.5	26.2
2026-05-17	12.0	27.3
2026-05-18	12.9	26.4
2026-05-19	10.5	25.9
2026-05-20	9.9	20.2
2026-05-21	12.9	23.2
2026-05-22	14.0	31.3
2026-05-23	12.2	24.3
2026-05-24	14.4	27.3
2026-05-25	13.9	25.7
2026-05-26	15.8	27.7
2026-05-27	12.5	26.4
2026-05-28	14.9	24.1
2026-05-29	15.5	24.8
2026-05-30	17.1	27.6
2026-05-31	15.5	25.9
2026-06-01	15.3	22.5
2026-06-02	13.5	28.6
2026-06-03	11.7	30.0
2026-06-04	12.6	30.0
2026-06-05	14.6	30.2
2026-06-06	16.7	24.6
2026-06-07	19.2	32.3
2026-06-08	16.7	28.2
2026-06-09	16.7	26.6
2026-06-10	19.4	27.9
2026-06-11	17.3	27.4
2026-06-12	16.4	26.4
2026-06-13	20.3	29.4
2026-06-14	19.9	30.0`;
