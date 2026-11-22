// A chat that outgrows the context window. Each block is a message, wide in proportion to its tokens. Press Next
// message (or Play) and the window fills. The model can only see what fits: older messages fall out on the left. Message 2
// says "My name is Priya": watch when the model forgets it, and try the two fixes (pin the system prompt, or summarise).
import { canvas, text, row, slider, choice, button, readout, loop, title } from '../kit.js';
import { rr } from './_ai.js';

const MSG = [['System prompt', 300, 'sys'], ['User: My name is Priya', 40, 'fact'], ['Assistant', 160, 'a'], ['User', 70, 'u'], ['Assistant', 320, 'a'], ['User', 60, 'u'], ['Assistant', 280, 'a'], ['User', 120, 'u'], ['Assistant', 400, 'a'], ['User', 50, 'u'], ['Assistant', 240, 'a'], ['User', 90, 'u'], ['Assistant', 350, 'a'], ['User: What is my name?', 40, 'q']];
export default function (host) {
  let n = 4, cap = 1000, strat = 'drop';
  const cv = canvas(host, { aspect: 0.62, max: 330, min: 230, label: 'Chat messages as blocks inside a context window' });
  const ctl = row(host), ctl2 = row(host);
  choice(ctl, 'When full', [['drop', 'Drop oldest'], ['pin', 'Pin system prompt'], ['sum', 'Summarise old']], strat, (v) => { strat = v; show(); });
  slider(ctl2, { label: 'Window size', min: 600, max: 2400, step: 100, value: cap, fmt: (v) => v + ' tokens', oninput: (v) => { cap = v; show(); } });
  const anim = loop(host, (dt, t) => { if (t - (anim.l || 0) > 1.0) { anim.l = t; n = n >= MSG.length ? 2 : n + 1; show(); } }, { autoplay: false });
  anim.button(ctl2); button(ctl2, 'Next message', () => { anim.pause(); n = n >= MSG.length ? 2 : n + 1; show(); });
  const out = readout(host);
  function window_() {
    const kept = []; let used = 0; const sys = strat === 'pin' ? MSG[0][1] : 0, sum = strat === 'sum' ? 100 : 0;
    let budget = cap - sys; let dropped = false;
    for (let i = n - 1; i >= (strat === 'pin' ? 1 : 0); i--) { if (used + MSG[i][1] + (strat === 'sum' ? sum : 0) > budget && kept.length) { dropped = true; break; } if (used + MSG[i][1] > budget) { dropped = true; break; } kept.unshift(i); used += MSG[i][1]; }
    if (strat === 'pin') { kept.unshift(0); used += sys; }
    const lost = MSG.slice(0, n).map((_, i) => i).filter((i) => !kept.includes(i));
    const withSum = strat === 'sum' && lost.length; if (withSum) used += sum;
    return { kept, lost, used, withSum };
  }
  function show() {
    const w = window_(), hasName = w.kept.includes(1) || (w.withSum && w.lost.includes(1)), q = n >= MSG.length;
    out.innerHTML = `${n} messages so far, <b>${w.used}</b> of ${cap} tokens in the window. ${w.lost.length ? `Out of the window: ${w.lost.length} older message${w.lost.length > 1 ? 's' : ''}.` : 'Everything still fits.'} ${n >= 2 ? (hasName ? 'The model <b>still knows</b> the name' + (w.withSum && !w.kept.includes(1) ? ' (the summary kept it)' : '') + '.' : 'The model has <b>forgotten</b> the name: that message is gone.') : ''}${q ? (hasName ? ' It answers "Priya".' : ' Asked its name, it can only guess.') : ''}`;
    cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    const wnd = window_(); title(ctx, 'Context window (the box) and the chat so far', col);
    const total = MSG.slice(0, n).reduce((s, m) => s + m[1], 0) + (wnd.withSum ? 100 : 0), scale = (w - 20) / Math.max(cap * 1.0, 1);
    const boxW = cap * scale, x0 = 10, y0 = 70, hh = 60;
    ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.strokeRect(x0, y0 - 6, boxW, hh + 12);
    text(ctx, `window = ${cap} tokens`, x0 + 4, y0 - 14, { color: col.muted, size: 10.5 });
    // in-window blocks placed from the right edge of the box backwards in order
    let x = x0 + boxW; const placed = new Map();
    const order = [...wnd.kept]; for (let j = order.length - 1; j >= 0; j--) { const i = order[j]; const wd = MSG[i][1] * scale; x -= wd; placed.set(i, [x, wd]); }
    let sx = x - (wnd.withSum ? 100 * scale : 0);
    if (wnd.withSum) { ctx.fillStyle = col.s[3]; ctx.fillRect(x - 100 * scale, y0, 100 * scale - 1, hh); text(ctx, 'summary', x - 50 * scale, y0 + hh / 2, { color: col.panel, size: 9, align: 'center', fit: false }); }
    const color = (t) => (t === 'sys' ? col.s[7] : t === 'fact' || t === 'q' ? col.s[1] : t === 'u' ? col.s[0] : col.s[2]);
    placed.forEach(([px, wd], i) => { ctx.fillStyle = color(MSG[i][2]); ctx.fillRect(px, y0, wd - 1, hh); if (wd > 14) text(ctx, String(i), px + wd / 2, y0 + hh / 2, { color: col.panel, size: 10, align: 'center', weight: 700, fit: false }); });
    // lost blocks, faded, above-left in a row
    let lx = 10; wnd.lost.forEach((i) => { const wd = Math.max(6, MSG[i][1] * scale * 0.6); ctx.save(); ctx.globalAlpha = 0.4; ctx.fillStyle = color(MSG[i][2]); ctx.fillRect(lx, y0 + hh + 28, wd - 1, 22); ctx.restore(); lx += wd; });
    if (wnd.lost.length) text(ctx, 'forgotten (outside the window)', 10, y0 + hh + 66, { color: col.muted, size: 10.5 });
    const key = [['system', col.s[7]], ['you', col.s[0]], ['assistant', col.s[2]], ['the name', col.s[1]]]; key.forEach(([t, c], i) => { ctx.fillStyle = c; ctx.fillRect(10 + i * 78, h - 18, 10, 10); text(ctx, t, 24 + i * 78, h - 13, { color: col.muted, size: 10, fit: false }); });
  };
  show();
}
