// Data storytelling (nihal, 2026-11-22): a free course on turning numbers into decisions: knowing the audience,
// choosing the chart, cutting clutter, designing KPIs, building the story and presenting it to managers.
// Uses the same made-up shop as the Power BI course (Northbay Goods; numbers in ./figures/data.ts).
// Plan: /mnt/project-files/powerbi-storytelling-courses/plan.md.
//
// Same engine as ML foundations (src/courses/types.ts): a lesson goes live when src/courses/data-storytelling/<slug>.md
// exists; figures sit in the text as <!--fig:name arg--> (./figures/index.ts). Writing practice: <!--fig:title-coach <preset>-->.
import type { CourseSyllabus } from '../types';

export const DATA_STORYTELLING: CourseSyllabus = {
  id: 'data-storytelling',
  name: 'Data storytelling',
  title: 'Data storytelling: charts, KPIs and presentations that lead to decisions',
  text: 'Learn to turn numbers into a message people act on: find the question, pick the right chart, strip the clutter, design KPI cards, build a story and present it to managers. Every lesson has charts you can change, before and after examples, and writing practice with instant feedback.',
  audience: 'For analysts, students and anyone who shows numbers at work. No software needed: every example runs in the browser. Pairs well with the Power BI and DAX course, which uses the same made-up shop.',
  updated: '2026-11-22',
  footnote: 'Northbay Goods is a made-up shop and its numbers are generated. The writing checks are simple rules run in your browser; nothing you type is sent anywhere or kept.',
  parts: [
    { name: 'Part A: The message', modules: [
      { n: 1, name: 'Audience and question', lessons: [
        ['1.1', 'what-is-data-storytelling', 'What data storytelling is, and why analysts need it'],
        ['1.2', 'know-your-audience', 'Know your audience: who decides, and what they need'],
        ['1.3', 'the-big-idea', 'The big idea: your message in one sentence'],
        ['1.4', 'explore-vs-explain', 'Exploring vs explaining: the charts you make for yourself and for others'],
      ] },
      { n: 2, name: 'Choosing the chart', lessons: [
        ['2.1', 'choosing-a-chart', 'Choosing a chart from the question'],
        ['2.2', 'bars-and-lines', 'Bars and lines: the two charts that do most of the work'],
        ['2.3', 'pies-and-parts', 'Pie charts and parts of a whole: when they work'],
        ['2.4', 'tables-and-cards', 'Tables, cards and small multiples'],
        ['2.5', 'honest-charts', 'Honest charts: axes, scales and other ways charts mislead'],
      ] },
    ] },
    { name: 'Part B: The design', modules: [
      { n: 3, name: 'Clutter, colour and focus', lessons: [
        ['3.1', 'declutter', 'Declutter: remove everything that doesn\'t help'],
        ['3.2', 'colour-with-purpose', 'Colour with a purpose: grey first, then one colour'],
        ['3.3', 'colour-blind-safe', 'Charts everyone can read: colour blindness and accessibility'],
        ['3.4', 'action-titles', 'Action titles: say the point at the top'],
        ['3.5', 'labels-and-notes', 'Labels and notes: put the words where the eyes are'],
      ] },
      { n: 4, name: 'KPI design', lessons: [
        ['4.1', 'what-makes-a-kpi', 'What makes a good KPI'],
        ['4.2', 'compared-to-what', 'Compared to what? Targets, last year and like-for-like'],
        ['4.3', 'kpi-cards', 'Designing KPI cards'],
        ['4.4', 'dashboard-layout', 'Dashboard layout: the five-second test'],
      ] },
    ] },
    { name: 'Part C: The story', modules: [
      { n: 5, name: 'Building the story', lessons: [
        ['5.1', 'story-structure', 'Story structure: situation, complication, resolution'],
        ['5.2', 'dashboard-to-slides', 'From dashboard to slides: one point per slide'],
        ['5.3', 'answer-first', 'Answer first: writing summaries and emails managers read'],
        ['5.4', 'uncertainty', 'Being honest about uncertainty and caveats'],
      ] },
      { n: 6, name: 'Presenting to managers', lessons: [
        ['6.1', 'presenting', 'Presenting to managers: before, during and after'],
        ['6.2', 'tough-questions', 'Handling tough questions and pushback'],
        ['6.3', 'capstone', 'Capstone: tell the Northbay 2025 story'],
        ['6.4', 'portfolio-and-interviews', 'Showing storytelling in your portfolio and interviews'],
      ] },
    ] },
  ],
};
