// Python pandas for analysis (nihal, 2026-11-22): the pandas an analyst uses every day, with real Python
// running in the page (Pyodide, self-hosted in public/py/; nothing leaves the device). Every code box can be
// edited and run; exercises have Check, Hint and Show answer. Plan: /mnt/project-files/analyst-courses/plan.md.
// Same engine as ML foundations (src/courses/types.ts): a lesson goes live when src/courses/pandas/<slug>.md
// exists; figures are <!--fig:name--> (src/courses/pandas/figures/index.ts); code cells are ```python blocks
// (src/lib/pycells.mjs). Datasets are made up by scripts/courses/pandas-data.py into public/data/courses/pandas/.
import type { CourseSyllabus } from '../types';

export const PANDAS: CourseSyllabus = {
  id: 'pandas',
  name: 'Python pandas for analysis',
  title: 'Python pandas for analysis: clean, group, join and reshape data',
  text: 'Learn pandas by doing: real Python runs in the page, so every example can be edited and run, and every exercise checks your answer. Cleaning, filtering, grouping, joins, reshaping, dates and the analyses employers ask for, ending with a retail analysis notebook for your portfolio.',
  audience: 'For analysts and career changers who know a spreadsheet and want Python. No Python needed to start; Module 1 teaches the little you need.',
  updated: '2026-11-22',
  footnote: 'All datasets are made up. Python runs in your browser (the first run downloads it once, about 20 MB); nothing you type is sent anywhere.',
  parts: [
    { name: 'Part A: Getting data in shape', modules: [
      { n: 1, name: 'Getting started', lessons: [
        ['1.1', 'why-pandas', 'Why pandas, and how to use this course'],
        ['1.2', 'python-basics', 'Just enough Python'],
        ['1.3', 'series', 'Series: one column of data'],
        ['1.4', 'dataframes', 'DataFrames: a table in Python'],
        ['1.5', 'reading-files', 'Reading CSV and Excel files'],
        ['1.6', 'first-look', 'A first look: head, info, describe'],
      ] },
      { n: 2, name: 'Selecting and filtering', lessons: [
        ['2.1', 'selecting-columns', 'Selecting columns'],
        ['2.2', 'loc-iloc', 'Rows and cells with loc and iloc'],
        ['2.3', 'filtering-rows', 'Filtering rows with conditions'],
        ['2.4', 'sorting', 'Sorting and top-N'],
        ['2.5', 'new-columns', 'New columns from calculations'],
        ['2.6', 'query-isin-between', 'query, isin and between'],
      ] },
      { n: 3, name: 'Cleaning data', lessons: [
        ['3.1', 'missing-values', 'Missing values: find, fill or drop'],
        ['3.2', 'duplicates', 'Duplicates'],
        ['3.3', 'data-types', 'Data types and converting them'],
        ['3.4', 'text-cleaning', 'Cleaning text with .str'],
        ['3.5', 'dates', 'Dates and times'],
        ['3.6', 'validation', 'Checking data: ranges, rules and outliers'],
        ['3.7', 'cleaning-project', 'Cleaning a messy export, start to finish'],
      ] },
    ] },
    { name: 'Part B: Summarising and combining', modules: [
      { n: 4, name: 'Grouping and aggregating', lessons: [
        ['4.1', 'groupby-basics', 'groupby: split, apply, combine'],
        ['4.2', 'multiple-aggregations', 'Several summaries at once with agg'],
        ['4.3', 'transform-filter', 'transform and filter: group results on every row'],
        ['4.4', 'value-counts-crosstab', 'value_counts and crosstab'],
        ['4.5', 'binning', 'Bins and bands with cut and qcut'],
      ] },
      { n: 5, name: 'Combining tables', lessons: [
        ['5.1', 'concat', 'Stacking tables with concat'],
        ['5.2', 'merge-joins', 'Joining tables with merge'],
        ['5.3', 'join-pitfalls', 'Join pitfalls: duplicates, keys and validate'],
        ['5.4', 'map-lookups', 'Lookups with map and replace'],
      ] },
      { n: 6, name: 'Reshaping', lessons: [
        ['6.1', 'pivot-table', 'Pivot tables'],
        ['6.2', 'melt', 'Wide to long with melt'],
        ['6.3', 'pivot-stack', 'Long to wide with pivot, stack and unstack'],
        ['6.4', 'multiindex', 'MultiIndex without the fear'],
        ['6.5', 'tidy-data', 'Tidy data: which shape for which job'],
      ] },
    ] },
    { name: 'Part C: Analysis patterns', modules: [
      { n: 7, name: 'Time series', lessons: [
        ['7.1', 'datetime-index', 'Dates as the index'],
        ['7.2', 'resample', 'Daily to weekly and monthly with resample'],
        ['7.3', 'rolling', 'Rolling averages'],
        ['7.4', 'growth-shift', 'Growth rates: shift, pct_change and year over year'],
        ['7.5', 'calendar-features', 'Weekdays, months and fiscal periods'],
      ] },
      { n: 8, name: 'Analyses employers ask for', lessons: [
        ['8.1', 'method-chaining', 'Readable pandas: method chaining and assign'],
        ['8.2', 'kpi-report', 'A KPI summary table'],
        ['8.3', 'pareto-abc', 'Pareto and ABC analysis'],
        ['8.4', 'rfm', 'RFM customer segmentation'],
        ['8.5', 'cohorts', 'Cohort retention tables'],
        ['8.6', 'ab-test-pandas', 'Analysing an A/B test in pandas'],
        ['8.7', 'sql-excel-dax', 'pandas for SQL, Excel and DAX users'],
        ['8.8', 'speed', 'Fast pandas: vectorise, avoid loops'],
      ] },
      { n: 9, name: 'Capstone and interviews', lessons: [
        ['9.1', 'capstone-retail-notebook', 'Capstone: a retail analysis notebook'],
        ['9.2', 'interview-questions', 'pandas interview questions, answered'],
        ['9.3', 'cheat-sheet', 'pandas cheat sheet'],
      ] },
    ] },
  ],
};
