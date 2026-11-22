// Pipeline to Dashboard (nihal, 2026-11-22): the ETL and BI course, rebuilt on fibub to the new learning standard from
// the old nihalsulaiman.com course (7 weeks, 49 days). Lesson kit on (kit: true): step players, meaning boxes, live
// problems (public/learn-kit/etl/problems.js). All company data is synthetic; companies are described generically.
import type { CourseSyllabus } from '../types';

export const ETL_COURSE: CourseSyllabus = {
  id: 'etl',
  kit: true,
  name: "Pipeline to Dashboard",
  title: "Pipeline to Dashboard: ETL, warehouses and BI, step by step",
  text: "Build the pipelines that move data from email, shared drives and APIs into a warehouse, clean it, model it and put it on dashboards people trust: Python, Polars, DuckDB, Dagster, Azure SQL, dbt and Power BI, with a project at the end of every module.",
  audience: "For analysts moving into data engineering, BI developers who want to own the pipeline, and students. Basic Python and SQL help; every step is explained.",
  updated: '2026-11-22',
  footnote: 'All company data in the examples is synthetic. Tool versions and prices change: check the official docs before you rely on them.',
  parts: [
    { name: 'Part A: Get the data in and clean', modules: [
      { n: 1, name: "Ingest anything", lessons: [
        ['1.1', 'platform-shape', "The shape of a data platform"],
        ['1.2', 'engineering-setup', "An engineering setup that survives a real job"],
        ['1.3', 'landing-files', "Landing files from folders and shared drives"],
        ['1.4', 'email-extraction', "Extracting data from email"],
        ['1.5', 'cloud-drives-sftp', "SharePoint, OneDrive, Google Drive, SFTP and object storage"],
        ['1.6', 'apis-databases', "APIs and source databases"],
        ['1.7', 'proof-retail-ingest', "Project 1: a multi-source landing service"],
      ] },
      { n: 2, name: "Clean and trust the data", lessons: [
        ['2.1', 'profiling-contracts', "Profiling and data contracts"],
        ['2.2', 'polars-duckdb', "Transforming with Polars and DuckDB"],
        ['2.3', 'messy-data-guide', "The messy-data field guide"],
        ['2.4', 'cleaning-with-ai', "Cleaning with Claude Code and open models"],
        ['2.5', 'duplicates-entity-resolution', "Duplicates, keys and entity resolution"],
        ['2.6', 'quality-gates', "Quality gates, quarantine and the data quality report"],
        ['2.7', 'proof-qsr-clean', "Project 2: a trustworthy cleaning pipeline"],
      ] },
    ] },
    { name: 'Part B: Run it and store it', modules: [
      { n: 3, name: "Orchestrate with Dagster", lessons: [
        ['3.1', 'what-orchestrators-do', "What an orchestrator really does"],
        ['3.2', 'dagster-assets', "Dagster assets and your first real project"],
        ['3.3', 'dagster-resources-config', "Resources, config, IO managers and environments"],
        ['3.4', 'partitions-backfills', "Partitions and backfills"],
        ['3.5', 'schedules-sensors', "Schedules, sensors, retries and alerts"],
        ['3.6', 'asset-checks-deploy', "Asset checks, testing and deploying Dagster"],
        ['3.7', 'proof-hotel-dagster', "Project 3: a self-running hotel pipeline"],
      ] },
      { n: 4, name: "Load to the warehouse", lessons: [
        ['4.1', 'where-data-lives', "Choosing where the data lives"],
        ['4.2', 'azure-sql-hands-on', "Azure SQL Database, hands on"],
        ['4.3', 'loading-patterns', "Loading patterns that survive reruns"],
        ['4.4', 'postgres-duckdb-clickhouse', "Postgres, DuckDB and ClickHouse side by side"],
        ['4.5', 'tsql-for-warehouses', "T-SQL for people who run warehouses"],
        ['4.6', 'security-cost-azure', "Security, cost and operations in Azure"],
        ['4.7', 'proof-ads-warehouse', "Project 4: one pipeline, any warehouse"],
      ] },
    ] },
    { name: 'Part C: Model it and show it', modules: [
      { n: 5, name: "Model it in SQL", lessons: [
        ['5.1', 'dimensional-modelling-grain', "Dimensional modelling and grain"],
        ['5.2', 'dimensions-scd2', "Dimensions done right: keys, dates and SCD2"],
        ['5.3', 'senior-sql', "SQL the way senior analysts write it"],
        ['5.4', 'dbt-basics', "dbt: SQL models with software discipline"],
        ['5.5', 'dbt-in-dagster', "dbt inside Dagster, and the alternatives"],
        ['5.6', 'metrics-semantic-layer', "Metrics, additivity and the semantic layer"],
        ['5.7', 'proof-restaurant-dbt', "Project 5: a tested star schema"],
      ] },
      { n: 6, name: "Deliver BI people trust", lessons: [
        ['6.1', 'power-bi-models', "Power BI data models that stay fast"],
        ['6.2', 'dax-correct', "DAX that is correct, not just working"],
        ['6.3', 'ten-second-dashboards', "Dashboards people read in ten seconds"],
        ['6.4', 'refresh-security-delivery', "Refresh, security and report delivery"],
        ['6.5', 'open-source-bi', "Open-source BI without Microsoft licences"],
        ['6.6', 'reconciliation', "Reconciliation, the skill that earns trust"],
        ['6.7', 'proof-chain-dashboards', "Project 6: BI people can trust"],
      ] },
    ] },
    { name: 'Part D: Production', modules: [
      { n: 7, name: "Run it in production", lessons: [
        ['7.1', 'observability-incidents', "Observability and incident response"],
        ['7.2', 'cicd-safe-change', "CI/CD, environments and safe change"],
        ['7.3', 'choosing-tools', "Choosing tools with a written rationale"],
        ['7.4', 'low-cost-open-stack', "A low-cost open-source stack for medium companies"],
        ['7.5', 'performance-scale', "Performance, scale and when to change gear"],
        ['7.6', 'capstone-build', "Capstone: a daily data platform"],
        ['7.7', 'ship-and-tell', "Ship it and tell the story"],
      ] },
    ] },
  ],
};
