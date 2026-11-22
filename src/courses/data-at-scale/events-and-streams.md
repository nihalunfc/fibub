---
title: Thinking in events and streams
summary: 'Why companies move from nightly files to events, what an event and a stream are, the words people use, and how to tell when streaming is worth its extra cost.'
minutes: 20
updated: 2026-11-22
quiz:
  - q: Which of these is an event?
    choices: ['The current stock level table', '"Order 991 was placed by shopper 42 at 10:02:07 for $38.10"', 'A dashboard of sales by week']
    ans: 1
    why: An event is a fact that something happened at a moment in time, and it never changes afterwards. A table of current state is built from many events.
  - q: Which use case really needs streaming?
    choices: ['A monthly sales report', 'Blocking a stolen card payment before it goes through', 'A yearly tax filing']
    ans: 1
    why: Streaming earns its cost only when the value of acting disappears within seconds or minutes. A payment that has cleared cannot be stopped.
  - q: What does publish-subscribe (pub/sub) mean?
    choices: ['A producer sends data to one named reader', 'Producers write to a named topic and any number of readers can read it on their own', 'Only one app may read the data']
    ans: 1
    why: The producer does not know or care who reads. New readers can be added without changing the producer, which is the main benefit.
sources:
  - 'Kleppmann, M. (2017), Designing Data-Intensive Applications, O''Reilly, Chapter 11 (Stream processing)'
  - 'Reis, J. and Housley, M. (2022), Fundamentals of Data Engineering, O''Reilly, Chapter 7 (Ingestion: batch versus streaming)'
  - 'Apache Kafka documentation: Introduction https://kafka.apache.org/documentation/#introduction'
---

**Module 5 · about 20 minutes · read first: 1.2.** You'll be able to say what an event and a stream are, use the words latency, throughput, producer, consumer and topic correctly, and decide whether a job needs batch, micro-batch or real-time streaming.

<div class="bigidea">An event is a small, permanent fact that something happened at a moment in time; a stream is the never-ending line of those facts, and streaming is worth its cost only when someone must act on them within seconds or minutes.</div>

## 1. From files to events

If you have built a pipeline in [Pipeline to Dashboard](/learn/courses/etl/), you know the batch world: last night's file lands at 4 am, a job runs at 6, the dashboard is ready at 8. That is **batch** processing: collect a pile of data, then process the whole pile on a schedule. It is simple, cheap and still the right answer for most reporting.

**Streaming** looks at the same business differently. Instead of a nightly pile, data is a continuous flow of **events**. An event is a small record that says "this happened, at this moment":

```json
{"event": "add_to_cart", "user": "u42", "sku": 88231, "qty": 1, "price": 4.99, "ts": "2026-11-04T10:02:07.311Z", "app": "ios"}
```

Two things make an event special. It has a **timestamp**, and it is **immutable**: once it happened, it never changes. If the shopper removes the item, that is a new event (`remove_from_cart`), not an edit of the old one.

A **stream** is the ordered, never-ending line of these events. Any "current state" you care about, such as what is in the cart right now, can be rebuilt by replaying the events from the start.

Think of a newspaper and a live radio feed. Batch is the morning paper: everything from yesterday, edited, complete, a few hours late. Streaming is live radio: you hear it as it happens, but it is harder to produce, mistakes go out live, and someone has to be on air all night.

<div class="steps">
<div class="step"><b>10:02:07.</b> Shopper u42 taps "add to cart" in the grocery app. The app writes one event: <code>add_to_cart, u42, sku 88231, $4.99</code>.</div>
<div class="step"><b>10:02:07.4.</b> The event reaches a named stream, the topic <code>web.events.v1</code>. Nothing is overwritten: it is added to the end of the line.</div>
<div class="step"><b>10:02:08.</b> Three teams read the same event on their own. Stock reserves one unit; marketing counts an add-to-cart for a brand's campaign; fraud checks the device.</div>
<div class="step"><b>10:09:30.</b> The shopper removes the item. A second event, <code>remove_from_cart</code>, joins the line. The first event is still there.</div>
<div class="step"><b>Replay.</b> To know "what is in u42's cart now", add up both events: +1 then −1 = empty. Current state is just the sum of the history.</div>
</div>

## 2. The words people use

- **Latency:** how long from an event happening to it being usable. Batch: hours. Micro-batch: seconds to minutes. Real-time streaming: under a second to a few seconds.
- **Throughput:** how many events per second the system handles. Size it for the busiest minute, not the daily average.
- **Producer and consumer:** the program that writes events, and the program that reads them.
- **Topic:** a named stream, like a TV channel. `pos.sales.v1` might carry every till sale.
- **Publish-subscribe (pub/sub):** producers write to a topic; any number of consumers read it, each at their own pace. The till system does not know or care that fraud, stock and marketing all read its events. A new team can start reading tomorrow without anyone changing the tills.
- **Event time and processing time:** when it happened, and when your system saw it. A phone that went offline in a tunnel may send its events 20 minutes late. The gap between the two causes most streaming bugs, and Lesson 5.4 shows how engines handle it.

<div class="meaning">

<dl>
<dt>Event</dt><dd>A permanent record that something happened at a moment: an order, a click, a price change, a sensor reading.</dd>
<dt>Stream</dt><dd>The ordered, never-ending line of events of one kind, usually kept in a topic.</dd>
<dt>Latency</dt><dd>The delay from "it happened" to "we can use it".</dd>
<dt>Throughput</dt><dd>How many events per second must flow through, at the busiest moment.</dd>
<dt>Physical meaning</dt><dd>A supermarket's tills, app and shelf sensors all speak at once, all day. A stream is the shared notebook they write in, line after line, so that stock, fraud and marketing can each read along as fast as they need, instead of waiting for a summary the next morning.</dd>
</dl>

</div>

## 3. How big is the stream? Size for the peak

Events per day sound huge but are spread over 86,400 seconds. The trouble is that they are not spread evenly: lunch, payday and Black Friday all bunch them up. A system sized for the average falls over at the peak.

<div class="problem" data-problem="events-and-streams-peak"></div>

## 4. Where streaming pays off

| Industry | Use case | Why minutes matter |
|---|---|---|
| Payments and banking | Fraud scoring | Stop the payment before it clears |
| Retail and grocery | Live stock, click-and-collect, price changes | Don't sell what is not on the shelf |
| Retail media and adtech | Budget pacing, frequency caps, live campaign dashboards | An overspent budget cannot be taken back |
| Logistics | Parcel and vehicle tracking, arrival times | Customers are watching the map |
| Energy | Grid balancing from meters and sensors | Supply must match demand every second |
| Software | Monitoring and alerts | An outage costs money every minute |
| Data platforms | **Change data capture** (CDC) from databases | Keep the warehouse minutes behind, not a day |

## 5. When not to stream

Streaming costs more than batch in three ways: always-on machines, harder code (late and duplicate events), and people on call at night. Don't stream when:

- nobody acts on the data faster than daily;
- the source only sends a file once a day anyway;
- there is no one to be on call for a pipeline that runs 24 hours a day.

A good middle ground is **micro-batch**: run a small batch every 5 or 15 minutes. Many "real-time" dashboards are really this, and that is fine.

<div class="myth">

**"Real-time is always better."** Faster data costs more money and more attention. A weekly sales review gains nothing from second-by-second numbers. Ask "what decision changes if this number is 10 minutes old instead of 10 seconds?" If the answer is "none", choose batch or micro-batch.

</div>

## 6. The streaming toolbox

| Job | Tools you will see in job postings |
|---|---|
| Event log or message bus | **Apache Kafka**, Confluent Cloud, Redpanda, Google **Pub/Sub**, Amazon Kinesis, Azure Event Hubs, Apache Pulsar |
| Stream processing | **Apache Flink**, **Spark Structured Streaming**, **Dataflow** (Apache Beam), Kafka Streams |
| Change data capture | **Debezium**, Google Datastream |
| Real-time stores | Druid, Pinot, ClickHouse, Bigtable, BigQuery streaming inserts |

You met the real-time stores in Module 4 ([Apache Druid](/learn/courses/data-at-scale/druid/), [Bigtable](/learn/courses/data-at-scale/bigtable/)). The next lesson opens up Kafka, the log at the centre of most of these designs.

## 7. Try it

For a supermarket, list five data flows (for example till sales, online orders, shelf sensors, price changes, loyalty sign-ups). For each, write the latency the business really needs and choose batch, micro-batch or streaming. Then justify the most expensive choice in one sentence.

<details>
<summary>One possible answer</summary>

Till sales for the finance report: daily batch. Online orders for pickers in store: streaming (seconds). Shelf sensors for "low stock" alerts: micro-batch every 5 minutes. Price changes to the website and shelf labels: streaming or CDC (minutes), because a wrong price is a legal and trust problem. Loyalty sign-ups for the welcome email: micro-batch hourly. Most expensive: online orders, justified because a picker cannot start a basket the shopper has not been sent yet.

**Check:** every flow has a latency in plain units (seconds, minutes, hours), and only flows where a decision changes within minutes are marked streaming.
</details>

**New words:** *event*, *stream*, *batch*, *micro-batch*, *latency*, *throughput*, *producer*, *consumer*, *topic*, *publish-subscribe*, *event time*.

<div class="keypoints">

- An event is a permanent, timestamped fact; a stream is the endless ordered line of them, and current state can be rebuilt by replaying it.
- Latency is "how late", throughput is "how many per second". Size for the busiest minute, not the average.
- Publish-subscribe lets many teams read the same events without the producer knowing about them.
- Stream only when a decision loses its value within minutes. Otherwise batch or micro-batch is cheaper and simpler.

</div>
