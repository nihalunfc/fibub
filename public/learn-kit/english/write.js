// Writing pad: a box to type a timed answer with a live word count against the target range, a countdown and a
// self-check list. Download your text as a .txt file. Nothing is saved or sent; leaving the page clears it.
// In a lesson: <figure class="fig" data-fig="write" data-min="150" data-max="200" data-minutes="27"
//   data-task="Task text (HTML)" data-checks="Answered all three points|Polite opening and closing|..."></figure>
import { put } from '../kit.js';

export default function (host, { data }) {
  const min = +(data.min || 150), max = +(data.max || 200), mins = +(data.minutes || 0);
  const checks = (data.checks || '').split('|').filter(Boolean);
  const box = put(host, document.createElement('div'));
  box.className = 'en-write';
  box.innerHTML = `
    ${data.task ? `<div class="en-task">${data.task}</div>` : ''}
    <div class="lk-controls">
      ${mins ? '<button type="button" class="lk-btn" data-t>⏱ Start ' + mins + '-minute timer</button>' : ''}
      <span class="en-clock" aria-live="off"></span>
    </div>
    <textarea rows="10" spellcheck="false" aria-label="Your answer" placeholder="Type your answer here. Spell check is off, as in the test."></textarea>
    <p class="en-count" aria-live="polite"></p>
    ${checks.length ? `<div class="en-checks"><p><b>Check your answer</b></p>${checks.map((c) => `<label class="en-check"><input type="checkbox"> ${c}</label>`).join('')}</div>` : ''}
    <div class="lk-controls"><button type="button" class="lk-btn" data-dl>⤓ Download my text</button></div>`;
  const ta = box.querySelector('textarea'), count = box.querySelector('.en-count'), clock = box.querySelector('.en-clock');
  const words = () => (ta.value.match(/[A-Za-z0-9’'-]+/g) || []).length;
  const show = () => {
    const w = words();
    const state = w === 0 ? '' : w < min ? 'no' : w > max ? 'warn' : 'ok';
    count.className = 'en-count ' + state;
    count.textContent = `${w} words · aim for ${min}-${max}` + (state === 'no' ? ` (${min - w} to go)` : state === 'warn' ? ' (over the range: trim a sentence)' : state === 'ok' ? ' ✓ in range' : '');
  };
  ta.addEventListener('input', show); show();
  let t = 0;
  box.querySelector('[data-t]')?.addEventListener('click', (e) => {
    if (t) { clearInterval(t); t = 0; e.target.textContent = `⏱ Start ${mins}-minute timer`; clock.textContent = ''; return; }
    const end = Date.now() + mins * 60000;
    e.target.textContent = '■ Stop timer';
    const tick = () => {
      const left = Math.max(0, end - Date.now());
      const m = Math.floor(left / 60000), s = Math.floor(left / 1000) % 60;
      clock.textContent = `${m}:${String(s).padStart(2, '0')} left`;
      clock.classList.toggle('en-late', left < 3 * 60000);
      if (!left) { clearInterval(t); t = 0; clock.textContent = 'Time is up: stop typing and check your answer.'; e.target.textContent = `⏱ Start ${mins}-minute timer`; }
    };
    tick(); t = setInterval(tick, 1000);
  });
  box.querySelector('[data-dl]').addEventListener('click', () => {
    const url = URL.createObjectURL(new Blob([ta.value], { type: 'text/plain' }));
    const a = Object.assign(document.createElement('a'), { href: url, download: 'my-writing-answer.txt' });
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  });
}
