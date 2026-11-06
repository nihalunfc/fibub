// One place for the site's name, shelves and links. Pages read from here.
export const SITE = {
  name: 'fibub',
  url: 'https://fibub.com',
  tagline: 'Free everyday tools that never see your files',
  description:
    'Free online tools for money, documents and everyday tasks. Everything runs in your browser: your files and numbers never leave your device.',
  maker: { name: 'Nihal Sulaiman', url: 'https://nihalsulaiman.com' },
};

// The three shelves. A tool's `shelf` must be one of these ids; it sets the tool's URL: /<shelf>/<tool>/.
export const SHELVES = [
  { id: 'money', name: 'Money', blurb: 'Budgets, loans, taxes and currency.' },
  { id: 'documents', name: 'Documents', blurb: 'PDFs and images, processed on your device.' },
  { id: 'everyday', name: 'Everyday', blurb: 'Dates, units, time zones and more.' },
] as const;

export type ShelfId = (typeof SHELVES)[number]['id'];
export const SHELF_IDS = SHELVES.map((s) => s.id) as [ShelfId, ...ShelfId[]];
export const shelfById = (id: string) => SHELVES.find((s) => s.id === id)!;
