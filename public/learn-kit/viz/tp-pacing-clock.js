// Section pacing clock. Pick a test section and the clock shows the whole time as one circle, with checkpoints at a quarter,
// a half and three quarters. Press Play to run time forward: the green arc is how many questions you should have done by
// now at an even pace; the slider sets your own seconds per question to see if you finish early or run out. Formats are
// typical and change, so check the official test page before the exam.
import { canvas, row, slider, choice, readout, loop, text, title, clamp } from '../kit.js';

const T = {
  satrw: ['SAT Reading and Writing module', 27, 32], satm: ['SAT Math module', 22, 35], gmatq: ['GMAT Quant section', 21, 45], gmatv: ['GMAT Verbal section', 23, 45],
  greq: ['GRE Quant section 1', 12, 21], lsat: ['LSAT section (about 26 questions)', 26, 35], cuet: ['CUET domain paper (50 questions)', 50, 60],
};
export default function (host) {
  let k = host.dataset.test in T ? host.dataset.test : 'satm', el = 0, mine = Math.round(T[k][2] * 60 / T[k][1]);
  const cv = canvas(host, { aspect: 0.95, max: 400, min: 330, label: 'A clock showing minutes used and questions that should be done' });
  const c = row(host); choice(c, 'Section', Object.entries(T).map(([id, v]) => [id, v[0].split(' ')[0] + ' ' + v[0].split(' ')[1]]), k, (v) => { k = v; el = 0; mine = Math.round(T[k][2] * 60 / T[k][1]); sl.set(mine); cv.redraw(); show(); });
  const c2 = row(host);
  const sl = slider(c2, { label: 'Your seconds per question', min: 20, max: 240, step: 5, value: mine, fmt: (v) => v + ' s', oninput: (v) => { mine = v; cv.redraw(); show(); } });
  const a = loop(host, (dt) => { el = clamp(el + dt * T[k][2] / 12, 0, T[k][2]); if (el >= T[k][2]) a.pause(); cv.redraw(); show(); }, { autoplay: false }); a.button(c2);
  const out = readout(host);
  const show = () => { const [nm, n, m] = T[k], per = m * 60 / n, should = el * 60 / per, yours = Math.min(n, el * 60 / mine), fin = n * mine / 60;
    out.innerHTML = `${nm}: ${n} questions in ${m} minutes = <b>${per.toFixed(0)} s</b> per question on average. At ${(el).toFixed(1)} min you should be on question ${Math.min(n, Math.floor(should))}; at your pace you would be on ${Math.floor(yours)}. At ${mine} s each you finish in ${fin.toFixed(1)} min: <b>${fin <= m ? (m - fin).toFixed(1) + ' min spare' : (fin - m).toFixed(1) + ' min short'}</b>. Skip and return to the slow ones.`; };
  cv.draw = (ctx, w, h, col) => {
    const [nm, n, m] = T[k]; title(ctx, nm, col);
    const cx = w / 2, cy = h * 0.46, R = Math.min(w * 0.36, h * 0.34), ang = (v) => -Math.PI / 2 + v * Math.PI * 2;
    ctx.lineWidth = 16; ctx.strokeStyle = col.line; ctx.beginPath(); ctx.arc(cx, cy, R, 0, 7); ctx.stroke();
    const should = Math.min(1, el / m); ctx.strokeStyle = col.s[2]; ctx.beginPath(); ctx.arc(cx, cy, R, ang(0), ang(should)); ctx.stroke();
    const mineF = Math.min(1, el * 60 / mine / n); ctx.lineWidth = 6; ctx.strokeStyle = mineF >= should ? col.s[0] : col.warn; ctx.beginPath(); ctx.arc(cx, cy, R - 14, ang(0), ang(mineF)); ctx.stroke();
    [0.25, 0.5, 0.75].forEach((q) => { const x = cx + Math.cos(ang(q)) * (R + 16), y = cy + Math.sin(ang(q)) * (R + 16); ctx.fillStyle = col.ink; ctx.beginPath(); ctx.arc(cx + Math.cos(ang(q)) * R, cy + Math.sin(ang(q)) * R, 3, 0, 7); ctx.fill(); text(ctx, `Q${Math.round(n * q)}`, x, y, { color: col.muted, size: 10.5, weight: 700, align: 'center' }); });
    const hx = cx + Math.cos(ang(should)) * (R - 4), hy = cy + Math.sin(ang(should)) * (R - 4); ctx.lineWidth = 3; ctx.strokeStyle = col.ink; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(hx, hy); ctx.stroke();
    text(ctx, `${(m - el).toFixed(0)} min left`, cx, cy - 4, { color: col.ink, size: 15, weight: 800, align: 'center' }); text(ctx, `plan: Q${Math.min(n, Math.floor(el * n / m))}`, cx, cy + 16, { color: col.s[2], size: 11, weight: 700, align: 'center' });
    const bw = (w - 20) / n, y = h - 36; for (let i = 0; i < n; i++) { ctx.fillStyle = i < Math.floor(el * n / m) ? col.s[2] : col.line; ctx.fillRect(10 + i * bw + 0.5, y, Math.max(1, bw - 1.5), 12); }
    text(ctx, 'green ring and boxes: even pace; inner ring: your pace', 10, h - 12, { color: col.muted, size: 10.5 });
  };
  show();
}
