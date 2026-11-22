// Power BI and DAX (nihal, 2026-11-22): a free, hands-on course for BI and data analyst jobs, built around one
// made-up retailer, Northbay Goods (src/lib/dax/northbay.ts). Plan: /mnt/project-files/powerbi-storytelling-courses/plan.md.
//
// Same engine as ML foundations (src/courses/types.ts): a lesson goes live when src/courses/power-bi/<slug>.md
// exists; figures sit in the text as <!--fig:name--> (src/courses/power-bi/figures/index.ts). Practice editors
// are <!--fig:dax-pad <exercise-id>--> with the exercises in ./exercises.ts, run by the in-browser DAX engine
// (src/lib/dax/engine.ts, checked by tests/dax.mjs). Learners build the real report in Power BI Desktop.
import type { CourseSyllabus } from '../types';

export const POWER_BI: CourseSyllabus = {
  id: 'power-bi',
  name: 'Power BI and DAX',
  title: 'Power BI and DAX: from raw data to a dashboard managers use',
  text: 'Learn Power BI the way BI teams use it: clean data in Power Query, model it as a star schema, write DAX measures and time intelligence, and design a report people act on. Type and run DAX in every lesson, and watch step by step what each formula does to the data.',
  audience: 'For students, career changers and analysts who know Excel. No coding needed to start. A Windows computer helps for the hands-on parts (Power BI Desktop is free); every DAX exercise also runs right here in the browser.',
  updated: '2026-11-22',
  footnote: 'Northbay Goods is a made-up shop and its numbers are generated. Power BI changes every month: menu names can move, so check Microsoft Learn if a button is not where the lesson says. The practice editor runs in your browser; nothing you type is sent anywhere.',
  parts: [
    { name: 'Part A: Getting data ready', modules: [
      { n: 1, name: 'Getting started', lessons: [
        ['1.1', 'what-is-power-bi', 'What Power BI is and what a BI developer does'],
        ['1.2', 'meet-northbay', 'Meet Northbay Goods: the data for this course'],
        ['1.3', 'install-and-tour', 'Install Power BI Desktop and find your way around'],
        ['1.4', 'first-report', 'Your first report in 15 minutes'],
        ['1.5', 'practice-editor', 'How to practise DAX in this course'],
      ] },
      { n: 2, name: 'Power Query: get and clean data', lessons: [
        ['2.1', 'power-query-basics', 'Power Query: applied steps you can replay'],
        ['2.2', 'cleaning-steps', 'Cleaning: types, blanks, trims and splits'],
        ['2.3', 'merge-append', 'Merge and append: joining tables'],
        ['2.4', 'unpivot-group', 'Unpivot, pivot and group by'],
        ['2.5', 'm-language', 'Reading the M code behind each step'],
      ] },
      { n: 3, name: 'Data modelling', lessons: [
        ['3.1', 'star-schema', 'Star schema: facts and dimensions'],
        ['3.2', 'relationships', 'Relationships, cardinality and filter direction'],
        ['3.3', 'date-table', 'A proper date table'],
        ['3.4', 'calculated-columns', 'Calculated columns or measures?'],
        ['3.5', 'modelling-mistakes', 'Common modelling mistakes and how to fix them'],
      ] },
    ] },
    { name: 'Part B: DAX', modules: [
      { n: 4, name: 'DAX basics', lessons: [
        ['4.1', 'first-measures', 'Your first measures: SUM, COUNTROWS, DISTINCTCOUNT'],
        ['4.2', 'divide-and-ratios', 'DIVIDE, ratios and percentages'],
        ['4.3', 'iterators', 'Iterators: SUMX and row context'],
        ['4.4', 'related-lookups', 'RELATED and looking things up'],
        ['4.5', 'variables-if-switch', 'Variables, IF and SWITCH'],
      ] },
      { n: 5, name: 'Filter context and CALCULATE', lessons: [
        ['5.1', 'filter-context', 'Filter context: what a measure sees'],
        ['5.2', 'calculate', 'CALCULATE: change the filters'],
        ['5.3', 'all-and-percent-of-total', 'ALL, REMOVEFILTERS and percent of total'],
        ['5.4', 'filter-function', 'FILTER and table filters'],
        ['5.5', 'context-transition', 'Context transition'],
        ['5.6', 'ranking-topn', 'Ranking and top N'],
        ['5.7', 'dax-queries', 'DAX queries: EVALUATE and SUMMARIZECOLUMNS'],
      ] },
      { n: 6, name: 'Time intelligence', lessons: [
        ['6.1', 'ytd-mtd', 'Year, quarter and month to date'],
        ['6.2', 'last-year-growth', 'Same period last year and growth'],
        ['6.3', 'rolling-windows', 'Rolling 28 days and moving averages'],
        ['6.4', 'pace-and-targets', 'Pace against last year and targets'],
      ] },
    ] },
    { name: 'Part C: Reports people use', modules: [
      { n: 7, name: 'Visuals and report design', lessons: [
        ['7.1', 'choosing-visuals', 'Picking the right visual'],
        ['7.2', 'slicers-interactions', 'Slicers, cross-filtering and interactions'],
        ['7.3', 'drill-tooltips', 'Drill down, drill through and tooltips'],
        ['7.4', 'bookmarks-navigation', 'Bookmarks, buttons and navigation'],
        ['7.5', 'layout-accessibility', 'Layout, themes and accessibility'],
      ] },
      { n: 8, name: 'Performance, security and sharing', lessons: [
        ['8.1', 'performance', 'Faster reports: Performance Analyzer and model size'],
        ['8.2', 'row-level-security', 'Row-level security'],
        ['8.3', 'publish-share', 'Publishing: workspaces, apps and sharing'],
        ['8.4', 'refresh-gateways', 'Scheduled refresh and gateways'],
        ['8.5', 'field-parameters', 'Field parameters and calculation groups'],
      ] },
      { n: 9, name: 'Capstone and interviews', lessons: [
        ['9.1', 'capstone-brief', 'Capstone: the Northbay sales dashboard brief'],
        ['9.2', 'capstone-build', 'Building the capstone step by step'],
        ['9.3', 'portfolio-writeup', 'Writing it up for your portfolio'],
        ['9.4', 'interview-questions', 'Power BI and DAX interview questions'],
      ] },
    ] },
  ],
};
