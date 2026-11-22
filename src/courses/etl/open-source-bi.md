---
title: Open-source BI without Microsoft licences
summary: 'Run Metabase and Superset on your marts, place Evidence, Lightdash and Grafana, and pick a BI tool for a medium company with a costed break-even.'
minutes: 35
updated: 2026-11-22
quiz:
  - q: Why store Metabase's own application database in Postgres instead of the default file?
    choices: ['It makes queries on the warehouse faster', 'The app database holds every question, dashboard and user; Postgres survives upgrades and restarts reliably', 'Metabase cannot read Postgres warehouses otherwise']
    ans: 1
    why: Your dashboards live in the app database. Protect it like any other production database, with backups.
  - q: A 300-restaurant chain on Google Workspace wants daily emailed dashboards for managers and a few analysts building them. What is a reasonable default?
    choices: ['Grafana', 'Metabase (self-hosted or cloud) on a Postgres warehouse, with subscriptions', 'Spreadsheets sent by email']
    ans: 1
    why: Many viewers, few authors and scheduled delivery are exactly what Metabase does well.
  - q: What makes switching BI tools cheap?
    choices: ['Using the same colours', 'Keeping business logic and metric definitions in dbt and the warehouse, not inside the BI tool', 'Exporting everything to PDF']
    ans: 1
    why: When the logic lives upstream, only the presentation layer changes.
sources:
  - 'Metabase documentation: running Metabase on Docker and the application database https://www.metabase.com/docs/latest/'
  - 'Apache Superset documentation https://superset.apache.org/docs/intro'
  - 'Evidence documentation https://docs.evidence.dev/'
  - 'Reis, J. and Housley, M. (2022), Fundamentals of Data Engineering, O''Reilly, Chapter 4 (choosing technologies; total cost of ownership)'
---

**Module 6 · about 35 minutes, plus the lab · read first: [5.6](/learn/courses/etl/metrics-semantic-layer/), [6.3](/learn/courses/etl/ten-second-dashboards/).** You'll be able to run Metabase and Superset on your marts with Docker, rebuild a Power BI page in Metabase, place Evidence, Lightdash, Grafana and Streamlit, and recommend a BI tool for a medium company with numbers behind it.

<div class="bigidea">When business logic lives in dbt and the warehouse, the BI tool is just the shop window, and you can choose it on cost, skills and delivery needs instead of being locked in.</div>

## 1. Why this matters

Power BI is cheap per user, but the cost grows with every viewer: 200 restaurant managers is 200 licences under most plans. Some companies run Google Workspace or no office suite at all. Open-source BI tools are mature, free to self-host, and in many cases good enough. A senior engineer can recommend either, with a costed comparison.

Choosing a BI tool is like choosing a shop front for a bakery. The ovens, recipes and quality checks (the pipeline, dbt, tests) stay the same whichever window you put the bread in. If the recipes lived inside the window display, changing the window would mean rewriting the recipes.

## 2. The options

| Tool | Style | Strong at | Weaker at |
|---|---|---|---|
| **Metabase** | Point-and-click questions plus SQL, dashboards, subscriptions | Fastest for business users; email and chat subscriptions; embedding | Complex modelling; very large semantic layers |
| **Apache Superset** | SQL Lab plus a chart builder with many chart types | Many users, role-based access, row-level security, rich charts | Harder to set up and to author in |
| **Evidence** | Reports as code: Markdown plus SQL, built as a static site | Lives in git, looks polished, cheap to host | Not for self-service exploring |
| **Lightdash** | BI on top of your dbt project | Uses dbt YAML as the semantic layer | Needs dbt |
| **Grafana** | Time-series and operations dashboards | Pipeline monitoring and alerts | Not a business BI tool |
| **Streamlit or Dash** | Python apps | Custom tools: what-if pricing, schedule builders | You maintain the code |

Pricing and features of the paid editions and cloud versions change; check each project's site before you write numbers into a recommendation.

## 3. Metabase in ten minutes

```yaml
# docker-compose.metabase.yml
services:
  mb-db:
    image: postgres:16
    environment: { POSTGRES_USER: mb, POSTGRES_PASSWORD: mb, POSTGRES_DB: metabase }
    volumes: ["mb-db:/var/lib/postgresql/data"]
  metabase:
    image: metabase/metabase:latest       # pin an exact version for real use
    ports: ["3001:3000"]
    environment:
      MB_DB_TYPE: postgres
      MB_DB_DBNAME: metabase
      MB_DB_PORT: 5432
      MB_DB_USER: mb
      MB_DB_PASS: mb                      # local trial only; use secrets in real use
      MB_DB_HOST: mb-db
    depends_on: [mb-db]
volumes:
  mb-db:
```

<div class="steps">
<div class="step"><b>Start it.</b> <code>docker compose -f docker-compose.metabase.yml up -d</code>. Metabase keeps its own questions, dashboards and users in the <code>mb-db</code> Postgres, not in a file inside the container.</div>
<div class="step"><b>Connect the warehouse.</b> In Admin, add your Postgres (or Azure SQL) warehouse with the read-only <code>report_reader</code> login, limited to the <code>mart</code> schema.</div>
<div class="step"><b>Ask a question.</b> Net sales by restaurant for yesterday, compared with the same weekday last year, using the column your <code>dim_date</code> already has. No logic is rewritten; it is all in the mart.</div>
<div class="step"><b>Build the page.</b> KPI numbers with comparisons, a trend line, sorted restaurant bars, channel mix: the same anatomy as Lesson 6.3.</div>
<div class="step"><b>Deliver it.</b> A dashboard subscription emails the page to area managers each morning. Point it at a test address first.</div>
</div>

Then add the "data as of" card from `mart.freshness` (Lesson 6.3). Because the freshness logic lives in the warehouse, it took one query, not a rebuild.

## 4. Superset in brief

Use the official Docker Compose setup from the Superset repository for local trials; real deployments use its Helm chart or a managed provider. Connect with SQLAlchemy URLs (`postgresql+psycopg2://...`, `mssql+pyodbc://...`). Define **datasets** (a table or a SQL query), then charts, then dashboards. Row-level security is set per role and dataset.

<div class="problem" data-problem="open-source-bi-breakeven"></div>

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** licence cost grows with users; self-hosting cost is mostly fixed (servers and people's time). The cheaper option flips at some number of users.

**Equation:** with price per user `$p$`, server cost `$C_{vm}$`, `$h$` hours of upkeep at wage `$w$`, and a small extra cost `$\epsilon$` per user,

```math
C_{\text{licensed}}(u) = p\,u, \qquad C_{\text{self}}(u) = C_{vm} + h\,w + \epsilon\,u, \qquad u^{*} = \frac{C_{vm} + h\,w}{p - \epsilon}
```

**Analogy:** renting a car per day versus owning one. Owning has fixed costs every month; renting costs more per trip. Use it often enough and owning wins.

**Where it breaks:** hidden costs on both sides: sign-in integration, training, support, and the analyst's time building in a less familiar tool. Add them as hours before you trust the break-even.

**Try it:** licence $14 per user per month; a $60 server plus 4 hours a month at $50; extra cost per user about $0. Break-even? ((60 + 200) ÷ 14 ≈ 18.6, so from 19 users self-hosting is cheaper on paper.)
</details>

## 5. Choosing

1. **Microsoft 365 company, people who live in Excel:** Power BI. Integration with Teams, Excel and Entra ID is worth the licence.
2. **No Microsoft, many viewers, few authors:** Metabase. Subscriptions and simple questions cover most needs.
3. **A data team that wants many chart types, SQL first, strict access control:** Superset.
4. **Reports published as code, daily or monthly:** Evidence.
5. **A custom tool** (what-if pricing, a schedule builder): Streamlit next to whichever BI tool.

Whatever you pick, keep **one set of metric definitions** feeding it (Lesson 5.6). Moving a company from Power BI to Metabase then changes only the presentation layer.

<div class="meaning">

<dl>
<dt>Self-hosting</dt><dd>Running the open-source tool on your own server or cloud machine instead of paying per user.</dd>
<dt>Application database</dt><dd>The database where a BI tool keeps its own questions, dashboards and users.</dd>
<dt>Presentation layer</dt><dd>The BI tool on top; replaceable when the logic sits in dbt and the warehouse.</dd>
<dt>Break-even users</dt><dd>The number of users above which self-hosting costs less than licences.</dd>
<dt>Physical meaning</dt><dd>A 120-site deli chain with no Microsoft licences gets its managers' morning dashboard from a self-hosted Metabase on a small cloud server. Because the metrics live in dbt, the same numbers appear in the analysts' notebooks and in the email, and moving to another tool later would not change them.</dd>
</dl>

</div>

<div class="myth">

**"Open source is free."** The licence is free; the server, upgrades, backups, sign-in setup and someone's time are not. Count them as hours, at a real wage, before you compare with a per-user licence.

</div>

## 6. Try it

1. Load your marts into Postgres (the Module 4 warehouse resource with Postgres as the target).
2. Run Metabase with a Postgres application database. Rebuild the restaurant operations page: KPIs with comparisons, trend, sorted restaurant bars, channel mix, and the "data as of" card.
3. Set up a dashboard subscription to your own email through a test SMTP account.
4. Run Superset locally; build the hotel pace chart and set one row-level security rule.
5. Build the same restaurant page in Evidence and preview it locally.
6. Write `docs/bi-comparison.md`: time to build each page, what was harder, what each did better, and cost at 20, 100 and 300 users using the formula above with prices you look up on the vendors' sites today (write the date you checked).

**What to check:** Metabase restarts without losing dashboards; the numbers on all three tools match Power BI for the same day; your comparison shows its sources and the date you checked prices. Commit as `feat(bi): Metabase, Superset and Evidence versions with a costed comparison`.

<div class="keypoints">

- Metabase suits many viewers and few authors; Superset suits SQL-first teams; Evidence publishes reports as code; Lightdash reads dbt; Grafana is for operations.
- Keep a BI tool's own application database in a durable database with backups.
- Licence cost grows with users; self-hosting is mostly fixed cost. Work out the break-even, then add the hidden costs.
- Business logic in dbt makes the BI tool replaceable.

</div>
