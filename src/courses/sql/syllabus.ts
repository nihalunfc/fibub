// SQL for analysts (nihal, 2026-11-22): the SQL course for data and BI jobs. Plan:
// /mnt/project-files/sql-modelling-courses/plan.md. Every lesson has live editors (type, Run, Check) on the
// Northbay Retail practice database, and "Show how it runs" draws each step (src/lib/tableviz/).
// Same engine as the other long courses (src/courses/types.ts): a lesson is live when sql/<slug>.md exists.
// Live SQL boxes come from ```sql blocks (src/scripts/sqllab.ts explains the markers).
import type { CourseSyllabus } from '../types';

export const SQL_COURSE: CourseSyllabus = {
  id: 'sql',
  name: 'SQL for analysts',
  title: 'SQL for analysts: from your first SELECT to window functions',
  text: 'Learn SQL by typing it. Every lesson has live editors on a real-looking store database, checks your answers, and shows step by step what each query does to the tables: joins matching rows, groups forming, totals adding up.',
  kit: true,
  audience: 'For anyone heading into data, BI or analyst work, and for interview practice. No set-up and no sign-up: it runs in your browser.',
  updated: '2026-11-22',
  footnote: 'Northbay Retail is a made-up company; its data is generated in your browser. Queries run on your device and nothing you type is sent anywhere.',
  parts: [
    { name: 'Part A: Asking questions of one table', modules: [
      { n: 1, name: 'Start here', lessons: [
        ['1.1', 'what-is-sql', 'What SQL is and why analysts use it'],
        ['1.2', 'meet-northbay', 'Meet Northbay: the practice database'],
        ['1.3', 'tables-rows-columns', 'Tables, rows, columns and types'],
        ['1.4', 'how-a-query-runs', 'How a query runs: the order SQL thinks in'],
      ] },
      { n: 2, name: 'Picking rows and columns', lessons: [
        ['2.1', 'select', 'SELECT: choosing columns'],
        ['2.2', 'where', 'WHERE: choosing rows'],
        ['2.3', 'and-or-in-between-like', 'AND, OR, IN, BETWEEN and LIKE'],
        ['2.4', 'null', 'NULL: the value that isn\'t there'],
        ['2.5', 'order-by-limit', 'ORDER BY and LIMIT'],
        ['2.6', 'case', 'CASE: if-then inside a query'],
      ] },
      { n: 3, name: 'Summaries', lessons: [
        ['3.1', 'aggregates', 'COUNT, SUM, AVG, MIN and MAX'],
        ['3.2', 'group-by', 'GROUP BY: one row per group'],
        ['3.3', 'having', 'HAVING: filtering groups'],
        ['3.4', 'count-distinct', 'COUNT DISTINCT and counting the right thing'],
        ['3.5', 'grain', 'The grain trap: what one row means'],
      ] },
    ] },
    { name: 'Part B: Combining tables', modules: [
      { n: 4, name: 'Joins', lessons: [
        ['4.1', 'keys', 'Keys: how tables point at each other'],
        ['4.2', 'inner-join', 'INNER JOIN'],
        ['4.3', 'left-join', 'LEFT JOIN and finding what is missing'],
        ['4.4', 'anti-join', 'Anti-joins and semi-joins: NOT EXISTS and EXISTS'],
        ['4.5', 'fan-out', 'Fan-out: when a join copies rows'],
        ['4.6', 'self-join', 'Self-joins: a table joined to itself'],
        ['4.7', 'union', 'UNION, INTERSECT and EXCEPT'],
      ] },
      { n: 5, name: 'Subqueries and CTEs', lessons: [
        ['5.1', 'subqueries', 'Subqueries: a query inside a query'],
        ['5.2', 'in-exists', 'IN and EXISTS with subqueries'],
        ['5.3', 'correlated-subqueries', 'Correlated subqueries'],
        ['5.4', 'cte', 'CTEs: WITH, step by step'],
        ['5.5', 'recursive-cte', 'Recursive CTEs: calendars and org charts'],
      ] },
    ] },
    { name: 'Part C: Analyst SQL', modules: [
      { n: 6, name: 'Window functions', lessons: [
        ['6.1', 'over', 'OVER: totals without losing rows'],
        ['6.2', 'ranking', 'ROW_NUMBER, RANK and DENSE_RANK'],
        ['6.3', 'top-n-per-group', 'Top N per group'],
        ['6.4', 'lag-lead', 'LAG and LEAD: comparing with the row before'],
        ['6.5', 'running-totals', 'Running totals and window frames'],
        ['6.6', 'moving-averages', 'Moving averages'],
        ['6.7', 'share-of-total', 'Share of total, NTILE and percentiles'],
      ] },
      { n: 7, name: 'Dates, text and cleaning', lessons: [
        ['7.1', 'dates', 'Working with dates'],
        ['7.2', 'text', 'Text functions'],
        ['7.3', 'types-casting', 'Types and CAST'],
        ['7.4', 'duplicates', 'Finding and removing duplicates'],
        ['7.5', 'data-quality', 'Data quality checks in SQL'],
      ] },
      { n: 8, name: 'Patterns analysts use every week', lessons: [
        ['8.1', 'growth', 'Month-over-month and year-over-year growth'],
        ['8.2', 'cohorts', 'Cohort retention'],
        ['8.3', 'funnels', 'Funnels and conversion'],
        ['8.4', 'gaps-islands', 'Gaps and islands: streaks and missing days'],
        ['8.5', 'rfm', 'RFM: segmenting customers'],
        ['8.6', 'pivot', 'Pivoting rows into columns'],
      ] },
    ] },
    { name: 'Part D: Real work and interviews', modules: [
      { n: 9, name: 'Performance and dialects', lessons: [
        ['9.1', 'explain', 'How the database runs your query: EXPLAIN'],
        ['9.2', 'indexes', 'Indexes'],
        ['9.3', 'dialects', 'SQLite, SQL Server, PostgreSQL and BigQuery: what changes'],
        ['9.4', 'readable-sql', 'Writing SQL other people can read'],
        ['9.5', 'changing-data', 'Changing data: INSERT, UPDATE, DELETE and transactions'],
      ] },
      { n: 10, name: 'Interview practice and capstone', lessons: [
        ['10.1', 'interview-questions', '30 SQL interview questions, answered'],
        ['10.2', 'capstone', 'Capstone: the Northbay SQL casebook'],
      ] },
    ] },
  ],
};
