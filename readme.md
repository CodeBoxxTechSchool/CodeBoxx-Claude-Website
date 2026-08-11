# CodeBoxx Website

React + SCSS front end for the CodeBoxx corporate site (Studio, Solutions, Academy, Ventures),
built with Vite, react-bootstrap and a brand-themed SCSS system. Blog content is fetched at
runtime from Sanity.

## Stack

- **Vite 5** + **React 18** (JSX, no TypeScript in the ported pages)
- **react-bootstrap** + **Bootstrap 5** for every component (buttons, forms, badges, the Codi
  and Enroll drawers), themed via Sass variable overrides — no vendored component bundle
- **SCSS** for all styling, no inline styles (`src/styles/`)
- **react-router-dom** for the four routes
- **Sanity** CMS, fetched at runtime (`src/lib/sanity.js`)

## Getting started

```bash
git clone git@github.com:CodeBoxxTechSchool/CodeBoxx-Claude-Website.git
cd CodeBoxx-Claude-Website
npm install
cp .env.example .env   # fill in the Sanity values
npm run dev
```

`npm run build` writes the production bundle to `dist/`; `npm run preview` serves it.

## Routes

| Route        | Component                 | Notes                                                              |
| ------------ | ------------------------- | ------------------------------------------------------------------ |
| `/`          | `src/pages/Home.jsx`      | Sections 01–07, WSJ and Forge 20 bands, Codi drawer, enroll drawer |
| `/blog`      | `src/pages/Blog.jsx`      | CodeBlog index, Sanity-backed                                      |
| `/financing` | `src/pages/Financing.jsx` | Academy financing options                                          |
| `/ventures`  | `src/pages/Ventures.jsx`  | CodeBoxx Ventures                                                  |

## Sanity

`src/lib/sanity.js` exposes `fetchCollection(type, groqTail)` plus one hook per content
type. All of them query the Sanity Content API directly over `fetch` (no SDK dependency)
and fall back to a hardcoded seed array/object when `VITE_SANITY_PROJECT_ID` isn't set, so
the site always builds and runs with no CMS connection. Entry mapping lives in each `toX()`
function — adjust field names there if a document type's schema differs.

Project: `zagi8xr3` ("CodeBoxxWeb", dataset `production`). The dataset allows public reads,
so `VITE_SANITY_TOKEN` can stay blank — only set it if the dataset is ever made private.

### Reaching the content dashboard

The editing dashboard (Sanity Studio) lives in its own project, not in this repo:
`/Users/minuitcinq/projects/codeboxx-website-studio`, already attached to project `zagi8xr3`
with the four schema types below.

- **Locally**: `cd` into that folder, `npm run dev`, open `http://localhost:3333`.
- **Deployed** (the real day-to-day dashboard, reachable from anywhere): **https://codeboxxweb.sanity.studio/**
- **Project settings, API tokens, dataset management** (not content editing):
  https://www.sanity.io/manage/project/zagi8xr3

Document types expected in the Sanity Studio project (created separately — this repo only
consumes the API, it doesn't scaffold a Studio):

| Document type  | Fields                                                                                                   | Consumed by                                                                                                                           |
| -------------- | -------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `post`         | `title`, `category`, `author`, `publishedAt`, `excerpt`, `url`                                           | `useSanityPosts` — Blog page                                                                                                          |
| `teamMember`   | `name`, `role`, `linkedin` (url), `photo` (image), `group` (`"studio"` \| `"academy"`), `order` (number) | `useSanityTeam(group, seed)` — Studio team (`#codeboxx .person`) and Academy team (`#academy .person`), same type filtered by `group` |
| `partnerLogo`  | `name`, `logo` (image), `order` (number)                                                                 | `useSanityLogos(seed)` — the `.client-slider` partner logos; however many documents exist is however many slides show                 |
| `cohortIntake` | `program` (`"fsd"` \| `"aidev"`), `date`, `location`, `status` (`"Open"` \| `"Waitlist"` \| `"Planned"`) | `useIntakes(seed)` in `src/lib/intakes.js` — the `#intake` calendar rows                                                              |

`useIntakes` lives in its own file, not `sanity.js`, on purpose: the intake calendar is a
placeholder for a real admissions API later, and `IntakeCalendar` only ever imports
`useIntakes` and expects a `{ fsd: [...], aidev: [...] }` return shape — swapping the data
source later means rewriting `src/lib/intakes.js` only, with no changes to `Home.jsx`.

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

## Structure

```
src/
  App.jsx                 routes
  main.jsx                entry, stylesheet import
  components/
    Chrome.jsx             TopBar, NavItem, Footer (react-bootstrap Navbar)
    Logo.jsx, Avatar.jsx    brand components with no Bootstrap equivalent
  lib/sanity.js            CMS client
  lib/intakes.js           intake calendar rows (temporary Sanity seam, see Sanity above)
  lib/image-slot.js        <image-slot> web component
  pages/                   Home, Blog, Financing, Ventures
  styles/                  main.scss + partials (see Styling above)
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
