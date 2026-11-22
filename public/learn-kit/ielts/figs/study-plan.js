// 1.5 Study planner: weeks, hours a week, current and target band -> a week-by-week plan to print.
// Nothing is stored; the plan is built in the page.
import { row, slider, choice, readout, put, button } from '../../kit.js';

const SK = ['Listening', 'Reading', 'Writing', 'Speaking'];
export default function (host) {
  const st = { weeks: 8, hours: 8, gap: 1, weak: 'Writing', mod: 'general' };
  const ctl = row(host);
  slider(ctl, { label: 'Weeks until your test', min: 2, max: 16, step: 1, value: st.weeks, fmt: String, oninput: (v) => { st.weeks = v; show(); } });
  slider(ctl, { label: 'Hours a week', min: 3, max: 25, step: 1, value: st.hours, fmt: String, oninput: (v) => { st.hours = v; show(); } });
  slider(ctl, { label: 'Bands to gain', min: 0, max: 2, step: 0.5, value: st.gap, fmt: (v) => v.toFixed(1), oninput: (v) => { st.gap = v; show(); } });
  const c2 = row(host);
  choice(c2, 'Weakest skill', SK.map((s) => [s, s]), st.weak, (v) => { st.weak = v; show(); });
  choice(c2, 'Module', [['academic', 'Academic'], ['general', 'General Training']], st.mod, (v) => { st.mod = v; show(); });
  const out = readout(host);
  const box = document.createElement('div'); box.className = 'ie-plan'; put(host, box);
  const c3 = row(host);
  button(c3, '⎙ Print this plan', () => window.print());
  const show = () => {
    const total = st.weeks * st.hours, need = st.gap * 180; // a common rough guide: about 150-200 guided hours per band
    out.innerHTML = `You have about <b>${total} hours</b>. ${st.gap === 0 ? 'You are aiming to hold your band: focus on timing and mock tests.' : `A common rough guide is 150 to 200 hours of focused study to rise one band from 5 or 6, so ${st.gap} band${st.gap > 1 ? 's' : ''} may take around <b>${need} hours</b>. ${total >= need ? 'Your plan fits.' : 'Your plan is tight: add hours, move the test date, or aim for half a band less first.'}`}`;
    const w1 = Math.max(1, Math.round(st.weeks * 0.25)), w3 = Math.max(1, Math.round(st.weeks * 0.25)), w2 = Math.max(1, st.weeks - w1 - w3);
    const t1 = st.mod === 'academic' ? 'Academic Task 1 (Module 5)' : 'letters (Module 6)';
    const share = (s) => (s === st.weak ? 40 : 20);
    box.innerHTML = `<table><thead><tr><th>Weeks</th><th>Focus</th></tr></thead><tbody>
<tr><td>1 to ${w1}</td><td>Lessons 1.1 to 1.6, one diagnostic mock test (Lesson 11.1), then Modules 2 and 3. Learn the format of every question type.</td></tr>
<tr><td>${w1 + 1} to ${w1 + w2}</td><td>Skill weeks: ${SK.map((s) => `${s} ${share(s)}%`).join(', ')} of your time. Writing: ${t1} and Task 2 (Module 7). Grammar and vocabulary 20 minutes a day (Modules 9 and 10). Practice room every day.</td></tr>
<tr><td>${w1 + w2 + 1} to ${st.weeks}</td><td>One full timed mock test a week, review every mistake, ${st.weak} every day, Module 11.</td></tr>
</tbody></table>`;
  };
  show();
}
