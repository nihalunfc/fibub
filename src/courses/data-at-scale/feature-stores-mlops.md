---
title: Feature stores, pipelines and MLOps
summary: 'Offline and online feature stores, materialisation, ML pipelines, experiment tracking, model registries and serving, with Vertex AI, Feast and MLflow.'
minutes: 25
updated: 2026-11-22
quiz:
  - q: What does the online store of a feature store hold?
    choices: ['Every value a feature has ever had', 'The latest value of each feature per entity, ready in milliseconds', 'The trained model files']
    ans: 1
    why: The online store is the fast counter that serves current values to live models. Full history lives in the offline store for building training sets.
  - q: What is materialisation?
    choices: ['Training a model', 'A job that computes feature values and copies the latest ones into the online store', 'Printing a report']
    ans: 1
    why: Materialisation keeps the online store fresh. How often it runs, plus how long it takes, sets how stale an online feature can get.
  - q: Why keep a model registry?
    choices: ['To record each model with its metrics, code version and data snapshot, and control which one is live', 'To store raw events', 'To speed up SQL']
    ans: 0
    why: A registry makes models reproducible and auditable, and gives a clear approve, deploy and roll back process.
sources:
  - 'Feast documentation: Quickstart and concepts https://docs.feast.dev/'
  - 'MLflow documentation: Tracking and Model Registry https://mlflow.org/docs/latest/index.html'
  - 'Google Cloud documentation: Vertex AI Feature Store and Vertex AI Pipelines (cloud.google.com/vertex-ai/docs)'
  - 'Sculley, D. et al. (2015), Hidden Technical Debt in Machine Learning Systems, Advances in Neural Information Processing Systems 28'
---

**Module 6 · about 25 minutes · read first: 6.1.** You'll be able to explain offline and online feature stores and materialisation, work out how stale an online feature can be, sketch an ML pipeline from data to deployed model, and name the MLOps tools on Google Cloud and in open source.

<div class="bigidea">A feature store defines each feature once, keeps its full history for training and its latest value for live models, and a job called materialisation keeps the two in step.</div>

## 1. The feature store

A **feature store** is a catalogue plus two storage layers that make features reusable and consistent:

- **Feature definitions:** named, owned and documented, such as `shopper.buys_30d`, computed from `fct_sales`.
- **Offline store:** the full history, used to build training sets with point-in-time joins (Lesson 6.1). Usually BigQuery or lake tables.
- **Online store:** only the latest value per entity, for fast lookups by live models. Usually Bigtable, Redis or DynamoDB.
- **Materialisation:** jobs (batch or streaming) that compute feature values and copy the newest ones into the online store.

Think of a pharmacy. The offline store is the warehouse that keeps every batch ever made, with dates, for audits and research. The online store is the counter: only what is current, ready to hand over in seconds. Materialisation is the van that restocks the counter from the warehouse. The list of feature definitions is the formulary: what each medicine is and who is responsible for it.

Options include **Vertex AI Feature Store** (built on BigQuery, with online serving), **Feast** (open source), **Databricks** feature engineering, **Tecton** and **SageMaker Feature Store**. Many teams simply use well-modelled BigQuery tables plus a Bigtable or Redis copy: a feature store in all but name.

<div class="steps">
<div class="step"><b>10:00. A sale lands.</b> Shopper s77 buys coffee at store 214. The sale reaches <code>fct_sales</code> in BigQuery at 10:12.</div>
<div class="step"><b>10:15. Materialisation starts.</b> The job recomputes <code>buys_7d</code> for shoppers with new sales. For s77 it goes from 3 to 4.</div>
<div class="step"><b>Offline store: append.</b> A new row (s77, 10:15, buys_7d = 4) is added. The old row (s77, yesterday, 3) stays, so training sets can still ask "what was it yesterday?"</div>
<div class="step"><b>Online store: overwrite.</b> The key <code>s77</code> now holds buys_7d = 4. Only the latest value is kept.</div>
<div class="step"><b>10:31. A live request.</b> s77 opens the app. The offer model reads <code>s77</code> from the online store in a few milliseconds and sees 4: the same number, computed by the same code, that training rows use.</div>
</div>

<div class="meaning">

<dl>
<dt>Feature definition</dt><dd>The one agreed recipe for a feature: its source, its formula, its owner.</dd>
<dt>Offline store</dt><dd>Every value over time, for building training sets.</dd>
<dt>Online store</dt><dd>The latest value per entity, for live predictions in milliseconds.</dd>
<dt>Materialisation</dt><dd>The scheduled or streaming job that refreshes the online store.</dd>
<dt>Physical meaning</dt><dd>When a pharmacy app shows a member a vitamin offer the moment they log in, a model read that member's features from a fast online store, filled minutes earlier by a materialisation job, using the same feature recipe the model was trained with months before.</dd>
</dl>

</div>

The online store holds just one row per entity, but for millions of shoppers that still adds up:

<div class="problem" data-problem="feature-stores-mlops-online"></div>

Freshness is the other number to know. A batch materialisation job can only be as fresh as its schedule allows:

<div class="problem" data-problem="feature-stores-mlops-staleness"></div>

## 2. ML pipelines

An ML pipeline is a DAG like the ones you built with [Airflow](/learn/courses/data-at-scale/airflow/), with machine learning steps:

1. Extract a training snapshot (point-in-time features plus labels) from BigQuery.
2. Validate the data: schema, ranges, and drift compared with last time.
3. Train (scikit-learn, XGBoost, PyTorch or BigQuery ML) and tune.
4. Evaluate against the current live model, including fairness checks.
5. Register the model with its metrics and lineage.
6. Deploy (a batch scoring job or an online endpoint) after approval.
7. Monitor, and trigger retraining when needed.

Tools: **Vertex AI Pipelines** (runs Kubeflow Pipelines definitions), **Kubeflow**, **Airflow** (common for batch retraining), **Metaflow**, **ZenML** and **Databricks** workflows.

Press Run the checks, then switch checks off and lower the stop threshold.

<figure class="fig" data-fig="@data-dq-gate"><figcaption>Notice which bad rows slip through when a check is off, and when the gate stops the whole load.</figcaption></figure>


## 3. Tracking, registry and serving

| Need | Google Cloud | Open source and others |
|---|---|---|
| Experiment tracking | Vertex AI Experiments | **MLflow**, Weights & Biases |
| Model registry | Vertex AI Model Registry | MLflow Model Registry |
| Batch prediction | Vertex AI batch prediction, BigQuery ML `ML.PREDICT` | Spark or Airflow jobs |
| Online serving | Vertex AI endpoints | KServe, BentoML, Ray Serve |
| Monitoring | Vertex AI Model Monitoring | Evidently, custom checks |
| Distributed training | Vertex AI training on GPUs and TPUs | Ray, PyTorch distributed, Spark MLlib |

**MLOps** is the name for running all of this reliably: the machine learning version of the testing, deployment and monitoring habits from software engineering.

<div class="myth">

**"We need to buy a feature store before we can do machine learning."** Many teams run well for years on tested, documented BigQuery tables for training and a small Redis or Bigtable copy for serving. Buy or adopt a feature store when several teams reuse the same features and the hand-made copies start to disagree.

</div>

## 4. What "a platform supporting ML" looks like

- **Clean, documented, time-stamped tables** in the warehouse that data scientists trust.
- **Raw history kept** in the lake (Parquet or Iceberg), so features can be rebuilt with new definitions.
- **Reusable feature pipelines** (Spark, BigQuery SQL or dbt, Flink for streaming) with tests.
- **An online store** fed by those pipelines, with freshness monitoring.
- **Reproducibility:** each model linked to its code version, data snapshot and features.
- **Cost controls** on GPU and training jobs, and access controls on personal data.

If you have built tested star schemas and reconciled numbers with finance (as in [Pipeline to Dashboard](/learn/courses/etl/reconciliation/)), you already have the most valuable skill here: trustworthy, well-modelled data. Add point-in-time correctness, feature freshness and model lineage to your vocabulary and you can talk with machine learning teams as an equal.

## 5. Try it (optional code, about 30 minutes)

Install Feast and follow its quickstart, which builds a small demo repository with sample data:

```bash
pip install feast
feast init my_project
cd my_project/feature_repo
feast apply                                   # register the feature definitions
feast materialize-incremental $(date -u +"%Y-%m-%dT%H:%M:%S")   # fill the online store
```

Then run the quickstart's script that fetches online features. Finally, write three sentences that map each Feast piece (feature view, offline store, online store, `materialize`) to its Vertex AI equivalent.

**Check:** the online lookup returns values for the demo's driver IDs, and running `materialize-incremental` again with a later time changes them only for rows with newer data.

**New words:** *feature store*, *feature definition*, *offline store*, *online store*, *materialisation*, *ML pipeline*, *experiment tracking*, *model registry*, *endpoint*, *MLOps*.

<div class="keypoints">

- A feature store = feature definitions + an offline store (full history, for training) + an online store (latest values, for serving).
- Materialisation refreshes the online store; worst-case staleness = data landing delay + time between runs + run time.
- An ML pipeline is a DAG: snapshot, validate, train, evaluate, register, deploy, monitor.
- Experiment tracking and a model registry make every model reproducible and every deployment reversible.

</div>
