// Study planner: weeks until the test, hours a week and your weakest skill → a week-by-week plan through this
// course, drawn as a timeline. Download it as a text file. Nothing is saved.
// data-mode="celpip" | "toefl"
import { canvas, row, slider, choice, readout, text, font } from '../kit.js';
import { MODS, makePlan } from './plan-core.js';

const cap = (s) => s[0].toUpperCase() + s.slice(1);

export default function (host, { data }) {
  const mode = data.mode === 'toefl' ? 'toefl' : 'celpip';
  let weeks = 8, hours = 6, weak = 'speaking';
  const cv = canvas(host, { aspect: 0.36, max: 220, min: 180, label: 'Timeline of your study weeks coloured by skill' });
  const ctl = row(host);
  slider(ctl, { label: 'Weeks until the test', min: 2, max: 16, step: 1, value: weeks, fmt: (v) => `${v}`, oninput: (v) => { weeks = v; update(); } });
  slider(ctl, { label: 'Hours a week', min: 2, max: 20, step: 1, value: hours, fmt: (v) => `${v} h`, oninput: (v) => { hours = v; update(); } });
  const ctl2 = row(host);
  choice(ctl2, 'Weakest skill', MODS[mode].order.map((s) => [s, cap(s)]), weak, (v) => { weak = v; update(); });
  const out = readout(host);
  const list = document.createElement('ol');
  list.className = 'en-plan';
  host.insertBefore(list, host.querySelector(':scope > figcaption'));
  const dl = document.createElement('button');
  dl.type = 'button'; dl.className = 'lk-btn'; dl.textContent = '⤓ Download my plan';
  host.insertBefore(dl, host.querySelector(':scope > figcaption'));
  let plan = [];
  const colour = (col, p) => ({ start: col.muted, listening: col.s[0], reading: col.s[1], writing: col.s[2], speaking: col.s[3], mixed: col.s[4], mock: col.ink }[p]);
  cv.draw = (ctx, w, h, col) => {
    const L = 10, R = 10, top = 34, bh = 40, cw = (w - L - R) / weeks;
    plan.forEach((r) => {
      ctx.fillStyle = colour(col, r.phase);
      ctx.fillRect(L + (r.week - 1) * cw + 1, top, cw - 2, bh);
      if (cw > 18) text(ctx, String(r.week), L + (r.week - 0.5) * cw, top + bh + 12, { color: col.muted, size: 10.5, align: 'center' });
    });
    let x = L, y = top + bh + 31;
    ctx.font = font(11);
    for (const p of ['start', ...MODS[mode].order, 'mock']) {
      const label = p === 'start' ? 'Start' : p === 'mock' ? 'Mocks' : cap(p);
      const wd = ctx.measureText(label).width + 30;
      if (x + wd > w - R + 16) { x = L; y += 18; }
      ctx.fillStyle = colour(col, p); ctx.fillRect(x, y - 5, 10, 10);
      text(ctx, label, x + 14, y, { color: col.ink, size: 11 });
      ctx.font = font(11);
      x += wd;
    }
    text(ctx, `Your ${weeks}-week plan`, L, 16, { color: col.ink, size: 12, weight: 700 });
  };
  const update = () => {
    plan = makePlan(weeks, hours, weak, mode);
    cv.redraw();
    list.innerHTML = plan.map((r) => `<li><b>Week ${r.week} · ${r.focus}.</b> ${r.task}</li>`).join('');
    out.textContent = `${weeks * hours} hours in total. ${weeks * hours < 40 ? 'That is tight: put most of it into your weakest skill.' : 'A good amount: follow the plan and take the mocks seriously.'}`;
  };
  dl.addEventListener('click', () => {
    const t = `My ${mode.toUpperCase()} study plan (fibub.com/learn/courses/${mode}/)\n\n` + plan.map((r) => `Week ${r.week}: ${r.focus}\n  ${r.task}`).join('\n');
    const u = URL.createObjectURL(new Blob([t], { type: 'text/plain' }));
    const a = Object.assign(document.createElement('a'), { href: u, download: `${mode}-study-plan.txt` });
    document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(u), 2000);
  });
  update();
}
