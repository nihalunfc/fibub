// Email tone slider: the same message at five levels from casual to very formal, for three situations. Slide "Formality" and
// watch the greeting, the verbs and the ending change. Pick the level that matches who you are writing to: a friend, a
// colleague, a manager or a stranger.
import { canvas, text, title, row, choice, slider, readout } from '../kit.js';
import { wrap } from './_lang.js';

const E = {
  leave: ['Time off', ['Hey Sam, can I take Friday off? Thanks!', 'Hi Sam, could I take Friday off? Thanks.', 'Hello Sam, would it be possible to take Friday off? Thank you.', 'Dear Sam, I would like to request leave on Friday. Thank you for considering this.', 'Dear Mr. Rao, I am writing to request annual leave on Friday, 14 March. I would be grateful for your approval. Yours sincerely, Asha']],
  late: ['Late order', ['Hi, my order is late. Where is it??', 'Hi, my order has not arrived yet. Can you check?', 'Hello, my order has not arrived. Could you check on it, please?', 'Dear Customer Service, my order has not been delivered. I would appreciate an update.', 'Dear Sir or Madam, I am writing to enquire about order 4471, which was due on 3 March and has not arrived. I would be grateful if you could advise on its status. Yours faithfully, Asha']],
  noise: ['Noisy neighbour', ['Hey, the music is loud, turn it down!', 'Hi, the music is quite loud at night. Can you turn it down?', 'Hello, I wonder if you could keep the music down after 10 pm, please?', 'Dear Neighbour, I hope you are well. Could we agree on quieter evenings? I would appreciate it.', 'Dear Mr. Khan, I hope you will not mind my writing. The music in the evenings has been affecting my sleep, and I would be most grateful if it could be kept lower after 10 pm. Kind regards, Asha']],
};
const LV = ['Very casual', 'Friendly', 'Neutral polite', 'Formal', 'Very formal'];
export default function (host) {
  let k = 'leave', lv = 2;
  const cv = canvas(host, { aspect: 0.85, max: 300, min: 250, label: 'An email changing from casual to formal' });
  const ctl = row(host), out = readout(host);
  choice(ctl, 'Situation', Object.keys(E).map((x) => [x, E[x][0]]), k, (v) => { k = v; upd(); });
  slider(row(host), { label: 'Formality', min: 0, max: 4, step: 1, value: lv, fmt: (v) => LV[Math.round(v)], oninput: (v) => { lv = Math.round(v); upd(); } });
  const upd = () => { out.textContent = ['Fine for a close friend only: slang, no greeting formality.', 'Fine for a colleague you know well.', 'A safe default for most everyday emails.', 'For a manager or an official: polite requests, full forms.', 'For a stranger or an official letter: very polite, "I would be grateful".'][lv]; cv.redraw(); };
  cv.draw = (ctx, W, H, col) => {
    title(ctx, 'Level ' + (lv + 1) + ': ' + LV[lv], col);
    for (let i = 0; i < 5; i++) { ctx.fillStyle = i <= lv ? col.s[0] : col.line; ctx.fillRect(14 + i * ((W - 28) / 5), 36, (W - 28) / 5 - 3, 7); }
    wrap(ctx, E[k][1][lv], 16, 70, W - 32, 24, { color: col.ink, size: 15 });
  };
  upd();
}
