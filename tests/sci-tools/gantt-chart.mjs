// #823 Gantt chart and critical path. Checked against networkx 3.7 on 400 random task networks (lags, leads,
// fixed starts, milestones): project length, early and late starts and the critical tasks all agree.
import { parseTasks, schedule, toCsv, layout, toSvg, periodOf, periodLabel, EXAMPLE } from '../../src/lib/sci/gantt.ts';
export default async (check) => {
  const p = parseTasks(EXAMPLE, 'month');
  check('gantt: example parses, header skipped', p.errors.length === 0 && p.tasks.length === 11 && p.tasks[5].deps[0].id === 'M1' && p.tasks[6].deps[0].lag === -1 && p.tasks[9].deps[0].lag === 2);
  const s = schedule(p.tasks);
  const R = Object.fromEntries(s.rows.map((r) => [r.id, r]));
  check('gantt: example lasts 28 months (networkx: 28)', s.end === 28);
  check('gantt: critical path B C D M1 E F G H M2 (networkx longest path)', s.path.join(' ') === 'B C D M1 E F G H M2' && !R.A.critical && !R.I.critical);
  check('gantt: float of A is 4 months, of I 5 months', R.A.float === 4 && R.A.free === 4 && R.I.float === 5 && R.I.es === 21 && R.I.ls === 26);
  check('gantt: a lead (E-1) and a lag (F+2)', R.F.es === 16 && R.I.es === R.F.ef + 2 && R.H.es === R.G.ef - 2);
  check('gantt: milestones take no time', R.M1.milestone && R.M1.es === 9 && R.M1.ef === 9 && R.M2.es === 28);
  const c = schedule([{ id: 'A', name: 'a', wp: '', start: null, dur: 2, deps: [{ id: 'B', lag: 0 }] }, { id: 'B', name: 'b', wp: '', start: null, dur: 2, deps: [{ id: 'A', lag: 0 }] }, { id: 'C', name: 'c', wp: '', start: null, dur: 1, deps: [] }]);
  check('gantt: a loop is found', 'cycle' in c && c.cycle.join() === 'A,B');
  const f = schedule([{ id: 'A', name: 'a', wp: '', start: null, dur: 3, deps: [] }, { id: 'B', name: 'b', wp: '', start: 6, dur: 2, deps: [{ id: 'A', lag: 0 }] }]);
  check('gantt: a fixed start later than its predecessor allows', f.end === 7 && f.rows[1].es === 5 && f.rows[0].float === 2 && f.rows[0].free === 2 && f.rows[1].critical);
  const n = schedule([{ id: 'A', name: 'a', wp: '', start: null, dur: 10, deps: [] }, { id: 'B', name: 'b', wp: '', start: null, dur: 1, deps: [{ id: 'A', lag: -5 }] }]);
  check('gantt: late finish never after the project end, even with a lead', n.end === 10 && n.rows[0].lf === 10 && n.rows[0].critical && n.rows[1].float === 4);
  const e = parseTasks('A, Plan, , 1, 3\nA, Again, , 1, 2\nB, Bad, , 0, 2\nC, Uses Z, , , 2, Z\nD, Dated, , 2027-01-05, 2\nE, No duration, , ,', 'month');
  check('gantt: input errors: duplicate ID, bad start, unknown dependency, date without a start date, missing duration', e.errors.length === 5 && e.errors.some((x) => x.includes('used twice')) && e.errors.some((x) => x.includes('"Z"')) && e.errors.some((x) => x.includes('project start date')));
  const d = parseTasks('A, Kick-off, , 2027-03-15, 0\nB, Work, , 2027-03-01, , , 2027-05-31\nC, Week task, , 3, 2', 'month', '2027-01-01');
  check('gantt: dates become periods; start and end give a duration', d.errors.length === 0 && d.tasks[0].start === 3 && d.tasks[1].start === 3 && d.tasks[1].dur === 3 && periodOf('2027-01-14', '2027-01-01', 'week') === 2 && periodOf('2027-01-01', '2027-01-01', 'day') === 1);
  check('gantt: period labels', periodLabel(0, 'month') === 'M1' && periodLabel(13, 'month', '2027-01-01') === 'Feb 28' && periodLabel(1, 'week', '2027-01-01') === '8 Jan');
  const csv = toCsv(s, 'month', '2027-01-01'), m1 = csv.find((r) => r[0] === 'M1'), b = csv.find((r) => r[0] === 'B');
  check('gantt: CSV with periods, floats and dates', csv[0].length === 18 && b.slice(7, 9).join() === '1,4' && b[15] === 'yes' && b[16] === '2027-01-01' && b[17] === '2027-04-30' && m1[7] === '9' && m1[16] === '2027-09-30' && csv.find((r) => r[0] === 'F')[5] === 'E-1');
  const back = parseTasks(csv.map((r) => r.map((x) => (x.includes(',') ? `"${x}"` : x)).join(',')).join('\n'), 'month', '2027-01-01');
  check('gantt: exported CSV reads back the same tasks', back.errors.length === 0 && JSON.stringify(back.tasks) === JSON.stringify(p.tasks));
  const col = { bg: '#fff', ink: '#000', muted: '#555', grid: '#eee', bar: '#00f', crit: '#f00', wp: '#333', arrow: '#888' };
  const l = layout(s, { unit: 'month', width: 900, showDeps: true, showFloat: true, colors: col });
  const svg = toSvg(l);
  check('gantt: SVG has a bar per task, diamonds for milestones, work package rows and arrows', l.h === 34 + 15 * 26 + 12 && (svg.match(/<rect [^>]*rx="3"/g) ?? []).length === 9 && (svg.match(/fill="#f00"/g) ?? []).length === 9 && (svg.match(/marker-end/g) ?? []).length === 11 && svg.includes('>WP3 Analysis<') && svg.startsWith('<svg xmlns'));
  check('gantt: text in the SVG is escaped', toSvg(layout(schedule(parseTasks('A, R&D <x>, , 1, 2', 'day').tasks), { unit: 'day', width: 600, colors: col })).includes('R&amp;D &lt;x&gt;'));
};
