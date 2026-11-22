---
title: A tour of the Google Cloud data stack
summary: 'Projects, regions, permissions and billing, then every Google Cloud data service on one page, and how to choose BigQuery SQL, Dataproc or Dataflow.'
minutes: 20
updated: 2026-11-22
quiz:
  - q: A pipeline that runs on a schedule should sign in to BigQuery as...
    choices: ['Your personal account', 'A service account with only the roles it needs', 'The project owner']
    ans: 1
    why: Automated jobs use service accounts with least-privilege roles, so access can be checked and removed without touching any person's account.
  - q: Which service is Google's managed Apache Airflow?
    choices: ['Cloud Composer', 'Cloud Run', 'Dataplex']
    ans: 0
    why: Cloud Composer runs Airflow for you, including the scheduler, workers, web page and upgrades.
  - q: Your transformations are plain SQL over data already in BigQuery. What is usually simplest?
    choices: ['Copy the data out to a Spark cluster', 'Run the SQL in BigQuery (scheduled queries, Dataform or dbt)', 'Stream it through Pub/Sub']
    ans: 1
    why: Moving data out of the warehouse to transform it adds cost and moving parts. SQL in place is the default; Spark is for what SQL can't do well.
sources:
  - 'Google Cloud documentation: IAM overview https://cloud.google.com/iam/docs/overview'
  - 'Google Cloud documentation: create, edit or delete budgets and budget alerts https://cloud.google.com/billing/docs/how-to/budgets'
  - 'Google Cloud documentation: resource hierarchy https://cloud.google.com/resource-manager/docs/cloud-platform-resource-hierarchy'
---

**Module 3 · about 20 minutes · read first: [1.2](/learn/courses/data-at-scale/the-map/).** You'll be able to explain projects, regions, service accounts and roles, name the Google Cloud data services and the job each does, and choose between BigQuery SQL, Dataproc and Dataflow for a pipeline.

<div class="bigidea">On Google Cloud, everything lives in a project that holds its own permissions and bill; once you know who may do what and who pays, the data services are just tools in the seven boxes you already know.</div>

## 1. Why this matters

Most mistakes beginners make on the cloud are not about Spark or SQL. They are about permissions ("why does my job get 403 Forbidden?"), location ("why is this query so slow and expensive?") and billing ("who left this running?"). Get those four ideas straight and the services become easy. This course uses Google Cloud; the same ideas exist on AWS and Azure under other names (Lesson 1.2 has the table).

## 2. Four ideas to understand first

- **Project:** the box that holds resources, permissions and billing. Companies usually have many: `retail-data-dev`, `retail-data-prod`, one per team. BigQuery tables are named `project.dataset.table`.
- **Region and location:** where data physically lives (`northamerica-northeast1` is Montréal, `northamerica-northeast2` is Toronto; `US` and `EU` are multi-regions). Keep data and the compute that reads it in the same location: it is cheaper, faster, and privacy law often requires it.
- **IAM (identity and access management):** who can do what. People and **service accounts** (identities for programs) get **roles** such as `roles/bigquery.dataViewer` or `roles/storage.objectAdmin`. The rule is **least privilege**: give only what is needed, to groups rather than to individuals.
- **Billing:** every service is metered. Set **budgets and alerts** on day one, and **label** resources (`team=retail-media`) so costs can be split by team.

Think of an office building. The organisation is the company; **projects** are floors, each with its own budget; **services** are rooms (the library is BigQuery, the storeroom is Cloud Storage, the workshop is Dataproc); **IAM** is the key-card system; and a **service account** is a key card issued to a robot that works night shifts.

Watch one night-shift robot at work:

<div class="steps">
<div class="step"><b>The job starts.</b> At 02:00 the nightly pipeline runs as the service account <code>sales-pipeline@retail-data-prod.iam.gserviceaccount.com</code>, not as any person.</div>
<div class="step"><b>It asks BigQuery to run a query.</b> IAM checks: does this account hold <code>bigquery.jobUser</code> on the project (allowed to run jobs) and <code>bigquery.dataViewer</code> on the dataset <code>retail</code>? Yes, so the query runs.</div>
<div class="step"><b>A mistake in the code reads the loyalty table.</b> The account has no role on the dataset <code>pii</code>. BigQuery answers <b>403 Access Denied</b>, and the attempt is written to the audit log. Least privilege just stopped a leak of personal data.</div>
<div class="step"><b>Someone pays.</b> The bytes the query scanned are billed to <code>retail-data-prod</code>, tagged with the label <code>team=retail-media</code>, so the monthly cost report shows which team spent what.</div>
</div>

## 3. Budgets and alerts

A **budget** is a monthly amount you expect to spend; **alerts** email you when actual (or forecast) spend crosses a share of it, such as 50 %, 90 % and 100 %. Important: a budget alert only warns. It does not stop anything from running. Someone has to read the email and act.

<div class="problem" data-problem="gcp-tour-budget"></div>

## 4. The services on one page

| Job | Service | In one line |
|---|---|---|
| Store files | **Cloud Storage (GCS)** | Object storage for any file; the data lake |
| Warehouse | **BigQuery** | Serverless SQL warehouse over petabytes |
| Spark and Hadoop | **Dataproc** | Managed Spark clusters, or serverless Spark batches |
| Beam pipelines | **Dataflow** | Serverless batch and streaming pipelines (Apache Beam) |
| Messaging | **Pub/Sub** | Global, serverless publish-subscribe messaging |
| Kafka | **Managed Service for Apache Kafka** | Google-run Kafka clusters (or run your own, or Confluent Cloud) |
| Orchestration | **Cloud Composer** | Managed Airflow |
| SQL workflows | **Dataform** | SQL transformation workflows in BigQuery, similar to dbt |
| Change data capture | **Datastream** | Streams changes from MySQL, PostgreSQL, Oracle or SQL Server into BigQuery or Cloud Storage |
| Wide-column NoSQL | **Bigtable** | Millisecond reads and writes at huge scale |
| Relational | **Cloud SQL, AlloyDB, Spanner** | Postgres or MySQL; high-performance Postgres; globally distributed SQL |
| Governance | **Dataplex** | Discover, catalogue, profile and govern data across lake and warehouse |
| BI | **Looker, Looker Studio** | A semantic model and dashboards; free lightweight dashboards |
| ML and AI | **Vertex AI** | Training, pipelines, feature store, model registry, serving, Gemini models |
| Clean rooms | **BigQuery data clean rooms** | Share data with partners without exposing rows (Module 7) |

Product names and features change; when in doubt, check the Google Cloud docs.

## 5. Which processing service?

- **BigQuery SQL** when the data is in BigQuery and the logic is SQL. This covers most analytics transformations. Schedule it with Dataform, dbt or Composer.
- **Dataproc** when you have existing Spark code, need the Spark ecosystem (Delta, Iceberg, MLlib), or want portable open-source jobs.
- **Dataflow** for streaming pipelines (Pub/Sub or Kafka in, BigQuery or Bigtable out) and serverless batch in Beam.
- **Cloud Run functions or jobs** for small glue: call an API, move a file, send an alert.

Google Cloud is especially strong where BigQuery and advertising matter: retailers, media and marketing companies, because Google's ads and analytics data can be exported straight into BigQuery. Many retail media networks build on it for that reason and for its clean rooms.

<div class="meaning">

<dl>
<dt>Project</dt><dd>A container for resources, permissions and one bill.</dd>
<dt>Service account</dt><dd>An identity for a program, with its own roles. Never a person.</dd>
<dt>Role</dt><dd>A named bundle of permissions, such as "may read tables in this dataset".</dd>
<dt>Least privilege</dt><dd>Give each identity only the roles its job needs, and nothing more.</dd>
<dt>Budget alert</dt><dd>An email when spend passes a share of a monthly budget. It warns; it does not stop.</dd>
<dt>Physical meaning</dt><dd>If a restaurant chain's pipeline key leaks, least privilege decides the damage: a key that can only read the sales dataset exposes sales; an owner key exposes everything, including customer data, and can run up any bill.</dd>
</dl>

</div>

<div class="myth">

**"Setting a budget caps my spending."** A Google Cloud budget sends alerts; it does not switch anything off. To truly cap spend you need extra steps: quotas, a maximum bytes billed on queries, or an automated action triggered by the alert. Check the billing docs for the current options.

</div>

## 6. Try it

Open the free **BigQuery sandbox** (no credit card; see [Free sandboxes](/learn/courses/data-at-scale/free-sandboxes/)). Create a project, open BigQuery Studio and paste:

```sql
SELECT name, SUM(number) AS babies
FROM `bigquery-public-data.usa_names.usa_1910_current`
WHERE year >= 2000
GROUP BY name
ORDER BY babies DESC
LIMIT 10;
```

Before you press Run, look at the top right of the editor: it tells you **how many bytes the query will process**. Write that number down. It is the main driver of BigQuery cost, and Lesson 3.3 is about making it smaller.

What to check: you can find the project ID in the table name you would write for your own data (`your-project.dataset.table`), and you have set a budget with at least one alert in the billing page (even a tiny one).

**New words:** *project*, *region*, *multi-region*, *IAM*, *service account*, *role*, *least privilege*, *budget*, *label*, *Composer*, *Dataform*, *Datastream*, *Dataplex*.

<div class="keypoints">

- Projects hold resources, permissions and billing; tables are named project.dataset.table.
- Keep data and compute in the same location: it is cheaper, faster and often legally required.
- Programs run as service accounts with least-privilege roles; a missing role gives 403 and protects data.
- Budgets send alerts but do not stop spending; label resources so cost can be split by team.
- Default to SQL in BigQuery; use Dataproc for Spark code and Dataflow for streaming or Beam.

</div>
