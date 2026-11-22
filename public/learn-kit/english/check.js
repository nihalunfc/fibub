// Answer checking for English drills (no page code, so tests/english.mjs can check it).
export const norm = (s) => String(s).toLowerCase().replace(/[’']/g, "'").replace(/[^a-z0-9'£$.:\- ]+/g, ' ').replace(/\s+/g, ' ').trim().replace(/\.$/, '');

export function checkItem(it, given) {
  if (it.type === 'mcq') return given === it.answer;
  if (it.type === 'text') {
    if (it.maxWords && norm(given).split(' ').filter(Boolean).length > it.maxWords) return false;
    return it.answer.some((a) => norm(a) === norm(given));
  }
  if (it.type === 'order') return it.answer.some((a) => norm(a) === norm(given));
  return false;
}
