---
title: Who uses what, and why, by industry
summary: 'How retail, adtech, banking, telecom, logistics, healthcare and energy use big-data tools, the roles that own each part, and how to read a job posting.'
minutes: 20
updated: 2026-11-22
quiz:
  - q: Why do banks and payment companies lean heavily on streaming?
    choices: ['Regulators require Kafka', 'Fraud must be caught before the payment completes, in milliseconds', 'Streaming is always cheaper than batch']
    ans: 1
    why: A fraud check that runs tomorrow morning is useless. Payments need a decision in milliseconds, so events are scored as they stream in.
  - q: Which role most often owns Spark jobs, Kafka topics and Airflow DAGs?
    choices: ['Data analyst', 'Data engineer', 'Product manager']
    ans: 1
    why: Data engineers build and run pipelines. Analysts and analytics engineers mostly work in the warehouse with SQL and dbt.
  - q: A posting says "Druid, Kafka, measurement, advertisers". What kind of team is it most likely?
    choices: ['Payroll', 'Retail media or adtech analytics', 'Weather forecasting']
    ans: 1
    why: Druid was born in adtech, Kafka carries ad events, and "measurement" and "advertisers" point to a retail media or ad platform team.
sources:
  - 'Reis, J. and Housley, M. (2022), Fundamentals of Data Engineering, O''Reilly, Chapter 1 (data engineering described, and the roles around it)'
  - 'Kleppmann, M. (2017), Designing Data-Intensive Applications, O''Reilly, Chapter 1'
  - 'Apache Druid documentation: introduction https://druid.apache.org/docs/latest/design/'
---

**Module 1 · about 20 minutes · read first: [1.2](/learn/courses/data-at-scale/the-map/).** You'll be able to say which tools each industry leans on and why, tell the data roles apart, and read a job posting to guess what the team's platform looks like.

<div class="bigidea">Every industry has the same seven jobs, but each feels a different pain most, and that pain decides which tools it buys.</div>

## 1. Why this matters

A bank and a supermarket can both run Kafka, Spark and a warehouse, yet their platforms look different because their worst problem is different: the bank must stop fraud in milliseconds, the supermarket must forecast stock for 30,000 products. Knowing the pain behind each tool lets you explain *why* a team uses it, which is what interviewers really ask.

Every builder owns a hammer, a saw and a drill. A cabinet maker uses the saw all day; a roofer lives on the nail gun. Industries are the same toolbox, used for different jobs.

## 2. The same tools, different reasons

| Industry | What hurts most | Tools they lean on | Why |
|---|---|---|---|
| **Retail and grocery** | Billions of receipts, thousands of products, loyalty data, empty shelves | BigQuery or Snowflake, Spark, Airflow, Kafka for stock and online orders, Bigtable for the app | Demand forecasting, replenishment, pricing, loyalty offers and now **retail media** |
| **Adtech and retail media** | Billions of ad events a day; advertisers want live numbers | Kafka, Druid or Pinot, Spark, BigQuery, clean rooms | Live spend pacing, campaign dashboards, attribution and incrementality |
| **Banking and payments** | Fraud in milliseconds, strict audit | Kafka, Flink, Cassandra or Bigtable, Spark, Elasticsearch for logs | Fraud scoring per transaction, regulatory reports, full audit trails |
| **Telecom** | Network events from millions of devices | Kafka, Spark, time-series stores, Druid | Outage detection, churn models, usage billing |
| **Logistics and delivery** | GPS pings, arrival times, route changes | Kafka, Flink, Bigtable or Cassandra, BigQuery | Live tracking, arrival-time prediction, route planning |
| **Media and streaming** | Viewing events, recommendations | Kafka, Spark, Cassandra, feature stores | "Because you watched" lists, ad insertion, content analytics |
| **Healthcare and pharma** | Privacy, varied formats (HL7, FHIR, images) | Spark, BigQuery or Snowflake, strict governance | Population health, trial analytics, de-identified research data |
| **Energy and utilities** | Smart-meter readings every few minutes, sensors | Kafka, time-series databases, Spark, Bigtable | Load forecasting, outage response, grid balancing |
| **Software and SaaS** | Logs and app events | Elasticsearch or OpenSearch, Kafka, ClickHouse | Search, monitoring, product analytics |

Data volume often starts with a simple multiplication: devices × readings per day × bytes per reading. Try it for a utility.

<div class="problem" data-problem="who-uses-what-meters"></div>

## 3. Why retail became a big-data industry

Retailers used to be "batch and reports" companies: last night's sales, this week's stock. Three things changed that:

1. **Online and app shopping** brought click-level data and the need for live stock and personalised pages.
2. **Loyalty programmes** linked purchases to people, which made customer-level models possible: offers, churn, lifetime value.
3. **Retail media:** retailers found that their shopper data is valuable to the brands they sell, and began selling ads on their websites, apps, in-store screens and other sites. Ads need real-time event pipelines and careful measurement, which pulled adtech tools (Kafka, Druid, clean rooms) into retail. Module 7 covers this in depth.

## 4. Who does what: the roles

| Role | Main tools | Main output |
|---|---|---|
| **Data analyst / BI developer** | SQL, Power BI, Looker, Tableau, Excel | Dashboards, answers, insights |
| **Analytics engineer** | SQL, dbt, BigQuery or Snowflake, Git | Clean, tested models in the warehouse |
| **Data engineer** | Python, Spark, Airflow, Kafka, cloud services | Pipelines that move and transform data reliably |
| **Data platform engineer** | Kubernetes, Terraform, cloud permissions, running Kafka and Spark | The platform the data engineers build on |
| **ML engineer / MLOps** | Python, feature stores, Vertex AI or SageMaker, model serving | Models in production, retraining pipelines |
| **Data scientist** | Python, notebooks, statistics, SQL | Models, experiments, measurement studies |
| **Measurement / marketing scientist** | SQL, Python or R, experiment design | Incrementality tests, attribution, media mix models |

Think of a restaurant group. Analysts are the managers reading the numbers; analytics engineers write the standard recipes; data engineers run the kitchen and its supply lines; platform engineers build and maintain the kitchen itself; ML engineers run the machine that suggests tomorrow's specials.

A posting that lists Spark, Google Cloud, Druid, Kafka, ML platforms *and* measurement is usually a **data engineer on a retail media or marketing data platform**. If you come from BI, your strongest bridge is the warehouse and measurement side, then Spark and Airflow, then streaming. The [Power BI](/learn/courses/power-bi/) and [Statistics](/learn/courses/statistics/) courses cover those foundations.

## 5. Read a job posting like a map

Here is how to read a made-up posting from "a national grocery chain's media team": *"Data Engineer. Build batch and streaming pipelines with PySpark on Dataproc, BigQuery and Airflow. Experience with Kafka and Druid a plus. Partner with measurement scientists on campaign attribution for advertisers."*

<div class="steps">
<div class="step"><b>Underline the tools.</b> PySpark, Dataproc, BigQuery, Airflow, Kafka, Druid. Six names.</div>
<div class="step"><b>Drop each into a box.</b> Process: PySpark on Dataproc. Warehouse: BigQuery. Orchestrate: Airflow. Ingest: Kafka. Serve: Druid. Store is missing, but Dataproc and BigQuery on Google Cloud almost always mean Cloud Storage.</div>
<div class="step"><b>Read the clusters.</b> "Dataproc, BigQuery, Airflow" is a Google Cloud batch platform. Adding "Kafka, Druid" means a real-time layer on top, probably live advertiser dashboards.</div>
<div class="step"><b>Read the business words.</b> "Advertisers, campaign, attribution, measurement" means retail media: the team proves to brands that their ads sold products.</div>
<div class="step"><b>Separate must from nice.</b> "Experience with" means you can do it with some help; "a plus" means they will train you. So: strong on Spark, BigQuery and Airflow; Kafka and Druid can be learned on the job. That tells you which modules of this course to do first.</div>
</div>

<div class="meaning">

<dl>
<dt>Pain point</dt><dd>The one problem a business cannot live with: fraud, empty shelves, stale ad numbers. It decides the tools.</dd>
<dt>Data engineer</dt><dd>Builds and runs the pipelines that move and reshape data.</dd>
<dt>Analytics engineer</dt><dd>Turns raw warehouse tables into clean, tested models with SQL and dbt.</dd>
<dt>Tool cluster</dt><dd>A group of names in a posting that together reveal the platform (Dataproc + BigQuery + Airflow = Google Cloud batch).</dd>
<dt>Physical meaning</dt><dd>Two companies that list "Kafka" may use it for very different reasons: a bank to stop a stolen card before the payment clears, a grocer to keep the app's stock count honest. Asking "what pain does this solve here?" is how you sound like someone who has worked on real platforms.</dd>
</dl>

</div>

<div class="myth">

**"I need to know every tool on the posting before I apply."** Postings are wish lists. Teams hire for the core (often SQL, Python and one processing engine) and expect you to learn the rest. Know the seven boxes, be strong in two or three tools, and be honest about the rest.

</div>

## 6. Practice

1. Find one real data job posting in any industry. Copy every tool name into the seven-box table from Lesson 1.2. Which boxes are empty?
2. For that posting, write one sentence: "This team's biggest pain is probably ___ because ___."
3. Which role in the table above is closest to what you do today, and which is the next step?

<details>
<summary>Hints</summary>

1. An empty box often means something is bought or already in place (no orchestrator listed may mean dbt Cloud or Cloud Composer is used).
2. Look at the business words, not the tools: "real-time", "fraud", "advertisers", "forecast", "personalisation".
3. Most BI developers step to analytics engineer, then data engineer.

What to check: you placed every tool, and your pain sentence uses a business word from the posting.
</details>

## 7. Mini project for Module 1: your platform one-pager

**Brief (45 minutes).** Write a one-page platform sketch for an imaginary national grocery chain with 300 stores, an app and a retail media business.

- [ ] A diagram of the seven jobs with one tool per box (pen and paper or any drawing tool).
- [ ] One sentence per box on **why** that tool ("BigQuery: analysts already know SQL and we don't want to run servers").
- [ ] Batch and streaming paths in two different colours.
- [ ] Three risks (cost, privacy, a single point of failure) with one way to reduce each.

**Done when:** a friend who has never seen it can follow one sale from the till to the finance report using only your page. Keep it: you will compare it with the capstone design in Lesson 7.4.

**New words:** *retail media*, *analytics engineer*, *data platform engineer*, *MLOps*, *tool cluster*, *attribution*, *incrementality*.

<div class="keypoints">

- Each industry's main pain decides its tools: banks stream for fraud, retailers warehouse for forecasting, adtech serves live dashboards.
- Retail became a big-data industry through online shopping, loyalty data and retail media.
- Data engineers build pipelines; analytics engineers model the warehouse; analysts and scientists use the results.
- Read a posting by placing each tool in one of the seven boxes, then reading the business words.
- Many data volumes are a simple product: devices × events per day × bytes per event.

</div>
