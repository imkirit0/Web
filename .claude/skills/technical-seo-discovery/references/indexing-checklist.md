# Indexing Checklist

## Inspect representative URLs

- Canonical host and HTTPS redirect in at most one hop.
- Final status is appropriate and not a soft 404.
- `X-Robots-Tag`, meta robots, and authentication middleware permit the intended crawler.
- Primary title, description, heading, content, and links are present in rendered HTML.
- Canonical is absolute, stable, and matches the chosen URL policy.
- Structured data matches visible content and resolves to the same canonical entity.

## Discovery surfaces

- Robots points to the sitemap index and does not block required assets or routes.
- Sitemaps contain only canonical, indexable `200` URLs and stay within protocol limits.
- Crawlable hubs link to valuable profiles, jobs, posts, and portfolio pages.
- Deleted, expired, private, duplicate, and low-quality records leave sitemaps promptly.

## Search Console interpretation

- `noindex`, redirect error, server error, and blocked resources are technical failures.
- `Discovered - currently not indexed` can indicate crawl prioritization or low perceived value.
- Validation and URL inspection request recrawls; they do not guarantee indexing or ranking.
- Compare submitted, discovered, crawled, indexed, and impression counts by page type over time.
