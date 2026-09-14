# CodeBoxx Website

React + SCSS front end for the CodeBoxx corporate site (Studio, Solutions, Academy, Ventures).
**Mid-migration from a Vite/React SPA to Astro** (branch `ml/astrobuild_migration`) — see
"Migration status" below before assuming a page works the way you'd expect from either
world.

## Stack

- **Astro 5** (static output — `astro build` prerenders every route to real HTML in `dist/`,
  no adapter/server) + **React 18** islands for interactive pieces, via `@astrojs/react`
- **react-bootstrap** + **Bootstrap 5** for every interactive component (nav, forms, badges,
  the Codi/Enroll drawers), themed via Sass variable overrides — no vendored component bundle
- **SCSS** for all styling, no inline styles (`src/styles/`)
- **Sanity** CMS — natively-migrated pages fetch it at build time (`src/lib/sanityContent.js`,
  zero client JS for the content itself); not-yet-migrated pages still fetch it client-side,
  same as before the migration (`src/lib/sanity.js`)
- **@astrojs/sitemap** generates `sitemap-index.xml`/`sitemap-*.xml` from the actual
  prerendered routes (including one entry per blog post) — replaces the old hand-rolled
  `scripts/generate-sitemap.mjs`

## Migration status

This migration exists to fix a real bug, not just chase a framework trend: the old SPA's
`Seo.jsx` (react-helmet-async) only ever wrote OG/Twitter/JSON-LD tags into the DOM
client-side, so a shared blog link's social preview and hreflang alternates were invisible
to anything that doesn't execute JS (most social link-unfurlers, many non-Google crawlers).
Astro renders that straight into the HTML response instead.

| Route(s)                                                     | Status                | Notes                                                                                                                                                                                                                                                                                                                                                                                                                             |
| ------------------------------------------------------------ | --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/blog`, `/fr/blogue`                                        | ✅ Native Astro       | `src/pages/blog/index.astro` + FR twin. Full post list fetched at build time, filter/pagination is a React island (`BlogPostsIsland.jsx`) hydrated over already-rendered markup.                                                                                                                                                                                                                                                  |
| `/blog/:slug`, `/fr/blogue/:slug`                            | ✅ Native Astro       | `src/pages/blog/[slug].astro` + FR twin, via `getStaticPaths`. Post body renders through `src/lib/portableText.js` (a hand-written server-side Portable Text → HTML renderer) — **zero JS** for the article itself, not even a React island, since that would reintroduce the exact bug this migration fixes.                                                                                                                     |
| `/`, `/fr`                                                   | ✅ Native Astro       | `src/pages/index.astro` + FR twin, via `HomeIsland.jsx` — see "Why Home is one big island" below. Real SEO tags and all of Home's actual content (hero, division blurbs, team names/photos, service details, academy copy) are now in the HTML response; it's still a fully interactive page after hydration, same behavior as before.                                                                                            |
| `/financing`, `/fr/financement`, `/ventures`, `/fr/ventures` | 🚧 Not yet migrated   | Each is a thin Astro page (`src/pages/financing.astro` etc.) that mounts the **original, unmodified** React SPA (`src/App.jsx`, `src/components/Chrome.jsx`, `src/lib/routes.js`, `src/lib/i18n.js`) as one `client:only="react"` island via `src/layouts/LegacyShell.astro`/`LegacyAppIsland.jsx`. Behavior here is intentionally unchanged from before the migration — same CSR-only rendering, same client-side-only SEO tags. |
| unmatched paths                                              | 🚧 Legacy passthrough | `src/pages/404.astro` also mounts the legacy app, so `App.jsx`'s own `*` → Home fallback still fires (pre-existing behavior, not something this migration changed) — note this now renders the **legacy** `Home.jsx`, not the natively-migrated homepage, since it's the same mounted SPA instance as Financing/Ventures.                                                                                                         |

### Why Home is one big island, not many small ones (like Blog)

Blog/BlogPost got split into fine-grained islands (or zero JS at all, for the post
body) because most of their content is genuinely static. Home isn't: Studio/
Solutions/Academy are tab-switchers, there's a chat drawer, a full enrollment form,
a contact form, a carousel, a count-up animation — and the Codi/Enroll drawers need
to share state with both TopBar (top of the page) and several buttons deep inside
the content (Academy, Contact). That only works cleanly if TopBar, the content, the
drawers, and Footer are all one React tree — so `HomeIsland.jsx` mounts as a single
`client:load` island from `src/pages/index.astro`, importing `TopBar`/`Footer`
directly from `ChromeIsland.jsx` as plain nested components (not separate Astro
islands the way Blog's `Layout.astro` uses them). Astro still server-renders this
island's first pass into real HTML same as any other island, which is what fixes
the SEO/crawlability problem — the trade-off, honestly stated, is that Home ships a
real JS bundle for its interactivity same as before; this migration's win here is
crawlability and removing the Sanity-content pop-in, not a zero-JS page.

One exception stays client-side on purpose: `IntakeCalendar`'s "InProgress" status
is derived by comparing a cohort's start date to _today_, in the browser, on every
load — baking that into a build-time snapshot would let it silently go stale
between deploys with no content change to trigger a rebuild. It still uses the
unmodified `lib/intakes.js` hook.

### Duplicated-on-purpose files

Two parallel copies of some logic exist on purpose during this transition and are
**not** duplication to clean up casually:

- `src/lib/routes.js` (react-router/react-i18next-based, legacy pages only) vs.
  `src/lib/i18nRoutes.js` (framework-agnostic, native Astro pages only)
- `src/components/Chrome.jsx` (legacy) vs. `src/components/ChromeIsland.jsx` (Astro-native,
  props-driven instead of reading a router/i18next context)
- `src/lib/sanity.js` (client-side hooks, legacy) vs. `src/lib/sanityContent.js` (build-time
  async functions, Astro-native)
- `src/pages/Home.jsx` (legacy, still used by the 404 fallback) vs.
  `src/components/HomeIsland.jsx` (Astro-native)

Each pair collapses to one file as its last remaining caller gets migrated —
`Home.jsx` specifically won't go away until Financing/Ventures are migrated too
(they share its mounted `App.jsx` instance) or the 404 page gets its own native
treatment.

## Getting started

```bash
git clone git@github.com:CodeBoxxTechSchool/CodeBoxx-Claude-Website.git
cd CodeBoxx-Claude-Website
npm install
cp .env.example .env   # fill in the Sanity values
npm run dev
```

`npm run build` writes the static site to `dist/`; `npm run preview` serves it.

## Routes

| Route         | Source                                               | Notes                                                                                  |
| ------------- | ---------------------------------------------------- | -------------------------------------------------------------------------------------- |
| `/`           | `src/pages/index.astro` → `HomeIsland.jsx`           | Sections 01–07, WSJ and Forge 20 bands, Codi drawer, enroll drawer — natively migrated |
| `/blog`       | `src/pages/blog/index.astro`                         | CodeBlog index — natively migrated, Sanity fetched at build time                       |
| `/blog/:slug` | `src/pages/blog/[slug].astro`                        | Standalone post page — natively migrated, one prebuilt page per post                   |
| `/financing`  | `src/pages/financing.astro` → legacy `Financing.jsx` | Academy financing options — not yet natively migrated                                  |
| `/ventures`   | `src/pages/ventures.astro` → legacy `Ventures.jsx`   | CodeBoxx Ventures — not yet natively migrated                                          |

(Each has an `/fr/...` twin — `/fr`, `/fr/blogue`, `/fr/blogue/:slug`, `/fr/financement`,
`/fr/ventures` — as its own separate page file, matching how `ROUTE_TABLE` already modeled
EN/FR as distinct paths rather than one parameterized locale route.)

## Sanity

`src/lib/sanity.js` exposes `fetchCollection(type, groqTail)` plus one hook per content
type, for the not-yet-migrated legacy pages (see "Migration status" above) — fetched
client-side in a `useEffect`, same as before this migration. `src/lib/sanityContent.js` is
its build-time counterpart for the natively-migrated Blog/BlogPost pages: plain async
functions (`fetchPostList`, `fetchPostBySlug`, `fetchAllPostSlugs`) called from Astro
frontmatter/`getStaticPaths`, so post content is already resolved into the HTML by the time
it ships — no hook, no loading state. Both query the Sanity Content API directly over
`fetch` (no SDK dependency) and fall back to a hardcoded seed array/object
(`src/lib/blogSeed.js`) when `VITE_SANITY_PROJECT_ID` isn't set, so the site always builds
and runs with no CMS connection. Entry mapping lives in each file's own `toPost()`-shaped
function — adjust field names there if the document type's schema differs (both files need
the same edit until `sanity.js` is retired).

Project: `zagi8xr3` ("CodeBoxxWeb", dataset `production`). The dataset allows public reads,
so `VITE_SANITY_TOKEN` can stay blank — only set it if the dataset is ever made private.

### Reaching the content dashboard

The editing dashboard (Sanity Studio) lives in its own project, not in this repo:
`/projects/codeboxx-website-studio`, already attached to project `zagi8xr3`
with the four schema types below.

- **Locally**: `cd` into that folder, `npm run dev`, open `http://localhost:3333`.
- **Deployed** (the real day-to-day dashboard, reachable from anywhere): **https://codeboxxweb.sanity.studio/**
- **Project settings, API tokens, dataset management** (not content editing):
  https://www.sanity.io/manage/project/zagi8xr3

Document types expected in the Sanity Studio project (created separately — this repo only
consumes the API, it doesn't scaffold a Studio):

| Document type  | Fields                                                                                                                                                                                         | Consumed by                                                                                                                           |
| -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `post`         | `title`, `slug`, `category`, `author`, `publishedAt`, `excerpt`, `content` (Portable Text/rich text), `featuredImage` (optional), `url` (optional external reference — not the content source) | `useSanityPosts` — Blog page; `useSanityPost(slug, seed)` — the post's own page at `/blog/:slug`                                      |
| `teamMember`   | `name`, `role`, `linkedin` (url), `photo` (image), `group` (`"studio"` \| `"academy"`), `order` (number)                                                                                       | `useSanityTeam(group, seed)` — Studio team (`#codeboxx .person`) and Academy team (`#academy .person`), same type filtered by `group` |
| `partnerLogo`  | `name`, `logo` (image), `order` (number)                                                                                                                                                       | `useSanityLogos(seed)` — the `.client-slider` partner logos; however many documents exist is however many slides show                 |
| `cohortIntake` | `program` (`"fsd"` \| `"aidev"`), `date`, `location`, `status` (`"Open"` \| `"Waitlist"` \| `"Planned"`)                                                                                       | `useIntakes(seed)` in `src/lib/intakes.js` — the `#intake` calendar rows                                                              |

`useIntakes` lives in its own file, not `sanity.js`, on purpose: the intake calendar is a
placeholder for a real admissions API later, and `IntakeCalendar` only ever imports
`useIntakes` and expects a `{ fsd: [...], aidev: [...] }` return shape — swapping the data
source later means rewriting `src/lib/intakes.js` only, with no changes to `Home.jsx`.

Each post's `content` field is Sanity's standard Portable Text (rich text) — currently
text-only in the schema (headings, bold/italic, links, lists, quotes), no inline images
yet; that's a deliberate, easy-to-extend-later scope call, not a limitation of the
approach. It renders via `@portabletext/react` (the one dependency this project adds
beyond a plain `fetch` — a small, official rendering library, not an API client, so it
doesn't conflict with the rest of `sanity.js` staying SDK-free) with `components`
overrides in `src/pages/BlogPost.jsx` mapping block/list/mark types onto this site's
existing typography classes (`pbody`, `h2`, `ptitle`, etc.) instead of unstyled defaults.

`featuredImage` (optional) is the post page's hero background, via inline `style`
since the URL is per-post data — stacking a `linear-gradient(rgba(0,0,0,.6), ...)`
scrim with `url(...)` in one `background-image`, reusing the scrim-over-photo
technique already used by the homepage `.hero` (`_components.scss`). It also backs
the `/blog` listing card's cover (`Blog.jsx`, via the same `<image-slot src>` prop
already used for team photos/logos). `sanityImageUrl(url, { w, q })` in `sanity.js`
appends Sanity's CDN resize/quality query params so each use requests only the pixel
size it renders (large for the hero, small for the card thumbnail) — no
`@sanity/image-url` package needed. Posts without a `featuredImage` keep the plain
navy hero, unchanged. The article section below the hero (`.post-content-band` in
`_blog.scss`) has its own subtle top-fade gradient, independent of `featuredImage` —
plain CSS, not photo-based.

Team member and partner logo entries carry a stable `id` (the Sanity document `_id`) that's
used as both the React list key and the `<image-slot>` element's `id` attribute. Don't
switch that back to an array index — `image-slot` persists locally-dropped images keyed by
`id`, so a positional id would silently reattach a stale photo to the wrong person after a
reorder in Studio.

## Styling

Everything routes through `src/styles/`, orchestrated by `main.scss` (`@use`, in order):

```
_variables.scss     brand color ramps, semantic aliases, typography/radius scale, then the
                     Bootstrap scalar + $theme-colors overrides, then `@import 'bootstrap/scss/bootstrap'`
_base.scss           html/body resets
_typography.scss     .eyebrow/.h2/.lede/.ptitle/.pbody + band/pill/hero text styles
_layout.scss         .wrap/.sect/.grid2/.grid3/.grid4 — the site's own layout primitives
_components.scss     .panel/.rule/.btn-ghost/badge tint overrides/forms — shared across pages
_chrome.scss         header nav dropdown + footer
_home.scss           Home-only sections (hero, tabs, metrics, calendar, Codi/Enroll drawers)
_blog.scss           Blog-only (post cards, category pills)
_static-pages.scss   shared by Financing.jsx + Ventures.jsx
```

`_variables.scss` has a header comment explaining why it mixes `@import`/`@use` and why
overrides must precede `bootstrap/scss/variables` — read it before touching Bootstrap theming.

Brand components with no Bootstrap equivalent (`Logo`, `Avatar`) are tiny hand-written
components in `src/components/`, not a vendored bundle. Everything else — buttons, badges,
forms, the Codi/Enroll drawers — is react-bootstrap, restyled via the SCSS above.

## Deployment

`.github/workflows/deploy.yml` builds the site and rsyncs `dist/` to the
"CodeBoxx Web Claude" DigitalOcean Droplet over SSH on every push to `main` (or
manually via "Run workflow"). It does not provision anything — the Droplet, nginx,
the `deploy` user, and the target directory are already set up (see below).

Required repo secrets (Settings → Secrets and variables → Actions):

| Secret                    | Value                                                                    |
| ------------------------- | ------------------------------------------------------------------------ |
| `VITE_SANITY_PROJECT_ID`  | Same as `.env`'s `VITE_SANITY_PROJECT_ID`                                |
| `VITE_SANITY_DATASET`     | Same as `.env`'s `VITE_SANITY_DATASET`                                   |
| `VITE_SANITY_API_VERSION` | Same as `.env`'s `VITE_SANITY_API_VERSION`                               |
| `VITE_SANITY_TOKEN`       | Same as `.env`'s `VITE_SANITY_TOKEN` (blank is fine if unset there)      |
| `DROPLET_HOST`            | `159.223.145.47`                                                         |
| `DROPLET_USER`            | `deploy` — a dedicated, non-root, key-only user with no sudo             |
| `DROPLET_SSH_KEY`         | Private half of the `deploy` user's dedicated deploy key (no passphrase) |
| `DROPLET_TARGET_PATH`     | `/var/www/codeboxx`                                                      |

On the Droplet (already done for "CodeBoxx Web Claude"):

- nginx installed and enabled, serving `/var/www/codeboxx` with
  `try_files $uri /index.html;` in its `location /` block.
  **⚠️ This needs a one-line change before this branch is deployed.** That
  fallback existed only because the old build was a pure CSR SPA with no real
  per-route files — every URL needed to resolve to `index.html` and let
  `react-router` sort it out client-side. Astro's static build produces a real
  `dist/blog/index.html`, `dist/blog/some-post/index.html`, etc. for every route
  (`build.format: 'directory'` in `astro.config.mjs`), so a request for `/blog`
  needs to resolve to `dist/blog/index.html`, not fall through to the site root.
  Change the directive to `try_files $uri $uri/index.html $uri/ =404;` (or point
  nginx's `error_page 404` at `/404.html`, which this build also now produces —
  see `src/pages/404.astro` for why that specific page still needs to exist).
  Deploying this branch without that change will silently regress every route
  except literal `/` back to serving the SPA shell.
- A `deploy` system user owns `/var/www/codeboxx`, has no sudo access, and accepts
  SSH only via the dedicated deploy key (password auth disabled). Its
  `authorized_keys` holds only that key's public half.
- No domain/TLS yet — nginx answers on port 80 for any `Host` (catch-all
  `server_name _;`). Point a domain's A record at the Droplet and run `certbot
--nginx` later to add HTTPS; update `server_name` accordingly at that point.

The deploy step runs `rsync --delete`, so `DROPLET_TARGET_PATH` should stay
dedicated to this site — anything else living in that directory gets removed to
match `dist/`.

## Structure

```
astro.config.mjs           output: 'static', @astrojs/react + @astrojs/sitemap

src/
  pages/                    Astro file-based routes — see "Migration status" above
    blog/, fr/blogue/        natively migrated (index.astro, [slug].astro)
    index.astro, fr/index.astro
                             natively migrated (HomeIsland.jsx)
    ventures.astro, financing.astro, fr/ventures.astro, fr/financement.astro, 404.astro
                             thin wrappers mounting the legacy SPA (LegacyShell.astro)
  layouts/
    SeoHead.astro            shared real, build-time SEO <head> tags — used by both shells below
    Layout.astro             shell for Blog/BlogPost — TopBar/Footer as two independent islands
    LegacyShell.astro        shell for not-yet-migrated pages — old index.html's head, LegacyAppIsland

  App.jsx                   legacy SPA routes (react-router) — mounted client:only via LegacyAppIsland
  components/
    ChromeIsland.jsx          Astro-native TopBar/Footer (props-driven, no router/i18next)
    HomeIsland.jsx            Astro-native homepage — one island, see "Why Home is one big island" above
    BlogPostsIsland.jsx       Astro-native filter/pagination island for /blog
    LegacyAppIsland.jsx       mounts App.jsx as one client:only island, for the legacy pages
    Chrome.jsx                legacy TopBar/NavItem/Footer (react-router/react-i18next-based)
    Logo.jsx, Avatar.jsx      brand components with no Bootstrap equivalent, used by both
  lib/
    sanityContent.js          Astro-native, build-time Sanity fetch (blog + home pages)
    sanity.js                 legacy, client-side Sanity fetch hooks (legacy pages)
    blogSeed.js               shared fallback post data, blog pages
    homeSeed.js               shared fallback CodeBlog-teaser data, home page
    portableText.js           server-side Portable Text → HTML, blog post pages only
    i18nRoutes.js              Astro-native EN/FR path helper (no router dependency)
    routes.js                 legacy EN/FR path helper (react-router-based)
    intakes.js                intake calendar rows — still client-side everywhere, see Sanity above
    image-slot.js             <image-slot> web component
  styles/                   main.scss + partials (see Styling above)
public/assets/              images referenced by the pages
```

## Replacing the repo contents

This project is a full replacement for the previous boilerplate on `main`:

```bash
cd CodeBoxx-Claude-Website
git rm -r --cached . && rm -rf $(ls -A | grep -v '^\.git$')
# unzip the export archive into this directory
npm install
cp .env.example .env
npm run dev
git add -A
git commit -m "feat: replace boilerplate with CodeBoxx'27 site (Vite + React + SCSS + Sanity)"
git push origin main
```
