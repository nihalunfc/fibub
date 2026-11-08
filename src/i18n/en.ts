// Every piece of site text that is translated, in English. Other languages translate these values
// in src/i18n/<code>.json under "ui"; a key a language leaves out shows in English.
//
// Rules for translators (nihal's, 2026-11-08):
// - Translate the meaning, the way a native speaker would say it, not word for word.
// - Tool names, tool titles and button labels stay in English, so they are not in this list.
// - {name} style words are filled in by the site: keep them as they are. {shelf_lc} is the same as
//   {shelf} in lower case; use whichever reads right in your language.
// - [words](home) is a link: translate the words, keep the part in brackets after them.
export const UI = {
  // Header and the Tools panel
  homeAria: 'fibub home',
  shelvesAria: 'Shelves',
  shelfTools: '{shelf} tools',
  subjects: 'Subjects',
  nMore: '{n} more',
  allSubjectTools: 'All {n} {subject_lc} tools →',
  allShelfTools: 'All {shelf_lc} tools →',
  subjectPage: '{subject} page →',
  findTool: 'Find a tool',
  findToolKey: 'Find a tool (Ctrl+K)',
  findToolAria: 'Find a tool, or type #3 for tool number 3',
  closeList: 'Close the tool list',
  noMatch: 'No tool matches that yet. [Suggest it](contact).',
  savedHere: 'Saved only in this browser, never sent anywhere.',
  redLightAria: 'Red light for night use',
  redLightOff: 'Turn off red light',
  redLightTitle: 'Red light for night use: dim red on black keeps your eyes used to the dark',
  darkMode: 'Dark mode',
  lightMode: 'Light mode',
  themeTitle: 'Switch between light and dark',
  allToolsAria: 'All tools',
  addMine: 'Add {name} to My tools',
  removeMine: 'Remove {name} from My tools',
  addMineShort: 'Add to My tools',
  removeMineShort: 'Remove from My tools',

  // Language menu
  language: 'Language',
  chooseLanguage: 'Choose a language',
  languageNote: 'Tool names and buttons stay in English.',
  languageSuggest: 'Translations are new. [Suggest a better one](contact).',

  // Footer
  footerLine: 'Your files stay on your device.',
  developer: 'Developer',

  // Home page
  tagline: 'Free tools that run in your browser',
  siteDescription: 'Free tools for documents, money, data, everyday tasks and science, made to fill the gaps other tools leave. Everything runs in your browser: your files and numbers never leave your device.',
  heroTitle: 'Free tools that never see your files',
  heroLead: 'Tools for documents, money, everyday tasks and science. They all run in your browser: nothing is uploaded, nothing about you is saved, and there is no sign-up.',
  totalLabel: 'free tools, each with its own number',
  findPlaceholder: 'Find a tool, or #3',
  starredNote: 'Starred tools are saved only in this browser, never sent anywhere.',
  newest: 'Newest:',
  starHint: 'Tap the star next to a tool to add it to My tools. Then you can hide the rest and see only the tools you use.',
  comingNext: 'Coming next:',
  showingSome: 'Showing 60 of {n} tools. Add a word to narrow it down.',
  countOne: '1 tool',
  countMany: '{n} tools',

  // Shelf and subject pages
  home: 'Home',
  shelfDescription: 'Free {shelf_lc} tools that run in your browser. {blurb}',
  shelfLead: '{blurb} Free, with no sign-up.',
  nTools: '{n} tools',
  findShelfTool: 'Find a {shelf_lc} tool…',
  comingSoon: 'Coming soon',
  subjectTools: '{subject} tools',
  subjectDescription: '{n} free {subject_lc} tools that run in your browser. {blurb}',
  subjectLead: '{blurb} {n} free tools, with no sign-up. Nothing you enter leaves your device.',
  findSubjectTool: 'Find a {subject_lc} tool…',
  sectionsAria: 'Sections',
  noSubjectMatch: 'No {subject_lc} tool matches that yet. Try the search on the [home page](home), or [suggest it](contact).',

  // Tool pages
  toolNum: 'Tool #{n}',
  toolNumTitle: "This tool's number. Use it when you tell us about the tool.",
  bookmarkTip: 'Keep it one tap away for everyday use.',
  bookmarkTitle: 'Bookmark {name}?',
  bookmarkDesk: 'Press {keys} now. Your browser opens its own bookmark box, where you choose the name and folder.',
  bookmarkPhone: "Tap {add}, then choose {add} or {home} from your phone's list.",
  bookmarkMenu: 'Open your browser menu (⋮ or the share icon) and choose "Add bookmark" or "Add to Home Screen".',
  bookmarkPin: 'Also pin it to My tools on fibub (kept only in this browser)',
  pinnedTip: 'Pinned to My tools (in the Tools list).',
  worksWith: 'Works well with',
  nothingUploaded: 'Nothing is uploaded',
  worksOffline: 'Works offline once open',
  needsInternet: 'Needs internet',
  lastUpdated: 'Last updated {date}.',
  changeLogFor: 'Change log for {name}',
  latestChanges: 'Showing the latest 10 of {n} changes.',
  everyChange: 'Every change to fibub',
  suggestTitle: 'Have a suggestion, or found a bug?',
  suggestText: "Tell us what would make {name} more useful. Ideas that ship are credited, if you'd like.",
  relatedTools: 'Related tools',
  guideInEnglish: 'This guide is not in {lang} yet, so it is shown in English below.',
  guideTranslated: 'Translated from English. [Suggest a better translation](contact).',
  ogAlt: '{title}: free, no sign-up, on fibub.com',
};

export type UIKey = keyof typeof UI;

// The strings the page scripts need (search, My tools, bookmark box). They are written into each
// page as JSON so the scripts show them in the page's language.
export const CLIENT_KEYS: UIKey[] = [
  'addMine', 'removeMine', 'addMineShort', 'removeMineShort', 'showingSome', 'countOne', 'countMany',
  'bookmarkMenu', 'pinnedTip', 'bookmarkTip', 'darkMode', 'lightMode', 'redLightAria', 'redLightOff',
];
