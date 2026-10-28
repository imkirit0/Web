"""Pull content from the live gteceducation.com into content/*.json.

Run: python -I scripts/scrape.py   (re-run any time the live site changes)
"""
import html
import json
import re
import sys
import urllib.request
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

SITE = "https://www.gteceducation.com"
OUT = Path(__file__).resolve().parent.parent / "content"
OUT.mkdir(exist_ok=True)


def get(path):
    req = urllib.request.Request(SITE + path, headers={"User-Agent": "Mozilla/5.0 (gtec-migration)"})
    for _ in range(3):
        try:
            return urllib.request.urlopen(req, timeout=40).read().decode("utf-8", "ignore")
        except Exception as e:  # retry flaky requests, then give up on this page
            err = e
    print("FAIL", path, err, file=sys.stderr)
    return ""


def strip_noise(s):
    return re.sub(r"<script.*?</script>|<style.*?</style>|<!--.*?-->|<noscript.*?</noscript>", "", s, flags=re.S | re.I)


def text(s):
    return re.sub(r"\s+", " ", html.unescape(re.sub(r"<[^>]+>", " ", s))).strip()


def main_region(s):
    """Everything between the sub-page hero and the footer, minus the course side nav."""
    s = strip_noise(s)
    i = s.find('class="hero-banner')
    j = s.find("<footer")
    m = s[i if i > 0 else 0 : j if j > 0 else len(s)]
    k = m.find('class="course-side-nav')
    return m[:k] if k > 0 else m


ALLOWED = {"h2", "h3", "h4", "h5", "p", "ul", "ol", "li", "strong", "b", "em", "i", "br", "table", "thead", "tbody", "tr", "td", "th", "a"}


def clean_html(s):
    """Keep only simple content tags, drop attributes (except href), collapse empties."""
    s = strip_noise(s)

    def tag(m):
        close, name, attrs = m.group(1), m.group(2).lower(), m.group(3) or ""
        if name not in ALLOWED:
            return " " if name in {"div", "span", "section"} else ""
        if name == "b":
            name = "strong"
        if name == "i" and "class=" in attrs:  # icon fonts
            return ""
        if name == "a" and not close:
            h = re.search(r'href="\s*([^"]+)"', attrs)
            href = h.group(1).strip().replace(SITE, "") if h else "#"
            return f'<a href="{html.escape(href)}">'
        return f"<{close}{name}>"

    s = re.sub(r"<(/?)([a-zA-Z0-9]+)([^>]*)>", tag, s)
    s = s.replace("�", "").replace("&nbsp;", " ")
    for _ in range(3):
        s = re.sub(r"<(p|li|strong|h4|ul|ol|em|a[^>]*)>\s*</\w+>", "", s)
    s = re.sub(r"\s+", " ", s)
    s = re.sub(r"<i>\s*</i>", "", s)
    return re.sub(r"<[a-z]*$", "", s.strip()).strip()


def imgs(s):
    return [u for u in re.findall(r'<img[^>]+src="([^"]+)"', s) if "/logo" not in u]


def breadcrumb(m):
    b = re.search(r'<ul class="breadcrumb">(.*?)</ul>', m, re.S)
    return [text(x) for x in re.findall(r"<li>(.*?)</li>", b.group(1), re.S)][1:] if b else []


# ── Courses ────────────────────────────────────────────────────

def course_links(m, base):
    return [
        {"slug": h.rstrip("/").split("/")[-1], "title": text(t), "image": i}
        for h, i, t in re.findall(
            r'<a href="\s*' + re.escape(SITE + base) + r'/([^"\s]+)"\s*class="course-card">.*?<img src="([^"]+)".*?<h4>(.*?)</h4>', m, re.S
        )
    ]


def scrape_category(slug):
    m = main_region(get(f"/courses/{slug}"))
    body = m[m.find("course-side-data") :]
    title = text(re.search(r"<h1>(.*?)</h1>", body, re.S).group(1))
    intro = re.search(r"</h1>\s*<p>(.*?)</p>", body, re.S)
    banner = re.search(r'<img src="([^"]+coursecategory[^"]+)"', body)
    levels = [
        {"slug": h.rstrip("/").split("/")[-1], "title": text(t)}
        for h, t in re.findall(r'<a href="' + re.escape(SITE) + r'/courses/' + slug + r'/([^"]+)"\s*class="course-sub-link">(.*?)</a>', body, re.S)
    ]
    return {
        "slug": slug,
        "title": title,
        "intro": text(intro.group(1)) if intro else "",
        "banner": banner.group(1) if banner else None,
        "levels": levels,
        "courses": course_links(body, f"/courses/{slug}"),
    }


def scrape_level(cat, level):
    m = main_region(get(f"/courses/{cat}/{level}"))
    h1 = re.search(r"<h1>(.*?)</h1>", m, re.S)
    if 'course-detail-page' in m:  # e.g. non-it-programs/logistics-management is itself a course
        return {"slug": level, "detail": scrape_course_html(m)}
    return {"slug": level, "title": text(h1.group(1)) if h1 else level, "courses": course_links(m, f"/courses/{cat}/{level}")}


def scrape_course_html(m):
    h1 = re.search(r"<h1>(.*?)</h1>", m, re.S)
    cat = re.search(r"Course category:\s*(.*?)</p>", m, re.S)
    dur = re.search(r"Course Duration:\s*<strong>(.*?)</strong>", m, re.S)
    img = re.search(r'course-prime-info">\s*<img src="([^"]+)"', m)
    body = re.search(r'class="col-12 course-data">(.*)', m, re.S)
    return {
        "title": text(h1.group(1)) if h1 else "",
        "category": text(cat.group(1)) if cat else "",
        "duration": text(dur.group(1)) if dur else "",
        "image": img.group(1) if img else None,
        "body": clean_html(body.group(1)) if body else "",
    }


def scrape_course(cat, level, slug):
    d = scrape_course_html(main_region(get(f"/courses/{cat}/{level}/{slug}")))
    return {"slug": slug, **d}


def courses():
    cats = list(ThreadPoolExecutor(7).map(scrape_category, ["robotics", "software", "multimedia", "hardware-and-networking", "finance-and-business-management", "cad", "non-it-programs"]))
    with ThreadPoolExecutor(8) as ex:
        for c in cats:
            subs = [l["slug"] for l in c["levels"]] or [x["slug"] for x in c["courses"]]
            c["levels"] = list(ex.map(lambda l: scrape_level(c["slug"], l), subs))
            c.pop("courses")
        jobs = [(c["slug"], l["slug"], x["slug"]) for c in cats for l in c["levels"] for x in l.get("courses", [])]
        print("course details:", len(jobs))
        details = dict(zip(jobs, ex.map(lambda j: scrape_course(*j), jobs)))
    for c in cats:
        for l in c["levels"]:
            for x in l.get("courses", []):
                d = details[(c["slug"], l["slug"], x["slug"])]
                x.update({k: v for k, v in d.items() if v}, image=d["image"] or x["image"])
    (OUT / "courses.json").write_text(json.dumps(cats, indent=1, ensure_ascii=False), encoding="utf-8")


# ── Everything else: raw main region per page, for the page builders ─────

PAGES = [
    "profile", "leadership", "managementteam", "gtecinternational", "trainingandcertifications", "affiliations",
    "associations", "awardsrecognitions", "feedback", "resultsonline", "testimonials", "centres", "placements",
    "vacancies", "postvacancy", "jobfair", "photogallery", "videogallery", "newsandevent", "ouroffices",
    "supportdesk", "postamessage", "becomeapartner", "enquireaboutacourse", "onlinepayment", "paymentforcentres",
    "onlineinternationalpayment", "blog/", "privacypolicy", "newsandevent/53",
]


def page(path):
    raw = get("/" + path)
    m = main_region(raw)
    t = re.search(r"<title>(.*?)</title>", raw, re.S)
    return {
        "path": "/" + path.strip("/"),
        "title": text(t.group(1)) if t else "",
        "breadcrumb": breadcrumb(m),
        "images": imgs(m),
        "text": text(m),
        "html": clean_html(m[m.find("</ul>") :] if "breadcrumb" in m else m),
        "forms": re.findall(r"<(?:input|select|textarea)[^>]*name=\"([^\"]+)\"", m),
    }


def pages(extra):
    with ThreadPoolExecutor(8) as ex:
        data = {p["path"]: p for p in ex.map(page, PAGES + extra)}
    (OUT / "pages.json").write_text(json.dumps(data, indent=1, ensure_ascii=False), encoding="utf-8")


if __name__ == "__main__":
    sm = get("/sitemap.xml")
    urls = [u.replace(SITE, "").strip("/") for u in re.findall(r"<loc>(.*?)</loc>", sm)]
    extra = [u for u in urls if re.match(r"^(centres|newsandevent|blog)/", u) and "category" not in u]
    pages(extra)
    print("pages ok")
    courses()
    print("courses ok")
