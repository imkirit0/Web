"""Pull every centre from the live /centres locator into content/centres.json.

Run: python -I scripts/scrape_centres.py   (re-run any time centres change)
The live page lazy-loads cards via a paginated POST; we page through it once per country.
"""
import html
import http.cookiejar
import json
import re
import sys
import time
import urllib.parse
import urllib.request
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))  # -I drops the script dir
from scrape import clean_html, get, imgs, main_region  # noqa: E402

SITE = "https://www.gteceducation.com"
OUT = Path(__file__).resolve().parent.parent / "content" / "centres.json"
DETAIL = OUT.with_name("centre-pages.json")  # server-only; kept out of the listing bundle

opener = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(http.cookiejar.CookieJar()))
opener.addheaders = [("User-Agent", "Mozilla/5.0 (gtec-migration)")]


def fetch(req):
    for i in range(4):  # the live server resets connections now and then
        try:
            return opener.open(req, timeout=40).read().decode("utf-8", "ignore")
        except OSError:
            if i == 3:
                raise
            time.sleep(2 * (i + 1))


def text(s):
    return re.sub(r"\s+", " ", html.unescape(re.sub(r"<[^>]+>", " ", s))).strip()


def cards(page_html):
    for c in re.split(r'<div class="card center-box">', page_html)[1:]:
        slug = re.search(r'/centres/([^"#/]+)"', c).group(1)
        info = re.search(r'class="center-info">(.*?)class="center-cta"', c, re.S).group(1)
        ps = re.findall(r"<p[^>]*>(.*?)</p>", info, re.S)
        phones = re.search(r"Ph:</span>(.*?)</li>", info, re.S)
        email = re.search(r"Email:</span>(.*?)</li>", info, re.S)
        image = re.search(r'<img src="([^"]+)"', c)
        yield {
            "slug": slug,
            "name": text(re.search(r"<h3>(.*?)</h3>", info, re.S).group(1)),
            "address": text(ps[0]) if ps else "",
            # Dedupe "+91 8870020475, 8870020475" style lists, keep order.
            "phones": list(dict.fromkeys(p for p in (text(x) for x in (phones.group(1) if phones else "").split(",")) if p)),
            "email": text(email.group(1)) if email else "",
            "image": image.group(1) if image else None,
        }


def main():
    s = fetch(SITE + "/centres")
    csrf = re.search(r'csrf-token" content="([^"]+)', s).group(1)
    sel = re.search(r'<select[^>]+name="country".*?</select>', s, re.S).group(0)
    countries = [(v, text(n)) for v, n in re.findall(r'<option value="(\d+)"[^>]*>(.*?)</option>', sel)]

    seen = {}
    for cid, cname in countries:
        for page in range(1, 200):
            data = urllib.parse.urlencode({"country": cid, "page": page}).encode()
            req = urllib.request.Request(SITE + "/centres", data, {"X-CSRF-TOKEN": csrf, "X-Requested-With": "XMLHttpRequest"})
            chunk = fetch(req)
            got = list(cards(chunk))
            if not got:
                break
            for c in got:
                seen.setdefault(c["slug"], {**c, "country": cname})
        print(cname, sum(1 for c in seen.values() if c["country"] == cname))

    out = sorted(seen.values(), key=lambda c: (c["country"] != "India", c["country"], c["name"]))
    OUT.write_text(json.dumps(out, ensure_ascii=False, indent=1), encoding="utf-8")
    print("total", len(out))
    assert len(out) > 300, "expected ~323 centres; live markup may have changed"

    with ThreadPoolExecutor(4) as ex:
        details = dict(zip([c["slug"] for c in out], ex.map(detail, [c["slug"] for c in out])))
    DETAIL.write_text(json.dumps(details, ensure_ascii=False, indent=1), encoding="utf-8")
    print("details", sum(1 for d in details.values() if d["html"]))


def detail(slug):
    """Same cleaned shape as scrape.page(), plus the live Google Maps search query."""
    raw = get(f"/centres/{slug}")
    m = main_region(raw)
    q = re.search(r'google\.com/maps/embed/v1/\w+\?q=([^&"]+)', raw)
    return {
        "html": clean_html(m[m.find("</ul>") :] if "breadcrumb" in m else m),
        "images": imgs(m),
        "map": urllib.parse.unquote(html.unescape(q.group(1))) if q else "",
    }


if __name__ == "__main__":
    main()
