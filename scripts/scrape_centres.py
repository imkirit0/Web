"""Pull every centre from the live /centres locator into content/centres.json.

Run: python -I scripts/scrape_centres.py   (re-run any time centres change)
The live page lazy-loads cards via a paginated POST; we page through it once per country.
"""
import html
import http.cookiejar
import json
import re
import urllib.parse
import urllib.request
from pathlib import Path

SITE = "https://www.gteceducation.com"
OUT = Path(__file__).resolve().parent.parent / "content" / "centres.json"

opener = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(http.cookiejar.CookieJar()))
opener.addheaders = [("User-Agent", "Mozilla/5.0 (gtec-migration)")]


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
    s = opener.open(SITE + "/centres", timeout=40).read().decode("utf-8", "ignore")
    csrf = re.search(r'csrf-token" content="([^"]+)', s).group(1)
    sel = re.search(r'<select[^>]+name="country".*?</select>', s, re.S).group(0)
    countries = [(v, text(n)) for v, n in re.findall(r'<option value="(\d+)"[^>]*>(.*?)</option>', sel)]

    seen = {}
    for cid, cname in countries:
        for page in range(1, 200):
            data = urllib.parse.urlencode({"country": cid, "page": page}).encode()
            req = urllib.request.Request(SITE + "/centres", data, {"X-CSRF-TOKEN": csrf, "X-Requested-With": "XMLHttpRequest"})
            chunk = opener.open(req, timeout=40).read().decode("utf-8", "ignore")
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


if __name__ == "__main__":
    main()
