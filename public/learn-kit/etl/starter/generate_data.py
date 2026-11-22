"""Synthetic multi-sector daily data drops for the Pipeline to Dashboard course.

Everything here is made up. No real company, person or figure.

Creates a landing area that looks like what a real BI team receives every morning:
  landing/email_inbox/*.eml          daily store-sales reports emailed as CSV/XLSX attachments (retail)
  landing/shared_drive/qsr/<date>/   POS exports from fast-food restaurants, one file per store (QSR)
  landing/sftp/hotel/                nightly PMS booking extracts, pipe-delimited (hospitality)
  landing/api/ads/<date>.json        ad-platform spend + clicks pages, like a paginated REST API (marketing)
  reference/                         store, product, menu, hotel and campaign master data

Faults are seeded on purpose so the cleaning and quality weeks have real work:
duplicates, late files, renamed columns (schema drift), bad dates, negative quantities,
mixed currencies, Windows-1252 encoding, blank trailing rows, a store that goes silent.

Usage:
  python generate_data.py --start 2026-09-01 --days 60 --out ./data --seed 7
"""
from __future__ import annotations
import argparse, csv, io, json, random
from datetime import date, datetime, timedelta
from email.message import EmailMessage
from pathlib import Path

import numpy as np
import pandas as pd

# ---------------- reference data ----------------
REGIONS = ["Niagara", "Hamilton", "Toronto", "Ottawa", "London"]

def reference(rng: random.Random):
    stores = [{"store_code": f"R{100+i}", "store_name": f"Northgate Market #{100+i}",
               "region": REGIONS[i % 5], "opened": str(date(2018 + i % 6, 1 + i % 12, 1)),
               "sq_ft": rng.choice([8000, 12000, 18000, 25000])} for i in range(12)]
    cats = {"Grocery": (2, 15), "Produce": (1, 8), "Household": (3, 25), "Beverages": (1, 6), "Snacks": (1, 5)}
    products = []
    for i in range(150):
        c = list(cats)[i % 5]
        lo, hi = cats[c]
        products.append({"sku": f"SKU{10000+i}", "product_name": f"{c} item {i}", "category": c,
                         "unit_price": round(rng.uniform(lo, hi), 2), "unit_cost_pct": round(rng.uniform(.55, .8), 2)})
    restaurants = [{"restaurant_id": f"Q{200+i}", "brand": ["BurgerBay", "TacoTrail", "WingWorks"][i % 3],
                    "city": REGIONS[i % 5], "drive_thru": i % 2 == 0} for i in range(18)]
    menu = []
    for b, items in {"BurgerBay": ["Classic Burger", "Double Stack", "Fries", "Shake", "Combo Meal", "Kids Meal"],
                     "TacoTrail": ["Taco", "Burrito", "Nachos", "Quesadilla", "Churros", "Soda"],
                     "WingWorks": ["6 Wings", "12 Wings", "Boneless Bites", "Celery Dip", "Wing Combo", "Soda"]}.items():
        for j, it in enumerate(items):
            menu.append({"menu_item_id": f"{b[:2].upper()}{j:02d}", "brand": b, "item_name": it,
                         "price": round(rng.uniform(2.5, 16), 2), "food_cost_pct": round(rng.uniform(.22, .38), 2)})
    hotels = [{"hotel_id": f"H{i}", "hotel_name": f"Lakeview Hotel {i}", "city": REGIONS[i % 5],
               "rooms": rng.choice([120, 180, 240, 320])} for i in range(1, 6)]
    campaigns = []
    for i in range(24):
        ch = ["search", "social", "display", "video"][i % 4]
        campaigns.append({"campaign_id": f"C{3000+i}", "channel": ch,
                          "client": ["Northgate Market", "BurgerBay", "Lakeview Hotels"][i % 3],
                          "objective": rng.choice(["conversions", "traffic", "awareness"])})
    return stores, products, restaurants, menu, hotels, campaigns

# ---------------- daily generators ----------------
def season(d: date) -> float:
    weekday = [0.9, 0.85, 0.9, 1.0, 1.2, 1.35, 1.1][d.weekday()]
    return weekday * (1 + 0.15 * np.sin(2 * np.pi * d.timetuple().tm_yday / 365))

def retail_day(d, stores, products, nrng):
    rows = []
    for s in stores:
        n = int(nrng.poisson(220 * season(d) * s["sq_ft"] / 15000))
        picks = nrng.integers(0, len(products), n)
        for k, p in enumerate(picks):
            pr = products[p]
            qty = int(nrng.integers(1, 5))
            disc = float(nrng.choice([0, 0, 0, .1, .2]))
            rows.append({"store_code": s["store_code"], "receipt_no": f"{s['store_code']}-{d:%Y%m%d}-{k//3:05d}",
                         "sold_at": datetime.combine(d, datetime.min.time()) + timedelta(minutes=int(nrng.integers(7*60, 22*60))),
                         "sku": pr["sku"], "qty": qty, "unit_price": pr["unit_price"], "discount_pct": disc})
    return pd.DataFrame(rows)

def qsr_day(d, restaurants, menu, nrng):
    rows = []
    for r in restaurants:
        items = [m for m in menu if m["brand"] == r["brand"]]
        n = int(nrng.poisson(480 * season(d)))
        for k in range(n):
            # QSR business day runs 05:00 to 04:59 next calendar day: late-night orders spill past midnight
            minute = int(nrng.choice(np.arange(5*60, 29*60), p=_qsr_curve()))
            ts = datetime.combine(d, datetime.min.time()) + timedelta(minutes=minute)
            m = items[int(nrng.integers(0, len(items)))]
            rows.append({"restaurant_id": r["restaurant_id"], "order_id": f"{r['restaurant_id']}{d:%y%m%d}{k:05d}",
                         "order_ts": ts.strftime("%Y-%m-%d %H:%M:%S"), "channel": nrng.choice(["counter", "drive_thru", "app", "delivery"], p=[.35, .3, .2, .15]),
                         "menu_item_id": m["menu_item_id"], "qty": int(nrng.integers(1, 4)), "price": m["price"]})
    return pd.DataFrame(rows)

_curve = None
def _qsr_curve():
    global _curve
    if _curve is None:
        mins = np.arange(5*60, 29*60)
        h = mins / 60
        w = 0.2 + 2.5*np.exp(-((h-12.5)**2)/1.2) + 2.0*np.exp(-((h-18.5)**2)/1.8) + 0.6*np.exp(-((h-24.5)**2)/2)
        _curve = w / w.sum()
    return _curve

def hotel_day(d, hotels, nrng, start_id):
    rows, bid = [], start_id
    for h in hotels:
        for _ in range(int(nrng.poisson(h["rooms"] * 0.35))):
            lead = int(nrng.gamma(2, 15))
            arr = d + timedelta(days=lead)
            nights = int(nrng.choice([1, 1, 2, 2, 3, 4, 7]))
            ch = nrng.choice(["direct", "ota_a", "ota_b", "gds", "group"], p=[.35, .3, .15, .1, .1])
            adr = round(float(nrng.normal(189, 35)) * (1.25 if arr.weekday() >= 4 else 1.0), 2)
            status = nrng.choice(["confirmed", "cancelled"], p=[.82, .18])
            rows.append({"booking_id": bid, "hotel_id": h["hotel_id"], "created": d.isoformat(), "arrival": arr.isoformat(),
                         "nights": nights, "rooms": 1, "channel": ch, "rate_amount": adr,
                         "currency": "CAD", "status": status})
            bid += 1
    return pd.DataFrame(rows), bid

def ads_day(d, campaigns, nrng):
    rows = []
    for c in campaigns:
        spend = round(float(nrng.gamma(4, 60)) * season(d), 2)
        cpc = {"search": 1.8, "social": 0.9, "display": 0.45, "video": 1.2}[c["channel"]]
        clicks = int(spend / cpc * nrng.uniform(.8, 1.2))
        impressions = int(clicks / nrng.uniform(.005, .04))
        conv = int(nrng.binomial(clicks, {"search": .05, "social": .02, "display": .01, "video": .015}[c["channel"]]))
        rows.append({"date": d.isoformat(), "campaign_id": c["campaign_id"], "impressions": impressions,
                     "clicks": clicks, "spend_micros": int(spend * 1_000_000), "conversions": conv,
                     "conversion_value": round(conv * float(nrng.uniform(20, 90)), 2)})
    return rows

# ---------------- writers with seeded faults ----------------
def write_email(out: Path, d: date, df: pd.DataFrame, store_code: str, rng: random.Random, fault: str | None):
    msg = EmailMessage()
    msg["From"] = f"store.{store_code.lower()}@northgate.example"
    msg["To"] = "bi-intake@yourco.example"
    msg["Subject"] = f"Daily sales {store_code} {d:%d/%m/%Y}"
    msg["Date"] = (datetime.combine(d + timedelta(days=1), datetime.min.time()) + timedelta(hours=6, minutes=rng.randint(0, 120))).strftime("%a, %d %b %Y %H:%M:%S -0500")
    msg.set_content(f"Hi team,\n\nAttached are yesterday's sales for {store_code}.\n\nThanks,\nStore manager\n")
    part = df.copy()
    part["sold_at"] = pd.to_datetime(part["sold_at"]).dt.strftime("%d/%m/%Y %H:%M")  # day-first dates: a classic trap
    if fault == "drift":
        part = part.rename(columns={"qty": "quantity", "unit_price": "price"})
    if fault == "negative":
        part.loc[part.sample(frac=.01, random_state=1).index, "qty"] *= -1  # refunds mixed into sales
    if fault == "xlsx" or rng.random() < .25:
        buf = io.BytesIO(); part.to_excel(buf, index=False, sheet_name="Sales")
        msg.add_attachment(buf.getvalue(), maintype="application", subtype="vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                           filename=f"sales_{store_code}_{d:%Y%m%d}.xlsx")
    else:
        text = part.to_csv(index=False)
        if fault == "trailing":
            text += ",,,,,,\n,,,,,,\nTOTAL,,,,,,\n"
        msg.add_attachment(text.encode("utf-8"), maintype="text", subtype="csv", filename=f"sales_{store_code}_{d:%Y%m%d}.csv")
    (out / f"{d:%Y%m%d}_{store_code}_{rng.randint(1000,9999)}.eml").write_bytes(bytes(msg))

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--start", default="2026-09-01")
    ap.add_argument("--days", type=int, default=30)
    ap.add_argument("--out", default="./data")
    ap.add_argument("--seed", type=int, default=7)
    ap.add_argument("--clean", action="store_true", help="no seeded faults")
    a = ap.parse_args()
    rng, nrng = random.Random(a.seed), np.random.default_rng(a.seed)
    out = Path(a.out)
    dirs = {k: out / "landing" / v for k, v in {"email": "email_inbox", "qsr": "shared_drive/qsr", "hotel": "sftp/hotel", "ads": "api/ads"}.items()}
    for p in [*dirs.values(), out / "reference"]:
        p.mkdir(parents=True, exist_ok=True)
    stores, products, restaurants, menu, hotels, campaigns = reference(rng)
    for name, obj in [("stores", stores), ("products", products), ("restaurants", restaurants), ("menu", menu), ("hotels", hotels), ("campaigns", campaigns)]:
        pd.DataFrame(obj).to_csv(out / "reference" / f"{name}.csv", index=False)

    start = date.fromisoformat(a.start)
    silent_store = stores[7]["store_code"]
    bid = 500000
    for i in range(a.days):
        d = start + timedelta(days=i)
        faults = not a.clean
        # retail -> one email per store
        rdf = retail_day(d, stores, products, nrng)
        for s in stores:
            if faults and s["store_code"] == silent_store and 20 <= i < 24:
                continue  # store goes silent for 4 days (missing data, not zero sales)
            f = None
            if faults:
                f = rng.choices([None, "drift", "negative", "xlsx", "trailing"], [80, 3, 6, 6, 5])[0]
            write_email(dirs["email"], d, rdf[rdf.store_code == s["store_code"]], s["store_code"], rng, f)
            if faults and rng.random() < .02:  # store manager hits send twice
                write_email(dirs["email"], d, rdf[rdf.store_code == s["store_code"]], s["store_code"], rng, f)
        # qsr -> one csv per restaurant in a dated folder
        qdf = qsr_day(d, restaurants, menu, nrng)
        qdir = dirs["qsr"] / f"{d:%Y-%m-%d}"; qdir.mkdir(exist_ok=True)
        for r in restaurants:
            part = qdf[qdf.restaurant_id == r["restaurant_id"]].copy()
            if faults and rng.random() < .03:
                part = pd.concat([part, part.sample(frac=.05, random_state=i)])  # POS re-sent a batch
            if faults and rng.random() < .02:
                part.loc[part.sample(n=3, random_state=i).index, "order_ts"] = "00/00/0000 00:00:00"
            enc = "cp1252" if (faults and r["brand"] == "TacoTrail") else "utf-8"
            part["item_note"] = np.where(nrng.random(len(part)) < .01, "Jalapeño extra – no onion", "")
            part.to_csv(qdir / f"pos_{r['restaurant_id']}.csv", index=False, encoding=enc, errors="replace")
        # hotel -> pipe file, plus modified bookings (cancellations of earlier ids)
        hdf, bid_new = hotel_day(d, hotels, nrng, bid)
        if i > 0 and len(hdf):
            mods = hdf.sample(frac=.1, random_state=i).copy()
            mods["booking_id"] = [int(nrng.integers(500000, bid)) for _ in range(len(mods))]
            mods["status"] = "cancelled"
            hdf = pd.concat([hdf, mods])  # same booking_id appears again with a new status: upsert, don't append
        bid = bid_new
        late = faults and rng.random() < .05
        fname = dirs["hotel"] / f"pms_bookings_{d:%Y%m%d}.txt"
        hdf.to_csv(fname, sep="|", index=False)
        if late:
            fname.rename(fname.with_suffix(".txt.partial"))  # upload not finished: sensor must ignore it
        # ads -> paginated json
        rows = ads_day(d, campaigns, nrng)
        if faults and rng.random() < .1:
            for r in rows[:3]: r["currency"] = "USD"  # some campaigns billed in USD
        pages = [rows[k:k+10] for k in range(0, len(rows), 10)]
        payload = {"date": d.isoformat(), "pages": [{"page": n+1, "next_page": n+2 if n+1 < len(pages) else None, "data": p} for n, p in enumerate(pages)]}
        (dirs["ads"] / f"{d:%Y-%m-%d}.json").write_text(json.dumps(payload, indent=1))
    print(f"wrote {a.days} days to {out.resolve()}")

if __name__ == "__main__":
    main()
