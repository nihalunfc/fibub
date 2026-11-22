// Tenses on a timeline: pick one of twelve and watch the event drawn on a line from past to future, with "now" in the middle.
// A dot is a point in time, a bar is an action that lasts, an arrow shows a link to now. Notice what each tense connects.
import { canvas, text, title, row, choice, readout, loop, ease } from '../kit.js';

// x: -1 far past, 0 now, 1 far future
const T = {
  'Past simple': ['I visited Delhi in 2019.', [['dot', -0.55]], 'A finished event at a time in the past.'],
  'Past continuous': ['I was cooking when she called.', [['bar', -0.7, -0.35], ['dot', -0.5, 'call']], 'An action in progress around a past moment.'],
  'Past perfect': ['I had left before she arrived.', [['dot', -0.75], ['dot', -0.4, 'arrived']], 'The earlier of two past events.'],
  'Present simple': ['I walk to work.', [['bar', -0.9, 0.9, 'habit']], 'A habit or fact that is true across now.'],
  'Present continuous': ['I am walking to work.', [['bar', -0.12, 0.12]], 'Happening around now, temporary.'],
  'Present perfect': ['I have lived here for years.', [['bar', -0.7, 0], ['arrow']], 'A past event or state with a link to now.'],
  'Present perfect continuous': ['I have been waiting for an hour.', [['bar', -0.45, 0], ['arrow']], 'An action that started before now and is still going on (or just stopped).'],
  'Future simple': ['I will call you tomorrow.', [['dot', 0.55]], 'A decision or prediction about the future.'],
  'Future continuous': ['At 8 tonight I will be driving.', [['bar', 0.35, 0.7]], 'An action in progress at a future moment.'],
  'Future perfect': ['By June I will have finished.', [['dot', 0.7], ['dot', 0.35, 'June']], 'Finished before a future moment.'],
  'Going to': ['I am going to start next week.', [['dot', 0.45], ['arrow2']], 'A plan, with a link from now.'],
  'Past perfect continuous': ['I had been studying for hours.', [['bar', -0.9, -0.4], ['dot', -0.35, 'exam']], 'Lasting action up to a past moment.'],
};
export default function (host) {
  let k = 'Present perfect', p = 0;
  const cv = canvas(host, { aspect: 0.55, max: 240, min: 200, label: 'A timeline from past to future with the chosen tense drawn on it' });
  const ctl = row(host), out = readout(host);
  choice(ctl, 'Tense', Object.keys(T).map((x) => [x, x]), k, (v) => { k = v; p = 0; upd(); });
  const anim = loop(host, (dt) => { if (p < 1) p = Math.min(1, p + dt * 1.2); cv.redraw(); });
  const upd = () => { out.textContent = `"${T[k][0]}" ${T[k][2]}`; cv.redraw(); };
  cv.draw = (ctx, W, H, col) => {
    title(ctx, k, col);
    const y = H * 0.6, X = (v) => W / 2 + v * (W / 2 - 22), e = ease(p);
    ctx.strokeStyle = col.muted; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(14, y); ctx.lineTo(W - 14, y); ctx.stroke();
    text(ctx, 'PAST', 18, y + 22, { color: col.muted, size: 11, weight: 700 }); text(ctx, 'FUTURE', W - 18, y + 22, { color: col.muted, size: 11, weight: 700, align: 'right' });
    ctx.strokeStyle = col.ink; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(X(0), y - 16); ctx.lineTo(X(0), y + 16); ctx.stroke(); text(ctx, 'NOW', X(0), y + 28, { color: col.ink, size: 12, weight: 700, align: 'center' });
    let first = true;
    for (const s of T[k][1]) {
      const c = first ? col.s[0] : col.s[1];
      if (s[0] === 'bar') { const a = X(s[1]), b = X(s[2]); ctx.fillStyle = c; ctx.globalAlpha = 0.8; ctx.fillRect(a, y - 14, (b - a) * e, 28); ctx.globalAlpha = 1; if (s[3]) text(ctx, s[3], (a + b) / 2, y - 26, { color: col.muted, size: 11, align: 'center' }); first = false; }
      else if (s[0] === 'dot') { ctx.globalAlpha = e; ctx.fillStyle = c; ctx.beginPath(); ctx.arc(X(s[1]), y, 9, 0, 7); ctx.fill(); ctx.globalAlpha = 1; if (s[2]) text(ctx, s[2], X(s[1]), y - 24, { color: col.muted, size: 11, align: 'center' }); first = false; }
      else if (s[0] === 'arrow') { ctx.strokeStyle = col.s[2]; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(X(-0.02) - 40 * e, y - 30); ctx.lineTo(X(0), y - 30); ctx.stroke(); text(ctx, 'link to now', X(-0.02) - 20, y - 42, { color: col.s[2], size: 11, weight: 600, align: 'center' }); }
      else if (s[0] === 'arrow2') { ctx.strokeStyle = col.s[2]; ctx.lineWidth = 2.5; ctx.setLineDash([5, 4]); ctx.beginPath(); ctx.moveTo(X(0), y - 30); ctx.lineTo(X(0 + 0.45 * e), y - 30); ctx.stroke(); ctx.setLineDash([]); text(ctx, 'plan', X(0.22), y - 42, { color: col.s[2], size: 11, weight: 600, align: 'center' }); }
    }
  };
  upd();
}
