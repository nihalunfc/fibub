---
title: CI/CD, environments and safe change
summary: 'Make pipeline changes boring: tests and dbt build on every pull request, dev, CI and prod on the same code, data diffs that prove impact, and Docker rollbacks.'
minutes: 35
updated: 2026-11-22
quiz:
  - q: Why does CI run on DuckDB and generated data instead of the production warehouse?
    choices: ['It is fast, free, gives the same result every time and needs no production secrets', 'DuckDB is the same as Azure SQL', 'GitHub cannot reach Azure']
    ans: 0
    why: CI should be sealed off and repeatable. Test the connection to the real warehouse in a separate, smaller job.
  - q: A data diff after a change to one brand shows differences in every brand. What does that suggest?
    choices: ['The diff tool is broken', 'The change has a side effect nobody intended', 'That is expected for any change']
    ans: 1
    why: A diff should be confined to what you meant to change. Rows moving elsewhere are the warning sign the diff exists to catch.
  - q: What is the best way for GitHub Actions to sign in to Azure?
    choices: ['Store the admin password as a repository secret', 'OIDC federated credentials: short-lived tokens, no stored secret, scoped to the repo and environment', 'Commit a service principal key to the repo']
    ans: 1
    why: Federation hands out a token for each run that expires in minutes. There is no long-lived password to leak.
sources:
  - 'GitHub Docs: About security hardening with OpenID Connect, and Using environments for deployment https://docs.github.com/en/actions'
  - 'dbt documentation: Node selection with state and defer (slim CI) https://docs.getdbt.com/'
  - 'Humble, J. and Farley, D. (2010), Continuous Delivery, Addison-Wesley'
---

**Module 7 · about 35 minutes · read first: [1.2](/learn/courses/etl/engineering-setup/) and [5.4](/learn/courses/etl/dbt-basics/).** You'll be able to run lint, tests, an end-to-end pipeline run and `dbt build` on every pull request, keep dev, CI and prod on the same code with different settings, prove what a change does with a data diff, and deploy and roll back with Docker.

<div class="bigidea">CI/CD makes change boring: every pull request is tested on realistic data automatically, and a deploy is one repeatable command you can undo, not an afternoon of nervous typing on a server.</div>

## 1. Why this matters

Every change to a pipeline is a chance to break a report someone relies on. Think of a restaurant kitchen changing a recipe. A good kitchen does not change it on a busy Saturday night. The cook makes one test plate, the head chef tastes it next to the old one, and only then does the new card go up.

**CI** (continuous integration) is the test plate: every proposed change is built and checked automatically. **CD** (continuous delivery or deployment) is putting the new card up the same safe way every time.

## 2. A CI workflow

A **pull request** (PR) is a proposed change on its own branch, waiting for review. This GitHub Actions workflow runs on every PR:

```yaml
# .github/workflows/ci.yml
name: ci
on: [pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4          # pin each action to a major version; check its page for the current one
      - uses: astral-sh/setup-uv@v5
      - run: uv sync --frozen
      - run: uv run ruff check . && uv run ruff format --check .
      - run: uv run python starter/generate_data.py --days 14 --out data --seed 1
      - run: uv run pytest -q
      - run: uv run dagster asset materialize --select "*" -m daily_platform.definitions
        env: { P2D_ENV: ci, P2D_WAREHOUSE: duckdb }
      - run: cd dbt && uv run dbt build --target ci
```

Line by line: get the code, install the exact locked packages, check style, generate 14 days of data with a fixed seed (so every run sees the same data), run the unit tests, materialise every asset end to end on DuckDB, then build and test the dbt models.

CI uses **DuckDB and generated data**: fast, free, and it needs no secrets. A separate job, run by hand or on merge, can test against an Azure SQL test database. For that, use a GitHub **environment** and, better than a stored password, **OIDC federation**: Azure trusts GitHub to vouch for this repo and hands out a token that expires in minutes.

## 3. Environments: same code, different settings

| | dev (your laptop) | ci | prod |
| --- | --- | --- | --- |
| Data | generator | generator, fixed seed | real sources |
| Warehouse | DuckDB | DuckDB | Azure SQL or Postgres |
| Secrets | `.env` file | none | managed identity or Key Vault |
| Schedules | off | off | on |

One setting, `P2D_ENV`, picks the column; dbt targets mirror it. The code never asks "am I in prod?" in a dozen places. The resources from [Lesson 3.3](/learn/courses/etl/dagster-resources-config/) read the setting once.

## 4. Data diffs: proof of impact

Unit tests prove the logic. A **data diff** proves the impact: build the changed table in a CI schema and compare it with prod. Rows that are only in one side are the change.

```sql
(select * from ci.fct_restaurant_daily except select * from prod.fct_restaurant_daily)
union all
(select * from prod.fct_restaurant_daily except select * from ci.fct_restaurant_daily);
```

`except` returns rows of the first query that are not in the second. Run it both ways and you see every row that differs. Leave out columns that change on every build, such as `loaded_at` or generated keys, or everything will look different.

<div class="steps" data-fig="cicd-safe-change-diff">
<div class="step"><b>Two builds.</b> Prod and the PR's CI build of <code>fct_restaurant_daily</code>, five rows each. The PR moves brand B's business-day cut-off.</div>
<div class="step"><b>CI except prod.</b> Two rows exist only in CI: brand B on Monday (2,655) and Tuesday (2,890).</div>
<div class="step"><b>Prod except CI.</b> Their old versions exist only in prod: 2,710 and 2,940.</div>
<div class="step"><b>The diff.</b> Four rows, every one brand B. A changed row shows up twice, old and new. The change did exactly what we meant.</div>
<div class="step"><b>A side effect.</b> If brand C's Monday also moved (3,350 to 3,310), the change leaked. Do not merge until you know why.</div>
</div>

<div class="problem" data-problem="cicd-safe-change-diff"></div>

dbt can build only the models a PR changed and reuse prod for the rest (`--select state:modified+ --defer --state <prod artifacts>`, often called "slim CI"). The `audit_helper` dbt package and SQLMesh's table diff do comparisons like the one above for you; check their docs for the current commands.

<div class="meaning">

<dl>
<dt>CI</dt><dd>Every proposed change is built and tested automatically before anyone merges it.</dd>
<dt>CD</dt><dd>Releasing works the same scripted way every time, and so does undoing a release.</dd>
<dt>Environment</dt><dd>A set of settings (data, warehouse, secrets, schedules) for the same code: dev, ci or prod.</dd>
<dt>Data diff</dt><dd>The rows that differ between the changed table and prod: (CI except prod) plus (prod except CI).</dd>
<dt>Physical meaning</dt><dd>A finance lead asks "what did last week's change do to our numbers?" You open the PR and show the diff: 24 restaurant-days for one brand moved, nothing else. That answer takes thirty seconds and ends the meeting.</dd>
</dl>

</div>

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** the symmetric difference of two tables shows every row that differs between them.

**Equation:**

```math
A \,\triangle\, B = (A \setminus B) \cup (B \setminus A)
```

A row whose value changed is in both parts (new version in `$A \setminus B$`, old in `$B \setminus A$`), so `$|A \triangle B| = 2c + a + r$` for `$c$` changed, `$a$` added and `$r$` removed rows.

**Analogy:** laying two photos over each other and subtracting: only what moved stays visible.

**Where it breaks:** columns that differ on every build (load times, surrogate keys) make every row look changed. Exclude them.

**Try it:** you changed the cut-off for one brand. Which rows should appear? (Only that brand's restaurant-days near midnight. Anything else is a bug.)
</details>

## 5. Deploying and rolling back

Build **one Docker image** holding your code (the Dagster code location and the dbt project). Push it to a registry such as GitHub Container Registry, tagged with the version. On the server:

```bash
docker compose pull && docker compose up -d     # deploy the tag named in compose.yml
```

**Rollback** is the same command with the previous tag. Keep schema changes as versioned SQL or dbt models that the pipeline applies, never typed by hand on the server. A GitHub Action on each new tag can run the deploy over SSH, or the server can pull on a timer.

<div class="myth">

**"Tests passed, so the change is safe."** Tests check the rules you thought of. A data diff shows what actually moved, including the rules you did not think of. Merge when both are green and the diff is confined to what you meant.

</div>

Protect `main`: changes arrive only through PRs, CI must pass, and someone reviews (even future-you after a night's sleep, or Claude Code asked to review as a sceptical senior engineer). Keep each PR small with one purpose, and keep a `CHANGELOG.md`.

## 6. Try it

1. Add the workflow above to `daily-data-platform` and make it pass (on a private test repo, or locally with `act`).
2. Add `P2D_ENV=ci` settings and a dbt `ci` target on DuckDB.
3. Write a small data-diff script that compares two DuckDB schemas and prints rows only in each side, per table. Run it before and after a deliberate change.
4. Write a slim Dockerfile based on uv and a production `docker-compose.yml` (Dagster webserver, daemon, code location, Postgres, Metabase).
5. Write `docs/deploy.md`: tag → image → pull → up; rollback = the previous tag. Try a rollback.

**What to check:** a PR that breaks a dbt test turns CI red; your diff script reports only the rows you meant to change; rolling back to the previous tag brings the old behaviour back in under a minute. Commit as `ci: lint, tests, end-to-end DuckDB run, dbt build; deploy docs and images`.

<div class="keypoints">

- CI builds and tests every pull request on DuckDB with generated data: fast, free, repeatable, no secrets.
- dev, ci and prod run the same code; one setting picks the data, warehouse, secrets and schedules.
- A data diff (CI except prod, plus prod except CI) proves impact; a changed row appears twice.
- Deploy one tagged Docker image; rollback is the same command with the previous tag.
- Sign in to the cloud from CI with OIDC federation, not stored passwords.

</div>
