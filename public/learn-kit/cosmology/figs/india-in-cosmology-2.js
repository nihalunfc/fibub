// 12.8 Routes to becoming a cosmologist, as a flow chart: the usual steps in India and abroad. Typical ages and
// lengths; every route has exceptions (people switch in from engineering, maths or computing at every stage).
import { canvas, text, title, arrow, row, choice, readout } from '../../kit.js';

const ROUTES = {
  in: [
    ['Class 11-12', 'physics + maths', '15-17'],
    ['BSc / BS physics', '3-4 years; or a BS-MS at an IISER, NISER or IISc', '18-21'],
    ['MSc physics', 'entry: IIT JAM, CUET-PG, university tests', '21-23'],
    ['PhD', 'entry: JEST, CSIR NET, GATE, institute tests', '23-28'],
    ['Postdoc', '2-3 years each, often 2 or 3, often abroad', '28-34'],
    ['Faculty or scientist', 'universities, IITs, IISERs, research institutes', '32+'],
  ],
  out: [
    ['Class 11-12', 'physics + maths', '15-17'],
    ['BSc / BS physics', 'in India or abroad', '18-21'],
    ['PhD abroad', 'USA: 5-6 years, often straight after a BSc; Europe and UK: 3-4 years, usually after an MSc', '22-28'],
    ['Postdoc', 'anywhere in the world', '28-34'],
    ['Faculty or scientist', 'or back to India: many Indian cosmologists came home', '32+'],
  ],
};

export default function (host) {
  const cv = canvas(host, { aspect: 1.05, max: 520, min: 440, label: 'Flow chart of the steps to becoming a cosmologist, in India or abroad' });
  let r = 'in';
  const ctl = row(host);
  choice(ctl, 'Route', [['in', 'In India'], ['out', 'Abroad']], 'in', (v) => { r = v; upd(); });
  const out = readout(host);
  const wrap = (ctx, s, max) => { ctx.font = '400 11px system-ui'; const ws = s.split(' '), ls = []; let a = ''; ws.forEach((x) => { const t = a ? a + ' ' + x : x; if (ctx.measureText(t).width > max && a) { ls.push(a); a = x; } else a = t; }); ls.push(a); return ls; };
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, r === 'in' ? 'Becoming a cosmologist in India' : 'Becoming a cosmologist abroad', col) + 8;
    const S = ROUTES[r], gap = 16, bw = Math.min(w - 70, 420), x = (w - bw) / 2 + 14;
    const bh = (h - top - 8 - gap * (S.length - 1)) / S.length;
    S.forEach(([name, note, age], i) => {
      const y = top + i * (bh + gap);
      ctx.fillStyle = i === S.length - 1 ? col.s[0] : col.soft; ctx.strokeStyle = col.line; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.roundRect ? ctx.roundRect(x, y, bw, bh, 8) : ctx.rect(x, y, bw, bh); ctx.fill(); ctx.stroke();
      const ink = i === S.length - 1 ? col.panel : col.ink;
      text(ctx, name, x + 10, y + 13, { color: ink, size: 12.5, weight: 700, fit: false });
      text(ctx, 'age ' + age, x + bw - 8, y + 13, { color: i === S.length - 1 ? col.panel : col.muted, size: 10.5, align: 'right', fit: false });
      wrap(ctx, note, bw - 20).slice(0, Math.max(1, Math.floor((bh - 22) / 13))).forEach((l, j) => text(ctx, l, x + 10, y + 29 + j * 13, { color: i === S.length - 1 ? col.panel : col.muted, size: 11, fit: false }));
      if (i < S.length - 1) arrow(ctx, x + bw / 2, y + bh + 1, x + bw / 2, y + bh + gap - 1, col.muted, 2, 7);
    });
    // side note: what to do all along
    ctx.save(); ctx.translate(x - 12, top + (h - top) / 2); ctx.rotate(-Math.PI / 2);
    text(ctx, 'all along: summer projects · Python · reading', 0, 0, { color: col.s[3], size: 11, weight: 700, align: 'center', fit: false });
    ctx.restore();
  };
  const upd = () => {
    out.innerHTML = r === 'in'
      ? 'Exams to know: <b>IIT JAM</b> (MSc at the IITs and IISc), <b>JEST</b> (PhD and integrated PhD at many research institutes), <b>CSIR NET</b> and <b>GATE</b> (PhD fellowships); some institutes, such as TIFR, run their own tests. fibub has free courses for <a href="/learn/courses/iit-jam-physics/">IIT JAM physics</a>, <a href="/learn/courses/gate-physics/">GATE physics</a> and <a href="/learn/courses/csir-net-physics/">CSIR NET physics</a>.'
      : 'Abroad, admission is by application: grades, a statement of purpose, letters from people you did research with, and sometimes the GRE. Most PhD places come with a salary or stipend. Research experience from summer projects matters most.';
    cv.redraw();
  };
  upd();
}
