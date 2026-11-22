// #T1071 Daily task board
import { assign, spread, toMin, hm, importTasks, problems } from '../../src/lib/biz/taskboard.ts';
export const path = '/money/task-board/';
export default async ({ page, check, BASE }) => {
  const tasks = [1, 2, 3, 4].map((i) => ({ id: 't' + i, name: 'T' + i, zone: 'A', min: '30', urgent: false, due: '' }));
  const ppl = [{ name: 'P1', start: '08:00', end: '12:00', zones: '' }, { name: 'P2', start: '08:00', end: '12:00', zones: '' }];
  const r = assign(tasks, ppl, { travel: 5, breakMin: 0, from: null });
  check(r.items.length === 4 && r.people.every((p) => p.count === 2 && p.work === 60 && Math.abs(p.load - 0.25) < 1e-12) && spread(r.people) === 0, 'task maths: 4 x 30 min between two people is 2 each, 25% load, no gap');
  check(hm(toMin('08:30')) === '08:30' && toMin('25:00') === null, 'task maths: times');
  const u = assign([{ id: 'a', name: 'Slow', zone: 'A', min: '30', urgent: false, due: '' }, { id: 'b', name: 'Rush', zone: 'A', min: '30', urgent: true, due: '08:45' }], [ppl[0]], { travel: 5, breakMin: 0, from: null });
  check(u.items[0].id === 'b' && !u.items[0].late, 'task maths: the urgent task with a deadline goes first and is on time');
  const z = assign([{ id: 'a', name: 'A1', zone: 'X', min: '10', urgent: false, due: '' }, { id: 'b', name: 'B1', zone: 'Y', min: '10', urgent: false, due: '' }, { id: 'c', name: 'A2', zone: 'X', min: '10', urgent: false, due: '' }], [ppl[0]], { travel: 5, breakMin: 0, from: null });
  check(z.items.filter((x) => x.travel > 0).length === 1, 'task maths: one person keeps to one area, so only one move');
  const d = assign(tasks, ppl, { travel: 0, breakMin: 0, from: toMin('10:00') }, { t1: true }, r.items);
  check(d.items.find((x) => x.id === 't1').start === r.items.find((x) => x.id === 't1').start && d.items.filter((x) => x.id !== 't1').every((x) => x.start >= 600), 'task maths: reassigning keeps what is done and replans the rest from the new time');
  check(importTasks('Restock\tAisle 1\t25\tyes\t10:00').tasks[0].urgent === true && problems([], []).length === 2, 'task maths: pasted rows and empty-input warnings');

  await page.goto(`${BASE}/money/task-board/`); await page.waitForTimeout(500);
  check((await page.locator('.tb .tb-card').count()) === 4 && (await page.locator('.tb .tb-tasks tbody tr').count()) > 10, 'task board: hotel example has 4 people and many tasks');
  await page.selectOption('.tb .tb-preset', 'maint'); await page.waitForTimeout(300);
  check((await page.locator('.tb .tb-card').count()) === 2, 'task board: maintenance example has 2 people');
  const n0 = await page.locator('.tb .tb-card li').count();
  await page.click('.tb .tb-addp'); await page.waitForTimeout(500);
  check((await page.locator('.tb .tb-card').count()) === 3 && (await page.locator('.tb .tb-card li').count()) === n0, 'task board: adding a person makes a third card');
  await page.locator('.tb .tb-card li input[type=checkbox]').first().check(); await page.waitForTimeout(150);
  check((await page.locator('.tb .tb-card li.done').count()) === 1 && (await page.textContent('.tb .tb-kpis')).includes('1 done'), 'task board: ticking a task marks it done');
  await page.fill('.tb .tb-from', '10:30'); await page.click('.tb .tb-re'); await page.waitForTimeout(400);
  check((await page.locator('.tb .tb-card li.done').count()) === 1, 'task board: reassign keeps the done task');
  await page.click('.tb details.biz-paste summary'); await page.fill('.tb .tb-paste', 'Sweep\tHall\t30\t\t\nMop\tHall\t30\tyes\t09:00'); await page.click('.tb .tb-load'); await page.waitForTimeout(500);
  check((await page.locator('.tb .tb-tasks tbody tr').count()) === 2, 'task board: pasted tasks replace the list');
  check(!(await page.evaluate(() => Object.keys(localStorage).some((k) => k.includes('taskboard')))), 'task board: nothing is stored unless the box is ticked');
};
