// The school curricula Learn follows, and the free courses on offer. The home page's totals are worked
// out from these lists and from the tool files (src/lib/totals.ts), so adding a curriculum or a course
// here is all it takes for the numbers to grow. Nothing is counted by hand.
//
// To add a curriculum (for example Ontario, a US state or the UK national curriculum): write its chapter
// map like src/data/ncert.ts (a list of classes or grades, each with subjects and chapters that list
// tool ids), export it here with status 'live', and add its pages. A 'planned' entry is not counted.
import { CLASSES, type SchoolClass } from './ncert';

export type Curriculum = {
  id: string;
  name: string;      // as people say it, e.g. "NCERT (India)"
  country: string;
  grades: string;    // e.g. "Class 8 to 12"
  status: 'live' | 'planned';
  classes: SchoolClass[]; // empty while planned
};

export const CURRICULA: Curriculum[] = [
  { id: 'ncert', name: 'NCERT (India)', country: 'India', grades: 'Class 8 to 12', status: 'live', classes: CLASSES },
  { id: 'canada', name: 'Canada', country: 'Canada', grades: 'Grade 8 to 12', status: 'planned', classes: [] },
  { id: 'usa', name: 'United States', country: 'United States', grades: 'Grade 8 to 12', status: 'planned', classes: [] },
  { id: 'uk', name: 'United Kingdom', country: 'United Kingdom', grades: 'Year 9 to 13', status: 'planned', classes: [] },
];

export type Course = { id: string; name: string; text: string; status: 'live' | 'planned'; href?: string };

// Short free courses (see /learn/courses/). Mark one 'live' with its page address when it is published.
export const COURSES: Course[] = [
  { id: 'coding-data', name: 'Coding and data', text: 'Start with simple steps, then sort, count and draw charts from real-looking data.', status: 'planned' },
  { id: 'how-ai-works', name: 'How AI works', text: 'What a model is, how it learns from examples, and where it goes wrong, with small things to try.', status: 'planned' },
  { id: 'space-sky', name: 'Space and the sky', text: 'Find the planets tonight, measure the Moon, and learn how we know how far away stars are.', status: 'planned' },
  { id: 'climate-energy', name: 'Climate and energy', text: 'Weather, carbon and clean energy, worked out with your own numbers.', status: 'planned' },
  { id: 'money-basics', name: 'Money basics', text: 'Saving, interest and budgets, explained with calculators you can play with.', status: 'planned' },
  { id: 'think-like-scientist', name: 'Thinking like a scientist', text: 'Asking a question, measuring, uncertainty and fair tests.', status: 'planned' },
];
