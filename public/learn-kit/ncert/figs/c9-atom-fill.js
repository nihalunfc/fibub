// Class 9 Journey Inside the Atom (step player): how electrons fill the shells, in the order 2, 8, 8 (for the first 20
// elements the 4th shell starts after the 3rd holds 8). Steps: H, He (shell 1 full), Li (shell 2 begins), Ne (shell 2
// full), Na (shell 3 begins), Ar (shell 3 full with 8), K and Ca (shell 4). The rule: fill the inner shell first.
import { canvas, text, title, dot, loop } from '../../kit.js';

const E = [[1, 'H', 'hydrogen', 'Shell 1 takes up to 2 electrons. Hydrogen has just one: 1.'], [2, 'He', 'helium', 'Shell 1 is now full with 2. Helium is a very unreactive gas: a full outer shell is stable.'], [3, 'Li', 'lithium', 'Shell 1 is full, so the third electron must go into shell 2: 2, 1.'], [10, 'Ne', 'neon', 'Shell 2 holds up to 8. Neon is 2, 8: both shells full, another unreactive gas.'], [11, 'Na', 'sodium', 'Shell 2 is full, so the 11th electron starts shell 3: 2, 8, 1.'], [18, 'Ar', 'argon', 'Shell 3 filled with 8 (we stop at 8 for these elements): 2, 8, 8. Argon is unreactive.'], [20, 'Ca', 'calcium', 'After 2, 8, 8 the next electrons go to shell 4: potassium 2, 8, 8, 1 and calcium 2, 8, 8, 2.']];
export default function (host) {
  let step = 0, t = 0;
  const cv = canvas(host, { aspect: 0.82, max: 440, min: 300, label: 'Electrons filling shells one after another from hydrogen to calcium' });
  loop(host, (dt) => { t += dt; cv.redraw(); });
  const shells = (k) => { const c = []; for (const cap of [2, 8, 8, 2]) { const x = Math.min(cap, k); c.push(x); k -= x; } return c.filter((x) => x > 0); };
  cv.draw = (ctx, w, h, col) => {
    const [z, sym, nm, cap] = E[step], sh = shells(z);
    title(ctx, `${nm}: Z = ${z}, electrons ${sh.join(', ')}`, col);
    const cx = w / 2, cy = h * 0.46, Rm = Math.min(w * 0.46, h * 0.36), radii = [0.26, 0.5, 0.74, 0.98].map((f) => f * Rm);
    sh.forEach((c, i) => {
      ctx.beginPath(); ctx.arc(cx, cy, radii[i], 0, 7); ctx.strokeStyle = i === sh.length - 1 ? col.s[3] : col.line; ctx.lineWidth = i === sh.length - 1 ? 2 : 1.2; ctx.stroke();
      for (let k = 0; k < c; k++) { const a = (k / c) * Math.PI * 2 + t * (0.5 - i * 0.1) + i; dot(ctx, cx + Math.cos(a) * radii[i], cy + Math.sin(a) * radii[i], 4.2, col.s[2]); }
    });
    dot(ctx, cx, cy, 11, col.s[1]); text(ctx, `${z}+`, cx, cy, { color: col.panel, size: 10, weight: 700, align: 'center', fit: false });
    text(ctx, sym, 12, 44, { color: col.s[1], size: 24, weight: 700 });
    text(ctx, 'outer shell highlighted', w - 10, 44, { color: col.s[3], size: 10, align: 'right' });
    const words = cap.split(' '); let l1 = '', l2 = '', l3 = ''; words.forEach((wd) => { if ((l1 + ' ' + wd).length < w / 6.4 && !l2) l1 = (l1 + ' ' + wd).trim(); else if ((l2 + ' ' + wd).length < w / 6.4 && !l3) l2 = (l2 + ' ' + wd).trim(); else l3 = (l3 + ' ' + wd).trim(); });
    [l1, l2, l3].forEach((l, i) => l && text(ctx, l, w / 2, h - 46 + i * 15, { color: col.ink, size: 11, align: 'center' }));
  };
  cv.redraw();
  return { step(i) { step = Math.min(i, E.length - 1); t = 0; cv.redraw(); } };
}
