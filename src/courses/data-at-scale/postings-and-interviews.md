---
title: Job postings, interviews and honest stories
summary: 'Decode a big-data job posting, answer concept and design questions with a clear structure, size a system quickly, and describe your experience honestly.'
minutes: 25
updated: 2026-11-22
quiz:
  - q: A posting says "familiarity with Druid, Bigtable or Elasticsearch". What does that usually mean?
    choices: ['Years of production experience with all three', 'You understand when to use each and have tried at least one', 'Nothing: ignore it']
    ans: 1
    why: '"Familiarity" is weaker than "experience with". Knowing which store fits which job, plus one small hands-on project, is a fair match.'
  - q: What is the first step in answering a system design question?
    choices: ['Name your favourite tools', 'Clarify the users, delay, volume, accuracy and privacy needs', 'Start drawing boxes immediately']
    ans: 1
    why: The right design depends on the requirements. Asking first also shows the interviewer how you work with real stakeholders.
  - q: Which is an honest, strong way to describe hands-on learning?
    choices: ['"I am a Kafka expert"', '"I have not run Kafka in production; I built a local pipeline with three partitions, a dead-letter topic and restart-safe counts, and here is the repository"', '"I have used every streaming tool"']
    ans: 1
    why: Specific, scoped claims with proof survive technical rounds. Inflated claims collapse at the first follow-up question.
sources:
  - 'Kleppmann, M. (2017), Designing Data-Intensive Applications, O''Reilly'
  - 'Reis, J. and Housley, M. (2022), Fundamentals of Data Engineering, O''Reilly'
  - 'Xu, A. (2020), System Design Interview: An Insider''s Guide, independently published'
---

**Module 8 · about 25 minutes · read first: 8.1.** You'll be able to turn a posting's requirements into a study and portfolio plan, answer common concept and design questions with a clear structure, do the back-of-envelope sizing interviewers ask for, and describe partial experience truthfully.

<div class="bigidea">Interviews reward structure and honesty: decode what the posting really asks for, answer every question with the same calm framework, and describe exactly what you have done, with proof, rather than what you wish you had done.</div>

## 1. Decode the posting

Here is the kind of requirement list you will see for a big-data role at a large retailer's media business (paraphrased and combined from several postings):

- Builds and tunes batch jobs in Spark or PySpark.
- Works with Google Cloud data services: Dataproc, BigQuery, Cloud Storage and Airflow.
- Knows analytical or NoSQL stores such as Druid, Bigtable or Elasticsearch.
- Has used streaming technology such as Kafka.
- Has built data platforms that support machine learning.
- Nice to have: retail media, advertising technology or measurement.

| Requirement | What they really want | Your evidence after this course |
|---|---|---|
| Spark / PySpark | Can write, debug and tune batch jobs | Module 2 mini project, with the plan and Spark UI screenshots |
| Google Cloud: Dataproc, BigQuery, Cloud Storage, Airflow | Can build a scheduled cloud pipeline | Module 3 mini project, with a cost estimate |
| Druid, Bigtable, Elasticsearch | Knows when to use which; has touched one | Module 4 mini project and its decision table |
| Kafka | Understands topics, partitions, consumer groups, guarantees | Module 5 mini project, with late data and restarts |
| Platforms for ML | Builds time-correct features and reliable data for models | Module 6 mini project |
| Retail media, adtech, measurement | Speaks the domain: attribution, incrementality, pacing | Module 7 and the capstone |

Read **"experience with"** as "has done it", **"familiarity"** as "understands it and has tried it", and **"nice to have"** as optional. Apply when you match most of the core and can show learning on the rest.

## 2. Concept questions: what, why, example

Answer every concept question in three parts: **what** it is, **why** it matters, and a short **example**.

- *What is a shuffle and why is it expensive?* Data moves across the network between stages for wide operations like group-by and join; it costs disk, network and memory. Example: a group-by on store, made cheaper by pre-aggregating or broadcasting a small table.
- *How does Kafka keep order?* Only within a partition; key by what must stay in order. Example: keying by order ID.
- *Partitioning or clustering in BigQuery?* Partitioning skips whole date or range slices; clustering sorts within partitions so selective filters read less. Example with bytes scanned before and after.
- *When would you not stream?* When nobody acts faster than daily; streaming costs money and on-call time.
- *Attribution or incrementality?* Credit against cause; a holdout design; iROAS against ROAS.
- *What is point-in-time correctness?* Features use only data known at prediction time. Example: a "spend this month" feature that leaked days after the coupon was sent.

## 3. Design questions: one structure, every time

A pilot does not improvise the take-off; they run the same checklist every time, which frees their attention for the unusual. A fixed answer structure does the same for you:

1. **Clarify:** users, delay, volume, accuracy, privacy.
2. **Sketch:** sources, ingest, store, process, serve, use.
3. **Choose:** each store and engine **with a reason**, and an alternative you rejected.
4. **Break it:** late data, duplicates, a failed job, a schema change, a hot key. How would you notice, and how would you recover?
5. **Cost and running it:** what drives the bill, what you monitor, who is on call.

<div class="steps">
<div class="step"><b>Clarify.</b> "Design frequency capping: at most 3 ads per shopper per campaign per day." You ask: how many ad requests per second at peak? (About 20,000.) How fast must the check be? (Under 10 ms.) Is a rare fourth ad a disaster? (No, but billing must be exact.)</div>
<div class="step"><b>Sketch.</b> Ad server, then a counter lookup, then serve or skip; impressions to Kafka; a stream job increments counters; the exact count for billing comes from the nightly batch.</div>
<div class="step"><b>Choose.</b> Counters in Bigtable or Redis with key <code>user#campaign#date</code>, because lookups are by exact key in milliseconds. Rejected: BigQuery, because it is built for scans, not 20,000 single-row reads a second.</div>
<div class="step"><b>Break it.</b> If the stream job lags, counters fall behind and some shoppers see a fourth ad: monitor consumer lag and alert. Duplicated impression events would over-count, so de-duplicate by event ID before incrementing.</div>
<div class="step"><b>Cost and running it.</b> The bill is driven by the counter store's nodes and memory; keys expire after a day, so the store stays small. Someone is on call for the real-time path; billing runs in batch and can wait until morning.</div>
</div>

Practice prompts: "design live campaign dashboards for 5,000 advertisers", "design a nightly pipeline for 2 billion till lines", "how would you measure whether in-store screens increase sales?"

Interviewers often ask for a quick size estimate. Doing it out loud, with round numbers, shows you understand how storage and pruning work:

<div class="problem" data-problem="postings-and-interviews-sizing"></div>

<div class="meaning">

<dl>
<dt>What, why, example</dt><dd>A three-part answer to any concept question.</dd>
<dt>Clarify, sketch, choose, break, cost</dt><dd>A five-step answer to any design question.</dd>
<dt>Bridge and proof</dt><dd>Pair each gap with related work you did do and a link they can open.</dd>
<dt>Back-of-envelope sizing</dt><dd>A quick estimate with round numbers: rows, bytes, compression, how much a query reads.</dd>
<dt>Physical meaning</dt><dd>Two candidates with the same skills: one jumps to "I would use Kafka and Druid", the other asks three questions, sketches the flow, names what could break and estimates the cost. The second one gets the offer, because that is exactly how the job is done on a real Monday morning.</dd>
</dl>

</div>

## 4. Telling the truth about experience

Interviewers forgive gaps; they do not forgive inflated claims that fall apart in a technical round. Use **specific, scoped** language:

- "In a personal project I built a PySpark job over 2 million synthetic till lines, found skew from one online store in the Spark UI, and fixed it with salting, which cut the stage from 6 minutes to 50 seconds on my laptop."
- "I have not run Kafka in production. I built a local pipeline with three partitions, a consumer group, a dead-letter topic and a Structured Streaming job that survives restarts without double counting."
- "My production experience is in SQL warehouses and BI. The measurement maths in retail media is the same discipline I used when reconciling reports with finance."

Pair each gap with a **bridge** (related work you did do) and a **proof** (a repository or write-up they can open).

<div class="myth">

**"Everyone exaggerates, so I have to as well."** A technical interviewer's job is to ask one more question than you prepared for. A scoped, honest answer with a link to working code is stronger than a big claim, and it protects you in the job itself.

</div>

## 5. Portfolio checklist

- One **pipeline repository** per mini project, each with a README: the problem, a diagram, how to run it, tests, results, cost, and what you would do next (Lesson 8.3 has the full checklist).
- The **capstone** design document and working slice, pinned on your GitHub profile.
- A short **blog post** per project explaining one hard thing you learned (skew, watermarks, iROAS).
- All data **synthetic or public**, never an employer's.

## 6. You have finished the course

You can now draw a modern data platform from memory; explain Spark, BigQuery, Dataproc, Cloud Storage, Airflow, Druid, Bigtable, Elasticsearch and Kafka in plain words; say who uses each and why; build small working versions of each; and explain how a retail media network proves its ads work. That is a solid foundation. The next step is depth: pick the two tools your target roles mention most and build one more serious project on each.

## 7. Final task (about 1 hour)

Take one real posting you would like to apply for. Fill in the "decode" table above with **your** evidence, linking to your repositories. Write three honest experience statements in the bridge-and-proof style. Then go to [Mini projects for your portfolio](/learn/courses/data-at-scale/mini-projects/) and tick off what you have built.

**Check:** every row of your table links to something a stranger can open, and none of your statements claims production experience you do not have.

**New words:** *requirement decoding*, *what-why-example*, *design framework*, *back-of-envelope sizing*, *bridge and proof*.

<div class="keypoints">

- Read "experience with" as done it, "familiarity" as understood and tried, "nice to have" as optional; map each requirement to a piece of your own evidence.
- Answer concept questions with what, why, example; design questions with clarify, sketch, choose, break, cost.
- Size systems out loud with round numbers: rows, bytes, compression, partitions and columns read.
- Describe experience in specific, scoped terms, and pair each gap with a bridge and a proof.

</div>
