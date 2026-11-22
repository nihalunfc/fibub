---
title: Resources, config, IO managers and environments
summary: 'Stop hard-coding paths and passwords. Dagster resources let the same assets run on your laptop, in tests and in production, with secrets read at run time.'
minutes: 35
updated: 2026-11-22
quiz:
  - q: 'Why prefer dg.EnvVar("PMS_SFTP_PASSWORD") over os.environ["PMS_SFTP_PASSWORD"] when building Definitions?'
    choices: ['It is read when the run starts and is not shown in the Dagster UI', 'It encrypts the password', 'os.environ does not work in Python']
    ans: 0
    why: os.environ is read when the code is imported and the value can end up visible in config. EnvVar is resolved late and Dagster does not display it.
  - q: What do you gain by giving a local-folder source and an SFTP source the same methods?
    choices: ['The assets do not change between environments; you only swap the resource', 'SFTP becomes faster', 'You no longer need tests']
    ans: 0
    why: Same asset code, different environment. That is the whole point of resources.
  - q: What is the easiest way to unit-test an asset's logic?
    choices: ['Call the asset function, or its core function, directly with small fake inputs', 'Run dagster dev and click Materialize', 'Deploy to production and watch']
    ans: 0
    why: Assets are Python functions. Test them like any function, and use dg.materialize only when you want to test the wiring too.
sources:
  - 'Dagster documentation: Resources, configuration and environment variables, IO managers, testing assets https://docs.dagster.io/'
  - 'The Twelve-Factor App, III. Config (store config in the environment) https://12factor.net/config'
  - 'DuckDB documentation https://duckdb.org/docs/'
---

**Module 3 · about 35 minutes · read first: [3.2](/learn/courses/etl/dagster-assets/).** You'll be able to give assets their connections through resources, keep secrets out of code, switch between local and production with one setting, store outputs with an IO manager, and test assets with fake inputs.

<div class="bigidea">A resource is a socket in the wall: the asset plugs into "a warehouse" or "a file source", and whether the socket is wired to your laptop or to production is decided outside the asset.</div>

## 1. Why this matters

Hard-coded paths and connection strings are the main reason pipelines cannot be tested and cannot move from a laptop to a server. If `stg_bookings` contains `"C:/Users/me/data"` and a password, it runs in exactly one place.

**Resources** are Dagster's way of handing things to assets from outside. This idea is called *dependency injection*: instead of a function reaching out for what it needs, it is given what it needs. An asset asks for "a raw zone" or "an SFTP client", and the environment decides which one it gets. Like a travel adapter: the hairdryer is the same in every country; only the adapter changes.

## 2. Resources

A resource is a small class with settings. `ConfigurableResource` gives it typed fields.

```python
# defs/resources.py
import dagster as dg
import fsspec, paramiko

class RawZone(dg.ConfigurableResource):
    url: str                                    # file://./data/raw  or  s3://raw
    def fs(self):
        return fsspec.url_to_fs(self.url)[0]

class SftpSource(dg.ConfigurableResource):
    host: str
    port: int = 22
    user: str
    password: str                               # from an environment variable, never typed in code
    remote_dir: str = "/upload"
    def list_ready(self) -> list[str]:
        t = paramiko.Transport((self.host, self.port)); t.connect(username=self.user, password=self.password)
        with paramiko.SFTPClient.from_transport(t) as s:
            return sorted(f for f in s.listdir(self.remote_dir) if f.endswith(".txt"))
```

An asset asks for a resource by naming it as an argument with its type:

```python
@dg.asset
def raw_pms_files(context: dg.AssetExecutionContext, sftp: SftpSource, raw: RawZone) -> dg.MaterializeResult:
    ready = sftp.list_ready()        # works the same whatever sftp is wired to
    ...

defs = dg.Definitions(
    assets=[raw_pms_files],
    resources={
        "sftp": SftpSource(host=dg.EnvVar("PMS_SFTP_HOST"), user=dg.EnvVar("PMS_SFTP_USER"),
                           password=dg.EnvVar("PMS_SFTP_PASSWORD")),
        "raw": RawZone(url=dg.EnvVar("P2D_RAW_URL")),
    },
)
```

`dg.EnvVar` is read when the run starts and is **not shown in the UI**. `os.environ[...]` is read the moment Python imports the file, so its value is fixed early and can leak into displayed config. Use `EnvVar` for anything secret.

## 3. Environments with one switch

Choose the resources by a deployment name:

```python
import os
ENV = os.getenv("P2D_ENV", "local")
resources = {
    "local": {"sftp": LocalFolderSource(path="data/inbox/hotel"),
              "raw": RawZone(url="file://./data/raw")},
    "prod":  {"sftp": SftpSource(host=dg.EnvVar("PMS_SFTP_HOST"), user=dg.EnvVar("PMS_SFTP_USER"),
                                 password=dg.EnvVar("PMS_SFTP_PASSWORD")),
              "raw": RawZone(url=dg.EnvVar("P2D_RAW_URL"))},
}[ENV]
```

`LocalFolderSource` is a resource you write with the **same `list_ready` method** as `SftpSource`, but it just lists a folder. The asset cannot tell the difference, which is exactly what you want. Module 4 adds warehouse resources the same way (DuckDB locally, Azure SQL in production), and the asset code never changes.

<div class="steps">
<div class="step"><b>The asset asks.</b> <code>raw_pms_files</code> declares <code>sftp: SftpSource</code>. It only knows it will get something with a <code>list_ready()</code> method.</div>
<div class="step"><b>Local run.</b> <code>P2D_ENV=local</code>. Dagster hands it <code>LocalFolderSource("data/inbox/hotel")</code>. <code>list_ready()</code> returns <code>["H1_20260914.txt", "H2_20260914.txt"]</code> from a folder, offline.</div>
<div class="step"><b>Test run.</b> The test passes a tiny fake with <code>list_ready()</code> returning one file name. No network, runs in milliseconds.</div>
<div class="step"><b>Production run.</b> <code>P2D_ENV=prod</code>. Dagster builds the real <code>SftpSource</code>, reading host, user and password from environment variables at run time.</div>
<div class="step"><b>Same result shape.</b> In all three, the asset gets a list of file names and lands them. Not one line of the asset changed.</div>
</div>

## 4. IO managers

An **IO manager** decides where a returned value is stored and how it is loaded for the next asset. Think of a cloakroom: you hand over your coat (return a DataFrame), get a ticket, and the next person with your ticket gets the same coat back. Ready-made IO managers exist for Parquet files, DuckDB, Snowflake, BigQuery and more.

```python
from dagster_duckdb_polars import DuckDBPolarsIOManager

defs = dg.Definitions(
    assets=[raw_pms, stg_bookings],
    resources={"io_manager": DuckDBPolarsIOManager(database="data/wh.duckdb", schema="hotel")},
)

@dg.asset
def stg_bookings(raw_pms: pl.DataFrame) -> pl.DataFrame:   # loaded from the DuckDB table hotel.raw_pms
    return pms.latest_version(raw_pms)                     # stored as hotel.stg_bookings
```

The argument name `raw_pms` matches the parent asset's name; that is how Dagster knows what to load. Package names for IO managers change over time, so check the Dagster integrations page for the current one.

**Which to use?** Writing files yourself with `deps=` (last lesson) is explicit and handles huge data well. IO managers save code for small and medium tables. Many projects mix both.

## 5. Testing assets

Assets are plain functions, so the simplest test calls one directly with fake inputs:

```python
import polars as pl
from hotel_pipeline.defs.assets import stg_bookings

def test_stg_bookings_keeps_latest():
    raw = pl.DataFrame({"booking_id": [1, 1, 2],
                        "status": ["confirmed", "cancelled", "confirmed"],
                        "file_received_at": ["2026-09-01", "2026-09-03", "2026-09-01"]})
    out = stg_bookings(raw).sort("booking_id")
    assert out["status"].to_list() == ["cancelled", "confirmed"]
```

To test the wiring (several assets plus resources together) use `dg.materialize`:

```python
def test_hotel_graph_runs_locally(tmp_path):
    result = dg.materialize([raw_pms_files, stg_bookings],
                            resources={"sftp": LocalFolderSource(path="tests/fixtures/inbox"),
                                       "raw": RawZone(url=f"file://{tmp_path}"),
                                       "io_manager": dg.mem_io_manager})
    assert result.success
```

<div class="problem" data-problem="dagster-resources-config-ci"></div>

<div class="meaning">

<dl>
<dt>Resource</dt><dd>A connection or client (SFTP, warehouse, API) handed to assets from outside, so it can be swapped.</dd>
<dt>EnvVar</dt><dd>A setting read from the environment when the run starts, never written in code or shown in the UI.</dd>
<dt>IO manager</dt><dd>The cloakroom for returned values: it stores each asset's output and loads it for the next asset.</dd>
<dt>Environment</dt><dd>A named set of resources: local, test, prod. Switching it changes where data comes from and goes, not what the code does.</dd>
<dt>Physical meaning</dt><dd>A new teammate clones the project, runs one setup command and <code>dagster dev</code>, and sees green assets in five minutes on a train with no Wi-Fi, because "local" uses a folder and DuckDB. The same code runs at 06:15 in production against the real SFTP server and Azure SQL.</dd>
</dl>

</div>

<div class="myth">

**"Three settings files (dev, test, prod) is the professional way."** Three copies drift apart. The pattern is **one settings model with environment overrides**: one place lists every setting, and each environment changes only what differs. Make "local" fully offline: DuckDB instead of Azure, a folder instead of SFTP, a fake API.

</div>

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** dependency injection makes a function's surroundings an explicit argument, so they can be swapped.

**Equation:** instead of a function `$f(x)$` that secretly reads an environment `$E$`, write

```math
y = f(x, E), \qquad y_{\text{test}} = f(x, E_{\text{fake}}), \qquad y_{\text{prod}} = f(x, E_{\text{prod}})
```

Same `$f$`, different `$E$`.

**Analogy:** a science experiment that writes down its conditions (temperature, pressure) so anyone can repeat it under the same or different conditions.

**Where it breaks:** a resource with hidden shared state, such as a connection cached in a global variable and reused across tests, leaks one test's setup into the next.

**Try it:** an asset reads an environment variable at import time. Can a test change it for just one test? (Not reliably: the module was already imported. Use a resource, or read inside the function.)
</details>

## 6. Try it

1. Create four resources: `RawZone`, `SftpSource`, `LocalFolderSource` (same `list_ready` method as `SftpSource`) and `DuckDBWarehouse` (a `path` and a `query(sql)` method).
2. Change `raw_pms_files` to take a source resource. Local uses the folder; a "docker" environment uses the SFTP test container from [Lesson 1.5](/learn/courses/etl/cloud-drives-sftp/).
3. Add the `P2D_ENV` switch and run both environments.
4. Try the DuckDB + Polars IO manager for `stg_bookings` and `otb_by_stay_date`, then open the tables in the DuckDB command line: `duckdb data/wh.duckdb "select count(*) from hotel.stg_bookings"`.
5. Write four tests: one plain test per core function and one `dg.materialize` test of the hotel graph with the local folder fixture.

**What to check:** `grep -r "password" src/` finds no real values; `P2D_ENV=local uv run pytest` passes with the network off; switching `P2D_ENV` changes no asset code. Commit as `feat(dagster): resources, environments, IO manager, tests`.

<div class="keypoints">

- Resources hand connections and settings to assets from outside, so the same asset runs locally, in tests and in production.
- Read secrets with `dg.EnvVar` at run time; never write them in code or in config the UI shows.
- Give swappable resources the same methods (a folder source and an SFTP source both have `list_ready`).
- An IO manager stores each returned value and loads it for the next asset.
- Test logic by calling functions with fake inputs; use `dg.materialize` to test the wiring.

</div>
