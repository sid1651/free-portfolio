# Project Guide

A Next.js starter using the Pages Router, React 19, Tailwind v4, and shadcn/ui. This document describes the stack, layout, and code style so any AI assistant (or developer) can extend the project consistently.

---

## Platform-Owned Files

The platform invokes these in a strict, expected shape. **Modifying or removing the listed entries breaks how the project boots, builds, and serves — the user cannot debug the result.**

### `package.json` scripts

- **Do not modify or remove** the `dev`, `build`, and `start` entries. The platform calls them as `npm run dev`, `npm run build`, and `npm run start` — changing their command or removing them breaks the dev preview and production publish.
- **You may add new scripts** (e.g. `db:migrate`, `codegen`, `seed`) when the user's request needs them. New scripts must not shadow or rename the three reserved entries.

### `next.config.ts`

- **Do not modify or remove** these platform-required flags: `productionBrowserSourceMaps: false`, `experimental.cpus`, `experimental.workerThreads`, `typescript.ignoreBuildErrors`. They keep the build inside the container's memory budget.
- **You may add new options** (e.g. `images`, `redirects`, `headers`, additional `experimental` flags) as long as the listed ones are preserved.
- **Never add an unconditional `assetPrefix` or `basePath`**, even if asked for one directly. They pin every asset URL to one absolute origin. That is invisible on the published domain, but it makes the preview and localhost load their JS chunks from the production build — where those filenames don't exist — so the page renders silently blank with only 404s in the console. When one is genuinely needed, always gate it so development is unaffected: `assetPrefix: process.env.NODE_ENV === 'production' ? '<production-origin>' : undefined`.

#### Host redirects

A canonical-host redirect (apex ↔ www, or a platform subdomain onto the custom domain) is a `redirects()` entry matched on the `host` header:

```ts
async redirects() {
    return [
        {
            source: '/:path*',
            has: [{ type: 'host', value: 'www\\.example\\.com' }],
            destination: 'https://example.com/:path*',
            permanent: true
        }
    ]
}
```

- **Escape the dots.** The `has` host value is matched as an anchored regular expression, so an unescaped `www.example.com` also matches `wwwxexample.com`.
- **Keep `source: '/:path*'` paired with `/:path*` on the destination.** That pair is what preserves the path the visitor asked for.
- **Append, don't replace.** If `redirects()` already returns entries, add to the array.
- **One direction only.** Adding both directions is an infinite loop.
- **Only redirect a host that is not the only working one.** Pointing every visitor at a hostname that is not connected takes the site offline.

### Other framework wiring — do not modify

- `tsconfig.json`, `postcss.config.*`, `next-env.d.ts`. These are fixed by the platform.

If a user's request genuinely requires changing any of the protected entries, stop and surface that to the user explicitly instead of editing silently.

---

## Stack

- **Framework:** Next.js 16 (Pages Router)
- **Bundler:** Turbopack (dev only — `build` runs the default production build)
- **Runtime:** React 19
- **Styling:** Tailwind CSS v4 + `tw-animate-css`
- **UI primitives:** shadcn/ui (style: `base-nova`, base color: `neutral`)
- **Icons:** lucide-react
- **Class utilities:** `clsx` + `tailwind-merge` (combined as `cn()` in `@/lib/utils`)
- **Language:** TypeScript

---

## Directory Layout

```
src/
├── pages/          Next.js pages (_app, _document, index, 404, 500, ...)
├── components/
│   ├── ui/         shadcn-generated components
│   ├── generals/   shared layout/utility components
│   └── landing/    page-specific composition components (create as needed)
├── lib/            small utilities (utils.ts holds the `cn` helper)
├── constants/      static configuration
├── styles/         globals.css
└── types/          shared TypeScript types
public/             static assets
```

## Imports

- **Path alias:** Use `@/` (maps to `src/`). Avoid relative paths like `../../`.
- **Type imports:** Use `import type { ... }` first, separated from value imports by a blank line.
- **Multiline imports:** When importing more than 4 items, put each on its own line. Add a blank line before the multiline import. Single-line imports come before multiline imports within the same category.

    ```tsx
    import type { ReactNode } from 'react'
    import type { SiteConfig } from '@/types'

    import { Fragment, useState } from 'react'
    import { cn } from '@/lib/utils'
    import { Layout } from '@/components/generals/layout'
    import { Seo } from '@/components/generals/seo'

    import {
        ONE,
        TWO,
        THREE,
        FOUR,
        FIVE
    } from '@/constants/site'
    ```

    There are no barrel files (`index.ts`) in this project — import each component from its own file.

- **Order:**
    1. Type imports
    2. External packages
    3. Internal modules via `@/`
    4. Constants
    5. Relative imports (avoid when possible)

---

## Icons

Use lucide-react. Lucide exports names without an `Icon` suffix:

```tsx
import { Check, ChevronDown, User } from 'lucide-react'

<Check className='size-4' />
```

Use consistent sizes across a page — typically `size-4` (16px), `size-5` (20px), or `size-6` (24px). Don't mix arbitrary sizes within the same UI.

---

## Components

### shadcn primitives

This project is configured to use shadcn for UI primitives (buttons, inputs, dialogs, etc). Add them with:

```bash
npx shadcn@latest add <name>
```

The CLI installs the component into `src/components/ui/` based on the configuration in `components.json`. Aliases: `@/components`, `@/components/ui`, `@/lib/utils`, `@/hooks`.

**Never run `shadcn init` or `shadcn create`** — the project is already initialized with its shadcn base CSS inlined into `src/styles/globals.css` (see the `/* ejected from shadcn@... */` block). Init would re-insert `@import "shadcn/tailwind.css"`, which does not resolve in this environment and breaks the build. Never add that import manually either.

After generation, adjust formatting to match the rules above (4-space indent, single quotes, no semicolons).

### Custom components

- File names: kebab-case (`hero-section.tsx`).
- Component names: PascalCase, default-exported when there's one component per file.
- Compose Tailwind class strings with `cn()` from `@/lib/utils`.
- Prefer Tailwind utilities over inline `style`. Use `style` only for runtime-computed values.

---

## Pages Router

- Pages live in `src/pages/*.tsx`.
- `_app.tsx` wraps every page (global layout/providers).
- `_document.tsx` controls the HTML shell.
- Data fetching: prefer `getStaticProps` for static content; use `getServerSideProps` only when per-request data is required.

### Built-in utilities

These ship with the boilerplate — reuse them rather than reimplementing:

- `@/components/generals/seo` — `<Seo>` component for page `<title>`, meta description, and Open Graph tags. Use it on every page. Its `ogImage` prop sets the social preview image and is empty by default; pass a 16:9 image to fill it.
- `@/components/generals/layout` — page layout wrapper.

### SEO titles

Every page title reads `{Page name} - {Site name}`. `<Seo>` builds it, so pass ONLY the page name and let the component append the rest:

```tsx
<Seo title='Pricing' />
```

renders `<title>Pricing - Site</title>`, where `Site` is whatever `siteConfig.name` holds.

- Never repeat the site name in the `title` prop. `title='Pricing | Site'` appends it a second time.
- The separator is a hyphen with a space on each side. Not a pipe, not an en dash, not a colon. `404.tsx` and `500.tsx` write their own `<title>` directly, without `<Seo>`, and use the same separator.
- The home page passes no `title` at all, so it renders the site name on its own. Never pass `title='Home'`.
- Keep the page name short, specific and in sentence case, with no trailing punctuation: `Pricing`, `About us`, `Contact`. It is the part that differs between pages, so spend the words there and never pad it with filler like `Welcome to` or `Our`.
- The site name lives in `siteConfig.name` in `src/constants/site.ts`. Change it there and every title follows. Never hardcode it at a call site.

---

## Storage (runtime object storage)

This project has built-in object storage: a private bucket fronted by a public CDN. Read and write objects at runtime with the server-only helper `@/lib/modulify/storage` — never call the storage HTTP API by hand.

```ts
import { putObject, listObjects, getObjectText } from '@/lib/modulify/storage'

// inside a Pages Router API route (src/pages/api/*.ts) or getServerSideProps:
await putObject('submissions/123.json', JSON.stringify(data))
const { files } = await listObjects('submissions/')
const raw = await getObjectText('submissions/123.json')
```

- **Server-only.** Import it only in API routes, `getServerSideProps`, or other server code. It throws in the browser and depends on `process.env.CDN_PRIVATE_KEY`, which is never exposed to the client. Never reference that variable in a client component.
- **Public reads.** Whatever you write is readable at the CDN URL returned by `putObject`/`listObjects`. Do not store secrets or personal data you would not want public at a guessable URL; for private data keep it under a dedicated prefix and read it back with `getObject` server-side rather than exposing the URL.
- **Functions:** `putObject(key, body, { contentType?, encoding? })`, `getObject(key)`, `getObjectText(key)`, `listObjects(prefix?, token?)`, `deleteObject(key)`, `deleteObjects(keys)`, `createFolder(name, path?)`, `deleteFolder(path)`, `moveObjects(keys, destination)`. Pass `encoding: 'base64'` to `putObject` for binary data.
- **Caching is automatic.** CDN objects are cached hard at the edge, but every write, overwrite, move, and delete transparently purges that object's cache, so the next fetch always returns the latest bytes. Never append cache-busting query strings (`?v=123`), just reuse the same key to update a file in place. Only when many pages hardcode an asset that must stay byte-stable for a long time (a downloadable release, a pinned dataset) should you write a new versioned key instead of overwriting.
- **Naming.** Organize under clear prefixes (`images/`, `uploads/`, `data/`), keep keys lowercase and hyphenated with no spaces, and name objects by their content rather than a timestamp so URLs stay stable and clean.

## Motion system (Selora)

This site is motion-first. Animation is not decoration here; every section is
expected to have its own entrance and its own scroll behaviour. Two libraries
carry it: **GSAP + ScrollTrigger** (`@/lib/gsap`, plugins registered once) and
**Lenis** for inertial scrolling (`@/components/generals/smooth-scroll`), wired
to the same ticker so scrubbed animations stay in sync with the wheel.

### Rules

- **Never animate in a bare `useEffect`.** Use `useGsapContext` (`@/hooks/use-gsap`),
  which scopes selector strings to the component and reverts every tween and
  ScrollTrigger on unmount. Selector strings inside it are component-local.
- **Reuse the primitives in `@/components/motion`** rather than hand-rolling
  tweens: `CharsIn`, `WordsIn`, `LinesIn`, `TrackIn`, `ScrubChars`, `Reveal`,
  `DrawLine` (`reveal.tsx`), `CurtainMedia` (`curtain-media.tsx`), `Parallax`,
  `ScrubCrop`, `ClipMedia` (`media.tsx`), `Marquee` (`marquee.tsx`).
- **Do not repeat the same entrance twice in a row.** Neighbouring sections get
  different treatments: glyph rise, word rise, line mask, tracking expansion,
  scroll-scrubbed opacity, clip curtain, horizontal pin.
- **Text splitting is rendered into the markup**, not applied at runtime, so the
  server and client produce identical HTML. `SplitChars`/`SplitWords` emit
  `.split-char` / `.split-word` nodes with an `aria-label` on the wrapper and
  `aria-hidden` on the pieces.
- **Clip boxes carry the `mask-box` class**, which adds a sliver of padding
  below the baseline (with a matching negative margin) so descenders are not
  sheared off. Travel distances in `reveal.tsx` allow for it — keep `from`
  values at 120 or above when masking.
- **Load-triggered animations read `useSiteReady()`** so hero sequences start in
  step with the page-transition curtain instead of racing it. Pass
  `trigger='load'` plus a `delay`; scroll-triggered is the default.
- **Above-the-fold scroll reveals must still fire.** `onScrollIn` in
  `reveal.tsx` checks the element's rect on creation; do not replace it with a
  bare `ScrollTrigger.create`, or content that starts in view stays hidden.
- **Initial states live in JS, not CSS**, and `_document.tsx` carries a
  `<noscript>` block that forces everything visible without JavaScript.
- Respect `prefers-reduced-motion`: Lenis is skipped and the reduced-motion
  block at the end of `globals.css` neutralises transforms and clips.

### Art direction

Palette tokens are in `globals.css` under `@theme`: `ink` `#050609`,
`acid` `#f4521c` (a scorched orange — the token name is historical, the value
is the brand accent and is the single place to change it), `acid-dim`
`#b8390e` (the same accent darkened for text on the light plates),
`bone` `#f2f2f2`, `ash` `#d9d9d9`, `smoke`, `dust`,
`graphite`, `hairline` `#292929`. Sections deliberately alternate surfaces
(ink → acid → ash → bone → white → ink) and the footer is a full acid plate.
Type is Inter (900 for display, tight negative tracking) with IBM Plex Mono for
the small technical labels — use the `label-mono` utility, or `label-cased`
where the label is sentence case like `(Project)`.

## Styling

- Tailwind utilities for everything.
- Custom CSS only in `src/styles/globals.css` and only when utilities can't express it. Append to the file — never rewrite it from scratch, and never remove the inlined `/* ejected from shadcn@... */` block or add an `@import "shadcn/tailwind.css"` line.
- shadcn theme tokens are defined as CSS variables in `globals.css` — reference them via Tailwind (`bg-background`, `text-foreground`, etc.) rather than hex/HSL literals.

### Animation

Motion needs nothing installed. Two layers ship with the project:

1. Tailwind's own animation and transition utilities (`transition-*`, `duration-*`, `delay-*`, `ease-*`, `animate-spin`, `animate-pulse`).
2. `tw-animate-css`, imported on line 2 of `globals.css`, which adds enter/exit classes: `animate-in`, `animate-out`, `fade-in`, `fade-out`, `zoom-in`, `zoom-out`, `slide-in-from-*`, `slide-out-to-*`, and `repeat-*`. Combine them with the duration/delay/ease utilities above.

```tsx
<div className='animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out'>
```

For custom motion, append your own `@keyframes` to the end of `globals.css` — append, never rewrite the file. Reach for an animation library only when the design genuinely needs orchestration, physics, or timeline control that CSS can't express.

Respect `prefers-reduced-motion` for anything that moves more than a few pixels.

### Fonts

Fonts are wired across two files that must agree. Changing one without the other is the most common way a font silently does not apply.

1. `src/pages/_app.tsx` loads the faces with `next/font` and writes them to `:root` as `--font-app-sans`, `--font-app-mono` and `--font-app-heading`.
2. `src/styles/globals.css` maps those onto the Tailwind tokens inside `@theme inline`, which is what makes the `font-sans`, `font-mono` and `font-heading` utilities resolve.

To change the site's typeface, swap the loader in `_app.tsx` and keep the same `--font-app-*` names. `globals.css` needs no change at all:

```tsx
import { Inter, JetBrains_Mono } from 'next/font/google'

const sans = Inter({
    subsets: ['latin']
})

const mono = JetBrains_Mono({
    subsets: ['latin']
})
```

For a separate display face, load it as well, point `--font-app-heading` at it, and use `font-heading` on headings.

Rules that keep this working:

- **Font tokens belong in `@theme inline`, never plain `@theme`.** Plain `@theme` emits the token at `:root` and resolves its `var()` there, so a face declared anywhere below `:root` resolves to nothing and every element silently falls back to the browser default serif. `@theme inline` resolves at the element that uses the utility instead.
- **Never write a self-referential token** such as `--font-sans: var(--font-sans)`. That is a CSS cycle and makes the token invalid at computed-value time.
- **Keep the fallback stack inside every token** (`var(--font-app-sans, ui-sans-serif, system-ui, sans-serif)`), so a renamed or missing variable degrades to a system font instead of disappearing.
- **Declare the faces at `:root`, not on a wrapper element.** shadcn overlays (dialog, dropdown, select, tooltip) portal to `document.body`, which sits outside any wrapper and would otherwise lose the font. If you ever do declare a face on an element instead, put `font-sans` on that same element so the token still resolves there. The wrapper in `_app.tsx` already carries it for exactly this reason.
- **Never append `@import url('https://fonts.googleapis.com/...')` to `globals.css`.** CSS requires every `@import` to precede all other rules, so one added at the bottom is dropped without warning. Use `next/font` or an `@fontsource` package.

---

## TypeScript

- Keep types close to their use. Put cross-cutting shared types in `src/types/index.ts`.
- For component props, declare a local `interface ComponentProps { ... }` at the top of the file.
- Prefer `unknown` + narrowing over `any`.

---

This file is intended to evolve. If you (the assistant or developer) introduce a new convention, update this document so future contributors stay aligned.