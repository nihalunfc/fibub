// Data at Scale (nihal, 2026-11-22): big data, cloud and streaming, rebuilt on fibub to the new learning standard from
// the old nihalsulaiman.com course (30 lessons). Lesson kit on (kit: true); live problems in public/learn-kit/data-at-scale/problems.js.
import type { CourseSyllabus } from '../types';

export const DATA_AT_SCALE: CourseSyllabus = {
  id: 'data-at-scale',
  kit: true,
  name: "Data at Scale",
  title: "Data at Scale: big data, cloud and streaming, explained simply",
  text: "How companies process data too big for one computer: Spark and PySpark, the Google Cloud data stack (Cloud Storage, BigQuery, Dataproc, Airflow), Druid, Bigtable and Elasticsearch, Kafka and stream processing, data platforms for AI, and retail media measurement, with animations and live problems.",
  audience: "For analysts and BI developers who know some SQL and Python and keep seeing these tools in job postings, and anyone who wants the big picture first.",
  updated: '2026-11-22',
  footnote: 'All company data in the examples is synthetic. Tool versions and prices change: check the official docs before you rely on them.',
  parts: [
    { name: 'Part A: Processing at scale', modules: [
      { n: 1, name: "The big picture", lessons: [
        ['1.1', 'why-big-data', "Why big data needs different tools"],
        ['1.2', 'the-map', "The map: how the pieces connect"],
        ['1.3', 'who-uses-what', "Who uses what, and why, by industry"],
      ] },
      { n: 2, name: "Spark and distributed processing", lessons: [
        ['2.1', 'how-spark-works', "How distributed processing works"],
        ['2.2', 'pyspark-basics', "PySpark DataFrames, hands on"],
        ['2.3', 'spark-performance', "Making Spark fast and cheap"],
        ['2.4', 'spark-family', "Spark's relatives, and when not to use Spark"],
      ] },
      { n: 3, name: "The Google Cloud data stack", lessons: [
        ['3.1', 'gcp-tour', "A tour of the Google Cloud data stack"],
        ['3.2', 'gcs-data-lake', "Cloud Storage and the data lake"],
        ['3.3', 'bigquery', "BigQuery: the warehouse with no servers"],
        ['3.4', 'dataproc', "Dataproc: Spark on Google Cloud"],
        ['3.5', 'airflow', "Airflow and Cloud Composer"],
      ] },
    ] },
    { name: 'Part B: Storing and streaming', modules: [
      { n: 4, name: "Analytical and NoSQL databases", lessons: [
        ['4.1', 'database-zoo', "The database zoo"],
        ['4.2', 'druid', "Apache Druid and real-time OLAP"],
        ['4.3', 'bigtable', "Bigtable and wide-column stores"],
        ['4.4', 'elasticsearch', "Elasticsearch, and choosing a store"],
      ] },
      { n: 5, name: "Streaming with Kafka", lessons: [
        ['5.1', 'events-and-streams', "Thinking in events and streams"],
        ['5.2', 'kafka-core', "Kafka: the log at the centre"],
        ['5.3', 'kafka-reliability', "Reliable streams: guarantees, schemas, Connect and CDC"],
        ['5.4', 'stream-processing', "Stream processing: windows, watermarks and state"],
      ] },
    ] },
    { name: 'Part C: Platforms in practice', modules: [
      { n: 6, name: "Data platforms for AI and ML", lessons: [
        ['6.1', 'what-ml-needs', "What machine learning needs from a data platform"],
        ['6.2', 'feature-stores-mlops', "Feature stores, pipelines and MLOps"],
        ['6.3', 'data-for-genai', "Data for LLMs and generative AI"],
        ['6.4', 'platform-architecture', "Platform architecture: putting it together"],
      ] },
      { n: 7, name: "Retail media, adtech and measurement", lessons: [
        ['7.1', 'retail-media-101', "Retail media 101"],
        ['7.2', 'adtech-plumbing', "Adtech plumbing: how an ad gets served"],
        ['7.3', 'measurement', "Measurement: did the ads work?"],
        ['7.4', 'retail-media-platform', "Capstone: design a retail media data platform"],
      ] },
      { n: 8, name: "What to learn next", lessons: [
        ['8.1', 'learning-path', "What to learn, in what order"],
        ['8.2', 'postings-and-interviews', "Job postings, interviews and honest stories"],
        ['8.3', 'mini-projects', "Mini projects for your portfolio"],
        ['8.4', 'free-sandboxes', "Free sandboxes to practise in"],
      ] },
    ] },
  ],
};
