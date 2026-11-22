// Speaking Part 2 planner: a made-up cue card, then the real clock: 1 minute to prepare, up to 2 minutes to speak. Press Start
// and watch the ring; the four bullets light up about 30 seconds apart. "Fast demo" runs 10 times faster. Jot keywords, not sentences.
import { canvas, text, title, row, button, choice, readout, loop, put } from '../kit.js';
import { box } from './_lang.js';

const CARD = ['Describe a place you like to visit.', 'where it is', 'how often you go there', 'what you do there', 'why you like it'];
export default function (host) {
  let t = 0, run = false, fast = 1;
  const cv = canvas(host, { aspect: 1, max: 370, min: 345, label: 'A speaking cue card with a countdown ring' });
  const ctl = row(host);
  const note = document.createElement('input'); note.type = 'text'; note.placeholder = 'Jot keywords here (not saved or sent)'; note.setAttribute('aria-label', 'Jot keywords');
  note.style.cssText = 'width:100%;box-sizing:border-box;padding:6px 8px;border:1px solid var(--line);border-radius:6px;background:var(--bg);color:var(--ink);font:inherit;margin:4px 0;'; put(host, note);
  const out = readout(host);
  button(ctl, 'Start', () => { t = 0; run = true; anim.play(); }, 'lk-primary'); button(ctl, 'Reset', () => { t = 0; run = false; cv.redraw(); upd(); });
  choice(ctl, 'Speed', [[1, 'Real time'], [10, 'Fast demo']], fast, (v) => { fast = v; });
  const phase = () => (t < 60 ? 'prep' : t < 180 ? 'speak' : 'done');
  const upd = () => { const p = phase(); out.textContent = p === 'prep' ? `Preparing: ${Math.ceil(60 - t)} s left. Write 4 or 5 keywords, one per bullet.` : p === 'speak' ? `Speaking: ${Math.floor(t - 60)} s so far. Aim for about 30 seconds on each bullet, and keep going until you are stopped.` : 'Time. The examiner says "Thank you" and asks one or two short follow-up questions.'; };
  const anim = loop(host, (dt) => { if (run && t < 180) { t = Math.min(180, t + dt * fast); } cv.redraw(); upd(); }, { autoplay: false });
  cv.draw = (ctx, W, H, col) => {
    title(ctx, 'Part 2: cue card and clock', col);
    const p = phase(), cx = W / 2, cy = 90, r = 54, frac = p === 'prep' ? t / 60 : p === 'speak' ? (t - 60) / 120 : 1;
    ctx.lineWidth = 10; ctx.strokeStyle = col.line; ctx.beginPath(); ctx.arc(cx, cy, r, 0, 7); ctx.stroke();
    ctx.strokeStyle = p === 'prep' ? col.s[1] : col.s[2]; ctx.beginPath(); ctx.arc(cx, cy, r, -Math.PI / 2, -Math.PI / 2 + frac * 2 * Math.PI); ctx.stroke();
    const left = p === 'prep' ? 60 - t : p === 'speak' ? 120 - (t - 60) : 0;
    text(ctx, `${Math.floor(left / 60)}:${String(Math.floor(left % 60)).padStart(2, '0')}`, cx, cy - 6, { color: col.ink, size: 22, weight: 700, align: 'center' });
    text(ctx, p === 'prep' ? 'PREPARE' : p === 'speak' ? 'SPEAK' : 'DONE', cx, cy + 16, { color: col.muted, size: 11, weight: 700, align: 'center' });
    const y0 = 168; ctx.strokeStyle = col.muted; ctx.lineWidth = 1.5; ctx.strokeRect(14, y0, W - 28, H - y0 - 10);
    text(ctx, CARD[0], 24, y0 + 18, { color: col.ink, size: 13.5, weight: 700 });
    const cur = p === 'speak' ? Math.min(3, Math.floor((t - 60) / 30)) : -1;
    for (let i = 1; i < 5; i++) { const y = y0 + 22 + i * 24; if (i - 1 === cur) { ctx.fillStyle = col.s[2]; ctx.globalAlpha = 0.25; ctx.fillRect(20, y - 12, W - 40, 24); ctx.globalAlpha = 1; } text(ctx, 'You should say: '.slice(0, 0) + '• ' + CARD[i], 28, y, { color: col.ink, size: 13, weight: i - 1 === cur ? 700 : 400 }); }
  };
  cv.redraw(); upd();
}
