// Test map: the sections of the test as blocks sized by their time, with the parts inside. In a step player each
// step lights up one section (step 0 = whole test). data-mode="celpip" | "celpip-ls" | "toefl".
import { canvas, text, title } from '../kit.js';

export const TESTS = {
  celpip: { name: 'CELPIP-General', note: 'about 2 h 40 min to 3 h, one sitting', sections: [
    { name: 'Listening', min: 50, parts: ['Problem solving', 'Daily life conversation', 'Information', 'News item', 'Discussion', 'Viewpoints'] },
    { name: 'Reading', min: 50, parts: ['Correspondence', 'Apply a diagram', 'Information', 'Viewpoints'] },
    { name: 'Writing', min: 53, parts: ['Email (27 min)', 'Survey (26 min)'] },
    { name: 'Speaking', min: 15, parts: ['8 short recorded tasks'] },
  ] },
  'celpip-ls': { name: 'CELPIP-General LS', note: 'about 1 h 10 min', sections: [
    { name: 'Listening', min: 50, parts: ['Problem solving', 'Daily life conversation', 'Information', 'News item', 'Discussion', 'Viewpoints'] },
    { name: 'Speaking', min: 15, parts: ['8 short recorded tasks'] },
  ] },
  toefl: { name: 'TOEFL iBT (from January 2026)', note: 'about 90 min of tasks, allow 2 hours', sections: [
    { name: 'Reading', min: 30, parts: ['Complete the Words', 'Read in Daily Life', 'Academic Passage'] },
    { name: 'Listening', min: 29, parts: ['Choose a Response', 'Conversation', 'Announcement', 'Academic Talk'] },
    { name: 'Writing', min: 23, parts: ['Build a Sentence', 'Write an Email', 'Academic Discussion'] },
    { name: 'Speaking', min: 8, parts: ['Listen and Repeat', 'Take an Interview'] },
  ] },
};

export default function (host, { data, steps }) {
  // In a step player the figure mounts in the player's stage, so the mode sits on the player box.
  const mode = data.mode || host.closest('[data-mode]')?.dataset.mode;
  const T = TESTS[mode] || TESTS.celpip;
  let on = -1, boxes = [];
  const cv = canvas(host, { aspect: 0.5, max: 320, min: 240, label: `The sections of ${T.name} in order, sized by time` });
  cv.draw = (ctx, w, h, col) => {
    const L = 8, R = 8, bh = 46, minW = 68;
    const top = title(ctx, `${T.name}: ${T.note}`, col) + 8;
    const total = T.sections.reduce((a, s) => a + s.min, 0);
    const spare = w - L - R - minW * T.sections.length;
    let x = L;
    boxes = [];
    T.sections.forEach((s, i) => {
      const bw = minW + Math.max(0, spare) * s.min / total;
      boxes.push([x, x + bw, top, top + bh]);
      const lit = on < 0 || on === i;
      ctx.globalAlpha = lit ? 1 : 0.25;
      ctx.fillStyle = col.s[i];
      ctx.fillRect(x + 1, top, bw - 2, bh);
      text(ctx, s.name, x + bw / 2, top + bh / 2 - 7, { color: '#fff', size: bw < 60 ? 10 : 12.5, weight: 700, align: 'center' });
      text(ctx, `~${s.min} min`, x + bw / 2, top + bh / 2 + 9, { color: '#fff', size: 10.5, align: 'center' });
      ctx.globalAlpha = 1;
      if (on === i) {
        s.parts.forEach((p, k) => text(ctx, `${k + 1}. ${p}`, L + 4, top + bh + 24 + k * 17, { color: col.ink, size: 12 }));
      }
      x += bw;
    });
    if (on < 0) text(ctx, steps ? 'Press Next to open each section.' : 'Tap a section to see its parts.', L + 4, top + bh + 24, { color: col.muted, size: 12 });
  };
  if (!steps) cv.c.addEventListener('click', (e) => {
    const r = cv.c.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
    const k = boxes.findIndex(([a, b, t, u]) => x >= a && x <= b && y >= t && y <= u);
    if (k >= 0) { on = on === k ? -1 : k; cv.redraw(); }
  });
  cv.redraw();
  return { step(i) { on = i - 1; cv.redraw(); } };
}
