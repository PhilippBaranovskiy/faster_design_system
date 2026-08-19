# Faster UI: Agent Guide

## Purpose and current shape

Faster UI is a publishable ESM React library (`@faster-ui/react`) plus Vite and Storybook
development surfaces. The public package entry is `src/index.ts`: it imports the library
stylesheet and re-exports components, icons, and tokens. React and React DOM are peer
dependencies and are externalized from the library bundle.

The current public API consists of `Button`, `PlusIcon`, `ArrowRightIcon`, and the token exports
from `src/tokens/index.ts`. The root Vite page is a landing page that links to the Vite playground
and the static Storybook build.

`dist/` is shared build output:

- production library artifacts: `index.js`, `index.d.ts`, `style.css`, and declaration folders;
- Vite pages: `index.html`, `playground/index.html`, and `assets/`; and
- Storybook: `storybook/` after `npm run build` or `npm run build:storybook`.

The `files` allowlist in `package.json` includes only publishable library artifacts, declarations,
`README.md`, and `LICENSE`; it excludes the Vite pages, assets, and Storybook.

## Where to work

- `src/components/<Component>/`: public component implementation, types, tests, stories, and
  barrel export. Follow this colocated pattern and export the component from `src/index.ts`.
- `src/icons/`: public SVG icons and their deliberately narrow `IconProps` API. Icons use
  `currentColor` and are decorative unless `aria-label` or `aria-labelledby` is supplied.
- `src/tokens/*.json`: source of truth for primitive and semantic design tokens.
  `src/tokens/token-definitions.mjs` combines the JSON sources for CSS generation;
  `src/tokens/index.ts` resolves references for the public TypeScript token API.
- `src/styles/globals.css`: Tailwind entry point, global baseline, typography helpers, and Button
  state CSS. `src/styles/tokens.css` is generated token CSS.
- `src/landing.tsx` and root `index.html`: Vite's root landing page.
  `src/dev.tsx` and `playground/index.html`: the Vite component playground.
- `.storybook/`: Storybook setup. Stories use `src/**/*.stories.@(ts|tsx)` and import the global
  stylesheet through `.storybook/preview.ts`.
- `cypress/component/`: Cypress component specs. `cypress/support/component.ts` mounts components
  and imports global styles.
- `scripts/generate-css-variables.mjs`: resolves `{token.path}` references and emits
  `src/styles/tokens.css`.
- `tailwind.config.ts`: all configured `faster-*` Tailwind color utilities. Its content scan
  covers `src/**/*.{ts,tsx}` only.
- `vite.config.ts`: builds the root landing page and playground; `vite.library.config.ts` builds
  the ESM library.
- `.github/workflows/ci.yml`: authoritative source for CI, npm publishing, and GitHub Pages
  deployment. `README.md` is authoritative for public usage and package-consumption guidance.

## Setup and commands

Node must satisfy `>=20.19.0` (`.nvmrc` currently contains `lts/*`). Use npm and the committed
lockfile:

```bash
npm ci                         # clean, reproducible install
npm run dev                    # Vite landing page at http://127.0.0.1:5173
npm run storybook              # Storybook development server at http://127.0.0.1:6006
npm run lint                   # ESLint; warnings fail
npm run lint:fix               # apply ESLint fixes
npm run format                 # Prettier writes all files
npm run format:check           # verify Prettier formatting
npm run typecheck              # main TypeScript no-emit check
npm run typecheck:component    # Cypress component-test type check
npm run test:unit              # Jest unit and accessibility tests
npm run test:component         # Cypress component tests in Electron
npm run test                   # all quality checks except build artifacts
npm run build:tokens           # regenerate generated token CSS
npm run check:tokens           # fail when generated token CSS is stale
npm run build:types            # declarations from src/index.ts
npm run build:library          # ESM library bundle and stylesheet
npm run build:pages            # Vite landing page and playground
npm run build:production       # clean, tokens, declarations, library, and Vite pages
npm run build:storybook        # static Storybook in dist/storybook
npm run build                  # production build plus Storybook
```

Use `npm install` for an ordinary local dependency update. Inspect relevant states in the Vite
playground or Storybook as well as running automated tests. CI separately runs linting, both type
checks, Jest, Cypress component tests, `build:production`, and `build:storybook`.

## Project constraints and conventions

- TypeScript is strict, ESM-only, and uses the React JSX transform. Formatting is Prettier:
  single quotes, trailing commas, and a 100-character print width. ESLint permits unused
  parameters only when their names start with `_`.
- Preserve the component pattern: native semantic elements, explicit typed props, `forwardRef`
  when exposing a DOM node, colocated barrel exports, and public exports through `src/index.ts`.
  Use `cn` from `src/utils/cn.ts` for conditional Tailwind classes so conflicts merge correctly.
- Keep visual values token-driven. Use semantic `faster-*` Tailwind utilities or `--faster-*`
  custom properties instead of new raw color literals. Add or update source token JSON first,
  then regenerate CSS. Add Tailwind mappings to `tailwind.config.ts` when a token needs a named
  utility.
- Button behavior is intentional: it accepts one icon slot only; icon-only content becomes
  `iconButton` when `kind` is omitted; `iconButton` with `mode="link"` resolves to primary; and
  `loading` disables the native button and sets `aria-busy`. Icon-only buttons require
  `aria-label` or `aria-labelledby`.
- Icons are decorative by default. Preserve their narrow prop API and `focusable="false"`
  behavior when changing them.
- Keep the root landing page's relative links working in local Vite and the `base: './'` static
  build. The Storybook build also uses a relative base for GitHub Pages.

## Generated files, output, and completion

- Do **not** edit `src/styles/tokens.css` directly. Change `src/tokens/*.json`, run
  `npm run build:tokens`, and commit the regenerated CSS with the source change.
- Do **not** hand-edit `dist/`; `npm run build:production` recreates library and Vite-page output,
  and `npm run build` additionally recreates Storybook. Do not edit `node_modules/`.
- When public behavior changes, update affected exports, types, unit/Cypress tests, Storybook
  stories, Vite playground examples, and README documentation as appropriate.
- A complete implementation normally passes `npm run lint`, `npm run typecheck`,
  `npm run test`, and `npm run build`; manually inspect relevant accessibility and visual states.
