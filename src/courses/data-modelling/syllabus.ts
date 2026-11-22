// Data modelling and warehousing (nihal, 2026-11-22): Kimball star schemas, facts and dimensions, slowly
// changing dimensions and how a warehouse is loaded and tested. Plan: /mnt/project-files/sql-modelling-courses/plan.md.
// Builds on SQL for analysts (/learn/courses/sql/) and uses the same live SQL boxes (src/scripts/sqllab.ts):
// learners create and load their own star schema from Northbay in the browser. The ETL course on
// nihalsulaiman.com covers the tooling (dbt, Dagster, Azure SQL loads); this course teaches the ideas.
import type { CourseSyllabus } from '../types';

export const DATA_MODELLING: CourseSyllabus = {
  id: 'data-modelling',
  name: 'Data modelling',
  title: 'Data modelling and warehousing: star schemas, facts, dimensions and history',
  text: 'Design the tables behind every dashboard. Normal forms, Kimball star schemas, facts and dimensions, slowly changing dimensions, Data Vault and the lakehouse, and how a warehouse is loaded and tested, with live SQL to build each piece yourself.',
  audience: 'For analysts, BI developers and data engineers. Know basic SQL first (Modules 1-4 of SQL for analysts).',
  updated: '2026-11-22',
  footnote: 'Northbay Retail is a made-up company; its data is generated in your browser. Queries run on your device and nothing you type is sent anywhere.',
  parts: [
    { name: 'Part A: Why and how we model', modules: [
      { n: 1, name: 'Why model data at all', lessons: [
        ['1.1', 'oltp-vs-olap', 'Two kinds of database: running the shop and understanding it'],
        ['1.2', 'normal-forms', 'Normal forms: 1NF, 2NF and 3NF'],
        ['1.3', 'why-denormalise', 'Why analytics breaks the rules'],
        ['1.4', 'er-diagrams', 'Reading and drawing ER diagrams'],
      ] },
      { n: 2, name: 'Kimball basics', lessons: [
        ['2.1', 'business-process', 'Start from a business process'],
        ['2.2', 'declare-grain', 'Declare the grain'],
        ['2.3', 'facts-and-dimensions', 'Facts and dimensions'],
        ['2.4', 'star-schema', 'The star schema'],
        ['2.5', 'bus-matrix', 'The bus matrix: planning a whole warehouse'],
      ] },
    ] },
    { name: 'Part B: Facts and dimensions in depth', modules: [
      { n: 3, name: 'Fact tables', lessons: [
        ['3.1', 'transaction-facts', 'Transaction fact tables'],
        ['3.2', 'periodic-snapshots', 'Periodic snapshot fact tables'],
        ['3.3', 'accumulating-snapshots', 'Accumulating snapshot fact tables'],
        ['3.4', 'factless-facts', 'Factless fact tables'],
        ['3.5', 'additivity', 'Additive, semi-additive and non-additive measures'],
      ] },
      { n: 4, name: 'Dimension tables', lessons: [
        ['4.1', 'surrogate-keys', 'Surrogate keys'],
        ['4.2', 'date-dimension', 'The date dimension'],
        ['4.3', 'conformed-dimensions', 'Conformed dimensions'],
        ['4.4', 'role-playing', 'Role-playing dimensions'],
        ['4.5', 'junk-degenerate', 'Junk and degenerate dimensions'],
        ['4.6', 'snowflakes', 'Snowflakes and outriggers'],
      ] },
      { n: 5, name: 'History: slowly changing dimensions', lessons: [
        ['5.1', 'scd-types', 'SCD types 0, 1, 2, 3 and 6'],
        ['5.2', 'scd2-by-hand', 'SCD type 2 in SQL, by hand'],
        ['5.3', 'late-arriving', 'Late-arriving facts and dimensions'],
        ['5.4', 'point-in-time', 'Point-in-time questions: "as it was" vs "as it is"'],
      ] },
    ] },
    { name: 'Part C: Warehouses in practice', modules: [
      { n: 6, name: 'Beyond Kimball', lessons: [
        ['6.1', 'inmon', 'Inmon and the enterprise warehouse'],
        ['6.2', 'data-vault', 'Data Vault: hubs, links and satellites'],
        ['6.3', 'one-big-table', 'One big table and wide tables'],
        ['6.4', 'lakehouse', 'Lakes, lakehouses and medallion layers'],
      ] },
      { n: 7, name: 'Building and running a warehouse', lessons: [
        ['7.1', 'layers', 'Staging, core and marts'],
        ['7.2', 'merge-loads', 'Loading with MERGE and upserts'],
        ['7.3', 'audit-columns', 'Audit columns, load logs and idempotent loads'],
        ['7.4', 'testing', 'Testing a warehouse: counts, keys and orphans'],
        ['7.5', 'semantic-layer', 'The semantic layer and the Power BI star schema'],
        ['7.6', 'cost-partitioning', 'Partitioning, clustering and cost'],
      ] },
      { n: 8, name: 'Capstone and interviews', lessons: [
        ['8.1', 'capstone-design', 'Capstone part 1: design the Northbay warehouse'],
        ['8.2', 'capstone-build', 'Capstone part 2: build, load and test it'],
        ['8.3', 'capstone-cloud', 'Capstone part 3: put it in a cloud warehouse'],
        ['8.4', 'modelling-interviews', 'Data modelling interview questions, answered'],
      ] },
    ] },
  ],
};
