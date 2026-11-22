---
title: Refresh, security and report delivery
summary: 'Refresh Power BI when the load ends, keep row-level security mappings in the warehouse, and send a morning email that never goes out twice.'
minutes: 40
updated: 2026-11-22
quiz:
  - q: The pipeline sometimes finishes at 07:35 and the report is due at 08:00. What is the best refresh strategy?
    choices: ['A fixed refresh at 07:00', 'Refresh every 15 minutes all day', 'Trigger the refresh and the email from the orchestrator when the load finishes']
    ans: 2
    why: An event-driven refresh is both fresh and cheap. A fixed time is either stale on late days or wasted on early ones.
  - q: An area manager is a Member of the workspace, and RLS limits their role to one region. What do they see?
    choices: ['Only their region', 'All the data, because RLS does not apply to people who can edit the workspace', 'An error']
    ans: 1
    why: RLS restricts viewers. Share through an app or the Viewer role so the rules apply.
  - q: The email asset is retried after a timeout that happened after the email was sent. What prevents a second email?
    choices: ['Nothing', 'A "sent" record per report and business date, checked before sending', 'The mail server removes duplicates']
    ans: 1
    why: Side effects like emails must be idempotent. Check the record, send, then write the record.
sources:
  - 'Microsoft Learn: Power BI REST API, Datasets - Refresh Dataset In Group https://learn.microsoft.com/rest/api/power-bi/'
  - 'Microsoft Learn: Row-level security (RLS) with Power BI https://learn.microsoft.com/power-bi/enterprise/service-admin-rls'
  - 'Kleppmann, M. (2017), Designing Data-Intensive Applications, O''Reilly, Chapter 11 (idempotence and exactly-once side effects)'
---

**Module 6 · about 40 minutes, plus the lab · read first: [3.5](/learn/courses/etl/schedules-sensors/), [6.3](/learn/courses/etl/ten-second-dashboards/).** The Power BI service itself is covered in the Power BI course: [publishing and sharing](/learn/courses/power-bi/publish-share/), [scheduled refresh and gateways](/learn/courses/power-bi/refresh-gateways/) and [row-level security](/learn/courses/power-bi/row-level-security/). Here you'll wire those to the pipeline: refresh when the load ends, keep the security mapping in the warehouse, and deliver a morning email that is on time, honest about missing data, and never sent twice.

<div class="bigidea">Delivery is where the pipeline meets people's mornings: refresh after the data lands, show each person only their rows, and make every email safe to retry.</div>

## 1. Why this matters

"Deliver reports" is the last step of every pipeline, and the one people notice. Three things must be true at 08:00: the refresh ran **after** the load, each manager sees **only their** restaurants, and the email arrived exactly once, even when a hotel's file was late, with a note saying so.

Think of a newspaper. The presses do not start at a fixed time whatever happens in the newsroom; they start when the last page is signed off. Each region's edition carries only its local pages. And a delivery driver who is unsure whether they already dropped your paper checks the list before leaving a second one.

## 2. The Power BI service in brief

- **Workspaces** hold reports and semantic models. Use separate development and production workspaces (or **deployment pipelines**) for anything shared.
- **Licences:** Power BI Desktop is free. Sharing generally needs a paid licence for authors and viewers, unless the workspace sits on a capacity that allows free viewers. Plans and prices change, so check Microsoft's current pricing page.
- **Scheduled refresh** has a daily limit that depends on the licence. Cloud sources such as Azure SQL need no gateway; sources on your own network (a file server, an office SQL Server) need the **on-premises data gateway**.
- **Incremental refresh** keeps old partitions and refreshes only recent ones (say the last 10 days), set up with `RangeStart` and `RangeEnd` parameters. It mirrors the look-back in your incremental dbt model.

## 3. Refresh after the load, not at a fixed time

If the load finishes at 06:42 on a good day and 07:35 on a late one, a 07:00 refresh is either stale or wasted. Make the refresh the last asset in Dagster:

```python
@dg.asset(deps=[dg.AssetKey(["fct_restaurant_daily"]), dg.AssetKey(["fct_stay_nights"])])
def powerbi_refresh(context: dg.AssetExecutionContext, pbi: PowerBIResource) -> dg.MaterializeResult:
    # POST https://api.powerbi.com/v1.0/myorg/groups/{workspace}/datasets/{dataset}/refreshes
    run = pbi.trigger_refresh(workspace_id=pbi.workspace_id, dataset_id=pbi.dataset_id)
    status = pbi.wait_for_refresh(run, timeout_s=1800)
    return dg.MaterializeResult(metadata={"refresh_status": status})
```

`PowerBIResource` is a small class you write around the REST call. It signs in as a **service principal** (an app identity in Microsoft Entra ID) that the Power BI tenant settings allow and that is a member of the workspace. Dagster also has a `dagster-powerbi` integration that shows reports and models as assets; check its status for your version.

<div class="steps" data-fig="refresh-security-delivery-timeline">
<div class="step"><b>A good day.</b> The load ends at 06:42. The fixed 07:00 refresh and the 07:15 email both carry today's numbers.</div>
<div class="step"><b>A late day.</b> The load ends at 07:35. The fixed refresh already ran at 07:00 on yesterday's data, and the email went out with it. Nobody was told.</div>
<div class="step"><b>Triggered instead.</b> The refresh asset depends on the marts, so it starts at 07:35, ends at 07:45, and the email goes at 07:46, before 08:00.</div>
<div class="step"><b>A retry.</b> The email step times out after the mail server accepted the message. Dagster retries; the step finds a "sent" record for this report and date, and skips.</div>
<div class="step"><b>Very late.</b> By 07:48 one hotel is still loading. The rule agreed with the business says: refresh what has arrived and send at 08:00 with a banner naming the missing hotel.</div>
</div>

<div class="problem" data-problem="refresh-security-delivery-stale"></div>

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** a deadline is met only when every step before it finishes in time, so you design for the late days, not the average day.

**Equation:** if the load's finish time `$T$` has a 95th percentile `$t_{95}$`, a fixed refresh at `$t_{95}$` is stale on about 5 % of days. A triggered refresh sends at

```math
\min(T + r,\ \text{deadline})
```

where `$r$` is the refresh and send time, with a partial-data path whenever `$T > \text{deadline} - r$`.

**Analogy:** getting to the airport. You either leave early enough for the worst traffic and often wait, or you take a car that leaves the moment you are ready.

**Where it breaks:** a hard deadline with no partial-data path just moves the failure from "stale" to "late".

**Try it:** the load ends by 06:50 on 90 % of days and by 07:30 on 99 %. Refresh takes 10 minutes; the email is due at 08:00. Is a fixed 07:00 refresh safe? (No: about 10 % of days are stale. Triggered, 99 % of days still make 08:00.)
</details>

<div class="problem" data-problem="refresh-security-delivery-deadline"></div>

## 4. Row-level security from the warehouse

Roles are defined in Power BI Desktop (**Modeling → Manage roles**) with a DAX filter. The pipeline's job is the **mapping table** that says who may see what. Build it in dbt from a source the business owns (an HR export or a small reviewed CSV seed), not by typing emails into the report:

```sql
-- models/marts/sec_user_region.sql : one row per user per region they may see
select lower(trim(email)) as email, region
from {{ ref('seed_area_managers') }}       -- reviewed by the report owner
where active
```

```dax
-- role "Area manager", filter on sec_user_region (related to dim_restaurant[region])
[email] = USERPRINCIPALNAME ()
```

Then **test it**: use *View as* in Desktop and in the service with a test user for each role, and keep a short table in the repo of who should see what. Remember that RLS restricts **viewers** only. Anyone who can edit the workspace (Admin, Member, Contributor) sees everything, so managers get the app or the Viewer role, never workspace membership.

## 5. Scheduled emails that are safe to retry

**Power BI subscriptions** email a snapshot of a page on a schedule or after a refresh. **Paginated reports** suit pixel-perfect PDFs and long tables. For full control, or without Power BI, send it from Python as the last Dagster asset:

```python
# reports/daily_email.py
import duckdb, smtplib, ssl
from email.message import EmailMessage
from jinja2 import Template

def send_daily(bdate, missing_sources, as_of, cfg):
    con = duckdb.connect("data/wh.duckdb")
    if con.execute("select 1 from ops.sent_reports where report = 'qsr_daily' and business_date = ?", [bdate]).fetchone():
        return "already sent"                                   # a retry must not email executives twice
    df = con.execute("select * from mart.fct_restaurant_daily where business_date = ?", [bdate]).df()
    html = Template(open("reports/daily.html.j2").read()).render(
        rows=df.to_dict("records"), bdate=bdate, missing=missing_sources, as_of=as_of)
    msg = EmailMessage()
    msg["Subject"], msg["From"] = f"Restaurant daily {bdate}", cfg.sender
    msg["To"] = cfg.test_to if cfg.test_mode else ", ".join(cfg.recipients)  # test mode: only you
    msg.set_content("Your email app shows the HTML version.")
    msg.add_alternative(html, subtype="html")
    msg.add_attachment(df.to_csv(index=False).encode(), maintype="text", subtype="csv", filename=f"qsr_{bdate}.csv")
    with smtplib.SMTP(cfg.smtp_host, 587) as s:
        s.starttls(context=ssl.create_default_context()); s.login(cfg.smtp_user, cfg.smtp_password); s.send_message(msg)
    con.execute("insert into ops.sent_reports values ('qsr_daily', ?, now())", [bdate])
    return "sent"
```

For Microsoft 365, sending through the **Microsoft Graph** `sendMail` call with an app permission limited to one sender mailbox is safer than storing an SMTP password. Three guards, always: a **sent record** per report and business date, a **test mode** that sends only to you, and a **partial-data rule** agreed with the business. Keep recipient lists in config that the report owner reviews, never in code.

<div class="meaning">

<dl>
<dt>Event-driven refresh</dt><dd>The refresh starts when the load finishes, triggered by the orchestrator.</dd>
<dt>Service principal</dt><dd>An app identity that can call the Power BI API without a person's password.</dd>
<dt>Row-level security</dt><dd>Rules that filter rows per viewer; the who-sees-what table comes from the warehouse.</dd>
<dt>Idempotent send</dt><dd>Checking a sent record first, so a retry cannot send the same email twice.</dd>
<dt>Physical meaning</dt><dd>On a late Monday the chief operating officer gets one email at 07:52 with Sunday's numbers and a line saying "Hotel H3 not received". Not two emails, not Saturday's numbers, and not another region's restaurants.</dd>
</dl>

</div>

<div class="myth">

**"Retries make a pipeline safer."** For reading and writing tables with replace-only writes, yes. For side effects like emails, payments or API posts, a retry after a partial success repeats the action. Make those steps idempotent first, then allow retries.

</div>

## 6. Try it

1. Publish your report to a Power BI workspace (a trial or developer tenant). If you cannot, document each step with Desktop screenshots instead.
2. Set up incremental refresh on `fct_order_lines` for the last 10 days.
3. Build `sec_user_region` in dbt from a seed, add two RLS roles (by region and by brand) and test them with *View as*.
4. Write `reports/daily_email.py` with the HTML body, CSV attachment, partial-data banner, sent record and test mode. Send to yourself only.
5. Add it as the last Dagster asset, after the dbt models. Force a retry and show that no second email arrives.
6. Optional: trigger a dataset refresh from Dagster with a service principal.

**What to check:** the refresh never runs before the marts are done; each test user sees only their rows; a retried run sends nothing; a missing source produces a banner, not a silent gap. Commit as `feat(delivery): RLS, incremental refresh, event-driven refresh and idempotent email`.

<div class="keypoints">

- Trigger the refresh and the email from the orchestrator when the load finishes; agree a partial-data rule for very late days.
- Keep the RLS mapping table in the warehouse, built from a reviewed source, and test every role with View as.
- RLS applies to viewers only; share through an app or the Viewer role.
- Emails need three guards: a sent record per report and date, a test mode, and a partial-data banner.

</div>
