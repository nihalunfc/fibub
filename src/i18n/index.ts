// Site text in the page's language. Pages call useLang(code) once and read everything through it,
// so a missing translation quietly falls back to English instead of breaking the page.
import { UI, CLIENT_KEYS, type UIKey } from './en';
import { LANGS as ALL_LANGS, DEFAULT_LANG, langByCode, type Lang } from './langs';
import { SHELVES, SUBJECTS, SECTIONS } from '../site';

export { DEFAULT_LANG, langByCode } from './langs';
export type { Lang } from './langs';

type Named = { name?: string; blurb?: string };
export type LangFile = {
  ui?: Partial<Record<UIKey, string>>;
  shelves?: Record<string, Named>;
  subjects?: Record<string, Named>;
  sections?: Record<string, Named>;
  tools?: Record<string, string>; // tool id -> its one-line summary
};

const files = import.meta.glob('./*.json', { eager: true, import: 'default' }) as Record<string, LangFile>;
export const langFile = (code: string): LangFile => files[`./${code}.json`] ?? {};

// A language goes live (pages built, listed in the language menu) once it has its file,
// src/i18n/<code>.json. Each language arrives in its own pull request.
export const LANGS = ALL_LANGS.filter((l) => l.code === DEFAULT_LANG || files[`./${l.code}.json`]);
export const OTHER_LANGS = LANGS.filter((l) => l.code !== DEFAULT_LANG);

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** Fill {words} in a template. Every value also comes as {word_lc}, in lower case. */
export function fill(tpl: string, vars: Record<string, string | number> = {}) {
  return tpl.replace(/\{(\w+?)(_lc)?\}/g, (m, k, lc) => (k in vars ? (lc ? String(vars[k]).toLowerCase() : String(vars[k])) : m));
}

/** The address of a page in a language: '/science/' -> '/ml/science/'. English keeps the plain address. */
export const localPath = (code: string, path: string) => (code === DEFAULT_LANG ? path : `/${code}${path}`);

/** A page's language-neutral address: '/ml/science/' -> '/science/'. */
export function neutralPath(path: string) {
  const m = path.match(/^\/([a-z]{2})(\/.*)$/);
  return m && LANGS.some((l) => l.code === m[1] && l.code !== DEFAULT_LANG) ? m[2] : path;
}

export function useLang(code: string = DEFAULT_LANG) {
  const lang: Lang = langByCode(code);
  const file = langFile(lang.code);
  const en = lang.code === DEFAULT_LANG;
  const raw = (key: UIKey) => (!en && file.ui?.[key]) || UI[key];
  const url = (path: string) => localPath(lang.code, path);
  const links: Record<string, string> = { home: url('/'), contact: '/contact/' };

  return {
    lang,
    code: lang.code,
    en,
    htmlLang: lang.html ?? lang.code,
    dir: lang.dir ?? 'ltr',
    url,
    /** Plain text (links shown as their words). */
    t: (key: UIKey, vars?: Record<string, string | number>) => fill(raw(key), vars).replace(/\[([^\]]+)\]\((\w+)\)/g, '$1'),
    /** HTML: the text escaped, with [words](home) links turned into real links. */
    rich: (key: UIKey, vars?: Record<string, string | number>, extra: Record<string, string> = {}) =>
      esc(fill(raw(key), vars)).replace(/\[([^\]]+)\]\((\w+)\)/g, (m, words, k) => {
        const href = extra[k] ?? links[k];
        return href ? `<a href="${esc(href)}">${words}</a>` : words;
      }),
    shelf: (id: string) => {
      const s = SHELVES.find((x) => x.id === id)!;
      return { id, name: (!en && file.shelves?.[id]?.name) || s.name, blurb: (!en && file.shelves?.[id]?.blurb) || s.blurb };
    },
    subject: <T extends { id: string; name: string; blurb: string }>(sj: T): T => ({
      ...sj,
      name: (!en && file.subjects?.[sj.id]?.name) || sj.name,
      blurb: (!en && file.subjects?.[sj.id]?.blurb) || sj.blurb,
    }),
    section: <T extends { id: string; name: string; blurb?: string }>(sec: T): T => ({
      ...sec,
      name: (!en && file.sections?.[sec.id]?.name) || sec.name,
      blurb: (!en && file.sections?.[sec.id]?.blurb) || sec.blurb,
    }),
    summary: (tool: { id: string; data: { summary: string } }) => (!en && file.tools?.[tool.id]) || tool.data.summary,
    toolUrl: (tool: { id: string; data: { shelf: string } }) => url(`/${tool.data.shelf}/${tool.id}/`),
    /** The strings the page scripts use, as JSON for a <script type="application/json">. */
    clientJson: () => JSON.stringify({ lang: lang.code, prefix: en ? '' : `/${lang.code}`, ui: Object.fromEntries(CLIENT_KEYS.map((k) => [k, raw(k)])) }).replace(/</g, '\\u003c'),
  };
}

export type L = ReturnType<typeof useLang>;

/** How much of a language is done, for the build report and tests. */
export function coverage(code: string, toolIds: string[]) {
  const f = langFile(code);
  const uiKeys = Object.keys(UI) as UIKey[];
  return {
    ui: uiKeys.filter((k) => f.ui?.[k]).length / uiKeys.length,
    tools: toolIds.filter((id) => f.tools?.[id]).length / Math.max(1, toolIds.length),
    missingTools: toolIds.filter((id) => !f.tools?.[id]),
  };
}

/**
 * Catch mistakes in the language files when the site builds: unknown keys (typos), and {words}
 * the English text does not have (they would show up as {typo} on the page), and dropped links.
 */
export function checkLangFiles(toolIds: string[]) {
  const errors: string[] = [];
  const vars = (s: string) => [...s.matchAll(/\{(\w+?)(?:_lc)?\}/g)].map((m) => m[1]).sort().filter((v, i, a) => a.indexOf(v) === i).join(',');
  const links = (s: string) => [...s.matchAll(/\]\((\w+)\)/g)].map((m) => m[1]).sort().join(',');
  const shelves = new Set(SHELVES.map((s) => s.id)), subjects = new Set(ALL_SUBJECTS.map((s) => s.id)), sections = new Set(ALL_SECTIONS.map((s) => s.id)), tools = new Set(toolIds);
  for (const l of OTHER_LANGS) {
    const f = langFile(l.code);
    for (const [k, v] of Object.entries(f.ui ?? {})) {
      if (!(k in UI)) { errors.push(`${l.code}.json: unknown ui key "${k}"`); continue; }
      const en = UI[k as UIKey];
      const extra = vars(v).split(',').filter((x) => x && !vars(en).split(',').includes(x));
      if (extra.length) errors.push(`${l.code}.json: ui.${k} uses {${extra.join('}, {')}}, which the English text does not have`);
      if (links(v) !== links(en)) errors.push(`${l.code}.json: ui.${k} must keep the links (${links(en)}) of the English text`);
    }
    for (const k of Object.keys(f.shelves ?? {})) if (!shelves.has(k)) errors.push(`${l.code}.json: unknown shelf "${k}"`);
    for (const k of Object.keys(f.subjects ?? {})) if (!subjects.has(k)) errors.push(`${l.code}.json: unknown subject "${k}"`);
    for (const k of Object.keys(f.sections ?? {})) if (!sections.has(k)) errors.push(`${l.code}.json: unknown section "${k}"`);
    for (const k of Object.keys(f.tools ?? {})) if (!tools.has(k)) errors.push(`${l.code}.json: unknown tool "${k}"`);
  }
  if (errors.length) throw new Error('Language files:\n  ' + errors.join('\n  '));
}

export const ALL_SECTIONS = Object.values(SECTIONS).flat();
export const ALL_SUBJECTS = Object.values(SUBJECTS).flat();
