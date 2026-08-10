# CodeBoxx Website

React + SCSS front end for the CodeBoxx corporate site (Studio, Solutions, Academy, Ventures),
built with Vite and the CodeBoxx design system. Blog content is fetched at runtime from Sanity.

## Stack

- **Vite 5** + **React 18** (JSX, no TypeScript in the ported pages)
- **SCSS** for global layout and type utilities (`src/styles/`)
- **CodeBoxx Design System** — compiled bundle + token stylesheets in `src/design-system/`
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

| Route | Component | Notes |
| --- | --- | --- |
| `/` | `src/pages/Home.jsx` | Sections 01–07, WSJ and Forge 20 bands, Codi drawer, enroll drawer |
| `/blog` | `src/pages/Blog.jsx` | CodeBlog index, Sanity-backed |
| `/financing` | `src/pages/Financing.jsx` | Academy financing options |
| `/ventures` | `src/pages/Ventures.jsx` | CodeBoxx Ventures |

## Sanity

`src/lib/sanity.js` exposes `fetchCollection(type, groqTail)` and the `useSanityPosts(seed)`
hook the Blog page uses. It queries the Sanity Content API directly over `fetch` (no SDK
dependency). Without `VITE_SANITY_PROJECT_ID` the page renders the seed array, so the site
still builds and runs with no CMS connection.

Entry mapping lives in `toPost()` — adjust the field names there if the Sanity `post`
document type uses a different schema.

## Design system

`src/design-system/` is a vendored copy of the CodeBoxx design system: token stylesheets
under `tokens/`, `styles.css`, and `_ds_bundle.js`. `index.js` sets `window.React` before
loading the bundle (it is compiled to call `React.createElement`) and re-exports the
components. Because it uses top-level await, the build target is ES2022.

Do not restyle raw HTML to imitate these components — import them.

## Structure

```
src/
  App.jsx              routes
  main.jsx             entry, stylesheet imports
  components/Chrome.jsx  TopBar, NavItem, Footer
  design-system/       vendored CodeBoxx design system
  lib/sanity.js        CMS client
  lib/image-slot.js    <image-slot> web component
  pages/               Home, Blog, Financing, Ventures
  styles/              main.scss + partials
public/assets/         images referenced by the pages
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
