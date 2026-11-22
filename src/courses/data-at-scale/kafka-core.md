---
title: 'Kafka: the log at the centre'
summary: 'Topics, partitions, offsets, brokers, replication, producers, consumers and consumer groups, with a local Kafka you can run in one command and Python to talk to it.'
minutes: 30
updated: 2026-11-22
quiz:
  - q: Kafka keeps events in order...
    choices: ['Across the whole topic', 'Within a single partition', 'Never']
    ans: 1
    why: Each partition is an ordered log. Events with the same key go to the same partition, so they stay in order relative to each other. There is no order across partitions.
  - q: A topic has 6 partitions and a consumer group has 8 consumers. What happens?
    choices: ['All 8 share the work equally', '6 consumers get one partition each and 2 sit idle', 'Each consumer reads every message']
    ans: 1
    why: Inside one group, each partition goes to exactly one consumer. The number of partitions caps how many consumers in a group can do useful work.
  - q: What happens to a message after a consumer reads it?
    choices: ['It is deleted', 'Nothing: it stays until retention ends, and each group keeps its own place', 'It moves to another topic']
    ans: 1
    why: Kafka is a log, not a queue that empties. Many groups can read the same data, and you can replay by moving a group's offset back.
sources:
  - 'Apache Kafka documentation: Design and Introduction https://kafka.apache.org/documentation/'
  - 'Kreps, J., Narkhede, N. and Rao, J. (2011), Kafka: a Distributed Messaging System for Log Processing, NetDB workshop'
  - 'Kleppmann, M. (2017), Designing Data-Intensive Applications, O''Reilly, Chapter 11 (Partitioned logs)'
  - 'Confluent documentation: confluent-kafka Python client'
---

**Module 5 · about 30 minutes · read first: 5.1.** You'll be able to explain topics, partitions, offsets, brokers and replication, choose a message key, size a topic's partitions, read consumer lag, and run Kafka on your laptop with a Python producer and consumer.

<div class="bigidea">Kafka is a shared, append-only log split into partitions: producers add events to the end, events with the same key stay in order in one partition, and every reading team keeps its own bookmark.</div>

## 1. Kafka in one paragraph

**Apache Kafka** is a distributed, durable, append-only **log**. "Append-only" means new events are only ever added to the end; nothing is edited in place. It was built at LinkedIn around 2010 to move activity data between systems and became an Apache open-source project soon after. Today it sits in the middle of most event-driven platforms: tills, apps, ad servers and databases write to it; stream processors, warehouses, search indexes and machine learning systems read from it. Confluent, a company founded by Kafka's creators, sells a managed version, and the big clouds offer their own (Amazon MSK, Google Cloud Managed Service for Apache Kafka, and Azure Event Hubs, which speaks the Kafka protocol).

Picture a set of conveyor belts with numbered trays. Each **topic** is a set of belts. Each belt is a **partition**. Every tray placed on a belt gets the next number, its **offset**, and stays on the belt for a set time, say seven days (**retention**), whether anyone has looked at it or not. Teams (**consumer groups**) stand along the belts, each with its own clipboard noting the last tray number it handled. Fraud, stock and marketing read the same trays at their own speed, and anyone can rewind to tray 1,000 and read again.

## 2. The parts

- **Broker:** one Kafka server. A **cluster** has several. Modern Kafka manages its own cluster metadata with **KRaft**; the old dependency on a separate ZooKeeper service was removed in Kafka 4.0.
- **Topic:** a named stream, such as `pos.sales.v1` or `ads.impressions.v1`.
- **Partition:** a slice of a topic, spread across brokers. Each partition is its own ordered log. More partitions mean more work can happen in parallel.
- **Offset:** the position of a message inside one partition: 0, 1, 2, and so on.
- **Message (record):** a **key**, a **value** (bytes, often JSON, Avro or Protobuf), a timestamp and optional headers.
- **Replication:** each partition has a **leader** on one broker and **followers** with copies on others. A replication factor of 3 is the usual choice in production, so the data survives a broker failing.
- **Retention:** keep messages for a time (7 days), up to a size, or forever with **log compaction**, which keeps only the latest value per key (handy for "current price per product").

## 3. Keys decide partitions, and partitions decide order

The producer turns the key into a number (a **hash**) and uses it to pick a partition. All events with key `store-214` land in the same partition, in the order they were sent. So choose the key around what must stay in order: an order ID, a shopper ID, a store.

<div class="steps" data-fig="kafka-core-partitions">
<div class="step"><b>Six sales arrive.</b> Keys are stores: s1, s2, s3, s1, s2, s1. The topic <code>pos.sales.v1</code> has 3 partitions.</div>
<div class="step"><b>Hash the key.</b> hash(s1) mod 3 = 0, hash(s2) mod 3 = 1, hash(s3) mod 3 = 2. Store s1's three sales sit in P0 at offsets 0, 1, 2, in the order they happened. P1 has two, P2 has one.</div>
<div class="step"><b>A consumer group shares the work.</b> Group "store-totals" has three consumers. Kafka gives each one partition: C1 reads P0, C2 reads P1, C3 reads P2.</div>
<div class="step"><b>C3 crashes.</b> Kafka notices it stopped checking in and <b>rebalances</b>: C1 now reads P0 and P2. C1 starts P2 from C3's last committed offset, so nothing is skipped.</div>
<div class="step"><b>A new team arrives.</b> Group "fraud" subscribes and starts at offset 0. It reads every event again, at its own pace, without disturbing "store-totals". Reading never deletes.</div>
</div>

A key that is far too popular, such as one giant advertiser, makes one **hot partition** that does most of the work while the others idle. It is the same skew problem you met in [Making Spark fast and cheap](/learn/courses/data-at-scale/spark-performance/).

<div class="meaning">

<dl>
<dt>Topic</dt><dd>A named stream, like a TV channel. Producers write to it, consumers subscribe.</dd>
<dt>Partition</dt><dd>One ordered slice of a topic. Order is promised only inside a partition.</dd>
<dt>Offset</dt><dd>A message's position number in its partition. A consumer's offset is its bookmark.</dd>
<dt>Consumer group</dt><dd>A team of consumers sharing one job. Each partition goes to exactly one member.</dd>
<dt>Lag</dt><dd>How far a group's bookmark is behind the newest message: latest offset − committed offset, added over partitions.</dd>
<dt>Physical meaning</dt><dd>When a grocer's website shows the right stock seconds after a till sale, a Kafka partition carried that store's sales in order, and a consumer group of a few small programs kept up with every store at once, each reading its own share of the belts.</dd>
</dl>

</div>

## 4. Producers and consumers

- **Producers** send records, group them into batches for efficiency, and wait for an acknowledgement. The setting `acks=all` waits until every in-sync copy has the record: slower but safe, and the default in recent Kafka versions.
- **Consumers** pull records and **commit offsets** to save their progress. If a consumer restarts, it carries on from the last committed offset.
- A **consumer group** shares a topic's partitions among its members. To go faster, add consumers, up to the number of partitions. If one dies, its partitions are handed to the others.

Partitions therefore cap how many consumers can work in parallel. Choosing the count is a sizing sum:

<div class="problem" data-problem="kafka-core-partitions"></div>

The number every on-call engineer watches is **consumer lag**. If it keeps growing, the consumers are too slow; if it shrinks, they are catching up.

<div class="problem" data-problem="kafka-core-lag"></div>

<div class="myth">

**"Kafka is a queue, so a message disappears once it is read."** In a classic queue, yes. In Kafka, reading only moves your own bookmark. The message stays until retention removes it, so other groups can read it and you can replay it after fixing a bug.

</div>

## 5. Run it on your laptop

You need Docker. This starts a single-broker Kafka (good for learning, not for production) and creates a topic with 3 partitions:

```bash
docker run -d --name kafka -p 9092:9092 apache/kafka:latest
docker exec -it kafka /opt/kafka/bin/kafka-topics.sh --bootstrap-server localhost:9092 \
  --create --topic pos.sales.v1 --partitions 3 --replication-factor 1
pip install confluent-kafka
```

A producer that sends 1,000 synthetic till sales, keyed by store:

```python
# producer.py
import json, random, time
from confluent_kafka import Producer

p = Producer({"bootstrap.servers": "localhost:9092", "acks": "all"})
for i in range(1000):
    store = f"store-{random.randint(1, 20)}"
    evt = {"txn": i, "store": store, "sku": random.randint(1, 500),
           "price": round(random.uniform(1, 40), 2), "ts": time.time()}
    p.produce("pos.sales.v1", key=store, value=json.dumps(evt))
    p.poll(0)          # serve delivery reports
p.flush()              # wait until every message is acknowledged
```

A consumer that keeps a running total per store and commits its bookmark after each message:

```python
# consumer.py: run two copies in two terminals and watch them split the partitions
import json
from confluent_kafka import Consumer

c = Consumer({"bootstrap.servers": "localhost:9092", "group.id": "store-totals",
              "auto.offset.reset": "earliest", "enable.auto.commit": False})
c.subscribe(["pos.sales.v1"])
totals = {}
while True:
    m = c.poll(1.0)
    if m is None or m.error():
        continue
    e = json.loads(m.value())
    totals[e["store"]] = totals.get(e["store"], 0) + e["price"]
    print(m.partition(), m.offset(), e["store"], round(totals[e["store"]], 2))
    c.commit(message=m, asynchronous=False)
```

To see lag, run `kafka-consumer-groups.sh --bootstrap-server localhost:9092 --describe --group store-totals` inside the container: it lists each partition's current offset, end offset and lag.

## 6. Kafka and Google Pub/Sub

| | **Kafka** | **Google Pub/Sub** |
|---|---|---|
| Model | Partitioned log; consumers track offsets | Topics and subscriptions; each message acknowledged |
| Order | Per partition | Optional, per ordering key |
| Replay | Move a group's offset back, within retention | Seek to a time or snapshot, within retention |
| Running it | Clusters to size (unless managed) | Serverless: nothing to size |
| Ecosystem | Kafka Connect, Kafka Streams, Schema Registry, a huge community | Built into Google Cloud: Dataflow, BigQuery subscriptions |

Many companies on Google Cloud use both: Kafka as the company-wide event backbone, Pub/Sub for pipelines that live entirely inside Google Cloud.

## 7. Try it

1. Run the producer and two consumers. Stop one consumer and watch the other take over its partitions within a few seconds.
2. Start a consumer with a **new** `group.id` and see it read everything from offset 0.
3. In two sentences, explain why `store` is a reasonable key here, and what would go wrong if you keyed by `txn` instead.

<details>
<summary>What to check</summary>

1. The surviving consumer starts printing partition numbers it did not print before.
2. The new group's first lines show offsets 0, 1, 2 on each partition.
3. Keying by store keeps each store's sales in order in one partition, so a running total per store is correct. Keying by `txn` spreads one store's sales over all partitions, so two consumers would each hold half a store's total and nothing keeps that store's events in order.
</details>

**New words:** *broker*, *partition*, *offset*, *replication factor*, *retention*, *log compaction*, *key*, *consumer group*, *rebalance*, *consumer lag*.

<div class="keypoints">

- Kafka is an append-only log: producers add to the end, consumers read with their own bookmark (offset), and reading never deletes.
- A topic is split into partitions; the key picks the partition, and order is kept only inside a partition.
- In a consumer group each partition has exactly one reader, so partitions cap parallelism: partitions ≥ throughput needed ÷ throughput per consumer.
- Replication (usually 3 copies) keeps data safe when a broker fails; lag tells you whether consumers are keeping up.

</div>
