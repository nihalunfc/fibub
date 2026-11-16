// Shared helpers for money, everyday, vehicle and (opt-in) documents tools: "Copy link with my numbers" and "Copy result".
// The link keeps the tool's own settings in the part after # of the address, which the browser never sends
// to any server. Opening such a link fills the same numbers in again. Nothing is stored, and nothing leaves
// the device. Text boxes, passwords and files are never put in a link. A tool can opt out with data-nokit.
// Documents pages are opt-in (an element with data-kit inside the tool) and share only settings: drop-downs,
// numbers, sliders, ticks and choices, never typed text, dates or file contents.

const SHELVES = ['money', 'everyday', 'vehicles', 'collecting', 'documents', 'science'];
const shelf = document.documentElement.dataset.shelf || '';
const DOCS = shelf === 'documents';
// Science pages share only settings too (selects, sliders, ticks, choices and number boxes), never typed notes or data.
const SCI = shelf === 'science';
const DOC_TYPES = ['number', 'range', 'checkbox', 'radio'];
const ui = document.querySelector<HTMLElement>('.tool-ui');

type Field = HTMLInputElement | HTMLSelectElement;

function fields(root: HTMLElement): Field[] {
  return [...root.querySelectorAll<Field>('input, select')].filter((f) => {
    if (f.closest('[data-nokit]')) return false;
    if (f instanceof HTMLInputElement && ['file', 'password', 'button', 'submit', 'reset', 'hidden', 'image'].includes(f.type)) return false;
    if ((DOCS || SCI) && f instanceof HTMLInputElement && !DOC_TYPES.includes(f.type) && !(SCI && f.type === 'text' && /^(decimal|numeric)$/.test(f.inputMode))) return false;
    return true;
  });
}

const keyOf = (f: Field, i: number) => f.dataset.k || (f instanceof HTMLInputElement && f.type === 'radio' ? 'r:' + f.name + ':' + f.value : f.name || f.id || 'i' + i);

function save(list: Field[]): string {
  const p = new URLSearchParams();
  list.forEach((f, i) => {
    const k = keyOf(f, i);
    if (f instanceof HTMLInputElement && (f.type === 'checkbox' || f.type === 'radio')) {
      if (f.checked !== f.defaultChecked) p.set(k, f.checked ? '1' : '0');
    } else if (f.value !== (f instanceof HTMLInputElement ? f.defaultValue : [...(f as HTMLSelectElement).options].find((o) => o.defaultSelected)?.value ?? (f as HTMLSelectElement).options[0]?.value)) {
      p.set(k, f.value.slice(0, 80));
    }
  });
  return p.toString();
}

function load(list: Field[], hash: string): number {
  const p = new URLSearchParams(hash);
  let n = 0;
  const fire = (f: Field) => { f.dispatchEvent(new Event('input', { bubbles: true })); f.dispatchEvent(new Event('change', { bubbles: true })); };
  const apply = (f: Field, i: number) => {
    const k = keyOf(f, i);
    if (!p.has(k)) return;
    const v = p.get(k)!;
    if (f instanceof HTMLInputElement && (f.type === 'checkbox' || f.type === 'radio')) f.checked = v === '1';
    else if (f instanceof HTMLSelectElement && ![...f.options].some((o) => o.value === v)) return;
    else f.value = v;
    n++;
  };
  // Choices first (a drop-down of presets may reset the number boxes), then the numbers typed on top of them.
  const isChoice = (f: Field) => f instanceof HTMLSelectElement || (f instanceof HTMLInputElement && (f.type === 'checkbox' || f.type === 'radio'));
  list.forEach((f, i) => { if (isChoice(f)) apply(f, i); });
  list.forEach((f) => { if (isChoice(f)) fire(f); });
  list.forEach((f, i) => { if (!isChoice(f)) apply(f, i); });
  if (n) list.forEach((f) => { if (!isChoice(f)) fire(f); });
  return n;
}

function resultText(root: HTMLElement): string {
  const live = [...root.querySelectorAll<HTMLElement>('[aria-live]')].filter((e) => e.textContent?.trim());
  const src = live.length ? live : [];
  return src.map((e) => e.innerText.replace(/\n{3,}/g, '\n\n').trim()).join('\n');
}

async function copy(text: string): Promise<boolean> {
  try { await navigator.clipboard.writeText(text); return true; } catch {
    const t = document.createElement('textarea');
    t.value = text; t.style.position = 'fixed'; t.style.opacity = '0';
    document.body.append(t); t.select();
    let ok = false;
    try { ok = document.execCommand('copy'); } catch { /* no clipboard */ }
    t.remove();
    return ok;
  }
}

if (ui && SHELVES.includes(shelf) && !ui.querySelector('[data-nokit-all]') && (!DOCS || ui.querySelector('[data-kit]'))) {
  const init = () => {
    const list = fields(ui);
    if (list.length < (DOCS ? 1 : 2)) return;
    // Apply a shared link (only when the hash looks like ours: key=value pairs, not a page anchor).
    if (location.hash.includes('=')) load(list, location.hash.slice(1));
    window.addEventListener('hashchange', () => { if (location.hash.includes('=')) load(fields(ui), location.hash.slice(1)); });
    const bar = document.createElement('div');
    bar.className = 'kit-bar';
    bar.innerHTML = '<button type="button" class="kit-link">Copy link with my ' + (DOCS ? 'settings' : 'numbers') + '</button><button type="button" class="kit-res">Copy result</button><span class="kit-msg" role="status" aria-live="polite"></span>';
    const msg = bar.querySelector<HTMLElement>('.kit-msg')!;
    const say = (t: string) => { msg.textContent = t; setTimeout(() => { if (msg.textContent === t) msg.textContent = ''; }, 2500); };
    const resBtn = bar.querySelector<HTMLButtonElement>('.kit-res')!;
    bar.querySelector('.kit-link')!.addEventListener('click', async () => {
      const q = save(fields(ui));
      const url = location.origin + location.pathname + (q ? '#' + q : '');
      history.replaceState(null, '', q ? '#' + q : location.pathname);
      say((await copy(url)) ? 'Link copied. It holds only these ' + (DOCS ? 'settings' : 'numbers') + '; nothing is sent anywhere.' : 'Copy the address from the bar above.');
    });
    resBtn.addEventListener('click', async () => {
      const t = resultText(ui);
      say(t ? ((await copy(t)) ? 'Result copied.' : 'Could not copy.') : 'Nothing to copy yet.');
    });
    if (!ui.querySelector('[aria-live]')) resBtn.hidden = true;
    const st = document.createElement('style');
    st.textContent = '.kit-bar{display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin:-18px 0 24px}.kit-bar button{font:inherit;font-size:14px;padding:8px 12px;min-height:40px;border:1px solid var(--line);border-radius:10px;background:var(--surface);color:var(--ink);cursor:pointer}.kit-bar button:hover{border-color:var(--accent);color:var(--accent)}.kit-msg{font-size:13px;color:var(--muted)}@media print{.kit-bar{display:none}}';
    document.head.append(st);
    ui.append(bar);
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else setTimeout(init, 0);
}
