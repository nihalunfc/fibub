// Types for the shared question bank (qbank). Full format with examples: /mnt/project-files/qbank/spec.md.
// Data lives in public/qbank/<bank>/index.js (QBankIndex) and public/qbank/<bank>/<topic>.js (QTopicFile).
export type QType = 'mcq' | 'msq' | 'nat' | 'text' | 'open' | (string & {});
export type QFormat = 'single' | 'multi' | 'integer' | 'numeric' | 'assertion' | 'statements' | 'match' | 'passage' | (string & {});

export interface QGroup {
  title?: string;
  passage?: string;                        // HTML, shown beside its questions on wide screens
  options?: string[];                      // shared option list (matching headings, features, endings)
  list1?: string[]; list2?: string[];      // match-the-following columns
  audio?: { who: string; text: string }[]; // read aloud by the browser (speechSynthesis)
}

export interface QItem {
  id: string;
  type: QType;
  level: 1 | 2 | 3 | 4 | 5;               // 1 warm-up, 2 standard, 3 exam, 4 hard, 5 top rank
  q: string;                               // HTML with $...$ / $$...$$ TeX
  options?: string[];
  answer?: number | number[] | string[];   // mcq index | msq indices | nat value | text accepted answers
  tol?: number;                            // nat: absolute tolerance
  unit?: string;
  sol: string;
  sub?: string;
  exams?: string[];
  format?: QFormat;
  facets?: Record<string, string>;
  marks?: number;
  trap?: string;
  group?: string;
  maxWords?: number;
  model?: string; checklist?: string[]; timers?: { prep?: number; speak?: number; words?: number };
}

export interface QGen extends Omit<QItem, 'q' | 'sol' | 'answer' | 'options'> {
  make(rng: () => number): Partial<QItem> & { q: string; sol: string; [k: string]: unknown };
  verify?(made: Record<string, unknown>): number;
}

export interface QTopicFile {
  topic: string;
  groups?: Record<string, QGroup>;
  items: QItem[];
  gens?: QGen[] | Record<string, Omit<QGen, 'id'>>;
}

export interface QBankIndex {
  id: string;
  name: string;
  exams?: Record<string, string>;
  facets?: Record<string, { label: string; values: Record<string, string> }>;
  units: { id: string; name: string; topics: { id: string; name: string }[] }[];
}
