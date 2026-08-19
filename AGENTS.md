# Faster UI: Agent Guide

## Purpose and shape

Faster UI is a publishable ESM React component library (`@faster-ui/react`) plus a Vite-powered
local/GitHub Pages component playground. The current public surface is assembled from
`src/index.ts`: it imports the library stylesheet and re-exports components, icons, and tokens.
React and React DOM are peer dependencies and are externalized from the library bundle. The same
`dist/` directory contains npm artifacts (JS, CSS, declarations) and the static playground site;
the npm `files` allowlist in `package.json` excludes the site's `index.html` and hashed assets.

## Where to work

- `src/components/<Component>/`: a public component's implementation, types, and barrel export.
  Follow this colocated structure when adding a component; expose it through `src/index.ts`.
- `src/icons/`: public SVG icons and their deliberately narrow `IconProps` API. Icons use
  `currentColor` and are decorative by default unless an accessible SVG label is supplied.
- `src/tokens/*.json`: source of truth for primitive and semantic design tokens.
  `src/tokens/index.ts` is the public TypeScript token API; `token-definitions.mjs` combines JSON
  files for CSS generation.
- `src/styles/globals.css`: Tailwind entry point, base styles, typography helpers, and component
  visual-state CSS. `src/styles/tokens.css` is generated token CSS.
- `src/dev.tsx` and root `index.html`: the local playground entry flow. Use it to manually inspect
  component variants and interaction states.
- `scripts/generate-css-variables.mjs`: resolves `{token.path}` references from token JSON and
  emits `src/styles/tokens.css`.
- `tailwind.config.ts`: only the semantic Tailwind token mappings currently configured.
  `vite.config.ts` builds the playground; `vite.library.config.ts` builds the library.
- `.github/workflows/ci.yml` is authoritative for CI, Pages deployment, and npm publishing.
  `README.md` is authoritative for the public API rationale and package-consumption details.

## Setup and commands

Node must satisfy `>=20.19.0` (`.nvmrc` currently contains `lts/*`). Use npm and the committed
lockfile:

```bash
npm ci                 # clean/reproducible install; use npm install for ordinary local setup
npm run dev            # Vite playground at http://127.0.0.1:5173
npm run lint           # ESLint; warnings fail
npm run lint:fix
npm run format         # Prettier writes all files
npm run format:check
npm run typecheck      # TypeScript no-emit check
npm run build:tokens   # regenerate generated token CSS after token-source changes
npm run check:tokens   # fail if generated token CSS is stale
npm run build:types    # declarations from src/index.ts
npm run build:library  # ESM library bundle and stylesheet
npm run build:pages    # static playground
npm run build          # clean dist, then tokens, types, library, and pages
```

There is no test runner or automated test suite configured. Verify behavior in the playground,
especially native, hover, active, focus-visible, disabled, loading, icon-only, and accessible-name
cases relevant to the change. The CI quality gate runs `lint`, `typecheck`, and `build`; run those
three before finishing.

## Project constraints and conventions

- TypeScript is strict, ESM-only, and uses the React JSX transform. Formatting is Prettier:
  single quotes, trailing commas, and 100-character print width. ESLint allows unused parameters
  only when their names start with `_`.
- Preserve the component pattern: native semantic elements, typed explicit props, `forwardRef`
  when the implementation needs to expose its DOM node, and an exported component/type barrel.
  Use `cn` from `src/utils/cn.ts` for conditional Tailwind classes so Tailwind conflicts merge.
- Keep visual values token-driven. Components should use semantic `faster-*` Tailwind utilities or
  `--faster-*` custom properties rather than new raw color literals. Add/update source token JSON
  first, then regenerate CSS.
- Button behavior is intentionally specific: icon-only content becomes `iconButton` when `kind` is
  omitted; `iconButton` with `mode="link"` resolves to primary; `loading` disables the native
  button and sets `aria-busy`. Icon-only buttons need `aria-label` or `aria-labelledby`.
- When adding Tailwind classes, remember its content scan is limited to `src/**/*.{ts,tsx}`.
  Add semantic mappings in `tailwind.config.ts` when a token needs a named utility.

## Generated/output files and completion

- Do **not** edit `src/styles/tokens.css` directly. Change `src/tokens/*.json` and run
  `npm run build:tokens`; commit the regenerated CSS with the source change.
- Do **not** hand-edit `dist/`; `npm run build` recreates it. Do not edit `node_modules/`.
- A typical complete change updates all affected public exports, types, token sources/generated CSS,
  and playground examples as appropriate; manually checks the relevant accessibility and visual
  states; and passes `npm run lint`, `npm run typecheck`, and `npm run build`.
