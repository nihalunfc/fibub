// Every homepage design fibub has had, kept so any of them can come back (nihal's rule, 2026-11-10:
// keep every design as v1, v1.1, v2 ... and be able to switch at any time). Never delete a version.
// LIVE must match the import in src/pages/index.astro (npm test checks).
import V1 from './v1/Home.astro';
import V2 from './v2/Home.astro';

export const VERSIONS = [
  { id: 'v1', component: V1, date: '2026-11-10', about: 'the original: big tool count, search, My tools, then a block per shelf listing its tools, with the most used tools and site totals.' },
  { id: 'v2', component: V2, date: '2026-11-10', about: '"three doors": one-line intro and search first, then Learn, Tools and News panels in their area colours, the most used tools, and the site in numbers.' },
];

export const LIVE = 'v2';
