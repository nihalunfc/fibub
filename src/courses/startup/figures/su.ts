// Page script for every Start a startup lesson (loaded once by the country switch figure):
// - the country switch (All three / India / Canada / USA), kept for this tab and in the link as ?country=ca
// - step players: <div class="su-steps"> around an ordered list becomes Back / Next with a progress bar
// - checklists: <div class="su-check" data-name="..."> around a task list gets live ticks, Download and Print
// - gentle text animations: highlighted words and boxes ease in as they scroll into view
const KEY = 'fibub-startup-cc';
const NAMES: Record<string, string> = { all: 'All three', in: 'India', ca: 'Canada', us: 'USA' };

export function setCountry(cc: string) {
  if (!NAMES[cc]) cc = 'all';
  document.documentElement.dataset.cc = cc;
  try { sessionStorage.setItem(KEY, cc); } catch { /* private mode: fine */ }
  document.querySelectorAll<HTMLButtonElement>('[data-set-cc]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.setCc === cc)));
  document.dispatchEvent(new CustomEvent('su-country', { detail: cc }));
}
export const getCountry = () => document.documentElement.dataset.cc || 'all';

function initCountry() {
  let cc = new URLSearchParams(location.search).get('country') || '';
  if (!NAMES[cc]) { try { cc = sessionStorage.getItem(KEY) || 'all'; } catch { cc = 'all'; } }
  setCountry(cc);
  document.querySelectorAll<HTMLButtonElement>('[data-set-cc]').forEach((b) => b.addEventListener('click', () => {
    setCountry(b.dataset.setCc!);
    const u = new URL(location.href);
    if (b.dataset.setCc === 'all') u.searchParams.delete('country'); else u.searchParams.set('country', b.dataset.setCc!);
    history.replaceState(null, '', u);
  }));
}

function initSteps() {
  document.querySelectorAll<HTMLElement>('.su-steps').forEach((box) => {
    const ol = box.querySelector('ol'); if (!ol || box.dataset.ready) return;
    box.dataset.ready = '1';
    const items = [...ol.children] as HTMLElement[];
    if (items.length < 2) return;
    let i = 0, all = false;
    const bar = document.createElement('div'); bar.className = 'su-bar'; bar.innerHTML = '<i></i>';
    const nav = document.createElement('div'); nav.className = 'su-nav';
    nav.innerHTML = '<button type="button" class="btn secondary" data-b>Back</button><span aria-live="polite"></span><button type="button" class="btn" data-n>Next</button><button type="button" class="su-link" data-a>Show all steps</button>';
    box.prepend(bar); box.append(nav);
    const [back, , next, show] = [...nav.children] as HTMLButtonElement[];
    const say = nav.querySelector('span')!;
    function draw() {
      items.forEach((li, k) => { li.hidden = !all && k !== i; li.classList.toggle('su-in', !all && k === i); });
      (bar.firstChild as HTMLElement).style.width = `${all ? 100 : ((i + 1) / items.length) * 100}%`;
      say.textContent = all ? `${items.length} steps` : `Step ${i + 1} of ${items.length}`;
      back.disabled = all || i === 0; next.disabled = all || i === items.length - 1;
      show.textContent = all ? 'One step at a time' : 'Show all steps';
    }
    back.onclick = () => { i = Math.max(0, i - 1); draw(); };
    next.onclick = () => { i = Math.min(items.length - 1, i + 1); draw(); };
    show.onclick = () => { all = !all; draw(); };
    box.classList.add('su-live'); draw();
  });
}

const lineOf = (li: Element) => (li.cloneNode(true) as HTMLElement).textContent!.replace(/\s+/g, ' ').trim();
function download(name: string, text: string, type = 'text/plain') {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([text], { type }));
  a.download = name; document.body.append(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}
export const fileName = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
export { download };

function initChecks() {
  document.querySelectorAll<HTMLElement>('.su-check').forEach((box) => {
    if (box.dataset.ready) return; box.dataset.ready = '1';
    const name = box.dataset.name || 'Checklist';
    const boxes = [...box.querySelectorAll<HTMLInputElement>('input[type=checkbox]')];
    boxes.forEach((b) => { b.disabled = false; b.checked = false; });
    const tools = document.createElement('div'); tools.className = 'su-checktools';
    tools.innerHTML = '<span aria-live="polite"></span><button type="button" class="btn secondary" data-dl>Download checklist</button><button type="button" class="btn secondary" data-pr>Print</button>';
    box.append(tools);
    const count = tools.querySelector('span')!;
    const upd = () => { count.textContent = `${boxes.filter((b) => b.checked).length} of ${boxes.length} done`; };
    boxes.forEach((b) => b.addEventListener('change', upd)); upd();
    tools.querySelector<HTMLButtonElement>('[data-dl]')!.onclick = () => {
      const lines = [...box.querySelectorAll('li')].filter((li) => li.querySelector('input')).map((li) => `[${li.querySelector<HTMLInputElement>('input')!.checked ? 'x' : ' '}] ${lineOf(li)}`);
      download(`${fileName(name)}.txt`, `${name}\n${'='.repeat(name.length)}\nFrom fibub.com${location.pathname} (${new Date().toISOString().slice(0, 10)})\nNot legal or tax advice: check each step with the official source.\n\n${lines.join('\n')}\n`);
    };
    tools.querySelector<HTMLButtonElement>('[data-pr]')!.onclick = () => {
      box.classList.add('su-print'); document.documentElement.classList.add('su-printing');
      const done = () => { box.classList.remove('su-print'); document.documentElement.classList.remove('su-printing'); removeEventListener('afterprint', done); };
      addEventListener('afterprint', done); print(); setTimeout(done, 2000);
    };
  });
}

function initReveal() {
  const els = document.querySelectorAll<HTMLElement>('.cs-body mark, .cs-body .cc, .cs-body blockquote, .cs-body .su-fig');
  if (!('IntersectionObserver' in window) || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('su-seen'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px' });
  els.forEach((el) => { el.classList.add('su-anim'); io.observe(el); });
}

initCountry(); initSteps(); initChecks(); initReveal();
