// Metal prices for the Collecting shelf. The browser asks only fibub itself (GET /api/prices); the Worker
// fetches a public, CC0-licensed daily rate file and sends nothing about the visitor. If that fails, the
// tools fall back to the rough values below and say so. Visitors can type their own price for any metal;
// those are kept on their device only if they tick the box, under `fibub-my-prices-v1`.

export type Metal = 'gold' | 'silver' | 'platinum' | 'palladium';
export const METALS: { id: Metal; name: string }[] = [
  { id: 'gold', name: 'Gold' }, { id: 'silver', name: 'Silver' }, { id: 'platinum', name: 'Platinum' }, { id: 'palladium', name: 'Palladium' },
];
export type Prices = {
  date: string;            // the day the rates are for (YYYY-MM-DD)
  live: boolean;           // false = the rough built-in values
  source: string;
  metals: Record<Metal, number>;   // US dollars per troy ounce
  fx: Record<string, number>;      // units of each currency per US dollar
};

/** Rough values used only when the daily rates can't be loaded. Approximate late-2025 levels, not current. */
export const FALLBACK: Prices = {
  date: '2025-11-15', live: false,
  source: 'Rough built-in values (approximate late-2025 levels). Type today’s price for an accurate answer.',
  metals: { gold: 4000, silver: 50, platinum: 1550, palladium: 1400 },
  fx: { usd: 1, inr: 88.5, cad: 1.4, gbp: 0.76, eur: 0.86, aed: 3.6725, sar: 3.75, qar: 3.64, kwd: 0.307, omr: 0.3845, bhd: 0.376, aud: 1.53, nzd: 1.76, sgd: 1.3, jpy: 154, chf: 0.8, pkr: 281, lkr: 300, bdt: 122, npr: 141.6, myr: 4.15, zar: 17.3 },
};
export const SOURCE_URL = 'https://github.com/fawazahmed0/exchange-api';
export const CURRENCIES: [string, string][] = [
  ['usd', 'US dollar'], ['cad', 'Canadian dollar'], ['inr', 'Indian rupee'], ['gbp', 'British pound'], ['eur', 'Euro'],
  ['aed', 'UAE dirham'], ['sar', 'Saudi riyal'], ['qar', 'Qatari riyal'], ['kwd', 'Kuwaiti dinar'], ['omr', 'Omani rial'], ['bhd', 'Bahraini dinar'],
  ['aud', 'Australian dollar'], ['nzd', 'New Zealand dollar'], ['sgd', 'Singapore dollar'], ['jpy', 'Japanese yen'], ['chf', 'Swiss franc'],
  ['pkr', 'Pakistani rupee'], ['lkr', 'Sri Lankan rupee'], ['bdt', 'Bangladeshi taka'], ['npr', 'Nepalese rupee'], ['myr', 'Malaysian ringgit'], ['zar', 'South African rand'],
];

let cached: Promise<Prices> | null = null;
/** Today's rates from /api/prices, or the fallback. Checked for sane numbers before use. */
export function loadPrices(): Promise<Prices> {
  cached ??= fetch('/api/prices', { headers: { accept: 'application/json' } })
    .then((r) => (r.ok ? r.json() : null))
    .then((d: any) => {
      const m = d?.metals;
      const ok = m && m.gold > 300 && m.gold < 100000 && m.silver > 3 && m.silver < 2000 && typeof d.date === 'string' && d.fx && d.fx.inr > 0;
      if (!ok) return FALLBACK;
      return { date: d.date, live: true, source: 'Daily rates from the free exchange-api by Fawaz Ahmed (CC0, public domain)', metals: { ...FALLBACK.metals, ...m }, fx: { ...FALLBACK.fx, ...d.fx, usd: 1 } } as Prices;
    })
    .catch(() => FALLBACK);
  return cached;
}

// ---------- The visitor's own prices ----------
const KEY = 'fibub-my-prices-v1';
export type MyPrices = { cur: string; unit: 'ozt' | 'g'; own: Partial<Record<Metal, number>> };
export function readMine(): MyPrices | null { try { return JSON.parse(localStorage.getItem(KEY) || 'null'); } catch { return null; } }
export function saveMine(p: MyPrices | null) { try { if (p) localStorage.setItem(KEY, JSON.stringify(p)); else localStorage.removeItem(KEY); } catch {} }

const OZT = 31.1034768;
const fmt = (v: number, cur: string) => {
  try { return new Intl.NumberFormat(undefined, { style: 'currency', currency: cur.toUpperCase(), maximumFractionDigits: v < 100 ? 2 : 0 }).format(v); }
  catch { return `${v.toFixed(2)} ${cur.toUpperCase()}`; }
};
export const money = fmt;

export type PriceState = {
  cur: string;
  /** Price per troy ounce in the chosen currency: the visitor's own if typed, otherwise the daily rate. */
  perOzt: (m: Metal) => number;
  perGram: (m: Metal) => number;
  isOwn: (m: Metal) => boolean;
  fx: (cur: string) => number;
  prices: Prices;
};

/**
 * The shared price box: currency, unit, each metal's daily price and a box to type your own, the source and
 * date, and an opt-in "Remember my prices" tick. Calls `onChange` whenever a price or the currency changes.
 */
export async function mountPrices(el: HTMLElement, onChange: (s: PriceState) => void, only: Metal[] = ['gold', 'silver', 'platinum', 'palladium']) {
  const saved = readMine();
  let cur = saved?.cur ?? guessCurrency(), unit: 'ozt' | 'g' = saved?.unit ?? (cur === 'inr' || cur === 'aed' || cur === 'sar' ? 'g' : 'ozt');
  const own: Partial<Record<Metal, number>> = { ...(saved?.own ?? {}) }; // per troy ounce, in `cur`
  el.classList.add('cp');
  el.innerHTML = `
    <div class="cp-head"><label>Currency <select class="cp-cur">${CURRENCIES.map(([c, n]) => `<option value="${c}">${c.toUpperCase()} · ${n}</option>`).join('')}</select></label>
    <label>Price per <select class="cp-unit"><option value="ozt">troy ounce</option><option value="g">gram</option></select></label></div>
    <table class="cp-tab"><thead><tr><th>Metal</th><th>Today</th><th>Your price</th></tr></thead><tbody>${METALS.filter((m) => only.includes(m.id)).map((m) => `
      <tr data-m="${m.id}"><th>${m.name}</th><td class="cp-live">…</td><td><input type="number" min="0" step="any" inputmode="decimal" class="cp-own" aria-label="Your ${m.name.toLowerCase()} price" placeholder="use today’s" /></td></tr>`).join('')}</tbody></table>
    <p class="cp-src"></p>
    <label class="cp-keep"><input type="checkbox" class="cp-remember" /> Remember my prices on this device</label>
    <button type="button" class="cp-clear">Clear my prices</button>`;
  const q = <T extends HTMLElement>(s: string) => el.querySelector(s) as T;
  const curSel = q<HTMLSelectElement>('.cp-cur'), unitSel = q<HTMLSelectElement>('.cp-unit'), keep = q<HTMLInputElement>('.cp-remember');
  curSel.value = cur; unitSel.value = unit; keep.checked = !!saved;
  const prices = await loadPrices();
  const fx = (c: string) => prices.fx[c] ?? FALLBACK.fx[c] ?? 1;
  const conv = (v: number, from: string, to: string) => (v / fx(from)) * fx(to);
  const state: PriceState = {
    get cur() { return cur; },
    perOzt: (m) => (own[m] ? own[m]! : prices.metals[m] * fx(cur)),
    perGram: (m) => state.perOzt(m) / OZT,
    isOwn: (m) => !!own[m],
    fx, prices,
  } as PriceState;
  const show = (m: Metal) => (unit === 'g' ? state.perGram(m) : state.perOzt(m));
  const render = () => {
    el.querySelectorAll<HTMLTableRowElement>('tr[data-m]').forEach((tr) => {
      const m = tr.dataset.m as Metal, live = prices.metals[m] * fx(cur) / (unit === 'g' ? OZT : 1);
      tr.querySelector('.cp-live')!.textContent = fmt(live, cur);
      const inp = tr.querySelector('.cp-own') as HTMLInputElement;
      if (document.activeElement !== inp) inp.value = own[m] ? String(+show(m).toFixed(2)) : '';
    });
    q('.cp-src').innerHTML = `${prices.live ? 'Spot prices for' : '<b>Could not load today’s prices.</b> Showing rough values from'} <b>${prices.date}</b>. ${esc(prices.source)} (<a href="${SOURCE_URL}" rel="noopener">source</a>). Spot is the wholesale metal price; dealers and jewellers charge more. Check a dealer for a buying or selling price.`;
  };
  const store = () => { if (keep.checked) saveMine({ cur, unit, own }); };
  const emit = () => { render(); store(); onChange(state); };
  curSel.addEventListener('change', () => {
    for (const m of Object.keys(own) as Metal[]) own[m] = conv(own[m]!, cur, curSel.value);
    cur = curSel.value; emit();
  });
  unitSel.addEventListener('change', () => { unit = unitSel.value as 'ozt' | 'g'; emit(); });
  el.querySelectorAll<HTMLInputElement>('.cp-own').forEach((inp) => inp.addEventListener('input', () => {
    const m = (inp.closest('tr') as HTMLElement).dataset.m as Metal, v = parseFloat(inp.value);
    if (v > 0) own[m] = unit === 'g' ? v * OZT : v; else delete own[m];
    store(); onChange(state);
  }));
  keep.addEventListener('change', () => { if (keep.checked) store(); else saveMine(null); });
  q('.cp-clear').addEventListener('click', () => { for (const m of Object.keys(own) as Metal[]) delete own[m]; keep.checked = false; saveMine(null); emit(); });
  emit();
  return state;
}

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);
/** A starting currency from the browser's language (en-IN → INR); no location is looked up. */
export function guessCurrency() {
  const l = (navigator.language || 'en-US').toUpperCase();
  const map: Record<string, string> = { IN: 'inr', CA: 'cad', GB: 'gbp', AE: 'aed', SA: 'sar', QA: 'qar', KW: 'kwd', OM: 'omr', BH: 'bhd', AU: 'aud', NZ: 'nzd', SG: 'sgd', JP: 'jpy', CH: 'chf', PK: 'pkr', LK: 'lkr', BD: 'bdt', NP: 'npr', MY: 'myr', ZA: 'zar', DE: 'eur', FR: 'eur', IE: 'eur', ES: 'eur', IT: 'eur', NL: 'eur' };
  const region = l.split('-')[1];
  return (region && map[region]) || (l.startsWith('JA') ? 'jpy' : 'usd');
}
