// Practice drill for the English exam courses: a short round of original questions with instant marking,
// the reason for every answer and a "New questions" button. Items use the field names of the shared fibub
// question bank (/mnt/project-files/qbank/spec.md) so they can move there unchanged:
//   { id, type: 'mcq' | 'text' | 'order', q, options, answer, sol, group?, maxWords?, trap? }
//   mcq: answer = index; text: answer = accepted strings; order: options = word chips, answer = array of
//   accepted sentences (strings).
// A set file is public/learn-kit/<course>/sets/<name>.js:
//   export default { title, accent: 'en-CA', groups: { g1: { title, passage, audio: [{who, name, text}] } }, items: [...] }
// In a lesson: <figure class="fig" data-fig="drill" data-set="name" data-n="5"><figcaption>...</figcaption></figure>
// Scores live only on the page; nothing is stored or sent.
import { put } from '../kit.js';
import { player, stopAll } from './speech.js';
import { checkItem } from './check.js';

const shuffle = (a) => { a = [...a]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

/** Pick a round: whole groups stay together, then single items, until about n items. */
function pickRound(set, n) {
  const byGroup = new Map();
  const singles = [];
  for (const it of set.items) it.group ? (byGroup.get(it.group) || byGroup.set(it.group, []).get(it.group)).push(it) : singles.push(it);
  const units = shuffle([...byGroup.values(), ...singles.map((s) => [s])]);
  const out = [];
  let count = 0;
  for (const u of units) { if (count >= n) break; out.push(u); count += u.length; }
  return out;
}

export default async function (host, { data }) {
  const base = document.querySelector('[data-kit]')?.dataset.kit || '';
  const set = (await import(`${base}sets/${data.set}.js`)).default;
  const n = +(data.n || 5);
  const accent = set.accent || 'en-CA';
  const wrap = put(host, document.createElement('div'));
  wrap.className = 'en-drill';

  const round = () => {
    stopAll();
    wrap.innerHTML = '';
    const head = document.createElement('p');
    head.className = 'lk-p-head';
    head.textContent = `Practice: ${set.title}`;
    wrap.appendChild(head);
    const units = pickRound(set, n);
    const readers = [];
    let num = 0;
    for (const unit of units) {
      const g = unit[0].group ? set.groups[unit[0].group] : null;
      const box = document.createElement('div');
      box.className = 'en-unit';
      let pl = null;
      if (g) {
        if (g.title) { const t = document.createElement('p'); t.className = 'en-gtitle'; t.innerHTML = g.title; box.appendChild(t); }
        if (g.audio) { pl = player(g.audio, { accent, examOnce: data.once === '1', showTranscript: true }); box.appendChild(pl); }
        if (g.passage) { const p = document.createElement('div'); p.className = 'en-passage'; p.innerHTML = g.passage; box.appendChild(p); }
      }
      for (const it of unit) {
        num++;
        const q = document.createElement('div');
        q.className = 'en-q';
        q.innerHTML = `<p class="en-qtext"><b>${num}.</b> ${it.q}</p>`;
        let read;
        if (it.type === 'mcq') {
          const order = shuffle(it.options.map((_, i) => i));
          const name = `q${Math.random().toString(36).slice(2)}`;
          const list = document.createElement('div');
          list.className = 'en-opts';
          for (const i of order) {
            const lab = document.createElement('label');
            lab.innerHTML = `<input type="radio" name="${name}" value="${i}"> <span>${it.options[i]}</span>`;
            list.appendChild(lab);
          }
          q.appendChild(list);
          read = () => { const c = list.querySelector('input:checked'); return c ? +c.value : null; };
        } else if (it.type === 'text') {
          const inp = Object.assign(document.createElement('input'), { type: 'text', autocomplete: 'off', spellcheck: false, className: 'en-input', placeholder: it.maxWords ? `No more than ${it.maxWords === 1 ? 'one word' : it.maxWords + ' words'}` : 'Type your answer' });
          inp.setAttribute('aria-label', `Answer to question ${num}`);
          q.appendChild(inp);
          read = () => (inp.value.trim() ? inp.value : null);
        } else if (it.type === 'order') {
          const built = document.createElement('div'); built.className = 'en-built'; built.setAttribute('aria-label', 'Your sentence');
          const pool = document.createElement('div'); pool.className = 'en-pool';
          const chips = shuffle(it.options).map((w) => {
            const b = Object.assign(document.createElement('button'), { type: 'button', className: 'en-chip', textContent: w });
            b.addEventListener('click', () => { (b.parentNode === pool ? built : pool).appendChild(b); });
            pool.appendChild(b);
            return b;
          });
          const clear = Object.assign(document.createElement('button'), { type: 'button', className: 'lk-btn en-small', textContent: 'Clear' });
          clear.addEventListener('click', () => chips.forEach((c) => pool.appendChild(c)));
          q.append(built, pool, clear);
          read = () => { const ws = [...built.children].map((c) => c.textContent); return ws.length ? ws.join(' ') : null; };
        }
        const fb = document.createElement('div');
        fb.className = 'en-fb'; fb.hidden = true;
        q.appendChild(fb);
        box.appendChild(q);
        readers.push({ it, read, fb, q, pl });
      }
      wrap.appendChild(box);
    }
    const bar = document.createElement('div');
    bar.className = 'lk-controls';
    const check = Object.assign(document.createElement('button'), { type: 'button', className: 'lk-btn lk-primary', textContent: 'Check answers' });
    const again = Object.assign(document.createElement('button'), { type: 'button', className: 'lk-btn', textContent: '↻ New questions' });
    const score = document.createElement('p');
    score.className = 'lk-p-fb'; score.setAttribute('role', 'status');
    bar.append(check, again);
    wrap.append(bar, score);
    check.addEventListener('click', () => {
      let right = 0, blank = 0;
      for (const r of readers) {
        const v = r.read();
        if (v === null) blank++;
        const ok = v !== null && checkItem(r.it, v);
        if (ok) right++;
        const ans = r.it.type === 'mcq' ? r.it.options[r.it.answer] : r.it.answer[0];
        r.fb.hidden = false;
        r.fb.className = 'en-fb ' + (ok ? 'ok' : 'no');
        r.fb.innerHTML = `<p><b>${ok ? '✓ Correct.' : v === null ? 'Not answered.' : '✗ Not quite.'}</b> ${ok ? '' : `Answer: <b>${ans}</b>`}</p><p>${r.it.sol}</p>${!ok && r.it.trap ? `<p class="en-trap"><b>Why it is tempting:</b> ${r.it.trap}</p>` : ''}`;
        r.pl?.reveal?.();
      }
      score.className = 'lk-p-fb ' + (right === readers.length ? 'ok' : 'no');
      score.textContent = `You got ${right} of ${readers.length}${blank ? ` (${blank} left blank)` : ''}. ${right === readers.length ? 'Excellent!' : 'Read the reasons above, then try a new set.'}`;
    });
    again.addEventListener('click', () => { round(); head.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); });
  };
  round();
}
