// 11.1 Your computer as an AI server: one request's round trip, all inside one computer.
// Steps: the script builds a request, sends it to localhost:11434, the engine runs the model, the JSON reply comes back.
import { canvas, title, text, arrow, loop, calm, ease } from '../../kit.js';

const T = ['Your script builds a request', 'It posts it to localhost:11434', 'The engine runs the model', 'A JSON reply comes back'];
const REQ = ['model: "gemma4:e4b"', 'messages: [ user: "Say hello" ]', 'stream: false'];
const REP = ['message:', '  role: "assistant"', '  content: "Hello there, nice day!"'];

export default function (host) {
  const cv = canvas(host, { aspect: 0.62, max: 330, min: 250, label: 'A script on your computer sends a request to the local AI server and gets a JSON reply, without leaving the computer' });
  let step = 0, k = 1;
  const anim = loop(host, (dt) => { k = Math.min(1, k + dt / 0.9); cv.redraw(); if (k >= 1) anim.pause(); }, { autoplay: false });
  const box = (ctx, x, y, bw, bh, label, sub, on, col) => {
    ctx.fillStyle = on ? col.soft : col.panel; ctx.fillRect(x, y, bw, bh);
    ctx.strokeStyle = on ? col.s[0] : col.line; ctx.lineWidth = on ? 2 : 1; ctx.strokeRect(x + 0.5, y + 0.5, bw - 1, bh - 1);
    text(ctx, label, x + bw / 2, y + 16, { color: col.ink, size: 12.5, weight: 700, align: 'center' });
    if (sub) text(ctx, sub, x + bw / 2, y + 33, { color: col.muted, size: 11, align: 'center' });
  };
  cv.draw = (ctx, w, h, col) => {
    const e = ease(k);
    title(ctx, T[step], col);
    // the computer
    const cx = 8, cy = 36, cw = w - 16, ch = h - 44;
    ctx.setLineDash([5, 4]); ctx.strokeStyle = col.muted; ctx.lineWidth = 1; ctx.strokeRect(cx + 0.5, cy + 0.5, cw - 1, ch - 1); ctx.setLineDash([]);
    text(ctx, 'Your computer (nothing leaves it)', cx + 8, cy + 12, { color: col.muted, size: 11, weight: 600 });
    const bw = Math.min(150, (cw - 60) / 2), bh = 44, y = cy + 26;
    const ax = cx + 12, bx = cx + cw - 12 - bw;
    box(ctx, ax, y, bw, bh, 'Your script', 'Python, curl, Excel...', step === 0 || step === 3, col);
    box(ctx, bx, y, bw, bh, 'Ollama', 'localhost:11434', step === 1 || step === 2, col);
    const my = y + bh / 2;
    if (step === 1) arrow(ctx, ax + bw + 4, my, ax + bw + 4 + (bx - ax - bw - 12) * e, my, col.s[0], 2.5);
    if (step === 3) arrow(ctx, bx - 4, my, bx - 4 - (bx - ax - bw - 12) * e, my, col.s[1], 2.5);
    // the JSON panel
    const py = y + bh + 14, lines = step === 3 ? REP : step === 2 ? ['reads 12 tokens...', 'writes: Hello · there · , · nice ...', 'stops at the end marker'] : REQ;
    const head = step === 3 ? 'reply (JSON)' : step === 2 ? 'inside the engine' : step === 1 ? 'POST /api/chat with this JSON' : 'request (JSON)';
    text(ctx, head, ax, py + 8, { color: col.ink, size: 12, weight: 700 });
    const shown = step === 2 ? Math.max(1, Math.ceil(lines.length * e)) : lines.length;
    lines.slice(0, shown).forEach((l, i) => text(ctx, l, ax + 8, py + 28 + i * 18, { color: step === 3 && i === 2 ? col.s[1] : col.ink, size: 12, weight: step === 3 && i === 2 ? 700 : 400 }));
  };
  cv.redraw();
  return { step(i) { step = i; k = calm() ? 1 : 0; cv.redraw(); if (k < 1) anim.play(); } };
}
