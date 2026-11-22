---
title: 'Adtech plumbing: how an ad gets served'
summary: 'Ad servers, auctions, real-time bidding, DSPs and SSPs, identity and consent, frequency caps and pacing, clean rooms, and the event data every step creates.'
minutes: 30
updated: 2026-11-22
quiz:
  - q: In a sponsored products auction ranked by bid × predicted click rate, can a lower bid win?
    choices: ['No, the highest bid always wins', 'Yes, if its ad is predicted to be clicked enough more often', 'Only on weekends']
    ans: 1
    why: The ad server ranks by expected value per impression. A $0.80 bid with a 4% click rate (score 3.2) beats a $1.50 bid with a 1.5% click rate (score 2.25).
  - q: What does a frequency cap need from the data platform?
    choices: ['A monthly report', 'A very fast counter per user and campaign, read before every ad is shown', 'A data warehouse table updated nightly']
    ans: 1
    why: '"At most 3 impressions per user per day" must be checked within milliseconds, so the counter lives in a fast key-value store such as Bigtable or Redis.'
  - q: What does a data clean room allow?
    choices: ['Two companies to swap raw customer lists', 'Two companies to join their data and see only approved, aggregated results', 'Deleting all data']
    ans: 1
    why: Each side puts data into a controlled space where only approved queries run, with minimum audience sizes and no row-level export.
sources:
  - 'IAB Tech Lab: OpenRTB specification (iabtechlab.com)'
  - 'Edelman, B., Ostrovsky, M. and Schwarz, M. (2007), Internet Advertising and the Generalized Second-Price Auction, American Economic Review 97(1), 242-259 https://doi.org/10.1257/aer.97.1.242'
  - 'Google Cloud documentation: BigQuery data clean rooms (cloud.google.com/bigquery/docs)'
---

**Module 7 · about 30 minutes · read first: 7.1, 4.3.** You'll be able to walk through an ad request from page load to impression, name the pieces (ad server, DSP, SSP, exchange, clean room), work out who wins an auction and what they pay, check a campaign's pacing, and design the topics and stores behind real-time ad controls.

<div class="bigidea">Every time a page loads, a tiny auction runs in about a tenth of a second, and every step of it (request, bid, win, impression, click) leaves an event that the data platform must count, control and later match to sales.</div>

## 1. An ad request in about 100 milliseconds

A shopper opens the grocery app's search results for "cola".

1. The app sends an **ad request** to the **ad server** with the context: page, placement, search term, a user or device ID, and consent flags.
2. For **sponsored products**, the retailer's own auction picks eligible ads (cola brands bidding on "cola", in stock, with budget left, under their frequency caps), scores them by **bid × predicted click rate** (often with a relevance factor too) and returns the winners.
3. For **display or offsite** ads, the request may go to an **SSP** and an **ad exchange**, which run a **real-time bidding (RTB)** auction: many **DSPs** receive a bid request, decide within tens of milliseconds whether and how much to bid, and the best bid wins.
4. The ad appears. The device fires an **impression** event; a viewability script fires a **viewable impression** when enough of the ad is on screen for long enough; a tap fires a **click**.
5. Later, an **order** or store purchase is linked back to that exposure for **attribution** (Lesson 7.3).

Each step writes events: requests, bids, wins, losses, impressions, clicks, conversions. A busy network creates billions of events a day.

Think of a lightning-fast auction house. Each page load puts one seat at a show up for sale (an impression). The auctioneer (exchange) calls out the seat's details; buyers' agents (DSPs) have a tenth of a second to bid for their clients (advertisers); the seller's agent (SSP) wants the best price; the box office (ad server) prints the ticket. It happens billions of times a day, and every call and bid is written in the ledger.

## 2. How the auction picks a winner

Ranking only by bid would fill the page with ads nobody clicks, which earns the retailer nothing on a pay-per-click deal and annoys shoppers. So the ad server ranks by **expected value**: bid × predicted click rate (CTR). The predicted CTR comes from a machine learning model fed by past impressions and clicks, which is one reason clean event data matters.

Many sponsored-products auctions use a **second-price** rule: the winner pays just enough to have beaten the runner-up, not its full bid. In a ranking by score, that price is the runner-up's score divided by the winner's CTR, plus one cent.

<div class="steps" data-fig="adtech-plumbing-auction">
<div class="step"><b>The bids.</b> Four brands bid per click on "cola": A $1.20, B $0.80, C $1.50, D $0.60. Brand C bids the most.</div>
<div class="step"><b>The predicted click rates.</b> The model expects A's ad to be clicked 2% of the time, B's 4%, C's 1.5%, D's 3%. Shoppers like B's ad: it is the brand they usually buy, at a good price.</div>
<div class="step"><b>The scores.</b> Bid × CTR: A 2.40, B 3.20, C 2.25, D 1.80. Brand B ranks first even though it bid the least but one.</div>
<div class="step"><b>The price.</b> B pays the runner-up's score ÷ B's CTR + $0.01 = 2.40 ÷ 4 + 0.01 = $0.61 per click, less than its $0.80 bid. Every bid, score and price is written as an event for billing and later analysis.</div>
</div>

<div class="problem" data-problem="adtech-plumbing-auction"></div>

## 3. Who's who

| Piece | Job |
|---|---|
| **Ad server** | Decides and records which ad shows in each placement (publisher ad servers, retailer sponsored-products engines) |
| **DSP** (demand-side platform) | Lets advertisers buy across many publishers with targeting |
| **SSP** (supply-side platform) and **exchange** | Lets publishers sell their ad space in auctions |
| **CDP** (customer data platform) | Builds audience segments from first-party data |
| **Clean room** | Privacy-safe joins between partners |
| **Measurement and verification** | Independent checks of viewability, fraud and outcomes |

## 4. Identity and consent

To link an ad view to a purchase, you need to know it was the same person. Methods, from strongest to weakest:

- **Logged-in first-party IDs** (loyalty ID, account): the most accurate, and the core advantage of retail media.
- **Hashed emails** matched between partners, inside clean rooms. "Hashed" means turned into a fixed scramble that cannot easily be turned back.
- **Device IDs** on phones, limited by the platforms' privacy controls.
- **Contextual** targeting needs no identity at all: the search word "cola" is enough.

Privacy laws (such as Canada's PIPEDA and Québec's Law 25, Europe's GDPR and US state laws) decide what may be collected and used. Platforms store consent flags with every event and enforce them in the pipelines. Check the current rules for each country you work in.

## 5. Real-time controls that need streaming

- **Budget pacing:** compare spend so far with the plan every minute; slow down or speed up bidding.
- **Frequency capping:** "no more than 3 impressions per user per day" needs a fast counter per user and campaign (Bigtable or Redis, from [Bigtable and wide-column stores](/learn/courses/data-at-scale/bigtable/)).
- **Out-of-stock suppression:** stop ads for products not available at the shopper's store, using stock events from Kafka.
- **Bot filtering:** drop invalid traffic before it is billed.

Pacing is simple arithmetic run every minute against a live spend counter:

<div class="problem" data-problem="adtech-plumbing-pacing"></div>

<div class="meaning">

<dl>
<dt>Ad request</dt><dd>The app asking "which ad goes here?", with the page context and consent flags.</dd>
<dt>Score</dt><dd>Bid × predicted click rate: what an impression is expected to earn.</dd>
<dt>Second price</dt><dd>The winner pays just enough to have beaten the runner-up.</dd>
<dt>Pacing</dt><dd>Keeping spend in line with the plan so the budget lasts to the end date.</dd>
<dt>Frequency cap</dt><dd>A limit on how often one person sees one campaign.</dd>
<dt>Physical meaning</dt><dd>When you search "cola" and the first result is a sponsored bottle you might actually buy, not the highest bidder's, an auction weighed bids by how likely you were to click, checked a counter so you would not see the same ad a tenth time today, and wrote the whole decision down in under a tenth of a second.</dd>
</dl>

</div>

<div class="myth">

**"The brand with the biggest bid always gets the top spot."** Ad servers rank by bid × predicted click rate (and often relevance), because an ad nobody clicks earns nothing. A brand with a well-liked product and a modest bid can win and pay less than its bid.

</div>

## 6. Data clean rooms

Brands want to combine their data (their customer list, their other campaigns) with the retailer's shopper data, and neither side may share raw personal data. A **clean room** lets both put data into a controlled space where only approved queries run: aggregates above a minimum audience size, no row-level export. On Google Cloud, **BigQuery data clean rooms** do this with analysis rules; other clouds and specialist vendors offer similar products.

## 7. The event data model

A minimal impression table:

| column | example |
|---|---|
| event_id | `imp_7f3c…` |
| event_ts | `2026-11-04 10:02:07.311` |
| campaign_id, line_item_id, creative_id | `C123`, `L9`, `CR55` |
| placement, page_type, search_term | `search_top`, `search`, `cola` |
| user_key (hashed), device_type | `u_9ab…`, `ios` |
| price_paid, auction_type | `0.61`, `second_price` |
| is_viewable, consent_ad | `true`, `true` |

Clicks and conversions refer back to `event_id` or `user_key` and time, which is how attribution joins them in the next lesson.

## 8. Try it

Design the Kafka topics, keys and downstream stores for (a) pacing, (b) frequency capping, (c) advertiser dashboards and (d) monthly billing. For each, give the delay the business can accept and the store you would use.

<details>
<summary>One design, and what to check</summary>

Topics `ads.impressions.v1` and `ads.clicks.v1`, keyed by `campaign_id` so each campaign's events stay in order, plus `ads.spend.v1`.

- (a) Pacing: Flink sums spend per campaign per minute into Redis or Bigtable counters that the bidder reads (seconds).
- (b) Frequency caps: Flink or the ad server increments the key `user#campaign#date` in Bigtable or Redis (milliseconds).
- (c) Dashboards: Druid reads impressions and clicks from Kafka with a one-minute rollup (seconds to a minute).
- (d) Billing: Kafka Connect to Cloud Storage, then Spark removes duplicates and invalid traffic, then BigQuery billing tables, reconciled monthly (daily batch, exact).

**Check:** each control has a delay in plain units, the fastest ones use a key-value store, and billing uses the exact batch path, not the live counters.
</details>

**New words:** *ad server*, *ad request*, *real-time bidding*, *DSP*, *SSP*, *exchange*, *predicted click rate*, *second-price auction*, *pacing*, *frequency cap*, *clean room*.

<div class="keypoints">

- An ad request triggers an auction in about 100 ms; every step (request, bid, win, impression, click) is an event.
- Sponsored-products auctions rank by bid × predicted click rate, and second-price rules charge the winner just enough to beat the runner-up.
- Pacing, frequency caps, stock suppression and bot filtering need streaming and fast key-value counters.
- Identity links exposure to purchase, consent decides what may be used, and clean rooms let partners join data without sharing rows.

</div>
