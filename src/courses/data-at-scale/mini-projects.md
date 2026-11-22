---
title: Mini projects for your portfolio
summary: 'Seven mini projects and a capstone on synthetic or public data and free tools, with a README checklist and how to plant faults and answers in your data.'
minutes: 20
updated: 2026-11-22
quiz:
  - q: Why plant a known lift (say +15%) in your capstone's synthetic data?
    choices: ['To make the charts look better', 'So you can check that your pipeline and maths recover the answer you put in', 'Because real data never has a lift']
    ans: 1
    why: If your measured interval does not contain the planted lift, something in the pipeline or the maths is wrong. It is a test with a known answer.
  - q: Which data may you use in a portfolio project?
    choices: ['An employer''s data, if you mask the names', 'Synthetic or public data only', 'Any data you can download']
    ans: 1
    why: Employer data, even masked, is not yours to publish. Synthetic and public data keep you and your future employer safe.
  - q: Why seed the random generator?
    choices: ['So others can reproduce exactly the same data and results', 'To make the data bigger', 'Because Python requires it']
    ans: 0
    why: A fixed seed gives the same "random" rows every run, so reviewers can rerun your project and get your numbers.
sources:
  - 'Reis, J. and Housley, M. (2022), Fundamentals of Data Engineering, O''Reilly'
  - 'NumPy documentation: Random Generator (numpy.org/doc)'
  - 'Kohavi, R., Tang, D. and Xu, Y. (2020), Trustworthy Online Controlled Experiments, Cambridge University Press'
---

**Module 8 · about 20 minutes to read; the projects take 45 minutes to 10 hours each.** You'll be able to pick the right project for each module, write a README a hiring manager can read in two minutes, and generate synthetic data with planted faults and a planted answer you can check.

<div class="bigidea">A portfolio project proves a skill only if someone else can run it and see that it handles the messy cases, so build on synthetic data with faults and answers you planted on purpose, and write the README for a stranger.</div>

## 1. The projects

Each module ends with a mini project that uses what you just read. Together they build towards the capstone: a small but complete retail media data platform. All data is **synthetic or public**: never use an employer's data, even masked.

| # | Project | Module | What it shows | Time |
|---|---|---|---|---|
| 1 | [Platform one-pager](/learn/courses/data-at-scale/who-uses-what/) | The big picture | You can map tools to jobs and justify them | 45 min |
| 2 | [The nightly sales job](/learn/courses/data-at-scale/spark-family/) | Spark | PySpark cleaning, joins, skew, partitioned Parquet, reading the plan | 2 to 3 h |
| 3 | [The cloud nightly pipeline](/learn/courses/data-at-scale/airflow/) | Google Cloud | An Airflow DAG, sensors, safe backfills, BigQuery marts, a cost estimate | 3 to 4 h |
| 4 | [Three stores, one dataset](/learn/courses/data-at-scale/elasticsearch/) | Databases | Real-time OLAP, key-value design and search, compared honestly | 3 h |
| 5 | [The live store dashboard](/learn/courses/data-at-scale/stream-processing/) | Kafka | Schemas, dead letters, windows, watermarks, restarts without double counting | 3 to 4 h |
| 6 | [An ML-ready feature pipeline](/learn/courses/data-at-scale/platform-architecture/) | AI and ML | Point-in-time features, a leakage test, an online lookup | 3 to 4 h |
| 7 | [Capstone: retail media platform](/learn/courses/data-at-scale/retail-media-platform/) | Retail media | A design document, a streaming and batch slice, attribution against measured lift | 6 to 10 h |
| 8 | [Decode a posting](/learn/courses/data-at-scale/postings-and-interviews/) | What next | Your evidence mapped to a real job, honest experience statements | 1 h |

New to pipelines altogether? The seven "proof" projects in [Pipeline to Dashboard](/learn/courses/etl/) are a gentler first portfolio, and each one feeds the projects here.

## 2. What every README needs

1. **The business question** in one sentence, and who would ask it.
2. **A diagram** of the flow, with each tool and why it was chosen.
3. **How to run it** in under five commands.
4. **Tests and checks:** row counts, duplicates, freshness, a reconciliation against the source.
5. **Results:** the numbers or screenshots, and what they mean.
6. **Cost:** what it would cost per month at a realistic scale, with your working (and "check the official price list" next to any price).
7. **What I would do next** with a real team and real data.

## 3. Plant the faults, plant the answer

Real data is messy, and a project on perfectly clean data proves little. So plant the mess yourself, on purpose, where you know exactly how much there is:

- **Faults:** duplicates, late events, nulls in keys, one hot key, refunds as negative amounts, a schema change halfway through.
- **The answer:** for the capstone, set a true lift (say +15%) and check that your measurement recovers it within its confidence interval.
- **A seed:** fix the random seed so others can reproduce your exact data and results.

Think of a teacher writing an exam with an answer key. You plant the answer in the data first, then build the pipeline that has to find it. If the pipeline misses, you know there is a bug, and you know before an interviewer finds it.

<div class="steps">
<div class="step"><b>Generate.</b> 50,000 shoppers, seed 42. 10% go to a holdout. Base buying rate 4%; exposed shoppers get +15%, so 4.6%.</div>
<div class="step"><b>Plant faults.</b> Copy 1% of impression events (duplicates), push 5% of event times 20 minutes into the past (late), and make one bot user with 3,000 clicks.</div>
<div class="step"><b>Run the pipeline.</b> De-duplicate by event ID, filter the bot, window with a watermark, build <code>fct_sales</code> and the measurement table.</div>
<div class="step"><b>Check the faults.</b> Rows removed by de-duplication should equal the duplicates you planted; the bot should be gone; late events dropped should match your watermark choice.</div>
<div class="step"><b>Check the answer.</b> Planted: about 270 extra buyers (45,000 exposed × 0.6 points). Measured: 255, with a 95% interval of about 0 to 510. The planted answer is inside, so the pipeline passes. The interval is wide because a 5,000-shopper holdout is small: a lesson about sample size you learned without spending a cent.</div>
</div>

<div class="problem" data-problem="mini-projects-planted-lift"></div>

A seeded generator in Python takes a few lines:

```python
import numpy as np, pandas as pd

rng = np.random.default_rng(42)                  # fixed seed: same data every run
n, holdout, base, lift = 50_000, 0.10, 0.04, 0.15
users = pd.DataFrame({"user_id": np.arange(n)})
users["group"] = np.where(rng.random(n) < holdout, "holdout", "exposed")
p = np.where(users["group"] == "exposed", base * (1 + lift), base)
users["bought"] = rng.random(n) < p
print(users.groupby("group")["bought"].agg(["size", "mean"]))
```

**Check:** the exposed buying rate comes out near 4.6% and the holdout near 4.0%, and rerunning gives exactly the same table.

<div class="meaning">

<dl>
<dt>Synthetic data</dt><dd>Data you generate with code, so it contains no real person and you know its true patterns.</dd>
<dt>Planted fault</dt><dd>A known mess (duplicates, late events, a bot) added on purpose to test the pipeline.</dd>
<dt>Planted answer</dt><dd>A true effect you set, such as +15% lift, that the analysis must recover.</dd>
<dt>Seed</dt><dd>The starting number for the random generator, which makes the "random" data repeatable.</dd>
<dt>Physical meaning</dt><dd>When a hiring manager opens your repository, runs one command and sees a check that says "planted 270 extra buyers, measured 255, inside the 95% interval: pass", they know you test your own work. That single line says more than a page of claimed skills.</dd>
</dl>

</div>

<div class="myth">

**"A portfolio project should use real company data to be impressive."** Real company data is not yours to publish, even masked, and using it can end an application. Synthetic data with planted faults is more impressive, because it shows you know what can go wrong and can prove your pipeline catches it.

</div>

## 4. Try it

Pick the project for the module you finished most recently. Before writing any pipeline code, write the README's first three sections (question, diagram, how to run) and a list of three faults you will plant.

**Check:** a friend who does not work in data can read the question and the diagram and say, in their own words, what the project does.

**New words:** *synthetic data*, *planted fault*, *planted answer*, *random seed*, *reproducible*.

<div class="keypoints">

- One project per module, building towards a retail media capstone; all data synthetic or public.
- Every README: the question, a diagram, how to run, tests and checks, results, cost, next steps.
- Plant faults (duplicates, late events, hot keys, schema changes) and a known answer, and check the pipeline finds both.
- Seed your generator so anyone can reproduce your data and results exactly.

</div>
