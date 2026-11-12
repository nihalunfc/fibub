// Vehicles by country (nihal, 2026-11-12). A country page (/vehicles/india/ ...) links to each tool with
// ?c=<country>, and a tool calls presetCountry() so it opens on that country's rules, units and currency.
// Nothing is stored: the choice lives only in the address.
export type Country = 'india' | 'canada' | 'usa' | 'uk' | 'gulf';
export const COUNTRY_IDS: Country[] = ['india', 'canada', 'usa', 'uk', 'gulf'];

/** The country in the address (?c=india), or null. */
export function urlCountry(): Country | null {
  const c = new URLSearchParams(location.search).get('c');
  return c && (COUNTRY_IDS as string[]).includes(c) ? (c as Country) : null;
}

/**
 * Set a region <select> from ?c=. `map` turns a country into the select's own value (for example
 * { usa: 'us', india: 'in' }); without one the country id is used. Fires `change` so the tool updates.
 * Returns the country that was applied, or null.
 */
export function presetCountry(sel: HTMLSelectElement | null, map: Partial<Record<Country, string>> = {}): Country | null {
  const c = urlCountry();
  if (!c || !sel) return null;
  const v = map[c] ?? c;
  if (![...sel.options].some((o) => o.value === v)) return null;
  sel.value = v;
  sel.dispatchEvent(new Event('change', { bubbles: true }));
  sel.dispatchEvent(new Event('input', { bubbles: true }));
  return c;
}
