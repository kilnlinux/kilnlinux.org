# kilnlinux.org

The websites for [Kiln Linux](https://kilnlinux.org), hosted on Cloudflare Workers:

- `kilnlinux.org`: the project site, in the repo root (Astro + Tailwind)
- `docs.kilnlinux.org`: the documentation, in `docs/` (Astro + Starlight), an npm workspace

## Stack

- [Astro](https://astro.build) 7, TypeScript, static output
- [Starlight](https://starlight.astro.build) for the docs, with built-in search (Pagefind)
- `@astrojs/sitemap` for the project site; Starlight makes the docs sitemap
- Tailwind CSS v4 for the site pages; the docs are restyled with plain CSS variables
- Self-hosted IBM Plex Sans (text) and IBM Plex Mono (code), via Fontsource
- No client-side JavaScript. The mobile menu is a `<details>` element.

## Develop

Node 22 or newer.

```sh
npm install            # installs both sites
npm run dev            # project site, http://localhost:4321
npm run dev:docs       # docs, http://localhost:4322
npm run build          # astro check + build into dist/
npm run build:docs     # astro check + build into docs/dist/
npm run preview        # serve dist/
```

The project site links to the docs by absolute URL (`DOCS` in `src/data/site.ts`). In development `DOCS` points at http://localhost:4322, and `npm run dev` starts the docs server alongside the project site.

If a docs build serves stale Expressive Code CSS (unstyled code blocks), clear the caches: `rm -rf docs/dist docs/.astro docs/node_modules/.astro node_modules/.astro`.

## Design

A plain, light layout in the style of classic distro homepages such as voidlinux.org: a sticky navbar in the Kiln brick colour (`accent`, #a4471f) with site links on the left and docs links on the right, then the logo beside a short intro, a grid of feature blurbs, and stacked sections with ruled headings. Links use the brick colour and turn black on hover. The docs use the same header bar and Starlight's light theme. Brick on white is 6.0:1, so it passes WCAG AA as text.

## Layout

| Path | What it is |
| --- | --- |
| `src/pages/` | `/`, `/download`, `/search`, `/about`, `404` |
| `src/layouts/Base.astro` | Shared head (SEO, Open Graph, canonical), nav, footer |
| `src/components/` | `Logo` (triangle mark), `Wordmark`, `Nav`, `Footer`, `PageHeader`, `Section` (title column + content), `CodeBlock` |
| `src/data/kiln.ts` | Every fact taken from the distro repo: kiln version and commands, profiles, known limits. Pages read from here. |
| `src/styles/theme.css` | Design tokens: `page`, `well`, `rule`, `mute`, `fg`, `heading`, the brick `accent`, fonts |
| `src/styles/global.css` | Base styles and shared classes: `wrap` (the one container width), `label`, `link`, `sheet`, `table`, `prose-k` |
| `src/data/site.ts` | `DOCS`, the docs site URL |
| `docs/src/content/docs/` | Docs pages (Markdown). Sidebar order is in `docs/astro.config.mjs`. |
| `docs/src/styles/docs.css` | Starlight restyled with the Kiln fonts and colors |
| `docs/src/starlight/` | Starlight component overrides (the docs are light-only) |
| `public/` | Favicon, brand marks (copied from the distro repo's `branding/`), `og.png`, `robots.txt` |
| `scripts/og.html` | Source for `public/og.png`. The regenerate command is in the file. |

## Keeping it accurate

Content comes from the Kiln Linux repository. When it changes, update:

- `src/data/kiln.ts`: kiln version and commands, profiles, known limits
- The "Works today" list and build steps in `src/pages/download.astro`
- The matching docs pages in `docs/src/content/docs/`, which follow the distro repo's `README.md` and `docs/`
- `package-management.md` when `kiln` gains commands or profiles change.

The homepage's "Recent commits" list comes from the GitHub API at build time. Rebuild the site to refresh it.

## Deploy to Cloudflare

Each site deploys as its own Worker with static assets only: no Worker script, and each site's `404.html` serves unknown paths.

| Site | Config | Worker | Deploy |
| --- | --- | --- | --- |
| kilnlinux.org | `wrangler.jsonc` | `kilnlinux-org` | `npm run deploy` |
| docs.kilnlinux.org | `docs/wrangler.jsonc` | `kilnlinux-docs` | `npm run deploy:docs` |

```sh
npx wrangler login
npm run deploy
npm run deploy:docs
```

The deploy attaches each Worker's custom domains, listed under `routes` in its `wrangler.jsonc`:

- `kilnlinux-org` gets `kilnlinux.org` and `search.kilnlinux.org`
- `kilnlinux-docs` gets `docs.kilnlinux.org`

The `kilnlinux.org` zone must be on the same Cloudflare account. Cloudflare creates the DNS records for custom domains.

To deploy on push, connect the Git repository to each Worker under Settings, then Build. Use root directory `/` with `npm run build` for `kilnlinux-org`, and root directory `docs` with `npm run build` for `kilnlinux-docs`. Both use `npx wrangler deploy` as the deploy command. The build command can stay empty: each `wrangler.jsonc` runs `npm run build` before deploying.

The download page reads the latest [Kiln-Linux release](https://github.com/kilnlinux/Kiln-Linux/releases/latest) when the site builds: the version, the `.iso` asset, the checksum from the `.iso.sha256` asset, and the bullets under `### Tested` and `### Not tested yet` in the release notes. The build fails if the release has no ISO or checksum. `.github/workflows/release-deploy.yml` checks every hour and redeploys when kilnlinux.org doesn't show the latest tag yet. It needs a `CLOUDFLARE_API_TOKEN` repository secret with permission to edit Workers.

`search.kilnlinux.org` is a second custom domain on `kilnlinux-org`. The profiles page is
`src/pages/search.astro`, linked as `https://search.kilnlinux.org/search` (`SEARCH` in
`src/data/site.ts`). `public/_redirects` sends old `/packages?q=…` links there.
Each `wrangler.jsonc` lists its custom domains under `routes`, so a deploy attaches them.

ISOs will go in R2 once they exist. R2 isn't set up yet.

## Search indexing

The project site uses `https://kilnlinux.org` as its canonical origin. Page titles,
descriptions, Open Graph and Twitter cards come from `src/layouts/Base.astro`,
which also generates WebSite and WebPage JSON-LD. The 404 page sets noindex, and
the sitemap filter in `astro.config.mjs` leaves it out. Starlight manages the docs canonical URLs and sitemap.

After deploying, verify the `kilnlinux.org` domain property in Google Search Console
using the DNS TXT record Google provides. Submit both sitemap URLs:

- `https://kilnlinux.org/sitemap-index.xml`
- `https://docs.kilnlinux.org/sitemap-index.xml`

Use URL Inspection to check the homepage and request indexing. If you attach
`www.kilnlinux.org`, configure a permanent redirect to `https://kilnlinux.org`
in Cloudflare, preserving the path and query string. Keep the HTTP to HTTPS redirect on.

References: [Google's sitemap guide](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)
and [site name structured data](https://developers.google.com/search/docs/appearance/site-names).

## License

MIT. See `LICENSE`.
