// Nobel Prize series on the Blog (src/blog/nobel/<slug>.md, shown at /blog/nobel/<slug>/).
// Each science prize of a year is one numbered series: "2 of 3 · Nobel Prize in Physics 2026".
// The order of `parts` is the reading order; the total shown is parts.length. A series' other
// years or fields are linked from every part (`group`). Laureates and citations are checked against
// nobelprize.org and the Royal Swedish Academy of Sciences (kva.se); see each article's sources.
export type Part = { slug: string; short: string };
export type Series = {
  id: string; group: string; field: string; year: number; name: string;
  laureates: string; citation: string; announced: string; parts: Part[];
};

export const SERIES: Series[] = [
  {
    id: 'physics-2026', group: '2026', field: 'Physics', year: 2026, name: 'Nobel Prize in Physics 2026',
    laureates: 'Francis Halzen',
    citation: 'for decisive contributions to the IceCube Neutrino Observatory and the discovery of high-energy neutrinos of astrophysical origin',
    announced: '2026-10-06',
    parts: [
      { slug: 'physics-2026-neutrinos-cherenkov-ice', short: 'The ghost particle and the ice telescope idea' },
      { slug: 'physics-2026-icecube-cosmic-neutrinos', short: 'Building IceCube and the first cosmic neutrinos' },
      { slug: 'physics-2026-neutrino-sources', short: 'Blazars, a resonance, galaxies and our Milky Way' },
    ],
  },
  {
    id: 'chemistry-2026', group: '2026', field: 'Chemistry', year: 2026, name: 'Nobel Prize in Chemistry 2026',
    laureates: 'Henri B. Kagan and Kenso Soai',
    citation: 'for the discovery of non-linear effects and autocatalysis in asymmetric organic synthesis',
    announced: '2026-10-07',
    parts: [
      { slug: 'chemistry-2026-mirror-molecules-catalysis', short: 'Mirror molecules and making just one' },
      { slug: 'chemistry-2026-kagan-non-linear-effects', short: 'Kagan\'s non-linear effects' },
      { slug: 'chemistry-2026-soai-autocatalysis-homochirality', short: 'Soai\'s self-copying reaction and life\'s one hand' },
    ],
  },
  {
    id: 'medicine-2026', group: '2026', field: 'Physiology or Medicine', year: 2026, name: 'Nobel Prize in Physiology or Medicine 2026',
    laureates: 'Karl Deisseroth, Peter Hegemann and Georg Nagel',
    citation: 'for their discoveries concerning light-gated ion channels and optogenetics',
    announced: '2026-10-05',
    parts: [
      { slug: 'medicine-2026-neurons-algae-light', short: 'Nerve signals and an alga that sees' },
      { slug: 'medicine-2026-channelrhodopsin', short: 'Channelrhodopsin, a channel opened by light' },
    ],
  },
];

/** The series an article belongs to, its 1-based part number and its neighbours. */
export function placeOf(slug: string) {
  for (const s of SERIES) {
    const i = s.parts.findIndex((p) => p.slug === slug);
    if (i >= 0) return { series: s, part: i + 1, total: s.parts.length, prev: s.parts[i - 1], next: s.parts[i + 1], others: SERIES.filter((o) => o !== s && o.group === s.group) };
  }
  return null;
}
export const partUrl = (slug: string) => `/blog/nobel/${slug}/`;
