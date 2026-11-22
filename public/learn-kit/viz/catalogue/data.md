# Data and statistics

- `@data-ab-sim`: Run one A/B test or 300: true rates, visitors, z test, false alarms and power.
  Used in: data-at-scale/measurement, pandas/ab-test-pandas, statistics/ab-analysis, statistics/ab-metrics, statistics/ab-test-design, statistics/bayesian-ab, statistics/capstone-experiment-readout, statistics/multiple-comparisons, statistics/peeking, statistics/sample-ratio-mismatch
- `@data-bootstrap-resample`: Resampling with replacement shown value by value, building a histogram of means and a percentile interval.
  Used in: statistics/bootstrap, statistics/central-limit-theorem, statistics/confidence-interval-mean, statistics/confidence-interval-proportion, statistics/samples-populations, statistics/sampling-bias, statistics/standard-error, statistics/what-95-means
- `@data-chain-pipeline`: A pandas method chain one link at a time with the DataFrame shape and table after each link (step player).
  Used in: pandas/capstone-retail-notebook, pandas/dataframes, pandas/method-chaining, pandas/new-columns, pandas/sorting, pandas/why-pandas
- `@data-corr-drag`: Draggable scatter points with live r, best-fit line, residual gaps and an outlier button.
  Used in: statistics/correlation
- `@data-dag-retry`: A five-task pipeline run with random failures, retries and skipped downstream tasks; animated.
  Used in: data-at-scale/airflow, data-at-scale/kafka-reliability, data-at-scale/mini-projects, data-at-scale/platform-architecture, data-modelling/capstone-build, data-modelling/layers, etl/asset-checks-deploy, etl/capstone-build, etl/choosing-tools, etl/cicd-safe-change, etl/dagster-assets, etl/dagster-resources-config, etl/dbt-basics, etl/dbt-in-dagster, etl/low-cost-open-stack, etl/observability-incidents, etl/platform-shape, etl/schedules-sensors, etl/what-orchestrators-do
- `@data-dq-gate`: Rows pass three data quality checks; bad rows are quarantined; a bad-share threshold stops the load; animated scan.
  Used in: data-at-scale/data-for-genai, data-at-scale/feature-stores-mlops, data-at-scale/what-ml-needs, data-modelling/testing, etl/cleaning-with-ai, etl/duplicates-entity-resolution, etl/messy-data-guide, etl/profiling-contracts, etl/quality-gates, pandas/text-cleaning, pandas/validation, sql/data-quality
- `@data-dtype-memory`: Memory per DataFrame column for default versus smaller dtypes, with a row-count slider.
  Used in: etl/where-data-lives, pandas/data-types, pandas/reading-files, pandas/series, pandas/speed
- `@data-groupby-buckets`: Split-apply-combine: rows slide into group buckets, an aggregate is applied, HAVING drops whole groups (step player).
  Used in: data-at-scale/bigquery, data-at-scale/druid, etl/polars-duckdb, etl/postgres-duckdb-clickhouse, pandas/cohorts, pandas/groupby-basics, pandas/kpi-report, pandas/multiple-aggregations, pandas/rfm, pandas/transform-filter, pandas/value-counts-crosstab, sql/aggregates, sql/cohorts, sql/funnels, sql/group-by, sql/growth, sql/rfm
- `@data-hist-bins`: Histogram bin count 3 to 40, equal-width (cut) versus equal-count (qcut) edges.
  Used in: pandas/binning, pandas/first-look, pandas/pareto-abc, statistics/centre, statistics/choosing-distribution, statistics/percentiles-z-scores, statistics/shape-outliers, statistics/skewed-distributions, statistics/spread
- `@data-index-lookup`: Full scan versus B-tree lookup as the table grows to 100 million rows, with page-read bars; animated lookup.
  Used in: data-at-scale/bigtable, data-at-scale/database-zoo, data-at-scale/elasticsearch, data-modelling/cost-partitioning, etl/tsql-for-warehouses, sql/explain, sql/indexes, sql/keys
- `@data-join-types`: INNER, LEFT, RIGHT and FULL joins built row by row (play or drag) with NULLs for unmatched rows.
  Used in: etl/azure-sql-hands-on, pandas/join-pitfalls, pandas/map-lookups, pandas/merge-joins, pandas/sql-excel-dax, sql/anti-join, sql/correlated-subqueries, sql/fan-out, sql/in-exists, sql/inner-join, sql/left-join, sql/self-join
- `@data-mapreduce`: MapReduce word count: split, map, shuffle, reduce across three workers (step player).
  Used in: data-at-scale/dataproc, data-at-scale/how-spark-works, data-at-scale/pyspark-basics, data-at-scale/spark-family, data-at-scale/spark-performance, data-at-scale/why-big-data, data-modelling/lakehouse
- `@data-mask-filter`: Boolean-mask filtering: two conditions, & | ~, True/False columns and the surviving rows with their index.
  Used in: pandas/filtering-rows, pandas/loc-iloc, pandas/python-basics, pandas/query-isin-between, pandas/selecting-columns
- `@data-missing-fill`: Seven ways of handling missing values (dropna, fill 0, ffill, mean, median, interpolate) and their effect on the mean.
  Used in: pandas/cleaning-project, pandas/missing-values
- `@data-normalize-steps`: Normalisation 1NF to 3NF as a step player splitting one messy sheet into tables.
  Used in: data-modelling/data-vault, data-modelling/er-diagrams, data-modelling/inmon, data-modelling/normal-forms, data-modelling/oltp-vs-olap, data-modelling/snowflakes, data-modelling/why-denormalise
- `@data-null-logic`: Three-valued logic truth table (AND/OR with TRUE, FALSE, NULL) and five WHERE conditions on rows with NULL.
  Used in: sql/case, sql/null, sql/types-casting
- `@data-power-overlap`: Null and real-effect bells with alpha, beta and power shaded; effect size, n, alpha and one/two-sided controls.
  Used in: statistics/ab-sample-size, statistics/effect-size, statistics/errors-power, statistics/sample-size-planning
- `@data-pvalue-tail`: p-value as a shaded tail area: statistic slider, one/two-sided, normal or t with df, alpha.
  Used in: statistics/anova, statistics/chi-square, statistics/non-parametric, statistics/normal-distribution, statistics/p-values, statistics/t-tests, statistics/test-logic
- `@data-query-order`: Logical order of a SQL query (FROM, WHERE, GROUP BY, HAVING, SELECT, ORDER BY, LIMIT) with the table after each clause (step player, 3 sliders).
  Used in: sql/cte, sql/having, sql/order-by-limit, sql/readable-sql, sql/subqueries
- `@data-regression-fit`: Set slope and intercept by hand; squared errors drawn as squares; compare with least squares.
  Used in: statistics/regression-inference
- `@data-resample`: 90 days of data resampled to weekly or monthly bars with sum, mean or max; shows the partial last period.
  Used in: pandas/calendar-features, pandas/dates, pandas/datetime-index, pandas/resample, sql/dates
- `@data-reshape`: Wide to long and back (pivot and melt): each value travels between layouts; slider and animation.
  Used in: pandas/melt, pandas/multiindex, pandas/pivot-stack, pandas/pivot-table, pandas/tidy-data, sql/pivot
- `@data-rolling-window`: A rolling mean over a noisy series: window size, trailing versus centred, min_periods and NaN edges.
  Used in: data-at-scale/stream-processing, pandas/growth-shift, pandas/rolling, statistics/control-charts, statistics/forecasting-basics, statistics/time-series-basics
- `@data-scd-types`: Slowly changing dimension Types 1, 2 and 3 for a customer who moves city, with the sales-by-city report each way.
  Used in: data-modelling/late-arriving, data-modelling/point-in-time, data-modelling/scd-types, data-modelling/scd2-by-hand, data-modelling/surrogate-keys, etl/dimensions-scd2
- `@data-set-ops`: UNION, UNION ALL, INTERSECT and EXCEPT on two editable id lists.
  Used in: pandas/concat, pandas/duplicates, sql/count-distinct, sql/duplicates, sql/union
- `@data-simpson-scatter`: Simpson's paradox with points: rising trends in three groups, falling pooled line; offset slider.
  Used in: statistics/ab-pitfalls, statistics/simpsons-paradox
- `@data-star-slice`: A star schema: tap dimension values to filter the fact rows and see the total.
  Used in: data-modelling/accumulating-snapshots, data-modelling/additivity, data-modelling/bus-matrix, data-modelling/business-process, data-modelling/conformed-dimensions, data-modelling/date-dimension, data-modelling/declare-grain, data-modelling/factless-facts, data-modelling/facts-and-dimensions, data-modelling/junk-degenerate, data-modelling/one-big-table, data-modelling/periodic-snapshots, data-modelling/role-playing, data-modelling/semantic-layer, data-modelling/star-schema, data-modelling/transaction-facts, etl/dax-correct, etl/dimensional-modelling-grain, etl/metrics-semantic-layer, etl/open-source-bi, etl/power-bi-models, sql/grain, sql/tables-rows-columns
- `@data-transaction`: A two-step money transfer with BEGIN/COMMIT, a crash toggle and a reader that may see uncommitted data (step player).
  Used in: sql/changing-data
- `@data-watermark-load`: Incremental load with a watermark, MERGE versus blind APPEND, and re-running a load.
  Used in: data-at-scale/events-and-streams, data-at-scale/gcs-data-lake, data-at-scale/kafka-core, data-modelling/audit-columns, data-modelling/merge-loads, etl/apis-databases, etl/landing-files, etl/loading-patterns, etl/partitions-backfills, etl/performance-scale, etl/reconciliation
- `@data-where-flow`: A scan tests ten rows against a WHERE condition; threshold slider and AND / OR / NOT.
  Used in: sql/and-or-in-between-like, sql/select, sql/what-is-sql, sql/where
- `@data-window-frame`: A sliding window frame for running total, moving average, whole-partition sum, and ROW_NUMBER / RANK / DENSE_RANK on ties; animated.
  Used in: etl/senior-sql, sql/gaps-islands, sql/lag-lead, sql/moving-averages, sql/over, sql/ranking, sql/running-totals, sql/share-of-total, sql/top-n-per-group
