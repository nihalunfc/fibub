// One place for the site's name, shelves and links. Pages read from here.
export const SITE = {
  name: 'fibub',
  url: 'https://fibub.com',
  tagline: 'Free tools that run in your browser',
  meaning: 'Free In-Browser Utility Bubble',
  description:
    'Free tools for documents, money, data, everyday tasks and science, made to fill the gaps other tools leave. Everything runs in your browser: your files and numbers never leave your device.',
  maker: { name: 'Nihal Sulaiman', url: 'https://nihalsulaiman.com' },
};

// The shelves. A tool's `shelf` must be one of these ids; it sets the tool's URL: /<shelf>/<tool>/.
export const SHELVES = [
  { id: 'money', name: 'Money', blurb: 'Budgets, loans, taxes and currency.' },
  { id: 'documents', name: 'Documents', blurb: 'PDFs and images, processed on your device.' },
  { id: 'everyday', name: 'Everyday', blurb: 'Dates, units, time zones and more.' },
  { id: 'science', name: 'Science', blurb: 'Astronomy and more science tools, worked out in your browser.' },
] as const;

// Sections group the tools on a big shelf (shown as collapsible groups and in the header menu).
// A tool joins one with `section:` in its guide.md.
export const SECTIONS: Record<string, { id: string; name: string; blurb: string }[]> = {
  science: [
    { id: 'observing', name: 'Astronomy: observing', blurb: 'Plan the night, find what is up, line up the mount and log what you see.' },
    { id: 'astrophotography', name: 'Astronomy: astrophotography', blurb: 'Size up your telescope and camera, set exposures and open FITS files.' },
    { id: 'research', name: 'Astronomy: research', blurb: 'Coordinates, time systems and catalogue work for students and researchers.' },
  ],
};

export type ShelfId = (typeof SHELVES)[number]['id'];
export const SHELF_IDS = SHELVES.map((s) => s.id) as [ShelfId, ...ShelfId[]];
export const shelfById = (id: string) => SHELVES.find((s) => s.id === id)!;
