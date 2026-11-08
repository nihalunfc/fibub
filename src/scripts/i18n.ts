// The page's language for scripts: its strings (written into the page by Base.astro as JSON) and the
// address prefix (/ml) that keeps links in the same language.
type Data = { lang: string; prefix: string; ui: Record<string, string> };
let data: Data = { lang: 'en', prefix: '', ui: {} };
try { data = { ...data, ...JSON.parse(document.getElementById('fibub-i18n')?.textContent || '{}') }; } catch { /* keep English */ }

export const lang = data.lang;
export const prefix = data.prefix;
export const tr = (key: string, vars: Record<string, string | number> = {}) =>
  (data.ui[key] ?? key).replace(/\{(\w+?)(_lc)?\}/g, (m, k, lc) => (k in vars ? (lc ? String(vars[k]).toLowerCase() : String(vars[k])) : m));
